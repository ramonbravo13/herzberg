import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';
import { AlertTriangle } from 'lucide-react';
import ChartCard from '../charts/ChartCard';

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
    <ChartCard 
      title="Top 3 Focos Rojos de Acción"
      subtitle="Estas son las 3 preguntas exactas con peor calificación en toda la evaluación. Representan las áreas de riesgo más críticas que requieren atención inmediata por parte del liderazgo."
      icon={AlertTriangle}
      iconColor="text-red-500"
      iconBg="bg-red-50 border-red-100"
      className="border-red-200 shadow-[0_2px_15px_-3px_rgba(239,68,68,0.1)]"
    >
      <div className="space-y-4 mt-2">
        {top3.map((item, index) => (
          <div key={item.key} className="flex items-center p-5 bg-red-50/30 rounded-2xl border border-red-100/50 shadow-[0_2px_10px_-4px_rgba(239,68,68,0.05)] transition-all hover:bg-red-50/60 hover:shadow-md">
            <div className="text-3xl font-black text-red-500/20 mr-5">#{index + 1}</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm leading-relaxed">{item.text}</h4>
            </div>
            <div className="ml-5 flex flex-col items-end justify-center">
              <div className="text-2xl font-black text-red-600 tracking-tight">{item.score}%</div>
              <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Riesgo Alto</div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
