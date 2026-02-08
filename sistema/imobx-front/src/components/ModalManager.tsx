import React from 'react';
import { useModal } from '../hooks/useModal';
import { UserModal } from './modals/UserModal';
import { UserPermissionsModal } from './UserPermissionsModal';
import { DeleteConfirmationModal } from './modals/DeleteConfirmationModal';
// TaskModal removido - usando navegação para CreateTaskPage e TaskDetailsPage
import { useUsers } from '../hooks/useUsers';
import { useTeams } from '../hooks/useTeams';
import { useKanban } from '../hooks/useKanban';

export const ModalManager: React.FC = () => {
  const { activeModal, modalData, closeModal } = useModal();

  // CORREÇÃO: Desabilitar auto-reload para evitar chamadas desnecessárias
  // O ModalManager não precisa carregar listas automaticamente
  const { createUser, updateUser, deleteUser } = useUsers({
    disableAutoReload: true,
  });
  const { createTeam, updateTeam, deleteTeam } = useTeams();
  const { createTask, updateTask, deleteTask } = useKanban();

  // Handlers para modais de usuário
  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData);
      closeModal();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      if (!modalData.userId) throw new Error('ID do usuário não encontrado');
      await updateUser(modalData.userId, userData);
      closeModal();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!modalData.userId) throw new Error('ID do usuário não encontrado');
      await deleteUser(modalData.userId);
      closeModal();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  };

  // Handlers para modais de equipe
  const handleCreateTeam = async (teamData: any) => {
    try {
      await createTeam(teamData);
      closeModal();
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      throw error;
    }
  };

  const handleUpdateTeam = async (teamData: any) => {
    try {
      if (!modalData.teamId) throw new Error('ID da equipe não encontrado');
      await updateTeam(modalData.teamId, teamData);
      closeModal();
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      throw error;
    }
  };

  const handleDeleteTeam = async () => {
    try {
      if (!modalData.teamId) throw new Error('ID da equipe não encontrado');
      await deleteTeam(modalData.teamId);
      closeModal();
    } catch (error) {
      console.error('Erro ao deletar equipe:', error);
      throw error;
    }
  };

  // Handlers para modais de negociação
  const handleCreateTask = async (taskData: any) => {
    try {
      if (!modalData.teamId) throw new Error('ID da equipe não encontrado');
      const newTask = await createTask(
        taskData,
        modalData.teamId,
        modalData.projectId
      );
      closeModal();
      return newTask;
    } catch (error) {
      console.error('Erro ao criar negociação:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    try {
      if (!modalData.taskId) throw new Error('ID da negociação não encontrado');
      const updatedTask = await updateTask(modalData.taskId, taskData);
      closeModal();
      return updatedTask;
    } catch (error) {
      console.error('Erro ao atualizar negociação:', error);
      throw error;
    }
  };

  const handleDeleteTask = async () => {
    try {
      if (!modalData.taskId) throw new Error('ID da negociação não encontrado');
      await deleteTask(modalData.taskId);
      closeModal();
    } catch (error: any) {
      console.error('Erro ao deletar negociação:', error);
      // O rollback já foi feito no useKanban, apenas mostrar erro ao usuário
      const { showError } = await import('../utils/notifications');
      showError(
        error?.message ||
          'Erro ao deletar negociação. A negociação foi restaurada.'
      );
      throw error;
    }
  };

  // Renderizar modal baseado no tipo ativo
  const renderModal = () => {
    switch (activeModal) {
      case 'createUser':
        return (
          <UserModal
            isOpen={true}
            onClose={closeModal}
            onSave={handleCreateUser}
            isLoading={false}
          />
        );

      case 'editUser':
        return (
          <UserModal
            isOpen={true}
            onClose={closeModal}
            onSave={handleUpdateUser}
            user={modalData.user}
            isLoading={false}
          />
        );

      case 'deleteUser':
        return (
          <DeleteConfirmationModal
            isOpen={true}
            onClose={closeModal}
            onConfirm={handleDeleteUser}
            title='Excluir Usuário'
            message={`Tem certeza que deseja excluir o usuário "${modalData.userName}"? Esta ação não pode ser desfeita.`}
            confirmText='Excluir'
            cancelText='Cancelar'
            isLoading={false}
          />
        );

      case 'userPermissions':
        return (
          <UserPermissionsModal
            open={true}
            onClose={closeModal}
            userId={modalData.userId || ''}
            userName={modalData.userName || ''}
            userEmail={modalData.userEmail || ''}
          />
        );

      case 'createTask':
        // Modal removido - usar navegação para CreateTaskPage
        // O código que chama openModal('createTask') deve navegar diretamente
        console.warn(
          'createTask modal não está mais disponível. Use navegação para /kanban/create-task'
        );
        closeModal();
        return null;

      case 'editTask':
        // Modal removido - usar navegação para TaskDetailsPage
        // O código que chama openModal('editTask') deve navegar diretamente
        console.warn(
          'editTask modal não está mais disponível. Use navegação para /kanban/task/:id'
        );
        closeModal();
        return null;

      case 'deleteTask':
        return (
          <DeleteConfirmationModal
            isOpen={true}
            onClose={closeModal}
            onConfirm={handleDeleteTask}
            message={`Tem certeza que deseja excluir a negociação "${modalData.taskTitle}"?`}
            isLoading={false}
          />
        );

      // TODO: Implementar modais de equipe quando necessário
      // case 'createTeam':
      // case 'editTeam':
      // case 'deleteTeam':
      //   return <TeamModal ... />;

      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
};
