import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const PageContainer = styled.div`
  padding: 24px 24px 48px;
  width: 100%;
  max-width: 100%;
  margin: 0;
  overflow-x: hidden;
  box-sizing: border-box;
  min-height: 100%;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(180deg, rgba(28,28,28,0.97) 0%, rgba(18,18,18,1) 100%)'
      : 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)'};

  @media (min-width: 1920px) {
    padding: 32px 40px 64px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 20px 20px 40px;
  }

  @media (max-width: 767px) {
    padding: 16px 16px 32px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
  padding: 24px 28px;
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    (props.theme as any).shadows?.md || '0 4px 20px rgba(0,0,0,0.06)'};

  @media (min-width: 768px) and (max-width: 1023px) {
    margin-bottom: 28px;
    padding: 20px 24px;
  }

  @media (max-width: 767px) {
    margin-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    border-radius: 16px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  letter-spacing: -0.02em;
  line-height: 1.2;

  svg {
    color: ${props => props.theme.colors.primary};
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 10px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(166, 49, 38, 0.25);

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(166, 49, 38, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 0.8125rem;
    border-radius: 10px;
  }
`;

export const FilterBadge = styled.span`
  background: rgba(255, 255, 255, 0.35);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 6px;
  letter-spacing: 0.02em;
`;

export const Section = styled.section`
  margin-bottom: 40px;
  padding: 28px;
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    (props.theme as any).shadows?.sm || '0 1px 3px rgba(0,0,0,0.05)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primary}80);
    border-radius: 4px 0 0 4px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    margin-bottom: 32px;
    padding: 24px;
    border-radius: 16px;
  }

  @media (max-width: 767px) {
    margin-bottom: 24px;
    padding: 20px;
    border-radius: 16px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;

  svg {
    color: ${props => props.theme.colors.primary};
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 18px;
    gap: 10px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 28px;

  @media (min-width: 1024px) {
    gap: 22px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 22px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 22px;
  transition: all 0.25s ease;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);
    border-color: ${props => props.theme.colors.borderLight};
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 14px;
  }
`;

export const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

export const StatIcon = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${props => props.color}18;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    border-radius: 12px;
  }
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 100%;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.35rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  line-height: 1.4;
`;

export const StatTrend = styled.div<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.$positive ? '#10B981' : '#EF4444')};
`;

export const TableCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    margin-bottom: 22px;
    border-radius: 14px;
  }
`;

export const TableTitle = styled.div`
  padding: 20px 24px;
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;

  svg {
    color: ${props => props.theme.colors.primary};
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 1rem;
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;

  @media (max-width: 1023px) {
    min-width: 700px;
  }

  @media (max-width: 767px) {
    min-width: 600px;
  }
`;

export const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
`;

export const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.6875rem;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.8125rem;
  }
`;

export const Badge = styled.span<{
  variant?: 'success' | 'danger' | 'warning' | 'info';
}>`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return '#10B981';
      case 'danger':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return props.theme.colors.background;
    }
  }};
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const BrokersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 767px) {
    gap: 10px;
    margin-bottom: 20px;
  }
`;

export const BrokerCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 22px;
  transition: all 0.25s ease;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 18px;
    gap: 14px;
    border-radius: 14px;
  }
`;

export const BrokerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    flex-direction: row;
    align-items: flex-start;
  }
`;

export const BrokerAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

export const BrokerInfo = styled.div`
  flex: 1;
  min-width: 0;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BrokerName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  word-break: break-word;
  line-height: 1.4;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const BrokerBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;

  @media (max-width: 768px) {
    gap: 6px;
    margin-top: 6px;
    width: 100%;
  }
`;

export const BrokerStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const BrokerStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
`;

export const BrokerStatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
    margin-bottom: 2px;
  }

  @media (max-width: 480px) {
    font-size: 0.625rem;
  }
`;

export const BrokerStatValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  word-break: break-word;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const ChurnRiskCard = styled.div<{
  riskLevel: 'high' | 'medium' | 'low';
}>`
  background: ${props => {
    const isDark = props.theme.mode === 'dark';
    switch (props.riskLevel) {
      case 'high':
        return isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.06)';
      case 'medium':
        return isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.06)';
      case 'low':
        return isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.06)';
      default:
        return props.theme.colors.surface;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.riskLevel) {
        case 'high':
          return 'rgba(239, 68, 68, 0.4)';
        case 'medium':
          return 'rgba(245, 158, 11, 0.4)';
        case 'low':
          return 'rgba(16, 185, 129, 0.4)';
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 18px;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)'};
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

export const ChurnRiskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  }
`;

export const ChurnRiskInfo = styled.div`
  flex: 1;
`;

export const ChurnRiskName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ChurnRiskScore = styled.div<{ $riskColor?: string }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.$riskColor || props.theme.colors.text};
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const ChurnRiskLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

export const ChurnRiskValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const ChurnRiskDays = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 12px;
`;

export const ChurnRiskSectionTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
`;

export const ChurnRiskFactors = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    margin-top: 12px;
    padding-top: 12px;
  }
`;

export const ChurnRiskFactorList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

export const ChurnRiskFactorItem = styled.li`
  padding: 8px 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &::before {
    content: '⚠️';
    font-size: 1rem;
  }
`;

export const ChurnActionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ChurnActionItem = styled.li`
  padding: 8px 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &::before {
    content: '✓';
    color: ${props => (props.theme.mode === 'dark' ? '#34D399' : '#10B981')};
    font-weight: 700;
    font-size: 1rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 56px 32px;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  border: 1px dashed ${props => props.theme.colors.border};
`;

export const EmptyStateIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 20px;
  opacity: 0.85;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 10px 0;
  letter-spacing: -0.01em;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

/** Skeleton de seção para carregamento progressivo */
export const SectionSkeleton = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 0;
`;

export const SectionSkeletonTitle = styled.div`
  height: 24px;
  width: 220px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const SectionSkeletonLine = styled.div<{ width?: string }>`
  height: 16px;
  width: ${p => p.width || '100%'};
  margin-bottom: 12px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const SectionSkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const SectionSkeletonCard = styled.div`
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

export const SectionSkeletonLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.backgroundSecondary} 25%,
      ${props => props.theme.colors.hover} 50%,
      ${props => props.theme.colors.backgroundSecondary} 75%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }
`;

export const ErrorContainer = styled.div`
  background: ${props => props.theme.colors?.errorBackground || '#FEF2F2'};
  border: 1px solid ${props => props.theme.colors?.errorBorder || '#FECACA'};
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 22px;
    border-radius: 14px;
  }
`;

export const ErrorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors?.error || '#DC2626'};
  margin: 0 0 10px 0;
`;

export const ErrorMessage = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors?.textSecondary || '#991b1b'};
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

export const RetryButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

// Estilos para o Card da Meta da Empresa
export const CompanyGoalCard = styled.div`
  background: linear-gradient(
    145deg,
    ${props => props.theme.colors.surface} 0%,
    ${props => props.theme.colors.background} 100%
  );
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px ${props => props.theme.colors.border};
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  margin-bottom: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}99,
      ${props => props.theme.colors.primary}
    );
    border-radius: 5px 5px 0 0;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const GoalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const GoalIcon = styled.div`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

export const GoalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const GoalSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const GoalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

export const ProgressSection = styled.div`
  text-align: center;
`;

export const ProgressValue = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 12px;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => Math.min(props.$progress, 100)}%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 6px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (min-width: 1024px) {
    gap: 32px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
`;

export const GoalStatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const GoalStatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const GoalStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`;

export const StatusBadge = styled.div<{ $status: 'success' | 'warning' }>`
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: ${props =>
    props.$status === 'success'
      ? 'rgba(16, 185, 129, 0.1)'
      : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => (props.$status === 'success' ? '#10B981' : '#F59E0B')};
  border: 1px solid
    ${props =>
      props.$status === 'success'
        ? 'rgba(16, 185, 129, 0.3)'
        : 'rgba(245, 158, 11, 0.3)'};

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

export const DaysLeft = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// Estilos para Funil de Conversão
export const FunnelContainer = styled.div`
  margin-top: 24px;
`;

export const FunnelStages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 24px;
  }
`;

export const FunnelStage = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 18px;
    gap: 14px;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }
`;

export const FunnelStageName = styled.div`
  min-width: 180px;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

export const FunnelStageBar = styled.div<{
  $percentage: number;
  $color: string;
}>`
  flex: 1;
  height: 40px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$percentage}%;
    background: ${props => props.$color};
    border-radius: 8px;
    transition: width 0.5s ease;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 32px;
  }
`;

export const FunnelStageStats = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  min-width: 200px;
  justify-content: flex-end;

  @media (min-width: 768px) and (max-width: 1023px) {
    min-width: 180px;
    gap: 12px;
  }

  @media (max-width: 767px) {
    width: 100%;
    justify-content: space-between;
    min-width: auto;
  }
`;

export const FunnelStageCount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const FunnelStageRate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const FunnelSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

export const FunnelAnalysisCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

export const FunnelAnalysisTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

export const FunnelAnalysisText = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

export const FunnelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FunnelListItem = styled.li<{
  $type?: 'success' | 'warning' | 'error' | 'info';
}>`
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  background: ${props => {
    switch (props.$type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.1)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.1)';
      case 'error':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  border-left: 4px solid
    ${props => {
      switch (props.$type) {
        case 'success':
          return '#10B981';
        case 'warning':
          return '#F59E0B';
        case 'error':
          return '#EF4444';
        default:
          return props.theme.colors.border;
      }
    }};

  &::before {
    content: ${props => {
      switch (props.$type) {
        case 'success':
          return '"✓"';
        case 'warning':
          return '"⚠"';
        case 'error':
          return '"✗"';
        default:
          return '"•"';
      }
    }};
    margin-right: 8px;
    font-weight: 700;
  }
`;

export const FunnelInsightCard = styled.div<{
  $type: 'success' | 'info' | 'warning' | 'error';
}>`
  background: ${props => {
    switch (props.$type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.1)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.1)';
      case 'error':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$type) {
        case 'success':
          return 'rgba(16, 185, 129, 0.3)';
        case 'warning':
          return 'rgba(245, 158, 11, 0.3)';
        case 'error':
          return 'rgba(239, 68, 68, 0.3)';
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

export const FunnelInsightTitle = styled.h4`
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

export const FunnelInsightDescription = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 12px 0;
`;

export const FunnelInsightRecommendations = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FunnelInsightRecommendation = styled.li`
  padding: 8px 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &::before {
    content: '→';
    color: ${props => props.theme.colors.primary};
    font-weight: 700;
  }
`;

export const FunnelScore = styled.div<{ $score: number }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  background: ${props => {
    if (props.$score >= 80) return 'rgba(16, 185, 129, 0.1)';
    if (props.$score >= 60) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  }};
  color: ${props => {
    if (props.$score >= 80) return '#10B981';
    if (props.$score >= 60) return '#F59E0B';
    return '#EF4444';
  }};
  border: 1px solid
    ${props => {
      if (props.$score >= 80) return 'rgba(16, 185, 129, 0.3)';
      if (props.$score >= 60) return 'rgba(245, 158, 11, 0.3)';
      return 'rgba(239, 68, 68, 0.3)';
    }};
`;

export const LoadMoreButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

export const LoadMoreButtonContent = styled(FilterButton)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 0.9375rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.875rem;
    width: 100%;
    max-width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }
`;
