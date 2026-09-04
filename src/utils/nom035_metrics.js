export const INVERSE_G2 = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
export const INVERSE_G3 = [1, 4, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57];

export const calculateItemScore = (value, itemNumber, isGuia3) => {
  if (value === undefined || value === null) return 0;
  
  const isInverse = isGuia3 ? INVERSE_G3.includes(itemNumber) : INVERSE_G2.includes(itemNumber);
  
  if (isInverse) {
    return 5 - value;
  } else {
    return value - 1;
  }
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

export const calculateGuia2Score = (respuestas) => {
  if (!respuestas) return 0;
  let total = 0;
  for (let i = 1; i <= 46; i++) {
    const val = respuestas[`g2_${i}`];
    if (val !== undefined) {
      total += calculateItemScore(val, i, false);
    }
  }
  return total;
};

export const calculateGuia3Score = (respuestas) => {
  if (!respuestas) return 0;
  let total = 0;
  for (let i = 1; i <= 72; i++) {
    const val = respuestas[`g3_${i}`];
    if (val !== undefined) {
      total += calculateItemScore(val, i, true);
    }
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
    case 'Nulo': return { color: 'text-emerald-500', bg: 'bg-emerald-100', action: 'Riesgo despreciable. No se requieren medidas adicionales.' };
    case 'Bajo': return { color: 'text-blue-500', bg: 'bg-blue-100', action: 'Difusión reforzada de la política de prevención y programas existentes.' };
    case 'Medio': return { color: 'text-yellow-500', bg: 'bg-yellow-100', action: 'Revisión de política, programas de prevención y reforzamiento de la difusión (Nivel Organizacional).' };
    case 'Alto': return { color: 'text-orange-500', bg: 'bg-orange-100', action: 'Análisis por categoría/dominio. Programa de intervención y campañas (Nivel Grupal).' };
    case 'Muy Alto': return { color: 'text-red-500', bg: 'bg-red-100', action: 'Intervención urgente. Evaluaciones clínicas específicas y cambio en políticas (Nivel Individual y Organizacional).' };
    default: return { color: 'text-slate-500', bg: 'bg-slate-100', action: '' };
  }
};
