import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Matriz de Higiene vs. Motivación</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Clasifica a los departamentos en 4 cuadrantes. <strong>Eje X:</strong> Factores de Higiene (Salario, Condiciones). <strong>Eje Y:</strong> Factores Motivacionales (Logro, Reconocimiento). <br/>
        <em>Objetivo: Mover todos los puntos hacia el cuadrante superior derecho (Alta Higiene + Alta Motivación).</em>
      </p>

      <div className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis type="number" dataKey="x" name="Higiene" domain={[0, 100]} tick={{fontSize: 12}} label={{ value: 'Índice Higiene (0-100)', position: 'bottom', offset: 0, fontSize: 12 }} />
            <YAxis type="number" dataKey="y" name="Motivación" domain={[0, 100]} tick={{fontSize: 12}} label={{ value: 'Índice Motivacional (0-100)', angle: -90, position: 'left', offset: 0, fontSize: 12 }} />
            
            {/* Quadrant lines at 60 */}
            <ReferenceLine x={60} stroke="#94a3b8" strokeDasharray="3 3" />
            <ReferenceLine y={60} stroke="#94a3b8" strokeDasharray="3 3" />

            <Tooltip 
              cursor={{strokeDasharray: '3 3'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg">
                      <p className="font-bold text-slate-800 mb-1">{data.name}</p>
                      <p className="text-sm text-slate-600">Higiene: <span className="font-semibold">{data.x}%</span></p>
                      <p className="text-sm text-slate-600">Motivación: <span className="font-semibold">{data.y}%</span></p>
                      <p className="text-xs text-slate-400 mt-2">Muestra: {data.size} personas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Departamentos" data={data} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDotColor(entry.x, entry.y)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels */}
        <div className="absolute top-4 right-6 text-emerald-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Ideal</div>
        <div className="absolute bottom-10 left-16 text-red-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Riesgo Fuga</div>
        <div className="absolute bottom-10 right-6 text-amber-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Cómodos</div>
        <div className="absolute top-4 left-16 text-amber-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Apasionados / Quemados</div>
      </div>
    </div>
  );
}
