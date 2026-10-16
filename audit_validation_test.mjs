/**
 * audit_validation_test.mjs
 * Test suite to validate all mathematical formulas, type coercion guards,
 * and edge case calculations.
 */

import { 
  calculateIndex, 
  calculateExactPercentages, 
  calculateEnps, 
  calculateBurnout, 
  sanitizeLikert 
} from './src/utils/metrics.js';

let passed = 0;
let failed = 0;

function assert(description, actual, expected) {
  const isMatch = JSON.stringify(actual) === JSON.stringify(expected);
  if (isMatch) {
    console.log(`  [PASS] ${description}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${description}\n         Esperado: ${JSON.stringify(expected)}\n         Obtenido: ${JSON.stringify(actual)}`);
    failed++;
  }
}

console.log('--- TEST SUITE: AUDITORIA MATEMATICA Y DATA PIPELINE ---\n');

// 1. Likert Sanitizer & Herzberg Scale [1, 5]
console.log('1. Validacion de Escala Likert [1, 5]:');
assert('sanitizeLikert acepta 1', sanitizeLikert(1), 1);
assert('sanitizeLikert acepta 5', sanitizeLikert(5), 5);
assert('sanitizeLikert castea string "4"', sanitizeLikert("4"), 4);
assert('sanitizeLikert rechaza 0 (fuera de Likert)', sanitizeLikert(0), null);
assert('sanitizeLikert rechaza 6 (fuera de Likert)', sanitizeLikert(6), null);
assert('sanitizeLikert rechaza null', sanitizeLikert(null), null);
assert('sanitizeLikert rechaza undefined', sanitizeLikert(undefined), null);
assert('sanitizeLikert rechaza "" (string vacio)', sanitizeLikert(''), null);
assert('sanitizeLikert rechaza "abc"', sanitizeLikert('abc'), null);

// 2. Herzberg Index [0, 100]%
console.log('\n2. Calculo de Indice Herzberg:');
const mockEvals = [
  { respuestas: { logro_1: 5 } }, // 100%
  { respuestas: { logro_1: 1 } }, // 0%
  { respuestas: { logro_1: null } }, // Ignorado
  { respuestas: { logro_1: 0 } }, // Descartado (fuera de escala)
  { respuestas: { logro_1: "4" } } // 75%
];
// Validos: 5, 1, 4 -> Promedio = 10 / 3 = 3.3333333333
// Indice: ((3.3333333333 - 1) / 4) * 100 = (2.3333333333 / 4) * 100 = 58.33% -> 58%
assert('calculateIndex promedia solo respuestas validas descartando ceros y nulos', 
  calculateIndex(['logro_1'], mockEvals), 58);

// 3. Exact 100% Percentage Sums (Hare-Niemeyer / Largest Remainder)
console.log('\n3. Suma exacta de porcentajes al 100% (Largest Remainder Method):');
const pN3 = calculateExactPercentages({ a: 1, b: 1, c: 1 });
assert('N=3 (1, 1, 1) suma exactamente 100', pN3.a + pN3.b + pN3.c, 100);

const pN7 = calculateExactPercentages({ a: 3, b: 2, c: 2 });
assert('N=7 (3, 2, 2) suma exactamente 100', pN7.a + pN7.b + pN7.c, 100);

const pEmpty = calculateExactPercentages({ a: 0, b: 0, c: 0 });
assert('Total 0 retorna ceros sin crashear', pEmpty.a + pEmpty.b + pEmpty.c, 0);

// 4. eNPS Blindado contra coerción Number(null) === 0
console.log('\n4. Calculo de eNPS sin falsos detractores:');
const mockEnps = [
  { respuestas: { enps: 10 } }, // Promotor
  { respuestas: { enps: null } }, // Omision (NO debe ser detractor!)
  { respuestas: { enps: undefined } }, // Omision
  { respuestas: { enps: "9" } }, // Promotor (string)
  { respuestas: { enps: 7 } }, // Pasivo
  { respuestas: { enps: 0 } }, // Detractor legitimo
];
const resEnps = calculateEnps(mockEnps);
assert('eNPS cuenta solo 4 respuestas validas', resEnps.totalValidos, 4);
assert('eNPS cuenta 2 promotores', resEnps.promotores, 2);
assert('eNPS cuenta 1 pasivo', resEnps.pasivos, 1);
assert('eNPS cuenta 1 detractor (y NO los nulos)', resEnps.detractores, 1);
// (2 - 1) / 4 * 100 = 25
assert('eNPS score es +25', resEnps.score, 25);
assert('Distribucion eNPS suma 100%', 
  resEnps.distribution.Promotores + resEnps.distribution.Pasivos + resEnps.distribution.Detractores, 100);

// 5. Burnout Denominador y Trampa null <= 2
console.log('\n5. Burnout con proteccion contra nulos y denominador exacto:');
const mockBurnout = [
  { respuestas: { condiciones_3: 1, supervision_2: 1 } }, // Burnout
  { respuestas: { condiciones_3: 2, supervision_2: 4 } }, // At Risk
  { respuestas: { condiciones_3: null, supervision_2: null } }, // Ambos nulos: NO es burnout
  { respuestas: { condiciones_3: null, supervision_2: 1 } }, // Incompleto: NO es burnout
  { respuestas: { condiciones_3: 5, supervision_2: 5 } } // Saludable
];
const resBurnout = calculateBurnout(mockBurnout);
assert('Burnout omite encuestas incompletas del denominador (valido = 3)', resBurnout.totalValidos, 3);
assert('Burnout severo = 1 persona', resBurnout.burnoutCount, 1);
assert('Burnout at risk = 1 persona', resBurnout.atRiskCount, 1);
assert('Burnout porcentaje = 33%', resBurnout.burnoutPct, 33);

console.log(`\n========================================`);
console.log(`TOTAL RESULTADOS: ${passed} pasadas, ${failed} fallidas`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
