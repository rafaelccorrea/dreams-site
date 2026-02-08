import { useCompanyContext } from '../contexts';

/**
 * Hook personalizado para facilitar o acesso ao contexto de empresa
 * Fornece métodos convenientes para trabalhar com empresas
 */
export const useCompany = () => {
  const context = useCompanyContext();

  return {
    // Estado da empresa
    selectedCompany: context.selectedCompany,
    companies: context.companies,
    isLoading: context.isLoading,
    error: context.error,

    // Métodos de empresa
    selectCompany: context.selectCompany,
    refreshCompanies: context.refreshCompanies,
    clearSelectedCompany: context.clearSelectedCompany,
    clearError: context.clearError,

    // Métodos utilitários
    hasSelectedCompany: !!context.selectedCompany,
    hasCompanies: context.companies.length > 0,
    getCompanyById: (id: string) => context.companies.find(c => c.id === id),
    getCompanyName: () =>
      context.selectedCompany?.name || 'Nenhuma empresa selecionada',
    getCompanyDetails: () => {
      if (!context.selectedCompany) return null;

      const details = [];
      if (context.selectedCompany.cnpj)
        details.push(`CNPJ: ${context.selectedCompany.cnpj}`);
      if (context.selectedCompany.city)
        details.push(context.selectedCompany.city);
      if (context.selectedCompany.state)
        details.push(context.selectedCompany.state);

      return details.join(' • ');
    },
  };
};
