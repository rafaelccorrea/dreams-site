import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { subscriptionService } from '../services/subscriptionService';
import { MODULE_LABELS, getCompanyModules } from '../services/modulesService';
import { ReasonModal } from '../components/modals/ReasonModal';
import { translateSubscriptionStatus } from '../utils/subscriptionTranslations';
import { toast } from 'react-toastify';
import SubscriptionManagementShimmer from '../components/shimmer/SubscriptionManagementShimmer';
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
  MdSave,
  MdAccessTime,
  MdBlock,
  MdCheckCircle,
} from 'react-icons/md';

const SubscriptionDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const subscriptionFromState = (location.state as any)?.subscription;

  const [activeTab, setActiveTab] = useState<
    'general' | 'plan' | 'modules' | 'limits' | 'actions'
  >('general');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(
    subscriptionFromState || null
  );
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  // Empresa matriz (primeira da lista)
  const matrixCompany = subscription?.companies?.list?.[0];

  // Aba Geral
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  // Aba Mudar Plano
  const [newPlanId, setNewPlanId] = useState('');
  const [planChangeType, setPlanChangeType] = useState<
    'upgrade' | 'downgrade' | 'standard_to_custom'
  >('upgrade');
  const [planReason, setPlanReason] = useState<
    'user_request' | 'admin_decision'
  >('user_request');
  const [planNotes, setPlanNotes] = useState('');
  const [customModules, setCustomModules] = useState<string[]>([]);

  // Aba Ações
  const [extendDays, setExtendDays] = useState(30);
  const [extendReason, setExtendReason] = useState('');

  // Aba Módulos (usa selectedCompanyId do modal)
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [modulesChangeType, setModulesChangeType] = useState<
    'module_addition' | 'module_removal'
  >('module_addition');
  const [modulesReason, setModulesReason] = useState<
    'user_request' | 'admin_decision'
  >('user_request');
  const [modulesNotes, setModulesNotes] = useState('');

  // Aba Limites
  const [limits, setLimits] = useState({
    maxUsers: 5,
    maxProperties: 100,
    storageGB: 5,
    apiCalls: 10000,
  });

  // Modal de motivo (suspender/reativar)
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [reasonModalTitle, setReasonModalTitle] = useState('');
  const [pendingAction, setPendingAction] = useState<
    'activate' | 'suspend' | null
  >(null);

  useEffect(() => {
    if (subscriptionId) {
      loadSubscription();
    }
  }, [subscriptionId]);

  const loadSubscription = async () => {
    try {
      setLoading(true);

      // Se não tem dados no state, volta para lista
      if (!subscriptionFromState) {
        toast.error('Dados da assinatura não encontrados');
        navigate('/subscription-management');
        return;
      }

      const data = subscriptionFromState;
      const matrixCompanyId = data.companies?.list?.[0]?.id;

      // Buscar planos E módulos da empresa matriz
      const [plans, companyModulesData] = await Promise.all([
        subscriptionService.getAllPlans(),
        matrixCompanyId
          ? getCompanyModules(matrixCompanyId).catch(() => ({ modules: [] }))
          : Promise.resolve({ modules: [] }),
      ]);

      setAvailablePlans(plans);
      setEndDate(data.endDate?.split('T')[0] || '');
      setNotes(data.notes || '');

      // Pré-selecionar módulos da empresa matriz
      const modulesAtivos =
        companyModulesData.modules?.map((m: any) => m.moduleType) || [];
      console.log('✅ Módulos carregados da empresa matriz:', modulesAtivos);

      setSelectedModules([...modulesAtivos]);
      setCustomModules([...modulesAtivos]);

      // Pré-carregar limites atuais (da resposta da lista)
      setLimits({
        maxUsers: data.usage?.users?.limit || 5,
        maxProperties: data.usage?.properties?.limit || 100,
        storageGB: data.usage?.storage?.limitGB || 5,
        apiCalls: 10000,
      });
    } catch (error) {
      toast.error('Erro ao carregar dados');
      navigate('/subscription-management');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGeneral = async () => {
    try {
      setLoading(true);
      await subscriptionService.updateSubscription(subscriptionId!, {
        endDate,
        notes,
      });
      toast.success('Assinatura atualizada!');
      loadSubscription();
    } catch (error) {
      toast.error('Erro ao atualizar assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async () => {
    if (!newPlanId) {
      toast.error('Selecione um novo plano');
      return;
    }

    const selectedPlan = availablePlans.find(p => p.id === newPlanId);
    const isCustomPlan = selectedPlan?.type === 'custom';

    if (isCustomPlan && customModules.length === 0) {
      toast.error('Selecione pelo menos um módulo para o plano personalizado');
      return;
    }

    try {
      setLoading(true);
      const result = await subscriptionService.manageSubscription({
        subscriptionId: subscriptionId!,
        action: 'change_plan',
        newPlanId,
        customModules: isCustomPlan ? customModules : undefined,
        reason: planNotes || undefined,
        notes: planNotes || undefined,
        notifyUsers: true,
      });

      toast.success(`✅ ${result.message}`);
      toast.info(
        `📊 ${result.totalUsersAffected} usuários afetados em ${result.totalCompanies || 0} empresas`
      );
      navigate('/subscription-management');
    } catch (error) {
      toast.error('Erro ao alterar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async () => {
    try {
      setLoading(true);
      await subscriptionService.extendSubscription(
        subscriptionId!,
        extendDays,
        extendReason
      );
      toast.success(`Assinatura estendida por ${extendDays} dias!`);
      loadSubscription();
    } catch (error) {
      toast.error('Erro ao estender assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (active: boolean) => {
    setPendingAction(active ? 'activate' : 'suspend');
    setReasonModalTitle(
      active ? 'Motivo da Reativação' : 'Motivo da Suspensão'
    );
    setReasonModalOpen(true);
  };

  const handleConfirmToggle = async (reason: string) => {
    if (!pendingAction) return;

    try {
      setLoading(true);
      const result = await subscriptionService.manageSubscription({
        subscriptionId: subscriptionId!,
        action: pendingAction,
        reason,
        notes: reason,
        notifyUsers: true,
      });

      toast.success(
        result.message ||
          (pendingAction === 'activate'
            ? 'Assinatura reativada!'
            : 'Assinatura suspensa!')
      );
      navigate('/subscription-management');
    } catch (error) {
      toast.error('Erro ao alterar status');
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSaveModules = async () => {
    if (!matrixCompany?.id) {
      toast.error('Empresa matriz não encontrada');
      return;
    }

    try {
      setLoading(true);
      const result = await subscriptionService.updateCompanyModules({
        companyId: matrixCompany.id,
        modules: selectedModules,
        changeType: modulesChangeType,
        reason: modulesReason,
        notes: modulesNotes || undefined,
        notifyUsers: true,
      });

      toast.success(
        `Módulos atualizados! ${result.totalUsersAffected || 0} usuários afetados.`
      );
      loadSubscription();
    } catch (error) {
      toast.error('Erro ao atualizar módulos');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLimits = async () => {
    if (!matrixCompany?.id) {
      toast.error('Empresa matriz não encontrada');
      return;
    }

    try {
      setLoading(true);
      await subscriptionService.updateCompanyLimits(matrixCompany.id, {
        ...limits,
        planType: 'custom',
      });
      toast.success('Limites atualizados!');
      loadSubscription();
    } catch (error) {
      toast.error('Erro ao atualizar limites');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleCode: string) => {
    if (selectedModules.includes(moduleCode)) {
      setSelectedModules(selectedModules.filter(m => m !== moduleCode));
    } else {
      setSelectedModules([...selectedModules, moduleCode]);
    }
  };

  const toggleCustomModule = (moduleCode: string) => {
    if (customModules.includes(moduleCode)) {
      setCustomModules(customModules.filter(m => m !== moduleCode));
    } else {
      setCustomModules([...customModules, moduleCode]);
    }
  };

  return (
    <>
      {loading ? (
        <Layout>
          <SubscriptionManagementShimmer />
        </Layout>
      ) : !subscription ? (
        <Layout>
          <PageContainer>
            <PageContent>
              <S.EmptyState>
                <h2>Assinatura não encontrada</h2>
              </S.EmptyState>
            </PageContent>
          </PageContainer>
        </Layout>
      ) : (
        <Layout>
          <PageContainer>
            <PageContent>
              <PageHeader>
                <PageTitleContainer>
                  <PageTitle>Gerenciar Assinatura</PageTitle>
                  <PageSubtitle>
                    {subscription.user?.name || subscription.userName} -{' '}
                    {subscription.user?.email || subscription.userEmail}
                  </PageSubtitle>
                </PageTitleContainer>
                <S.BackButton
                  onClick={() => navigate('/subscription-management')}
                >
                  <MdArrowBack size={20} />
                  Voltar
                </S.BackButton>
              </PageHeader>

              <S.Tabs>
                <S.Tab
                  $active={activeTab === 'general'}
                  onClick={() => setActiveTab('general')}
                >
                  Geral
                </S.Tab>
                <S.Tab
                  $active={activeTab === 'plan'}
                  onClick={() => setActiveTab('plan')}
                >
                  Mudar Plano
                </S.Tab>
                <S.Tab
                  $active={activeTab === 'modules'}
                  onClick={() => setActiveTab('modules')}
                >
                  Módulos por Empresa
                </S.Tab>
                <S.Tab
                  $active={activeTab === 'limits'}
                  onClick={() => setActiveTab('limits')}
                >
                  Limites
                </S.Tab>
                <S.Tab
                  $active={activeTab === 'actions'}
                  onClick={() => setActiveTab('actions')}
                >
                  Ações
                </S.Tab>
              </S.Tabs>

              {activeTab === 'general' && (
                <S.TabContent>
                  <S.FormGroup>
                    <S.Label>Plano Atual</S.Label>
                    <S.InfoValue>
                      {subscription.plan?.name || subscription.planName} - R${' '}
                      {Number(
                        subscription.plan?.price ||
                          subscription.monthlyPrice ||
                          0
                      ).toFixed(2)}
                      /mês
                    </S.InfoValue>
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>
                      Empresas ({subscription.companies?.list?.length || 0})
                    </S.Label>
                    <S.InfoValue>
                      {subscription.companies?.list
                        ?.map((c: any) => c.name)
                        .join(', ') || '-'}
                    </S.InfoValue>
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>Data de Início</S.Label>
                    <S.InfoValue>
                      {new Date(subscription.startDate).toLocaleDateString(
                        'pt-BR'
                      )}
                    </S.InfoValue>
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>Data de Término</S.Label>
                    <S.Input
                      type='date'
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>Observações</S.Label>
                    <S.Textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={4}
                    />
                  </S.FormGroup>

                  <S.SaveButton
                    onClick={handleUpdateGeneral}
                    disabled={loading}
                  >
                    <MdSave size={18} />
                    Salvar Alterações
                  </S.SaveButton>
                </S.TabContent>
              )}

              {activeTab === 'plan' && (
                <S.TabContent>
                  <S.Alert $type='info'>
                    ℹ️ Ao mudar o plano, TODAS as empresas e usuários desta
                    assinatura serão afetados automaticamente.
                  </S.Alert>

                  <S.FormGroup>
                    <S.Label>Plano Atual</S.Label>
                    <S.InfoValue>
                      {subscription.plan?.name || subscription.planName} (
                      {subscription.plan?.type || subscription.planType})
                    </S.InfoValue>
                  </S.FormGroup>

                  <S.FormGroup>
                    <S.Label>Novo Plano</S.Label>
                    <S.Select
                      value={newPlanId}
                      onChange={e => {
                        setNewPlanId(e.target.value);
                        const plan = availablePlans.find(
                          p => p.id === e.target.value
                        );
                        if (plan?.type === 'custom') {
                          setCustomModules(subscription.activeModules || []);
                        }
                      }}
                    >
                      <option value=''>Selecione um plano...</option>
                      {availablePlans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - R$ {Number(plan.price).toFixed(2)}
                        </option>
                      ))}
                    </S.Select>
                  </S.FormGroup>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 16,
                    }}
                  >
                    <S.FormGroup>
                      <S.Label>Tipo de Mudança</S.Label>
                      <S.Select
                        value={planChangeType}
                        onChange={e => setPlanChangeType(e.target.value as any)}
                      >
                        <option value='upgrade'>Upgrade</option>
                        <option value='downgrade'>Downgrade</option>
                        <option value='standard_to_custom'>
                          Padrão para Custom
                        </option>
                        <option value='custom_to_standard'>
                          Custom para Padrão
                        </option>
                      </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Motivo</S.Label>
                      <S.Select
                        value={planReason}
                        onChange={e => setPlanReason(e.target.value as any)}
                      >
                        <option value='user_request'>
                          Solicitação do Usuário
                        </option>
                        <option value='admin_decision'>
                          Decisão Administrativa
                        </option>
                        <option value='business_growth'>
                          Crescimento do Negócio
                        </option>
                        <option value='cost_optimization'>
                          Otimização de Custos
                        </option>
                        <option value='payment_failed'>
                          Falha no Pagamento
                        </option>
                        <option value='plan_expired'>Plano Expirado</option>
                        <option value='feature_usage'>
                          Uso de Funcionalidades
                        </option>
                      </S.Select>
                    </S.FormGroup>
                  </div>

                  <S.FormGroup>
                    <S.Label>Observações</S.Label>
                    <S.Input
                      value={planNotes}
                      onChange={e => setPlanNotes(e.target.value)}
                      placeholder='Detalhes sobre a mudança de plano...'
                    />
                  </S.FormGroup>

                  {/* Módulos customizados (só para plano Custom) */}
                  {newPlanId &&
                    availablePlans.find(p => p.id === newPlanId)?.type ===
                      'custom' && (
                      <>
                        <S.Alert $type='warning'>
                          ⚠️ Plano Personalizado: Selecione os módulos desejados
                          abaixo
                        </S.Alert>
                        <S.ModulesGrid>
                          {Object.entries(MODULE_LABELS).map(
                            ([code, label]) => (
                              <S.ModuleCheckbox key={code}>
                                <input
                                  type='checkbox'
                                  checked={customModules.includes(code)}
                                  onChange={() => toggleCustomModule(code)}
                                />
                                <span>{label}</span>
                              </S.ModuleCheckbox>
                            )
                          )}
                        </S.ModulesGrid>
                      </>
                    )}

                  <S.SaveButton
                    onClick={handleChangePlan}
                    disabled={loading || !newPlanId}
                  >
                    <MdSave size={18} />
                    Alterar Plano
                  </S.SaveButton>
                </S.TabContent>
              )}

              {activeTab === 'modules' && (
                <S.TabContent>
                  <S.Alert $type='info'>
                    ℹ️ Esta aba modifica módulos da empresa matriz:{' '}
                    <strong>{matrixCompany?.name || '-'}</strong>. As mudanças
                    afetarão TODAS as empresas desta assinatura. Os módulos
                    atuais já estão pré-selecionados.
                  </S.Alert>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 16,
                    }}
                  >
                    <S.FormGroup>
                      <S.Label>Tipo de Mudança</S.Label>
                      <S.Select
                        value={modulesChangeType}
                        onChange={e =>
                          setModulesChangeType(e.target.value as any)
                        }
                      >
                        <option value='module_addition'>
                          Adição de Módulos
                        </option>
                        <option value='module_removal'>
                          Remoção de Módulos
                        </option>
                      </S.Select>
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Motivo</S.Label>
                      <S.Select
                        value={modulesReason}
                        onChange={e => setModulesReason(e.target.value as any)}
                      >
                        <option value='user_request'>
                          Solicitação do Usuário
                        </option>
                        <option value='admin_decision'>
                          Decisão Administrativa
                        </option>
                        <option value='business_growth'>
                          Crescimento do Negócio
                        </option>
                        <option value='cost_optimization'>
                          Otimização de Custos
                        </option>
                        <option value='feature_usage'>
                          Uso de Funcionalidades
                        </option>
                      </S.Select>
                    </S.FormGroup>
                  </div>

                  <S.FormGroup>
                    <S.Label>Observações</S.Label>
                    <S.Input
                      value={modulesNotes}
                      onChange={e => setModulesNotes(e.target.value)}
                      placeholder='Detalhes sobre a mudança...'
                    />
                  </S.FormGroup>

                  <S.ModulesGrid>
                    {Object.entries(MODULE_LABELS).map(([code, label]) => (
                      <S.ModuleCheckbox key={code}>
                        <input
                          type='checkbox'
                          checked={selectedModules.includes(code)}
                          onChange={() => toggleModule(code)}
                        />
                        <span>{label}</span>
                      </S.ModuleCheckbox>
                    ))}
                  </S.ModulesGrid>

                  <S.SaveButton onClick={handleSaveModules} disabled={loading}>
                    <MdSave size={18} />
                    Salvar Módulos
                  </S.SaveButton>
                </S.TabContent>
              )}

              {activeTab === 'limits' && (
                <S.TabContent>
                  <S.Alert $type='info'>
                    ℹ️ Configurando limites personalizados para empresa matriz:{' '}
                    <strong>{matrixCompany?.name || '-'}</strong>. Os limites
                    são compartilhados entre TODAS as empresas.
                  </S.Alert>

                  <S.LimitsGrid>
                    <S.FormGroup>
                      <S.Label>Máximo de Usuários</S.Label>
                      <S.Input
                        type='number'
                        value={limits.maxUsers}
                        onChange={e =>
                          setLimits({ ...limits, maxUsers: +e.target.value })
                        }
                      />
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Máximo de Propriedades</S.Label>
                      <S.Input
                        type='number'
                        value={limits.maxProperties}
                        onChange={e =>
                          setLimits({
                            ...limits,
                            maxProperties: +e.target.value,
                          })
                        }
                      />
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Armazenamento (GB)</S.Label>
                      <S.Input
                        type='number'
                        value={limits.storageGB}
                        onChange={e =>
                          setLimits({ ...limits, storageGB: +e.target.value })
                        }
                      />
                    </S.FormGroup>

                    <S.FormGroup>
                      <S.Label>Chamadas de API (mês)</S.Label>
                      <S.Input
                        type='number'
                        value={limits.apiCalls}
                        onChange={e =>
                          setLimits({ ...limits, apiCalls: +e.target.value })
                        }
                      />
                    </S.FormGroup>
                  </S.LimitsGrid>

                  <S.SaveButton onClick={handleSaveLimits} disabled={loading}>
                    <MdSave size={18} />
                    Salvar Limites
                  </S.SaveButton>
                </S.TabContent>
              )}

              {activeTab === 'actions' && (
                <S.TabContent>
                  <S.ActionsGrid>
                    <S.ActionCard>
                      <S.ActionTitle>⏰ Estender Assinatura</S.ActionTitle>
                      <S.FormGroup>
                        <S.Label>Dias</S.Label>
                        <S.Input
                          type='number'
                          value={extendDays}
                          onChange={e => setExtendDays(+e.target.value)}
                        />
                      </S.FormGroup>
                      <S.FormGroup>
                        <S.Label>Motivo</S.Label>
                        <S.Input
                          value={extendReason}
                          onChange={e => setExtendReason(e.target.value)}
                          placeholder='Cortesia, bônus, etc...'
                        />
                      </S.FormGroup>
                      <S.ActionButton
                        $variant='primary'
                        onClick={handleExtend}
                        disabled={loading}
                      >
                        <MdAccessTime size={18} />
                        Estender {extendDays} dias
                      </S.ActionButton>
                    </S.ActionCard>

                    <S.ActionCard>
                      <S.ActionTitle>🔐 Status da Assinatura</S.ActionTitle>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          marginBottom: 12,
                        }}
                      >
                        Status atual:{' '}
                        <strong>
                          {translateSubscriptionStatus(subscription.status)}
                        </strong>
                      </p>
                      {subscription.status === 'active' ? (
                        <S.ActionButton
                          $variant='danger'
                          onClick={() => handleToggle(false)}
                          disabled={loading}
                        >
                          <MdBlock size={18} />
                          Suspender Assinatura
                        </S.ActionButton>
                      ) : (
                        <S.ActionButton
                          $variant='success'
                          onClick={() => handleToggle(true)}
                          disabled={loading}
                        >
                          <MdCheckCircle size={18} />
                          Reativar Assinatura
                        </S.ActionButton>
                      )}
                    </S.ActionCard>
                  </S.ActionsGrid>
                </S.TabContent>
              )}

              {/* Modal de motivo para suspender/reativar */}
              <ReasonModal
                isOpen={reasonModalOpen}
                onClose={() => {
                  setReasonModalOpen(false);
                  setPendingAction(null);
                }}
                onConfirm={handleConfirmToggle}
                title={reasonModalTitle}
                placeholder={
                  pendingAction === 'suspend'
                    ? 'Ex: Atraso no pagamento, solicitação do cliente...'
                    : 'Ex: Pagamento confirmado, regularização...'
                }
              />
            </PageContent>
          </PageContainer>
        </Layout>
      )}
    </>
  );
};

export default SubscriptionDetailsPage;
