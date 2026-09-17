import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, ShieldAlert } from 'lucide-react';

export default function ValueProposition() {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Mucho más que una encuesta laboral</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Una solución completa para escuchar, comprender y proteger el bienestar de tu equipo.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">01 — Encuestas conversacionales</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              Una experiencia de evaluación basada en conversación que sustituye el formulario tradicional y facilita la participación de los colaboradores.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">02 — Satisfacción laboral</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              Conoce los factores que generan satisfacción e insatisfacción mediante un modelo basado en la teoría de los dos factores de Herzberg.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">03 — NOM-035-STPS</h3>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              Analiza factores de riesgo psicosocial y organiza los resultados para facilitar el trabajo normativo de Recursos Humanos.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
