import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../services/db';
import { Plus, Building, Link2, Copy, Check, BarChart3, Edit, Trash2 } from 'lucide-react';

export default function OrganizationsManager() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);
  const [editOrgName, setEditOrgName] = useState('');
  const [newOrgDate, setNewOrgDate] = useState('');
  const [editOrgDate, setEditOrgDate] = useState('');

  const loadOrganizations = async () => {
    const orgs = await dbService.getOrganizations();
    setOrganizations(orgs);
  };

  useEffect(() => {
    loadOrganizations();
  }, []);


  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    await dbService.createOrganization(newOrgName.trim(), newOrgDate || null);
    setNewOrgName('');
    setNewOrgDate('');
    setShowModal(false);
    loadOrganizations();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta organización? Esto también eliminará todas las evaluaciones asociadas. Esta acción no se puede deshacer.")) {
      try {
        await dbService.deleteOrganization(id);
        loadOrganizations();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrgName.trim()) return;
    try {
      await dbService.updateOrganization(editingOrg.id, { 
        name: editOrgName.trim(), 
        subscriptionEndDate: editOrgDate || null 
      });
      setEditingOrg(null);
      setEditOrgName('');
      setEditOrgDate('');
      loadOrganizations();
    } catch (err) {
      alert(err.message);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Organizaciones</h1>
          <p className="text-slate-600">Gestiona las empresas registradas en la plataforma</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={20} />
            Nueva Organización
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-semibold text-slate-700">Nombre</th>
              <th className="p-4 font-semibold text-slate-700">Enlace de Evaluación (Público)</th>
              <th className="p-4 font-semibold text-slate-700">Creación</th>
              <th className="p-4 font-semibold text-slate-700">Vencimiento</th>
              <th className="p-4 font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {organizations.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No hay organizaciones registradas.
                </td>
              </tr>
            ) : (
              organizations.map((org) => {
                const evalLink = `${window.location.origin}/evaluate/${org.evaluation_token}`;
                return (
                  <tr key={org.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Building size={20} />
                      </div>
                      {org.name}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg max-w-md">
                        <Link2 size={16} className="text-slate-400 shrink-0" />
                        <span className="truncate text-sm">{evalLink}</span>
                        <button
                          onClick={() => copyToClipboard(evalLink, org.id)}
                          className="ml-auto text-slate-400 hover:text-slate-700 transition-colors"
                          title="Copiar enlace"
                        >
                          {copiedId === org.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm">
                      {org.subscriptionEndDate ? (
                        <span className={new Date(org.subscriptionEndDate) < new Date() ? "text-red-600 font-medium" : "text-slate-600"}>
                          {new Date(org.subscriptionEndDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">Sin límite</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/dashboard', { state: { orgId: org.id } })}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                          title="Ver Dashboard"
                        >
                          <BarChart3 size={16} />
                          <span className="hidden sm:inline">Dashboard</span>
                        </button>
                        <button
                          onClick={() => { setEditingOrg(org); setEditOrgName(org.name); setEditOrgDate(org.subscriptionEndDate || ''); }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar Organización"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar Organización"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Nueva Organización</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Ej. Acme Corp"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Vencimiento (Opcional)
                </label>
                <input
                  type="date"
                  value={newOrgDate}
                  onChange={(e) => setNewOrgDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Crear y Generar Enlace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingOrg && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Editar Organización</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={editOrgName}
                  onChange={(e) => setEditOrgName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de Vencimiento (Opcional)
                </label>
                <input
                  type="date"
                  value={editOrgDate}
                  onChange={(e) => setEditOrgDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl font-medium transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
