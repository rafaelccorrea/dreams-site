import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { createPropertySchema } from '../../schemas/validation';
import type { CreatePropertyData } from '../../types/property';
import { useProperties } from '../../hooks/useProperties';
import { AlertMessage } from './AlertMessage';
import { SubmitButton } from './SubmitButton';
import {
  TitleField,
  DescriptionField,
  TypeField,
  StatusField,
  AddressField,
  LocationFields,
  ZipCodeField,
  NeighborhoodField,
  AreaFields,
  RoomsFields,
  ParkingField,
  PriceFields,
  AdditionalCostsFields,
  FeaturesField,
  SettingsFields,
  OwnerFields,
} from './PropertyFields';

// Styled Components
const FormContainer = styled.div`
  width: 100%;
  padding: 24px;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 32px;
`;

const FormCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: ${props => props.theme.colors.primary};
    border-radius: 2px;
  }
`;

const SectionContainer = styled.div`
  margin-bottom: 32px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Interface para props do componente
interface PropertyFormProps {
  onSuccess?: (property: any) => void;
  onCancel?: () => void;
  initialData?: Partial<CreatePropertyData>;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const { createProperty, isLoading, error, clearError } = useProperties();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreatePropertyData>({
    resolver: yupResolver(createPropertySchema),
    defaultValues: {
      status: 'draft',
      isActive: true,
      isFeatured: false,
      features: [],
      ...initialData,
    },
  });

  // Observar mudanças nos campos para validação em tempo real
  const watchedFields = watch();

  const onSubmit = async (data: CreatePropertyData) => {
    try {
      clearError();
      setSuccessMessage(null);

      // console.log('🏠 Enviando formulário de propriedade:', data);
      // Processar dados antes de enviar
      const processedData = {
        ...data,
        // Converter strings vazias para null/undefined
        builtArea: data.builtArea || undefined,
        bedrooms: data.bedrooms || undefined,
        bathrooms: data.bathrooms || undefined,
        parkingSpaces: data.parkingSpaces || undefined,
        salePrice: data.salePrice || undefined,
        rentPrice: data.rentPrice || undefined,
        condominiumFee: data.condominiumFee || undefined,
        iptu: data.iptu || undefined,
        features: data.features || [],
      };

      const newProperty = await createProperty(processedData);

      setSuccessMessage('Propriedade criada com sucesso!');
      reset();

      // Callback de sucesso
      if (onSuccess) {
        onSuccess(newProperty);
      }

      // console.log('✅ Propriedade criada com sucesso:', newProperty);
    } catch (err: any) {
      console.error('❌ Erro ao criar propriedade:', err);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
    }
  };

  return (
    <FormContainer>
      <FormTitle>🏠 Nova Propriedade</FormTitle>
      <FormSubtitle>
        Preencha os dados da propriedade para cadastrá-la no sistema
      </FormSubtitle>

      <FormCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Informações Básicas */}
          <SectionContainer>
            <SectionTitle>📝 Informações Básicas</SectionTitle>
            <TitleField register={register} errors={errors} />
            <DescriptionField register={register} errors={errors} />
            <TypeField register={register} errors={errors} />
            <StatusField register={register} errors={errors} />
          </SectionContainer>

          {/* Localização */}
          <SectionContainer>
            <SectionTitle>📍 Localização</SectionTitle>
            <AddressField register={register} errors={errors} />
            <LocationFields register={register} errors={errors} />
            <ZipCodeField register={register} errors={errors} />
            <NeighborhoodField register={register} errors={errors} />
          </SectionContainer>

          {/* Características Físicas */}
          <SectionContainer>
            <SectionTitle>🏗️ Características Físicas</SectionTitle>
            <AreaFields register={register} errors={errors} />
            <RoomsFields register={register} errors={errors} />
            <ParkingField register={register} errors={errors} />
          </SectionContainer>

          {/* Valores */}
          <SectionContainer>
            <SectionTitle>💰 Valores</SectionTitle>
            <PriceFields register={register} errors={errors} />
            <AdditionalCostsFields register={register} errors={errors} />
          </SectionContainer>

          {/* Características */}
          <SectionContainer>
            <SectionTitle>✨ Características</SectionTitle>
            <FeaturesField
              register={register}
              errors={errors}
              selectedFeatures={watchedFields.features || []}
            />
          </SectionContainer>

          {/* Configurações */}
          <SectionContainer>
            <SectionTitle>⚙️ Configurações</SectionTitle>
            <SettingsFields register={register} errors={errors} />
          </SectionContainer>

          {/* Informações do Proprietário */}
          <SectionContainer>
            <SectionTitle>👤 Informações do Proprietário</SectionTitle>
            <OwnerFields register={register} errors={errors} />
          </SectionContainer>

          {/* Mensagens de erro e sucesso */}
          {error && (
            <AlertMessage type='error' message={error} onClose={clearError} />
          )}

          {successMessage && (
            <AlertMessage
              type='success'
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}

          {/* Ações do formulário */}
          <FormActions>
            <CancelButton
              type='button'
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </CancelButton>

            <SubmitButton
              isLoading={isLoading}
              loadingText='Criando...'
              defaultText='Criar Propriedade'
              disabled={isLoading}
            />
          </FormActions>
        </form>
      </FormCard>
    </FormContainer>
  );
};
