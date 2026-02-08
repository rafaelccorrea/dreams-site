import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdContentCopy,
  MdEmail,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { documentSignatureApi } from '../../services/documentSignatureApi';
import { useCompany } from '../../hooks/useCompany';
import type {
  DocumentSignature,
  DocumentSignatureStatus,
} from '../../types/documentSignature';
import { SignatureStatusBadge } from '../documents/SignatureStatusBadge';
import { formatarDataHora } from '../../utils/format';

interface AllSignaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StatusFilter = 'all' | DocumentSignatureStatus;

export const AllSignaturesModal: React.FC<AllSignaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { selectedCompany } = useCompany();
  const [signatures, setSignatures] = useState<DocumentSignature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const loadSignatures = useCallback(
    async (append = false) => {
      if (!selectedCompany?.id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await documentSignatureApi.listAll(
          selectedCompany.id,
          {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: search.trim() || undefined,
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
      }
    },
    [selectedCompany?.id, statusFilter, search, page]
  );

  // Reset page when filters change
  useEffect(() => {
    if (isOpen && (statusFilter !== 'all' || search.trim())) {
      setPage(1);
      setSignatures([]);
    }
  }, [statusFilter, search, isOpen]);

  // Load signatures when filters or page change
  useEffect(() => {
    if (isOpen && selectedCompany?.id) {
      const isAppending = page > 1 && signatures.length > 0;
      loadSignatures(isAppending);
    }
  }, [isOpen, selectedCompany?.id, statusFilter, search, page]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  }, []);

  const handleStatusFilter = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page on filter change
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
    if (!selectedCompany?.id) return;
    try {
      await documentSignatureApi.sendSignatureEmail(
        documentId,
        signatureId,
        selectedCompany.id
      );
      toast.success('Email enviado com sucesso!');
      await loadSignatures();
    } catch (error) {
      toast.error('Erro ao enviar email');
    }
  };

  const handleResendEmail = async (documentId: string, signatureId: string) => {
    if (!selectedCompany?.id) return;
    try {
      await documentSignatureApi.resendSignatureEmail(
        documentId,
        signatureId,
        selectedCompany.id
      );
      toast.success('Email reenviado com sucesso!');
      await loadSignatures();
    } catch (error) {
      toast.error('Erro ao reenviar email');
    }
  };

  const handleLoadMore = async () => {
    if (page < totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  };

  if (!isOpen) return null;

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'viewed', label: 'Visualizadas' },
    { value: 'signed', label: 'Assinadas' },
    { value: 'rejected', label: 'Rejeitadas' },
    { value: 'expired', label: 'Expiradas' },
    { value: 'cancelled', label: 'Canceladas' },
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderLeft>
            <ModalTitle>Assinaturas</ModalTitle>
            <ModalSubtitle>
              {total > 0
                ? `${total} assinatura(s) encontrada(s)`
                : 'Nenhuma assinatura encontrada'}
            </ModalSubtitle>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Filtros */}
          <FiltersContainer>
            <SearchContainer>
              <SearchIcon>
                <MdSearch size={20} />
              </SearchIcon>
              <SearchInput
                type='text'
                placeholder='Buscar por nome ou email do signatário...'
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
            </SearchContainer>

            <StatusFilterContainer>
              <FilterLabel>
                <MdFilterList size={18} />
                Status:
              </FilterLabel>
              <StatusButtons>
                {statusOptions.map(option => (
                  <StatusButton
                    key={option.value}
                    $active={statusFilter === option.value}
                    onClick={() => handleStatusFilter(option.value)}
                  >
                    {option.label}
                  </StatusButton>
                ))}
              </StatusButtons>
            </StatusFilterContainer>
          </FiltersContainer>

          {/* Lista de Assinaturas */}
          {loading && signatures.length === 0 ? (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Carregando assinaturas...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorMessage>{error}</ErrorMessage>
              <RetryButton onClick={loadSignatures}>
                <MdRefresh size={18} />
                Tentar novamente
              </RetryButton>
            </ErrorContainer>
          ) : signatures.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyTitle>Nenhuma assinatura encontrada</EmptyTitle>
              <EmptyDescription>
                {search || statusFilter !== 'all'
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
                  <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
                    {loading ? (
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
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
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
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 20px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
`;

const FiltersContainer = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 14px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const StatusFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatusButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 2px solid
    ${props =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.primary}10;
    color: ${props => (props.$active ? 'white' : props.theme.colors.primary)};
  }
`;

const SignaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SignatureCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SignerName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const SignerEmail = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span<{ $error?: boolean; $warning?: boolean }>`
  color: ${props => {
    if (props.$error) return props.theme.colors.error;
    if (props.$warning) return props.theme.colors.warning || '#f59e0b';
    return props.theme.colors.text;
  }};
  font-weight: ${props => (props.$error || props.$warning ? 600 : 400)};
  text-align: right;
  word-break: break-word;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.error};
  text-align: center;
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;
  margin-top: 16px;
`;

const LoadMoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
