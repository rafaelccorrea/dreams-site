import React, { useEffect, useCallback } from 'react';
import { MdClose, MdHistory, MdTimeline } from 'react-icons/md';
import { useFinancialAudit } from '../../hooks/useFinancialAudit';
import {
  getAuditActionLabel,
  getAuditActionIcon,
} from '../../types/financial-audit';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  AuditTimeline,
  TimelineTitle,
  TimelineList,
  TimelineItem,
  AuditHeader,
  AuditActionBadge,
  AuditDate,
  AuditUser,
  UserAvatar,
  UserName,
  AuditDetails,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  ErrorState,
  ErrorIcon,
  ErrorTitle,
  ErrorDescription,
} from '../../styles/components/TransactionAuditModalStyles';

interface TransactionAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

const TransactionAuditModal: React.FC<TransactionAuditModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const { auditHistory, isLoading, error, getTransactionAuditHistory } =
    useFinancialAudit();

  const loadData = useCallback(async () => {
    if (transactionId) {
      await getTransactionAuditHistory(transactionId);
      // Aqui você pode carregar as informações da transação se necessário
    }
  }, [transactionId, getTransactionAuditHistory]);

  useEffect(() => {
    if (isOpen && transactionId) {
      loadData();
    }
  }, [isOpen, transactionId, loadData]);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | Date) => {
    if (!date) return 'Data não disponível';
    try {
      return new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>
            <MdTimeline size={24} />
            Histórico de Alterações
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <AuditTimeline>
            <TimelineTitle>
              <MdHistory size={20} />
              Linha do Tempo
            </TimelineTitle>

            {isLoading && (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Carregando histórico...</LoadingText>
              </LoadingContainer>
            )}

            {error && (
              <ErrorState>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorTitle>Erro ao carregar histórico</ErrorTitle>
                <ErrorDescription>
                  Ocorreu um erro ao carregar o histórico de alterações. Tente
                  novamente.
                </ErrorDescription>
              </ErrorState>
            )}

            {!isLoading &&
              !error &&
              auditHistory &&
              auditHistory.length === 0 && (
                <EmptyState>
                  <EmptyStateIcon>📝</EmptyStateIcon>
                  <EmptyStateTitle>Nenhum histórico encontrado</EmptyStateTitle>
                  <EmptyStateDescription>
                    Esta transação ainda não possui histórico de alterações.
                  </EmptyStateDescription>
                </EmptyState>
              )}

            {!isLoading &&
              !error &&
              auditHistory &&
              auditHistory.length > 0 && (
                <TimelineList>
                  {auditHistory.map((audit, index) => (
                    <TimelineItem
                      key={audit.id}
                      $isLast={index === auditHistory.length - 1}
                    >
                      <AuditHeader>
                        <AuditActionBadge $action={audit.action}>
                          {getAuditActionIcon(audit.action)}
                          {getAuditActionLabel(audit.action)}
                        </AuditActionBadge>
                        <AuditDate>{formatDate(audit.createdAt)}</AuditDate>
                      </AuditHeader>

                      <AuditUser>
                        <UserAvatar>
                          {getInitials(audit.performedByName || 'Usuário')}
                        </UserAvatar>
                        <UserName>
                          {audit.performedByName || 'Usuário Desconhecido'}
                        </UserName>
                      </AuditUser>

                      <AuditDetails>
                        {audit.reason || 'Alteração realizada na transação.'}
                      </AuditDetails>
                    </TimelineItem>
                  ))}
                </TimelineList>
              )}
          </AuditTimeline>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export { TransactionAuditModal };
