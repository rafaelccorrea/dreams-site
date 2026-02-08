import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isInitialized: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Função para obter tema inicial do localStorage ou sistema
const getInitialTheme = (): Theme => {
  // Verificar se estamos no servidor (SSR)
  if (typeof window === 'undefined') {
    return 'light';
  }

  // Tentar obter tema salvo
  const savedTheme = localStorage.getItem('dream_keys_theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }

  // Fallback para preferência do sistema
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar tema e aplicar ao DOM
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);

    // Aplicar tema ao body imediatamente
    document.body.setAttribute('data-theme', initialTheme);

    // Marcar como inicializado
    setIsInitialized(true);
  }, []);

  // Salvar tema no localStorage quando mudar
  useEffect(() => {
    if (!isInitialized) return;

    localStorage.setItem('dream_keys_theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme, isInitialized }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
