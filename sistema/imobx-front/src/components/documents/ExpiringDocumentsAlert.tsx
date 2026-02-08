import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDocuments } from '../../hooks/useDocuments';
import type { DocumentModel } from '../../types/document';

interface ExpiringDocumentsAlertProps {
  days?: number;
  onDocumentClick?: (document: DocumentModel) => void;
}

export const ExpiringDocumentsAlert: React.FC<ExpiringDocumentsAlertProps> = ({
  days = 30,
  onDocumentClick,
}) => {
  const { documents, fetchExpiring, loading } = useDocuments();

  useEffect(() => {
    fetchExpiring(days);
  }, [days, fetchExpiring]);

  if (loading || documents.length === 0) {
    return null;
  }

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getDaysUntilExpiry = (date: Date | string): number => {
    const expiry = new Date(date);
    const now = new Date();
    return Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <AlertContainer>
      <AlertHeader>
        <AlertIcon>⚠️</AlertIcon>
        <AlertTitle>Documentos Próximos ao Vencimento</AlertTitle>
      </AlertHeader>
      <AlertContent>
        <DocumentsList>
          {documents.map(doc => {
            const daysLeft = getDaysUntilExpiry(doc.expiryDate!);
            return (
              <DocumentItem
                key={doc.id}
                onClick={() => onDocumentClick?.(doc)}
                $clickable={!!onDocumentClick}
              >
                <DocumentInfo>
                  <DocumentName>{doc.title || doc.originalName}</DocumentName>
                  <DocumentExpiry $urgent={daysLeft <= 7}>
                    Vence em {daysLeft} dia(s) - {formatDate(doc.expiryDate!)}
                  </DocumentExpiry>
                </DocumentInfo>
                {daysLeft <= 7 && <UrgentBadge>URGENTE</UrgentBadge>}
              </DocumentItem>
            );
          })}
        </DocumentsList>
      </AlertContent>
    </AlertContainer>
  );
};

const AlertContainer = styled.div`
  background-color: ${({ theme }) => '#fef3c7'};
  border: 1px solid ${({ theme }) => '#f59e0b'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const AlertIcon = styled.span`
  font-size: 1.5rem;
`;

const AlertTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  margin: 0;
`;

const AlertContent = styled.div``;

const DocumentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const DocumentItem = styled.li<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: white;
  border-radius: 4px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $clickable }) => ($clickable ? '#fef3c7' : 'white')};
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #92400e;
`;

const DocumentExpiry = styled.span<{ $urgent: boolean }>`
  font-size: 0.75rem;
  color: ${({ $urgent }) => ($urgent ? '#dc2626' : '#92400e')};
  font-weight: ${({ $urgent }) => ($urgent ? '600' : '400')};
`;

const UrgentBadge = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: #dc2626;
  color: white;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
`;
