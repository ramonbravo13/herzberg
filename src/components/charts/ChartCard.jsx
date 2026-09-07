import React from 'react';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${className}`}
    >
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
    </motion.div>
  );
}
