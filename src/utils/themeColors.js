export const globalPalette = [
  '#1669F5', // BLUE
  '#7240EF', // PURPLE
  '#FB4777', // PINK
  '#FE9021', // ORANGE
  '#FEBF18', // YELLOW
  '#92C65A', // GREEN
  '#3ABAAB'  // TEAL
];

// Pre-assigned exact matches to ensure consistency across the entire app
export const categoryColors = {
  // eNPS mapping
  'Promotores': '#1669F5', // BLUE
  'Pasivos': '#7240EF', // PURPLE
  'Detractores': '#FB4777', // PINK
  
  // Dashboard Metrics
  'Satisfacción Global': '#1669F5',
  'Compromiso': '#7240EF',
  'Riesgo de Rotación': '#FB4777',
  'eNPS Promedio': '#FE9021',
  'satisfaccion': '#1669F5',
  'riesgoRotacion': '#FB4777',

  // Hierarchy
  'Líderes': '#1669F5',
  'Operativos': '#7240EF',

  // Radar categories (fallback)
  'Motivacional': '#1669F5',
  'Higiene': '#7240EF',
  'Desarrollo Prof.': '#FB4777',
  'Liderazgo': '#FE9021',
  'Relaciones Laborales': '#FEBF18',

  // NOM-035 Risk Levels
  'Nulo': '#1669F5',
  'Bajo': '#7240EF',
  'Medio': '#FB4777',
  'Alto': '#FE9021',
  'Muy Alto': '#FEBF18'
};

export const getThemeColor = (index) => {
  return globalPalette[index % globalPalette.length];
};

export const getCategoryColor = (name, fallbackIndex = 0) => {
  return categoryColors[name] || getThemeColor(fallbackIndex);
};

/**
 * Returns an RGBA string with a given opacity for the hex color.
 * Example: getGradientColor('#1669F5', 0.15) -> 'rgba(22, 105, 245, 0.15)'
 */
export const getGradientColor = (hex, alpha = 0.1) => {
  if (!hex) return `rgba(22, 105, 245, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getGradientUrl = (hex) => {
  const index = globalPalette.indexOf(hex);
  return index !== -1 ? `url(#gradient-${index})` : hex;
};
