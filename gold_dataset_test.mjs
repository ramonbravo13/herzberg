/**
 * gold_dataset_test.mjs
 * Rigorous Automated Test Suite validating the 100-record Gold Dataset against Mathematical Ground Truths.
 */

import { goldEvaluations, GOLD_TRUTHS } from './gold_dataset.mjs';
import { 
  calculateIndex, 
  calculateExactPercentages, 
  calculateEnps, 
  calculateBurnout, 
  calculateTopRisks,
  filterEvaluations,
  sanitizeLikert,
  INDICES_CONFIG
} from './src/utils/metrics.js';

let passed = 0;
let failed = 0;

function assert(name, actual, expected) {
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  if (isMatch) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}\n         Obtenido: ${JSON.stringify(actual)}\n         Esperado: ${JSON.stringify(expected)}`);
    failed++;
  }
}

console.log('================================================================');
console.log(' PROTOCOLO CERO TOLERANCIA: PRUEBAS AUTOMATIZADAS GOLD DATASET');
console.log('================================================================\n');

// 1. DATASET INTEGRITY
console.log('--- 1. Integridad Estructural del Gold Dataset (N = 100) ---');
assert('Total de evaluaciones generadas es exactamente 100', goldEvaluations.length, GOLD_TRUTHS.totalEvaluations);

// 2. COMBINATORIAL FILTERING & N=0 SAFETY
console.log('\n--- 2. Pruebas de Filtros Combinados (Org + Periodo + Zona) y N=0 ---');
const alphaAll = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha' });
assert('Filtro Org Alpha devuelve 80 registros', alphaAll.length, GOLD_TRUTHS.filters.orgAlphaCount);

const betaAll = filterEvaluations(goldEvaluations, { organizationId: 'org-beta' });
assert('Filtro Org Beta devuelve 20 registros', betaAll.length, GOLD_TRUTHS.filters.orgBetaCount);

const alphaP1 = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha', period: 1 });
assert('Filtro Org Alpha + Periodo 1 devuelve 50 registros', alphaP1.length, GOLD_TRUTHS.filters.orgAlphaPeriod1Count);

const alphaP2 = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha', period: 2 });
assert('Filtro Org Alpha + Periodo 2 devuelve 30 registros', alphaP2.length, GOLD_TRUTHS.filters.orgAlphaPeriod2Count);

const alphaP1Ventas = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha', period: 1, zone: 'Ventas' });
assert('Filtro Combinado Org Alpha + P1 + Ventas devuelve 20 registros', alphaP1Ventas.length, GOLD_TRUTHS.filters.orgAlphaP1VentasCount);

const alphaP1Ops = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha', period: 1, zone: 'Operaciones' });
assert('Filtro Combinado Org Alpha + P1 + Operaciones devuelve 20 registros', alphaP1Ops.length, GOLD_TRUTHS.filters.orgAlphaP1OperacionesCount);

const alphaP1Tec = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha', period: 1, zone: 'Tecnologia' });
assert('Filtro Combinado Org Alpha + P1 + Tecnologia devuelve 10 registros', alphaP1Tec.length, GOLD_TRUTHS.filters.orgAlphaP1TecnologiaCount);

// Test case-insensitivity and whitespace trim
const alphaP1VentasCase = filterEvaluations(goldEvaluations, { organizationId: 'org-alpha', period: 1, zone: '  ventas  ' });
assert('Filtro de zona es insensible a mayúsculas y espacios (  ventas  )', alphaP1VentasCase.length, 20);

// N = 0 Edge Case
const nonExistent = filterEvaluations(goldEvaluations, { organizationId: 'org-inexistente', period: 99 });
assert('Filtro sin coincidencias retorna array vacío seguro (N = 0)', nonExistent.length, 0);

// 3. eNPS CALCULATION & RESILIENCE
console.log('\n--- 3. Validación Estadística de eNPS y Manejo de Nulos ---');
const enpsResult = calculateEnps(goldEvaluations);
assert('Total de respuestas válidas de eNPS omite exactamente los 10 nulos (N = 90)', 
  enpsResult.totalValidos, GOLD_TRUTHS.enps.totalValidos);
assert('Conteo exacto de Promotores (9-10)', enpsResult.promotores, GOLD_TRUTHS.enps.promotores);
assert('Conteo exacto de Pasivos (7-8)', enpsResult.pasivos, GOLD_TRUTHS.enps.pasivos);
assert('Conteo exacto de Detractores legítimos (0-6) sin nulos espurios', 
  enpsResult.detractores, GOLD_TRUTHS.enps.detractores);
assert('Score eNPS matemático exacto (+17)', enpsResult.score, GOLD_TRUTHS.enps.score);
assert('Distribución eNPS Promotores (Hare-Niemeyer: 44%)', 
  enpsResult.distribution.Promotores, GOLD_TRUTHS.enps.distribution.Promotores);
assert('Distribución eNPS Pasivos (Hare-Niemeyer: 28%)', 
  enpsResult.distribution.Pasivos, GOLD_TRUTHS.enps.distribution.Pasivos);
assert('Distribución eNPS Detractores (Hare-Niemeyer: 28%)', 
  enpsResult.distribution.Detractores, GOLD_TRUTHS.enps.distribution.Detractores);
assert('Suma de la distribución de eNPS es exactamente 100%', 
  enpsResult.distribution.Promotores + enpsResult.distribution.Pasivos + enpsResult.distribution.Detractores, 100);

// eNPS with N = 0
const enpsEmpty = calculateEnps([]);
assert('calculateEnps([]) ante N = 0 retorna score 0 y suma 0 sin NaN', enpsEmpty.score, 0);

// 4. BURNOUT RISK EXACT CALCULATION
console.log('\n--- 4. Validación de Índice de Burnout y Denominador Limpio ---');
const burnoutResult = calculateBurnout(goldEvaluations);
assert('Burnout omite las 5 respuestas incompletas (Denominador válido = 95)', 
  burnoutResult.totalValidos, GOLD_TRUTHS.burnout.totalValidos);
assert('Conteo exacto de colaboradores con Burnout Severo = 12', 
  burnoutResult.burnoutCount, GOLD_TRUTHS.burnout.burnoutCount);
assert('Conteo exacto de colaboradores En Riesgo = 18', 
  burnoutResult.atRiskCount, GOLD_TRUTHS.burnout.atRiskCount);
assert('Porcentaje de Burnout Severo = 13%', 
  burnoutResult.burnoutPct, GOLD_TRUTHS.burnout.burnoutPct);
assert('Porcentaje En Riesgo = 19%', 
  burnoutResult.atRiskPct, GOLD_TRUTHS.burnout.atRiskPct);

// Burnout with N = 0
const burnoutEmpty = calculateBurnout([]);
assert('calculateBurnout([]) ante N = 0 retorna ceros sin lanzar excepción', burnoutEmpty.burnoutPct, 0);

// 5. TOP 3 RISKS & RANKING INTEGRITY
console.log('\n--- 5. Validación de Top 3 Áreas de Oportunidad ---');
const topRisks = calculateTopRisks(goldEvaluations, 3);
assert('Top 3 retorna exactamente 3 elementos', topRisks.length, 3);
assert('#1 Mayor Riesgo es "salario_1" con 25%', topRisks[0].key, GOLD_TRUTHS.topRisksKeys[0]);
assert('#1 Score de salario_1 es 25%', topRisks[0].score, GOLD_TRUTHS.topRisksScores.salario_1);

assert('#2 Mayor Riesgo es "reconocimiento_1" con 30%', topRisks[1].key, GOLD_TRUTHS.topRisksKeys[1]);
assert('#2 Score de reconocimiento_1 es 30%', topRisks[1].score, GOLD_TRUTHS.topRisksScores.reconocimiento_1);

assert('#3 Mayor Riesgo es "promocion_1" con 35%', topRisks[2].key, GOLD_TRUTHS.topRisksKeys[2]);
assert('#3 Score de promocion_1 es 35%', topRisks[2].score, GOLD_TRUTHS.topRisksScores.promocion_1);

// Top risks when questions are completely unanswered
const mockUnanswered = [{ respuestas: {} }];
assert('calculateTopRisks excluye preguntas sin respuestas y retorna [] ante N=0 respuestas', 
  calculateTopRisks(mockUnanswered).length, 0);

// 6. HERZBERG FORMULA & LIKERT NORMALIZATION
console.log('\n--- 6. Validación de Normalización Herzberg [0, 100]% ---');
assert('Índice individual de salario_1 coincide exactamente con 25%', 
  calculateIndex(['salario_1'], goldEvaluations), 25);
assert('Índice individual de reconocimiento_1 coincide exactamente con 30%', 
  calculateIndex(['reconocimiento_1'], goldEvaluations), 30);
assert('Índice individual de promocion_1 coincide exactamente con 35%', 
  calculateIndex(['promocion_1'], goldEvaluations), 35);
assert('Índice de reactivo con respuesta 4 es exactamente 75%', 
  calculateIndex(['logro_1'], goldEvaluations), 75);

// Boundary tests for Herzberg
assert('calculateIndex con array vacío de variables retorna 0', calculateIndex([], goldEvaluations), 0);
assert('calculateIndex con array vacío de datos retorna 0', calculateIndex(['logro_1'], []), 0);
assert('calculateIndex con null o undefined maneja caso borde retornando 0', calculateIndex(null, null), 0);

console.log('\n================================================================');
console.log(` RESULTADO FINAL DE LA SUITE: ${passed} PASADAS / ${failed} FALLIDAS`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('>> PROTOCOLO CERO TOLERANCIA: CERTIFICACION MATEMATICA SATISFECHA AL 100% <<\n');
}
