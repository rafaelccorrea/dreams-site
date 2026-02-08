import React from 'react';
import styled from 'styled-components';
import { MdAdd, MdDelete, MdArrowForward, MdInfo } from 'react-icons/md';
import { Button, Select, Input, Switch, ConfigProvider, theme } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import type {
  FieldMapping,
  FieldTransform,
} from '../../types/kanbanValidations';
import { FieldTransform as FieldTransformEnum } from '../../types/kanbanValidations';

interface FieldMappingEditorProps {
  value?: Record<string, FieldMapping>;
  onChange?: (value: Record<string, FieldMapping>) => void;
  targetEntityType?:
    | 'property'
    | 'client'
    | 'document'
    | 'vistoria'
    | 'rental'
    | 'transaction';
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoBox = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme.colors.infoBackground};
  border: 1px solid ${props => props.theme.colors.infoBorder};
  border-radius: 12px;
  color: ${props => props.theme.colors.infoText};
  font-size: 13px;
  line-height: 1.6;
  border-left: 4px solid ${props => props.theme.colors.primary};
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const InfoIcon = styled(MdInfo)`
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
  margin-top: 2px;
`;

const MappingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MappingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}40;
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}10;
  }
`;

const MappingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const MappingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FieldSelect = styled(Select)`
  min-width: 200px;
  flex: 1;
`;

const ArrowIcon = styled(MdArrowForward)`
  color: ${props => props.theme.colors.textSecondary};
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.error};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const RequiredBadge = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const DetailLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  min-width: 100px;
`;

const DetailInput = styled(Input)`
  flex: 1;
  min-width: 150px;
`;

const DetailSelect = styled(Select)`
  flex: 1;
  min-width: 150px;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Campos disponíveis na tarefa
const taskFields = [
  { value: 'id', label: 'ID da Tarefa' },
  { value: 'title', label: 'Título' },
  { value: 'description', label: 'Descrição' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'dueDate', label: 'Data de Vencimento' },
  { value: 'isCompleted', label: 'Está Concluída' },
  { value: 'assignedToId', label: 'ID do Responsável' },
  { value: 'projectId', label: 'ID do Projeto' },
  { value: 'columnId', label: 'ID da Coluna' },
  { value: 'createdAt', label: 'Data de Criação' },
  { value: 'updatedAt', label: 'Data de Atualização' },
  { value: 'status', label: 'Status' },
  { value: 'clientId', label: 'ID do Cliente' },
  { value: 'propertyId', label: 'ID da Propriedade' },
];

// Transformações disponíveis
const transforms: Array<{
  value: FieldTransform;
  label: string;
  description: string;
}> = [
  {
    value: FieldTransformEnum.UPPERCASE,
    label: 'Maiúsculas',
    description: 'Converte todo o texto para maiúsculas',
  },
  {
    value: FieldTransformEnum.LOWERCASE,
    label: 'Minúsculas',
    description: 'Converte todo o texto para minúsculas',
  },
  {
    value: FieldTransformEnum.CAPITALIZE,
    label: 'Capitalizar',
    description: 'Primeira letra maiúscula',
  },
  {
    value: FieldTransformEnum.TRIM,
    label: 'Remover Espaços',
    description: 'Remove espaços no início e fim',
  },
  {
    value: FieldTransformEnum.EXTRACT_NUMBERS,
    label: 'Extrair Números',
    description: 'Remove tudo exceto números',
  },
  {
    value: FieldTransformEnum.FORMAT_CPF,
    label: 'Formatar CPF',
    description: 'Formata como 123.456.789-01',
  },
  {
    value: FieldTransformEnum.FORMAT_CNPJ,
    label: 'Formatar CNPJ',
    description: 'Formata como 12.345.678/0001-90',
  },
  {
    value: FieldTransformEnum.FORMAT_PHONE,
    label: 'Formatar Telefone',
    description: 'Formata como (11) 98765-4321',
  },
  {
    value: FieldTransformEnum.FORMAT_DATE,
    label: 'Formatar Data',
    description: 'Formata data para ISO',
  },
  {
    value: FieldTransformEnum.FORMAT_CURRENCY,
    label: 'Formatar Moeda',
    description: 'Formata como R$ 1.500,00',
  },
];

// Campos de destino por tipo de entidade
const getTargetFields = (
  entityType?: string
): Array<{
  value: string;
  label: string;
  required: boolean;
  description?: string;
}> => {
  switch (entityType) {
    case 'property':
      return [
        // Campos obrigatórios
        {
          value: 'title',
          label: 'Título',
          required: true,
          description: 'Título da propriedade',
        },
        {
          value: 'description',
          label: 'Descrição',
          required: true,
          description: 'Descrição detalhada',
        },
        {
          value: 'type',
          label: 'Tipo',
          required: true,
          description: 'house, apartment, commercial, land, rural',
        },
        {
          value: 'address',
          label: 'Endereço Completo',
          required: true,
          description: 'Endereço completo',
        },
        {
          value: 'street',
          label: 'Rua/Logradouro',
          required: true,
          description: 'Nome da rua',
        },
        {
          value: 'number',
          label: 'Número',
          required: true,
          description: 'Número do endereço',
        },
        {
          value: 'city',
          label: 'Cidade',
          required: true,
          description: 'Cidade',
        },
        {
          value: 'state',
          label: 'Estado (UF)',
          required: true,
          description: 'Estado em 2 letras (ex: SP)',
        },
        {
          value: 'zipCode',
          label: 'CEP',
          required: true,
          description: 'CEP (apenas números)',
        },
        {
          value: 'neighborhood',
          label: 'Bairro',
          required: true,
          description: 'Bairro',
        },
        {
          value: 'totalArea',
          label: 'Área Total (m²)',
          required: true,
          description: 'Área total em metros quadrados',
        },
        {
          value: 'ownerName',
          label: 'Nome do Proprietário',
          required: true,
          description: 'Nome completo do proprietário',
        },
        {
          value: 'ownerEmail',
          label: 'Email do Proprietário',
          required: true,
          description: 'Email do proprietário',
        },
        {
          value: 'ownerPhone',
          label: 'Telefone do Proprietário',
          required: true,
          description: 'Telefone do proprietário',
        },
        {
          value: 'ownerDocument',
          label: 'CPF/CNPJ do Proprietário',
          required: true,
          description: 'Documento do proprietário',
        },
        {
          value: 'ownerAddress',
          label: 'Endereço do Proprietário',
          required: true,
          description: 'Endereço do proprietário',
        },

        // Campos opcionais básicos
        {
          value: 'complement',
          label: 'Complemento',
          required: false,
          description: 'Complemento do endereço',
        },
        {
          value: 'builtArea',
          label: 'Área Construída (m²)',
          required: false,
          description: 'Área construída em m²',
        },
        {
          value: 'bedrooms',
          label: 'Quartos',
          required: false,
          description: 'Número de quartos',
        },
        {
          value: 'bathrooms',
          label: 'Banheiros',
          required: false,
          description: 'Número de banheiros',
        },
        {
          value: 'parkingSpaces',
          label: 'Vagas de Garagem',
          required: false,
          description: 'Número de vagas',
        },
        {
          value: 'salePrice',
          label: 'Preço de Venda',
          required: false,
          description: 'Preço de venda (números apenas)',
        },
        {
          value: 'rentPrice',
          label: 'Preço de Aluguel',
          required: false,
          description: 'Preço de aluguel (números apenas)',
        },
        {
          value: 'minSalePrice',
          label: 'Valor Mínimo de Venda',
          required: false,
          description: 'Valor mínimo aceito para venda',
        },
        {
          value: 'minRentPrice',
          label: 'Valor Mínimo de Aluguel',
          required: false,
          description: 'Valor mínimo aceito para aluguel',
        },
        {
          value: 'condominiumFee',
          label: 'Condomínio',
          required: false,
          description: 'Valor do condomínio',
        },
        {
          value: 'iptu',
          label: 'IPTU',
          required: false,
          description: 'Valor do IPTU',
        },
        {
          value: 'features',
          label: 'Características',
          required: false,
          description: 'Array de características (JSON string)',
        },
        {
          value: 'acceptsNegotiation',
          label: 'Aceita Negociação',
          required: false,
          description: 'Se aceita negociação',
        },
        {
          value: 'status',
          label: 'Status',
          required: false,
          description: 'Status da propriedade (draft, available, etc)',
        },
        {
          value: 'isActive',
          label: 'Ativa',
          required: false,
          description: 'Se a propriedade está ativa',
        },
        {
          value: 'isFeatured',
          label: 'Destacada',
          required: false,
          description: 'Se é propriedade destacada',
        },
        {
          value: 'isAvailableForSite',
          label: 'Disponível no Site',
          required: false,
          description: 'Se aparece no site público',
        },

        // Campos MCMV
        {
          value: 'mcmvEligible',
          label: 'Elegível para MCMV',
          required: false,
          description: 'Se é elegível para MCMV',
        },
        {
          value: 'mcmvIncomeRange',
          label: 'Faixa de Renda MCMV',
          required: false,
          description: 'faixa1, faixa2 ou faixa3',
        },
        {
          value: 'mcmvMaxValue',
          label: 'Valor Máximo MCMV',
          required: false,
          description: 'Valor máximo para MCMV',
        },
        {
          value: 'mcmvSubsidy',
          label: 'Subsídio MCMV',
          required: false,
          description: 'Valor do subsídio',
        },
        {
          value: 'mcmvDocumentation',
          label: 'Documentação MCMV',
          required: false,
          description: 'Array de documentos necessários (JSON string)',
        },
        {
          value: 'mcmvNotes',
          label: 'Observações MCMV',
          required: false,
          description: 'Observações sobre MCMV',
        },
      ];
    case 'client':
      return [
        // Campos obrigatórios
        {
          value: 'name',
          label: 'Nome',
          required: true,
          description: 'Nome completo do cliente',
        },
        {
          value: 'email',
          label: 'Email',
          required: true,
          description: 'Email do cliente',
        },
        {
          value: 'cpf',
          label: 'CPF',
          required: true,
          description: 'CPF (11 dígitos)',
        },
        {
          value: 'phone',
          label: 'Telefone',
          required: true,
          description: 'Telefone principal',
        },
        {
          value: 'zipCode',
          label: 'CEP',
          required: true,
          description: 'CEP (8 dígitos)',
        },
        {
          value: 'address',
          label: 'Endereço',
          required: true,
          description: 'Endereço completo',
        },
        {
          value: 'city',
          label: 'Cidade',
          required: true,
          description: 'Cidade',
        },
        {
          value: 'state',
          label: 'Estado (UF)',
          required: true,
          description: 'Estado em 2 letras',
        },
        {
          value: 'neighborhood',
          label: 'Bairro',
          required: true,
          description: 'Bairro',
        },
        {
          value: 'type',
          label: 'Tipo',
          required: true,
          description: 'buyer, seller, renter, lessor, investor, general',
        },

        // Campos opcionais
        {
          value: 'secondaryPhone',
          label: 'Telefone Secundário',
          required: false,
          description: 'Telefone secundário',
        },
        {
          value: 'whatsapp',
          label: 'WhatsApp',
          required: false,
          description: 'Número do WhatsApp',
        },
        {
          value: 'birthDate',
          label: 'Data de Nascimento',
          required: false,
          description: 'Data de nascimento (ISO)',
        },
        {
          value: 'anniversaryDate',
          label: 'Aniversário',
          required: false,
          description: 'Aniversário (MM-DD)',
        },
        { value: 'rg', label: 'RG', required: false, description: 'RG' },
        {
          value: 'maritalStatus',
          label: 'Estado Civil',
          required: false,
          description: 'single, married, divorced, etc',
        },
        {
          value: 'employmentStatus',
          label: 'Situação Profissional',
          required: false,
          description: 'employed, unemployed, retired, etc',
        },
        {
          value: 'companyName',
          label: 'Nome da Empresa',
          required: false,
          description: 'Nome da empresa onde trabalha',
        },
        {
          value: 'jobPosition',
          label: 'Cargo',
          required: false,
          description: 'Cargo/função',
        },
        {
          value: 'monthlyIncome',
          label: 'Renda Mensal',
          required: false,
          description: 'Renda mensal (número)',
        },
        {
          value: 'incomeRange',
          label: 'Faixa de Renda',
          required: false,
          description: 'Faixa de renda',
        },
        {
          value: 'loanRange',
          label: 'Faixa de Financiamento',
          required: false,
          description: 'Faixa de financiamento',
        },
        {
          value: 'priceRange',
          label: 'Faixa de Preço',
          required: false,
          description: 'Faixa de preço desejada',
        },
        {
          value: 'preferredPropertyType',
          label: 'Tipo de Propriedade Preferido',
          required: false,
          description: 'Tipo de propriedade preferido',
        },
        {
          value: 'preferredCity',
          label: 'Cidade Preferida',
          required: false,
          description: 'Cidade preferida',
        },
        {
          value: 'preferredNeighborhood',
          label: 'Bairro Preferido',
          required: false,
          description: 'Bairro preferido',
        },
        {
          value: 'desiredFeatures',
          label: 'Características Desejadas',
          required: false,
          description: 'Array de características (JSON string)',
        },
        {
          value: 'leadSource',
          label: 'Origem do Lead',
          required: false,
          description: 'Origem do lead',
        },
        {
          value: 'preferredContactMethod',
          label: 'Método de Contato Preferido',
          required: false,
          description: 'Método de contato preferido',
        },
        {
          value: 'notes',
          label: 'Observações',
          required: false,
          description: 'Observações gerais',
        },
        {
          value: 'status',
          label: 'Status',
          required: false,
          description: 'Status do cliente (active, inactive, etc)',
        },
      ];
    case 'document':
      return [
        {
          value: 'title',
          label: 'Título',
          required: true,
          description: 'Título do documento',
        },
        {
          value: 'type',
          label: 'Tipo',
          required: true,
          description: 'Tipo do documento',
        },
        {
          value: 'description',
          label: 'Descrição',
          required: false,
          description: 'Descrição do documento',
        },
        {
          value: 'category',
          label: 'Categoria',
          required: false,
          description: 'Categoria do documento',
        },
        {
          value: 'tags',
          label: 'Tags',
          required: false,
          description: 'Array de tags (JSON string)',
        },
        {
          value: 'notes',
          label: 'Observações',
          required: false,
          description: 'Observações',
        },
        {
          value: 'expiryDate',
          label: 'Data de Validade',
          required: false,
          description: 'Data de validade (ISO)',
        },
      ];
    default:
      return [];
  }
};

export const FieldMappingEditor: React.FC<FieldMappingEditorProps> = ({
  value = {},
  onChange,
  targetEntityType,
}) => {
  const { theme: currentTheme } = useTheme();
  const mappings = Object.entries(value).map(([targetField, mapping]) => ({
    ...mapping,
    targetField,
  }));

  const targetFields = getTargetFields(targetEntityType);

  const antdTheme = {
    token: {
      colorBgContainer: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#374151' : '#e1e5e9',
      colorText: currentTheme === 'dark' ? '#f9fafb' : '#4B5563',
      colorTextSecondary: currentTheme === 'dark' ? '#ffffff' : '#6B7280',
      colorPrimary: currentTheme === 'dark' ? '#60a5fa' : '#1c4eff',
      zIndexPopupBase: 10004,
    },
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : undefined,
  };

  const addMapping = () => {
    const firstField = targetFields[0];
    if (!firstField) return;

    const newMapping: FieldMapping = {
      source: 'task_field',
      sourceField: 'title',
      targetField: firstField.value,
      required: firstField.required || false,
    };
    onChange?.({ ...value, [firstField.value]: newMapping });
  };

  const updateMapping = (
    targetField: string,
    updates: Partial<FieldMapping>
  ) => {
    const current = value[targetField];
    if (!current) return;

    const updated = { ...current, ...updates };
    const newValue = { ...value };

    // Se targetField mudou, remover o antigo e adicionar o novo
    if (updates.targetField && updates.targetField !== targetField) {
      delete newValue[targetField];
      newValue[updates.targetField] = updated;
    } else {
      newValue[targetField] = updated;
    }

    onChange?.(newValue);
  };

  const removeMapping = (targetField: string) => {
    const newValue = { ...value };
    delete newValue[targetField];
    onChange?.(newValue);
  };

  const getFieldInfo = (fieldValue: string) => {
    return targetFields.find(f => f.value === fieldValue);
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <Container>
        <Header>
          <div>
            <label
              style={{ fontWeight: 600, fontSize: '14px', color: 'inherit' }}
            >
              Mapeamento de Campos
            </label>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '4px',
              }}
            >
              Configure como os dados da tarefa serão mapeados para a entidade
            </div>
          </div>
          <Button
            type='dashed'
            icon={<MdAdd size={16} />}
            onClick={addMapping}
            size='small'
          >
            Adicionar
          </Button>
        </Header>

        {targetEntityType && (
          <InfoBox>
            <InfoIcon size={16} />
            <div>
              <strong>💡 Dica:</strong> Campos marcados com{' '}
              <RequiredBadge>*</RequiredBadge> são obrigatórios. Para campos de
              valores monetários, use a transformação "Extrair Números" para
              remover formatação. Arrays devem ser armazenados como JSON strings
              em campos customizados.
            </div>
          </InfoBox>
        )}

        {mappings.length === 0 && (
          <EmptyState>
            <div style={{ marginBottom: '8px' }}>
              📋 Nenhum mapeamento configurado
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              Clique em "Adicionar" para começar a mapear campos
            </div>
          </EmptyState>
        )}

        <MappingList>
          {mappings.map((mapping, index) => {
            const fieldInfo = getFieldInfo(mapping.targetField);
            const isRequired = fieldInfo?.required || mapping.required || false;

            return (
              <MappingItem key={index}>
                <MappingRow>
                  <FieldSelect
                    value={mapping.source}
                    onChange={value =>
                      updateMapping(mapping.targetField, {
                        source: value as FieldMapping['source'],
                      })
                    }
                    options={[
                      { label: '📋 Campo da Tarefa', value: 'task_field' },
                      { label: '🔧 Campo Customizado', value: 'custom_field' },
                      { label: '🔒 Valor Fixo', value: 'fixed_value' },
                      { label: '👤 Campo do Usuário', value: 'user_field' },
                      { label: '📁 Campo do Projeto', value: 'project_field' },
                    ]}
                    style={{ minWidth: '200px' }}
                  />

                  {mapping.source === 'task_field' && (
                    <FieldSelect
                      value={mapping.sourceField}
                      onChange={value =>
                        updateMapping(mapping.targetField, {
                          sourceField: value as string,
                        })
                      }
                      options={taskFields}
                      placeholder='Selecione o campo'
                      style={{ minWidth: '200px' }}
                    />
                  )}

                  {mapping.source === 'custom_field' && (
                    <DetailInput
                      value={mapping.customFieldId || ''}
                      onChange={e =>
                        updateMapping(mapping.targetField, {
                          customFieldId: e.target.value,
                        })
                      }
                      placeholder='ID do campo customizado'
                      style={{ minWidth: '200px' }}
                    />
                  )}

                  {mapping.source === 'fixed_value' && (
                    <DetailInput
                      value={mapping.defaultValue || ''}
                      onChange={e =>
                        updateMapping(mapping.targetField, {
                          defaultValue: e.target.value,
                        })
                      }
                      placeholder='Valor fixo'
                      style={{ minWidth: '200px' }}
                    />
                  )}

                  <ArrowIcon size={16} />

                  <FieldSelect
                    value={mapping.targetField}
                    onChange={value => {
                      const fieldValue = value as string;
                      const newFieldInfo = getFieldInfo(fieldValue);
                      updateMapping(mapping.targetField, {
                        targetField: fieldValue,
                        required: newFieldInfo?.required || false,
                      });
                    }}
                    options={targetFields.map(f => ({
                      label: `${f.label}${f.required ? ' *' : ''}`,
                      value: f.value,
                    }))}
                    placeholder='Campo destino'
                    style={{ minWidth: '200px' }}
                  />

                  <RemoveButton
                    onClick={() => removeMapping(mapping.targetField)}
                  >
                    <MdDelete size={16} />
                  </RemoveButton>
                </MappingRow>

                <MappingDetails>
                  {fieldInfo?.description && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '8px',
                      }}
                    >
                      {fieldInfo.description}
                    </div>
                  )}

                  <DetailRow>
                    <DetailLabel>Transformação:</DetailLabel>
                    <DetailSelect
                      value={mapping.transform}
                      onChange={value =>
                        updateMapping(mapping.targetField, {
                          transform: value as FieldTransform | undefined,
                        })
                      }
                      allowClear
                      placeholder='Nenhuma transformação'
                      options={transforms.map(t => ({
                        label: t.label,
                        value: t.value,
                        title: t.description,
                      }))}
                    />
                  </DetailRow>

                  {mapping.source !== 'fixed_value' && (
                    <DetailRow>
                      <DetailLabel>Valor Padrão:</DetailLabel>
                      <DetailInput
                        value={mapping.defaultValue || ''}
                        onChange={e =>
                          updateMapping(mapping.targetField, {
                            defaultValue: e.target.value,
                          })
                        }
                        placeholder='Valor usado se o campo estiver vazio'
                      />
                    </DetailRow>
                  )}

                  <DetailRow>
                    <SwitchContainer>
                      <Switch
                        checked={mapping.required || false}
                        onChange={checked =>
                          updateMapping(mapping.targetField, {
                            required: checked,
                          })
                        }
                        size='small'
                      />
                      <DetailLabel style={{ minWidth: 'auto' }}>
                        Campo obrigatório
                        {isRequired && <RequiredBadge>*</RequiredBadge>}
                      </DetailLabel>
                    </SwitchContainer>
                  </DetailRow>
                </MappingDetails>
              </MappingItem>
            );
          })}
        </MappingList>
      </Container>
    </ConfigProvider>
  );
};
