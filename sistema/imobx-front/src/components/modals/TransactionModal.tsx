import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdSave,
  MdAttachMoney,
  MdDescription,
  MdCategory,
  MdPayment,
  MdCalendarToday,
  MdAdd,
  MdEdit,
} from 'react-icons/md';
import type {
  CreateFinancialTransactionData,
  UpdateFinancialTransactionData,
} from '../../types/financial';
import {
  TransactionTypeOptions,
  PaymentMethodOptions,
  TransactionStatusOptions,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  TransactionStatus,
} from '../../types/financial';
import { CustomDatePicker } from '../common/CustomDatePicker';
import { CurrencyInput } from './CurrencyInput';
import { getNumericValue } from '../../utils/masks';

// Modal Overlay
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Modal Container - Mais largo
const ModalContainer = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 24px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};

  @keyframes slideIn {
    from {
      transform: scale(0.95) translateY(20px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }

  @media (max-width: 1024px) {
    max-width: 95%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.cardBackground};
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 24px 24px 0 0;

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px 20px 0 0;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 12px;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Modal Content - Sem cards aninhados
const ModalContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  &:not(:first-child) {
    margin-top: 32px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 10px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 1rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError
          ? `${props.theme.colors.error}20`
          : `${props.theme.colors.primary}20`};
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError
          ? `${props.theme.colors.error}20`
          : `${props.theme.colors.primary}20`};
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 12px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError
          ? `${props.theme.colors.error}20`
          : `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.8125rem;
  font-weight: 500;
  margin-top: 4px;
`;

// Ações do formulário - Sem fixar no bottom
const FormActions = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 16px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  min-width: 140px;
  justify-content: center;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-2px);
          box-shadow: 0 8px 16px ${props.theme.colors.primary}40;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.backgroundSecondary};
          border-color: ${props.theme.colors.primary};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 24px;
  }
`;

// Types for form data
interface FormDataState {
  title: string;
  type: TransactionType | '';
  description: string;
  amount: string;
  category: TransactionCategory | '';
  paymentMethod: PaymentMethod | '';
  transactionDate: string;
  status: TransactionStatus | '';
  notes: string;
}

interface FormErrorsState {
  title?: string;
  type?: string;
  description?: string;
  amount?: string;
  category?: string;
  paymentMethod?: string;
  transactionDate?: string;
  status?: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateFinancialTransactionData | UpdateFinancialTransactionData
  ) => Promise<void>;
  initialData?: UpdateFinancialTransactionData;
  isLoading?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState<FormDataState>({
    title: initialData?.title || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || '',
    paymentMethod: initialData?.paymentMethod || '',
    transactionDate: initialData?.transactionDate
      ? new Date(initialData.transactionDate).toISOString().split('T')[0]
      : '',
    status: initialData?.status || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<FormErrorsState>({});

  const handleChange = (field: keyof FormDataState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrorsState]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrorsState = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    if (!formData.amount || getNumericValue(formData.amount) <= 0)
      newErrors.amount = 'Valor deve ser maior que zero';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.paymentMethod)
      newErrors.paymentMethod = 'Método de pagamento é obrigatório';
    if (!formData.transactionDate)
      newErrors.transactionDate = 'Data da transação é obrigatória';
    if (!formData.status) newErrors.status = 'Status é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData:
      | CreateFinancialTransactionData
      | UpdateFinancialTransactionData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type as TransactionType,
      amount: getNumericValue(formData.amount),
      category: formData.category as TransactionCategory,
      transactionDate: new Date(formData.transactionDate).toISOString(),
      paymentMethod: formData.paymentMethod as PaymentMethod,
      status: formData.status as TransactionStatus,
      notes: formData.notes.trim() || undefined,
    };

    await onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            {isEditMode ? <MdEdit size={28} /> : <MdAdd size={28} />}
            {isEditMode ? 'Editar Transação' : 'Nova Transação'}
          </ModalTitle>
          <CloseButton onClick={onClose} type='button'>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <form onSubmit={handleSubmit}>
            {/* Informações Básicas */}
            <SectionTitle>
              <MdAttachMoney size={20} />
              Informações Básicas
            </SectionTitle>

            <FormGrid>
              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <Label>
                  Título <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type='text'
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder='Ex: Aluguel Janeiro/2025'
                  $hasError={!!errors.title}
                  disabled={isLoading}
                />
                {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Tipo <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  value={formData.type}
                  onChange={e => handleChange('type', e.target.value)}
                  $hasError={!!errors.type}
                  disabled={isLoading}
                >
                  <option value=''>Selecione...</option>
                  {TransactionTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>
                  Valor <RequiredMark>*</RequiredMark>
                </Label>
                <CurrencyInput
                  value={formData.amount}
                  onChange={value => handleChange('amount', value)}
                  hasError={!!errors.amount}
                  disabled={isLoading}
                />
                {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
              </FormGroup>

              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <Label>Descrição</Label>
                <Input
                  type='text'
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder='Descrição adicional (opcional)'
                  $hasError={!!errors.description}
                  disabled={isLoading}
                />
                {errors.description && (
                  <ErrorMessage>{errors.description}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Categoria <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  value={formData.category}
                  onChange={e => handleChange('category', e.target.value)}
                  $hasError={!!errors.category}
                  disabled={isLoading}
                >
                  <option value=''>Selecione...</option>
                  <option value='rent'>Aluguel</option>
                  <option value='sale'>Venda</option>
                  <option value='commission'>Comissão</option>
                  <option value='maintenance'>Manutenção</option>
                  <option value='utilities'>Utilidades</option>
                  <option value='taxes'>Impostos</option>
                  <option value='fees'>Taxas</option>
                  <option value='other'>Outros</option>
                </Select>
                {errors.category && (
                  <ErrorMessage>{errors.category}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Método de Pagamento <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onChange={e => handleChange('paymentMethod', e.target.value)}
                  $hasError={!!errors.paymentMethod}
                  disabled={isLoading}
                >
                  <option value=''>Selecione...</option>
                  {PaymentMethodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.paymentMethod && (
                  <ErrorMessage>{errors.paymentMethod}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Data da Transação <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  type='date'
                  value={formData.transactionDate}
                  onChange={e =>
                    handleChange('transactionDate', e.target.value)
                  }
                  $hasError={!!errors.transactionDate}
                  disabled={isLoading}
                />
                {errors.transactionDate && (
                  <ErrorMessage>{errors.transactionDate}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Status <RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  value={formData.status}
                  onChange={e => handleChange('status', e.target.value)}
                  $hasError={!!errors.status}
                  disabled={isLoading}
                >
                  <option value=''>Selecione...</option>
                  {TransactionStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.status && <ErrorMessage>{errors.status}</ErrorMessage>}
              </FormGroup>
            </FormGrid>

            {/* Observações */}
            <SectionTitle>
              <MdDescription size={20} />
              Observações
            </SectionTitle>

            <FormGroup>
              <Label>Notas Adicionais</Label>
              <TextArea
                value={formData.notes}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    handleChange('notes', e.target.value);
                  }
                }}
                placeholder='Adicione observações ou detalhes relevantes... (máx. 300 caracteres)'
                maxLength={300}
                disabled={isLoading}
              />
            </FormGroup>

            {/* Ações */}
            <FormActions>
              <Button
                type='button'
                $variant='secondary'
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' $variant='primary' disabled={isLoading}>
                <MdSave size={18} />
                {isLoading
                  ? 'Salvando...'
                  : isEditMode
                    ? 'Salvar Alterações'
                    : 'Criar Transação'}
              </Button>
            </FormActions>
          </form>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};
