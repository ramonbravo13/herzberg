import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/db';
import Dashboard from '../../components/Dashboard';
import AnimatedNumber from '../../components/ui/AnimatedNumber';
import { Link as LinkIcon, Check, PlusCircle, AlertTriangle, Calendar, ChevronDown, Users, Target, MapPin, Plus, Trash2 } from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();
  const location = useLocation();
  const [organizations, setOrganizations] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(location.state?.orgId || '');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedZone, setCopiedZone] = useState(null);
  
  const [selectedPeriod, setSelectedPeriod] = useState('active');
  const [selectedZone, setSelectedZone] = useState('all');
  const [newZoneName, setNewZoneName] = useState('');
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    setSelectedPeriod('active');
    setSelectedZone('all');
  }, [selectedOrgId]);

  const handleCopyLink = (token, zone = null) => {
    const baseUrl = `${window.location.origin}/evaluate/${token}`;
    const link = zone ? `${baseUrl}?zone=${encodeURIComponent(zone)}` : baseUrl;
    navigator.clipboard.writeText(link);
    if (zone) {
      setCopiedZone(zone);
      setTimeout(() => setCopiedZone(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      if (orgs.length === 1 && !selectedOrgId) {
        setSelectedOrgId(orgs[0].id);
      } else if (orgs.length > 1 && !selectedOrgId) {
        setSelectedOrgId('all'); // Option to see all combined
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

      const targetPeriod = selectedPeriod === 'active' ? activeOrg.currentPeriod : parseInt(selectedPeriod, 10);
      
      let filtered = orgEvals.filter(e => e.period === targetPeriod || (!e.period && targetPeriod === 1));
      
      if (selectedZone !== 'all') {
        filtered = filtered.filter(e => e.zone === selectedZone || e.departamento === selectedZone);
      }
      
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
    
    const isZone = selectedZone !== 'all';
    const currentGoal = isZone 
      ? (activeOrg.zone_headcounts?.[selectedZone] || '')
      : (activeOrg.expected_headcount || '');
      
    const promptText = isZone 
      ? `Ingresa la meta esperada para la zona "${selectedZone}":` 
      : 'Ingresa la meta de participantes esperados para toda la organización:';
      
    const input = prompt(promptText, currentGoal);
    
    if (input !== null) {
      const num = parseInt(input, 10);
      try {
        let updates = {};
        if (isZone) {
           const zoneHeadcounts = { ...(activeOrg.zone_headcounts || {}) };
           if (!isNaN(num) && num > 0) {
             if (activeOrg.expected_headcount) {
                let otherZonesSum = 0;
                for (const z in zoneHeadcounts) {
                   if (z !== selectedZone) {
                      otherZonesSum += zoneHeadcounts[z];
                   }
                }
                if (otherZonesSum + num > activeOrg.expected_headcount) {
                   alert(`Error: La suma de las zonas (${otherZonesSum + num}) superaría la meta global de la organización (${activeOrg.expected_headcount}). Modifica primero la meta global o ajusta otras zonas.`);
                   return;
                }
             }
             zoneHeadcounts[selectedZone] = num;
           } else {
             delete zoneHeadcounts[selectedZone];
           }
           updates = { zone_headcounts: zoneHeadcounts };
        } else {
           if (!isNaN(num) && num > 0) {
              const currentZonesSum = Object.values(activeOrg.zone_headcounts || {}).reduce((a, b) => a + b, 0);
              if (num < currentZonesSum) {
                 alert(`Error: La meta global (${num}) no puede ser menor a la suma actual de participación esperada en las zonas (${currentZonesSum}).`);
                 return;
              }
              updates = { expected_headcount: num };
           } else {
              updates = { expected_headcount: null };
           }
        }
        
        const updated = await dbService.updateOrganization(activeOrg.id, updates);
        setOrganizations(prev => prev.map(o => o.id === activeOrg.id ? updated : o));
      } catch(err) {
        alert('Error al guardar la meta de participación');
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user, selectedOrgId]); // Keep loadData stable or disable exhaustive deps warning, but actually we don't need loadData to be a dep if it's declared here. Wait, better to just put it above.

  useEffect(() => {
    loadEvaluations();
  }, [selectedOrgId, selectedPeriod, selectedZone, organizations]);



  if (loading) {
    return <div className="text-center py-12">Cargando datos...</div>;
  }

  const activeOrg = selectedOrgId !== 'all' ? organizations.find(o => o.id === selectedOrgId) : null;
  
  const totalResponses = evaluations.length;
  const expectedResponses = selectedZone !== 'all' 
    ? (activeOrg?.zone_headcounts?.[selectedZone] || 0)
    : (activeOrg?.expected_headcount || 0);
  const progressPercent = expectedResponses > 0 ? Math.min(Math.round((totalResponses / expectedResponses) * 100), 100) : 0;

  const handleAddZone = async (e) => {
    e.preventDefault();
    if (!newZoneName.trim() || !activeOrg) return;
    
    try {
      const currentZones = activeOrg.zones || [];
      if (currentZones.includes(newZoneName.trim())) {
        alert('Esta zona ya existe.');
        return;
      }
      const updatedZones = [...currentZones, newZoneName.trim()];
      const updated = await dbService.updateOrganization(activeOrg.id, { zones: updatedZones });
      setOrganizations(prev => prev.map(o => o.id === activeOrg.id ? updated : o));
      setNewZoneName('');
    } catch (err) {
      alert('Error al crear zona');
    }
  };

  const handleDeleteZone = async (zoneToDelete) => {
    if (!activeOrg || !window.confirm(`¿Estás seguro de que deseas eliminar la zona "${zoneToDelete}"? Esto no borrará las respuestas pasadas de esta zona.`)) return;
    
    try {
      const currentZones = activeOrg.zones || [];
      const updatedZones = currentZones.filter(z => z !== zoneToDelete);
      const updated = await dbService.updateOrganization(activeOrg.id, { zones: updatedZones });
      setOrganizations(prev => prev.map(o => o.id === activeOrg.id ? updated : o));
      if (selectedZone === zoneToDelete) {
        setSelectedZone('all');
      }
    } catch (err) {
      alert('Error al eliminar zona');
    }
  };

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
                  {organizations.length > 1 && (
                    <option value="all">Vista Global (Todas)</option>
                  )}
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
                <MapPin size={18} />
              </div>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-700 border-none outline-none cursor-pointer focus:ring-0 p-0 pr-6 max-w-[150px] truncate"
              >
                <option value="all">Todas las zonas (Filtro)</option>
                {activeOrg.zones && activeOrg.zones.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          )}

          {activeOrg && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg shrink-0">
                <Calendar size={18} />
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-700 border-none outline-none cursor-pointer focus:ring-0 p-0 pr-6"
              >
                <option value="active">Periodo Activo ({activeOrg.currentPeriod})</option>
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

        {/* Gestión de Enlaces y Periodos */}
        {activeOrg && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <LinkIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Gestión de Enlaces y Periodos</h3>
                  <p className="text-sm text-slate-500">Comparte estos enlaces para recibir evaluaciones en el periodo actual.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-700">Periodo Activo: {activeOrg.currentPeriod}</span>
                <button
                  onClick={() => setShowRestartConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                >
                  <PlusCircle size={14} /> Iniciar Nuevo
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Enlace Principal (Global)</h4>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/evaluate/${activeOrg.evaluation_token}`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono outline-none"
                />
                <button 
                  onClick={() => handleCopyLink(activeOrg.evaluation_token)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors whitespace-nowrap"
                >
                  {copied ? <Check size={18} /> : <LinkIcon size={18} />} Copiar
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Enlaces por Micrositios (Zonificación)</h4>
                  <p className="text-xs text-slate-500">Cada enlace asignará automáticamente la zona a las respuestas.</p>
                </div>
              </div>
              
              <form onSubmit={handleAddZone} className="flex gap-2 mb-6 max-w-xl">
                <input 
                  type="text" 
                  value={newZoneName}
                  onChange={e => setNewZoneName(e.target.value)}
                  placeholder="Nombre del nuevo micrositio (ej. Operaciones)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                />
                <button 
                  type="submit"
                  disabled={!newZoneName.trim()}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus size={16} /> Agregar
                </button>
              </form>

              {(!activeOrg.zones || activeOrg.zones.length === 0) ? (
                <div className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  No has creado ningún micrositio.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOrg.zones.map(zone => (
                    <div key={zone} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                      <span className="font-semibold text-slate-700 min-w-[120px] shrink-0" title={zone}>{zone}</span>
                      
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          readOnly 
                          value={`${window.location.origin}/evaluate/${activeOrg.evaluation_token}?zone=${encodeURIComponent(zone)}`}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 font-mono outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleCopyLink(activeOrg.evaluation_token, zone)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${copiedZone === zone ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 shadow-sm'}`}
                        >
                          {copiedZone === zone ? <Check size={14} /> : <LinkIcon size={14} />} Copiar
                        </button>
                        <button 
                          onClick={() => handleDeleteZone(zone)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Eliminar micrositio"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
