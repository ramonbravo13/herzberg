import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';

export default function QuadrantMatrix({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null; // Needs aggregated data to be useful

  // Group by department
  const deptoMap = {};
  dataArray.forEach(d => {
    if (!d.departamento) return;
    if (!deptoMap[d.departamento]) deptoMap[d.departamento] = [];
    deptoMap[d.departamento].push(d);
  });

  const motivacionalVars = INDICES_CONFIG.find(i => i.name === 'Motivacional').vars;
  const higieneVars = INDICES_CONFIG.find(i => i.name === 'Higiene').vars;

  const data = Object.keys(deptoMap).map(depto => {
    const arr = deptoMap[depto];
    return {
      name: depto,
      x: calculateIndex(higieneVars, arr), // Higiene on X
      y: calculateIndex(motivacionalVars, arr), // Motivacion on Y
      size: arr.length
    };
  });

  // Calculate colors based on quadrants (threshold 60)
  const getDotColor = (x, y) => {
    if (x >= 60 && y >= 60) return '#10b981'; // Ideal
    if (x < 60 && y < 60) return '#ef4444'; // Riesgo
    return '#f59e0b'; // Mixed
  };

  return (
    <ChartCard 
      title="Matriz de Higiene vs. Motivación"
      subtitle={<>Clasifica a los departamentos en 4 cuadrantes. <strong>Eje X:</strong> Factores de Higiene (Salario, Condiciones). <strong>Eje Y:</strong> Factores Motivacionales (Logro, Reconocimiento). <br/><em>Objetivo: Mover todos los puntos hacia el cuadrante superior derecho (Alta Higiene + Alta Motivación).</em></>}
    >
      <div className="h-[400px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} opacity={0.8} />
            <XAxis type="number" dataKey="x" name="Higiene" domain={[0, 100]} {...chartTheme.axis} label={{ value: 'Índice Higiene (0-100)', position: 'bottom', offset: 0, fontSize: 12, fill: '#64748b' }} />
            <YAxis type="number" dataKey="y" name="Motivación" domain={[0, 100]} {...chartTheme.axis} label={{ value: 'Índice Motivacional (0-100)', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#64748b' }} />
            
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
                      <p className="text-sm text-slate-600">Higiene: <span className="font-bold text-slate-800">{data.x}%</span></p>
                      <p className="text-sm text-slate-600 mt-1">Motivación: <span className="font-bold text-slate-800">{data.y}%</span></p>
                      <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wider">Muestra: {data.size} personas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Departamentos" data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDotColor(entry.x, entry.y)} className="hover:opacity-80 transition-opacity duration-300" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels */}
        <div className="absolute top-4 right-6 text-emerald-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Ideal</div>
        <div className="absolute bottom-10 left-16 text-red-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Riesgo Fuga</div>
        <div className="absolute bottom-10 right-6 text-amber-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Cómodos</div>
        <div className="absolute top-4 left-16 text-amber-500/40 font-black text-lg pointer-events-none uppercase tracking-widest">Apasionados / Quemados</div>
      </div>
    </ChartCard>
  );
}
