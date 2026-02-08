import styled from 'styled-components';
import { MdArrowBack } from 'react-icons/md';

export const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

export const SectionDivider = styled.div`
  margin: 32px 0;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InfoValue = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

export const HighlightValue = styled(InfoValue)`
  font-size: 1.75rem;
  color: #10b981;
  font-weight: 700;
`;

export const MessageBox = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
`;

export const MessageText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  font-size: 0.95rem;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background: #FEF3C7;
          color: #92400E;
        `;
      case 'accepted':
        return `
          background: #D1FAE5;
          color: #065F46;
        `;
      case 'rejected':
        return `
          background: #FEE2E2;
          color: #991B1B;
        `;
      case 'withdrawn':
        return `
          background: #E5E7EB;
          color: #374151;
        `;
      default:
        return `
          background: #E5E7EB;
          color: #374151;
        `;
    }
  }}
`;

export const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const ActionsButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const Button = styled.button<{
  $variant?: 'accept' | 'reject' | 'cancel';
}>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => {
    if (props.$variant === 'accept') {
      return `
        background: #10B981;
        color: white;
        &:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
      `;
    }
    if (props.$variant === 'reject') {
      return `
        background: #EF4444;
        color: white;
        &:hover:not(:disabled) {
          background: #DC2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
      `;
    }
    return `
      background: ${props.theme.colors.backgroundSecondary};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover:not(:disabled) {
        background: ${props.theme.colors.border};
      }
    `;
  }}
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

export const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 20px 0;
`;
