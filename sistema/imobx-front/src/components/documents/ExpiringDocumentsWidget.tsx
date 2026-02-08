import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdWarning, MdSchedule, MdClose } from 'react-icons/md';
import type { DocumentModel } from '../../types/document';
import { DocumentTypeLabels } from '../../types/document';
import { fetchExpiringDocuments } from '../../services/documentApi';
import { formatDate } from '../../utils/format';

interface ExpiringDocumentsWidgetProps {
  days?: number;
  onClose?: () => void;
}

export const ExpiringDocumentsWidget: React.FC<
  ExpiringDocumentsWidgetProps
> = ({ days = 30, onClose }) => {
  const [expiringDocs, setExpiringDocs] = useState<DocumentModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpiringDocuments();
  }, [days]);

  const fetchExpiringDocuments = async () => {
    try {
      setLoading(true);
      const documents = await fetchExpiringDocuments(days);
      setExpiringDocs(documents || []);
    } catch (error) {
      console.error('Erro ao buscar documentos vencendo:', error);
      setExpiringDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | Date): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const getUrgencyLevel = (days: number): 'critical' | 'warning' | 'info' => {
    if (days <= 0) return 'critical';
    if (days <= 7) return 'warning';
    return 'info';
  };

  const getUrgencyColor = (level: 'critical' | 'warning' | 'info') => {
    switch (level) {
      case 'critical':
        return '#dc2626'; // red-600
      case 'warning':
        return '#d97706'; // amber-600
      case 'info':
        return '#2563eb'; // blue-600
      default:
        return '#6b7280'; // gray-500
    }
  };

  const getUrgencyIcon = (level: 'critical' | 'warning' | 'info') => {
    switch (level) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📅';
    }
  };

  if (loading) {
    return (
      <WidgetContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Verificando documentos...</LoadingText>
        </LoadingContainer>
      </WidgetContainer>
    );
  }

  if (expiringDocs.length === 0) {
    return null;
  }

  return (
    <WidgetContainer>
      <WidgetHeader>
        <HeaderContent>
          <WarningIcon>
            <MdWarning size={24} />
          </WarningIcon>
          <HeaderInfo>
            <WidgetTitle>Documentos Próximos ao Vencimento</WidgetTitle>
            <WidgetSubtitle>
              {expiringDocs.length} documento(s) vence(m) nos próximos {days}{' '}
              dias
            </WidgetSubtitle>
          </HeaderInfo>
        </HeaderContent>
        {onClose && (
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        )}
      </WidgetHeader>

      <WidgetContent>
        <DocumentsList>
          {expiringDocs.map(doc => {
            if (!doc.expiryDate) return null;

            const daysUntilExpiry = getDaysUntilExpiry(doc.expiryDate);
            const urgencyLevel = getUrgencyLevel(daysUntilExpiry);
            const urgencyColor = getUrgencyColor(urgencyLevel);
            const urgencyIcon = getUrgencyIcon(urgencyLevel);

            return (
              <DocumentItem key={doc.id}>
                <DocumentIcon>{urgencyIcon}</DocumentIcon>
                <DocumentInfo>
                  <DocumentName>{doc.title || doc.originalName}</DocumentName>
                  <DocumentMeta>
                    <TypeBadge>{DocumentTypeLabels[doc.type]}</TypeBadge>
                    <ExpiryInfo $color={urgencyColor}>
                      <MdSchedule size={14} />
                      {daysUntilExpiry <= 0
                        ? 'Vencido'
                        : `Vence em ${daysUntilExpiry} dia(s)`}
                    </ExpiryInfo>
                  </DocumentMeta>
                </DocumentInfo>
                <ExpiryDate $color={urgencyColor}>
                  {formatDate(doc.expiryDate)}
                </ExpiryDate>
              </DocumentItem>
            );
          })}
        </DocumentsList>
      </WidgetContent>
    </WidgetContainer>
  );
};

// Styled Components
const WidgetContainer = styled.div`
  background: ${props =>
    props.theme.name === 'dark'
      ? 'linear-gradient(135deg, #451a03 0%, #78350f 100%)'
      : 'linear-gradient(135deg, #fef3cd 0%, #fde68a 100%)'};
  border: 1px solid
    ${props => (props.theme.name === 'dark' ? '#f59e0b' : '#f59e0b')};
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: ${props =>
    props.theme.name === 'dark'
      ? '0 4px 12px rgba(245, 158, 11, 0.25)'
      : '0 4px 12px rgba(245, 158, 11, 0.15)'};
  overflow: hidden;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const WidgetHeader = styled.div`
  padding: 20px 24px;
  background: ${props =>
    props.theme.name === 'dark'
      ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const WarningIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WidgetTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: white;
`;

const WidgetSubtitle = styled.p`
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WidgetContent = styled.div`
  padding: 20px 24px;
  background: ${props => props.theme.colors.surface};
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => (props.theme.name === 'dark' ? '#451a03' : '#fef3cd')};
  border-radius: 12px;
  border: 1px solid
    ${props => (props.theme.name === 'dark' ? '#78350f' : '#fde68a')};
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.name === 'dark' ? '#78350f' : '#fde68a'};
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
  }
`;

const DocumentIcon = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DocumentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DocumentName = styled.div`
  font-weight: 600;
  color: ${props => (props.theme.name === 'dark' ? '#fbbf24' : '#92400e')};
  font-size: 14px;
  line-height: 1.4;
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const TypeBadge = styled.span`
  background: ${props => (props.theme.name === 'dark' ? '#b45309' : '#d97706')};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
`;

const ExpiryInfo = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$color};
  font-size: 12px;
  font-weight: 600;
`;

const ExpiryDate = styled.div<{ $color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$color};
  background: ${props =>
    props.theme.name === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)'};
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 12px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #fde68a;
  border-top: 3px solid #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: ${props => (props.theme.name === 'dark' ? '#fbbf24' : '#92400e')};
  font-size: 14px;
  font-weight: 500;
`;
