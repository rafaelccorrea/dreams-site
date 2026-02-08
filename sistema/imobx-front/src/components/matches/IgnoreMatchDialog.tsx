/**
 * Dialog para ignorar match com motivo
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { IGNORE_REASON_LABELS, type IgnoreReason } from '../../types/match';

interface IgnoreMatchDialogProps {
  onClose: () => void;
  onConfirm: (reason: IgnoreReason, notes: string) => void;
}

const reasonOptions: Array<{
  value: IgnoreReason;
  label: string;
  icon: string;
}> = [
  {
    value: 'price_too_high' as IgnoreReason,
    label: IGNORE_REASON_LABELS.price_too_high.label,
    icon: IGNORE_REASON_LABELS.price_too_high.icon,
  },
  {
    value: 'price_too_low' as IgnoreReason,
    label: IGNORE_REASON_LABELS.price_too_low.label,
    icon: IGNORE_REASON_LABELS.price_too_low.icon,
  },
  {
    value: 'location_bad' as IgnoreReason,
    label: IGNORE_REASON_LABELS.location_bad.label,
    icon: IGNORE_REASON_LABELS.location_bad.icon,
  },
  {
    value: 'already_shown' as IgnoreReason,
    label: IGNORE_REASON_LABELS.already_shown.label,
    icon: IGNORE_REASON_LABELS.already_shown.icon,
  },
  {
    value: 'client_not_interested' as IgnoreReason,
    label: IGNORE_REASON_LABELS.client_not_interested.label,
    icon: IGNORE_REASON_LABELS.client_not_interested.icon,
  },
  {
    value: 'property_sold' as IgnoreReason,
    label: IGNORE_REASON_LABELS.property_sold.label,
    icon: IGNORE_REASON_LABELS.property_sold.icon,
  },
  {
    value: 'other' as IgnoreReason,
    label: IGNORE_REASON_LABELS.other.label,
    icon: IGNORE_REASON_LABELS.other.icon,
  },
];

export function IgnoreMatchDialog({
  onClose,
  onConfirm,
}: IgnoreMatchDialogProps) {
  const [selectedReason, setSelectedReason] = useState<IgnoreReason | null>(
    null
  );
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    if (!selectedReason) {
      alert('Por favor, selecione um motivo');
      return;
    }
    onConfirm(selectedReason, notes);
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Por que ignorar este match?</Title>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </Header>

        <Content>
          <Description>
            Ignorar remove este match da lista de pendentes. Registrar o motivo
            ajuda o sistema a melhorar futuras recomendações.
          </Description>

          <Label>Motivo *</Label>
          <ReasonsGrid>
            {reasonOptions.map(option => (
              <ReasonOption
                key={option.value}
                $selected={selectedReason === option.value}
                onClick={() => setSelectedReason(option.value)}
              >
                <ReasonIcon>{option.icon}</ReasonIcon>
                <ReasonLabel>{option.label}</ReasonLabel>
              </ReasonOption>
            ))}
          </ReasonsGrid>

          <Label>Observações (opcional)</Label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder='Adicione detalhes sobre o motivo...'
            rows={3}
          />
        </Content>

        <Footer>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirm} disabled={!selectedReason}>
            Confirmar
          </ConfirmButton>
        </Footer>
      </Dialog>
    </Overlay>
  );
}

// Styled Components
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
  z-index: 9999;
  padding: 20px;
`;

const Dialog = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${props => props.theme.shadows.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 20px 0;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const ReasonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const ReasonOption = styled.button<{ $selected: boolean }>`
  background: ${props =>
    props.$selected
      ? props.theme.colors.infoBackground
      : props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.hover};
  }
`;

const ReasonIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 4px;
`;

const ReasonLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const CancelButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const ConfirmButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
