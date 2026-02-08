import styled, { keyframes } from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  width: 100%;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BackButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateX(-2px);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const TitleIcon = styled.div`
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const DocumentId = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const PageBody = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const SectionIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const LinkCard = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border}20;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

export const LinkCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.primary};
`;

export const LinkCardTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.background}50;
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary}30;
  transition: all 0.2s ease;

  &:hover {
    border-left-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }
`;

export const InfoLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  word-break: break-word;
`;

export const IconWrapper = styled.span`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
`;

export const TypeBadge = styled.span`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: inline-block;
`;

export const StatusBadge = styled.div<{ $color: any }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ $color }) => $color?.background || '#f3f4f6'};
  color: ${({ $color }) => $color?.color || '#374151'};
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const TagBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

export const ExpiryInfo = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-style: italic;
`;

export const EncryptionBadge = styled.div<{ $encrypted: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ $encrypted, theme }) =>
    $encrypted ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ $encrypted, theme }) =>
    $encrypted ? theme.colors.success : theme.colors.warning};
`;

export const ApprovalSection = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.colors.border};
`;

export const ApprovalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 60px;
  min-height: 400px;
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${props => props.theme.colors.border};
  border-top: 5px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
`;
