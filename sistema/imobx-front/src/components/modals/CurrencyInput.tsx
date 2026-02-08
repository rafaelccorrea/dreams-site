import React, { useState, useEffect } from 'react';
import { formatCurrency, getNumericValue } from '../../utils/masks';
import { CustomInput } from '../../styles/pages/PropertiesPageStyles';

interface CurrencyInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = '',
  onChange,
  placeholder = 'R$ 0,00',
  hasError,
  disabled,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Sincronizar com valor externo
  useEffect(() => {
    if (value !== displayValue) {
      setDisplayValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (rawValue === '') {
      setDisplayValue('');
      onChange?.('');
      return;
    }

    const formattedValue = formatCurrency(rawValue);
    setDisplayValue(formattedValue);
    onChange?.(formattedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir apenas números, backspace, delete, tab, enter, escape, home, end, setas
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'Escape',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];

    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
      return;
    }

    // Bloquear qualquer outro caractere que não seja número
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <CustomInput
      {...props}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={16} // Limitar tamanho para evitar valores muito grandes
      $hasError={hasError}
      disabled={disabled}
    />
  );
};
