/**
 * Modal para gerenciar User Preferences
 * Permite ao usuário configurar suas preferências pessoais
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdSettings,
  MdHome,
  MdPalette,
  MdNotifications,
  MdViewSidebar,
} from 'react-icons/md';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import {
  HOME_SCREEN_LABELS,
  type HomeScreenType,
} from '../../types/user-preferences.types';
import { toast } from 'react-toastify';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  `
      : `
    background: ${props.theme.colors.cardBackground};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.hover};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    preferences,
    isLoading,
    error,
    updatePreferences,
    setHomeScreen,
    updateThemeSettings,
    updateNotificationSettings,
    updateLayoutSettings,
    resetPreferences,
  } = useUserPreferences();

  // Estados locais para formulário
  const [localPreferences, setLocalPreferences] = useState({
    defaultHomeScreen: 'dashboard' as HomeScreenType,
    theme: 'light' as 'light' | 'dark',
    sidebar: 'expanded' as 'expanded' | 'collapsed',
    email: true,
    push: true,
    inApp: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Atualizar estado local quando preferências carregarem
  React.useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        defaultHomeScreen: preferences.defaultHomeScreen || 'dashboard',
        theme: preferences.themeSettings?.theme || 'light',
        sidebar: preferences.layoutSettings?.sidebar || 'expanded',
        email: preferences.notificationSettings?.email ?? true,
        push: preferences.notificationSettings?.push ?? true,
        inApp: preferences.notificationSettings?.inApp ?? true,
      });
    }
  }, [preferences]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Atualizar tela inicial
      await setHomeScreen(localPreferences.defaultHomeScreen);

      // Atualizar configurações de tema
      await updateThemeSettings({
        theme: localPreferences.theme,
        language: preferences?.themeSettings?.language || 'pt-BR',
      });

      // Atualizar configurações de layout
      await updateLayoutSettings({
        sidebar: localPreferences.sidebar,
        grid: preferences?.layoutSettings?.grid || 'normal',
      });

      // Atualizar configurações de notificação
      await updateNotificationSettings({
        email: localPreferences.email,
        push: localPreferences.push,
        inApp: localPreferences.inApp,
      });

      toast.success('Preferências salvas com sucesso!');
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar preferências:', err);
      toast.error(err.message || 'Erro ao salvar preferências');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSaving(true);
      await resetPreferences();
      toast.success('Preferências resetadas para o padrão!');
      onClose();
    } catch (err: any) {
      console.error('Erro ao resetar preferências:', err);
      toast.error(err.message || 'Erro ao resetar preferências');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>
            <MdSettings size={24} />
            Minhas Preferências
          </Title>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <LoadingMessage>Carregando suas preferências...</LoadingMessage>
          ) : error ? (
            <LoadingMessage>
              Erro ao carregar preferências: {error}
            </LoadingMessage>
          ) : (
            <>
              {/* Tela Inicial */}
              <Section>
                <SectionTitle>
                  <MdHome size={20} />
                  Tela Inicial
                </SectionTitle>
                <FormGroup>
                  <Label>Página inicial padrão</Label>
                  <Select
                    value={localPreferences.defaultHomeScreen}
                    onChange={e =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        defaultHomeScreen: e.target.value as HomeScreenType,
                      }))
                    }
                  >
                    {Object.entries(HOME_SCREEN_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormGroup>
              </Section>

              {/* Configurações de Tema */}
              <Section>
                <SectionTitle>
                  <MdPalette size={20} />
                  Aparência
                </SectionTitle>
                <FormGroup>
                  <Label>Tema</Label>
                  <Select
                    value={localPreferences.theme}
                    onChange={e =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        theme: e.target.value as 'light' | 'dark',
                      }))
                    }
                  >
                    <option value='light'>Claro</option>
                    <option value='dark'>Escuro</option>
                  </Select>
                </FormGroup>
              </Section>

              {/* Configurações de Layout */}
              <Section>
                <SectionTitle>
                  <MdViewSidebar size={20} />
                  Layout
                </SectionTitle>
                <FormGroup>
                  <Label>Barra lateral</Label>
                  <Select
                    value={localPreferences.sidebar}
                    onChange={e =>
                      setLocalPreferences(prev => ({
                        ...prev,
                        sidebar: e.target.value as 'expanded' | 'collapsed',
                      }))
                    }
                  >
                    <option value='expanded'>Expandida</option>
                    <option value='collapsed'>Recolhida</option>
                  </Select>
                </FormGroup>
              </Section>

              {/* Configurações de Notificação */}
              <Section>
                <SectionTitle>
                  <MdNotifications size={20} />
                  Notificações
                </SectionTitle>
                <CheckboxGroup>
                  <CheckboxItem>
                    <input
                      type='checkbox'
                      checked={localPreferences.email}
                      onChange={e =>
                        setLocalPreferences(prev => ({
                          ...prev,
                          email: e.target.checked,
                        }))
                      }
                    />
                    Notificações por email
                  </CheckboxItem>
                  <CheckboxItem>
                    <input
                      type='checkbox'
                      checked={localPreferences.push}
                      onChange={e =>
                        setLocalPreferences(prev => ({
                          ...prev,
                          push: e.target.checked,
                        }))
                      }
                    />
                    Notificações push
                  </CheckboxItem>
                  <CheckboxItem>
                    <input
                      type='checkbox'
                      checked={localPreferences.inApp}
                      onChange={e =>
                        setLocalPreferences(prev => ({
                          ...prev,
                          inApp: e.target.checked,
                        }))
                      }
                    />
                    Notificações na aplicação
                  </CheckboxItem>
                </CheckboxGroup>
              </Section>

              {/* Botões */}
              <ButtonGroup>
                <Button
                  variant='secondary'
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  Resetar
                </Button>
                <Button
                  variant='primary'
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </ButtonGroup>
            </>
          )}
        </ModalBody>
      </Modal>
    </Overlay>
  );
};
