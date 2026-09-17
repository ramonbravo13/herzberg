import React from 'react';
import { Settings, Link as LinkIcon, MessageCircle, BarChart2 } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-teal-400 uppercase mb-4">El Proceso</h2>
            <h3 className="text-4xl font-extrabold mb-12">Simplicidad desde la configuración hasta el análisis.</h3>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
              
              {/* Step 1 */}
              <div className="relative flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-teal-500 flex items-center justify-center z-10 shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                  <Settings className="text-teal-400" size={20} />
                </div>
                <div>
                  <div className="text-teal-400 font-bold mb-1">01</div>
                  <h4 className="text-xl font-bold mb-2">Configura tu organización</h4>
                  <p className="text-slate-400">Define el periodo, configura tus micrositios y establece las metas de participación esperadas.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 shrink-0">
                  <LinkIcon className="text-slate-300" size={20} />
                </div>
                <div>
                  <div className="text-slate-500 font-bold mb-1">02</div>
                  <h4 className="text-xl font-bold mb-2">Comparte el enlace</h4>
                  <p className="text-slate-400">Distribuye el enlace de evaluación global o los enlaces específicos por zona entre tus colaboradores.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 shrink-0">
                  <MessageCircle className="text-slate-300" size={20} />
                </div>
                <div>
                  <div className="text-slate-500 font-bold mb-1">03</div>
                  <h4 className="text-xl font-bold mb-2">Tus colaboradores responden</h4>
                  <p className="text-slate-400">Participan mediante una experiencia conversacional amigable directamente desde su navegador.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center z-10 shrink-0">
                  <BarChart2 className="text-slate-300" size={20} />
                </div>
                <div>
                  <div className="text-slate-500 font-bold mb-1">04</div>
                  <h4 className="text-xl font-bold mb-2">Analiza los resultados</h4>
                  <p className="text-slate-400">Consulta en tiempo real la participación, resultados, zonas, factores de riesgo e historial.</p>
                </div>
              </div>

            </div>
          </div>
          
          {/* Visual representation */}
          <div className="bg-slate-800 p-8 rounded-[2rem] border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
             
             <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center"><MessageCircle size={20}/></div>
                <div className="flex-1">
                  <div className="h-2 w-24 bg-slate-700 rounded mb-2"></div>
                  <div className="h-2 w-48 bg-slate-600 rounded"></div>
                </div>
             </div>

             <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-700 flex items-center gap-4 justify-end">
                <div className="flex-1 flex flex-col items-end">
                  <div className="h-2 w-32 bg-indigo-500/50 rounded mb-2"></div>
                  <div className="h-2 w-20 bg-indigo-500/30 rounded"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><div className="w-4 h-4 rounded-full bg-indigo-400"></div></div>
             </div>

             <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center"><MessageCircle size={20}/></div>
                <div className="flex-1">
                  <div className="h-2 w-36 bg-slate-700 rounded mb-2"></div>
                  <div className="h-2 w-16 bg-slate-600 rounded"></div>
                </div>
             </div>
             
             <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Evaluación completada
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
