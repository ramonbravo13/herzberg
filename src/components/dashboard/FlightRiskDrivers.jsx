import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';

export default function FlightRiskDrivers({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  // permanencia <= 2 => High flight risk (quiero irme pronto o muy pronto)
  const leaving = dataArray.filter(d => d.respuestas && d.respuestas.permanencia <= 2);
  const staying = dataArray.filter(d => d.respuestas && d.respuestas.permanencia > 2);

  if (leaving.length === 0 || staying.length === 0) return null;

  // Calculate scores for all questions for both groups
  const gaps = Object.keys(QUESTION_MAP).map(key => {
    const scoreLeaving = calculateIndex([key], leaving);
    const scoreStaying = calculateIndex([key], staying);
    const gap = scoreStaying - scoreLeaving; // Positive gap means leaving people scored it much lower
    return { key, text: QUESTION_MAP[key], scoreLeaving, scoreStaying, gap };
  });

  // Sort by biggest gap
  gaps.sort((a, b) => b.gap - a.gap);

  const top3 = gaps.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Drivers de Fuga de Talento</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Compara a los colaboradores en alto riesgo de renuncia contra el resto de la empresa. Identifica los factores específicos donde la brecha es mayor; es decir, **lo que realmente los está empujando a irse**.
      </p>

      <div className="space-y-4">
        {top3.map((item, index) => (
          <div key={item.key} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-semibold text-slate-800 text-sm mb-3">#{index + 1} {item.text}</h4>
            
            <div className="space-y-2">
              <div className="flex items-center text-xs">
                <div className="w-24 text-slate-500 font-medium truncate">Se Quedan:</div>
                <div className="flex-1 bg-slate-200 rounded-full h-2 mx-3">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{width: `${item.scoreStaying}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-slate-600">{item.scoreStaying}%</div>
              </div>
              
              <div className="flex items-center text-xs">
                <div className="w-24 text-red-500 font-medium truncate">Se Van:</div>
                <div className="flex-1 bg-red-100 rounded-full h-2 mx-3">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: `${item.scoreLeaving}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-red-600">{item.scoreLeaving}%</div>
              </div>
            </div>

            <div className="mt-3 text-right text-xs text-slate-400 italic">
              Brecha: <strong className="text-red-500">-{item.gap}%</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
        <div>Riesgo Fuga: {leaving.length}</div>
        <div>Resto: {staying.length}</div>
      </div>
    </div>
  );
}
