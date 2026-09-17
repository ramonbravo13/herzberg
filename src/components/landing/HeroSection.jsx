import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ onDemoClick }) {
  return (
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs tracking-widest uppercase mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-teal-500"></span>
              Clima Laboral · IA · NOM-035
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
              Escucha a tu equipo. <br/><span className="text-teal-600">Entiende tu organización.</span>
            </h1>
            
            <p className="mt-4 text-xl text-slate-600 mb-10 font-light leading-relaxed">
              Evalúa el clima laboral, descubre qué motiva a tus colaboradores y analiza los factores de riesgo psicosocial desde una sola plataforma inteligente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onDemoClick}
                className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-lg shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95 text-center"
              >
                Solicitar una demostración
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('como-funciona');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-lg shadow-sm hover:bg-slate-50 transition-all text-center"
              >
                Conocer la plataforma
              </button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 to-blue-50 rounded-[3rem] transform rotate-3 scale-105 opacity-50 blur-xl"></div>
            
            {/* Fake Dashboard UI elements for Hero */}
            <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Participación General</div>
                  <div className="text-xs text-slate-500">Periodo actual</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-black text-slate-800">85%</div>
                  <div className="text-xs text-emerald-500 font-medium">+12% vs ciclo anterior</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between mb-2 text-sm font-semibold text-slate-700">
                    <span>Clima Organizacional</span>
                    <span className="text-teal-600">Favorable</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="text-xs font-semibold text-orange-800 mb-1">Riesgo NOM-035</div>
                    <div className="text-2xl font-black text-orange-600">Medio</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <div className="text-xs font-semibold text-emerald-800 mb-1">Motivación</div>
                    <div className="text-2xl font-black text-emerald-600">Alta</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 -bottom-6 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex items-center gap-3"
            >
              <div className="bg-teal-500/20 p-2 rounded-lg text-teal-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400">Feedback recibido</div>
                <div className="text-sm font-bold">Análisis instantáneo</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
