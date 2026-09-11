import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!url || !serviceRoleKey) {
  console.error('Missing Supabase keys in .env');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomHerzberg() {
  const vars = [
    'logro_1', 'logro_2', 'logro_3',
    'reconocimiento_1', 'reconocimiento_2', 'reconocimiento_3',
    'trabajo_1', 'trabajo_2', 'trabajo_3',
    'responsabilidad_1', 'responsabilidad_2', 'responsabilidad_3',
    'crecimiento_1', 'crecimiento_2', 'crecimiento_3',
    'promocion_1', 'promocion_2', 'promocion_3',
    'salario_1', 'salario_2', 'salario_3',
    'supervision_1', 'supervision_2', 'supervision_3',
    'politicas_1', 'politicas_2', 'politicas_3',
    'relaciones_1', 'relaciones_2', 'relaciones_3',
    'condiciones_1', 'condiciones_2', 'condiciones_3',
    'seguridad_1', 'seguridad_2', 'seguridad_3',
    'satisfaccion_global', 'compromiso', 'permanencia'
  ];
  const respuestas = {};
  vars.forEach(v => {
    // Generate realistic distribution (leaning positive)
    respuestas[v] = randomChoice([3, 4, 4, 5, 5, 5, 2, 3]); 
  });
  respuestas.enps = randomChoice([7, 8, 9, 9, 10, 10, 6, 5]);
  return respuestas;
}

function generateRandomNom035(headcount) {
  const nom035 = {};
  // Guide 1 (ATS)
  for (let i = 1; i <= 20; i++) {
    nom035[`ats_${i}`] = randomChoice(['NO', 'NO', 'NO', 'NO', 'SI']); 
  }

  if (headcount > 15 && headcount <= 50) {
    // Guide 2
    for (let i = 1; i <= 46; i++) {
      nom035[`g2_${i}`] = randomChoice([1, 2, 3, 4, 5]);
    }
  } else if (headcount > 50) {
    // Guide 3
    for (let i = 1; i <= 72; i++) {
      nom035[`g3_${i}`] = randomChoice([1, 2, 3, 4, 5]);
    }
  }
  return nom035;
}

async function run() {
  console.log('Fetching organizations...');
  const { data: orgs, error } = await supabase.from('organizations').select('*');
  if (error) {
    console.error('Error fetching orgs:', error);
    return;
  }

  for (const org of orgs) {
    console.log(`\nProcessing Organization: ${org.name}`);
    
    // First wipe existing evaluations for a clean state
    console.log(`Wiping existing evaluations for ${org.name}...`);
    await supabase.from('evaluations').delete().eq('organization_id', org.id);

    const zones = org.zone_headcounts || {};
    let totalHeadcount = org.expected_headcount || 0;
    
    // If expected_headcount is missing or smaller than zones, recalculate
    const zonesSum = Object.values(zones).reduce((a, b) => a + b, 0);
    if (zonesSum > totalHeadcount) {
      totalHeadcount = zonesSum;
    }

    if (totalHeadcount === 0) {
      console.log(`No expected headcount set for ${org.name}. Skipping.`);
      continue;
    }

    console.log(`Total Headcount: ${totalHeadcount}`);
    
    let toInsert = [];

    // Seed by zone
    for (const [zoneName, headcount] of Object.entries(zones)) {
      console.log(`- Seeding Zone: ${zoneName} with ${headcount} evaluations.`);
      for (let i = 0; i < headcount; i++) {
        toInsert.push(createEvaluationObject(org, totalHeadcount, zoneName));
      }
    }

    // Determine how many are left for unassigned/general (no zone)
    const remaining = totalHeadcount - zonesSum;
    if (remaining > 0) {
      console.log(`- Seeding remaining ${remaining} evaluations without zone.`);
      for (let i = 0; i < remaining; i++) {
        toInsert.push(createEvaluationObject(org, totalHeadcount, null));
      }
    }

    if (toInsert.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < toInsert.length; i += chunkSize) {
        const chunk = toInsert.slice(i, i + chunkSize);
        const { error: insertError } = await supabase.from('evaluations').insert(chunk);
        if (insertError) {
          console.error(`Error inserting chunk for ${org.name}:`, insertError);
        } else {
          console.log(`  Inserted ${chunk.length} evaluations for ${org.name}`);
        }
      }
    }
  }
  
  console.log('\n✅ Seeding complete!');
}

function createEvaluationObject(org, totalHeadcount, zone) {
  const turnos = ['Turno matutino', 'Turno vespertino', 'Turno nocturno', 'Esquema rotativo'];
  const antiguedades = ['Menos de 1 año', '1–3 años', '4–7 años', '8–15 años', 'Más de 15 años'];
  const niveles = ['Operativo', 'Técnico', 'Administrativo', 'Coordinación', 'Directivo'];
  
  const results = {
    turno: randomChoice(turnos),
    antiguedad: randomChoice(antiguedades),
    nivel_puesto: randomChoice(niveles),
    nombre_canalizacion: null,
    diagnostico: {
      liderazgo: "Me orienta, capacita y acompaña en el desarrollo",
      dinamica: "De colaboración y respeto mutuo",
      condiciones: "Instalaciones cómodas y ergonómicas"
    },
    respuestas: generateRandomHerzberg(),
    nom035_respuestas: generateRandomNom035(totalHeadcount),
    comentarios: {
      fortaleza: randomChoice(["El ambiente", "El sueldo", "Mis compañeros", "El aprendizaje", "La flexibilidad"]),
      mejora: randomChoice(["El aire acondicionado", "Más descansos", "Mejor equipo de cómputo", "Menos ruido", ""])
    },
    departamento: zone || randomChoice(["Ventas", "IT", "Marketing", "Operaciones"])
  };

  return {
    organization_id: org.id,
    period: org.current_period || 1,
    participant_id: crypto.randomUUID(),
    zone: zone,
    results: results
  };
}

run();
