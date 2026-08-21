import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';

export default function TopRisks({ dataArray }) {
  if (!dataArray || dataArray.length === 0) return null;

  // Calculate score for each question
  const scores = Object.keys(QUESTION_MAP).map(key => {
    const score = calculateIndex([key], dataArray);
    return { key, text: QUESTION_MAP[key], score };
  });

  // Sort ascending by score
  scores.sort((a, b) => a.score - b.score);

  // Take top 3
  const top3 = scores.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Top 3 Focos Rojos de Acción</h2>
      </div>
      <p className="text-sm text-slate-600 mb-6">Estas son las 3 preguntas exactas con peor calificación en toda la evaluación. Representan las áreas de riesgo más críticas que requieren atención inmediata por parte del liderazgo.</p>
      
      <div className="space-y-4">
        {top3.map((item, index) => (
          <div key={item.key} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-2xl font-black text-red-400 opacity-50 mr-4">#{index + 1}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 text-sm leading-tight">{item.text}</h4>
            </div>
            <div className="ml-4 flex flex-col items-end">
              <div className="text-xl font-bold text-red-600">{item.score}%</div>
              <div className="text-xs text-red-400 font-medium uppercase tracking-wider">Riesgo Alto</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
