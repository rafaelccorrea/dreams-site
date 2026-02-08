import { createGlobalStyle } from 'styled-components';

/**
 * Variáveis e estilos globais que reagem ao tema (light/dark).
 * Deve ficar dentro do ThemeProvider do styled-components para receber theme.
 */
export const GlobalStyle = createGlobalStyle`
  :root {
    --color-primary: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.primary ?? '#A63126'};
    --color-primary-dark: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.primaryDark ?? '#8B251C'};
    --color-primary-hover: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.primaryHover ?? '#8a2920'};
    --color-secondary: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.secondary ?? '#2c3e50'};
    --color-background: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.background ?? '#F2F2F2'};
    --color-surface: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.surface ?? '#ffffff'};
    --color-text: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.text ?? '#1e293b'};
    --color-text-secondary: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.textSecondary ?? '#64748b'};
    --color-border: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.border ?? '#e2e8f0'};
    --color-error: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.error ?? '#ef4444'};
    --color-success: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.success ?? '#22c55e'};
    --color-purple: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.purple ?? '#8B5CF6'};
    --color-card-background: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.cardBackground ?? '#ffffff'};
    --color-background-secondary: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.backgroundSecondary ?? '#E5E5E5'};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.background ?? 'var(--color-background)'};
    color: ${(p: { theme?: { rawColors?: Record<string, string> } }) => p.theme?.rawColors?.text ?? 'var(--color-text)'};
    line-height: 1.6;
  }

  /* Scrollbar personalizada - adapta ao tema */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${(p: {
      theme?: { rawColors?: Record<string, string> };
      mode?: string;
    }) =>
      p.theme?.mode === 'dark'
        ? (p.theme?.rawColors?.backgroundSecondary ?? '#1C1C1C')
        : '#f8fafc'};
  }

  ::-webkit-scrollbar-thumb {
    background: ${(p: {
      theme?: { mode?: string; rawColors?: Record<string, string> };
    }) =>
      p.theme?.mode === 'dark'
        ? (p.theme?.rawColors?.border ?? '#404040')
        : '#cbd5e1'};
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${(p: {
      theme?: { mode?: string; rawColors?: Record<string, string> };
    }) =>
      p.theme?.mode === 'dark'
        ? (p.theme?.rawColors?.textSecondary ?? '#6b7280')
        : '#94a3b8'};
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
