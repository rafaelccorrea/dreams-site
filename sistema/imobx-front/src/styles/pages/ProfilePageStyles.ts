import styled from 'styled-components';
import { MdPerson, MdSearch } from 'react-icons/md';

export const ProfilePageContainer = styled.div`
  padding: 32px;
  min-height: 100vh;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 24px;
  }
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
  gap: 12px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

export const ProfileTitle = styled.h1`
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

export const ProfileIcon = styled(MdPerson)`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
`;

export const ProfileCount = styled.div`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

export const ProfileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ProfileUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProfileUserName = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const ProfileUserRole = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const EditProfileButton = styled.button`
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

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const ProfileControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 12px;
    gap: 12px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 240px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    max-width: 100%;
    min-width: 100%;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

export const SearchInputContainer = styled.div`
  position: relative;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
  pointer-events: none;
  z-index: 1;
`;

export const FilterToggle = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 16px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const ActiveFiltersIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid ${props => props.theme.colors.cardBackground};
`;

// Filtros
export const FilterPanel = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  overflow: hidden;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

export const FilterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const FilterClose = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

export const FilterContent = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const FilterActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  grid-column: 1 / -1;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const FilterButton = styled.button<{ primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  ${props =>
    props.primary
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border-color: ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.background};
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

export const ProfileStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
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
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primaryLight}
    );
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.color || props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${props => props.color || props.theme.colors.primary};
  font-size: 1.5rem;
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ModernProfileCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
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
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primaryLight}
    );
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const ProfileCardGradient = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.backgroundTertiary} 100%
  );
  padding: 24px;
  border-radius: 20px 20px 0 0;
  position: relative;
`;

export const ProfileCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProfileAvatar = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${props => props.theme.colors.primary};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 17px;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  font-size: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 700;
`;

export const ProfileDetails = styled.div`
  flex: 1;
`;

export const ProfileName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

export const ProfileRole = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
`;

export const ProfileActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  width: 36px;
  height: 36px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  ${props =>
    props.$variant === 'danger' &&
    `
    &:hover {
      border-color: ${props.theme.colors.error};
      color: ${props.theme.colors.error};
      background: ${props.theme.colors.error}10;
    }
  `}
`;

export const ProfileStats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;
`;

export const ProfileStat = styled.div`
  text-align: center;
  flex: 1;
`;

export const ProfileStatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const ProfileStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const InfoCard = styled.div`
  /* Tornar os dados "soltos": remover visual de card */
  background: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  margin-bottom: 16px;
  padding: 0;
`;

export const CardHeader = styled.div`
  /* Header sem caixa */
  padding: 0 0 12px 0;
  border-bottom: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardAction = styled.button`
  background: ${props => props.theme.colors.primary}20;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}30;
    transform: translateY(-1px);
  }
`;

export const InfoList = styled.ul`
  padding: 0;
  margin-top: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InfoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 12px 8px;
  border-bottom: none;
  min-width: 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 10px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.1rem;
`;

export const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;

  & > div,
  & > p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const InfoValue = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const InfoAction = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
  }
`;

export const CompanyCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CompanyHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CompanyName = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompanyActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const CompanyActionButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: ${props => props.theme.colors.textSecondary};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }

  @media (max-width: 480px) {
    padding: 6px;
    border-radius: 6px;
  }
`;

export const CompanyInfo = styled.div`
  padding: 16px 20px;
`;

export const CompanyDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.textLight};
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
`;

export const EmptyStateDescription = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${props => props.theme.colors.textSecondary};
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

// Responsive design
export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const ResponsiveStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
`;
