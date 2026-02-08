import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button, Select, Input, Switch, ConfigProvider, theme } from 'antd';
import { useTheme } from '../../contexts/ThemeContext';
import { useKanbanValidations } from '../../hooks/useKanbanValidations';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import { ValidationModalShimmer } from './ValidationModalShimmer';
import {
  type ColumnValidation,
  type CreateValidationDto,
  type UpdateValidationDto,
  type ValidationType,
  type ValidationBehavior,
  MAX_VALIDATIONS_PER_COLUMN,
} from '../../types/kanbanValidations';

interface ColumnValidationsConfigProps {
  columnId: string;
  onClose?: () => void;
  onCreateEdit?: (validation?: ColumnValidation) => void;
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

const ValidationsList = styled.div`
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

const ValidationItem = styled.div<{ $isActive: boolean }>`
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

  ${ValidationItem}:hover & {
    opacity: 1;
  }

  &:active {
    cursor: grabbing;
  }
`;

const ValidationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 32px;
`;

const ValidationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const ValidationType = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.colors.text};
`;

const ValidationMessage = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  word-break: break-word;
`;

const ValidationBadge = styled.span<{ $behavior: ValidationBehavior }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.$behavior) {
      case 'block':
        return props.theme.colors.errorBackground;
      case 'warn':
        return props.theme.colors.warningBackground;
      case 'mark_incomplete':
        return props.theme.colors.infoBackground;
      default:
        return props.theme.colors.backgroundSecondary;
    }
  }};
  color: ${props => {
    switch (props.$behavior) {
      case 'block':
        return props.theme.colors.errorText;
      case 'warn':
        return props.theme.colors.warningText;
      case 'mark_incomplete':
        return props.theme.colors.infoText;
      default:
        return props.theme.colors.text;
    }
  }};
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

const getValidationTypeLabel = (type: ValidationType): string => {
  const labels: Record<ValidationType, string> = {
    required_field: 'Campo Obrigatório',
    required_checklist: 'Checklist Obrigatório',
    required_document: 'Documento Obrigatório',
    required_relationship: 'Relacionamento Obrigatório',
    custom_condition: 'Condição Customizada',
  };
  return labels[type] || type;
};

const getBehaviorLabel = (behavior: ValidationBehavior): string => {
  const labels: Record<ValidationBehavior, string> = {
    block: 'Bloquear',
    warn: 'Avisar',
    mark_incomplete: 'Marcar Incompleto',
  };
  return labels[behavior] || behavior;
};

export const ColumnValidationsConfig: React.FC<
  ColumnValidationsConfigProps
> = ({ columnId, onClose, onCreateEdit }) => {
  const { theme: currentTheme } = useTheme();
  const {
    validations,
    loading,
    createValidation,
    updateValidation,
    deleteValidation,
    reorderValidations,
  } = useKanbanValidations(columnId);

  // Configurar tema do Ant Design baseado no tema atual
  const antdTheme = {
    token: {
      colorBgContainer: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBgElevated: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
      colorBorder: currentTheme === 'dark' ? '#374151' : '#e1e5e9',
      colorText: currentTheme === 'dark' ? '#f9fafb' : '#4B5563',
      colorTextSecondary: currentTheme === 'dark' ? '#ffffff' : '#6B7280',
      colorPrimary: currentTheme === 'dark' ? '#60a5fa' : '#1c4eff',
    },
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : undefined,
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [validationToDelete, setValidationToDelete] =
    useState<ColumnValidation | null>(null);

  const handleEdit = (validation: ColumnValidation) => {
    if (onCreateEdit) {
      onCreateEdit(validation);
    }
  };

  const handleCreate = () => {
    if (onCreateEdit) {
      onCreateEdit();
    }
  };

  const handleDeleteClick = (validation: ColumnValidation) => {
    setValidationToDelete(validation);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!validationToDelete) return;
    try {
      await deleteValidation(validationToDelete.id);
      setDeleteModalOpen(false);
      setValidationToDelete(null);
    } catch (error) {
      // Erro já é tratado pelo hook
    }
  };

  const handleToggleActive = async (validation: ColumnValidation) => {
    try {
      await updateValidation(validation.id, {
        isActive: !validation.isActive,
      });
    } catch (error) {
      // Erro já é tratado pelo hook
    }
  };

  const sortedValidations = [...validations].sort((a, b) => a.order - b.order);

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
            <CheckCircle size={20} />
            Validações da Coluna
          </Title>
          <AddButton
            type='primary'
            icon={<Plus size={16} />}
            onClick={handleCreate}
            disabled={validations.length >= MAX_VALIDATIONS_PER_COLUMN}
            title={
              validations.length >= MAX_VALIDATIONS_PER_COLUMN
                ? `Máximo de ${MAX_VALIDATIONS_PER_COLUMN} validações por coluna`
                : undefined
            }
          >
            Adicionar Validação
            {validations.length >= MAX_VALIDATIONS_PER_COLUMN && (
              <span style={{ marginLeft: 6, fontWeight: 500, opacity: 0.9 }}>
                (máx. {MAX_VALIDATIONS_PER_COLUMN})
              </span>
            )}
          </AddButton>
        </Header>

        {sortedValidations.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <AlertCircle size={48} />
            </EmptyIcon>
            <EmptyTitle>Nenhuma validação configurada</EmptyTitle>
            <EmptyDescription>
              Adicione validações para exigir critérios específicos antes de
              mover tarefas para esta coluna
            </EmptyDescription>
          </EmptyState>
        ) : (
          <ValidationsList>
            {sortedValidations.map(validation => (
              <ValidationItem
                key={validation.id}
                $isActive={validation.isActive}
              >
                <DragHandle>
                  <GripVertical size={18} />
                </DragHandle>
                <ValidationContent>
                  <ValidationHeader>
                    <ValidationType>
                      {getValidationTypeLabel(validation.type)}
                    </ValidationType>
                    <ValidationBadge $behavior={validation.behavior}>
                      {getBehaviorLabel(validation.behavior)}
                    </ValidationBadge>
                    {!validation.isActive && (
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
                  </ValidationHeader>
                  {validation.message && (
                    <ValidationMessage>{validation.message}</ValidationMessage>
                  )}
                </ValidationContent>
                <ItemFooter>
                  <Switch
                    checked={validation.isActive}
                    onChange={() => handleToggleActive(validation)}
                    size='small'
                  />
                  <Actions>
                    <ActionButton
                      onClick={() => handleEdit(validation)}
                      title='Editar'
                    >
                      <Edit2 size={14} />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDeleteClick(validation)}
                      title='Excluir'
                    >
                      <Trash2 size={14} />
                    </ActionButton>
                  </Actions>
                </ItemFooter>
              </ValidationItem>
            ))}
          </ValidationsList>
        )}

        {/* Modal de Confirmação de Exclusão */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setValidationToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title='Excluir Validação'
          message='Tem certeza que deseja excluir esta validação?'
          itemName={validationToDelete?.message}
          variant='delete'
        />
      </Container>
    </ConfigProvider>
  );
};
