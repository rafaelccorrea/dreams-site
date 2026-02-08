import React, { useState, useEffect } from 'react';
import { CustomDatePicker } from '../common/CustomDatePicker';
import { CurrencyInput } from './CurrencyInput';
import { getNumericValue } from '../../utils/masks';
import { useOptimizedModal } from '../../hooks/useOptimizedModal';
import {
  OptimizedModalOverlay,
  OptimizedModalContainer,
  OptimizedModalHeader,
  OptimizedModalHeaderContent,
  OptimizedModalTitle,
  OptimizedModalSubtitle,
  OptimizedModalCloseButton,
  OptimizedModalContent,
  OptimizedModalFooter,
  OptimizedFormSection,
  OptimizedFormSectionTitle,
  OptimizedFormGrid,
  OptimizedFormGroup,
  OptimizedFormLabel,
  OptimizedRequiredIndicator,
  OptimizedFormInput,
  OptimizedFormTextarea,
  OptimizedFormSelect,
  OptimizedErrorMessage,
  OptimizedButton,
  OptimizedInfoBox,
  OptimizedInfoText,
} from '../../styles/components/OptimizedModalStyles';
import {
  MdClose,
  MdAttachMoney,
  MdDescription,
  MdCategory,
  MdPayment,
  MdCalendarToday,
  MdSave,
  MdAdd,
  MdEdit,
  MdInfo,
} from 'react-icons/md';
import {
  TransactionTypeOptions,
  PaymentMethodOptions,
  TransactionStatusOptions,
  getCategoriesByType,
} from '../../types/financial';

interface OptimizedTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  title: string;
  properties?: any[];
  initialData?: any;
  isLoading?: boolean;
}

export const OptimizedTransactionModal: React.FC<
  OptimizedTransactionModalProps
> = ({
  isOpen,
  onClose,
  onSave,
  title,
  properties = [],
  initialData,
  isLoading = false,
}) => {
  const { handleOverlayClick } = useOptimizedModal({
    onClose,
    closeOnOverlayClick: true,
    closeOnEscape: true,
  });

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    paymentMethod: '',
    status: 'completed',
    transactionDate: null,
    propertyId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Inicializar dados do formulário
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          description: initialData.description || '',
          amount: initialData.amount?.toString() || '',
          type: initialData.type || 'expense',
          category: initialData.category || '',
          paymentMethod: initialData.paymentMethod || '',
          status: initialData.status || 'completed',
          transactionDate: initialData.transactionDate || null,
          propertyId: initialData.propertyId || '',
          notes: initialData.notes || '',
        });
      } else {
        setFormData({
          description: '',
          amount: '',
          type: 'expense',
          category: '',
          paymentMethod: '',
          status: 'completed',
          transactionDate: null,
          propertyId: '',
          notes: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Data da transação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave({
        ...formData,
        amount: parseFloat(formData.amount),
      });
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const getTypeIcon = () => {
    return formData.type === 'income' ? <MdAttachMoney /> : <MdAttachMoney />;
  };

  const getTypeColor = () => {
    return formData.type === 'income' ? '#10b981' : '#ef4444';
  };

  if (!isOpen) return null;

  return (
    <OptimizedModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <OptimizedModalContainer
        $isOpen={isOpen}
        onClick={e => e.stopPropagation()}
      >
        <OptimizedModalHeader>
          <OptimizedModalHeaderContent>
            <div>
              <OptimizedModalTitle>
                {getTypeIcon()}
                {title}
              </OptimizedModalTitle>
              <OptimizedModalSubtitle>
                {formData.type === 'income'
                  ? 'Registre uma nova receita'
                  : 'Registre uma nova despesa'}
              </OptimizedModalSubtitle>
            </div>
            <OptimizedModalCloseButton onClick={onClose} disabled={isLoading}>
              <MdClose />
            </OptimizedModalCloseButton>
          </OptimizedModalHeaderContent>
        </OptimizedModalHeader>

        <OptimizedModalContent>
          <form onSubmit={handleSubmit}>
            <OptimizedFormSection>
              <OptimizedFormSectionTitle>
                <MdDescription />
                Informações Básicas
              </OptimizedFormSectionTitle>

              <OptimizedFormGrid>
                <OptimizedFormGroup>
                  <OptimizedFormLabel>
                    Descrição
                    <OptimizedRequiredIndicator>*</OptimizedRequiredIndicator>
                  </OptimizedFormLabel>
                  <OptimizedFormInput
                    type='text'
                    value={formData.description}
                    onChange={e =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder='Descreva a transação'
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <OptimizedErrorMessage>
                      {errors.description}
                    </OptimizedErrorMessage>
                  )}
                </OptimizedFormGroup>

                <OptimizedFormGroup>
                  <OptimizedFormLabel>
                    Valor
                    <OptimizedRequiredIndicator>*</OptimizedRequiredIndicator>
                  </OptimizedFormLabel>
                  <CurrencyInput
                    value={formData.amount}
                    onChange={value => handleInputChange('amount', value)}
                    placeholder='0,00'
                    disabled={isLoading}
                  />
                  {errors.amount && (
                    <OptimizedErrorMessage>
                      {errors.amount}
                    </OptimizedErrorMessage>
                  )}
                </OptimizedFormGroup>

                <OptimizedFormGroup>
                  <OptimizedFormLabel>
                    Tipo
                    <OptimizedRequiredIndicator>*</OptimizedRequiredIndicator>
                  </OptimizedFormLabel>
                  <OptimizedFormSelect
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    disabled={isLoading}
                  >
                    {TransactionTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </OptimizedFormSelect>
                  {errors.type && (
                    <OptimizedErrorMessage>{errors.type}</OptimizedErrorMessage>
                  )}
                </OptimizedFormGroup>

                <OptimizedFormGroup>
                  <OptimizedFormLabel>
                    Categoria
                    <OptimizedRequiredIndicator>*</OptimizedRequiredIndicator>
                  </OptimizedFormLabel>
                  <OptimizedFormSelect
                    value={formData.category}
                    onChange={e =>
                      handleInputChange('category', e.target.value)
                    }
                    disabled={isLoading}
                  >
                    <option value=''>Selecione uma categoria</option>
                    {getCategoriesByType(formData.type).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </OptimizedFormSelect>
                  {errors.category && (
                    <OptimizedErrorMessage>
                      {errors.category}
                    </OptimizedErrorMessage>
                  )}
                </OptimizedFormGroup>
              </OptimizedFormGrid>
            </OptimizedFormSection>

            <OptimizedFormSection>
              <OptimizedFormSectionTitle>
                <MdPayment />
                Detalhes do Pagamento
              </OptimizedFormSectionTitle>

              <OptimizedFormGrid>
                <OptimizedFormGroup>
                  <OptimizedFormLabel>Método de Pagamento</OptimizedFormLabel>
                  <OptimizedFormSelect
                    value={formData.paymentMethod}
                    onChange={e =>
                      handleInputChange('paymentMethod', e.target.value)
                    }
                    disabled={isLoading}
                  >
                    <option value=''>Selecione um método</option>
                    {PaymentMethodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </OptimizedFormSelect>
                </OptimizedFormGroup>

                <OptimizedFormGroup>
                  <OptimizedFormLabel>Status</OptimizedFormLabel>
                  <OptimizedFormSelect
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                    disabled={isLoading}
                  >
                    {TransactionStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </OptimizedFormSelect>
                </OptimizedFormGroup>

                <OptimizedFormGroup>
                  <OptimizedFormLabel>
                    Data da Transação
                    <OptimizedRequiredIndicator>*</OptimizedRequiredIndicator>
                  </OptimizedFormLabel>
                  <CustomDatePicker
                    value={formData.transactionDate}
                    onChange={date =>
                      handleInputChange('transactionDate', date)
                    }
                    placeholder='Selecione a data'
                    disabled={isLoading}
                  />
                  {errors.transactionDate && (
                    <OptimizedErrorMessage>
                      {errors.transactionDate}
                    </OptimizedErrorMessage>
                  )}
                </OptimizedFormGroup>

                {properties.length > 0 && (
                  <OptimizedFormGroup>
                    <OptimizedFormLabel>Propriedade</OptimizedFormLabel>
                    <OptimizedFormSelect
                      value={formData.propertyId}
                      onChange={e =>
                        handleInputChange('propertyId', e.target.value)
                      }
                      disabled={isLoading}
                    >
                      <option value=''>Selecione uma propriedade</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.title}
                        </option>
                      ))}
                    </OptimizedFormSelect>
                  </OptimizedFormGroup>
                )}
              </OptimizedFormGrid>
            </OptimizedFormSection>

            <OptimizedFormSection>
              <OptimizedFormSectionTitle>
                <MdInfo />
                Observações
              </OptimizedFormSectionTitle>

              <OptimizedFormGroup>
                <OptimizedFormLabel>Notas Adicionais</OptimizedFormLabel>
                <OptimizedFormTextarea
                  value={formData.notes}
                  onChange={e => {
                    if (e.target.value.length <= 300) {
                      handleInputChange('notes', e.target.value);
                    }
                  }}
                  placeholder='Observações sobre a transação (máx. 300 caracteres)'
                  disabled={isLoading}
                  maxLength={300}
                  rows={3}
                />
              </OptimizedFormGroup>
            </OptimizedFormSection>
          </form>
        </OptimizedModalContent>

        <OptimizedModalFooter>
          <OptimizedButton
            type='button'
            $variant='secondary'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </OptimizedButton>

          <OptimizedButton
            type='submit'
            $variant='primary'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ccc',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Salvando...
              </>
            ) : (
              <>
                <MdSave />
                Salvar Transação
              </>
            )}
          </OptimizedButton>
        </OptimizedModalFooter>
      </OptimizedModalContainer>
    </OptimizedModalOverlay>
  );
};

export default OptimizedTransactionModal;
