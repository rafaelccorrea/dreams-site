import styled, { keyframes } from 'styled-components';

// Animações
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Container principal
export const ProjectSelectionContainer = styled.div`
  padding: 32px;
  width: 100%;
  min-height: calc(100vh - 120px);
  background: ${props => props.theme.colors.background};
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// Header moderno
export const ProjectSelectionHeader = styled.div`
  text-align: left;
  margin-bottom: 48px;
  animation: ${slideIn} 0.8s ease-out;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

export const ProjectSelectionTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  text-align: left;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const ProjectSelectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;
  text-align: left;
`;

// Seção de equipes
export const TeamsSection = styled.div`
  margin-bottom: 48px;
  animation: ${slideIn} 1s ease-out;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const TeamCard = styled.div<{ $isSelected: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 20px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props =>
      props.$isSelected
        ? `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)`
        : 'transparent'};
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.12)'};
    border-color: ${props => props.theme.colors.primary}60;
  }

  ${props =>
    props.$isSelected &&
    `
    box-shadow: 0 8px 32px ${props.theme.colors.primary}30;
  `}

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const TeamIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px ${props => props.theme.colors.primary}30;
`;

export const TeamInfo = styled.div`
  flex: 1;
`;

export const TeamName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 6px 0;
`;

export const TeamDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

export const TeamStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const TeamStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Seção de projetos
export const ProjectsSection = styled.div`
  margin-bottom: 48px;
  animation: ${slideIn} 1.2s ease-out;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const ProjectCard = styled.div<{ $isSelected: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props =>
      props.$isSelected
        ? `linear-gradient(90deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)`
        : 'transparent'};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.12)'};
    border-color: ${props => props.theme.colors.primary}60;
  }

  ${props =>
    props.$isSelected &&
    `
    box-shadow: 0 8px 32px ${props.theme.colors.primary}30;
  `}

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const ProjectHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

export const ProjectIcon = styled.div<{ $status: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px
    ${props => {
      switch (props.$status) {
        case 'active':
          return props.theme.colors.primary + '30';
        case 'completed':
          return '#10B98130';
        case 'archived':
          return '#6B728030';
        case 'cancelled':
          return '#EF444430';
        default:
          return '#6B728030';
      }
    }};
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.primary + '20';
      case 'completed':
        return '#10B98120';
      case 'archived':
        return '#6B728020';
      case 'cancelled':
        return '#EF444420';
      default:
        return '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.primary;
      case 'completed':
        return '#10B981';
      case 'archived':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }};
`;

export const ProjectInfo = styled.div`
  flex: 1;
`;

export const ProjectName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

export const ProjectDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const ProjectDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ProjectStatus = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.$status) {
      case 'active':
        return `
          background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
          color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
        `;
      case 'completed':
        return `
          background: ${props.theme.mode === 'dark' ? '#1e3a8a' : '#dbeafe'};
          color: ${props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af'};
        `;
      case 'archived':
        return `
          background: ${props.theme.mode === 'dark' ? '#374151' : '#f3f4f6'};
          color: ${props.theme.mode === 'dark' ? '#d1d5db' : '#6b7280'};
        `;
      case 'cancelled':
        return `
          background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
          color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}
`;

// Seção de ações
export const ActionsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 48px;
  animation: ${slideIn} 1.4s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'success';
}>`
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 200px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 16px ${props.theme.colors.primary}30;

        &:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px ${props.theme.colors.primary}40;
        }
      `;
    } else if (props.$variant === 'success') {
      return `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        box-shadow: 0 4px 16px #10b98130;

        &:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px #10b98140;
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-3px);
          box-shadow: 0 8px 24px ${props.theme.colors.primary}20;
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    min-width: 100%;
    padding: 14px 28px;
    font-size: 1rem;
  }
`;

// Estados vazios e de erro
export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 2px dashed ${props => props.theme.colors.border};
  margin: 40px 0;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 60px 16px;
    margin: 32px 0;
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const EmptyStateButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.theme.colors.primary}40;
  }
`;

// Loading states
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

export const LoadingText = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
`;

// Error states
export const ErrorContainer = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  margin: 40px 0;
`;

export const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.error};
  margin: 0 0 12px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const ErrorButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

// Legacy components for compatibility
export const Container = ProjectSelectionContainer;
export const Header = ProjectSelectionHeader;
export const Title = ProjectSelectionTitle;
export const Subtitle = ProjectSelectionSubtitle;
