import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Target, Calendar, AlertTriangle } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest mb-6">
            <LayoutDashboard size={14} /> Panel Analítico
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
            Toda tu información laboral en un solo lugar.
          </h2>
          <p className="text-xl text-slate-600 font-light leading-relaxed">
            Consulta los resultados de tu organización mediante un dashboard centralizado diseñado para Recursos Humanos y administradores.
          </p>
        </div>

        {/* Dashboard Mockup Construction */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800">Grupo Empresarial</div>
                <div className="text-xs text-slate-500">Resultados de Evaluación</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium flex items-center gap-2">
                <Target size={14} /> Todas las zonas
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 font-medium flex items-center gap-2">
                <Calendar size={14} /> Periodo Activo
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-slate-50/50 space-y-6">
            
            {/* Top row */}
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Users className="text-emerald-500" size={18} /> Participación
                  </div>
                  <div className="text-2xl font-black text-slate-800">85%</div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
                  <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>Avance hacia la meta</span>
                  <span>128 / 150 colaboradores</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="font-bold text-slate-800 mb-2">Nivel de Riesgo Global</div>
                <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-200 font-bold mb-3 w-fit">
                  <AlertTriangle size={16} /> MEDIO
                </div>
                <div className="text-xs text-slate-500">Requiere revisión de políticas organizacionales.</div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-sm">Satisfacción (Herzberg)</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Factores Motivacionales</span>
                      <span className="text-indigo-600">72%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '72%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">Factores de Higiene</span>
                      <span className="text-teal-600">88%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-teal-500 h-2 rounded-full" style={{width: '88%'}}></div></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-sm">Riesgo por Zona (NOM-035)</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Operaciones</span>
                    <span className="px-2 py-1 text-xs font-bold rounded bg-orange-100 text-orange-700 border border-orange-200">ALTO</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Ventas</span>
                    <span className="px-2 py-1 text-xs font-bold rounded bg-yellow-100 text-yellow-700 border border-yellow-200">MEDIO</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Recursos Humanos</span>
                    <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-700 border border-green-200">BAJO</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
        
        {/* Floating Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-2xl mx-auto">
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">Participación</div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">Clima Laboral</div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">Resultados por Zona</div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">Factores de Riesgo</div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">Alertas Críticas</div>
          <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">Historial de Periodos</div>
        </div>

      </div>
    </section>
  );
}
