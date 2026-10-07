import React, { useMemo } from 'react';
import { calculateIndex } from '../../utils/metrics';
import { Users, AlertTriangle, ShieldCheck, TrendingUp, TrendingDown, Target, BrainCircuit } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';

export default function RetentionProfiles({ dataArray }) {
  const profiles = useMemo(() => {
    // 1. Filtrar a los grupos
    // Talento que se queda (Permanencia >= 4)
    const loyal = dataArray.filter(d => {
      const p = d.respuestas?.permanencia;
      return p && Number(p) >= 4;
    });

    // Talento en fuga (Permanencia <= 2)
    const flightRisk = dataArray.filter(d => {
      const p = d.respuestas?.permanencia;
      return p && Number(p) <= 2;
    });

    // Función auxiliar para encontrar la variable demográfica dominante
    const getDominantTrait = (arr, key) => {
      if (!arr || arr.length === 0) return 'N/D';
      const counts = {};
      arr.forEach(item => {
        const val = item[key];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });
      const entries = Object.entries(counts);
      if (entries.length === 0) return 'N/D';
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0][0]; // retorna el nombre del trait
    };

    const getProfileStats = (groupArray) => {
      if (groupArray.length < 3) {
        return { isHidden: true }; // Proteger el anonimato si hay menos de 3 personas
      }

      // Demografía dominante
      const domEdad = getDominantTrait(groupArray, 'edad');
      const domGenero = getDominantTrait(groupArray, 'genero');
      const domEstadoCivil = getDominantTrait(groupArray, 'estado_civil');
      const domAntiguedad = getDominantTrait(groupArray, 'antiguedad');
      const domNivel = getDominantTrait(groupArray, 'nivel_puesto');

      // Calcular motivadores e higiene promedios para el grupo
      const motivadoresVars = ['logro', 'reconocimiento', 'trabajo_en_si', 'responsabilidad', 'crecimiento'];
      const higieneVars = ['politicas', 'supervision', 'relaciones_jefe', 'condiciones_trabajo', 'salario', 'relaciones_pares', 'vida_personal'];

      const scoreMotivadores = calculateIndex(motivadoresVars, groupArray);
      const scoreHigiene = calculateIndex(higieneVars, groupArray);
      
      // Determinar el Top driver (qué es lo más alto o más bajo)
      let topDriver = { name: '', score: 0 };
      let worstDriver = { name: '', score: 100 };
      
      [...motivadoresVars, ...higieneVars].forEach(v => {
         const score = calculateIndex([v], groupArray);
         if(score > topDriver.score) topDriver = { name: v, score };
         if(score < worstDriver.score) worstDriver = { name: v, score };
      });

      return {
        isHidden: false,
        count: groupArray.length,
        demographics: {
          edad: domEdad,
          genero: domGenero,
          estadoCivil: domEstadoCivil,
          antiguedad: domAntiguedad,
          nivel: domNivel
        },
        scores: {
          motivadores: scoreMotivadores,
          higiene: scoreHigiene
        },
        drivers: {
          top: topDriver,
          worst: worstDriver
        }
      };
    };

    return {
      loyal: getProfileStats(loyal),
      flight: getProfileStats(flightRisk)
    };
  }, [dataArray]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BrainCircuit className="text-indigo-600" size={24} />
          Perfil de Permanencia vs. Riesgo de Fuga
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Análisis demográfico y psicológico basado en la intención declarada de permanencia. Identifica qué variables caracterizan a tu talento leal vs. el talento en riesgo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Loyal Persona */}
        <div className="border border-emerald-100 bg-emerald-50/30 rounded-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Talento que se Queda (Loyal Persona)</h4>
                <p className="text-xs text-emerald-700 font-medium">Alta intención de permanencia</p>
              </div>
            </div>

            {profiles.loyal.isHidden ? (
              <div className="py-8 text-center px-4 bg-white/50 rounded-lg">
                <ShieldCheck className="mx-auto text-emerald-300 mb-2" size={32} />
                <p className="text-sm font-semibold text-emerald-800">Datos insuficientes para el análisis.</p>
                <p className="text-xs text-emerald-600 mt-1">Se requiere un grupo mínimo de 3 personas en esta categoría para proteger el anonimato.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                    <span className="block text-xs text-slate-400 mb-1">Muestra Identificada</span>
                    <strong className="text-slate-800">{profiles.loyal.count} personas</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                    <span className="block text-xs text-slate-400 mb-1">Antigüedad Promedio</span>
                    <strong className="text-slate-800 capitalize">{profiles.loyal.demographics.antiguedad}</strong>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Arquetipo Demográfico Dominante</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.loyal.demographics.edad}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.loyal.demographics.genero}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.loyal.demographics.estadoCivil}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.loyal.demographics.nivel}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Motivadores Clave</h5>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500"/> Factores Motivacionales</span>
                    <span className="font-bold text-emerald-600"><AnimatedNumber value={profiles.loyal.scores.motivadores} />%</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><Target size={16} className="text-indigo-500"/> Driver Principal</span>
                    <span className="font-bold text-slate-800 capitalize">{profiles.loyal.drivers.top.name.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Esta es la variable que más retiene a este segmento en tu organización.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flight Risk Persona */}
        <div className="border border-red-100 bg-red-50/30 rounded-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-red-900">Talento en Riesgo (Flight Risk)</h4>
                <p className="text-xs text-red-700 font-medium">Alta probabilidad de renuncia a corto plazo</p>
              </div>
            </div>

            {profiles.flight.isHidden ? (
              <div className="py-8 text-center px-4 bg-white/50 rounded-lg">
                <AlertTriangle className="mx-auto text-red-300 mb-2" size={32} />
                <p className="text-sm font-semibold text-red-800">No hay suficientes datos de riesgo.</p>
                <p className="text-xs text-red-600 mt-1">Excelente noticia: No se detectó un grupo significativo de personas con alto riesgo de fuga en esta segmentación.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                    <span className="block text-xs text-slate-400 mb-1">Muestra Crítica</span>
                    <strong className="text-slate-800">{profiles.flight.count} personas</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                    <span className="block text-xs text-slate-400 mb-1">Antigüedad Crítica</span>
                    <strong className="text-slate-800 capitalize">{profiles.flight.demographics.antiguedad}</strong>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Arquetipo Demográfico Dominante</h5>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.flight.demographics.edad}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.flight.demographics.genero}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.flight.demographics.estadoCivil}</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium capitalize">{profiles.flight.demographics.nivel}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Focos Rojos Comunes</h5>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><TrendingDown size={16} className="text-red-500"/> Factores de Higiene</span>
                    <span className="font-bold text-red-600"><AnimatedNumber value={profiles.flight.scores.higiene} />%</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/> Factor Detonante</span>
                    <span className="font-bold text-slate-800 capitalize">{profiles.flight.drivers.worst.name.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Esta es la causa raíz de la insatisfacción que está motivando la salida de este perfil.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
