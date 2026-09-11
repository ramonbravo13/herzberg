import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import { chartTheme } from '../charts/theme';
import { BarChart3 } from 'lucide-react';

export default function DispersionChart({ dataArray }) {
  const chartData = useMemo(() => {
    if (!dataArray || dataArray.length === 0) return [];

    return INDICES_CONFIG.slice(2).map((ind) => {
      let neg = 0;
      let neu = 0;
      let pos = 0;
      let total = 0;

      dataArray.forEach(d => {
        ind.vars.forEach(v => {
          if (d.respuestas && d.respuestas[v] !== undefined) {
            const val = Number(d.respuestas[v]);
            if (val <= 2) neg++;
            else if (val === 3) neu++;
            else if (val >= 4) pos++;
            total++;
          }
        });
      });

      if (total === 0) return { name: ind.name, Negativo: 0, Neutro: 0, Positivo: 0 };

      return {
        name: ind.name,
        Negativo: Math.round((neg / total) * 100),
        Neutro: Math.round((neu / total) * 100),
        Positivo: Math.round((pos / total) * 100)
      };
    });
  }, [dataArray]);

  if (chartData.length === 0) return null;

  return (
    <ChartCard 
      title="Distribución y Dispersión de Respuestas" 
      subtitle="Desglosa el promedio. Distingue visualmente si una métrica tiene un consenso neutro o si está polarizada (extremos positivos y negativos simultáneos)."
      icon={BarChart3}
    >
      <div className="h-[500px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            stackOffset="expand"
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3} />
            <XAxis type="number" tickFormatter={(tick) => `${tick * 100}%`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis dataKey="name" type="category" width={130} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
            <Tooltip 
              cursor={{fill: '#f8fafc'}}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Negativo" stackId="a" fill="#ef4444" animationDuration={1000} />
            <Bar dataKey="Neutro" stackId="a" fill="#f59e0b" animationDuration={1000} />
            <Bar dataKey="Positivo" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
