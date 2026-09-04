import React from 'react';
import { 
  evaluateGuia1, 
  calculateGuia2Score, 
  calculateGuia3Score, 
  getRiskLevelG2, 
  getRiskLevelG3, 
  getRiskColorAndAction 
} from '../../utils/nom035_metrics';
import { AlertTriangle, ShieldCheck, Stethoscope } from 'lucide-react';

export default function Nom035Dashboard({ dataArray }) {
  if (!dataArray || dataArray.length === 0) return null;

  // Process data for NOM-035
  let countG1 = 0;
  let requireClinical = 0;

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

  return (
    <div className="space-y-6">
      {/* Guía I */}
      {hasG1 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Stethoscope size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Guía de Referencia I: Acontecimientos Traumáticos Severos (ATS)</h2>
              <p className="text-sm text-slate-500">Muestra evaluada: {countG1} colaboradores</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex-1 bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
              <span className="text-4xl font-black text-slate-800">{countG1 - requireClinical}</span>
              <span className="text-sm font-medium text-emerald-600 mt-1 flex items-center gap-1"><ShieldCheck size={16}/> Sin riesgo clínico</span>
            </div>
            
            <div className={`flex-1 p-5 rounded-xl border flex flex-col justify-center items-center text-center ${requireClinical > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
              <span className={`text-4xl font-black ${requireClinical > 0 ? 'text-red-600' : 'text-slate-800'}`}>{requireClinical}</span>
              <span className={`text-sm font-medium mt-1 flex items-center gap-1 ${requireClinical > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                {requireClinical > 0 && <AlertTriangle size={16}/>} 
                Requieren valoración clínica
              </span>
            </div>
          </div>
          {requireClinical > 0 && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
              <strong>Atención requerida:</strong> De acuerdo al numeral 5.5 de la NOM-035, el centro de trabajo debe canalizar para su atención a los {requireClinical} trabajadores identificados a la institución de seguridad social, o privada, o al médico del centro de trabajo.
            </div>
          )}
        </div>
      )}

      {/* Guía II */}
      {hasG2 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Guía de Referencia II: Factores de Riesgo Psicosocial</h2>
              <p className="text-sm text-slate-500">Muestra evaluada: {countG2} colaboradores (Para centros de 16 a 50 trabajadores)</p>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${infoG2.bg} ${infoG2.color.replace('text-', 'border-').replace('500', '200')}`}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Nivel de Riesgo Promedio</p>
                <div className={`text-4xl font-black ${infoG2.color}`}>{riskG2}</div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-80">Puntuación Final</p>
                <div className={`text-2xl font-bold ${infoG2.color}`}>{avgG2} pts</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-black/5">
              <p className="text-sm font-medium"><strong>Hoja de Ruta de Acción:</strong> {infoG2.action}</p>
            </div>
          </div>
        </div>
      )}

      {/* Guía III */}
      {hasG3 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Guía de Referencia III: Entorno Organizacional</h2>
              <p className="text-sm text-slate-500">Muestra evaluada: {countG3} colaboradores (Para centros de más de 50 trabajadores)</p>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${infoG3.bg} ${infoG3.color.replace('text-', 'border-').replace('500', '200')}`}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-80">Nivel de Riesgo Promedio</p>
                <div className={`text-4xl font-black ${infoG3.color}`}>{riskG3}</div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-80">Puntuación Final</p>
                <div className={`text-2xl font-bold ${infoG3.color}`}>{avgG3} pts</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-black/5">
              <p className="text-sm font-medium"><strong>Hoja de Ruta de Acción:</strong> {infoG3.action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
