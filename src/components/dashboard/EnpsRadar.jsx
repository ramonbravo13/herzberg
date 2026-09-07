import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientColor } from '../../utils/themeColors';

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
              !isVisible('promoters') ? 'bg-white text-slate-400 border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50' : ''
            }`}
            style={isVisible('promoters') ? { backgroundColor: getGradientColor(categoryColors['Promotores'], 0.1), color: categoryColors['Promotores'], borderColor: getGradientColor(categoryColors['Promotores'], 0.2) } : {}}
          >
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: isVisible('promoters') ? categoryColors['Promotores'] : '#cbd5e1' }}></div>
            Promotores ({promotores.length})
          </button>

          <button 
            onClick={() => toggleSegment('passives')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 border flex items-center gap-2 focus:outline-none active:scale-95 ${
              !isVisible('passives') ? 'bg-white text-slate-400 border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50' : ''
            }`}
            style={isVisible('passives') ? { backgroundColor: getGradientColor(categoryColors['Pasivos'], 0.1), color: categoryColors['Pasivos'], borderColor: getGradientColor(categoryColors['Pasivos'], 0.2) } : {}}
          >
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: isVisible('passives') ? categoryColors['Pasivos'] : '#cbd5e1' }}></div>
            Pasivos ({pasivos.length})
          </button>

          <button 
            onClick={() => toggleSegment('detractors')}
            className={`px-4 py-1.5 rounded-full transition-all duration-300 border flex items-center gap-2 focus:outline-none active:scale-95 ${
              !isVisible('detractors') ? 'bg-white text-slate-400 border-slate-100 opacity-50 hover:opacity-100 hover:bg-slate-50' : ''
            }`}
            style={isVisible('detractors') ? { backgroundColor: getGradientColor(categoryColors['Detractores'], 0.1), color: categoryColors['Detractores'], borderColor: getGradientColor(categoryColors['Detractores'], 0.2) } : {}}
          >
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: isVisible('detractors') ? categoryColors['Detractores'] : '#cbd5e1' }}></div>
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
              <Radar name="Promotores" dataKey="Promotores" stroke={categoryColors['Promotores']} fill={categoryColors['Promotores']} fillOpacity={0.15} strokeWidth={2} animationDuration={800} animationEasing="ease-out" />
            )}
            {isVisible('passives') && (
              <Radar name="Pasivos" dataKey="Pasivos" stroke={categoryColors['Pasivos']} fill={categoryColors['Pasivos']} fillOpacity={0.1} strokeWidth={2} animationDuration={800} animationEasing="ease-out" />
            )}
            {isVisible('detractors') && (
              <Radar name="Detractores" dataKey="Detractores" stroke={categoryColors['Detractores']} fill={categoryColors['Detractores']} fillOpacity={0.15} strokeWidth={2} animationDuration={800} animationEasing="ease-out" />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
