import styled from 'styled-components';

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    gap: 6px;

    button {
      flex: 1;
      min-width: 0;
    }
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 8px 12px;
    height: auto;
    min-height: 38px;
    font-size: 0.85rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    min-height: 36px;
    font-size: 0.8rem;
    gap: 4px;

    svg {
      font-size: 18px;
    }
  }

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    gap: 4px;
    margin-bottom: 10px;
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.theme.colors.cardBackground};
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.large};
  z-index: 1000;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    top: 70px;
    right: 12px;
    padding: 10px 16px;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    top: 65px;
    right: 8px;
    left: 8px;
    padding: 10px 14px;
    justify-content: center;
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text};

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
`;

export const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid
    ${p => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${p =>
    p.$active ? p.theme.colors.primary : p.theme.colors.backgroundSecondary};
  color: ${p => (p.$active ? '#fff' : p.theme.colors.text)};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    gap: 6px;
    flex: 1;
    min-width: 0;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 0.8rem;
    gap: 4px;

    svg {
      font-size: 16px;
    }
  }
`;

export const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.text};
`;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.background};
  color: ${p => p.theme.colors.text};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

export const ImageOnlyCard = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.small};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.large};
  }

  @media (max-width: 768px) {
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    aspect-ratio: 1/1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const Card = styled.div`
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${p => p.theme.colors.cardBackground};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

export const Cover = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  background: ${p => p.theme.colors.backgroundSecondary};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .count {
    position: absolute;
    right: 8px;
    bottom: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(4px);
  }

  @media (max-width: 480px) {
    .count {
      right: 6px;
      bottom: 6px;
      padding: 3px 6px;
      font-size: 11px;
      border-radius: 6px;
    }
  }
`;

export const CardBody = styled.div`
  padding: 12px;
  display: grid;
  gap: 6px;

  @media (max-width: 480px) {
    padding: 10px;
    gap: 4px;
    font-size: 0.9rem;
  }
`;

export const PricesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;

  @media (max-width: 480px) {
    gap: 4px;
    margin-top: 2px;
  }
`;

export const PriceTag = styled.div<{ $type: 'sale' | 'rent' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  background: ${props =>
    props.$type === 'sale'
      ? `${props.theme.colors.success}15`
      : `${props.theme.colors.primary}15`};
  border: 1px solid
    ${props =>
      props.$type === 'sale'
        ? `${props.theme.colors.success}40`
        : `${props.theme.colors.primary}40`};
`;

export const PriceLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 50px;
`;

export const PriceValue = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const Pager = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  button {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid ${p => p.theme.colors.border};
    background: ${p => p.theme.colors.backgroundSecondary};
    color: ${p => p.theme.colors.text};
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.85rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 0.8rem;
    gap: 4px;

    svg {
      font-size: 18px;
    }
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
`;

export const FilterBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
`;

// Filter drawer components
export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
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
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const FilterStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
    background: ${props => props.theme.colors.error}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

// Stats components
export const StatsContainer = styled.div`
  display: grid;
  gap: 20px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 8px;
    gap: 6px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.primary};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const DetailedStatsSection = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const DetailedStatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 8px;
  }
`;

export const DetailedStatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const DetailedStatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DetailedStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const DetailedStatItemLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  text-transform: capitalize;
`;

export const DetailedStatItemValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
`;

// Empty state components
export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 60px 20px;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary}05 0%,
      ${props => props.theme.colors.primaryDark}05 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

export const EmptyStateCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 32px;
  padding: 64px 40px;
  text-align: center;
  max-width: 560px;
  width: 100%;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px ${props => props.theme.colors.primary}10;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.12),
      0 0 0 1px ${props => props.theme.colors.primary}15;
  }

  @media (max-width: 768px) {
    padding: 48px 24px;
    border-radius: 24px;
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
  font-size: 3.5rem;
  position: relative;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 ${props => props.theme.colors.primary}30;
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 20px ${props => props.theme.colors.primary}00;
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary}20,
      ${props => props.theme.colors.primaryDark}20
    );
    z-index: -1;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 3rem;
    margin-bottom: 24px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const EmptyStateDescription = styled.p`
  font-size: 1.0625rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.7;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;
