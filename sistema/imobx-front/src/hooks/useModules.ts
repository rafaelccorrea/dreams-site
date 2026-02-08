import { useContext } from 'react';
import { ModulesContext } from '../contexts/ModulesContextTypes';

/**
 * Hook para acessar módulos disponíveis
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { hasModule, loading } = useModules();
 *
 *   if (loading) return <Spinner />;
 *
 *   return (
 *     <>
 *       {hasModule('rental_management') && (
 *         <RentalSection />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export const useModules = () => {
  const context = useContext(ModulesContext);

  if (!context) {
    throw new Error('useModules must be used within a ModulesProvider');
  }

  return context;
};
