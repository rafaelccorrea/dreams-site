import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import {
  MdSave,
  MdAttachMoney,
  MdDescription,
  MdArrowBack,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { CurrencyInput } from '../components/modals/CurrencyInput';
import { getNumericValue } from '../utils/masks';
import { useFinancial } from '../hooks/useFinancial';
import {
  TransactionTypeOptions,
  PaymentMethodOptions,
  TransactionStatusOptions,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  TransactionStatus,
} from '../types/financial';
import type { CreateFinancialTransactionData } from '../types/financial';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  FormContainer,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  FieldContainer,
  FieldLabel,
  RequiredIndicator,
  FieldInput,
  FieldSelect,
  FieldTextarea,
  FieldContainerWithError,
  ErrorMessage,
  RowContainer,
  FormActions,
  Button,
} from '../styles/pages/ClientFormPageStyles';

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

const NewTransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTransaction } = useFinancial();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    type: '',
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    transactionDate: '',
    status: '',
    notes: '',
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

    const submitData: CreateFinancialTransactionData = {
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

    setIsLoading(true);
    try {
      await createTransaction(submitData);
      message.success('Transação criada com sucesso!');
      navigate('/financial');
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      message.error('Erro ao criar transação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Nova Transação</PageTitle>
              <PageSubtitle>
                Cadastre uma nova transação financeira
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/financial')} type='button'>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </PageHeader>

          <FormContainer onSubmit={handleSubmit}>
            {/* Informações Básicas */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdAttachMoney size={20} />
                  Informações Básicas
                </SectionTitle>
                <SectionDescription>
                  Dados essenciais da transação
                </SectionDescription>
              </SectionHeader>

              <FieldContainerWithError>
                <FieldLabel>
                  Título <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder='Ex: Aluguel Janeiro/2025'
                  $hasError={!!errors.title}
                  disabled={isLoading}
                />
                {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
              </FieldContainerWithError>

              <RowContainer>
                <FieldContainerWithError>
                  <FieldLabel>
                    Tipo <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldSelect
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
                  </FieldSelect>
                  {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
                </FieldContainerWithError>

                <FieldContainerWithError>
                  <FieldLabel>
                    Valor <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <CurrencyInput
                    value={formData.amount}
                    onChange={value => handleChange('amount', value)}
                    hasError={!!errors.amount}
                    disabled={isLoading}
                  />
                  {errors.amount && (
                    <ErrorMessage>{errors.amount}</ErrorMessage>
                  )}
                </FieldContainerWithError>
              </RowContainer>

              <FieldContainerWithError>
                <FieldLabel>Descrição</FieldLabel>
                <FieldInput
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
              </FieldContainerWithError>

              <RowContainer>
                <FieldContainerWithError>
                  <FieldLabel>
                    Categoria <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldSelect
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
                  </FieldSelect>
                  {errors.category && (
                    <ErrorMessage>{errors.category}</ErrorMessage>
                  )}
                </FieldContainerWithError>

                <FieldContainerWithError>
                  <FieldLabel>
                    Método de Pagamento <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldSelect
                    value={formData.paymentMethod}
                    onChange={e =>
                      handleChange('paymentMethod', e.target.value)
                    }
                    $hasError={!!errors.paymentMethod}
                    disabled={isLoading}
                  >
                    <option value=''>Selecione...</option>
                    {PaymentMethodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FieldSelect>
                  {errors.paymentMethod && (
                    <ErrorMessage>{errors.paymentMethod}</ErrorMessage>
                  )}
                </FieldContainerWithError>
              </RowContainer>

              <FieldContainerWithError>
                <FieldLabel>
                  Data da Transação <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
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
              </FieldContainerWithError>

              <FieldContainerWithError>
                <FieldLabel>
                  Status <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldSelect
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
                </FieldSelect>
                {errors.status && <ErrorMessage>{errors.status}</ErrorMessage>}
              </FieldContainerWithError>
            </Section>

            {/* Observações */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <MdDescription size={20} />
                  Observações
                </SectionTitle>
                <SectionDescription>
                  Informações adicionais sobre a transação
                </SectionDescription>
              </SectionHeader>

              <FieldContainer>
                <FieldLabel>Notas Adicionais</FieldLabel>
                <FieldTextarea
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
              </FieldContainer>
            </Section>

            {/* Ações */}
            <FormActions>
              <Button
                type='button'
                $variant='secondary'
                onClick={() => navigate('/financial')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' $variant='primary' disabled={isLoading}>
                <MdSave size={18} />
                {isLoading ? 'Salvando...' : 'Criar Transação'}
              </Button>
            </FormActions>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default NewTransactionPage;
