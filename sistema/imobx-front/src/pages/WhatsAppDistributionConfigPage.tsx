import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdSave, MdArrowBack, MdInfo, MdPeople } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { whatsappApi } from '../services/whatsappApi';
import { showSuccess, showError } from '../utils/notifications';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useAuth } from '../hooks/useAuth';
import { companyMembersApi } from '../services/companyMembersApi';
import { WhatsAppConfigShimmer } from '../components/shimmer/WhatsAppConfigShimmer';
import type {
  DistributionConfig,
  UpdateDistributionConfigRequest,
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  width: 100%;
  transition: all 0.2s ease;
  cursor: pointer;

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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const UserItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }

  span {
    flex: 1;
    font-size: 0.9375rem;
    color: ${props => props.theme.colors.text};
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

interface User {
  id: string;
  name: string;
  email: string;
}

const WhatsAppDistributionConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const [config, setConfig] = useState<UpdateDistributionConfigRequest>({
    distributionType: 'round_robin',
    sdrUserIds: [],
    isActive: true,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingConfig, setExistingConfig] =
    useState<DistributionConfig | null>(null);

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
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [canManageConfig]);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await whatsappApi.getDistributionConfig();
      setExistingConfig(response);
      setConfig({
        distributionType: response.distributionType,
        sdrUserIds: response.sdrUserIds || [],
        isActive: response.isActive,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        setExistingConfig(null);
      } else {
        console.error('Erro ao carregar configuração de distribuição:', error);
        setError('Erro ao carregar configuração de distribuição');
        showError('Erro ao carregar configuração de distribuição');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const members = await companyMembersApi.getMembersSimple();
      setUsers(
        members.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email || '',
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showError('Erro ao carregar lista de usuários');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageConfig) {
      showError('Você não tem permissão para gerenciar esta configuração');
      return;
    }

    if ((config.sdrUserIds?.length || 0) === 0) {
      setError(
        'Selecione pelo menos um SDR para habilitar a distribuição automática'
      );
      showError(
        'Selecione pelo menos um SDR para habilitar a distribuição automática'
      );
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await whatsappApi.updateDistributionConfig(config);
      showSuccess('Configuração de distribuição salva com sucesso!');
      loadConfig();
    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      const errorMessage =
        error.message || 'Erro ao salvar configuração de distribuição';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUserToggle = (userId: string) => {
    const currentIds = config.sdrUserIds || [];
    const newIds = currentIds.includes(userId)
      ? currentIds.filter(id => id !== userId)
      : [...currentIds, userId];

    setConfig({ ...config, sdrUserIds: newIds });
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
                <MdPeople size={32} color='#3B82F6' />
                Configuração de Distribuição de Mensagens
              </Title>
              <Subtitle>
                Configure como as mensagens do WhatsApp serão distribuídas entre
                os SDRs
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
                    <MdPeople size={20} />
                  </SectionIcon>
                  <SectionTitle>Configurações de Distribuição</SectionTitle>
                </SectionHeader>

                <FormGroup>
                  <Label>
                    Tipo de Distribuição <span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Select
                    value={config.distributionType}
                    onChange={e =>
                      setConfig({
                        ...config,
                        distributionType: e.target.value as any,
                      })
                    }
                    required
                    disabled={saving}
                  >
                    <option value='round_robin'>Round Robin (Rotativa)</option>
                    <option value='load_balanced'>
                      Load Balanced (Por Carga)
                    </option>
                    <option value='manual'>Manual (Apenas Manual)</option>
                    <option value='first_available'>
                      First Available (Primeiro Disponível)
                    </option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>
                    SDRs Disponíveis <span style={{ color: 'red' }}>*</span>
                  </Label>
                  {users.length === 0 ? (
                    <div
                      style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#6B7280',
                        background: '#F3F4F6',
                        borderRadius: '8px',
                      }}
                    >
                      Nenhum usuário encontrado
                    </div>
                  ) : (
                    <UserList>
                      {users.map(user => (
                        <UserItem key={user.id}>
                          <input
                            type='checkbox'
                            checked={
                              config.sdrUserIds?.includes(user.id) || false
                            }
                            onChange={() => handleUserToggle(user.id)}
                            disabled={saving}
                          />
                          <span>
                            {user.name} ({user.email})
                          </span>
                        </UserItem>
                      ))}
                    </UserList>
                  )}
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
                    <span>Distribuição Automática Ativa</span>
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
                  <Button
                    type='submit'
                    $variant='primary'
                    disabled={saving || (config.sdrUserIds?.length || 0) === 0}
                  >
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

export default WhatsAppDistributionConfigPage;
