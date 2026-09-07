export const chartTheme = {
  colors: {
    primary: '#6366f1', // indigo-500
    secondary: '#14b8a6', // teal-500
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
    slate: '#64748b', // slate-500
    // A modern palette for categorical data
    categorical: [
      '#6366f1', // indigo
      '#10b981', // emerald
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#0ea5e9', // sky
      '#f97316', // orange
    ],
  },
  axis: {
    tick: { fill: '#94a3b8', fontSize: 12, fontWeight: 500, fontFamily: 'inherit' }, // slate-400
    axisLine: false,
    tickLine: false,
  },
  grid: {
    stroke: '#f1f5f9', // slate-100
    strokeDasharray: '3 3',
    vertical: false, // Clean horizontal lines only by default
  },
  tooltip: {
    cursor: { fill: '#f8fafc' }, // slate-50
  },
  bar: {
    radius: [4, 4, 0, 0], // Top rounded corners
    horizontalRadius: [0, 4, 4, 0], // Right rounded corners
  }
};
