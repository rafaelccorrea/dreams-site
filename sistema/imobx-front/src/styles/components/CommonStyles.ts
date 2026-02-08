import styled from 'styled-components';

// Container genérico
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// Botão genérico
export const Button = styled.button`
  background: #a63126;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
      1 1,
    pointer !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Poppins', sans-serif;
  width: 100%;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow:
    0 4px 6px -1px rgba(166, 49, 38, 0.1),
    0 2px 4px -1px rgba(166, 49, 38, 0.06);

  &:hover {
    background: #8b251c;
    transform: translateY(-1px);
    box-shadow:
      0 10px 15px -3px rgba(166, 49, 38, 0.2),
      0 4px 6px -2px rgba(166, 49, 38, 0.05);
    cursor:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M1 1 L1 15 L7 9 L10 17 L13 15 L10 7 L17 7 L1 1 Z' fill='%23A63126'/%3E%3C/svg%3E")
        1 1,
      pointer !important;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Card genérico
export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

// Título genérico
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #a63126;
  font-family: 'Poppins', sans-serif;
`;

// Subtítulo genérico
export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #4b5563;
  font-family: 'Poppins', sans-serif;
`;

// Texto genérico
export const Text = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 16px 0;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
`;

// Link genérico
export const Link = styled.a`
  color: #a63126;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #8b251c;
    text-decoration: underline;
  }
`;

// Divisor genérico
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
`;

// Badge genérico
export const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Poppins', sans-serif;
`;

// Badge de sucesso
export const SuccessBadge = styled(Badge)`
  background: #d1fae5;
  color: #065f46;
`;

// Badge de erro
export const ErrorBadge = styled(Badge)`
  background: #fee2e2;
  color: #991b1b;
`;

// Badge de aviso
export const WarningBadge = styled(Badge)`
  background: #fef3c7;
  color: #92400e;
`;

// Badge de informação
export const InfoBadge = styled(Badge)`
  background: #fee2e2;
  color: #8b251c;
`;

// Card components
export const CardHeader = styled.div`
  margin-bottom: 16px;
`;

export const CardContent = styled.div`
  margin-bottom: 16px;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

// Form components
export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  font-family: 'Poppins', sans-serif;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;

  &:hover {
    border-color: #a63126;
  }

  &:focus {
    outline: none;
    border-color: #a63126;
    box-shadow: 0 0 0 3px rgba(166, 49, 38, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f3f4f6;
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
        background-color: rgba(166, 49, 38, 0.1);
      }
    }
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;

  &:hover {
    border-color: #a63126;
  }

  &:focus {
    outline: none;
    border-color: #a63126;
    box-shadow: 0 0 0 3px rgba(166, 49, 38, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f3f4f6;
  }

  option {
    padding: 12px;
    font-size: 1rem;
  }

  &::-ms-expand {
    display: none;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a63126;
    box-shadow: 0 0 0 3px rgba(166, 49, 38, 0.1);
  }
`;

// Message components
export const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 4px;
  font-family: 'Poppins', sans-serif;
`;

export const SuccessMessage = styled.div`
  color: #16a34a;
  font-size: 0.875rem;
  margin-top: 4px;
  font-family: 'Poppins', sans-serif;
`;

// Loading components
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #a63126;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const LoadingText = styled.div`
  margin-left: 8px;
  color: #6b7280;
  font-family: 'Poppins', sans-serif;
`;
