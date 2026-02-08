import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdArrowBack, MdSave, MdInfo } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { CurrencyInput } from '../components/modals/CurrencyInput';
import { getNumericValue, formatCurrency } from '../utils/masks';
import { usePropertyExpenses } from '../hooks/usePropertyExpenses';
import { propertyExpensesApi } from '../services/propertyExpensesApi';
import { CreatePropertyExpenseShimmer } from '../components/shimmer/CreatePropertyExpenseShimmer';
import {
  PropertyExpenseTypeOptions,
  PropertyExpenseType,
  RecurrenceFrequencyOptions,
  RecurrenceFrequency,
  NotificationAdvanceDaysOptions,
  NotificationAdvanceDays,
  type UpdatePropertyExpenseData,
  type RecurrenceConfig,
} from '../types/propertyExpense';
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
import styled from 'styled-components';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const InfoText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`;

interface FormDataState {
  title: string;
  description: string;
  type: PropertyExpenseType;
  amount: string;
  dueDate: string;
  isRecurring: boolean;
  recurrenceFrequency: RecurrenceFrequency;
  recurrenceDayOfMonth: number;
  recurrenceMonthOfYear: number;
  recurrenceEndDate: string;
  recurrenceOccurrences: number;
  enableNotification: boolean;
  notificationAdvanceDays: NotificationAdvanceDays;
  createFinancialPending: boolean;
  notes: string;
  documentNumber: string;
}

const EditPropertyExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId, expenseId } = useParams<{
    propertyId: string;
    expenseId: string;
  }>();
  const { updateExpense, fetchExpenseById } = usePropertyExpenses();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(true);

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    type: PropertyExpenseType.OTHER,
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurrenceFrequency: RecurrenceFrequency.MONTHLY,
    recurrenceDayOfMonth: new Date().getDate(),
    recurrenceMonthOfYear: new Date().getMonth() + 1,
    recurrenceEndDate: '',
    recurrenceOccurrences: 0,
    enableNotification: true,
    notificationAdvanceDays: NotificationAdvanceDays.THIRTY,
    createFinancialPending: false,
    notes: '',
    documentNumber: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataState, string>>
  >({});

  useEffect(() => {
    if (propertyId && expenseId) {
      loadExpense();
    }
  }, [propertyId, expenseId]);

  const loadExpense = async () => {
    if (!propertyId || !expenseId) return;
    try {
      setLoadingExpense(true);
      const expense = await propertyExpensesApi.getExpenseById(
        propertyId,
        expenseId
      );

      // Converter valor numérico para string formatada para o CurrencyInput
      // O CurrencyInput espera uma string formatada (ex: "1.500,00")
      // Multiplicar por 100 para converter para centavos e depois formatar
      const amountInCents = Math.round(expense.amount * 100);
      const formattedAmount = formatCurrency(amountInCents.toString());

      setFormData({
        title: expense.title,
        description: expense.description || '',
        type: expense.type,
        amount: formattedAmount,
        dueDate: expense.dueDate.split('T')[0],
        isRecurring: expense.isRecurring,
        recurrenceFrequency:
          expense.recurrenceConfig?.frequency || RecurrenceFrequency.MONTHLY,
        recurrenceDayOfMonth:
          expense.recurrenceConfig?.dayOfMonth || new Date().getDate(),
        recurrenceMonthOfYear:
          expense.recurrenceConfig?.monthOfYear || new Date().getMonth() + 1,
        recurrenceEndDate:
          expense.recurrenceConfig?.endDate?.split('T')[0] || '',
        recurrenceOccurrences: expense.recurrenceConfig?.occurrences || 0,
        enableNotification: expense.enableNotification,
        notificationAdvanceDays:
          expense.notificationAdvanceDays || NotificationAdvanceDays.THIRTY,
        createFinancialPending: expense.createFinancialPending,
        notes: expense.notes || '',
        documentNumber: expense.documentNumber || '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar despesa');
      navigate(propertyId ? `/properties/${propertyId}` : '/properties');
    } finally {
      setLoadingExpense(false);
    }
  };

  const handleChange = (field: keyof FormDataState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Verificar se os campos obrigatórios estão preenchidos (para habilitar botão)
  const isFormValid = (): boolean => {
    const hasTitle = formData.title.trim().length > 0;
    const hasAmount = formData.amount && getNumericValue(formData.amount) > 0;
    const hasDueDate = formData.dueDate && formData.dueDate.length > 0;

    return hasTitle && hasAmount && hasDueDate;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormDataState, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (formData.title.length > 255)
      newErrors.title = 'Título deve ter no máximo 255 caracteres';
    if (!formData.amount || getNumericValue(formData.amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }
    const amountValue = getNumericValue(formData.amount);
    if (amountValue < 0) {
      newErrors.amount = 'Valor não pode ser negativo';
    }
    // Verificar casas decimais (máximo 2)
    // No formato brasileiro, vírgula é separador decimal e ponto é separador de milhares
    const amountStr = formData.amount.replace(/[^\d,.-]/g, '');
    if (amountStr.includes(',')) {
      // Formato brasileiro: vírgula é decimal
      const parts = amountStr.split(',');
      if (parts.length > 1) {
        const decimalPart = parts[parts.length - 1]; // Pega a última parte após a vírgula
        if (decimalPart && decimalPart.length > 2) {
          newErrors.amount = 'Valor deve ter no máximo 2 casas decimais';
        }
      }
    } else if (amountStr.includes('.') && !amountStr.includes(',')) {
      // Formato internacional: ponto é decimal (sem vírgula)
      const parts = amountStr.split('.');
      if (parts.length > 1) {
        const decimalPart = parts[parts.length - 1];
        if (decimalPart && decimalPart.length > 2) {
          newErrors.amount = 'Valor deve ter no máximo 2 casas decimais';
        }
      }
    }
    if (!formData.dueDate)
      newErrors.dueDate = 'Data de vencimento é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('📝 handleSubmit chamado (edição)', {
      propertyId,
      expenseId,
      formData,
    });

    if (!validateForm() || !propertyId || !expenseId) {
      console.log('❌ Validação falhou ou IDs não existem');
      return;
    }

    const recurrenceConfig: RecurrenceConfig | undefined = formData.isRecurring
      ? {
          frequency: formData.recurrenceFrequency,
          dayOfMonth:
            formData.recurrenceFrequency === RecurrenceFrequency.MONTHLY ||
            formData.recurrenceFrequency === RecurrenceFrequency.YEARLY
              ? formData.recurrenceDayOfMonth
              : undefined,
          monthOfYear:
            formData.recurrenceFrequency === RecurrenceFrequency.YEARLY
              ? formData.recurrenceMonthOfYear
              : undefined,
          endDate: formData.recurrenceEndDate || undefined,
          occurrences:
            formData.recurrenceOccurrences > 0
              ? formData.recurrenceOccurrences
              : undefined,
        }
      : undefined;

    const submitData: UpdatePropertyExpenseData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      type: formData.type,
      amount: getNumericValue(formData.amount),
      dueDate: formData.dueDate,
      isRecurring: formData.isRecurring,
      recurrenceConfig,
      enableNotification: formData.enableNotification,
      notificationAdvanceDays: formData.enableNotification
        ? formData.notificationAdvanceDays
        : undefined,
      createFinancialPending: formData.createFinancialPending,
      notes: formData.notes.trim() || undefined,
      documentNumber: formData.documentNumber.trim() || undefined,
    };

    setIsLoading(true);
    try {
      console.log('🔄 Iniciando atualização de despesa...', {
        propertyId,
        expenseId,
        submitData,
      });
      const result = await updateExpense(propertyId, expenseId, submitData);
      console.log('✅ Despesa atualizada com sucesso:', result);
      toast.success('Despesa atualizada com sucesso!');
      // Navegar após sucesso
      navigate(`/properties/${propertyId}`);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar despesa no handleSubmit:', error);
      toast.error(error.message || 'Erro ao atualizar despesa');
      // Não navegar em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingExpense) {
    return <CreatePropertyExpenseShimmer />;
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Editar Despesa</PageTitle>
              <PageSubtitle>Atualize os dados da despesa</PageSubtitle>
            </PageTitleContainer>
            <BackButton
              onClick={() =>
                navigate(
                  propertyId ? `/properties/${propertyId}` : '/properties'
                )
              }
              type='button'
            >
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </PageHeader>

          <FormContainer>
            <form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }}
              noValidate
            >
              <Section>
                <SectionHeader>
                  <SectionTitle>Informações Básicas</SectionTitle>
                  <SectionDescription>
                    Dados essenciais da despesa
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
                    placeholder='Ex: IPTU 2025'
                    $hasError={!!errors.title}
                  />
                  {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                </FieldContainerWithError>

                <FieldContainer>
                  <FieldLabel>Descrição</FieldLabel>
                  <FieldTextarea
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder='Descrição detalhada da despesa (opcional)'
                    rows={4}
                  />
                </FieldContainer>

                <RowContainer>
                  <FieldContainerWithError>
                    <FieldLabel>
                      Tipo <RequiredIndicator>*</RequiredIndicator>
                    </FieldLabel>
                    <FieldSelect
                      value={formData.type}
                      onChange={e =>
                        handleChange(
                          'type',
                          e.target.value as PropertyExpenseType
                        )
                      }
                      $hasError={!!errors.type}
                    >
                      {PropertyExpenseTypeOptions.map(option => (
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
                      placeholder='R$ 0,00'
                      hasError={!!errors.amount}
                    />
                    {errors.amount && (
                      <ErrorMessage>{errors.amount}</ErrorMessage>
                    )}
                  </FieldContainerWithError>
                </RowContainer>

                <FieldContainerWithError>
                  <FieldLabel>
                    Data de Vencimento <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldInput
                    type='date'
                    value={formData.dueDate}
                    onChange={e => handleChange('dueDate', e.target.value)}
                    $hasError={!!errors.dueDate}
                  />
                  {errors.dueDate && (
                    <ErrorMessage>{errors.dueDate}</ErrorMessage>
                  )}
                </FieldContainerWithError>
              </Section>

              <Section>
                <SectionHeader>
                  <SectionTitle>Recorrência</SectionTitle>
                  <SectionDescription>
                    Configure se a despesa se repete periodicamente
                  </SectionDescription>
                </SectionHeader>

                <CheckboxContainer>
                  <Checkbox
                    type='checkbox'
                    checked={formData.isRecurring}
                    onChange={e =>
                      handleChange('isRecurring', e.target.checked)
                    }
                  />
                  <CheckboxLabel>Despesa Recorrente</CheckboxLabel>
                </CheckboxContainer>

                {formData.isRecurring && (
                  <>
                    <RowContainer>
                      <FieldContainer>
                        <FieldLabel>Frequência</FieldLabel>
                        <FieldSelect
                          value={formData.recurrenceFrequency}
                          onChange={e =>
                            handleChange(
                              'recurrenceFrequency',
                              e.target.value as RecurrenceFrequency
                            )
                          }
                        >
                          {RecurrenceFrequencyOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </FieldSelect>
                      </FieldContainer>

                      {(formData.recurrenceFrequency ===
                        RecurrenceFrequency.MONTHLY ||
                        formData.recurrenceFrequency ===
                          RecurrenceFrequency.YEARLY) && (
                        <FieldContainer>
                          <FieldLabel>Dia do Mês</FieldLabel>
                          <FieldInput
                            type='number'
                            min='1'
                            max='31'
                            value={formData.recurrenceDayOfMonth}
                            onChange={e =>
                              handleChange(
                                'recurrenceDayOfMonth',
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </FieldContainer>
                      )}

                      {formData.recurrenceFrequency ===
                        RecurrenceFrequency.YEARLY && (
                        <FieldContainer>
                          <FieldLabel>Mês</FieldLabel>
                          <FieldInput
                            type='number'
                            min='1'
                            max='12'
                            value={formData.recurrenceMonthOfYear}
                            onChange={e =>
                              handleChange(
                                'recurrenceMonthOfYear',
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </FieldContainer>
                      )}
                    </RowContainer>

                    <RowContainer>
                      <FieldContainer>
                        <FieldLabel>Data Final (opcional)</FieldLabel>
                        <FieldInput
                          type='date'
                          value={formData.recurrenceEndDate}
                          onChange={e =>
                            handleChange('recurrenceEndDate', e.target.value)
                          }
                        />
                      </FieldContainer>

                      <FieldContainer>
                        <FieldLabel>
                          Número de Ocorrências (opcional)
                        </FieldLabel>
                        <FieldInput
                          type='number'
                          min='1'
                          value={formData.recurrenceOccurrences || ''}
                          onChange={e =>
                            handleChange(
                              'recurrenceOccurrences',
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </FieldContainer>
                    </RowContainer>
                  </>
                )}
              </Section>

              <Section>
                <SectionHeader>
                  <SectionTitle>Notificações</SectionTitle>
                  <SectionDescription>
                    Configure alertas antes do vencimento
                  </SectionDescription>
                </SectionHeader>

                <CheckboxContainer>
                  <Checkbox
                    type='checkbox'
                    checked={formData.enableNotification}
                    onChange={e =>
                      handleChange('enableNotification', e.target.checked)
                    }
                  />
                  <CheckboxLabel>Enviar Notificação</CheckboxLabel>
                </CheckboxContainer>

                {formData.enableNotification && (
                  <FieldContainer>
                    <FieldLabel>Dias de Antecedência</FieldLabel>
                    <FieldSelect
                      value={formData.notificationAdvanceDays}
                      onChange={e =>
                        handleChange(
                          'notificationAdvanceDays',
                          parseInt(e.target.value) as NotificationAdvanceDays
                        )
                      }
                    >
                      {NotificationAdvanceDaysOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </FieldSelect>
                  </FieldContainer>
                )}
              </Section>

              <Section>
                <SectionHeader>
                  <SectionTitle>Informações Adicionais</SectionTitle>
                  <SectionDescription>
                    Dados complementares da despesa
                  </SectionDescription>
                </SectionHeader>

                <FieldContainer>
                  <FieldLabel>Observações</FieldLabel>
                  <FieldTextarea
                    value={formData.notes}
                    onChange={e => handleChange('notes', e.target.value)}
                    placeholder='Observações adicionais sobre a despesa (opcional)'
                    rows={4}
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Número do Documento</FieldLabel>
                  <FieldInput
                    type='text'
                    value={formData.documentNumber}
                    onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 100) {
                        handleChange('documentNumber', value);
                      }
                    }}
                    placeholder='Ex: DOC-12345, Boleto 001, etc. (opcional)'
                    maxLength={100}
                  />
                  {formData.documentNumber.length > 0 && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        marginTop: '4px',
                      }}
                    >
                      {formData.documentNumber.length}/100 caracteres
                    </div>
                  )}
                </FieldContainer>
              </Section>

              <Section>
                <SectionHeader>
                  <SectionTitle>Integração Financeira</SectionTitle>
                  <SectionDescription>
                    Opções de integração com módulo financeiro
                  </SectionDescription>
                </SectionHeader>

                <CheckboxContainer>
                  <Checkbox
                    type='checkbox'
                    checked={formData.createFinancialPending}
                    onChange={e =>
                      handleChange('createFinancialPending', e.target.checked)
                    }
                  />
                  <CheckboxLabel>Criar Pendência Financeira</CheckboxLabel>
                </CheckboxContainer>
                <InfoBox>
                  <MdInfo
                    size={16}
                    style={{ marginTop: '2px', flexShrink: 0 }}
                  />
                  <InfoText>
                    Quando marcado, uma pendência será criada automaticamente no
                    módulo financeiro.
                  </InfoText>
                </InfoBox>
              </Section>

              <FormActions>
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={() =>
                    navigate(
                      propertyId ? `/properties/${propertyId}` : '/properties'
                    )
                  }
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type='button'
                  $variant='primary'
                  disabled={isLoading || !isFormValid()}
                  onClick={async e => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(
                      '🔘 Botão salvar clicado - chamando handleSubmit diretamente'
                    );
                    await handleSubmit();
                  }}
                >
                  <MdSave size={18} />
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </FormActions>
            </form>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default EditPropertyExpensePage;
