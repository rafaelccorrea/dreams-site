import styled from 'styled-components';

export const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const FiltersTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FiltersSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 4px 0 0 0;
`;

export const FiltersActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  background: ${props => {
    switch (props.$variant) {
      case 'danger':
        return 'transparent';
      default:
        return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'danger':
        return props.theme.colors.error;
      default:
        return props.theme.colors.textSecondary;
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.$variant) {
        case 'danger':
          return props.theme.colors.error;
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  height: 36px;

  &:hover {
    background: ${props => {
      switch (props.$variant) {
        case 'danger':
          return props.theme.colors.error + '10';
        default:
          return props.theme.colors.hover;
      }
    }};
    color: ${props => {
      switch (props.$variant) {
        case 'danger':
          return props.theme.colors.error;
        default:
          return props.theme.colors.text;
      }
    }};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

export const FiltersContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FilterSectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FilterSectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const FilterSectionDescription = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px 16px 12px 40px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  width: 100%;
  height: 44px;
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

export const FiltersGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: ${props => {
    if (props.$columns) {
      return `repeat(${props.$columns}, 1fr)`;
    }
    return 'repeat(auto-fit, minmax(200px, 1fr))';
  }};
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const FilterSelect = styled.select`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px 40px 12px 16px;
  font-size: 0.875rem;
  font-family: 'Poppins', sans-serif;
  color: ${props => props.theme.colors.text};
  height: 44px;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    padding: 10px;
  }

  &::-ms-expand {
    display: none;
  }
`;

export const FilterInput = styled.input`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  height: 44px;
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

export const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
