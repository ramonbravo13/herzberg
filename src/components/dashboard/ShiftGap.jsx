import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { calculateIndex } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import ChartGradients from '../charts/ChartGradients';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientUrl } from '../../utils/themeColors';
import { Clock } from 'lucide-react';

const SHIFT_ORDER = {
  "Turno matutino": 1,
  "Turno vespertino": 2,
  "Turno nocturno": 3,
  "Esquema rotativo": 4
};

export default function ShiftGap({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  // Group by turno
  const turnoMap = {};
  let hasTurnoData = false;

  dataArray.forEach(d => {
    if (!d.turno) return;
    hasTurnoData = true;
    if (!turnoMap[d.turno]) turnoMap[d.turno] = [];
    turnoMap[d.turno].push(d);
  });

  if (!hasTurnoData) return null;

  const turnos = Object.keys(turnoMap).sort((a, b) => (SHIFT_ORDER[a] || 99) - (SHIFT_ORDER[b] || 99));

  const chartData = turnos.map(turno => {
    const arr = turnoMap[turno];
    let promotores = 0;
    let detractores = 0;
    let total = 0;
    arr.forEach(a => {
      if (a.respuestas && a.respuestas.enps !== undefined) {
        const val = Number(a.respuestas.enps);
        total++;
        if (val >= 9) promotores++;
        else if (val <= 6) detractores++;
      }
    });
    
    // Scale eNPS using standard NPS formula (-100 to 100)
    const enpsScaled = total > 0 ? Math.round(((promotores - detractores) / total) * 100) : 0;

    return {
      name: turno,
      satisfaccion: calculateIndex(['satisfaccion_global'], arr),
      enps: enpsScaled,
      size: arr.length
    };
  });

  return (
    <ChartCard 
      title="Brecha por Turno de Trabajo"
      subtitle="Compara la Satisfacción Global y el nivel de recomendación (eNPS) entre los diferentes turnos laborales."
      icon={Clock}
    >
      <div className="h-[350px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <ChartGradients />
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} vertical={false} strokeOpacity={0.4} />
            <XAxis dataKey="name" {...chartTheme.axis} />
            <YAxis domain={['auto', 100]} {...chartTheme.axis} />
            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={(props) => {
                if (props.active && props.payload && props.payload.length) {
                  const size = props.payload[0].payload.size;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                      <p className="font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">{props.label}</p>
                      <div className="space-y-1.5">
                        {props.payload.map(p => {
                          const displayVal = p.dataKey === 'enps' ? Number(p.value).toFixed(0) + ' (eNPS)' : Number(p.value).toFixed(1) + '%';
                          return (
                            <div key={p.dataKey} className="flex items-center justify-between gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: p.color }} />
                                <span className="text-slate-600 font-medium">{p.name}</span>
                              </div>
                              <span className="font-bold text-slate-800">{displayVal}</span>
                            </div>
                          );
                        })}
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
            <Bar dataKey="enps" name="eNPS Promedio" fill={getGradientUrl('#3b82f6')} radius={chartTheme.bar.radius} className="hover:opacity-80 transition-opacity duration-300" animationDuration={800} animationEasing="ease-out" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
