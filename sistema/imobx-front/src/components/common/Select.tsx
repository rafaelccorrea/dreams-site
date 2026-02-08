import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { MdArrowDropDown } from 'react-icons/md';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const SelectWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

const SelectLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
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
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

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

  /* Estilo melhorado para as opções */
  option {
    padding: 12px;
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
  }

  /* Remove o ícone padrão do IE */
  &::-ms-expand {
    display: none;
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
  color: ${props => props.theme.colors.textSecondary};
  font-size: 24px;
`;

const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: #dc2626;
  margin-top: 4px;
`;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = true, children, ...props }, ref) => {
    return (
      <SelectWrapper $fullWidth={fullWidth}>
        {label && <SelectLabel>{label}</SelectLabel>}
        <SelectContainer>
          <StyledSelect ref={ref} {...props}>
            {children}
          </StyledSelect>
          <IconWrapper>
            <MdArrowDropDown />
          </IconWrapper>
        </SelectContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SelectWrapper>
    );
  }
);

Select.displayName = 'Select';
