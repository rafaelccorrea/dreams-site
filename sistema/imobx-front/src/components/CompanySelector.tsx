import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useCompanyContext } from '../contexts';
import { useAuth } from '../hooks/useAuth';
import { useSubscriptionContext } from '../contexts/SubscriptionContext';
import { type Company } from '../services/companyApiTemp';
import { formatCNPJ } from '../utils/masks';
import {
  CompanySelectorContainer,
  CompanySelectorButton,
  CompanyInfo,
  CompanyName,
  CompanyDetails,
  PlanDetails,
  DropdownContainer,
  DropdownList,
  DropdownItem,
  CompanyItemInfo,
  CompanyItemName,
  CompanyItemDetails,
  LoadingState,
  ErrorState,
  PlanInfoHeader,
  PlanInfoRow,
} from '../styles/components/CompanySelectorStyles';
import styled from 'styled-components';
import {
  IoChevronDown,
  IoBusiness,
  IoRefresh,
  IoAlertCircle,
  IoAdd,
} from 'react-icons/io5';

const EmptyStateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  min-height: 40px;
`;

const EmptyStateText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  min-width: 0;
`;

const CreateCompanyButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px ${props => `${props.theme.colors.primary}40`};
  margin: 8px 0;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px ${props => `${props.theme.colors.primary}60`};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const Separator = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 8px 0;
`;

interface CompanySelectorProps {
  className?: string;
  onLogoClick?: () => void;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const {
    selectedCompany,
    companies,
    isLoading,
    error,
    selectCompany,
    refreshCompanies,
  } = useCompanyContext();

  const { getCurrentUser } = useAuth();
  const {
    subscriptionStatus,
    subscriptionLimits,
    subscriptionValidations,
    hasAccess,
    accessReason,
    loading: subscriptionLoading,
    loadSubscriptionStatus,
    loadPlans,
  } = useSubscriptionContext();
  const user = getCurrentUser();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownPanelRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 200,
  });

  // Apenas admin ou master podem criar empresas
  const canSelectCompany = user?.role === 'admin' || user?.role === 'master';
  const canCreateCompany = user?.role === 'admin' || user?.role === 'master';

  // Posição do dropdown quando aberto (para renderizar via portal no body)
  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const spacing = 12;
    setDropdownPosition({
      top: rect.bottom + spacing,
      left: rect.left,
      width: Math.max(rect.width, 280),
    });
  }, [isOpen]);

  // Fechar dropdown ao clicar fora (considera container e painel do portal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inContainer = dropdownRef.current?.contains(target);
      const inPanel = dropdownPanelRef.current?.contains(target);
      if (!inContainer && !inPanel) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Removido carregamento redundante - já é feito pelo SubscriptionProvider

  // Calcular informações sobre empresas usando nova estrutura da API
  const currentCompanyCount = companies.length;

  // Usar limites da nova estrutura da API (prioridade) ou fallback para estrutura legada
  const companyLimits = subscriptionLimits?.companies;
  const maxCompanies =
    companyLimits?.max ?? subscriptionStatus?.plan?.maxCompanies ?? 1;
  const canCreateMoreCompanies =
    companyLimits?.canCreate ?? currentCompanyCount < maxCompanies;
  const remainingCompanies =
    companyLimits?.remaining ?? Math.max(0, maxCompanies - currentCompanyCount);

  // Calcular percentual usado localmente para validação
  const calculatedPercentUsed =
    maxCompanies > 0 ? (currentCompanyCount / maxCompanies) * 100 : 0;

  // Usar percentual do backend, mas validar se está correto
  // Se o percentual do backend for muito diferente do calculado, usar o calculado
  const backendPercentUsed = companyLimits?.percentUsed;
  let percentUsed = calculatedPercentUsed;

  if (backendPercentUsed !== undefined) {
    // Se a diferença for maior que 5%, usar o valor calculado (provavelmente erro no backend)
    const difference = Math.abs(backendPercentUsed - calculatedPercentUsed);
    if (difference > 5) {
      console.warn('⚠️ Percentual do backend parece incorreto:', {
        backend: backendPercentUsed,
        calculated: calculatedPercentUsed,
        current: currentCompanyCount,
        max: maxCompanies,
      });
      percentUsed = calculatedPercentUsed;
    } else {
      percentUsed = backendPercentUsed;
    }
  }

  const isNearLimit = companyLimits?.isNearLimit ?? percentUsed >= 80;

  // Verificar acesso usando dados da nova API
  const canCreate = hasAccess !== false && canCreateMoreCompanies;

  const handleToggleDropdown = () => {
    // Só permitir abrir dropdown se o usuário pode selecionar empresas e há mais de uma empresa
    if (canSelectCompany && companies.length > 1) {
      setIsOpen(!isOpen);
    } else if (canSelectCompany && companies.length === 1) {
      // Se houver apenas uma empresa mas o usuário pode criar mais, permitir abrir para mostrar opção de criar
      setIsOpen(!isOpen);
    }
  };

  const handleSelectCompany = (company: Company) => {
    selectCompany(company);
    setIsOpen(false);
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await refreshCompanies();

    // Se o usuário for admin ou master, atualizar os planos também
    if (user?.role === 'admin' || user?.role === 'master') {
      await loadSubscriptionStatus();
      await loadPlans();
    }
  };

  const handleCreateCompany = () => {
    // Redirecionar para página de criação de nova empresa (não primeira empresa)
    setIsOpen(false);
    navigate('/companies/create');
  };

  const formatCompanyDetails = (company: Company) => {
    const details = [];
    if (company.cnpj) details.push(`CNPJ: ${formatCNPJ(company.cnpj)}`);
    if (company.city) details.push(company.city);
    if (company.state) details.push(company.state);
    return details.join(' • ');
  };

  if (error) {
    return (
      <CompanySelectorContainer className={className}>
        <ErrorState>
          <IoAlertCircle size={20} />
          <span>Erro ao carregar empresas</span>
        </ErrorState>
      </CompanySelectorContainer>
    );
  }

  if (isLoading) {
    return (
      <CompanySelectorContainer className={className}>
        <LoadingState>
          <div className='spinner' />
          <span>Carregando empresas...</span>
        </LoadingState>
      </CompanySelectorContainer>
    );
  }

  if (companies.length === 0) {
    return (
      <CompanySelectorContainer className={className}>
        <EmptyStateWrapper>
          <EmptyStateText>
            <IoBusiness size={16} />
            <span>Nenhuma empresa encontrada</span>
          </EmptyStateText>
          {canCreateCompany && (
            <CreateCompanyButton onClick={handleCreateCompany}>
              <IoAdd size={14} />
              Criar Primeira Empresa
            </CreateCompanyButton>
          )}
        </EmptyStateWrapper>
      </CompanySelectorContainer>
    );
  }

  return (
    <CompanySelectorContainer className={className} ref={dropdownRef}>
      <CompanySelectorButton
        onClick={handleToggleDropdown}
        $isOpen={isOpen}
        title={
          canSelectCompany && companies.length > 1
            ? 'Selecionar empresa'
            : canSelectCompany && canCreateCompany
              ? 'Ver opções de empresa'
              : 'Sua empresa'
        }
        style={{
          cursor:
            (canSelectCompany && companies.length > 1) ||
            (canSelectCompany && canCreateCompany)
              ? 'pointer'
              : 'default',
          opacity:
            (canSelectCompany && companies.length > 1) ||
            (canSelectCompany && canCreateCompany)
              ? 1
              : 0.8,
        }}
      >
        <CompanyInfo>
          <CompanyName>
            {selectedCompany?.name ||
              (isLoading ? 'Carregando...' : 'Empresa não encontrada')}
          </CompanyName>
          {selectedCompany && (
            <CompanyDetails>
              {formatCompanyDetails(selectedCompany)}
            </CompanyDetails>
          )}
          {/* Mostrar informações do plano apenas para admin e master */}
          {(user?.role === 'admin' || user?.role === 'master') &&
            (subscriptionStatus?.plan ? (
              <PlanDetails>
                Plano: {subscriptionStatus.plan.name} • {currentCompanyCount}/
                {maxCompanies} empresas
                {subscriptionValidations && (
                  <>
                    {subscriptionValidations.isExpired && ' • ⚠️ Expirado'}
                    {subscriptionValidations.hasOutstandingPayments &&
                      ' • ⚠️ Pagamento Pendente'}
                    {subscriptionValidations.isNearExpiry &&
                      !subscriptionValidations.isExpired &&
                      ` • ⚠️ Expira em ${subscriptionValidations.daysUntilExpiry} dias`}
                  </>
                )}
                {!hasAccess && accessReason && (
                  <span
                    style={{
                      color: '#ff6b6b',
                      fontSize: '0.75rem',
                      display: 'block',
                      marginTop: '4px',
                    }}
                  >
                    {accessReason}
                  </span>
                )}
              </PlanDetails>
            ) : subscriptionLoading || !selectedCompany?.id ? (
              <PlanDetails style={{ color: '#ffa500' }}>
                Carregando plano... • {currentCompanyCount} empresas
              </PlanDetails>
            ) : (
              <PlanDetails style={{ color: '#ff6b6b' }}>
                Plano não encontrado • {currentCompanyCount} empresas
              </PlanDetails>
            ))}
          {isLoading && !selectedCompany && (
            <CompanyDetails style={{ opacity: 0.7 }}>
              Aguarde enquanto carregamos suas empresas...
            </CompanyDetails>
          )}
        </CompanyInfo>

        <div className='actions'>
          {canSelectCompany && (companies.length > 1 || canCreateCompany) && (
            <div
              className='refresh-button'
              onClick={handleRefresh}
              title='Atualizar lista de empresas'
            >
              <IoRefresh size={16} />
            </div>
          )}
          {canSelectCompany && (companies.length > 1 || canCreateCompany) && (
            <IoChevronDown
              size={16}
              className={`chevron ${isOpen ? 'open' : ''}`}
            />
          )}
        </div>
      </CompanySelectorButton>

      {isOpen &&
        canSelectCompany &&
        (companies.length > 1 || canCreateCompany) &&
        createPortal(
          <div
            ref={dropdownPanelRef}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 10002,
            }}
          >
            <DropdownContainer $inPortal>
              {/* Cabeçalho com informações do plano */}
              {companies.length > 0 && (
                <PlanInfoHeader
                  $planType={
                    subscriptionStatus?.plan?.name
                      ?.toLowerCase()
                      .includes('personalizado')
                      ? 'custom'
                      : subscriptionStatus?.plan?.name
                            ?.toLowerCase()
                            .includes('pro')
                        ? 'pro'
                        : 'basic'
                  }
                >
                  <PlanInfoRow>
                    <IoBusiness size={14} />
                    <strong>
                      {currentCompanyCount} de {maxCompanies} empresas
                    </strong>
                    {percentUsed > 0 && ` • ${percentUsed.toFixed(0)}%`}
                    {isNearLimit && !canCreateMoreCompanies && (
                      <span style={{ marginLeft: '8px', fontSize: '0.9em' }}>
                        ⚠️ Limite Atingido
                      </span>
                    )}
                  </PlanInfoRow>
                  {subscriptionStatus?.plan ? (
                    <>
                      <PlanInfoRow>
                        Plano: {subscriptionStatus.plan.name}
                      </PlanInfoRow>
                      {subscriptionLimits && (
                        <PlanInfoRow
                          style={{ fontSize: '0.75rem', opacity: 0.8 }}
                        >
                          Usuários: {subscriptionLimits.users} • Propriedades:{' '}
                          {subscriptionLimits.properties} • Storage:{' '}
                          {subscriptionLimits.storage}GB
                        </PlanInfoRow>
                      )}
                      {subscriptionValidations && (
                        <>
                          {subscriptionValidations.isExpired && (
                            <PlanInfoRow
                              style={{ color: '#ff6b6b', fontSize: '0.75rem' }}
                            >
                              ⚠️ Assinatura expirada
                            </PlanInfoRow>
                          )}
                          {subscriptionValidations.hasOutstandingPayments && (
                            <PlanInfoRow
                              style={{ color: '#ffa500', fontSize: '0.75rem' }}
                            >
                              ⚠️ Pagamento pendente
                            </PlanInfoRow>
                          )}
                          {subscriptionValidations.isNearExpiry &&
                            !subscriptionValidations.isExpired && (
                              <PlanInfoRow
                                style={{
                                  color: '#ffa500',
                                  fontSize: '0.75rem',
                                }}
                              >
                                ⚠️ Expira em{' '}
                                {subscriptionValidations.daysUntilExpiry} dias
                              </PlanInfoRow>
                            )}
                        </>
                      )}
                      {!hasAccess && accessReason && (
                        <PlanInfoRow
                          style={{ color: '#ff6b6b', fontSize: '0.75rem' }}
                        >
                          {accessReason}
                        </PlanInfoRow>
                      )}
                    </>
                  ) : subscriptionLoading || !selectedCompany?.id ? (
                    <PlanInfoRow>Carregando plano...</PlanInfoRow>
                  ) : (
                    <PlanInfoRow style={{ color: '#ff6b6b' }}>
                      Plano não encontrado
                    </PlanInfoRow>
                  )}
                </PlanInfoHeader>
              )}

              <DropdownList>
                {companies &&
                  Array.isArray(companies) &&
                  companies.map((company: Company) => (
                    <DropdownItem
                      key={company.id}
                      onClick={() => handleSelectCompany(company)}
                      $isSelected={selectedCompany?.id === company.id}
                    >
                      <CompanyItemInfo>
                        <CompanyItemName>{company.name}</CompanyItemName>
                        <CompanyItemDetails>
                          {formatCompanyDetails(company)}
                        </CompanyItemDetails>
                      </CompanyItemInfo>
                      {selectedCompany?.id === company.id && (
                        <div className='selected-indicator'>✓</div>
                      )}
                    </DropdownItem>
                  ))}

                {canCreateCompany && (
                  <>
                    <Separator />
                    <div style={{ padding: '0 20px 12px 20px' }}>
                      <CreateCompanyButton
                        onClick={handleCreateCompany}
                        disabled={!canCreate}
                        title={
                          !hasAccess && accessReason
                            ? accessReason
                            : !canCreateMoreCompanies
                              ? `Limite de empresas atingido (${maxCompanies}/${maxCompanies})`
                              : `Criar nova empresa (${remainingCompanies} restantes)`
                        }
                      >
                        <IoAdd size={18} />
                        {!hasAccess && accessReason
                          ? 'Sem Acesso'
                          : canCreateMoreCompanies
                            ? `Criar Nova Empresa (${remainingCompanies} ${remainingCompanies === 1 ? 'restante' : 'restantes'})`
                            : 'Limite de Empresas Atingido'}
                      </CreateCompanyButton>
                    </div>
                  </>
                )}
              </DropdownList>
            </DropdownContainer>
          </div>,
          document.body
        )}
    </CompanySelectorContainer>
  );
};
