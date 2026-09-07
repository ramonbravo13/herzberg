import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { calculateIndex } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import ChartGradients from '../charts/ChartGradients';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientUrl } from '../../utils/themeColors';

// Order definition for tenure sorting
const TENURE_ORDER = {
  "Menos de 1 año": 1,
  "1–3 años": 2,
  "4–7 años": 3,
  "8–15 años": 4,
  "Más de 15 años": 5
};

export default function TenureGap({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  // Group by tenure
  const tenureMap = {};
  dataArray.forEach(d => {
    if (!d.antiguedad) return;
    if (!tenureMap[d.antiguedad]) tenureMap[d.antiguedad] = [];
    tenureMap[d.antiguedad].push(d);
  });

  const tenures = Object.keys(tenureMap).sort((a, b) => (TENURE_ORDER[a] || 99) - (TENURE_ORDER[b] || 99));

  const chartData = tenures.map(tenure => {
    const arr = tenureMap[tenure];
    return {
      name: tenure,
      satisfaccion: calculateIndex(['satisfaccion_global'], arr),
      riesgoRotacion: 100 - calculateIndex(['permanencia'], arr), // Remember, lower permanence = higher risk
      size: arr.length
    };
  });

  return (
    <ChartCard 
      title="Brecha por Antigüedad (Tenure Gap)"
      subtitle={<>Analiza cómo evoluciona la <strong>Satisfacción Global</strong> frente al <strong>Riesgo de Rotación</strong> a lo largo del ciclo de vida del colaborador en la organización.</>}
    >
      <div className="h-[350px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <ChartGradients />
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} vertical={false} strokeOpacity={0.4} />
            <XAxis dataKey="name" {...chartTheme.axis} />
            <YAxis domain={[0, 100]} {...chartTheme.axis} />
            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={(props) => {
                if (props.active && props.payload && props.payload.length) {
                  const size = props.payload[0].payload.size;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                      <p className="font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">{props.label}</p>
                      <div className="space-y-1.5">
                        {props.payload.map(p => (
                          <div key={p.dataKey} className="flex items-center justify-between gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                              <span className="text-slate-600 font-medium">{p.name}</span>
                            </div>
                            <span className="font-bold text-slate-800">{Number(p.value).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">Muestra: {size} personas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
            <Bar dataKey="satisfaccion" name="Satisfacción Global" fill={getGradientUrl(categoryColors['satisfaccion'])} radius={chartTheme.bar.radius} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out" />
            <Bar dataKey="riesgoRotacion" name="Riesgo de Rotación" fill={getGradientUrl(categoryColors['riesgoRotacion'])} radius={chartTheme.bar.radius} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
