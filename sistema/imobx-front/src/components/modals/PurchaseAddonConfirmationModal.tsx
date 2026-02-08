import styled, { keyframes } from 'styled-components';
import {
  MdClose,
  MdCheckCircle,
  MdArrowBack,
  MdShoppingCart,
} from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';

interface PurchaseAddonConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  addonName: string;
  addonQuantity: number;
  addonUnitPrice: number;
  addonTotalPrice: number;
  currentSubscriptionPrice: number | null;
  loading?: boolean;
}

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
  max-width: 700px;
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
  margin: 0 0 16px 0;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
  font-size: 0.875rem;
  line-height: 1.5;
`;

const CalculationCard = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.1)'
      : 'rgba(59, 130, 246, 0.05)'};
  border: 1px solid
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(59, 130, 246, 0.15)'};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
`;

const CalculationRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => (props.$isTotal ? '10px 0' : '6px 0')};
  border-bottom: ${props =>
    props.$isTotal
      ? 'none'
      : `1px solid ${props.theme.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`};

  &:last-child {
    border-bottom: none;
  }
`;

const CalculationLabel = styled.span<{ $isTotal?: boolean }>`
  font-size: ${props => (props.$isTotal ? '1rem' : '0.875rem')};
  font-weight: ${props => (props.$isTotal ? 700 : 500)};
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b')};
`;

const CalculationValue = styled.span<{ $isTotal?: boolean }>`
  font-size: ${props => (props.$isTotal ? '1.25rem' : '0.9375rem')};
  font-weight: ${props => (props.$isTotal ? 800 : 600)};
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e293b')};
`;

const AddonInfo = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(148, 163, 184, 0.1)'
      : 'rgba(241, 245, 249, 0.8)'};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

const AddonInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;

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

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

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

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
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

  ${props =>
    props.$variant === 'primary'
      ? `
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
  `
      : `
    background: ${props.theme.mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(241, 245, 249, 0.8)'};
    color: ${props.theme.mode === 'dark' ? '#cbd5e1' : '#64748b'};
    
    &:hover:not(:disabled) {
      background: ${props.theme.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`;

export function PurchaseAddonConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  addonName,
  addonQuantity,
  addonUnitPrice,
  addonTotalPrice,
  currentSubscriptionPrice,
  loading = false,
}: PurchaseAddonConfirmationModalProps) {
  const { theme } = useTheme();
  const totalPrice = (currentSubscriptionPrice || 0) + addonTotalPrice;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <MdClose size={20} />
        </CloseButton>

        <Title>
          <MdCheckCircle
            size={20}
            style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }}
          />
          Confirmar Compra de Extra
        </Title>

        <Description>
          Confirme os detalhes da compra do extra. O valor será adicionado à sua
          assinatura mensal.
        </Description>

        <AddonInfo>
          <AddonInfoRow>
            <AddonInfoLabel>Extra:</AddonInfoLabel>
            <AddonInfoValue>{addonName}</AddonInfoValue>
          </AddonInfoRow>
          <AddonInfoRow>
            <AddonInfoLabel>Quantidade:</AddonInfoLabel>
            <AddonInfoValue>{addonQuantity}</AddonInfoValue>
          </AddonInfoRow>
          <AddonInfoRow>
            <AddonInfoLabel>Valor unitário:</AddonInfoLabel>
            <AddonInfoValue>R$ {addonUnitPrice.toFixed(2)}</AddonInfoValue>
          </AddonInfoRow>
        </AddonInfo>

        <CalculationCard>
          <CalculationRow>
            <CalculationLabel>Valor atual da assinatura:</CalculationLabel>
            <CalculationValue>
              {currentSubscriptionPrice !== null
                ? `R$ ${currentSubscriptionPrice.toFixed(2)}`
                : 'Não disponível'}
            </CalculationValue>
          </CalculationRow>
          <CalculationRow>
            <CalculationLabel>
              Valor do extra ({addonQuantity}x):
            </CalculationLabel>
            <CalculationValue>R$ {addonTotalPrice.toFixed(2)}</CalculationValue>
          </CalculationRow>
          <CalculationRow $isTotal>
            <CalculationLabel $isTotal>Total mensal:</CalculationLabel>
            <CalculationValue $isTotal>
              {currentSubscriptionPrice !== null
                ? `R$ ${totalPrice.toFixed(2)}`
                : `R$ ${addonTotalPrice.toFixed(2)} (apenas extra)`}
            </CalculationValue>
          </CalculationRow>
        </CalculationCard>

        <Actions>
          <Button $variant='secondary' onClick={onClose} disabled={loading}>
            <MdArrowBack size={18} />
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={onConfirm}
            disabled={loading}
            $loading={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Processando...
              </>
            ) : (
              <>
                <MdShoppingCart size={18} />
                Confirmar Compra
              </>
            )}
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
}
