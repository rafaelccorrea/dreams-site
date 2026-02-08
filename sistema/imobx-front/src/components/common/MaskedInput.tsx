import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import styled from 'styled-components';
import { Input } from 'antd';

interface MaskedInputProps {
  mask?: 'cpf' | 'cep' | 'phone' | 'currency' | 'cnpj';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onPressEnter?: () => void;
  maxLength?: number;
  id?: string;
  name?: string;
  autoFocus?: boolean;
}

interface MaskedInputRef {
  focus: () => void;
}

const StyledInput = styled(Input)`
  width: 100%;

  .ant-input {
    font-size: 14px;
    line-height: 1.57143;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      border-color: ${props => props.theme.colors.borderHover};
    }

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.focusShadow};
    }

    &::placeholder {
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

export const MaskedInput = forwardRef<MaskedInputRef, MaskedInputProps>(
  ({ mask = 'cpf', value = '', onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useImperativeHandle(ref, () => ({
      focus: () => {
        // Implementation for focus if needed
      },
    }));

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const applyMask = (newValue: string): string => {
      let maskedValue = newValue;

      switch (mask) {
        case 'cpf':
          maskedValue = newValue
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .slice(0, 14);
          break;
        case 'cnpj':
          maskedValue = newValue
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .slice(0, 18);
          break;
        case 'phone':
          maskedValue = newValue
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
          break;
        case 'cep':
          maskedValue = newValue
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 9);
          break;
        case 'currency':
          maskedValue = newValue
            .replace(/\D/g, '')
            .replace(/(\d+)(\d{2})$/, '$1,$2')
            .replace(/(?=(\d{3})+(?!\d))/g, '.')
            .replace(/^\D*/, '');
          break;
        default:
          maskedValue = newValue;
      }

      return maskedValue;
    };

    const getNumericValue = (maskedValue: string): string => {
      switch (mask) {
        case 'currency':
          // Remove máscaras e retorna número puro para currency
          return maskedValue.replace(/\D/g, '');
        default:
          // Para outros tipos, retorna apenas números e caracteres relevantes
          return maskedValue.replace(/\D/g, '');
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const maskedValue = applyMask(inputValue);

      setDisplayValue(maskedValue);

      if (onChange) {
        const numericValue = getNumericValue(maskedValue);
        onChange(numericValue);
      }
    };

    return (
      <StyledInput {...props} value={displayValue} onChange={handleChange} />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

export default MaskedInput;
