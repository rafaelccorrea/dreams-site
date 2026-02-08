import React, { useState, useEffect } from 'react';
import { MdClose, MdPerson, MdEmail, MdSend, MdCancel } from 'react-icons/md';
import { ModalPadrão } from '../common/ModalPadrão';
import { useAppointmentInvites } from '../../hooks/useAppointmentInvites';
import type { CreateAppointmentInviteData } from '../../hooks/useAppointmentInvites';
import { useUsers } from '../../hooks/useUsers';
import { toast } from 'react-toastify';
import * as S from '../../styles/components/InviteModalStyles';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  appointmentTitle: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  appointmentTitle,
}) => {
  const { users, getUsers } = useUsers();
  const { createInvite, isLoading } = useAppointmentInvites();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      getUsers();
    }
  }, [isOpen, getUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error('Selecione um usuário para convidar');
      return;
    }

    try {
      const inviteData: CreateAppointmentInviteData = {
        appointmentId,
        invitedUserId: selectedUserId,
        message: message.trim() || undefined,
      };

      await createInvite(inviteData);
      handleClose();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleClose = () => {
    setSelectedUserId('');
    setMessage('');
    setSearchTerm('');
    onClose();
  };

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={handleClose}
      title='Convidar para Agendamento'
      subtitle={`Convide um usuário para participar do agendamento: "${appointmentTitle}"`}
      icon={<MdPerson size={24} />}
      maxWidth='600px'
      footer={
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <S.Button
            $variant='secondary'
            onClick={handleClose}
            disabled={isLoading}
          >
            <MdCancel size={18} />
            Cancelar
          </S.Button>
          <S.Button
            $variant='primary'
            onClick={handleSubmit}
            disabled={!selectedUserId || isLoading}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ccc',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px',
                  }}
                />
                Enviando...
              </>
            ) : (
              <>
                <MdSend size={18} />
                Enviar Convite
              </>
            )}
          </S.Button>
        </div>
      }
    >
      <S.FormContent>
        <S.FormGroup>
          <S.Label>Buscar Usuário *</S.Label>
          <S.SearchContainer>
            <S.SearchInput
              type='text'
              placeholder='Digite o nome ou email do usuário...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <S.SearchIcon>
              <MdPerson size={18} />
            </S.SearchIcon>
          </S.SearchContainer>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Selecionar Usuário *</S.Label>
          <S.UsersList>
            {filteredUsers.length === 0 ? (
              <S.EmptyState>
                <MdPerson size={48} />
                <S.EmptyText>
                  {searchTerm
                    ? 'Nenhum usuário encontrado'
                    : 'Digite para buscar usuários'}
                </S.EmptyText>
              </S.EmptyState>
            ) : (
              filteredUsers.map(user => (
                <S.UserCard
                  key={user.id}
                  $isSelected={selectedUserId === user.id}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <S.UserAvatar>
                    {user.name.charAt(0).toUpperCase()}
                  </S.UserAvatar>
                  <S.UserInfo>
                    <S.UserName>{user.name}</S.UserName>
                    <S.UserEmail>
                      <MdEmail size={14} />
                      {user.email}
                    </S.UserEmail>
                  </S.UserInfo>
                  {selectedUserId === user.id && (
                    <S.SelectedIndicator>✓</S.SelectedIndicator>
                  )}
                </S.UserCard>
              ))
            )}
          </S.UsersList>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Mensagem (Opcional)</S.Label>
          <S.TextArea
            placeholder='Adicione uma mensagem personalizada para o convite...'
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
          />
        </S.FormGroup>
      </S.FormContent>
    </ModalPadrão>
  );
};
