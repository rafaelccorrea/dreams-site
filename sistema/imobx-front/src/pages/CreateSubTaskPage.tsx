import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdCheck,
  MdPerson,
  MdSchedule,
  MdDescription,
  MdInfo,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useUsers } from '../hooks/useUsers';
import { kanbanApi } from '../services/kanbanApi';
import { kanbanSubtasksApi } from '../services/kanbanSubtasksApi';
import { showSuccess, showError } from '../utils/notifications';
import type { CreateSubTaskDto, KanbanTask } from '../types/kanban';
import { Avatar } from '../components/common/Avatar';

const PageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.div`
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BackButton = styled.button`
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
    transform: translateX(-4px);
  }
`;

const FormGrid = styled.div`
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
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props =>
        props.$hasError
          ? props.theme.colors.error + '15'
          : props.theme.colors.primary + '15'};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props =>
        props.$hasError
          ? props.theme.colors.error + '15'
          : props.theme.colors.primary + '15'};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 16px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 48px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props =>
        props.$hasError
          ? props.theme.colors.error + '15'
          : props.theme.colors.primary + '15'};
  }
`;

const UserOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-top: 8px;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $isLoading?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: #fff;
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primaryHover};
          transform: translateY(-2px);
          box-shadow: 0 8px 20px ${props.theme.colors.primary}40;
        }
      `;
    }
    return `
      background: transparent;
      color: ${props.theme.colors.text};
      border: 2px solid ${props.theme.colors.border};
      &:hover:not(:disabled) {
        background: ${props.theme.colors.cardBackground};
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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success || '#10B981'};
  font-size: 14px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const InfoMessage = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-weight: 400;
  padding: 10px 12px;
  background: ${props => props.theme.colors.backgroundSecondary || '#F3F4F6'};
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.colors.primary || '#3B82F6'};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const CreateSubTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const { users, getUsers } = useUsers();

  const [formData, setFormData] = useState<CreateSubTaskDto>({
    title: '',
    description: '',
    assignedToId: undefined,
    dueDate: undefined,
  });

  const [availableUsers, setAvailableUsers] = useState<
    Array<{ id: string; name: string; email: string; avatar?: string }>
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [parentTask, setParentTask] = useState<KanbanTask | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      getUsers({ limit: 100 }).catch(err => {
        console.error('Erro ao carregar usuários:', err);
      });
    }
  }, [users.length, getUsers]);

  useEffect(() => {
    const loadTaskAndUsers = async () => {
      if (!taskId) return;

      try {
        setLoadingTask(true);
        // Buscar a negociação para obter o projectId e assignedToId
        const teamId = searchParams.get('teamId');
        if (teamId) {
          const boardData = await kanbanApi.getBoard(teamId, {});
          const task = boardData.tasks.find(t => t.id === taskId);

          if (task) {
            setParentTask(task);

            if (task.projectId) {
              setProjectId(task.projectId);
              await loadAvailableUsers(task.projectId);
            } else {
              setAvailableUsers(
                users.map(u => ({
                  id: u.id,
                  name: u.name,
                  email: u.email,
                  avatar: u.avatar,
                }))
              );
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar negociação:', error);
        setAvailableUsers(
          users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
          }))
        );
      } finally {
        setLoadingTask(false);
      }
    };

    loadTaskAndUsers();
  }, [taskId, users, searchParams]);

  const loadAvailableUsers = async (currentProjectId: string) => {
    try {
      setLoadingUsers(true);
      const members = await kanbanApi.getProjectMembers(currentProjectId);
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Título deve ter no máximo 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSubmitting || !taskId) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Se assignedToId não for fornecido, não enviar o campo para que o backend faça a herança
      const createData: CreateSubTaskDto = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        dueDate: formData.dueDate || undefined,
      };

      // Só incluir assignedToId se foi explicitamente selecionado
      if (formData.assignedToId) {
        createData.assignedToId = formData.assignedToId;
      }

      await kanbanSubtasksApi.createSubTask(taskId, createData);

      setSubmitSuccess(true);
      showSuccess('Sub-negociação criada com sucesso!');

      // Voltar para a página de detalhes da negociação
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error: any) {
      setErrors({
        submit:
          error.message || 'Erro ao criar sub-negociação. Tente novamente.',
      });
      showError(
        error.message || 'Erro ao criar sub-negociação. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const selectedUser = availableUsers.find(u => u.id === formData.assignedToId);

  return (
    <Layout>
      <PageContainer>
        <Header>
          <div>
            <Title>Nova Sub-negociação</Title>
            <Subtitle>
              Preencha os dados para criar uma nova sub-negociação
            </Subtitle>
          </div>
          <BackButton onClick={handleBack} type='button'>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
        </Header>

        <FormGrid as='form' onSubmit={handleSubmit}>
          <FieldContainer>
            <FieldLabel>
              Título <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Input
              type='text'
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder='Digite o título da sub-negociação'
              $hasError={!!errors.title}
              maxLength={200}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>
              <MdDescription size={18} />
              Descrição
            </FieldLabel>
            <TextArea
              value={formData.description || ''}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder='Adicione uma descrição (opcional)'
              $hasError={!!errors.description}
            />
            {errors.description && (
              <ErrorMessage>{errors.description}</ErrorMessage>
            )}
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>
              <MdPerson size={18} />
              Responsável
            </FieldLabel>
            <Select
              value={formData.assignedToId || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  assignedToId: e.target.value || undefined,
                }))
              }
              $hasError={!!errors.assignedToId}
              disabled={loadingUsers || loadingTask}
            >
              <option value=''>
                {parentTask?.assignedToId
                  ? `Herdar da negociação pai (${parentTask.assignedTo?.name || 'Responsável da negociação'})`
                  : 'Nenhum responsável (herdará da negociação pai se houver)'}
              </option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
            {selectedUser && (
              <UserOption>
                <Avatar
                  name={selectedUser.name}
                  image={selectedUser.avatar}
                  size={40}
                />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                    {selectedUser.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {selectedUser.email}
                  </div>
                </div>
              </UserOption>
            )}
            {!formData.assignedToId && parentTask && (
              <InfoMessage>
                <MdInfo size={16} />
                <div>
                  <strong>Herança automática:</strong> Se você não selecionar um
                  responsável, a sub-negociação herdará automaticamente o
                  responsável da negociação pai (
                  {parentTask.assignedTo?.name || 'sem responsável'}).
                </div>
              </InfoMessage>
            )}
            {!formData.assignedToId && !parentTask?.assignedToId && (
              <InfoMessage>
                <MdInfo size={16} />
                <div>
                  <strong>Sem responsável:</strong> A negociação pai não possui
                  responsável. Se você não selecionar um responsável, a
                  sub-negociação também ficará sem responsável.
                </div>
              </InfoMessage>
            )}
            {errors.assignedToId && (
              <ErrorMessage>{errors.assignedToId}</ErrorMessage>
            )}
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>
              <MdSchedule size={18} />
              Data de Vencimento
            </FieldLabel>
            <Input
              type='date'
              value={formData.dueDate || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  dueDate: e.target.value || undefined,
                }))
              }
              $hasError={!!errors.dueDate}
            />
            {errors.dueDate && <ErrorMessage>{errors.dueDate}</ErrorMessage>}
          </FieldContainer>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          {submitSuccess && (
            <SuccessMessage>
              <MdCheck size={16} />
              Sub-negociação criada com sucesso! Redirecionando...
            </SuccessMessage>
          )}

          <ButtonsRow>
            <Button
              type='button'
              onClick={handleBack}
              disabled={isSubmitting}
              $variant='secondary'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              $variant='primary'
              disabled={isSubmitting || !formData.title.trim()}
              $isLoading={isSubmitting}
            >
              {isSubmitting ? (
                <>Criando...</>
              ) : (
                <>
                  <MdCheck size={18} />
                  Criar Sub-negociação
                </>
              )}
            </Button>
          </ButtonsRow>
        </FormGrid>
      </PageContainer>
    </Layout>
  );
};

export default CreateSubTaskPage;
