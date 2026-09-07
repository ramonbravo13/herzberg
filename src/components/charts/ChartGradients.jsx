import React from 'react';

export default function ChartGradients() {
  return (
    <defs>
      <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.6}/>
      </linearGradient>
      
      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
        <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
      </linearGradient>

      <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.6}/>
      </linearGradient>

      <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
      </linearGradient>

      <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
      </linearGradient>
    </defs>
  );
}
