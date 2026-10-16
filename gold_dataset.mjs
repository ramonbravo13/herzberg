/**
 * gold_dataset.mjs
 * Static Gold Dataset (100 curated survey evaluations) with mathematically precalculated Ground Truths.
 */

export const GOLD_TRUTHS = {
  totalEvaluations: 100,
  
  // eNPS Expected Values
  enps: {
    totalValidos: 90,
    promotores: 40,
    pasivos: 25,
    detractores: 25,
    nulos: 10,
    score: 17, // ((40 - 25) / 90) * 100 = 16.6667 -> 17
    distribution: {
      Promotores: 44, // 40/90 = 44.44%
      Pasivos: 28,    // 25/90 = 27.78% (rounded up via largest remainder)
      Detractores: 28 // 25/90 = 27.78%
    }
  },

  // Burnout Expected Values
  burnout: {
    totalValidos: 95,
    burnoutCount: 12,
    atRiskCount: 18,
    burnoutPct: 13, // 12 / 95 * 100 = 12.63% -> 13
    atRiskPct: 19   // 18 / 95 * 100 = 18.95% -> 19
  },

  // Top 3 Risks
  topRisksKeys: ['salario_1', 'reconocimiento_1', 'promocion_1'],
  topRisksScores: {
    salario_1: 25,
    reconocimiento_1: 30,
    promocion_1: 35
  },

  // Combinatorial Filter Ground Truths
  filters: {
    orgAlphaCount: 80,
    orgBetaCount: 20,
    orgAlphaPeriod1Count: 50,
    orgAlphaPeriod2Count: 30,
    orgAlphaP1VentasCount: 20,
    orgAlphaP1OperacionesCount: 20,
    orgAlphaP1TecnologiaCount: 10,
    nonExistentCount: 0
  }
};

export const goldEvaluations = [];

for (let i = 0; i < 100; i++) {
  const isAlpha = i < 80;
  const orgId = isAlpha ? 'org-alpha' : 'org-beta';
  
  let period = 1;
  let zone = 'Ventas';

  if (isAlpha) {
    if (i < 50) {
      period = 1;
      if (i < 20) zone = 'Ventas';
      else if (i < 40) zone = 'Operaciones';
      else zone = 'Tecnologia';
    } else {
      period = 2;
      if (i < 60) zone = 'Ventas';
      else if (i < 70) zone = 'Operaciones';
      else zone = 'Tecnologia';
    }
  } else {
    zone = 'Finanzas';
    period = i < 90 ? 1 : 2;
  }

  // eNPS assignment: 40 Promoters (10), 25 Passives (8), 25 Detractors (4), 10 Nulls
  let enps = null;
  if (i < 40) enps = 10;
  else if (i < 65) enps = 8;
  else if (i < 90) enps = 4;
  else enps = null; // last 10 are null/unanswered

  // Burnout assignment:
  // 12 Burnout (condiciones_3=2, supervision_2=2)
  // 18 At Risk (condiciones_3=2, supervision_2=4)
  // 5 Nulls (null, null)
  // 65 Healthy (4, 4)
  let condiciones_3 = 4;
  let supervision_2 = 4;

  if (i < 12) {
    condiciones_3 = 2;
    supervision_2 = 2;
  } else if (i < 30) {
    condiciones_3 = 2;
    supervision_2 = 4;
  } else if (i >= 95) {
    condiciones_3 = null;
    supervision_2 = null;
  } else {
    condiciones_3 = 4;
    supervision_2 = 4;
  }

  // Question scores controlled for exact Top Risks:
  // salario_1: mean 2.0 -> ((2-1)/4)*100 = 25%
  // reconocimiento_1: mean 2.2 -> ((2.2-1)/4)*100 = 30%
  // supervision_2: already set (mean 2.4 for controlled distribution = 35%)
  // All other questions: 4 or 5 (scores >= 75%)
  const respuestas = {
    logro_1: 4,
    logro_2: 4,
    logro_3: 5,
    reconocimiento_1: (i % 5 === 0) ? 3 : 2, // 20 ones of 3, 80 twos of 2 -> mean = (60 + 160)/100 = 2.20
    reconocimiento_2: 4,
    reconocimiento_3: 4,
    trabajo_1: 4,
    trabajo_2: 5,
    trabajo_3: 4,
    responsabilidad_1: 4,
    responsabilidad_2: 5,
    responsabilidad_3: 4,
    crecimiento_1: 4,
    crecimiento_2: 4,
    crecimiento_3: 4,
    promocion_1: (i < 60) ? 2 : 3, // 60 with 2, 40 with 3 -> sum = 240, mean = 2.40, score = 35%
    promocion_2: 4,
    promocion_3: 4,
    salario_1: 2, // exactly 2 everywhere -> score = 25%
    salario_2: 4,
    salario_3: 4,
    supervision_1: 4,
    supervision_2: supervision_2,
    supervision_3: 4,
    politicas_1: 4,
    politicas_2: 4,
    politicas_3: 4,
    relaciones_1: 4,
    relaciones_2: 4,
    relaciones_3: 4,
    condiciones_1: 4,
    condiciones_2: 4,
    condiciones_3: condiciones_3,
    seguridad_1: 4,
    seguridad_2: 4,
    seguridad_3: 4,
    satisfaccion_global: 4,
    compromiso: 4,
    permanencia: 4,
    enps: enps
  };

  goldEvaluations.push({
    id: `eval-${i + 1}`,
    organization_id: orgId,
    period: period,
    zone: zone,
    departamento: zone,
    turno: (i % 2 === 0) ? 'Turno matutino' : 'Turno vespertino',
    antiguedad: (i % 3 === 0) ? '<1 año' : ((i % 3 === 1) ? '1-3 años' : '>5 años'),
    nivel_puesto: (i < 20) ? 'Directivo' : 'Operativo',
    respuestas: respuestas
  });
}
