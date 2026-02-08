import React from 'react';
import styled from 'styled-components';
import { MdInfo, MdCheckCircle, MdSchedule, MdCancel } from 'react-icons/md';
import { useDocumentSignatures } from '../../hooks/useDocumentSignatures';
import { DocumentSignatureCard } from './DocumentSignatureCard';
import { SignatureStatusBadge } from './SignatureStatusBadge';
import { DocumentSignatureStatus } from '../../types/documentSignature';
import { toast } from 'react-toastify';

interface DocumentSignatureListProps {
  documentId: string;
}

export const DocumentSignatureList: React.FC<DocumentSignatureListProps> = ({
  documentId,
}) => {
  const {
    signatures,
    stats,
    loading,
    error,
    refreshSignatures,
    sendEmail,
    resendEmail,
  } = useDocumentSignatures(documentId);

  const handleSendEmail = async (signatureId: string) => {
    try {
      await sendEmail(signatureId);
      toast.success('Email enviado com sucesso!');
      await refreshSignatures();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleResend = async (signatureId: string) => {
    try {
      await resendEmail(signatureId);
      toast.success('Email reenviado com sucesso!');
      await refreshSignatures();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  if (loading && signatures.length === 0) {
    return (
      <Container>
        <LoadingMessage>Carregando assinaturas...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      {stats && (
        <StatsContainer>
          <StatsTitle>
            <MdInfo size={18} />
            Estatísticas
          </StatsTitle>
          <StatsGrid>
            <StatItem>
              <StatLabel>Total</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatItem>
            <StatItem $status='pending'>
              <StatLabel>Pendentes</StatLabel>
              <StatValue>{stats.pending}</StatValue>
            </StatItem>
            <StatItem $status='viewed'>
              <StatLabel>Visualizados</StatLabel>
              <StatValue>{stats.viewed}</StatValue>
            </StatItem>
            <StatItem $status='signed'>
              <StatLabel>Assinados</StatLabel>
              <StatValue>{stats.signed}</StatValue>
            </StatItem>
            <StatItem $status='rejected'>
              <StatLabel>Rejeitados</StatLabel>
              <StatValue>{stats.rejected}</StatValue>
            </StatItem>
            <StatItem $status='expired'>
              <StatLabel>Expirados</StatLabel>
              <StatValue>{stats.expired}</StatValue>
            </StatItem>
          </StatsGrid>
        </StatsContainer>
      )}

      {signatures.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyTitle>Nenhuma assinatura encontrada</EmptyTitle>
          <EmptyDescription>
            Envie este documento para assinatura usando o botão "Enviar para
            Assinatura"
          </EmptyDescription>
        </EmptyState>
      ) : (
        <SignaturesList>
          {signatures.map(signature => (
            <DocumentSignatureCard
              key={signature.id}
              signature={signature}
              documentId={documentId}
              onSendEmail={handleSendEmail}
              onResend={handleResend}
            />
          ))}
        </SignaturesList>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const LoadingMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error}10;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.error}30;
`;

const StatsContainer = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
`;

const StatsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
`;

const StatItem = styled.div<{ $status?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  max-width: 400px;
`;

const SignaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
