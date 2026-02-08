import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { getTheme } from '../../styles/theme';

interface AuthThemeWrapperProps {
  children: React.ReactNode;
}

// Tema específico para telas de autenticação (sempre claro)
const authTheme = getTheme('light');

export const AuthThemeWrapper: React.FC<AuthThemeWrapperProps> = ({
  children,
}) => {
  // Forçar tema claro para telas de autenticação
  useEffect(() => {
    // Salvar tema atual
    const currentTheme = document.body.getAttribute('data-theme');
    localStorage.setItem('dream_keys_theme_backup', currentTheme || 'light');

    // Forçar tema claro
    document.body.setAttribute('data-theme', 'light');

    // Cleanup: restaurar tema original quando componente desmontar
    return () => {
      const originalTheme =
        localStorage.getItem('dream_keys_theme_backup') || 'light';
      document.body.setAttribute('data-theme', originalTheme);
    };
  }, []);

  return <ThemeProvider theme={authTheme}>{children}</ThemeProvider>;
};
