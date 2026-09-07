import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';

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

  const getDotColor = (x, y) => {
    if (x >= 3.5 && y >= 3.5) return '#10b981'; // Apóstoles
    if (x < 3.5 && y < 3.5) return '#ef4444'; // Saboteadores
    if (x >= 3.5 && y < 3.5) return '#3b82f6'; // Mercenarios
    return '#f59e0b'; // Rehenes
  };

  return (
    <ChartCard 
      title="Matriz de Retención y Cultura"
      subtitle="Cruza la Satisfacción Global contra la Intención de Permanencia de cada colaborador. Entender en qué cuadrante se encuentra tu talento es vital para tu estrategia de recursos humanos:"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-xs shadow-[0_2px_10px_-4px_rgba(16,185,129,0.1)]">
          <strong className="text-emerald-700 block mb-1.5 uppercase tracking-widest font-bold text-[10px]">Apóstoles (Verde)</strong>
          <span className="text-emerald-700/80 font-medium">Alta satisfacción y alta permanencia. Son el talento ideal, embajadores naturales de tu marca empleadora.</span>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-xs shadow-[0_2px_10px_-4px_rgba(59,130,246,0.1)]">
          <strong className="text-blue-700 block mb-1.5 uppercase tracking-widest font-bold text-[10px]">Mercenarios (Azul)</strong>
          <span className="text-blue-700/80 font-medium">Alta satisfacción, baja permanencia. Están cómodos pero tienen alto riesgo de fuga si llega una mejor oferta.</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-xs shadow-[0_2px_10px_-4px_rgba(245,158,11,0.1)]">
          <strong className="text-amber-700 block mb-1.5 uppercase tracking-widest font-bold text-[10px]">Rehenes (Naranja)</strong>
          <span className="text-amber-700/80 font-medium">Baja satisfacción, alta permanencia. No renuncian por comodidad o miedo, pero merman la productividad y el clima.</span>
        </div>
        <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl text-xs shadow-[0_2px_10px_-4px_rgba(239,68,68,0.1)]">
          <strong className="text-red-700 block mb-1.5 uppercase tracking-widest font-bold text-[10px]">Saboteadores (Rojo)</strong>
          <span className="text-red-700/80 font-medium">Baja satisfacción, baja permanencia. Desgaste total, listos para renunciar y potencialmente conflictivos.</span>
        </div>
      </div>

      <div className="h-[400px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} opacity={0.8} />
            <XAxis type="number" dataKey="x" name="Satisfacción" domain={[1, 5]} tickCount={5} {...chartTheme.axis} label={{ value: 'Satisfacción Global (1-5)', position: 'bottom', offset: 0, fontSize: 12, fill: '#64748b' }} />
            <YAxis type="number" dataKey="y" name="Permanencia" domain={[1, 5]} tickCount={5} {...chartTheme.axis} label={{ value: 'Intención Permanencia (1-5)', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#64748b' }} />
            
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
            <Scatter name="Colaboradores" data={jitterData} opacity={0.7}>
              {jitterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDotColor(entry.x, entry.y)} className="hover:opacity-100 transition-opacity duration-300" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <div className="absolute top-4 right-6 text-emerald-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Apóstoles</div>
        <div className="absolute bottom-10 left-16 text-red-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Saboteadores</div>
        <div className="absolute bottom-10 right-6 text-blue-500/40 font-black text-lg pointer-events-none uppercase tracking-widest text-right">Mercenarios <span className="block text-xs normal-case font-medium opacity-80 tracking-normal">(Riesgo Fuga)</span></div>
        <div className="absolute top-4 left-16 text-amber-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Rehenes <span className="block text-xs normal-case font-medium opacity-80 tracking-normal">(Riesgo Tóxico)</span></div>
      </div>
    </ChartCard>
  );
}
