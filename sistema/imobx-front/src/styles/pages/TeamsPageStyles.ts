import styled from 'styled-components';
import { MdSearch, MdGroup } from 'react-icons/md';

export const TeamsPageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

export const TeamsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
    padding-bottom: 16px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 16px;
    padding-bottom: 12px;
    gap: 12px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 14px;
  }

  @media (max-width: 768px) {
    width: 100%;
    gap: 12px;
  }
`;

export const TeamsTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const TeamsIcon = styled(MdGroup)`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
`;

export const TeamsCount = styled.div`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.primary}30;

  @media (max-width: 1024px) {
    padding: 7px 14px;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

export const CreateTeamButton = styled.button`
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

export const TeamsControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 16px;
    margin-bottom: 20px;
    padding: 14px;
    border-radius: 16px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    border-radius: 12px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;

  @media (max-width: 1024px) {
    max-width: 400px;
  }

  @media (max-width: 768px) {
    max-width: none;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    padding: 14px 18px 14px 48px;
    font-size: 0.95rem;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px 12px 44px;
    font-size: 0.9rem;
    border-radius: 12px;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}20,
      0 4px 20px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
    font-weight: 400;
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
  font-size: 1.25rem;
`;

export const FilterToggle = styled.button<{ $isActive: boolean }>`
  background: ${props =>
    props.$isActive
      ? `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)`
      : props.theme.colors.background};
  color: ${props => (props.$isActive ? 'white' : props.theme.colors.text)};
  border: 2px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    padding: 14px 18px;
    font-size: 0.95rem;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 0.9rem;
    border-radius: 12px;
  }

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Estatísticas gerais
export const TeamsStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 24px 0 32px 0;

  @media (max-width: 1024px) {
    gap: 16px;
    margin: 20px 0 24px 0;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 16px 0 20px 0;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    padding: 20px;
    gap: 14px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
    border-radius: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const StatIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15,
    ${props => props.theme.colors.primary}25
  );
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.primary}20;

  @media (max-width: 1024px) {
    font-size: 1.75rem;
    width: 56px;
    height: 56px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 24px;
  margin-top: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    margin-top: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 12px;
  }
`;

export const TeamCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;

  // Efeito de brilho sutil no hover
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
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: ${props => props.theme.colors.primary}30;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
`;

// Card moderno das equipes
export const ModernTeamCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: visible;
  min-width: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
`;

export const TeamCardGradient = styled.div<{ color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    ${props => props.color},
    ${props => props.color}80
  );
`;

// Componentes de estatísticas do card
export const TeamProgress = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const ProgressFill = styled.div<{ width: string; color: string }>`
  height: 100%;
  width: ${props => props.width};
  background: linear-gradient(
    90deg,
    ${props => props.color},
    ${props => props.color}80
  );
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const TeamCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 24px 24px 0 24px;
  min-width: 0;
  overflow: visible;
`;

export const TeamInfo = styled.div`
  flex: 1;
`;

export const TeamColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid ${props => props.theme.colors.cardBackground};
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.2s ease;

  // Efeito de brilho sutil
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${props => props.color};
    opacity: 0.1;
    z-index: -1;
    transition: opacity 0.2s ease;
  }

  &:hover {
    transform: scale(1.1);

    &::after {
      opacity: 0.2;
    }
  }
`;

export const TeamName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 6px 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

export const TeamDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px 24px;
  background: ${props => props.theme.colors.background};
  min-width: 0;
  overflow: visible;
`;

export const TeamStat = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const TeamActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;
  transform: translateY(-4px);

  ${TeamCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ActionButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1rem;
  width: 36px;
  height: 36px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}15;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.danger {
    &:hover {
      border-color: ${props => props.theme.colors.error};
      color: ${props => props.theme.colors.error};
      background: ${props => props.theme.colors.error}15;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  margin: 0 0 24px 0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
`;

export const RetryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

// Modal de criação de equipe
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 32px;
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 1024px) {
    padding: 28px;
    width: 98%;
    max-height: 92vh;
  }

  @media (max-width: 768px) {
    padding: 20px;
    width: 100%;
    max-height: 95vh;
    border-radius: 16px 16px 0 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const ColorPicker = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ColorOption = styled.button<{
  color: string;
  $isSelected: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid
    ${props =>
      props.$isSelected ? props.theme.colors.text : props.theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  ${props =>
    props.$isSelected &&
    `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  `}
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }

  &.secondary {
    background: transparent;
    color: ${props => props.theme.colors.textSecondary};
    border: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => props.theme.colors.border};
      color: ${props => props.theme.colors.text};
    }
  }
`;

// Componentes para seleção de usuários
export const UserSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const UserSearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const SelectedUsers = styled.div`
  min-height: 60px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

export const NoUsersMessage = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

export const UsersList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  margin-top: 8px;
`;

export const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &.selected {
    background: ${props => props.theme.colors.primary}10;
    border-left: 3px solid ${props => props.theme.colors.primary};
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

export const UserRole = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const AddUserButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

export const RemoveUserButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error};
    opacity: 0.8;
  }
`;

export const SelectedUser = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 6px;
  padding: 8px 12px;
  margin: 4px;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

// Componentes para Toast
export const ToastContainer = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => (props.$type === 'success' ? '#10B981' : '#EF4444')};
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
  max-width: 400px;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToastMessage = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`;

// Animação de loading
export const LoadingSpinner = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Styled Components para FilterDrawer
export const FiltersContainer = styled.div`
  padding: 0;
`;

export const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const FilterSearchContainer = styled.div`
  position: relative;
`;

export const FilterSearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

export const FilterSearchInput = styled(FilterInput)`
  padding-left: 40px;
`;

export const FilterStats = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Bloco "Ver equipes do usuário"
export const UserTeamsLookup = styled.div`
  margin-bottom: 24px;
  padding: 16px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
`;

export const UserTeamsLookupRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const UserTeamsLookupLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
`;

export const UserTeamsSelect = styled.select`
  min-width: 280px;
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const UserTeamsSelectWrap = styled.div`
  position: relative;
  min-width: 280px;
`;

export const UserTeamsSearchInput = styled.input`
  width: 100%;
  min-width: 280px;
  padding: 10px 14px 10px 36px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

export const UserTeamsSearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
  font-size: 1rem;
`;

export const UserTeamsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 240px;
  overflow-y: auto;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
`;

export const UserTeamsOption = styled.button`
  width: 100%;
  display: block;
  padding: 10px 14px;
  border: none;
  background: none;
  text-align: left;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${props => props.theme.colors.primary}15;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export const UserTeamsOptionEmpty = styled.div`
  padding: 12px 14px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const UserTeamsResult = styled.div`
  margin-top: 12px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 10px;
  border-left: 4px solid ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

export const UserTeamsResultList = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
`;

export const UserTeamsResultItem = styled.li`
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;
