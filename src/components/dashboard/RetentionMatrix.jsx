import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function RetentionMatrix({ dataArray }) {
  if (!dataArray || dataArray.length < 2) return null;

  const data = dataArray.map((d, index) => {
    return {
      id: index,
      x: d.respuestas ? d.respuestas.satisfaccion_global : 0, // 1 to 5
      y: d.respuestas ? d.respuestas.permanencia : 0, // 1 to 5
      depto: d.departamento
    };
  }).filter(d => d.x > 0 && d.y > 0);

  // We add some jitter so dots with exactly the same score don't completely overlap
  const jitterData = data.map(d => ({
    ...d,
    x: d.x + (Math.random() * 0.4 - 0.2),
    y: d.y + (Math.random() * 0.4 - 0.2)
  }));

  const getDotColor = (x, y) => {
    if (x >= 3.5 && y >= 3.5) return '#10b981'; // Apóstoles
    if (x < 3.5 && y < 3.5) return '#ef4444'; // Saboteadores
    if (x >= 3.5 && y < 3.5) return '#3b82f6'; // Mercenarios
    return '#f59e0b'; // Rehenes
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Matriz de Retención y Cultura</h2>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        Cruza la Satisfacción Global contra la Intención de Permanencia de cada colaborador. Entender en qué cuadrante se encuentra tu talento es vital para tu estrategia de recursos humanos:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl text-xs">
          <strong className="text-emerald-700 block mb-1 uppercase tracking-wide">Apóstoles (Verde)</strong>
          <span className="text-emerald-600/90">Alta satisfacción y alta permanencia. Son el talento ideal, embajadores naturales de tu marca empleadora.</span>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-xs">
          <strong className="text-blue-700 block mb-1 uppercase tracking-wide">Mercenarios (Azul)</strong>
          <span className="text-blue-600/90">Alta satisfacción, baja permanencia. Están cómodos pero tienen alto riesgo de fuga si llega una mejor oferta.</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-xs">
          <strong className="text-amber-700 block mb-1 uppercase tracking-wide">Rehenes (Naranja)</strong>
          <span className="text-amber-600/90">Baja satisfacción, alta permanencia. No renuncian por comodidad o miedo, pero merman la productividad y el clima.</span>
        </div>
        <div className="bg-red-50/50 border border-red-100 p-3 rounded-xl text-xs">
          <strong className="text-red-700 block mb-1 uppercase tracking-wide">Saboteadores (Rojo)</strong>
          <span className="text-red-600/90">Baja satisfacción, baja permanencia. Desgaste total, listos para renunciar y potencialmente conflictivos.</span>
        </div>
      </div>

      <div className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis type="number" dataKey="x" name="Satisfacción" domain={[1, 5]} tickCount={5} tick={{fontSize: 12}} label={{ value: 'Satisfacción Global (1-5)', position: 'bottom', offset: 0, fontSize: 12 }} />
            <YAxis type="number" dataKey="y" name="Permanencia" domain={[1, 5]} tickCount={5} tick={{fontSize: 12}} label={{ value: 'Intención Permanencia (1-5)', angle: -90, position: 'left', offset: 0, fontSize: 12 }} />
            
            {/* Center dividers at 3.5 (since scale is 1 to 5) */}
            <ReferenceLine x={3.5} stroke="#94a3b8" strokeDasharray="3 3" />
            <ReferenceLine y={3.5} stroke="#94a3b8" strokeDasharray="3 3" />

            <Tooltip 
              cursor={{strokeDasharray: '3 3'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-slate-200 shadow-xl rounded-lg text-sm">
                      <p className="font-bold text-slate-800">{data.depto}</p>
                      <p className="text-slate-600">Sat: {data.x.toFixed(1)} | Perm: {data.y.toFixed(1)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Colaboradores" data={jitterData} opacity={0.6}>
              {jitterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDotColor(entry.x, entry.y)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <div className="absolute top-4 right-6 text-emerald-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Apóstoles</div>
        <div className="absolute bottom-10 left-16 text-red-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Saboteadores</div>
        <div className="absolute bottom-10 right-6 text-blue-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider text-right">Mercenarios <span className="block text-xs normal-case font-normal">(Riesgo Fuga)</span></div>
        <div className="absolute top-4 left-16 text-amber-600/50 font-bold text-lg pointer-events-none uppercase tracking-wider">Rehenes <span className="block text-xs normal-case font-normal">(Riesgo Tóxico)</span></div>
      </div>
    </div>
  );
}
