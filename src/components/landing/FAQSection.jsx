import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQSection() {
  const faqs = [
    {
      q: "¿Los colaboradores necesitan instalar una aplicación?",
      a: "No. La evaluación puede realizarse desde un navegador web (en computadora o dispositivo móvil) mediante el enlace correspondiente sin necesidad de descargas."
    },
    {
      q: "¿Puedo evaluar diferentes sucursales?",
      a: "Sí. El sistema permite crear zonas (micrositios) y asociarlas mediante enlaces específicos para segmentar automáticamente los resultados."
    },
    {
      q: "¿Puedo consultar periodos anteriores?",
      a: "Sí. El sistema conserva el historial de periodos, permitiéndote comparar la evolución del clima laboral de acuerdo con su funcionamiento actual."
    },
    {
      q: "¿La evaluación es anónima?",
      a: "El flujo ordinario está diseñado para realizarse de forma anónima. Existen flujos específicos relacionados con la evaluación NOM-035 que pueden requerir identificación conforme a la lógica actual del sistema para canalización médica."
    },
    {
      q: "¿Puedo conocer el nivel de participación?",
      a: "Sí. El sistema permite establecer metas de participación por sucursal o globales y visualizar el avance en tiempo real en el dashboard."
    },
    {
      q: "¿El sistema sustituye a un especialista en NOM-035?",
      a: "No. El software es una herramienta avanzada de evaluación y análisis. La interpretación profesional, las obligaciones laborales y las acciones correspondientes deben ser determinadas por personal competente dentro de tu organización."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-semibold text-slate-800 pr-8">{faq.q}</span>
                <ChevronDown 
                  className={`text-slate-400 shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 pt-0 text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
