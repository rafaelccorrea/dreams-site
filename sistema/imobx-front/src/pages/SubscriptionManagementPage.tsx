import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCanAccessUsageData } from '../hooks/useCanAccessUsageData';
import { useAuth } from '../hooks/useAuth';
import { useIsOwner } from '../hooks/useOwner';
import { useCompanyContext } from '../contexts';
import { subscriptionService } from '../services/subscriptionService';
import {
  translateSubscriptionStatus,
  getUsageColorClass,
} from '../utils/subscriptionTranslations';
import type { SubscriptionAccessInfo } from '../types/subscription';
import SubscriptionManagementShimmer from '../components/shimmer/SubscriptionManagementShimmer';
import { Layout } from '../components/layout/Layout';
import { FilterDrawer } from '../components/common/FilterDrawer';
import { toast } from 'react-toastify';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
} from '../styles/pages/PropertiesPageStyles';
import * as S from '../styles/pages/SubscriptionManagementPageStyles';
import {
  MdArrowBack,
  MdFilterList,
  MdClear,
  MdBusiness,
  MdPerson,
  MdAttachMoney,
  MdStorage,
  MdGroup,
  MdHome,
  MdApi,
} from 'react-icons/md';

const SubscriptionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canAccessUsageData = useCanAccessUsageData();
  const { getCurrentUser } = useAuth();
  const isOwner = useIsOwner();
  const { selectedCompany } = useCompanyContext();

  // ✅ Função de tradução de módulos
  const translateModule = (moduleCode: string): string => {
    const translations: Record<string, string> = {
      // snake_case format (como vem da API)
      user_management: 'Gestão de Usuários',
      company_management: 'Gestão de Empresas',
      basic_reports: 'Relatórios Básicos',
      image_gallery: 'Galeria de Imagens',
      team_management: 'Gestão de Equipes',
      advanced_reports: 'Relatórios Avançados',
      property_management: 'Gestão de Propriedades',
      client_management: 'Gestão de Clientes',
      kanban_management: 'Gestão Kanban',
      financial_management: 'Gestão Financeira',
      marketing_tools: 'Ferramentas de Marketing',
      api_integrations: 'Integrações API',
      custom_fields: 'Campos Personalizados',
      workflow_automation: 'Automação de Workflow',
      business_intelligence: 'Business Intelligence',
      third_party_integrations: 'Integrações Terceiros',
      white_label: 'White Label',
      priority_support: 'Suporte Prioritário',
      calendar_management: 'Gestão de Calendário',
      vistoria: 'Vistoria',
      key_control: 'Controle de Chaves',
      rental_management: 'Gestão de Locações',
      commission_management: 'Gestão de Comissões',

      // Title Case format (fallback)
      'User Management': 'Gestão de Usuários',
      'Company Management': 'Gestão de Empresas',
      'Basic Reports': 'Relatórios Básicos',
      'Image Gallery': 'Galeria de Imagens',
      'Team Management': 'Gestão de Equipes',
      'Advanced Reports': 'Relatórios Avançados',
      'Property Management': 'Gestão de Propriedades',
      'Client Management': 'Gestão de Clientes',
      'Kanban Management': 'Gestão Kanban',
      'Financial Management': 'Gestão Financeira',
      'Marketing Tools': 'Ferramentas de Marketing',
      'Api Integrations': 'Integrações API',
      'Custom Fields': 'Campos Personalizados',
      'Workflow Automation': 'Automação de Workflow',
      'Business Intelligence': 'Business Intelligence',
      'Third Party Integrations': 'Integrações Terceiros',
      'White Label': 'White Label',
      'Priority Support': 'Suporte Prioritário',
      'Calendar Management': 'Gestão de Calendário',
      Vistoria: 'Vistoria',
      'Key Control': 'Controle de Chaves',
      'Rental Management': 'Gestão de Locações',
      'Commission Management': 'Gestão de Comissões',
    };

    return (
      translations[moduleCode] ||
      moduleCode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
  };

  // ✅ Verificar se veio de uma assinatura suspensa
  const suspendedInfo = location.state?.accessInfo as SubscriptionAccessInfo;
  const reason = location.state?.reason;

  const user = getCurrentUser();
  const isMaster = user?.role === 'master';

  // Estados para visão USER
  const [myUsage, setMyUsage] = useState<any>(null);
  const [companiesUsage, setCompaniesUsage] = useState<any>(null);

  // Estados para visão MASTER
  const [allSubscriptions, setAllSubscriptions] = useState<any>(null);
  const [filters, setFilters] = useState({
    companyName: '',
    companyCnpj: '',
    userName: '',
    userEmail: '',
    status: '',
    planType: '',
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Estados gerais
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const MS_IN_DAY = 1000 * 60 * 60 * 24;

  const formatDateLong = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateDaysLeft = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const days = Math.max(
      0,
      Math.ceil((date.getTime() - Date.now()) / MS_IN_DAY)
    );
    // Validar se os dias são razoáveis (não mais que 365 dias)
    if (days > 365) return null;
    return days;
  };

  const currentSubscription = myUsage?.currentSubscription;

  const trialEndsAt =
    currentSubscription?.trialEndsAt ??
    myUsage?.trialEndsAt ??
    (myUsage?.isTrialActive ? myUsage.trialEndsAt : null) ??
    null;
  const trialDaysLeft = useMemo(() => {
    if (typeof myUsage?.trialDaysRemaining === 'number') {
      const days = Math.max(0, myUsage.trialDaysRemaining);
      // Validar se os dias são razoáveis (não mais que 365 dias)
      if (days > 365) return null;
      return days;
    }
    return calculateDaysLeft(trialEndsAt);
  }, [myUsage?.trialDaysRemaining, trialEndsAt]);

  const trialEndsDisplay = useMemo(() => {
    if (!trialEndsAt) return null;
    const date = new Date(trialEndsAt);
    if (Number.isNaN(date.getTime())) return null;
    // Validar se a data não é muito no futuro (não mais que 1 ano)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    if (date > maxDate) return null;
    return formatDateLong(trialEndsAt);
  }, [trialEndsAt]);

  // Carregar dados do usuário
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId =
        selectedCompany?.id ||
        localStorage.getItem('dream_keys_selected_company_id');
      const user = getCurrentUser();
      const userIsOwner = isOwner || user?.owner === true;

      // CORREÇÃO: Se o usuário é owner, chamar API mesmo sem empresa
      const shouldLoadData = userIsOwner || (canAccessUsageData && companyId);

      if (shouldLoadData) {
        console.log(
          '🔄 SubscriptionManagementPage: Carregando dados da assinatura...',
          {
            hasCompany: !!companyId,
            isOwner: userIsOwner,
            canAccessUsageData,
          }
        );
        const usage = await subscriptionService.getMySubscriptionUsage();
        console.log('✅ Dados de uso carregados:', usage);
        setMyUsage(usage);
      } else if (!companyId && !userIsOwner) {
        console.log(
          'ℹ️ Usuário sem empresa associada e não é owner, pulando carregamento de uso'
        );
        setMyUsage(null);
      } else {
        console.log(
          'ℹ️ Usuário sem permissão para acessar dados de uso da assinatura'
        );
        setMyUsage(null);
      }
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar informações da assinatura');
      toast.error('Erro ao carregar informações da assinatura');
    } finally {
      setLoading(false);
    }
  }, [canAccessUsageData, isOwner, getCurrentUser, selectedCompany]);

  // Carregar dados do MASTER (funcionalidade não implementada no backend)
  const loadMasterData = useCallback(
    async (currentFilters = filters) => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Implementar endpoint /subscriptions/admin/all no backend
        console.log(
          '⚠️ Funcionalidade de listagem de assinaturas ainda não implementada no backend'
        );

        // Por enquanto, carregar os dados do próprio master
        const companyId =
          selectedCompany?.id ||
          localStorage.getItem('dream_keys_selected_company_id');
        const user = getCurrentUser();
        const userIsOwner = isOwner || user?.owner === true;

        console.log('🔍 [loadMasterData] Verificando condições:', {
          companyId,
          isOwner,
          userOwner: user?.owner,
          userIsOwner,
          userRole: user?.role,
          shouldCall: userIsOwner || companyId,
        });

        // CORREÇÃO: Se o usuário é owner, chamar API mesmo sem empresa
        if (userIsOwner || companyId) {
          console.log(
            '🔄 SubscriptionManagementPage (Master): Carregando dados da assinatura...',
            {
              hasCompany: !!companyId,
              isOwner: userIsOwner,
            }
          );
          const usage = await subscriptionService.getMySubscriptionUsage();
          console.log('✅ Dados do master carregados:', usage);
          setMyUsage(usage);
        } else {
          console.log('❌ [loadMasterData] NÃO chamando API:', {
            companyId,
            isOwner,
            userOwner: user?.owner,
            userIsOwner,
          });
          setMyUsage(null);
        }
      } catch (err: any) {
        console.error('❌ Erro ao carregar assinaturas:', err);
        setError('Erro ao carregar assinaturas do sistema');
        toast.error('Erro ao carregar assinaturas');
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [page, limit, isOwner, getCurrentUser, selectedCompany]
  );

  // Carregar dados inicial (apenas uma vez e quando page mudar)
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin' && user.role !== 'master') {
      navigate('/dashboard');
      return;
    }

    if (isMaster) {
      loadMasterData(filters);
    } else {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Recarregar ao mudar empresa (usuários)
  useEffect(() => {
    if (!isMaster && selectedCompany?.id) {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  // ✅ Mostrar toast se veio de assinatura suspensa
  useEffect(() => {
    if (reason === 'suspended' && suspendedInfo) {
      toast.warning(
        `⚠️ Assinatura Suspensa: ${suspendedInfo.reason || 'Sua assinatura foi temporariamente suspensa'}`,
        { autoClose: 8000 }
      );
    }
  }, [reason, suspendedInfo]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v && v.length > 0);
  }, [filters]);

  const clearFilters = () => {
    const emptyFilters = {
      companyName: '',
      companyCnpj: '',
      userName: '',
      userEmail: '',
      status: '',
      planType: '',
    };
    setFilters(emptyFilters);
    setPage(1);
    if (isMaster) {
      loadMasterData(emptyFilters);
    }
  };

  const applyFilters = () => {
    setPage(1);
    loadMasterData(filters);
    setFiltersOpen(false);
  };

  const footer = (
    <>
      {hasActiveFilters && (
        <S.ClearButton onClick={clearFilters}>
          <MdClear size={16} />
          Limpar Filtros
        </S.ClearButton>
      )}
      <S.ApplyButton onClick={applyFilters}>
        <MdFilterList size={16} />
        Aplicar Filtros
      </S.ApplyButton>
    </>
  );

  if (loading) {
    return (
      <Layout>
        <SubscriptionManagementShimmer />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <S.EmptyState>
              <h2>Erro</h2>
              <p>{error}</p>
            </S.EmptyState>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  // Visão USER/ADMIN (própria assinatura)
  if (!isMaster && myUsage) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Minha Assinatura</PageTitle>
                <PageSubtitle>Acompanhe seu uso e limites</PageSubtitle>
              </PageTitleContainer>
              <div style={{ display: 'flex', gap: 12 }}>
                <S.FilterButton onClick={() => navigate('/my-subscription')}>
                  <MdAttachMoney size={20} />
                  Gerenciar Plano
                </S.FilterButton>
                <S.BackButton onClick={() => navigate('/dashboard')}>
                  <MdArrowBack size={20} />
                  Voltar
                </S.BackButton>
              </div>
            </PageHeader>

            {myUsage?.isTrialActive &&
              trialEndsAt &&
              trialDaysLeft !== null &&
              trialDaysLeft <= 365 && (
                <S.TrialBanner>
                  <S.TrialBannerText>
                    <S.TrialBannerEmphasis>
                      Período de teste ativo.
                    </S.TrialBannerEmphasis>{' '}
                    Restam {trialDaysLeft}{' '}
                    {trialDaysLeft === 1 ? 'dia' : 'dias'}
                    {trialEndsDisplay ? ` (até ${trialEndsDisplay})` : ''}.
                    Cancele antes do fim do teste para evitar a cobrança
                    automática.
                  </S.TrialBannerText>
                </S.TrialBanner>
              )}

            {/* Alertas */}
            {myUsage.alerts && myUsage.alerts.length > 0 && (
              <S.AlertsSection>
                {myUsage.alerts.map((alert: string, idx: number) => (
                  <S.Alert key={idx} $type='warning'>
                    ⚠️ {alert}
                  </S.Alert>
                ))}
              </S.AlertsSection>
            )}

            {/* Stats principais */}
            <S.StatsGrid>
              <S.StatCard>
                <S.StatLabel>Plano</S.StatLabel>
                <S.StatValue style={{ fontSize: '1.2rem' }}>
                  {myUsage.planName || '-'}
                </S.StatValue>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  R$ {myUsage.monthlyPrice || '0.00'}/mês
                </span>
              </S.StatCard>
              <S.StatCard>
                <S.StatLabel>Status</S.StatLabel>
                <S.StatusBadge $status={myUsage.status || 'inactive'}>
                  {translateSubscriptionStatus(myUsage.status || 'inactive')}
                </S.StatusBadge>
              </S.StatCard>
              <S.StatCard>
                <S.StatLabel>Dias Restantes</S.StatLabel>
                <S.StatValue>{myUsage.daysRemaining || '-'}</S.StatValue>
              </S.StatCard>
            </S.StatsGrid>

            {/* Uso de recursos */}
            <S.UsageSection>
              {myUsage.companies && (
                <S.UsageCard>
                  <S.UsageHeader>
                    <S.UsageLabel>
                      <MdBusiness
                        style={{ display: 'inline', marginRight: 8 }}
                      />
                      Empresas
                    </S.UsageLabel>
                    <S.UsageValues>
                      {myUsage.companies.used} / {myUsage.companies.limit}
                    </S.UsageValues>
                  </S.UsageHeader>
                  <S.ProgressBar>
                    <S.ProgressFill
                      $percentage={myUsage.companies.percentage}
                      $status={getUsageColorClass(myUsage.companies.percentage)}
                    />
                  </S.ProgressBar>
                  {myUsage.companies.isOverLimit && (
                    <S.UsageWarning>⚠️ Limite excedido</S.UsageWarning>
                  )}
                </S.UsageCard>
              )}

              {myUsage.users && (
                <S.UsageCard>
                  <S.UsageHeader>
                    <S.UsageLabel>
                      <MdGroup style={{ display: 'inline', marginRight: 8 }} />
                      Usuários
                    </S.UsageLabel>
                    <S.UsageValues>
                      {myUsage.users.used} / {myUsage.users.limit}
                    </S.UsageValues>
                  </S.UsageHeader>
                  <S.ProgressBar>
                    <S.ProgressFill
                      $percentage={myUsage.users.percentage}
                      $status={getUsageColorClass(myUsage.users.percentage)}
                    />
                  </S.ProgressBar>
                  {myUsage.users.isOverLimit && (
                    <S.UsageWarning>⚠️ Limite excedido</S.UsageWarning>
                  )}
                </S.UsageCard>
              )}

              {myUsage.properties && (
                <S.UsageCard>
                  <S.UsageHeader>
                    <S.UsageLabel>
                      <MdHome style={{ display: 'inline', marginRight: 8 }} />
                      Propriedades
                    </S.UsageLabel>
                    <S.UsageValues>
                      {myUsage.properties.used} / {myUsage.properties.limit}
                    </S.UsageValues>
                  </S.UsageHeader>
                  <S.ProgressBar>
                    <S.ProgressFill
                      $percentage={myUsage.properties.percentage}
                      $status={getUsageColorClass(
                        myUsage.properties.percentage
                      )}
                    />
                  </S.ProgressBar>
                  {myUsage.properties.isOverLimit && (
                    <S.UsageWarning>⚠️ Limite excedido</S.UsageWarning>
                  )}
                </S.UsageCard>
              )}

              {myUsage.storage && (
                <S.UsageCard>
                  <S.UsageHeader>
                    <S.UsageLabel>
                      <MdStorage
                        style={{ display: 'inline', marginRight: 8 }}
                      />
                      Armazenamento
                    </S.UsageLabel>
                    <S.UsageValues>
                      {myUsage.storage.used} GB / {myUsage.storage.limit} GB
                    </S.UsageValues>
                  </S.UsageHeader>
                  <S.ProgressBar>
                    <S.ProgressFill
                      $percentage={myUsage.storage.percentage}
                      $status={getUsageColorClass(myUsage.storage.percentage)}
                    />
                  </S.ProgressBar>
                  {myUsage.storage.isOverLimit && (
                    <S.UsageWarning>⚠️ Limite excedido</S.UsageWarning>
                  )}
                </S.UsageCard>
              )}

              {myUsage.apiCalls && (
                <S.UsageCard>
                  <S.UsageHeader>
                    <S.UsageLabel>
                      <MdApi style={{ display: 'inline', marginRight: 8 }} />
                      Chamadas API (este mês)
                    </S.UsageLabel>
                    <S.UsageValues>
                      {myUsage.apiCalls.usedThisMonth} /{' '}
                      {myUsage.apiCalls.limit}
                    </S.UsageValues>
                  </S.UsageHeader>
                  <S.ProgressBar>
                    <S.ProgressFill
                      $percentage={myUsage.apiCalls.percentage}
                      $status={getUsageColorClass(myUsage.apiCalls.percentage)}
                    />
                  </S.ProgressBar>
                  {myUsage.apiCalls.isOverLimit && (
                    <S.UsageWarning>⚠️ Limite excedido</S.UsageWarning>
                  )}
                </S.UsageCard>
              )}
            </S.UsageSection>

            {/* Módulos Ativos */}
            {myUsage.activeModules && myUsage.activeModules.length > 0 && (
              <S.ModulesSection>
                <S.SectionTitle>
                  Módulos Ativos ({myUsage.activeModules.length})
                </S.SectionTitle>
                <S.ModulesGrid>
                  {myUsage.activeModules.map((module: string) => (
                    <S.ModuleChip key={module}>
                      {translateModule(module)}
                    </S.ModuleChip>
                  ))}
                </S.ModulesGrid>
              </S.ModulesSection>
            )}

            {/* Lista de empresas */}
            {companiesUsage &&
              companiesUsage.companies &&
              companiesUsage.companies.length > 0 && (
                <div>
                  <h3
                    style={{
                      marginBottom: 16,
                      color: 'var(--color-text)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      Minhas Empresas ({companiesUsage.companies.length})
                    </span>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 'normal',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {companiesUsage.totalUsersAcrossCompanies} usuários ·{' '}
                      {companiesUsage.totalPropertiesAcrossCompanies}{' '}
                      propriedades · {companiesUsage.totalStorageUsedGB} GB
                    </span>
                  </h3>
                  <S.TableContainer>
                    <S.Table>
                      <S.Thead>
                        <tr>
                          <S.Th>Empresa</S.Th>
                          <S.Th>Usuários</S.Th>
                          <S.Th>Propriedades</S.Th>
                          <S.Th>Imagens</S.Th>
                          <S.Th>Armazenamento</S.Th>
                          <S.Th>Criada em</S.Th>
                        </tr>
                      </S.Thead>
                      <S.Tbody>
                        {companiesUsage.companies.map((company: any) => (
                          <S.Tr key={company.companyId || company.id}>
                            <S.Td style={{ fontWeight: 600 }}>
                              {company.companyName ||
                                company.name ||
                                'Empresa sem nome'}
                              {company.isMatrix && (
                                <span
                                  style={{
                                    marginLeft: 8,
                                    fontSize: '0.75rem',
                                    color: 'var(--color-primary)',
                                  }}
                                >
                                  ⭐ Matriz
                                </span>
                              )}
                            </S.Td>
                            <S.Td>
                              {company.totalUsers || company.usersCount || 0}
                            </S.Td>
                            <S.Td>
                              {company.totalProperties ||
                                company.propertiesCount ||
                                0}
                            </S.Td>
                            <S.Td>{company.totalImages || 0}</S.Td>
                            <S.Td>{company.storageUsedGB || 0} GB</S.Td>
                            <S.Td
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {company.createdAt
                                ? new Date(
                                    company.createdAt
                                  ).toLocaleDateString('pt-BR')
                                : '-'}
                            </S.Td>
                          </S.Tr>
                        ))}
                      </S.Tbody>
                    </S.Table>
                  </S.TableContainer>
                </div>
              )}
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  // Visão MASTER (todas as assinaturas)
  if (isMaster && allSubscriptions) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Gerenciar Assinaturas</PageTitle>
                <PageSubtitle>Todas as assinaturas do sistema</PageSubtitle>
              </PageTitleContainer>
              <div style={{ display: 'flex', gap: 12 }}>
                <S.FilterButton onClick={() => setFiltersOpen(true)}>
                  <MdFilterList size={20} />
                  Filtros
                  {hasActiveFilters && (
                    <S.FilterBadge>
                      {Object.values(filters).filter(Boolean).length}
                    </S.FilterBadge>
                  )}
                </S.FilterButton>
                <S.BackButton onClick={() => navigate('/dashboard')}>
                  <MdArrowBack size={20} />
                  Voltar
                </S.BackButton>
              </div>
            </PageHeader>

            {myUsage?.isTrialActive &&
              trialEndsAt &&
              trialDaysLeft !== null &&
              trialDaysLeft <= 365 && (
                <S.TrialBanner>
                  <S.TrialBannerText>
                    <S.TrialBannerEmphasis>
                      Período de teste ativo.
                    </S.TrialBannerEmphasis>{' '}
                    Restam {trialDaysLeft}{' '}
                    {trialDaysLeft === 1 ? 'dia' : 'dias'}
                    {trialEndsDisplay ? ` (até ${trialEndsDisplay})` : ''}. Caso
                    precise encerrar antes da cobrança, realize o cancelamento
                    manual.
                  </S.TrialBannerText>
                </S.TrialBanner>
              )}

            {/* Resumo */}
            {allSubscriptions.summary && (
              <S.StatsGrid>
                <S.StatCard>
                  <S.StatLabel>Total de Assinaturas</S.StatLabel>
                  <S.StatValue>
                    {allSubscriptions.summary.totalSubscriptions}
                  </S.StatValue>
                </S.StatCard>
                <S.StatCard>
                  <S.StatLabel>Ativas</S.StatLabel>
                  <S.StatValue style={{ color: 'var(--color-success)' }}>
                    {allSubscriptions.summary.activeSubscriptions}
                  </S.StatValue>
                </S.StatCard>
                <S.StatCard>
                  <S.StatLabel>Receita Total</S.StatLabel>
                  <S.StatValue style={{ fontSize: '1.5rem' }}>
                    R${' '}
                    {Number(
                      allSubscriptions.summary.totalRevenue
                    ).toLocaleString('pt-BR')}
                  </S.StatValue>
                </S.StatCard>
                <S.StatCard>
                  <S.StatLabel>Empresas</S.StatLabel>
                  <S.StatValue>
                    {allSubscriptions.summary.totalCompanies}
                  </S.StatValue>
                </S.StatCard>
              </S.StatsGrid>
            )}

            {/* Tabela de assinaturas */}
            <S.TableContainer>
              <S.Table>
                <S.Thead>
                  <tr>
                    <S.Th>Usuário</S.Th>
                    <S.Th>Empresas</S.Th>
                    <S.Th>Plano</S.Th>
                    <S.Th>Status</S.Th>
                    <S.Th>Uso</S.Th>
                    <S.Th>Dias Restantes</S.Th>
                  </tr>
                </S.Thead>
                <S.Tbody>
                  {allSubscriptions.subscriptions &&
                    allSubscriptions.subscriptions.map((sub: any) => (
                      <S.Tr
                        key={sub.subscriptionId}
                        onClick={() =>
                          navigate(
                            `/subscription-management/${sub.subscriptionId}`,
                            { state: { subscription: sub } }
                          )
                        }
                        title='Clique para gerenciar'
                      >
                        <S.Td>
                          <S.UserInfo>
                            <S.UserName>{sub.user.name}</S.UserName>
                            <S.UserEmail>{sub.user.email}</S.UserEmail>
                          </S.UserInfo>
                        </S.Td>
                        <S.Td>
                          <div style={{ fontWeight: 600 }}>
                            {sub.companies?.list?.[0]?.name || '-'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {sub.companies?.list?.length > 1 &&
                              `+${sub.companies.list.length - 1} ${sub.companies.list.length - 1 === 1 ? 'empresa' : 'empresas'}`}
                            {sub.companies?.list?.length === 1 && '1 empresa'}
                          </div>
                        </S.Td>
                        <S.Td>
                          <div style={{ fontWeight: 600 }}>{sub.plan.name}</div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            R$ {Number(sub.plan.price).toFixed(2)}
                          </div>
                        </S.Td>
                        <S.Td>
                          <S.StatusBadge $status={sub.status}>
                            {translateSubscriptionStatus(sub.status)}
                          </S.StatusBadge>
                        </S.Td>
                        <S.Td>
                          <div style={{ fontSize: '0.75rem' }}>
                            <div>
                              👥 {sub.users?.percentage || 0}% (
                              {sub.users?.used || 0}/{sub.users?.limit || 0})
                            </div>
                            <div>
                              🏠 {sub.properties?.percentage || 0}% (
                              {sub.properties?.used || 0}/
                              {sub.properties?.limit || 0})
                            </div>
                            <div>
                              💾 {sub.storage?.percentage || 0}% (
                              {sub.storage?.used || 0}/{sub.storage?.limit || 0}{' '}
                              GB)
                            </div>
                          </div>
                        </S.Td>
                        <S.Td>{sub.daysRemaining || '-'} dias</S.Td>
                      </S.Tr>
                    ))}
                </S.Tbody>
              </S.Table>
            </S.TableContainer>

            {/* Paginação */}
            {allSubscriptions.pagination && (
              <S.PaginationContainer>
                <S.PaginationButton
                  disabled={!allSubscriptions.pagination.hasPreviousPage}
                  onClick={() => setPage(p => p - 1)}
                >
                  Anterior
                </S.PaginationButton>
                <S.PaginationInfo>
                  Página {allSubscriptions.pagination.currentPage} de{' '}
                  {allSubscriptions.pagination.totalPages}
                </S.PaginationInfo>
                <S.PaginationButton
                  disabled={!allSubscriptions.pagination.hasNextPage}
                  onClick={() => setPage(p => p + 1)}
                >
                  Próxima
                </S.PaginationButton>
              </S.PaginationContainer>
            )}

            {/* Drawer de filtros */}
            <FilterDrawer
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              title='Filtros de Assinaturas'
              footer={footer}
            >
              <S.FiltersContainer>
                <S.FilterSection>
                  <S.FilterLabel>Nome da Empresa</S.FilterLabel>
                  <S.FilterInput
                    placeholder='Digite o nome...'
                    value={filters.companyName}
                    onChange={e =>
                      setFilters(f => ({ ...f, companyName: e.target.value }))
                    }
                  />
                </S.FilterSection>

                <S.FilterSection>
                  <S.FilterLabel>CNPJ</S.FilterLabel>
                  <S.FilterInput
                    placeholder='00.000.000/0000-00'
                    value={filters.companyCnpj}
                    onChange={e =>
                      setFilters(f => ({ ...f, companyCnpj: e.target.value }))
                    }
                  />
                </S.FilterSection>

                <S.FilterSection>
                  <S.FilterLabel>Nome do Usuário</S.FilterLabel>
                  <S.FilterInput
                    placeholder='Digite o nome...'
                    value={filters.userName}
                    onChange={e =>
                      setFilters(f => ({ ...f, userName: e.target.value }))
                    }
                  />
                </S.FilterSection>

                <S.FilterSection>
                  <S.FilterLabel>Email do Usuário</S.FilterLabel>
                  <S.FilterInput
                    placeholder='usuario@example.com'
                    value={filters.userEmail}
                    onChange={e =>
                      setFilters(f => ({ ...f, userEmail: e.target.value }))
                    }
                  />
                </S.FilterSection>

                <S.FilterSection>
                  <S.FilterLabel>Status</S.FilterLabel>
                  <S.FilterSelect
                    value={filters.status}
                    onChange={e =>
                      setFilters(f => ({ ...f, status: e.target.value }))
                    }
                  >
                    <option value=''>Todos</option>
                    <option value='active'>Ativa</option>
                    <option value='expired'>Expirada</option>
                    <option value='cancelled'>Cancelada</option>
                    <option value='pending'>Pendente</option>
                    <option value='suspended'>Suspensa</option>
                  </S.FilterSelect>
                </S.FilterSection>

                <S.FilterSection>
                  <S.FilterLabel>Tipo de Plano</S.FilterLabel>
                  <S.FilterSelect
                    value={filters.planType}
                    onChange={e =>
                      setFilters(f => ({ ...f, planType: e.target.value }))
                    }
                  >
                    <option value=''>Todos</option>
                    <option value='basic'>Básico</option>
                    <option value='professional'>Profissional</option>
                    <option value='custom'>Personalizado</option>
                  </S.FilterSelect>
                </S.FilterSection>
              </S.FiltersContainer>
            </FilterDrawer>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  // Visão MASTER (própria assinatura)
  if (isMaster && myUsage) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageHeader>
              <PageTitleContainer>
                <PageTitle>Minha Assinatura</PageTitle>
                <PageSubtitle>Acompanhe seu uso e limites</PageSubtitle>
              </PageTitleContainer>
              <div style={{ display: 'flex', gap: 12 }}>
                <S.FilterButton onClick={() => navigate('/my-subscription')}>
                  <MdAttachMoney size={20} />
                  Gerenciar Plano
                </S.FilterButton>
                <S.BackButton onClick={() => navigate('/dashboard')}>
                  <MdArrowBack size={20} />
                  Voltar
                </S.BackButton>
              </div>
            </PageHeader>

            {myUsage?.isTrialActive &&
              trialEndsAt &&
              trialDaysLeft !== null &&
              trialDaysLeft <= 365 && (
                <S.TrialBanner>
                  <S.TrialBannerText>
                    <S.TrialBannerEmphasis>
                      Período de teste ativo.
                    </S.TrialBannerEmphasis>{' '}
                    Restam {trialDaysLeft}{' '}
                    {trialDaysLeft === 1 ? 'dia' : 'dias'}
                    {trialEndsDisplay ? ` (até ${trialEndsDisplay})` : ''}. Caso
                    não queira prosseguir com a cobrança automática, cancele
                    antes do fim do trial.
                  </S.TrialBannerText>
                </S.TrialBanner>
              )}

            {/* Alertas */}
            {myUsage.alerts && myUsage.alerts.length > 0 && (
              <S.AlertsSection>
                {myUsage.alerts.map((alert: string, idx: number) => (
                  <S.Alert key={idx} $type='warning'>
                    ⚠️ {alert}
                  </S.Alert>
                ))}
              </S.AlertsSection>
            )}

            {/* Stats principais */}
            <S.StatsGrid>
              <S.StatCard>
                <S.StatIcon>
                  <MdBusiness size={24} />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatLabel>Empresas</S.StatLabel>
                  <S.StatValue
                    $color={getUsageColorClass(myUsage.companies.percentage)}
                  >
                    {myUsage.companies.used} / {myUsage.companies.limit}
                  </S.StatValue>
                  <S.StatPercentage
                    $color={getUsageColorClass(myUsage.companies.percentage)}
                  >
                    {myUsage.companies.percentage}%
                  </S.StatPercentage>
                </S.StatContent>
              </S.StatCard>

              <S.StatCard>
                <S.StatIcon>
                  <MdPerson size={24} />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatLabel>Usuários</S.StatLabel>
                  <S.StatValue
                    $color={getUsageColorClass(myUsage.users.percentage)}
                  >
                    {myUsage.users.used} / {myUsage.users.limit}
                  </S.StatValue>
                  <S.StatPercentage
                    $color={getUsageColorClass(myUsage.users.percentage)}
                  >
                    {myUsage.users.percentage}%
                  </S.StatPercentage>
                </S.StatContent>
              </S.StatCard>

              <S.StatCard>
                <S.StatIcon>
                  <MdHome size={24} />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatLabel>Propriedades</S.StatLabel>
                  <S.StatValue
                    $color={getUsageColorClass(myUsage.properties.percentage)}
                  >
                    {myUsage.properties.used} / {myUsage.properties.limit}
                  </S.StatValue>
                  <S.StatPercentage
                    $color={getUsageColorClass(myUsage.properties.percentage)}
                  >
                    {myUsage.properties.percentage}%
                  </S.StatPercentage>
                </S.StatContent>
              </S.StatCard>

              <S.StatCard>
                <S.StatIcon>
                  <MdStorage size={24} />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatLabel>Armazenamento</S.StatLabel>
                  <S.StatValue
                    $color={getUsageColorClass(myUsage.storage.percentage)}
                  >
                    {myUsage.storage.used} GB / {myUsage.storage.limit} GB
                  </S.StatValue>
                  <S.StatPercentage
                    $color={getUsageColorClass(myUsage.storage.percentage)}
                  >
                    {myUsage.storage.percentage}%
                  </S.StatPercentage>
                </S.StatContent>
              </S.StatCard>

              <S.StatCard>
                <S.StatIcon>
                  <MdApi size={24} />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatLabel>Chamadas API</S.StatLabel>
                  <S.StatValue
                    $color={getUsageColorClass(myUsage.apiCalls.percentage)}
                  >
                    {myUsage.apiCalls.usedThisMonth} / {myUsage.apiCalls.limit}
                  </S.StatValue>
                  <S.StatPercentage
                    $color={getUsageColorClass(myUsage.apiCalls.percentage)}
                  >
                    {myUsage.apiCalls.percentage}%
                  </S.StatPercentage>
                </S.StatContent>
              </S.StatCard>
            </S.StatsGrid>

            {/* Informações do plano */}
            <S.PlanInfoCard>
              <S.PlanHeader>
                <S.PlanTitle>{myUsage.planName}</S.PlanTitle>
                <S.PlanStatus $status={myUsage.status}>
                  {translateSubscriptionStatus(myUsage.status)}
                </S.PlanStatus>
              </S.PlanHeader>

              <S.PlanDetails>
                <S.PlanDetail>
                  <S.PlanDetailLabel>Tipo:</S.PlanDetailLabel>
                  <S.PlanDetailValue>{myUsage.planType}</S.PlanDetailValue>
                </S.PlanDetail>
                <S.PlanDetail>
                  <S.PlanDetailLabel>Valor:</S.PlanDetailLabel>
                  <S.PlanDetailValue>
                    R$ {myUsage.monthlyPrice}/mês
                  </S.PlanDetailValue>
                </S.PlanDetail>
                <S.PlanDetail>
                  <S.PlanDetailLabel>Válido até:</S.PlanDetailLabel>
                  <S.PlanDetailValue>
                    {new Date(myUsage.endDate).toLocaleDateString('pt-BR')}
                  </S.PlanDetailValue>
                </S.PlanDetail>
                <S.PlanDetail>
                  <S.PlanDetailLabel>Dias restantes:</S.PlanDetailLabel>
                  <S.PlanDetailValue>
                    {myUsage.daysRemaining} dias
                  </S.PlanDetailValue>
                </S.PlanDetail>
              </S.PlanDetails>

              {/* Módulos ativos */}
              {myUsage.activeModules && myUsage.activeModules.length > 0 && (
                <S.ModulesSection>
                  <S.ModulesTitle>
                    Módulos Ativos ({myUsage.activeModules.length})
                  </S.ModulesTitle>
                  <S.ModulesGrid>
                    {myUsage.activeModules.map((module: string) => (
                      <S.ModuleTag key={module}>
                        {translateModule(module)}
                      </S.ModuleTag>
                    ))}
                  </S.ModulesGrid>
                </S.ModulesSection>
              )}
            </S.PlanInfoCard>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <S.EmptyState>
            <h2>Nenhuma assinatura encontrada</h2>
          </S.EmptyState>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default SubscriptionManagementPage;
