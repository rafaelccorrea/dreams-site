import React from 'react';
import type { FieldError } from 'react-hook-form';
import { SimpleInput } from './SimpleInput';
import { PhoneIcon } from './InputIcons';

interface PhoneFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  required = false,
}) => {
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');

    // Aplica máscara conforme o tamanho
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
  };

  return (
    <SimpleInput
      id={id}
      label={label}
      type='tel'
      placeholder={placeholder}
      error={error}
      register={register}
      required={required}
      icon={<PhoneIcon />}
      onChange={handleChange}
    />
  );
};
