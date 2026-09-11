import React, { useMemo } from 'react';
import { AlertTriangle, Thermometer, ShieldAlert, Users } from 'lucide-react';

export default function CriticalAlerts({ dataArray }) {
  const alerts = useMemo(() => {
    let flags = {
      condiciones: 0, // Ruido, calor, etc.
      acoso: 0, // Acoso o cotos de poder
      liderazgo: 0 // Liderazgo autoritario
    };

    dataArray.forEach(d => {
      if (d.diagnostico) {
        // 1. Condiciones Físicas Extremas
        const cond = d.diagnostico.condiciones;
        if (cond === 'Ruido elevado o temperaturas extremas' || 
            cond === 'Trabajo en zonas con polvo, suciedad o riesgo' ||
            cond === 'Carga física pesada o movimientos muy repetitivos') {
          flags.condiciones++;
        }

        // 2. Acoso o Dinámica Hostil
        const din = d.diagnostico.dinamica;
        if (din === 'Se percibe amedrentamiento o acoso hacia el personal de nuevo ingreso' ||
            din === 'Existen cotos de poder o grupos que presionan a los demás') {
          flags.acoso++;
        }

        // 3. Liderazgo Tóxico / Autoritario
        const lid = d.diagnostico.liderazgo;
        if (lid === 'Muestra una actitud dura, autoritaria o inequitativa' ||
            lid === 'Ejerce un control/micromanagement excesivo') {
          flags.liderazgo++;
        }
      }
    });

    return flags;
  }, [dataArray]);

  const totalAlerts = alerts.condiciones + alerts.acoso + alerts.liderazgo;

  if (totalAlerts === 0) return null; // No alerts to show

  return (
    <div className="flex flex-col gap-4 mb-10 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 px-2">
        <div className="bg-red-100 p-2.5 rounded-2xl text-red-600 shadow-sm border border-red-200">
          <AlertTriangle size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Atención Crítica (RH)</h3>
          <p className="text-slate-500 text-sm font-medium">Se han detectado focos rojos en la evaluación cualitativa que requieren intervención.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alerts.condiciones > 0 && (
          <div className="bg-orange-50 border-t-4 border-orange-500 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-3 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-orange-200/50 opacity-20 group-hover:scale-110 transition-transform">
              <Thermometer size={120} />
            </div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="bg-orange-200/50 p-2.5 rounded-xl text-orange-700 shadow-sm">
                <Thermometer size={24} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-orange-900 uppercase tracking-wide leading-tight">Quejas Físicas / Calor</p>
            </div>
            <p className="text-6xl font-black text-orange-600 leading-none relative z-10">{alerts.condiciones}</p>
            <p className="text-sm text-orange-800/80 font-medium mt-2 relative z-10 leading-snug">
              Colaboradores reportan ruido o calor extremo, y cargas físicas pesadas.
            </p>
          </div>
        )}
        
        {alerts.acoso > 0 && (
          <div className="bg-red-50 border-t-4 border-red-600 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-3 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-red-200/50 opacity-20 group-hover:scale-110 transition-transform">
              <ShieldAlert size={120} />
            </div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="bg-red-200/60 p-2.5 rounded-xl text-red-700 shadow-sm">
                <ShieldAlert size={24} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-red-900 uppercase tracking-wide leading-tight">Reportes de Acoso</p>
            </div>
            <p className="text-6xl font-black text-red-600 leading-none relative z-10">{alerts.acoso}</p>
            <p className="text-sm text-red-800/90 font-medium mt-2 relative z-10 leading-snug">
              Colaboradores perciben amedrentamiento y cotos de poder en sus equipos.
            </p>
          </div>
        )}

        {alerts.liderazgo > 0 && (
          <div className="bg-amber-50 border-t-4 border-amber-500 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-3 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-amber-200/50 opacity-20 group-hover:scale-110 transition-transform">
              <Users size={120} />
            </div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="bg-amber-200/50 p-2.5 rounded-xl text-amber-700 shadow-sm">
                <Users size={24} strokeWidth={2.5} />
              </div>
              <p className="text-sm font-bold text-amber-900 uppercase tracking-wide leading-tight">Liderazgo Tóxico</p>
            </div>
            <p className="text-6xl font-black text-amber-600 leading-none relative z-10">{alerts.liderazgo}</p>
            <p className="text-sm text-amber-800/80 font-medium mt-2 relative z-10 leading-snug">
              Colaboradores perciben control excesivo, actitudes duras o inequitativas.
            </p>
          </div>
        )}
      </div>
      
      <p className="text-[11px] leading-relaxed text-slate-500 px-2 mt-2 max-w-5xl">
        <strong>* Nota Analítica de IA:</strong> Estas alertas cualitativas son detecciones focales y pueden coexistir matemáticamente con promedios generales altos de Liderazgo o Clima si la anomalía está concentrada en una sola área (ej. un supervisor autoritario en un departamento pequeño no derriba el 60% de aprobación corporativa). Se sugiere cruzar los datos con la Matriz de Calor.
      </p>
    </div>
  );
}
