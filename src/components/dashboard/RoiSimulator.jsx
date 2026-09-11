import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function RoiSimulator({ dataArray }) {
  const [salary, setSalary] = useState(15000);

  if (!dataArray || dataArray.length < 2) return null;

  const leaving = dataArray.filter(d => d.respuestas && d.respuestas.permanencia <= 2);
  if (leaving.length === 0) return null;

  const savedPeople = Math.ceil(leaving.length / 2);
  const annual = salary * 12;
  const replaceCost = annual * 1.5;
  const totalSaved = replaceCost * savedPeople;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between group h-full min-h-[400px]">
      {/* Decorative background glows */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
      <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Simulador Ejecutivo (ROI)</h3>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xs uppercase font-bold text-emerald-400/90 tracking-widest mb-3">Ahorro Anual Estimado</p>
          <div className="flex items-baseline gap-2 mb-4 flex-wrap">
            <span className="text-5xl sm:text-6xl font-black text-emerald-400 tracking-tighter drop-shadow-lg">
              ${totalSaved.toLocaleString('es-MX')}
            </span>
            <span className="text-xl font-bold text-emerald-500/80">MXN</span>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
            Capital preservado al retener a <strong className="text-emerald-400 font-bold">{savedPeople}</strong> colaboradores estratégicos en riesgo de fuga.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80">
        <label htmlFor="roi-salary" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Salario Mensual Promedio
        </label>
        <div className="relative max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-emerald-400 font-black text-lg">$</span>
          </div>
          <input 
            type="number" 
            id="roi-salary"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-xl py-3.5 pl-10 pr-4 text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-inner"
            min="1000"
            step="1000"
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-wider">
          * Costo de reemplazo: 1.5x salario anual (SHRM)
        </p>
      </div>
    </div>
  );
}
