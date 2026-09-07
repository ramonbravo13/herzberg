import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';

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
    <ChartCard 
      title="Drivers de Fuga de Talento"
      subtitle={<>Compara a los colaboradores en alto riesgo de renuncia contra el resto de la empresa. Identifica los factores específicos donde la brecha es mayor; es decir, <strong>lo que realmente los está empujando a irse</strong>.</>}
      footer={
        <div className="flex gap-6 text-xs font-semibold text-slate-500 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Riesgo Fuga: {leaving.length}</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Resto: {staying.length}</div>
        </div>
      }
    >
      <div className="space-y-4 mt-2">
        {top3.map((item, index) => (
          <div key={item.key} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:bg-white">
            <h4 className="font-bold text-slate-800 text-sm mb-4">#{index + 1} {item.text}</h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-xs">
                <div className="w-24 text-slate-500 font-semibold uppercase tracking-wider truncate">Se Quedan:</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-4 shadow-inner overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${item.scoreStaying}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-slate-700">{item.scoreStaying}%</div>
              </div>
              
              <div className="flex items-center text-xs">
                <div className="w-24 text-red-500 font-semibold uppercase tracking-wider truncate">Se Van:</div>
                <div className="flex-1 bg-red-50 rounded-full h-2.5 mx-4 shadow-inner overflow-hidden border border-red-100/50">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${item.scoreLeaving}%`}}></div>
                </div>
                <div className="w-10 text-right font-bold text-red-600">{item.scoreLeaving}%</div>
              </div>
            </div>

            <div className="mt-4 text-right text-xs text-slate-400 font-medium">
              Brecha: <strong className="text-red-500 ml-1">-{item.gap}%</strong>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
