import React from 'react';
import ChartCard from '../charts/ChartCard';

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
  if (!dataArray || dataArray.length < 2) return null;

  // Process comments
  let totalComments = 0;
  const themeCounts = {
    salario: 0,
    crecimiento: 0,
    clima: 0,
    carga: 0,
    liderazgo: 0,
    instalaciones: 0,
  };

  dataArray.forEach(d => {
    if (!d.comentarios) return;
    
    // Combine both to search for themes
    const text = `${d.comentarios.fortaleza || ''} ${d.comentarios.mejora || ''}`.toLowerCase();
    
    if (text.trim() === '') return;
    totalComments++;

    // Check each theme
    let foundThemeForComment = false;
    THEMES.forEach(theme => {
      const isMatch = theme.keywords.some(kw => text.includes(kw.toLowerCase()));
      if (isMatch) {
        themeCounts[theme.id]++;
        foundThemeForComment = true;
      }
    });
  });

  if (totalComments === 0) return null;

  // Convert to array and sort by count
  const results = THEMES.map(theme => ({
    ...theme,
    count: themeCounts[theme.id],
    pct: Math.round((themeCounts[theme.id] / totalComments) * 100)
  })).sort((a, b) => b.count - a.count).filter(t => t.count > 0);

  return (
    <ChartCard 
      title="Análisis Temático de Comentarios"
      subtitle="Agrupación automática de los comentarios abiertos (fortalezas y áreas de mejora) basada en palabras clave. Indica sobre qué temas están hablando más los colaboradores."
    >
      {results.length === 0 ? (
        <div className="flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-4">
          <p className="text-sm text-slate-500 font-medium">No se detectaron temas clave en los comentarios.</p>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {results.map(res => (
            <div key={res.id} className="group">
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-slate-700 text-sm">{res.label}</span>
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
  );
}
