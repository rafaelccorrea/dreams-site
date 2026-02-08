import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdAdd, MdFolder, MdCheck, MdHistory } from 'react-icons/md';
import { useProjects } from '../../hooks/useProjects';
// import { useTeams } from '../../hooks/useTeams';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { ConfirmFinalizeProjectModal } from '../modals/ConfirmFinalizeProjectModal';
import { ProjectHistory } from './ProjectHistory';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
// import type { KanbanProject } from '../../types/kanban';

const ProjectSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const ProjectSelectorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ProjectSelectorTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProjectDropdown = styled.select`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const ProjectOption = styled.option`
  padding: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 6px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProjectStatus = styled.span<{ status: string }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'active':
        return `${props.theme.colors.primary}20`;
      case 'completed':
        return '#10B98120';
      case 'archived':
        return '#6B728020';
      case 'cancelled':
        return '#EF444420';
      default:
        return props.theme.colors.border;
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active':
        return props.theme.colors.primary;
      case 'completed':
        return '#10B981';
      case 'archived':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

const CreateProjectButton = styled.button`
  background: transparent;
  border: 1px dashed ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  background: ${props =>
    props.variant === 'danger' ? '#EF4444' : props.theme.colors.primary};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.variant === 'danger' ? '#DC2626' : props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

interface ProjectSelectorProps {
  selectedProjectId?: string;
  onProjectChange: (projectId: string | null) => void;
  teamId: string;
  disabled?: boolean;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProjectId,
  onProjectChange,
  teamId,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const { projects, loading, finalizeProject } = useProjects(teamId);
  // const { selectedTeam } = useTeams();
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Verificar se o usuário tem permissão para criar projetos
  const canCreateProject = hasPermission('kanban:project:create');

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    onProjectChange(projectId === '' ? null : projectId);
  };

  const handleFinalizeProject = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmFinalize = async () => {
    if (!selectedProject) return;

    try {
      setIsFinalizing(true);
      await finalizeProject(selectedProject.id);
      setIsConfirmModalOpen(false);

      // Limpar seleção de projeto e redirecionar para histórico
      onProjectChange(null);

      // Redirecionar para a tela de histórico de projetos
      setShowHistory(true);
    } catch (error) {
      console.error('Erro ao finalizar projeto:', error);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleProjectCreated = (projectId: string) => {
    // Selecionar o projeto recém-criado
    onProjectChange(projectId);
    setIsCreateModalOpen(false);
  };

  if (loading) {
    return (
      <ProjectSelectorContainer>
        <ProjectSelectorTitle>
          <MdFolder size={16} />
          Funil
        </ProjectSelectorTitle>
        <ProjectDropdown disabled>
          <ProjectOption>Carregando...</ProjectOption>
        </ProjectDropdown>
      </ProjectSelectorContainer>
    );
  }

  return (
    <ProjectSelectorContainer>
      <ProjectSelectorHeader>
        <ProjectSelectorTitle>
          <MdFolder size={16} />
          Funil
        </ProjectSelectorTitle>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {selectedProject && (
            <ProjectStatus status={selectedProject.status}>
              {selectedProject.status === 'active' && 'Ativo'}
              {selectedProject.status === 'completed' && 'Concluído'}
              {selectedProject.status === 'archived' && 'Arquivado'}
              {selectedProject.status === 'cancelled' && 'Cancelado'}
            </ProjectStatus>
          )}
          <ActionButton
            variant='secondary'
            onClick={() => navigate(`/projects-history/${teamId}`)}
            title='Ver histórico de funis'
          >
            <MdHistory size={14} />
            Histórico
          </ActionButton>
        </div>
      </ProjectSelectorHeader>

      <ProjectDropdown
        value={selectedProjectId || ''}
        onChange={handleProjectChange}
        disabled={disabled}
      >
        <ProjectOption value=''>Sem projeto</ProjectOption>
        {projects
          .filter(project => project.status === 'active')
          .map(project => (
            <ProjectOption key={project.id} value={project.id}>
              {project.name} ({project.taskCount} tarefas)
            </ProjectOption>
          ))}
      </ProjectDropdown>

      {selectedProject && (
        <ProjectInfo>
          <span>
            <strong>{selectedProject.name}</strong>
          </span>
          {selectedProject.description && (
            <span>• {selectedProject.description}</span>
          )}
          {selectedProject.dueDate && (
            <span>
              • Vence em{' '}
              {new Date(selectedProject.dueDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </ProjectInfo>
      )}

      <ProjectActions>
        <CreateProjectButton
          onClick={handleCreateProject}
          disabled={!canCreateProject}
          title={
            !canCreateProject
              ? 'Você não tem permissão para criar funis'
              : 'Criar novo funil'
          }
        >
          <MdAdd size={14} />
          Novo Funil
        </CreateProjectButton>

        {selectedProject && selectedProject.status === 'active' && (
          <ActionButton onClick={handleFinalizeProject} disabled={isFinalizing}>
            <MdCheck size={14} />
            {isFinalizing ? 'Finalizando...' : 'Finalizar'}
          </ActionButton>
        )}
      </ProjectActions>

      {/* Modal de criação de funil */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        teamId={teamId}
        onProjectCreated={handleProjectCreated}
      />

      {/* Modal de confirmação de finalização */}
      <ConfirmFinalizeProjectModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmFinalize}
        project={selectedProject || null}
        isFinalizing={isFinalizing}
      />

      {/* Tela de histórico de funis */}
      {showHistory && (
        <ProjectHistory teamId={teamId} onBack={() => setShowHistory(false)} />
      )}
    </ProjectSelectorContainer>
  );
};

export default ProjectSelector;
