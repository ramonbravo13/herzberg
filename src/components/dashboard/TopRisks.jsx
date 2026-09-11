import React from 'react';
import { calculateIndex, QUESTION_MAP } from '../../utils/metrics';
import { AlertTriangle, Info } from 'lucide-react';
import ChartCard from '../charts/ChartCard';
import { categoryColors, getGradientColor } from '../../utils/themeColors';

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

  const riskHex = categoryColors['Riesgo de Rotación'] || '#ef4444'; // Pink -> Redish

  return (
    <ChartCard 
      title="Top 3 Focos de Acción Crítica (Áreas de Riesgo)"
      subtitle="Muestra los 3 reactivos (preguntas) de la encuesta que obtuvieron la calificación general más baja. Un porcentaje menor indica mayor insatisfacción y marca dónde se debe priorizar la intervención directiva."
      icon={AlertTriangle}
      iconStyle={{ backgroundColor: getGradientColor(riskHex, 0.1), color: riskHex, borderColor: getGradientColor(riskHex, 0.2) }}
      className="shadow-sm border-l-4"
      style={{ borderLeftColor: riskHex }}
    >
      <div className="space-y-4 mt-2">
        {top3.map((item, index) => (
          <div key={item.key} className="flex items-center p-5 rounded-2xl border transition-all hover:shadow-md" style={{ backgroundColor: getGradientColor(riskHex, 0.05), borderColor: getGradientColor(riskHex, 0.2) }}>
            <div className="text-3xl font-black mr-5 opacity-20" style={{ color: riskHex }}>#{index + 1}</div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm leading-relaxed">"{item.text}"</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Puntaje de aprobación de los empleados</p>
            </div>
            <div className="ml-5 flex flex-col items-end justify-center">
              <div className="text-3xl font-black tracking-tight" style={{ color: riskHex }}>{item.score}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 text-slate-600 text-sm leading-relaxed">
        <Info size={18} className="shrink-0 text-slate-400 mt-0.5" />
        <p>
          <strong>¿Cómo se interpreta este porcentaje?</strong><br/>
          Representa el nivel de satisfacción global sobre esta pregunta específica. 
          Un <strong>100%</strong> significaría que todos los colaboradores respondieron de forma excelente. 
          Al estar en esta lista con puntajes bajos, significa que una gran mayoría de los empleados calificó negativamente esta área, convirtiéndola en una prioridad de mejora urgente.
        </p>
      </div>
    </ChartCard>
  );
}
