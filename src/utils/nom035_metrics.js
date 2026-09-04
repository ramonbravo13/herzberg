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
    case 'Nulo': return { color: 'text-emerald-500', hex: '#10b981', bg: 'bg-emerald-100', action: 'Riesgo despreciable. No se requieren medidas adicionales.' };
    case 'Bajo': return { color: 'text-blue-500', hex: '#3b82f6', bg: 'bg-blue-100', action: 'Difusión reforzada de la política de prevención y programas existentes.' };
    case 'Medio': return { color: 'text-yellow-500', hex: '#eab308', bg: 'bg-yellow-100', action: 'Revisión de política, programas de prevención y reforzamiento de la difusión (Nivel Organizacional).' };
    case 'Alto': return { color: 'text-orange-500', hex: '#f97316', bg: 'bg-orange-100', action: 'Análisis por categoría/dominio. Programa de intervención y campañas (Nivel Grupal).' };
    case 'Muy Alto': return { color: 'text-red-500', hex: '#ef4444', bg: 'bg-red-100', action: 'Intervención urgente. Evaluaciones clínicas específicas y cambio en políticas (Nivel Individual y Organizacional).' };
    default: return { color: 'text-slate-500', hex: '#64748b', bg: 'bg-slate-100', action: '' };
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
