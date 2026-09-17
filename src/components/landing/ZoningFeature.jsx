import React from 'react';
import { Network, Link2, GitBranch } from 'lucide-react';

export default function ZoningFeature() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 rounded-l-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6">
              <Network size={14} /> Zonificación Inteligente
            </div>
            
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Cada zona. <br/>Sus propios resultados.</h2>
            
            <p className="text-xl text-slate-600 mb-8 font-light leading-relaxed">
              Segmenta las evaluaciones por sucursales, departamentos, áreas o regiones mediante enlaces personalizados. El sistema identifica automáticamente la zona, evitando que el colaborador tenga que seleccionar manualmente su departamento o sucursal.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Link2 className="text-slate-400" size={20} />
                <code className="text-sm text-slate-600 flex-1 font-mono">/evaluate/empresa</code>
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Global</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-xl shadow-md relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <Link2 className="text-blue-500" size={20} />
                <code className="text-sm text-blue-800 flex-1 font-mono">/evaluate/empresa<span className="font-bold text-blue-600">?zone=Operaciones</span></code>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Link2 className="text-slate-400" size={20} />
                <code className="text-sm text-slate-600 flex-1 font-mono">/evaluate/empresa?zone=Ventas</code>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl relative z-10">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <GitBranch className="text-indigo-500" size={24} />
                <h3 className="font-bold text-lg text-slate-800">Estructura Organizacional</h3>
              </div>
              
              <div className="pl-4 border-l-2 border-slate-200 space-y-6 relative">
                
                <div className="relative">
                  <div className="absolute -left-6 top-1/2 w-4 h-0.5 bg-slate-200"></div>
                  <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-800 border-2 border-white"></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-slate-800">
                    Sede Central
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-6 top-1/2 w-4 h-0.5 bg-blue-500"></div>
                  <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"></div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 font-bold text-blue-800 shadow-sm">
                    Operaciones <span className="ml-2 text-xs font-normal bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-6 top-1/2 w-4 h-0.5 bg-slate-200"></div>
                  <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-400 border-2 border-white"></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-slate-700">
                    Ventas
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-6 top-1/2 w-4 h-0.5 bg-slate-200"></div>
                  <div className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-400 border-2 border-white"></div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-slate-700">
                    Sucursal Norte
                  </div>
                </div>
                
              </div>
            </div>
            
            {/* Decorative background blocks */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-blue-50 rounded-[3rem] -z-10"></div>
            <div className="absolute -left-8 -top-8 w-40 h-40 bg-indigo-50 rounded-full -z-10"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
