export const styledTheme = {
  colors: {
    // Cores Primárias
    primary: '#A63126',
    primaryDark: '#8B251C',
    primaryDarker: '#6B1D15',
    primaryDarkest: '#4A140E',
    primaryLight: '#C44336',
    
    // Cores Secundárias
    secondary: '#592722',
    secondaryDark: '#4A1F1B',
    secondaryLight: '#7A3A34',
    accent: '#A62E2E',
    accentHover: '#D94A4A',
    neutral: '#A6A6A6',
    
    // Cores de Fundo
    background: '#F2F2F2',
    backgroundSecondary: '#E5E5E5',
    backgroundTertiary: '#D9D9D9',
    cardBackground: '#FFFFFF',
    surface: '#FFFFFF',
    inputBackground: '#FFFFFF',
    
    // Cores de Texto
    text: '#1F2937',
    textSecondary: '#4B5563',
    textLight: '#6B7280',
    textDisabled: '#9CA3AF',
    textPrimary: '#1F2937', // Alias para compatibilidade
    white: '#ffffff',
    black: '#000000',
    
    // Cores de Borda
    border: '#D1D5DB',
    borderLight: '#E5E7EB',
    divider: '#E5E7EB',
    
    // Cores de Status
    success: '#3FA66B',
    successDark: '#2D8A4F',
    successLight: '#4FC77D',
    error: '#E05A5A',
    errorDark: '#C44336',
    warning: '#E6B84C',
    warningDark: '#D4A43A',
    info: '#4A90E2',
    infoDark: '#357ABD',
    danger: '#E05A5A',
    
    // Cores Específicas
    green: '#3FA66B',
    blue: '#4A90E2',
    yellow: '#E6B84C',
    purple: '#8B5CF6',
    red: '#E05A5A',
    
    // Cores de Mensagens - Success
    successBackground: '#F0FDF4',
    successBorder: '#BBF7D0',
    successText: '#16A34A',
    
    // Cores de Mensagens - Error
    errorBackground: '#FEF2F2',
    errorBorder: '#FECACA',
    errorText: '#DC2626',
    
    // Cores de Mensagens - Warning
    warningBackground: '#FFFBEB',
    warningBorder: '#FED7AA',
    warningText: '#D97706',
    
    // Cores de Mensagens - Info
    infoBackground: '#EFF6FF',
    infoBorder: '#BFDBFE',
    infoText: '#2563EB',
    
    // Cores de Hover
    hover: '#F9FAFB',
    hoverDark: '#F3F4F6',
    primaryHover: '#8B251C',
    secondaryHover: '#4A1F1B',
    dangerHover: '#C44336',
    hoverBackground: '#F9FAFB',
    
    // Compatibilidade com código antigo
    neutralLight: '#F2F2F2',
    neutralMedium: '#A6A6A6',
    surfaceDark: '#E5E5E5',
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

