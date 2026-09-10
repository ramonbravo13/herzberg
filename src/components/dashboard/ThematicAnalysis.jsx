import React, { useState } from 'react';
import ChartCard from '../charts/ChartCard';
import { X, Search } from 'lucide-react';

import { globalPalette } from '../../utils/themeColors';

const THEMES = [
  { id: 'salario', label: 'Salario y Compensación', keywords: ['salario', 'sueldo', 'pago', 'dinero'], hex: globalPalette[0] },
  { id: 'crecimiento', label: 'Crecimiento Profesional', keywords: ['crecimiento', 'promocion', 'ascenso', 'oportunidad', 'carrera'], hex: globalPalette[1] },
  { id: 'clima', label: 'Clima Laboral y Equipo', keywords: ['ambiente', 'compañero', 'equipo', 'clima'], hex: globalPalette[2] },
  { id: 'carga', label: 'Carga Laboral / Horarios', keywords: ['carga', 'horario', 'flexibilidad', 'tiempo', 'estrés'], hex: globalPalette[3] },
  { id: 'liderazgo', label: 'Liderazgo y Comunicación', keywords: ['jefe', 'líder', 'liderazgo', 'comunicación', 'gerente'], hex: globalPalette[4] },
  { id: 'instalaciones', label: 'Instalaciones y Recursos', keywords: ['instalación', 'instalaciones', 'herramienta', 'recurso', 'equipo'], hex: globalPalette[5] },
];

export default function ThematicAnalysis({ dataArray }) {
  const [selectedTheme, setSelectedTheme] = useState(null);

  if (!dataArray || dataArray.length < 2) return null;

  // Process comments
  let totalComments = 0;
  const themeCounts = {
    salario: [],
    crecimiento: [],
    clima: [],
    carga: [],
    liderazgo: [],
    instalaciones: [],
  };

  dataArray.forEach(d => {
    if (!d.comentarios) return;
    
    const f = (d.comentarios.fortaleza || '').trim();
    const m = (d.comentarios.mejora || '').trim();
    const text = `${f} ${m}`.toLowerCase();
    
    if (text === '') return;
    totalComments++;

    THEMES.forEach(theme => {
      const isMatch = theme.keywords.some(kw => text.includes(kw.toLowerCase()));
      if (isMatch) {
        themeCounts[theme.id].push({ text: `${f}. ${m}`, role: d.nivel_puesto || 'Operativo', id: d.id || Math.random() });
      }
    });
  });

  if (totalComments === 0) return null;

  const results = THEMES.map(theme => ({
    ...theme,
    count: themeCounts[theme.id].length,
    comments: themeCounts[theme.id],
    pct: Math.round((themeCounts[theme.id].length / totalComments) * 100)
  })).sort((a, b) => b.count - a.count).filter(t => t.count > 0);

  return (
    <>
      <ChartCard 
        title="Análisis Temático de Comentarios"
        subtitle="Agrupación automática de los comentarios abiertos. Haz clic en cualquier barra para leer los comentarios crudos asociados a ese tema."
      >
        {results.length === 0 ? (
          <div className="flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-4">
            <p className="text-sm text-slate-500 font-medium">No se detectaron temas clave en los comentarios.</p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {results.map(res => (
              <div key={res.id} className="group cursor-pointer" onClick={() => setSelectedTheme(res)}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    {res.label} <Search size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-slate-500 font-medium text-xs tracking-wide">{res.pct}% <span className="opacity-60 font-normal">({res.count} menciones)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110`} style={{ width: `${res.pct}%`, backgroundColor: res.hex }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      {/* Modal Drill-down */}
      {selectedTheme && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedTheme.hex }}></div>
                  {selectedTheme.label}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{selectedTheme.count} menciones detectadas en la evaluación</p>
              </div>
              <button onClick={() => setSelectedTheme(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-5 space-y-3 bg-slate-50/50 flex-1">
              {selectedTheme.comments.map((c, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{c.role}</span>
                  </div>
                  <p className="text-sm text-slate-700 italic">"{c.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
