import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import ChartGradients from '../charts/ChartGradients';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientUrl } from '../../utils/themeColors';

export default function HierarchyGap({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  const lideres = dataArray.filter(d => ['Directivo', 'Coordinación'].includes(d.nivel_puesto));
  const operativos = dataArray.filter(d => ['Operativo', 'Técnico', 'Administrativo'].includes(d.nivel_puesto));

  // If we don't have both groups, skip
  if (lideres.length === 0 || operativos.length === 0) return null;

  // We only compare a few key indices to not overcrowd the chart
  const selectedIndices = ['Liderazgo', 'Políticas', 'Condiciones Trabajo', 'Comunicación (Relaciones)'];
  // Actually, let's use the ones that typically show the biggest gap
  const compareIndices = INDICES_CONFIG.filter(i => 
    ['Liderazgo', 'Políticas', 'Condiciones Trabajo', 'Reconocimiento', 'Relaciones Laborales'].includes(i.name)
  );

  const chartData = compareIndices.map(ind => {
    return {
      name: ind.name,
      'Líderes': calculateIndex(ind.vars, lideres),
      'Operativos': calculateIndex(ind.vars, operativos)
    };
  });

  return (
    <ChartCard 
      title="Brecha Jerárquica (&quot;Ceguera de Taller&quot;)"
      subtitle="Compara la percepción de los líderes (Coordinación/Directivos) contra la base operativa. Una brecha grande indica que los directivos perciben una realidad mucho más positiva (o desconectada) que el resto de la empresa."
      footer={
        <div className="flex gap-6 text-xs font-semibold text-slate-500 justify-center">
          <div>Muestra Líderes: {lideres.length}</div>
          <div>Muestra Operativos: {operativos.length}</div>
        </div>
      }
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
            <ChartGradients />
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} vertical={false} strokeOpacity={0.4} />
            <XAxis dataKey="name" {...chartTheme.axis} />
            <YAxis domain={[0, 100]} {...chartTheme.axis} />
            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={<ChartTooltip formatter={(val) => `${Number(val).toFixed(1)}%`} />}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="Líderes" fill={getGradientUrl(categoryColors['Líderes'])} radius={chartTheme.bar.radius} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out" />
            <Bar dataKey="Operativos" fill={getGradientUrl(categoryColors['Operativos'])} radius={chartTheme.bar.radius} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
