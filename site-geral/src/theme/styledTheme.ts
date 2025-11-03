export const styledTheme = {
  colors: {
    // Paleta principal - Tons de azul
    primary: '#3370A6',
    primaryDark: '#508BBF',
    primaryLight: '#8BB4D9',
    
    // Cores neutras da paleta
    neutralLight: '#F0F0F2',
    neutralMedium: '#C1C9D9',
    
    // Cores secundárias mantidas para feedback
    secondary: '#dc004e',
    secondaryDark: '#c51162',
    secondaryLight: '#ff5983',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    
    // Background e surfaces
    background: '#F0F0F2',
    surface: '#C1C9D9',
    surfaceDark: '#eeeeee',
    
    // Textos
    textPrimary: '#212121',
    textSecondary: '#757575',
    textDisabled: '#bdbdbd',
    white: '#ffffff',
    black: '#000000',
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
}

// Declaração de tipo para TypeScript
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof styledTheme.colors
    spacing: typeof styledTheme.spacing
    borderRadius: typeof styledTheme.borderRadius
    shadows: typeof styledTheme.shadows
    transitions: typeof styledTheme.transitions
    zIndex: typeof styledTheme.zIndex
    breakpoints: typeof styledTheme.breakpoints
  }
}

