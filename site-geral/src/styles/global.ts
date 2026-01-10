import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Cores Primárias */
    --primary-color: #A63126;
    --primary: #A63126;
    --primary-dark: #8B251C;
    --primary-darker: #6B1D15;
    --primary-darkest: #4A140E;
    --primary-light: #C44336;

    /* Cores Secundárias */
    --secondary-color: #592722;
    --secondary: #592722;
    --secondary-dark: #4A1F1B;
    --secondary-light: #7A3A34;
    --accent: #A62E2E;
    --accent-hover: #D94A4A;
    --neutral: #A6A6A6;

    /* Cores de Fundo */
    --background: #F2F2F2;
    --background-secondary: #E5E5E5;
    --background-tertiary: #D9D9D9;
    --card-background: #FFFFFF;
    --surface: #FFFFFF;
    --input-background: #FFFFFF;

    /* Cores de Texto */
    --text: #1F2937;
    --text-primary: #1F2937;
    --text-secondary: #4B5563;
    --text-light: #6B7280;
    --text-disabled: #9CA3AF;

    /* Cores de Borda */
    --border: #D1D5DB;
    --border-light: #E5E7EB;
    --divider: #E5E7EB;

    /* Cores de Status */
    --success: #3FA66B;
    --success-dark: #2D8A4F;
    --success-light: #4FC77D;
    --error: #E05A5A;
    --error-dark: #C44336;
    --warning: #E6B84C;
    --warning-dark: #D4A43A;
    --info: #4A90E2;
    --info-dark: #357ABD;
    --danger: #E05A5A;

    /* Cores Específicas */
    --green: #3FA66B;
    --blue: #4A90E2;
    --yellow: #E6B84C;
    --purple: #8B5CF6;
    --red: #E05A5A;

    /* Cores de Mensagens - Success */
    --success-background: #F0FDF4;
    --success-border: #BBF7D0;
    --success-text: #16A34A;

    /* Cores de Mensagens - Error */
    --error-background: #FEF2F2;
    --error-border: #FECACA;
    --error-text: #DC2626;

    /* Cores de Mensagens - Warning */
    --warning-background: #FFFBEB;
    --warning-border: #FED7AA;
    --warning-text: #D97706;

    /* Cores de Mensagens - Info */
    --info-background: #EFF6FF;
    --info-border: #BFDBFE;
    --info-text: #2563EB;

    /* Cores de Hover */
    --hover: #F9FAFB;
    --hover-dark: #F3F4F6;
    --primary-hover: #8B251C;
    --secondary-hover: #4A1F1B;
    --danger-hover: #C44336;
    --hover-background: #F9FAFB;

    /* Compatibilidade com código antigo */
    --neutral-light: #F2F2F2;
    --neutral-medium: #A6A6A6;
    --surface-dark: #E5E5E5;

    /* Espaçamentos */
    --spacing-xs: 0.5rem;   /* 8px */
    --spacing-sm: 0.75rem;  /* 12px */
    --spacing-md: 1rem;     /* 16px */
    --spacing-lg: 1.5rem;   /* 24px */
    --spacing-xl: 2rem;     /* 32px */
    --spacing-2xl: 3rem;    /* 48px */
    --spacing-3xl: 4rem;    /* 64px */

    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;

    /* Sombras */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Transições */
    --transition-fast: 150ms ease-in-out;
    --transition-base: 250ms ease-in-out;
    --transition-slow: 350ms ease-in-out;

    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    overflow-x: hidden;
    max-width: 100vw;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 100vw;
    width: 100%;
  }

  #root {
    width: 100%;
    max-width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  /* Tipografia */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }

  h1 {
    font-size: 3rem;
    font-weight: 700;
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
  }

  h3 {
    font-size: 2rem;
    font-weight: 600;
  }

  h4 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  h5 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  h6 {
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin-bottom: var(--spacing-md);
    color: var(--text-secondary);
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--primary-hover);
    }
  }

  /* Estilos para inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    outline: none;
  }

  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-secondary);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: var(--radius-full);
    border: 2px solid var(--background-secondary);

    &:hover {
      background: var(--primary-hover);
    }
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--primary) var(--background-secondary);
  }

  /* Selection */
  ::selection {
    background-color: var(--primary-light);
    color: white;
  }

  /* Code */
  code {
    font-family: 'Fira Code', 'Courier New', monospace;
    background-color: var(--background-secondary);
    padding: 0.2rem 0.4rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
  }

  /* Utilitários */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1.5rem;
    }

    .container {
      padding: 0 var(--spacing-sm);
    }
  }
`

