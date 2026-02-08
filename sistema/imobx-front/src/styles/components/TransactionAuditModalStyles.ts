import styled from 'styled-components';
import { AuditAction } from '../../types/financial-audit';
import { getAuditActionColor } from '../../types/financial-audit';

export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'};
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(0, 0, 0, 0.25)'};
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 20px;
  }
`;

export const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ModalContent = styled.div`
  padding: 32px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const TransactionInfo = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 15px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.08)'};
`;

export const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

export const AuditTimeline = styled.div`
  position: relative;
`;

export const TimelineTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimelineList = styled.div`
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primary}50 100%
    );
    border-radius: 1px;
  }
`;

export const TimelineItem = styled.div<{ $isLast?: boolean }>`
  position: relative;
  margin-bottom: 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 15px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)'};
  }

  &::before {
    content: '';
    position: absolute;
    left: -30px;
    top: 24px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    border: 3px solid ${props => props.theme.colors.background};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
  }

  ${props =>
    props.$isLast &&
    `
    margin-bottom: 0;
  `}
`;

export const AuditHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const AuditActionBadge = styled.span<{ $action: AuditAction }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => getAuditActionColor(props.$action)}20;
  color: ${props => getAuditActionColor(props.$action)};
  border: 1px solid ${props => getAuditActionColor(props.$action)}30;
`;

export const AuditDate = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const AuditUser = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px ${props => props.theme.colors.primary}30;
`;

export const UserName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

export const AuditDetails = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

export const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.error};
`;

export const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.error};
  margin: 0 0 12px 0;
`;

export const ErrorDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`;
