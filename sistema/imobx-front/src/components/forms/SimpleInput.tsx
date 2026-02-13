import React from 'react';
import type { FieldError } from 'react-hook-form';
import {
  InputContainer,
  Label,
  InputWrapper,
  IconWrapper,
  ActionButton,
  Input,
  ErrorMessage,
} from '../../styles/forms/FormStyles';

interface SimpleInputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
  icon?: React.ReactNode;
  actionButton?: {
    icon: React.ReactNode;
    onClick: () => void;
    title?: string;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  icon,
  actionButton,
  onChange,
  maxLength,
}) => {
  const registerProps = register(id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chama o onChange customizado se existir
    if (onChange) {
      onChange(e);
    }
    // Chama o onChange do register
    if (registerProps.onChange) {
      registerProps.onChange(e);
    }
  };

  return (
    <InputContainer>
      <Label htmlFor={id}>
        {label}
        {required && <span style={{ color: '#ff4757' }}> *</span>}
      </Label>
      <InputWrapper>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          {...registerProps}
          onChange={handleChange}
          maxLength={maxLength}
          className={`${error ? 'error' : ''} ${actionButton ? 'with-action' : ''} ${icon ? 'with-icon' : ''}`}
        />
        {actionButton && (
          <ActionButton
            type='button'
            onClick={actionButton.onClick}
            title={actionButton.title}
          >
            {actionButton.icon}
          </ActionButton>
        )}
      </InputWrapper>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </InputContainer>
  );
};
