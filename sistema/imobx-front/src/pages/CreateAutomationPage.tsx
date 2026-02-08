import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  MdArrowBack,
  MdCheckCircle,
  MdAccessTime,
  MdBolt,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { automationApi } from '../services/automationApi';
import { useAuth } from '../hooks/useAuth';
import { useCompany } from '../hooks/useCompany';
import { toast } from 'react-toastify';
import type { AutomationTemplate, Automation } from '../types/automation';
import {
  PageSubtitle,
  PageTitle,
  PageTitleContainer,
  HeaderActions,
} from '../styles/pages/AutomationsPageStyles';
import {
  BackButton,
  StyledPageContainer,
  StyledPageContent,
  StyledPageHeader,
  Grid,
  TemplateCard,
  TemplateHeader,
  TemplateTitle,
  Badge,
  TemplateDescription,
  MetaRow,
  MetaItem,
  ActionRow,
  PrimaryButton,
  FullBleed,
  Shimmer,
  ShimmerCard,
  ShimmerRow,
  Placeholder,
} from '../styles/pages/CreateAutomationPageStyles';

const CreateAutomationPage: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const { selectedCompany } = useCompany();

  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [existingTypes, setExistingTypes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const companyId = useMemo(() => {
    const user = getCurrentUser();
    const storedCompanyId =
      typeof window !== 'undefined'
        ? localStorage.getItem('dream_keys_selected_company_id')
        : null;
    return selectedCompany?.id || user?.companyId || storedCompanyId || null;
  }, [getCurrentUser, selectedCompany]);

  const loadData = useCallback(async () => {
    if (!companyId) return;
    try {
      setIsLoading(true);
      const [tplResp, autoResp]: any = await Promise.all([
        automationApi.getTemplates(),
        automationApi.getAutomations({ companyId }),
      ]);

      const listTpl = Array.isArray(tplResp)
        ? tplResp
        : tplResp?.templates
          ? tplResp.templates
          : tplResp?.data || [];
      setTemplates(listTpl);

      const autos: Automation[] = Array.isArray(autoResp?.automations)
        ? autoResp.automations
        : autoResp?.data || [];
      setExistingTypes(new Set(autos.map(a => a.type)));
    } catch (err: any) {
      console.error('Erro ao carregar templates/automações:', err);
      toast.error('Não foi possível carregar templates/automações.');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCategoryLabel = (category?: string) => {
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
        return category || 'Outros';
    }
  };

  const formatTypeLabel = (type?: string) => {
    if (!type) return 'Tipo não informado';
    const map: Record<string, string> = {
      checklist_automatic: 'Checklist Automático',
      checklist_reminder: 'Lembrete de Checklist',
      payment_reminder: 'Lembrete de Pagamento',
      payment_overdue: 'Pagamento Atrasado',
      contract_expiring: 'Contrato Expirando',
      contract_expired: 'Contrato Expirado',
      client_followup: 'Follow-up de Cliente',
      mcmv_lead_followup: 'Follow-up de Lead MCMV',
      lead_followup: 'Follow-up de Leads',
      match_notification: 'Notificação de Match',
      subscription_expiring: 'Assinatura Expirando',
      subscription_expired: 'Assinatura Expirada',
      inspection_reminder: 'Lembrete de Vistoria',
      appointment_reminder: 'Lembrete de Agendamento',
      expense_reminder: 'Lembrete de Despesa',
      expense_overdue: 'Despesa Vencida',
    };
    return map[type] || type;
  };

  const handleCreateFromTemplate = async (templateId: string) => {
    if (!companyId) {
      toast.error('Selecione uma empresa para criar automações.');
      return;
    }

    try {
      setCreatingId(templateId);
      await automationApi.createAutomationFromTemplate(templateId, {
        companyId,
      });
      toast.success('Automação criada com sucesso!');
      navigate('/automations');
    } catch (err: any) {
      console.error('Erro ao criar automação:', err);
      toast.error(err.message || 'Erro ao criar automação');
    } finally {
      setCreatingId(null);
    }
  };

  return (
    <Layout>
      <StyledPageContainer>
        <StyledPageContent>
          <FullBleed>
            <StyledPageHeader>
              <PageTitleContainer>
                <PageTitle>Nova Automação</PageTitle>
                <PageSubtitle>
                  Escolha um template para criar rapidamente uma automação com
                  as configurações padrão.
                </PageSubtitle>
              </PageTitleContainer>
              <HeaderActions>
                <BackButton onClick={() => navigate('/automations')}>
                  <MdArrowBack size={18} /> Voltar
                </BackButton>
              </HeaderActions>
            </StyledPageHeader>

            {isLoading ? (
              <Grid>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <ShimmerCard key={idx}>
                    <ShimmerRow>
                      <Shimmer style={{ width: '40%' }} />
                      <Shimmer style={{ width: '25%', height: 14 }} />
                    </ShimmerRow>
                    <Shimmer style={{ height: 14 }} />
                    <Shimmer style={{ height: 14, width: '80%' }} />
                    <Shimmer style={{ height: 14, width: '60%' }} />
                    <ShimmerRow>
                      <Shimmer style={{ width: '50%', height: 14 }} />
                      <Shimmer style={{ width: '40%', height: 14 }} />
                    </ShimmerRow>
                    <Shimmer style={{ width: '30%', height: 32 }} />
                  </ShimmerCard>
                ))}
              </Grid>
            ) : templates.length === 0 ? (
              <Placeholder>
                Nenhum template disponível no momento. Tente novamente mais
                tarde.
              </Placeholder>
            ) : (
              <Grid>
                {templates.map(template => (
                  <TemplateCard key={template.id}>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <TemplateHeader>
                        <TemplateTitle>{template.name}</TemplateTitle>
                      </TemplateHeader>
                      <Badge $variant={template.category as any}>
                        {formatCategoryLabel(template.category)}
                      </Badge>
                      <TemplateDescription>
                        {template.description}
                      </TemplateDescription>
                      <MetaRow>
                        <MetaItem>
                          <MdBolt size={16} />
                          {formatTypeLabel(template.type)}
                        </MetaItem>
                        <MetaItem>
                          <MdCheckCircle size={16} color='#22c55e' />
                          Padrão habilitado
                        </MetaItem>
                        {template.defaultConfig?.timing?.days && (
                          <MetaItem>
                            <MdAccessTime size={16} />
                            Dias:{' '}
                            {template.defaultConfig.timing.days.join(', ')}
                          </MetaItem>
                        )}
                        {existingTypes.has(template.type) && (
                          <MetaItem>
                            <MdCheckCircle size={16} color='#22c55e' />
                            Já configurada
                          </MetaItem>
                        )}
                      </MetaRow>
                    </div>
                    <ActionRow>
                      <PrimaryButton
                        onClick={() => handleCreateFromTemplate(template.id)}
                        disabled={
                          !!creatingId || existingTypes.has(template.type)
                        }
                      >
                        {existingTypes.has(template.type)
                          ? 'Já configurada'
                          : creatingId === template.id
                            ? 'Criando...'
                            : 'Criar com este template'}
                      </PrimaryButton>
                    </ActionRow>
                  </TemplateCard>
                ))}
              </Grid>
            )}
          </FullBleed>
        </StyledPageContent>
      </StyledPageContainer>
    </Layout>
  );
};

export default CreateAutomationPage;
