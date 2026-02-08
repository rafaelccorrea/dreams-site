import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PermissionButton } from '@/components/common/PermissionButton';
import PrizesShimmer from '@/components/shimmer/PrizesShimmer';
import {
  MdEmojiEvents,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCardGiftcard,
  MdCheckCircle,
  MdSearch,
  MdClose,
} from 'react-icons/md';
import styled from 'styled-components';
import { usePrizes } from '../hooks/usePrizes';
import type {
  Prize,
  CreatePrizeDto,
  UpdatePrizeDto,
} from '../services/prizesApi';
import { competitionService } from '../services/competition.service';
import { formatCurrency, getNumericValue } from '../utils/masks';
import { createPortal } from 'react-dom';
import type { Competition } from '@/types/competition.types';

export const PrizesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    prizes,
    isLoading,
    createPrize,
    updatePrize,
    deletePrize,
    deliverPrize,
  } = usePrizes();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'available' | 'delivered' | 'pending'
  >('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    position: '1',
    competitionId: '',
  });

  // Carregar competições para o select
  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        const data = await competitionService.findAll();
        setCompetitions(data);
      } catch (error) {
        console.error('Erro ao carregar competições:', error);
      }
    };
    loadCompetitions();
  }, []);

  // Filtrar prêmios
  const filteredPrizes = prizes.filter(prize => {
    const matchesSearch =
      prize.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prize.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prize.competitionName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || prize.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: prizes.length,
    available: prizes.filter(p => p.status === 'available').length,
    delivered: prizes.filter(p => p.status === 'delivered').length,
    pending: prizes.filter(p => p.status === 'pending').length,
    totalValue: prizes.reduce((sum, p) => sum + p.value * p.quantity, 0),
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.competitionId) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const dto: CreatePrizeDto = {
      competitionId: formData.competitionId,
      position: parseInt(formData.position),
      name: formData.name,
      description: formData.description,
      value: formData.value ? getNumericValue(formData.value) : undefined,
    };

    const result = await createPrize(dto);
    if (result) {
      toast.success('Prêmio criado com sucesso!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        value: '',
        position: '1',
        competitionId: '',
      });
    }
  };

  const handleEdit = (prize: Prize) => {
    setSelectedPrize(prize);
    setFormData({
      name: prize.name,
      description: prize.description || '',
      value: formatCurrency(prize.value.toString()),
      position: prize.position.toString(),
      competitionId: prize.competitionId,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedPrize) return;

    const dto: UpdatePrizeDto = {
      name: formData.name,
      description: formData.description,
      value: formData.value ? getNumericValue(formData.value) : undefined,
    };

    const result = await updatePrize(selectedPrize.id, dto);
    if (result) {
      setShowEditModal(false);
      setSelectedPrize(null);
      setFormData({
        name: '',
        description: '',
        value: '',
        position: '1',
        competitionId: '',
      });
    }
  };

  const handleDelete = (prize: Prize) => {
    setSelectedPrize(prize);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPrize) return;

    const success = await deletePrize(selectedPrize.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedPrize(null);
    }
  };

  const handleDeliver = async (prizeId: string) => {
    await deliverPrize(prizeId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'delivered':
        return '#6b7280';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'delivered':
        return 'Entregue';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PrizesShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderContent>
            <Title>Prêmios</Title>
            <Subtitle>Gerencie prêmios das competições</Subtitle>
          </HeaderContent>

          <HeaderActions>
            <PermissionButton
              permission='prize:create'
              onClick={() => setShowCreateModal(true)}
              variant='primary'
              size='medium'
            >
              <MdAdd />
              Novo Prêmio
            </PermissionButton>
          </HeaderActions>
        </Header>

        {/* Estatísticas */}
        <StatsGrid>
          <StatCard>
            <StatIcon $color='#3b82f6'>
              <MdCardGiftcard />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total de Prêmios</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color='#10b981'>
              <MdCheckCircle />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.available}</StatValue>
              <StatLabel>Disponíveis</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color='#6b7280'>
              <MdEmojiEvents />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.delivered}</StatValue>
              <StatLabel>Entregues</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $color='#8b5cf6'>
              <MdCardGiftcard />
            </StatIcon>
            <StatContent>
              <StatValue>
                R$ {stats.totalValue.toLocaleString('pt-BR')}
              </StatValue>
              <StatLabel>Valor Total</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Filtros */}
        <Controls>
          <SearchContainer>
            <MdSearch />
            <SearchInput
              placeholder='Buscar prêmios...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <FilterSelect
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
          >
            <option value='all'>Todos os Status</option>
            <option value='available'>Disponíveis</option>
            <option value='delivered'>Entregues</option>
            <option value='pending'>Pendentes</option>
          </FilterSelect>
        </Controls>

        {/* Loading */}
        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Carregando prêmios...</LoadingText>
          </LoadingContainer>
        )}

        {/* Lista de Prêmios */}
        {!isLoading && filteredPrizes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎁</EmptyIcon>
            <EmptyTitle>Nenhum prêmio encontrado</EmptyTitle>
            <EmptyText>
              {searchTerm || filterStatus !== 'all'
                ? 'Tente ajustar os filtros'
                : competitions.length === 0
                  ? 'Você precisa criar uma competição primeiro para poder adicionar prêmios!'
                  : 'Crie prêmios para recompensar os vencedores das competições!'}
            </EmptyText>
            {!searchTerm &&
              filterStatus === 'all' &&
              competitions.length === 0 && (
                <PermissionButton
                  permission='competition:create'
                  onClick={() => navigate('/competitions/new')}
                  variant='primary'
                  size='medium'
                >
                  <MdEmojiEvents />
                  Criar Primeira Competição
                </PermissionButton>
              )}
          </EmptyState>
        ) : (
          !isLoading && (
            <PrizesGrid>
              {filteredPrizes.map(prize => (
                <PrizeCard key={prize.id}>
                  <PrizeHeader>
                    <PrizeIcon>
                      <MdCardGiftcard size={32} />
                    </PrizeIcon>
                    <StatusBadge $color={getStatusColor(prize.status)}>
                      {getStatusLabel(prize.status)}
                    </StatusBadge>
                  </PrizeHeader>

                  <PrizeContent>
                    <PrizeName>{prize.name}</PrizeName>
                    <PrizeDescription>{prize.description}</PrizeDescription>

                    <PrizeInfo>
                      <InfoItem>
                        <InfoLabel>Valor:</InfoLabel>
                        <InfoValue>
                          R$ {prize.value.toLocaleString('pt-BR')}
                        </InfoValue>
                      </InfoItem>
                      <InfoItem>
                        <InfoLabel>Posição:</InfoLabel>
                        <InfoValue>{prize.position}º lugar</InfoValue>
                      </InfoItem>
                      {prize.status === 'delivered' && (
                        <InfoItem>
                          <InfoLabel>Status:</InfoLabel>
                          <InfoValue>Entregue</InfoValue>
                        </InfoItem>
                      )}
                      {(prize.winnerUserName || prize.winnerTeamName) && (
                        <InfoItem>
                          <InfoLabel>Vencedor:</InfoLabel>
                          <InfoValue>
                            {prize.winnerUserName || prize.winnerTeamName}
                          </InfoValue>
                        </InfoItem>
                      )}
                    </PrizeInfo>

                    <CompetitionTag>
                      <MdEmojiEvents size={14} />
                      {prize.competitionName}
                    </CompetitionTag>
                  </PrizeContent>

                  <PrizeActions>
                    {prize.status !== 'delivered' &&
                      !prize.winnerUserId &&
                      !prize.winnerTeamId && (
                        <PermissionButton
                          permission='prize:edit'
                          onClick={() => handleEdit(prize)}
                          variant='secondary'
                          size='small'
                        >
                          <MdEdit />
                        </PermissionButton>
                      )}
                    {prize.status === 'pending' &&
                      (prize.winnerUserId || prize.winnerTeamId) && (
                        <PermissionButton
                          permission='prize:deliver'
                          onClick={() => handleDeliver(prize.id)}
                          variant='primary'
                          size='small'
                        >
                          <MdCheckCircle />
                          Entregar
                        </PermissionButton>
                      )}
                    {prize.status === 'available' && (
                      <PermissionButton
                        permission='prize:delete'
                        onClick={() => handleDelete(prize)}
                        variant='danger'
                        size='small'
                      >
                        <MdDelete />
                      </PermissionButton>
                    )}
                  </PrizeActions>
                </PrizeCard>
              ))}
            </PrizesGrid>
          )
        )}

        {/* Modal de Criar/Editar */}
        {(showCreateModal || showEditModal) &&
          createPortal(
            <ModalOverlay
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
                setSelectedPrize(null);
                setFormData({
                  name: '',
                  description: '',
                  value: '',
                  position: '1',
                  competitionId: '',
                });
              }}
            >
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>
                    {showCreateModal ? 'Novo Prêmio' : 'Editar Prêmio'}
                  </ModalTitle>
                  <CloseButton
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedPrize(null);
                      setFormData({
                        name: '',
                        description: '',
                        value: '',
                        position: '1',
                        competitionId: '',
                      });
                    }}
                  >
                    <MdClose />
                  </CloseButton>
                </ModalHeader>

                <ModalBody>
                  <FormGroup>
                    <Label>Nome do Prêmio *</Label>
                    <Input
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder='Ex: Vale Presente R$ 500'
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Descrição *</Label>
                    <TextArea
                      value={formData.description}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Descreva o prêmio...'
                      rows={3}
                    />
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label>Valor (R$)</Label>
                      <Input
                        value={formData.value}
                        onChange={e => {
                          const formatted = formatCurrency(e.target.value);
                          setFormData({ ...formData, value: formatted });
                        }}
                        placeholder='500,00'
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Posição no Ranking *</Label>
                      <Input
                        type='number'
                        value={formData.position}
                        onChange={e =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                        placeholder='1'
                        min='1'
                        disabled={showEditModal}
                      />
                    </FormGroup>
                  </FormRow>

                  {showCreateModal && (
                    <FormGroup>
                      <Label>Competição *</Label>
                      {competitions.length === 0 ? (
                        <div
                          style={{
                            padding: '12px',
                            background: '#fef3c7',
                            border: '1px solid #f59e0b',
                            borderRadius: '8px',
                            color: '#92400e',
                            marginBottom: '1rem',
                          }}
                        >
                          ⚠️ Nenhuma competição cadastrada no sistema.
                          <br />
                          <small>
                            Você precisa criar uma competição primeiro para
                            poder adicionar prêmios.
                          </small>
                        </div>
                      ) : (
                        <Select
                          value={formData.competitionId}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              competitionId: e.target.value,
                            })
                          }
                        >
                          <option value=''>Selecione uma competição</option>
                          {competitions.map(comp => (
                            <option key={comp.id} value={comp.id}>
                              {comp.name} ({comp.status})
                            </option>
                          ))}
                        </Select>
                      )}
                    </FormGroup>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button
                    $variant='secondary'
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedPrize(null);
                      setFormData({
                        name: '',
                        description: '',
                        value: '',
                        position: '1',
                        competitionId: '',
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    $variant='primary'
                    onClick={showCreateModal ? handleCreate : handleUpdate}
                    disabled={
                      !formData.name ||
                      (showCreateModal &&
                        (!formData.competitionId || competitions.length === 0))
                    }
                  >
                    {showCreateModal ? 'Criar Prêmio' : 'Atualizar Prêmio'}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>,
            document.body
          )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal &&
          selectedPrize &&
          createPortal(
            <ModalOverlay
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedPrize(null);
              }}
            >
              <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>Excluir Prêmio</ModalTitle>
                  <CloseButton
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedPrize(null);
                    }}
                  >
                    <MdClose />
                  </CloseButton>
                </ModalHeader>

                <ModalBody>
                  <DeleteWarning>
                    <MdDelete size={48} />
                    <p>
                      Tem certeza que deseja excluir o prêmio{' '}
                      <strong>"{selectedPrize.name}"</strong>?
                    </p>
                    <p>Esta ação não pode ser desfeita.</p>
                  </DeleteWarning>
                </ModalBody>

                <ModalFooter>
                  <Button
                    $variant='secondary'
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedPrize(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button $variant='danger' onClick={confirmDelete}>
                    Excluir Prêmio
                  </Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>,
            document.body
          )}
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.$color}20;
  border-radius: 12px;
  color: ${props => props.$color};

  svg {
    font-size: 24px;
  }
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;

  svg {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PrizesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const PrizeCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PrizeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PrizeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 12px;
  color: ${props => props.theme.colors.primary};
`;

const StatusBadge = styled.span<{ $color: string }>`
  padding: 0.375rem 0.75rem;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const PrizeContent = styled.div`
  padding: 1.5rem;
`;

const PrizeName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const PrizeDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const PrizeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CompetitionTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.theme.colors.primary}10;
  color: ${props => props.theme.colors.primary};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const PrizeActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 400px;
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 1rem;
  overflow: visible;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 100000;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary' &&
    `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
    }
  `}

  ${props =>
    props.$variant === 'secondary' &&
    `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.hover};
    }
  `}

  ${props =>
    props.$variant === 'danger' &&
    `
    background: ${props.theme.colors.error};
    color: white;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteWarning = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 1rem;

  svg {
    color: ${props => props.theme.colors.error};
  }

  p {
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-size: 0.875rem;
  }

  strong {
    color: ${props => props.theme.colors.error};
  }
`;

export default PrizesPage;
