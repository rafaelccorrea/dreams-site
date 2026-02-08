import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdPerson, MdSchedule, MdDescription } from 'react-icons/md';
import type {
  CreateSubTaskDto,
  UpdateSubTaskDto,
  KanbanSubTask,
} from '../../types/kanban';
import { Avatar } from '../common/Avatar';
import { useUsers } from '../../hooks/useUsers';
import { kanbanApi } from '../../services/kanbanApi';

interface SubTaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubTaskDto | UpdateSubTaskDto) => Promise<void>;
  subTask?: KanbanSubTask;
  projectId?: string;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const FieldInput = styled.input`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const FieldTextarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const FieldSelect = styled.select`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const UserOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: #fff;
        &:hover {
          background: ${props.theme.colors.primaryHover};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
        }
      `;
    }
    return `
      background: transparent;
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover {
        background: ${props.theme.colors.background};
        border-color: ${props.theme.colors.primary};
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SubTaskFormModal: React.FC<SubTaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subTask,
  projectId,
}) => {
  const { users, getUsers } = useUsers();
  const [availableUsers, setAvailableUsers] = useState<
    Array<{ id: string; name: string; email: string; avatar?: string }>
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState<CreateSubTaskDto>({
    title: '',
    description: '',
    assignedToId: undefined,
    dueDate: undefined,
  });

  useEffect(() => {
    if (isOpen) {
      if (subTask) {
        setFormData({
          title: subTask.title,
          description: subTask.description || '',
          assignedToId: subTask.assignedToId || undefined,
          dueDate: subTask.dueDate ? subTask.dueDate.split('T')[0] : undefined,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          assignedToId: undefined,
          dueDate: undefined,
        });
      }
      loadAvailableUsers();
    }
  }, [isOpen, subTask]);

  useEffect(() => {
    if (users.length === 0) {
      getUsers({ limit: 100 }).catch(err => {
        console.error('Erro ao carregar usuários:', err);
      });
    }
  }, [users.length, getUsers]);

  const loadAvailableUsers = async () => {
    if (!projectId) {
      setAvailableUsers(
        users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
        }))
      );
      return;
    }

    try {
      setLoadingUsers(true);
      const members = await kanbanApi.getProjectMembers(projectId);
      setAvailableUsers(
        members.map(m => ({
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          avatar: undefined,
        }))
      );
    } catch (error: any) {
      console.error('Erro ao carregar membros do projeto:', error);
      setAvailableUsers(
        users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
        }))
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    try {
      const dataToSubmit: CreateSubTaskDto | UpdateSubTaskDto = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        assignedToId: formData.assignedToId || undefined,
        dueDate: formData.dueDate || undefined,
      };

      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      // Erro já tratado no componente pai
    }
  };

  const selectedUser = availableUsers.find(u => u.id === formData.assignedToId);

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {subTask ? 'Editar Sub-negociação' : 'Nova Sub-negociação'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FieldGroup>
              <FieldLabel>
                Título <RequiredMark>*</RequiredMark>
              </FieldLabel>
              <FieldInput
                type='text'
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder='Digite o título da sub-negociação'
                required
                maxLength={200}
                autoFocus
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>
                <MdDescription size={16} />
                Descrição
              </FieldLabel>
              <FieldTextarea
                value={formData.description || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Adicione uma descrição (opcional)'
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>
                <MdPerson size={16} />
                Responsável
              </FieldLabel>
              <FieldSelect
                value={formData.assignedToId || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    assignedToId: e.target.value || undefined,
                  }))
                }
                disabled={loadingUsers}
              >
                <option value=''>Nenhum responsável</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </FieldSelect>
              {selectedUser && (
                <UserOption>
                  <Avatar
                    name={selectedUser.name}
                    image={selectedUser.avatar}
                    size={32}
                  />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {selectedUser.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {selectedUser.email}
                    </div>
                  </div>
                </UserOption>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>
                <MdSchedule size={16} />
                Data de Vencimento
              </FieldLabel>
              <FieldInput
                type='date'
                value={formData.dueDate || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    dueDate: e.target.value || undefined,
                  }))
                }
              />
            </FieldGroup>
          </ModalBody>

          <ModalFooter>
            <Button type='button' onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type='submit'
              $variant='primary'
              disabled={!formData.title.trim()}
            >
              {subTask ? 'Salvar' : 'Criar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </Overlay>
  );
};
