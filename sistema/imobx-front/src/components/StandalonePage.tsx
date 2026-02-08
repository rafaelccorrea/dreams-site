import React from 'react';

interface StandalonePageProps {
  children: React.ReactNode;
}

/**
 * Componente para páginas que não precisam do layout normal (Header, Drawer, etc.)
 * e também não precisam de verificação de subscription ou modais (como system-unavailable)
 * Esta página é completamente independente e não faz chamadas de API
 */
export const StandalonePage: React.FC<StandalonePageProps> = ({ children }) => {
  return <>{children}</>;
};
