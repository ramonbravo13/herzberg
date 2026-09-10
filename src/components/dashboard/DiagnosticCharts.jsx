import React, { useMemo } from 'react';
import ChartCard from '../charts/ChartCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ChartTooltip from '../charts/ChartTooltip';
import { Search } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DiagnosticCharts({ dataArray }) {
  const chartData = useMemo(() => {
    const counts = {
      liderazgo: {},
      dinamica: {},
      condiciones: {}
    };

    let hasData = false;

    dataArray.forEach(d => {
      if (d.diagnostico) {
        hasData = true;
        ['liderazgo', 'dinamica', 'condiciones'].forEach(key => {
          const val = d.diagnostico[key];
          if (val) {
            counts[key][val] = (counts[key][val] || 0) + 1;
          }
        });
      }
    });

    if (!hasData) return null;

    const formatData = (obj) => Object.entries(obj)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      liderazgo: formatData(counts.liderazgo),
      dinamica: formatData(counts.dinamica),
      condiciones: formatData(counts.condiciones)
    };
  }, [dataArray]);

  if (!chartData) return null;

  const renderDonut = (data, title) => {
    if (!data || data.length === 0) return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic">
        Sin datos
      </div>
    );

    return (
      <div className="flex flex-col items-center h-full">
        <h4 className="text-sm font-bold text-slate-700 mb-2 text-center h-10 flex items-center justify-center">{title}</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={<ChartTooltip 
                  formatter={(val, name, props) => (
                    <span style={{ color: props.payload.fill }}>{val} Respuestas</span>
                  )}
                />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 w-full px-2 flex flex-col gap-2 flex-1">
          {data.map((entry, index) => (
            <div key={index} className="flex items-start gap-2 text-xs">
              <div className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-slate-600 leading-tight">{entry.name} <span className="font-semibold text-slate-800">({entry.value})</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ChartCard 
      title="Diagnóstico Específico" 
      subtitle="Distribución de percepciones sobre liderazgo, dinámicas de equipo y entorno físico."
      icon={Search}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {renderDonut(chartData.liderazgo, "Estilo de Liderazgo Inmediato")}
        {renderDonut(chartData.dinamica, "Dinámica entre Compañeros")}
        {renderDonut(chartData.condiciones, "Condiciones Físicas del Entorno")}
      </div>
    </ChartCard>
  );
}
