import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

export default function Nom035Feature() {
  return (
    <section id="nom-035" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-orange-500" size={24} />
                <h3 className="font-bold text-slate-800">Categorías de Riesgo</h3>
              </div>
              
              <div className="space-y-4">
                
                {/* Category 1 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Ambiente de trabajo</div>
                    <div className="text-xs text-slate-500">Condiciones físicas e higiene</div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                    BAJO
                  </div>
                </div>

                {/* Category 2 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Factores propios de la actividad</div>
                    <div className="text-xs text-slate-500">Cargas de trabajo y responsabilidades</div>
                  </div>
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold border border-orange-200">
                    ALTO
                  </div>
                </div>

                {/* Category 3 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Organización del tiempo</div>
                    <div className="text-xs text-slate-500">Jornadas e interferencia trabajo-familia</div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-200">
                    MEDIO
                  </div>
                </div>

                {/* Category 4 */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">Liderazgo y relaciones</div>
                    <div className="text-xs text-slate-500">Violencia y reconocimiento</div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                    BAJO
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-bold text-xs uppercase tracking-widest mb-6 border border-orange-100">
              <FileText size={14} /> Cumplimiento y Bienestar
            </div>
            
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
              Convierte los resultados de la NOM-035 en información accionable.
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 font-light leading-relaxed">
              Analiza los factores de riesgo psicosocial mediante una experiencia centralizada que permite visualizar resultados y áreas de atención para Recursos Humanos.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-orange-100 text-orange-600 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <span className="text-slate-700">Identifica niveles de riesgo por dominios y categorías.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-orange-100 text-orange-600 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <span className="text-slate-700">Visualiza resúmenes que facilitan la toma de decisiones.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-orange-100 text-orange-600 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                <span className="text-slate-700">Obtén recomendaciones basadas en los hallazgos de las guías correspondientes.</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
}
