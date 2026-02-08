import React from 'react';
import styled from 'styled-components';
import { NumericFormat } from 'react-number-format';
import {
  PropertyTypeOptions,
  PropertyStatusOptions,
  BrazilianStates,
  CommonFeatures,
} from '../../types/property';

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
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
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

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
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

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textLight};
    cursor: not-allowed;
  }
`;

const FieldError = styled.span`
  color: #dc2626;
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

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

const FeatureItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  input[type='checkbox'] {
    margin: 0;
  }

  input[type='checkbox']:checked + span {
    color: #1c4eff;
    font-weight: 600;
  }
`;

// Interfaces
interface PropertyFieldProps {
  register: (name: string) => any;
  errors: Record<string, any>;
  required?: boolean;
}

// Campos básicos
export const TitleField: React.FC<PropertyFieldProps> = ({
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
    {errors.title && (
      <FieldError>⚠️ {errors.title.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const DescriptionField: React.FC<PropertyFieldProps> = ({
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
      placeholder='Descreva detalhadamente a propriedade, suas características, localização, comodidades... (máx. 300 caracteres)'
      maxLength={300}
      {...register('description')}
    />
    {errors.description && (
      <FieldError>⚠️ {errors.description.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const TypeField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Tipo de Propriedade
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldSelect {...register('type')}>
      <option value=''>Selecione o tipo</option>
      {PropertyTypeOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FieldSelect>
    {errors.type && <FieldError>⚠️ {errors.type.message as string}</FieldError>}
  </FieldContainer>
);

export const StatusField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Status
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldSelect {...register('status')}>
      <option value=''>Selecione o status</option>
      {PropertyStatusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FieldSelect>
    {errors.status && (
      <FieldError>⚠️ {errors.status.message as string}</FieldError>
    )}
  </FieldContainer>
);

// Campos de localização
export const AddressField: React.FC<PropertyFieldProps> = ({
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
    {errors.address && (
      <FieldError>⚠️ {errors.address.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const LocationFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => (
  <RowContainer>
    <FieldContainer>
      <FieldLabel>
        Cidade
        <RequiredIndicator>*</RequiredIndicator>
      </FieldLabel>
      <FieldInput type='text' placeholder='São Paulo' {...register('city')} />
      {errors.city && (
        <FieldError>⚠️ {errors.city.message as string}</FieldError>
      )}
    </FieldContainer>

    <FieldContainer>
      <FieldLabel>
        Estado
        <RequiredIndicator>*</RequiredIndicator>
      </FieldLabel>
      <FieldSelect {...register('state')}>
        <option value=''>Selecione o estado</option>
        {BrazilianStates.map(state => (
          <option key={state.value} value={state.value}>
            {state.label} ({state.value})
          </option>
        ))}
      </FieldSelect>
      {errors.state && (
        <FieldError>⚠️ {errors.state.message as string}</FieldError>
      )}
    </FieldContainer>
  </RowContainer>
);

export const ZipCodeField: React.FC<PropertyFieldProps> = ({
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
    {errors.zipCode && (
      <FieldError>⚠️ {errors.zipCode.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const NeighborhoodField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Bairro
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='text'
      placeholder='Vila Madalena'
      {...register('neighborhood')}
    />
    {errors.neighborhood && (
      <FieldError>⚠️ {errors.neighborhood.message as string}</FieldError>
    )}
  </FieldContainer>
);

// Campos de área
export const AreaFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => (
  <RowContainer>
    <FieldContainer>
      <FieldLabel>
        Área Total (m²)
        <RequiredIndicator>*</RequiredIndicator>
      </FieldLabel>
      <FieldInput
        type='number'
        placeholder='120.50'
        step='0.01'
        min='0'
        {...register('totalArea')}
      />
      {errors.totalArea && (
        <FieldError>⚠️ {errors.totalArea.message as string}</FieldError>
      )}
    </FieldContainer>

    <FieldContainer>
      <FieldLabel>Área Construída (m²)</FieldLabel>
      <FieldInput
        type='number'
        placeholder='100.00'
        step='0.01'
        min='0'
        {...register('builtArea')}
      />
      {errors.builtArea && (
        <FieldError>⚠️ {errors.builtArea.message as string}</FieldError>
      )}
    </FieldContainer>
  </RowContainer>
);

// Campos de quartos, banheiros e vagas
export const RoomsFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => (
  <RowContainer>
    <FieldContainer>
      <FieldLabel>Quartos</FieldLabel>
      <FieldInput
        type='number'
        placeholder='3'
        min='0'
        max='50'
        {...register('bedrooms')}
      />
      {errors.bedrooms && (
        <FieldError>⚠️ {errors.bedrooms.message as string}</FieldError>
      )}
    </FieldContainer>

    <FieldContainer>
      <FieldLabel>Banheiros</FieldLabel>
      <FieldInput
        type='number'
        placeholder='2'
        min='0'
        max='20'
        {...register('bathrooms')}
      />
      {errors.bathrooms && (
        <FieldError>⚠️ {errors.bathrooms.message as string}</FieldError>
      )}
    </FieldContainer>
  </RowContainer>
);

export const ParkingField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => (
  <FieldContainer>
    <FieldLabel>Vagas de Garagem</FieldLabel>
    <FieldInput
      type='number'
      placeholder='2'
      min='0'
      max='20'
      {...register('parkingSpaces')}
    />
    {errors.parkingSpaces && (
      <FieldError>⚠️ {errors.parkingSpaces.message as string}</FieldError>
    )}
  </FieldContainer>
);

// Campos de preços
export const PriceFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => {
  const [salePrice, setSalePrice] = React.useState('');
  const [rentPrice, setRentPrice] = React.useState('');

  return (
    <RowContainer>
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
        {errors.salePrice && (
          <FieldError>⚠️ {errors.salePrice.message as string}</FieldError>
        )}
      </FieldContainer>

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
        {errors.rentPrice && (
          <FieldError>⚠️ {errors.rentPrice.message as string}</FieldError>
        )}
      </FieldContainer>
    </RowContainer>
  );
};

export const AdditionalCostsFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => {
  const [condominiumFee, setCondominiumFee] = React.useState('');
  const [iptu, setIptu] = React.useState('');

  return (
    <RowContainer>
      <FieldContainer>
        <FieldLabel>Condomínio (R$)</FieldLabel>
        <NumericFormat
          customInput={FieldInput}
          thousandSeparator='.'
          decimalSeparator=','
          prefix='R$ '
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          placeholder='R$ 0,00'
          value={condominiumFee}
          onValueChange={values => {
            setCondominiumFee(values.value);
            register('condominiumFee').onChange({
              target: {
                name: 'condominiumFee',
                value: values.floatValue || '',
              },
            });
          }}
        />
        {errors.condominiumFee && (
          <FieldError>⚠️ {errors.condominiumFee.message as string}</FieldError>
        )}
      </FieldContainer>

      <FieldContainer>
        <FieldLabel>IPTU Anual (R$)</FieldLabel>
        <NumericFormat
          customInput={FieldInput}
          thousandSeparator='.'
          decimalSeparator=','
          prefix='R$ '
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          placeholder='R$ 0,00'
          value={iptu}
          onValueChange={values => {
            setIptu(values.value);
            register('iptu').onChange({
              target: { name: 'iptu', value: values.floatValue || '' },
            });
          }}
        />
        {errors.iptu && (
          <FieldError>⚠️ {errors.iptu.message as string}</FieldError>
        )}
      </FieldContainer>
    </RowContainer>
  );
};

// Campo de características
export const FeaturesField: React.FC<
  PropertyFieldProps & { selectedFeatures?: string[] }
> = ({ register, errors, selectedFeatures = [] }) => (
  <FieldContainer>
    <FieldLabel>Características da Propriedade</FieldLabel>
    <FeaturesContainer>
      {CommonFeatures.map(feature => (
        <FeatureItem key={feature}>
          <input
            type='checkbox'
            value={feature}
            {...register('features')}
            defaultChecked={selectedFeatures.includes(feature)}
          />
          <span>{feature}</span>
        </FeatureItem>
      ))}
    </FeaturesContainer>
    {errors.features && (
      <FieldError>⚠️ {errors.features.message as string}</FieldError>
    )}
  </FieldContainer>
);

// Campos de configurações
export const SettingsFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => (
  <RowContainer>
    <FieldContainer>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <input type='checkbox' {...register('isActive')} defaultChecked />
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
          Propriedade Ativa
        </span>
      </label>
      <small style={{ color: '#6b7280', marginTop: '4px' }}>
        Propriedades inativas não aparecem nas buscas
      </small>
    </FieldContainer>

    <FieldContainer>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <input type='checkbox' {...register('isFeatured')} />
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
          Propriedade em Destaque
        </span>
      </label>
      <small style={{ color: '#6b7280', marginTop: '4px' }}>
        Propriedades em destaque aparecem primeiro nas listagens
      </small>
    </FieldContainer>

    <FieldContainer>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <input type='checkbox' {...register('isAvailableForSite')} />
        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
          Disponível no Site Dream Keys
        </span>
      </label>
      <small style={{ color: '#6b7280', marginTop: '4px' }}>
        Esta propriedade ficará visível no site Dream Keys (disponível apenas no
        plano Professional)
      </small>
    </FieldContainer>
  </RowContainer>
);

// Campos do proprietário
export const OwnerNameField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Nome do Proprietário
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='text'
      placeholder='Ex: João Silva'
      maxLength={255}
      {...register('ownerName')}
    />
    {errors.ownerName && (
      <FieldError>⚠️ {errors.ownerName.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const OwnerEmailField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Email do Proprietário
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='email'
      placeholder='Ex: joao.silva@email.com'
      maxLength={255}
      {...register('ownerEmail')}
    />
    {errors.ownerEmail && (
      <FieldError>⚠️ {errors.ownerEmail.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const OwnerPhoneField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Telefone do Proprietário
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='tel'
      placeholder='Ex: (11) 98765-4321'
      maxLength={20}
      {...register('ownerPhone')}
    />
    {errors.ownerPhone && (
      <FieldError>⚠️ {errors.ownerPhone.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const OwnerDocumentField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      CPF ou CNPJ do Proprietário
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldInput
      type='text'
      placeholder='Ex: 123.456.789-00 ou 12.345.678/0001-90'
      maxLength={18}
      {...register('ownerDocument')}
    />
    {errors.ownerDocument && (
      <FieldError>⚠️ {errors.ownerDocument.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const OwnerAddressField: React.FC<PropertyFieldProps> = ({
  register,
  errors,
  required = true,
}) => (
  <FieldContainer>
    <FieldLabel>
      Endereço do Proprietário
      {required && <RequiredIndicator>*</RequiredIndicator>}
    </FieldLabel>
    <FieldTextarea
      placeholder='Ex: Rua Exemplo, 456, São Paulo - SP'
      {...register('ownerAddress')}
    />
    {errors.ownerAddress && (
      <FieldError>⚠️ {errors.ownerAddress.message as string}</FieldError>
    )}
  </FieldContainer>
);

export const OwnerFields: React.FC<PropertyFieldProps> = ({
  register,
  errors,
}) => (
  <>
    <OwnerNameField register={register} errors={errors} />
    <RowContainer>
      <OwnerEmailField register={register} errors={errors} />
      <OwnerPhoneField register={register} errors={errors} />
    </RowContainer>
    <OwnerDocumentField register={register} errors={errors} />
    <OwnerAddressField register={register} errors={errors} />
  </>
);
