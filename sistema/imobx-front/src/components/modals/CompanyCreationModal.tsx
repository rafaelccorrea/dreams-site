import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import {
  MdBusiness,
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdClose,
  MdSave,
  MdAccountBalance,
} from 'react-icons/md';
import { companyApi } from '../../services/companyApi';
import { authApi } from '../../services/api';
import { authStorage } from '../../services/authStorage';
import RequiredNote from '../common/RequiredNote';
import { AddressFields } from '../forms/AddressFields';
import { formatCNPJ, validateCNPJ } from '../../utils/masks';

interface CreateCompanyData {
  name: string;
  cnpj: string;
  corporateName: string;
  email: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Schema de validação para criação de empresa
const createCompanySchema = yup.object({
  name: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cnpj: yup
    .string()
    .required('CNPJ é obrigatório')
    .matches(
      /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[0-9]{2}$/,
      'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX (12 caracteres alfanuméricos + 2 dígitos verificadores)'
    )
    .test(
      'cnpj-valid',
      'CNPJ inválido (dígitos verificadores incorretos)',
      value => {
        if (!value) return false;
        return validateCNPJ(value);
      }
    ),
  corporateName: yup
    .string()
    .required('Razão social é obrigatória')
    .min(2, 'Razão social deve ter pelo menos 2 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (11) 99999-9999'
    ),
  zipCode: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 12345-678'),
  street: yup.string().required('Rua é obrigatória'),
  number: yup.string().required('Número é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  state: yup.string().required('Estado é obrigatório'),
});

interface CompanyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Styled Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    transform: scale(1.1);
  }
`;

const ModalContent = styled.div`
  padding: 32px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const FormGroupFull = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${props =>
      props.$hasError
        ? props.theme.colors.error
        : props.theme.colors.primary}50;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props =>
        props.$hasError
          ? props.theme.colors.error
          : props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
`;

const ModalActions = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const CompanyCreationModal: React.FC<CompanyCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCompanyData>({
    resolver: yupResolver(createCompanySchema),
    defaultValues: {
      name: '',
      cnpj: '',
      corporateName: '',
      email: '',
      phone: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    mode: 'onChange',
  });

  const watchedZipCode = watch('zipCode');

  useEffect(() => {
    if (watchedZipCode && watchedZipCode.length === 9) {
      // Aqui você pode implementar a busca automática do CEP
      // Por exemplo, usando uma API de CEP
    }
  }, [watchedZipCode]);

  const onSubmit = async (data: CreateCompanyData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await companyApi.createCompany(data);

      if (response.success) {
        // Atualizar o usuário com a nova empresa
        const currentUser = authStorage.getUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            companies: [...(currentUser.companies || []), response.data],
          };
          authStorage.setUser(updatedUser);
        }

        reset();
        onSuccess?.();
        onClose();
      } else {
        setError(response.message || 'Erro ao criar empresa');
      }
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      setError('Erro interno do servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>
            <MdBusiness />
            Criar Nova Empresa
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGrid>
              <FormGroup>
                <Label>
                  <MdBusiness />
                  Nome da Empresa <RequiredNote />
                </Label>
                <Input
                  {...register('name')}
                  placeholder='Digite o nome da empresa'
                  $hasError={!!errors.name}
                />
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  <MdAccountBalance />
                  CNPJ <RequiredNote />
                </Label>
                <Input
                  name='cnpj'
                  placeholder='CK.LZH.YDS/0001-91 ou 32.686.738/0001-40'
                  $hasError={!!errors.cnpj}
                  maxLength={18}
                  value={watch('cnpj') || ''}
                  onChange={e => {
                    const formatted = formatCNPJ(e.target.value);
                    setValue('cnpj', formatted, { shouldValidate: true });
                  }}
                />
                {errors.cnpj && (
                  <ErrorMessage>{errors.cnpj.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroupFull>
                <Label>
                  <MdBusiness />
                  Razão Social <RequiredNote />
                </Label>
                <Input
                  {...register('corporateName')}
                  placeholder='Digite a razão social'
                  $hasError={!!errors.corporateName}
                />
                {errors.corporateName && (
                  <ErrorMessage>{errors.corporateName.message}</ErrorMessage>
                )}
              </FormGroupFull>

              <FormGroup>
                <Label>
                  <MdEmail />
                  Email <RequiredNote />
                </Label>
                <Input
                  {...register('email')}
                  type='email'
                  placeholder='contato@empresa.com'
                  $hasError={!!errors.email}
                />
                {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  <MdPhone />
                  Telefone <RequiredNote />
                </Label>
                <Input
                  {...register('phone')}
                  placeholder='(11) 99999-9999'
                  $hasError={!!errors.phone}
                />
                {errors.phone && (
                  <ErrorMessage>{errors.phone.message}</ErrorMessage>
                )}
              </FormGroup>

              <AddressFields
                register={register}
                errors={errors}
                setValue={setValue}
              />

              {error && (
                <ErrorMessage
                  style={{ marginBottom: '24px', textAlign: 'center' }}
                >
                  {error}
                </ErrorMessage>
              )}
            </FormGrid>
          </form>
        </ModalContent>

        <ModalActions>
          <Button onClick={handleClose} type='button'>
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            type='button'
          >
            <MdSave />
            {isLoading ? 'Criando...' : 'Criar Empresa'}
          </Button>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CompanyCreationModal;
