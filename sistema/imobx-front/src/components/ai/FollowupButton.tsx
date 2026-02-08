import React, { useState } from 'react';
import styled from 'styled-components';
import { MdMessage, MdContentCopy, MdCheck, MdClose } from 'react-icons/md';
import { useGenerateFollowup } from '../../hooks/useGenerateFollowup';
import { toast } from 'react-toastify';

const Button = styled.button<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$loading ? 0.7 : 1)};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageBox = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  min-height: 150px;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-size: 14px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.backgroundSecondary};
    }
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface FollowupButtonProps {
  clientId: string;
  context?: string;
  daysSinceLastContact?: number;
}

export const FollowupButton: React.FC<FollowupButtonProps> = ({
  clientId,
  context,
  daysSinceLastContact,
}) => {
  const { generate, loading, error, canRetry } = useGenerateFollowup();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [suggestedChannel, setSuggestedChannel] = useState<
    'whatsapp' | 'email' | 'sms' | null
  >(null);
  const [tone, setTone] = useState<
    'friendly' | 'professional' | 'casual' | null
  >(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    // Verificar se pode tentar antes de chamar
    if (!canRetry()) {
      toast.error(
        'Limite de tentativas excedido. Aguarde 1 minuto antes de tentar novamente.'
      );
      return;
    }

    const result = await generate(clientId, context, daysSinceLastContact);

    if (result) {
      setMessage(result.message);
      setSuggestedChannel(result.suggestedChannel);
      setTone(result.tone);
      setShowModal(true);
    } else if (error) {
      toast.error(error);
    }
  };

  const handleCopy = async () => {
    if (message) {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        toast.success('Mensagem copiada para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Erro ao copiar mensagem');
      }
    }
  };

  const getChannelLabel = (channel: string) => {
    const labels: Record<string, string> = {
      whatsapp: 'WhatsApp',
      email: 'E-mail',
      sms: 'SMS',
    };
    return labels[channel] || channel;
  };

  const getToneLabel = (toneValue: string) => {
    const labels: Record<string, string> = {
      friendly: 'Amigável',
      professional: 'Profissional',
      casual: 'Casual',
    };
    return labels[toneValue] || toneValue;
  };

  return (
    <>
      <Button
        onClick={handleGenerate}
        disabled={loading || !canRetry()}
        $loading={loading}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Gerando...
          </>
        ) : (
          <>
            <MdMessage size={18} />
            Gerar Follow-up
          </>
        )}
      </Button>

      <ModalOverlay $isOpen={showModal} onClick={() => setShowModal(false)}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              <MdMessage size={20} />
              Mensagem de Follow-up Gerada
            </ModalTitle>
            <CloseButton onClick={() => setShowModal(false)}>
              <MdClose size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            {suggestedChannel && tone && (
              <InfoBox>
                <InfoItem>
                  <InfoLabel>Canal Sugerido</InfoLabel>
                  <InfoValue>{getChannelLabel(suggestedChannel)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Tom</InfoLabel>
                  <InfoValue>{getToneLabel(tone)}</InfoValue>
                </InfoItem>
              </InfoBox>
            )}

            <MessageBox>{message || 'Carregando...'}</MessageBox>

            <Actions>
              <ActionButton
                $variant='secondary'
                onClick={() => setShowModal(false)}
              >
                Fechar
              </ActionButton>
              <ActionButton $variant='primary' onClick={handleCopy}>
                {copied ? (
                  <>
                    <MdCheck size={18} />
                    Copiado!
                  </>
                ) : (
                  <>
                    <MdContentCopy size={18} />
                    Copiar Mensagem
                  </>
                )}
              </ActionButton>
            </Actions>
          </ModalBody>
        </Modal>
      </ModalOverlay>
    </>
  );
};
