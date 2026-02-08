import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  MdClose,
  MdHistory,
  MdStar,
  MdPersonAdd,
  MdPersonRemove,
  MdExitToApp,
  MdGroup,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ChatRoomHistory } from '../../types/chat';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  EmptyState,
  EmptyText,
} from '../../styles/components/CreateChatModalStyles';
import styled from 'styled-components';

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px 0;
`;

const HistoryItem = styled.div`
  padding: 12px;
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HistoryItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--theme-text);
`;

const HistoryItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--theme-text-secondary);
`;

const HistoryItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--theme-text-secondary);
  margin-top: 4px;
`;

const HistoryIcon = styled.div<{
  $variant?: 'join' | 'leave' | 'admin' | 'create';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$variant) {
      case 'join':
        return '#10B981';
      case 'leave':
        return '#EF4444';
      case 'admin':
        return '#F59E0B';
      case 'create':
        return '#3B82F6';
      default:
        return 'var(--theme-border)';
    }
  }};
  color: white;
  flex-shrink: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
`;

const LoadingText = styled.p`
  color: var(--theme-text-secondary);
  font-size: 0.875rem;
`;

const GroupInfo = styled.div`
  padding: 16px;
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  margin-bottom: 16px;
`;

const GroupInfoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--theme-text);
  margin-bottom: 8px;
`;

const GroupInfoText = styled.p`
  font-size: 0.875rem;
  color: var(--theme-text-secondary);
  margin: 4px 0;
`;

interface GroupHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  onGetHistory: (roomId: string) => Promise<ChatRoomHistory>;
}

export const GroupHistoryModal: React.FC<GroupHistoryModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onGetHistory,
}) => {
  const [history, setHistory] = useState<ChatRoomHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && roomId) {
      loadHistory();
    } else {
      setHistory(null);
      setError(null);
    }
  }, [isOpen, roomId]);

  const loadHistory = async () => {
    if (!roomId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await onGetHistory(roomId);
      setHistory(data);
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err);
      setError(err.message || 'Erro ao carregar histórico do grupo');
      toast.error('Erro ao carregar histórico do grupo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  if (!isOpen || !roomId) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <ModalHeader>
          <ModalTitle>
            <MdHistory size={20} />
            Histórico do Grupo
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <MdClose size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <LoadingText>Carregando histórico...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <EmptyState>
              <EmptyText>{error}</EmptyText>
            </EmptyState>
          ) : history ? (
            <>
              {/* Informações do grupo */}
              <GroupInfo>
                <GroupInfoTitle>{history.name}</GroupInfoTitle>
                {history.createdByName && (
                  <GroupInfoText>
                    <strong>Criado por:</strong> {history.createdByName}
                  </GroupInfoText>
                )}
                <GroupInfoText>
                  <strong>Criado em:</strong> {formatDate(history.createdAt)}
                </GroupInfoText>
              </GroupInfo>

              {/* Lista de participantes */}
              <div>
                <h4
                  style={{
                    marginBottom: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--theme-text)',
                  }}
                >
                  Participantes ({history.participants.length})
                </h4>
                {history.participants.length === 0 ? (
                  <EmptyState>
                    <EmptyText>Nenhum participante encontrado</EmptyText>
                  </EmptyState>
                ) : (
                  <HistoryList>
                    {history.participants.map((participant, index) => {
                      const isActive = participant.isActive;
                      const hasLeft = !!participant.leftAt;

                      return (
                        <HistoryItem key={`${participant.userId}-${index}`}>
                          <HistoryItemHeader>
                            <HistoryIcon
                              $variant={
                                hasLeft ? 'leave' : isActive ? 'join' : 'create'
                              }
                            >
                              {hasLeft ? (
                                <MdExitToApp size={18} />
                              ) : (
                                <MdPersonAdd size={18} />
                              )}
                            </HistoryIcon>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span>{participant.userName}</span>
                                {participant.isAdmin && (
                                  <MdStar
                                    size={16}
                                    style={{ color: '#fbbf24' }}
                                    title='Administrador'
                                  />
                                )}
                                {!isActive && (
                                  <span
                                    style={{
                                      fontSize: '0.75rem',
                                      color: 'var(--theme-text-secondary)',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    (Inativo)
                                  </span>
                                )}
                              </div>
                            </div>
                          </HistoryItemHeader>
                          <HistoryItemContent>
                            {hasLeft ? (
                              <>
                                <div>
                                  <strong>Saiu do grupo em:</strong>{' '}
                                  {formatDate(participant.leftAt!)}
                                </div>
                                <HistoryItemMeta>
                                  Entrou em: {formatDate(participant.joinedAt)}
                                </HistoryItemMeta>
                              </>
                            ) : (
                              <HistoryItemMeta>
                                Entrou em: {formatDate(participant.joinedAt)}
                              </HistoryItemMeta>
                            )}
                          </HistoryItemContent>
                        </HistoryItem>
                      );
                    })}
                  </HistoryList>
                )}
              </div>
            </>
          ) : null}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
