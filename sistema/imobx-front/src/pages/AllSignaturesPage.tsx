import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdContentCopy,
  MdEmail,
  MdInfoOutline,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { Layout } from '../components/layout/Layout';
import { documentSignatureApi } from '../services/documentSignatureApi';
import { useCompany } from '../hooks/useCompany';
import type {
  DocumentSignature,
  DocumentSignatureStatus,
} from '../types/documentSignature';
import { SignatureStatusBadge } from '../components/documents/SignatureStatusBadge';
import {
  SignatureFiltersDrawer,
  type SignatureFilters,
} from '../components/documents/SignatureFiltersDrawer';
import { SignaturesShimmer } from '../components/shimmer/SignaturesShimmer';
import { formatarDataHora } from '../utils/format';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
} from '../styles/pages/ClientFormPageStyles';
import {
  HeaderActions,
  FilterButton,
  FilterBadge,
  SearchContainer,
  SearchIcon,
  SearchInput,
  StatsBar,
  SignaturesList,
  SignatureCard,
  CardHeader,
  HeaderLeft,
  SignerName,
  SignerEmail,
  CardBody,
  InfoRow,
  InfoLabel,
  InfoValue,
  CardActions,
  ActionButton,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorMessage,
  RetryButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  LoadMoreContainer,
  LoadMoreButton,
} from '../styles/pages/AllSignaturesPageStyles';

export const AllSignaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();
  const [signatures, setSignatures] = useState<DocumentSignature[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SignatureFilters>({
    search: '',
    status: 'all',
  });
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;
  const isLoadingRef = useRef(false);

  const loadSignatures = useCallback(
    async (append = false) => {
      if (!selectedCompany?.id || isLoadingRef.current) return;
      isLoadingRef.current = true;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const response = await documentSignatureApi.listAll(
          selectedCompany.id,
          {
            status: filters.status !== 'all' ? filters.status : undefined,
            search: filters.search.trim() || undefined,
            page,
            limit,
            sortBy: 'createdAt',
            sortOrder: 'DESC',
          }
        );
        if (append) {
          setSignatures(prev => [...prev, ...response.signatures]);
        } else {
          setSignatures(response.signatures);
        }
        setTotal(response.total);
        setTotalPages(Math.ceil(response.total / limit));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar assinaturas'
        );
        toast.error('Erro ao carregar assinaturas');
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [selectedCompany?.id, filters.status, filters.search, page, limit]
  );

  // Reset page when filters change
  useEffect(() => {
    if (filters.search.trim() || filters.status !== 'all') {
      setPage(1);
      setSignatures([]);
    }
  }, [filters.search, filters.status]);

  // Load signatures when filters or page change
  useEffect(() => {
    if (
      selectedCompany?.id &&
      !loading &&
      !loadingMore &&
      !isLoadingRef.current
    ) {
      const isAppending = page > 1;
      loadSignatures(isAppending);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id, filters.status, filters.search, page]);

  const handleFiltersChange = useCallback((newFilters: SignatureFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleCopyLink = async (signatureUrl: string) => {
    try {
      await navigator.clipboard.writeText(signatureUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const handleSendEmail = async (documentId: string, signatureId: string) => {
    if (!selectedCompany?.id || isLoadingRef.current) return;
    try {
      await documentSignatureApi.sendSignatureEmail(
        documentId,
        signatureId,
        selectedCompany.id
      );
      toast.success('Email enviado com sucesso!');
      await loadSignatures(false);
    } catch (error) {
      toast.error('Erro ao enviar email');
    }
  };

  const handleResendEmail = async (documentId: string, signatureId: string) => {
    if (!selectedCompany?.id || isLoadingRef.current) return;
    try {
      await documentSignatureApi.resendSignatureEmail(
        documentId,
        signatureId,
        selectedCompany.id
      );
      toast.success('Email reenviado com sucesso!');
      await loadSignatures(false);
    } catch (error) {
      toast.error('Erro ao reenviar email');
    }
  };

  const handleLoadMore = async () => {
    if (page < totalPages && !loading && !loadingMore) {
      setPage(prev => prev + 1);
    }
  };

  const hasActiveFilters = filters.search.trim() || filters.status !== 'all';
  const activeFiltersCount = [
    filters.search.trim(),
    filters.status !== 'all',
  ].filter(Boolean).length;

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Assinaturas</PageTitle>
              <PageSubtitle>
                Gerencie todas as assinaturas de documentos
              </PageSubtitle>
            </PageTitleContainer>
            <HeaderActions>
              <FilterButton onClick={() => setShowFiltersDrawer(true)}>
                <MdFilterList size={20} />
                Filtros
                {hasActiveFilters && (
                  <FilterBadge>{activeFiltersCount}</FilterBadge>
                )}
              </FilterButton>
              <BackButton onClick={() => navigate('/documents')}>
                <MdArrowBack size={20} />
                Voltar
              </BackButton>
            </HeaderActions>
          </PageHeader>

          <StatsBar>
            <MdInfoOutline size={18} />
            Total de Assinaturas: <strong>{total}</strong>
          </StatsBar>

          {/* Lista de Assinaturas */}
          {loading && signatures.length === 0 ? (
            <SignaturesShimmer />
          ) : error ? (
            <ErrorContainer>
              <ErrorMessage>{error}</ErrorMessage>
              <RetryButton onClick={() => loadSignatures(false)}>
                <MdRefresh size={18} />
                Tentar novamente
              </RetryButton>
            </ErrorContainer>
          ) : signatures.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyTitle>Nenhuma assinatura encontrada</EmptyTitle>
              <EmptyDescription>
                {hasActiveFilters
                  ? 'Tente ajustar os filtros de busca'
                  : 'Ainda não há assinaturas cadastradas'}
              </EmptyDescription>
            </EmptyState>
          ) : (
            <>
              <SignaturesList>
                {signatures.map(signature => (
                  <SignatureCard key={signature.id}>
                    <CardHeader>
                      <HeaderLeft>
                        <SignerName>{signature.signerName}</SignerName>
                        <SignerEmail>{signature.signerEmail}</SignerEmail>
                      </HeaderLeft>
                      <SignatureStatusBadge status={signature.status} />
                    </CardHeader>

                    <CardBody>
                      {signature.document && (
                        <InfoRow>
                          <InfoLabel>Documento:</InfoLabel>
                          <InfoValue>
                            {signature.document.title ||
                              signature.document.originalName}
                          </InfoValue>
                        </InfoRow>
                      )}

                      {signature.client && (
                        <InfoRow>
                          <InfoLabel>Cliente:</InfoLabel>
                          <InfoValue>{signature.client.name}</InfoValue>
                        </InfoRow>
                      )}

                      {signature.user && (
                        <InfoRow>
                          <InfoLabel>Usuário:</InfoLabel>
                          <InfoValue>{signature.user.name}</InfoValue>
                        </InfoRow>
                      )}

                      {signature.viewedAt && (
                        <InfoRow>
                          <InfoLabel>Visualizado em:</InfoLabel>
                          <InfoValue>
                            {formatarDataHora(signature.viewedAt)}
                          </InfoValue>
                        </InfoRow>
                      )}

                      {signature.signedAt && (
                        <InfoRow>
                          <InfoLabel>Assinado em:</InfoLabel>
                          <InfoValue>
                            {formatarDataHora(signature.signedAt)}
                          </InfoValue>
                        </InfoRow>
                      )}

                      {signature.expiresAt && (
                        <InfoRow>
                          <InfoLabel>Expira em:</InfoLabel>
                          <InfoValue $warning={signature.isExpired}>
                            {formatarDataHora(signature.expiresAt)}
                            {signature.daysUntilExpiration !== undefined && (
                              <span>
                                {' '}
                                ({signature.daysUntilExpiration} dias)
                              </span>
                            )}
                          </InfoValue>
                        </InfoRow>
                      )}

                      {signature.rejectionReason && (
                        <InfoRow>
                          <InfoLabel>Motivo da rejeição:</InfoLabel>
                          <InfoValue $error>
                            {signature.rejectionReason}
                          </InfoValue>
                        </InfoRow>
                      )}
                    </CardBody>

                    <CardActions>
                      {signature.signatureUrl && (
                        <ActionButton
                          onClick={() =>
                            handleCopyLink(signature.signatureUrl!)
                          }
                          title='Copiar link'
                        >
                          <MdContentCopy size={16} />
                          Copiar Link
                        </ActionButton>
                      )}

                      {signature.documentId && (
                        <>
                          {(signature.status === 'pending' ||
                            signature.status === 'viewed' ||
                            signature.status === 'expired') && (
                            <>
                              <ActionButton
                                onClick={() =>
                                  handleSendEmail(
                                    signature.documentId!,
                                    signature.id
                                  )
                                }
                                title='Enviar email'
                              >
                                <MdEmail size={16} />
                                Enviar Email
                              </ActionButton>
                              <ActionButton
                                onClick={() =>
                                  handleResendEmail(
                                    signature.documentId!,
                                    signature.id
                                  )
                                }
                                title='Reenviar email'
                              >
                                <MdRefresh size={16} />
                                Reenviar
                              </ActionButton>
                            </>
                          )}
                        </>
                      )}
                    </CardActions>
                  </SignatureCard>
                ))}
              </SignaturesList>

              {/* Load More */}
              {page < totalPages && (
                <LoadMoreContainer>
                  <LoadMoreButton
                    onClick={handleLoadMore}
                    disabled={loading || loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <LoadingSpinner />
                        Carregando...
                      </>
                    ) : (
                      `Carregar mais (${total - signatures.length} restantes)`
                    )}
                  </LoadMoreButton>
                </LoadMoreContainer>
              )}
            </>
          )}
        </PageContent>
      </PageContainer>

      {/* Drawer de Filtros */}
      <SignatureFiltersDrawer
        isOpen={showFiltersDrawer}
        onClose={() => setShowFiltersDrawer(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />
    </Layout>
  );
};
