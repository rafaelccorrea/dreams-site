import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MdArrowBack, MdCheck } from 'react-icons/md';
import { Select, Input, ConfigProvider, theme } from 'antd';
import { toast } from 'react-toastify';
import { Layout } from '../components/layout/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { useKanbanValidations } from '../hooks/useKanbanValidations';
import { useKanban } from '../hooks/useKanban';
import { buildKanbanUrl } from '../utils/kanbanState';
import { kanbanValidationsApi } from '../services/kanbanValidationsApi';
import type { CreateValidationDto } from '../types/kanbanValidations';
import { MAX_VALIDATIONS_PER_COLUMN } from '../types/kanbanValidations';
import {
  CONDITION_FIELD_OPTIONS,
  getOperatorOptionsForField,
  getValueTypeForField,
  getValueOptionsForField,
  isDateField,
  isPriorityField,
  getAllowedOperatorsForField,
  OPERATORS_WITHOUT_VALUE,
  OPERATORS_REQUIRING_ARRAY,
  normalizeConditionValue,
} from '../utils/customConditionConfig';

// Reutilizar estilos do CreateTaskPage
const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 100%;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HelpText = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.7;
`;

const InfoBox = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}40;
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const StyledButton = styled.button<{ $primary?: boolean; $loading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  border: none;
  opacity: ${props => (props.$loading ? 0.6 : 1)};

  ${props =>
    props.$primary
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryHover};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(28, 78, 255, 0.3);
    }
  `
      : `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.cardBackground};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColumnRelationBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.primary}40;
  border-radius: 12px;
  margin: 16px 0;
`;

const ColumnBox = styled.div`
  padding: 12px 20px;
  background: ${props => props.theme.colors.primary}15;
  border: 2px solid ${props => props.theme.colors.primary}40;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  flex: 1;
  text-align: center;
`;

const Arrow = styled.span`
  font-size: 24px;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const CreateValidationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme: currentTheme } = useTheme();
  const { board } = useKanban();

  const columnId = searchParams.get('columnId') || '';
  const validationId = searchParams.get('validationId');
  const projectId = searchParams.get('projectId');
  const teamId = searchParams.get('teamId');
  const workspace = searchParams.get('workspace');

  const { createValidation, updateValidation, validations } =
    useKanbanValidations(columnId);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateValidationDto>({
    type: 'required_field',
    config: {},
    behavior: 'block',
    message: '',
    fromColumnId: undefined,
    requireAdjacentPosition: false,
  });

  // ✅ Buscar colunas diretamente da API para garantir que estejam disponíveis
  const [simpleColumns, setSimpleColumns] = useState<
    Array<{ id: string; title: string; position: number }>
  >([]);
  const [columnsLoading, setColumnsLoading] = useState(true);

  const columns =
    board.columns.length > 0
      ? board.columns.sort((a, b) => a.position - b.position)
      : simpleColumns.sort((a, b) => a.position - b.position);

  // ✅ Buscar colunas simples da API
  useEffect(() => {
    const loadColumns = async () => {
      if (!teamId) return;

      try {
        setColumnsLoading(true);
        const cols = await kanbanValidationsApi.getSimpleColumns(
          teamId,
          projectId || undefined
        );
        setSimpleColumns(cols);
        console.log('✅ CreateValidationPage - Colunas carregadas:', cols);
      } catch (error) {
        console.error('❌ Erro ao carregar colunas:', error);
      } finally {
        setColumnsLoading(false);
      }
    };

    loadColumns();
  }, [teamId, projectId]);

  useEffect(() => {
    if (validationId && validations.length > 0) {
      const validation = validations.find(v => v.id === validationId);
      if (validation) {
        setFormData({
          type: validation.type,
          config: validation.config,
          behavior: validation.behavior,
          message: validation.message,
          fromColumnId: validation.fromColumnId,
          requireAdjacentPosition: validation.requireAdjacentPosition || false,
        });
      }
    } else if (
      !validationId &&
      columnId &&
      columns.length > 0 &&
      !columnsLoading
    ) {
      // ✅ Ao criar nova validação, automaticamente definir como condicional
      // A validação está sendo criada na coluna de DESTINO (columnId)
      // O fromColumnId deve ser a coluna de ORIGEM (posição -1)
      const currentCol = columns.find(col => col.id === columnId);

      if (currentCol) {
        // Acessar position corretamente (pode estar em currentCol.position ou (currentCol as any).position)
        const currentPosition =
          (currentCol as any).position ?? currentCol.position ?? 0;

        console.log('🔍 CreateValidationPage - Coluna atual encontrada:', {
          id: currentCol.id,
          title: (currentCol as any).title ?? currentCol.title,
          position: currentPosition,
        });

        // ✅ Buscar a coluna ANTERIOR (posição -1) que será a origem
        // A validação está sendo criada na coluna de DESTINO (columnId)
        // O fromColumnId deve ser a coluna de ORIGEM (posição -1)
        // Exemplo: Se estamos criando validação na coluna "Em Progresso" (posição 1),
        // o fromColumnId deve ser "A Fazer" (posição 0)
        // E a visualização deve mostrar: "A Fazer → Em Progresso"
        const previousColumn = columns
          .filter(col => col.id !== columnId)
          .find(col => {
            const colPosition = (col as any).position ?? col.position ?? -1;
            const isPrevious = colPosition === currentPosition - 1;
            console.log('🔍 Verificando coluna:', {
              id: col.id,
              title: (col as any).title ?? col.title,
              position: colPosition,
              currentPosition,
              isPrevious,
            });
            return isPrevious;
          });

        // ✅ Buscar também a coluna PRÓXIMA (posição +1) para a visualização
        // A visualização deve mostrar: "Coluna Atual → Coluna Próxima"
        const nextColumn = columns
          .filter(col => col.id !== columnId)
          .find(col => {
            const colPosition = (col as any).position ?? col.position ?? -1;
            return colPosition === currentPosition + 1;
          });

        console.log('🔍 CreateValidationPage - Definindo fromColumnId:', {
          columnId,
          currentColTitle: (currentCol as any).title ?? currentCol.title,
          currentColPosition: currentPosition,
          previousColumn: previousColumn
            ? {
                id: previousColumn.id,
                title: (previousColumn as any).title ?? previousColumn.title,
                position:
                  (previousColumn as any).position ?? previousColumn.position,
              }
            : null,
          nextColumn: nextColumn
            ? {
                id: nextColumn.id,
                title: (nextColumn as any).title ?? nextColumn.title,
                position: (nextColumn as any).position ?? nextColumn.position,
              }
            : null,
          columnsCount: columns.length,
          allColumns: columns.map(c => ({
            id: c.id,
            title: (c as any).title ?? c.title,
            position: (c as any).position ?? c.position,
          })),
        });

        // Sempre atualizar para garantir que fromColumnId seja definido
        // Se não houver coluna anterior (posição 0), não definir fromColumnId
        setFormData(prev => {
          const newFromColumnId = previousColumn?.id;
          console.log('📝 CreateValidationPage - Atualizando formData:', {
            prevFromColumnId: prev.fromColumnId,
            newFromColumnId,
            previousColumn: previousColumn
              ? { id: previousColumn.id, title: (previousColumn as any).title }
              : null,
          });

          if (prev.fromColumnId === newFromColumnId) {
            return prev; // Não atualizar se já está correto
          }
          return {
            ...prev,
            fromColumnId: newFromColumnId,
            requireAdjacentPosition: previousColumn ? true : false,
          };
        });
      } else {
        console.warn(
          '⚠️ CreateValidationPage - Coluna atual não encontrada:',
          columnId,
          'Colunas disponíveis:',
          columns
        );
      }
    }
  }, [validationId, validations, columnId, columns, columnsLoading]);

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

  const handleBack = () => {
    const url = buildKanbanUrl({
      projectId: projectId || undefined,
      teamId: teamId || undefined,
      workspace: workspace === 'personal' ? 'personal' : undefined,
    });
    navigate(url);
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      toast.error('A mensagem de erro é obrigatória');
      return;
    }

    if (!validationId && validations.length >= MAX_VALIDATIONS_PER_COLUMN) {
      toast.error(
        `Esta coluna já possui o máximo de ${MAX_VALIDATIONS_PER_COLUMN} validações. Exclua uma para criar outra.`
      );
      return;
    }

    if (formData.type === 'custom_condition') {
      const cond = formData.config?.condition;
      if (!cond?.field?.trim()) {
        toast.error('Selecione o campo da condição customizada.');
        return;
      }
      if (!cond?.operator) {
        toast.error('Selecione o operador da condição customizada.');
        return;
      }
      const needsValue = !['empty', 'not_empty'].includes(cond.operator);
      if (needsValue) {
        const isArrayOp = ['in', 'not_in'].includes(cond.operator);
        const hasValue = isArrayOp
          ? (Array.isArray(cond.value) && cond.value.length > 0) ||
            (typeof cond.value === 'string' && cond.value.trim().length > 0)
          : cond.value !== undefined &&
            cond.value !== null &&
            String(cond.value).trim() !== '';
        if (!hasValue) {
          if (isArrayOp) {
            toast.error(
              'Informe pelo menos um valor para o operador "em lista" / "não está em lista".'
            );
          } else {
            toast.error('Informe o valor de comparação da condição.');
          }
          return;
        }
      }
    }

    if (!validationId) {
      const duplicateValidation = validations.find(v => {
        if (v.type !== formData.type) return false;
        if (formData.type === 'required_field') {
          return v.config?.fieldName === formData.config?.fieldName;
        }
        if (formData.type === 'required_document') {
          return (
            v.config?.documentType === formData.config?.documentType &&
            v.config?.documentStatus === formData.config?.documentStatus
          );
        }
        if (formData.type === 'required_relationship') {
          return (
            v.config?.relationshipType === formData.config?.relationshipType
          );
        }
        if (formData.type === 'required_checklist') {
          return v.config?.checklistId === formData.config?.checklistId;
        }
        if (formData.type === 'custom_condition') {
          const vCondition = v.config?.condition;
          const fCondition = formData.config?.condition;
          return (
            vCondition?.field === fCondition?.field &&
            vCondition?.operator === fCondition?.operator &&
            JSON.stringify(vCondition?.value) ===
              JSON.stringify(fCondition?.value)
          );
        }
        return false;
      });

      if (duplicateValidation) {
        toast.error('Já existe uma validação idêntica nesta coluna.');
        return;
      }
    }

    setIsSaving(true);
    try {
      let payload = formData;
      if (formData.type === 'custom_condition' && formData.config?.condition) {
        const cond = { ...formData.config.condition };
        const field = cond.field || 'priority';
        const allowedOps = getAllowedOperatorsForField(field);
        if (!allowedOps.includes(cond.operator as any)) {
          cond.operator = (allowedOps[0] || 'not_empty') as any;
        }
        const valueType = cond.valueType || getValueTypeForField(field);
        cond.valueType = valueType;
        cond.value = normalizeConditionValue(
          cond.value,
          valueType,
          cond.operator as any
        );
        payload = {
          ...formData,
          config: { ...formData.config, condition: cond },
        };
      }
      if (validationId) {
        await updateValidation(validationId, payload);
      } else {
        await createValidation(payload);
      }
      handleBack();
    } catch {
      // Erro já é tratado pelo hook
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <ConfigProvider theme={antdTheme}>
        <SimplePageContainer>
          <SimpleHeader>
            <div>
              <SimpleTitle>
                {validationId ? 'Editar Validação' : 'Nova Validação'}
              </SimpleTitle>
            </div>
            <SimpleBackButton onClick={handleBack}>
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
          </SimpleHeader>

          <SimpleFormGrid>
            {!validationId && (
              <>
                {validations.length >= MAX_VALIDATIONS_PER_COLUMN ? (
                  <InfoBox
                    style={{
                      background:
                        'var(--color-warning-bg, rgba(245, 158, 11, 0.1))',
                      borderColor: 'var(--color-warning, #f59e0b)',
                    }}
                  >
                    <strong>⚠️ Limite atingido:</strong> Esta coluna já possui{' '}
                    {MAX_VALIDATIONS_PER_COLUMN} validações. Exclua uma para
                    criar outra.
                  </InfoBox>
                ) : (
                  <InfoBox>
                    <strong>💡 Dica:</strong> Configure validações para garantir
                    que tarefas atendam critérios específicos antes de serem
                    movidas para esta coluna.
                  </InfoBox>
                )}
              </>
            )}

            {/* ✅ Visualização da relação de colunas - SEMPRE mostrar: "Coluna Atual → Coluna Próxima" */}
            {!validationId &&
              columns.length > 0 &&
              !columnsLoading &&
              (() => {
                const currentCol = columns.find(c => c.id === columnId);
                if (!currentCol) return null;

                const currentPosition =
                  (currentCol as any).position ?? currentCol.position ?? 0;

                // ✅ Buscar a coluna PRÓXIMA (posição +1) para mostrar na visualização
                // A visualização deve mostrar: "Coluna Atual → Coluna Próxima"
                // Exemplo: Se estamos criando validação na coluna "A Fazer" (posição 0),
                // a visualização deve mostrar: "A Fazer → Em Progresso" (posição 1)
                const nextColumn = columns
                  .filter(col => col.id !== columnId)
                  .find(col => {
                    const colPosition =
                      (col as any).position ?? col.position ?? -1;
                    return colPosition === currentPosition + 1;
                  });

                // Se houver coluna próxima, mostrar: "Coluna Atual → Coluna Próxima"
                if (nextColumn) {
                  return (
                    <InfoBox>
                      <strong>ℹ️ Validação Condicional:</strong>
                      <ColumnRelationBox>
                        <ColumnBox>
                          {(currentCol as any)?.title ??
                            currentCol?.title ??
                            'Coluna Atual'}
                        </ColumnBox>
                        <Arrow>⇒</Arrow>
                        <ColumnBox>
                          {(nextColumn as any)?.title ??
                            nextColumn?.title ??
                            'Coluna Próxima'}
                        </ColumnBox>
                      </ColumnRelationBox>
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Esta validação será aplicada quando um card for movido
                        da coluna de origem para a coluna de destino.
                        <br />
                        <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          Esta configuração é automática e não pode ser editada.
                        </strong>
                      </div>
                    </InfoBox>
                  );
                }

                // Se não houver coluna próxima (última coluna), mostrar apenas a coluna atual
                return (
                  <InfoBox>
                    <strong>ℹ️ Validação Geral:</strong>
                    <ColumnRelationBox>
                      <ColumnBox>
                        {(currentCol as any)?.title ??
                          currentCol?.title ??
                          'Coluna Atual'}
                      </ColumnBox>
                      <Arrow>⇒</Arrow>
                      <ColumnBox style={{ opacity: 0.5 }}>
                        Última Coluna
                      </ColumnBox>
                    </ColumnRelationBox>
                    <div
                      style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Esta validação será aplicada quando um card entrar nesta
                      coluna.
                      <br />
                      <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        Esta é a última coluna, então não há coluna seguinte.
                      </strong>
                    </div>
                  </InfoBox>
                );
              })()}

            <FieldContainer>
              <FieldLabel>
                Tipo de Validação
                <HelpText>O que esta validação vai verificar?</HelpText>
              </FieldLabel>
              <Select
                value={formData.type}
                onChange={value => {
                  if (value === 'custom_condition') {
                    setFormData({
                      ...formData,
                      type: value,
                      config: {
                        condition: {
                          field: 'priority',
                          operator: 'not_empty',
                          value: null,
                          valueType: 'string',
                        },
                      },
                    });
                  } else {
                    setFormData({ ...formData, type: value, config: {} });
                  }
                }}
                options={[
                  { label: 'Campo Obrigatório', value: 'required_field' },
                  {
                    label: 'Checklist Obrigatório',
                    value: 'required_checklist',
                  },
                  {
                    label: 'Documento Obrigatório',
                    value: 'required_document',
                  },
                  {
                    label: 'Relacionamento Obrigatório',
                    value: 'required_relationship',
                  },
                  { label: 'Condição Customizada', value: 'custom_condition' },
                ]}
                style={{ width: '100%' }}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>
                O que acontece se a validação falhar?
                <HelpText>
                  Escolha como o sistema deve reagir quando esta validação não
                  for atendida
                </HelpText>
              </FieldLabel>
              <Select
                value={formData.behavior}
                onChange={value =>
                  setFormData({ ...formData, behavior: value })
                }
                options={[
                  { label: '🚫 Bloquear Movimento', value: 'block' },
                  { label: '⚠️ Avisar (Permitir)', value: 'warn' },
                  {
                    label: '📝 Marcar como Incompleto',
                    value: 'mark_incomplete',
                  },
                ]}
                style={{ width: '100%' }}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>
                Mensagem de Erro
                <HelpText>
                  Esta mensagem será exibida ao usuário quando a validação
                  falhar
                </HelpText>
              </FieldLabel>
              <Input.TextArea
                value={formData.message}
                onChange={e =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Ex: 'A tarefa deve ter um responsável atribuído antes de ser movida para esta coluna'"
                rows={3}
              />
            </FieldContainer>

            {formData.type === 'required_field' && (
              <FieldContainer>
                <FieldLabel>
                  Qual campo é obrigatório?
                  <HelpText>
                    Selecione o campo da tarefa que deve estar preenchido
                  </HelpText>
                </FieldLabel>
                <Select
                  value={formData.config?.fieldName || undefined}
                  onChange={value =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, fieldName: value },
                    })
                  }
                  placeholder='Selecione um campo'
                  options={[
                    { label: 'Responsável', value: 'assignedToId' },
                    { label: 'Data de Vencimento', value: 'dueDate' },
                    { label: 'Prioridade', value: 'priority' },
                    { label: 'Descrição', value: 'description' },
                    { label: 'Projeto', value: 'projectId' },
                  ]}
                  style={{ width: '100%' }}
                />
              </FieldContainer>
            )}

            {formData.type === 'required_document' && (
              <>
                <FieldContainer>
                  <FieldLabel>
                    Tipo de Documento
                    <HelpText>
                      Qual tipo de documento deve estar anexado?
                    </HelpText>
                  </FieldLabel>
                  <Select
                    value={formData.config?.documentType || undefined}
                    onChange={value =>
                      setFormData({
                        ...formData,
                        config: { ...formData.config, documentType: value },
                      })
                    }
                    placeholder='Selecione o tipo de documento'
                    options={[
                      { label: 'Proposta', value: 'proposta' },
                      { label: 'Contrato', value: 'contrato' },
                      { label: 'CPF/CNPJ', value: 'cpf_cnpj' },
                      { label: 'Comprovante', value: 'comprovante' },
                      { label: 'Outro', value: 'outro' },
                    ]}
                    style={{ width: '100%' }}
                  />
                </FieldContainer>
                <FieldContainer>
                  <FieldLabel>
                    Status Exigido
                    <HelpText>Qual status o documento deve ter?</HelpText>
                  </FieldLabel>
                  <Select
                    value={formData.config?.documentStatus || 'any'}
                    onChange={value =>
                      setFormData({
                        ...formData,
                        config: { ...formData.config, documentStatus: value },
                      })
                    }
                    options={[
                      {
                        label: 'Qualquer status (apenas anexado)',
                        value: 'any',
                      },
                      { label: 'Assinado', value: 'signed' },
                      { label: 'Aprovado', value: 'approved' },
                    ]}
                    style={{ width: '100%' }}
                  />
                </FieldContainer>
              </>
            )}

            {formData.type === 'required_relationship' && (
              <FieldContainer>
                <FieldLabel>
                  Tipo de Relacionamento
                  <HelpText>
                    A tarefa deve estar vinculada a qual tipo de entidade?
                  </HelpText>
                </FieldLabel>
                <Select
                  value={formData.config?.relationshipType || 'client'}
                  onChange={value =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, relationshipType: value },
                    })
                  }
                  options={[
                    { label: '👤 Cliente', value: 'client' },
                    { label: '🏠 Propriedade', value: 'property' },
                    { label: '📁 Projeto', value: 'project' },
                    { label: '🔑 Aluguel', value: 'rental' },
                  ]}
                  style={{ width: '100%' }}
                />
              </FieldContainer>
            )}

            {formData.type === 'custom_condition' &&
              (() => {
                const field = formData.config?.condition?.field || 'priority';
                const operator =
                  formData.config?.condition?.operator || 'not_empty';
                const valueType =
                  formData.config?.condition?.valueType ||
                  getValueTypeForField(field);
                const needsValue = !OPERATORS_WITHOUT_VALUE.includes(
                  operator as any
                );
                const operatorOptions = getOperatorOptionsForField(field);
                const priorityOptions = getValueOptionsForField(field);
                const isArrayOp = OPERATORS_REQUIRING_ARRAY.includes(
                  operator as any
                );
                const displayValue = formData.config?.condition?.value;
                const valueStr = Array.isArray(displayValue)
                  ? (displayValue as string[]).join(', ')
                  : displayValue != null && displayValue !== ''
                    ? typeof displayValue === 'string' &&
                      displayValue.length === 10 &&
                      /^\d{4}-\d{2}-\d{2}$/.test(displayValue)
                      ? displayValue
                      : String(displayValue)
                    : '';
                return (
                  <>
                    <FieldContainer>
                      <FieldLabel>
                        Campo da tarefa
                        <HelpText>
                          O tipo de comparação e o valor serão ajustados
                          conforme o campo
                        </HelpText>
                      </FieldLabel>
                      <Select
                        value={field}
                        onChange={newField => {
                          const newValueType = getValueTypeForField(newField);
                          const allowedOps =
                            getOperatorOptionsForField(newField);
                          const firstOp = allowedOps[0]?.value || 'not_empty';
                          setFormData({
                            ...formData,
                            config: {
                              ...formData.config,
                              condition: {
                                field: newField,
                                operator: firstOp,
                                value: OPERATORS_WITHOUT_VALUE.includes(
                                  firstOp as any
                                )
                                  ? null
                                  : (formData.config?.condition?.value ?? ''),
                                valueType: newValueType,
                              },
                            },
                          });
                        }}
                        options={CONDITION_FIELD_OPTIONS}
                        style={{ width: '100%' }}
                      />
                    </FieldContainer>
                    <FieldContainer>
                      <FieldLabel>
                        Operador
                        <HelpText>
                          Operadores permitidos para este campo (ex.: data usa
                          maior/menor, texto usa contém)
                        </HelpText>
                      </FieldLabel>
                      <Select
                        value={
                          operatorOptions.some(o => o.value === operator)
                            ? operator
                            : operatorOptions[0]?.value
                        }
                        onChange={newOp =>
                          setFormData({
                            ...formData,
                            config: {
                              ...formData.config,
                              condition: {
                                ...formData.config?.condition,
                                field,
                                operator: newOp,
                                value: OPERATORS_WITHOUT_VALUE.includes(
                                  newOp as any
                                )
                                  ? null
                                  : formData.config?.condition?.value,
                                valueType,
                              },
                            },
                          })
                        }
                        options={operatorOptions}
                        style={{ width: '100%' }}
                      />
                    </FieldContainer>
                    {needsValue && (
                      <FieldContainer>
                        <FieldLabel>
                          {isArrayOp
                            ? 'Valores (separados por vírgula)'
                            : isDateField(field)
                              ? 'Data'
                              : isPriorityField(field) && !isArrayOp
                                ? 'Prioridade'
                                : 'Valor'}
                          <HelpText>
                            {isDateField(field) && 'Formato: AAAA-MM-DD'}
                            {isPriorityField(field) &&
                              !isArrayOp &&
                              'Selecione uma prioridade'}
                            {isPriorityField(field) &&
                              isArrayOp &&
                              'Ex.: low, medium, high, urgent'}
                            {!isDateField(field) &&
                              !isPriorityField(field) &&
                              (isArrayOp
                                ? 'Ex.: valor1, valor2'
                                : 'Valor a comparar')}
                          </HelpText>
                        </FieldLabel>
                        {isDateField(field) ? (
                          <Input
                            type='date'
                            value={valueStr}
                            onChange={e =>
                              setFormData({
                                ...formData,
                                config: {
                                  ...formData.config,
                                  condition: {
                                    ...formData.config?.condition,
                                    field,
                                    operator,
                                    value: e.target.value || null,
                                    valueType: 'date',
                                  },
                                },
                              })
                            }
                          />
                        ) : isPriorityField(field) &&
                          !isArrayOp &&
                          priorityOptions ? (
                          <Select
                            value={
                              formData.config?.condition?.value ?? undefined
                            }
                            onChange={val =>
                              setFormData({
                                ...formData,
                                config: {
                                  ...formData.config,
                                  condition: {
                                    ...formData.config?.condition,
                                    field,
                                    operator,
                                    value: val,
                                    valueType: 'string',
                                  },
                                },
                              })
                            }
                            options={priorityOptions}
                            placeholder='Selecione a prioridade'
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <Input
                            type={valueType === 'number' ? 'number' : 'text'}
                            value={valueStr}
                            onChange={e => {
                              const raw = e.target.value;
                              const value = isArrayOp
                                ? raw
                                    .split(',')
                                    .map(s => s.trim())
                                    .filter(Boolean)
                                : valueType === 'number'
                                  ? raw === ''
                                    ? null
                                    : Number(raw)
                                  : raw;
                              setFormData({
                                ...formData,
                                config: {
                                  ...formData.config,
                                  condition: {
                                    ...formData.config?.condition,
                                    field,
                                    operator,
                                    value,
                                    valueType,
                                  },
                                },
                              });
                            }}
                            placeholder={
                              isArrayOp
                                ? 'valor1, valor2, valor3'
                                : isDateField(field)
                                  ? 'YYYY-MM-DD'
                                  : 'Valor'
                            }
                          />
                        )}
                      </FieldContainer>
                    )}
                  </>
                );
              })()}
          </SimpleFormGrid>

          <ButtonsRow>
            <StyledButton onClick={handleBack} disabled={isSaving}>
              Cancelar
            </StyledButton>
            <StyledButton
              $primary
              onClick={handleSubmit}
              disabled={
                !formData.message.trim() ||
                isSaving ||
                (!validationId &&
                  validations.length >= MAX_VALIDATIONS_PER_COLUMN)
              }
              $loading={isSaving}
            >
              <MdCheck size={20} />
              {validationId ? 'Salvar' : 'Criar'}
            </StyledButton>
          </ButtonsRow>
        </SimplePageContainer>
      </ConfigProvider>
    </Layout>
  );
};

export default CreateValidationPage;
