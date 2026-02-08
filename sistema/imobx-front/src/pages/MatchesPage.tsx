/**
 * Página de Matches
 * Sistema inteligente de compatibilidade cliente-imóvel
 */

import { useState, useCallback } from 'react';
import { MdFilterList } from 'react-icons/md';
import { useMatches } from '../hooks/useMatches';
import { useMatchActions } from '../hooks/useMatchActions';
import { MatchCard } from '../components/matches/MatchCard';
import { MatchStatus } from '../types/match';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { MatchesShimmer } from '../components/shimmer/MatchesShimmer';
import { MatchFiltersDrawer } from '../components/matches/MatchFiltersDrawer';
import { toast } from 'react-toastify';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageSubtitle,
  PageTitle,
} from '../styles/pages/ClientFormPageStyles';
import {
  FilterButton,
  Content,
  MatchesGrid,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  InfoFooter,
  InfoText,
} from '../styles/pages/MatchesPageStyles';
import { MatchWorkspaceToast } from '../components/matches/MatchWorkspaceToast';
import { MatchActionConfirmationModal } from '../components/matches/MatchActionConfirmationModal';
import { IgnoreMatchDialog } from '../components/matches/IgnoreMatchDialog';
import type { Match } from '../types/match';

export default function MatchesPage() {
  const navigate = useNavigate();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '' as MatchStatus | '',
    minScore: 0,
    search: '',
    searchType: 'all' as 'all' | 'client' | 'property',
  });
  const { matches, loading, refetch } = useMatches({
    status: filters.status || undefined,
  });
  const { acceptMatch, ignoreMatch, processing } = useMatchActions();

  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);
  const [pendingAction, setPendingAction] = useState<
    'accept' | 'ignore' | null
  >(null);
  const [ignoreMatchTarget, setIgnoreMatchTarget] = useState<Match | null>(
    null
  );

  const showWorkspacePrompt = useCallback(() => {
    toast(
      ({ closeToast }) => (
        <MatchWorkspaceToast
          onViewWorkspace={() => {
            closeToast?.();
            navigate('/my-workspace');
          }}
          onDismiss={() => closeToast?.()}
        />
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: true,
        position: 'top-center',
      }
    );
  }, [navigate]);

  const openActionModal = useCallback(
    (match: Match, action: 'accept' | 'ignore') => {
      setPendingMatch(match);
      setPendingAction(action);
    },
    []
  );

  const closeActionModal = useCallback(() => {
    setPendingMatch(null);
    setPendingAction(null);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!pendingMatch || !pendingAction) return;

    if (pendingAction === 'accept') {
      const result = await acceptMatch(pendingMatch.id);
      if (result.success) {
        refetch();
        showWorkspacePrompt();
        closeActionModal();
      }
    } else {
      // Abrir dialog de motivos após confirmação
      setIgnoreMatchTarget(pendingMatch);
      closeActionModal();
    }
  }, [
    pendingMatch,
    pendingAction,
    acceptMatch,
    closeActionModal,
    refetch,
    showWorkspacePrompt,
  ]);

  const handleIgnoreConfirm = useCallback(
    async (reason?: string, notes?: string) => {
      if (!ignoreMatchTarget) return;
      await ignoreMatch(ignoreMatchTarget.id, reason as any, notes);
      setIgnoreMatchTarget(null);
      refetch();
    },
    [ignoreMatch, ignoreMatchTarget, refetch]
  );

  const handleIgnoreCancel = useCallback(() => {
    setIgnoreMatchTarget(null);
  }, []);

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Matches</PageTitle>
              <PageSubtitle>
                Sistema inteligente de compatibilidade cliente-imóvel
              </PageSubtitle>
            </PageTitleContainer>
            <FilterButton onClick={() => setFiltersOpen(true)}>
              <MdFilterList size={20} />
              Filtros
            </FilterButton>
          </PageHeader>

          {/* Grid de Matches */}
          <Content>
            {loading ? (
              <MatchesShimmer />
            ) : !matches || matches.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🎯</EmptyIcon>
                <EmptyTitle>Nenhum match encontrado</EmptyTitle>
                <EmptyText>
                  {filters.status === 'pending' || !filters.status
                    ? 'Quando houver novos matches, eles aparecerão aqui'
                    : `Você não possui matches ${
                        filters.status === 'accepted' ? 'aceitos' : 'ignorados'
                      }`}
                </EmptyText>
              </EmptyState>
            ) : (
              <MatchesGrid>
                {matches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onAccept={selected => openActionModal(selected, 'accept')}
                    onIgnore={selected => openActionModal(selected, 'ignore')}
                    loading={processing}
                  />
                ))}
              </MatchesGrid>
            )}
          </Content>

          {/* Info Footer */}
          {matches && matches.length > 0 && (
            <InfoFooter>
              <InfoText>
                💡 <strong>Dica:</strong> Ao aceitar um match, uma task é criada
                automaticamente no seu workspace pessoal e uma nota com todos os
                detalhes é salva.
              </InfoText>
            </InfoFooter>
          )}
        </PageContent>
      </PageContainer>

      <MatchActionConfirmationModal
        isOpen={!!pendingMatch && !!pendingAction}
        action={pendingAction || 'accept'}
        match={pendingMatch}
        onConfirm={handleConfirmAction}
        onCancel={closeActionModal}
        isProcessing={processing}
      />

      {ignoreMatchTarget && (
        <IgnoreMatchDialog
          onClose={handleIgnoreCancel}
          onConfirm={(reason, notes) => handleIgnoreConfirm(reason, notes)}
        />
      )}

      {/* Drawer de Filtros */}
      <MatchFiltersDrawer
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={newFilters => {
          setFilters({ ...filters, ...newFilters });
          // Refetch quando os filtros mudarem
          refetch();
        }}
      />
    </Layout>
  );
}
