import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Plus, User, Shield, Briefcase } from 'lucide-react';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('empresarial');
  const [organizationId, setOrganizationId] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const fetchedUsers = await dbService.getUsers();
    const fetchedOrgs = await dbService.getOrganizations();
    setUsers(fetchedUsers);
    setOrganizations(fetchedOrgs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (role === 'empresarial' && !organizationId) {
      setError('Debes seleccionar una organización para el usuario empresarial.');
      return;
    }

    try {
      // Create user with generic password for now
      await dbService.createUser({
        email,
        name,
        role,
        organization_id: role === 'empresarial' ? organizationId : null,
        password: 'password123' // Contraseña genérica por defecto
      });
      
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setRole('empresarial');
    setOrganizationId('');
    setError('');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Shield size={12}/> Admin</span>;
      case 'corporativo':
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><Briefcase size={12}/> Corporativo</span>;
      default:
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><User size={12}/> Empresarial</span>;
    }
  };

  const getOrgName = (orgId) => {
    if (!orgId) return '-';
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'Desconocida';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>
          <p className="text-slate-600">Gestiona los accesos a los portales Dashboard y Admin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Nombre / Email</th>
              <th className="p-4 font-semibold text-slate-700">Rol</th>
              <th className="p-4 font-semibold text-slate-700">Organización Asignada</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-medium text-slate-800">{user.name || 'Sin nombre'}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                </td>
                <td className="p-4">
                  {getRoleBadge(user.role)}
                </td>
                <td className="p-4 text-slate-600">
                  {getOrgName(user.organization_id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Nuevo Usuario</h2>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>}
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (e.target.value !== 'empresarial') setOrganizationId('');
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="empresarial">Empresarial (1 Organización)</option>
                  <option value="corporativo">Corporativo (Todas)</option>
                  <option value="admin">Administrador del Sistema</option>
                </select>
              </div>

              {role === 'empresarial' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Organización Asignada</label>
                  <select
                    required
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Selecciona una empresa...</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="pt-2 text-xs text-slate-500">
                La contraseña inicial generada será: <strong className="text-slate-700">password123</strong>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
