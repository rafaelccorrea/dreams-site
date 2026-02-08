import styled, { keyframes } from 'styled-components';
import { MdClose, MdWarning, MdCancel, MdArrowBack } from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';
import type { SubscriptionAddon } from '../../types/addons';
import { ADDON_TYPE_LABELS } from '../../types/addons';

interface CancelAddonConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addon: SubscriptionAddon;
  loading?: boolean;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(15, 23, 42, 0.8)'
      : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(4px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(51, 65, 85, 0.98) 100%)'
      : '#ffffff'};
  border-radius: 16px;
  padding: 24px 32px;
  max-width: 600px;
  width: 100%;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 20px 60px rgba(0, 0, 0, 0.5)'
      : '0 20px 60px rgba(0, 0, 0, 0.3)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.2)'
        : 'rgba(226, 232, 240, 0.8)'};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.1)'
        : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#334155')};
  }
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const WarningCard = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(239, 68, 68, 0.15)'
      : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(239, 68, 68, 0.3)'
        : 'rgba(239, 68, 68, 0.2)'};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const WarningIcon = styled.div`
  color: ${props => (props.theme.mode === 'dark' ? '#f87171' : '#ef4444')};
  flex-shrink: 0;
  margin-top: 2px;
`;

const WarningText = styled.p`
  margin: 0;
  color: ${props => (props.theme.mode === 'dark' ? '#fca5a5' : '#dc2626')};
  font-size: 0.875rem;
  line-height: 1.5;
  flex: 1;
`;

const AddonInfo = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(148, 163, 184, 0.1)'
      : 'rgba(241, 245, 249, 0.8)'};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
`;

const AddonInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AddonInfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => (props.theme.mode === 'dark' ? '#94a3b8' : '#64748b')};
`;

const AddonInfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
`;

const ImpactCard = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(251, 191, 36, 0.1)'
      : 'rgba(251, 191, 36, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(251, 191, 36, 0.3)'
        : 'rgba(251, 191, 36, 0.2)'};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
`;

const ImpactTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => (props.theme.mode === 'dark' ? '#fbbf24' : '#d97706')};
`;

const ImpactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.875rem;
  color: ${props => (props.theme.mode === 'dark' ? '#fcd34d' : '#92400e')};

  &:last-child {
    margin-bottom: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
  $loading?: boolean;
}>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: ${props => (props.$loading ? '140px' : 'auto')};

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#ef4444' : '#dc3545'};
        color: #ffffff;
        
        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'dark' ? '#dc2626' : '#c82333'};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 53, 69, 0.3)'};
        }
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `;
    }
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.mode === 'dark' ? '#3b82f6' : props.theme.colors.primary};
        color: #ffffff;
        
        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'dark' ? '#2563eb' : props.theme.colors.primaryDark};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'};
        }
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `;
    }
    return `
      background: ${props.theme.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(241, 245, 249, 0.8)'};
      color: ${props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b'};
      
      &:hover:not(:disabled) {
        background: ${props.theme.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'};
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
  }}
`;

export function CancelAddonConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  addon,
  loading = false,
}: CancelAddonConfirmationModalProps) {
  const { theme } = useTheme();
  const monthlyPrice =
    typeof addon.monthlyPrice === 'number'
      ? addon.monthlyPrice
      : Number(addon.monthlyPrice || 0);

  return (
    <Overlay $isOpen={isOpen} onClick={loading ? undefined : onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} disabled={loading}>
          <MdClose size={20} />
        </CloseButton>

        <Title>
          <MdWarning
            size={20}
            style={{ color: theme === 'dark' ? '#f87171' : '#ef4444' }}
          />
          Cancelar Extra
        </Title>

        <Description>
          Tem certeza que deseja cancelar este extra? O valor será removido da
          sua assinatura mensal.
        </Description>

        <WarningCard>
          <WarningIcon>
            <MdWarning size={20} />
          </WarningIcon>
          <WarningText>
            <strong>Atenção:</strong> Esta ação removerá o extra da sua
            assinatura e o valor será descontado na próxima fatura.
          </WarningText>
        </WarningCard>

        <AddonInfo>
          <AddonInfoRow>
            <AddonInfoLabel>Extra:</AddonInfoLabel>
            <AddonInfoValue>{ADDON_TYPE_LABELS[addon.type]}</AddonInfoValue>
          </AddonInfoRow>
          <AddonInfoRow>
            <AddonInfoLabel>Quantidade:</AddonInfoLabel>
            <AddonInfoValue>{addon.quantity}</AddonInfoValue>
          </AddonInfoRow>
          <AddonInfoRow>
            <AddonInfoLabel>Valor mensal atual:</AddonInfoLabel>
            <AddonInfoValue>R$ {monthlyPrice.toFixed(2)}</AddonInfoValue>
          </AddonInfoRow>
        </AddonInfo>

        <ImpactCard>
          <ImpactTitle>Impacto do cancelamento:</ImpactTitle>
          <ImpactItem>
            <span>•</span>
            <span>
              O valor de R$ {monthlyPrice.toFixed(2)} será removido da sua
              assinatura mensal
            </span>
          </ImpactItem>
          <ImpactItem>
            <span>•</span>
            <span>
              O cancelamento será efetivado no próximo ciclo de cobrança
            </span>
          </ImpactItem>
          <ImpactItem>
            <span>•</span>
            <span>Você continuará com acesso até o fim do período atual</span>
          </ImpactItem>
        </ImpactCard>

        <Actions>
          <Button $variant='secondary' onClick={onClose} disabled={loading}>
            <MdArrowBack size={18} />
            Voltar
          </Button>
          <Button
            $variant='danger'
            onClick={onConfirm}
            disabled={loading}
            $loading={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Cancelando...
              </>
            ) : (
              <>
                <MdCancel size={18} />
                Confirmar Cancelamento
              </>
            )}
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
}
