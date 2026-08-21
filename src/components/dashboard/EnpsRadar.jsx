import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';

export default function EnpsRadar({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  const promotores = dataArray.filter(d => d.respuestas && d.respuestas.enps >= 9);
  const pasivos = dataArray.filter(d => d.respuestas && d.respuestas.enps >= 7 && d.respuestas.enps <= 8);
  const detractores = dataArray.filter(d => d.respuestas && d.respuestas.enps <= 6);

  if (promotores.length === 0 && detractores.length === 0) return null;

  // Reduce indices down to the main 4 or 5 for a clean radar
  const radarIndices = INDICES_CONFIG.filter(i => 
    ['Motivacional', 'Higiene', 'Desarrollo Prof.', 'Liderazgo', 'Relaciones Laborales'].includes(i.name)
  );

  const chartData = radarIndices.map(ind => {
    return {
      subject: ind.name,
      Promotores: calculateIndex(ind.vars, promotores),
      Pasivos: calculateIndex(ind.vars, pasivos),
      Detractores: calculateIndex(ind.vars, detractores),
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">ADN del eNPS (Promotores vs Detractores)</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Compara los niveles de satisfacción entre los Promotores (los que aman la empresa) y los Detractores. Revela qué factores exactos construyen embajadores de marca y cuáles generan detractores.
      </p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{fontSize: 11, fill: '#64748b'}} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fontSize: 10}} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Radar name="Promotores" dataKey="Promotores" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Radar name="Pasivos" dataKey="Pasivos" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
            <Radar name="Detractores" dataKey="Detractores" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-slate-500 justify-center">
        <div>Promotores: {promotores.length}</div>
        <div>Pasivos: {pasivos.length}</div>
        <div>Detractores: {detractores.length}</div>
      </div>
    </div>
  );
}
