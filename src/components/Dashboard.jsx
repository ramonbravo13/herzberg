import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { calculateIndex, getRiskColor, getRiskLabel, INDICES_CONFIG } from '../utils/metrics';
import TopRisks from './dashboard/TopRisks';
import QuadrantMatrix from './dashboard/QuadrantMatrix';
import Heatmap from './dashboard/Heatmap';
import TenureGap from './dashboard/TenureGap';
import ThematicAnalysis from './dashboard/ThematicAnalysis';
import HierarchyGap from './dashboard/HierarchyGap';
import FlightRiskDrivers from './dashboard/FlightRiskDrivers';
import EnpsRadar from './dashboard/EnpsRadar';
import BurnoutRisk from './dashboard/BurnoutRisk';
import RetentionMatrix from './dashboard/RetentionMatrix';

export default function Dashboard({ data }) {
  const [selectedMetric, setSelectedMetric] = useState(null);

  const dataArray = Array.isArray(data) ? data : [data];
  if (dataArray.length === 0 || (!dataArray[0] || !dataArray[0].respuestas)) return <div>No hay datos para mostrar.</div>;

  const isAggregated = dataArray.length > 1;

  const chartData = INDICES_CONFIG.map(ind => {
    const score = calculateIndex(ind.vars, dataArray);
    return { name: ind.name, score, fill: getRiskColor(score) };
  });

  const satisfaccionScore = calculateIndex(['satisfaccion_global'], dataArray);
  const compromisoScore = calculateIndex(['compromiso'], dataArray);
  
  const rotacionRiesgo = 100 - calculateIndex(['permanencia'], dataArray); 
  
  // eNPS
  let enpsSum = 0;
  let enpsCount = 0;
  dataArray.forEach(d => {
    if (d.respuestas && d.respuestas.enps !== undefined) {
      enpsSum += Number(d.respuestas.enps);
      enpsCount++;
    }
  });
  const enpsScore = enpsCount > 0 ? Math.round((enpsSum / enpsCount) * 10) : 0;

  const fortalezas = dataArray.map(d => d.comentarios?.fortaleza).filter(Boolean).slice(0, 3);
  const mejoras = dataArray.map(d => d.comentarios?.mejora).filter(Boolean).slice(0, 3);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {isAggregated ? 'Resultados Organizacionales Agregados' : 'Resultados de Evaluación Individual'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {isAggregated ? (
              <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
                Muestra Total: {dataArray.length} Evaluaciones
              </div>
            ) : (
              <>
                <div className="bg-slate-100 px-3 py-1 rounded-full"><strong>Depto:</strong> {dataArray[0].departamento}</div>
                <div className="bg-slate-100 px-3 py-1 rounded-full"><strong>Antigüedad:</strong> {dataArray[0].antiguedad}</div>
                <div className="bg-slate-100 px-3 py-1 rounded-full"><strong>Nivel:</strong> {dataArray[0].nivel_puesto}</div>
              </>
            )}
          </div>
        </header>

        <TheoryContext />

        {isAggregated && <TopRisks dataArray={dataArray} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ScoreCard title="Satisfacción Global" score={satisfaccionScore} onClick={() => setSelectedMetric('satisfaccion')} />
          <ScoreCard title="Compromiso" score={compromisoScore} onClick={() => setSelectedMetric('compromiso')} />
          <ScoreCard title="Riesgo de Rotación" score={rotacionRiesgo} inverseRisk={true} onClick={() => setSelectedMetric('rotacion')} />
          <ScoreCard title="eNPS Promedio" score={enpsScore} onClick={() => setSelectedMetric('enps')} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-6 text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Índices por Factor (0 - 100)</h2>
            <div className="text-sm text-slate-600 flex flex-wrap justify-center gap-6 mb-2">
              <span><strong className="text-emerald-600">80-100:</strong> Fortaleza</span>
              <span><strong className="text-amber-500">60-79:</strong> Aceptable</span>
              <span><strong className="text-orange-500">40-59:</strong> Riesgo</span>
              <span><strong className="text-red-500">0-39:</strong> Riesgo Alto</span>
            </div>
            <p className="text-xs text-slate-400 italic">(Haz clic en cualquier barra para ver los detalles)</p>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value;
                      return (
                        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-lg pointer-events-none">
                          <p className="font-semibold text-slate-800">{payload[0].payload.name}</p>
                          <p className="text-lg font-bold" style={{color: getRiskColor(val)}}>{val}% - {getRiskLabel(val)}</p>
                          <p className="text-xs text-slate-400 mt-1">Clic para ver detalles</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="score" 
                  radius={[0, 4, 4, 0]}
                  cursor="pointer"
                  onClick={(data) => setSelectedMetric(data.name)}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {isAggregated && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <QuadrantMatrix dataArray={dataArray} />
              <TenureGap dataArray={dataArray} />
            </div>
            <Heatmap dataArray={dataArray} />
            <ThematicAnalysis dataArray={dataArray} />

            <div className="pt-8 pb-4 border-t-2 border-slate-200 mt-12">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <span className="bg-indigo-600 text-white p-2 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </span>
                Insights Estratégicos Avanzados
              </h2>
              <p className="text-slate-500 mt-2">Módulos de consultoría analítica para la toma de decisiones directivas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RetentionMatrix dataArray={dataArray} />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <BurnoutRisk dataArray={dataArray} />
                <FlightRiskDrivers dataArray={dataArray} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HierarchyGap dataArray={dataArray} />
              <EnpsRadar dataArray={dataArray} />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Lo que más valoran (Fortalezas)</h3>
            <ul className="space-y-3">
              {fortalezas.map((f, i) => (
                <li key={i} className="text-slate-600 italic border-l-4 border-emerald-400 pl-3 py-1 bg-slate-50 rounded-r-md">"{f}"</li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Oportunidades de Mejora</h3>
            <ul className="space-y-3">
              {mejoras.map((m, i) => (
                <li key={i} className="text-slate-600 italic border-l-4 border-orange-400 pl-3 py-1 bg-slate-50 rounded-r-md">"{m}"</li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {selectedMetric && (
        <MetricModal 
          metricId={selectedMetric} 
          dataArray={dataArray} 
          onClose={() => setSelectedMetric(null)} 
        />
      )}
    </div>
  );
}

function ScoreCard({ title, score, inverseRisk = false, onClick }) {
  let color = getRiskColor(score);
  if (inverseRisk) {
    color = getRiskColor(100 - score);
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98] group relative"
    >
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-2">{title}</h3>
      <div className="text-4xl font-black" style={{ color }}>
        {score}
      </div>
    </div>
  );
}

function MetricModal({ metricId, dataArray, onClose }) {
  let title = '';
  let explanation = '';
  let distribution = [0,0,0,0,0,0];
  let distribution10 = Array(11).fill(0);
  
  let totalDataPoints = 0; // The denominator for percentages

  const indexConfig = INDICES_CONFIG.find(i => i.name === metricId);

  if (indexConfig) {
    title = `Factor: ${indexConfig.name}`;
    explanation = indexConfig.explanation;
    
    dataArray.forEach(d => {
      indexConfig.vars.forEach(v => {
        const val = d.respuestas && d.respuestas[v];
        if (val !== undefined) {
          distribution[val]++;
          totalDataPoints++;
        }
      });
    });
  } else if (metricId === 'satisfaccion') {
    title = 'Satisfacción Global';
    explanation = 'Se obtiene de la pregunta: "En general, ¿qué tan satisfecho te sientes con tu trabajo?". Se convierte de la escala 1-5 a un porcentaje de 0 a 100. Refleja la percepción general e instantánea del colaborador sobre su empleo en la organización.';
    dataArray.forEach(d => {
      const val = d.respuestas && d.respuestas['satisfaccion_global'];
      if (val !== undefined) { distribution[val]++; totalDataPoints++; }
    });
  } else if (metricId === 'compromiso') {
    title = 'Compromiso';
    explanation = 'Mide la alineación del empleado con la empresa: "¿Qué tan comprometido te sientes con los objetivos de la organización?". Un mayor compromiso se traduce en mayor retención, productividad y disposición a dar el esfuerzo extra.';
    dataArray.forEach(d => {
      const val = d.respuestas && d.respuestas['compromiso'];
      if (val !== undefined) { distribution[val]++; totalDataPoints++; }
    });
  } else if (metricId === 'rotacion') {
    title = 'Riesgo de Rotación';
    explanation = 'Calculado a partir de la pregunta: "¿Qué tan probable es que continúes trabajando aquí durante los próximos dos años?". Entre menor sea la intención de permanencia (respuesta baja), mayor es el cálculo del riesgo de que el talento abandone la empresa.';
    dataArray.forEach(d => {
      const val = d.respuestas && d.respuestas['permanencia'];
      if (val !== undefined) { distribution[val]++; totalDataPoints++; }
    });
  } else if (metricId === 'enps') {
    title = 'eNPS Promedio';
    explanation = 'El Employee Net Promoter Score proviene de la pregunta (escala 0-10): "¿Qué tan probable es que recomiendes esta organización como un buen lugar para trabajar?". Tradicionalmente clasifica en Promotores (9-10), Pasivos (7-8) y Detractores (0-6). Aquí se muestra el puntaje promedio de la evaluación general.';
    dataArray.forEach(d => {
      const val = d.respuestas && d.respuestas['enps'];
      if (val !== undefined) { distribution10[val]++; totalDataPoints++; }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-2xl leading-none">&times;</button>
        </div>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {explanation}
        </p>

        <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Desglose de Respuestas Originales</h3>
        
        <div className="space-y-3">
          {metricId === 'enps' ? (
            distribution10.map((count, i) => {
              if (count === 0) return null;
              const pct = totalDataPoints > 0 ? Math.round((count / totalDataPoints) * 100) : 0;
              let label = 'Detractor';
              let colorClass = 'bg-red-400';
              if (i >= 7 && i <= 8) { label = 'Pasivo'; colorClass = 'bg-amber-400'; }
              if (i >= 9) { label = 'Promotor'; colorClass = 'bg-emerald-400'; }
              return (
                <div key={i} className="flex items-center text-sm">
                  <div className="w-28 text-slate-500 font-medium">Valor {i} <span className="text-xs opacity-70">({label})</span></div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-3 overflow-hidden">
                    <div className={`${colorClass} h-full rounded-full`} style={{width: `${pct}%`}}></div>
                  </div>
                  <div className="w-12 text-right font-semibold text-slate-700">{pct}%</div>
                </div>
              );
            }).reverse() // Reverse to show 10 at top
          ) : (
            [5,4,3,2,1].map(val => {
              const count = distribution[val];
              if (count === 0) return null;
              const pct = totalDataPoints > 0 ? Math.round((count / totalDataPoints) * 100) : 0;
              const labels = ['','Nunca','Rara vez','Algunas veces','Casi siempre','Siempre'];
              return (
                <div key={val} className="flex items-center text-sm">
                  <div className="w-28 text-slate-600 font-medium truncate" title={labels[val]}>{val} - {labels[val]}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 mx-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full opacity-80" style={{width: `${pct}%`}}></div>
                  </div>
                  <div className="w-12 text-right font-semibold text-slate-700">{pct}%</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function TheoryContext() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800">Contexto Metodológico: Teoría de Herzberg</h2>
        </div>
        <div className="text-slate-400 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-5 pt-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <p>
            Este dashboard basa sus métricas en la <strong>Teoría de los Dos Factores de Frederick Herzberg</strong>, un estándar global en psicología organizacional. Herzberg postula que la satisfacción y la insatisfacción no son opuestos directos, sino que son generadas por dos grupos distintos de variables que deben gestionarse de forma independiente:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <h4 className="font-bold text-emerald-800">1. Factores Motivacionales</h4>
              </div>
              <p className="text-emerald-700/90 text-justify">Son intrínsecos a la naturaleza del trabajo en sí (Logro, Reconocimiento, Responsabilidad, Crecimiento Profesional). <strong>Su presencia genera verdadera satisfacción y fomenta el compromiso a largo plazo</strong>. Su carencia no genera quejas inmediatas, pero produce empleados estancados y sin iniciativa.</p>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <h4 className="font-bold text-amber-800">2. Factores de Higiene</h4>
              </div>
              <p className="text-amber-700/90 text-justify">Son externos al empleado (Salario, Políticas, Relaciones, Seguridad Laboral, Supervisión). <strong>Su deficiencia causa una profunda insatisfacción y motiva la fuga de talento</strong>. Sin embargo, aunque sean excelentes, los empleados rápidamente los dan por sentado, por lo que no generan motivación real por sí solos.</p>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
            <p className="font-semibold text-slate-800 mb-1">¿Cómo leer estas métricas?</p>
            <p>A través de la IA se evaluaron 36 variables estandarizadas. Las respuestas se promedian en un índice del <strong>0 al 100</strong>. Valores por encima de 80 representan <strong className="text-emerald-600">Fortalezas</strong>, mientras que índices por debajo de 60 se consideran de <strong className="text-orange-500">Riesgo</strong> y requieren intervención para evitar pérdida de productividad o rotación.</p>
          </div>
        </div>
      )}
    </div>
  );
}
