import React from 'react';

export default function FinalCTA({ onDemoClick, onLoginClick }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-teal-50 opacity-50"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Conoce lo que vive tu equipo.
        </h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Obtén una visión más clara de tu organización y convierte la información de tus colaboradores en acciones.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onDemoClick}
            className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-xl active:scale-95"
          >
            Solicitar una demostración
          </button>
          <button 
            onClick={onLoginClick}
            className="px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Comenzar ahora
          </button>
        </div>
      </div>
    </section>
  );
}
