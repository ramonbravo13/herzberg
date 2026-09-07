import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/db';
import Dashboard from '../../components/Dashboard';
import AnimatedNumber from '../../components/ui/AnimatedNumber';
import { Link as LinkIcon, Check, PlusCircle, AlertTriangle, Calendar, ChevronDown, Users, Target } from 'lucide-react';

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

  const handleSetHeadcount = async () => {
    const activeOrg = organizations.find(o => o.id === selectedOrgId);
    if (!activeOrg) return;
    
    const input = prompt('Ingresa la meta de participantes esperados para este periodo:', activeOrg.expected_headcount || '');
    if (input !== null) {
      const num = parseInt(input, 10);
      if (!isNaN(num) && num > 0) {
        try {
          const updated = await dbService.updateOrganization(activeOrg.id, { expected_headcount: num });
          setOrganizations(prev => prev.map(o => o.id === activeOrg.id ? updated : o));
        } catch(err) {
          alert('Error al guardar la meta de participación');
        }
      } else if (input === '') {
        // Allow removing the goal
        try {
          const updated = await dbService.updateOrganization(activeOrg.id, { expected_headcount: null });
          setOrganizations(prev => prev.map(o => o.id === activeOrg.id ? updated : o));
        } catch(err) {}
      }
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
  
  const totalResponses = evaluations.length;
  const expectedResponses = activeOrg?.expected_headcount || 0;
  const progressPercent = expectedResponses > 0 ? Math.min(Math.round((totalResponses / expectedResponses) * 100), 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Control Bar Unificada */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        
        {/* Lado izquierdo: Org y Título */}
        <div className="flex items-center gap-4 flex-1">
          {user.role === 'empresarial' && activeOrg ? (
            <div>
              <h1 className="text-xl font-bold text-slate-800">{activeOrg.name}</h1>
              <p className="text-sm text-slate-500 font-medium">Resultados de Evaluación</p>
            </div>
          ) : (user.role === 'corporativo' || user.role === 'admin') ? (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Users size={20} />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organización</label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-800 border-none outline-none cursor-pointer focus:ring-0 p-0 pr-8"
                >
                  <option value="all">Vista Global (Todas)</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}
        </div>

        {/* Lado derecho: Periodo y Acciones */}
        <div className="flex flex-wrap items-center gap-3">
          {activeOrg && (
            <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-1">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg shrink-0">
                <Calendar size={18} />
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-700 border-none outline-none cursor-pointer focus:ring-0 p-0 pr-6"
              >
                <option value="active">Activo (Periodo {activeOrg.currentPeriod})</option>
                {activeOrg.periods && activeOrg.periods
                  .filter(p => p.id !== activeOrg.currentPeriod)
                  .sort((a, b) => b.id - a.id)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))
                }
              </select>
            </div>
          )}

          {activeOrg && (
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all active:scale-95 border border-amber-100"
              title="Iniciar Nuevo Periodo"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Nuevo Periodo</span>
            </button>
          )}

          {activeOrg?.evaluation_token && (
            <button
              onClick={() => handleCopyLink(activeOrg.evaluation_token)}
              className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all active:scale-95 shadow-sm"
            >
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar Link del Chatbot'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="space-y-6">

        {/* Participation Dashboard */}
        {activeOrg && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Participación</h3>
                  <p className="text-sm text-slate-500">Respuestas válidas completadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-800">
                    <AnimatedNumber value={totalResponses} duration={1} /> 
                    <span className="text-base font-medium text-slate-400">/ <AnimatedNumber value={expectedResponses || 0} duration={1} /></span>
                  </div>
                </div>
                <button 
                  onClick={handleSetHeadcount}
                  title="Configurar Meta de Participación"
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Target size={20} />
                </button>
              </div>
            </div>
            
            {expectedResponses > 0 && (
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-600">Avance hacia la meta</span>
                  <span className="text-emerald-600"><AnimatedNumber value={progressPercent} duration={1.5} />%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
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
