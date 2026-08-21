import React from 'react';

const THEMES = [
  { id: 'salario', label: 'Salario y Compensación', keywords: ['salario', 'sueldo', 'pago', 'dinero'], color: 'bg-green-500' },
  { id: 'crecimiento', label: 'Crecimiento Profesional', keywords: ['crecimiento', 'promocion', 'ascenso', 'oportunidad', 'carrera'], color: 'bg-blue-500' },
  { id: 'clima', label: 'Clima Laboral y Equipo', keywords: ['ambiente', 'compañero', 'equipo', 'clima'], color: 'bg-emerald-500' },
  { id: 'carga', label: 'Carga Laboral / Horarios', keywords: ['carga', 'horario', 'flexibilidad', 'tiempo', 'estrés'], color: 'bg-orange-500' },
  { id: 'liderazgo', label: 'Liderazgo y Comunicación', keywords: ['jefe', 'líder', 'liderazgo', 'comunicación', 'gerente'], color: 'bg-purple-500' },
  { id: 'instalaciones', label: 'Instalaciones y Recursos', keywords: ['instalación', 'instalaciones', 'herramienta', 'recurso', 'equipo'], color: 'bg-slate-500' },
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Análisis Temático de Comentarios</h2>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Agrupación automática de los comentarios abiertos (fortalezas y áreas de mejora) basada en palabras clave. Indica sobre qué temas están hablando más los colaboradores.
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No se detectaron temas clave en los comentarios.</p>
      ) : (
        <div className="space-y-5">
          {results.map(res => (
            <div key={res.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">{res.label}</span>
                <span className="text-slate-500 font-medium">{res.pct}% ({res.count} menciones)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className={`${res.color} h-2.5 rounded-full`} style={{ width: `${res.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
