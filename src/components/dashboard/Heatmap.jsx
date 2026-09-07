import React from 'react';
import { calculateIndex, INDICES_CONFIG, getRiskBgColorClass } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';

export default function Heatmap({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  // Group by department
  const deptoMap = {};
  dataArray.forEach(d => {
    if (!d.departamento) return;
    if (!deptoMap[d.departamento]) deptoMap[d.departamento] = [];
    deptoMap[d.departamento].push(d);
  });

  const deptos = Object.keys(deptoMap).sort();

  return (
    <ChartCard 
      title="Mapa de Calor por Departamento"
      subtitle="Identifica rápidamente las áreas de oportunidad y fortalezas por departamento. Los colores indican el nivel de riesgo en cada factor."
      className="overflow-x-auto"
    >
      <div className="min-w-[800px] mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b-2 border-slate-100 text-slate-500 font-bold bg-slate-50/50 rounded-tl-xl text-sm uppercase tracking-wider">Departamento</th>
              <th className="p-4 border-b-2 border-slate-100 text-slate-500 font-bold bg-slate-50/50 text-sm uppercase tracking-wider text-center">Muestra</th>
              {INDICES_CONFIG.map(ind => (
                <th key={ind.name} className="p-4 border-b-2 border-slate-100 text-slate-500 font-bold bg-slate-50/50 text-center text-[11px] uppercase tracking-wider">
                  {ind.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deptos.map(depto => {
              const arr = deptoMap[depto];
              return (
                <tr key={depto} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 font-bold text-slate-800 text-sm">{depto}</td>
                  <td className="p-4 text-slate-400 text-sm font-medium text-center">{arr.length}</td>
                  {INDICES_CONFIG.map(ind => {
                    const score = calculateIndex(ind.vars, arr);
                    const bgClass = getRiskBgColorClass(score);
                    return (
                      <td key={ind.name} className="p-2 text-center">
                        <div className={`py-2 px-3 rounded-xl font-bold text-sm ${bgClass} shadow-sm group-hover:shadow-md transition-shadow`}>
                          {score}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
