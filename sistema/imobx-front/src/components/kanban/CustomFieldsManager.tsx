import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import {
  MdAdd,
  MdSettings,
  MdArrowDropDown,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import type {
  KanbanCustomField,
  CreateCustomFieldDto,
} from '../../types/kanban';
import { CustomFieldType } from '../../types/kanban';
import { kanbanCustomFieldsApi } from '../../services/kanbanCustomFieldsApi';
import { showError, showSuccess } from '../../utils/notifications';
import { CreateCustomFieldModal } from './CreateCustomFieldModal';
import {
  maskPhoneAuto,
  formatCurrency,
  getNumericValue,
  maskCEP,
  maskCPF,
  maskCNPJ,
} from '../../utils/masks';

interface CustomFieldsManagerProps {
  teamId: string;
  projectId?: string;
  taskCustomFields?: { [key: string]: any };
  onFieldChange: (key: string, value: any) => void;
  readOnly?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: 600;
`;

const FieldDescription = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}20`};
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const FieldSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const FieldSelect = styled.select`
  width: 100%;
  min-height: 48px;
  height: 48px;
  padding: 12px 44px 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.3s ease;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}20`};
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary}60;
    background-color: ${props => props.theme.colors.backgroundSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.backgroundSecondary};
  }

  option {
    padding: 12px 16px;
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
    font-size: 0.938rem;
  }

  option[value=''][disabled] {
    color: ${props => props.theme.colors.textSecondary};
    font-style: italic;
  }

  &::-ms-expand {
    display: none;
  }
`;

const SelectIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: color 0.2s ease;

  ${FieldSelectContainer}:hover & {
    color: ${props => props.theme.colors.primary};
  }

  ${FieldSelectContainer}:has(select:focus) & {
    color: ${props => props.theme.colors.primary};
  }
`;

/* Select moderno (dropdown customizado) */
const ModernSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ModernSelectTrigger = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  min-height: 48px;
  padding: 12px 44px 12px 16px;
  border: 2px solid
    ${props =>
      props.$isOpen ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: ${props =>
    props.$isOpen ? `0 0 0 4px ${props.theme.colors.primary}20` : 'none'};

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary}60;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ModernSelectTriggerIcon = styled.span<{ $isOpen?: boolean }>`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%)
    rotate(${props => (props.$isOpen ? '180deg' : '0deg')});
  color: ${props => props.theme.colors.textSecondary};
  transition: transform 0.2s ease;
  pointer-events: none;
`;

const ModernSelectDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
  padding: 6px;
`;

const ModernSelectOption = styled.button<{ $selected?: boolean }>`
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background: ${props =>
    props.$selected ? `${props.theme.colors.primary}18` : 'transparent'};
  color: ${props => props.theme.colors.text};
  font-size: 0.938rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}12;
  }
  & svg {
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }
`;

const ModernMultiSelectTrigger = styled(ModernSelectTrigger)`
  min-height: 48px;
  height: auto;
  padding: 10px 44px 10px 14px;
  flex-wrap: wrap;
  gap: 8px;
`;

const ModernMultiSelectChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 8px;
  font-size: 0.813rem;
  font-weight: 500;
`;

const ModernMultiSelectChipRemove = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover {
    background: ${props => props.theme.colors.primary}40;
  }
`;

const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}20`};
  }

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({
  teamId,
  projectId,
  taskCustomFields = {},
  onFieldChange,
  readOnly = false,
}) => {
  const [fields, setFields] = useState<KanbanCustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localValues, setLocalValues] = useState<{ [key: string]: any }>(
    taskCustomFields
  );
  const [openSelectKey, setOpenSelectKey] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<{ [key: string]: any }>({});
  const modernSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFields();
  }, [teamId, projectId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openSelectKey &&
        modernSelectRef.current &&
        !modernSelectRef.current.contains(e.target as Node)
      ) {
        setOpenSelectKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openSelectKey]);

  // Ref para rastrear se estamos em modo de edição
  const isEditingRef = useRef<boolean>(false);

  useEffect(() => {
    // Só atualizar localValues se não houver mudanças pendentes e não estiver editando
    const hasPendingChanges = Object.keys(pendingChangesRef.current).length > 0;

    if (!hasPendingChanges && !isEditingRef.current) {
      console.log(
        '🔄 [CustomFieldsManager] Atualizando localValues com taskCustomFields',
        taskCustomFields
      );
      setLocalValues(taskCustomFields);
    } else {
      console.log(
        '⏭️ [CustomFieldsManager] Ignorando atualização de taskCustomFields',
        {
          hasPendingChanges,
          isEditing: isEditingRef.current,
          pendingChanges: { ...pendingChangesRef.current },
        }
      );
    }
  }, [taskCustomFields]);

  // Função para salvar mudanças com debounce
  // NÃO salva imediatamente, apenas aguarda inatividade
  const scheduleSave = useCallback(
    (key: string, value: any) => {
      console.log('🟢 [CustomFieldsManager] scheduleSave chamado', {
        key,
        value,
        timestamp: new Date().toISOString(),
      });

      // Marcar como editando
      isEditingRef.current = true;

      // Atualizar valor local imediatamente (apenas UI)
      setLocalValues(prev => {
        const newValues = { ...prev, [key]: value };
        console.log('🔄 [CustomFieldsManager] setLocalValues', {
          key,
          oldValue: prev[key],
          newValue: value,
        });
        return newValues;
      });

      // Guardar mudança pendente
      pendingChangesRef.current[key] = value;
      console.log('💾 [CustomFieldsManager] Mudança pendente salva', {
        key,
        value,
        allPendingChanges: { ...pendingChangesRef.current },
      });

      // Limpar timeout anterior
      if (saveTimeoutRef.current) {
        console.log('⏹️ [CustomFieldsManager] Limpando timeout anterior');
        clearTimeout(saveTimeoutRef.current);
      }

      // Agendar salvamento após 2 segundos de inatividade (sem digitar)
      console.log(
        '⏰ [CustomFieldsManager] Agendando chamada onFieldChange em 2 segundos...'
      );
      saveTimeoutRef.current = setTimeout(() => {
        console.log(
          '⏰ [CustomFieldsManager] Timeout executado - chamando onFieldChange'
        );
        const changes = { ...pendingChangesRef.current };
        console.log(
          '📦 [CustomFieldsManager] Mudanças pendentes para enviar:',
          changes
        );

        if (Object.keys(changes).length > 0) {
          pendingChangesRef.current = {};

          console.log(
            '📤 [CustomFieldsManager] Chamando onFieldChange para cada mudança...'
          );
          // Aplicar todas as mudanças pendentes de uma vez
          Object.keys(changes).forEach(changeKey => {
            console.log(
              `  - Chamando onFieldChange(${changeKey}, ${JSON.stringify(changes[changeKey])})`
            );
            onFieldChange(changeKey, changes[changeKey]);
          });

          // Marcar como não editando após um pequeno delay para permitir que a API responda
          setTimeout(() => {
            isEditingRef.current = false;
            console.log('🔓 [CustomFieldsManager] Flag de edição liberada');
          }, 100);
        } else {
          console.log(
            '⏭️ [CustomFieldsManager] Nenhuma mudança pendente, não chamando onFieldChange'
          );
          isEditingRef.current = false;
        }
      }, 2000); // 2 segundos de inatividade
    },
    [onFieldChange]
  );

  // Função para salvar mudanças pendentes
  const savePendingChanges = useCallback(() => {
    const changes = { ...pendingChangesRef.current };
    if (Object.keys(changes).length > 0) {
      pendingChangesRef.current = {};
      Object.keys(changes).forEach(changeKey => {
        onFieldChange(changeKey, changes[changeKey]);
      });
    }
  }, [onFieldChange]);

  useEffect(() => {
    // Salvar ao desmontar o componente
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Salvar mudanças pendentes ao sair
      savePendingChanges();
    };
  }, [savePendingChanges]);

  // Salvar ao sair da página/aba
  useEffect(() => {
    const handleBeforeUnload = () => {
      savePendingChanges();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [savePendingChanges]);

  const loadFields = async () => {
    try {
      setLoading(true);
      let data: KanbanCustomField[];

      if (projectId) {
        data = await kanbanCustomFieldsApi.getProjectCustomFields(projectId);
      } else {
        data = await kanbanCustomFieldsApi.getTeamCustomFields(teamId);
      }

      setFields(data.filter(f => f.isActive));
    } catch (error: any) {
      console.error('Erro ao carregar campos personalizados:', error);
      showError('Erro ao carregar campos personalizados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateField = async (data: CreateCustomFieldDto) => {
    try {
      await kanbanCustomFieldsApi.createCustomField(data);
      showSuccess('Campo personalizado criado com sucesso!');
      await loadFields();
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error('Erro ao criar campo personalizado:', error);
      showError(error.message || 'Erro ao criar campo personalizado');
      throw error;
    }
  };

  // Função para detectar tipo de máscara baseado no nome/key do campo
  const detectMaskType = (
    field: KanbanCustomField
  ): 'cpf' | 'cnpj' | 'phone' | 'cep' | null => {
    const nameLower = field.name.toLowerCase();
    const keyLower = field.key.toLowerCase();
    const combined = `${nameLower} ${keyLower}`;

    // Detectar CPF
    if (combined.includes('cpf')) {
      return 'cpf';
    }

    // Detectar CNPJ
    if (combined.includes('cnpj')) {
      return 'cnpj';
    }

    // Detectar telefone
    if (
      combined.includes('telefone') ||
      combined.includes('phone') ||
      combined.includes('celular') ||
      combined.includes('whatsapp') ||
      combined.includes('cel') ||
      combined.includes('tel')
    ) {
      return 'phone';
    }

    // Detectar CEP
    if (combined.includes('cep') || combined.includes('postal')) {
      return 'cep';
    }

    return null;
  };

  const renderFieldInput = (field: KanbanCustomField) => {
    const value = localValues[field.key] ?? field.defaultValue ?? '';
    const isDisabled = readOnly;
    const maskType = detectMaskType(field);

    switch (field.type) {
      case CustomFieldType.TEXT:
        // Aplicar máscara se detectada
        if (maskType === 'cpf') {
          return (
            <FieldInput
              type='text'
              value={typeof value === 'string' ? maskCPF(value) : ''}
              onChange={e => {
                const masked = maskCPF(e.target.value);
                scheduleSave(field.key, masked);
              }}
              required={field.isRequired}
              maxLength={18}
              disabled={isDisabled}
              placeholder={field.description || '000.000.000-00'}
            />
          );
        }

        if (maskType === 'cnpj') {
          return (
            <FieldInput
              type='text'
              value={typeof value === 'string' ? maskCNPJ(value) : ''}
              onChange={e => {
                const masked = maskCNPJ(e.target.value);
                scheduleSave(field.key, masked);
              }}
              required={field.isRequired}
              maxLength={18}
              disabled={isDisabled}
              placeholder={field.description || '00.000.000/0000-00'}
            />
          );
        }

        if (maskType === 'phone') {
          return (
            <FieldInput
              type='text'
              value={typeof value === 'string' ? maskPhoneAuto(value) : ''}
              onChange={e => {
                const masked = maskPhoneAuto(e.target.value);
                scheduleSave(field.key, masked);
              }}
              required={field.isRequired}
              maxLength={15}
              disabled={isDisabled}
              placeholder={field.description || '(00) 00000-0000'}
            />
          );
        }

        if (maskType === 'cep') {
          return (
            <FieldInput
              type='text'
              value={typeof value === 'string' ? maskCEP(value) : ''}
              onChange={e => {
                const masked = maskCEP(e.target.value);
                scheduleSave(field.key, masked);
              }}
              required={field.isRequired}
              maxLength={9}
              disabled={isDisabled}
              placeholder={field.description || '00000-000'}
            />
          );
        }

        // Campo de texto sem máscara
        return (
          <FieldInput
            type='text'
            value={value || ''}
            onChange={e => scheduleSave(field.key, e.target.value)}
            required={field.isRequired}
            maxLength={field.validation?.maxLength}
            minLength={field.validation?.minLength}
            disabled={isDisabled}
            placeholder={field.description}
          />
        );

      case CustomFieldType.EMAIL:
        return (
          <FieldInput
            type='email'
            value={value || ''}
            onChange={e => scheduleSave(field.key, e.target.value)}
            required={field.isRequired}
            maxLength={field.validation?.maxLength}
            minLength={field.validation?.minLength}
            disabled={isDisabled}
            placeholder={field.description || 'exemplo@email.com'}
          />
        );

      case CustomFieldType.URL:
        return (
          <FieldInput
            type='url'
            value={value || ''}
            onChange={e => scheduleSave(field.key, e.target.value)}
            required={field.isRequired}
            maxLength={field.validation?.maxLength}
            minLength={field.validation?.minLength}
            disabled={isDisabled}
            placeholder={field.description || 'https://exemplo.com'}
          />
        );

      case CustomFieldType.PHONE:
        return (
          <FieldInput
            type='text'
            value={value || ''}
            onChange={e => {
              const masked = maskPhoneAuto(e.target.value);
              scheduleSave(field.key, masked);
            }}
            required={field.isRequired}
            maxLength={15}
            disabled={isDisabled}
            placeholder={field.description || '(00) 00000-0000'}
          />
        );

      case CustomFieldType.NUMBER:
        return (
          <FieldInput
            type='text'
            value={value || ''}
            onChange={e => {
              const numericValue = e.target.value.replace(/\D/g, '');
              scheduleSave(
                field.key,
                numericValue ? Number(numericValue) : null
              );
            }}
            required={field.isRequired}
            disabled={isDisabled}
            placeholder={field.description || '0'}
          />
        );

      case CustomFieldType.CURRENCY:
        // Converter número para string formatada se necessário
        const currencyDisplayValue =
          typeof value === 'number'
            ? formatCurrency(value.toString().replace('.', ','))
            : value || '';
        return (
          <FieldInput
            type='text'
            value={currencyDisplayValue}
            onChange={e => {
              const formatted = formatCurrency(e.target.value);
              setLocalValues(prev => ({ ...prev, [field.key]: formatted }));
              const numericValue = getNumericValue(formatted);
              scheduleSave(field.key, numericValue);
            }}
            required={field.isRequired}
            disabled={isDisabled}
            placeholder={field.description || 'R$ 0,00'}
          />
        );

      case CustomFieldType.PERCENTAGE:
        // Converter número decimal (0.0-1.0) para porcentagem (0-100)
        const percentageDisplayValue =
          typeof value === 'number'
            ? Math.round(value * 100).toString()
            : value || '';
        return (
          <FieldInput
            type='text'
            value={percentageDisplayValue}
            onChange={e => {
              const numericValue = e.target.value.replace(/\D/g, '');
              const percentage = numericValue
                ? Number(numericValue) / 100
                : null;
              setLocalValues(prev => ({ ...prev, [field.key]: numericValue }));
              scheduleSave(field.key, percentage);
            }}
            required={field.isRequired}
            disabled={isDisabled}
            placeholder={field.description || '0%'}
          />
        );

      case CustomFieldType.DATE:
        return (
          <FieldInput
            type='date'
            value={value || ''}
            onChange={e => scheduleSave(field.key, e.target.value)}
            required={field.isRequired}
            disabled={isDisabled}
          />
        );

      case CustomFieldType.DATETIME:
        return (
          <FieldInput
            type='datetime-local'
            value={value || ''}
            onChange={e => scheduleSave(field.key, e.target.value)}
            required={field.isRequired}
            disabled={isDisabled}
          />
        );

      case CustomFieldType.SELECT: {
        const selectValue = Array.isArray(value)
          ? value.length > 0
            ? value[0]
            : ''
          : value || '';
        const isOpen = openSelectKey === `${field.key}-single`;
        const options = field.options || [];
        const placeholder = field.isRequired
          ? 'Selecione uma opção...'
          : 'Nenhuma opção selecionada';
        return (
          <ModernSelectWrapper
            ref={isOpen ? modernSelectRef : null}
            style={{ position: 'relative' }}
          >
            <ModernSelectTrigger
              type='button'
              $isOpen={isOpen}
              disabled={isDisabled}
              onClick={() =>
                !isDisabled &&
                setOpenSelectKey(prev =>
                  prev === `${field.key}-single` ? null : `${field.key}-single`
                )
              }
            >
              <span
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectValue
                  ? (options.find(o => o === selectValue) ?? selectValue)
                  : placeholder}
              </span>
            </ModernSelectTrigger>
            <ModernSelectTriggerIcon $isOpen={isOpen}>
              <MdArrowDropDown size={24} />
            </ModernSelectTriggerIcon>
            {isOpen && (
              <ModernSelectDropdown>
                {!field.isRequired && (
                  <ModernSelectOption
                    type='button'
                    $selected={!selectValue}
                    onClick={() => {
                      scheduleSave(field.key, '');
                      setOpenSelectKey(null);
                    }}
                  >
                    <span>{placeholder}</span>
                    {!selectValue && <MdCheck size={18} />}
                  </ModernSelectOption>
                )}
                {options.map(option => (
                  <ModernSelectOption
                    key={option}
                    type='button'
                    $selected={option === selectValue}
                    onClick={() => {
                      scheduleSave(field.key, option);
                      setOpenSelectKey(null);
                    }}
                  >
                    <span>{option}</span>
                    {option === selectValue && <MdCheck size={18} />}
                  </ModernSelectOption>
                ))}
              </ModernSelectDropdown>
            )}
          </ModernSelectWrapper>
        );
      }

      case CustomFieldType.MULTISELECT: {
        const selectedValues: string[] = Array.isArray(value) ? value : [];
        const isOpen = openSelectKey === `${field.key}-multi`;
        const options = field.options || [];
        return (
          <ModernSelectWrapper
            ref={isOpen ? modernSelectRef : null}
            style={{ position: 'relative' }}
          >
            <ModernMultiSelectTrigger
              type='button'
              $isOpen={isOpen}
              disabled={isDisabled}
              onClick={() =>
                !isDisabled &&
                setOpenSelectKey(prev =>
                  prev === `${field.key}-multi` ? null : `${field.key}-multi`
                )
              }
            >
              <span
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {selectedValues.length === 0 ? (
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {field.isRequired
                      ? 'Selecione...'
                      : 'Nenhuma opção selecionada'}
                  </span>
                ) : (
                  selectedValues.map(opt => (
                    <ModernMultiSelectChip key={opt}>
                      {opt}
                      {!readOnly && (
                        <ModernMultiSelectChipRemove
                          type='button'
                          onClick={e => {
                            e.stopPropagation();
                            scheduleSave(
                              field.key,
                              selectedValues.filter(o => o !== opt)
                            );
                          }}
                          title='Remover'
                        >
                          <MdClose size={14} />
                        </ModernMultiSelectChipRemove>
                      )}
                    </ModernMultiSelectChip>
                  ))
                )}
              </span>
            </ModernMultiSelectTrigger>
            <ModernSelectTriggerIcon $isOpen={isOpen}>
              <MdArrowDropDown size={24} />
            </ModernSelectTriggerIcon>
            {isOpen && (
              <ModernSelectDropdown>
                {options.map(option => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <ModernSelectOption
                      key={option}
                      type='button'
                      $selected={isSelected}
                      onClick={() => {
                        const next = isSelected
                          ? selectedValues.filter(v => v !== option)
                          : [...selectedValues, option];
                        scheduleSave(field.key, next);
                      }}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <MdCheck size={18} color='var(--color-primary)' />
                      )}
                    </ModernSelectOption>
                  );
                })}
              </ModernSelectDropdown>
            )}
          </ModernSelectWrapper>
        );
      }

      case CustomFieldType.CHECKBOX:
        return (
          <CheckboxWrapper>
            <input
              type='checkbox'
              checked={value || false}
              onChange={e => {
                scheduleSave(field.key, e.target.checked);
              }}
              required={field.isRequired}
              disabled={isDisabled}
            />
            <span>{field.description || 'Marcar'}</span>
          </CheckboxWrapper>
        );

      default:
        return (
          <FieldInput
            type='text'
            value={value || ''}
            onChange={e => scheduleSave(field.key, e.target.value)}
            disabled={isDisabled}
          />
        );
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Campos Personalizados</Title>
          {!readOnly && (
            <AddButton onClick={() => setIsCreateModalOpen(true)}>
              <MdAdd size={16} />
              Criar Campo
            </AddButton>
          )}
        </Header>
        <EmptyState>Carregando campos...</EmptyState>
        <CreateCustomFieldModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateField}
          teamId={teamId}
          projectId={projectId}
        />
      </Container>
    );
  }

  if (fields.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Campos Personalizados</Title>
          {!readOnly && (
            <AddButton onClick={() => setIsCreateModalOpen(true)}>
              <MdAdd size={16} />
              Criar Campo
            </AddButton>
          )}
        </Header>
        <EmptyState>Nenhum campo personalizado configurado</EmptyState>
        <CreateCustomFieldModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateField}
          teamId={teamId}
          projectId={projectId}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Campos Personalizados</Title>
        {!readOnly && (
          <AddButton onClick={() => setIsCreateModalOpen(true)}>
            <MdAdd size={16} />
            Criar Campo
          </AddButton>
        )}
      </Header>
      <FieldsList>
        {fields.map(field => (
          <FieldGroup key={field.id}>
            <FieldLabel>
              {field.name}
              {field.isRequired && <RequiredIndicator>*</RequiredIndicator>}
            </FieldLabel>
            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
            {renderFieldInput(field)}
          </FieldGroup>
        ))}
      </FieldsList>

      <CreateCustomFieldModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateField}
        teamId={teamId}
        projectId={projectId}
      />
    </Container>
  );
};
