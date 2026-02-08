import styled from 'styled-components';

/** Wrapper: fundo cinza claro (#f8fafc) apenas no modo light. */
export const PageLightBg = styled.div`
  min-height: 100%;
  ${(props: { theme?: { mode?: string } }) =>
    props.theme?.mode !== 'dark' ? 'background: #f8fafc;' : ''}
`;

// Container padrão para todas as páginas
export const PageContainer = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 70px); /* Altura total menos header */
`;

// Header padrão para páginas
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

// Título padrão para páginas
export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Card padrão para conteúdo
export const ContentCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

// Container para formulários
export const FormContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

// Container para campos de formulário
export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

// Label padrão para campos
export const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Input padrão
export const FieldInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:hover {
    border-color: ${props => props.theme.colors.borderLight};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }

  /* Estilos específicos para inputs de data */
  &[type='date'],
  &[type='time'],
  &[type='datetime-local'],
  &[type='month'],
  &[type='week'] {
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${props => `${props.theme.colors.primary}20`};
      }
    }
  }
`;

// Textarea padrão
export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}1A`};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

// Select padrão
export const FieldSelect = styled.select`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  background: #ffffff;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}1A`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f9fafb;
  }

  option {
    padding: 12px;
    font-size: 1rem;
  }

  &::-ms-expand {
    display: none;
  }
`;

// Container para campos em linha
export const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

// Botão padrão
export const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
      1 1,
    pointer !important;
  transition: all 0.2s ease;
  border: 2px solid;

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};

    &:hover {
      background: ${props => props.theme.colors.primaryHover};
      cursor:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
          1 1,
        pointer !important;
    }
  }

  &.secondary {
    background: #ffffff;
    color: #6b7280;
    border-color: #e5e7eb;

    &:hover {
      background: #f9fafb;
      cursor:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
          1 1,
        pointer !important;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126' opacity='0.5'/%3E%3Cline x1='2' y1='2' x2='18' y2='18' stroke='%23A63126' stroke-width='2'/%3E%3C/svg%3E")
        1 1,
      not-allowed !important;
  }
`;

// Indicador de campo obrigatório
export const RequiredIndicator = styled.span`
  color: #dc2626;
  font-weight: bold;
`;

// Estado vazio padrão
export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const EmptyMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 24px;
`;
