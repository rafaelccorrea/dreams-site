import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { getNavigationUrl } from '../../utils/pathUtils';
import { MdErrorOutline, MdEdit, MdClose } from 'react-icons/md';

interface ValidationErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  taskId: string;
  taskUrl: string;
  taskTitle?: string;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.9)')};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const IconContainer = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  font-family: 'Poppins', sans-serif;
`;

const ModalSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-family: 'Poppins', sans-serif;
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.errorBackground || '#fef2f2'};
  border: 1px solid ${props => props.theme.colors.error || '#fecaca'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  color: ${props => props.theme.colors.error || '#dc2626'};
  font-size: 0.9375rem;
  line-height: 1.5;
  font-family: 'Poppins', sans-serif;
`;

const TaskInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TaskTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: 'Poppins', sans-serif;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Poppins', sans-serif;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark || props.theme.colors.primary} 100%);
    color: white;
    box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${props.theme.colors.primary}60;
    }
    
    &:active {
      transform: translateY(0);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.hover};
      border-color: ${props.theme.colors.primary};
    }
  `}
`;

export const ValidationErrorModal: React.FC<ValidationErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  taskId,
  taskUrl,
  taskTitle,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleFix = () => {
    onClose();
    // Navegar para a página de detalhes da tarefa
    navigate(taskUrl);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer $isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <IconContainer>
            <MdErrorOutline size={28} color='#dc2626' />
          </IconContainer>
          <HeaderContent>
            <ModalTitle>Erro de Validação</ModalTitle>
            <ModalSubtitle>Não foi possível mover a tarefa</ModalSubtitle>
          </HeaderContent>
        </ModalHeader>

        <ErrorMessage>{errorMessage}</ErrorMessage>

        {taskTitle && (
          <TaskInfo>
            <TaskTitle title={taskTitle}>{taskTitle}</TaskTitle>
          </TaskInfo>
        )}

        <ModalButtons>
          <Button $variant='secondary' onClick={onClose}>
            <MdClose size={18} />
            Sair
          </Button>
          <Button $variant='primary' onClick={handleFix}>
            <MdEdit size={18} />
            Corrigir
          </Button>
        </ModalButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};
