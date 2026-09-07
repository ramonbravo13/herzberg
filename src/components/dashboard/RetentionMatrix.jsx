import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import ChartCard from '../charts/ChartCard';
import ChartTooltip from '../charts/ChartTooltip';
import { chartTheme } from '../charts/theme';
import { categoryColors, getGradientColor } from '../../utils/themeColors';

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

  const getQuadrantCategory = (x, y) => {
    if (x >= 3.5 && y >= 3.5) return 'Apóstoles';
    if (x < 3.5 && y < 3.5) return 'Saboteadores';
    if (x >= 3.5 && y < 3.5) return 'Mercenarios';
    return 'Rehenes';
  };

  const quadColors = {
    'Apóstoles': categoryColors['Promotores'], // Green #92C65A
    'Saboteadores': categoryColors['Detractores'], // Pink #FB4777
    'Mercenarios': categoryColors['Pasivos'], // Yellow/Orange
    'Rehenes': '#FE9021' // Orange
  };

  return (
    <ChartCard 
      title="Matriz de Retención y Cultura"
      subtitle="Cruza la Satisfacción Global contra la Intención de Permanencia de cada colaborador. Entender en qué cuadrante se encuentra tu talento es vital para tu estrategia de recursos humanos:"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl text-xs border" style={{ backgroundColor: getGradientColor(quadColors['Apóstoles'], 0.1), borderColor: getGradientColor(quadColors['Apóstoles'], 0.2) }}>
          <strong className="block mb-1.5 uppercase tracking-widest font-bold text-[10px]" style={{ color: quadColors['Apóstoles'] }}>Apóstoles</strong>
          <span className="font-medium" style={{ color: quadColors['Apóstoles'] }}>Alta satisfacción y alta permanencia. Son el talento ideal, embajadores naturales de tu marca empleadora.</span>
        </div>
        <div className="p-4 rounded-xl text-xs border" style={{ backgroundColor: getGradientColor(quadColors['Mercenarios'], 0.1), borderColor: getGradientColor(quadColors['Mercenarios'], 0.2) }}>
          <strong className="block mb-1.5 uppercase tracking-widest font-bold text-[10px]" style={{ color: quadColors['Mercenarios'] }}>Mercenarios</strong>
          <span className="font-medium" style={{ color: quadColors['Mercenarios'] }}>Alta satisfacción, baja permanencia. Están cómodos pero tienen alto riesgo de fuga si llega una mejor oferta.</span>
        </div>
        <div className="p-4 rounded-xl text-xs border" style={{ backgroundColor: getGradientColor(quadColors['Rehenes'], 0.1), borderColor: getGradientColor(quadColors['Rehenes'], 0.2) }}>
          <strong className="block mb-1.5 uppercase tracking-widest font-bold text-[10px]" style={{ color: quadColors['Rehenes'] }}>Rehenes</strong>
          <span className="font-medium" style={{ color: quadColors['Rehenes'] }}>Baja satisfacción, alta permanencia. No renuncian por comodidad o miedo, pero merman la productividad y el clima.</span>
        </div>
        <div className="p-4 rounded-xl text-xs border" style={{ backgroundColor: getGradientColor(quadColors['Saboteadores'], 0.1), borderColor: getGradientColor(quadColors['Saboteadores'], 0.2) }}>
          <strong className="block mb-1.5 uppercase tracking-widest font-bold text-[10px]" style={{ color: quadColors['Saboteadores'] }}>Saboteadores</strong>
          <span className="font-medium" style={{ color: quadColors['Saboteadores'] }}>Baja satisfacción, baja permanencia. Desgaste total, listos para renunciar y potencialmente conflictivos.</span>
        </div>
      </div>

      <div className="h-[400px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} opacity={0.3} />
            <XAxis type="number" dataKey="x" name="Satisfacción" domain={[1, 5]} tickCount={5} {...chartTheme.axis} label={{ value: 'Satisfacción Global (1-5)', position: 'bottom', offset: 0, fontSize: 12, fill: '#64748b' }} />
            <YAxis type="number" dataKey="y" name="Permanencia" domain={[1, 5]} tickCount={5} {...chartTheme.axis} label={{ value: 'Intención Permanencia (1-5)', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: '#64748b' }} />
            
            {/* Center dividers at 3.5 (since scale is 1 to 5) */}
            <ReferenceLine x={3.5} stroke="#cbd5e1" strokeDasharray="3 3" />
            <ReferenceLine y={3.5} stroke="#cbd5e1" strokeDasharray="3 3" />

            <Tooltip 
              cursor={chartTheme.tooltip.cursor}
              content={(props) => {
                if (props.active && props.payload && props.payload.length) {
                  const data = props.payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-xl rounded-xl z-50">
                      <p className="font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">{data.depto}</p>
                      <p className="text-sm text-slate-600 font-medium">Satisfacción: <span className="font-bold text-slate-800">{data.x.toFixed(1)}</span></p>
                      <p className="text-sm text-slate-600 font-medium mt-1">Permanencia: <span className="font-bold text-slate-800">{data.y.toFixed(1)}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Colaboradores" data={jitterData} opacity={0.7} animationDuration={800} animationEasing="ease-out">
              {jitterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={quadColors[getQuadrantCategory(entry.x, entry.y)]} className="hover:opacity-100 transition-opacity duration-300" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <div className="absolute top-4 right-6 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Apóstoles</div>
        <div className="absolute bottom-10 left-16 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Saboteadores</div>
        <div className="absolute bottom-10 right-6 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest text-right">Mercenarios <span className="block text-xs normal-case font-medium opacity-80 tracking-normal">(Riesgo Fuga)</span></div>
        <div className="absolute top-4 left-16 text-slate-300/80 font-black text-lg pointer-events-none uppercase tracking-widest">Rehenes <span className="block text-xs normal-case font-medium opacity-80 tracking-normal">(Riesgo Tóxico)</span></div>
      </div>
    </ChartCard>
  );
}
