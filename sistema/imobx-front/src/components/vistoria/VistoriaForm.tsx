import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NumericFormat } from 'react-number-format';
import {
  MdAssignment,
  MdSchedule,
  MdPerson,
  MdNotes,
  MdSave,
  MdClose,
  MdAttachMoney,
  MdWarning,
} from 'react-icons/md';
import type {
  Inspection,
  CreateInspectionRequest,
  UpdateInspectionRequest,
} from '@/types/vistoria-types';
import {
  INSPECTION_TYPE_LABELS,
  INSPECTION_STATUS_LABELS,
} from '@/types/vistoria-types';
import { formatCPF, formatCNPJ, formatPhone } from '@/utils/masks';

const FormContainer = styled.div`
  width: 100%;
  max-width: 100%;
`;

const Card = styled.div`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 24px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 10px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 10px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
  padding: 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ValidationWarning = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f59e0b15;
  border: 1px solid #f59e0b40;
  border-radius: 8px;
  color: #f59e0b;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark || props.theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.cardBackground};
    border: 2px solid ${props.theme.colors.border};
    color: ${props.theme.colors.text};
    
    &:hover:not(:disabled) {
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

interface InspectionFormData {
  title: string;
  description?: string;
  type: string;
  scheduledDate: string;
  propertyId: string;
  inspectorId?: string;
  value?: number;
  responsibleName?: string;
  responsibleDocument?: string;
  responsiblePhone?: string;
  observations?: string;
}

interface InspectionFormProps {
  inspection?: Inspection;
  onSubmit: (
    data: CreateInspectionRequest | UpdateInspectionRequest
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  properties?: Array<{ id: string; title: string; code?: string }>;
  /** Chamado quando o usuário abre/foca o select de propriedade (para carregar propriedades sob demanda) */
  onPropertySelectOpen?: () => void;
  /** Exibir indicador de carregamento nas opções de propriedade */
  propertiesLoading?: boolean;
  inspectors?: Array<{ id: string; name: string }>;
  currentUser?: { id: string; name: string };
  isEdit?: boolean;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  inspection,
  onSubmit,
  onCancel,
  loading = false,
  properties = [],
  onPropertySelectOpen,
  propertiesLoading = false,
  inspectors = [],
  currentUser,
  isEdit = false,
}) => {
  const [status, setStatus] = useState<string | undefined>(inspection?.status);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [propertySearch, setPropertySearch] = useState('');

  const handlePropertyFieldFocus = () => {
    onPropertySelectOpen?.();
  };

  const [formData, setFormData] = useState<InspectionFormData>({
    title: inspection?.title || '',
    description: inspection?.description || '',
    type: inspection?.type || '',
    scheduledDate: inspection?.scheduledDate
      ? new Date(inspection.scheduledDate).toISOString().slice(0, 16)
      : '',
    propertyId: inspection?.propertyId || '',
    inspectorId: inspection?.inspectorId || '',
    value: inspection?.value || undefined,
    responsibleName: inspection?.responsibleName || '',
    responsibleDocument: inspection?.responsibleDocument || '',
    responsiblePhone: inspection?.responsiblePhone || '',
    observations: inspection?.observations || '',
  });

  const updateField = (field: keyof InspectionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando for editado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log('🔥 Form submit disparado');
    // console.log('📋 Dados atuais:', formData);
    // Validar campos obrigatórios
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Data é obrigatória';
    } else if (!isEdit) {
      // Validar se a data não está no passado (apenas ao criar nova vistoria)
      const scheduledDateTime = new Date(formData.scheduledDate);
      const now = new Date();

      if (scheduledDateTime < now) {
        newErrors.scheduledDate = 'A data agendada não pode ser no passado';
      }
    }

    if (!formData.propertyId) {
      newErrors.propertyId = 'Propriedade é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      // console.log('❌ Erros de validação:', newErrors);
      setErrors(newErrors);
      return;
    }

    // console.log('✅ Validação passou!');
    // Preparar dados para envio
    const submitData: any = {
      title: formData.title.trim(),
      type: formData.type,
      scheduledDate: formData.scheduledDate,
      propertyId: formData.propertyId,
    };

    // Campos opcionais
    if (formData.description?.trim())
      submitData.description = formData.description.trim();
    if (formData.inspectorId) submitData.inspectorId = formData.inspectorId;
    if (formData.value && formData.value > 0) submitData.value = formData.value;
    if (formData.responsibleName?.trim())
      submitData.responsibleName = formData.responsibleName.trim();
    if (formData.responsibleDocument?.trim())
      submitData.responsibleDocument = formData.responsibleDocument.trim();
    if (formData.responsiblePhone?.trim())
      submitData.responsiblePhone = formData.responsiblePhone.trim();
    if (formData.observations?.trim())
      submitData.observations = formData.observations.trim();

    if (isEdit && status) {
      submitData.status = status;
    }

    // console.log('📤 Enviando dados:', submitData);
    try {
      await onSubmit(submitData);
      // console.log('✅ Sucesso!');
    } catch (error) {
      console.error('❌ Erro:', error);
    }
  };

  const isFormValid =
    formData.title?.trim() &&
    formData.type &&
    formData.scheduledDate &&
    formData.propertyId;

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} noValidate>
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardIcon>
              <MdAssignment size={20} />
            </CardIcon>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>

          <FormGrid>
            <FormGroup>
              <Label>
                Título da Inspeção
                <Required>*</Required>
              </Label>
              <Input
                type='text'
                placeholder='Ex: Inspeção de entrada - Apartamento 101'
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
                $hasError={!!errors.title}
              />
              {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>
                Tipo de Inspeção
                <Required>*</Required>
              </Label>
              <Select
                value={formData.type}
                onChange={e => updateField('type', e.target.value)}
                $hasError={!!errors.type}
              >
                <option value=''>Selecione o tipo</option>
                {Object.entries(INSPECTION_TYPE_LABELS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </Select>
              {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label>Descrição</Label>
            <TextArea
              placeholder='Descreva os detalhes da inspeção...'
              value={formData.description || ''}
              onChange={e => updateField('description', e.target.value)}
            />
          </FormGroup>
        </Card>

        {/* Agendamento e Localização */}
        <Card>
          <CardHeader>
            <CardIcon>
              <MdSchedule size={20} />
            </CardIcon>
            <CardTitle>Agendamento e Localização</CardTitle>
          </CardHeader>

          <FormGrid>
            <FormGroup>
              <Label>
                Data e Hora Agendada
                <Required>*</Required>
              </Label>
              <Input
                type='datetime-local'
                value={formData.scheduledDate}
                onChange={e => updateField('scheduledDate', e.target.value)}
                min={
                  !isEdit ? new Date().toISOString().slice(0, 16) : undefined
                }
                $hasError={!!errors.scheduledDate}
              />
              {errors.scheduledDate && (
                <ErrorMessage>{errors.scheduledDate}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                Propriedade
                <Required>*</Required>
              </Label>
              <Input
                type='text'
                placeholder='Buscar por código ou nome...'
                value={propertySearch}
                onChange={e => setPropertySearch(e.target.value)}
                onFocus={handlePropertyFieldFocus}
                style={{ marginBottom: 8 }}
              />
              <Select
                value={formData.propertyId}
                onChange={e => updateField('propertyId', e.target.value)}
                onFocus={handlePropertyFieldFocus}
                onClick={handlePropertyFieldFocus}
                $hasError={!!errors.propertyId}
              >
                <option value=''>Selecione uma propriedade</option>
                {propertiesLoading && (
                  <option value='' disabled>
                    Carregando propriedades...
                  </option>
                )}
                {properties
                  .filter(
                    p =>
                      !propertySearch.trim() ||
                      (p.title &&
                        p.title
                          .toLowerCase()
                          .includes(propertySearch.trim().toLowerCase())) ||
                      (p.code &&
                        p.code
                          .toLowerCase()
                          .includes(propertySearch.trim().toLowerCase()))
                  )
                  .map(property => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                      {property.code ? ` (${property.code})` : ''}
                    </option>
                  ))}
              </Select>
              {errors.propertyId && (
                <ErrorMessage>{errors.propertyId}</ErrorMessage>
              )}
            </FormGroup>
          </FormGrid>

          <FormGrid>
            <FormGroup>
              <Label>Inspetor Responsável</Label>
              <Select
                value={formData.inspectorId || ''}
                onChange={e => updateField('inspectorId', e.target.value)}
              >
                <option value=''>Selecione um inspetor</option>
                {currentUser && (
                  <option value={currentUser.id}>
                    {currentUser.name} (Eu)
                  </option>
                )}
                {inspectors.map(inspector => (
                  <option key={inspector.id} value={inspector.id}>
                    {inspector.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Valor da Inspeção</Label>
              <NumericFormat
                customInput={Input}
                thousandSeparator='.'
                decimalSeparator=','
                prefix='R$ '
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder='R$ 0,00'
                value={formData.value || ''}
                onValueChange={values =>
                  updateField('value', values.floatValue)
                }
              />
            </FormGroup>
          </FormGrid>
        </Card>

        {/* Status (apenas para edição) */}
        {isEdit && (
          <Card>
            <CardHeader>
              <CardIcon>
                <MdAssignment size={20} />
              </CardIcon>
              <CardTitle>Status da Inspeção</CardTitle>
            </CardHeader>

            <FormGroup>
              <Label>Status Atual</Label>
              <Select
                value={status || ''}
                onChange={e => setStatus(e.target.value)}
              >
                <option value=''>Selecione o status</option>
                {Object.entries(INSPECTION_STATUS_LABELS).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </Select>
            </FormGroup>
          </Card>
        )}

        {/* Responsável pelo Imóvel */}
        <Card>
          <CardHeader>
            <CardIcon>
              <MdPerson size={20} />
            </CardIcon>
            <CardTitle>Responsável pelo Imóvel</CardTitle>
          </CardHeader>

          <FormGrid>
            <FormGroup>
              <Label>Nome Completo</Label>
              <Input
                type='text'
                placeholder='Nome do responsável'
                value={formData.responsibleName || ''}
                onChange={e => updateField('responsibleName', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Documento</Label>
              <Input
                type='text'
                placeholder='CPF ou CNPJ'
                value={formData.responsibleDocument || ''}
                onChange={e => {
                  const val = e.target.value;
                  const formatted =
                    val.length <= 14 ? formatCPF(val) : formatCNPJ(val);
                  updateField('responsibleDocument', formatted);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label>Telefone</Label>
              <Input
                type='text'
                placeholder='(11) 99999-9999'
                value={formData.responsiblePhone || ''}
                onChange={e =>
                  updateField('responsiblePhone', formatPhone(e.target.value))
                }
              />
            </FormGroup>
          </FormGrid>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardIcon>
              <MdNotes size={20} />
            </CardIcon>
            <CardTitle>Observações</CardTitle>
          </CardHeader>

          <FormGroup>
            <Label>Observações Adicionais</Label>
            <TextArea
              placeholder='Informações importantes, restrições de acesso, horários especiais, etc.'
              value={formData.observations || ''}
              onChange={e => updateField('observations', e.target.value)}
            />
          </FormGroup>
        </Card>

        {/* Botões */}
        <ButtonContainer>
          {!isFormValid && (
            <ValidationWarning>
              <MdWarning size={18} />
              Preencha todos os campos obrigatórios (*) para continuar
            </ValidationWarning>
          )}

          <ButtonRow>
            <Button
              $variant='secondary'
              type='button'
              onClick={onCancel}
              disabled={loading}
            >
              <MdClose size={16} />
              Cancelar
            </Button>
            <Button
              $variant='primary'
              type='submit'
              disabled={loading || !isFormValid}
            >
              <MdSave size={16} />
              {loading
                ? 'Salvando...'
                : isEdit
                  ? 'Atualizar'
                  : 'Criar Inspeção'}
            </Button>
          </ButtonRow>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export const VistoriaForm = InspectionForm;
