import React from 'react';
import styled from 'styled-components';
import { useAddress } from '../../hooks/useAddress';
import { formatZipCode } from '../../services/addressApi';

// Styled Components
const FieldRow = styled.div`
  display: flex;
  gap: 16px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const FieldContainerFlex = styled(FieldContainer)<{ flex?: number }>`
  flex: ${props => props.flex || 1};
`;

const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
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
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 4px;
  display: flex;
  align-items: center;

  &::before {
    content: '⚠️';
    margin-right: 4px;
  }
`;

const RequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: bold;
`;

const LoadingIndicator = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  margin-left: 8px;
`;

const HintText = styled.small`
  color: ${props => props.theme.colors.textLight};
  margin-top: 4px;
  display: block;
`;

// Interfaces
interface AddressFieldsProps {
  values: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
  required?: boolean;
}

// Componente reutilizável para campos de endereço
export const AddressFields: React.FC<AddressFieldsProps> = ({
  values,
  onChange,
  errors = {},
  required = false,
}) => {
  const {
    isLoading,
    error: addressError,
    addressData,
    searchByZipCode,
  } = useAddress();

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatZipCode(value);
    onChange('zipCode', formattedValue);

    // Buscar endereço quando CEP estiver completo
    if (value.replace(/\D/g, '').length === 8) {
      searchByZipCode(value);
    }
  };

  // Auto-fill address when CEP is found
  React.useEffect(() => {
    if (addressData) {
      onChange('street', addressData.street);
      onChange('neighborhood', addressData.neighborhood);
      onChange('city', addressData.city);
      onChange('state', addressData.state);
      // console.log('✅ Endereço preenchido automaticamente:', addressData);
    }
  }, [addressData, onChange]);

  return (
    <>
      {/* CEP */}
      <FieldContainer>
        <FieldLabel>
          CEP
          {required && <RequiredIndicator>*</RequiredIndicator>}
          {isLoading && <LoadingIndicator>🔍 Buscando...</LoadingIndicator>}
        </FieldLabel>
        <FieldInput
          type='text'
          name='zipCode'
          value={values.zipCode}
          onChange={handleZipCodeChange}
          placeholder='00000-000'
          maxLength={9}
          disabled={isLoading}
        />
        {errors.zipCode && (
          <ErrorMessage>{String(errors.zipCode)}</ErrorMessage>
        )}
        {addressError && <ErrorMessage>{addressError}</ErrorMessage>}
        <HintText>
          Digite o CEP para preenchimento automático do endereço
        </HintText>
      </FieldContainer>

      {/* Rua/Logradouro */}
      <FieldContainer>
        <FieldLabel>
          Rua/Logradouro
          {required && <RequiredIndicator>*</RequiredIndicator>}
        </FieldLabel>
        <FieldInput
          type='text'
          name='street'
          value={values.street}
          placeholder='Preenchido automaticamente pelo CEP'
          disabled={true}
        />
        {errors.street && <ErrorMessage>{String(errors.street)}</ErrorMessage>}
        <HintText>
          Preenchido automaticamente quando você digitar o CEP
        </HintText>
      </FieldContainer>

      {/* Número e Complemento */}
      <FieldRow>
        <FieldContainerFlex flex={1}>
          <FieldLabel>
            Número
            {required && <RequiredIndicator>*</RequiredIndicator>}
          </FieldLabel>
          <FieldInput
            type='text'
            name='number'
            value={values.number}
            onChange={e =>
              onChange('number', e.target.value.replace(/\D/g, ''))
            }
            placeholder='123'
          />
          {errors.number && (
            <ErrorMessage>{String(errors.number)}</ErrorMessage>
          )}
        </FieldContainerFlex>

        <FieldContainerFlex flex={2}>
          <FieldLabel>Complemento</FieldLabel>
          <FieldInput
            type='text'
            name='complement'
            value={values.complement || ''}
            onChange={e => onChange('complement', e.target.value)}
            placeholder='Apto 101, Bloco A'
          />
          {errors.complement && (
            <ErrorMessage>{String(errors.complement)}</ErrorMessage>
          )}
        </FieldContainerFlex>
      </FieldRow>

      {/* Bairro */}
      <FieldContainer>
        <FieldLabel>
          Bairro
          {required && <RequiredIndicator>*</RequiredIndicator>}
        </FieldLabel>
        <FieldInput
          type='text'
          name='neighborhood'
          value={values.neighborhood}
          placeholder='Preenchido automaticamente pelo CEP'
          disabled={true}
        />
        {errors.neighborhood && (
          <ErrorMessage>{String(errors.neighborhood)}</ErrorMessage>
        )}
        <HintText>
          Preenchido automaticamente quando você digitar o CEP
        </HintText>
      </FieldContainer>

      {/* Cidade e Estado */}
      <FieldRow>
        <FieldContainerFlex flex={2}>
          <FieldLabel>
            Cidade
            {required && <RequiredIndicator>*</RequiredIndicator>}
          </FieldLabel>
          <FieldInput
            type='text'
            name='city'
            value={values.city}
            placeholder='Preenchido automaticamente pelo CEP'
            disabled={true}
          />
          {errors.city && <ErrorMessage>{String(errors.city)}</ErrorMessage>}
          <HintText>
            Preenchido automaticamente quando você digitar o CEP
          </HintText>
        </FieldContainerFlex>

        <FieldContainerFlex flex={1}>
          <FieldLabel>
            Estado
            {required && <RequiredIndicator>*</RequiredIndicator>}
          </FieldLabel>
          <FieldInput
            type='text'
            name='state'
            value={values.state}
            placeholder='Preenchido automaticamente pelo CEP'
            disabled={true}
          />
          {errors.state && <ErrorMessage>{String(errors.state)}</ErrorMessage>}
          <HintText>
            Preenchido automaticamente quando você digitar o CEP
          </HintText>
        </FieldContainerFlex>
      </FieldRow>
    </>
  );
};
