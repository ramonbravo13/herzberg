import React from 'react';

export default function PricingSection() {
  return (
    <section id="precios" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Planes diseñados para tu organización</h2>
          <p className="text-slate-600 text-lg">Plataforma de evaluación continua. Cancela cuando quieras.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="py-5 px-6 font-semibold border-b border-slate-700">Colaboradores</th>
                  <th className="py-5 px-6 font-semibold border-b border-slate-700 text-right">Mensual (MXN)</th>
                  <th className="py-5 px-6 font-semibold border-b border-slate-700 text-right text-teal-300">Anual (MXN) <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded ml-2">Ahorra 2 meses</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">1 – 50</td>
                  <td className="py-4 px-6 text-right text-slate-600">$799</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">$7,990</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">51 – 150</td>
                  <td className="py-4 px-6 text-right text-slate-600">$1,499</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">$14,990</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors bg-indigo-50/30">
                  <td className="py-4 px-6 font-medium text-indigo-900">151 – 300 <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">Popular</span></td>
                  <td className="py-4 px-6 text-right text-slate-600">$2,499</td>
                  <td className="py-4 px-6 text-right font-bold text-indigo-700">$24,990</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">301 – 500</td>
                  <td className="py-4 px-6 text-right text-slate-600">$3,999</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">$39,990</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">501 – 1,000</td>
                  <td className="py-4 px-6 text-right text-slate-600">$6,999</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">$69,990</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">1,000+</td>
                  <td className="py-4 px-6 text-right text-slate-600">Cotizar</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">Cotizar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-4">Todos los planes incluyen accesos ilimitados al dashboard, encuestas conversacionales y reportes NOM-035.</p>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-md">
              Solicitar Cotización
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
}
