import React from 'react';

export default function BurnoutRisk({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  let burnoutCount = 0;
  let atRiskCount = 0;

  dataArray.forEach(d => {
    if (!d.respuestas) return;
    const carga = d.respuestas.condiciones_3; // Carga laboral razonable
    const apoyo = d.respuestas.supervision_2; // Apoyo ante dificultades
    
    if (carga <= 2 && apoyo <= 2) {
      burnoutCount++;
    } else if (carga <= 2 || apoyo <= 2) {
      atRiskCount++;
    }
  });

  const total = dataArray.length;
  const burnoutPct = Math.round((burnoutCount / total) * 100);
  const atRiskPct = Math.round((atRiskCount / total) * 100);

  let statusClass = "bg-emerald-50 border-emerald-200";
  let textColor = "text-emerald-600";
  let icon = <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4"/>;
  
  if (burnoutPct > 10) {
    statusClass = "bg-red-50 border-red-200";
    textColor = "text-red-600";
    icon = <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>;
  } else if (burnoutPct > 0 || atRiskPct > 20) {
    statusClass = "bg-orange-50 border-orange-200";
    textColor = "text-orange-600";
    icon = <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>;
  }

  return (
    <div className={`p-6 rounded-2xl shadow-sm border ${statusClass} flex flex-col justify-center`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-full bg-white shadow-sm ${textColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </div>
        <div>
          <h2 className={`text-xl font-bold ${textColor}`}>Índice de Burnout Severo</h2>
          <p className="text-sm text-slate-600 mt-1">Colaboradores con sobrecarga extrema y nulo apoyo de su líder.</p>
        </div>
      </div>
      
      <div className="flex items-end gap-3 mt-2">
        <div className={`text-5xl font-black ${textColor}`}>{burnoutPct}%</div>
        <div className="text-sm text-slate-500 mb-2">de la plantilla ({burnoutCount} personas)</div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200/50">
        <div className="flex justify-between items-center text-sm text-slate-600 mb-1">
          <span>En riesgo moderado (alta carga o bajo apoyo)</span>
          <span className="font-bold">{atRiskPct}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-2">
          <div className="bg-orange-400 h-2 rounded-full" style={{width: `${atRiskPct}%`}}></div>
        </div>
      </div>
    </div>
  );
}
