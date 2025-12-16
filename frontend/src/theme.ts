// CipherVault Premium Fintech Theme
// NO gradients, NO neon effects, NO purple/pink

export const theme = {
  // Background Colors
  background: {
    primary: '#0A0D12',    // Dark Navy
    secondary: '#0A0F14',  // Alternate Navy
    surface: '#11161C',    // Charcoal
    elevated: '#0F1317',   // Elevated Surface
  },
  
  // Border Colors
  border: {
    primary: '#1E293B',    // Steel Border
    accent: '#3B82F6',     // Metallic Blue
    gold: '#D1A954',       // Gold Accent
  },
  
  // Accent Colors
  accent: {
    blue: '#3B82F6',       // Metallic Blue
    steel: '#4A90E2',      // Steel Blue
    gold: '#D1A954',       // Soft Gold
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',    // White
    secondary: '#94A3B8',  // Light Gray
    muted: '#64748B',      // Muted Gray
  },
  
  // Status Colors
  status: {
    success: '#10B981',    // Green
    warning: '#F59E0B',    // Amber
    error: '#EF4444',      // Red
    info: '#3B82F6',       // Blue
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.25)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
  },
}

// Tailwind Class Utilities
export const tw = {
  // Backgrounds
  bgPrimary: 'bg-[#0A0D12]',
  bgSecondary: 'bg-[#0A0F14]',
  bgSurface: 'bg-[#11161C]',
  bgElevated: 'bg-[#0F1317]',
  
  // Borders
  borderPrimary: 'border-[#1E293B]',
  borderAccent: 'border-[#3B82F6]',
  borderGold: 'border-[#D1A954]',
  
  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-[#94A3B8]',
  textMuted: 'text-[#64748B]',
  
  // Accents
  accentBlue: 'text-[#3B82F6]',
  accentSteel: 'text-[#4A90E2]',
  accentGold: 'text-[#D1A954]',
  
  // Button Base
  btnBase: 'bg-[#0F1317] border border-[#3B82F6] text-white rounded-lg px-6 py-3 font-semibold transition-all hover:shadow-md hover:border-[#4A90E2]',
  btnPrimary: 'bg-[#0F1317] border-2 border-[#D1A954] text-white rounded-lg px-6 py-3 font-semibold transition-all hover:shadow-md',
  
  // Card Base
  card: 'bg-[#11161C] border border-[#1E293B] rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.25)]',
}
