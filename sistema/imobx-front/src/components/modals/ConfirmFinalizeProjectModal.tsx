import React from 'react';
import styled from 'styled-components';
import { MdClose, MdWarning, MdCheck } from 'react-icons/md';
import type { KanbanProject } from '../../types/kanban';

interface ConfirmFinalizeProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: KanbanProject | null;
  isFinalizing?: boolean;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  padding: 24px;
  max-width: 480px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
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
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const WarningIcon = styled.div`
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #fef3c7;
  border-radius: 50%;
  margin-bottom: 16px;
`;

const ModalBody = styled.div`
  margin-bottom: 24px;
`;

const WarningText = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const ProjectInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ProjectName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ConsequencesList = styled.ul`
  margin: 16px 0;
  padding-left: 20px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ConsequenceItem = styled.li`
  margin-bottom: 8px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: #10B981;
    color: white;

    &:hover:not(:disabled) {
      background: #059669;
    }

    &:disabled {
      background: #9CA3AF;
      cursor: not-allowed;
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover {
      background: ${props.theme.colors.background};
    }
  `}
`;

export const ConfirmFinalizeProjectModal: React.FC<
  ConfirmFinalizeProjectModalProps
> = ({ isOpen, onClose, onConfirm, project, isFinalizing = false }) => {
  if (!project) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <MdWarning size={20} />
            Finalizar Projeto
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <WarningIcon>
            <MdWarning size={24} />
          </WarningIcon>

          <WarningText>
            Você está prestes a finalizar o projeto. Esta ação não pode ser
            desfeita.
          </WarningText>

          <ProjectInfo>
            <ProjectName>{project.name}</ProjectName>
            <ProjectDetails>
              {project.description && (
                <span>Descrição: {project.description}</span>
              )}
              {project.dueDate && (
                <span>
                  Data de vencimento:{' '}
                  {new Date(project.dueDate).toLocaleDateString('pt-BR')}
                </span>
              )}
              <span>Status: {project.status}</span>
              <span>
                Tarefas: {project.taskCount || 0} total,{' '}
                {project.completedTaskCount || 0} concluídas
              </span>
            </ProjectDetails>
          </ProjectInfo>

          <ConsequencesList>
            <ConsequenceItem>
              <strong>Todas as tarefas pendentes</strong> serão marcadas como
              concluídas automaticamente
            </ConsequenceItem>
            <ConsequenceItem>
              O projeto será movido para o{' '}
              <strong>histórico de projetos finalizados</strong>
            </ConsequenceItem>
            <ConsequenceItem>
              O projeto <strong>não aparecerá mais</strong> na lista de projetos
              ativos
            </ConsequenceItem>
            <ConsequenceItem>
              Você poderá visualizar o projeto no <strong>histórico</strong> a
              qualquer momento
            </ConsequenceItem>
          </ConsequencesList>
        </ModalBody>

        <ModalActions>
          <ActionButton
            $variant='secondary'
            onClick={onClose}
            disabled={isFinalizing}
          >
            Cancelar
          </ActionButton>
          <ActionButton
            $variant='primary'
            onClick={onConfirm}
            disabled={isFinalizing}
          >
            <MdCheck size={16} />
            {isFinalizing ? 'Finalizando...' : 'Sim, Finalizar Projeto'}
          </ActionButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};
