import React, { useState, useEffect } from 'react';
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
  MdHome,
} from 'react-icons/md';
import { safeDayjs } from '../../utils/dateUtils';
import { useFinancial } from '../hooks/useFinancial';
import { useProperties } from '../hooks/useProperties';
import type {
  CreateFinancialTransactionData,
  UpdateFinancialTransactionData,
  FinancialTransaction,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  TransactionStatus,
} from '../types/financial';
import {
  TransactionTypeOptions,
  PaymentMethodOptions,
  TransactionStatusOptions,
  getCategoriesByType,
} from '../types/financial';
import { CustomDatePicker } from '../common/CustomDatePicker';
import { CurrencyInput } from '../modals/CurrencyInput';
import { getNumericValue } from '../../utils/masks';

// Styled Components
const DrawerOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.colors.cardBackground};
  box-shadow: -8px 0 32px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.5)'
        : 'rgba(0, 0, 0, 0.15)'};
  border-left: 1px solid ${props => props.theme.colors.border};
  transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const DrawerHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const DrawerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
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

const DrawerContent = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const PropertyInfo = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20 0%,
    ${props => props.theme.colors.primary}10 100%
  );
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}20;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }
`;

const PropertyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PropertySubtitle = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 500;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  padding: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.08)'};
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.primary}20;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: bold;
  font-size: 1rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  option {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    padding: 12px;
  }

  &::-ms-expand {
    display: none;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

const DrawerActions = styled.div`
  padding: 20px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 16px 24px;
    flex-direction: column;
    gap: 8px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.25);
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.35);
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
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active:not(:disabled) {
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

  @media (max-width: 768px) {
    width: 100%;
  }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

interface FinancialDrawerProps {
  open: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
  mode?: 'create' | 'edit';
  transaction?: FinancialTransaction;
  onSuccess?: () => void;
}

export const FinancialDrawer: React.FC<FinancialDrawerProps> = ({
  open,
  onClose,
  propertyId,
  propertyTitle,
  mode = 'create',
  transaction,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: '',
    paymentMethod: '',
    status: 'pending',
    transactionDate: null as any,
    propertyId: propertyId || '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { createTransaction, updateTransaction } = useFinancial();
  const { properties } = useProperties();

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setFormData({
        title: transaction.title || '',
        description: transaction.description || '',
        amount: transaction.amount ? transaction.amount.toString() : '',
        type: transaction.type || 'expense',
        category: transaction.category || '',
        paymentMethod: transaction.paymentMethod || '',
        status: transaction.status || 'pending',
        transactionDate: safeDayjs(transaction.transactionDate),
        propertyId: transaction.propertyId || propertyId || '',
        notes: transaction.notes || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        paymentMethod: '',
        status: 'pending',
        transactionDate: null,
        propertyId: propertyId || '',
        notes: '',
      });
    }
    setErrors({});
  }, [transaction, mode, propertyId, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.amount || getNumericValue(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Forma de pagamento é obrigatória';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Data da transação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData: CreateFinancialTransactionData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type as TransactionType,
        category: formData.category as TransactionCategory,
        amount: getNumericValue(formData.amount),
        transactionDate: formData.transactionDate
          ? safeDayjs(formData.transactionDate).toISOString()
          : new Date().toISOString(),
        paymentMethod: formData.paymentMethod as PaymentMethod,
        status: formData.status as TransactionStatus,
        notes: formData.notes.trim() || undefined,
        propertyId: formData.propertyId || undefined,
      };

      if (mode === 'edit' && transaction) {
        await updateTransaction(transaction.id, submitData);
      } else {
        await createTransaction(submitData);
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = getCategoriesByType(formData.type);

  return (
    <DrawerOverlay $isOpen={open}>
      <DrawerHeader>
        <DrawerTitle>
          {mode === 'edit' ? <MdEdit size={20} /> : <MdAdd size={20} />}
          {mode === 'edit' ? 'Editar Transação' : 'Nova Transação'}
        </DrawerTitle>
        <CloseButton onClick={onClose}>
          <MdClose size={18} />
        </CloseButton>
      </DrawerHeader>

      <DrawerContent>
        {propertyTitle && (
          <PropertyInfo>
            <PropertyTitle>
              <MdHome size={16} />
              {propertyTitle}
            </PropertyTitle>
            <PropertySubtitle>
              Transação associada a esta propriedade
            </PropertySubtitle>
          </PropertyInfo>
        )}

        <FormSection>
          <SectionTitle>
            <MdAttachMoney size={18} />
            Informações Básicas
          </SectionTitle>

          <FormGroup>
            <FormLabel>
              <MdDescription size={14} />
              Título <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormInput
              type='text'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder='Ex: Aluguel Janeiro/2025'
              disabled={loading}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <FormLabel>
              <MdDescription size={14} />
              Descrição
            </FormLabel>
            <FormInput
              type='text'
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder='Descreva a transação (opcional)...'
              disabled={loading}
            />
            {errors.description && (
              <ErrorMessage>{errors.description}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>
              <MdAttachMoney size={14} />
              Valor <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <CurrencyInput
              value={formData.amount}
              onChange={value => handleInputChange('amount', value)}
              placeholder='R$ 0,00'
              disabled={loading}
            />
            {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <FormLabel>
              <MdCategory size={14} />
              Tipo <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormSelect
              value={formData.type}
              onChange={e => {
                handleInputChange('type', e.target.value);
                handleInputChange('category', ''); // Reset category when type changes
              }}
              disabled={loading}
            >
              {TransactionTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>
              <MdCategory size={14} />
              Categoria <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormSelect
              value={formData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              disabled={loading}
            >
              <option value=''>Selecione uma categoria</option>
              {availableCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </FormSelect>
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <FormLabel>
              <MdPayment size={14} />
              Forma de Pagamento <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormSelect
              value={formData.paymentMethod}
              onChange={e => handleInputChange('paymentMethod', e.target.value)}
              disabled={loading}
            >
              <option value=''>Selecione uma forma de pagamento</option>
              {PaymentMethodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
            {errors.paymentMethod && (
              <ErrorMessage>{errors.paymentMethod}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>
              <MdCalendarToday size={14} />
              Data da Transação <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <CustomDatePicker
              value={formData.transactionDate}
              onChange={date => handleInputChange('transactionDate', date)}
              placeholder='Selecione a data'
              disabled={loading}
            />
            {errors.transactionDate && (
              <ErrorMessage>{errors.transactionDate}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>Status</FormLabel>
            <FormSelect
              value={formData.status}
              onChange={e => handleInputChange('status', e.target.value)}
              disabled={loading}
            >
              {TransactionStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <MdDescription size={18} />
            Observações
          </SectionTitle>

          <FormGroup>
            <FormLabel>Notas Adicionais</FormLabel>
            <FormTextarea
              value={formData.notes}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  handleInputChange('notes', e.target.value);
                }
              }}
              placeholder='Adicione observações sobre esta transação... (máx. 300 caracteres)'
              maxLength={300}
              disabled={loading}
            />
          </FormGroup>
        </FormSection>
      </DrawerContent>

      <DrawerActions>
        <Button onClick={onClose} $variant='secondary' disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} $variant='primary' disabled={loading}>
          <MdSave size={16} />
          {loading
            ? 'Salvando...'
            : mode === 'edit'
              ? 'Salvar Alterações'
              : 'Criar Transação'}
        </Button>
      </DrawerActions>
    </DrawerOverlay>
  );
};
