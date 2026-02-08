import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { competitionService } from '@/services/competition.service';
import type { Competition } from '@/types/competition.types';
import { PermissionButton } from '@/components/common/PermissionButton';
import {
  CompetitionStatusLabels,
  CompetitionStatus,
} from '@/types/competition.types';
import CompetitionsShimmer from '@/components/shimmer/CompetitionsShimmer';
import { StatusDropdown } from '@/components/common/StatusDropdown';
import styled from 'styled-components';
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdEmojiEvents,
  MdEmojiFlags,
  MdViewModule,
  MdViewList,
  MdVisibility,
  MdWarningAmber,
} from 'react-icons/md';
import { toast } from 'react-toastify';

export const CompetitionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filterStatus, setFilterStatus] = useState<CompetitionStatus | 'all'>(
    'all'
  );
  const [filterType, setFilterType] = useState<
    'all' | 'individual' | 'team' | 'mixed'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'startDate' | 'endDate'>(
    'startDate'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteTarget, setDeleteTarget] = useState<Competition | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingCompetition, setIsDeletingCompetition] = useState(false);
  const [finalizeTarget, setFinalizeTarget] = useState<Competition | null>(
    null
  );
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [isFinalizingCompetition, setIsFinalizingCompetition] = useState(false);

  useEffect(() => {
    loadCompetitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadCompetitions = async () => {
    setLoading(true);
    try {
      const data = await competitionService.findAll(
        filterStatus === 'all' ? undefined : filterStatus
      );
      setCompetitions(data);
    } catch (error) {
      toast.error('Erro ao carregar competições');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingCompetition(true);
    try {
      await competitionService.delete(deleteTarget.id);
      toast.success('Competição excluída com sucesso');
      loadCompetitions();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao excluir competição'
      );
    } finally {
      setIsDeletingCompetition(false);
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const closeDeleteModal = () => {
    if (isDeletingCompetition) return;
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleFinalize = async () => {
    if (!finalizeTarget) return;
    setIsFinalizingCompetition(true);
    try {
      await competitionService.finalize(finalizeTarget.id);
      toast.success('Competição finalizada com sucesso');
      loadCompetitions();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao finalizar competição'
      );
    } finally {
      setIsFinalizingCompetition(false);
      setIsFinalizeModalOpen(false);
      setFinalizeTarget(null);
    }
  };

  const closeFinalizeModal = () => {
    if (isFinalizingCompetition) return;
    setIsFinalizeModalOpen(false);
    setFinalizeTarget(null);
  };

  const handleChangeStatus = async (
    id: string,
    newStatus: CompetitionStatus
  ) => {
    try {
      await competitionService.changeStatus(id, newStatus);
      toast.success('Status atualizado com sucesso');
      loadCompetitions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  const handleViewCompetition = (competitionId: string) => {
    navigate(`/competitions/${competitionId}/edit`);
  };

  const formatDate = (date?: string | null) => {
    if (!date) return null;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Filtrar e ordenar competições
  const filteredCompetitions = competitions
    .filter(comp => {
      // Filtro de busca
      if (
        searchTerm &&
        !comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      // Filtro de tipo
      if (filterType !== 'all' && comp.type !== filterType) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case 'endDate':
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Layout>
        <CompetitionsShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Competições</Title>
            <Subtitle>Gerencie competições e prêmios</Subtitle>
          </HeaderContent>

          <HeaderActions>
            <ViewModeButtons>
              <ViewModeButton
                $active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
                title='Visualização em grade'
              >
                <MdViewModule size={20} />
              </ViewModeButton>
              <ViewModeButton
                $active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
                title='Visualização em lista'
              >
                <MdViewList size={20} />
              </ViewModeButton>
            </ViewModeButtons>

            <FilterSelect
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
            >
              <option value='all'>Todas</option>
              {Object.entries(CompetitionStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>

            <PermissionButton
              permission='competition:create'
              onClick={() => navigate('/competitions/new')}
              variant='primary'
              size='medium'
            >
              <MdAdd />
              Nova Competição
            </PermissionButton>
          </HeaderActions>
        </Header>

        {/* Filtros Avançados */}
        <FiltersSection>
          <FiltersHeader>
            <SearchInput
              type='text'
              placeholder='🔍 Buscar por nome...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <ResultsCount>
              {filteredCompetitions.length}{' '}
              {filteredCompetitions.length === 1 ? 'competição' : 'competições'}
            </ResultsCount>
          </FiltersHeader>

          <FiltersRow>
            <FilterSelect
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
            >
              <option value='all'>Todos os Tipos</option>
              <option value='individual'>Individual</option>
              <option value='team'>Por Equipes</option>
              <option value='mixed'>Misto</option>
            </FilterSelect>

            <FilterSelect
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
            >
              <option value='startDate'>Ordenar por: Data de Início</option>
              <option value='endDate'>Ordenar por: Data de Término</option>
              <option value='name'>Ordenar por: Nome</option>
            </FilterSelect>
          </FiltersRow>
        </FiltersSection>

        {loading ? (
          <LoadingState>Carregando...</LoadingState>
        ) : filteredCompetitions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <MdEmojiFlags />
            </EmptyIcon>
            <EmptyTitle>Nenhuma competição encontrada</EmptyTitle>
            <EmptyText>
              Crie competições para motivar sua equipe com eventos temporários e
              prêmios!
            </EmptyText>
            <CreateButton onClick={() => navigate('/competitions/new')}>
              <MdAdd />
              Criar Primeira Competição
            </CreateButton>
          </EmptyState>
        ) : (
          <CompetitionsGrid $viewMode={viewMode}>
            {filteredCompetitions.map(competition => {
              const canDelete = [
                CompetitionStatus.DRAFT,
                CompetitionStatus.SCHEDULED,
              ].includes(competition.status);
              const canFinalize =
                competition.status === CompetitionStatus.ACTIVE;
              const participantLabel =
                competition.participantUserIds === null ||
                competition.participantUserIds === undefined
                  ? 'Todos'
                  : (competition.participantUserIds?.length || 0).toString();
              const teamParticipantLabel =
                competition.participantTeamIds === null ||
                competition.participantTeamIds === undefined
                  ? 'Todas'
                  : (competition.participantTeamIds?.length || 0).toString();

              return (
                <CompetitionCard
                  key={competition.id}
                  $viewMode={viewMode}
                  $isActive={competition.status === CompetitionStatus.ACTIVE}
                >
                  <CardHeader>
                    <HeaderTop>
                      <StatusDropdown
                        currentStatus={competition.status}
                        competitionId={competition.id}
                        onStatusChange={newStatus =>
                          handleChangeStatus(
                            competition.id,
                            newStatus as CompetitionStatus
                          )
                        }
                      />
                      <CardActions>
                        {canFinalize && (
                          <ActionButton
                            onClick={() => {
                              setFinalizeTarget(competition);
                              setIsFinalizeModalOpen(true);
                            }}
                            title='Finalizar competição'
                          >
                            <MdEmojiEvents />
                          </ActionButton>
                        )}
                        <ActionButton
                          onClick={() => handleViewCompetition(competition.id)}
                          title='Ver detalhes'
                        >
                          <MdVisibility />
                        </ActionButton>
                        <ActionButton
                          onClick={() =>
                            navigate(`/competitions/${competition.id}/edit`)
                          }
                          title='Editar'
                        >
                          <MdEdit />
                        </ActionButton>
                        <ActionButton
                          onClick={() => {
                            setDeleteTarget(competition);
                            setIsDeleteModalOpen(true);
                          }}
                          title={
                            canDelete
                              ? 'Excluir'
                              : 'Só é possível excluir competições em rascunho ou agendadas'
                          }
                          $isDanger
                          disabled={!canDelete}
                        >
                          <MdDelete />
                        </ActionButton>
                      </CardActions>
                    </HeaderTop>

                    <CompetitionName>{competition.name}</CompetitionName>
                    {competition.description && (
                      <CompetitionDescription>
                        {competition.description}
                      </CompetitionDescription>
                    )}
                  </CardHeader>

                  <CardBody $viewMode={viewMode}>
                    <IndicatorsContainer>
                      {competition.status === CompetitionStatus.ACTIVE && (
                        <Indicator $isHighlighted>
                          <IndicatorIcon>⏱️</IndicatorIcon>
                          <IndicatorContent>
                            <IndicatorValue>
                              {getDaysRemaining(competition.endDate)}
                            </IndicatorValue>
                            <IndicatorLabel>dias restantes</IndicatorLabel>
                          </IndicatorContent>
                        </Indicator>
                      )}

                      <Indicator>
                        <IndicatorIcon>🎁</IndicatorIcon>
                        <IndicatorContent>
                          <IndicatorValue>
                            {competition.prizes?.length || 0}
                          </IndicatorValue>
                          <IndicatorLabel>prêmios</IndicatorLabel>
                        </IndicatorContent>
                      </Indicator>

                      <Indicator>
                        <IndicatorIcon>👥</IndicatorIcon>
                        <IndicatorContent>
                          <IndicatorValue>{participantLabel}</IndicatorValue>
                          <IndicatorLabel>
                            {participantLabel === 'Todos'
                              ? 'participantes (todos)'
                              : 'participantes'}
                          </IndicatorLabel>
                        </IndicatorContent>
                      </Indicator>

                      {(competition.type === 'team' ||
                        competition.type === 'mixed') && (
                        <Indicator>
                          <IndicatorIcon>🛡️</IndicatorIcon>
                          <IndicatorContent>
                            <IndicatorValue>
                              {teamParticipantLabel}
                            </IndicatorValue>
                            <IndicatorLabel>
                              {teamParticipantLabel === 'Todas'
                                ? 'equipes (todas)'
                                : 'equipes'}
                            </IndicatorLabel>
                          </IndicatorContent>
                        </Indicator>
                      )}
                    </IndicatorsContainer>

                    <CompetitionDates>
                      <DateItem>
                        <DateLabel>Início:</DateLabel>
                        <DateValue>
                          {new Date(competition.startDate).toLocaleDateString(
                            'pt-BR'
                          )}
                        </DateValue>
                      </DateItem>
                      <DateSeparator>→</DateSeparator>
                      <DateItem>
                        <DateLabel>Término:</DateLabel>
                        <DateValue>
                          {new Date(competition.endDate).toLocaleDateString(
                            'pt-BR'
                          )}
                        </DateValue>
                      </DateItem>
                    </CompetitionDates>

                    {(competition.autoStart || competition.autoEnd) && (
                      <AutoConfigBadges>
                        {competition.autoStart && (
                          <AutoConfigBadge>Início automático</AutoConfigBadge>
                        )}
                        {competition.autoEnd && (
                          <AutoConfigBadge>
                            Finalização automática
                          </AutoConfigBadge>
                        )}
                      </AutoConfigBadges>
                    )}

                    {competition.status === CompetitionStatus.ACTIVE && (
                      <ProgressSection>
                        <ProgressHeader>
                          <ProgressLabel>Progresso</ProgressLabel>
                          <ProgressPercentage>65%</ProgressPercentage>
                        </ProgressHeader>
                        <ProgressBar>
                          <ProgressFill $width={65} />
                        </ProgressBar>
                      </ProgressSection>
                    )}

                    {competition.prizes &&
                      competition.prizes.length > 0 &&
                      competition.prizes[0] && (
                        <TopPrize>
                          <PrizeIcon>🏆</PrizeIcon>
                          <PrizeInfo>
                            <PrizeLabel>1º Lugar</PrizeLabel>
                            <PrizeName>{competition.prizes[0].name}</PrizeName>
                          </PrizeInfo>
                        </TopPrize>
                      )}
                  </CardBody>

                  <CardFooter $viewMode={viewMode}>
                    <DetailsButton
                      onClick={() => handleViewCompetition(competition.id)}
                    >
                      Ver Detalhes →
                    </DetailsButton>
                  </CardFooter>
                </CompetitionCard>
              );
            })}
          </CompetitionsGrid>
        )}
        {isDeleteModalOpen && deleteTarget && (
          <ConfirmOverlay onClick={closeDeleteModal}>
            <ConfirmDialog onClick={event => event.stopPropagation()}>
              <ConfirmIconWrapper $variant='danger'>
                <MdWarningAmber size={32} />
              </ConfirmIconWrapper>
              <ConfirmTitle>Excluir competição?</ConfirmTitle>
              <ConfirmDescription>
                A competição <strong>{deleteTarget.name}</strong> será removida
                permanentemente. Esta ação não pode ser desfeita.
              </ConfirmDescription>
              {(deleteTarget.startDate || deleteTarget.endDate) && (
                <ConfirmMeta>
                  {formatDate(deleteTarget.startDate) && (
                    <span>
                      Início:&nbsp;
                      <strong>{formatDate(deleteTarget.startDate)}</strong>
                    </span>
                  )}
                  {formatDate(deleteTarget.endDate) && (
                    <span>
                      Término:&nbsp;
                      <strong>{formatDate(deleteTarget.endDate)}</strong>
                    </span>
                  )}
                </ConfirmMeta>
              )}
              <ConfirmActions>
                <ConfirmButton
                  type='button'
                  onClick={closeDeleteModal}
                  disabled={isDeletingCompetition}
                >
                  Cancelar
                </ConfirmButton>
                <ConfirmButton
                  type='button'
                  $variant='danger'
                  onClick={handleDelete}
                  disabled={isDeletingCompetition}
                >
                  {isDeletingCompetition ? 'Excluindo...' : 'Excluir'}
                </ConfirmButton>
              </ConfirmActions>
            </ConfirmDialog>
          </ConfirmOverlay>
        )}
        {isFinalizeModalOpen && finalizeTarget && (
          <ConfirmOverlay onClick={closeFinalizeModal}>
            <ConfirmDialog onClick={event => event.stopPropagation()}>
              <ConfirmIconWrapper>
                <MdEmojiEvents size={32} />
              </ConfirmIconWrapper>
              <ConfirmTitle>Finalizar competição?</ConfirmTitle>
              <ConfirmDescription>
                Isso irá calcular o ranking do período e atribuir prêmios aos
                vencedores definidos.
              </ConfirmDescription>
              {(finalizeTarget.startDate || finalizeTarget.endDate) && (
                <ConfirmMeta>
                  {formatDate(finalizeTarget.startDate) && (
                    <span>
                      Início:&nbsp;
                      <strong>{formatDate(finalizeTarget.startDate)}</strong>
                    </span>
                  )}
                  {formatDate(finalizeTarget.endDate) && (
                    <span>
                      Término:&nbsp;
                      <strong>{formatDate(finalizeTarget.endDate)}</strong>
                    </span>
                  )}
                </ConfirmMeta>
              )}
              <ConfirmActions>
                <ConfirmButton
                  type='button'
                  onClick={closeFinalizeModal}
                  disabled={isFinalizingCompetition}
                >
                  Voltar
                </ConfirmButton>
                <ConfirmButton
                  type='button'
                  $variant='primary'
                  onClick={handleFinalize}
                  disabled={isFinalizingCompetition}
                >
                  {isFinalizingCompetition
                    ? 'Finalizando...'
                    : 'Finalizar competição'}
                </ConfirmButton>
              </ConfirmActions>
            </ConfirmDialog>
          </ConfirmOverlay>
        )}
      </Container>
    </Layout>
  );
};

// Styled Components
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ConfirmDialog = styled.div`
  width: min(420px, 100%);
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 28px 32px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  text-align: center;
`;

const ConfirmIconWrapper = styled.div<{ $variant?: 'danger' | 'primary' }>`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.$variant === 'danger'
      ? props.theme.colors.error + '15'
      : props.theme.colors.primary + '15'};
  color: ${props =>
    props.$variant === 'danger'
      ? props.theme.colors.error
      : props.theme.colors.primary};
  font-size: 2rem;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const ConfirmDescription = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.textSecondary};
`;

const ConfirmMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};

  span {
    display: block;

    strong {
      color: ${props => props.theme.colors.text};
    }
  }
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

const ConfirmButton = styled.button<{ $variant?: 'danger' | 'primary' }>`
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${props =>
    props.$variant === 'danger'
      ? props.theme.colors.error
      : props.$variant === 'primary'
        ? props.theme.colors.primary
        : props.theme.colors.backgroundSecondary};
  color: ${props =>
    props.$variant === 'danger'
      ? '#ffffff'
      : props.$variant === 'primary'
        ? '#ffffff'
        : props.theme.colors.text};

  box-shadow: ${props =>
    props.$variant === 'danger'
      ? '0 12px 24px rgba(239, 68, 68, 0.25)'
      : props.$variant === 'primary'
        ? '0 12px 24px rgba(37, 99, 235, 0.25)'
        : '0 8px 16px rgba(15, 23, 42, 0.08)'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props =>
      props.$variant === 'danger'
        ? '0 16px 30px rgba(239, 68, 68, 0.3)'
        : props.$variant === 'primary'
          ? '0 16px 30px rgba(37, 99, 235, 0.3)'
          : '0 12px 22px rgba(15, 23, 42, 0.12)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const FiltersSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ResultsCount = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ViewModeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 4px;
`;

const ViewModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.hover};
  }
`;

const CompetitionsGrid = styled.div<{ $viewMode: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${props =>
    props.$viewMode === 'grid'
      ? 'repeat(auto-fill, minmax(350px, 1fr))'
      : '1fr'};
  gap: 1.5rem;
`;

const CompetitionCard = styled.div<{
  $viewMode: 'grid' | 'list';
  $isActive?: boolean;
}>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  display: flex;
  flex-direction: ${props => (props.$viewMode === 'list' ? 'row' : 'column')};
  align-items: ${props => (props.$viewMode === 'list' ? 'stretch' : 'stretch')};
  gap: ${props => (props.$viewMode === 'list' ? '0' : '0')};
  min-height: ${props => (props.$viewMode === 'list' ? 'auto' : '280px')};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primary};
  }

  ${props =>
    props.$isActive &&
    `
    border-color: ${props.theme.colors.success};
    background: ${props.theme.colors.success}05;
  `}

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    min-height: auto;
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $isDanger?: boolean }>`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  opacity: ${props => (props.disabled ? 0.35 : 0.7)};
  color: ${props => (props.$isDanger ? '#ef4444' : props.theme.colors.text)};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};

  &:hover {
    opacity: 1;
    background: ${props => (props.$isDanger ? '#fee2e2' : '#f3f4f6')};
    transform: translateY(-1px);
  }
`;

const CardBody = styled.div<{ $viewMode?: 'grid' | 'list' }>`
  padding: ${props =>
    props.$viewMode === 'list' ? '1.5rem 1.5rem 1.5rem 0' : '1.5rem'};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const IndicatorsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
`;

const Indicator = styled.div<{ $isHighlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props =>
    props.$isHighlighted
      ? props.theme.colors.warning + '15'
      : props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid
    ${props =>
      props.$isHighlighted
        ? props.theme.colors.warning
        : props.theme.colors.border};
`;

const IndicatorIcon = styled.span`
  font-size: 1.25rem;
`;

const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const IndicatorValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;
`;

const IndicatorLabel = styled.span`
  font-size: 0.6875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const CompetitionName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const AutoConfigBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const AutoConfigBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const CompetitionDescription = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const CompetitionDates = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border-radius: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DateItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  align-items: center;
  text-align: center;
  flex: 1;
`;

const DateSeparator = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0 0.5rem;
`;

const DateLabel = styled.span`
  font-size: 0.6875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
`;

const DateValue = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const CardFooter = styled.div<{ $viewMode?: 'grid' | 'list' }>`
  display: flex;
  gap: 0.5rem;
  padding: ${props => (props.$viewMode === 'list' ? '1.5rem' : '1rem 1.5rem')};
  background: ${props =>
    props.$viewMode === 'list'
      ? 'transparent'
      : props.theme.colors.backgroundSecondary};
  border-top: ${props =>
    props.$viewMode === 'list'
      ? 'none'
      : `1px solid ${props.theme.colors.border}`};
  align-items: center;
  flex-shrink: 0;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressSection = styled.div`
  margin-top: 0.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
`;

const ProgressPercentage = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.success};
  font-weight: 700;
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background: ${props => props.theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${props => props.$width}%;
  background: ${props => props.theme.colors.success};
  border-radius: 999px;
  transition: width 0.3s;
`;

const TopPrize = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.theme.colors.warning}15;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.warning};
`;

const PrizeIcon = styled.span`
  font-size: 1.5rem;
`;

const PrizeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const PrizeLabel = styled.span`
  font-size: 0.6875rem;
  color: ${props => props.theme.colors.warning};
  font-weight: 600;
  text-transform: uppercase;
`;

const PrizeName = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const DetailsButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  text-align: center;
  gap: 1.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.5;
`;

const EmptyTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 500px;
  line-height: 1.6;
`;

export default CompetitionsPage;
