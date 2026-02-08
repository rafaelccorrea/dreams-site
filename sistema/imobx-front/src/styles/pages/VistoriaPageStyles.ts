import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageCount = styled.div`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

export const CreateButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}20;

  &:hover {
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 600px;
  min-width: 300px;

  @media (max-width: 1024px) {
    max-width: none;
    min-width: auto;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 18px 24px 18px 56px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  font-size: 1.125rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 16px 20px 16px 48px;
    font-size: 1rem;
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  z-index: 1;

  @media (max-width: 768px) {
    left: 16px;
    font-size: 1.25rem;
  }
`;

export const FilterToggle = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 18px 24px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}08;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}15;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 1rem;
    width: 100%;
    justify-content: center;
  }
`;

export const CounterBadge = styled.div`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 12px 20px;
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.primary}30;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const CounterValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
`;

export const CounterLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ViewLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ViewButton = styled.button<{ $active?: boolean }>`
  background: ${props =>
    props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props =>
    props.$active ? 'white' : props.theme.colors.textSecondary};
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.background};
    color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  }
`;

export const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const InspectionsGrid = styled.div<{ $viewMode: 'grid' | 'list' }>`
  display: ${props => (props.$viewMode === 'grid' ? 'grid' : 'flex')};
  flex-direction: ${props => (props.$viewMode === 'list' ? 'column' : 'row')};
  gap: 32px;
  margin-bottom: 40px;

  ${props =>
    props.$viewMode === 'grid' &&
    `
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    
    @media (max-width: 1400px) {
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    }
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  `}

  ${props =>
    props.$viewMode === 'list' &&
    `
    flex-direction: column;
    gap: 20px;
    
    @media (max-width: 768px) {
      gap: 16px;
    }
  `}
`;

export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 60px 20px;
  width: 100%;

  @media (max-width: 768px) {
    min-height: 400px;
    padding: 40px 16px;
  }
`;

export const EmptyStateCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 32px;
  padding: 64px 48px;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 16px 48px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.4)'
        : 'rgba(0, 0, 0, 0.1)'};
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
    padding: 48px 32px;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`;

export const EmptyStateIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15 0%,
    ${props => props.theme.colors.primaryDark}15 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  color: ${props => props.theme.colors.primary};
  font-size: 3rem;
  border: 3px solid ${props => props.theme.colors.primary}20;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
    opacity: 0.1;
    z-index: -1;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const EmptyStateDescription = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 40px 0;
  line-height: 1.6;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 32px;
  }
`;

export const EmptyStateButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 20px;
  padding: 18px 36px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px ${props => props.theme.colors.primary}25;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    box-shadow: 0 12px 35px ${props => props.theme.colors.primary}35;
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
  }
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
`;

export const PaginationButton = styled.button<{
  $active?: boolean;
  disabled?: boolean;
}>`
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.disabled
        ? props.theme.colors.background
        : props.theme.colors.cardBackground};
  color: ${props =>
    props.$active
      ? 'white'
      : props.disabled
        ? props.theme.colors.textSecondary
        : props.theme.colors.text};
  border: 1px solid
    ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.disabled
          ? props.theme.colors.border
          : props.theme.colors.border};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: ${props =>
      props.$active
        ? props.theme.colors.primary
        : props.theme.colors.primary}20;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => (props.$active ? 'white' : props.theme.colors.primary)};
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 40px 20px;
`;

export const ErrorCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 24px;
  padding: 48px 32px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`;

export const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 32px 0;
  line-height: 1.6;
`;

export const ErrorButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}20;

  &:hover {
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;
