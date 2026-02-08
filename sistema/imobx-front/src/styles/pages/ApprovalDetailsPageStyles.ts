import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 16px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    gap: 8px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 14px;
    padding-bottom: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
`;

export const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.938rem;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const InfoValue = styled.span`
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'approved':
        return '#10b98120';
      case 'rejected':
        return '#ef444420';
      case 'pending':
        return '#f59e0b20';
      default:
        return '#6b728020';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'approved':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  }};

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 10px;
  }
`;

export const TypeBadge = styled.span<{ $type: 'sale' | 'rental' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: ${props =>
    props.$type === 'sale'
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
  color: white;
  box-shadow: 0 2px 8px
    ${props =>
      props.$type === 'sale'
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(59, 130, 246, 0.3)'};

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 4px 10px;
  }
`;

export const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const ValueCard = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ValueLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`;

export const ValueAmount = styled.div<{ $color?: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$color || props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ValueNote = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #6366f1;
  font-style: italic;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const NotesSection = styled.div`
  margin-top: 16px;

  @media (max-width: 480px) {
    margin-top: 12px;
  }
`;

export const NoteItem = styled.div`
  padding: 14px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary};
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 10px;
  }
`;

export const NoteLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 6px;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`;

export const NoteText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-style: italic;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 20px;
    padding-top: 16px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
    padding-top: 14px;
  }
`;

export const ActionButton = styled.button<{
  $variant: 'approve' | 'reject' | 'secondary';
}>`
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  flex: 1;
  min-width: fit-content;

  ${props => {
    switch (props.$variant) {
      case 'approve':
        return `
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }
        `;
      case 'reject':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }
        `;
      default:
        return `
          background: ${props.theme.colors.cardBackground};
          color: ${props.theme.colors.text};
          border: 2px solid ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.backgroundSecondary};
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
  }
`;

export const TimelineSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const TimelineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    padding: 10px;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TimelineIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

export const TimelineContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const TimelineTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const TimelineDate = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;

  @media (max-width: 480px) {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;
