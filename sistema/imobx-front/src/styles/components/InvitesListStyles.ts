import styled from 'styled-components';

export const InvitesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 0;
  width: 100%;
`;

export const InviteCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 600px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const InviteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const InviteTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

export const StatusBadge = styled.span<{ $color: string }>`
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid ${props => props.$color}40;
`;

export const InviteDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const DetailText = styled.span`
  font-size: 0.9rem;
`;

export const InviteMessage = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

export const MessageLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

export const MessageText = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
`;

export const InviteActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

export const ActionButton = styled.button<{ $variant: 'accept' | 'decline' }>`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;

  ${props => {
    if (props.$variant === 'accept') {
      return `
        background: #10B981;
        color: white;

        &:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: #EF4444;
        color: white;

        &:hover:not(:disabled) {
          background: #DC2626;
          transform: translateY(-1px);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const ResponseInfo = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 16px 0 8px;
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;
