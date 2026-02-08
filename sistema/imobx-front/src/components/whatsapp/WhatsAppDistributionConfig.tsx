import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { MdSave, MdClose, MdInfo } from 'react-icons/md';
import { whatsappApi } from '../../services/whatsappApi';
import { showSuccess, showError } from '../../utils/notifications';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { useAuth } from '../../hooks/useAuth';
import type {
  DistributionConfig,
  UpdateDistributionConfigRequest,
} from '../../types/whatsapp';
import {
  ModernModalOverlay,
  ModernModalContainer,
  ModernModalHeader,
  ModernModalHeaderContent,
  ModernModalCloseButton,
  ModernModalContent,
  ModernFormGroup,
  ModernFormLabel,
  ModernButton,
  ModernLoadingSpinner,
} from '../../styles/components/ModernModalStyles';
import { companyMembersApi } from '../../services/companyMembersApi';

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 8px;
`;

const HelpText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
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

interface User {
  id: string;
  name: string;
  email: string;
}

interface WhatsAppDistributionConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WhatsAppDistributionConfig: React.FC<
  WhatsAppDistributionConfigProps
> = ({ isOpen, onClose, onSuccess }) => {
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const [config, setConfig] = useState<UpdateDistributionConfigRequest>({
    distributionType: 'round_robin',
    sdrUserIds: [],
    isActive: true,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
    if (isOpen && canManageConfig) {
      loadConfig();
      loadUsers();
    }
  }, [isOpen, canManageConfig]);

  const loadConfig = async () => {
    setLoading(true);
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
        // Configuração não existe, usar valores padrão
        setExistingConfig(null);
      } else {
        console.error('Erro ao carregar configuração de distribuição:', error);
        showError('Erro ao carregar configuração de distribuição');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Buscar usuários da empresa
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

    setSaving(true);
    try {
      await whatsappApi.updateDistributionConfig(config);
      showSuccess('Configuração de distribuição salva com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      showError(error.message || 'Erro ao salvar configuração de distribuição');
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

  if (!isOpen) return null;

  if (!canManageConfig) {
    return (
      <ModernModalOverlay onClick={onClose}>
        <ModernModalContainer onClick={e => e.stopPropagation()}>
          <ModernModalHeader>
            <ModernModalHeaderContent>
              <ModalTitle>Configuração de Distribuição</ModalTitle>
            </ModernModalHeaderContent>
            <ModernModalCloseButton onClick={onClose}>
              <MdClose size={24} />
            </ModernModalCloseButton>
          </ModernModalHeader>
          <ModernModalContent>
            <div
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                color: '#6B7280',
              }}
            >
              Você não tem permissão para gerenciar esta configuração.
            </div>
          </ModernModalContent>
        </ModernModalContainer>
      </ModernModalOverlay>
    );
  }

  return (
    <ModernModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModernModalContainer $isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModernModalHeader>
          <ModernModalHeaderContent>
            <ModalTitle>Configuração de Distribuição de Mensagens</ModalTitle>
          </ModernModalHeaderContent>
          <ModernModalCloseButton onClick={onClose}>
            <MdClose size={24} />
          </ModernModalCloseButton>
        </ModernModalHeader>

        <ModernModalContent>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '40px',
              }}
            >
              <ModernLoadingSpinner />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormContainer>
                <ModernFormGroup>
                  <ModernFormLabel>Tipo de Distribuição *</ModernFormLabel>
                  <Select
                    value={config.distributionType}
                    onChange={e =>
                      setConfig({
                        ...config,
                        distributionType: e.target.value as any,
                      })
                    }
                    required
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
                  <HelpText>
                    <MdInfo size={18} />
                    <div>
                      <strong>Round Robin:</strong> Distribui mensagens
                      rotativamente entre os SDRs selecionados.
                      <br />
                      <strong>Load Balanced:</strong> Distribui para o SDR com
                      menos mensagens não lidas.
                      <br />
                      <strong>Manual:</strong> Apenas distribuição manual, sem
                      atribuição automática.
                      <br />
                      <strong>First Available:</strong> Sempre atribui ao
                      primeiro SDR da lista.
                    </div>
                  </HelpText>
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>SDRs Disponíveis *</ModernFormLabel>
                  {users.length === 0 ? (
                    <div
                      style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#6B7280',
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
                          />
                          <span>
                            {user.name} ({user.email})
                          </span>
                        </UserItem>
                      ))}
                    </UserList>
                  )}
                  {config.sdrUserIds && config.sdrUserIds.length === 0 && (
                    <HelpText>
                      <MdInfo size={18} />
                      <div>
                        Selecione pelo menos um SDR para habilitar a
                        distribuição automática.
                      </div>
                    </HelpText>
                  )}
                </ModernFormGroup>

                <ModernFormGroup>
                  <CheckboxLabel>
                    <input
                      type='checkbox'
                      checked={config.isActive !== false}
                      onChange={e =>
                        setConfig({ ...config, isActive: e.target.checked })
                      }
                    />
                    <span>Distribuição Automática Ativa</span>
                  </CheckboxLabel>
                </ModernFormGroup>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    marginTop: '8px',
                  }}
                >
                  <ModernButton
                    type='button'
                    onClick={onClose}
                    variant='secondary'
                  >
                    Cancelar
                  </ModernButton>
                  <ModernButton
                    type='submit'
                    disabled={saving || (config.sdrUserIds?.length || 0) === 0}
                  >
                    {saving ? (
                      <>
                        <ModernLoadingSpinner size={16} />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <MdSave size={20} />
                        Salvar Configuração
                      </>
                    )}
                  </ModernButton>
                </div>
              </FormContainer>
            </form>
          )}
        </ModernModalContent>
      </ModernModalContainer>
    </ModernModalOverlay>
  );
};
