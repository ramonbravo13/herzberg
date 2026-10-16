import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import ChartGradients from '../charts/ChartGradients';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientUrl } from '../../utils/themeColors';
import EmptyState from '../ui/EmptyState';

export default function HierarchyGap({ dataArray }) {
  if (!Array.isArray(dataArray) || dataArray.length < 2) {
    return (
      <ChartCard 
        title='Brecha Jerárquica ("Ceguera de Taller")'
        subtitle="Compara la percepción de los líderes contra la base operativa."
      >
        <EmptyState title="Muestra insuficiente para Brecha Jerárquica" description="Se requieren al menos 2 evaluaciones para contrastar niveles de puesto." />
      </ChartCard>
    );
  }

  const lideres = dataArray.filter(d => ['Directivo', 'Coordinación'].includes(d.nivel_puesto));
  const operativos = dataArray.filter(d => ['Operativo', 'Técnico', 'Administrativo'].includes(d.nivel_puesto));

  // If we don't have both groups, show empty state
  if (lideres.length === 0 || operativos.length === 0) {
    return (
      <ChartCard 
        title='Brecha Jerárquica ("Ceguera de Taller")'
        subtitle="Compara la percepción de los líderes contra la base operativa."
      >
        <EmptyState 
          title="Falta representatividad de ambos niveles" 
          description={lideres.length === 0 ? "No hay respuestas de líderes (Directivos/Coordinación) en este filtro." : "No hay respuestas de personal operativo en este filtro."} 
        />
      </ChartCard>
    );
  }

  // We only compare a few key indices to not overcrowd the chart
  const compareIndices = INDICES_CONFIG.filter(i => 
    ['Liderazgo', 'Políticas Internas', 'Condiciones Trabajo', 'Reconocimiento', 'Relaciones Laborales'].includes(i.name)
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
          <BarChart data={chartData} margin={{ top: 25, right: 30, left: -20, bottom: 5 }}>
            <ChartGradients />
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} vertical={false} strokeOpacity={0.4} />
            <XAxis dataKey="name" {...chartTheme.axis} />
            <YAxis domain={[0, 100]} {...chartTheme.axis} />
            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={<ChartTooltip formatter={(val) => `${Number(val).toFixed(1)}%`} />}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="Líderes" fill={getGradientUrl(categoryColors['Líderes'])} radius={chartTheme.bar.radius} barSize={24} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out">
              <LabelList dataKey="Líderes" position="top" formatter={(val) => `${Number(val).toFixed(0)}%`} style={{ fill: '#334155', fontSize: '10px', fontWeight: 'bold' }} />
            </Bar>
            <Bar dataKey="Operativos" fill={getGradientUrl(categoryColors['Operativos'])} radius={chartTheme.bar.radius} barSize={24} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out">
              <LabelList dataKey="Operativos" position="top" formatter={(val) => `${Number(val).toFixed(0)}%`} style={{ fill: '#334155', fontSize: '10px', fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
