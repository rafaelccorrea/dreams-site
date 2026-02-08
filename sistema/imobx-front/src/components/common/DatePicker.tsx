import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { MdCalendarToday } from 'react-icons/md';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const DatePickerWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

const DatePickerLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DatePickerContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledDateInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  /* Estilo do calendário nativo no modo dark */
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 1;
  }

  /* Remove o ícone padrão no Firefox */
  &::-moz-calendar-picker-indicator {
    opacity: 0;
  }

  /* Adaptar color-scheme ao tema */
  color-scheme: ${props => (props.theme.mode === 'dark' ? 'dark' : 'light')};

  /* Customização do dropdown do calendário */
  &::-webkit-datetime-edit {
    color: ${props => props.theme.colors.text};
  }

  &::-webkit-datetime-edit-fields-wrapper {
    color: ${props => props.theme.colors.text};
  }

  &::-webkit-datetime-edit-text {
    color: ${props => props.theme.colors.textSecondary};
  }

  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    color: ${props => props.theme.colors.text};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 20px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
`;

const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: #dc2626;
  margin-top: 4px;
`;

// Removido: estilos globais agora estão no GlobalStyle.ts

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, fullWidth = true, min, ...props }, ref) => {
    // Se min não for fornecido, usar hoje como padrão
    const minDate = min || new Date().toISOString().split('T')[0];

    return (
      <DatePickerWrapper $fullWidth={fullWidth}>
        {label && <DatePickerLabel>{label}</DatePickerLabel>}
        <DatePickerContainer>
          <StyledDateInput ref={ref} type='date' min={minDate} {...props} />
          <IconWrapper>
            <MdCalendarToday />
          </IconWrapper>
        </DatePickerContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </DatePickerWrapper>
    );
  }
);

DatePicker.displayName = 'DatePicker';
