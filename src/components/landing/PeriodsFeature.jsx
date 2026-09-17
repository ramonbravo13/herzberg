import React from 'react';
import { History, TrendingUp } from 'lucide-react';

export default function PeriodsFeature() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <History size={32} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Compara la evolución de tu organización</h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Trabaja con periodos de evaluación y conserva el historial para medir el impacto real de tus estrategias de Recursos Humanos a lo largo del tiempo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-800 rounded-3xl border border-slate-700 p-8 sm:p-12 relative">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* Timeline */}
            <div className="flex-1 w-full space-y-6">
              
              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-slate-500 font-bold whitespace-nowrap">Periodo 2025</div>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 w-1/2"></div>
                </div>
                <div className="text-slate-400 font-mono text-sm">62%</div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-slate-300 font-bold whitespace-nowrap">Periodo 2026</div>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 w-3/4"></div>
                </div>
                <div className="text-slate-300 font-mono text-sm">75%</div>
              </div>

              <div className="flex items-center gap-4 bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <div className="text-white font-bold whitespace-nowrap flex items-center gap-2">
                  Periodo 2027 <span className="bg-indigo-500 text-xs px-2 py-0.5 rounded-full">Activo</span>
                </div>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden relative">
                  <div className="h-full bg-indigo-500 w-[88%] relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-indigo-400 font-mono font-bold text-sm">88%</div>
              </div>

            </div>

            {/* Growth indicator */}
            <div className="shrink-0 flex flex-col items-center justify-center p-8 bg-slate-900 rounded-full border-4 border-slate-800 shadow-xl">
              <TrendingUp className="text-emerald-400 mb-2" size={32} />
              <div className="text-3xl font-black text-white">+26%</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Crecimiento</div>
            </div>

          </div>

          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 blur-3xl -z-0 pointer-events-none rounded-full"></div>
        </div>

      </div>
    </section>
  );
}
