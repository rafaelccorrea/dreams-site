import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUploadTokens } from '../../hooks/useUploadTokens';
import { useToast } from '../../hooks/useToast';
import { CreateUploadTokenModal } from './CreateUploadTokenModal';
import { copyToClipboard } from '../../services/uploadTokenApi';
import { PermissionButton } from '../common/PermissionButton';
import type { UploadToken } from '../../types/document';

export const UploadTokensDashboard: React.FC = () => {
  const { tokens, loading, fetchTokens, sendEmail, revokeToken } =
    useUploadTokens();
  const { showToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'active' | 'expired' | 'revoked'
  >('all');

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const handleCopyLink = async (link: string) => {
    const success = await copyToClipboard(link);
    if (success) {
      showToast('Link copiado para área de transferência!', 'success');
    } else {
      showToast('Erro ao copiar link', 'error');
    }
  };

  const handleSendEmail = async (tokenId: string) => {
    try {
      const result = await sendEmail(tokenId);
      if (result) {
        showToast(result.message, 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao enviar email', 'error');
    }
  };

  const handleRevokeToken = async (tokenId: string, clientName: string) => {
    if (!confirm(`Deseja realmente revogar o link de ${clientName}?`)) {
      return;
    }

    const success = await revokeToken(tokenId);
    if (success) {
      showToast('Link revogado com sucesso!', 'success');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: { bg: '#10b981', text: '#fff' },
      expired: { bg: '#6b7280', text: '#fff' },
      used: { bg: '#3b82f6', text: '#fff' },
      revoked: { bg: '#ef4444', text: '#fff' },
    };

    const labels = {
      active: 'Ativo',
      expired: 'Expirado',
      used: 'Usado',
      revoked: 'Revogado',
    };

    const color = colors[status as keyof typeof colors] || colors.active;
    const label = labels[status as keyof typeof labels] || status;

    return (
      <StatusBadge bg={color.bg} color={color.text}>
        {label}
      </StatusBadge>
    );
  };

  const filteredTokens = tokens.filter(token => {
    if (filter === 'all') return true;
    return token.status === filter;
  });

  return (
    <Container>
      <Header>
        <div>
          <Title>Links de Upload de Documentos</Title>
          <Subtitle>
            Crie links temporários para clientes enviarem documentos
          </Subtitle>
        </div>
        <PermissionButton
          permission='document:create'
          onClick={() => setShowCreateModal(true)}
          variant='primary'
        >
          + Criar Novo Link
        </PermissionButton>
      </Header>

      <FilterBar>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Todos ({tokens.length})
        </FilterButton>
        <FilterButton
          active={filter === 'active'}
          onClick={() => setFilter('active')}
        >
          Ativos ({tokens.filter(t => t.status === 'active').length})
        </FilterButton>
        <FilterButton
          active={filter === 'expired'}
          onClick={() => setFilter('expired')}
        >
          Expirados ({tokens.filter(t => t.status === 'expired').length})
        </FilterButton>
        <FilterButton
          active={filter === 'revoked'}
          onClick={() => setFilter('revoked')}
        >
          Revogados ({tokens.filter(t => t.status === 'revoked').length})
        </FilterButton>
      </FilterBar>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Carregando links...</p>
        </LoadingContainer>
      ) : filteredTokens.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📎</EmptyIcon>
          <EmptyTitle>Nenhum link encontrado</EmptyTitle>
          <EmptyText>
            {filter === 'all'
              ? 'Crie seu primeiro link de upload para clientes'
              : `Nenhum link ${filter === 'active' ? 'ativo' : filter === 'expired' ? 'expirado' : 'revogado'} encontrado`}
          </EmptyText>
        </EmptyState>
      ) : (
        <TokensGrid>
          {filteredTokens.map(token => (
            <TokenCard key={token.id} status={token.status}>
              <CardHeader>
                <div>
                  <ClientName>{token.clientName}</ClientName>
                  <ClientCpf>CPF: {token.clientCpfMasked}</ClientCpf>
                </div>
                {getStatusBadge(token.status)}
              </CardHeader>

              <CardBody>
                <InfoRow>
                  <InfoLabel>Documentos enviados:</InfoLabel>
                  <InfoValue>{token.documentsUploaded}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Expira em:</InfoLabel>
                  <InfoValue>
                    {new Date(token.expiresAt).toLocaleString('pt-BR')}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Criado em:</InfoLabel>
                  <InfoValue>
                    {new Date(token.createdAt).toLocaleString('pt-BR')}
                  </InfoValue>
                </InfoRow>
                {token.notes && (
                  <NotesContainer>
                    <InfoLabel>Observações:</InfoLabel>
                    <Notes>{token.notes}</Notes>
                  </NotesContainer>
                )}
              </CardBody>

              <CardFooter>
                <ActionButton onClick={() => handleCopyLink(token.uploadUrl)}>
                  📋 Copiar Link
                </ActionButton>
                {token.status === 'active' && (
                  <>
                    <ActionButton
                      primary
                      onClick={() => handleSendEmail(token.id)}
                    >
                      📧 Enviar Email
                    </ActionButton>
                    <ActionButton
                      danger
                      onClick={() =>
                        handleRevokeToken(token.id, token.clientName)
                      }
                    >
                      🚫 Revogar
                    </ActionButton>
                  </>
                )}
              </CardFooter>

              <LinkPreview>
                <LinkPreviewText>{token.uploadUrl}</LinkPreviewText>
              </LinkPreview>
            </TokenCard>
          ))}
        </TokensGrid>
      )}

      <CreateUploadTokenModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchTokens();
          setShowCreateModal(false);
        }}
      />
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) =>
      theme.colors.primaryDark || theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.background};
  color: ${({ active, theme }) => (active ? 'white' : theme.colors.text)};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ active, theme }) =>
      active
        ? theme.colors.primaryDark || theme.colors.primary
        : theme.colors.hover};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const TokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const TokenCard = styled.div<{ status: string }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  opacity: ${({ status }) => (status === 'active' ? 1 : 0.8)};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ClientName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ClientCpf = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ bg: string; color: string }>`
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
`;

const CardBody = styled.div`
  padding: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
`;

const NotesContainer = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Notes = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const CardFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ danger?: boolean; primary?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ primary, theme }) =>
    primary ? theme.colors.primary : theme.colors.background};
  color: ${({ danger, primary, theme }) =>
    danger ? '#ef4444' : primary ? 'white' : theme.colors.text};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ danger, primary, theme }) =>
      danger
        ? '#fee2e2'
        : primary
          ? theme.colors.primaryDark || theme.colors.primary
          : theme.colors.hover};
    border-color: ${({ danger, primary, theme }) =>
      danger
        ? '#ef4444'
        : primary
          ? theme.colors.primaryDark || theme.colors.primary
          : theme.colors.primary};
  }
`;

const LinkPreview = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LinkPreviewText = styled.small`
  font-family: monospace;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
  word-break: break-all;
  display: block;
`;
