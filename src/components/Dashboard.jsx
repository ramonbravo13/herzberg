import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { calculateIndex, getRiskLabel, INDICES_CONFIG } from '../utils/metrics';
import { categoryColors, getCategoryColor, getGradientColor, globalPalette } from '../utils/themeColors';
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
import RoiSimulator from './dashboard/RoiSimulator';
import Nom035Dashboard from './dashboard/Nom035Dashboard';
import DiagnosticCharts from './dashboard/DiagnosticCharts';
import ShiftGap from './dashboard/ShiftGap';
import CriticalAlerts from './dashboard/CriticalAlerts';
import ChartCard from './charts/ChartCard';
import ChartTooltip from './charts/ChartTooltip';
import ChartGradients from './charts/ChartGradients';
import { chartTheme } from './charts/theme';
import { Activity, Smile, Target, Users, TrendingUp, PieChart as PieChartIcon, Info, X } from 'lucide-react';
import { PieChart, Pie, Cell as PieCell } from 'recharts';
import AnimatedNumber from './ui/AnimatedNumber';

export default function Dashboard({ data }) {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const dataArray = React.useMemo(() => (Array.isArray(data) ? data : [data]), [data]);
  
  const hasClimaData = React.useMemo(() => dataArray.some(d => d && d.respuestas), [dataArray]);
  const hasNomData = React.useMemo(() => dataArray.some(d => d && d.nom035_respuestas), [dataArray]);

  if (dataArray.length === 0 || (!hasClimaData && !hasNomData)) {
    return <div className="p-8 text-center text-slate-500">No hay datos válidos para mostrar.</div>;
  }

  const isAggregated = true; // Siempre mostrar gráficos organizacionales, incluso si hay 1 sola respuesta

  const chartData = React.useMemo(() => INDICES_CONFIG.map((ind, idx) => {
    const score = calculateIndex(ind.vars, dataArray);
    return { name: ind.name, score, fill: getCategoryColor(ind.name, idx) };
  }), [dataArray]);

  const satisfaccionScore = React.useMemo(() => calculateIndex(['satisfaccion_global'], dataArray), [dataArray]);
  const compromisoScore = React.useMemo(() => calculateIndex(['compromiso'], dataArray), [dataArray]);
  const rotacionRiesgo = React.useMemo(() => 100 - calculateIndex(['permanencia'], dataArray), [dataArray]);

  // eNPS
  const enpsScore = React.useMemo(() => {
    let promotores = 0;
    let detractores = 0;
    let total = 0;
    dataArray.forEach(d => {
      if (d.respuestas && d.respuestas.enps !== undefined) {
        const val = Number(d.respuestas.enps);
        total++;
        if (val >= 9) promotores++;
        else if (val <= 6) detractores++;
      }
    });
    return total > 0 ? Math.round(((promotores - detractores) / total) * 100) : 0;
  }, [dataArray]);

  const getTopComments = React.useCallback((key) => {
    const counts = {};
    dataArray.forEach(d => {
      const text = d.comentarios?.[key];
      if (text && text.trim().length > 0) {
        counts[text] = (counts[text] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([text, count]) => count > 1 ? `${text} (${count} menciones)` : text);
  }, [dataArray]);

  const fortalezas = React.useMemo(() => getTopComments('fortaleza'), [getTopComments]);
  const mejoras = React.useMemo(() => getTopComments('mejora'), [getTopComments]);

  // eNPS Distribution Data for PieChart
  const enpsPieData = React.useMemo(() => {
    const data = [
      { name: 'Promotores', value: dataArray.filter(d => d.respuestas?.enps >= 9).length, color: categoryColors['Promotores'] || '#34d399' },
      { name: 'Pasivos', value: dataArray.filter(d => d.respuestas?.enps >= 7 && d.respuestas?.enps <= 8).length, color: categoryColors['Pasivos'] || '#fbbf24' },
      { name: 'Detractores', value: dataArray.filter(d => d.respuestas?.enps <= 6 && d.respuestas?.enps !== undefined).length, color: categoryColors['Detractores'] || '#f87171' }
    ];
    return data.filter(d => d.value > 0);
  }, [dataArray]);

  return (
    <div className="w-full relative">
      
      {/* Sticky Header / Tabs */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200 pb-0 pt-5 px-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <h1 className="text-xl font-bold text-slate-800">
            {isAggregated ? 'Resultados Organizacionales Agregados' : 'Evaluación Individual'}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
            {isAggregated ? (
              <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 flex items-center shadow-inner">
                Muestra: {dataArray.length} Evaluaciones
              </div>
            ) : (
              <>
                <div className="bg-slate-100 px-3 py-1.5 rounded-full"><strong>Depto:</strong> {dataArray[0].departamento}</div>
                <div className="bg-slate-100 px-3 py-1.5 rounded-full"><strong>Antigüedad:</strong> {dataArray[0].antiguedad}</div>
                <div className="bg-slate-100 px-3 py-1.5 rounded-full"><strong>Nivel:</strong> {dataArray[0].nivel_puesto}</div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex space-x-8 overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Resumen Ejecutivo
          </button>
          <button 
            onClick={() => setActiveTab('teoria')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'teoria' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Teoría de Herzberg
          </button>
          <button 
            onClick={() => setActiveTab('clima')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'clima' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Clima Laboral & Herzberg
          </button>
          <button 
            onClick={() => setActiveTab('talent')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'talent' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Talent Intelligence
          </button>
          <button 
            onClick={() => setActiveTab('nom035')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'nom035' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Cumplimiento NOM-035
          </button>
        </div>
      </div>

      <div className="w-full space-y-10">
        
        {/* TAB 1: RESUMEN EJECUTIVO */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CriticalAlerts dataArray={dataArray} />

            {isAggregated && <TopRisks dataArray={dataArray} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ScoreCard 
            title="Satisfacción Global" 
            score={satisfaccionScore} 
            subtitle="Felicidad general" 
            icon={Smile} 
            onClick={() => setSelectedMetric('satisfaccion')} 
          />
          <ScoreCard 
            title="Compromiso" 
            score={compromisoScore} 
            subtitle="Sentido de pertenencia" 
            icon={Target}
            onClick={() => setSelectedMetric('compromiso')} 
          />
          <ScoreCard 
            title="Riesgo de Rotación" 
            score={rotacionRiesgo} 
            subtitle="Probabilidad de salida"
            icon={TrendingUp}
            onClick={() => setSelectedMetric('rotacion')} 
          />
          <ScoreCard 
            title="eNPS Promedio" 
            score={enpsScore} 
            subtitle="Lealtad del empleado"
            icon={Users}
            onClick={() => setSelectedMetric('enps')} 
          />
          </div>
        </div>
        )}

        {/* TAB: TEORIA DE HERZBERG */}
        {activeTab === 'teoria' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                Teoría de Herzberg
              </h2>
              <p className="text-slate-500 mt-2 text-lg">
                Este dashboard basa sus métricas en la Teoría de los Dos Factores de Frederick Herzberg, un estándar global en psicología organizacional. Herzberg postula que la satisfacción y la insatisfacción no son opuestos directos, sino que son generadas por dos grupos distintos de variables que deben gestionarse de forma independiente:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h4 className="text-xl font-bold text-emerald-800">1. Factores Motivacionales</h4>
                </div>
                <p className="text-emerald-700/90 text-justify leading-relaxed">
                  Son intrínsecos a la naturaleza del trabajo en sí (Logro, Reconocimiento, Responsabilidad, Crecimiento Profesional). Su presencia genera verdadera satisfacción y fomenta el compromiso a largo plazo. Su carencia no genera quejas inmediatas, pero produce empleados estancados y sin iniciativa.
                </p>
              </div>
              
              <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <h4 className="text-xl font-bold text-amber-800">2. Factores de Higiene</h4>
                </div>
                <p className="text-amber-700/90 text-justify leading-relaxed">
                  Son externos al empleado (Salario, Políticas, Relaciones, Seguridad Laboral, Supervisión). Su deficiencia causa una profunda insatisfacción y motiva la fuga de talento. Sin embargo, aunque sean excelentes, los empleados rápidamente los dan por sentado, por lo que no generan motivación real por sí solos.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-6 shadow-sm">
              <h4 className="text-lg font-bold text-slate-800 mb-2">¿Cómo leer estas métricas?</h4>
              <p className="text-slate-600 leading-relaxed">
                A través de la IA se evaluaron 36 variables estandarizadas. Las respuestas se promedian en un índice del 0 al 100. Valores por encima de 80 representan <span className="font-bold text-emerald-600">Fortalezas</span>, mientras que índices por debajo de 60 se consideran de <span className="font-bold text-orange-500">Riesgo</span> y requieren intervención directiva.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: CLIMA LABORAL & HERZBERG */}
        {activeTab === 'clima' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Factores de Higiene y Motivación</h2>
                <p className="text-slate-500 mt-1">Análisis profundo basado en la Teoría de los Dos Factores.</p>
              </div>
            </div>

            {/* Factores Herzberg + Matriz (50/50) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <ChartCard 
              title="Índices por Factor" 
              subtitle="Métricas analizadas según factores específicos de Herzberg."
              icon={Activity}
            >
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <ChartGradients />
                    <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} horizontal={false} strokeOpacity={0.4} />
                    <XAxis type="number" domain={[0, 100]} {...chartTheme.axis} />
                    <YAxis dataKey="name" type="category" width={130} {...chartTheme.axis} />
                    <Tooltip 
                      cursor={chartTheme.tooltip.cursor}
                      content={<ChartTooltip 
                        formatter={(val, name, props) => (
                          <span style={{ color: props.payload.fill }}>{val}% - {getRiskLabel(val)}</span>
                        )}
                        labelFormatter={() => null}
                      />}
                    />
                    <Bar 
                      dataKey="score" 
                      radius={chartTheme.bar.horizontalRadius}
                      cursor="pointer"
                      onClick={(data) => setSelectedMetric(data.name)}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {chartData.map((entry, index) => {
                        const globalIdx = globalPalette.indexOf(entry.fill);
                        const gradient = globalIdx !== -1 ? `url(#gradient-${globalIdx})` : entry.fill;
                        return <Cell key={`cell-${index}`} fill={gradient} className="hover:opacity-80 transition-opacity duration-300" />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="lg:col-span-1">
            {isAggregated && <QuadrantMatrix dataArray={dataArray} />}
          </div>
        </div>

        {isAggregated && (
          <>
            {/* Brecha por Turno + Tenure Gap (50/50) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TenureGap dataArray={dataArray} />
              <ShiftGap dataArray={dataArray} />
            </div>

            <Heatmap dataArray={dataArray} />
            <ThematicAnalysis dataArray={dataArray} />

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
          </>
        )}
          </div>
        )}

        {/* TAB 3: TALENT INTELLIGENCE */}
        {activeTab === 'talent' && isAggregated && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800">Talent Intelligence</h2>
              <p className="text-slate-500 mt-1">Métricas estratégicas para Business Partners y Consultores de RH.</p>
            </div>

            {/* Matriz 60% | ROI 40% */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <RetentionMatrix dataArray={dataArray} />
              </div>
              <div className="lg:col-span-2">
                <RoiSimulator dataArray={dataArray} />
              </div>
            </div>

            {/* Drivers Fuga (Ancho completo) */}
            <FlightRiskDrivers dataArray={dataArray} />

            {/* Brecha Jerárquica (Ancho completo) */}
            <HierarchyGap dataArray={dataArray} />

            {/* Burnout Risk */}
            <BurnoutRisk dataArray={dataArray} />

            {/* Distribución eNPS + EnpsRadar (50/50) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1">
                <ChartCard 
                  title="Distribución eNPS" 
                  subtitle="Promotores, Pasivos y Detractores"
                  icon={PieChartIcon}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="h-[250px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <ChartGradients />
                          <Pie
                            data={enpsPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            animationDuration={800}
                            animationEasing="ease-out"
                          >
                            {enpsPieData.map((entry, index) => (
                              <PieCell key={`cell-${index}`} fill={entry.color} className="hover:brightness-110 transition-all duration-300" />
                            ))}
                          </Pie>
                          <Tooltip 
                            content={<ChartTooltip 
                              formatter={(val, name, props) => (
                                <span style={{ color: props.payload.color }}>{val} Personas</span>
                              )}
                            />}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Central KPI */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                        <span className="text-4xl font-black text-slate-800 tracking-tight">
                          <AnimatedNumber value={enpsScore} duration={2} />
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">eNPS</span>
                      </div>
                    </div>
                    {/* Legend Below Doughnut */}
                    <div className="flex justify-center gap-4 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        <span className="text-sm font-semibold text-slate-600">Promotores</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <span className="text-sm font-semibold text-slate-600">Pasivos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <span className="text-sm font-semibold text-slate-600">Detractores</span>
                      </div>
                    </div>
                  </div>
                </ChartCard>
              </div>
              <div className="lg:col-span-1">
                <EnpsRadar dataArray={dataArray} />
              </div>
            </div>
            
            <DiagnosticCharts dataArray={dataArray} />
          </div>
        )}

        {/* TAB 4: NOM-035 */}
        {activeTab === 'nom035' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-800">Cumplimiento Normativo: NOM-035-STPS</h2>
              <p className="text-slate-500 mt-1">Identificación, análisis y prevención de Factores de Riesgo Psicosocial.</p>
            </div>
            <Nom035Dashboard dataArray={dataArray} />
          </div>
        )}

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

function ScoreCard({ title, score, subtitle, icon: Icon, onClick }) {
  const hexColor = getCategoryColor(title);
  const iconBg = getGradientColor(hexColor, 0.1);
  const iconBorder = getGradientColor(hexColor, 0.2);

  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-slate-200/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-4 group"
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-110"
        style={{ backgroundColor: iconBg, color: hexColor, borderColor: iconBorder }}
      >
        {Icon && <Icon size={24} strokeWidth={2.5} />}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-slate-800 text-sm font-bold truncate">{title}</h3>
        {subtitle && <p className="text-slate-500 text-xs font-medium truncate mt-0.5">{subtitle}</p>}
      </div>
      <div className="text-2xl font-black tracking-tight shrink-0" style={{ color: hexColor }}>
        <AnimatedNumber value={score} duration={1.5} />
      </div>
    </div>
  );
}

function MetricModal({ metricId, dataArray, onClose }) {
  let title = '';
  let explanation = '';
  let distribution = Array(6).fill(0);
  let distribution10 = Array(11).fill(0);
  let totalDataPoints = 0;

  const indexConfig = React.useMemo(() => INDICES_CONFIG.find(i => i.name === metricId), [metricId]);

  React.useMemo(() => {
    if (indexConfig) {
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
      dataArray.forEach(d => {
        const val = d.respuestas && d.respuestas['satisfaccion_global'];
        if (val !== undefined) { distribution[val]++; totalDataPoints++; }
      });
    } else if (metricId === 'compromiso') {
      dataArray.forEach(d => {
        const val = d.respuestas && d.respuestas['compromiso'];
        if (val !== undefined) { distribution[val]++; totalDataPoints++; }
      });
    } else if (metricId === 'rotacion') {
      dataArray.forEach(d => {
        const val = d.respuestas && d.respuestas['permanencia'];
        if (val !== undefined) { distribution[val]++; totalDataPoints++; }
      });
    } else if (metricId === 'enps') {
      dataArray.forEach(d => {
        const val = d.respuestas && d.respuestas['enps'];
        if (val !== undefined) { distribution10[val]++; totalDataPoints++; }
      });
    }
  }, [metricId, dataArray, indexConfig]);

  if (indexConfig) {
    title = `Factor: ${indexConfig.name}`;
    explanation = indexConfig.explanation;
  } else if (metricId === 'satisfaccion') {
    title = 'Satisfacción Global';
    explanation = 'Se obtiene de la pregunta: "En general, ¿qué tan satisfecho te sientes con tu trabajo?". Se convierte de la escala 1-5 a un porcentaje de 0 a 100. Refleja la percepción general e instantánea del colaborador sobre su empleo en la organización.';
  } else if (metricId === 'compromiso') {
    title = 'Compromiso';
    explanation = 'Mide la alineación del empleado con la empresa: "¿Qué tan comprometido te sientes con los objetivos de la organización?". Un mayor compromiso se traduce en mayor retención, productividad y disposición a dar el esfuerzo extra.';
  } else if (metricId === 'rotacion') {
    title = 'Riesgo de Rotación';
    explanation = 'Calculado a partir de la pregunta: "¿Qué tan probable es que continúes trabajando aquí durante los próximos dos años?". Entre menor sea la intención de permanencia (respuesta baja), mayor es el cálculo del riesgo de que el talento abandone la empresa.';
  } else if (metricId === 'enps') {
    title = 'eNPS Promedio';
    explanation = 'El Employee Net Promoter Score proviene de la pregunta (escala 0-10): "¿Qué tan probable es que recomiendes esta organización como un buen lugar para trabajar?". Tradicionalmente clasifica en Promotores (9-10), Pasivos (7-8) y Detractores (0-6). Aquí se muestra el puntaje promedio de la evaluación general.';
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


