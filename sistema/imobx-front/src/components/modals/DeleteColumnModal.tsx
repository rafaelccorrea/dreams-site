import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { MdClose, MdDelete, MdWarning, MdTask } from 'react-icons/md';
import type { KanbanColumn, KanbanTask } from '../../types/kanban';

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  column: KanbanColumn | null;
  tasks: KanbanTask[];
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.2s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.warning}15;
  color: ${props => props.theme.colors.warning};
  margin: 0 auto 16px auto;
`;

const WarningMessage = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const WarningTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const WarningText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

const TasksList = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  max-height: 180px;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const TaskIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

const TaskTitle = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.errorDark || props.theme.colors.error};
        }
      `;
    }

    return `
      background: ${props.theme.colors.backgroundSecondary};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      
      &:hover {
        background: ${props.theme.colors.border};
      }
    `;
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DeleteColumnModal: React.FC<DeleteColumnModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  column,
  tasks,
}) => {
  if (!isOpen || !column) return null;

  const columnTasks = tasks.filter(task => task.columnId === column.id);
  const hasTasks = columnTasks.length > 0;

  const handleConfirm = () => {
    if (!hasTasks) {
      onConfirm();
    }
    onClose();
  };

  const modalContent = (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {hasTasks ? 'Não é possível excluir' : 'Excluir Coluna'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={18} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <WarningIcon>
            <MdWarning size={32} />
          </WarningIcon>

          <WarningMessage>
            <WarningTitle>
              {hasTasks
                ? `Coluna "${column.title}" contém tarefas`
                : `Excluir coluna "${column.title}"?`}
            </WarningTitle>
            <WarningText>
              {hasTasks
                ? `Esta coluna contém ${columnTasks.length} tarefa(s) e não pode ser excluída.`
                : 'Esta ação não pode ser desfeita.'}
            </WarningText>
          </WarningMessage>

          {hasTasks && (
            <TasksList>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '12px',
                }}
              >
                Tarefas na coluna:
              </div>
              {columnTasks.map(task => (
                <TaskItem key={task.id}>
                  <TaskIcon>
                    <MdTask size={16} />
                  </TaskIcon>
                  <TaskTitle>{task.title}</TaskTitle>
                </TaskItem>
              ))}
            </TasksList>
          )}

          {!hasTasks && (
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
                marginTop: '12px',
                padding: '10px',
                background: 'var(--color-background-secondary)',
                borderRadius: '6px',
              }}
            >
              Esta ação não pode ser desfeita.
            </div>
          )}

          <ButtonGroup>
            <Button onClick={onClose}>Cancelar</Button>
            {!hasTasks && (
              <Button $variant='danger' onClick={handleConfirm}>
                <MdDelete size={14} />
                Excluir
              </Button>
            )}
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
};
