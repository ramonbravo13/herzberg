import React from 'react';
import Dashboard from '../../components/Dashboard';

// Mock evaluations dataset for visual verification of all charts & tabs
function generateMockEvaluations(count = 25) {
  const deptos = ['Operaciones', 'Tecnología', 'Ventas', 'Finanzas', 'Recursos Humanos'];
  const tenures = ['<1 año', '1-3 años', '4-7 años', '8-15 años'];
  const levels = ['Operativo', 'Mando Medio', 'Directivo'];
  const shifts = ['Matutino', 'Vespertino', 'Mixto'];

  const leaderships = [
    'Inspira y apoya el crecimiento',
    'Comportamiento accesible y claro',
    'Ejerce un control/micromanagement excesivo',
    'Muestra una actitud dura, autoritaria o inequitativa'
  ];

  const dynamics = [
    'Excelente colaboración y confianza',
    'Relación cordial y enfocada a resultados',
    'Se percibe amedrentamiento o acoso hacia el personal de nuevo ingreso',
    'Existen cotos de poder o grupos que presionan a los demás'
  ];

  const conditions = [
    'Espacio ergonómico y adecuado',
    'Ruido elevado o temperaturas extremas',
    'Carga física pesada o movimientos muy repetitivos',
    'Instalaciones seguras y limpias'
  ];

  return Array.from({ length: count }, (_, i) => {
    const depto = deptos[i % deptos.length];
    const tenure = tenures[i % tenures.length];
    const nivel = levels[i % levels.length];
    const shift = shifts[i % shifts.length];

    const baseScore = 3 + (i % 3);

    const respuestas = {
      logro_1: Math.min(5, Math.max(1, baseScore + (i % 2))),
      logro_2: Math.min(5, Math.max(1, baseScore)),
      logro_3: Math.min(5, Math.max(1, baseScore + 1)),
      reconocimiento_1: Math.min(5, Math.max(1, baseScore - (i % 2))),
      reconocimiento_2: Math.min(5, Math.max(1, baseScore)),
      reconocimiento_3: Math.min(5, Math.max(1, baseScore)),
      trabajo_1: 4, trabajo_2: 4, trabajo_3: 5,
      responsabilidad_1: 4, responsabilidad_2: 5, responsabilidad_3: 4,
      crecimiento_1: 3, crecimiento_2: 3, crecimiento_3: 4,
      promocion_1: 3, promocion_2: 2, promocion_3: 3,
      salario_1: 3, salario_2: 2, salario_3: 3,
      supervision_1: 4, supervision_2: 4, supervision_3: 4,
      politicas_1: 3, politicas_2: 3, politicas_3: 4,
      relaciones_1: 4, relaciones_2: 5, relaciones_3: 4,
      condiciones_1: 4, condiciones_2: 3, condiciones_3: 4,
      seguridad_1: 4, seguridad_2: 4, seguridad_3: 5,
      satisfaccion_global: Math.min(5, Math.max(1, baseScore)),
      compromiso: Math.min(5, Math.max(1, baseScore + 1)),
      permanencia: Math.min(5, Math.max(1, baseScore)),
      enps: 7 + (i % 4)
    };

    return {
      id: `eval-${i}`,
      departamento: depto,
      zone: depto,
      antiguedad: tenure,
      nivel_puesto: nivel,
      turno: shift,
      respuestas,
      diagnostico: {
        liderazgo: leaderships[i % leaderships.length],
        dinamica: dynamics[i % dynamics.length],
        condiciones: conditions[i % conditions.length]
      },
      comentarios: {
        fortaleza: i % 2 === 0 ? 'Excelente compañerismo y trabajo en equipo' : 'Autonomía y confianza directiva',
        mejora: i % 2 === 0 ? 'Salarios más competitivos' : 'Mayor capacitación especializada'
      },
      nom035_respuestas: {
        g1_ats: i % 5 === 0,
        g2_score: 45 + (i * 2) % 40,
        g3_score: 55 + (i * 3) % 40
      }
    };
  });
}

export default function TestDashboard() {
  const mockData = React.useMemo(() => generateMockEvaluations(30), []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Top Filter Bar simulation (EXCEPCIÓN: no atenuado) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Demo Corporativa - Grupo Industrial</h2>
          <p className="text-xs text-slate-500">Prueba visual del efecto Focus on Scroll (Spotlight)</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-slate-200">
            Todas las zonas (Filtro Superior Fijo)
          </span>
          <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-slate-200">
            Periodo Activo 2026
          </span>
        </div>
      </div>

      {/* Render the Dashboard */}
      <Dashboard data={mockData} globalData={mockData} />
    </div>
  );
}
