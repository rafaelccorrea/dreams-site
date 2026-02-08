import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdCheckCircle, MdCancel, MdRefresh } from 'react-icons/md';
import type { KanbanTask } from '../../types/kanban';
import { kanbanApi } from '../../services/kanbanApi';
import { showError, showSuccess } from '../../utils/notifications';
import { ResultModal } from './ResultModal';

interface ResultBadgeProps {
  task: KanbanTask;
  onUpdate?: (updatedTask: KanbanTask) => void;
}

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ResultButton = styled.button<{
  $variant: 'won' | 'lost';
  $isActive?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid
    ${props => {
      if (props.$isActive) {
        return props.$variant === 'won'
          ? props.theme.colors.success
          : props.theme.colors.error;
      }
      return props.$variant === 'won'
        ? props.theme.colors.success
        : props.theme.colors.error;
    }};
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => {
    if (props.$isActive) {
      return props.$variant === 'won'
        ? props.theme.colors.success
        : props.theme.colors.error;
    }
    return props.$variant === 'won'
      ? `${props.theme.colors.success}15`
      : `${props.theme.colors.error}15`;
  }};
  color: ${props => {
    if (props.$isActive) {
      return '#fff';
    }
    return props.$variant === 'won'
      ? props.theme.colors.success
      : props.theme.colors.error;
  }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: ${props =>
      props.$variant === 'won'
        ? `${props.theme.colors.success}30`
        : `${props.theme.colors.error}30`};
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px
      ${props =>
        props.$variant === 'won'
          ? `${props.theme.colors.success}50`
          : `${props.theme.colors.error}50`};
    background: ${props =>
      props.$variant === 'won'
        ? props.theme.colors.success
        : props.theme.colors.error};
    color: #fff;

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(0);
    animation: ${pulse} 0.3s ease;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.2) rotate(5deg);
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const BadgeContainer = styled.div<{
  $result?: 'won' | 'lost';
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${props => {
    if (props.$result === 'won') return `${props.theme.colors.success}20`;
    if (props.$result === 'lost') return `${props.theme.colors.error}20`;
    return props.theme.colors.background;
  }};
  border: 2px solid
    ${props => {
      if (props.$result === 'won') return props.theme.colors.success;
      if (props.$result === 'lost') return props.theme.colors.error;
      return props.theme.colors.border;
    }};
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => {
    if (props.$result === 'won') return props.theme.colors.success;
    if (props.$result === 'lost') return props.theme.colors.error;
    return props.theme.colors.textSecondary;
  }};
  cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => (props.$disabled ? 0.9 : 1)};

  ${props =>
    !props.$disabled &&
    `
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${props.$result === 'won' ? `${props.theme.colors.success}40` : props.$result === 'lost' ? `${props.theme.colors.error}40` : 'rgba(0, 0, 0, 0.1)'};
    }
    &:active {
      transform: translateY(0);
    }
  `}
`;

const ReabrirButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultWithReabrirWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ResultBadge: React.FC<ResultBadgeProps> = ({ task, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<'won' | 'lost' | null>(
    null
  );
  const [reopening, setReopening] = useState(false);

  const handleOpenModal = (result?: 'won' | 'lost') => {
    if (result) {
      setSelectedResult(result);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  const handleReabrir = async () => {
    if (reopening) return;
    setReopening(true);
    const previousTask = { ...task };
    const optimisticTask: KanbanTask = {
      ...task,
      result: undefined,
      resultDate: undefined,
      resultNotes: undefined,
      lossReason: undefined,
    };
    if (onUpdate) onUpdate(optimisticTask);
    try {
      await kanbanApi.markTaskResult(task.id, { result: 'open' });
      showSuccess('Tarefa reaberta para em andamento!');
    } catch (err: any) {
      if (onUpdate) onUpdate(previousTask);
      showError(err.message || 'Erro ao reabrir');
    } finally {
      setReopening(false);
    }
  };

  // Se já tem resultado (Vendido ou Perdido): badge desabilitado + botão Reabrir
  if (task.result === 'won' || task.result === 'lost') {
    return (
      <ResultWithReabrirWrapper>
        <BadgeContainer $result={task.result} $disabled>
          {task.result === 'won' ? (
            <>
              <MdCheckCircle size={20} />
              <span>Vendido</span>
            </>
          ) : (
            <>
              <MdCancel size={20} />
              <span>Perdido</span>
            </>
          )}
          {task.resultDate && (
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {new Date(task.resultDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              })}
            </span>
          )}
        </BadgeContainer>
        <ReabrirButton
          type='button'
          onClick={handleReabrir}
          disabled={reopening}
          title='Reabrir negociação'
        >
          <MdRefresh size={16} />
          Reabrir
        </ReabrirButton>
      </ResultWithReabrirWrapper>
    );
  }

  // Se não tem resultado, mostra os DOIS botões (Vendido e Perdido)
  return (
    <>
      <ButtonsContainer>
        <ResultButton
          $variant='won'
          onClick={() => handleOpenModal('won')}
          title='Marcar como Vendido'
        >
          <MdCheckCircle size={18} />
          <span>Vendido</span>
        </ResultButton>
        <ResultButton
          $variant='lost'
          onClick={() => handleOpenModal('lost')}
          title='Marcar como Perdido'
        >
          <MdCancel size={18} />
          <span>Perdido</span>
        </ResultButton>
      </ButtonsContainer>
      <ResultModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={task}
        onUpdate={onUpdate}
        selectedResult={selectedResult}
      />
    </>
  );
};
