import styled from 'styled-components';
import { MdSearch, MdCheck, MdClose, MdError } from 'react-icons/md';

// Container principal
export const CalendarPageContainer = styled.div`
  padding: 32px;
  width: 100%;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

// Header
export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;

  @media (max-width: 1024px) {
    margin-bottom: 24px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }
`;

export const CalendarTitle = styled.div`
  flex: 1;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 8px;
    line-height: 1.2;

    @media (max-width: 1024px) {
      font-size: 2.2rem;
    }

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.textSecondary};
    margin: 0 0 24px;
    line-height: 1.5;

    @media (max-width: 1024px) {
      font-size: 1rem;
      margin: 0 0 20px;
    }

    @media (max-width: 768px) {
      font-size: 0.9rem;
      margin: 0 0 16px;
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
    flex-direction: column;
    gap: 10px;
  }
`;

export const InvitesButton = styled.button`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px #f59e0b30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px #f59e0b40;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1024px) {
    padding: 12px 20px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

export const CreateAppointmentButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px ${props => props.theme.colors.primary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Controles
export const CalendarControls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
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

export const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

export const FilterToggle = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Container do calendário
export const CalendarContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;

  @media (max-width: 1024px) {
    padding: 20px;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 12px;
  }

  .fc {
    font-family: inherit;
  }

  .fc-header-toolbar {
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 8px;

    @media (max-width: 1024px) {
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      margin-bottom: 16px;
      flex-direction: column;
      align-items: stretch;
    }
  }

  .fc-toolbar-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};

    @media (max-width: 1024px) {
      font-size: 1.3rem;
    }

    @media (max-width: 768px) {
      font-size: 1.1rem;
      text-align: center;
      width: 100%;
      margin-bottom: 12px;
    }
  }

  .fc-button {
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    font-size: 0.9rem;

    @media (max-width: 1024px) {
      padding: 7px 14px;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      padding: 8px 12px;
      font-size: 0.8rem;
      flex: 1;
    }

    &:hover {
      background: ${props => props.theme.colors.primary}15;
      border-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.primary};
      transform: translateY(-1px);
    }

    &.fc-button-active {
      background: ${props => props.theme.colors.primary};
      border-color: ${props => props.theme.colors.primary};
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .fc-toolbar-chunk {
    @media (max-width: 768px) {
      display: flex;
      width: 100%;
      justify-content: center;
      gap: 4px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .fc-daygrid-event {
    border-radius: 4px;
    font-size: 11px;
    padding: 1px 4px;
    margin: 1px 0;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none !important;
    line-height: 1.2;

    @media (max-width: 1024px) {
      font-size: 10px;
      padding: 1px 3px;
    }

    @media (max-width: 768px) {
      font-size: 9px;
      padding: 1px 2px;
      margin: 0.5px 0;
    }

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .fc-daygrid-event-harness {
    margin: 1px 0;

    @media (max-width: 768px) {
      margin: 0.5px 0;
    }
  }

  .fc-daygrid-event .fc-event-title {
    font-size: 11px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 1024px) {
      font-size: 10px;
    }

    @media (max-width: 768px) {
      font-size: 9px;
    }
  }

  .fc-timegrid-event {
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }

  .fc-day-today {
    background: ${props => props.theme.colors.primary}15 !important;
    border: 2px solid ${props => props.theme.colors.primary} !important;
    position: relative;
  }

  .fc-day-today .fc-daygrid-day-number {
    color: ${props => props.theme.colors.primary} !important;
    font-weight: 700 !important;
    background: ${props => props.theme.colors.primary}20;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
  }

  .fc-daygrid-day-number {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.primary}15;
      border-radius: 6px;
    }
  }

  .fc-col-header-cell {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    padding: 12px 0;
    font-size: 0.9rem;

    @media (max-width: 1024px) {
      padding: 10px 0;
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      padding: 8px 0;
      font-size: 0.75rem;
    }
  }

  /* Estilo para o dia atual na visualização de semana/dia */
  .fc-timegrid-col.fc-day-today {
    background: ${props => props.theme.colors.primary}08 !important;
  }

  .fc-col-header-cell.fc-day-today {
    background: ${props => props.theme.colors.primary}20 !important;
    color: ${props => props.theme.colors.primary} !important;
    font-weight: 700 !important;
    border-bottom: 3px solid ${props => props.theme.colors.primary} !important;
  }

  /* Cursor pointer para células clicáveis */
  .fc-daygrid-day {
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 100px;
    padding: 4px;
    background: ${props => props.theme.colors.cardBackground};
    border-color: ${props => props.theme.colors.border};

    @media (max-width: 1024px) {
      min-height: 90px;
      padding: 3px;
    }

    @media (max-width: 768px) {
      min-height: 70px;
      padding: 2px;
    }

    &:hover {
      background: ${props => props.theme.colors.primary}08;
    }
  }

  .fc-daygrid-day-frame {
    min-height: 80px;

    @media (max-width: 1024px) {
      min-height: 70px;
    }

    @media (max-width: 768px) {
      min-height: 60px;
    }
  }

  .fc-daygrid-day-top {
    padding: 4px;
  }

  .fc-timegrid-slot {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.primary}05;
    }
  }

  /* Melhorar feedback visual para elementos interativos */
  .fc-daygrid-day-events {
    cursor: pointer;
    max-height: 60px;
    overflow: hidden;
    margin-top: 2px;
  }

  .fc-event-title {
    cursor: pointer;
  }

  /* Ajustar cores gerais do calendário */
  .fc-theme-standard td,
  .fc-theme-standard th {
    border-color: ${props => props.theme.colors.border};
  }

  .fc-scrollgrid {
    border-color: ${props => props.theme.colors.border};
  }

  .fc-timegrid-col {
    background: ${props => props.theme.colors.cardBackground};
  }

  .fc-timegrid-slot-label {
    color: ${props => props.theme.colors.textSecondary};
    border-color: ${props => props.theme.colors.border};
  }

  .fc-timegrid-axis {
    color: ${props => props.theme.colors.textSecondary};
  }

  .fc-list-day-cushion {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }

  .fc-list-event:hover td {
    background: ${props => props.theme.colors.primary}10;
  }

  .fc-more-link {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;

    &:hover {
      color: ${props => props.theme.colors.primaryDark};
    }
  }

  .fc-popover {
    background: ${props => props.theme.colors.cardBackground};
    border: 1px solid ${props => props.theme.colors.border};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .fc-popover-header {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }

  .fc-popover-close {
    color: ${props => props.theme.colors.textSecondary};

    &:hover {
      color: ${props => props.theme.colors.text};
    }
  }
`;

// Overlay de loading sutil
export const CalendarLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.cardBackground}CC;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  z-index: 10;
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Estatísticas
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 1024px) {
    gap: 12px;
    margin-top: 20px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 16px;
  }
`;

export const StatCard = styled.div<{
  $type: 'total' | 'today' | 'week' | 'completed';
}>`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 14px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 8px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const StatValue = styled.div<{
  $type: 'total' | 'today' | 'week' | 'completed';
}>`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: ${props => {
    switch (props.$type) {
      case 'total':
        return props.theme.colors.primary;
      case 'today':
        return '#10B981';
      case 'week':
        return '#F59E0B';
      case 'completed':
        return '#8B5CF6';
      default:
        return props.theme.colors.text;
    }
  }};

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 2px;
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

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

// Formulário
export const FormContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

export const ErrorText = styled.span`
  display: block;
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 6px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  cursor: text;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  cursor: text;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

// Color Picker
export const ColorPicker = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ColorOption = styled.button<{
  $color: string;
  $isSelected: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid
    ${props =>
      props.$isSelected ? props.theme.colors.cardBackground : 'transparent'};
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props =>
    props.$isSelected
      ? `0 0 0 3px ${props.theme.colors.primary}`
      : '0 2px 8px rgba(0,0,0,0.1)'};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}80;
  }
`;

// Modal Actions
export const ModalActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column-reverse;
  }
`;

export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 16px ${props.theme.colors.primary}30;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${props.theme.colors.primary}40;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        box-shadow: 0 4px 16px #EF444430;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px #EF444440;
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
          transform: translateY(-2px);
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
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Estados vazios e erro
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px;
`;

export const EmptyMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

export const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
  margin: 0 0 12px;
`;

export const ErrorMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px;
`;

export const RetryButton = styled.button`
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

// Toast
export const ToastContainer = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 24px;
  right: 24px;
  background: ${props => (props.$type === 'success' ? '#10B981' : '#EF4444')};
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: slideIn 0.3s ease;

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
  font-weight: 600;
  font-size: 0.9rem;
`;

// Componentes de agendamento (para cards)
export const AppointmentCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const AppointmentTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

export const AppointmentType = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
`;

export const AppointmentTime = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

export const AppointmentLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

export const AppointmentDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0 0 12px;
  line-height: 1.4;
`;

export const AppointmentActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}>`
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  min-width: 36px;
  height: 36px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: #EF4444;
        color: white;

        &:hover:not(:disabled) {
          background: #DC2626;
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'warning') {
      return `
        background: #F59E0B;
        color: white;

        &:hover:not(:disabled) {
          background: #D97706;
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-1px);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;
