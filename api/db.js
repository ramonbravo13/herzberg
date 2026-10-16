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

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        console.error('Error de base de datos en login:', error);
        return res.status(500).json({ error: 'Error de conexión con la base de datos. Verifica que el proyecto de Supabase esté activo.' });
      }
      if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
      
      const { password_hash, ...userWithoutPassword } = user;
      
      // Emit JWT and set as HTTPOnly Cookie
      const token = jwt.sign({ 
        id: user.id, 
        role: user.role, 
        organization_id: user.organization_id,
        allowed_organizations: user.allowed_organizations || []
      }, jwtSecret, { expiresIn: '8h' });
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
      if (!organizationId) return res.status(400).json({ error: 'ID de organización no proporcionado.' });

      const { data: org, error: orgErr } = await supabase
        .from('organizations')
        .select('current_period, periods, subscription_end_date')
        .eq('id', organizationId)
        .single();

      if (orgErr || !org) return res.status(404).json({ error: 'Organización no encontrada.' });

      // Zero-Trust check: Prevent submissions to expired organizations
      if (org.subscription_end_date && new Date(org.subscription_end_date) < new Date()) {
        return res.status(403).json({ error: 'El periodo de suscripción de esta organización ha finalizado.' });
      }

      const period = org.current_period || 1;

      // Clean zone and resolve zone alias if applicable (case-insensitive lookup)
      let effectiveZone = zone ? String(zone).trim().replace(/\s+/g, ' ') : null;
      if (effectiveZone && org?.periods) {
        const periodObj = org.periods.find(p => p.id === period) || org.periods[0];
        if (periodObj?.zone_aliases) {
          const lowerZone = effectiveZone.toLowerCase();
          for (const [aliasKey, targetZone] of Object.entries(periodObj.zone_aliases)) {
            if (aliasKey.toLowerCase() === lowerZone) {
              effectiveZone = targetZone;
              break;
            }
          }
        }
      }

      // Ensure results.departamento matches effectiveZone if defined
      const updatedResults = results ? { ...results } : {};
      if (effectiveZone) {
        updatedResults.departamento = effectiveZone;
      }

      const { data, error } = await supabase.from('evaluations').insert([{
        organization_id: organizationId, period, participant_id: participantId, zone: effectiveZone, results: updatedResults
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

    if (action === 'saveDemoRequest') {
      const { requestData } = payload;
      const { data, error } = await supabase.from('demo_requests').insert([requestData]).select().single();
      if (error) {
        console.error('Error saving demo request:', error);
        return res.status(500).json({ error: 'No se pudo procesar la solicitud' });
      }
      return res.status(200).json(data);
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
        let query = supabase.from('organizations').select('*').order('created_at', { ascending: false });
        
        if (decodedAdmin.role === 'empresarial') {
           query = query.eq('id', decodedAdmin.organization_id);
        } else if (decodedAdmin.role === 'corporativo') {
           const allowed = decodedAdmin.allowed_organizations || [];
           if (allowed.length === 0) return res.status(200).json([]);
           query = query.in('id', allowed);
        }
        
        const { data, error } = await query;
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
        const { id, updates } = payload;
        
        // Custom RBAC for updateOrganization
        if (decodedAdmin.role !== 'admin') {
          const isEmpresarialOwner = decodedAdmin.role === 'empresarial' && decodedAdmin.organization_id === id;
          const isCorporativoAllowed = decodedAdmin.role === 'corporativo' && (decodedAdmin.allowed_organizations || []).includes(id);
          
          if (isEmpresarialOwner || isCorporativoAllowed) {
            const allowedKeys = ['zones', 'expected_headcount', 'zone_headcounts'];
            const updateKeys = Object.keys(updates);
            if (!updateKeys.every(k => allowedKeys.includes(k))) {
               throw new Error('Acceso denegado. Solo puedes modificar zonas y metas.');
            }
          } else {
             throw new Error('Acceso denegado. Se requiere permisos sobre esta organización.');
          }
        }

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

        // Cleanly delete all associated evaluations first to prevent orphaned records in corporate analytics
        await supabase.from('evaluations').delete().eq('organization_id', id);

        const { error } = await supabase.from('organizations').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }

      case 'restartOrganizationPeriod': {
        const { orgId } = payload;
        if (decodedAdmin.role !== 'admin') {
           const isEmpresarialOwner = decodedAdmin.role === 'empresarial' && decodedAdmin.organization_id === orgId;
           const isCorporativoAllowed = decodedAdmin.role === 'corporativo' && (decodedAdmin.allowed_organizations || []).includes(orgId);
           
           if (!isEmpresarialOwner && !isCorporativoAllowed) {
             throw new Error('Acceso denegado. No tienes permiso para reiniciar esta organización.');
           }
        }
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

      case 'renameZone': {
        const { organizationId, oldZone, newZone } = payload;
        if (!organizationId || !oldZone || !newZone) {
          return res.status(400).json({ error: 'Faltan parámetros requeridos: organizationId, oldZone y newZone son obligatorios.' });
        }

        const trimmedOld = String(oldZone).trim().replace(/\s+/g, ' ');
        const trimmedNew = String(newZone).trim().replace(/\s+/g, ' ');

        if (!trimmedOld || !trimmedNew) {
          return res.status(400).json({ error: 'El nombre de la zona no puede estar vacío.' });
        }

        const RESERVED_NAMES = ['all', 'todas', 'todos', 'general', 'sin asignar'];
        if (RESERVED_NAMES.includes(trimmedNew.toLowerCase())) {
          return res.status(400).json({ error: `El nombre "${trimmedNew}" está reservado por el sistema. Por favor utiliza otro nombre.` });
        }

        if (trimmedOld.toLowerCase() === trimmedNew.toLowerCase()) {
          const { data: currentOrg } = await supabase.from('organizations').select('*').eq('id', organizationId).single();
          return res.status(200).json({
            ...currentOrg,
            subscriptionEndDate: currentOrg.subscription_end_date,
            currentPeriod: currentOrg.current_period
          });
        }

        // RBAC check
        if (decodedAdmin.role !== 'admin') {
          const isEmpresarialOwner = decodedAdmin.role === 'empresarial' && decodedAdmin.organization_id === organizationId;
          const isCorporativoAllowed = decodedAdmin.role === 'corporativo' && (decodedAdmin.allowed_organizations || []).includes(organizationId);

          if (!isEmpresarialOwner && !isCorporativoAllowed) {
            throw new Error('Acceso denegado. No tienes permiso para editar esta organización.');
          }
        }

        // 1. Fetch current organization
        const { data: org, error: fetchOrgErr } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizationId)
          .single();

        if (fetchOrgErr || !org) {
          return res.status(404).json({ error: 'Organización no encontrada.' });
        }

        const currentZones = org.zones || [];
        const isDuplicate = currentZones.some(
          z => z.toLowerCase() === trimmedNew.toLowerCase() && z.toLowerCase() !== trimmedOld.toLowerCase()
        );
        if (isDuplicate) {
          return res.status(400).json({ error: `La zona "${trimmedNew}" ya existe (no se permite duplicar nombres aún con distintas mayúsculas o minúsculas).` });
        }

        // 2. Update zones array
        const updatedZones = currentZones.map(z => z === trimmedOld ? trimmedNew : z);

        // 3. Update zone_headcounts
        const updatedHeadcounts = { ...(org.zone_headcounts || {}) };
        if (updatedHeadcounts[trimmedOld] !== undefined) {
          updatedHeadcounts[trimmedNew] = updatedHeadcounts[trimmedOld];
          delete updatedHeadcounts[trimmedOld];
        }

        // 4. Update zone_aliases in periods array so old shared links resolve to newZone
        let periods = org.periods || [];
        const currentPeriodId = org.current_period || 1;
        const currentIdx = periods.findIndex(p => p.id === currentPeriodId);
        if (currentIdx > -1) {
          const periodObj = periods[currentIdx];
          const aliases = { ...(periodObj.zone_aliases || {}) };
          aliases[trimmedOld] = trimmedNew;
          for (const key in aliases) {
            if (aliases[key] === trimmedOld) {
              aliases[key] = trimmedNew;
            }
          }
          periods[currentIdx] = { ...periodObj, zone_aliases: aliases };
        }

        // 5. Update organization in DB
        const { data: updatedOrg, error: orgUpdateErr } = await supabase
          .from('organizations')
          .update({
            zones: updatedZones,
            zone_headcounts: updatedHeadcounts,
            periods: periods
          })
          .eq('id', organizationId)
          .select()
          .single();

        if (orgUpdateErr) throw orgUpdateErr;

        // 6. Update evaluations table:
        // Update zone column
        const { data: updatedEvals, error: evalsErr } = await supabase
          .from('evaluations')
          .update({ zone: trimmedNew })
          .eq('organization_id', organizationId)
          .eq('zone', trimmedOld)
          .select('id, results');

        if (evalsErr) {
          console.error('Error actualizando zone en evaluations:', evalsErr);
        }

        // Also ensure results.departamento is updated if it was storing the old zone
        if (updatedEvals && updatedEvals.length > 0) {
          for (const ev of updatedEvals) {
            if (ev.results && ev.results.departamento === trimmedOld) {
              await supabase
                .from('evaluations')
                .update({ results: { ...ev.results, departamento: trimmedNew } })
                .eq('id', ev.id);
            }
          }
        }

        return res.status(200).json({
          ...updatedOrg,
          subscriptionEndDate: updatedOrg.subscription_end_date,
          currentPeriod: updatedOrg.current_period
        });
      }

      case 'deleteZone': {
        const { organizationId, zone } = payload;
        if (!organizationId || !zone) {
          return res.status(400).json({ error: 'Faltan parámetros requeridos: organizationId y zone son obligatorios.' });
        }

        // RBAC check
        if (decodedAdmin.role !== 'admin') {
          const isEmpresarialOwner = decodedAdmin.role === 'empresarial' && decodedAdmin.organization_id === organizationId;
          const isCorporativoAllowed = decodedAdmin.role === 'corporativo' && (decodedAdmin.allowed_organizations || []).includes(organizationId);

          if (!isEmpresarialOwner && !isCorporativoAllowed) {
            throw new Error('Acceso denegado. No tienes permiso para editar esta organización.');
          }
        }

        const { data: org, error: fetchOrgErr } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizationId)
          .single();

        if (fetchOrgErr || !org) {
          return res.status(404).json({ error: 'Organización no encontrada.' });
        }

        const updatedZones = (org.zones || []).filter(z => z !== zone);
        const updatedHeadcounts = { ...(org.zone_headcounts || {}) };
        if (updatedHeadcounts[zone] !== undefined) {
          delete updatedHeadcounts[zone];
        }

        const { data: updatedOrg, error: orgUpdateErr } = await supabase
          .from('organizations')
          .update({
            zones: updatedZones,
            zone_headcounts: updatedHeadcounts
          })
          .eq('id', organizationId)
          .select()
          .single();

        if (orgUpdateErr) throw orgUpdateErr;

        return res.status(200).json({
          ...updatedOrg,
          subscriptionEndDate: updatedOrg.subscription_end_date,
          currentPeriod: updatedOrg.current_period
        });
      }

      case 'getOrganizationById': {
        const { id } = payload;
        if (decodedAdmin.role === 'empresarial' && decodedAdmin.organization_id !== id) {
           throw new Error('Acceso denegado');
        }
        if (decodedAdmin.role === 'corporativo' && !(decodedAdmin.allowed_organizations || []).includes(id)) {
           throw new Error('Acceso denegado');
        }
        
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
        const { id, updates } = payload;
        if (decodedAdmin.role !== 'admin' && decodedAdmin.id !== id) {
           throw new Error('Acceso denegado. Se requiere rol de administrador o ser el propietario del perfil.');
        }
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
        if (decodedAdmin.role === 'empresarial' && decodedAdmin.organization_id !== organizationId) {
           throw new Error('Acceso denegado');
        }
        if (decodedAdmin.role === 'corporativo' && !(decodedAdmin.allowed_organizations || []).includes(organizationId)) {
           throw new Error('Acceso denegado');
        }
        
        const { data, error } = await supabase.from('evaluations').select('*').eq('organization_id', organizationId);
        if (error) throw error;
        return res.status(200).json(data);
      }

      case 'getAllEvaluations': {
        if (decodedAdmin.role !== 'admin' && decodedAdmin.role !== 'corporativo') {
           throw new Error('Acceso denegado. Se requiere rol de administrador o corporativo.');
        }
        const { data, error } = await supabase.from('evaluations').select('*');
        if (error) throw error;
        return res.status(200).json(data);
      }

      case 'getDemoRequests': {
        requireAdmin();
        const { data, error } = await supabase.from('demo_requests').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
      }

      default:
        return res.status(400).json({ error: 'Acción no válida' });
    }
  } catch (error) {
    console.error('API /db Error:', error);
    return res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}
