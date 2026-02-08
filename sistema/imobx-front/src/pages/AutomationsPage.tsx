import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdAdd,
  MdSettings,
  MdHistory,
  MdBarChart,
  MdToggleOn,
  MdToggleOff,
  MdMoreVert,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { automationApi } from '../services/automationApi';
import { useAuth } from '../hooks/useAuth';
import { useModuleAccess } from '../hooks/useModuleAccess';
import { useCompany } from '../hooks/useCompany';
import { toast } from 'react-toastify';
import AutomationsShimmer from '../components/shimmer/AutomationsShimmer';
import type { Automation, AutomationTemplate } from '../types/automation';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  CreateButton,
  MenuButton,
  MenuList,
  MenuItem,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  CategoryBadge,
  AutomationStatus,
  ErrorContainer,
  ErrorTitle,
  ErrorMessage,
  ErrorButton,
} from '../styles/pages/AutomationsPageStyles';

const AutomationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const { isModuleAvailableForCompany } = useModuleAccess();
  const { selectedCompany } = useCompany();

  const [automations, setAutomations] = useState<Automation[]>([]);
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Guardar o último companyId para evitar chamadas repetidas
  const lastCompanyIdRef = useRef<string | null>(null);

  // Função para carregar dados (memoizada por companyId)
  const loadData = useCallback(async (companyId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(
        '🔄 [AutomationsPage] Carregando dados para empresa:',
        companyId
      );

      const [templatesResponse, automationsResponse] = await Promise.all([
        automationApi.getTemplates(),
        automationApi.getAutomations({ companyId }),
      ]);

      const templatesData = Array.isArray(templatesResponse)
        ? templatesResponse
        : (templatesResponse?.templates ?? templatesResponse?.data ?? []);

      const automationsData = Array.isArray(automationsResponse)
        ? automationsResponse
        : (automationsResponse?.automations ?? automationsResponse?.data ?? []);

      console.log('✅ [AutomationsPage] Dados carregados:', {
        templates: templatesData.length,
        automations: automationsData.length,
      });

      setTemplates(templatesData);
      setAutomations(automationsData);
    } catch (err: any) {
      console.error('❌ [AutomationsPage] Erro ao carregar dados:', err);
      console.error('❌ [AutomationsPage] Detalhes:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      if (
        err.message?.includes('403') ||
        err.message?.includes('plano') ||
        err.response?.status === 403
      ) {
        setError(
          'Seu plano não inclui acesso ao módulo de Automações. Faça upgrade para o Plano Pro.'
        );
        setHasAccess(false);
      } else {
        setError(
          err.message || 'Erro ao carregar automações. Tente novamente.'
        );
      }
      if (err.message === 'Empresa não encontrada') {
        toast.error('Selecione uma empresa para carregar as automações.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar acesso ao módulo e carregar dados
  useEffect(() => {
    let isMounted = true;

    const checkAccessAndLoad = async () => {
      try {
        if (!isMounted) return;

        console.log('🔄 [AutomationsPage] Verificando acesso ao módulo...');
        const hasAutomationsModule = isModuleAvailableForCompany('automations');
        console.log(
          '📊 [AutomationsPage] Módulo disponível:',
          hasAutomationsModule
        );

        setHasAccess(hasAutomationsModule);

        if (!hasAutomationsModule) {
          setError(
            'Seu plano não inclui acesso ao módulo de Automações. Faça upgrade para o Plano Pro.'
          );
          setIsLoading(false);
          return;
        }

        const currentUser = getCurrentUser();
        const storedCompanyId = localStorage.getItem(
          'dream_keys_selected_company_id'
        );
        const companyId =
          selectedCompany?.id ||
          currentUser?.companyId ||
          storedCompanyId ||
          null;

        if (!companyId) {
          setError('Selecione uma empresa para carregar as automações.');
          setIsLoading(false);
          return;
        }

        // Evitar chamadas repetidas para o mesmo companyId
        if (lastCompanyIdRef.current === companyId && automations.length > 0) {
          setIsLoading(false);
          return;
        }

        lastCompanyIdRef.current = companyId;

        await loadData(companyId);
      } catch (err: any) {
        console.error('❌ [AutomationsPage] Erro ao verificar acesso:', err);
        if (
          err.message?.includes('403') ||
          err.message?.includes('plano') ||
          err.response?.status === 403
        ) {
          setError(
            'Seu plano não inclui acesso ao módulo de Automações. Faça upgrade para o Plano Pro.'
          );
          setHasAccess(false);
        } else {
          setError(
            err.message || 'Erro ao carregar automações. Tente novamente.'
          );
        }
        setIsLoading(false);
      }
    };

    checkAccessAndLoad();

    return () => {
      isMounted = false;
    };
    // Dependemos apenas da empresa selecionada; isModuleAvailableForCompany é estável o suficiente para uso interno
  }, [selectedCompany?.id, loadData]);

  const handleToggleAutomation = async (automation: Automation) => {
    try {
      const newStatus = !automation.isActive;
      await automationApi.toggleAutomation(automation.id, newStatus);

      // Atualizar estado local
      setAutomations(prev =>
        prev.map(a =>
          a.id === automation.id ? { ...a, isActive: newStatus } : a
        )
      );

      toast.success(
        `Automação ${newStatus ? 'ativada' : 'desativada'} com sucesso!`
      );
    } catch (err: any) {
      console.error('Erro ao alternar automação:', err);
      toast.error(err.message || 'Erro ao alternar automação');
    }
  };

  const handleCreateAutomation = () => {
    navigate('/automations/create');
  };

  const handleViewDetails = (automationId: string) => {
    navigate(`/automations/${automationId}`);
  };

  const handleViewHistory = (automationId: string) => {
    navigate(`/automations/${automationId}/history`);
  };

  const toggleMenu = (automationId: string) => {
    setOpenMenuId(prev => (prev === automationId ? null : automationId));
  };

  const closeMenu = () => setOpenMenuId(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;

    return date.toLocaleDateString('pt-BR');
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'financial':
        return 'Financeiro';
      case 'crm':
        return 'Funil de Vendas';
      case 'rental':
        return 'Locação';
      case 'process':
        return 'Processo';
      case 'marketing':
        return 'Marketing';
      default:
        return category;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PageContainer>
          <AutomationsShimmer />
        </PageContainer>
      </Layout>
    );
  }

  if (error && !hasAccess) {
    return (
      <Layout>
        <PageContainer>
          <ErrorContainer>
            <ErrorTitle>Módulo não disponível</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <ErrorButton onClick={() => navigate('/subscription')}>
              Ver Planos
            </ErrorButton>
          </ErrorContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <ErrorButton onClick={loadData}>Tentar Novamente</ErrorButton>
          </ErrorContainer>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Automações</PageTitle>
              <PageSubtitle>
                Gerencie todas as notificações automáticas do sistema
              </PageSubtitle>
            </PageTitleContainer>
            <HeaderActions>
              <CreateButton onClick={handleCreateAutomation}>
                <MdAdd size={20} />
                Nova Automação
              </CreateButton>
            </HeaderActions>
          </PageHeader>

          {automations.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>🤖</EmptyStateIcon>
              <EmptyStateTitle>Nenhuma automação configurada</EmptyStateTitle>
              <EmptyStateDescription>
                Comece criando sua primeira automação a partir de um template
                disponível. As automações ajudam a manter seus processos
                organizados e seus clientes informados.
              </EmptyStateDescription>
              <CreateButton onClick={handleCreateAutomation}>
                <MdAdd size={20} />
                Criar Primeira Automação
              </CreateButton>
            </EmptyState>
          ) : (
            <TableContainer>
              <ListTable>
                <thead>
                  <tr>
                    <ListTh>Título</ListTh>
                    <ListTh>Categoria</ListTh>
                    <ListTh>Status</ListTh>
                    <ListTh>Execuções</ListTh>
                    <ListTh>Última Execução</ListTh>
                    <ListTh $align='right'>Ações</ListTh>
                  </tr>
                </thead>
                <tbody>
                  {automations.map(automation => (
                    <tr key={automation.id}>
                      <ListTd>
                        <TitleCell>{automation.name}</TitleCell>
                        <DescriptionCell>
                          {automation.description}
                        </DescriptionCell>
                      </ListTd>
                      <ListTd>
                        <CategoryBadge $category={automation.category}>
                          {getCategoryLabel(automation.category)}
                        </CategoryBadge>
                      </ListTd>
                      <ListTd>
                        <AutomationStatus $isActive={automation.isActive}>
                          {automation.isActive ? 'Ativo' : 'Inativo'}
                        </AutomationStatus>
                      </ListTd>
                      <ListTd>
                        <StatText>
                          <MdBarChart size={16} />
                          {automation.executionCount} execuções
                        </StatText>
                        <StatText>
                          <span style={{ color: '#22c55e' }}>✓</span>
                          {automation.successfulExecutions} sucessos
                        </StatText>
                        {automation.failedExecutions > 0 && (
                          <StatText>
                            <span style={{ color: '#ef4444' }}>✗</span>
                            {automation.failedExecutions} erros
                          </StatText>
                        )}
                      </ListTd>
                      <ListTd>{formatDate(automation.lastExecutionAt)}</ListTd>
                      <ListTd $align='right'>
                        <ActionsWrapper>
                          <MenuButton
                            onClick={() => toggleMenu(automation.id)}
                            aria-label='Mais ações'
                          >
                            <MdMoreVert size={20} />
                          </MenuButton>
                          {openMenuId === automation.id && (
                            <MenuList>
                              <MenuItem
                                onClick={() => {
                                  handleToggleAutomation(automation);
                                  closeMenu();
                                }}
                              >
                                {automation.isActive ? (
                                  <MdToggleOff size={18} />
                                ) : (
                                  <MdToggleOn size={18} />
                                )}
                                {automation.isActive ? 'Desativar' : 'Ativar'}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleViewDetails(automation.id);
                                  closeMenu();
                                }}
                              >
                                <MdSettings size={18} />
                                Configurar
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleViewHistory(automation.id);
                                  closeMenu();
                                }}
                              >
                                <MdHistory size={18} />
                                Histórico
                              </MenuItem>
                            </MenuList>
                          )}
                        </ActionsWrapper>
                      </ListTd>
                    </tr>
                  ))}
                </tbody>
              </ListTable>
            </TableContainer>
          )}
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

// Lista de automações seguindo padrão das demais listas
const TableContainer = styled.div`
  width: 100%;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  overflow: visible;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
`;

const ListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`;

const ListTh = styled.th<{ $align?: 'left' | 'right' }>`
  text-align: ${props => props.$align || 'left'};
  padding: 12px 14px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.backgroundSecondary};
  font-weight: 700;
`;

const ListTd = styled.td<{ $align?: 'left' | 'right' }>`
  padding: 12px 14px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  vertical-align: top;
  text-align: ${props => props.$align || 'left'};
  color: ${props => props.theme.colors.textSecondary};
`;

const TitleCell = styled.div`
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const DescriptionCell = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ActionsWrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;
`;

const StatText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

export default AutomationsPage;
