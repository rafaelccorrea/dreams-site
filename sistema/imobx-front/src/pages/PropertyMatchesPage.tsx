/**
 * Página de Matches de Propriedade Específica
 * Exibe clientes compatíveis com uma propriedade
 */

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useMatches } from '../hooks/useMatches';
import { useMatchActions } from '../hooks/useMatchActions';
import { MatchCard } from '../components/matches/MatchCard';
import type { MatchStatus, Match } from '../types/match';
import type { UseMatchesParams } from '../hooks/useMatches';
import { Layout } from '../components/layout/Layout';
import { MatchesShimmer } from '../components/shimmer/MatchesShimmer';
import { propertyApi } from '../services/propertyApi';
import type { Property } from '../types/property';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageSubtitle,
  PageTitle,
} from '../styles/pages/ClientFormPageStyles';
import {
  Content,
  MatchesGrid,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  InfoText,
  BackButton,
  PropertyInfo,
  PropertyInfoCard,
  PropertyTitle,
  PropertyDetails as PropertyDetailsInfo,
  PropertyDetail,
} from '../styles/pages/MatchesPageStyles';
import { MatchWorkspaceToast } from '../components/matches/MatchWorkspaceToast';
import { MatchActionConfirmationModal } from '../components/matches/MatchActionConfirmationModal';
import { IgnoreMatchDialog } from '../components/matches/IgnoreMatchDialog';
import { MatchFiltersDrawer } from '../components/matches/MatchFiltersDrawer';
import { MdFilterList } from 'react-icons/md';

export default function PropertyMatchesPage() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: 'pending' as MatchStatus | '',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

  const matchesParams: UseMatchesParams = {
    status: filters.status || undefined,
    autoFetch: !!propertyId,
  };

  if (propertyId) {
    matchesParams.propertyId = propertyId;
  }

  const { matches, loading, refetch } = useMatches(matchesParams);
  const { acceptMatch, ignoreMatch, processing } = useMatchActions();
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);
  const [pendingAction, setPendingAction] = useState<
    'accept' | 'ignore' | null
  >(null);
  const [ignoreMatchTarget, setIgnoreMatchTarget] = useState<Match | null>(
    null
  );

  // Carregar informações da propriedade
  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) return;

      try {
        setLoadingProperty(true);
        const propertyData = await propertyApi.getPropertyById(propertyId);
        setProperty(propertyData);
      } catch (error) {
        console.error('Erro ao carregar propriedade:', error);
        toast.error('Erro ao carregar informações da propriedade');
      } finally {
        setLoadingProperty(false);
      }
    };

    loadProperty();
  }, [propertyId]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          {/* Header com informações da propriedade */}
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Clientes Compatíveis</PageTitle>
              <PageSubtitle>
                Clientes que correspondem ao perfil desta propriedade
              </PageSubtitle>
            </PageTitleContainer>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setFiltersOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                <MdFilterList size={20} />
                Filtros
              </button>
              <BackButton onClick={() => navigate(`/properties/${propertyId}`)}>
                <MdArrowBack size={20} />
                Voltar
              </BackButton>
            </div>
          </PageHeader>

          {/* Card com informações da propriedade */}
          {loadingProperty ? (
            <PropertyInfoCard>
              <div>Carregando informações da propriedade...</div>
            </PropertyInfoCard>
          ) : property ? (
            <PropertyInfo>
              <PropertyInfoCard>
                <PropertyTitle>
                  {property.title}
                  {property.code && <span> • {property.code}</span>}
                </PropertyTitle>
                <PropertyDetailsInfo>
                  <PropertyDetail>
                    📍 {property.city}, {property.state}
                  </PropertyDetail>
                  {property.salePrice && (
                    <PropertyDetail>
                      💰 {formatPrice(property.salePrice)}
                    </PropertyDetail>
                  )}
                  {property.totalArea && (
                    <PropertyDetail>📏 {property.totalArea}m²</PropertyDetail>
                  )}
                  {property.bedrooms && (
                    <PropertyDetail>
                      🛏️ {property.bedrooms} quartos
                    </PropertyDetail>
                  )}
                </PropertyDetailsInfo>
              </PropertyInfoCard>
            </PropertyInfo>
          ) : null}

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
                    ? 'Não há clientes compatíveis com esta propriedade no momento'
                    : `Você não possui matches ${
                        filters.status === 'accepted' ? 'aceitos' : 'ignorados'
                      } para esta propriedade`}
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
            <div style={{ marginTop: '24px' }}>
              <InfoText>
                💡 <strong>Dica:</strong> Ao aceitar um match, uma task é criada
                automaticamente no seu workspace pessoal e uma nota com todos os
                detalhes é salva.
              </InfoText>
            </div>
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
        filters={{
          status: filters.status,
          minScore: 0,
          search: '',
          searchType: 'all',
        }}
        onChange={newFilters => {
          setFilters({ ...filters, status: newFilters.status || '' });
          refetch();
        }}
      />
    </Layout>
  );
}
