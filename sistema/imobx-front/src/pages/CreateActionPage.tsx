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
import { FieldMappingEditor } from '../components/kanban/FieldMappingEditor';
import type {
  ColumnAction,
  CreateActionDto,
  ActionTrigger,
  ActionType,
} from '../types/kanbanValidations';
import {
  ACTION_TYPE_OPTIONS_IMPLEMENTED,
  getTriggerOptionsForActionType,
  getDefaultTriggerForActionType,
} from '../types/kanbanValidations';

// Reutilizar estilos do CreateValidationPage
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
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HelpText = styled.small`
  display: block;
  font-weight: normal;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
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

    button {
      width: 100%;
    }
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

const CreateActionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme: currentTheme } = useTheme();
  const { board } = useKanban();

  const columnId = searchParams.get('columnId') || '';
  const actionId = searchParams.get('actionId');
  const projectId = searchParams.get('projectId');
  const teamId = searchParams.get('teamId');
  const workspace = searchParams.get('workspace');

  const { createAction, updateAction, loading, actions } =
    useKanbanValidations(columnId);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CreateActionDto>({
    trigger: 'on_enter',
    type: 'create_property',
    config: {},
    order: 0,
    fromColumnId: undefined,
    requireAdjacentPosition: false,
  });

  const currentColumn = board.columns.find(col => col.id === columnId);
  const columns = board.columns.sort((a, b) => a.position - b.position);

  useEffect(() => {
    if (actionId && actions.length > 0) {
      const action = actions.find(a => a.id === actionId);
      if (action) {
        setFormData({
          trigger: action.trigger,
          type: action.type,
          config: action.config,
          conditions: action.conditions,
          order: action.order,
          intervalHours: action.intervalHours,
          maxExecutions: action.maxExecutions,
          fromColumnId: action.fromColumnId,
          requireAdjacentPosition: action.requireAdjacentPosition || false,
        });
      }
    } else {
      // ✅ Ao criar nova ação, automaticamente definir como condicional
      const previousColumn = currentColumn
        ? columns
            .filter(col => col.id !== columnId)
            .find(col => col.position === currentColumn.position - 1)
        : undefined;

      setFormData({
        trigger: 'on_enter',
        type: 'create_property',
        config: {},
        order: 0,
        fromColumnId: previousColumn?.id,
        requireAdjacentPosition: previousColumn ? true : false,
      });
    }
  }, [actionId, actions, columnId, currentColumn, columns]);

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
    // Verificar se já existe uma ação duplicada na mesma coluna
    if (!actionId) {
      const duplicateAction = actions.find(a => {
        if (a.type !== formData.type || a.trigger !== formData.trigger)
          return false;

        if (
          formData.type === 'create_property' ||
          formData.type === 'create_client' ||
          formData.type === 'create_document'
        ) {
          const aMapping = JSON.stringify(a.config?.fieldMapping || {});
          const fMapping = JSON.stringify(formData.config?.fieldMapping || {});
          return aMapping === fMapping;
        }

        if (formData.type === 'send_email') {
          return (
            a.config?.subject === formData.config?.subject &&
            a.config?.message === formData.config?.message
          );
        }

        const aConfig = JSON.stringify(a.config || {});
        const fConfig = JSON.stringify(formData.config || {});
        return aConfig === fConfig;
      });

      if (duplicateAction) {
        toast.error('Já existe uma ação idêntica nesta coluna.');
        return;
      }
    }

    setIsSaving(true);
    try {
      if (actionId) {
        await updateAction(actionId, formData);
      } else {
        await createAction(formData);
      }
      handleBack();
    } catch (error) {
      // Erro já é tratado pelo hook
    } finally {
      setIsSaving(false);
    }
  };

  const previousColumn = formData.fromColumnId
    ? columns.find(c => c.id === formData.fromColumnId)
    : null;

  return (
    <Layout>
      <ConfigProvider theme={antdTheme}>
        <SimplePageContainer>
          <SimpleHeader>
            <div>
              <SimpleTitle>
                {actionId ? 'Editar Ação' : 'Nova Ação'}
              </SimpleTitle>
            </div>
            <SimpleBackButton onClick={handleBack}>
              <MdArrowBack size={20} />
              Voltar
            </SimpleBackButton>
          </SimpleHeader>

          <SimpleFormGrid>
            {!actionId && (
              <InfoBox>
                <strong>💡 Dica:</strong> Configure ações automáticas que serão
                executadas quando tarefas entrarem, saírem ou permanecerem nesta
                coluna.
              </InfoBox>
            )}

            {/* ✅ Visualização da relação de colunas - SEMPRE mostrar: "Coluna Atual → Coluna Próxima" */}
            {!actionId &&
              columns.length > 0 &&
              (() => {
                const currentCol = columns.find(c => c.id === columnId);
                if (!currentCol) return null;

                const currentPosition =
                  (currentCol as any).position ?? currentCol.position ?? 0;

                // ✅ Buscar a coluna PRÓXIMA (posição +1) para mostrar na visualização
                // A visualização deve mostrar: "Coluna Atual → Coluna Próxima"
                // Exemplo: Se estamos criando ação na coluna "A Fazer" (posição 0),
                // a visualização deve mostrar: "A Fazer → Em Progresso" (posição 1)
                const nextColumn = columns
                  .filter(col => col.id !== columnId)
                  .find(col => {
                    const colPosition =
                      (col as any).position ?? col.position ?? -1;
                    return colPosition === currentPosition + 1;
                  });

                // Mostrar apenas para triggers on_enter e on_exit
                if (
                  (formData.trigger === 'on_enter' ||
                    formData.trigger === 'on_exit') &&
                  nextColumn
                ) {
                  return (
                    <InfoBox>
                      <strong>ℹ️ Ação Condicional:</strong>
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
                        Esta ação será executada quando um card for movido da
                        coluna de origem para a coluna de destino
                        {formData.trigger === 'on_enter'
                          ? ' (ao entrar na coluna de destino)'
                          : ' (ao sair da coluna de origem)'}
                        .
                        <br />
                        <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          Esta configuração é automática e não pode ser editada.
                        </strong>
                      </div>
                    </InfoBox>
                  );
                }

                return null;
              })()}

            <FieldContainer>
              <FieldLabel>
                Quando Executar
                <HelpText>
                  Em qual momento esta ação deve ser executada?
                </HelpText>
              </FieldLabel>
              <Select
                value={formData.trigger}
                onChange={value => setFormData({ ...formData, trigger: value })}
                options={getTriggerOptionsForActionType(formData.type)}
                style={{ width: '100%' }}
              />
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>
                O que esta ação deve fazer?
                <HelpText>
                  Selecione a operação que será executada automaticamente
                </HelpText>
              </FieldLabel>
              <Select
                value={formData.type}
                onChange={value => {
                  const allowedTriggers = getTriggerOptionsForActionType(
                    value
                  ).map(o => o.value);
                  const trigger = allowedTriggers.includes(formData.trigger)
                    ? formData.trigger
                    : getDefaultTriggerForActionType(value);
                  setFormData({
                    ...formData,
                    type: value,
                    config: {},
                    trigger,
                  });
                }}
                options={ACTION_TYPE_OPTIONS_IMPLEMENTED}
                style={{ width: '100%' }}
              />
            </FieldContainer>

            {(formData.type === 'create_property' ||
              formData.type === 'create_client' ||
              formData.type === 'create_document') && (
              <FieldContainer>
                <FieldLabel>
                  Mapeamento de Campos
                  <HelpText>
                    Configure quais campos da tarefa serão mapeados para a nova
                    entidade
                  </HelpText>
                </FieldLabel>
                <FieldMappingEditor
                  value={formData.config?.fieldMapping}
                  onChange={fieldMapping =>
                    setFormData({
                      ...formData,
                      config: { ...formData.config, fieldMapping },
                    })
                  }
                  targetEntityType={
                    formData.type === 'create_property'
                      ? 'property'
                      : formData.type === 'create_client'
                        ? 'client'
                        : 'document'
                  }
                />
              </FieldContainer>
            )}

            {formData.type === 'send_email' && (
              <>
                <FieldContainer>
                  <FieldLabel>
                    Assunto do Email
                    <HelpText>
                      Use variáveis como {'{{taskTitle}}'} para personalizar
                    </HelpText>
                  </FieldLabel>
                  <Input
                    value={formData.config?.subject || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        config: { ...formData.config, subject: e.target.value },
                      })
                    }
                    placeholder='Ex: Proposta enviada - {{taskTitle}}'
                  />
                </FieldContainer>
                <FieldContainer>
                  <FieldLabel>
                    Mensagem do Email
                    <HelpText>
                      Variáveis disponíveis: {'{{taskTitle}}'},{' '}
                      {'{{taskDescription}}'}, {'{{clientName}}'},{' '}
                      {'{{propertyAddress}}'}
                    </HelpText>
                  </FieldLabel>
                  <Input.TextArea
                    value={formData.config?.message || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        config: { ...formData.config, message: e.target.value },
                      })
                    }
                    placeholder='Ex: Olá {{clientName}}, sua proposta {{taskTitle}} foi enviada com sucesso!'
                    rows={4}
                  />
                </FieldContainer>
              </>
            )}

            {formData.trigger === 'on_stay' && (
              <>
                <FieldContainer>
                  <FieldLabel>
                    Intervalo de Execução
                    <HelpText>
                      Com que frequência esta ação deve ser executada? (em
                      horas)
                    </HelpText>
                  </FieldLabel>
                  <Input
                    type='number'
                    value={formData.intervalHours || 24}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        intervalHours: parseInt(e.target.value) || 24,
                      })
                    }
                    min={1}
                    placeholder='Ex: 24 (a cada 24 horas)'
                  />
                </FieldContainer>
                <FieldContainer>
                  <FieldLabel>
                    Máximo de Execuções
                    <HelpText>
                      Quantas vezes esta ação pode ser executada? (0 =
                      ilimitado)
                    </HelpText>
                  </FieldLabel>
                  <Input
                    type='number'
                    value={formData.maxExecutions || 10}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        maxExecutions: parseInt(e.target.value) || 10,
                      })
                    }
                    min={0}
                    placeholder='Ex: 10'
                  />
                </FieldContainer>
              </>
            )}
          </SimpleFormGrid>

          <ButtonsRow>
            <StyledButton onClick={handleBack} disabled={isSaving}>
              Cancelar
            </StyledButton>
            <StyledButton
              $primary
              onClick={handleSubmit}
              disabled={isSaving}
              $loading={isSaving}
            >
              <MdCheck size={20} />
              {actionId ? 'Salvar' : 'Criar'}
            </StyledButton>
          </ButtonsRow>
        </SimplePageContainer>
      </ConfigProvider>
    </Layout>
  );
};

export default CreateActionPage;
