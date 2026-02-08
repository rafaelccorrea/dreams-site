import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdCheck,
  MdAttachFile,
  MdCloudUpload,
  MdDelete,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useUsers } from '../hooks/useUsers';
import { useProjects } from '../hooks/useProjects';
import { useKanban } from '../hooks/useKanban';
import { useAuth } from '../hooks/useAuth';
import { showSuccess, showError } from '../utils/notifications';
import type { CreateTaskDto } from '../types/kanban';
import { kanbanApi } from '../services/kanbanApi';
import { getNumericValue } from '../utils/masks';

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

const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
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

const ResponsiveRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const PriorityBadge = styled.div<{ $priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$priority) {
      case 'low':
        return '#10B98120';
      case 'medium':
        return '#F59E0B20';
      case 'high':
        return '#EF444420';
      case 'urgent':
        return '#DC262620';
      default:
        return props.theme.colors.border;
    }
  }};
  color: ${props => {
    switch (props.$priority) {
      case 'low':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'high':
        return '#EF4444';
      case 'urgent':
        return '#DC2626';
      default:
        return props.theme.colors.text;
    }
  }};
  margin-top: 8px;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $isLoading?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary}dd;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
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
    transform: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
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

const priorityOptions = [
  { value: 'low', label: 'Baixa', color: '#10B981' },
  { value: 'medium', label: 'Média', color: '#F59E0B' },
  { value: 'high', label: 'Alta', color: '#EF4444' },
  { value: 'urgent', label: 'Urgente', color: '#DC2626' },
];

import { buildKanbanUrl, saveKanbanState } from '../utils/kanbanState';
import { UserMultiSelect } from '../components/common/UserMultiSelect';
import { ClientSelect } from '../components/kanban/ClientSelect';
import { PropertySelect } from '../components/kanban/PropertySelect';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { users, getUsers, isLoading: usersLoading } = useUsers();
  const { createTask } = useKanban();
  const { getCurrentUser } = useAuth();

  const teamId = searchParams.get('teamId');
  const projectId = searchParams.get('projectId');
  const columnId = searchParams.get('columnId');
  const workspaceType = searchParams.get('workspace');

  // Converter null para undefined para evitar problemas no hook
  const validTeamId =
    teamId && teamId !== 'null' && teamId !== 'undefined' ? teamId : undefined;
  const { projects } = useProjects(validTeamId);
  const currentUser = getCurrentUser();

  // Verificar se é projeto pessoal - verificar parâmetro da URL e também se o projeto tem isPersonal
  const isPersonalFromUrl = workspaceType === 'personal';
  const currentProject = projects.find(p => p.id === projectId);
  const isPersonalFromProject = currentProject?.isPersonal === true;
  const isPersonalWorkspace = isPersonalFromUrl || isPersonalFromProject;

  // Estado para usuários disponíveis (membros do projeto ou todos os usuários)
  const [availableUsers, setAvailableUsers] = useState<
    Array<{ id: string; name: string; email: string; avatar?: string }>
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Carregar usuários quando o componente montar
  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      getUsers({ limit: 100 }).catch(err => {
        console.error('Erro ao carregar usuários:', err);
      });
    }
  }, [users.length, usersLoading, getUsers]);

  // Atualizar availableUsers quando users mudar (fallback inicial)
  useEffect(() => {
    if (users.length > 0 && availableUsers.length === 0 && !projectId) {
      setAvailableUsers(
        users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar,
        }))
      );
    }
  }, [users, projectId, availableUsers.length]);

  // Salvar estado do kanban no localStorage quando a página carrega
  useEffect(() => {
    if (currentUser?.id) {
      saveKanbanState({
        teamId: teamId || null,
        projectId: projectId || null,
        workspace: workspaceType || null,
        userId: currentUser.id,
      });
    }
  }, [teamId, projectId, workspaceType, currentUser?.id]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    dueDate: new Date().toISOString().split('T')[0],
    assignedToId: '',
    projectId: projectId || '',
    involvedUserIds: [] as string[],
    clientId: null as string | null,
    propertyId: null as string | null,
  });

  // Estado separado para o valor formatado (display)
  const [totalValueDisplay, setTotalValueDisplay] = useState('');

  // Estado para arquivos a serem anexados após criar a tarefa
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Carregar usuários disponíveis baseado no tipo de projeto
  useEffect(() => {
    let cancelled = false;

    const loadAvailableUsers = async () => {
      // Usar projectId da URL como prioridade, depois formData.projectId
      const currentProjectId = projectId || formData.projectId;
      console.log(
        '🔄 CreateTaskPage - Carregando membros para projeto:',
        currentProjectId
      );

      // Se não há usuários carregados ainda, aguardar
      if (!users || users.length === 0) {
        console.log('⏳ CreateTaskPage - Aguardando usuários carregarem...');
        // Tentar carregar usuários se ainda não foram carregados
        if (!usersLoading) {
          try {
            await getUsers({ limit: 100 });
          } catch (err) {
            console.error('Erro ao carregar usuários:', err);
          }
        }
        return;
      }

      if (!currentProjectId) {
        // Se não há projeto, usar todos os usuários
        console.log(
          '📋 CreateTaskPage - Sem projeto, usando todos os usuários'
        );
        if (!cancelled) {
          setAvailableUsers(
            users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              avatar: u.avatar,
            }))
          );
        }
        return;
      }

      // Aguardar projetos carregarem se ainda não estiverem disponíveis
      if (projects.length === 0) {
        console.log('⏳ CreateTaskPage - Aguardando projetos carregarem...');
        if (!cancelled) {
          setAvailableUsers(
            users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              avatar: u.avatar,
            }))
          );
        }
        return;
      }

      // Encontrar o projeto na lista
      const project = projects.find(p => p.id === currentProjectId);
      console.log(
        '🔍 CreateTaskPage - Projeto encontrado:',
        project?.name,
        'isPersonal:',
        project?.isPersonal
      );

      // Verificar se é projeto de equipe (não pessoal)
      const isTeamProject = project && !project.isPersonal;

      if (isTeamProject && currentProjectId) {
        // Usar API de membros do projeto para projetos de equipe
        console.log(
          '👥 CreateTaskPage - Carregando membros do projeto de equipe...'
        );
        if (!cancelled) {
          setLoadingUsers(true);
        }
        try {
          const { kanbanApi } = await import('../services/kanbanApi');
          const members = await kanbanApi.getProjectMembers(currentProjectId);
          console.log(
            '✅ CreateTaskPage - Membros carregados:',
            members.length
          );
          // Mapear para o formato esperado
          if (!cancelled) {
            setAvailableUsers(
              members.map(m => ({
                id: m.user.id,
                name: m.user.name,
                email: m.user.email,
                avatar: undefined,
              }))
            );
            setLoadingUsers(false);
          }
        } catch (error: any) {
          console.error(
            '❌ CreateTaskPage - Erro ao carregar membros do projeto:',
            error
          );
          // Fallback para todos os usuários em caso de erro
          if (!cancelled) {
            const mappedUsers = users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              avatar: u.avatar,
            }));
            setAvailableUsers(mappedUsers);

            // Se ainda não há usuários, tentar carregar membros da empresa
            if (mappedUsers.length === 0) {
              try {
                const { companyMembersApi } = await import(
                  '../services/companyMembersApi'
                );
                const response = await companyMembersApi.getMembers({
                  limit: 100,
                });
                setAvailableUsers(
                  response.data.map(m => ({
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    avatar: m.avatar,
                  }))
                );
              } catch (fallbackError) {
                console.error(
                  '❌ CreateTaskPage - Erro ao carregar membros da empresa:',
                  fallbackError
                );
              }
            }
            setLoadingUsers(false);
          }
        }
      } else {
        // Para projetos pessoais ou quando não há projeto, usar todos os usuários
        console.log(
          '👤 CreateTaskPage - Projeto pessoal ou sem projeto, usando todos os usuários'
        );
        if (!cancelled) {
          const mappedUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
          }));
          setAvailableUsers(mappedUsers);

          // Se ainda não há usuários, tentar carregar membros da empresa
          if (mappedUsers.length === 0) {
            try {
              const { companyMembersApi } = await import(
                '../services/companyMembersApi'
              );
              const response = await companyMembersApi.getMembers({
                limit: 100,
              });
              setAvailableUsers(
                response.data.map(m => ({
                  id: m.id,
                  name: m.name,
                  email: m.email,
                  avatar: m.avatar,
                }))
              );
            } catch (fallbackError) {
              console.error(
                '❌ CreateTaskPage - Erro ao carregar membros da empresa:',
                fallbackError
              );
            }
          }
        }
      }
    };

    loadAvailableUsers();

    return () => {
      cancelled = true;
    };
  }, [projectId, formData.projectId, projects, users, usersLoading, getUsers]);

  useEffect(() => {
    if (projectId) {
      setFormData(prev => ({
        ...prev,
        projectId: projectId,
      }));
    }

    // Se for projeto pessoal, preencher automaticamente o responsável com o usuário atual
    if (isPersonalWorkspace && currentUser?.id) {
      setFormData(prev => ({
        ...prev,
        assignedToId: currentUser.id,
      }));
    }
  }, [projectId, isPersonalWorkspace, currentUser?.id]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    }

    if (!columnId) {
      newErrors.columnId = 'Coluna é obrigatória';
    }

    // Projeto só é obrigatório se não for projeto pessoal e não vier da URL
    if (!isPersonalWorkspace && !projectId && !formData.projectId) {
      newErrors.projectId = 'Projeto é obrigatório';
    }

    if (formData.dueDate) {
      const selectedDate = formData.dueDate;
      const today = new Date().toISOString().split('T')[0];

      if (selectedDate < today) {
        newErrors.dueDate =
          'Data de vencimento não pode ser anterior à data atual';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const taskData: CreateTaskDto = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      columnId: columnId || '',
      position: 0, // Sempre criar no início da coluna
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      // Se for projeto pessoal, sempre usar o ID do usuário atual
      assignedToId:
        isPersonalWorkspace && currentUser?.id
          ? currentUser.id
          : formData.assignedToId || undefined,
      // Usar projectId da URL se disponível, senão usar do formData
      projectId: projectId || formData.projectId,
      totalValue: totalValueDisplay
        ? getNumericValue(totalValueDisplay)
        : undefined,
      clientId: formData.clientId || null,
      propertyId: formData.propertyId || null,
    };

    try {
      const finalProjectId = projectId || formData.projectId || undefined;
      const newTask = await createTask(taskData, teamId || '', finalProjectId);

      // Adicionar pessoas envolvidas se houver (excluindo o responsável se estiver na lista)
      const involvedUserIdsFiltered = formData.involvedUserIds.filter(
        id => id !== formData.assignedToId // Remover o responsável se estiver na lista
      );

      if (involvedUserIdsFiltered.length > 0 && newTask?.id) {
        console.log('👥 CreateTaskPage - Adicionando pessoas envolvidas:', {
          taskId: newTask.id,
          involvedUserIds: involvedUserIdsFiltered,
          count: involvedUserIdsFiltered.length,
          originalCount: formData.involvedUserIds.length,
          removedAssignee:
            formData.involvedUserIds.length !== involvedUserIdsFiltered.length,
        });
        try {
          await kanbanApi.setInvolvedUsers(newTask.id, involvedUserIdsFiltered);
          console.log(
            '✅ CreateTaskPage - Pessoas envolvidas adicionadas com sucesso'
          );
        } catch (involvedError: any) {
          console.error(
            '❌ CreateTaskPage - Erro ao adicionar pessoas envolvidas:',
            involvedError
          );
          // Não bloquear a criação da negociação se houver erro ao adicionar envolvidos
          showError(
            'Negociação criada, mas houve erro ao adicionar pessoas envolvidas'
          );
        }
      }

      // Anexar arquivos se houver
      if (selectedFiles.length > 0 && newTask?.id) {
        try {
          await kanbanApi.uploadTaskAttachments(newTask.id, selectedFiles);
          console.log('✅ CreateTaskPage - Arquivos anexados com sucesso');
        } catch (uploadError: any) {
          console.error(
            '❌ CreateTaskPage - Erro ao anexar arquivos:',
            uploadError
          );
          // Não bloquear a criação da negociação se houver erro ao anexar arquivos
          showError('Negociação criada, mas houve erro ao anexar arquivos');
        }
      }

      setSubmitSuccess(true);
      showSuccess('Negociação criada com sucesso!');

      // Redirecionar imediatamente para o kanban
      // Priorizar projectId da URL, depois do formData, depois do estado salvo
      const redirectProjectId = projectId || formData.projectId;
      const redirectTeamId = teamId;
      const redirectWorkspace =
        workspaceType || (isPersonalWorkspace ? 'personal' : undefined);

      // Usar função utilitária para construir URL do Kanban
      // Ela já trata de recuperar estado salvo se necessário
      const kanbanUrl = buildKanbanUrl({
        projectId: redirectProjectId || undefined,
        teamId: redirectTeamId || undefined,
        workspace: redirectWorkspace || undefined,
      });

      navigate(kanbanUrl);
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Erro ao criar negociação. Tente novamente.',
      });
      showError(error.message || 'Erro ao criar negociação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | string[] | null
  ) => {
    setFormData(prev => {
      const newData: typeof prev = {
        ...prev,
        [field]: value as any, // Type assertion necessário para campos dinâmicos
      };

      // Se o projeto mudou, limpar o responsável selecionado (exceto se for projeto pessoal)
      if (field === 'projectId' && typeof value === 'string') {
        const newProject = projects.find(p => p.id === value);
        const isNewProjectPersonal = newProject?.isPersonal === true;
        // Só limpar se não for projeto pessoal
        if (!isNewProjectPersonal) {
          newData.assignedToId = '';
        }
      }

      // Se o responsável mudou, remover ele da lista de envolvidos se estiver lá
      if (field === 'assignedToId' && typeof value === 'string') {
        newData.involvedUserIds = prev.involvedUserIds.filter(
          id => id !== value
        );
      }

      return newData;
    });

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleBack = () => {
    // Garantir que o estado atual seja salvo antes de navegar
    // Isso garante que o KanbanPage possa usar esse estado se necessário
    const currentProjectId = projectId || formData.projectId;
    const currentTeamId = teamId;
    const currentWorkspace =
      workspaceType || (isPersonalWorkspace ? 'personal' : undefined);

    // Salvar estado atual antes de navegar
    if (currentProjectId || currentTeamId || currentWorkspace) {
      saveKanbanState({
        projectId: currentProjectId || null,
        teamId: currentTeamId || null,
        workspace: currentWorkspace || null,
        userId: currentUser?.id || undefined,
      });
    }

    // SEMPRE usar buildKanbanUrl que já recupera o estado salvo do localStorage
    // Isso garante que sempre voltemos para o Kanban, nunca para seleção de projeto
    const kanbanUrl = buildKanbanUrl({
      // Priorizar projectId da URL, depois formData, depois undefined (buildKanbanUrl usa estado salvo)
      projectId: currentProjectId || undefined,
      teamId: currentTeamId || undefined,
      workspace: currentWorkspace || undefined,
    });

    // Navegar SEMPRE para o Kanban, mesmo sem projectId
    // O buildKanbanUrl já garante que retorna /kanban (nunca /project-selection)
    // E o KanbanPage agora verifica estado salvo antes de redirecionar
    navigate(kanbanUrl);
  };

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>Nova Negociação</SimpleTitle>
            <SimpleSubtitle>
              Preencha os dados para criar uma nova negociação
            </SimpleSubtitle>
          </div>
          <SimpleBackButton onClick={handleBack} type='button'>
            <MdArrowBack size={20} />
            Voltar
          </SimpleBackButton>
        </SimpleHeader>

        <SimpleFormGrid as='form' onSubmit={handleSubmit}>
          <FieldContainer>
            <FieldLabel>
              Título <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Input
              type='text'
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder='Digite o título da negociação'
              $hasError={!!errors.title}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Descrição</FieldLabel>
            <TextArea
              value={formData.description}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  handleInputChange('description', e.target.value);
                }
              }}
              placeholder='Descreva os detalhes da negociação (máx. 300 caracteres)'
              maxLength={300}
              $hasError={!!errors.description}
            />
            {errors.description && (
              <ErrorMessage>{errors.description}</ErrorMessage>
            )}
          </FieldContainer>

          <ResponsiveRow>
            <FieldContainer>
              <FieldLabel>Prioridade</FieldLabel>
              <Select
                value={formData.priority}
                onChange={e => handleInputChange('priority', e.target.value)}
                $hasError={!!errors.priority}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <PriorityBadge $priority={formData.priority}>
                {
                  priorityOptions.find(p => p.value === formData.priority)
                    ?.label
                }
              </PriorityBadge>
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>Data de Vencimento</FieldLabel>
              <Input
                type='date'
                min={new Date().toISOString().split('T')[0]}
                value={formData.dueDate}
                onChange={e => handleInputChange('dueDate', e.target.value)}
                $hasError={!!errors.dueDate}
              />
              {errors.dueDate && <ErrorMessage>{errors.dueDate}</ErrorMessage>}
            </FieldContainer>

            <FieldContainer>
              <FieldLabel>Valor da Negociação (R$)</FieldLabel>
              <Input
                type='text'
                value={totalValueDisplay}
                onChange={e => {
                  const inputValue = e.target.value;
                  // Remove tudo que não é dígito
                  const rawValue = inputValue.replace(/\D/g, '');

                  if (rawValue === '') {
                    setTotalValueDisplay('');
                    return;
                  }

                  // Formatar manualmente
                  let formatted = rawValue;

                  // Adicionar vírgula para centavos (últimos 2 dígitos)
                  if (formatted.length > 2) {
                    const integerPart = formatted.slice(0, -2);
                    const decimalPart = formatted.slice(-2);
                    formatted = integerPart + ',' + decimalPart;
                  } else if (formatted.length === 2) {
                    formatted = '0,' + formatted;
                  } else if (formatted.length === 1) {
                    formatted = '0,0' + formatted;
                  }

                  // Adicionar pontos para separar milhares apenas na parte inteira
                  const parts = formatted.split(',');
                  if (parts[0] && parts[0].length > 3) {
                    // Remove zeros à esquerda antes de formatar
                    const cleanInteger = parts[0].replace(/^0+/, '') || '0';
                    parts[0] = cleanInteger.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      '.'
                    );
                    formatted = parts.join(',');
                  } else if (
                    parts[0] &&
                    parts[0].startsWith('0') &&
                    parts[0].length > 1
                  ) {
                    // Remove zeros à esquerda
                    parts[0] = parts[0].replace(/^0+/, '') || '0';
                    formatted = parts.join(',');
                  }

                  setTotalValueDisplay(formatted);
                }}
                onKeyDown={e => {
                  // Permitir apenas números e teclas de controle
                  const allowedKeys = [
                    'Backspace',
                    'Delete',
                    'Tab',
                    'Enter',
                    'Escape',
                    'Home',
                    'End',
                    'ArrowLeft',
                    'ArrowRight',
                    'ArrowUp',
                    'ArrowDown',
                  ];

                  if (allowedKeys.includes(e.key)) {
                    return;
                  }

                  // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                  if (
                    e.ctrlKey &&
                    ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())
                  ) {
                    return;
                  }

                  // Bloquear qualquer outro caractere que não seja número
                  if (!/\d/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder='R$ 0,00'
                $hasError={!!errors.totalValue}
                maxLength={20}
              />
              {errors.totalValue && (
                <ErrorMessage>{errors.totalValue}</ErrorMessage>
              )}
              <small
                style={{
                  fontSize: '0.875rem',
                  color: 'inherit',
                  opacity: 0.7,
                  marginTop: '4px',
                }}
              >
                Opcional - Valor total da negociação
              </small>
            </FieldContainer>
          </ResponsiveRow>

          {!isPersonalWorkspace && (
            <ResponsiveRow>
              <FieldContainer>
                <FieldLabel>Responsável</FieldLabel>
                <Select
                  value={formData.assignedToId}
                  onChange={e =>
                    handleInputChange('assignedToId', e.target.value)
                  }
                  $hasError={!!errors.assignedToId}
                  disabled={loadingUsers}
                >
                  <option value=''>
                    {loadingUsers
                      ? 'Carregando...'
                      : 'Selecionar responsável...'}
                  </option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                {errors.assignedToId && (
                  <ErrorMessage>{errors.assignedToId}</ErrorMessage>
                )}
              </FieldContainer>

              {!projectId && (
                <FieldContainer>
                  <FieldLabel>
                    Projeto <RequiredMark>*</RequiredMark>
                  </FieldLabel>
                  <Select
                    value={formData.projectId}
                    onChange={e =>
                      handleInputChange('projectId', e.target.value)
                    }
                    $hasError={!!errors.projectId}
                  >
                    <option value=''>Selecionar projeto...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                  {errors.projectId && (
                    <ErrorMessage>{errors.projectId}</ErrorMessage>
                  )}
                </FieldContainer>
              )}
            </ResponsiveRow>
          )}

          {/* Seleção de Cliente e Imóvel - apenas se houver projeto */}
          {(() => {
            const currentProjectId = projectId || formData.projectId;
            if (!currentProjectId) return null;

            return (
              <ResponsiveRow>
                <FieldContainer>
                  <FieldLabel>Cliente</FieldLabel>
                  <ClientSelect
                    projectId={currentProjectId}
                    value={formData.clientId}
                    onChange={clientId =>
                      handleInputChange('clientId', clientId)
                    }
                    placeholder='Selecione um cliente (opcional)'
                  />
                  <small
                    style={{
                      fontSize: '0.875rem',
                      color: 'inherit',
                      opacity: 0.7,
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
                    Opcional - Cliente relacionado à negociação
                  </small>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Imóvel</FieldLabel>
                  <PropertySelect
                    projectId={currentProjectId}
                    value={formData.propertyId}
                    onChange={propertyId =>
                      handleInputChange('propertyId', propertyId)
                    }
                    placeholder='Selecione um imóvel (opcional)'
                  />
                  <small
                    style={{
                      fontSize: '0.875rem',
                      color: 'inherit',
                      opacity: 0.7,
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
                    Opcional - Imóvel relacionado à negociação
                  </small>
                </FieldContainer>
              </ResponsiveRow>
            );
          })()}

          <FieldContainer>
            <FieldLabel>Pessoas Envolvidas</FieldLabel>
            <UserMultiSelect
              selectedUserIds={formData.involvedUserIds.filter(
                id => id !== formData.assignedToId
              )}
              onSelect={userId => {
                // Não permitir selecionar o responsável
                if (userId !== formData.assignedToId) {
                  handleInputChange('involvedUserIds', [
                    ...formData.involvedUserIds.filter(
                      id => id !== formData.assignedToId
                    ),
                    userId,
                  ]);
                }
              }}
              onRemove={userId => {
                handleInputChange(
                  'involvedUserIds',
                  formData.involvedUserIds.filter(id => id !== userId)
                );
              }}
              excludeUserIds={
                formData.assignedToId ? [formData.assignedToId] : []
              }
              maxSelections={50}
            />
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Anexos (Opcional)</FieldLabel>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                <Button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || selectedFiles.length >= 10}
                  $variant='secondary'
                >
                  <MdCloudUpload size={18} />
                  Selecionar Arquivos
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    const validFiles = files.filter(file => {
                      if (file.size > 5 * 1024 * 1024) {
                        showError(`Arquivo ${file.name} excede 5MB`);
                        return false;
                      }
                      return true;
                    });
                    if (selectedFiles.length + validFiles.length > 10) {
                      showError('Máximo de 10 arquivos permitidos');
                      setSelectedFiles(prev =>
                        prev
                          .slice(0, 10 - validFiles.length)
                          .concat(validFiles.slice(0, 10 - prev.length))
                      );
                    } else {
                      setSelectedFiles(prev => [...prev, ...validFiles]);
                    }
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                />
                {selectedFiles.length > 0 && (
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'inherit',
                      opacity: 0.7,
                    }}
                  >
                    {selectedFiles.length} arquivo(s) selecionado(s)
                  </span>
                )}
              </div>
              {selectedFiles.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginTop: '8px',
                  }}
                >
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--background-secondary, #f5f5f5)',
                        borderRadius: '8px',
                        border: '1px solid var(--border, #e0e0e0)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <MdAttachFile size={18} />
                        <span
                          style={{
                            fontSize: '0.875rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'inherit',
                            opacity: 0.7,
                          }}
                        >
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type='button'
                        onClick={() =>
                          setSelectedFiles(prev =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--error, #ef4444)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <small
              style={{
                fontSize: '0.875rem',
                color: 'inherit',
                opacity: 0.7,
                marginTop: '4px',
                display: 'block',
              }}
            >
              Máximo de 10 arquivos, 5MB cada. Os arquivos serão anexados após
              criar a negociação.
            </small>
          </FieldContainer>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          {submitSuccess && (
            <SuccessMessage>
              <MdCheck size={16} />
              Negociação criada com sucesso! Redirecionando...
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
                <>
                  <LoadingSpinner />
                  Criando...
                </>
              ) : (
                <>
                  <MdCheck size={18} />
                  Criar Negociação
                </>
              )}
            </Button>
          </ButtonsRow>
        </SimpleFormGrid>
      </SimplePageContainer>
    </Layout>
  );
};

export default CreateTaskPage;
