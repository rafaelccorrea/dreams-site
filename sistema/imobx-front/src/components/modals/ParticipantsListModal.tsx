import React from 'react';
import { toast } from 'react-toastify';
import {
  MdClose,
  MdEmail,
  MdStar,
  MdExitToApp,
  MdDelete,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { useUsers } from '../../hooks/useUsers';
import type { ChatRoom } from '../../types/chat';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  UsersList,
  UserCard,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  EmptyState,
  EmptyText,
} from '../../styles/components/CreateChatModalStyles';
import styled from 'styled-components';

const LeaveGroupButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ParticipantBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--theme-text-secondary);
  margin-top: 4px;
`;

interface ParticipantsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ChatRoom | null;
  onLeaveGroup: () => Promise<void>;
  onRemoveParticipant?: (userId: string) => Promise<void>;
}

const RemoveUserButton = styled.button`
  padding: 6px 8px;
  background: transparent;
  border: 1px solid var(--theme-border);
  border-radius: 6px;
  color: var(--theme-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ParticipantsListModal: React.FC<ParticipantsListModalProps> = ({
  isOpen,
  onClose,
  room,
  onLeaveGroup,
  onRemoveParticipant,
}) => {
  const { getCurrentUser } = useAuth();
  const { users, getUsers } = useUsers();
  const [leaving, setLeaving] = React.useState(false);
  const [removingParticipants, setRemovingParticipants] = React.useState<
    Record<string, boolean>
  >({});

  const currentUser = getCurrentUser();

  // Carregar usuários quando o modal abrir
  React.useEffect(() => {
    if (isOpen) {
      getUsers({ page: 1, limit: 100 });
    }
  }, [isOpen, getUsers]);

  // Verificar se o usuário atual é administrador
  const isCurrentUserAdmin = React.useMemo(() => {
    if (!room || !currentUser) return false;
    const participant = room.participants.find(
      p => p.userId === currentUser.id
    );
    return participant?.isAdmin || false;
  }, [room, currentUser]);

  // Obter dados completos dos usuários participantes
  const participantUsers = React.useMemo(() => {
    if (!room || !users || users.length === 0) return [];

    return room.participants
      .map(participant => {
        const user = users.find(u => u.id === participant.userId);
        if (!user) return null;

        return {
          ...user,
          isAdmin: participant.isAdmin,
          joinedAt: participant.joinedAt,
        };
      })
      .filter(Boolean) as Array<
      (typeof users)[0] & { isAdmin: boolean; joinedAt: Date }
    >;
  }, [room, users]);

  const handleRemoveParticipant = async (userId: string) => {
    if (!room || !onRemoveParticipant || !isCurrentUserAdmin) {
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Não permitir remover a si mesmo (usar sair do grupo para isso)
    if (userId === currentUser?.id) {
      return;
    }

    const participant = room.participants.find(p => p.userId === userId);
    const isCreator = room.createdBy === userId;

    // Não permitir remover o criador
    if (isCreator) {
      return;
    }

    // Remover sem confirmação - a confirmação já foi feita pelo backend ou via toast

    try {
      setRemovingParticipants(prev => ({ ...prev, [userId]: true }));
      await onRemoveParticipant(userId);
    } catch (error: any) {
      console.error('Erro ao remover participante:', error);
    } finally {
      setRemovingParticipants(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    }
  };

  const handleLeaveGroup = async () => {
    if (!room || !currentUser) return;

    // Verificar se o usuário atual é administrador
    const currentParticipant = room.participants.find(
      p => p.userId === currentUser.id
    );
    const isCurrentUserAdmin = currentParticipant?.isAdmin || false;

    // Verificar se é o último administrador
    if (isCurrentUserAdmin) {
      const adminCount = room.participants.filter(p => p.isAdmin).length || 0;
      if (adminCount <= 1) {
        toast.error(
          'Não é possível sair do grupo se você for o último administrador. Promova outro usuário a administrador primeiro.'
        );
        return;
      }
    }

    // Confirmação será feita via toast no handler do ChatPage

    try {
      setLeaving(true);
      await onLeaveGroup();
      onClose();
    } catch (error: any) {
      console.error('Erro ao sair do grupo:', error);
      // Se o erro for sobre ser o último admin, mostrar mensagem específica
      if (
        error.message?.includes('último administrador') ||
        error.message?.includes('last admin') ||
        error.response?.data?.message?.includes('último administrador') ||
        error.response?.data?.message?.includes('last admin')
      ) {
        toast.error(
          'Não é possível sair do grupo se você for o último administrador. Promova outro usuário a administrador primeiro.'
        );
      } else {
        toast.error(error.message || 'Erro ao sair do grupo. Tente novamente.');
      }
    } finally {
      setLeaving(false);
    }
  };

  if (!isOpen || !room) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
      >
        <ModalHeader>
          <ModalTitle>
            Participantes do Grupo ({participantUsers.length})
          </ModalTitle>
          <ModalCloseButton onClick={onClose}>
            <MdClose size={20} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <UsersList>
            {participantUsers.length === 0 ? (
              <EmptyState>
                <EmptyText>Nenhum participante encontrado</EmptyText>
              </EmptyState>
            ) : (
              participantUsers.map(user => {
                const isCurrentUser = user.id === currentUser?.id;
                const participant = room.participants.find(
                  p => p.userId === user.id
                );
                const isAdmin = participant?.isAdmin || false;
                const isCreator = room.createdBy === user.id;
                const canRemove =
                  isCurrentUserAdmin &&
                  !isCurrentUser &&
                  !isCreator &&
                  !!onRemoveParticipant;
                const isRemoving = removingParticipants[user.id];

                return (
                  <UserCard
                    key={user.id}
                    $isSelected={false}
                    style={{ opacity: isRemoving ? 0.5 : 1 }}
                  >
                    <UserAvatar>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </UserAvatar>
                    <UserInfo style={{ flex: 1 }}>
                      <UserName
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {user.name}
                        {isCurrentUser && ' (Você)'}
                        {isAdmin && (
                          <MdStar
                            size={16}
                            style={{ color: '#fbbf24' }}
                            title='Administrador'
                          />
                        )}
                        {isCreator && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--theme-text-secondary)',
                              fontStyle: 'italic',
                            }}
                          >
                            (Criador)
                          </span>
                        )}
                      </UserName>
                      <UserEmail>
                        <MdEmail size={14} />
                        {user.email}
                      </UserEmail>
                      {participant && (
                        <ParticipantBadge>
                          Entrou em{' '}
                          {new Date(participant.joinedAt).toLocaleDateString(
                            'pt-BR'
                          )}
                        </ParticipantBadge>
                      )}
                    </UserInfo>
                    {canRemove && (
                      <RemoveUserButton
                        onClick={() => handleRemoveParticipant(user.id)}
                        disabled={isRemoving}
                        title='Remover participante'
                        style={{ marginLeft: '8px' }}
                      >
                        <MdDelete size={16} />
                      </RemoveUserButton>
                    )}
                  </UserCard>
                );
              })
            )}
          </UsersList>

          {/* Botão para sair do grupo - apenas para o usuário atual */}
          {room.type === 'group' &&
            currentUser &&
            room.participants.some(p => p.userId === currentUser.id) && (
              <LeaveGroupButton onClick={handleLeaveGroup} disabled={leaving}>
                <MdExitToApp size={18} />
                {leaving ? 'Saindo...' : 'Sair do Grupo'}
              </LeaveGroupButton>
            )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
