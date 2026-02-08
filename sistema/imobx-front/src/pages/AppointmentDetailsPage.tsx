import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdArrowBack,
  MdCalendarToday,
  MdLocationOn,
  MdDescription,
  MdPerson,
  MdAccessTime,
  MdHome,
  MdDelete,
  MdError,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useAppointments, type Appointment } from '../hooks/useAppointments';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { PermissionButton } from '../components/common/PermissionButton';
import styled, { keyframes } from 'styled-components';
import { formatPhoneDisplay } from '../utils/masks';
import {
  ClickableEmail,
  ClickablePhone,
} from '../components/common/ClickableContact';

const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SimpleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const SplitSections = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;

const SectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'confirmed':
      case 'scheduled':
        return '#10b98120';
      case 'pending':
      case 'in_progress':
        return '#f59e0b20';
      case 'cancelled':
      case 'no_show':
        return '#ef444420';
      case 'completed':
        return '#3b82f620';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'confirmed':
      case 'scheduled':
        return '#10b981';
      case 'pending':
      case 'in_progress':
        return '#f59e0b';
      case 'cancelled':
      case 'no_show':
        return '#ef4444';
      case 'completed':
        return '#3b82f6';
      default:
        return props.theme.colors.text;
    }
  }};
`;

const InvitesStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InvitesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InvitesGroup = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InvitesGroupTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InviteCard = styled.div`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const InviteUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
  background: ${props => props.theme.colors.primary};

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2px;
`;

const UserPhone = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InviteStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'accepted':
        return '#10b98120';
      case 'pending':
        return '#f59e0b20';
      case 'declined':
        return '#ef444420';
      case 'cancelled':
        return '#6b728020';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'accepted':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'declined':
        return '#ef4444';
      case 'cancelled':
        return '#6b7280';
      default:
        return props.theme.colors.text;
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 24px;
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
    width: 95%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ModalIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fef2f2;
  border: 2px solid #fecaca;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;

  svg {
    color: #ef4444;
    font-size: 32px;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  text-align: center;
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 8px 0;
  text-align: center;
  line-height: 1.5;
`;

const ModalWarning = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  text-align: center;
  font-weight: 600;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DeleteConfirmButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.errorHover || '#dc2626'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const appointmentTypeLabels: Record<string, string> = {
  visit: 'Visita',
  meeting: 'Reunião',
  inspection: 'Vistoria',
  documentation: 'Documentação',
  maintenance: 'Manutenção',
  marketing: 'Marketing',
  training: 'Treinamento',
  other: 'Outro',
};

const appointmentStatusLabels: Record<string, string> = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não compareceu',
};

const visibilityLabels: Record<string, string> = {
  public: 'Público',
  private: 'Privado',
  team: 'Equipe',
};

const getTypeLabel = (type: string): string => {
  return appointmentTypeLabels[type] || type;
};

const getStatusLabel = (status: string): string => {
  return appointmentStatusLabels[status] || status;
};

const getVisibilityLabel = (visibility: string): string => {
  return visibilityLabels[visibility] || visibility;
};

const getInviteStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    accepted: 'Aceito',
    pending: 'Pendente',
    declined: 'Recusado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
};

const getInviteStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    accepted: '✅',
    pending: '⏳',
    declined: '❌',
    cancelled: '🚫',
  };
  return icons[status] || '⏳';
};

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonContainer = styled.div`
  display: grid;
  gap: 24px;
`;

const SkeletonRow = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const SkeletonCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonLine = styled.div<{ $width?: string; $height?: string }>`
  width: ${props => props.$width ?? '100%'};
  height: ${props => props.$height ?? '16px'};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.border}30 0%,
    ${props => props.theme.colors.backgroundSecondary}80 50%,
    ${props => props.theme.colors.border}30 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

export const AppointmentDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getAppointmentById, deleteAppointment } = useAppointments();
  const { getCurrentUser } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAppointment = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getAppointmentById(id);
      setAppointment(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao carregar detalhes do agendamento';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id, getAppointmentById]);

  useEffect(() => {
    loadAppointment();
  }, [loadAppointment]);

  const handleEdit = () => {
    if (appointment && id) {
      navigate(`/calendar/edit/${id}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!appointment || !id) return;

    setIsDeleting(true);
    try {
      await deleteAppointment(id);
      toast.success('Agendamento excluído com sucesso!');
      navigate('/calendar');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir agendamento');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <SimplePageContainer>
          <SimpleHeader>
            <div>
              <SkeletonLine $width='260px' $height='28px' />
              <SkeletonLine $width='180px' $height='18px' />
            </div>
            <SkeletonLine $width='120px' $height='36px' />
          </SimpleHeader>

          <SkeletonContainer>
            <SkeletonRow>
              {[...Array(3)].map((_, index) => (
                <SkeletonCard key={index}>
                  <SkeletonLine $width='60%' $height='20px' />
                  <SkeletonLine />
                  <SkeletonLine $width='80%' />
                  <SkeletonLine $width='40%' />
                </SkeletonCard>
              ))}
            </SkeletonRow>

            <SkeletonRow>
              {[...Array(2)].map((_, index) => (
                <SkeletonCard key={index}>
                  <SkeletonLine $width='50%' $height='20px' />
                  <SkeletonLine />
                  <SkeletonLine $width='70%' />
                  <SkeletonLine $width='45%' />
                </SkeletonCard>
              ))}
            </SkeletonRow>

            <SkeletonCard>
              <SkeletonLine $width='40%' $height='20px' />
              {[...Array(3)].map((_, index) => (
                <SkeletonLine key={index} $width={`${60 + index * 10}%`} />
              ))}
            </SkeletonCard>
          </SkeletonContainer>
        </SimplePageContainer>
      </Layout>
    );
  }

  if (error || !appointment) {
    return (
      <Layout>
        <SimplePageContainer>
          <SimpleHeader>
            <SimpleBackButton onClick={() => navigate('/calendar')}>
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
          </SimpleHeader>
          <ErrorContainer>
            <ErrorTitle>Erro ao carregar agendamento</ErrorTitle>
            <ErrorMessage>{error || 'Agendamento não encontrado'}</ErrorMessage>
            <RetryButton onClick={loadAppointment}>
              Tentar novamente
            </RetryButton>
          </ErrorContainer>
        </SimplePageContainer>
      </Layout>
    );
  }

  // Agrupar convites por status
  const invites = appointment.invites || [];
  const acceptedInvites = invites.filter(inv => inv.status === 'accepted');
  const pendingInvites = invites.filter(inv => inv.status === 'pending');
  const declinedInvites = invites.filter(inv => inv.status === 'declined');
  const cancelledInvites = invites.filter(inv => inv.status === 'cancelled');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Verificar se o usuário atual é o criador do agendamento
  const currentUser = getCurrentUser();
  const isCreator =
    currentUser && appointment && currentUser.id === appointment.userId;

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>{appointment.title}</SimpleTitle>
            <SimpleSubtitle>Detalhes do agendamento</SimpleSubtitle>
          </div>
          <ActionGroup>
            <SimpleBackButton onClick={() => navigate('/calendar')}>
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
            {isCreator && (
              <>
                <PermissionButton
                  permission='calendar:update'
                  onClick={handleEdit}
                  variant='secondary'
                  size='medium'
                >
                  Editar
                </PermissionButton>
                <PermissionButton
                  permission='calendar:delete'
                  onClick={handleDeleteClick}
                  variant='danger'
                  size='medium'
                >
                  Excluir
                </PermissionButton>
              </>
            )}
          </ActionGroup>
        </SimpleHeader>

        <SimpleContent>
          <DetailsGrid>
            <SectionCard>
              <SectionBlock>
                <SectionTitle>
                  <MdCalendarToday size={20} />
                  Informações Gerais
                </SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Status</InfoLabel>
                    <InfoValue>
                      <StatusBadge $status={appointment.status}>
                        {getStatusLabel(appointment.status)}
                      </StatusBadge>
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Tipo</InfoLabel>
                    <InfoValue>{getTypeLabel(appointment.type)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Visibilidade</InfoLabel>
                    <InfoValue>
                      {getVisibilityLabel(appointment.visibility)}
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </SectionBlock>
            </SectionCard>

            <SectionCard>
              <SectionBlock>
                <SectionTitle>
                  <MdAccessTime size={20} />
                  Data e Horário
                </SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Data de Início</InfoLabel>
                    <InfoValue>{formatDate(appointment.startDate)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Data de Término</InfoLabel>
                    <InfoValue>{formatDate(appointment.endDate)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Duração</InfoLabel>
                    <InfoValue>
                      {Math.round(
                        (new Date(appointment.endDate).getTime() -
                          new Date(appointment.startDate).getTime()) /
                          (1000 * 60)
                      )}{' '}
                      minutos
                    </InfoValue>
                  </InfoItem>
                </InfoGrid>
              </SectionBlock>
            </SectionCard>

            {(appointment.property || appointment.client) && (
              <SectionCard>
                <SectionBlock>
                  <SectionTitle>
                    <MdPerson size={20} />
                    Relacionados
                  </SectionTitle>
                  <InfoGrid>
                    {appointment.property && (
                      <InfoItem>
                        <InfoLabel
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <MdHome size={16} />
                          Propriedade
                        </InfoLabel>
                        <InfoValue>
                          {appointment.property.title ||
                            appointment.property.code}
                        </InfoValue>
                      </InfoItem>
                    )}
                    {appointment.client && (
                      <InfoItem>
                        <InfoLabel
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <MdPerson size={16} />
                          Cliente
                        </InfoLabel>
                        <InfoValue>{appointment.client.name}</InfoValue>
                      </InfoItem>
                    )}
                  </InfoGrid>
                </SectionBlock>
              </SectionCard>
            )}
          </DetailsGrid>

          {(appointment.location ||
            appointment.description ||
            appointment.notes ||
            appointment.user) && (
            <SplitSections>
              {(appointment.location || appointment.description) && (
                <SectionColumn>
                  {appointment.location && (
                    <SectionCard>
                      <SectionBlock>
                        <SectionTitle>
                          <MdLocationOn size={20} />
                          Localização
                        </SectionTitle>
                        <InfoValue
                          style={{ fontSize: '1rem', lineHeight: '1.6' }}
                        >
                          {appointment.location}
                        </InfoValue>
                      </SectionBlock>
                    </SectionCard>
                  )}

                  {appointment.description && (
                    <SectionCard>
                      <SectionBlock>
                        <SectionTitle>
                          <MdDescription size={20} />
                          Descrição
                        </SectionTitle>
                        <InfoValue
                          style={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6',
                            fontSize: '0.95rem',
                          }}
                        >
                          {appointment.description}
                        </InfoValue>
                      </SectionBlock>
                    </SectionCard>
                  )}
                </SectionColumn>
              )}

              {(appointment.notes || appointment.user) && (
                <SectionColumn>
                  {appointment.notes && (
                    <SectionCard>
                      <SectionBlock>
                        <SectionTitle>
                          <MdDescription size={20} />
                          Observações
                        </SectionTitle>
                        <InfoValue
                          style={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6',
                            fontSize: '0.95rem',
                          }}
                        >
                          {appointment.notes}
                        </InfoValue>
                      </SectionBlock>
                    </SectionCard>
                  )}

                  {appointment.user && (
                    <SectionCard>
                      <SectionBlock>
                        <SectionTitle>
                          <MdPerson size={20} />
                          Criado por
                        </SectionTitle>
                        <InfoGrid>
                          <InfoItem>
                            <InfoLabel>Nome</InfoLabel>
                            <InfoValue>{appointment.user.name}</InfoValue>
                          </InfoItem>
                          {appointment.user.email && (
                            <InfoItem>
                              <InfoLabel>E-mail</InfoLabel>
                              <InfoValue>
                                <ClickableEmail
                                  email={appointment.user.email}
                                  showIcon={false}
                                >
                                  {appointment.user.email}
                                </ClickableEmail>
                              </InfoValue>
                            </InfoItem>
                          )}
                          {appointment.user.phone && (
                            <InfoItem>
                              <InfoLabel>Telefone</InfoLabel>
                              <InfoValue>
                                <ClickablePhone
                                  phone={appointment.user.phone}
                                  showIcon={false}
                                >
                                  {formatPhoneDisplay(appointment.user.phone)}
                                </ClickablePhone>
                              </InfoValue>
                            </InfoItem>
                          )}
                        </InfoGrid>
                      </SectionBlock>
                    </SectionCard>
                  )}
                </SectionColumn>
              )}
            </SplitSections>
          )}

          <SectionCard>
            <SectionBlock>
              <SectionTitle>
                <MdPerson size={20} />
                Convites ({invites.length})
              </SectionTitle>

              {invites.length > 0 ? (
                <>
                  <InvitesStats>
                    <StatCard>
                      <StatValue>{invites.length}</StatValue>
                      <StatLabel>Total</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue style={{ color: '#10b981' }}>
                        {acceptedInvites.length}
                      </StatValue>
                      <StatLabel>Aceitos</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue style={{ color: '#f59e0b' }}>
                        {pendingInvites.length}
                      </StatValue>
                      <StatLabel>Pendentes</StatLabel>
                    </StatCard>
                    <StatCard>
                      <StatValue style={{ color: '#ef4444' }}>
                        {declinedInvites.length + cancelledInvites.length}
                      </StatValue>
                      <StatLabel>Recusados/Cancelados</StatLabel>
                    </StatCard>
                  </InvitesStats>

                  <InvitesList>
                    {acceptedInvites.length > 0 && (
                      <InvitesGroup>
                        <InvitesGroupTitle>
                          ✅ Aceitos ({acceptedInvites.length})
                        </InvitesGroupTitle>
                        {acceptedInvites.map(invite => (
                          <InviteCard key={invite.id}>
                            <InviteUserInfo>
                              <Avatar>
                                {invite.invitedUser.avatar ? (
                                  <img
                                    src={invite.invitedUser.avatar}
                                    alt={invite.invitedUser.name}
                                    onError={e => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  getUserInitials(invite.invitedUser.name)
                                )}
                              </Avatar>
                              <UserDetails>
                                <UserName>{invite.invitedUser.name}</UserName>
                                <UserEmail>
                                  {invite.invitedUser.email}
                                </UserEmail>
                                {invite.invitedUser.phone && (
                                  <UserPhone>
                                    {formatPhoneDisplay(
                                      invite.invitedUser.phone
                                    )}
                                  </UserPhone>
                                )}
                              </UserDetails>
                            </InviteUserInfo>
                            <InviteStatusBadge $status={invite.status}>
                              {getInviteStatusIcon(invite.status)}{' '}
                              {getInviteStatusLabel(invite.status)}
                            </InviteStatusBadge>
                          </InviteCard>
                        ))}
                      </InvitesGroup>
                    )}

                    {pendingInvites.length > 0 && (
                      <InvitesGroup>
                        <InvitesGroupTitle>
                          ⏳ Pendentes ({pendingInvites.length})
                        </InvitesGroupTitle>
                        {pendingInvites.map(invite => (
                          <InviteCard key={invite.id}>
                            <InviteUserInfo>
                              <Avatar>
                                {invite.invitedUser.avatar ? (
                                  <img
                                    src={invite.invitedUser.avatar}
                                    alt={invite.invitedUser.name}
                                    onError={e => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  getUserInitials(invite.invitedUser.name)
                                )}
                              </Avatar>
                              <UserDetails>
                                <UserName>{invite.invitedUser.name}</UserName>
                                <UserEmail>
                                  {invite.invitedUser.email}
                                </UserEmail>
                                {invite.invitedUser.phone && (
                                  <UserPhone>
                                    {formatPhoneDisplay(
                                      invite.invitedUser.phone
                                    )}
                                  </UserPhone>
                                )}
                              </UserDetails>
                            </InviteUserInfo>
                            <InviteStatusBadge $status={invite.status}>
                              {getInviteStatusIcon(invite.status)}{' '}
                              {getInviteStatusLabel(invite.status)}
                            </InviteStatusBadge>
                          </InviteCard>
                        ))}
                      </InvitesGroup>
                    )}

                    {declinedInvites.length > 0 && (
                      <InvitesGroup>
                        <InvitesGroupTitle>
                          ❌ Recusados ({declinedInvites.length})
                        </InvitesGroupTitle>
                        {declinedInvites.map(invite => (
                          <InviteCard key={invite.id}>
                            <InviteUserInfo>
                              <Avatar>
                                {invite.invitedUser.avatar ? (
                                  <img
                                    src={invite.invitedUser.avatar}
                                    alt={invite.invitedUser.name}
                                    onError={e => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  getUserInitials(invite.invitedUser.name)
                                )}
                              </Avatar>
                              <UserDetails>
                                <UserName>{invite.invitedUser.name}</UserName>
                                <UserEmail>
                                  {invite.invitedUser.email}
                                </UserEmail>
                                {invite.invitedUser.phone && (
                                  <UserPhone>
                                    {formatPhoneDisplay(
                                      invite.invitedUser.phone
                                    )}
                                  </UserPhone>
                                )}
                              </UserDetails>
                            </InviteUserInfo>
                            <InviteStatusBadge $status={invite.status}>
                              {getInviteStatusIcon(invite.status)}{' '}
                              {getInviteStatusLabel(invite.status)}
                            </InviteStatusBadge>
                          </InviteCard>
                        ))}
                      </InvitesGroup>
                    )}

                    {cancelledInvites.length > 0 && (
                      <InvitesGroup>
                        <InvitesGroupTitle>
                          🚫 Cancelados ({cancelledInvites.length})
                        </InvitesGroupTitle>
                        {cancelledInvites.map(invite => (
                          <InviteCard key={invite.id}>
                            <InviteUserInfo>
                              <Avatar>
                                {invite.invitedUser.avatar ? (
                                  <img
                                    src={invite.invitedUser.avatar}
                                    alt={invite.invitedUser.name}
                                    onError={e => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  getUserInitials(invite.invitedUser.name)
                                )}
                              </Avatar>
                              <UserDetails>
                                <UserName>{invite.invitedUser.name}</UserName>
                                <UserEmail>
                                  {invite.invitedUser.email}
                                </UserEmail>
                                {invite.invitedUser.phone && (
                                  <UserPhone>
                                    {formatPhoneDisplay(
                                      invite.invitedUser.phone
                                    )}
                                  </UserPhone>
                                )}
                              </UserDetails>
                            </InviteUserInfo>
                            <InviteStatusBadge $status={invite.status}>
                              {getInviteStatusIcon(invite.status)}{' '}
                              {getInviteStatusLabel(invite.status)}
                            </InviteStatusBadge>
                          </InviteCard>
                        ))}
                      </InvitesGroup>
                    )}
                  </InvitesList>
                </>
              ) : (
                <EmptyState>Nenhum convite enviado até o momento.</EmptyState>
              )}
            </SectionBlock>
          </SectionCard>
        </SimpleContent>

        {showDeleteModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalIcon>
                  <MdDelete />
                </ModalIcon>
              </ModalHeader>
              <ModalTitle>Excluir agendamento?</ModalTitle>
              <ModalMessage>
                Tem certeza de que deseja excluir este agendamento? Essa ação
                não pode ser desfeita.
              </ModalMessage>
              <ModalWarning>
                Todos os convites relacionados serão cancelados e os
                participantes não receberão novas atualizações.
              </ModalWarning>
              <ModalActions>
                <CancelButton
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                >
                  Cancelar
                </CancelButton>
                <DeleteConfirmButton
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <MdError size={18} />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <MdDelete size={18} />
                      Excluir
                    </>
                  )}
                </DeleteConfirmButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </SimplePageContainer>
    </Layout>
  );
};

export default AppointmentDetailsPage;
