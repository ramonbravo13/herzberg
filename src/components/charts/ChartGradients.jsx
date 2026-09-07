import React from 'react';
import { globalPalette } from '../../utils/themeColors';

export default function ChartGradients() {
  return (
    <defs>
      {globalPalette.map((color, index) => (
        <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
          <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
        </linearGradient>
      ))}
      
      {/* Fallback definitions for components still migrating */}
      <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={globalPalette[0]} stopOpacity={0.9}/>
        <stop offset="95%" stopColor={globalPalette[0]} stopOpacity={0.6}/>
      </linearGradient>
      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={globalPalette[5]} stopOpacity={0.9}/>
        <stop offset="95%" stopColor={globalPalette[5]} stopOpacity={0.6}/>
      </linearGradient>
      <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={globalPalette[4]} stopOpacity={0.9}/>
        <stop offset="95%" stopColor={globalPalette[4]} stopOpacity={0.6}/>
      </linearGradient>
      <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={globalPalette[2]} stopOpacity={0.9}/>
        <stop offset="95%" stopColor={globalPalette[2]} stopOpacity={0.6}/>
      </linearGradient>
      <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={globalPalette[0]} stopOpacity={0.9}/>
        <stop offset="95%" stopColor={globalPalette[0]} stopOpacity={0.6}/>
      </linearGradient>
    </defs>
  );
}
