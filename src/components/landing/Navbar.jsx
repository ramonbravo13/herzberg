import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

export default function Navbar({ onLoginClick, user }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-lg">
              <Brain size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Clima Laboral IA
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('como-funciona')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cómo funciona</button>
            <button onClick={() => scrollTo('funcionalidades')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollTo('nom-035')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">NOM-035</button>
            <button onClick={() => scrollTo('precios')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Precios</button>
            <button onClick={() => scrollTo('faq')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Preguntas frecuentes</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLoginClick}
              className="group relative px-6 py-2.5 font-semibold text-white rounded-full bg-slate-900 hover:bg-slate-800 transition-all shadow-md hover:shadow-xl flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">{user ? 'Ir al Dashboard' : 'Solicitar una demo'}</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
