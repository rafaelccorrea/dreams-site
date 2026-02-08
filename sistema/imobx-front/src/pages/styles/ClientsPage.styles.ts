import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    margin-bottom: 24px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 20px;
    gap: 12px;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 28px;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const HeaderSubtitle = styled.p`
  font-size: 16px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  margin: 8px 0 0 0;

  @media (max-width: 1024px) {
    font-size: 15px;
    margin: 6px 0 0 0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 4px 0 0 0;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 8px;

    /* Forçar todos os botões dentro a serem full width */
    button {
      width: 100% !important;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--theme-primary, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    gap: 16px;
    margin-bottom: 24px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
`;

export const StatCard = styled.div`
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});

  @media (max-width: 1024px) {
    padding: 18px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 8px;
  }
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin-bottom: 8px;

  @media (max-width: 1024px) {
    font-size: 24px;
    margin-bottom: 6px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 4px;
  }
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );

  @media (max-width: 1024px) {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 14px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 12px;
  font-size: 14px;
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  color: var(--theme-text, ${props => props.theme.colors.text});

  @media (max-width: 1024px) {
    min-width: 250px;
    padding: 11px 14px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
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

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 14px;
    width: 100%;
  }

  &:focus {
    outline: none;
    border-color: var(--theme-primary, ${props => props.theme.colors.primary});
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--theme-primary, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1024px) {
    padding: 11px 18px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

export const FilterBadge = styled.span`
  background: var(
    --theme-error,
    ${props => props.theme.colors.danger || '#ef4444'}
  );
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 11px;
  }
`;

export const LoadMoreButton = styled.button<{ $loading?: boolean }>`
  padding: 10px 16px;
  background: var(--theme-primary, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$loading ? 0.7 : 1)};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    width: 100%;
    max-width: 200px;
  }
`;

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

export const CounterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: ${props => props.theme.colors.danger};
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border-radius: 16px;
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});

  @media (max-width: 1024px) {
    padding: 50px 18px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 40px 16px;
    border-radius: 12px;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;

  @media (max-width: 1024px) {
    font-size: 56px;
    margin-bottom: 14px;
  }

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 12px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: var(--theme-text, ${props => props.theme.colors.text});
  margin: 0 0 8px 0;

  @media (max-width: 1024px) {
    font-size: 22px;
    margin: 0 0 6px 0;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 0 4px 0;
  }
`;

export const EmptyDescription = styled.p`
  font-size: 16px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
