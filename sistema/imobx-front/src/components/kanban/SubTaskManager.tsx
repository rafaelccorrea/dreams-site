import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdAdd,
  MdDelete,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdSchedule,
  MdEdit,
  MdPerson,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type {
  KanbanSubTask,
  CreateSubTaskDto,
  UpdateSubTaskDto,
} from '../../types/kanban';
import { kanbanSubtasksApi } from '../../services/kanbanSubtasksApi';
import { showError, showSuccess } from '../../utils/notifications';
// SubTaskFormModal removido - usando navegação para páginas
import { Avatar } from '../common/Avatar';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

interface SubTaskManagerProps {
  taskId: string;
  projectId?: string;
  onUpdate?: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

const SubTaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubTaskItem = styled.div<{ $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  opacity: ${props => (props.$isCompleted ? 0.7 : 1)};

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const CheckboxButton = styled.button<{ $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid
    ${props =>
      props.$isCompleted
        ? props.theme.colors.success
        : props.theme.colors.border};
  border-radius: 6px;
  background: ${props =>
    props.$isCompleted ? props.theme.colors.success : 'transparent'};
  color: ${props =>
    props.$isCompleted ? '#fff' : props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }
`;

const SubTaskContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SubTaskTitle = styled.span<{ $isCompleted: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props =>
    props.$isCompleted
      ? props.theme.colors.textSecondary
      : props.theme.colors.text};
  text-decoration: ${props => (props.$isCompleted ? 'line-through' : 'none')};
`;

const SubTaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DueDateBadge = styled.div<{ $isOverdue: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props =>
    props.$isOverdue
      ? props.theme.colors.error
      : props.theme.colors.textSecondary};
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.error}20;
    color: ${props => props.theme.colors.error};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}40`};
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
  }
`;

const AssigneeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DescriptionText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  font-style: italic;
`;

export const SubTaskManager: React.FC<SubTaskManagerProps> = ({
  taskId,
  projectId,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subTasks, setSubTasks] = useState<KanbanSubTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subTaskToDelete, setSubTaskToDelete] = useState<KanbanSubTask | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  // Estados de modal removidos - usando navegação para páginas

  useEffect(() => {
    loadSubTasks();
  }, [taskId]);

  const loadSubTasks = async () => {
    try {
      setLoading(true);
      const data = await kanbanSubtasksApi.getSubTasks(taskId);
      setSubTasks(data);
    } catch (error: any) {
      console.error('Erro ao carregar sub-tarefas:', error);
      showError('Erro ao carregar sub-tarefas');
    } finally {
      setLoading(false);
    }
  };

  // handleOpenCreateModal removido - usando navegação para CreateSubTaskPage

  const handleOpenEditModal = (subTask: KanbanSubTask) => {
    // Navegar para página de edição de subtarefa
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    params.append('taskId', taskId);
    navigate(`/kanban/subtasks/${subTask.id}/edit?${params.toString()}`);
  };

  const handleViewSubTask = (subTask: KanbanSubTask) => {
    // Navegar para página de detalhes de subtarefa
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    params.append('taskId', taskId);
    navigate(`/kanban/subtasks/${subTask.id}?${params.toString()}`);
  };

  // handleSubmitSubTask removido - usando páginas para criar/editar

  const handleToggleSubTask = async (subTaskId: string) => {
    // Salvar estado anterior para rollback
    const previousSubTasks = [...subTasks];

    // Optimistic update - atualizar imediatamente
    const updatedSubTasks = subTasks.map(st =>
      st.id === subTaskId ? { ...st, isCompleted: !st.isCompleted } : st
    );
    setSubTasks(updatedSubTasks);

    try {
      await kanbanSubtasksApi.toggleSubTask(subTaskId);
      // Recarregar para garantir sincronização
      await loadSubTasks();
      onUpdate?.();
    } catch (error: any) {
      console.error('Erro ao alternar sub-negociação:', error);
      // Rollback - reverter para estado anterior
      setSubTasks(previousSubTasks);
      showError(error.message || 'Erro ao atualizar sub-negociação');
    }
  };

  const handleOpenDeleteModal = (subTask: KanbanSubTask) => {
    setSubTaskToDelete(subTask);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSubTaskToDelete(null);
  };

  const handleDeleteSubTask = async () => {
    if (!subTaskToDelete) return;

    const subTaskId = subTaskToDelete.id;

    // Salvar estado anterior para rollback
    const previousSubTasks = [...subTasks];

    // Optimistic update - remover imediatamente
    const updatedSubTasks = subTasks.filter(st => st.id !== subTaskId);
    setSubTasks(updatedSubTasks);
    setIsDeleting(true);

    try {
      await kanbanSubtasksApi.deleteSubTask(subTaskId);
      // Recarregar para garantir sincronização
      await loadSubTasks();
      onUpdate?.();
      showSuccess('Sub-negociação excluída com sucesso!');
      handleCloseDeleteModal();
    } catch (error: any) {
      console.error('Erro ao deletar sub-negociação:', error);
      // Rollback - reverter para estado anterior
      setSubTasks(previousSubTasks);
      showError(error.message || 'Erro ao excluir sub-negociação');
    } finally {
      setIsDeleting(false);
    }
  };

  const completedCount = subTasks.filter(st => st.isCompleted).length;
  const totalCount = subTasks.length;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      !subTasks.find(st => st.dueDate === dueDate)?.isCompleted
    );
  };

  return (
    <Container>
      <Header>
        <Title>Sub-tarefas</Title>
        {totalCount > 0 && (
          <ProgressBadge>
            {completedCount}/{totalCount} concluídas ({progress}%)
          </ProgressBadge>
        )}
      </Header>

      {subTasks.length > 0 && (
        <SubTaskList>
          {subTasks.map(subTask => (
            <SubTaskItem key={subTask.id} $isCompleted={subTask.isCompleted}>
              <CheckboxButton
                $isCompleted={subTask.isCompleted}
                onClick={() => handleToggleSubTask(subTask.id)}
                aria-label={
                  subTask.isCompleted
                    ? 'Marcar como não concluída'
                    : 'Marcar como concluída'
                }
              >
                {subTask.isCompleted ? (
                  <MdCheckCircle size={16} />
                ) : (
                  <MdRadioButtonUnchecked size={16} />
                )}
              </CheckboxButton>
              <SubTaskContent onClick={() => handleViewSubTask(subTask)}>
                <SubTaskTitle $isCompleted={subTask.isCompleted}>
                  {subTask.title}
                </SubTaskTitle>
                {subTask.description && (
                  <DescriptionText>{subTask.description}</DescriptionText>
                )}
                <SubTaskMeta>
                  {subTask.assignedTo && (
                    <AssigneeBadge>
                      <MdPerson size={12} />
                      <Avatar
                        name={subTask.assignedTo.name}
                        image={subTask.assignedTo.avatar}
                        size={16}
                      />
                      <span>{subTask.assignedTo.name}</span>
                    </AssigneeBadge>
                  )}
                  {subTask.dueDate && (
                    <DueDateBadge $isOverdue={isOverdue(subTask.dueDate)}>
                      <MdSchedule size={12} />
                      {format(
                        new Date(subTask.dueDate),
                        "dd 'de' MMM 'de' yyyy",
                        { locale: ptBR }
                      )}
                    </DueDateBadge>
                  )}
                </SubTaskMeta>
              </SubTaskContent>
              <EditButton
                onClick={() => handleOpenEditModal(subTask)}
                aria-label='Editar sub-negociação'
              >
                <MdEdit size={18} />
              </EditButton>
              <DeleteButton
                onClick={() => handleOpenDeleteModal(subTask)}
                aria-label='Excluir sub-negociação'
              >
                <MdDelete size={18} />
              </DeleteButton>
            </SubTaskItem>
          ))}
        </SubTaskList>
      )}

      <AddButton
        onClick={() => {
          const teamId = searchParams.get('teamId');
          const params = new URLSearchParams();
          if (teamId) params.set('teamId', teamId);
          if (projectId) params.set('projectId', projectId);
          const queryString = params.toString();
          navigate(
            `/kanban/tasks/${taskId}/subtasks/new${queryString ? `?${queryString}` : ''}`
          );
        }}
        disabled={loading}
      >
        <MdAdd size={18} />
        Adicionar Sub-negociação
      </AddButton>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteSubTask}
        title='Excluir Sub-negociação'
        message={`Tem certeza que deseja excluir a sub-negociação "${subTaskToDelete?.title}"? Esta ação não pode ser desfeita.`}
        itemName={subTaskToDelete?.title}
        isLoading={isDeleting}
        variant='delete'
        confirmLabel='Excluir'
        loadingLabel='Excluindo...'
      />
    </Container>
  );
};
