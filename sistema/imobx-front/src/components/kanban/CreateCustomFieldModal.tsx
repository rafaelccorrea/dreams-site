import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import type { CreateCustomFieldDto } from '../../types/kanban';
import { CustomFieldType } from '../../types/kanban';
import { showError } from '../../utils/notifications';

interface CreateCustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomFieldDto) => Promise<void>;
  teamId: string;
  projectId?: string;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const FieldInput = styled.input`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const FieldTextarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const FieldSelect = styled.select`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const OptionsInput = styled.textarea`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const OptionsHint = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: -4px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: #fff;
        &:hover {
          background: ${props.theme.colors.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
        }
      `;
    }
    return `
      background: transparent;
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover {
        background: ${props.theme.colors.background};
        border-color: ${props.theme.colors.primary};
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const fieldTypes: Array<{ value: CustomFieldType; label: string }> = [
  { value: CustomFieldType.TEXT, label: 'Texto' },
  { value: CustomFieldType.NUMBER, label: 'Número' },
  { value: CustomFieldType.CURRENCY, label: 'Moeda' },
  { value: CustomFieldType.PERCENTAGE, label: 'Porcentagem' },
  { value: CustomFieldType.DATE, label: 'Data' },
  { value: CustomFieldType.DATETIME, label: 'Data e Hora' },
  { value: CustomFieldType.SELECT, label: 'Seleção Única' },
  { value: CustomFieldType.MULTISELECT, label: 'Seleção Múltipla' },
  { value: CustomFieldType.CHECKBOX, label: 'Checkbox' },
  { value: CustomFieldType.EMAIL, label: 'Email' },
  { value: CustomFieldType.URL, label: 'URL' },
  { value: CustomFieldType.PHONE, label: 'Telefone' },
  { value: CustomFieldType.USER, label: 'Usuário' },
  { value: CustomFieldType.CLIENT, label: 'Cliente' },
  { value: CustomFieldType.PROPERTY, label: 'Propriedade' },
];

export const CreateCustomFieldModal: React.FC<CreateCustomFieldModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamId,
  projectId,
}) => {
  const [formData, setFormData] = useState<Partial<CreateCustomFieldDto>>({
    name: '',
    key: '',
    description: '',
    type: CustomFieldType.TEXT,
    options: [],
    isRequired: false,
    isActive: true,
    teamId,
    projectId: projectId || undefined,
  });
  const [optionsText, setOptionsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      key: generateKey(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.key?.trim()) {
      newErrors.key = 'Chave é obrigatória';
    } else {
      if (formData.key.length > 50) {
        newErrors.key = 'Chave deve ter no máximo 50 caracteres';
      } else if (!/^[a-z0-9_-]+$/.test(formData.key)) {
        newErrors.key =
          'Chave deve conter apenas letras minúsculas, números, _ e - (formato snake_case)';
      }
    }

    if (
      formData.type === CustomFieldType.SELECT ||
      formData.type === CustomFieldType.MULTISELECT
    ) {
      if (!optionsText.trim()) {
        newErrors.options = 'Opções são obrigatórias para este tipo de campo';
      } else {
        const options = optionsText.split('\n').filter(o => o.trim());
        if (options.length === 0) {
          newErrors.options = 'É necessário fornecer pelo menos uma opção';
        }
      }
    }

    // Validação de nome (máx 100 caracteres)
    if (formData.name && formData.name.length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit: CreateCustomFieldDto = {
        name: formData.name!,
        key: formData.key!,
        description: formData.description || undefined,
        type: formData.type!,
        options:
          formData.type === CustomFieldType.SELECT ||
          formData.type === CustomFieldType.MULTISELECT
            ? optionsText.split('\n').filter(o => o.trim())
            : undefined,
        isRequired: formData.isRequired || false,
        isActive: formData.isActive !== false,
        teamId,
        projectId: projectId || undefined,
      };

      await onSubmit(dataToSubmit);

      // Reset form
      setFormData({
        name: '',
        key: '',
        description: '',
        type: CustomFieldType.TEXT,
        options: [],
        isRequired: false,
        isActive: true,
        teamId,
        projectId: projectId || undefined,
      });
      setOptionsText('');
      setErrors({});
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setLoading(false);
    }
  };

  const needsOptions =
    formData.type === CustomFieldType.SELECT ||
    formData.type === CustomFieldType.MULTISELECT;

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Criar Campo Personalizado</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FieldGroup>
              <FieldLabel>
                Nome <RequiredMark>*</RequiredMark>
              </FieldLabel>
              <FieldInput
                type='text'
                value={formData.name || ''}
                onChange={e => handleNameChange(e.target.value)}
                placeholder='Ex: Fonte do Lead'
                required
              />
              {errors.name && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                  {errors.name}
                </div>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>
                Chave <RequiredMark>*</RequiredMark>
              </FieldLabel>
              <FieldInput
                type='text'
                value={formData.key || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, key: e.target.value }))
                }
                placeholder='lead_source'
                maxLength={50}
                required
              />
              <OptionsHint>
                Chave única para identificar o campo (máx. 50 caracteres, apenas
                letras, números e _)
              </OptionsHint>
              {errors.key && (
                <div style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                  {errors.key}
                </div>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Descrição</FieldLabel>
              <FieldTextarea
                value={formData.description || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Descrição do campo (opcional)'
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>
                Tipo <RequiredMark>*</RequiredMark>
              </FieldLabel>
              <FieldSelect
                value={formData.type || CustomFieldType.TEXT}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    type: e.target.value as CustomFieldType,
                  }));
                  if (
                    e.target.value !== CustomFieldType.SELECT &&
                    e.target.value !== CustomFieldType.MULTISELECT
                  ) {
                    setOptionsText('');
                  }
                }}
                required
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>

            {needsOptions && (
              <FieldGroup>
                <FieldLabel>
                  Opções <RequiredMark>*</RequiredMark>
                </FieldLabel>
                <OptionsInput
                  value={optionsText}
                  onChange={e => setOptionsText(e.target.value)}
                  placeholder='Uma opção por linha&#10;Ex:&#10;Facebook&#10;Instagram&#10;Google Ads'
                  required
                />
                <OptionsHint>Digite uma opção por linha</OptionsHint>
                {errors.options && (
                  <div style={{ color: '#EF4444', fontSize: '0.75rem' }}>
                    {errors.options}
                  </div>
                )}
              </FieldGroup>
            )}

            <FieldGroup>
              <CheckboxWrapper>
                <input
                  type='checkbox'
                  checked={formData.isRequired || false}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      isRequired: e.target.checked,
                    }))
                  }
                />
                <span>Campo obrigatório</span>
              </CheckboxWrapper>
            </FieldGroup>
          </ModalBody>

          <ModalFooter>
            <Button type='button' onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type='submit' $variant='primary' disabled={loading}>
              Criar Campo
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </Overlay>
  );
};
