import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { SubmitButton } from './SubmitButton';
import { AlertMessage } from './AlertMessage';
import {
  TitleFieldSimple,
  DescriptionFieldSimple,
  AddressFieldSimple,
  CityFieldSimple,
  StateFieldSimple,
  ZipCodeFieldSimple,
  TotalAreaFieldSimple,
  SalePriceFieldSimple,
  RentPriceFieldSimple,
} from './PropertyFieldsSimple';

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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
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
interface PropertyFormSimpleProps {
  onSuccess?: (property: any) => void;
  onCancel?: () => void;
}

export const PropertyFormSimple: React.FC<PropertyFormSimpleProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      totalArea: '',
      salePrice: '',
      rentPrice: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // console.log('🏠 Dados do formulário:', data);
      // Simular criação da propriedade
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newProperty = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
      };

      setSuccessMessage('Propriedade criada com sucesso!');
      reset();

      if (onSuccess) {
        onSuccess(newProperty);
      }

      // console.log('✅ Propriedade criada:', newProperty);
    } catch (err: any) {
      console.error('❌ Erro ao criar propriedade:', err);
      setError('Erro ao criar propriedade. Tente novamente.');
    } finally {
      setIsLoading(false);
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
      <FormSubtitle>Preencha os dados básicos da propriedade</FormSubtitle>

      <FormCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Informações Básicas */}
          <SectionContainer>
            <SectionTitle>📝 Informações Básicas</SectionTitle>
            <TitleFieldSimple register={register} errors={errors} />
            <DescriptionFieldSimple register={register} errors={errors} />
          </SectionContainer>

          {/* Localização */}
          <SectionContainer>
            <SectionTitle>📍 Localização</SectionTitle>
            <AddressFieldSimple register={register} errors={errors} />
            <CityFieldSimple register={register} errors={errors} />
            <StateFieldSimple register={register} errors={errors} />
            <ZipCodeFieldSimple register={register} errors={errors} />
          </SectionContainer>

          {/* Características */}
          <SectionContainer>
            <SectionTitle>🏗️ Características</SectionTitle>
            <TotalAreaFieldSimple register={register} errors={errors} />
          </SectionContainer>

          {/* Valores */}
          <SectionContainer>
            <SectionTitle>💰 Valores</SectionTitle>
            <SalePriceFieldSimple register={register} errors={errors} />
            <RentPriceFieldSimple register={register} errors={errors} />
          </SectionContainer>

          {/* Mensagens de erro e sucesso */}
          {error && (
            <AlertMessage
              type='error'
              message={error}
              onClose={() => setError(null)}
            />
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
