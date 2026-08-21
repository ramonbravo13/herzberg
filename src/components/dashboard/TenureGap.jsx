import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { calculateIndex } from '../../utils/metrics';

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Brecha por Antigüedad (Tenure Gap)</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Analiza cómo evoluciona la <strong>Satisfacción Global</strong> frente al <strong>Riesgo de Rotación</strong> a lo largo del ciclo de vida del colaborador en la organización.
      </p>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg">
                      <p className="font-bold text-slate-800 mb-2">{label}</p>
                      {payload.map(p => (
                        <p key={p.dataKey} className="text-sm font-semibold" style={{color: p.color}}>
                          {p.name}: {p.value}%
                        </p>
                      ))}
                      <p className="text-xs text-slate-400 mt-2">Muestra: {payload[0].payload.size} personas</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="satisfaccion" name="Satisfacción Global" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="riesgoRotacion" name="Riesgo de Rotación" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
