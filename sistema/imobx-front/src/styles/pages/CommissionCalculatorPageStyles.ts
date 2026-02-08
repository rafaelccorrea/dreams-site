import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 24px;
    gap: 16px;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const SettingsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.secondaryHover || props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
    font-size: 0.875rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

export const StatIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.primary}15;
  border-radius: 12px;
`;

export const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const CalculatorCard = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 20px;
  }
`;

export const CalculatorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 16px;
    gap: 8px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
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

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.875rem;
    border-radius: 8px;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  font-family: inherit;
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  background: ${props =>
    props.$variant === 'secondary'
      ? props.theme.colors.backgroundSecondary
      : `linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%)`};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.text : 'white'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px
      ${props =>
        props.$variant === 'secondary'
          ? 'rgba(0, 0, 0, 0.1)'
          : props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }
`;

export const ResultCard = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-top: 16px;
  }
`;

export const ResultTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
`;

export const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const ResultItem = styled.div<{ $highlight?: boolean }>`
  background: ${props =>
    props.$highlight
      ? `linear-gradient(135deg, ${props.theme.colors.primary}15 0%, ${props.theme.colors.primary}25 100%)`
      : props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$highlight
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
`;

export const ResultLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  font-weight: 500;
`;

export const ResultValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

// Estilos do Holerite
export const PayslipSection = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

export const PayslipSectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

export const PayslipItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed ${props => props.theme.colors.border}20;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 10px 0;
  }
`;

export const PayslipLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    width: 100%;
  }
`;

export const PayslipValue = styled.div<{
  $positive?: boolean;
  $negative?: boolean;
}>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props =>
    props.$positive
      ? props.theme.colors.success
      : props.$negative
        ? props.theme.colors.danger
        : props.theme.colors.text};

  @media (max-width: 480px) {
    font-size: 0.875rem;
    width: 100%;
    text-align: right;
  }
`;

export const PayslipSubtotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 0 0;
  margin-top: 8px;
  border-top: 2px solid ${props => props.theme.colors.border};
  font-weight: 600;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 10px 0 0 0;
  }
`;

export const PayslipFinal = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15 0%,
    ${props => props.theme.colors.primary}25 100%
  );
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}20;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    margin: 16px 0;
  }
`;

export const PayslipFinalLabel = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    width: 100%;
  }
`;

export const PayslipFinalValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${props => props.theme.colors.success};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    width: 100%;
    text-align: right;
  }
`;

export const CommissionsSection = styled.div`
  margin-top: 32px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 10px 14px;
  }
`;

export const FilterBadge = styled.span`
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 4px;
`;

export const FiltersContainer = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  animation: slideDown 0.3s ease;

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

export const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
    transform: translateY(-1px);
  }
`;

export const CommissionsList = styled.div`
  display: grid;
  gap: 16px;
`;

export const CommissionItem = styled.div`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const CommissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }
`;

export const CommissionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const CommissionStatus = styled.span<{ $status: string }>`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'PAID':
        return '#10B98115';
      case 'APPROVED':
        return '#3B82F615';
      case 'PENDING':
        return '#F59E0B15';
      case 'REJECTED':
        return '#EF444415';
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'PAID':
        return '#10B981';
      case 'APPROVED':
        return '#3B82F6';
      case 'PENDING':
        return '#F59E0B';
      case 'REJECTED':
        return '#EF4444';
      default:
        return props.theme.colors.text;
    }
  }};

  @media (max-width: 480px) {
    padding: 4px 12px;
    font-size: 0.75rem;
    border-radius: 16px;
  }
`;

export const CommissionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const CommissionDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.textSecondary};
  }

  strong {
    font-size: 1rem;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

export const CommissionActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 500;

  ${props =>
    props.$variant === 'delete'
      ? `
    background: #ef444415;
    color: #ef4444;

    &:hover:not(:disabled) {
      background: #ef444425;
      transform: translateY(-2px);
    }
  `
      : `
    background: ${props.theme.colors.primary}15;
    color: ${props.theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary}25;
      transform: translateY(-2px);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 32px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;

  svg {
    opacity: 0.3;
    margin-bottom: 16px;
  }

  p {
    font-size: 1.125rem;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 24px;
    width: 95%;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    width: 100%;
    border-radius: 12px;
    max-height: 95vh;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

export const ModalHeader = styled.div`
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0;
  }
`;

export const ModalBody = styled.div`
  margin-bottom: 24px;

  p {
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    margin: 0 0 12px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #3b82f615 0%, #3b82f625 100%);
  border: 1px solid #3b82f630;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
  margin-top: 8px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8125rem;
    flex-wrap: wrap;
    gap: 6px;
  }
`;
