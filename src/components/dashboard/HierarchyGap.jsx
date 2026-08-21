import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';

export default function HierarchyGap({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  const lideres = dataArray.filter(d => ['Directivo', 'Coordinación'].includes(d.nivel_puesto));
  const operativos = dataArray.filter(d => ['Operativo', 'Técnico', 'Administrativo'].includes(d.nivel_puesto));

  // If we don't have both groups, skip
  if (lideres.length === 0 || operativos.length === 0) return null;

  // We only compare a few key indices to not overcrowd the chart
  const selectedIndices = ['Liderazgo', 'Políticas', 'Condiciones Trabajo', 'Comunicación (Relaciones)'];
  // Actually, let's use the ones that typically show the biggest gap
  const compareIndices = INDICES_CONFIG.filter(i => 
    ['Liderazgo', 'Políticas', 'Condiciones Trabajo', 'Reconocimiento', 'Relaciones Laborales'].includes(i.name)
  );

  const chartData = compareIndices.map(ind => {
    return {
      name: ind.name,
      'Líderes': calculateIndex(ind.vars, lideres),
      'Operativos': calculateIndex(ind.vars, operativos)
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Brecha Jerárquica ("Ceguera de Taller")</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Compara la percepción de los líderes (Coordinación/Directivos) contra la base operativa. Una brecha grande indica que los directivos perciben una realidad mucho más positiva (o desconectada) que el resto de la empresa.
      </p>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{fontSize: 11}} />
            <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Líderes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Operativos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-4 text-xs text-slate-500 justify-center">
        <div>Muestra Líderes: {lideres.length}</div>
        <div>Muestra Operativos: {operativos.length}</div>
      </div>
    </div>
  );
}
