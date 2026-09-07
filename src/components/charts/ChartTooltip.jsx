import React from 'react';

export default function ChartTooltip({ active, payload, label, formatter, labelFormatter, customTitle }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl z-50 min-w-[150px] animate-in fade-in zoom-in-95 duration-200">
        {(label || customTitle) && (
          <div className="text-sm font-semibold text-slate-800 mb-2 pb-2 border-b border-slate-100">
            {customTitle || (labelFormatter ? labelFormatter(label) : label)}
          </div>
        )}
        <div className="space-y-2">
          {payload.map((entry, index) => {
            const displayValue = formatter ? formatter(entry.value, entry.name, entry, index, payload) : entry.value;
            // Prevent showing empty or undefined values unless intentional
            if (displayValue === undefined || displayValue === null) return null;
            
            return (
              <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                    style={{ backgroundColor: entry.color || entry.fill || '#cbd5e1' }} 
                  />
                  <span className="text-slate-600 font-medium">
                    {entry.name}
                  </span>
                </div>
                <span className="font-bold text-slate-800">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}
