import React from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MdClose, MdFlashOn } from 'react-icons/md';
import { ColumnActionsConfig } from '../kanban/ColumnActionsConfig';
import type { KanbanColumn } from '../../types/kanban';
import type { ColumnAction } from '../../types/kanbanValidations';

interface ColumnActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: KanbanColumn | null;
  columns?: Array<{ id: string; title: string; position: number }>; // Todas as colunas do board
  projectId?: string;
  teamId?: string;
  workspace?: string;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 20px;
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5);
  border: 2px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 32px;
    right: 32px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.border},
      transparent
    );
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    flex-wrap: wrap;
    gap: 12px;

    &::after {
      left: 16px;
      right: 16px;
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.text};
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    flex-basis: 100%;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 0;
  background: ${props => props.theme.colors.surface};
  overflow-y: auto;
  flex: 1;
`;

export const ColumnActionsModal: React.FC<ColumnActionsModalProps> = ({
  isOpen,
  onClose,
  column,
  columns = [],
  projectId,
  teamId,
  workspace,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !column) return null;

  const handleCreateEdit = (action?: ColumnAction) => {
    const params = new URLSearchParams();
    params.append('columnId', column.id);
    if (projectId) params.append('projectId', projectId);
    if (teamId) params.append('teamId', teamId);
    if (workspace) params.append('workspace', workspace);
    if (action?.id) params.append('actionId', action.id);

    navigate(`/kanban/create-action?${params.toString()}`);
  };

  const modalContent = (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdFlashOn size={24} />
            Configurar Ações - {column.title}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ColumnActionsConfig
            columnId={column.id}
            onCreateEdit={handleCreateEdit}
          />
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
};
