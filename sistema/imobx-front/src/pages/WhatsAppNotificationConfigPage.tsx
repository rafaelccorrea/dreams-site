import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdSave,
  MdArrowBack,
  MdInfo,
  MdNotificationsActive,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { whatsappApi } from '../services/whatsappApi';
import { showSuccess, showError } from '../utils/notifications';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useAuth } from '../hooks/useAuth';
import { WhatsAppConfigShimmer } from '../components/shimmer/WhatsAppConfigShimmer';
import type {
  NotificationConfig,
  UpdateNotificationConfigRequest,
} from '../types/whatsapp';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  @media (max-width: 480px) {
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 500;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 12px 14px;
  }
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 24px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }

  ${props => {
    if (props.$variant === 'secondary') {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.border};
          transform: translateY(-1px);
        }
      `;
    }
    return `
      background: ${props.theme.colors.primary};
      color: white;
      
      &:hover:not(:disabled) {
        background: ${props.theme.colors.primaryDark};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${props.theme.colors.primary}30;
      }
    `;
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.error};
  padding: 12px;
  background: ${props => props.theme.colors.error}15;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.error}30;
  margin-bottom: 20px;
`;

const PermissionDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
`;

const PermissionDeniedIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.error}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const PermissionDeniedTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

const PermissionDeniedText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  max-width: 600px;
  line-height: 1.6;
`;

const WhatsAppNotificationConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const [config, setConfig] = useState<UpdateNotificationConfigRequest>({
    onTimeMinutes: 15,
    delayedMinutes: 30,
    criticalMinutes: 60,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = getCurrentUser();
  const userRole = user?.role?.toLowerCase();
  const isAdminOrManager = userRole
    ? ['admin', 'manager', 'master'].includes(userRole)
    : false;
  const canManageConfig =
    (permissionsContext?.hasPermission('whatsapp:manage_config') ?? false) &&
    isAdminOrManager;

  useEffect(() => {
    if (canManageConfig) {
      loadConfig();
    } else {
      setLoading(false);
    }
  }, [canManageConfig]);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await whatsappApi.getNotificationConfig();
      setConfig({
        onTimeMinutes: response.onTimeMinutes,
        delayedMinutes: response.delayedMinutes,
        criticalMinutes: response.criticalMinutes,
        isActive: response.isActive,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setConfig({
          onTimeMinutes: 15,
          delayedMinutes: 30,
          criticalMinutes: 60,
          isActive: true,
        });
      } else {
        console.error('Erro ao carregar configuração de notificações:', error);
        setError('Erro ao carregar configuração de notificações');
        showError('Erro ao carregar configuração de notificações');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageConfig) {
      showError('Você não tem permissão para gerenciar esta configuração');
      return;
    }

    if (config.onTimeMinutes! >= config.delayedMinutes!) {
      const errorMsg = 'O tempo "Em Dia" deve ser menor que o tempo "Atrasada"';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    if (config.delayedMinutes! >= config.criticalMinutes!) {
      const errorMsg =
        'O tempo "Atrasada" deve ser menor que o tempo "Crítica"';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await whatsappApi.updateNotificationConfig(config);
      showSuccess('Configuração de notificações salva com sucesso!');
      loadConfig();
    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      const errorMessage =
        error.message || 'Erro ao salvar configuração de notificações';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!canManageConfig) {
    return (
      <Layout>
        <PageContainer>
          <PermissionDeniedContainer>
            <PermissionDeniedIcon>
              <MdInfo size={64} color='#EF4444' />
            </PermissionDeniedIcon>
            <PermissionDeniedTitle>Acesso Negado</PermissionDeniedTitle>
            <PermissionDeniedText>
              Você não tem permissão para acessar esta funcionalidade.
              <br />
              <br />
              Entre em contato com o administrador do sistema para solicitar
              acesso.
            </PermissionDeniedText>
            <BackButton
              onClick={() => navigate('/integrations')}
              style={{ marginTop: '24px' }}
            >
              <MdArrowBack size={18} />
              Voltar para Integrações
            </BackButton>
          </PermissionDeniedContainer>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderTop>
            <TitleSection>
              <Title>
                <MdNotificationsActive size={32} color='#F59E0B' />
                Configuração de Notificações por Tempo
              </Title>
              <Subtitle>
                Configure os tempos para classificação de mensagens do WhatsApp
              </Subtitle>
            </TitleSection>
            <BackButton onClick={() => navigate('/integrations')}>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </HeaderTop>
        </PageHeader>

        <PageBody>
          {loading ? (
            <WhatsAppConfigShimmer />
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <div>
                <SectionHeader>
                  <SectionIcon>
                    <MdNotificationsActive size={20} />
                  </SectionIcon>
                  <SectionTitle>Configurações de Tempo</SectionTitle>
                </SectionHeader>

                <FormGroup>
                  <Label>
                    Tempo "Em Dia" (minutos){' '}
                    <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='number'
                    min='1'
                    value={config.onTimeMinutes || 15}
                    onChange={e =>
                      setConfig({
                        ...config,
                        onTimeMinutes: parseInt(e.target.value) || 15,
                      })
                    }
                    required
                    disabled={saving}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    Tempo "Atrasada" (minutos){' '}
                    <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='number'
                    min='1'
                    value={config.delayedMinutes || 30}
                    onChange={e =>
                      setConfig({
                        ...config,
                        delayedMinutes: parseInt(e.target.value) || 30,
                      })
                    }
                    required
                    disabled={saving}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    Tempo "Crítica" (minutos){' '}
                    <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='number'
                    min='1'
                    value={config.criticalMinutes || 60}
                    onChange={e =>
                      setConfig({
                        ...config,
                        criticalMinutes: parseInt(e.target.value) || 60,
                      })
                    }
                    required
                    disabled={saving}
                  />
                </FormGroup>

                <FormGroup>
                  <CheckboxLabel>
                    <input
                      type='checkbox'
                      checked={config.isActive !== false}
                      onChange={e =>
                        setConfig({ ...config, isActive: e.target.checked })
                      }
                      disabled={saving}
                    />
                    <span>Notificações Ativas</span>
                  </CheckboxLabel>
                </FormGroup>
              </div>

              <div>
                <FooterActions>
                  <Button
                    type='button'
                    $variant='secondary'
                    onClick={() => navigate('/integrations')}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' $variant='primary' disabled={saving}>
                    {saving ? (
                      <>
                        <LoadingSpinner
                          style={{
                            width: '16px',
                            height: '16px',
                            borderWidth: '2px',
                          }}
                        />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <MdSave size={18} />
                        Salvar Configuração
                      </>
                    )}
                  </Button>
                </FooterActions>
              </div>
            </form>
          )}
        </PageBody>
      </PageContainer>
    </Layout>
  );
};

export default WhatsAppNotificationConfigPage;
