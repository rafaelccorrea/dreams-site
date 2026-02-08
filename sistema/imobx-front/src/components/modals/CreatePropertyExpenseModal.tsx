import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose, MdSave, MdInfo } from 'react-icons/md';
import {
  PropertyExpenseTypeOptions,
  PropertyExpenseType,
  RecurrenceFrequencyOptions,
  RecurrenceFrequency,
  NotificationAdvanceDaysOptions,
  NotificationAdvanceDays,
  type CreatePropertyExpenseData,
  type RecurrenceConfig,
} from '../../types/propertyExpense';

interface CreatePropertyExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatePropertyExpenseData) => Promise<void>;
  propertyId: string;
  propertyTitle?: string;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.background};
  z-index: 10;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  bottom: 0;
  background: ${props => props.theme.colors.background};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover {
      background: ${props.theme.colors.primary}dd;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    &:hover {
      background: ${props.theme.colors.backgroundSecondary};
    }
  `}
`;

export const CreatePropertyExpenseModal: React.FC<
  CreatePropertyExpenseModalProps
> = ({ isOpen, onClose, onSave, propertyId, propertyTitle }) => {
  const [formData, setFormData] = useState<CreatePropertyExpenseData>({
    title: '',
    description: '',
    type: PropertyExpenseType.OTHER,
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    isRecurring: false,
    enableNotification: true,
    notificationAdvanceDays: NotificationAdvanceDays.THIRTY,
    createFinancialPending: false,
    notes: '',
    documentNumber: '',
  });

  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig>({
    frequency: RecurrenceFrequency.MONTHLY,
    dayOfMonth: new Date().getDate(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreatePropertyExpenseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecurrenceChange = (
    field: keyof RecurrenceConfig,
    value: any
  ) => {
    setRecurrenceConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.dueDate) {
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreatePropertyExpenseData = {
        ...formData,
        recurrenceConfig: formData.isRecurring ? recurrenceConfig : undefined,
      };
      await onSave(data);
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: PropertyExpenseType.OTHER,
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        isRecurring: false,
        enableNotification: true,
        notificationAdvanceDays: NotificationAdvanceDays.THIRTY,
        createFinancialPending: false,
        notes: '',
        documentNumber: '',
      });
    } catch (error) {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Adicionar Despesa</Title>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </Header>

        <Content>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                Título <Required>*</Required>
              </Label>
              <Input
                type='text'
                value={formData.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder='Ex: IPTU 2025'
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description || ''}
                onChange={e => handleChange('description', e.target.value)}
                placeholder='Descrição detalhada da despesa (opcional)'
              />
            </FormGroup>

            <Grid>
              <FormGroup>
                <Label>
                  Tipo <Required>*</Required>
                </Label>
                <Select
                  value={formData.type}
                  onChange={e =>
                    handleChange('type', e.target.value as PropertyExpenseType)
                  }
                  required
                >
                  {PropertyExpenseTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  Valor <Required>*</Required>
                </Label>
                <Input
                  type='number'
                  step='0.01'
                  min='0'
                  value={formData.amount || ''}
                  onChange={e =>
                    handleChange('amount', parseFloat(e.target.value) || 0)
                  }
                  placeholder='0.00'
                  required
                />
              </FormGroup>
            </Grid>

            <FormGroup>
              <Label>
                Data de Vencimento <Required>*</Required>
              </Label>
              <Input
                type='date'
                value={formData.dueDate}
                onChange={e => handleChange('dueDate', e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type='checkbox'
                  checked={formData.isRecurring || false}
                  onChange={e => handleChange('isRecurring', e.target.checked)}
                />
                <CheckboxLabel>Despesa Recorrente</CheckboxLabel>
              </CheckboxContainer>
            </FormGroup>

            {formData.isRecurring && (
              <>
                <Grid>
                  <FormGroup>
                    <Label>Frequência</Label>
                    <Select
                      value={recurrenceConfig.frequency}
                      onChange={e =>
                        handleRecurrenceChange(
                          'frequency',
                          e.target.value as RecurrenceFrequency
                        )
                      }
                    >
                      {RecurrenceFrequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormGroup>

                  {(recurrenceConfig.frequency ===
                    RecurrenceFrequency.MONTHLY ||
                    recurrenceConfig.frequency ===
                      RecurrenceFrequency.YEARLY) && (
                    <FormGroup>
                      <Label>Dia do Mês</Label>
                      <Input
                        type='number'
                        min='1'
                        max='31'
                        value={recurrenceConfig.dayOfMonth || ''}
                        onChange={e =>
                          handleRecurrenceChange(
                            'dayOfMonth',
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </FormGroup>
                  )}

                  {recurrenceConfig.frequency ===
                    RecurrenceFrequency.YEARLY && (
                    <FormGroup>
                      <Label>Mês</Label>
                      <Input
                        type='number'
                        min='1'
                        max='12'
                        value={recurrenceConfig.monthOfYear || ''}
                        onChange={e =>
                          handleRecurrenceChange(
                            'monthOfYear',
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </FormGroup>
                  )}
                </Grid>

                <Grid>
                  <FormGroup>
                    <Label>Data Final (opcional)</Label>
                    <Input
                      type='date'
                      value={recurrenceConfig.endDate || ''}
                      onChange={e =>
                        handleRecurrenceChange('endDate', e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Número de Ocorrências (opcional)</Label>
                    <Input
                      type='number'
                      min='1'
                      value={recurrenceConfig.occurrences || ''}
                      onChange={e =>
                        handleRecurrenceChange(
                          'occurrences',
                          parseInt(e.target.value) || undefined
                        )
                      }
                    />
                  </FormGroup>
                </Grid>
              </>
            )}

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type='checkbox'
                  checked={formData.enableNotification || false}
                  onChange={e =>
                    handleChange('enableNotification', e.target.checked)
                  }
                />
                <CheckboxLabel>Enviar Notificação</CheckboxLabel>
              </CheckboxContainer>
            </FormGroup>

            {formData.enableNotification && (
              <FormGroup>
                <Label>Dias de Antecedência</Label>
                <Select
                  value={
                    formData.notificationAdvanceDays ||
                    NotificationAdvanceDays.THIRTY
                  }
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
                </Select>
              </FormGroup>
            )}

            <FormGroup>
              <Label>Observações</Label>
              <Textarea
                value={formData.notes || ''}
                onChange={e => handleChange('notes', e.target.value)}
                placeholder='Observações adicionais sobre a despesa (opcional)'
                rows={4}
              />
            </FormGroup>

            <FormGroup>
              <Label>Número do Documento</Label>
              <Input
                type='text'
                value={formData.documentNumber || ''}
                onChange={e => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    handleChange('documentNumber', value);
                  }
                }}
                placeholder='Ex: DOC-12345, Boleto 001, etc. (opcional)'
                maxLength={100}
              />
              {formData.documentNumber &&
                formData.documentNumber.length > 0 && (
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
            </FormGroup>

            <FormGroup>
              <CheckboxContainer>
                <Checkbox
                  type='checkbox'
                  checked={formData.createFinancialPending || false}
                  onChange={e =>
                    handleChange('createFinancialPending', e.target.checked)
                  }
                />
                <CheckboxLabel>Criar Pendência Financeira</CheckboxLabel>
              </CheckboxContainer>
              <InfoBox>
                <MdInfo size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <InfoText>
                  Quando marcado, uma pendência será criada automaticamente no
                  módulo financeiro.
                </InfoText>
              </InfoBox>
            </FormGroup>
          </form>
        </Content>

        <Footer>
          <Button
            $variant='secondary'
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.title ||
              !formData.amount ||
              !formData.dueDate
            }
          >
            <MdSave size={18} />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};
