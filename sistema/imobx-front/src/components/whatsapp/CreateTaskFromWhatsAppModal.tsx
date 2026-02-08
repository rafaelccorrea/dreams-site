import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MdClose, MdCheckCircle, MdLock, MdWarning } from 'react-icons/md';
import { whatsappApi } from '../../services/whatsappApi';
import { projectsApi } from '../../services/projectsApi';
import { kanbanApi } from '../../services/kanbanApi';
import { showSuccess, showError, showWarning } from '../../utils/notifications';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import type { KanbanProject, KanbanColumn } from '../../types/kanban';
import type { CreateTaskFromMessageRequest } from '../../types/whatsapp';
import {
  ModernModalOverlay,
  ModernModalContainer,
  ModernModalHeader,
  ModernModalHeaderContent,
  ModernModalCloseButton,
  ModernModalContent,
  ModernFormGroup,
  ModernFormLabel,
  ModernFormInput,
  ModernFormSelect,
  ModernButton,
  ModernLoadingSpinner,
} from '../../styles/components/ModernModalStyles';

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const PermissionDeniedMessage = styled.div`
  padding: 40px 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const StyledButton = styled(ModernButton)<{
  $variant?: 'primary' | 'secondary';
}>`
  min-width: 120px;

  ${props =>
    props.$variant === 'secondary' &&
    `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    
    &:hover {
      background: ${props.theme.colors.border};
    }
  `}
`;

const WarningMessage = styled.div`
  padding: 12px 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const InfoMessage = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme.colors.primary}10;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  margin-top: 8px;
`;

interface CreateTaskFromWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  onSuccess?: (taskId: string, teamId?: string) => void;
}

export const CreateTaskFromWhatsAppModal: React.FC<
  CreateTaskFromWhatsAppModalProps
> = ({ isOpen, onClose, messageId, onSuccess }) => {
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [defaultProjectId, setDefaultProjectId] = useState<string | null>(null);
  const [userInProject, setUserInProject] = useState<boolean | null>(null);
  const [projectWarning, setProjectWarning] = useState<string | null>(null);
  const [checkingUser, setCheckingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingColumns, setLoadingColumns] = useState(false);

  // Verificar permissão de criação de tarefa
  const canCreateTask =
    permissionsContext?.hasPermission('whatsapp:create_task') ?? false;

  useEffect(() => {
    if (isOpen) {
      loadConfigAndProjects();
      setSelectedProjectId('');
      setSelectedColumnId('');
      setColumns([]);
      setUserInProject(null);
      setProjectWarning(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProjectId) {
      loadColumns(selectedProjectId);
      checkUserInProject(selectedProjectId);
    } else {
      setColumns([]);
      setSelectedColumnId('');
      setUserInProject(null);
      setProjectWarning(null);
    }
  }, [selectedProjectId]);

  const loadConfigAndProjects = async () => {
    setLoadingProjects(true);
    try {
      // Carregar configuração do WhatsApp para obter projeto padrão
      try {
        const config = await whatsappApi.getConfig();
        if (config.defaultProjectId) {
          setDefaultProjectId(config.defaultProjectId);
          // Selecionar projeto padrão automaticamente
          setSelectedProjectId(config.defaultProjectId);
        }
      } catch (error) {
        console.warn('Erro ao carregar configuração do WhatsApp:', error);
      }

      // Buscar projetos da equipe atual
      const teamId = localStorage.getItem('selectedTeamId') || '';
      let allProjects: KanbanProject[] = [];

      if (teamId) {
        try {
          const teamProjects = await projectsApi.getProjectsByTeam(teamId);
          allProjects = teamProjects;
        } catch (error) {
          console.warn('Erro ao buscar projetos da equipe:', error);
        }
      }

      // Se não encontrou, buscar todos com filtros
      if (allProjects.length === 0) {
        try {
          const response = await projectsApi.getFilteredProjects({
            limit: '100',
            status: 'active',
          });
          allProjects = response.data || [];
        } catch (error) {
          console.error('Erro ao buscar projetos filtrados:', error);
        }
      }

      setProjects(allProjects);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
      showError('Erro ao carregar projetos');
    } finally {
      setLoadingProjects(false);
    }
  };

  const checkUserInProject = async (projectId: string) => {
    setCheckingUser(true);
    setUserInProject(null);
    setProjectWarning(null);

    try {
      const checkResult = await whatsappApi.checkUserInProject(projectId);
      setUserInProject(checkResult.isUserInProject);

      if (!checkResult.isUserInProject) {
        setProjectWarning(
          `Você não está vinculado ao projeto "${checkResult.projectName}". ` +
            `A tarefa será criada sem responsável. Entre em contato com um administrador para ser adicionado ao projeto.`
        );
      }
    } catch (error: any) {
      console.error('Erro ao verificar usuário no projeto:', error);
      // Não bloquear criação se a verificação falhar
      setUserInProject(null);
    } finally {
      setCheckingUser(false);
    }
  };

  const loadColumns = async (projectId: string) => {
    setLoadingColumns(true);
    try {
      // Buscar colunas do projeto
      const teamId = localStorage.getItem('selectedTeamId') || '';
      const board = await kanbanApi.getBoard(teamId, { projectId });
      setColumns(board.columns || []);

      // Selecionar primeira coluna automaticamente se houver
      if (board.columns && board.columns.length > 0 && !selectedColumnId) {
        setSelectedColumnId(board.columns[0].id);
      }
    } catch (error: any) {
      console.error('Erro ao carregar colunas:', error);
      showError('Erro ao carregar colunas do projeto');
      setColumns([]);
    } finally {
      setLoadingColumns(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedColumnId) {
      showError('Selecione uma coluna');
      return;
    }

    // projectId é opcional - se não fornecido, usa projeto padrão
    const projectIdToUse = selectedProjectId || defaultProjectId;

    if (!projectIdToUse) {
      showError(
        'Configure um projeto padrão nas configurações do WhatsApp ou selecione um projeto'
      );
      return;
    }

    // Verificar permissão antes de chamar API
    const canCreateTask =
      permissionsContext?.hasPermission('whatsapp:create_task') ?? false;
    if (!canCreateTask) {
      showError(
        'Você não tem permissão para criar tarefas a partir de mensagens WhatsApp.'
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data: CreateTaskFromMessageRequest = {
        projectId: projectIdToUse, // Opcional - se não fornecido, backend usa projeto padrão
        columnId: selectedColumnId,
      };

      const response = await whatsappApi.createTaskFromMessage(messageId, data);

      // Exibir aviso se usuário não estiver no projeto
      if (response.warning) {
        showWarning(response.warning);
      } else {
        showSuccess('Tarefa criada com sucesso!');
      }

      // Navegar para o Kanban usando teamId e projectId da resposta
      if (response.teamId && response.projectId) {
        navigate(
          `/kanban?teamId=${response.teamId}&projectId=${response.projectId}`
        );
      }

      onSuccess?.(response.taskId, response.teamId);
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      if (error.response?.status === 403) {
        showError('Você não tem permissão para realizar esta ação.');
      } else if (error.response?.status === 400) {
        // Erro pode ser: sem projeto padrão, tarefa duplicada, etc.
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Erro ao criar tarefa';
        showError(errorMessage);
      } else {
        showError(error.message || 'Erro ao criar tarefa');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Verificar permissão antes de renderizar
  if (!canCreateTask) {
    return (
      <ModernModalOverlay $isOpen={isOpen} onClick={onClose}>
        <ModernModalContainer
          $isOpen={isOpen}
          onClick={e => e.stopPropagation()}
        >
          <ModernModalHeader>
            <ModernModalHeaderContent>
              <ModalTitle>
                Criar Tarefa a Partir de Mensagem WhatsApp
              </ModalTitle>
              <ModernModalCloseButton onClick={onClose}>
                <MdClose />
              </ModernModalCloseButton>
            </ModernModalHeaderContent>
          </ModernModalHeader>
          <ModernModalContent>
            <PermissionDeniedMessage>
              <MdLock
                size={48}
                style={{ marginBottom: '16px', opacity: 0.5 }}
              />
              <h3 style={{ margin: '0 0 8px 0', color: '#EF4444' }}>
                Acesso Negado
              </h3>
              <p style={{ margin: 0, color: '#666' }}>
                Você não tem permissão para acessar esta funcionalidade.
                <br />
                Entre em contato com o administrador do sistema para solicitar
                acesso.
              </p>
            </PermissionDeniedMessage>
          </ModernModalContent>
        </ModernModalContainer>
      </ModernModalOverlay>
    );
  }

  return (
    <ModernModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModernModalContainer $isOpen={isOpen} onClick={e => e.stopPropagation()}>
        <ModernModalHeader>
          <ModernModalHeaderContent>
            <ModalTitle>Criar Tarefa a Partir de Mensagem WhatsApp</ModalTitle>
            <ModernModalCloseButton onClick={onClose} disabled={loading}>
              <MdClose />
            </ModernModalCloseButton>
          </ModernModalHeaderContent>
        </ModernModalHeader>

        <ModernModalContent>
          <form onSubmit={handleSubmit}>
            <FormContainer>
              <ModernFormGroup>
                <ModernFormLabel>
                  Projeto{' '}
                  {defaultProjectId ? (
                    '(opcional - padrão será usado se não selecionar)'
                  ) : (
                    <span style={{ color: 'red' }}>*</span>
                  )}
                </ModernFormLabel>
                <ModernFormSelect
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  required={!defaultProjectId}
                  disabled={loading || loadingProjects}
                >
                  <option value=''>
                    {defaultProjectId
                      ? 'Usar projeto padrão'
                      : 'Selecione um projeto'}
                  </option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                      {project.id === defaultProjectId && ' (Padrão)'}
                    </option>
                  ))}
                </ModernFormSelect>
                {loadingProjects && (
                  <div style={{ marginTop: '8px', color: '#666' }}>
                    Carregando projetos...
                  </div>
                )}
                {defaultProjectId && !selectedProjectId && (
                  <InfoMessage>
                    O projeto padrão configurado será usado automaticamente.
                  </InfoMessage>
                )}
                {projectWarning && (
                  <WarningMessage>
                    <MdWarning size={18} />
                    <span>{projectWarning}</span>
                  </WarningMessage>
                )}
                {checkingUser && (
                  <div
                    style={{
                      marginTop: '8px',
                      color: '#666',
                      fontSize: '0.875rem',
                    }}
                  >
                    Verificando acesso ao projeto...
                  </div>
                )}
              </ModernFormGroup>

              <ModernFormGroup>
                <ModernFormLabel>
                  Coluna <span style={{ color: 'red' }}>*</span>
                </ModernFormLabel>
                <ModernFormSelect
                  value={selectedColumnId}
                  onChange={e => setSelectedColumnId(e.target.value)}
                  required
                  disabled={loading || loadingColumns || !selectedProjectId}
                >
                  <option value=''>Selecione uma coluna</option>
                  {columns.map(column => (
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  ))}
                </ModernFormSelect>
                {loadingColumns && (
                  <div style={{ marginTop: '8px', color: '#666' }}>
                    Carregando colunas...
                  </div>
                )}
                {!selectedProjectId && (
                  <div style={{ marginTop: '8px', color: '#666' }}>
                    Selecione um projeto primeiro
                  </div>
                )}
              </ModernFormGroup>
            </FormContainer>

            <FooterActions>
              <StyledButton
                type='button'
                $variant='secondary'
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </StyledButton>
              <StyledButton
                type='submit'
                $variant='primary'
                disabled={
                  loading ||
                  !selectedColumnId ||
                  (!selectedProjectId && !defaultProjectId)
                }
              >
                {loading ? (
                  <>
                    <ModernLoadingSpinner
                      style={{
                        width: '16px',
                        height: '16px',
                        borderWidth: '2px',
                      }}
                    />
                    Criando...
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={18} />
                    Criar Tarefa
                  </>
                )}
              </StyledButton>
            </FooterActions>
          </form>
        </ModernModalContent>
      </ModernModalContainer>
    </ModernModalOverlay>
  );
};
