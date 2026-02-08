import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdArrowBack,
  MdToggleOn,
  MdToggleOff,
  MdInfo,
  MdSave,
  MdClose,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { automationApi } from '../services/automationApi';
import type { Automation, AutomationConfig } from '../types/automation';
import { toast } from 'react-toastify';
import {
  Page,
  FullBleed,
  Container,
  Header,
  TitleRow,
  Title,
  BackButton,
  Card,
  TooltipIcon,
  LabelWithTooltip,
  Row,
  Field,
  Label,
  Input,
  Textarea,
  CheckboxRow,
  CheckboxItem,
  Actions,
  Button,
  StatusPill,
  SectionTitle,
  Inline,
  Hint,
  EmptyState,
  Shimmer,
  ShimmerField,
  ShimmerRow,
} from '../styles/pages/AutomationDetailsPageStyles';

const AutomationDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [automation, setAutomation] = useState<Automation | null>(null);
  const [config, setConfig] = useState<AutomationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  const loadDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await automationApi.getAutomationById(id);
      setAutomation(data);
      setConfig({
        ...(data.config || {}),
        customMessage:
          data.config?.customMessage ??
          'Ex: Olá {name}, o pagamento do imóvel {property} vence em {days} dias. Valor: {value}.',
      });
    } catch (err: any) {
      console.error('Erro ao carregar automação:', err);
      toast.error(err.message || 'Erro ao carregar automação');
      navigate('/automations');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleToggle = async () => {
    if (!automation) return;
    try {
      setToggling(true);
      const updated = await automationApi.toggleAutomation(
        automation.id,
        !automation.isActive
      );
      setAutomation(updated);
      toast.success(
        updated.isActive ? 'Automação ativada' : 'Automação desativada'
      );
    } catch (err: any) {
      console.error('Erro ao alternar automação:', err);
      toast.error(err.message || 'Erro ao alternar automação');
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async () => {
    if (!automation || !config) return;
    try {
      setSaving(true);
      const updated = await automationApi.updateAutomationConfig(
        automation.id,
        { config }
      );
      setAutomation(updated);
      setConfig(updated.config || {});
      toast.success('Configurações salvas com sucesso');
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      toast.error(err.message || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (partial: Partial<AutomationConfig>) => {
    setConfig(prev => ({ ...(prev || {}), ...partial }));
  };

  const formatRecipientLabel = (key: string): string => {
    const labels: Record<string, string> = {
      corretor: 'Corretor',
      cliente: 'Cliente',
      proprietario: 'Proprietário',
      admin: 'Gerenciador',
      manager: 'Gerente',
      lead: 'Lead',
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  if (loading) {
    return (
      <Layout>
        <Page>
          <FullBleed>
            <Container>
              <Header>
                <TitleRow>
                  <div>
                    <Shimmer
                      style={{
                        height: '32px',
                        width: '300px',
                        marginBottom: '8px',
                      }}
                    />
                    <Shimmer style={{ height: '20px', width: '200px' }} />
                  </div>
                </TitleRow>
                <BackButton onClick={() => navigate('/automations')}>
                  <MdArrowBack size={18} /> Voltar
                </BackButton>
              </Header>

              <Card>
                <Inline
                  style={{
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Shimmer style={{ height: '36px', width: '100px' }} />
                  <Inline>
                    <Shimmer style={{ height: '38px', width: '100px' }} />
                    <Shimmer style={{ height: '38px', width: '100px' }} />
                  </Inline>
                </Inline>
              </Card>

              <Card>
                <Shimmer
                  style={{
                    height: '24px',
                    width: '150px',
                    marginBottom: '20px',
                  }}
                />
                <ShimmerRow>
                  <ShimmerField>
                    <Shimmer
                      style={{
                        height: '20px',
                        width: '180px',
                        marginBottom: '10px',
                      }}
                    />
                    <Shimmer style={{ height: '120px', width: '100%' }} />
                  </ShimmerField>
                  <ShimmerField>
                    <Shimmer
                      style={{
                        height: '20px',
                        width: '120px',
                        marginBottom: '10px',
                      }}
                    />
                    <Shimmer style={{ height: '40px', width: '100%' }} />
                    <Shimmer
                      style={{
                        height: '20px',
                        width: '120px',
                        marginTop: '16px',
                        marginBottom: '10px',
                      }}
                    />
                    <Shimmer style={{ height: '40px', width: '100%' }} />
                    <Shimmer
                      style={{
                        height: '20px',
                        width: '150px',
                        marginTop: '16px',
                      }}
                    />
                  </ShimmerField>
                </ShimmerRow>
                <ShimmerField style={{ marginTop: '20px' }}>
                  <Shimmer
                    style={{
                      height: '20px',
                      width: '120px',
                      marginBottom: '10px',
                    }}
                  />
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(140px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <Shimmer
                        key={idx}
                        style={{ height: '40px', width: '100%' }}
                      />
                    ))}
                  </div>
                </ShimmerField>
                <ShimmerField style={{ marginTop: '20px' }}>
                  <Shimmer
                    style={{
                      height: '20px',
                      width: '80px',
                      marginBottom: '10px',
                    }}
                  />
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(140px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <Shimmer
                        key={idx}
                        style={{ height: '40px', width: '100%' }}
                      />
                    ))}
                  </div>
                </ShimmerField>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    marginTop: '8px',
                    paddingTop: '20px',
                  }}
                >
                  <Shimmer style={{ height: '38px', width: '100px' }} />
                  <Shimmer style={{ height: '38px', width: '100px' }} />
                </div>
              </Card>
            </Container>
          </FullBleed>
        </Page>
      </Layout>
    );
  }

  if (!automation || !config) {
    return (
      <Layout>
        <Page>
          <FullBleed>
            <Container>
              <Header>
                <TitleRow>
                  <Title>Automação não encontrada</Title>
                </TitleRow>
                <BackButton onClick={() => navigate('/automations')}>
                  <MdArrowBack size={18} /> Voltar
                </BackButton>
              </Header>
              <EmptyState>Não foi possível carregar esta automação.</EmptyState>
            </Container>
          </FullBleed>
        </Page>
      </Layout>
    );
  }

  return (
    <Layout>
      <Page>
        <FullBleed>
          <Container>
            <Header>
              <TitleRow>
                <div>
                  <Title>{automation.name}</Title>
                  <Hint>{automation.description || 'Sem descrição'}</Hint>
                </div>
              </TitleRow>
              <BackButton onClick={() => navigate('/automations')}>
                <MdArrowBack size={18} /> Voltar
              </BackButton>
            </Header>

            <Card>
              <Inline
                style={{
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <StatusPill
                  $active={automation.isActive}
                  title={
                    automation.isActive
                      ? 'Esta automação está ativa e enviando notificações'
                      : 'Esta automação está inativa e não enviará notificações'
                  }
                >
                  {automation.isActive ? (
                    <MdToggleOn size={20} />
                  ) : (
                    <MdToggleOff size={20} />
                  )}
                  {automation.isActive ? 'Ativa' : 'Inativa'}
                </StatusPill>
                <Inline>
                  <Button
                    $variant='secondary'
                    onClick={() =>
                      navigate(`/automations/${automation.id}/history`)
                    }
                    title='Visualizar histórico de execuções desta automação'
                  >
                    Histórico
                  </Button>
                  <Button
                    $variant='secondary'
                    onClick={handleToggle}
                    disabled={toggling}
                    title={
                      automation.isActive
                        ? 'Desativar esta automação'
                        : 'Ativar esta automação'
                    }
                  >
                    {toggling
                      ? 'Processando...'
                      : automation.isActive
                        ? 'Desativar'
                        : 'Ativar'}
                  </Button>
                </Inline>
              </Inline>
            </Card>

            <Card>
              <LabelWithTooltip>
                <SectionTitle>Configuração</SectionTitle>
                <TooltipIcon title='Configure os detalhes de como e quando as notificações serão enviadas'>
                  <MdInfo size={18} />
                </TooltipIcon>
              </LabelWithTooltip>

              <Row>
                <Field>
                  <LabelWithTooltip>
                    <Label>Mensagem personalizada</Label>
                    <TooltipIcon title='Personalize a mensagem que será enviada. Use variáveis: {days} para dias, {name} para nome, {property} para propriedade, {value} para valor'>
                      <MdInfo size={16} />
                    </TooltipIcon>
                  </LabelWithTooltip>
                  <Textarea
                    value={config.customMessage || ''}
                    placeholder='Use variáveis: {days}, {name}, {property}, {value}'
                    onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        handleConfigChange({ customMessage: value });
                      }
                    }}
                    maxLength={500}
                  />
                  <Hint style={{ marginTop: 4, fontSize: '0.75rem' }}>
                    {(config.customMessage || '').length}/500 caracteres
                  </Hint>
                </Field>
                <Field>
                  <LabelWithTooltip>
                    <Label>Timing (dias)</Label>
                    <TooltipIcon title='Defina em quantos dias antes do evento a notificação será enviada. Ex: 7,3,1 enviará notificações 7 dias antes, 3 dias antes e 1 dia antes'>
                      <MdInfo size={16} />
                    </TooltipIcon>
                  </LabelWithTooltip>
                  <Input
                    value={(config.timing?.days || []).join(', ')}
                    placeholder='Ex: 7,3,1'
                    onChange={e =>
                      handleConfigChange({
                        timing: {
                          ...(config.timing || {}),
                          days: e.target.value
                            .split(',')
                            .map(v => v.trim())
                            .filter(Boolean)
                            .map(Number),
                        },
                      })
                    }
                  />
                  <div style={{ marginTop: '16px' }}>
                    <LabelWithTooltip>
                      <Label>Timing (horas)</Label>
                      <TooltipIcon title='Defina em quantas horas antes do evento a notificação será enviada. Ex: 24,1 enviará notificações 24 horas antes e 1 hora antes'>
                        <MdInfo size={16} />
                      </TooltipIcon>
                    </LabelWithTooltip>
                    <Input
                      value={(config.timing?.hours || []).join(', ')}
                      placeholder='Ex: 24,1'
                      onChange={e =>
                        handleConfigChange({
                          timing: {
                            ...(config.timing || {}),
                            hours: e.target.value
                              .split(',')
                              .map(v => v.trim())
                              .filter(Boolean)
                              .map(Number),
                          },
                        })
                      }
                    />
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <Inline>
                      <input
                        type='checkbox'
                        checked={config.timing?.immediate || false}
                        onChange={e =>
                          handleConfigChange({
                            timing: {
                              ...(config.timing || {}),
                              immediate: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>Imediato após evento</span>
                      <TooltipIcon title='Se marcado, a notificação será enviada imediatamente após o evento ocorrer'>
                        <MdInfo size={16} />
                      </TooltipIcon>
                    </Inline>
                  </div>
                </Field>
              </Row>

              <Field>
                <LabelWithTooltip>
                  <Label>Destinatários</Label>
                  <TooltipIcon title='Selecione quem receberá as notificações desta automação. Você pode selecionar múltiplos destinatários'>
                    <MdInfo size={16} />
                  </TooltipIcon>
                </LabelWithTooltip>
                <CheckboxRow>
                  {(
                    [
                      'corretor',
                      'cliente',
                      'proprietario',
                      'admin',
                      'manager',
                      'lead',
                    ] as const
                  ).map(key => (
                    <CheckboxItem key={key}>
                      <input
                        type='checkbox'
                        checked={config.recipients?.[key] || false}
                        onChange={e =>
                          handleConfigChange({
                            recipients: {
                              ...(config.recipients || {}),
                              [key]: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>{formatRecipientLabel(key)}</span>
                    </CheckboxItem>
                  ))}
                </CheckboxRow>
              </Field>

              <Field>
                <LabelWithTooltip>
                  <Label>Canais</Label>
                  <TooltipIcon title='Selecione os canais pelos quais as notificações serão enviadas. Email: notificações por e-mail. In-App: notificações dentro do sistema'>
                    <MdInfo size={16} />
                  </TooltipIcon>
                </LabelWithTooltip>
                <CheckboxRow>
                  {(['email', 'inApp'] as const).map(key => (
                    <CheckboxItem key={key}>
                      <input
                        type='checkbox'
                        checked={config.channels?.[key] || false}
                        onChange={e =>
                          handleConfigChange({
                            channels: {
                              ...(config.channels || {}),
                              [key]: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>{key === 'inApp' ? 'In-App' : 'Email'}</span>
                    </CheckboxItem>
                  ))}
                </CheckboxRow>
              </Field>

              <Actions>
                <Button
                  $variant='primary'
                  onClick={handleSave}
                  disabled={saving}
                >
                  <MdSave size={18} /> {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button onClick={() => navigate('/automations')}>
                  <MdClose size={18} /> Cancelar
                </Button>
              </Actions>
            </Card>
          </Container>
        </FullBleed>
      </Page>
    </Layout>
  );
};

export default AutomationDetailsPage;
