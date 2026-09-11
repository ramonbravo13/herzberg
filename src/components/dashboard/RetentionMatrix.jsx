import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientColor } from '../../utils/themeColors';

export default function RetentionMatrix({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  const data = dataArray.map((d, index) => {
    return {
      id: index,
      x: d.respuestas ? d.respuestas.satisfaccion_global : 0, // 1 to 5
      y: d.respuestas ? d.respuestas.permanencia : 0, // 1 to 5
      depto: d.departamento
    };
  }).filter(d => d.x > 0 && d.y > 0);

  // We add some jitter so dots with exactly the same score don't completely overlap
  const jitterData = data.map(d => ({
    ...d,
    x: d.x + (Math.random() * 0.4 - 0.2),
    y: d.y + (Math.random() * 0.4 - 0.2)
  }));

  const getQuadrantCategory = (x, y) => {
    if (x >= 3.5 && y >= 3.5) return 'Apóstoles';
    if (x < 3.5 && y < 3.5) return 'Saboteadores';
    if (x >= 3.5 && y < 3.5) return 'Mercenarios';
    return 'Rehenes';
  };

  const quadColors = {
    'Apóstoles': categoryColors['Promotores'], // Green #92C65A
    'Saboteadores': categoryColors['Detractores'], // Pink #FB4777
    'Mercenarios': categoryColors['Pasivos'], // Yellow/Orange
    'Rehenes': '#FE9021' // Orange
  };

  return (
    <ChartCard 
      title="Matriz de Retención y Cultura"
      subtitle="Cruza la Satisfacción Global contra la Intención de Permanencia de cada colaborador. Entender en qué cuadrante se encuentra tu talento es vital para tu estrategia de recursos humanos:"
    >
      <div className="h-[320px] relative mt-2 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} opacity={0.3} />
            <XAxis type="number" dataKey="x" name="Satisfacción" domain={[1, 5]} tickCount={5} tickFormatter={(val) => Math.round(val)} {...chartTheme.axis} label={{ value: 'Satisfacción Global (1-5)', position: 'bottom', offset: 0, fontSize: 12, fill: '#64748b' }} />
            <YAxis type="number" dataKey="y" name="Permanencia" domain={[1, 5]} tickCount={5} tickFormatter={(val) => Math.round(val)} {...chartTheme.axis} label={{ value: 'Intención Permanencia (1-5)', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#64748b' }} />
            
            {/* Center dividers at 3.5 (since scale is 1 to 5) */}
            <ReferenceLine x={3.5} stroke="#cbd5e1" strokeDasharray="3 3" />
            <ReferenceLine y={3.5} stroke="#cbd5e1" strokeDasharray="3 3" />

            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={(props) => {
                if (props.active && props.payload && props.payload.length) {
                  const data = props.payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                      <p className="font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">{data.depto}</p>
                      <p className="text-sm text-slate-600 font-medium">Satisfacción: <span className="font-bold text-slate-800">{data.x.toFixed(1)}</span></p>
                      <p className="text-sm text-slate-600 font-medium mt-1">Permanencia: <span className="font-bold text-slate-800">{data.y.toFixed(1)}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Colaboradores" data={jitterData} opacity={0.7} animationDuration={800} animationEasing="ease-out">
              {jitterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={quadColors[getQuadrantCategory(entry.x, entry.y)]} className="hover:opacity-100 transition-opacity duration-300" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Legends (Watermarks) */}
        <div className="absolute top-6 right-8 text-right pointer-events-none z-0">
          <div className="text-emerald-500/70 font-black text-xl uppercase tracking-widest drop-shadow-sm">Apóstoles</div>
          <div className="text-emerald-600/70 text-[10px] font-bold leading-tight max-w-[130px] mt-1 bg-emerald-50/50 backdrop-blur-md px-2 py-1 rounded ml-auto border border-emerald-100/50">Alta satisfacción y retención natural.</div>
        </div>
        
        <div className="absolute bottom-16 left-20 pointer-events-none z-0">
          <div className="text-red-500/70 font-black text-xl uppercase tracking-widest drop-shadow-sm">Saboteadores</div>
          <div className="text-red-600/70 text-[10px] font-bold leading-tight max-w-[130px] mt-1 bg-red-50/50 backdrop-blur-md px-2 py-1 rounded border border-red-100/50">Baja satisfacción, baja permanencia.</div>
        </div>
        
        <div className="absolute bottom-16 right-8 text-right pointer-events-none z-0">
          <div className="text-amber-500/70 font-black text-xl uppercase tracking-widest drop-shadow-sm">Mercenarios</div>
          <div className="text-amber-600/70 text-[10px] font-bold leading-tight max-w-[140px] mt-1 bg-amber-50/50 backdrop-blur-md px-2 py-1 rounded ml-auto border border-amber-100/50">Satisfechos pero con riesgo de fuga.</div>
        </div>
        
        <div className="absolute top-6 left-20 pointer-events-none z-0">
          <div className="text-orange-500/70 font-black text-xl uppercase tracking-widest drop-shadow-sm">Rehenes</div>
          <div className="text-orange-600/70 text-[10px] font-bold leading-tight max-w-[130px] mt-1 bg-orange-50/50 backdrop-blur-md px-2 py-1 rounded border border-orange-100/50">No renuncian pero merman el clima.</div>
        </div>
      </div>
    </ChartCard>
  );
}
