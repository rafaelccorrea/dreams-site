import React, { useState, useEffect } from 'react';
import {
  MdClose,
  MdHistory,
  MdCheckCircle,
  MdEdit,
  MdDelete,
  MdSwapHoriz,
  MdLocationOn,
  MdNote,
  MdKey,
  MdAccessTime,
  MdPerson,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styled from 'styled-components';
import { useKeyHistory } from '../../hooks/useKeyHistory';
import type { KeyHistoryRecord } from '../../hooks/useKeyHistory';

interface KeyHistoryModalProps {
  open: boolean;
  onClose: () => void;
  keyId: string;
  keyName: string;
}

// Modal overlay
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
  z-index: 1000;
  padding: 20px;
`;

// Modal container
const ModalContainer = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

// Modal header
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-secondary);
    color: var(--color-text);
  }
`;

// Modal content
const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
`;

// Loading state
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: var(--color-text-secondary);
  font-size: 14px;
`;

// Empty state
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: var(--color-background-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  font-size: 24px;
`;

const EmptyText = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
  text-align: center;
`;

// Error state
const ErrorContainer = styled.div`
  background: var(--color-error-background);
  border: 1px solid var(--color-error);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  color: var(--color-error);
  font-size: 20px;
`;

const ErrorText = styled.div`
  color: var(--color-error);
  font-size: 14px;
  flex: 1;
`;

const ErrorCloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 77, 79, 0.1);
  }
`;

// Timeline
const TimelineContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const Timeline = styled.div`
  position: relative;
  padding: 16px 0;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 40px;
  margin-bottom: 24px;

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 40px;
    bottom: -24px;
    width: 2px;
    background: var(--color-border);
  }
`;

const TimelineDot = styled.div<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  z-index: 1;
`;

const TimelineContent = styled.div`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
`;

const TimelineTime = styled.div`
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const TimelineDescription = styled.div`
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const TimelineMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const KeyHistoryModal: React.FC<KeyHistoryModalProps> = ({
  open,
  onClose,
  keyId,
  keyName,
}) => {
  const { history, isLoading, error, getKeyHistory, clearError } =
    useKeyHistory();

  useEffect(() => {
    if (open && keyId) {
      getKeyHistory(keyId);
    }
  }, [open, keyId, getKeyHistory]);

  const handleClose = () => {
    clearError();
    onClose();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <MdCheckCircle />;
      case 'updated':
        return <MdEdit />;
      case 'deleted':
        return <MdDelete />;
      case 'checked_out':
        return <MdSwapHoriz />;
      case 'returned':
        return <MdCheckCircle />;
      case 'status_changed':
        return <MdKey />;
      case 'location_changed':
        return <MdLocationOn />;
      case 'notes_updated':
        return <MdNote />;
      default:
        return <MdAccessTime />;
    }
  };

  const getActionColor = (action: string) => {
    // Usar variáveis do tema para adaptar dark/light
    switch (action) {
      case 'created':
        return 'var(--color-success)';
      case 'updated':
        return 'var(--color-primary)';
      case 'deleted':
        return 'var(--color-error)';
      case 'checked_out':
        return 'var(--color-warning)';
      case 'returned':
        return 'var(--color-success)';
      case 'status_changed':
        return 'var(--color-primary)';
      case 'location_changed':
        return 'var(--color-primary)';
      case 'notes_updated':
        return 'var(--color-primary)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Criada';
      case 'updated':
        return 'Atualizada';
      case 'deleted':
        return 'Excluída';
      case 'checked_out':
        return 'Retirada';
      case 'returned':
        return 'Devolvida';
      case 'status_changed':
        return 'Status alterado';
      case 'location_changed':
        return 'Localização alterada';
      case 'notes_updated':
        return 'Notas atualizadas';
      default:
        return 'Ação realizada';
    }
  };

  const formatTimelineItem = (record: KeyHistoryRecord) => {
    const actionColor = getActionColor(record.action);
    const actionIcon = getActionIcon(record.action);
    const actionLabel = getActionLabel(record.action);

    return (
      <TimelineItem key={record.id}>
        <TimelineDot $color={actionColor}>{actionIcon}</TimelineDot>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>{actionLabel}</TimelineTitle>
            <TimelineTime>
              {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>{record.description}</TimelineDescription>
          {record.user && (
            <TimelineMeta>
              <UserInfo>
                <MdPerson size={12} />
                {record.user.name || record.user.email}
              </UserInfo>
            </TimelineMeta>
          )}
        </TimelineContent>
      </TimelineItem>
    );
  };

  return (
    <ModalOverlay $isOpen={open} onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdHistory />
            Histórico da Chave: {keyName}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          {error && (
            <ErrorContainer>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>{error}</ErrorText>
              <ErrorCloseButton onClick={clearError}>
                <MdClose size={16} />
              </ErrorCloseButton>
            </ErrorContainer>
          )}

          {isLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Carregando histórico...</LoadingText>
            </LoadingContainer>
          ) : history.length === 0 ? (
            <EmptyContainer>
              <EmptyIcon>
                <MdHistory />
              </EmptyIcon>
              <EmptyText>Nenhum histórico encontrado para esta chave</EmptyText>
            </EmptyContainer>
          ) : (
            <TimelineContainer>
              <Timeline>{history.map(formatTimelineItem)}</Timeline>
            </TimelineContainer>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
