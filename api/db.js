import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const url = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''; 
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';

const supabase = createClient(url, serviceRoleKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { action, payload } = req.body;

    // ----- RUTAS PÚBLICAS -----
    if (action === 'login') {
      const { email, password } = payload;
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (error || !user) return res.status(401).json({ error: 'Credenciales inválidas' });
      
      const { password_hash, ...userWithoutPassword } = user;
      
      // Emit JWT and set as HTTPOnly Cookie
      const token = jwt.sign({ id: user.id, role: user.role, organization_id: user.organization_id }, jwtSecret, { expiresIn: '8h' });
      const isProd = process.env.NODE_ENV === 'production';
      res.setHeader('Set-Cookie', `herzberg_admin_token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Strict${isProd ? '; Secure' : ''}`);

      return res.status(200).json(userWithoutPassword);
    }

    if (action === 'logout') {
      res.setHeader('Set-Cookie', `herzberg_admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`);
      return res.status(200).json({ success: true });
    }

    if (action === 'getOrganizationByToken') {
      const { token } = payload;
      const { data, error } = await supabase.from('organizations').select('*').eq('evaluation_token', token).single();
      if (error) return res.status(404).json({ error: 'No encontrado' });
      return res.status(200).json({ ...data, currentPeriod: data.current_period });
    }

    if (action === 'saveEvaluation') {
      const { organizationId, results, zone } = payload;
      const cookieHeader = req.headers.cookie || '';
      const match = cookieHeader.match(/herzberg_participant_id=([^;]+)/);
      const participantId = match ? match[1] : null;

      if (!participantId) return res.status(401).json({ error: 'Sesión no inicializada. Por favor, recarga la página.' });

      const { data: org } = await supabase.from('organizations').select('current_period').eq('id', organizationId).single();
      const period = org ? (org.current_period || 1) : 1;

      const { data, error } = await supabase.from('evaluations').insert([{
        organization_id: organizationId, period, participant_id: participantId, zone, results
      }]).select().single();

      if (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'Ya has completado esta encuesta en el periodo actual.' });
        throw error;
      }
      return res.status(200).json(data);
    }

    if (action === 'checkParticipantCompletion') {
      const { organizationId, period } = payload;
      const cookieHeader = req.headers.cookie || '';
      const match = cookieHeader.match(/herzberg_participant_id=([^;]+)/);
      const participantId = match ? match[1] : null;

      if (!participantId) return res.status(200).json({ completed: false });
      
      const { data, error } = await supabase.from('evaluations').select('id').eq('organization_id', organizationId).eq('period', period).eq('participant_id', participantId);
      if (error) return res.status(200).json({ completed: false });
      return res.status(200).json({ completed: data && data.length > 0 });
    }


    // ----- RUTAS PROTEGIDAS (Requieren JWT) -----
    const cookieHeader = req.headers.cookie || '';
    const adminTokenMatch = cookieHeader.match(/herzberg_admin_token=([^;]+)/);
    const adminToken = adminTokenMatch ? adminTokenMatch[1] : null;

    if (!adminToken) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    let decodedAdmin;
    try {
      decodedAdmin = jwt.verify(adminToken, jwtSecret);
    } catch (err) {
      return res.status(401).json({ error: 'Sesión expirada o inválida' });
    }

    // RBAC helper
    const requireAdmin = () => {
      if (decodedAdmin.role !== 'admin') throw new Error('Acceso denegado. Se requiere rol de administrador.');
    };

    switch (action) {
      case 'getOrganizations': {
        const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        const mapped = data.map(org => ({
          ...org, subscriptionEndDate: org.subscription_end_date, currentPeriod: org.current_period, expected_headcount: org.expected_headcount, createdAt: org.created_at
        }));
        return res.status(200).json(mapped);
      }

      case 'createOrganization': {
        requireAdmin();
        const { name, subscriptionEndDate } = payload;
        const { data, error } = await supabase.from('organizations').insert([{
          name, subscription_end_date: subscriptionEndDate, current_period: 1, periods: [{ id: 1, name: 'Periodo 1', startDate: new Date().toISOString(), endDate: null }]
        }]).select().single();
        if (error) throw error;
        return res.status(200).json({ ...data, subscriptionEndDate: data.subscription_end_date, currentPeriod: data.current_period });
      }

      case 'updateOrganization': {
        requireAdmin();
        const { id, updates } = payload;
        const mappedUpdates = { ...updates };
        if (updates.subscriptionEndDate !== undefined) mappedUpdates.subscription_end_date = updates.subscriptionEndDate;
        if (updates.currentPeriod !== undefined) mappedUpdates.current_period = updates.currentPeriod;
        delete mappedUpdates.subscriptionEndDate;
        delete mappedUpdates.currentPeriod;
        delete mappedUpdates.createdAt;

        const { data, error } = await supabase.from('organizations').update(mappedUpdates).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json({ ...data, subscriptionEndDate: data.subscription_end_date, currentPeriod: data.current_period });
      }

      case 'deleteOrganization': {
        requireAdmin();
        const { id } = payload;
        const { data: users } = await supabase.from('profiles').select('id').eq('organization_id', id);
        if (users && users.length > 0) return res.status(400).json({ error: 'No se puede eliminar la organización porque tiene usuarios asignados.' });
        const { error } = await supabase.from('organizations').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      case 'restartOrganizationPeriod': {
        requireAdmin();
        const { orgId } = payload;
        const { data: org } = await supabase.from('organizations').select('*').eq('id', orgId).single();
        let periods = org.periods || [];
        const currentPeriodId = org.current_period || 1;
        const currentIdx = periods.findIndex(p => p.id === currentPeriodId);
        if (currentIdx > -1) periods[currentIdx].endDate = new Date().toISOString();
        const newPeriodId = currentPeriodId + 1;
        periods.push({ id: newPeriodId, name: `Periodo ${newPeriodId}`, startDate: new Date().toISOString(), endDate: null });
        const { data, error } = await supabase.from('organizations').update({ current_period: newPeriodId, periods }).eq('id', orgId).select().single();
        if (error) throw error;
        return res.status(200).json({ ...data, currentPeriod: data.current_period });
      }

      case 'getOrganizationById': {
        const { id } = payload;
        const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
        if (error) return res.status(404).json({ error: 'No encontrado' });
        return res.status(200).json({ ...data, expected_headcount: data.expected_headcount, zone_headcounts: data.zone_headcounts, currentPeriod: data.current_period });
      }

      case 'getUsers': {
        requireAdmin();
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data.map(({ password_hash, ...user }) => user));
      }

      case 'createUser': {
        requireAdmin();
        const { userData } = payload;
        const { password, requiresPasswordChange, ...rest } = userData;
        const { data, error } = await supabase.from('profiles').insert([{ ...rest, password_hash: password, requires_password_change: requiresPasswordChange !== undefined ? requiresPasswordChange : true }]).select().single();
        if (error) {
          if (error.code === '23505') return res.status(400).json({ error: 'El correo ya está registrado' });
          throw error;
        }
        const { password_hash, ...userWithoutPassword } = data;
        return res.status(200).json(userWithoutPassword);
      }

      case 'updateUser': {
        requireAdmin();
        const { id, updates } = payload;
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
        if (error) throw error;
        const { password_hash, ...userWithoutPassword } = data;
        return res.status(200).json(userWithoutPassword);
      }

      case 'deleteUser': {
        requireAdmin();
        const { id } = payload;
        const { data: user } = await supabase.from('profiles').select('email').eq('id', id).single();
        if (user && user.email === 'admin@herzberg.com') return res.status(400).json({ error: 'No puedes eliminar al administrador principal' });
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      case 'updateUserPassword': {
        const { userId, newPassword } = payload;
        if (decodedAdmin.role !== 'admin' && decodedAdmin.id !== userId) throw new Error('Acceso denegado');
        const { error } = await supabase.from('profiles').update({ password_hash: newPassword }).eq('id', userId);
        if (error) return res.status(404).json({ error: 'Usuario no encontrado' });
        return res.status(200).json({ success: true });
      }

      case 'confirmPasswordChange': {
        const { userId, newPassword } = payload;
        if (decodedAdmin.role !== 'admin' && decodedAdmin.id !== userId) throw new Error('Acceso denegado');
        const { data, error } = await supabase.from('profiles').update({ password_hash: newPassword, requires_password_change: false }).eq('id', userId).select().single();
        if (error) return res.status(404).json({ error: 'Usuario no encontrado' });
        const { password_hash, ...userWithoutPassword } = data;
        return res.status(200).json(userWithoutPassword);
      }

      case 'getEvaluationsByOrganization': {
        const { organizationId } = payload;
        const { data, error } = await supabase.from('evaluations').select('*').eq('organization_id', organizationId);
        if (error) throw error;
        const mapped = data.map(e => ({ ...e.results, period: e.period || 1, zone: e.zone || null, departamento: e.zone || e.results?.departamento || "Sin Asignar" }));
        return res.status(200).json(mapped);
      }

      case 'getAllEvaluations': {
        requireAdmin();
        const { data, error } = await supabase.from('evaluations').select('*');
        if (error) throw error;
        const mapped = data.map(e => ({ ...e.results, period: e.period || 1, organization_id: e.organization_id, zone: e.zone || null, departamento: e.zone || e.results?.departamento || "Sin Asignar" }));
        return res.status(200).json(mapped);
      }

      default:
        return res.status(400).json({ error: 'Acción no válida' });
    }
  } catch (error) {
    console.error('API /db Error:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
