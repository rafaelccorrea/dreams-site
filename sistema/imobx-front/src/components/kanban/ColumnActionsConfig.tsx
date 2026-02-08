import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Zap,
  PlayCircle,
} from 'lucide-react';
import { Button, Switch, ConfigProvider, theme } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { useKanbanValidations } from '../../hooks/useKanbanValidations';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { ValidationModalShimmer } from './ValidationModalShimmer';
import type {
  ColumnAction,
  ActionTrigger,
  ActionType,
} from '../../types/kanbanValidations';

interface ColumnActionsConfigProps {
  columnId: string;
  onCreateEdit?: (action?: ColumnAction) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  min-height: 100%;

  @media (max-width: 768px) {
    padding: 20px 16px;
    gap: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  font-weight: 600;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const ActionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ActionItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  opacity: ${props => (props.$isActive ? 1 : 0.6)};
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: grab;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: opacity 0.2s;

  ${ActionItem}:hover & {
    opacity: 1;
  }

  &:active {
    cursor: grabbing;
  }
`;

const ActionContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 32px;
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const ActionTypeLabel = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.colors.text};
`;

const TriggerBadge = styled.span<{ $trigger: ActionTrigger }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$trigger) {
      case 'on_enter':
        return props.theme.colors.successBackground;
      case 'on_exit':
        return props.theme.colors.errorBackground;
      case 'on_stay':
        return props.theme.colors.infoBackground;
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$trigger) {
      case 'on_enter':
        return props.theme.colors.successText;
      case 'on_exit':
        return props.theme.colors.errorText;
      case 'on_stay':
        return props.theme.colors.infoText;
      default:
        return props.theme.colors.text;
    }
  }};
`;

const ActionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ItemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    padding: 48px 16px;
  }
`;

const EmptyIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const EmptyDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const getActionTypeLabel = (type: ActionType): string => {
  const labels: Record<ActionType, string> = {
    create_property: 'Criar Propriedade',
    create_client: 'Criar Cliente',
    create_document: 'Criar Documento',
    create_vistoria: 'Criar Vistoria',
    create_rental: 'Criar Aluguel',
    create_note: 'Criar Nota',
    create_appointment: 'Criar Agendamento',
    create_transaction: 'Criar Transação',
    update_property: 'Atualizar Propriedade',
    update_client: 'Atualizar Cliente',
    update_document: 'Atualizar Documento',
    send_email: 'Enviar Email',
    send_sms: 'Enviar SMS',
    send_notification: 'Enviar Notificação',
    send_chat_message: 'Enviar Mensagem no Chat',
    assign_user: 'Atribuir Usuário',
    add_tag: 'Adicionar Tag',
    set_priority: 'Definir Prioridade',
    set_due_date: 'Definir Data de Vencimento',
    add_comment: 'Adicionar Comentário',
    set_custom_field: 'Definir Campo Customizado',
    create_task: 'Criar Negociação',
    archive_documents: 'Arquivar Documentos',
    update_relationship: 'Atualizar Relacionamento',
    schedule_email: 'Agendar Email',
    schedule_task: 'Agendar Negociação',
    start_email_sequence: 'Iniciar Sequência de Email',
    update_score: 'Atualizar Pontuação',
  };
  return labels[type] || type;
};

const getTriggerLabel = (trigger: ActionTrigger): string => {
  const labels: Record<ActionTrigger, string> = {
    on_enter: 'Ao Entrar',
    on_exit: 'Ao Sair',
    on_stay: 'Enquanto Está',
  };
  return labels[trigger] || trigger;
};

export const ColumnActionsConfig: React.FC<ColumnActionsConfigProps> = ({
  columnId,
  onCreateEdit,
}) => {
  const { theme: currentTheme } = useTheme();
  const { actions, loading, updateAction, deleteAction } =
    useKanbanValidations(columnId);

  // Configurar tema do Ant Design baseado no tema atual
  const antdTheme = {
    token: {
      colorBgContainer: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#374151' : '#e1e5e9',
      colorText: currentTheme === 'dark' ? '#f9fafb' : '#4B5563',
      colorTextSecondary: currentTheme === 'dark' ? '#ffffff' : '#6B7280',
      colorPrimary: currentTheme === 'dark' ? '#C44336' : '#A63126',
    },
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : undefined,
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<ColumnAction | null>(
    null
  );

  const handleEdit = (action: ColumnAction) => {
    if (onCreateEdit) {
      onCreateEdit(action);
    }
  };

  const handleCreate = () => {
    if (onCreateEdit) {
      onCreateEdit();
    }
  };

  const handleDeleteClick = (action: ColumnAction) => {
    setActionToDelete(action);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!actionToDelete) return;
    try {
      await deleteAction(actionToDelete.id);
      setDeleteModalOpen(false);
      setActionToDelete(null);
    } catch (error) {
      // Erro já é tratado pelo hook
    }
  };

  const handleToggleActive = async (action: ColumnAction) => {
    try {
      await updateAction(action.id, {
        isActive: !action.isActive,
      });
    } catch (error) {
      // Erro já é tratado pelo hook
    }
  };

  const sortedActions = [...actions].sort((a, b) => a.order - b.order);

  // Agrupar ações por trigger
  const actionsByTrigger = {
    on_enter: sortedActions.filter(a => a.trigger === 'on_enter'),
    on_exit: sortedActions.filter(a => a.trigger === 'on_exit'),
    on_stay: sortedActions.filter(a => a.trigger === 'on_stay'),
  };

  if (loading) {
    return (
      <Container>
        <ValidationModalShimmer />
      </Container>
    );
  }

  return (
    <ConfigProvider theme={antdTheme}>
      <Container>
        <Header>
          <Title>
            <Zap size={20} />
            Ações da Coluna
          </Title>
          <AddButton
            type='primary'
            icon={<Plus size={16} />}
            onClick={handleCreate}
          >
            Adicionar Ação
          </AddButton>
        </Header>

        {sortedActions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <PlayCircle size={48} />
            </EmptyIcon>
            <EmptyTitle>Nenhuma ação configurada</EmptyTitle>
            <EmptyDescription>
              Adicione ações para executar operações automáticas ao mover
              negociações
            </EmptyDescription>
          </EmptyState>
        ) : (
          <>
            {actionsByTrigger.on_enter.length > 0 && (
              <Section>
                <SectionTitle>✅ Ao Entrar na Coluna</SectionTitle>
                <ActionsList>
                  {actionsByTrigger.on_enter.map(action => (
                    <ActionItem key={action.id} $isActive={action.isActive}>
                      <DragHandle>
                        <GripVertical size={18} />
                      </DragHandle>
                      <ActionContent>
                        <ActionHeader>
                          <ActionTypeLabel>
                            {getActionTypeLabel(action.type)}
                          </ActionTypeLabel>
                          <TriggerBadge $trigger={action.trigger}>
                            {getTriggerLabel(action.trigger)}
                          </TriggerBadge>
                          {!action.isActive && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-light)',
                                opacity: 0.7,
                              }}
                            >
                              (Inativa)
                            </span>
                          )}
                        </ActionHeader>
                        {action.intervalHours && (
                          <ActionDetails>
                            Executa a cada {action.intervalHours}h
                          </ActionDetails>
                        )}
                      </ActionContent>
                      <ItemFooter>
                        <Switch
                          checked={action.isActive}
                          onChange={() => handleToggleActive(action)}
                          size='small'
                        />
                        <Actions>
                          <ActionButton
                            onClick={() => handleEdit(action)}
                            title='Editar'
                          >
                            <Edit2 size={14} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDeleteClick(action)}
                            title='Excluir'
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </Actions>
                      </ItemFooter>
                    </ActionItem>
                  ))}
                </ActionsList>
              </Section>
            )}

            {actionsByTrigger.on_exit.length > 0 && (
              <Section>
                <SectionTitle>⬅️ Ao Sair da Coluna</SectionTitle>
                <ActionsList>
                  {actionsByTrigger.on_exit.map(action => (
                    <ActionItem key={action.id} $isActive={action.isActive}>
                      <DragHandle>
                        <GripVertical size={18} />
                      </DragHandle>
                      <ActionContent>
                        <ActionHeader>
                          <ActionTypeLabel>
                            {getActionTypeLabel(action.type)}
                          </ActionTypeLabel>
                          <TriggerBadge $trigger={action.trigger}>
                            {getTriggerLabel(action.trigger)}
                          </TriggerBadge>
                          {!action.isActive && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-light)',
                                opacity: 0.7,
                              }}
                            >
                              (Inativa)
                            </span>
                          )}
                        </ActionHeader>
                      </ActionContent>
                      <ItemFooter>
                        <Switch
                          checked={action.isActive}
                          onChange={() => handleToggleActive(action)}
                          size='small'
                        />
                        <Actions>
                          <ActionButton
                            onClick={() => handleEdit(action)}
                            title='Editar'
                          >
                            <Edit2 size={14} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDeleteClick(action)}
                            title='Excluir'
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </Actions>
                      </ItemFooter>
                    </ActionItem>
                  ))}
                </ActionsList>
              </Section>
            )}

            {actionsByTrigger.on_stay.length > 0 && (
              <Section>
                <SectionTitle>
                  ⏰ Enquanto Está na Coluna (Periódico)
                </SectionTitle>
                <ActionsList>
                  {actionsByTrigger.on_stay.map(action => (
                    <ActionItem key={action.id} $isActive={action.isActive}>
                      <DragHandle>
                        <GripVertical size={18} />
                      </DragHandle>
                      <ActionContent>
                        <ActionHeader>
                          <ActionTypeLabel>
                            {getActionTypeLabel(action.type)}
                          </ActionTypeLabel>
                          <TriggerBadge $trigger={action.trigger}>
                            {getTriggerLabel(action.trigger)}
                          </TriggerBadge>
                          {!action.isActive && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-light)',
                                opacity: 0.7,
                              }}
                            >
                              (Inativa)
                            </span>
                          )}
                        </ActionHeader>
                        {action.intervalHours && (
                          <ActionDetails>
                            Executa a cada {action.intervalHours}h
                            {action.maxExecutions &&
                              action.maxExecutions > 0 && (
                                <> • Máximo: {action.maxExecutions} execuções</>
                              )}
                          </ActionDetails>
                        )}
                      </ActionContent>
                      <ItemFooter>
                        <Switch
                          checked={action.isActive}
                          onChange={() => handleToggleActive(action)}
                          size='small'
                        />
                        <Actions>
                          <ActionButton
                            onClick={() => handleEdit(action)}
                            title='Editar'
                          >
                            <Edit2 size={14} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDeleteClick(action)}
                            title='Excluir'
                          >
                            <Trash2 size={14} />
                          </ActionButton>
                        </Actions>
                      </ItemFooter>
                    </ActionItem>
                  ))}
                </ActionsList>
              </Section>
            )}
          </>
        )}

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setActionToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title='Excluir Ação'
          message='Tem certeza que deseja excluir esta ação?'
          itemName={
            actionToDelete ? getActionTypeLabel(actionToDelete.type) : undefined
          }
          variant='delete'
        />
      </Container>
    </ConfigProvider>
  );
};
