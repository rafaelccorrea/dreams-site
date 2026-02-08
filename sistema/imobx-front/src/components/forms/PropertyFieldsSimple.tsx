import React from 'react';
import styled from 'styled-components';
import { NumericFormat } from 'react-number-format';

// Styled Components
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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

const RequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: bold;
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

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const FieldSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const FieldError = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

// Interface simplificada
interface PropertyFieldProps {
  register: any;
  errors?: any;
  required?: boolean;
}

// Campos básicos simplificados
export const TitleFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Título da Propriedade
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='text'
      placeholder='Ex: Casa com 3 quartos na Zona Sul'
      {...register('title')}
    />
    {errors?.title && <FieldError>⚠️ {errors.title.message}</FieldError>}
  </FieldContainer>
);

export const DescriptionFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Descrição
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldTextarea
      placeholder='Descreva detalhadamente a propriedade... (máx. 300 caracteres)'
      maxLength={300}
      {...register('description')}
    />
    {errors?.description && (
      <FieldError>⚠️ {errors.description.message}</FieldError>
    )}
  </FieldContainer>
);

export const AddressFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Endereço Completo
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='text'
      placeholder='Rua, número, complemento...'
      {...register('address')}
    />
    {errors?.address && <FieldError>⚠️ {errors.address.message}</FieldError>}
  </FieldContainer>
);

export const CityFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Cidade
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput type='text' placeholder='São Paulo' {...register('city')} />
    {errors?.city && <FieldError>⚠️ {errors.city.message}</FieldError>}
  </FieldContainer>
);

export const StateFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Estado
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldSelect {...register('state')}>
      <option value=''>Selecione o estado</option>
      <option value='SP'>São Paulo</option>
      <option value='RJ'>Rio de Janeiro</option>
      <option value='MG'>Minas Gerais</option>
      <option value='RS'>Rio Grande do Sul</option>
      <option value='PR'>Paraná</option>
      <option value='SC'>Santa Catarina</option>
      <option value='BA'>Bahia</option>
      <option value='GO'>Goiás</option>
      <option value='PE'>Pernambuco</option>
      <option value='CE'>Ceará</option>
    </FieldSelect>
    {errors?.state && <FieldError>⚠️ {errors.state.message}</FieldError>}
  </FieldContainer>
);

export const ZipCodeFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      CEP
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='text'
      placeholder='00000-000'
      maxLength={9}
      {...register('zipCode')}
    />
    {errors?.zipCode && <FieldError>⚠️ {errors.zipCode.message}</FieldError>}
  </FieldContainer>
);

export const TotalAreaFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Área Total (m²)
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='number'
      placeholder='120.50'
      step='0.01'
      min='0'
      {...register('totalArea')}
    />
    {errors?.totalArea && (
      <FieldError>⚠️ {errors.totalArea.message}</FieldError>
    )}
  </FieldContainer>
);

export const SalePriceFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => {
  const [salePrice, setSalePrice] = React.useState('');

  return (
    <FieldContainer>
      <FieldLabel>Preço de Venda (R$)</FieldLabel>
      <NumericFormat
        customInput={FieldInput}
        thousandSeparator='.'
        decimalSeparator=','
        prefix='R$ '
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        placeholder='R$ 0,00'
        value={salePrice}
        onValueChange={values => {
          setSalePrice(values.value);
          register('salePrice').onChange({
            target: { name: 'salePrice', value: values.floatValue || '' },
          });
        }}
      />
      {errors?.salePrice && (
        <FieldError>⚠️ {errors.salePrice.message}</FieldError>
      )}
    </FieldContainer>
  );
};

export const RentPriceFieldSimple: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => {
  const [rentPrice, setRentPrice] = React.useState('');

  return (
    <FieldContainer>
      <FieldLabel>Preço de Aluguel (R$)</FieldLabel>
      <NumericFormat
        customInput={FieldInput}
        thousandSeparator='.'
        decimalSeparator=','
        prefix='R$ '
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        placeholder='R$ 0,00'
        value={rentPrice}
        onValueChange={values => {
          setRentPrice(values.value);
          register('rentPrice').onChange({
            target: { name: 'rentPrice', value: values.floatValue || '' },
          });
        }}
      />
      {errors?.rentPrice && (
        <FieldError>⚠️ {errors.rentPrice.message}</FieldError>
      )}
    </FieldContainer>
  );
};
