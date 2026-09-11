import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';
import { Target, Info } from 'lucide-react';
import ChartCard from '../charts/ChartCard';
import { getGradientColor } from '../../utils/themeColors';

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

  // Determine global card color based on the lowest score (the #1 priority)
  const lowestScore = top3[0]?.score || 0;
  const globalHex = lowestScore < 60 ? '#ef4444' : (lowestScore < 80 ? '#f59e0b' : '#10b981'); 

  // Helper to get color per item
  const getItemColor = (score) => {
    if (score < 60) return '#ef4444'; // Red
    if (score < 80) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  return (
    <ChartCard 
      title="Top 3 Áreas de Oportunidad (Prioridades de Mejora)"
      subtitle="Muestra los 3 reactivos (preguntas) de la encuesta que obtuvieron la calificación más baja. Son el punto de partida estratégico para la mejora del clima laboral."
      icon={Target}
      iconStyle={{ backgroundColor: getGradientColor(globalHex, 0.1), color: globalHex, borderColor: getGradientColor(globalHex, 0.2) }}
      className="shadow-sm border-l-4"
      style={{ borderLeftColor: globalHex }}
    >
      <div className="space-y-4 mt-2">
        {top3.map((item, index) => {
          const itemHex = getItemColor(item.score);
          return (
            <div key={item.key} className="flex items-center p-5 rounded-2xl border transition-all hover:shadow-md" style={{ backgroundColor: getGradientColor(itemHex, 0.05), borderColor: getGradientColor(itemHex, 0.2) }}>
              <div className="text-3xl font-black mr-5 opacity-30" style={{ color: itemHex }}>#{index + 1}</div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm leading-relaxed">"{item.text}"</h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Nivel de Aprobación</p>
              </div>
              <div className="ml-5 flex flex-col items-end justify-center">
                <div className="text-3xl font-black tracking-tight" style={{ color: itemHex }}>{item.score}%</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 text-slate-600 text-sm leading-relaxed">
        <Info size={18} className="shrink-0 text-slate-400 mt-0.5" />
        <p>
          <strong>¿Qué nos dice este porcentaje?</strong><br/>
          Representa el nivel de satisfacción global sobre esta pregunta específica (donde 100% es la máxima excelencia). 
          Al aparecer aquí, significa que son los 3 reactivos con la calificación más baja de <strong>toda la evaluación</strong>. 
          Independientemente de si el porcentaje te parece alto o bajo, representan el "talón de Aquiles" de la organización y el área con mayor margen de oportunidad para intervenir.
        </p>
      </div>
    </ChartCard>
  );
}
