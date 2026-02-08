import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { competitionService } from '../services/competition.service';
import { toast } from 'react-toastify';
import { MdArrowBack, MdSave, MdInfoOutline } from 'react-icons/md';
import {
  FieldContainer,
  RequiredIndicator,
  FieldInput,
  FieldSelect,
  Button,
} from '../styles/pages/CreateUserPageStyles';
import styled from 'styled-components';
import { UserMultiSelect } from '../components/common/UserMultiSelect';
import { TeamMultiSelect } from '../components/common/TeamMultiSelect';
import {
  CompetitionStatus,
  CompetitionStatusLabels,
} from '../types/competition.types';

export const CreateCompetitionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'individual' as 'individual' | 'team' | 'mixed',
    startDate: '',
    endDate: '',
    useCompanyPointsConfig: true,
    autoStart: true,
    autoEnd: true,
    minParticipants: '',
    maxParticipants: '',
  });
  const [initialStatus, setInitialStatus] = useState<CompetitionStatus>(
    CompetitionStatus.SCHEDULED
  );
  const [limitUsers, setLimitUsers] = useState(false);
  const [limitTeams, setLimitTeams] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  useEffect(() => {
    if (formData.type === 'individual') {
      setLimitTeams(false);
      setSelectedTeamIds([]);
    } else if (formData.type === 'team') {
      setLimitUsers(false);
      setSelectedUserIds([]);
    }
  }, [formData.type]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    // Validar datas
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    // Data de início não pode ser no passado
    if (startDate < now) {
      toast.error('A data de início não pode ser anterior à data atual!');
      return;
    }

    // Data de término deve ser posterior à data de início
    if (endDate <= startDate) {
      toast.error('A data de término deve ser posterior à data de início!');
      return;
    }

    // Validar duração mínima (pelo menos 1 dia)
    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays < 1) {
      toast.error('A competição deve ter duração mínima de 1 dia!');
      return;
    }

    // Validar participantes
    const minPart = formData.minParticipants
      ? parseInt(formData.minParticipants)
      : 0;
    const maxPart = formData.maxParticipants
      ? parseInt(formData.maxParticipants)
      : 0;

    if (minPart && minPart < 1) {
      toast.error('O mínimo de participantes deve ser pelo menos 1!');
      return;
    }

    if (maxPart && maxPart < 1) {
      toast.error('O máximo de participantes deve ser pelo menos 1!');
      return;
    }

    if (minPart && maxPart && maxPart < minPart) {
      toast.error(
        'O máximo de participantes deve ser maior ou igual ao mínimo!'
      );
      return;
    }

    // Validar participantes obrigatórios conforme tipo
    if (
      (formData.type === 'individual' || formData.type === 'mixed') &&
      limitUsers &&
      selectedUserIds.length === 0
    ) {
      toast.error(
        'Selecione ao menos um participante (corretor) para a competição.'
      );
      return;
    }

    if (
      (formData.type === 'team' || formData.type === 'mixed') &&
      limitTeams &&
      selectedTeamIds.length === 0
    ) {
      toast.error('Selecione ao menos uma equipe participante.');
      return;
    }

    setLoading(true);

    try {
      const competitionData = {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        useCompanyPointsConfig: formData.useCompanyPointsConfig,
        autoStart: formData.autoStart,
        autoEnd: formData.autoEnd,
        minParticipants: formData.minParticipants
          ? parseInt(formData.minParticipants)
          : undefined,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : undefined,
        participantUserIds:
          formData.type === 'team'
            ? undefined
            : limitUsers
              ? selectedUserIds
              : undefined,
        participantTeamIds:
          formData.type === 'individual'
            ? undefined
            : limitTeams
              ? selectedTeamIds
              : undefined,
      };

      const result = await competitionService.create(competitionData);
      if (initialStatus !== CompetitionStatus.DRAFT) {
        try {
          await competitionService.changeStatus(result.id, initialStatus);
        } catch (statusError: any) {
          toast.error(
            statusError?.response?.data?.message ||
              'Competição criada, mas não foi possível alterar o status inicial.'
          );
        }
      }

      toast.success('Competição criada com sucesso!');

      // Redirecionar para página de adicionar prêmios
      navigate(`/competitions/${result.id}/prizes`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar competição');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/competitions');
  };

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>Nova Competição</SimpleTitle>
            <SimpleSubtitle>
              Preencha as informações para criar uma nova competição
            </SimpleSubtitle>
          </div>
          <SimpleBackButton onClick={handleBack}>
            <MdArrowBack size={20} />
            Voltar
          </SimpleBackButton>
        </SimpleHeader>

        <form onSubmit={handleSubmit}>
          <SimpleFormGrid>
            <FieldContainer>
              <FieldLabelWithTooltip>
                Nome da Competição <RequiredIndicator>*</RequiredIndicator>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Identificação pública da competição. Aparece em dashboards e
                    relatórios.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldInput
                type='text'
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder='Ex: Campeonato de Vendas Q1 2025'
                required
                maxLength={100}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Tipo de Competição <RequiredIndicator>*</RequiredIndicator>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Define se o ranking avalia corretores, equipes ou ambos
                    (competição mista).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldSelect
                value={formData.type}
                onChange={e => handleInputChange('type', e.target.value)}
                required
              >
                <option value='individual'>Individual (Corretores)</option>
                <option value='team'>Por Equipes</option>
                <option value='mixed'>Misto (Ambos)</option>
              </FieldSelect>
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Descrição
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Texto exibido aos participantes com detalhes sobre regras,
                    prêmios e objetivos.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <TextArea
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder='Descrição detalhada da competição...'
                rows={4}
                maxLength={300}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Status Inicial
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Define se a competição começa como rascunho, agendada ou já
                    ativa após a criação.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldSelect
                value={initialStatus}
                onChange={e =>
                  setInitialStatus(e.target.value as CompetitionStatus)
                }
              >
                {Object.entries(CompetitionStatusLabels)
                  .filter(([value]) =>
                    [
                      CompetitionStatus.DRAFT,
                      CompetitionStatus.SCHEDULED,
                      CompetitionStatus.ACTIVE,
                    ].includes(value as CompetitionStatus)
                  )
                  .map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </FieldSelect>
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Data de Início <RequiredIndicator>*</RequiredIndicator>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Momento em que os pontos passam a contar para o ranking
                    desta competição.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldInput
                type='datetime-local'
                value={formData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Data de Término <RequiredIndicator>*</RequiredIndicator>
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Após esta data a competição é encerrada e nenhum ponto extra
                    é contabilizado.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldInput
                type='datetime-local'
                value={formData.endDate}
                onChange={e => handleInputChange('endDate', e.target.value)}
                min={
                  formData.startDate || new Date().toISOString().slice(0, 16)
                }
                required
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Mínimo de Participantes
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Quantidade mínima recomendada para iniciar a disputa
                    (opcional).
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldInput
                type='number'
                min='1'
                value={formData.minParticipants}
                onChange={e =>
                  handleInputChange('minParticipants', e.target.value)
                }
                placeholder='Opcional'
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabelWithTooltip>
                Máximo de Participantes
                <TooltipWrapper>
                  <TooltipIcon />
                  <TooltipContent>
                    Limite total de competidores. Deixe em branco para não
                    limitar.
                  </TooltipContent>
                </TooltipWrapper>
              </FieldLabelWithTooltip>
              <FieldInput
                type='number'
                min='1'
                value={formData.maxParticipants}
                onChange={e =>
                  handleInputChange('maxParticipants', e.target.value)
                }
                placeholder='Opcional'
              />
            </FieldContainer>

            <ToggleGroup>
              <ToggleItem>
                <ToggleCheckbox
                  type='checkbox'
                  checked={formData.useCompanyPointsConfig}
                  onChange={e =>
                    handleInputChange(
                      'useCompanyPointsConfig',
                      e.target.checked
                    )
                  }
                />
                <ToggleText>Usar configuração de pontos da empresa</ToggleText>
              </ToggleItem>

              <ToggleItem>
                <ToggleCheckbox
                  type='checkbox'
                  checked={formData.autoStart}
                  onChange={e =>
                    handleInputChange('autoStart', e.target.checked)
                  }
                />
                <ToggleText>Início automático na data</ToggleText>
              </ToggleItem>

              <ToggleItem>
                <ToggleCheckbox
                  type='checkbox'
                  checked={formData.autoEnd}
                  onChange={e => handleInputChange('autoEnd', e.target.checked)}
                />
                <ToggleText>Finalização automática na data</ToggleText>
              </ToggleItem>
            </ToggleGroup>

            {(formData.type === 'individual' || formData.type === 'mixed') && (
              <ParticipantsBlock>
                <ParticipantsHeader>
                  <ParticipantsTitle>
                    Participantes individuais
                  </ParticipantsTitle>
                  <ToggleWrapper>
                    <ToggleCheckbox
                      type='checkbox'
                      checked={limitUsers}
                      onChange={event => {
                        const checked = event.target.checked;
                        setLimitUsers(checked);
                        if (!checked) {
                          setSelectedUserIds([]);
                        }
                      }}
                    />
                    <TooltipWrapper>
                      <ToggleText>Selecionar usuários específicos</ToggleText>
                      <TooltipContent>
                        Marque para restringir a competição a determinados
                        corretores.
                      </TooltipContent>
                    </TooltipWrapper>
                  </ToggleWrapper>
                </ParticipantsHeader>
                {limitUsers ? (
                  <UserMultiSelect
                    selectedUserIds={selectedUserIds}
                    onSelect={userId =>
                      setSelectedUserIds(prev =>
                        prev.includes(userId) ? prev : [...prev, userId]
                      )
                    }
                    onRemove={userId =>
                      setSelectedUserIds(prev =>
                        prev.filter(id => id !== userId)
                      )
                    }
                    maxSelections={100}
                  />
                ) : (
                  <ParticipantsHint>
                    Todos os corretores da empresa participarão automaticamente.
                  </ParticipantsHint>
                )}
              </ParticipantsBlock>
            )}

            {(formData.type === 'team' || formData.type === 'mixed') && (
              <ParticipantsBlock>
                <ParticipantsHeader>
                  <ParticipantsTitle>Equipes participantes</ParticipantsTitle>
                  <ToggleWrapper>
                    <ToggleCheckbox
                      type='checkbox'
                      checked={limitTeams}
                      onChange={event => {
                        const checked = event.target.checked;
                        setLimitTeams(checked);
                        if (!checked) {
                          setSelectedTeamIds([]);
                        }
                      }}
                    />
                    <TooltipWrapper>
                      <ToggleText>Selecionar equipes específicas</ToggleText>
                      <TooltipContent>
                        Marque para escolher somente determinadas equipes para
                        competir.
                      </TooltipContent>
                    </TooltipWrapper>
                  </ToggleWrapper>
                </ParticipantsHeader>
                {limitTeams ? (
                  <TeamMultiSelect
                    selectedTeamIds={selectedTeamIds}
                    onSelect={teamId =>
                      setSelectedTeamIds(prev =>
                        prev.includes(teamId) ? prev : [...prev, teamId]
                      )
                    }
                    onRemove={teamId =>
                      setSelectedTeamIds(prev =>
                        prev.filter(id => id !== teamId)
                      )
                    }
                    maxSelections={50}
                  />
                ) : (
                  <ParticipantsHint>
                    Todas as equipes da empresa participarão automaticamente.
                  </ParticipantsHint>
                )}
              </ParticipantsBlock>
            )}
          </SimpleFormGrid>

          <ButtonsRow>
            <Button type='button' $variant='secondary' onClick={handleBack}>
              Cancelar
            </Button>
            <Button type='submit' $variant='primary' disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Criando...
                </>
              ) : (
                <>
                  <MdSave />
                  Criar Competição
                </>
              )}
            </Button>
          </ButtonsRow>
        </form>
      </SimplePageContainer>
    </Layout>
  );
};

// Styled Components específicos da página
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

const TextArea = styled.textarea`
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ToggleItem = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 999px;
  padding: 8px 14px;
`;

const ToggleCheckbox = styled.input`
  width: 18px;
  height: 18px;
`;

const ToggleText = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ParticipantsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ParticipantsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ParticipantsTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ToggleWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const ParticipantsHint = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 12px;
  border-radius: 10px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
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

export default CreateCompetitionPage;
