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
    <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-6 shadow-sm mb-8 mt-4 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-start gap-4 md:w-1/3 border-b md:border-b-0 md:border-r border-red-200 pb-4 md:pb-0 md:pr-4">
        <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
          <AlertTriangle size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg font-black text-red-900 tracking-tight">Atención Crítica (RH)</h3>
          <p className="text-red-700 text-sm mt-1 leading-snug font-medium">
            Se han detectado focos rojos en la evaluación cualitativa que requieren intervención inmediata.
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {alerts.condiciones > 0 && (
          <div className="bg-white/60 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <Thermometer size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none">{alerts.condiciones}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Quejas Físicas / Calor</p>
            </div>
          </div>
        )}
        
        {alerts.acoso > 0 && (
          <div className="bg-white/60 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none">{alerts.acoso}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Reportes de Acoso</p>
            </div>
          </div>
        )}

        {alerts.liderazgo > 0 && (
          <div className="bg-white/60 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none">{alerts.liderazgo}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Liderazgo Tóxico</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
