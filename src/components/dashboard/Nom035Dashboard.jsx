import React from 'react';
import { 
  evaluateGuia1, 
  calculateGuia2Score, 
  calculateGuia3Score, 
  getRiskLevelG2, 
  getRiskLevelG3, 
  getRiskColorAndAction,
  calculateAggregateGroupScores,
  G3_CATEGORIES,
  G3_DOMAINS,
  G2_CATEGORIES,
  G2_DOMAINS
} from '../../utils/nom035_metrics';
import { AlertTriangle, ShieldCheck, Stethoscope, Briefcase, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Nom035Dashboard({ dataArray }) {
  if (!dataArray || dataArray.length === 0) return null;

  // Process data for NOM-035
  let countG1 = 0;
  let requireClinical = 0;
  const atsBreakdown = {
    "Accidentes graves": 0,
    "Asaltos": 0,
    "Actos Violentos": 0,
    "Secuestro": 0,
    "Amenazas": 0,
    "Otros eventos": 0
  };

  let countG2 = 0;
  let totalScoreG2 = 0;

  let countG3 = 0;
  let totalScoreG3 = 0;

  dataArray.forEach(d => {
    const nr = d.nom035_respuestas;
    if (nr) {
      if (nr.ats_1) {
        countG1++;
        if (evaluateGuia1(nr)) {
          requireClinical++;
        }
        // Breakdown
        if (nr.ats_1 === 'SI') atsBreakdown["Accidentes graves"]++;
        if (nr.ats_2 === 'SI') atsBreakdown["Asaltos"]++;
        if (nr.ats_3 === 'SI') atsBreakdown["Actos Violentos"]++;
        if (nr.ats_4 === 'SI') atsBreakdown["Secuestro"]++;
        if (nr.ats_5 === 'SI') atsBreakdown["Amenazas"]++;
        if (nr.ats_6 === 'SI') atsBreakdown["Otros eventos"]++;
      }
      
      if (nr.g2_1 !== undefined) {
        countG2++;
        totalScoreG2 += calculateGuia2Score(nr);
      }
      
      if (nr.g3_1 !== undefined) {
        countG3++;
        totalScoreG3 += calculateGuia3Score(nr);
      }
    }
  });

  const avgG2 = countG2 > 0 ? Math.round(totalScoreG2 / countG2) : 0;
  const riskG2 = getRiskLevelG2(avgG2);
  const infoG2 = getRiskColorAndAction(riskG2);

  const avgG3 = countG3 > 0 ? Math.round(totalScoreG3 / countG3) : 0;
  const riskG3 = getRiskLevelG3(avgG3);
  const infoG3 = getRiskColorAndAction(riskG3);

  const hasG1 = countG1 > 0;
  const hasG2 = countG2 > 0;
  const hasG3 = countG3 > 0;

  if (!hasG1 && !hasG2 && !hasG3) {
    return (
      <div className="bg-slate-50 p-8 text-center rounded-2xl border border-slate-200">
        <p className="text-slate-500">No hay datos de la NOM-035 en las evaluaciones actuales.</p>
      </div>
    );
  }

  // Calculate Categories and Domains
  let catData = [];
  let domData = [];
  
  if (hasG3) {
    const categories = calculateAggregateGroupScores(dataArray, true, G3_CATEGORIES);
    const domains = calculateAggregateGroupScores(dataArray, true, G3_DOMAINS);
    catData = Object.keys(categories).map(k => ({ name: k, ...categories[k] }));
    domData = Object.keys(domains).map(k => ({ name: k, ...domains[k] }));
  } else if (hasG2) {
    const categories = calculateAggregateGroupScores(dataArray, false, G2_CATEGORIES);
    const domains = calculateAggregateGroupScores(dataArray, false, G2_DOMAINS);
    catData = Object.keys(categories).map(k => ({ name: k, ...categories[k] }));
    domData = Object.keys(domains).map(k => ({ name: k, ...domains[k] }));
  }

  // Filter out critical domains
  const criticalDomains = domData.filter(d => d.risk === 'Alto' || d.risk === 'Muy Alto');

  return (
    <div className="space-y-6">
      
      {/* Resumen Ejecutivo de Guía II / III */}
      {(hasG2 || hasG3) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Calificación Final del Centro de Trabajo</h2>
              <p className="text-sm text-slate-500">Muestra evaluada: {hasG3 ? countG3 : countG2} colaboradores (Guía {hasG3 ? 'III' : 'II'})</p>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${hasG3 ? infoG3.bg : infoG2.bg} ${(hasG3 ? infoG3.color : infoG2.color).replace('text-', 'border-').replace('500', '200')}`}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Nivel de Riesgo Promedio</p>
                <div className={`text-5xl font-black ${hasG3 ? infoG3.color : infoG2.color}`}>{hasG3 ? riskG3 : riskG2}</div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-80">Puntuación Final</p>
                <div className={`text-3xl font-bold ${hasG3 ? infoG3.color : infoG2.color}`}>{hasG3 ? avgG3 : avgG2} pts</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-black/5">
              <p className="text-sm font-medium"><strong>Hoja de Ruta de Acción (Nivel Macro):</strong> {hasG3 ? infoG3.action : infoG2.action}</p>
            </div>
          </div>
        </div>
      )}

      {/* Análisis por Categorías y Dominios */}
      {(hasG2 || hasG3) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Briefcase size={20} className="text-indigo-500"/> Riesgo por Categorías
             </h3>
             <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={catData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                   <XAxis type="number" domain={[0, 100]} />
                   <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                   <Tooltip 
                     cursor={{fill: 'transparent'}}
                     content={({ active, payload }) => {
                       if (active && payload && payload.length) {
                         const data = payload[0].payload;
                         return (
                           <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg">
                             <p className="font-semibold text-slate-800">{data.name}</p>
                             <p className="text-sm font-bold" style={{color: data.hex}}>Índice: {data.score}% - Riesgo {data.risk}</p>
                           </div>
                         );
                       }
                       return null;
                     }}
                   />
                   <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                     {catData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.hex} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <AlertTriangle size={20} className="text-red-500"/> Dominios Críticos (Focos Rojos)
             </h3>
             <p className="text-sm text-slate-600 mb-4">
               La norma STPS exige realizar programas de intervención a nivel grupal para los siguientes dominios, ya que superan los umbrales permisibles.
             </p>
             
             {criticalDomains.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                 <ShieldCheck size={48} className="text-emerald-400 mb-3" />
                 <h4 className="font-bold text-emerald-800">No hay Dominios Críticos</h4>
                 <p className="text-sm text-emerald-600 mt-1">Ningún dominio presenta riesgo Alto o Muy Alto en la evaluación actual.</p>
               </div>
             ) : (
               <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                 {criticalDomains.map((d, i) => (
                   <div key={i} className={`p-4 rounded-xl border ${d.bg} border-red-200`}>
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-slate-800">{d.name}</span>
                       <span className={`text-xs font-bold px-2 py-1 rounded-md text-white`} style={{backgroundColor: d.hex}}>
                         {d.risk}
                       </span>
                     </div>
                     <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: `${d.score}%`, backgroundColor: d.hex }}></div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* Guía I: Acontecimientos Traumáticos */}
      {hasG1 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Stethoscope size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Guía de Referencia I: Acontecimientos Traumáticos Severos (ATS)</h2>
              <p className="text-sm text-slate-500">Muestra evaluada: {countG1} colaboradores</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Resumen Numerico */}
            <div className="md:w-1/3 flex flex-col gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                <span className="text-4xl font-black text-slate-800">{countG1 - requireClinical}</span>
                <span className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1"><ShieldCheck size={16}/> Sin riesgo clínico</span>
              </div>
              
              <div className={`p-5 rounded-xl border flex flex-col justify-center items-center text-center ${requireClinical > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                <span className={`text-4xl font-black ${requireClinical > 0 ? 'text-red-600' : 'text-slate-800'}`}>{requireClinical}</span>
                <span className={`text-sm font-medium mt-1 flex items-center gap-1 ${requireClinical > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                  {requireClinical > 0 && <AlertTriangle size={16}/>} 
                  Requieren valoración médica
                </span>
              </div>
            </div>

            {/* Desglose de Traumas */}
            <div className="md:w-2/3 p-5 border border-slate-100 rounded-xl bg-white shadow-sm flex flex-col justify-center">
               <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Tipos de Acontecimientos Presenciados</h3>
               <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                 {Object.entries(atsBreakdown).map(([evento, cantidad]) => (
                   <div key={evento} className="flex justify-between items-center border-b border-slate-50 pb-2">
                     <span className="text-sm text-slate-600">{evento}</span>
                     <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${cantidad > 0 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                       {cantidad}
                     </span>
                   </div>
                 ))}
               </div>
               {requireClinical > 0 && (
                 <div className="mt-6 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 italic">
                   Nota (Numeral 5.5): Canalizar obligatoriamente a los {requireClinical} trabajadores afectados a la institución de seguridad social (IMSS) o al médico de la empresa.
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
