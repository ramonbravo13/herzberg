import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';

export default function EnpsRadar({ dataArray }) {
  const [selectedSegment, setSelectedSegment] = useState('all');

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

  const toggleSegment = (segment) => {
    if (selectedSegment === segment && segment !== 'all') {
      setSelectedSegment('all');
    } else {
      setSelectedSegment(segment);
    }
  };

  const isVisible = (segment) => selectedSegment === 'all' || selectedSegment === segment;

  return (
    <ChartCard 
      title="ADN del eNPS (Promotores vs Detractores)"
      subtitle="Compara los niveles de satisfacción entre los Promotores (los que aman la empresa) y los Detractores. Revela qué factores exactos construyen embajadores de marca y cuáles generan detractores."
      footer={
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm font-semibold justify-center mt-2 pb-2">
          <button 
            onClick={() => setSelectedSegment('all')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 border focus:outline-none active:scale-95 ${
              selectedSegment === 'all' 
                ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 opacity-70'
            }`}
          >
            Todos
          </button>
          
          <button 
            onClick={() => toggleSegment('promoters')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 border flex items-center gap-2 focus:outline-none active:scale-95 ${
              isVisible('promoters')
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
                : 'bg-white text-slate-400 border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isVisible('promoters') ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            Promotores ({promotores.length})
          </button>

          <button 
            onClick={() => toggleSegment('passives')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 border flex items-center gap-2 focus:outline-none active:scale-95 ${
              isVisible('passives')
                ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' 
                : 'bg-white text-slate-400 border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isVisible('passives') ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
            Pasivos ({pasivos.length})
          </button>

          <button 
            onClick={() => toggleSegment('detractors')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 border flex items-center gap-2 focus:outline-none active:scale-95 ${
              isVisible('detractors')
                ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' 
                : 'bg-white text-slate-400 border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isVisible('detractors') ? 'bg-red-500' : 'bg-slate-300'}`}></div>
            Detractores ({detractores.length})
          </button>
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
            {isVisible('promoters') && (
              <Radar name="Promotores" dataKey="Promotores" stroke={chartTheme.colors.success} fill={chartTheme.colors.success} fillOpacity={0.15} strokeWidth={2} animationDuration={800} animationEasing="ease-out" />
            )}
            {isVisible('passives') && (
              <Radar name="Pasivos" dataKey="Pasivos" stroke={chartTheme.colors.warning} fill={chartTheme.colors.warning} fillOpacity={0.1} strokeWidth={2} animationDuration={800} animationEasing="ease-out" />
            )}
            {isVisible('detractors') && (
              <Radar name="Detractores" dataKey="Detractores" stroke={chartTheme.colors.danger} fill={chartTheme.colors.danger} fillOpacity={0.15} strokeWidth={2} animationDuration={800} animationEasing="ease-out" />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
