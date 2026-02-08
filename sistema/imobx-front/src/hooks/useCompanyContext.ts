import { useContext } from 'react';
import { CompanyContext } from '../contexts/CompanyContextDefinition';
import type { CompanyContextType } from '../contexts/CompanyContextDefinition';

export const useCompanyContext = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error(
      'useCompanyContext deve ser usado dentro de um CompanyProvider'
    );
  }
  return context;
};
