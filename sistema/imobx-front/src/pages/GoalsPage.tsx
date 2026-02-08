import React, { useState, useEffect } from 'react';
import { MdRefresh, MdAdd, MdFilterList } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import ConnectionError from '../components/common/ConnectionError';
import { GoalsShimmer } from '../components/shimmer/GoalsShimmer';
import { useGoals } from '../hooks/useGoals';
import { GoalsFilters } from '../components/goals/GoalsFilters';
import { GoalCard } from '../components/goals/GoalCard';
import { useAutoReloadOnCompanyChange } from '../hooks/useCompanyMonitor';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  HeaderSubtitle,
  HeaderActions,
  RefreshButton,
  NewGoalButton,
  StatsGrid,
  StatsStatCard,
  StatsStatValue,
  StatsStatLabel,
  FiltersContainer,
  FilterGroup,
  SearchInput,
  FilterToggle,
  GoalsGrid,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
} from './styles/GoalsPage.styles';

const GoalsPage: React.FC = () => {
  const navigate = useNavigate();

  // Estados de filtros
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de modais
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hook para gerenciar metas
  const {
    goals,
    statistics,
    loading,
    error,
    filters,
    fetchGoals,
    deleteGoal,
    duplicateGoal,
    refreshProgress,
    updateFilters,
  } = useGoals();

  // Auto-recarregar quando trocar de empresa
  useAutoReloadOnCompanyChange(fetchGoals);

  // Sincronizar searchTerm com o filtro de busca
  useEffect(() => {
    if (!filters.search) {
      setSearchTerm('');
    } else {
      setSearchTerm(filters.search);
    }
  }, [filters.search]);

  // Handler para busca
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilters({ search: value });
  };

  // Handlers para ações das metas
  const handleAnalytics = (goal: any) => {
    navigate(`/goals/analytics/${goal.id}`);
  };

  const handleEditGoal = (goal: any) => {
    navigate(`/goals/edit/${goal.id}`);
  };

  const handleDeleteGoal = (goal: any) => {
    setGoalToDelete(goal);
    setShowDeleteModal(true);
  };

  const confirmDeleteGoal = async () => {
    if (!goalToDelete) return;

    setIsDeleting(true);
    try {
      await deleteGoal(goalToDelete.id);
      setShowDeleteModal(false);
      setGoalToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateGoal = async (goal: any) => {
    try {
      await duplicateGoal(goal.id);
    } catch (error) {
      console.error('Erro ao duplicar meta:', error);
    }
  };

  const handleRefreshProgress = async (goal: any) => {
    try {
      await refreshProgress(goal.id);
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <GoalsShimmer />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ConnectionError
          error={error}
          onRetry={() => {
            fetchGoals();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <div>
            <HeaderTitle>Metas</HeaderTitle>
            <HeaderSubtitle>
              Gerencie e acompanhe suas metas e objetivos
            </HeaderSubtitle>
          </div>
          <HeaderActions>
            <RefreshButton onClick={() => fetchGoals()}>
              <MdRefresh size={16} />
              Atualizar
            </RefreshButton>
            <NewGoalButton onClick={() => navigate('/goals/new')}>
              <MdAdd size={16} />
              Nova Meta
            </NewGoalButton>
          </HeaderActions>
        </PageHeader>

        {/* Estatísticas */}
        {statistics && (
          <StatsGrid>
            <StatsStatCard>
              <StatsStatLabel>Total de Metas</StatsStatLabel>
              <StatsStatValue>{statistics.total}</StatsStatValue>
            </StatsStatCard>
            <StatsStatCard>
              <StatsStatLabel>Metas Ativas</StatsStatLabel>
              <StatsStatValue $color='#10B981'>
                {statistics.active}
              </StatsStatValue>
            </StatsStatCard>
            <StatsStatCard>
              <StatsStatLabel>Completadas</StatsStatLabel>
              <StatsStatValue $color='#3B82F6'>
                {statistics.completed}
              </StatsStatValue>
            </StatsStatCard>
            <StatsStatCard>
              <StatsStatLabel>Falharam</StatsStatLabel>
              <StatsStatValue $color='#EF4444'>
                {statistics.failed}
              </StatsStatValue>
            </StatsStatCard>
          </StatsGrid>
        )}

        {/* Filtros */}
        <FiltersContainer>
          <FilterGroup>
            <SearchInput
              type='text'
              placeholder='Buscar metas...'
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
            />
            <FilterToggle
              $active={showFilters}
              onClick={() => setShowFilters(!showFilters)}
            >
              <MdFilterList size={16} />
              Filtros
              {Object.keys(filters).length > 0 &&
                ` (${Object.keys(filters).length})`}
            </FilterToggle>
          </FilterGroup>
        </FiltersContainer>

        {/* Drawer de Filtros */}
        <GoalsFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={updateFilters}
        />

        {/* Lista de Metas */}
        {goals.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎯</EmptyIcon>
            <EmptyTitle>Nenhuma meta encontrada</EmptyTitle>
            <EmptyDescription>
              {Object.keys(filters).length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira meta para acompanhar o progresso da sua equipe'}
            </EmptyDescription>
            {Object.keys(filters).length === 0 && (
              <NewGoalButton onClick={() => navigate('/goals/new')}>
                <MdAdd size={16} />
                Criar Primeira Meta
              </NewGoalButton>
            )}
          </EmptyState>
        ) : (
          <GoalsGrid>
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAnalytics={handleAnalytics}
                onDuplicate={handleDuplicateGoal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onRefresh={handleRefreshProgress}
              />
            ))}
          </GoalsGrid>
        )}

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setGoalToDelete(null);
          }}
          onConfirm={confirmDeleteGoal}
          title='Excluir Meta'
          message='Tem certeza que deseja excluir esta meta?'
          itemName={goalToDelete?.title}
          isLoading={isDeleting}
        />
      </PageContainer>
    </Layout>
  );
};

export default GoalsPage;
