import React from 'react';

export default function ChartCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50",
  children,
  action,
  footer,
  className = ""
}) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-slate-100/60 transition-all duration-300 flex flex-col h-full ${className}`}>
      {(title || Icon || action) && (
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shadow-sm border border-white/50 shrink-0`}>
                <Icon size={20} strokeWidth={2.5} />
              </div>
            )}
            <div>
              {title && <h3 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex-1 w-full flex flex-col justify-center">
        {children}
      </div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-slate-50 w-full">
          {footer}
        </div>
      )}
    </div>
  );
}
