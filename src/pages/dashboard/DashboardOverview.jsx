import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/db';
import Dashboard from '../../components/Dashboard';
import { Link as LinkIcon, Check } from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();
  const location = useLocation();
  const [organizations, setOrganizations] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(location.state?.orgId || '');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (token) => {
    const link = `${window.location.origin}/evaluate/${token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadData = async () => {
    setLoading(true);
    if (user.role === 'corporativo' || user.role === 'admin') {
      let orgs = await dbService.getOrganizations();
      
      if (user.role === 'corporativo') {
        const allowed = user.allowed_organizations || [];
        orgs = orgs.filter(o => allowed.includes(o.id));
      }

      setOrganizations(orgs);
      if (orgs.length > 0 && !selectedOrgId) {
        setSelectedOrgId('all'); // Option to see all combined or just the first one
      }
    } else if (user.role === 'empresarial') {
      const org = await dbService.getOrganizationById(user.organization_id);
      if (org) {
        setOrganizations([org]);
        setSelectedOrgId(org.id);
      }
    }
    setLoading(false);
  };

  const loadEvaluations = async () => {
    if (!selectedOrgId) return;
    
    if (selectedOrgId === 'all') {
      let allEvals = await dbService.getAllEvaluations();
      
      if (user.role === 'corporativo') {
        const allowed = user.allowed_organizations || [];
        allEvals = allEvals.filter(e => allowed.includes(e.organization_id));
      }

      setEvaluations(allEvals.map(e => e.results));
    } else {
      const orgEvals = await dbService.getEvaluationsByOrganization(selectedOrgId);
      setEvaluations(orgEvals);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, selectedOrgId]); // Keep loadData stable or disable exhaustive deps warning, but actually we don't need loadData to be a dep if it's declared here. Wait, better to just put it above.

  useEffect(() => {
    loadEvaluations();
  }, [selectedOrgId]);



  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  return (
    <div className="space-y-6">
      {(user.role === 'corporativo' || user.role === 'admin') && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4">
          <label className="font-medium text-slate-700">Seleccionar Organización:</label>
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none min-w-[250px]"
          >
            <option value="all">Vista Global (Empresas permitidas)</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          {selectedOrgId !== 'all' && (
            <button
              onClick={() => {
                const org = organizations.find(o => o.id === selectedOrgId);
                if (org?.evaluation_token) handleCopyLink(org.evaluation_token);
              }}
              className="ml-auto flex items-center gap-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium"
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
              {copied ? '¡Copiado!' : 'Copiar Link del Chatbot'}
            </button>
          )}
        </div>
      )}

      {user.role === 'empresarial' && organizations.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{organizations[0].name}</h1>
            <p className="text-slate-600 mt-1">Resultados de la evaluación de satisfacción laboral.</p>
          </div>
          {organizations[0]?.evaluation_token && (
            <button
              onClick={() => handleCopyLink(organizations[0].evaluation_token)}
              className="flex items-center gap-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium"
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
              {copied ? '¡Copiado!' : 'Copiar Link del Chatbot'}
            </button>
          )}
        </div>
      )}

      {evaluations.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 border-dashed">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-slate-800">No hay datos disponibles</h3>
          <p className="text-slate-500 mt-1">Aún no se han registrado evaluaciones para esta organización.</p>
        </div>
      ) : (
        <div className="dashboard-wrapper">
          <Dashboard data={evaluations} />
        </div>
      )}
    </div>
  );
}
