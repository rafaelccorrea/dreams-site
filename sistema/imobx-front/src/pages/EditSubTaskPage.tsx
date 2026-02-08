import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdCheck,
  MdPerson,
  MdSchedule,
  MdDescription,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useUsers } from '../hooks/useUsers';
import { kanbanSubtasksApi } from '../services/kanbanSubtasksApi';
import { showSuccess, showError } from '../utils/notifications';
import type { UpdateSubTaskDto } from '../types/kanban';
import { Avatar } from '../components/common/Avatar';
import { companyMembersApi } from '../services/companyMembersApi';

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
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.938rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.border};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
`;

const EditSubTaskPage: React.FC = () => {
  const { subTaskId } = useParams<{ subTaskId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const taskId = searchParams.get('taskId');
  const projectId = searchParams.get('projectId');
  const teamId = searchParams.get('teamId');

  useEffect(() => {
    if (!subTaskId) {
      showError('ID da subtarefa é necessário');
      navigate(-1);
      return;
    }

    loadSubTask();
    loadTeamMembers();
  }, [subTaskId]);

  const loadSubTask = async () => {
    if (!subTaskId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await kanbanSubtasksApi.getSubTask(subTaskId);
      setTitle(data.title);
      setDescription(data.description || '');
      setAssignedToId(data.assignedToId || '');
      setDueDate(
        data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : ''
      );
    } catch (err: any) {
      console.error('Erro ao carregar subtarefa:', err);
      setError(err.message || 'Erro ao carregar subtarefa');
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await companyMembersApi.getMembers({ limit: 100 });
      setTeamMembers(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar membros:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showError('O título é obrigatório');
      return;
    }

    if (!subTaskId) return;

    try {
      setSaving(true);
      const data: UpdateSubTaskDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        assignedToId: assignedToId || undefined,
        dueDate: dueDate || undefined,
      };

      await kanbanSubtasksApi.updateSubTask(subTaskId, data);
      showSuccess('Subtarefa atualizada com sucesso!');

      // Navegar de volta para a página de detalhes
      const params = new URLSearchParams();
      if (taskId) params.append('taskId', taskId);
      if (projectId) params.append('projectId', projectId);
      if (teamId) params.append('teamId', teamId);
      navigate(`/kanban/subtasks/${subTaskId}?${params.toString()}`);
    } catch (err: any) {
      console.error('Erro ao atualizar subtarefa:', err);
      showError(err.message || 'Erro ao atualizar subtarefa');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (subTaskId) {
      const params = new URLSearchParams();
      if (taskId) params.append('taskId', taskId);
      if (projectId) params.append('projectId', projectId);
      if (teamId) params.append('teamId', teamId);
      navigate(`/kanban/subtasks/${subTaskId}?${params.toString()}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState>Carregando subtarefa...</LoadingState>
        </PageContainer>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <PageContainer>
          <ErrorState>{error}</ErrorState>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <Header>
          <div>
            <Title>Editar Subtarefa</Title>
            <Subtitle>Atualize as informações da subtarefa</Subtitle>
          </div>
          <BackButton onClick={handleBack}>
            <MdArrowBack size={18} />
            Voltar
          </BackButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor='title'>
              Título <span style={{ color: 'red' }}>*</span>
            </Label>
            <Input
              id='title'
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Digite o título da subtarefa'
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Digite a descrição da subtarefa (opcional)'
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor='assignedTo'>Responsável</Label>
            <Select
              id='assignedTo'
              value={assignedToId}
              onChange={e => setAssignedToId(e.target.value)}
            >
              <option value=''>Não atribuído</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor='dueDate'>Data de Vencimento</Label>
            <Input
              id='dueDate'
              type='date'
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </FormGroup>

          <ButtonGroup>
            <Button
              type='button'
              $variant='secondary'
              onClick={handleBack}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type='submit' $variant='primary' disabled={saving}>
              <MdCheck size={18} />
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </Form>
      </PageContainer>
    </Layout>
  );
};

export default EditSubTaskPage;
