import React from 'react';
import type { FieldError } from 'react-hook-form';
import { SimpleInput } from './SimpleInput';
import { formatCPF, formatCNPJ } from '../../utils/masks';
import { DocumentIcon } from './InputIcons';

interface DocumentFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
}

export const DocumentField: React.FC<DocumentFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  required = false,
}) => {
  const formatDocument = (value: string) => {
    // Remove tudo que não é alfanumérico
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');

    // Se tem letras, é CNPJ (independente do tamanho)
    const hasLetters = /[A-Za-z]/.test(cleaned);
    if (hasLetters) {
      return formatCNPJ(value);
    }

    // Se só tem números e tem 11 ou menos dígitos, é CPF
    if (cleaned.length <= 11) {
      return formatCPF(value);
    }
    // Se só tem números e tem mais de 11 dígitos, é CNPJ
    else {
      return formatCNPJ(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    e.target.value = formatted;
    // Disparar o onChange do register para atualizar o react-hook-form
    register(id).onChange(e);
  };

  return (
    <SimpleInput
      id={id}
      label={label}
      placeholder={placeholder}
      error={error}
      register={register}
      required={required}
      icon={<DocumentIcon />}
      onChange={handleChange}
      maxLength={18}
    />
  );
};
