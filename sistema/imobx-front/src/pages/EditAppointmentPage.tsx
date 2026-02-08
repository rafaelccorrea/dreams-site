import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdArrowBack,
  MdCheck,
  MdError,
  MdInfoOutline,
  MdPerson,
  MdClose,
  MdAdd,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import {
  useAppointments,
  type UpdateAppointmentData,
} from '../hooks/useAppointments';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { useCompanyMembers } from '../hooks/useCompanyMembers';
import { toast } from 'react-toastify';
import { PermissionRoute } from '../components/PermissionRoute';
import { CalendarShimmer } from '../components/shimmer/CalendarShimmer';
import styled from 'styled-components';
import {
  Input,
  TextArea,
  Select,
  ColorPicker,
  ColorOption,
  Button,
  ToastContainer,
  ToastIcon,
  ToastMessage,
  ErrorText,
  LoadingSpinner,
} from '../styles/pages/CalendarPageStyles';

const colors = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#F59E0B', // Amarelo
  '#EF4444', // Vermelho
  '#8B5CF6', // Roxo
  '#06B6D4', // Ciano
  '#84CC16', // Lima
  '#F97316', // Laranja
  '#EC4899', // Rosa
  '#6366F1', // Índigo
];

const appointmentTypes = {
  visit: 'Visita',
  meeting: 'Reunião',
  inspection: 'Vistoria',
  documentation: 'Documentação',
  maintenance: 'Manutenção',
  marketing: 'Marketing',
  training: 'Treinamento',
  other: 'Outro',
};

const visibilityTypes = {
  public: 'Público',
  private: 'Privado',
  team: 'Equipe',
};

const statusTypes = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  no_show: 'Não compareceu',
};

const ParticipantsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const ParticipantsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ParticipantsTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const ParticipantCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  gap: 12px;
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const ParticipantAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
  background: ${props => props.theme.colors.primary};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ParticipantDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ParticipantName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2px;
`;

const ParticipantEmail = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddParticipantSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const AddParticipantSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 8px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  option {
    padding: 8px;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryHover || props.theme.colors.primary};
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyParticipants = styled.div`
  text-align: center;
  padding: 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

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

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabelWithTooltip = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: visible;
  z-index: 1;
`;

const TooltipIcon = styled(MdInfoOutline)`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;
`;

const TooltipContent = styled.span`
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.75rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  z-index: 200000;
  pointer-events: none;

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const CenteredMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EditAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getAppointmentById, updateAppointment } = useAppointments();
  const { getCurrentUser } = useAuth();
  const { hasPermission } = usePermissions();
  const {
    members,
    getMembers,
    getMembersSimple,
    isLoading: isLoadingMembers,
  } = useCompanyMembers({ autoLoad: false });

  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState<UpdateAppointmentData>({
    title: '',
    description: '',
    type: 'visit',
    status: 'scheduled',
    visibility: 'private',
    startDate: '',
    endDate: '',
    location: '',
    notes: '',
    color: colors[0],
    participantIds: [],
  });

  const [dateErrors, setDateErrors] = useState({
    startDate: '',
    endDate: '',
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadOnceRef = useRef(false);

  const loadAppointment = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await getAppointmentById(id);

      // Verificar se o usuário atual é o criador do agendamento
      const currentUser = getCurrentUser();
      if (currentUser && data.userId !== currentUser.id) {
        toast.error('Você não tem permissão para editar este agendamento');
        setTimeout(() => {
          navigate('/calendar');
        }, 2000);
        return;
      }

      setAppointment(data);

      // Formatar datas para datetime-local (remover a parte Z e ajustar)
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'visit',
        status: data.status || 'scheduled',
        visibility: data.visibility || 'private',
        startDate: data.startDate ? formatDateForInput(data.startDate) : '',
        endDate: data.endDate ? formatDateForInput(data.endDate) : '',
        location: data.location || '',
        notes: data.notes || '',
        color: data.color || colors[0],
        participantIds: data.participantIds || [],
      });

      // Carregar membros da empresa - usar getMembersSimple para evitar problemas com skip
      try {
        // Tentar usar getMembersSimple primeiro (endpoint /simple não precisa de skip)
        await getMembersSimple();
      } catch {
        try {
          await getMembers({ page: 1, limit: 100 });
        } catch {
          // Não bloquear o carregamento do agendamento se falhar carregar membros
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao carregar agendamento';
      setToastMessage(errorMessage);
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
        navigate('/calendar');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  }, [
    id,
    getAppointmentById,
    navigate,
    getMembers,
    getMembersSimple,
    getCurrentUser,
  ]);

  useEffect(() => {
    loadOnceRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!id || loadOnceRef.current) {
      return;
    }
    loadOnceRef.current = true;
    void loadAppointment();
  }, [id, loadAppointment]);

  // Reconstruir participantes quando members são carregados e appointment tem participantIds
  useEffect(() => {
    if (!appointment || members.length === 0) return;

    const participantIds = appointment.participantIds || [];
    const currentParticipants = appointment.participants || [];

    // Se não tiver participants mas tiver participantIds e members carregados
    if (
      participantIds.length > 0 &&
      (!currentParticipants || currentParticipants.length === 0) &&
      members.length > 0
    ) {
      // Construir participantes a partir dos participantIds
      const constructedParticipants = participantIds
        .map((participantId: string) => {
          const member = members.find(m => m.id === participantId);
          if (member) {
            return {
              id: member.id,
              name: member.name,
              email: member.email,
              avatar: member.avatar || null,
              phone: member.phone || null,
              role: member.role || 'user',
            };
          }
          return null;
        })
        .filter((p: any) => p !== null);

      // Atualizar appointment com participantes construídos
      if (constructedParticipants.length > 0) {
        setAppointment((prev: any) => {
          if (!prev) return prev;

          // Verificar se já tem os participantes ou se são diferentes
          const prevParticipants = prev.participants || [];
          const prevIds = prevParticipants
            .map((p: any) => p?.id)
            .filter(Boolean)
            .sort()
            .join(',');
          const newIds = constructedParticipants
            .map((p: any) => p.id)
            .sort()
            .join(',');

          // Só atualizar se os IDs forem diferentes ou não tiver participants
          if (prevIds !== newIds || prevParticipants.length === 0) {
            return {
              ...prev,
              participants: constructedParticipants,
            };
          }
          return prev;
        });
      }
    }
  }, [appointment, members]);

  const validateDates = (
    start: string,
    end: string
  ): { startDate: string; endDate: string } => {
    const errors = { startDate: '', endDate: '' };

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (endDate <= startDate) {
        errors.endDate =
          'A data/hora de término deve ser posterior à data/hora de início';
      }
    }

    return errors;
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const errors = validateDates(formData.startDate, formData.endDate);
      setDateErrors(errors);
    } else {
      setDateErrors({ startDate: '', endDate: '' });
    }
  }, [formData.startDate, formData.endDate]);

  const handleUpdate = async () => {
    if (!id || !formData.title?.trim()) {
      setToastMessage('Título é obrigatório');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setToastMessage('Data e hora de início e término são obrigatórias');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    const errors = validateDates(formData.startDate, formData.endDate);
    if (errors.startDate || errors.endDate) {
      setToastMessage(errors.startDate || errors.endDate);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsUpdating(true);
    try {
      // Converter datas para ISO string
      const updateData: UpdateAppointmentData = {
        ...formData,
        startDate: new Date(formData.startDate!).toISOString(),
        endDate: new Date(formData.endDate!).toISOString(),
        participantIds: formData.participantIds || [],
      };

      await updateAppointment(id, updateData);

      setToastMessage('Agendamento atualizado com sucesso!');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate(`/calendar/details/${id}`);
      }, 1500);
    } catch (err: any) {
      setToastMessage(err.message || 'Erro ao atualizar agendamento');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddParticipant = (userId: string) => {
    // Adicionar ao estado local do formulário (não salvar ainda)
    const currentParticipantIds = formData.participantIds || [];
    if (!currentParticipantIds.includes(userId)) {
      setFormData(prev => ({
        ...prev,
        participantIds: [...currentParticipantIds, userId],
      }));
    }
  };

  const handleRemoveParticipant = (userId: string) => {
    // Remover do estado local do formulário (não salvar ainda)
    const currentParticipantIds = formData.participantIds || [];
    setFormData(prev => ({
      ...prev,
      participantIds: currentParticipantIds.filter(id => id !== userId),
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <SimplePageContainer>
          <CalendarShimmer />
        </SimplePageContainer>
      </Layout>
    );
  }

  if (!appointment) {
    return (
      <Layout>
        <SimplePageContainer>
          <SimpleHeader>
            <SimpleBackButton onClick={() => navigate('/calendar')}>
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
          </SimpleHeader>
          <CenteredMessage>Agendamento não encontrado</CenteredMessage>
        </SimplePageContainer>
      </Layout>
    );
  }

  return (
    <PermissionRoute permission='calendar:update'>
      <Layout>
        <SimplePageContainer>
          <SimpleHeader>
            <div>
              <SimpleTitle>Editar Agendamento</SimpleTitle>
              <SimpleSubtitle>Atualize os dados do agendamento</SimpleSubtitle>
            </div>
            <SimpleBackButton
              onClick={() => navigate(`/calendar/details/${id}`)}
            >
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
          </SimpleHeader>

          <SimpleFormGrid>
            <FieldContainer>
              <FieldLabelWithTooltip>
                Título <RequiredMark>*</RequiredMark>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Nome do compromisso exibido no calendário e nas
                    notificações.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <Input
                type='text'
                value={formData.title || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder='Digite o título do agendamento'
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Descrição
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Resumo do compromisso visível para os participantes (máx.
                    300 caracteres).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <TextArea
                value={formData.description || ''}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }
                }}
                placeholder='Descrição do agendamento'
                maxLength={300}
                rows={3}
              />
            </FieldContainer>

            <ResponsiveRow>
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Tipo
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Classifique o agendamento (visita, reunião, vistoria,
                      etc.).
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Select
                  value={formData.type || 'visit'}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, type: e.target.value }))
                  }
                >
                  {Object.entries(appointmentTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FieldContainer>

              <FieldContainer>
                <FieldLabelWithTooltip>
                  Status
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Atualize a situação do compromisso (confirmado, concluído,
                      cancelado...).
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Select
                  value={formData.status || 'scheduled'}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, status: e.target.value }))
                  }
                >
                  {Object.entries(statusTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </FieldContainer>

              {hasPermission('calendar:manage_visibility') && (
                <FieldContainer>
                  <FieldLabelWithTooltip>
                    Visibilidade
                    <TooltipWrapper>
                      <TooltipIcon />
                      <TooltipContent>
                        Controle quem pode visualizar este agendamento.
                      </TooltipContent>
                    </TooltipWrapper>
                  </FieldLabelWithTooltip>
                  <Select
                    value={formData.visibility || 'private'}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        visibility: e.target.value,
                      }))
                    }
                  >
                    {Object.entries(visibilityTypes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </FieldContainer>
              )}
            </ResponsiveRow>

            <ResponsiveRow>
              <FieldContainer>
                <FieldLabelWithTooltip>
                  Data/Hora Início <RequiredMark>*</RequiredMark>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Define quando o compromisso começa. Deve estar no futuro.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Input
                  type='datetime-local'
                  value={formData.startDate || ''}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  style={dateErrors.startDate ? { borderColor: '#EF4444' } : {}}
                />
                {dateErrors.startDate && (
                  <ErrorText>{dateErrors.startDate}</ErrorText>
                )}
              </FieldContainer>

              <FieldContainer>
                <FieldLabelWithTooltip>
                  Data/Hora Fim <RequiredMark>*</RequiredMark>
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Defina quando o compromisso termina. Precisa ser após o
                      início.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Input
                  type='datetime-local'
                  value={formData.endDate || ''}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, endDate: e.target.value }))
                  }
                  min={formData.startDate || ''}
                  style={dateErrors.endDate ? { borderColor: '#EF4444' } : {}}
                />
                {dateErrors.endDate && (
                  <ErrorText>{dateErrors.endDate}</ErrorText>
                )}
              </FieldContainer>
            </ResponsiveRow>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Local
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Informe endereço ou ponto de encontro (opcional).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <Input
                type='text'
                value={formData.location || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, location: e.target.value }))
                }
                placeholder='Local do agendamento'
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Observações
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Notas adicionais visíveis aos convidados (máx. 300
                    caracteres).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <TextArea
                value={formData.notes || ''}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    setFormData(prev => ({ ...prev, notes: e.target.value }));
                  }
                }}
                placeholder='Observações adicionais'
                rows={2}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Cor do Agendamento
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Destaque o compromisso visualmente no calendário.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <ColorPicker>
                {colors.map(color => (
                  <ColorOption
                    key={color}
                    $color={color}
                    $isSelected={(formData.color || colors[0]) === color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </ColorPicker>
            </FieldContainer>

            <ParticipantsSection>
              <ParticipantsHeader>
                <ParticipantsTitle>
                  <MdPerson size={20} />
                  Participantes ({(formData.participantIds || []).length})
                </ParticipantsTitle>
              </ParticipantsHeader>

              {(() => {
                const participantIds = formData.participantIds || [];
                let participantsToShow: any[] = [];

                if (participantIds.length > 0 && members.length > 0) {
                  participantsToShow = participantIds
                    .map((participantId: string) => {
                      const member = members.find(m => m.id === participantId);
                      if (member) {
                        return {
                          id: member.id,
                          name: member.name,
                          email: member.email,
                          avatar: member.avatar || null,
                          phone: member.phone || null,
                          role: member.role || 'user',
                        };
                      }
                      return null;
                    })
                    .filter((p: any) => p !== null) as any[];
                }

                if (participantsToShow.length > 0) {
                  return (
                    <ParticipantsList>
                      {participantsToShow.map((participant: any) => (
                        <ParticipantCard key={participant.id}>
                          <ParticipantInfo>
                            <ParticipantAvatar>
                              {participant.avatar ? (
                                <img
                                  src={participant.avatar}
                                  alt={participant.name}
                                  onError={e => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = 'none';
                                  }}
                                />
                              ) : (
                                participant.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()
                              )}
                            </ParticipantAvatar>
                            <ParticipantDetails>
                              <ParticipantName>
                                {participant.name}
                              </ParticipantName>
                              <ParticipantEmail>
                                {participant.email}
                              </ParticipantEmail>
                            </ParticipantDetails>
                          </ParticipantInfo>
                          <RemoveButton
                            onClick={() =>
                              handleRemoveParticipant(participant.id)
                            }
                            disabled={isUpdating}
                            title='Remover participante'
                          >
                            <MdClose size={18} />
                          </RemoveButton>
                        </ParticipantCard>
                      ))}
                    </ParticipantsList>
                  );
                }

                return (
                  <EmptyParticipants>
                    <MdPerson
                      size={32}
                      style={{ marginBottom: '8px', opacity: 0.5 }}
                    />
                    <div>Nenhum participante vinculado</div>
                  </EmptyParticipants>
                );
              })()}

              <AddParticipantSection>
                <FieldLabelWithTooltip>
                  Adicionar participante
                  <TooltipWrapper>
                    <TooltipIcon />
                    <TooltipContent>
                      Convide colaboradores da empresa para esse compromisso.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <AddParticipantSelect
                  value=''
                  onChange={e => {
                    const userId = e.target.value;
                    if (userId) {
                      handleAddParticipant(userId);
                      e.target.value = '';
                    }
                  }}
                  disabled={isUpdating || isLoadingMembers}
                >
                  <option value=''>Selecionar colaborador...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} {member.email ? `(${member.email})` : ''}
                    </option>
                  ))}
                </AddParticipantSelect>
                <AddButton
                  type='button'
                  onClick={async () => {
                    try {
                      await getMembersSimple();
                    } catch {
                      await getMembers({ page: 1, limit: 100 });
                    }
                  }}
                  disabled={isLoadingMembers}
                >
                  <MdAdd size={18} />
                  Atualizar lista de colaboradores
                </AddButton>
              </AddParticipantSection>
            </ParticipantsSection>
          </SimpleFormGrid>

          <ButtonsRow>
            <Button
              type='button'
              $variant='secondary'
              onClick={() => navigate(`/calendar/details/${id}`)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              $variant='primary'
              disabled={isUpdating}
              onClick={handleUpdate}
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner />
                  Salvando...
                </>
              ) : (
                <>
                  <MdCheck size={18} />
                  Salvar alterações
                </>
              )}
            </Button>
          </ButtonsRow>

          {showSuccessToast && (
            <ToastContainer $type='success'>
              <ToastIcon>
                <MdCheck size={20} />
              </ToastIcon>
              <ToastMessage>{toastMessage}</ToastMessage>
            </ToastContainer>
          )}

          {showErrorToast && (
            <ToastContainer $type='error'>
              <ToastIcon>
                <MdError size={20} />
              </ToastIcon>
              <ToastMessage>{toastMessage}</ToastMessage>
            </ToastContainer>
          )}
        </SimplePageContainer>
      </Layout>
    </PermissionRoute>
  );
};

export default EditAppointmentPage;
