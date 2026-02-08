import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdArrowBack, MdSave, MdInfo } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { CurrencyInput } from '../components/modals/CurrencyInput';
import { getNumericValue } from '../utils/masks';
import { usePropertyExpenses } from '../hooks/usePropertyExpenses';
import { propertyApi } from '../services/propertyApi';
import { CreatePropertyExpenseShimmer } from '../components/shimmer/CreatePropertyExpenseShimmer';
import {
  PropertyExpenseTypeOptions,
  PropertyExpenseType,
  RecurrenceFrequencyOptions,
  RecurrenceFrequency,
  NotificationAdvanceDaysOptions,
  NotificationAdvanceDays,
  type CreatePropertyExpenseData,
  type RecurrenceConfig,
} from '../types/propertyExpense';
import type { Property } from '../types/property';
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

const CreatePropertyExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams<{ propertyId: string }>();
  const { createExpense } = usePropertyExpenses();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);

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
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const loadProperty = async () => {
    if (!propertyId) return;
    try {
      setLoadingProperty(true);
      const propertyData = await propertyApi.getPropertyById(propertyId);
      setProperty(propertyData);
    } catch (error) {
      toast.error('Erro ao carregar propriedade');
      navigate('/properties');
    } finally {
      setLoadingProperty(false);
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

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (formData.title.length > 255) {
      newErrors.title = 'Título deve ter no máximo 255 caracteres';
    }
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
    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }

    console.log('🔍 Validação do formulário:', {
      hasErrors: Object.keys(newErrors).length > 0,
      errors: newErrors,
      formData: {
        title: formData.title,
        amount: formData.amount,
        dueDate: formData.dueDate,
        propertyId,
      },
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      console.log('❌ Formulário inválido, erros:', newErrors);
      // Mostrar toast com erros
      const errorMessages = Object.values(newErrors).filter(Boolean);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      }
    }

    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    // Prevenir reload da página - CRÍTICO
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('📝 handleSubmit chamado', { propertyId, formData });

    if (!propertyId) {
      console.error('❌ propertyId não existe!');
      toast.error('ID da propriedade não encontrado');
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      console.log('❌ Validação falhou');
      return;
    }

    console.log('✅ Validação passou, preparando dados...');

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

    const submitData: CreatePropertyExpenseData = {
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
      console.log('🔄 Iniciando criação de despesa...', {
        propertyId,
        submitData,
      });
      console.log('📞 Chamando createExpense do hook...');
      const result = await createExpense(propertyId, submitData);
      console.log('✅ Despesa criada com sucesso:', result);
      toast.success('Despesa criada com sucesso!');
      // Navegar após sucesso
      navigate(`/properties/${propertyId}`);
    } catch (error: any) {
      console.error('❌ Erro ao criar despesa no handleSubmit:', error);
      console.error('❌ Stack trace:', error.stack);
      toast.error(error.message || 'Erro ao criar despesa');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingProperty) {
    return <CreatePropertyExpenseShimmer />;
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Nova Despesa</PageTitle>
              <PageSubtitle>
                {property
                  ? `Propriedade: ${property.title}`
                  : 'Cadastre uma nova despesa'}
              </PageSubtitle>
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
                  {isLoading ? 'Salvando...' : 'Salvar Despesa'}
                </Button>
              </FormActions>
            </form>
          </FormContainer>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default CreatePropertyExpensePage;
