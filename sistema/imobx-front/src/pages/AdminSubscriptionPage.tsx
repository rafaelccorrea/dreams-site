import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { subscriptionService } from '../services/subscriptionService';
import UpdatePaymentMethodModal from '../components/modals/UpdatePaymentMethodModal';
import { translateSubscriptionStatus } from '../utils/subscriptionTranslations';
import { toast } from 'react-toastify';
import SubscriptionManagementShimmer from '../components/shimmer/SubscriptionManagementShimmer';
import { usePricingData } from '../hooks/usePricingData';
import { useSubscription } from '../hooks/useSubscription';
import { useCanAccessUsageData } from '../hooks/useCanAccessUsageData';
import { CustomPlanModal } from '../components/modals/CustomPlanModal';
import { SubscriptionUpgradeModal } from '../components/modals/SubscriptionUpgradeModal';
import { SubscriptionDowngradeModal } from '../components/modals/SubscriptionDowngradeModal';
import { SubscriptionCancelModal } from '../components/modals/SubscriptionCancelModal';
import { SubscriptionFarewellModal } from '../components/modals/SubscriptionFarewellModal';
import { useAuth } from '../hooks/useAuth';
import { useIsOwner } from '../hooks/useOwner';
import { useCompany } from '../hooks/useCompany';
import {
  PurchaseAddonForm,
  AddonsList,
  AddonLimitsDisplay,
} from '../components/addons';
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
  MdCreditCard,
  MdCancel,
  MdReceipt,
  MdCheckCircle,
  MdCheck,
  MdStar,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md';

type PlanCategory = 'basic' | 'professional' | 'custom' | 'other';
type PlanAction = 'current' | 'upgrade' | 'downgrade' | 'custom';

const normalizePriceValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const sanitized = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const resolvePlanCategory = ({
  key,
  name,
  type,
  planType,
}: {
  key?: string;
  name?: string | null;
  type?: string | null;
  planType?: string | null;
}): PlanCategory => {
  const normalizedKey = key?.toLowerCase();
  if (normalizedKey === 'custom') {
    return 'custom';
  }

  const normalizedType = (type ?? planType ?? '').toString().toLowerCase();
  if (normalizedType === 'custom') {
    return 'custom';
  }

  const normalizedName = (name ?? '').toString().toLowerCase();
  if (
    normalizedName.includes('básico') ||
    normalizedName.includes('basico') ||
    normalizedName.includes('basic')
  ) {
    return 'basic';
  }
  if (
    normalizedName.includes('profissional') ||
    normalizedName.includes('professional')
  ) {
    return 'professional';
  }
  if (
    normalizedName.includes('personalizado') ||
    normalizedName.includes('custom')
  ) {
    return 'custom';
  }

  return 'other';
};

const AdminSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: pricingData, loading: pricingLoading } = usePricingData();
  const { loadSubscriptionStatus } = useSubscription();
  const canAccessUsageData = useCanAccessUsageData();
  const { logout, getCurrentUser } = useAuth();
  const isOwner = useIsOwner();
  const { selectedCompany } = useCompany();

  // Verificar se tem empresa selecionada
  const hasCompany =
    !!selectedCompany?.id ||
    !!localStorage.getItem('dream_keys_selected_company_id');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'plans' | 'invoices' | 'settings' | 'extras'
  >('overview');
  const [loading, setLoading] = useState(true);
  const [myUsage, setMyUsage] = useState<any>(null);
  const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showFarewellModal, setShowFarewellModal] = useState(false);
  const [farewellCountdown, setFarewellCountdown] = useState(10);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlanIsCustom, setCurrentPlanIsCustom] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const farewellTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CORREÇÃO: Refs para evitar loops de chamadas
  const isLoadingDataRef = useRef(false);
  const lastLoadTimeRef = useRef<number>(0);
  const LOAD_DEBOUNCE_MS = 3000; // 3 segundos entre chamadas

  const effectivePlan = useMemo(() => {
    if (currentSubscription?.plan) {
      return currentSubscription.plan;
    }
    if (myUsage?.plan) {
      return myUsage.plan;
    }
    return null;
  }, [currentSubscription, myUsage]);

  const currentPlanCategory = useMemo<PlanCategory>(() => {
    if (currentPlanIsCustom) {
      return 'custom';
    }

    const inferredName = myUsage?.planName ?? effectivePlan?.name ?? null;
    const inferredType = (effectivePlan as any)?.type ?? null;
    const usagePlanType = (myUsage?.planType as string | null) ?? null;

    return resolvePlanCategory({
      name: inferredName,
      type: inferredType,
      planType: usagePlanType,
    });
  }, [
    currentPlanIsCustom,
    myUsage?.planName,
    myUsage?.planType,
    effectivePlan,
  ]);

  const currentMonthlyPrice = useMemo(() => {
    const candidates = [
      myUsage?.monthlyPrice,
      currentSubscription?.price,
      effectivePlan?.price,
    ];

    for (const candidate of candidates) {
      const normalized = normalizePriceValue(candidate);
      if (normalized !== null) {
        return normalized;
      }
    }

    return null;
  }, [myUsage, currentSubscription, effectivePlan]);

  const clearFarewellTimers = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (farewellTimeoutRef.current) {
      clearTimeout(farewellTimeoutRef.current);
      farewellTimeoutRef.current = null;
    }
  }, []);

  const handleFarewellLogout = useCallback(() => {
    clearFarewellTimers();
    setShowFarewellModal(false);
    logout();
  }, [clearFarewellTimers, logout]);

  const loadData = useCallback(async () => {
    // CORREÇÃO: Evitar chamadas simultâneas ou muito frequentes
    const now = Date.now();
    if (isLoadingDataRef.current) {
      console.log('⏭️ AdminSubscriptionPage: Já está carregando, pulando...');
      return;
    }

    if (now - lastLoadTimeRef.current < LOAD_DEBOUNCE_MS) {
      console.log(
        '⏭️ AdminSubscriptionPage: Chamada muito recente, aguardando debounce...'
      );
      return;
    }

    isLoadingDataRef.current = true;
    lastLoadTimeRef.current = now;

    try {
      setLoading(true);

      const companyId = localStorage.getItem('dream_keys_selected_company_id');
      const user = getCurrentUser();
      const userIsOwner = isOwner || user?.owner === true;

      // CORREÇÃO: Se o usuário é owner, chamar API mesmo sem empresa
      // Se não é owner, só chamar se tiver empresa e permissão
      const shouldLoadData = userIsOwner || (canAccessUsageData && companyId);

      if (shouldLoadData) {
        console.log(
          '🔄 AdminSubscriptionPage: Carregando dados da assinatura...',
          {
            hasCompany: !!companyId,
            isOwner: userIsOwner,
            canAccessUsageData,
          }
        );

        const [usage, subscription] = await Promise.all([
          subscriptionService.getMySubscriptionUsage(),
          subscriptionService.getMySubscription(),
        ]);

        setMyUsage(usage);
        setCurrentSubscription(subscription);

        // Detectar se o plano atual é customizado
        const isCustom =
          usage?.planType === 'custom' ||
          usage?.planName?.toLowerCase().includes('custom');
        setCurrentPlanIsCustom(isCustom);
      } else if (!companyId && !userIsOwner) {
        console.log(
          'ℹ️ AdminSubscriptionPage: Nenhuma empresa associada e usuário não é owner, pulando carregamento de uso'
        );
        setMyUsage(null);
        setCurrentSubscription(null);
      } else {
        console.log(
          'ℹ️ Usuário sem permissão para acessar dados de uso da assinatura'
        );
        setMyUsage(null);
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error('Erro ao carregar dados da assinatura:', error);
      toast.error('Erro ao carregar dados da assinatura');
    } finally {
      setLoading(false);
      isLoadingDataRef.current = false;
    }
  }, [canAccessUsageData, isOwner, getCurrentUser]);

  // CORREÇÃO: Carregar dados apenas uma vez na montagem, não toda vez que loadData muda
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

  // CORREÇÃO: Se não tem empresa e está em uma aba que não existe, voltar para overview
  useEffect(() => {
    if (
      !hasCompany &&
      (activeTab === 'plans' ||
        activeTab === 'settings' ||
        activeTab === 'extras')
    ) {
      setActiveTab('overview');
    }
  }, [hasCompany, activeTab]);

  useEffect(() => {
    if (!showFarewellModal) {
      clearFarewellTimers();
      return;
    }

    setFarewellCountdown(10);

    countdownIntervalRef.current = setInterval(() => {
      setFarewellCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    farewellTimeoutRef.current = setTimeout(() => {
      handleFarewellLogout();
    }, 10000);

    return () => {
      clearFarewellTimers();
    };
  }, [showFarewellModal, clearFarewellTimers, handleFarewellLogout]);

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };

  const handleUpgradeSuccess = () => {
    loadData();
    toast.success('Upgrade realizado com sucesso!');
  };

  const handleDowngradeSuccess = () => {
    loadData();
    toast.success('Downgrade realizado com sucesso!');
  };

  const handleCancelSuccess = () => {
    setShowCancelModal(false);
    setShowFarewellModal(true);
  };

  const handleReactivateSubscription = async () => {
    try {
      setIsProcessing(true);
      const remoteIp = await subscriptionService.fetchClientIp();
      await subscriptionService.reactivateSubscription(
        remoteIp ? { remoteIp } : undefined
      );
      toast.success('Assinatura reativada com sucesso!');
      await loadSubscriptionStatus();
      await loadData();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? 'Erro ao reativar assinatura.';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || pricingLoading) {
    return (
      <Layout>
        <SubscriptionManagementShimmer />
      </Layout>
    );
  }

  if (!myUsage || !pricingData) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <S.EmptyState>
              <h2>Erro ao carregar dados</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>
                {!myUsage && 'Não foi possível carregar sua assinatura.'}
                {!pricingData &&
                  ' Não foi possível carregar os planos disponíveis.'}
              </p>
            </S.EmptyState>
          </PageContent>
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
              <PageTitle>Gerenciar Minha Assinatura</PageTitle>
              <PageSubtitle>Planos, faturas e configurações</PageSubtitle>
            </PageTitleContainer>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              <S.BackButton
                onClick={() => navigate('/subscription-management')}
              >
                <MdArrowBack size={20} />
                <span>Voltar</span>
              </S.BackButton>
            </div>
          </PageHeader>

          <S.Tabs>
            <S.Tab
              $active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            >
              Visão Geral
            </S.Tab>
            {hasCompany && (
              <S.Tab
                $active={activeTab === 'plans'}
                onClick={() => setActiveTab('plans')}
              >
                Mudar Plano
              </S.Tab>
            )}
            <S.Tab
              $active={activeTab === 'invoices'}
              onClick={() => setActiveTab('invoices')}
            >
              Faturas
            </S.Tab>
            {hasCompany && (
              <S.Tab
                $active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              >
                Configurações
              </S.Tab>
            )}
            {hasCompany && (
              <S.Tab
                $active={activeTab === 'extras'}
                onClick={() => setActiveTab('extras')}
              >
                Extras
              </S.Tab>
            )}
          </S.Tabs>

          {/* ABA: Visão Geral */}
          {activeTab === 'overview' && (
            <S.TabContent>
              <S.StatsGrid>
                <S.StatCard>
                  <S.StatLabel>Plano Atual</S.StatLabel>
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
                <S.StatCard>
                  <S.StatLabel>Próximo Pagamento</S.StatLabel>
                  <S.StatValue style={{ fontSize: '0.9rem' }}>
                    {myUsage.endDate
                      ? new Date(myUsage.endDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </S.StatValue>
                </S.StatCard>
              </S.StatsGrid>

              <S.Alert $type='info' style={{ marginTop: 24 }}>
                ℹ️ Sua assinatura renova automaticamente. Você pode alterar o
                plano ou cancelar a qualquer momento.
              </S.Alert>

              {/* Resumo de uso */}
              <S.SectionContainer>
                <S.SectionTitle>Uso de Recursos</S.SectionTitle>
                <S.UsageSection>
                  {myUsage.companies && (
                    <S.UsageCard>
                      <S.UsageHeader>
                        <S.UsageLabel>Empresas</S.UsageLabel>
                        <S.UsageValues>
                          {myUsage.companies.used} / {myUsage.companies.limit}
                        </S.UsageValues>
                      </S.UsageHeader>
                      <S.ProgressBar>
                        <S.ProgressFill
                          $percentage={myUsage.companies.percentage}
                          $status={
                            myUsage.companies.percentage > 90
                              ? 'danger'
                              : myUsage.companies.percentage > 70
                                ? 'warning'
                                : 'success'
                          }
                        />
                      </S.ProgressBar>
                    </S.UsageCard>
                  )}

                  {myUsage.users && (
                    <S.UsageCard>
                      <S.UsageHeader>
                        <S.UsageLabel>Usuários</S.UsageLabel>
                        <S.UsageValues>
                          {myUsage.users.used} / {myUsage.users.limit}
                        </S.UsageValues>
                      </S.UsageHeader>
                      <S.ProgressBar>
                        <S.ProgressFill
                          $percentage={myUsage.users.percentage}
                          $status={
                            myUsage.users.percentage > 90
                              ? 'danger'
                              : myUsage.users.percentage > 70
                                ? 'warning'
                                : 'success'
                          }
                        />
                      </S.ProgressBar>
                    </S.UsageCard>
                  )}

                  {myUsage.properties && (
                    <S.UsageCard>
                      <S.UsageHeader>
                        <S.UsageLabel>Propriedades</S.UsageLabel>
                        <S.UsageValues>
                          {myUsage.properties.used} / {myUsage.properties.limit}
                        </S.UsageValues>
                      </S.UsageHeader>
                      <S.ProgressBar>
                        <S.ProgressFill
                          $percentage={myUsage.properties.percentage}
                          $status={
                            myUsage.properties.percentage > 90
                              ? 'danger'
                              : myUsage.properties.percentage > 70
                                ? 'warning'
                                : 'success'
                          }
                        />
                      </S.ProgressBar>
                    </S.UsageCard>
                  )}

                  {myUsage.storage && (
                    <S.UsageCard>
                      <S.UsageHeader>
                        <S.UsageLabel>Armazenamento</S.UsageLabel>
                        <S.UsageValues>
                          {myUsage.storage.used} GB / {myUsage.storage.limit} GB
                        </S.UsageValues>
                      </S.UsageHeader>
                      <S.ProgressBar>
                        <S.ProgressFill
                          $percentage={myUsage.storage.percentage}
                          $status={
                            myUsage.storage.percentage > 90
                              ? 'danger'
                              : myUsage.storage.percentage > 70
                                ? 'warning'
                                : 'success'
                          }
                        />
                      </S.ProgressBar>
                    </S.UsageCard>
                  )}
                </S.UsageSection>
              </S.SectionContainer>
            </S.TabContent>
          )}

          {/* ABA: Mudar Plano */}
          {hasCompany && activeTab === 'plans' && (
            <S.TabContent>
              <S.Alert $type='info'>
                ℹ️ Ao mudar de plano, você será cobrado proporcionalmente. As
                mudanças entram em vigor imediatamente após a confirmação do
                pagamento.
              </S.Alert>

              <S.FormGroup style={{ marginTop: 24 }}>
                <S.Label>Plano Atual</S.Label>
                <S.InfoValue>
                  {myUsage.planName} - R$ {myUsage.monthlyPrice}/mês
                </S.InfoValue>
              </S.FormGroup>

              <S.SectionContainer>
                <S.SectionTitle>Planos Disponíveis</S.SectionTitle>
                <S.PlansGrid>
                  {pricingData &&
                    Object.entries(pricingData.plans).map(([key, plan]) => {
                      const planAny = plan as any;
                      const isCustomPlan = key === 'custom';
                      const rawPrice = isCustomPlan
                        ? planAny.basePrice
                        : planAny.price;
                      const targetPrice = normalizePriceValue(rawPrice) ?? 0;
                      const displayPrice = targetPrice
                        .toFixed(2)
                        .replace('.', ',');
                      const isCurrent =
                        myUsage.planName === plan.name ||
                        (isCustomPlan && currentPlanIsCustom);
                      const isExpanded = expandedPlans.has(key);

                      const planFeaturesArray = Array.isArray(planAny.features)
                        ? planAny.features
                        : [];
                      const shouldShowToggle = planFeaturesArray.length > 4;
                      const featuresToShow =
                        shouldShowToggle && !isExpanded
                          ? planFeaturesArray.slice(0, 4)
                          : planFeaturesArray;

                      const targetCategory = resolvePlanCategory({
                        key,
                        name: plan.name,
                        type: (planAny?.type as string | null) ?? null,
                      });

                      const comparisonPrice =
                        currentMonthlyPrice ??
                        normalizePriceValue(myUsage?.monthlyPrice) ??
                        0;
                      const defaultAction: PlanAction =
                        targetPrice >= comparisonPrice
                          ? 'upgrade'
                          : 'downgrade';

                      let action: PlanAction = defaultAction;
                      if (isCurrent) {
                        action = 'current';
                      } else if (isCustomPlan) {
                        action = 'custom';
                      } else if (currentPlanCategory === 'basic') {
                        action =
                          targetCategory === 'basic'
                            ? defaultAction
                            : 'upgrade';
                      } else if (currentPlanCategory === 'professional') {
                        if (targetCategory === 'basic') {
                          action = 'downgrade';
                        } else if (targetCategory === 'custom') {
                          action = 'custom';
                        } else {
                          action = defaultAction;
                        }
                      } else if (currentPlanCategory === 'custom') {
                        if (
                          targetCategory === 'basic' ||
                          targetCategory === 'professional'
                        ) {
                          action = 'downgrade';
                        } else if (targetCategory === 'custom') {
                          action = 'custom';
                        } else {
                          action = defaultAction;
                        }
                      } else {
                        action = defaultAction;
                      }

                      const buttonVariant =
                        action === 'downgrade' ? 'warning' : 'primary';
                      const buttonDisabled =
                        action === 'current' || isProcessing;
                      const buttonLabel =
                        action === 'upgrade'
                          ? 'Fazer Upgrade'
                          : action === 'downgrade'
                            ? 'Fazer Downgrade'
                            : action === 'custom'
                              ? 'Personalizar Plano'
                              : 'Selecionar Plano';
                      const buttonIcon =
                        action === 'upgrade' ? (
                          <MdArrowUpward size={18} />
                        ) : action === 'downgrade' ? (
                          <MdArrowDownward size={18} />
                        ) : (
                          <MdStar size={18} />
                        );

                      const handlePlanAction = () => {
                        if (action === 'current') {
                          return;
                        }
                        if (action === 'custom') {
                          setShowCustomPlanModal(true);
                          return;
                        }
                        if (action === 'downgrade') {
                          setShowDowngradeModal(true);
                          return;
                        }
                        setShowUpgradeModal(true);
                      };

                      return (
                        <S.ActionCard
                          key={key}
                          style={{
                            border: isCurrent
                              ? '2px solid var(--color-primary)'
                              : planAny.popular
                                ? '2px solid var(--color-success)'
                                : '1px solid var(--color-border)',
                            opacity: isCurrent ? 0.8 : 1,
                            position: 'relative',
                          }}
                        >
                          {planAny.popular && !isCurrent && (
                            <div
                              style={{
                                position: 'absolute',
                                top: -12,
                                right: 16,
                                background:
                                  'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <MdStar size={12} />
                              Mais Popular
                            </div>
                          )}
                          {isCustomPlan && (
                            <div
                              style={{
                                position: 'absolute',
                                top: -12,
                                right: 16,
                                background:
                                  'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              ⚙️ Personalizável
                            </div>
                          )}

                          <S.ActionTitle>
                            {plan.name}
                            {isCurrent && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: '0.75rem',
                                  color: 'var(--color-primary)',
                                }}
                              >
                                ✓ Plano Atual
                              </span>
                            )}
                          </S.ActionTitle>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--color-text-secondary)',
                              marginTop: 4,
                              marginBottom: 16,
                            }}
                          >
                            {plan.description}
                          </p>

                          {/* Mostrar módulos atuais se for plano customizado e for o atual */}
                          {isCustomPlan &&
                            isCurrent &&
                            myUsage?.activeModules &&
                            myUsage.activeModules.length > 0 && (
                              <div
                                style={{
                                  background:
                                    'var(--color-background-secondary)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  marginBottom: '16px',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--color-text)',
                                    marginBottom: '8px',
                                  }}
                                >
                                  ⚙️ Seus módulos atuais (
                                  {myUsage.activeModules.length})
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                >
                                  {myUsage.activeModules
                                    .slice(0, 3)
                                    .map((mod: string) =>
                                      mod
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, (l: string) =>
                                          l.toUpperCase()
                                        )
                                    )
                                    .join(', ')}
                                  {myUsage.activeModules.length > 3 &&
                                    ` +${myUsage.activeModules.length - 3} mais`}
                                </div>
                              </div>
                            )}

                          <div
                            style={{
                              marginBottom: 16,
                              fontSize: '1.5rem',
                              fontWeight: 600,
                              color: 'var(--color-text)',
                            }}
                          >
                            {isCustomPlan && (
                              <span
                                style={{
                                  fontSize: '0.875rem',
                                  fontWeight: 400,
                                }}
                              >
                                A partir de{' '}
                              </span>
                            )}
                            R$ {displayPrice}
                            <span
                              style={{
                                fontSize: '0.875rem',
                                fontWeight: 400,
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              /mês
                            </span>
                          </div>

                          {planFeaturesArray.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                              {featuresToShow.map(
                                (feature: string, idx: number) => (
                                  <div
                                    key={idx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 8,
                                      marginBottom: 6,
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    <MdCheck
                                      size={16}
                                      style={{
                                        color: 'var(--color-success)',
                                        marginTop: 2,
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{ color: 'var(--color-text)' }}
                                    >
                                      {feature}
                                    </span>
                                  </div>
                                )
                              )}
                              {shouldShowToggle && (
                                <button
                                  onClick={() => togglePlanExpansion(key)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    padding: '4px 0',
                                    marginTop: 8,
                                  }}
                                >
                                  {isExpanded
                                    ? 'Ver menos'
                                    : `Ver mais ${(planFeaturesArray.length || 0) - 4} recursos`}
                                </button>
                              )}
                            </div>
                          )}

                          {action === 'current' ? (
                            // Plano atual
                            isCustomPlan ? (
                              <S.ActionButton
                                $variant='primary'
                                onClick={() => setShowCustomPlanModal(true)}
                                disabled={isProcessing}
                                style={{ width: '100%', marginTop: 8 }}
                              >
                                <MdStar size={18} />
                                Editar Meu Plano
                              </S.ActionButton>
                            ) : (
                              <S.ActionButton
                                $variant='secondary'
                                disabled={true}
                                style={{
                                  width: '100%',
                                  marginTop: 8,
                                  opacity: 0.6,
                                  cursor: 'not-allowed',
                                }}
                              >
                                <MdCheckCircle size={18} />
                                Plano Atual
                              </S.ActionButton>
                            )
                          ) : (
                            <S.ActionButton
                              $variant={buttonVariant}
                              onClick={handlePlanAction}
                              disabled={buttonDisabled}
                              style={{ width: '100%', marginTop: 8 }}
                            >
                              {buttonIcon}
                              {buttonLabel}
                            </S.ActionButton>
                          )}
                        </S.ActionCard>
                      );
                    })}
                </S.PlansGrid>
              </S.SectionContainer>
            </S.TabContent>
          )}

          {/* ABA: Faturas */}
          {activeTab === 'invoices' && (
            <S.TabContent>
              <S.Alert $type='info'>
                ℹ️ Aqui você encontrará o histórico de todas as suas faturas e
                pagamentos.
              </S.Alert>

              <S.SectionContainer style={{ marginTop: 24 }}>
                <S.SectionTitle>Histórico de Faturas</S.SectionTitle>

                {/* Placeholder - será implementado com dados reais */}
                <S.ActionCard>
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <MdReceipt
                      size={48}
                      style={{
                        color: 'var(--color-text-secondary)',
                        marginBottom: 16,
                      }}
                    />
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      Funcionalidade de histórico de faturas será implementada
                      em breve.
                    </p>
                  </div>
                </S.ActionCard>
              </S.SectionContainer>
            </S.TabContent>
          )}

          {/* ABA: Configurações */}
          {hasCompany && activeTab === 'settings' && (
            <S.TabContent>
              <S.Alert $type='info'>
                ℹ️ Gerencie suas configurações de assinatura.
              </S.Alert>

              {currentSubscription?.status !== 'active' && (
                <S.ActionCard style={{ marginTop: 24 }}>
                  <S.ActionTitle>✅ Reativar Assinatura</S.ActionTitle>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 16,
                    }}
                  >
                    Reative sua assinatura imediatamente caso ela tenha sido
                    suspensa ou cancelada.
                  </p>
                  <S.ActionButton
                    $variant='success'
                    onClick={handleReactivateSubscription}
                    disabled={isProcessing}
                  >
                    <MdCheckCircle size={18} />
                    Reativar Assinatura
                  </S.ActionButton>
                </S.ActionCard>
              )}

              {/* Cancelamento */}
              <S.ActionCard style={{ marginTop: 24 }}>
                <S.ActionTitle>🚫 Cancelar Assinatura</S.ActionTitle>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 16,
                  }}
                >
                  Cancelamento definitivo da assinatura. Esta ação é
                  irreversível.
                </p>

                <S.ActionButton
                  $variant='danger'
                  onClick={() => setShowCancelModal(true)}
                  disabled={isProcessing}
                >
                  <MdCancel size={18} />
                  Cancelar Assinatura
                </S.ActionButton>
              </S.ActionCard>

              {/* Forma de Pagamento */}
              <S.ActionCard style={{ marginTop: 24 }}>
                <S.ActionTitle>💳 Forma de Pagamento</S.ActionTitle>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 16,
                  }}
                >
                  Gerencie seus métodos de pagamento
                </p>
                <S.ActionButton
                  $variant='primary'
                  onClick={() => setShowUpdatePaymentModal(true)}
                  disabled={isProcessing}
                >
                  <MdCreditCard size={18} />
                  Atualizar Forma de Pagamento
                </S.ActionButton>
              </S.ActionCard>
            </S.TabContent>
          )}

          {/* ABA: Extras (Add-ons) */}
          {hasCompany && activeTab === 'extras' && (
            <S.TabContent>
              <S.Alert $type='info'>
                ℹ️ Compre extras para aumentar os limites do seu plano. Os
                valores serão adicionados à sua assinatura mensal e atualizados
                automaticamente.
              </S.Alert>

              {currentSubscription?.id || myUsage?.subscriptionId ? (
                <>
                  {/* Limites Totais com Add-ons */}
                  <S.SectionContainer style={{ marginTop: 24 }}>
                    <S.SectionTitle>
                      Limites Totais (Plano + Extras)
                    </S.SectionTitle>
                    <AddonLimitsDisplay
                      subscriptionId={
                        currentSubscription?.id || myUsage?.subscriptionId || ''
                      }
                    />
                  </S.SectionContainer>

                  {/* Comprar Extras */}
                  <S.SectionContainer style={{ marginTop: 24 }}>
                    <S.SectionTitle>Comprar Extras</S.SectionTitle>
                    <PurchaseAddonForm
                      subscriptionId={
                        currentSubscription?.id || myUsage?.subscriptionId || ''
                      }
                      currentSubscriptionPrice={currentMonthlyPrice}
                      onSuccess={() => {
                        loadData();
                      }}
                    />
                  </S.SectionContainer>

                  {/* Lista de Extras */}
                  <S.SectionContainer style={{ marginTop: 24 }}>
                    <S.SectionTitle>Meus Extras</S.SectionTitle>
                    <AddonsList
                      subscriptionId={
                        currentSubscription?.id || myUsage?.subscriptionId || ''
                      }
                      activeOnly={false}
                      onAddonCancel={() => {
                        loadData();
                        toast.success('Extra cancelado com sucesso!');
                      }}
                    />
                  </S.SectionContainer>
                </>
              ) : (
                <S.ActionCard style={{ marginTop: 24 }}>
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      {loading
                        ? 'Carregando informações da assinatura...'
                        : 'Nenhuma assinatura encontrada.'}
                    </p>
                  </div>
                </S.ActionCard>
              )}
            </S.TabContent>
          )}

          {/* Modal de Plano Customizado */}
          <CustomPlanModal
            isOpen={showCustomPlanModal}
            onClose={() => setShowCustomPlanModal(false)}
            modules={pricingData?.modules.availableForCustom || []}
            addons={pricingData?.addons || { all: [], byType: {} }}
            initialModules={
              currentPlanIsCustom ? myUsage?.activeModules || [] : []
            }
            initialAddons={
              currentPlanIsCustom
                ? {
                    companies: myUsage?.companies?.used || 0,
                    users: myUsage?.users?.used || 0,
                    properties: myUsage?.properties?.used || 0,
                    storage: myUsage?.storage?.used || 0,
                    apiCalls: myUsage?.apiCalls?.used || 0,
                  }
                : {}
            }
          />

          {/* Modal de Upgrade */}
          <SubscriptionUpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            currentPlan={effectivePlan}
            currentSubscription={currentSubscription}
            currentUsage={myUsage}
            currentPrice={currentMonthlyPrice}
            onSuccess={handleUpgradeSuccess}
          />

          {/* Modal de Downgrade */}
          <SubscriptionDowngradeModal
            isOpen={showDowngradeModal}
            onClose={() => setShowDowngradeModal(false)}
            currentPlan={effectivePlan}
            currentSubscription={currentSubscription}
            currentUsage={myUsage}
            currentPrice={currentMonthlyPrice}
            onSuccess={handleDowngradeSuccess}
          />

          {/* Modal de Cancelamento */}
          <SubscriptionCancelModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            subscription={currentSubscription}
            onSuccess={handleCancelSuccess}
          />

          <SubscriptionFarewellModal
            isOpen={showFarewellModal}
            secondsRemaining={farewellCountdown}
            onClose={handleFarewellLogout}
          />

          <UpdatePaymentMethodModal
            isOpen={showUpdatePaymentModal}
            onClose={() => setShowUpdatePaymentModal(false)}
            onSuccess={loadData}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default AdminSubscriptionPage;
