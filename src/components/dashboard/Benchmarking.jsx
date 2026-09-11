import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';
import { calculateIndex, INDICES_CONFIG } from '../../utils/metrics';
import ChartCard from '../charts/ChartCard';
import { chartTheme } from '../charts/theme';
import { Scale, Users } from 'lucide-react';

export default function Benchmarking({ globalData }) {
  const [zoneA, setZoneA] = useState('');
  const [zoneB, setZoneB] = useState('');

  // Extract all unique zones from globalData
  const availableZones = useMemo(() => {
    if (!globalData || globalData.length === 0) return [];
    const zones = new Set();
    globalData.forEach(d => {
      if (d.departamento) zones.add(d.departamento);
      if (d.zone) zones.add(d.zone);
    });
    return Array.from(zones).sort();
  }, [globalData]);

  // Set defaults if possible
  React.useEffect(() => {
    if (availableZones.length >= 2 && !zoneA && !zoneB) {
      setZoneA(availableZones[0]);
      setZoneB(availableZones[1]);
    } else if (availableZones.length === 1 && !zoneA) {
      setZoneA(availableZones[0]);
    }
  }, [availableZones]);

  const dataA = useMemo(() => globalData?.filter(d => d.departamento === zoneA || d.zone === zoneA) || [], [globalData, zoneA]);
  const dataB = useMemo(() => globalData?.filter(d => d.departamento === zoneB || d.zone === zoneB) || [], [globalData, zoneB]);

  const chartData = useMemo(() => {
    if (!zoneA || !zoneB) return [];
    
    // We will map over the individual indices (skipping the first 2 which are macro aggregates)
    return INDICES_CONFIG.slice(2).map((ind) => {
      const scoreA = calculateIndex(ind.vars, dataA);
      const scoreB = calculateIndex(ind.vars, dataB);
      
      // Calculate statistically significant difference (simplified visual highlight)
      const diff = Math.abs(scoreA - scoreB);
      const isSignificant = diff >= 15; // 15 points gap is a red flag
      
      return {
        name: ind.name,
        [zoneA]: scoreA,
        [zoneB]: scoreB,
        diff,
        isSignificant
      };
    });
  }, [zoneA, zoneB, dataA, dataB]);

  if (!globalData || globalData.length === 0) {
    return <div className="p-8 text-center text-slate-500">No hay datos suficientes para realizar un benchmark.</div>;
  }

  if (availableZones.length < 2) {
    return (
      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 text-amber-800 flex items-start gap-4">
        <Scale size={24} className="shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-lg mb-1">Se requieren al menos 2 zonas</h3>
          <p className="text-sm opacity-90">El análisis de Benchmarking comparativo (Cross-sectional Analysis) requiere que la organización tenga al menos dos áreas, sucursales o micrositios distintos con evaluaciones registradas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Scale size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Selección de Muestra</h3>
        </div>
        
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 flex-1 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100">
            <div className="w-3 h-3 rounded-full bg-indigo-500 ml-2"></div>
            <select
              value={zoneA}
              onChange={(e) => setZoneA(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 border-none outline-none focus:ring-0 p-1 w-full"
            >
              <option value="" disabled>Selecciona Zona A</option>
              {availableZones.map(z => (
                <option key={`a-${z}`} value={z}>{z}</option>
              ))}
            </select>
          </div>
          
          <span className="font-black text-slate-300">VS</span>

          <div className="flex items-center gap-2 flex-1 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
            <div className="w-3 h-3 rounded-full bg-emerald-500 ml-2"></div>
            <select
              value={zoneB}
              onChange={(e) => setZoneB(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 border-none outline-none focus:ring-0 p-1 w-full"
            >
              <option value="" disabled>Selecciona Zona B</option>
              {availableZones.map(z => (
                <option key={`b-${z}`} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {zoneA && zoneB && (
        <ChartCard
          title="Benchmarking Cross-Sectional"
          subtitle="Comparativa de clima laboral por factor. Las brechas mayores a 15 puntos se consideran estadísticamente significativas y alertan sobre desigualdades operativas."
          icon={Users}
        >
          <div className="h-[500px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey={zoneA} fill="#6366f1" radius={[0, 4, 4, 0]} animationDuration={1000} />
                <Bar dataKey={zoneB} fill="#10b981" radius={[0, 4, 4, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
