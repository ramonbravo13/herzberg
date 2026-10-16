import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = "Sin datos disponibles", 
  description = "No se encontraron respuestas suficientes para calcular esta métrica.",
  className = "h-[220px]" 
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-6 text-slate-400 select-none ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 text-slate-400 shadow-sm">
        <Icon size={22} className="stroke-[1.75]" />
      </div>
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">{description}</p>
    </div>
  );
}
