import { globalPalette, categoryColors } from '../../utils/themeColors';

export const chartTheme = {
  colors: {
    // Map existing references to the new strict global palette to prevent breaking missing variables
    primary: globalPalette[0], // Blue
    secondary: globalPalette[1], // Purple
    success: categoryColors['Promotores'], // Green (mapped for specific uses, but components should use categoryColors)
    warning: categoryColors['Pasivos'], // Yellow
    danger: categoryColors['Detractores'], // Pink
    info: globalPalette[0], // Blue
    slate: '#64748b', // Keeping slate for grid and text
    
    // A modern palette for categorical data
    categorical: globalPalette,
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
