// Paleta de cores Light Mode
const lightColors = {
  // Cores primárias da marca
  primary: '#A63126', // Vermelho escuro
  primaryDark: '#8B251C', // Versão mais escura da primária
  primaryDarker: '#6B1D15', // Versão ainda mais escura
  primaryDarkest: '#4A140E', // Versão mais escura
  primaryLight: '#C44336', // Versão mais clara (para dark mode também)

  // Cor secundária
  secondary: '#592722', // Vinho/marrom escuro
  secondaryDark: '#4A1F1B', // Versão mais escura
  secondaryLight: '#7A3A34', // Versão mais clara (para dark mode)

  // Cor neutra
  neutral: '#A6A6A6', // Cinza médio

  // Cor de acento
  accent: '#A62E2E', // Vermelho intenso
  accentHover: '#D94A4A', // Versão mais clara para hover (também usado no dark)

  // Cores de fundo
  background: '#F2F2F2', // Cinza muito claro
  backgroundSecondary: '#E5E5E5', // Cinza claro
  backgroundTertiary: '#D9D9D9', // Cinza médio claro
  cardBackground: '#FFFFFF', // Branco para cards
  surface: '#FFFFFF', // Superfície branca

  // Cores de texto
  text: '#1F2937', // Texto principal escuro
  textSecondary: '#4B5563', // Texto secundário
  textLight: '#6B7280', // Texto claro
  textDisabled: '#9CA3AF', // Texto desabilitado

  // Cores de borda
  border: '#D1D5DB', // Borda padrão
  borderLight: '#E5E7EB', // Borda clara
  divider: '#E5E7EB', // Divisor

  // Cores de hover
  hover: '#F9FAFB', // Hover claro
  hoverDark: '#F3F4F6', // Hover escuro
  primaryHover: '#8B251C', // Hover primário
  secondaryHover: '#4A1F1B', // Hover secundário

  // Cores de status
  success: '#3FA66B', // Verde sucesso
  successDark: '#2D8A4F', // Verde sucesso escuro
  successLight: '#4FC77D', // Verde sucesso claro
  error: '#E05A5A', // Vermelho erro
  errorDark: '#C44336', // Vermelho erro escuro
  warning: '#E6B84C', // Amarelo atenção
  warningDark: '#D4A43A', // Amarelo atenção escuro
  info: '#4A90E2', // Azul informação
  infoDark: '#357ABD', // Azul informação escuro

  // Cores específicas para status (mantidas para compatibilidade)
  green: '#3FA66B',
  blue: '#4A90E2',
  yellow: '#E6B84C',
  purple: '#8B5CF6',
  red: '#E05A5A',

  // Cores de perigo
  danger: '#E05A5A',
  dangerHover: '#C44336',

  // Cores de input
  inputBackground: '#FFFFFF',
  hoverBackground: '#F9FAFB',

  // Cores de mensagens (light mode)
  successBackground: '#F0FDF4',
  successBorder: '#BBF7D0',
  successText: '#16A34A',
  errorBackground: '#FEF2F2',
  errorBorder: '#FECACA',
  errorText: '#DC2626',
  warningBackground: '#FFFBEB',
  warningBorder: '#FED7AA',
  warningText: '#D97706',
  infoBackground: '#EFF6FF',
  infoBorder: '#BFDBFE',
  infoText: '#2563EB',

  // Shadow
  shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

// Paleta de cores Dark Mode
const darkColors = {
  // Cores primárias da marca (adaptadas para dark)
  primary: '#C44336', // Versão mais clara para dark mode
  primaryDark: '#A63126', // Versão original
  primaryDarker: '#8B251C', // Versão mais escura
  primaryDarkest: '#6B1D15', // Versão mais escura
  primaryLight: '#D94A4A', // Versão mais clara

  // Cor secundária (adaptada para dark)
  secondary: '#7A3A34', // Versão mais clara para dark mode
  secondaryDark: '#592722', // Versão original
  secondaryLight: '#9A4A44', // Versão mais clara

  // Cor neutra
  neutral: '#A6A6A6', // Mantém igual

  // Cor de acento (adaptada para dark)
  accent: '#D94A4A', // Versão mais clara para dark mode
  accentHover: '#E05A5A', // Versão ainda mais clara para hover

  // Cores de fundo (dark mode)
  background: '#121212', // Background principal quase preto
  backgroundSecondary: '#1C1C1C', // Cards/Containers
  backgroundTertiary: '#242424', // Hover/Destaque sutil
  cardBackground: '#1C1C1C', // Cards no dark mode
  surface: '#1C1C1C', // Superfície no dark mode

  // Cores de texto (dark mode)
  text: '#E6E6E6', // Texto principal claro
  textSecondary: '#B3B3B3', // Texto secundário
  textLight: '#9CA3AF', // Texto claro
  textDisabled: '#7A7A7A', // Texto desabilitado

  // Cores de borda (dark mode)
  border: '#2E2E2E', // Borda padrão
  borderLight: '#3A3A3A', // Borda clara
  divider: '#2E2E2E', // Divisor

  // Cores de hover (dark mode)
  hover: '#242424', // Hover claro
  hoverDark: '#2E2E2E', // Hover escuro
  primaryHover: '#D94A4A', // Hover primário
  secondaryHover: '#9A4A44', // Hover secundário

  // Cores de status (mantidas, mas podem ser ajustadas)
  success: '#3FA66B',
  successDark: '#2D8A4F',
  successLight: '#4FC77D',
  error: '#E05A5A',
  errorDark: '#C44336',
  warning: '#E6B84C',
  warningDark: '#D4A43A',
  info: '#4A90E2',
  infoDark: '#357ABD',

  // Cores específicas para status (mantidas para compatibilidade)
  green: '#3FA66B',
  blue: '#4A90E2',
  yellow: '#E6B84C',
  purple: '#8B5CF6',
  red: '#E05A5A',

  // Cores de perigo
  danger: '#E05A5A',
  dangerHover: '#D94A4A',

  // Cores de input
  inputBackground: '#1C1C1C',
  hoverBackground: '#242424',

  // Cores de mensagens (dark mode - versões escuras)
  successBackground: '#1A3A2A',
  successBorder: '#2D8A4F',
  successText: '#4FC77D',
  errorBackground: '#3A1A1A',
  errorBorder: '#C44336',
  errorText: '#E05A5A',
  warningBackground: '#3A2F1A',
  warningBorder: '#D4A43A',
  warningText: '#E6B84C',
  infoBackground: '#1A2A3A',
  infoBorder: '#357ABD',
  infoText: '#4A90E2',

  // Shadow (mais sutil no dark mode)
  shadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
};

// Função para obter o tema baseado no modo
export const getTheme = (mode: 'light' | 'dark' = 'light') => {
  const colors = mode === 'dark' ? darkColors : lightColors;

  return {
    mode,
    /** Valores brutos das cores (sem var()) para injetar em :root e GlobalStyle */
    rawColors: { ...colors },
    colors: {
      ...colors,
      // Variáveis CSS para compatibilidade
      primary: `var(--color-primary, ${colors.primary})`,
      primaryDark: `var(--color-primary-dark, ${colors.primaryDark})`,
      primaryDarker: `var(--color-primary-darker, ${colors.primaryDarker})`,
      primaryDarkest: `var(--color-primary-darkest, ${colors.primaryDarkest})`,
      primaryLight: `var(--color-primary-light, ${colors.primaryLight})`,
      secondary: `var(--color-secondary, ${colors.secondary})`,
      secondaryDark: `var(--color-secondary-dark, ${colors.secondaryDark})`,
      secondaryLight: `var(--color-secondary-light, ${colors.secondaryLight})`,
      neutral: `var(--color-neutral, ${colors.neutral})`,
      accent: `var(--color-accent, ${colors.accent})`,
      accentHover: `var(--color-accent-hover, ${colors.accentHover})`,
      background: `var(--color-background, ${colors.background})`,
      backgroundSecondary: `var(--color-background-secondary, ${colors.backgroundSecondary})`,
      backgroundTertiary: `var(--color-background-tertiary, ${colors.backgroundTertiary})`,
      cardBackground: `var(--color-card-background, ${colors.cardBackground})`,
      surface: `var(--color-surface, ${colors.surface})`,
      text: `var(--color-text, ${colors.text})`,
      textSecondary: `var(--color-text-secondary, ${colors.textSecondary})`,
      textLight: `var(--color-text-light, ${colors.textLight})`,
      textDisabled: `var(--color-text-disabled, ${colors.textDisabled})`,
      border: `var(--color-border, ${colors.border})`,
      borderLight: `var(--color-border-light, ${colors.borderLight})`,
      divider: `var(--color-divider, ${colors.divider})`,
      hover: `var(--color-hover, ${colors.hover})`,
      hoverDark: `var(--color-hover-dark, ${colors.hoverDark})`,
      primaryHover: `var(--color-primary-hover, ${colors.primaryHover})`,
      secondaryHover: `var(--color-secondary-hover, ${colors.secondaryHover})`,
      success: `var(--color-success, ${colors.success})`,
      successDark: `var(--color-success-dark, ${colors.successDark})`,
      successLight: `var(--color-success-light, ${colors.successLight})`,
      error: `var(--color-error, ${colors.error})`,
      errorDark: `var(--color-error-dark, ${colors.errorDark})`,
      warning: `var(--color-warning, ${colors.warning})`,
      warningDark: `var(--color-warning-dark, ${colors.warningDark})`,
      info: `var(--color-info, ${colors.info})`,
      infoDark: `var(--color-info-dark, ${colors.infoDark})`,
      green: `var(--color-green, ${colors.green})`,
      blue: `var(--color-blue, ${colors.blue})`,
      yellow: `var(--color-yellow, ${colors.yellow})`,
      purple: `var(--color-purple, ${colors.purple})`,
      red: `var(--color-red, ${colors.red})`,
      danger: `var(--color-danger, ${colors.danger})`,
      dangerHover: `var(--color-danger-hover, ${colors.dangerHover})`,
      inputBackground: `var(--color-input-background, ${colors.inputBackground})`,
      hoverBackground: `var(--color-hover-background, ${colors.hoverBackground})`,
      successBackground: `var(--color-success-background, ${colors.successBackground})`,
      successBorder: `var(--color-success-border, ${colors.successBorder})`,
      successText: `var(--color-success-text, ${colors.successText})`,
      errorBackground: `var(--color-error-background, ${colors.errorBackground})`,
      errorBorder: `var(--color-error-border, ${colors.errorBorder})`,
      errorText: `var(--color-error-text, ${colors.errorText})`,
      warningBackground: `var(--color-warning-background, ${colors.warningBackground})`,
      warningBorder: `var(--color-warning-border, ${colors.warningBorder})`,
      warningText: `var(--color-warning-text, ${colors.warningText})`,
      infoBackground: `var(--color-info-background, ${colors.infoBackground})`,
      infoBorder: `var(--color-info-border, ${colors.infoBorder})`,
      infoText: `var(--color-info-text, ${colors.infoText})`,
      shadow: `var(--color-shadow, ${colors.shadow})`,
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      xxl: '24px',
    },
    shadows: {
      sm:
        mode === 'dark'
          ? '0 1px 2px rgba(0, 0, 0, 0.3)'
          : '0 1px 2px rgba(0, 0, 0, 0.05)',
      md:
        mode === 'dark'
          ? '0 4px 6px rgba(0, 0, 0, 0.3)'
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg:
        mode === 'dark'
          ? '0 10px 15px rgba(0, 0, 0, 0.3)'
          : '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl:
        mode === 'dark'
          ? '0 20px 25px rgba(0, 0, 0, 0.4)'
          : '0 20px 25px rgba(0, 0, 0, 0.1)',
      small:
        mode === 'dark'
          ? '0 1px 2px rgba(0, 0, 0, 0.3)'
          : '0 1px 2px rgba(0, 0, 0, 0.05)',
      medium:
        mode === 'dark'
          ? '0 4px 6px rgba(0, 0, 0, 0.3)'
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
      large:
        mode === 'dark'
          ? '0 10px 15px rgba(0, 0, 0, 0.3)'
          : '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1200px',
    },
  };
};

// Tema padrão (light mode) para compatibilidade
export const theme = getTheme('light');

// Exportar tipos
export type Theme = ReturnType<typeof getTheme>;
