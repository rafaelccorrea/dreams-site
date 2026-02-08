import React from 'react';
import { useInitializationFlow } from '../hooks/useInitializationFlow';
import { LottieLoading } from './common/LottieLoading';

interface InitializationFlowProps {
  children: React.ReactNode;
}

export const InitializationFlow: React.FC<InitializationFlowProps> = ({
  children,
}) => {
  const { isLoading, error } = useInitializationFlow();

  if (isLoading) {
    return <LottieLoading message='Carregando empresas...' />;
  }

  if (error) {
    console.error('❌ Erro na inicialização:', error);
    // Mesmo com erro, renderizar children para não travar a aplicação
  }

  return <>{children}</>;
};
