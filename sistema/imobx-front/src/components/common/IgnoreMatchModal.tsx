/**
 * Modal para ignorar um match
 * Permite ao corretor selecionar o motivo e adicionar observações
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import type { IgnoreReason } from '../../types/match';
import { IGNORE_REASON_LABELS } from '../../types/match';

interface IgnoreMatchModalProps {
  onConfirm: (reason?: string, notes?: string) => void;
  onCancel: () => void;
}

export const IgnoreMatchModal: React.FC<IgnoreMatchModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState<IgnoreReason | ''>('');
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(reason || undefined, notes || undefined);
  };

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Ignorar Match</Title>
          <CloseButton onClick={onCancel}>&times;</CloseButton>
        </Header>

        <Content>
          <Question>Por que deseja ignorar este match?</Question>

          <ReasonSelect
            value={reason}
            onChange={e => setReason(e.target.value as IgnoreReason)}
          >
            <option value=''>Selecione um motivo (opcional)</option>
            {Object.entries(IGNORE_REASON_LABELS).map(([key, data]) => (
              <option key={key} value={key}>
                {data.icon} {data.label}
              </option>
            ))}
          </ReasonSelect>

          <NotesLabel>
            Observações adicionais (opcional):
            <NotesTextarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder='Ex: Cliente já viu esse imóvel anteriormente'
              rows={3}
            />
          </NotesLabel>
        </Content>

        <Footer>
          <CancelButton onClick={onCancel}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirm}>Confirmar</ConfirmButton>
        </Footer>
      </Modal>
    </Overlay>
  );
};

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

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 95%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#e0e0e0'};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const Question = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  margin-bottom: 16px;
`;

const ReasonSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NotesLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`;

const NotesTextarea = styled.textarea`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e0e0e0'};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border || '#e0e0e0'};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled(Button)`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;

export default IgnoreMatchModal;
