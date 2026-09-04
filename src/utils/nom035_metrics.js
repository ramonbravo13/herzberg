export const INVERSE_G2 = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
export const INVERSE_G3 = [1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57];

// --- MAPPINGS G2 ---
export const G2_CATEGORIES = {
  "Ambiente de trabajo": [1, 2, 3],
  "Factores propios de la actividad": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 18, 19, 20, 21, 22, 26, 27, 41, 42, 43],
  "Organización del tiempo de trabajo": [14, 15, 16, 17],
  "Liderazgo y relaciones en el trabajo": [23, 24, 25, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 44, 45, 46]
};

export const G2_DOMAINS = {
  "Condiciones en el ambiente de trabajo": [1, 2, 3],
  "Carga de trabajo": [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 41, 42, 43],
  "Falta de control sobre el trabajo": [18, 19, 20, 21, 22, 26, 27],
  "Jornada de trabajo": [14, 15],
  "Interferencia en la relación trabajo-familia": [16, 17],
  "Liderazgo": [23, 24, 25, 28, 29],
  "Relaciones en el trabajo": [30, 31, 32, 33, 44, 45, 46],
  "Violencia": [34, 35, 36, 37, 38, 39, 40]
};

// --- MAPPINGS G3 ---
export const G3_CATEGORIES = {
  "Ambiente de trabajo": [1, 2, 3, 4, 5],
  "Factores propios de la actividad": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 35, 36, 65, 66, 67, 68],
  "Organización del tiempo de trabajo": [17, 18, 19, 20, 21, 22],
  "Liderazgo y relaciones en el trabajo": [31, 32, 33, 34, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 57, 58, 59, 60, 61, 62, 63, 64, 69, 70, 71, 72],
  "Entorno organizacional": [29, 30, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56]
};

export const G3_DOMAINS = {
  "Condiciones en el ambiente de trabajo": [1, 2, 3, 4, 5],
  "Carga de trabajo": [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 65, 66, 67, 68],
  "Falta de control sobre el trabajo": [23, 24, 25, 26, 27, 28, 35, 36],
  "Jornada de trabajo": [17, 18],
  "Interferencia en la relación trabajo-familia": [19, 20, 21, 22],
  "Liderazgo": [31, 32, 33, 34, 37, 38, 39, 40, 41],
  "Relaciones en el trabajo": [42, 43, 44, 45, 46, 69, 70, 71, 72],
  "Violencia": [57, 58, 59, 60, 61, 62, 63, 64],
  "Reconocimiento del desempeño": [47, 48, 49, 50, 51, 52],
  "Insuficiente sentido de pertenencia e inestabilidad": [29, 30, 53, 54, 55, 56]
};

export const calculateItemScore = (value, itemNumber, isGuia3) => {
  if (value === undefined || value === null) return 0;
  const isInverse = isGuia3 ? INVERSE_G3.includes(itemNumber) : INVERSE_G2.includes(itemNumber);
  return isInverse ? (5 - value) : (value - 1);
};

export const evaluateGuia1 = (respuestas) => {
  if (!respuestas) return false;
  
  const countSi = (start, end) => {
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (respuestas[`ats_${i}`] === 'SI' || respuestas[`ats_${i}`] === 'SÍ') {
        count++;
      }
    }
    return count;
  };

  const sec1 = countSi(1, 6);
  if (sec1 === 0) return false; // No ATS

  const sec2 = countSi(7, 8);
  const sec3 = countSi(9, 15);
  const sec4 = countSi(16, 20);

  if (sec2 >= 1 || sec3 >= 3 || sec4 >= 2) {
    return true; // Requires clinical evaluation
  }
  return false;
};

// Gets the risk level based on normalized percentage score (0-100)
// This standardizes categories that have different amounts of questions.
export const getRiskLevelFromNormalized = (percentage) => {
  if (percentage < 20) return 'Nulo';
  if (percentage < 40) return 'Bajo';
  if (percentage < 60) return 'Medio';
  if (percentage < 80) return 'Alto';
  return 'Muy Alto';
};

export const calculateGuia2Score = (respuestas) => {
  if (!respuestas) return 0;
  let total = 0;
  for (let i = 1; i <= 46; i++) {
    const val = respuestas[`g2_${i}`];
    if (val !== undefined) total += calculateItemScore(val, i, false);
  }
  return total;
};

export const calculateGuia3Score = (respuestas) => {
  if (!respuestas) return 0;
  let total = 0;
  for (let i = 1; i <= 72; i++) {
    const val = respuestas[`g3_${i}`];
    if (val !== undefined) total += calculateItemScore(val, i, true);
  }
  return total;
};

export const getRiskLevelG2 = (score) => {
  if (score < 20) return 'Nulo';
  if (score < 45) return 'Bajo';
  if (score < 70) return 'Medio';
  if (score < 90) return 'Alto';
  return 'Muy Alto';
};

export const getRiskLevelG3 = (score) => {
  if (score < 50) return 'Nulo';
  if (score < 75) return 'Bajo';
  if (score < 105) return 'Medio';
  if (score < 140) return 'Alto';
  return 'Muy Alto';
};

export const getRiskColorAndAction = (level) => {
  switch(level) {
    case 'Nulo': return { 
      color: 'text-emerald-500', hex: '#10b981', bg: 'bg-emerald-100', 
      action: 'Riesgo despreciable. No se requieren medidas adicionales.',
      implicaciones: 'El entorno de trabajo está libre de factores de riesgo psicosocial perjudiciales a nivel sistémico.',
      recomendaciones: 'No se requieren medidas correctivas inmediatas. El objetivo es mantener la Política de Prevención vigente y continuar fomentando un entorno organizacional favorable.',
      sanciones: 'Nulo. Ante una inspección de la STPS, solo se verificará el cumplimiento documental (tener la política por escrito y haber aplicado los cuestionarios correspondientes).'
    };
    case 'Bajo': return { 
      color: 'text-blue-500', hex: '#3b82f6', bg: 'bg-blue-100', 
      action: 'Difusión reforzada de la política de prevención.',
      implicaciones: 'Existen algunos factores de riesgo aislados que, por el momento, no representan una amenaza significativa para la salud mental y emocional del colectivo.',
      recomendaciones: 'Es necesario fortalecer la difusión de la Política de Prevención de Riesgos Psicosociales y los programas existentes. Mantener una comunicación constante sobre las vías de denuncia.',
      sanciones: 'Muy bajo. La autoridad exigirá únicamente comprobar que la política y las medidas preventivas se difunden correctamente entre los trabajadores.'
    };
    case 'Medio': return { 
      color: 'text-yellow-600', hex: '#ca8a04', bg: 'bg-yellow-100', 
      action: 'Revisión de política y programas de prevención (Nivel Organizacional).',
      implicaciones: 'Presencia moderada de factores de riesgo. El clima laboral empieza a verse afectado, existiendo probabilidad de desgaste en ciertas áreas de la empresa si no se actúa.',
      recomendaciones: 'Obligación de revisar la política de prevención. Se deben actualizar los programas de capacitación y establecer medidas preventivas a Nivel Organizacional, involucrando a los líderes.',
      sanciones: 'Moderado. En caso de inspección, la STPS solicitará evidencia de los programas de prevención e intervención instaurados a partir de esta evaluación. Omisiones pueden derivar en multas.'
    };
    case 'Alto': return { 
      color: 'text-orange-600', hex: '#ea580c', bg: 'bg-orange-100', 
      action: 'Programa de intervención focalizado (Nivel Grupal).',
      implicaciones: 'Los factores de riesgo psicosocial son evidentes y sistémicos. Existe alta probabilidad de estrés crónico (burnout), rotación de personal, o violencia laboral en áreas específicas.',
      recomendaciones: 'Obligación normativa de implementar un "Programa de Intervención" formal y documentado. Requiere campañas de sensibilización, capacitación obligatoria a jefes, y modificación de procesos (cargas de trabajo, turnos).',
      sanciones: 'Alto. Las multas por incumplimiento en este nivel van de 250 a 5,000 UMAs (aprox. $27,142 a $542,850 MXN) por cada trabajador afectado o infracción no subsanada.'
    };
    case 'Muy Alto': return { 
      color: 'text-red-600', hex: '#dc2626', bg: 'bg-red-100', 
      action: 'Intervención Urgente y canalización (Nivel Individual y Organizacional).',
      implicaciones: 'Entorno de trabajo altamente tóxico o peligroso. Los empleados están sometidos a niveles de estrés que dañan su salud física y psicológica de forma inminente.',
      recomendaciones: 'Intervención de emergencia. Rediseño inmediato de puestos, cambio de liderazgos o procesos. Además, se requieren evaluaciones clínicas y psicológicas específicas al personal expuesto (Numerales 8.1 y 8.2).',
      sanciones: 'Crítico. Multas severas (máximo rigor de UMAS). Riesgo de demandas laborales por "enfermedades de trabajo" (estrés agudo) ante el IMSS. Posibles medidas cautelares severas por parte de la STPS.'
    };
    default: return { 
      color: 'text-slate-500', hex: '#64748b', bg: 'bg-slate-100', 
      action: '', implicaciones: '', recomendaciones: '', sanciones: ''
    };
  }
};

export const calculateAggregateGroupScores = (dataArray, isGuia3, groupMapping) => {
  const groupScores = {};
  
  Object.keys(groupMapping).forEach(groupName => {
    let totalPoints = 0;
    let totalMaxPossible = 0;

    dataArray.forEach(d => {
      const nr = d.nom035_respuestas;
      if (!nr) return;
      const prefix = isGuia3 ? 'g3_' : 'g2_';
      // Only process if the person has answered the first question of this guide
      if (nr[`${prefix}1`] !== undefined) {
        groupMapping[groupName].forEach(itemNumber => {
          const val = nr[`${prefix}${itemNumber}`];
          if (val !== undefined && val >= 1 && val <= 5) {
            totalPoints += calculateItemScore(val, itemNumber, isGuia3);
            totalMaxPossible += 4; // Max score per item is 4
          }
        });
      }
    });

    const percentage = totalMaxPossible > 0 ? (totalPoints / totalMaxPossible) * 100 : 0;
    const risk = getRiskLevelFromNormalized(percentage);
    
    groupScores[groupName] = {
      score: Math.round(percentage),
      risk: risk,
      ...getRiskColorAndAction(risk)
    };
  });

  return groupScores;
};
