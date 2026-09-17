import React from 'react';
import { Brain } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={28} className="text-teal-500" />
              <span className="font-bold text-2xl text-white">Clima Laboral IA</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Plataforma integral para evaluación de clima laboral, satisfacción y factores de riesgo psicosocial orientada a transformar la gestión de Recursos Humanos.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Plataforma</h4>
            <ul className="space-y-3">
              <li><button onClick={() => window.scrollTo(0,0)} className="hover:text-white transition-colors">Inicio</button></li>
              <li><button onClick={() => scrollTo('funcionalidades')} className="hover:text-white transition-colors">Funcionalidades</button></li>
              <li><button onClick={() => scrollTo('nom-035')} className="hover:text-white transition-colors">NOM-035</button></li>
              <li><button onClick={() => scrollTo('precios')} className="hover:text-white transition-colors">Precios</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Legal & Soporte</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos de servicio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} Clima Laboral IA. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sistemas operando</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
