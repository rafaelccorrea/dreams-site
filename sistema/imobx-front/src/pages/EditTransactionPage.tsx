import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import type {
  UpdateFinancialTransactionData,
  FinancialTransaction,
} from '../types/financial';
import { PageContentShimmer } from '../components/shimmer';
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
  type: TransactionType | '';
  description: string;
  amount: string;
  category: TransactionCategory | '';
  paymentMethod: PaymentMethod | '';
  dueDate: string;
  paidDate: string;
  status: TransactionStatus | '';
  notes: string;
}

interface FormErrorsState {
  type?: string;
  description?: string;
  amount?: string;
  category?: string;
  paymentMethod?: string;
  dueDate?: string;
  paidDate?: string;
  status?: string;
}

const EditTransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { transactions, updateTransaction, getTransactions } = useFinancial();
  const [isLoading, setIsLoading] = useState(false);
  const [transaction, setTransaction] = useState<FinancialTransaction | null>(
    null
  );

  const [formData, setFormData] = useState<FormDataState>({
    type: '',
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    dueDate: '',
    paidDate: '',
    status: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrorsState>({});

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) {
        message.error('ID da transação não encontrado');
        navigate('/financial');
        return;
      }

      const existingTransaction = transactions.find(t => t.id === id);

      if (existingTransaction) {
        setTransaction(existingTransaction);
        setFormData({
          type: existingTransaction.type || '',
          description: existingTransaction.description || '',
          amount: existingTransaction.amount?.toString() || '',
          category: existingTransaction.category || '',
          paymentMethod: existingTransaction.paymentMethod || '',
          dueDate: existingTransaction.transactionDate
            ? new Date(existingTransaction.transactionDate)
                .toISOString()
                .split('T')[0]
            : '',
          paidDate: '',
          status: existingTransaction.status || '',
          notes: existingTransaction.notes || '',
        });
      } else {
        await getTransactions();
      }
    };

    loadTransaction();
  }, [id, transactions, navigate, getTransactions]);

  const handleChange = (field: keyof FormDataState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrorsState]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrorsState = {};

    if (!formData.type) newErrors.type = 'Tipo é obrigatório';
    if (!formData.description.trim())
      newErrors.description = 'Descrição é obrigatória';
    if (!formData.amount || getNumericValue(formData.amount) <= 0)
      newErrors.amount = 'Valor deve ser maior que zero';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.paymentMethod)
      newErrors.paymentMethod = 'Método de pagamento é obrigatório';
    if (!formData.dueDate)
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    if (!formData.status) newErrors.status = 'Status é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) return;

    const submitData: UpdateFinancialTransactionData = {
      type: formData.type as TransactionType,
      description: formData.description.trim(),
      amount: getNumericValue(formData.amount),
      category: formData.category as TransactionCategory,
      paymentMethod: formData.paymentMethod as PaymentMethod,
      transactionDate: new Date(formData.dueDate).toISOString(),
      status: formData.status as TransactionStatus,
      notes: formData.notes.trim() || undefined,
    };

    setIsLoading(true);
    try {
      await updateTransaction(id, submitData);
      message.success('Transação atualizada com sucesso!');
      navigate('/financial');
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      message.error('Erro ao atualizar transação');
    } finally {
      setIsLoading(false);
    }
  };

  if (!transaction) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PageContentShimmer />
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Editar Transação</PageTitle>
              <PageSubtitle>Atualize as informações da transação</PageSubtitle>
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
                <FieldLabel>
                  Descrição <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder='Ex: Aluguel janeiro/2025'
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

              <RowContainer>
                <FieldContainerWithError>
                  <FieldLabel>
                    Data de Vencimento <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldInput
                    type='date'
                    value={formData.dueDate}
                    onChange={e => handleChange('dueDate', e.target.value)}
                    $hasError={!!errors.dueDate}
                    disabled={isLoading}
                  />
                  {errors.dueDate && (
                    <ErrorMessage>{errors.dueDate}</ErrorMessage>
                  )}
                </FieldContainerWithError>

                <FieldContainerWithError>
                  <FieldLabel>Data de Pagamento</FieldLabel>
                  <FieldInput
                    type='date'
                    value={formData.paidDate}
                    onChange={e => handleChange('paidDate', e.target.value)}
                    $hasError={!!errors.paidDate}
                    disabled={isLoading}
                  />
                  {errors.paidDate && (
                    <ErrorMessage>{errors.paidDate}</ErrorMessage>
                  )}
                </FieldContainerWithError>
              </RowContainer>

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
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </FormActions>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default EditTransactionPage;
