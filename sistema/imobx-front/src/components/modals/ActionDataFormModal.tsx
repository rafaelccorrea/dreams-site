import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { MdClose, MdInfo } from 'react-icons/md';
import {
  Button,
  Select,
  Input,
  InputNumber,
  ConfigProvider,
  theme,
  Form,
} from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { MaskedInput } from '../common/MaskedInput';
import {
  maskCPF,
  maskCNPJ,
  maskPhoneAuto,
  maskCEP,
  validateCPF,
  validateCNPJ,
  validatePhone,
  validateCEP,
  validateEmail,
} from '../../utils/masks';
import type {
  ColumnAction,
  ActionType,
  FieldMapping,
} from '../../types/kanbanValidations';
import type { KanbanTask } from '../../types/kanban';

interface ActionDataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Record<string, any>) => Promise<void>;
  action: ColumnAction;
  task: KanbanTask;
  mappedData?: Record<string, any>; // Dados já mapeados da tarefa
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10005;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5);
  border: 2px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10006;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ActionIcon = styled.span`
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;

  .ant-btn {
    height: 40px;
    padding: 0 24px;
    font-weight: 600;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column-reverse;

    .ant-btn {
      width: 100%;
    }
  }
`;

const InfoBox = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.infoBackground};
  border: 1px solid ${props => props.theme.colors.infoBorder};
  border-radius: 12px;
  color: ${props => props.theme.colors.infoText};
  font-size: 13px;
  line-height: 1.6;
  border-left: 4px solid ${props => props.theme.colors.primary};
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const InfoIcon = styled(MdInfo)`
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: block;
  margin-bottom: 4px;
  font-size: 14px;

  .required {
    color: ${props => props.theme.colors.error};
    margin-left: 4px;
  }
`;

const HelpText = styled.small`
  display: block;
  font-weight: normal;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
`;

// Função para obter título e ícone da ação
const getActionInfo = (
  actionType: ActionType
): { title: string; icon: string } => {
  const actions: Record<ActionType, { title: string; icon: string }> = {
    create_property: { title: 'Criar Propriedade', icon: '🏠' },
    create_client: { title: 'Criar Cliente', icon: '👤' },
    create_document: { title: 'Criar Documento', icon: '📄' },
    create_vistoria: { title: 'Criar Vistoria', icon: '🔍' },
    create_rental: { title: 'Criar Aluguel', icon: '🔑' },
    create_note: { title: 'Criar Nota', icon: '📝' },
    create_appointment: { title: 'Criar Agendamento', icon: '📅' },
    create_transaction: { title: 'Criar Transação', icon: '💰' },
    update_property: { title: 'Atualizar Propriedade', icon: '🏠' },
    update_client: { title: 'Atualizar Cliente', icon: '👤' },
    update_document: { title: 'Atualizar Documento', icon: '📄' },
    send_email: { title: 'Enviar Email', icon: '📧' },
    send_sms: { title: 'Enviar SMS', icon: '💬' },
    send_notification: { title: 'Enviar Notificação', icon: '🔔' },
    send_chat_message: { title: 'Enviar Mensagem', icon: '💬' },
    assign_user: { title: 'Atribuir Usuário', icon: '👥' },
    add_tag: { title: 'Adicionar Tag', icon: '🏷️' },
    set_priority: { title: 'Definir Prioridade', icon: '⚡' },
    set_due_date: { title: 'Definir Data de Vencimento', icon: '📆' },
    add_comment: { title: 'Adicionar Comentário', icon: '💬' },
    set_custom_field: { title: 'Definir Campo Customizado', icon: '🔧' },
    create_task: { title: 'Criar Tarefa', icon: '✅' },
    archive_documents: { title: 'Arquivar Documentos', icon: '📦' },
    update_relationship: { title: 'Atualizar Relacionamento', icon: '🔗' },
  };
  return actions[actionType] || { title: 'Executar Ação', icon: '⚙️' };
};

// Função para processar dados mapeados
const processMappedData = (
  fieldMapping: Record<string, FieldMapping> | undefined,
  task: KanbanTask
): Record<string, any> => {
  if (!fieldMapping) return {};

  const result: Record<string, any> = {};

  Object.entries(fieldMapping).forEach(([targetField, mapping]) => {
    let value: any = null;

    switch (mapping.source) {
      case 'task_field':
        if (mapping.sourceField) {
          value = (task as any)[mapping.sourceField];
        }
        break;
      case 'custom_field':
        if (mapping.customFieldId) {
          value = (task as any).customFields?.[mapping.customFieldId];
        }
        break;
      case 'fixed_value':
        value = mapping.defaultValue;
        break;
      default:
        value = mapping.defaultValue;
    }

    // Aplicar transformações se necessário
    if (value && mapping.transform) {
      // As transformações serão aplicadas no backend
    }

    // Usar valor padrão se não houver valor
    if (!value && mapping.defaultValue !== undefined) {
      value = mapping.defaultValue;
    }

    result[targetField] = value;
  });

  return result;
};

export const ActionDataFormModal: React.FC<ActionDataFormModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  task,
  mappedData,
}) => {
  const { theme: currentTheme } = useTheme();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayValues, setDisplayValues] = useState<Record<string, string>>(
    {}
  );
  const [form] = Form.useForm();
  const modalContentRef = useRef<HTMLDivElement>(null);

  const actionInfo = getActionInfo(action.type);
  const initialData =
    mappedData || processMappedData(action.config?.fieldMapping, task);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      form.setFieldsValue(initialData);
      setDisplayValues({}); // Limpar valores formatados ao abrir
    }
  }, [isOpen, initialData, form]);

  // Handlers para máscaras
  const handlePhoneChange = useCallback(
    (field: string, value: string) => {
      const formatted = maskPhoneAuto(value);
      setDisplayValues((prev: Record<string, string>) => ({
        ...prev,
        [field]: formatted,
      }));
      form.setFieldValue(field, value.replace(/\D/g, ''));
    },
    [form]
  );

  const handleCEPChange = useCallback(
    (field: string, value: string) => {
      const formatted = maskCEP(value);
      setDisplayValues((prev: Record<string, string>) => ({
        ...prev,
        [field]: formatted,
      }));
      form.setFieldValue(field, value.replace(/\D/g, ''));
    },
    [form]
  );

  const handleCurrencyChange = useCallback(
    (field: string, value: string) => {
      // value vem do MaskedInput já como string numérica (em centavos, sem formatação)
      const numericValue = value ? parseFloat(value) / 100 : 0;
      form.setFieldValue(field, numericValue);
    },
    [form]
  );

  const handleDocumentChange = useCallback(
    (field: string, value: string) => {
      // value vem do input como string formatada, detecta se é CPF ou CNPJ
      const cleanValue = value.replace(/[^A-Z0-9]/gi, '');
      let formatted = '';
      if (cleanValue.length <= 11) {
        formatted = maskCPF(value);
      } else {
        formatted = maskCNPJ(value);
      }
      setDisplayValues((prev: Record<string, string>) => ({
        ...prev,
        [field]: formatted,
      }));
      form.setFieldValue(field, cleanValue);
    },
    [form]
  );

  // Função para validar CPF ou CNPJ
  const validateDocument = useCallback((_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Documento é obrigatório'));
    }
    const cleanValue = value.replace(/[^A-Z0-9]/gi, '');
    if (cleanValue.length === 11) {
      if (!validateCPF(cleanValue)) {
        return Promise.reject(new Error('CPF inválido'));
      }
    } else if (cleanValue.length === 14) {
      if (!validateCNPJ(cleanValue)) {
        return Promise.reject(new Error('CNPJ inválido'));
      }
    } else {
      return Promise.reject(
        new Error('Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos')
      );
    }
    return Promise.resolve();
  }, []);

  const antdTheme = {
    token: {
      colorBgContainer: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#374151' : '#e1e5e9',
      colorText: currentTheme === 'dark' ? '#f9fafb' : '#4B5563',
      colorTextSecondary: currentTheme === 'dark' ? '#ffffff' : '#6B7280',
      colorPrimary: currentTheme === 'dark' ? '#60a5fa' : '#1c4eff',
      zIndexPopupBase: 10007,
    },
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : undefined,
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setIsSubmitting(true);
      await onConfirm(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao validar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPopupContainer = () => modalContentRef.current || document.body;

  if (!isOpen) return null;

  // Renderizar formulário baseado no tipo de ação
  const renderForm = () => {
    switch (action.type) {
      case 'create_property':
        return renderPropertyForm();
      case 'create_client':
        return renderClientForm();
      case 'create_document':
        return renderDocumentForm();
      default:
        return renderGenericForm();
    }
  };

  const renderPropertyForm = () => {
    return (
      <>
        <InfoBox>
          <InfoIcon size={16} />
          <div>
            <strong>💡 Informação:</strong> Preencha os dados da propriedade que
            será criada. Campos marcados com{' '}
            <span style={{ color: 'var(--error)' }}>*</span> são obrigatórios.
            Alguns dados já foram preenchidos automaticamente a partir da
            tarefa.
          </div>
        </InfoBox>

        <Form
          form={form}
          layout='vertical'
          onValuesChange={(_, allValues) => setFormData(allValues)}
        >
          <FormGroup>
            <Label>
              Título <span className='required'>*</span>
              <HelpText>Título da propriedade</HelpText>
            </Label>
            <Form.Item
              name='title'
              rules={[
                { required: true, message: 'Título é obrigatório' },
                { min: 3, message: 'Título deve ter pelo menos 3 caracteres' },
                {
                  max: 255,
                  message: 'Título deve ter no máximo 255 caracteres',
                },
              ]}
            >
              <Input placeholder='Ex: Apartamento 2 quartos - Centro' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Descrição <span className='required'>*</span>
              <HelpText>Descrição detalhada da propriedade</HelpText>
            </Label>
            <Form.Item
              name='description'
              rules={[
                { required: true, message: 'Descrição é obrigatória' },
                {
                  min: 10,
                  message: 'Descrição deve ter pelo menos 10 caracteres',
                },
                {
                  max: 5000,
                  message: 'Descrição deve ter no máximo 5000 caracteres',
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder='Descreva a propriedade...'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Tipo <span className='required'>*</span>
              <HelpText>Tipo da propriedade</HelpText>
            </Label>
            <Form.Item
              name='type'
              rules={[{ required: true, message: 'Tipo é obrigatório' }]}
            >
              <Select
                getPopupContainer={getPopupContainer}
                options={[
                  { label: 'Casa', value: 'house' },
                  { label: 'Apartamento', value: 'apartment' },
                  { label: 'Comercial', value: 'commercial' },
                  { label: 'Terreno', value: 'land' },
                  { label: 'Rural', value: 'rural' },
                ]}
                placeholder='Selecione o tipo'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Endereço Completo <span className='required'>*</span>
            </Label>
            <Form.Item
              name='address'
              rules={[
                { required: true, message: 'Endereço é obrigatório' },
                {
                  min: 10,
                  message: 'Endereço deve ter pelo menos 10 caracteres',
                },
              ]}
            >
              <Input placeholder='Ex: Rua das Flores, 123' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Rua/Logradouro <span className='required'>*</span>
            </Label>
            <Form.Item
              name='street'
              rules={[{ required: true, message: 'Rua é obrigatória' }]}
            >
              <Input placeholder='Ex: Rua das Flores' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Número <span className='required'>*</span>
            </Label>
            <Form.Item
              name='number'
              rules={[{ required: true, message: 'Número é obrigatório' }]}
            >
              <Input placeholder='Ex: 123' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Complemento</Label>
            <Form.Item name='complement'>
              <Input placeholder='Ex: Apto 101' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Cidade <span className='required'>*</span>
            </Label>
            <Form.Item
              name='city'
              rules={[
                { required: true, message: 'Cidade é obrigatória' },
                { min: 2, message: 'Cidade deve ter pelo menos 2 caracteres' },
              ]}
            >
              <Input placeholder='Ex: São Paulo' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Estado (UF) <span className='required'>*</span>
            </Label>
            <Form.Item
              name='state'
              rules={[
                { required: true, message: 'Estado é obrigatório' },
                { len: 2, message: 'Estado deve ter exatamente 2 caracteres' },
                {
                  pattern: /^[A-Z]{2}$/,
                  message: 'Estado deve ser uma sigla válida (ex: SP)',
                },
              ]}
            >
              <Input
                placeholder='Ex: SP'
                maxLength={2}
                style={{ textTransform: 'uppercase' }}
                onChange={e => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, '');
                  form.setFieldValue('state', value);
                }}
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              CEP <span className='required'>*</span>
            </Label>
            <Form.Item
              name='zipCode'
              rules={[
                { required: true, message: 'CEP é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('CEP é obrigatório'));
                    }
                    const cleanCEP = value.replace(/\D/g, '');
                    if (!validateCEP(cleanCEP)) {
                      return Promise.reject(
                        new Error('CEP inválido (deve ter 8 dígitos)')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MaskedInput
                mask='cep'
                value={
                  displayValues.zipCode || form.getFieldValue('zipCode') || ''
                }
                onChange={value => handleCEPChange('zipCode', value)}
                placeholder='00000-000'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Bairro <span className='required'>*</span>
            </Label>
            <Form.Item
              name='neighborhood'
              rules={[
                { required: true, message: 'Bairro é obrigatório' },
                { min: 2, message: 'Bairro deve ter pelo menos 2 caracteres' },
              ]}
            >
              <Input placeholder='Ex: Centro' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Área Total (m²) <span className='required'>*</span>
            </Label>
            <Form.Item
              name='totalArea'
              rules={[
                { required: true, message: 'Área total é obrigatória' },
                {
                  type: 'number',
                  min: 0.01,
                  message: 'Área deve ser maior que zero',
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: '100%' }}
                placeholder='Ex: 75.5'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Área Construída (m²)</Label>
            <Form.Item
              name='builtArea'
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: 'Área não pode ser negativa',
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: '100%' }}
                placeholder='Ex: 60.0'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Quartos</Label>
            <Form.Item
              name='bedrooms'
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: 'Número de quartos não pode ser negativo',
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder='Ex: 2'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Banheiros</Label>
            <Form.Item
              name='bathrooms'
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: 'Número de banheiros não pode ser negativo',
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder='Ex: 2'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Vagas de Garagem</Label>
            <Form.Item
              name='parkingSpaces'
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: 'Número de vagas não pode ser negativo',
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder='Ex: 1'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Preço de Venda</Label>
            <Form.Item
              name='salePrice'
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: 'Preço não pode ser negativo',
                },
              ]}
            >
              <MaskedInput
                mask='currency'
                value={
                  form.getFieldValue('salePrice')
                    ? String(
                        Math.round((form.getFieldValue('salePrice') || 0) * 100)
                      )
                    : ''
                }
                onChange={value => handleCurrencyChange('salePrice', value)}
                placeholder='0,00'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Preço de Aluguel</Label>
            <Form.Item
              name='rentPrice'
              rules={[
                {
                  type: 'number',
                  min: 0,
                  message: 'Preço não pode ser negativo',
                },
              ]}
            >
              <MaskedInput
                mask='currency'
                value={
                  form.getFieldValue('rentPrice')
                    ? String(
                        Math.round((form.getFieldValue('rentPrice') || 0) * 100)
                      )
                    : ''
                }
                onChange={value => handleCurrencyChange('rentPrice', value)}
                placeholder='0,00'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label
              style={{ fontSize: '16px', fontWeight: 700, marginTop: '16px' }}
            >
              Dados do Proprietário
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>
              Nome do Proprietário <span className='required'>*</span>
            </Label>
            <Form.Item
              name='ownerName'
              rules={[
                {
                  required: true,
                  message: 'Nome do proprietário é obrigatório',
                },
                { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
              ]}
            >
              <Input placeholder='Nome completo' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Email do Proprietário <span className='required'>*</span>
            </Label>
            <Form.Item
              name='ownerEmail'
              rules={[
                { required: true, message: 'Email é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('Email é obrigatório'));
                    }
                    if (!validateEmail(value)) {
                      return Promise.reject(new Error('Email inválido'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type='email' placeholder='email@exemplo.com' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Telefone do Proprietário <span className='required'>*</span>
            </Label>
            <Form.Item
              name='ownerPhone'
              rules={[
                { required: true, message: 'Telefone é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(
                        new Error('Telefone é obrigatório')
                      );
                    }
                    const cleanPhone = value.replace(/\D/g, '');
                    if (!validatePhone(cleanPhone)) {
                      return Promise.reject(
                        new Error(
                          'Telefone inválido (deve ter 10 ou 11 dígitos)'
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MaskedInput
                mask='phone'
                value={
                  displayValues.ownerPhone ||
                  form.getFieldValue('ownerPhone') ||
                  ''
                }
                onChange={value => handlePhoneChange('ownerPhone', value)}
                placeholder='(00) 00000-0000'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              CPF/CNPJ do Proprietário <span className='required'>*</span>
            </Label>
            <Form.Item
              name='ownerDocument'
              rules={[
                { required: true, message: 'Documento é obrigatório' },
                { validator: validateDocument },
              ]}
            >
              <Input
                value={
                  displayValues.ownerDocument ||
                  form.getFieldValue('ownerDocument') ||
                  ''
                }
                onChange={e =>
                  handleDocumentChange('ownerDocument', e.target.value)
                }
                placeholder='123.456.789-01 ou 12.345.678/0001-90'
                maxLength={18}
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Endereço do Proprietário <span className='required'>*</span>
            </Label>
            <Form.Item
              name='ownerAddress'
              rules={[
                {
                  required: true,
                  message: 'Endereço do proprietário é obrigatório',
                },
                {
                  min: 10,
                  message: 'Endereço deve ter pelo menos 10 caracteres',
                },
              ]}
            >
              <Input placeholder='Endereço completo' />
            </Form.Item>
          </FormGroup>
        </Form>
      </>
    );
  };

  const renderClientForm = () => {
    const handleClientCPFChange = (value: string) => {
      const formatted = maskCPF(value);
      setDisplayValues((prev: Record<string, string>) => ({
        ...prev,
        cpf: formatted,
      }));
      form.setFieldValue('cpf', value.replace(/\D/g, ''));
    };

    const handleClientPhoneChange = (value: string) => {
      const formatted = maskPhoneAuto(value);
      setDisplayValues((prev: Record<string, string>) => ({
        ...prev,
        phone: formatted,
      }));
      form.setFieldValue('phone', value.replace(/\D/g, ''));
    };

    const handleClientCEPChange = (value: string) => {
      const formatted = maskCEP(value);
      setDisplayValues((prev: Record<string, string>) => ({
        ...prev,
        zipCode: formatted,
      }));
      form.setFieldValue('zipCode', value.replace(/\D/g, ''));
    };

    return (
      <>
        <InfoBox>
          <InfoIcon size={16} />
          <div>
            <strong>💡 Informação:</strong> Preencha os dados do cliente que
            será criado. Campos marcados com{' '}
            <span style={{ color: 'var(--error)' }}>*</span> são obrigatórios.
          </div>
        </InfoBox>

        <Form
          form={form}
          layout='vertical'
          onValuesChange={(_, allValues) => setFormData(allValues)}
        >
          <FormGroup>
            <Label>
              Nome <span className='required'>*</span>
            </Label>
            <Form.Item
              name='name'
              rules={[
                { required: true, message: 'Nome é obrigatório' },
                { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
                { max: 255, message: 'Nome deve ter no máximo 255 caracteres' },
              ]}
            >
              <Input placeholder='Nome completo' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Email <span className='required'>*</span>
            </Label>
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Email é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('Email é obrigatório'));
                    }
                    if (!validateEmail(value)) {
                      return Promise.reject(new Error('Email inválido'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type='email' placeholder='email@exemplo.com' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              CPF <span className='required'>*</span>
            </Label>
            <Form.Item
              name='cpf'
              rules={[
                { required: true, message: 'CPF é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('CPF é obrigatório'));
                    }
                    const cleanCPF = value.replace(/\D/g, '');
                    if (cleanCPF.length !== 11) {
                      return Promise.reject(
                        new Error('CPF deve ter 11 dígitos')
                      );
                    }
                    if (!validateCPF(cleanCPF)) {
                      return Promise.reject(new Error('CPF inválido'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MaskedInput
                mask='cpf'
                value={displayValues.cpf || form.getFieldValue('cpf') || ''}
                onChange={handleClientCPFChange}
                placeholder='000.000.000-00'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Telefone <span className='required'>*</span>
            </Label>
            <Form.Item
              name='phone'
              rules={[
                { required: true, message: 'Telefone é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(
                        new Error('Telefone é obrigatório')
                      );
                    }
                    const cleanPhone = value.replace(/\D/g, '');
                    if (!validatePhone(cleanPhone)) {
                      return Promise.reject(
                        new Error(
                          'Telefone inválido (deve ter 10 ou 11 dígitos)'
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MaskedInput
                mask='phone'
                value={displayValues.phone || form.getFieldValue('phone') || ''}
                onChange={handleClientPhoneChange}
                placeholder='(00) 00000-0000'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              CEP <span className='required'>*</span>
            </Label>
            <Form.Item
              name='zipCode'
              rules={[
                { required: true, message: 'CEP é obrigatório' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.reject(new Error('CEP é obrigatório'));
                    }
                    const cleanCEP = value.replace(/\D/g, '');
                    if (!validateCEP(cleanCEP)) {
                      return Promise.reject(
                        new Error('CEP inválido (deve ter 8 dígitos)')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <MaskedInput
                mask='cep'
                value={
                  displayValues.zipCode || form.getFieldValue('zipCode') || ''
                }
                onChange={handleClientCEPChange}
                placeholder='00000-000'
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Endereço <span className='required'>*</span>
            </Label>
            <Form.Item
              name='address'
              rules={[
                { required: true, message: 'Endereço é obrigatório' },
                {
                  min: 10,
                  message: 'Endereço deve ter pelo menos 10 caracteres',
                },
              ]}
            >
              <Input placeholder='Endereço completo' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Cidade <span className='required'>*</span>
            </Label>
            <Form.Item
              name='city'
              rules={[
                { required: true, message: 'Cidade é obrigatória' },
                { min: 2, message: 'Cidade deve ter pelo menos 2 caracteres' },
              ]}
            >
              <Input placeholder='Ex: São Paulo' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Estado (UF) <span className='required'>*</span>
            </Label>
            <Form.Item
              name='state'
              rules={[
                { required: true, message: 'Estado é obrigatório' },
                { len: 2, message: 'Estado deve ter exatamente 2 caracteres' },
                {
                  pattern: /^[A-Z]{2}$/,
                  message: 'Estado deve ser uma sigla válida (ex: SP)',
                },
              ]}
            >
              <Input
                placeholder='SP'
                maxLength={2}
                style={{ textTransform: 'uppercase' }}
                onChange={e => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, '');
                  form.setFieldValue('state', value);
                }}
              />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Bairro <span className='required'>*</span>
            </Label>
            <Form.Item
              name='neighborhood'
              rules={[
                { required: true, message: 'Bairro é obrigatório' },
                { min: 2, message: 'Bairro deve ter pelo menos 2 caracteres' },
              ]}
            >
              <Input placeholder='Ex: Centro' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Tipo <span className='required'>*</span>
            </Label>
            <Form.Item
              name='type'
              rules={[{ required: true, message: 'Tipo é obrigatório' }]}
            >
              <Select
                getPopupContainer={getPopupContainer}
                options={[
                  { label: 'Comprador', value: 'buyer' },
                  { label: 'Vendedor', value: 'seller' },
                  { label: 'Locatário', value: 'renter' },
                  { label: 'Locador', value: 'lessor' },
                  { label: 'Investidor', value: 'investor' },
                  { label: 'Geral', value: 'general' },
                ]}
                placeholder='Selecione o tipo'
              />
            </Form.Item>
          </FormGroup>
        </Form>
      </>
    );
  };

  const renderDocumentForm = () => {
    return (
      <>
        <InfoBox>
          <InfoIcon size={16} />
          <div>
            <strong>💡 Informação:</strong> Preencha os dados do documento que
            será criado. Campos marcados com{' '}
            <span style={{ color: 'var(--error)' }}>*</span> são obrigatórios.
          </div>
        </InfoBox>

        <Form
          form={form}
          layout='vertical'
          onValuesChange={(_, allValues) => setFormData(allValues)}
        >
          <FormGroup>
            <Label>
              Título <span className='required'>*</span>
            </Label>
            <Form.Item
              name='title'
              rules={[{ required: true, message: 'Título é obrigatório' }]}
            >
              <Input placeholder='Título do documento' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>
              Tipo <span className='required'>*</span>
            </Label>
            <Form.Item
              name='type'
              rules={[{ required: true, message: 'Tipo é obrigatório' }]}
            >
              <Input placeholder='Tipo do documento' />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <Label>Descrição</Label>
            <Form.Item name='description'>
              <Input.TextArea rows={3} placeholder='Descrição do documento' />
            </Form.Item>
          </FormGroup>
        </Form>
      </>
    );
  };

  const renderGenericForm = () => {
    // Formulário genérico para outros tipos de ações
    const fieldMapping = action.config?.fieldMapping;
    if (!fieldMapping) {
      return (
        <InfoBox>
          <InfoIcon size={16} />
          <div>
            Esta ação não requer dados adicionais. Clique em "Confirmar" para
            executá-la.
          </div>
        </InfoBox>
      );
    }

    return (
      <>
        <InfoBox>
          <InfoIcon size={16} />
          <div>
            <strong>💡 Informação:</strong> Revise os dados abaixo e confirme
            para executar a ação.
          </div>
        </InfoBox>

        <Form
          form={form}
          layout='vertical'
          onValuesChange={(_, allValues) => setFormData(allValues)}
        >
          {Object.entries(fieldMapping).map(([field, mapping]) => (
            <FormGroup key={field}>
              <Label>
                {field}
                {mapping.required && <span className='required'>*</span>}
              </Label>
              <Form.Item
                name={field}
                rules={
                  mapping.required
                    ? [{ required: true, message: `${field} é obrigatório` }]
                    : []
                }
              >
                <Input placeholder={`Valor para ${field}`} />
              </Form.Item>
            </FormGroup>
          ))}
        </Form>
      </>
    );
  };

  const modalContent = (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent ref={modalContentRef} onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <ActionIcon>{actionInfo.icon}</ActionIcon>
            {actionInfo.title}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>{renderForm()}</ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type='primary'
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Confirmar e Criar
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <ConfigProvider theme={antdTheme}>
      {createPortal(modalContent, document.body)}
    </ConfigProvider>
  );
};
