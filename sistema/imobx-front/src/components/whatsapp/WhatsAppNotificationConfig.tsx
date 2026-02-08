import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSave, MdClose, MdInfo } from 'react-icons/md';
import { whatsappApi } from '../../services/whatsappApi';
import { showSuccess, showError } from '../../utils/notifications';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { useAuth } from '../../hooks/useAuth';
import type {
  NotificationConfig,
  UpdateNotificationConfigRequest,
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
  ModernFormInput,
  ModernButton,
  ModernLoadingSpinner,
} from '../../styles/components/ModernModalStyles';

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

interface WhatsAppNotificationConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const WhatsAppNotificationConfig: React.FC<
  WhatsAppNotificationConfigProps
> = ({ isOpen, onClose, onSuccess }) => {
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const [config, setConfig] = useState<UpdateNotificationConfigRequest>({
    onTimeMinutes: 15,
    delayedMinutes: 30,
    criticalMinutes: 60,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
    }
  }, [isOpen, canManageConfig]);

  const loadConfig = async () => {
    setLoading(true);
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
        // Configuração não existe, usar valores padrão
        setConfig({
          onTimeMinutes: 15,
          delayedMinutes: 30,
          criticalMinutes: 60,
          isActive: true,
        });
      } else {
        console.error('Erro ao carregar configuração de notificações:', error);
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

    // Validações
    if (config.onTimeMinutes! >= config.delayedMinutes!) {
      showError('O tempo "Em Dia" deve ser menor que o tempo "Atrasada"');
      return;
    }

    if (config.delayedMinutes! >= config.criticalMinutes!) {
      showError('O tempo "Atrasada" deve ser menor que o tempo "Crítica"');
      return;
    }

    setSaving(true);
    try {
      await whatsappApi.updateNotificationConfig(config);
      showSuccess('Configuração de notificações salva com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar configuração:', error);
      showError(error.message || 'Erro ao salvar configuração de notificações');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  if (!canManageConfig) {
    return (
      <ModernModalOverlay onClick={onClose}>
        <ModernModalContainer onClick={e => e.stopPropagation()}>
          <ModernModalHeader>
            <ModernModalHeaderContent>
              <ModalTitle>Configuração de Notificações</ModalTitle>
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
            <ModalTitle>Configuração de Notificações por Tempo</ModalTitle>
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
                  <ModernFormLabel>Tempo "Em Dia" (minutos) *</ModernFormLabel>
                  <ModernFormInput
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
                  />
                  <HelpText>
                    <MdInfo size={18} />
                    <div>
                      Mensagens dentro deste tempo são consideradas "em dia".
                    </div>
                  </HelpText>
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    Tempo "Atrasada" (minutos) *
                  </ModernFormLabel>
                  <ModernFormInput
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
                  />
                  <HelpText>
                    <MdInfo size={18} />
                    <div>
                      Mensagens entre "Em Dia" e este tempo são consideradas
                      "atrasadas".
                    </div>
                  </HelpText>
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>Tempo "Crítica" (minutos) *</ModernFormLabel>
                  <ModernFormInput
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
                  />
                  <HelpText>
                    <MdInfo size={18} />
                    <div>
                      Mensagens acima deste tempo são consideradas "críticas".
                    </div>
                  </HelpText>
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
                    <span>Notificações Ativas</span>
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
                  <ModernButton type='submit' disabled={saving}>
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
