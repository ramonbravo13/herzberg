import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';

export default function FlightRiskDrivers({ dataArray }) {
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

  return (
    <ChartCard 
      title="Drivers de Fuga de Talento"
      subtitle={<>Compara a los colaboradores en alto riesgo de renuncia contra el resto de la empresa. Identifica los factores específicos donde la brecha es mayor; es decir, <strong>lo que realmente los está empujando a irse</strong>.</>}
      footer={
        <div className="flex gap-6 text-xs font-semibold text-slate-500 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Riesgo Fuga: {leaving.length}</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Resto: {staying.length}</div>
        </div>
      }
    >
      <div className="space-y-4 mt-2">
        {top3.map((item, index) => (
          <div key={item.key} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:bg-white">
            <h4 className="font-bold text-slate-800 text-sm mb-4">#{index + 1} {item.text}</h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-xs">
                <div className="w-24 text-slate-500 font-semibold uppercase tracking-wider truncate">Se Quedan:</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4 shadow-inner overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${item.scoreStaying}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-slate-700">{item.scoreStaying}%</div>
              </div>
              
              <div className="flex items-center text-xs">
                <div className="w-24 text-red-500 font-semibold uppercase tracking-wider truncate">Se Van:</div>
                <div className="flex-1 bg-red-50 rounded-full h-2.5 mx-4 shadow-inner overflow-hidden border border-red-100/50">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${item.scoreLeaving}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-red-600">{item.scoreLeaving}%</div>
              </div>
            </div>

            <div className="mt-4 text-right text-xs text-slate-400 font-medium">
              Brecha: <strong className="text-red-500 ml-1">-{item.gap}%</strong>
            </div>
          </div>
        ))}
      </div>

      {/* ROI Simulator Widget */}
      <div className="mt-8 relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-center group">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="md:w-1/2 flex flex-col gap-3 w-full relative z-10">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Simulador Ejecutivo (ROI)</label>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">Calcula el capital preservado si logramos retener al 50% del talento en riesgo crítico. <span className="text-slate-300">Ingresa el salario mensual promedio (MXN).</span></p>
          <div className="relative mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black">$</span>
            <input 
              type="number" 
              defaultValue={15000}
              id="roi-salary"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-lg font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
              onChange={(e) => {
                const val = Number(e.target.value);
                const el = document.getElementById('roi-result');
                if (el && val > 0) {
                  const annual = val * 12;
                  const replaceCost = annual * 1.5;
                  const savedPeople = Math.ceil(leaving.length / 2);
                  const totalSaved = replaceCost * savedPeople;
                  el.innerText = `$${totalSaved.toLocaleString('es-MX')}`;
                  document.getElementById('roi-people').innerText = savedPeople;
                }
              }}
            />
          </div>
        </div>
        <div className="md:w-1/2 w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center relative z-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <p className="text-[11px] uppercase font-bold text-emerald-400/80 tracking-widest mb-2">Ahorro Anual Estimado</p>
          <p id="roi-result" className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            ${(Math.ceil(leaving.length / 2) * (15000 * 12 * 1.5)).toLocaleString('es-MX')}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-3 leading-relaxed">
            Al retener a <strong id="roi-people" className="text-emerald-400 font-bold">{Math.ceil(leaving.length / 2)}</strong> colaboradores clave. <br/>
            <span className="opacity-60 text-[10px] mt-1 block tracking-wide">Costo de reemplazo: 1.5x salario anual (Estándar SHRM)</span>
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
