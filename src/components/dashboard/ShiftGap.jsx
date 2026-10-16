import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { calculateIndex, calculateEnps } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import ChartGradients from '../charts/ChartGradients';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientUrl } from '../../utils/themeColors';
import { Clock } from 'lucide-react';

import EmptyState from '../ui/EmptyState';

const SHIFT_ORDER = {
  "Turno matutino": 1,
  "Turno vespertino": 2,
  "Turno nocturno": 3,
  "Esquema rotativo": 4
};

export default function ShiftGap({ dataArray }) {
  if (!Array.isArray(dataArray) || dataArray.length < 2) {
    return (
      <ChartCard title="Brecha por Turno de Trabajo" icon={Clock}>
        <EmptyState title="Muestra insuficiente por turno" description="Se requieren al menos 2 evaluaciones para contrastar la satisfacción entre turnos." />
      </ChartCard>
    );
  }

  // Group by turno
  const turnoMap = {};
  let hasTurnoData = false;

  dataArray.forEach(d => {
    if (!d.turno) return;
    hasTurnoData = true;
    if (!turnoMap[d.turno]) turnoMap[d.turno] = [];
    turnoMap[d.turno].push(d);
  });

  if (!hasTurnoData) {
    return (
      <ChartCard title="Brecha por Turno de Trabajo" icon={Clock}>
        <EmptyState title="Sin datos de turno" description="Ningún colaborador evaluado en este filtro tiene registrado su turno de trabajo." />
      </ChartCard>
    );
  }

  const turnos = Object.keys(turnoMap).sort((a, b) => (SHIFT_ORDER[a] || 99) - (SHIFT_ORDER[b] || 99));

  const chartData = turnos.map(turno => {
    const arr = turnoMap[turno];
    const enpsResult = calculateEnps(arr);

    return {
      name: turno,
      satisfaccion: calculateIndex(['satisfaccion_global'], arr),
      enps: enpsResult.score,
      size: arr.length
    };
  });

  return (
    <ChartCard 
      title="Brecha por Turno de Trabajo"
      subtitle={<>Compara la Satisfacción Global y el nivel de recomendación (eNPS) entre turnos.<br/><br/><strong>Interpretación:</strong> La línea roja horizontal marca el punto crítico de lealtad (eNPS = 0). Si la barra de eNPS cae por debajo del 0, significa que hay más detractores que promotores en ese turno, lo que requiere intervención urgente.</>}
      icon={Clock}
    >
      <div className="h-[350px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <ChartGradients />
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} vertical={false} strokeOpacity={0.4} />
            <XAxis dataKey="name" {...chartTheme.axis} />
            <YAxis domain={[-100, 100]} {...chartTheme.axis} />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.7} label={{ value: "Punto Crítico eNPS (0)", position: "insideBottomLeft", fill: "#ef4444", fontSize: 11, offset: 5 }} />
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
