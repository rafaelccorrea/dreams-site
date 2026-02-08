import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdContentCopy,
  MdEmail,
  MdRefresh,
  MdSchedule,
  MdInfo,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import type { DocumentSignature } from '../../types/documentSignature';
import { DocumentSignatureStatus } from '../../types/documentSignature';
import { SignatureStatusBadge } from './SignatureStatusBadge';
import { formatarDataHora } from '../../utils/format';

interface DocumentSignatureCardProps {
  signature: DocumentSignature;
  documentId: string;
  onSendEmail?: (signatureId: string) => Promise<void>;
  onResend?: (signatureId: string) => Promise<void>;
  onRenewExpiration?: (signatureId: string, expiresAt: string) => Promise<void>;
}

export const DocumentSignatureCard: React.FC<DocumentSignatureCardProps> = ({
  signature,
  documentId,
  onSendEmail,
  onResend,
  onRenewExpiration,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCopyLink = async () => {
    if (!signature.signatureUrl) {
      toast.error('Link de assinatura não disponível');
      return;
    }

    try {
      await navigator.clipboard.writeText(signature.signatureUrl);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const handleSendEmail = async () => {
    if (!onSendEmail) return;
    setLoading(true);
    try {
      await onSendEmail(signature.id);
      toast.success('Email enviado com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (date?: Date | string): string => {
    if (!date) return '-';
    return formatarDataHora(date);
  };

  return (
    <Card>
      <CardHeader>
        <HeaderLeft>
          <SignerName>{signature.signerName}</SignerName>
          <SignerEmail>{signature.signerEmail}</SignerEmail>
        </HeaderLeft>
        <SignatureStatusBadge status={signature.status} />
      </CardHeader>

      <CardBody>
        <InfoRow>
          <InfoLabel>Tipo:</InfoLabel>
          <InfoValue>
            {signature.clientId
              ? 'Cliente'
              : signature.userId
                ? 'Usuário'
                : 'Externo'}
          </InfoValue>
        </InfoRow>

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
            <InfoValue>{formatDateDisplay(signature.viewedAt)}</InfoValue>
          </InfoRow>
        )}

        {signature.signedAt && (
          <InfoRow>
            <InfoLabel>Assinado em:</InfoLabel>
            <InfoValue>{formatDateDisplay(signature.signedAt)}</InfoValue>
          </InfoRow>
        )}

        {signature.rejectedAt && (
          <InfoRow>
            <InfoLabel>Rejeitado em:</InfoLabel>
            <InfoValue>{formatDateDisplay(signature.rejectedAt)}</InfoValue>
          </InfoRow>
        )}

        {signature.rejectionReason && (
          <InfoRow>
            <InfoLabel>Motivo da rejeição:</InfoLabel>
            <InfoValue $error>{signature.rejectionReason}</InfoValue>
          </InfoRow>
        )}

        {signature.expiresAt && (
          <InfoRow>
            <InfoLabel>Expira em:</InfoLabel>
            <InfoValue>{formatDateDisplay(signature.expiresAt)}</InfoValue>
          </InfoRow>
        )}
      </CardBody>

      <CardActions>
        {signature.signatureUrl && (
          <ActionButton onClick={handleCopyLink} title='Copiar link'>
            <MdContentCopy size={16} />
            Copiar Link
          </ActionButton>
        )}

        {/* Enviar Email: apenas quando status é pending e nunca foi visualizado */}
        {onSendEmail &&
          signature.status === 'pending' &&
          !signature.viewedAt && (
            <ActionButton
              onClick={handleSendEmail}
              disabled={loading}
              title='Enviar email'
            >
              <MdEmail size={16} />
              Enviar Email
            </ActionButton>
          )}

        {/* Reenviar Email: quando já foi visualizado ou está expirado */}
        {onResend &&
          (signature.status === 'viewed' ||
            signature.status === 'expired' ||
            (signature.status === 'pending' && signature.viewedAt)) && (
            <ActionButton
              onClick={() => onResend(signature.id)}
              disabled={loading}
              title='Reenviar email'
            >
              <MdRefresh size={16} />
              Reenviar Email
            </ActionButton>
          )}
      </CardActions>
    </Card>
  );
};

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const SignerName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const SignerEmail = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const InfoLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const InfoValue = styled.span<{ $error?: boolean }>`
  color: ${props =>
    props.$error ? props.theme.colors.error : props.theme.colors.text};
  font-weight: ${props => (props.$error ? 600 : 400)};
  text-align: right;
  word-break: break-word;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 12px;
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

  svg {
    flex-shrink: 0;
  }
`;
