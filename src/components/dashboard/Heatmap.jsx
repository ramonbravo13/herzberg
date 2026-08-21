import React from 'react';
import { calculateIndex, INDICES_CONFIG, getRiskBgColorClass } from '../../utils/metrics';

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Mapa de Calor por Departamento</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Identifica rápidamente las áreas de oportunidad y fortalezas por departamento. Los colores indican el nivel de riesgo en cada factor.
      </p>

      <div className="min-w-[800px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b-2 border-slate-200 text-slate-700 font-bold bg-slate-50 rounded-tl-xl">Departamento</th>
              <th className="p-3 border-b-2 border-slate-200 text-slate-700 font-bold bg-slate-50">Muestra</th>
              {INDICES_CONFIG.map(ind => (
                <th key={ind.name} className="p-3 border-b-2 border-slate-200 text-slate-700 font-bold bg-slate-50 text-center text-xs">
                  {ind.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deptos.map(depto => {
              const arr = deptoMap[depto];
              return (
                <tr key={depto} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-slate-800">{depto}</td>
                  <td className="p-3 text-slate-500 text-sm">{arr.length}</td>
                  {INDICES_CONFIG.map(ind => {
                    const score = calculateIndex(ind.vars, arr);
                    const bgClass = getRiskBgColorClass(score);
                    return (
                      <td key={ind.name} className="p-2 text-center">
                        <div className={`py-2 px-3 rounded-lg font-bold text-sm ${bgClass}`}>
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
    </div>
  );
}
