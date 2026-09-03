import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/db';
import Dashboard from '../../components/Dashboard';
import { Link as LinkIcon, Check, PlusCircle, AlertTriangle } from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();
  const location = useLocation();
  const [organizations, setOrganizations] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(location.state?.orgId || '');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const [selectedPeriod, setSelectedPeriod] = useState('active');
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    setSelectedPeriod('active');
  }, [selectedOrgId]);

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

      setEvaluations(allEvals); // Vista Global shows all regardless of period, or could be filtered if needed. We show all.
    } else {
      const orgEvals = await dbService.getEvaluationsByOrganization(selectedOrgId);
      const activeOrg = organizations.find(o => o.id === selectedOrgId);
      
      if (!activeOrg) return;

      const targetPeriod = selectedPeriod === 'active' ? activeOrg.currentPeriod : selectedPeriod;
      
      const filtered = orgEvals.filter(e => e.period === targetPeriod || (!e.period && targetPeriod === 1));
      setEvaluations(filtered);
    }
  };

  const handleRestartPeriod = async () => {
    setIsRestarting(true);
    try {
      const updatedOrg = await dbService.restartOrganizationPeriod(selectedOrgId);
      setOrganizations(prev => prev.map(o => o.id === selectedOrgId ? updatedOrg : o));
      setSelectedPeriod('active');
      setShowRestartConfirm(false);
      await loadEvaluations();
    } catch (err) {
      alert(err.message || 'Error al reiniciar el ciclo');
    } finally {
      setIsRestarting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, selectedOrgId]); // Keep loadData stable or disable exhaustive deps warning, but actually we don't need loadData to be a dep if it's declared here. Wait, better to just put it above.

  useEffect(() => {
    loadEvaluations();
  }, [selectedOrgId, selectedPeriod, organizations]);



  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  const activeOrg = selectedOrgId !== 'all' ? organizations.find(o => o.id === selectedOrgId) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar de Periodos */}
      {activeOrg && (
        <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Ciclo Actual</h3>
            <button
              onClick={() => setSelectedPeriod('active')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                selectedPeriod === 'active'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Dashboard Activo (Periodo {activeOrg.currentPeriod})
            </button>

            {activeOrg.periods && activeOrg.periods.length > 1 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Histórico</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {[...activeOrg.periods]
                    .filter(p => p.id !== activeOrg.currentPeriod)
                    .sort((a, b) => b.id - a.id)
                    .map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPeriod(p.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        selectedPeriod === p.id
                          ? 'bg-slate-200 text-slate-800 font-bold'
                          : 'bg-transparent text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {p.name}
                      {p.startDate && <div className="text-xs font-normal opacity-70 mt-0.5">{new Date(p.startDate).toLocaleDateString()} {p.endDate ? `- ${new Date(p.endDate).toLocaleDateString()}` : ''}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={() => setShowRestartConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium text-sm"
              >
                <PlusCircle size={16} />
                Iniciar Nuevo Periodo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 space-y-6 min-w-0">
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
            {activeOrg?.evaluation_token && (
              <button
                onClick={() => handleCopyLink(activeOrg.evaluation_token)}
                className="ml-auto flex items-center gap-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors font-medium"
              >
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                {copied ? '¡Copiado!' : 'Copiar Link del Chatbot'}
              </button>
            )}
          </div>
        )}

        {user.role === 'empresarial' && activeOrg && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{activeOrg.name}</h1>
              <p className="text-slate-600 mt-1">Resultados de la evaluación de satisfacción laboral.</p>
            </div>
            {activeOrg.evaluation_token && (
              <button
                onClick={() => handleCopyLink(activeOrg.evaluation_token)}
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
            <p className="text-slate-500 mt-1">Aún no se han registrado evaluaciones para este periodo.</p>
          </div>
        ) : (
          <div className="dashboard-wrapper">
            <Dashboard data={evaluations} />
          </div>
        )}
      </div>

      {/* Restart Confirm Modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">¿Iniciar nuevo periodo?</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Estás a punto de cerrar el periodo actual de encuestas. Las respuestas recolectadas hasta el momento quedarán archivadas en el historial. <br/><br/>
              El Dashboard se vaciará para comenzar a recibir los resultados del nuevo ciclo. <strong>Los datos antiguos no se borrarán.</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                disabled={isRestarting}
              >
                Cancelar
              </button>
              <button
                onClick={handleRestartPeriod}
                disabled={isRestarting}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {isRestarting ? 'Iniciando...' : 'Sí, iniciar nuevo periodo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
