import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Mail, Search, RefreshCw } from 'lucide-react';

export default function DemoRequestsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await dbService.getDemoRequests();
      setRequests(data || []);
    } catch (err) {
      alert('Error al cargar las solicitudes: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Mail size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Solicitudes de Demostración</h1>
              <p className="text-sm text-slate-500">Contactos capturados desde la Landing Page</p>
            </div>
          </div>
          <button 
            onClick={loadRequests}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="py-4 px-6 font-semibold">Fecha</th>
                <th className="py-4 px-6 font-semibold">Nombre</th>
                <th className="py-4 px-6 font-semibold">Empresa</th>
                <th className="py-4 px-6 font-semibold">Correo Electrónico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">Cargando datos...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-500">No hay solicitudes encontradas.</td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString('es-MX', { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">{req.name}</td>
                    <td className="py-4 px-6 text-slate-600">{req.company}</td>
                    <td className="py-4 px-6 text-indigo-600 hover:underline">
                      <a href={`mailto:${req.email}`}>{req.email}</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
