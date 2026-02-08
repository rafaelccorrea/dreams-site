import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdBusiness,
  MdSearch,
  MdFilterList,
  MdEdit,
  MdRefresh,
  MdMoreVert,
  MdBadge,
  MdEmail,
  MdLocationOn,
  MdPhone,
  MdCalendarToday,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import {
  InfoCard,
  CardHeader,
  CardTitle,
  CardAction,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  LoadingContainer,
} from '../styles/pages/ProfilePageStyles';

// Componentes específicos para a seção de empresas
const CompaniesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchAndFilters = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
`;

const CompanyCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.colors.shadow};
    transform: translateY(-2px);
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CompanyName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const CompanyActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const CompanyActionButton = styled.button<{
  variant?: 'primary' | 'secondary';
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.hover};
    }
  `}
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CompanyDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  min-width: 60px;
`;

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.active ? 'white' : props.theme.colors.text)};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.active ? props.theme.colors.primaryDark : props.theme.colors.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ExpandableSection = styled.div<{ expanded: boolean }>`
  max-height: ${props => (props.expanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: string;
}

interface CompaniesSectionProps {
  companies: Company[];
  hasCompanies: boolean;
  companiesLoading: boolean;
  companiesError: string | null;
  onReloadCompanies: () => void;
  onEditCompany: (company: Company) => void;
  userRole?: string;
}

const CompaniesSection: React.FC<CompaniesSectionProps> = ({
  companies,
  hasCompanies,
  companiesLoading,
  companiesError,
  onReloadCompanies,
  onEditCompany,
  userRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showAll, setShowAll] = useState(false);

  // Filtrar empresas baseado na busca
  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return companies.filter(
      company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.cnpj.includes(searchTerm) ||
        (company.email &&
          company.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.city &&
          company.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [companies, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = showAll
    ? filteredCompanies
    : filteredCompanies.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!hasCompanies) {
    return (
      <InfoCard>
        <CardHeader>
          <CardTitle>
            <MdBusiness size={20} />
            Empresas
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <EmptyStateIcon>
            <MdBusiness />
          </EmptyStateIcon>
          <EmptyStateTitle>Nenhuma empresa cadastrada</EmptyStateTitle>
          <EmptyStateDescription>
            Cadastre sua primeira empresa para começar a usar o sistema completo
          </EmptyStateDescription>
        </EmptyState>
      </InfoCard>
    );
  }

  if (companiesLoading) {
    return (
      <InfoCard>
        <CardHeader>
          <CardTitle>
            <MdBusiness size={20} />
            Empresas
          </CardTitle>
        </CardHeader>
        <LoadingContainer>
          <div>Carregando empresas...</div>
        </LoadingContainer>
      </InfoCard>
    );
  }

  if (companiesError) {
    return (
      <InfoCard>
        <CardHeader>
          <CardTitle>
            <MdBusiness size={20} />
            Empresas
          </CardTitle>
        </CardHeader>
        <EmptyState>
          <EmptyStateIcon>
            <MdBusiness />
          </EmptyStateIcon>
          <EmptyStateTitle>Erro ao carregar empresas</EmptyStateTitle>
          <EmptyStateDescription>
            Tente recarregar as empresas ou verifique sua conexão
          </EmptyStateDescription>
          <CompanyActionButton
            onClick={onReloadCompanies}
            style={{ marginTop: '12px' }}
          >
            <MdRefresh size={14} />
            Recarregar Empresas
          </CompanyActionButton>
        </EmptyState>
      </InfoCard>
    );
  }

  return (
    <InfoCard>
      <CardHeader>
        <CardTitle>
          <MdBusiness size={20} />
          Empresas ({filteredCompanies.length})
        </CardTitle>
        <CardAction>
          <FilterButton onClick={onReloadCompanies} title='Recarregar empresas'>
            <MdRefresh size={16} />
            Recarregar
          </FilterButton>
          <CardAction>
            <MdMoreVert size={16} />
          </CardAction>
        </CardAction>
      </CardHeader>

      <CompaniesContainer>
        <SearchAndFilters>
          <SearchInput
            type='text'
            placeholder='Buscar empresas por nome, CNPJ, email ou cidade...'
            value={searchTerm}
            onChange={handleSearch}
          />
          <FilterButton>
            <MdFilterList size={16} />
            Filtros
          </FilterButton>
        </SearchAndFilters>

        <ResultsInfo>
          <span>
            Mostrando {currentCompanies.length} de {filteredCompanies.length}{' '}
            empresas
          </span>
          {filteredCompanies.length > itemsPerPage && (
            <span>
              Página {currentPage} de {totalPages}
            </span>
          )}
        </ResultsInfo>

        {filteredCompanies.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <MdSearch />
            </EmptyStateIcon>
            <EmptyStateTitle>Nenhuma empresa encontrada</EmptyStateTitle>
            <EmptyStateDescription>
              Tente ajustar os termos de busca ou filtros
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <>
            <CompaniesGrid>
              {currentCompanies.map(company => (
                <CompanyCard key={company.id}>
                  <CompanyHeader>
                    <CompanyName>
                      <MdBusiness size={20} />
                      {company.name}
                    </CompanyName>
                  </CompanyHeader>

                  <CompanyInfo>
                    <CompanyDetail>
                      <MdBadge size={16} />
                      <DetailLabel>CNPJ:</DetailLabel>
                      <DetailValue>{company.cnpj}</DetailValue>
                    </CompanyDetail>

                    {company.email && (
                      <CompanyDetail>
                        <MdEmail size={16} />
                        <DetailLabel>Email:</DetailLabel>
                        <DetailValue>{company.email}</DetailValue>
                      </CompanyDetail>
                    )}

                    {(company.city || company.state) && (
                      <CompanyDetail>
                        <MdLocationOn size={16} />
                        <DetailLabel>Local:</DetailLabel>
                        <DetailValue>
                          {company.city && company.state
                            ? `${company.city}/${company.state}`
                            : company.city || company.state}
                        </DetailValue>
                      </CompanyDetail>
                    )}

                    {company.phone && (
                      <CompanyDetail>
                        <MdPhone size={16} />
                        <DetailLabel>Telefone:</DetailLabel>
                        <DetailValue>{company.phone}</DetailValue>
                      </CompanyDetail>
                    )}

                    <CompanyDetail>
                      <MdCalendarToday size={16} />
                      <DetailLabel>Criada:</DetailLabel>
                      <DetailValue>{formatDate(company.createdAt)}</DetailValue>
                    </CompanyDetail>
                  </CompanyInfo>

                  {userRole !== 'user' && (
                    <CompanyActions>
                      <CompanyActionButton
                        variant='primary'
                        onClick={() => onEditCompany(company)}
                      >
                        <MdEdit size={14} />
                        Editar
                      </CompanyActionButton>
                    </CompanyActions>
                  )}

                  {userRole === 'user' && (
                    <CompanyActions>
                      <CompanyActionButton
                        variant='primary'
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          color: 'var(--color-success)',
                          cursor: 'default',
                        }}
                      >
                        <MdBusiness size={14} />
                        Empresa Atual
                      </CompanyActionButton>
                    </CompanyActions>
                  )}
                </CompanyCard>
              ))}
            </CompaniesGrid>

            {/* Paginação */}
            {!showAll && totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <PaginationButton
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationButton>
                  )
                )}

                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </PaginationButton>
              </PaginationContainer>
            )}

            {/* Botão para mostrar todas as empresas */}
            {!showAll && filteredCompanies.length > itemsPerPage && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <ExpandButton onClick={() => setShowAll(true)}>
                  <MdExpandMore size={16} />
                  Ver todas as {filteredCompanies.length} empresas
                </ExpandButton>
              </div>
            )}

            {showAll && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <ExpandButton onClick={() => setShowAll(false)}>
                  <MdExpandLess size={16} />
                  Mostrar com paginação
                </ExpandButton>
              </div>
            )}
          </>
        )}
      </CompaniesContainer>
    </InfoCard>
  );
};

export default CompaniesSection;
