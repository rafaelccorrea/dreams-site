import React from 'react';
import { useCompany } from '../hooks/useCompany';
import { CompanySelector } from '../components/CompanySelector';
import {
  CompanyDemoContainer,
  CompanyInfoCard,
  CompanyName,
  CompanyDetails,
  CompanyActions,
  ActionButton,
  StatusIndicator,
} from '../styles/components/CompanyDemoStyles';

/**
 * Componente de demonstração do sistema de seleção de empresa
 * Mostra como usar o contexto de empresa em outras páginas
 */
export const CompanyDemo: React.FC = () => {
  const {
    selectedCompany,
    companies,
    isLoading,
    error,
    hasSelectedCompany,
    hasCompanies,
    getCompanyName,
    getCompanyDetails,
    refreshCompanies,
    clearSelectedCompany,
  } = useCompany();

  const handleRefresh = async () => {
    await refreshCompanies();
  };

  const handleClear = () => {
    clearSelectedCompany();
  };

  if (isLoading) {
    return (
      <CompanyDemoContainer>
        <StatusIndicator $type='loading'>
          Carregando informações da empresa...
        </StatusIndicator>
      </CompanyDemoContainer>
    );
  }

  if (error) {
    return (
      <CompanyDemoContainer>
        <StatusIndicator $type='error'>Erro: {error}</StatusIndicator>
      </CompanyDemoContainer>
    );
  }

  if (!hasCompanies) {
    return (
      <CompanyDemoContainer>
        <StatusIndicator $type='warning'>
          Nenhuma empresa encontrada. Crie uma empresa para começar.
        </StatusIndicator>
      </CompanyDemoContainer>
    );
  }

  return (
    <CompanyDemoContainer>
      <h2>Demonstração do Sistema de Empresas</h2>

      <div style={{ marginBottom: '24px' }}>
        <h3>Seletor de Empresa:</h3>
        <CompanySelector />
      </div>

      {hasSelectedCompany ? (
        <CompanyInfoCard>
          <CompanyName>{getCompanyName()}</CompanyName>
          <CompanyDetails>{getCompanyDetails()}</CompanyDetails>

          <CompanyActions>
            <ActionButton onClick={handleRefresh}>Atualizar Lista</ActionButton>
            <ActionButton onClick={handleClear} $variant='secondary'>
              Limpar Seleção
            </ActionButton>
          </CompanyActions>
        </CompanyInfoCard>
      ) : (
        <StatusIndicator $type='info'>
          Selecione uma empresa para ver os detalhes
        </StatusIndicator>
      )}

      <div style={{ marginTop: '24px' }}>
        <h3>Informações do Sistema:</h3>
        <ul>
          <li>Total de empresas: {companies.length}</li>
          <li>Empresa selecionada: {hasSelectedCompany ? 'Sim' : 'Não'}</li>
          <li>ID da empresa selecionada: {selectedCompany?.id || 'Nenhuma'}</li>
        </ul>
      </div>
    </CompanyDemoContainer>
  );
};
