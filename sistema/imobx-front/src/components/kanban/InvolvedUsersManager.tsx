import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdPerson, MdPersonAdd, MdClose, MdCheck } from 'react-icons/md';
import { Avatar } from '../common/Avatar';
import { kanbanApi } from '../../services/kanbanApi';
import { showError, showSuccess } from '../../utils/notifications';
import type { KanbanTask } from '../../types/kanban';
import { companyMembersApi } from '../../services/companyMembersApi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UsersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}20;
    color: ${props => props.theme.colors.error};
  }
`;

const AddUserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddUserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    opacity: 0.9;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const UserSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    opacity: 0.9;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    opacity: 0.8;
    color: ${props => props.theme.colors.text};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface InvolvedUsersManagerProps {
  task: KanbanTask;
  teamMembers: User[];
  onUpdate?: (updatedTask: KanbanTask) => void;
  loadCompanyMembers?: boolean; // Se true, carrega membros da empresa como fallback
}

export const InvolvedUsersManager: React.FC<InvolvedUsersManagerProps> = ({
  task,
  teamMembers,
  onUpdate,
  loadCompanyMembers = true,
}) => {
  console.log('👥 InvolvedUsersManager - Renderizando:', {
    taskId: task.id,
    taskTitle: task.title,
    currentInvolvedUsers: task.involvedUsers,
    involvedCount: task.involvedUsers?.length || 0,
    teamMembersCount: teamMembers.length,
    loadCompanyMembers,
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    task.involvedUsers?.map(u => u.id) || []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [allMembers, setAllMembers] = useState<User[]>(teamMembers);
  const [loadingMembers, setLoadingMembers] = useState(false);

  console.log('👥 InvolvedUsersManager - Estado:', {
    selectedUsers,
    selectedCount: selectedUsers.length,
    allMembersCount: allMembers.length,
  });

  // Carregar membros da empresa se teamMembers estiver vazio e loadCompanyMembers for true
  useEffect(() => {
    const loadMembers = async () => {
      if (teamMembers.length > 0) {
        setAllMembers(teamMembers);
        return;
      }

      if (loadCompanyMembers) {
        try {
          setLoadingMembers(true);
          console.log(
            '👥 InvolvedUsersManager - Carregando membros da empresa...'
          );
          const response = await companyMembersApi.getMembers({ limit: 100 });
          const companyMembers: User[] = response.data.map(m => ({
            id: m.id,
            name: m.name,
            email: m.email,
            avatar: m.avatar,
          }));
          console.log(
            '✅ InvolvedUsersManager - Membros da empresa carregados:',
            companyMembers.length
          );
          setAllMembers(companyMembers);
        } catch (error) {
          console.error(
            '❌ InvolvedUsersManager - Erro ao carregar membros da empresa:',
            error
          );
          setAllMembers(teamMembers); // Fallback para teamMembers vazio
        } finally {
          setLoadingMembers(false);
        }
      } else {
        setAllMembers(teamMembers);
      }
    };

    loadMembers();
  }, [teamMembers, loadCompanyMembers]);

  // Sincronizar selectedUsers quando task.involvedUsers mudar, removendo o responsável se estiver na lista
  useEffect(() => {
    const assigneeId = task.assignedTo?.id;
    const currentIds = (task.involvedUsers?.map(u => u.id) || []).filter(
      id => id !== assigneeId // Remover o responsável se estiver na lista
    );
    console.log('🔄 InvolvedUsersManager - Sincronizando estado:', {
      taskInvolvedUsers: task.involvedUsers?.map(u => u.id) || [],
      filteredIds: currentIds,
      assigneeId,
      selectedUsers,
      areEqual:
        JSON.stringify(currentIds.sort()) ===
        JSON.stringify(selectedUsers.sort()),
    });

    if (
      JSON.stringify(currentIds.sort()) !== JSON.stringify(selectedUsers.sort())
    ) {
      console.log(
        '🔄 InvolvedUsersManager - Atualizando selectedUsers (removendo responsável se necessário)...'
      );
      setSelectedUsers(currentIds);
    }
  }, [task.involvedUsers, task.assignedTo?.id, task.id]);

  // Filtrar membros que ainda não estão envolvidos e que não são o responsável
  const assigneeId = task.assignedTo?.id;
  const availableMembers = allMembers.filter(
    member => !selectedUsers.includes(member.id) && member.id !== assigneeId
  );

  const handleAddUser = () => {
    if (selectedUserId && !selectedUsers.includes(selectedUserId)) {
      setSelectedUsers([...selectedUsers, selectedUserId]);
      setSelectedUserId('');
      setIsAdding(false);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(id => id !== userId));
  };

  const handleSave = async () => {
    console.log('💾 InvolvedUsersManager - Salvando pessoas envolvidas:', {
      taskId: task.id,
      selectedUsers,
      selectedCount: selectedUsers.length,
    });

    // Salvar estado anterior para rollback
    const previousTask = { ...task };

    // Construir lista de usuários envolvidos otimisticamente
    const optimisticInvolvedUsers = selectedUsers
      .map(userId => allMembers.find(m => m.id === userId))
      .filter((user): user is NonNullable<typeof user> => user !== undefined)
      .map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }));

    // Update otimista IMEDIATO
    const optimisticTask: KanbanTask = {
      ...task,
      involvedUsers: optimisticInvolvedUsers,
    };

    if (onUpdate) {
      console.log('🔄 InvolvedUsersManager - Atualizando otimisticamente...');
      onUpdate(optimisticTask);
    }

    try {
      setIsSaving(true);
      const updatedTask = await kanbanApi.setInvolvedUsers(
        task.id,
        selectedUsers
      );
      console.log('✅ InvolvedUsersManager - Pessoas envolvidas salvas:', {
        taskId: updatedTask.id,
        involvedUsers: updatedTask.involvedUsers,
        count: updatedTask.involvedUsers?.length || 0,
      });

      showSuccess('Pessoas envolvidas atualizadas com sucesso!');
      // NÃO chamar onUpdate novamente - já foi atualizado otimisticamente
      setIsAdding(false);
    } catch (error: any) {
      console.error(
        '❌ InvolvedUsersManager - Erro ao salvar pessoas envolvidas:',
        error
      );
      // Rollback - reverter para estado anterior
      if (onUpdate) {
        onUpdate(previousTask);
      }
      showError(error?.message || 'Erro ao salvar pessoas envolvidas');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedUsers(task.involvedUsers?.map(u => u.id) || []);
    setIsAdding(false);
    setSelectedUserId('');
  };

  const hasChanges =
    JSON.stringify(selectedUsers.sort()) !==
    JSON.stringify((task.involvedUsers?.map(u => u.id) || []).sort());

  const currentInvolvedUsers = task.involvedUsers || [];
  // Buscar dados dos usuários selecionados: primeiro em currentInvolvedUsers, depois em allMembers
  const selectedUsersData = selectedUsers
    .map(id => {
      // Primeiro tenta encontrar em currentInvolvedUsers (já salvo)
      const fromCurrent = currentInvolvedUsers.find(u => u.id === id);
      if (fromCurrent) return fromCurrent;
      // Se não encontrar, busca em allMembers (selecionado mas ainda não salvo)
      const fromMembers = allMembers.find(m => m.id === id);
      return fromMembers
        ? {
            id: fromMembers.id,
            name: fromMembers.name,
            email: fromMembers.email,
            avatar: fromMembers.avatar,
          }
        : null;
    })
    .filter(Boolean) as User[];

  console.log('👥 InvolvedUsersManager - Dados dos usuários selecionados:', {
    selectedUsers,
    selectedUsersData,
    currentInvolvedUsers,
    allMembersCount: allMembers.length,
  });

  return (
    <Container
      style={{
        marginTop: 0,
        padding: '0',
        background: 'transparent',
        border: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentInvolvedUsers.length === 0 && selectedUsers.length === 0 ? (
          <EmptyState>
            Nenhuma pessoa envolvida. Adicione membros da equipe para colaborar
            nesta tarefa.
          </EmptyState>
        ) : (
          <UsersList>
            {selectedUsersData.map(user => (
              <UserBadge key={user.id}>
                <Avatar name={user.name} image={user.avatar} size={24} />
                <span>{user.name}</span>
                <RemoveButton
                  onClick={() => handleRemoveUser(user.id)}
                  title='Remover'
                >
                  <MdClose size={16} />
                </RemoveButton>
              </UserBadge>
            ))}
          </UsersList>
        )}

        {!isAdding ? (
          <AddUserButton
            onClick={() => setIsAdding(true)}
            disabled={loadingMembers}
            title={
              loadingMembers
                ? 'Carregando membros...'
                : availableMembers.length === 0
                  ? 'Aguardando carregamento de membros...'
                  : 'Adicionar pessoa envolvida'
            }
          >
            <MdPersonAdd size={18} />
            {loadingMembers ? 'Carregando membros...' : 'Adicionar Pessoa'}
          </AddUserButton>
        ) : (
          <AddUserSection>
            <UserSelect
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              disabled={loadingMembers || availableMembers.length === 0}
            >
              <option value=''>
                {loadingMembers
                  ? 'Carregando membros...'
                  : availableMembers.length === 0
                    ? 'Nenhum membro disponível'
                    : 'Selecione um membro...'}
              </option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.email ? `(${member.email})` : ''}
                </option>
              ))}
            </UserSelect>
            <Actions>
              <SaveButton onClick={handleAddUser} disabled={!selectedUserId}>
                <MdCheck size={18} />
                Adicionar
              </SaveButton>
              <CancelButton onClick={() => setIsAdding(false)}>
                Cancelar
              </CancelButton>
            </Actions>
          </AddUserSection>
        )}

        {hasChanges && (
          <Actions>
            <SaveButton onClick={handleSave} disabled={isSaving}>
              <MdCheck size={18} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </SaveButton>
            <CancelButton onClick={handleCancel} disabled={isSaving}>
              Cancelar
            </CancelButton>
          </Actions>
        )}
      </div>
    </Container>
  );
};
