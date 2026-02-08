import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin: 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const HeaderSubtitle = styled.p`
  font-size: 16px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  margin: 8px 0 0 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin-bottom: 8px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 12px;
  font-size: 14px;
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  color: var(--theme-text, ${props => props.theme.colors.text});
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  background: ${props =>
    props.$active
      ? `var(--theme-primary, ${props.theme.colors.primary})`
      : `var(--theme-surface, ${props.theme.colors.surface})`};
  color: ${props =>
    props.$active ? 'white' : `var(--theme-text, ${props.theme.colors.text})`};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
    ${props =>
      !props.$active &&
      `
      background: var(--theme-background, ${props.theme.colors.background});
    `}
  }
`;

export const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border-radius: 16px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin: 0 0 8px 0;
`;

export const EmptyDescription = styled.p`
  font-size: 16px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  margin: 0 0 24px 0;
`;

export const EmptyButton = styled.button`
  padding: 12px 24px;
  background: var(--theme-primary, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--theme-border, ${props => props.theme.colors.border});
  border-top-color: var(
    --theme-primary,
    ${props => props.theme.colors.primary}
  );
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const RefreshButton = styled.button`
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  color: var(--theme-text, ${props => props.theme.colors.text});
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(
      --theme-background,
      ${props => props.theme.colors.background}
    );
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
  }
`;

export const NewGoalButton = styled.button`
  background: var(--theme-primary, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(
      --theme-primary-hover,
      ${props => props.theme.colors.primaryHover}
    );
    transform: translateY(-1px);
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatsStatCard = styled.div`
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const StatsStatValue = styled.div<{ $color?: string }>`
  font-size: 32px;
  font-weight: 700;
  color: ${props =>
    props.$color || `var(--theme-text, ${props.theme.colors.text})`};
  line-height: 1;
`;

export const StatsStatLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 8px;
  font-size: 14px;
  background: var(
    --theme-background,
    ${props => props.theme.colors.background}
  );
  color: var(--theme-text, ${props => props.theme.colors.text});
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
  }
`;

export const FilterToggle = styled.button<{ $active: boolean }>`
  padding: 12px 16px;
  border: 1px solid
    ${props =>
      props.$active
        ? `var(--theme-primary, ${props.theme.colors.primary})`
        : `var(--theme-border, ${props.theme.colors.border})`};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props =>
    props.$active
      ? `var(--theme-primary, ${props.theme.colors.primary})`
      : `var(--theme-background, ${props.theme.colors.background})`};
  color: ${props =>
    props.$active ? 'white' : `var(--theme-text, ${props.theme.colors.text})`};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
    background: ${props =>
      props.$active
        ? `var(--theme-primary-hover, ${props.theme.colors.primaryHover})`
        : `var(--theme-surface, ${props.theme.colors.surface})`};
  }
`;
