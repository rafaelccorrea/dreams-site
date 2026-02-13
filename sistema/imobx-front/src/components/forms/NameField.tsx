import React from 'react';
import type { FieldError } from 'react-hook-form';
import { SimpleInput } from './SimpleInput';
import { UserIcon } from './InputIcons';

interface NameFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
}

export const NameField: React.FC<NameFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Converte para minúsculo
    e.target.value = e.target.value.toLowerCase();
  };

  return (
    <SimpleInput
      id={id}
      label={label}
      placeholder={placeholder}
      error={error}
      register={register}
      required={required}
      icon={<UserIcon />}
      onChange={handleChange}
    />
  );
};
