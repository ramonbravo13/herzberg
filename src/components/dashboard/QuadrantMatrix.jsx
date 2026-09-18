import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calculateIndex, INDICES_CONFIG, getQuadrantInsight } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';
import { getCategoryColor } from '../../utils/themeColors';

export default function QuadrantMatrix({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null; // Needs aggregated data to be useful

  // Group by department or zone
  const deptoMap = {};
  dataArray.forEach(d => {
    const depto = d.departamento || d.zone || 'Sin Asignar';
    if (!deptoMap[depto]) deptoMap[depto] = [];
    deptoMap[depto].push(d);
  });

  const motivacionalVars = INDICES_CONFIG.find(i => i.name === 'Motivacional').vars;
  const higieneVars = INDICES_CONFIG.find(i => i.name === 'Higiene').vars;

  const data = Object.keys(deptoMap).map(depto => {
    const arr = deptoMap[depto];
    const xVal = calculateIndex(higieneVars, arr); // Higiene on X
    const yVal = calculateIndex(motivacionalVars, arr); // Motivacion on Y
    return {
      name: depto,
      x: xVal,
      y: yVal,
      size: arr.length,
      rulesEngine: getQuadrantInsight(xVal, yVal)
    };
  });



  return (
    <ChartCard 
      title="Matriz de Higiene vs. Motivación"
      subtitle={<>Cruza las dos variables clave de la empresa para clasificar a cada departamento en 4 realidades operativas. Tu objetivo directivo es empujar todos los puntos hacia la esquina superior derecha.<br/><br/>
        <ul className="grid grid-cols-2 gap-2 text-xs mt-2 opacity-90">
          <li>✨ <strong>Ideal:</strong> Alta Higiene + Alta Motivación.</li>
          <li>🥱 <strong>Cómodos:</strong> Alta Higiene + Baja Motivación.</li>
          <li>🔥 <strong>Quemados:</strong> Baja Higiene + Alta Motivación.</li>
          <li>🚨 <strong>Riesgo Fuga:</strong> Baja Higiene + Baja Motivación.</li>
        </ul>
      </>}
    >
      <div className="w-full h-[400px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} opacity={0.3} />
            <XAxis type="number" dataKey="x" name="Higiene" domain={[0, 100]} {...chartTheme.axis} label={{ value: 'Índice Higiene (0-100)', position: 'bottom', offset: 0, fontSize: 12, fill: '#64748b' }} />
            <YAxis type="number" dataKey="y" name="Motivación" domain={[0, 100]} {...chartTheme.axis} label={{ value: 'Índice Motivacional (0-100)', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#64748b' }} />
            <ZAxis type="number" dataKey="size" range={[200, 1000]} name="Muestra" />
            
            {/* Quadrant lines at 60 */}
            <ReferenceLine x={60} stroke="#cbd5e1" strokeDasharray="3 3" />
            <ReferenceLine y={60} stroke="#cbd5e1" strokeDasharray="3 3" />

            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={(props) => {
                if (props.active && props.payload && props.payload.length) {
                  const data = props.payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                      <p className="font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">{data.name}</p>
                      <p className="text-sm text-slate-600">Higiene: <span className="font-bold text-slate-800">{Number(data.x).toFixed(1)}%</span></p>
                      <p className="text-sm text-slate-600 mt-1">Motivación: <span className="font-bold text-slate-800">{Number(data.y).toFixed(1)}%</span></p>
                      
                      {data.rulesEngine && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60 max-w-[250px] whitespace-normal">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">{data.rulesEngine.status}</p>
                          <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{data.rulesEngine.insight}</p>
                          <p className="text-xs text-slate-600 leading-snug"><strong>Acción Sugerida:</strong> {data.rulesEngine.action}</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">Muestra: {data.size} personas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Departamentos" data={data} animationDuration={800} animationEasing="ease-out">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name, index)} className="hover:opacity-80 transition-opacity duration-300" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels */}
        <div className="absolute top-4 right-6 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Ideal</div>
        <div className="absolute bottom-10 left-16 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Riesgo Fuga</div>
        <div className="absolute bottom-10 right-6 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Cómodos</div>
        <div className="absolute top-4 left-16 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Apasionados / Quemados</div>
      </div>
    </ChartCard>
  );
}
