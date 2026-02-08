import React from 'react';
import {
  MdCheck,
  MdClose,
  MdCalendarToday,
  MdPerson,
  MdEmail,
  MdAccessTime,
} from 'react-icons/md';
import type { AppointmentInvite } from '../../hooks/useAppointmentInvites';
import * as S from '../../styles/components/InvitesListStyles';

interface InvitesListProps {
  invites: AppointmentInvite[];
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
  isLoading?: boolean;
}

export const InvitesList: React.FC<InvitesListProps> = ({
  invites,
  onAccept,
  onDecline,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isInviteExpired = (endDate: string) => {
    const now = new Date();
    const appointmentEnd = new Date(endDate);
    return now > appointmentEnd;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'accepted':
        return '#10B981';
      case 'declined':
        return '#EF4444';
      case 'cancelled':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceito';
      case 'declined':
        return 'Recusado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (invites.length === 0) {
    return (
      <S.EmptyState>
        <MdCalendarToday size={48} />
        <S.EmptyTitle>Nenhum convite encontrado</S.EmptyTitle>
        <S.EmptyMessage>
          Você não possui convites de agendamento no momento.
        </S.EmptyMessage>
      </S.EmptyState>
    );
  }

  return (
    <S.InvitesContainer>
      {invites.map(invite => (
        <S.InviteCard key={invite.id}>
          <S.InviteHeader>
            <S.InviteTitle>{invite.appointment.title}</S.InviteTitle>
            <S.StatusBadge $color={getStatusColor(invite.status)}>
              {getStatusText(invite.status)}
            </S.StatusBadge>
          </S.InviteHeader>

          <S.InviteDetails>
            <S.DetailItem>
              <MdCalendarToday size={16} />
              <S.DetailText>
                {formatDate(invite.appointment.startDate)} -{' '}
                {formatDate(invite.appointment.endDate)}
              </S.DetailText>
            </S.DetailItem>

            {invite.appointment.location && (
              <S.DetailItem>
                <MdAccessTime size={16} />
                <S.DetailText>{invite.appointment.location}</S.DetailText>
              </S.DetailItem>
            )}

            <S.DetailItem>
              <MdPerson size={16} />
              <S.DetailText>Convidado por: {invite.inviter.name}</S.DetailText>
            </S.DetailItem>

            <S.DetailItem>
              <MdEmail size={16} />
              <S.DetailText>{invite.inviter.email}</S.DetailText>
            </S.DetailItem>
          </S.InviteDetails>

          {invite.message && (
            <S.InviteMessage>
              <S.MessageLabel>Mensagem:</S.MessageLabel>
              <S.MessageText>{invite.message}</S.MessageText>
            </S.InviteMessage>
          )}

          {invite.status === 'pending' && (
            <S.InviteActions>
              <S.ActionButton
                $variant='accept'
                onClick={() => onAccept(invite.id)}
                disabled={
                  isLoading || isInviteExpired(invite.appointment.endDate)
                }
                title={
                  isInviteExpired(invite.appointment.endDate)
                    ? 'Não é possível aceitar convites de agendamentos que já terminaram'
                    : ''
                }
              >
                <MdCheck size={18} />
                Aceitar
              </S.ActionButton>
              <S.ActionButton
                $variant='decline'
                onClick={() => onDecline(invite.id)}
                disabled={isLoading}
              >
                <MdClose size={18} />
                Recusar
              </S.ActionButton>
            </S.InviteActions>
          )}

          {invite.status === 'pending' &&
            isInviteExpired(invite.appointment.endDate) && (
              <S.InviteMessage style={{ color: '#EF4444', marginTop: '8px' }}>
                ⚠️ Este agendamento já foi finalizado e não pode mais ser aceito
              </S.InviteMessage>
            )}

          {invite.respondedAt && (
            <S.ResponseInfo>
              Respondido em: {formatDate(invite.respondedAt)}
            </S.ResponseInfo>
          )}
        </S.InviteCard>
      ))}
    </S.InvitesContainer>
  );
};
