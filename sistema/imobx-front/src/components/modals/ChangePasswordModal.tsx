import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdSave,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { authApiService } from '../../services/authApi';

// Styled Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 28px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalContent = styled.div`
  padding: 44px 36px 16px;
  max-height: calc(90vh - 210px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const InfoBox = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
  letter-spacing: -0.01em;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 16px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 18px;
  padding-right: 50px;
  border: 2px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props =>
      props.$hasError ? '#ef4444' : props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#ef4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props => (props.$hasError ? '#ef444415' : props.theme.colors.primary)}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 400;
  }
`;

const ToggleVisibilityButton = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 0.875rem;
  color: #ef4444;
  font-weight: 500;
`;

const ModalActions = styled.div`
  margin-top: 28px;
  padding: 0;
  border-top: none;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: transparent;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    padding: 16px 20px;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'A nova senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'A nova senha deve ser diferente da senha atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authApiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(
        'Senha alterada com sucesso! Outras sessões foram desconectadas por segurança.'
      );
      handleClose();
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao alterar senha';

      // Tratamento específico de erros
      if (error.response?.status === 401) {
        if (
          errorMessage.toLowerCase().includes('senha atual incorreta') ||
          errorMessage.toLowerCase().includes('incorreta')
        ) {
          setErrors({ currentPassword: 'Senha atual incorreta' });
        } else {
          toast.error('Sessão expirada. Faça login novamente.');
          handleClose();
        }
      } else if (error.response?.status === 400) {
        if (Array.isArray(errorMessage)) {
          setErrors({ newPassword: errorMessage[0] });
        } else if (errorMessage.toLowerCase().includes('diferente')) {
          setErrors({ newPassword: errorMessage });
        } else if (errorMessage.toLowerCase().includes('caracteres')) {
          setErrors({ newPassword: errorMessage });
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer $isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdLock />
            Alterar Senha
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <InfoBox>
            <strong>Importante:</strong> Após alterar sua senha, todas as outras
            sessões serão desconectadas automaticamente por segurança. Você
            permanecerá logado nesta sessão.
          </InfoBox>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <MdLock />
                Senha Atual
              </Label>
              <InputContainer>
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name='currentPassword'
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder='Digite sua senha atual'
                  required
                  disabled={isLoading}
                  $hasError={!!errors.currentPassword}
                />
                <ToggleVisibilityButton
                  type='button'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoading}
                >
                  {showCurrentPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </ToggleVisibilityButton>
              </InputContainer>
              {errors.currentPassword && (
                <ErrorMessage>{errors.currentPassword}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                <MdLock />
                Nova Senha
              </Label>
              <InputContainer>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  name='newPassword'
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder='Digite sua nova senha (mínimo 6 caracteres)'
                  required
                  minLength={6}
                  disabled={isLoading}
                  $hasError={!!errors.newPassword}
                />
                <ToggleVisibilityButton
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </ToggleVisibilityButton>
              </InputContainer>
              {errors.newPassword && (
                <ErrorMessage>{errors.newPassword}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                <MdLock />
                Confirmar Nova Senha
              </Label>
              <InputContainer>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder='Confirme sua nova senha'
                  required
                  minLength={6}
                  disabled={isLoading}
                  $hasError={!!errors.confirmPassword}
                />
                <ToggleVisibilityButton
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </ToggleVisibilityButton>
              </InputContainer>
              {errors.confirmPassword && (
                <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
              )}
            </FormGroup>

            <ModalActions>
              <Button type='button' onClick={handleClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                type='submit'
                $variant='primary'
                disabled={
                  isLoading ||
                  !formData.currentPassword ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
              >
                <MdSave />
                {isLoading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </ModalActions>
          </form>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ChangePasswordModal;
