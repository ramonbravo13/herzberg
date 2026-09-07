import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';

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
    <ChartCard 
      title="ADN del eNPS (Promotores vs Detractores)"
      subtitle="Compara los niveles de satisfacción entre los Promotores (los que aman la empresa) y los Detractores. Revela qué factores exactos construyen embajadores de marca y cuáles generan detractores."
      footer={
        <div className="flex gap-6 text-xs font-semibold text-slate-500 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Promotores: {promotores.length}</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Pasivos: {pasivos.length}</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Detractores: {detractores.length}</div>
        </div>
      }
    >
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke={chartTheme.grid.stroke} />
            <PolarAngleAxis dataKey="subject" tick={{fontSize: 11, fill: '#64748b', fontWeight: 500}} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fontSize: 10, fill: '#94a3b8'}} tickCount={6} axisLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={chartTheme.tooltip.cursor} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            <Radar name="Promotores" dataKey="Promotores" stroke={chartTheme.colors.success} fill={chartTheme.colors.success} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Pasivos" dataKey="Pasivos" stroke={chartTheme.colors.warning} fill={chartTheme.colors.warning} fillOpacity={0.1} strokeWidth={2} />
            <Radar name="Detractores" dataKey="Detractores" stroke={chartTheme.colors.danger} fill={chartTheme.colors.danger} fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
