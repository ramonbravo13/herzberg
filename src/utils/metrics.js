export const INDICES_CONFIG = [
  { name: 'Motivacional', vars: ['logro_1','logro_2','logro_3','reconocimiento_1','reconocimiento_2','reconocimiento_3','trabajo_1','trabajo_2','trabajo_3','responsabilidad_1','responsabilidad_2','responsabilidad_3','crecimiento_1','crecimiento_2','crecimiento_3','promocion_1','promocion_2','promocion_3'], explanation: 'Agrupa todos los factores intrínsecos al trabajo (logro, reconocimiento, responsabilidad, crecimiento). Según Herzberg, estos son los que realmente producen satisfacción laboral y motivación.' },
  { name: 'Higiene', vars: ['salario_1','salario_2','salario_3','supervision_1','supervision_2','supervision_3','politicas_1','politicas_2','politicas_3','relaciones_1','relaciones_2','relaciones_3','condiciones_1','condiciones_2','condiciones_3','seguridad_1','seguridad_2','seguridad_3'], explanation: 'Agrupa los factores extrínsecos (salario, políticas, relaciones, seguridad). Su ausencia o deficiencia causa insatisfacción, pero su presencia por sí sola no genera motivación a largo plazo.' },
  { name: 'Reconocimiento', tipo: 'Motivador', vars: ['reconocimiento_1','reconocimiento_2','reconocimiento_3'], explanation: 'Evalúa si el colaborador percibe que su esfuerzo y buen trabajo son valorados y reconocidos formal o informalmente por sus líderes y la organización.' },
  { name: 'Logro y Metas', tipo: 'Motivador', vars: ['logro_1','logro_2','logro_3'], explanation: 'Mide la satisfacción personal del colaborador al alcanzar sus objetivos y si la empresa le provee retos motivadores.' },
  { name: 'Sentido del Trabajo', tipo: 'Motivador', vars: ['trabajo_1','trabajo_2','trabajo_3'], explanation: 'Evalúa si las actividades diarias resultan interesantes y si el puesto aprovecha realmente las habilidades del colaborador.' },
  { name: 'Autonomía', tipo: 'Motivador', vars: ['responsabilidad_1','responsabilidad_2','responsabilidad_3'], explanation: 'Mide el grado de responsabilidad y libertad que tiene el colaborador para decidir cómo realizar su trabajo.' },
  { name: 'Desarrollo Prof.', tipo: 'Motivador', vars: ['crecimiento_1','crecimiento_2','crecimiento_3','promocion_1','promocion_2','promocion_3'], explanation: 'Combina el crecimiento (aprendizaje de nuevas habilidades) y la promoción (oportunidades reales de ascenso y desarrollo de carrera en la empresa).' },
  { name: 'Liderazgo', tipo: 'Higiene', vars: ['supervision_1','supervision_2','supervision_3'], explanation: 'Mide la calidad de la supervisión: trato respetuoso, apoyo ante dificultades y el reconocimiento directo por parte del jefe inmediato.' },
  { name: 'Salario y Compensación', tipo: 'Higiene', vars: ['salario_1','salario_2','salario_3'], explanation: 'Mide la satisfacción con la remuneración económica y si se percibe justa frente a las responsabilidades exigidas.' },
  { name: 'Políticas Internas', tipo: 'Higiene', vars: ['politicas_1','politicas_2','politicas_3'], explanation: 'Evalúa la claridad de los procedimientos y si las normas de la empresa se aplican de forma justa para todos.' },
  { name: 'Relaciones Laborales', tipo: 'Higiene', vars: ['relaciones_1','relaciones_2','relaciones_3'], explanation: 'Mide el nivel de respeto, colaboración y libertad de expresión que existe entre el colaborador y sus compañeros de equipo.' },
  { name: 'Condiciones Trabajo', tipo: 'Higiene', vars: ['condiciones_1','condiciones_2','condiciones_3'], explanation: 'Evalúa si el colaborador cuenta con los recursos, herramientas, instalaciones adecuadas y una carga laboral razonable.' },
  { name: 'Seguridad Laboral', tipo: 'Higiene', vars: ['seguridad_1','seguridad_2','seguridad_3'], explanation: 'Mide la percepción de estabilidad en el empleo, la confianza en el futuro de la organización y la claridad de las decisiones institucionales.' },
];

export const calculateIndex = (vars, dataArray) => {
  let sum = 0;
  let count = 0;
  dataArray.forEach(data => {
    vars.forEach(v => {
      const val = data.respuestas ? data.respuestas[v] : data[v];
      if (val !== undefined && val !== null) {
        const numVal = Number(val);
        if (!isNaN(numVal)) {
          sum += numVal;
          count++;
        }
      }
    });
  });
  if (count === 0) return 0;
  const avg = sum / count;
  const score = Math.round(((avg - 1) / 4) * 100);
  return Math.max(0, Math.min(100, score));
};

export const getRiskLabel = (score) => {
  if (score >= 80) return 'Fortaleza';
  if (score >= 60) return 'Aceptable';
  if (score >= 40) return 'Riesgo Moderado';
  return 'Riesgo Alto';
};

export const getActionableInsight = (metricName, score) => {
  const isHealthy = score >= 80;
  const status = score >= 80 ? 'Bueno' : (score >= 60 ? 'Advertencia' : 'Crítico');
  
  if (isHealthy) {
    return {
      status,
      insight: 'Desempeño óptimo sostenido.',
      action: 'Mantener y documentar las buenas prácticas actuales.'
    };
  }

  // Rules Engine Dictionary
  const rules = {
    'Reconocimiento': {
      insight: 'Talento se siente invisible.',
      action: 'Implementar un programa de feedback 1:1 semanal enfocado en logros recientes y visibilidad con líderes.'
    },
    'Logro y Metas': {
      insight: 'Falta de retos o metas irreales.',
      action: 'Redefinir Objetivos (OKRs) para asegurar que sean alcanzables y estén alineados a la estrategia general.'
    },
    'Autonomía': {
      insight: 'Exceso de micromanagement.',
      action: 'Reducir procesos de aprobación y delegar propiedad de proyectos clave.'
    },
    'Desarrollo Prof.': {
      insight: 'Estancamiento profesional percibido.',
      action: 'Crear planes de carrera horizontales y mapear competencias de crecimiento interno.'
    },
    'Sentido del Trabajo': {
      insight: 'Desconexión con el propósito.',
      action: 'Comunicar el impacto real de las tareas del equipo en los clientes directos de la empresa.'
    },
    'Salario y Compensación': {
      insight: 'Percepción de inequidad salarial.',
      action: 'Auditar la equidad salarial interna respecto al mercado para mitigar insatisfacción inmediata.'
    },
    'Liderazgo': {
      insight: 'Fricción directa con jefaturas.',
      action: 'Capacitar a los mandos medios en habilidades blandas, comunicación empática y gestión de personas.'
    },
    'Políticas Internas': {
      insight: 'Procesos burocráticos excesivos.',
      action: 'Simplificar burocracia en trámites frecuentes (permisos, gastos, solicitudes).'
    },
    'Condiciones Trabajo': {
      insight: 'Herramientas/entorno deficiente.',
      action: 'Atender solicitudes de herramientas (tecnología, instalaciones) priorizando cuellos de botella.'
    },
    'Relaciones Laborales': {
      insight: 'Fricción entre compañeros.',
      action: 'Fomentar dinámicas de integración y establecer canales seguros de mediación de conflictos.'
    },
    'Seguridad Laboral': {
      insight: 'Incertidumbre sobre el futuro.',
      action: 'Comunicar con transparencia el rumbo de la empresa y asegurar a los talentos clave.'
    }
  };

  const match = rules[metricName];
  if (match) {
    return { status, insight: match.insight, action: match.action };
  }

  return {
    status,
    insight: 'Área de oportunidad detectada.',
    action: 'Realizar un focus group para indagar las causas raíz de la insatisfacción.'
  };
};

export const getQuadrantInsight = (x, y) => {
  // x = Higiene, y = Motivación. Threshold = 60
  if (x >= 60 && y >= 60) {
    return {
      status: 'Ideal',
      insight: 'Equipo de Alto Rendimiento.',
      action: 'Utilizar a los líderes de este departamento como mentores para el resto de la organización.'
    };
  } else if (x >= 60 && y < 60) {
    return {
      status: 'Cómodos',
      insight: 'Estancamiento productivo.',
      action: 'Asignar proyectos desafiantes y establecer OKRs agresivos para sacar al equipo de su zona de confort.'
    };
  } else if (x < 60 && y >= 60) {
    return {
      status: 'Riesgo Burnout',
      insight: 'Alta fricción operativa.',
      action: 'Ajustar tabuladores salariales y mejorar herramientas de trabajo de inmediato antes de perder talento clave.'
    };
  } else {
    return {
      status: 'Riesgo Fuga',
      insight: 'Intervención Urgente.',
      action: 'Ejecutar auditoría de clima laboral y evaluar reemplazo de jefaturas directas.'
    };
  }
};

export const QUESTION_MAP = {
  logro_1: 'P1. Satisfacción personal al alcanzar objetivos',
  logro_2: 'P2. Permite conseguir resultados importantes',
  logro_3: 'P3. Oportunidades para enfrentar retos motivadores',
  reconocimiento_1: 'P4. Sentimiento de que el buen trabajo es reconocido',
  reconocimiento_2: 'P5. Superiores valoran aportaciones',
  reconocimiento_3: 'P6. Organización reconoce logros del personal',
  trabajo_1: 'P7. Actividades resultan interesantes',
  trabajo_2: 'P8. Puesto aprovecha habilidades y conocimientos',
  trabajo_3: 'P9. Disfruta tareas que realiza',
  responsabilidad_1: 'P10. Autonomía para decidir cómo realizar el trabajo',
  responsabilidad_2: 'P11. Responsabilidades acordes a capacidades',
  responsabilidad_3: 'P12. Participa en decisiones de su área',
  crecimiento_1: 'P13. Oportunidades para aprender y desarrollarse',
  crecimiento_2: 'P14. Adquisición de nuevas competencias',
  crecimiento_3: 'P15. Crecimiento profesional en la institución',
  promocion_1: 'P16. Percibe oportunidades reales de crecimiento',
  promocion_2: 'P17. Considera justos procesos de promoción',
  promocion_3: 'P18. Visualiza un futuro profesional en la empresa',
  salario_1: 'P19. Satisfacción con remuneración actual',
  salario_2: 'P20. Prestaciones adecuadas',
  salario_3: 'P21. Compensación justa vs responsabilidades',
  supervision_1: 'P22. Jefe inmediato trata con respeto',
  supervision_2: 'P23. Apoyo ante dificultades laborales',
  supervision_3: 'P24. Supervisor reconoce contribuciones',
  politicas_1: 'P25. Políticas y procedimientos son claros',
  politicas_2: 'P26. Normas se aplican justamente',
  politicas_3: 'P27. Recibe info sobre cambios importantes',
  relaciones_1: 'P28. Respeto entre compañeros de trabajo',
  relaciones_2: 'P29. Colaboración dentro del equipo',
  relaciones_3: 'P30. Libertad para expresar opiniones',
  condiciones_1: 'P31. Cuenta con recursos necesarios',
  condiciones_2: 'P32. Instalaciones y herramientas adecuadas',
  condiciones_3: 'P33. Carga laboral razonable',
  seguridad_1: 'P34. Seguro respecto a estabilidad de empleo',
  seguridad_2: 'P35. Confía en el futuro de la organización',
  seguridad_3: 'P36. Decisiones laborales con criterios claros',
};
