import styled from 'styled-components';

// Layout Components
export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;
`;

export const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.6;
`;

export const PendingCountBadge = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
`;

// Approvals List
export const ApprovalsCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  overflow: hidden;
`;

export const ApprovalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const ApprovalItem = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: ${props => props.theme.colors.primary}08;
    border-left: 3px solid ${props => props.theme.colors.primary};
    padding-left: 21px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ApprovalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 16px;
`;

export const ApprovalHeaderLeft = styled.div`
  flex: 1;
`;

export const ApprovalTypeBadge = styled.span<{ $type: 'sale' | 'rental' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 12px;
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
`;

export const ApprovalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ApprovalSubtitle = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ApprovalHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

export const ApprovalDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ApprovalContent = styled.div`
  margin-bottom: 16px;
`;

export const ApprovalValues = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const ValueItem = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ValueLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const ValueAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const ApprovalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ApprovalActionButton = styled.button<{
  $variant: 'approve' | 'reject' | 'edit' | 'details';
}>`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

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
      case 'edit':
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
      case 'details':
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
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
`;

// Modal Styles
export const ModalOverlay = styled.div`
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
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export const FormField = styled.div`
  margin-bottom: 24px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#ef4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const FormTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#ef4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const InfoLabel = styled.span`
  font-weight: 600;
  min-width: 100px;
  font-size: 0.875rem;
`;

export const InfoValue = styled.span`
  color: ${props => props.theme.colors.text};
`;

export const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;
