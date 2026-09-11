import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { INDICES_CONFIG, calculateIndex } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import { BrainCircuit } from 'lucide-react';

function calculatePearsonCorrelation(x, y) {
  if (x.length !== y.length || x.length === 0) return 0;
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);

  const num = (n * sumXY) - (sumX * sumY);
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (den === 0) return 0;
  return num / den;
}

export default function PredictiveMatrix({ dataArray }) {
  const chartData = useMemo(() => {
    if (!dataArray || dataArray.length < 5) return []; // Need some data for correlation

    return INDICES_CONFIG.slice(2).map((ind) => {
      const xVals = [];
      const yVals = [];

      dataArray.forEach(d => {
        if (d.respuestas && d.respuestas.permanencia !== undefined) {
          // Calculate this user's score for this index
          let sum = 0;
          let count = 0;
          ind.vars.forEach(v => {
            if (d.respuestas[v] !== undefined) {
              sum += Number(d.respuestas[v]);
              count++;
            }
          });
          if (count > 0) {
            xVals.push(sum / count); // 1-5 scale
            yVals.push(Number(d.respuestas.permanencia)); // 1-5 scale
          }
        }
      });

      const correlation = calculatePearsonCorrelation(xVals, yVals);
      // We take absolute value if we assume they are positively correlated, but they should be.
      // High score in index should mean high score in permanencia (staying).
      // So correlation should be positive. A high correlation means it's a strong driver.
      
      const avgScore = calculateIndex(ind.vars, dataArray);

      return {
        name: ind.name,
        score: avgScore, // 0-100
        impact: Math.max(0, Math.round(correlation * 100)), // Convert to 0-100 scale of "Impact"
        tipo: ind.tipo
      };
    });
  }, [dataArray]);

  if (chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
          <p className="font-bold text-slate-800 mb-1">{data.name}</p>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Desempeño actual: <strong>{data.score}%</strong>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Impacto en Retención: <strong>{data.impact}%</strong>
          </div>
          <div className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">
            Si mejoras "{data.name}", la retención de <br/>talento aumentará de forma altamente proporcional.
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard 
      title="Driver Analysis: Matriz Predictiva de Retención" 
      subtitle="Correlación matemática (Regresión) entre cada métrica y el riesgo de fuga. Te indica exactamente qué palancas mover para retener al talento."
      icon={BrainCircuit}
    >
      <div className="h-[450px] mt-4 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              type="number" 
              dataKey="score" 
              name="Desempeño" 
              domain={[0, 100]} 
              label={{ value: 'Desempeño Actual (Score %)', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impacto" 
              domain={[0, 100]} 
              label={{ value: 'Impacto Predictivo en Retención', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            {/* Cuadrantes Clave */}
            <ReferenceLine x={60} stroke="#cbd5e1" strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="4 4" />

            <Scatter data={chartData} fill="#6366f1" animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.impact > 60 && entry.score < 60 ? '#ef4444' : entry.impact > 50 ? '#f59e0b' : '#3b82f6'} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Etiquetas de Cuadrantes Absolutas */}
        <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 bg-white/80 px-2 py-1 rounded">Alto Impacto / Alto Desempeño (Fortalezas Clave)</div>
        <div className="absolute top-4 left-16 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 shadow-sm animate-pulse">PRIORIDAD MÁXIMA (Mejorar esto evita fugas)</div>
        <div className="absolute bottom-8 right-4 text-xs font-bold text-slate-400 bg-white/80 px-2 py-1 rounded">Bajo Impacto / Alto Desempeño</div>
        <div className="absolute bottom-8 left-16 text-xs font-bold text-slate-400 bg-white/80 px-2 py-1 rounded">Bajo Impacto / Bajo Desempeño (Secundario)</div>
      </div>
    </ChartCard>
  );
}
