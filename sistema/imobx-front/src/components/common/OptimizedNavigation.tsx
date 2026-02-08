import React, { createContext, useContext } from 'react';
import { useOptimizedNavigation } from '../../hooks/useOptimizedNavigation';

interface OptimizedNavigationProps {
  children: React.ReactNode;
}

// Context para disponibilizar navegação otimizada
const navigationContext = createContext<{
  navigate: (
    path: string,
    options?: { replace?: boolean; state?: any }
  ) => void;
}>({
  navigate: () => {},
});

// Componente para otimizar navegação
export const OptimizedNavigation: React.FC<OptimizedNavigationProps> = ({
  children,
}) => {
  const { navigate } = useOptimizedNavigation();

  return (
    <navigationContext.Provider value={{ navigate }}>
      {children}
    </navigationContext.Provider>
  );
};

export default OptimizedNavigation;
