import React, { useState } from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import { Info, Users, ChevronDown, ChevronUp } from 'lucide-react';

export default function FlightRiskDrivers({ dataArray }) {
  const [showDemo, setShowDemo] = useState(false);

  if (!dataArray || dataArray.length < 2) return null;

  // permanencia <= 2 => High flight risk (quiero irme pronto o muy pronto)
  const leaving = dataArray.filter(d => d.respuestas && d.respuestas.permanencia <= 2);
  const staying = dataArray.filter(d => d.respuestas && d.respuestas.permanencia > 2);

  if (leaving.length === 0 || staying.length === 0) return null;

  // Calculate scores for all questions for both groups
  const gaps = Object.keys(QUESTION_MAP).map(key => {
    const scoreLeaving = calculateIndex([key], leaving);
    const scoreStaying = calculateIndex([key], staying);
    const gap = scoreStaying - scoreLeaving; // Positive gap means leaving people scored it much lower
    return { key, text: QUESTION_MAP[key], scoreLeaving, scoreStaying, gap };
  });

  // Sort by biggest gap
  gaps.sort((a, b) => b.gap - a.gap);

  const top3 = gaps.slice(0, 3);

  // Helper for demographics
  const getCounts = (arr, key) => {
    return arr.reduce((acc, curr) => {
      const val = curr[key] || 'No especificado';
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
  };
  const getSortedEntries = (counts) => Object.entries(counts).sort((a,b) => b[1] - a[1]);

  const depts = getSortedEntries(getCounts(leaving, 'departamento'));
  const levels = getSortedEntries(getCounts(leaving, 'nivel_puesto'));
  const tenures = getSortedEntries(getCounts(leaving, 'antiguedad'));

  return (
    <ChartCard 
      title="Drivers de Fuga de Talento (Análisis Predictivo)"
      subtitle={<>Compara a los colaboradores en alto riesgo de renuncia contra los colaboradores leales. Identifica las áreas exactas donde la brecha de insatisfacción es mayor; es decir, <strong>la causa raíz real que está empujando a tu talento a irse</strong>.</>}
      footer={
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-500 justify-center w-full">
            <button 
              onClick={() => setShowDemo(!showDemo)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all border ${showDemo ? 'bg-red-50 text-red-700 border-red-200 shadow-inner' : 'bg-white text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 shadow-sm'}`}
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              Alto Riesgo de Fuga: {leaving.length} personas
              <div className="flex items-center ml-1 bg-white/50 px-2 py-0.5 rounded-full border border-red-100/50">
                <Users size={12} className="mr-1" />
                <span className="text-[10px] uppercase tracking-wider font-bold">Ver Perfil</span>
                {showDemo ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
              </div>
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Leales (Se quedan): {staying.length} personas
            </div>
          </div>

          {showDemo && (
            <div className="mt-6 w-full p-6 bg-gradient-to-b from-white to-red-50/30 border-2 border-red-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3 mb-6 border-b border-red-100 pb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-lg">Perfil Demográfico del Riesgo de Fuga</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Radiografía exacta de quiénes son las {leaving.length} personas que planean irse.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Departamento */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Por Área / Zona</h5>
                  <div className="space-y-3">
                    {depts.map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center text-sm group">
                        <span className="text-slate-700 truncate pr-2 font-medium">{name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                            <div className="h-full bg-red-400 rounded-full" style={{width: `${(count/leaving.length)*100}%`}}></div>
                          </div>
                          <span className="font-black text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md text-xs w-8 text-center">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nivel */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Por Nivel de Puesto</h5>
                  <div className="space-y-3">
                    {levels.map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center text-sm group">
                        <span className="text-slate-700 truncate pr-2 font-medium">{name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                            <div className="h-full bg-orange-400 rounded-full" style={{width: `${(count/leaving.length)*100}%`}}></div>
                          </div>
                          <span className="font-black text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md text-xs w-8 text-center">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Antigüedad */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Por Antigüedad</h5>
                  <div className="space-y-3">
                    {tenures.map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center text-sm group">
                        <span className="text-slate-700 truncate pr-2 font-medium">{name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                            <div className="h-full bg-amber-400 rounded-full" style={{width: `${(count/leaving.length)*100}%`}}></div>
                          </div>
                          <span className="font-black text-slate-800 bg-slate-50 px-2 py-0.5 rounded-md text-xs w-8 text-center">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-4 mt-4">
        {top3.map((item, index) => (
          <div key={item.key} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:bg-white">
            <h4 className="font-bold text-slate-800 text-sm mb-4">#{index + 1} "{item.text}"</h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-xs">
                <div className="w-24 text-slate-500 font-semibold uppercase tracking-wider truncate">Leales:</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4 shadow-inner overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${item.scoreStaying}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-slate-700">{item.scoreStaying}%</div>
              </div>
              
              <div className="flex items-center text-xs">
                <div className="w-24 text-red-500 font-semibold uppercase tracking-wider truncate">En Riesgo:</div>
                <div className="flex-1 bg-red-50 rounded-full h-2.5 mx-4 shadow-inner overflow-hidden border border-red-100/50">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${item.scoreLeaving}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-red-600">{item.scoreLeaving}%</div>
              </div>
            </div>

            <div className="mt-4 text-right text-xs text-slate-400 font-medium">
              Brecha de retención: <strong className="text-red-500 ml-1">-{item.gap}%</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-indigo-50/30 border border-indigo-100 rounded-xl flex gap-4 text-slate-600 text-sm leading-relaxed">
        <Info size={24} className="shrink-0 text-indigo-400 mt-0.5" />
        <div>
          <strong className="text-slate-800 text-base">Valor Estratégico para Recursos Humanos</strong>
          <p className="mt-2 text-justify">
            Este algoritmo de Inteligencia Artificial realiza un <strong>análisis predictivo correlacional</strong>. Toma únicamente a los empleados que ya tienen la intención de abandonar la empresa y compara todas sus respuestas contra los empleados leales. 
          </p>
          <p className="mt-2 text-justify">
            Los 3 reactivos mostrados arriba son las variables donde las opiniones de ambos grupos chocan más fuertemente (la Brecha). Esto es oro puro para RH: significa que <strong>si diseñas iniciativas para resolver exclusivamente estos 3 puntos, estarás atacando la verdadera causa raíz de tu rotación</strong> y tu retención de talento aumentará drásticamente.
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
