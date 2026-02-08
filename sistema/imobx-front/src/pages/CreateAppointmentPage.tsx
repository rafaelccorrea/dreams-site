import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdError, MdInfoOutline } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useAppointments } from '../hooks/useAppointments';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionRoute } from '../components/PermissionRoute';
import { UserSelector } from '../components/common/UserSelector';
import styled from 'styled-components';
import {
  Input,
  TextArea,
  Select,
  Button,
  ColorPicker,
  ColorOption,
  LoadingSpinner,
  ToastContainer,
  ToastIcon,
  ToastMessage,
  ErrorText,
} from '../styles/pages/CalendarPageStyles';
import { type CreateAppointmentData } from '../hooks/useAppointments';

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

// Função helper para obter data/hora formatada
const getDefaultStartDate = () => {
  const now = new Date();
  const brasiliaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );
  const nextHour = brasiliaTime.getHours() + 1;

  if (nextHour >= 24) {
    brasiliaTime.setDate(brasiliaTime.getDate() + 1);
    brasiliaTime.setHours(0, 0, 0, 0);
  } else {
    brasiliaTime.setHours(nextHour, 0, 0, 0);
  }

  return brasiliaTime.toISOString().slice(0, 16);
};

const getDefaultEndDate = () => {
  const now = new Date();
  const brasiliaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );
  const nextTwoHours = brasiliaTime.getHours() + 2;

  if (nextTwoHours >= 24) {
    brasiliaTime.setDate(brasiliaTime.getDate() + 1);
    brasiliaTime.setHours(nextTwoHours - 24, 0, 0, 0);
  } else {
    brasiliaTime.setHours(nextTwoHours, 0, 0, 0);
  }

  return brasiliaTime.toISOString().slice(0, 16);
};

const CreateAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createAppointment } = useAppointments();
  const { hasPermission } = usePermissions();

  // Pegar data/hora inicial da URL se existir (quando vem do calendário)
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  const [formData, setFormData] = useState<CreateAppointmentData>({
    title: '',
    description: '',
    type: 'visit',
    visibility: 'private',
    startDate: startDateParam || getDefaultStartDate(),
    endDate: endDateParam || getDefaultEndDate(),
    location: '',
    notes: '',
    color: colors[0],
  });

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [dateErrors, setDateErrors] = useState({
    startDate: '',
    endDate: '',
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Validação de datas
  const validateDates = (
    start: string,
    end: string
  ): { startDate: string; endDate: string } => {
    const errors = { startDate: '', endDate: '' };

    // Usar horário de Brasília para comparação
    const now = new Date();
    const brasiliaNow = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    );
    // Tolerância de 1 minuto para evitar problemas de precisão
    brasiliaNow.setSeconds(0, 0);

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Validar se data de início não está no passado
      if (startDate < brasiliaNow) {
        errors.startDate = 'A data/hora de início não pode estar no passado';
      }

      // Validar se data de término não está no passado (após validar início)
      if (!errors.startDate && endDate < brasiliaNow) {
        errors.endDate = 'A data/hora de término não pode estar no passado';
      }

      // Validar se data de término é posterior à de início (após validar passado)
      if (!errors.startDate && !errors.endDate && endDate <= startDate) {
        errors.endDate =
          'A data/hora de término deve ser posterior à data/hora de início';
      }
    }

    return errors;
  };

  // Validar datas ao mudar formData
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const errors = validateDates(formData.startDate, formData.endDate);
      setDateErrors(errors);
    } else {
      setDateErrors({ startDate: '', endDate: '' });
    }
  }, [formData.startDate, formData.endDate]);

  const handleCreate = async () => {
    if (!formData.title.trim()) {
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

    // Verifica se há erros de validação
    const errors = validateDates(formData.startDate, formData.endDate);
    if (errors.startDate || errors.endDate) {
      setToastMessage(errors.startDate || errors.endDate);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    setIsCreating(true);
    try {
      const appointmentData = {
        ...formData,
        inviteUserIds: selectedUserIds.length > 0 ? selectedUserIds : undefined,
      };

      await createAppointment(appointmentData);

      const inviteMessage =
        selectedUserIds.length > 0
          ? `Agendamento criado e ${selectedUserIds.length} convite${selectedUserIds.length !== 1 ? 's' : ''} enviado${selectedUserIds.length !== 1 ? 's' : ''}!`
          : 'Agendamento criado com sucesso!';

      setToastMessage(inviteMessage);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/calendar');
      }, 1500);
    } catch (err: any) {
      setToastMessage(err.message || 'Erro ao criar agendamento');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PermissionRoute permission='calendar:create'>
      <Layout>
        <SimplePageContainer>
          <SimpleHeader>
            <div>
              <SimpleTitle>Novo Agendamento</SimpleTitle>
              <SimpleSubtitle>
                Preencha os dados para criar um novo agendamento
              </SimpleSubtitle>
            </div>
            <SimpleBackButton onClick={() => navigate('/calendar')}>
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
                    Nome do compromisso exibido no calendário e notificações.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <Input
                type='text'
                value={formData.title}
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
                    Adicione detalhes relevantes (máx. 300 caracteres).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <TextArea
                value={formData.description}
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
                      Classifique o compromisso (visita, reunião, vistoria
                      etc.).
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Select
                  value={formData.type}
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
                    value={formData.visibility}
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
                      Defina quando o evento começa. Deve ser no futuro.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Input
                  type='datetime-local'
                  value={formData.startDate}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().slice(0, 16)}
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
                      Defina quando o evento termina. Deve ser após o início.
                    </TooltipContent>
                  </TooltipWrapper>
                </FieldLabelWithTooltip>
                <Input
                  type='datetime-local'
                  value={formData.endDate}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, endDate: e.target.value }))
                  }
                  min={
                    formData.startDate || new Date().toISOString().slice(0, 16)
                  }
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
                    Informe um endereço ou local de referência (opcional).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <Input
                type='text'
                value={formData.location}
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
                    Notas adicionais visíveis aos participantes (máx. 300
                    caracteres).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <TextArea
                value={formData.notes}
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
                Convidar Colaboradores
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Selecione colaboradores para receberem convite por e-mail.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <UserSelector
                selectedUserIds={selectedUserIds}
                onSelectionChange={setSelectedUserIds}
                placeholder='Buscar colaboradores...'
                maxHeight='150px'
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Cor do Agendamento
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Diferencie o compromisso visualmente no calendário.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <ColorPicker>
                {colors.map(color => (
                  <ColorOption
                    key={color}
                    $color={color}
                    $isSelected={formData.color === color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </ColorPicker>
            </FieldContainer>
          </SimpleFormGrid>

          <ButtonsRow>
            <Button
              type='button'
              $variant='secondary'
              onClick={() => navigate('/calendar')}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              $variant='primary'
              disabled={isCreating}
              onClick={handleCreate}
            >
              {isCreating ? (
                <>
                  <LoadingSpinner />
                  Salvando...
                </>
              ) : (
                <>
                  <MdCheck size={18} />
                  Criar Agendamento
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

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
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

export default CreateAppointmentPage;
