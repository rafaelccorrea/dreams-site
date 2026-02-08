import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSend, MdClose, MdAdd, MdDelete } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { whatsappApi } from '../../services/whatsappApi';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { showSuccess, showError } from '../../utils/notifications';
import {
  normalizePhoneNumber,
  isValidPhoneNumber,
  handleWhatsAppTokenExpired,
} from '../../utils/whatsappUtils';
import type { SendTemplateRequest } from '../../types/whatsapp';

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
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
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
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

const ParameterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ParameterItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ParameterInput = styled(Input)`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}30;
  }
`;

const AddParameterButton = styled.button`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border: 1px dashed ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}30;
  }
`;

const Footer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.border};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.error};
  padding: 8px 12px;
  background: ${props => props.theme.colors.error}15;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.error}30;
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

interface SendWhatsAppTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  clientId?: string;
  onSuccess?: () => void;
}

export const SendWhatsAppTemplate: React.FC<SendWhatsAppTemplateProps> = ({
  isOpen,
  onClose,
  phoneNumber: initialPhoneNumber,
  clientId,
  onSuccess,
}) => {
  const { sendTemplate } = useWhatsApp();
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [templateName, setTemplateName] = useState('');
  const [parameters, setParameters] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPhoneNumber(initialPhoneNumber || '');
      setTemplateName('');
      setParameters(['']);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, initialPhoneNumber]);

  const handleAddParameter = () => {
    setParameters([...parameters, '']);
  };

  const handleRemoveParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleParameterChange = (index: number, value: string) => {
    const newParameters = [...parameters];
    newParameters[index] = value;
    setParameters(newParameters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar telefone
    if (!phoneNumber.trim()) {
      setError('Número de telefone é obrigatório');
      return;
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber(normalizedPhone)) {
      setError('Número de telefone inválido');
      return;
    }

    // Validar template
    if (!templateName.trim()) {
      setError('Nome do template é obrigatório');
      return;
    }

    setLoading(true);

    try {
      const templateParameters = parameters.filter(p => p.trim() !== '');
      const data: SendTemplateRequest = {
        to: normalizedPhone,
        templateName: templateName.trim(),
        parameters:
          templateParameters.length > 0 ? templateParameters : undefined,
        clientId,
      };

      await sendTemplate(data);
      showSuccess('Template enviado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Erro ao enviar template:', err);

      // Tratar token expirado
      if (handleWhatsAppTokenExpired(err, showError)) {
        // Token expirado já foi tratado
        return;
      }

      setError(
        err.response?.data?.message || err.message || 'Erro ao enviar template'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FaWhatsapp size={20} color='#25D366' />
            Enviar Template WhatsApp
          </ModalTitle>
          <CloseButton onClick={onClose} disabled={loading}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalContent>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label>
                Número de Telefone <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                type='text'
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder='(11) 99999-9999'
                required
                disabled={loading || !!initialPhoneNumber}
              />
              {initialPhoneNumber && (
                <HelpText>Número pré-preenchido da mensagem</HelpText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                Nome do Template <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                type='text'
                value={templateName}
                onChange={e => setTemplateName(e.target.value)}
                placeholder='welcome_message'
                required
                disabled={loading}
              />
              <HelpText>
                Digite o nome exato do template aprovado pelo WhatsApp Business
                API
              </HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Parâmetros do Template (Opcional)</Label>
              <ParameterList>
                {parameters.map((param, index) => (
                  <ParameterItem key={index}>
                    <ParameterInput
                      type='text'
                      value={param}
                      onChange={e =>
                        handleParameterChange(index, e.target.value)
                      }
                      placeholder={`Parâmetro ${index + 1}`}
                      disabled={loading}
                    />
                    {parameters.length > 1 && (
                      <RemoveButton
                        type='button'
                        onClick={() => handleRemoveParameter(index)}
                        disabled={loading}
                      >
                        <MdDelete size={18} />
                      </RemoveButton>
                    )}
                  </ParameterItem>
                ))}
                <AddParameterButton
                  type='button'
                  onClick={handleAddParameter}
                  disabled={loading}
                >
                  <MdAdd size={18} />
                  Adicionar Parâmetro
                </AddParameterButton>
              </ParameterList>
              <HelpText>
                Adicione os parâmetros na ordem que aparecem no template
              </HelpText>
            </FormGroup>
          </ModalContent>

          <Footer>
            <Button
              type='button'
              $variant='secondary'
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              $variant='primary'
              disabled={loading || !phoneNumber.trim() || !templateName.trim()}
            >
              <MdSend size={18} />
              {loading ? 'Enviando...' : 'Enviar Template'}
            </Button>
          </Footer>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};
