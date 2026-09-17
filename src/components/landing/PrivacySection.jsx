import React from 'react';
import { Lock, EyeOff, ShieldCheck } from 'lucide-react';

export default function PrivacySection() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">La confianza de tus colaboradores es parte del proceso.</h2>
          <p className="text-xl text-slate-600 font-light">
            Diseñada para facilitar evaluaciones confidenciales y una experiencia de participación sencilla.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
              <EyeOff size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-3">Evaluación Anónima</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              El flujo ordinario de la encuesta está diseñado para realizarse de forma anónima, promoviendo la sinceridad en las respuestas del equipo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
              <Lock size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-3">Protección de la Experiencia</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              La segmentación mediante enlaces y el control de duplicidad protegen la integridad de los datos sin comprometer la facilidad de uso.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-3">Flujo Específico NOM-035</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              El sistema incluye un flujo integrado para casos contemplados por la lógica NOM-035 que pueden requerir identificación del personal.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
