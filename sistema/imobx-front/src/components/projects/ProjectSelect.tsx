import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  MdArrowDropDown,
  MdFolder,
  MdHome,
  MdCheck,
  MdAdd,
} from 'react-icons/md';
import { useTeams } from '../../hooks/useTeams';
import { usePersonalWorkspace } from '../../hooks/usePersonalWorkspace';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import type { KanbanProject } from '../../types/kanban';
import { projectsApi } from '../../services/projectsApi';

const SelectContainer = styled.div`
  position: relative;
  min-width: 280px;
  max-width: 400px;
`;

const SelectButton = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  ${props =>
    props.$isOpen &&
    `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props.theme.colors.primary}20;
  `}
`;

const SelectText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProjectIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const DropdownIcon = styled.span<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: transform 0.2s ease;
  flex-shrink: 0;
  transform: ${props => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1.5px solid ${props => props.theme.colors.border};
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  font-family: 'Poppins', sans-serif;

  &:focus {
    outline: none;
    border-bottom-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const OptionsList = styled.div`
  padding: 8px;
`;

const OptionItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$isSelected ? `${props.theme.colors.primary}15` : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const OptionIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
  flex-shrink: 0;
`;

const OptionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const OptionName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OptionTeam = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CheckIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const SectionHeader = styled.div`
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CreateProjectButton = styled.button`
  width: calc(100% - 16px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 8px;
  border: 1.5px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    ${props => `${props.theme.colors.primary}08`} 0%,
    ${props => `${props.theme.colors.primary}05`} 100%
  );
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    background: linear-gradient(
      135deg,
      ${props => `${props.theme.colors.primary}15`} 0%,
      ${props => `${props.theme.colors.primary}10`} 100%
    );
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

interface ProjectSelectProps {
  selectedProjectId: string | null;
  onProjectChange: (projectId: string, teamId?: string) => void;
}

export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  selectedProjectId,
  onProjectChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeamForCreate, setSelectedTeamForCreate] = useState<
    string | null
  >(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { teams } = useTeams();
  const { workspace: personalWorkspace } = usePersonalWorkspace();
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission || (() => false);

  // Carregar funis de todas as equipes
  const [allProjects, setAllProjects] = useState<KanbanProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificar permissão para criar funis
  const canCreateProject = hasPermission('kanban:project:create');

  // Obter primeira equipe disponível para criar funil
  const getFirstAvailableTeam = () => {
    if (teams.length > 0) {
      return teams[0].id;
    }
    return null;
  };

  // Estabilizar dependências para evitar chamadas repetidas à API quando apenas
  // a referência de `teams` ou `personalWorkspace` muda (re-renders).
  const teamIdsKey = teams
    .map(t => t.id)
    .sort()
    .join(',');
  const personalWorkspaceId = personalWorkspace?.id ?? '';

  // Carregar todos os funis (apenas quando a lista de equipes ou workspace pessoal mudar de fato)
  useEffect(() => {
    const loadAllProjects = async () => {
      setLoading(true);
      try {
        const projectsPromises = teams.map(team =>
          projectsApi
            .getProjectsByTeam(team.id)
            .catch(() => [] as KanbanProject[])
        );

        // Adicionar workspace pessoal se existir
        if (personalWorkspace) {
          projectsPromises.push(
            Promise.resolve([personalWorkspace as KanbanProject])
          );
        }

        const results = await Promise.all(projectsPromises);
        const flattened = results.flat() as KanbanProject[];
        setAllProjects(flattened);
      } catch (error) {
        console.error('Erro ao carregar funis:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teams.length > 0 || personalWorkspace) {
      loadAllProjects();
    }
    // teamIdsKey e personalWorkspaceId estabilizam o efeito; teams/personalWorkspace vêm do closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamIdsKey, personalWorkspaceId]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filtrar funis baseado na busca
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch =
      !searchTerm ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Separar workspace pessoal dos outros funis
  const personalProject =
    personalWorkspace &&
    filteredProjects.find(p => p.id === personalWorkspace.id);
  const teamProjects = filteredProjects.filter(
    p => p.id !== personalWorkspace?.id
  );

  // Obter nome da equipe do funil
  const getTeamName = (project: KanbanProject): string => {
    if (project.isPersonal) {
      return 'Workspace Pessoal';
    }
    const team = teams.find(t => t.id === project.teamId);
    return team?.name || 'Equipe desconhecida';
  };

  // Obter funil selecionado
  const selectedProject = allProjects.find(p => p.id === selectedProjectId);

  // Selecionar funil
  const handleSelectProject = (project: KanbanProject) => {
    // Garantir que sempre passamos o teamId
    // Para workspace pessoal, usar o teamId do workspace pessoal
    // Para funis de equipes, usar o teamId do funil
    const teamIdToUse =
      project.teamId ||
      (project.isPersonal && personalWorkspace?.teamId) ||
      undefined;

    if (!teamIdToUse && !project.isPersonal) {
      console.warn('⚠️ Funil sem teamId:', project);
    }

    onProjectChange(project.id, teamIdToUse);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Abrir modal de criação de funil
  const handleCreateProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstTeam = getFirstAvailableTeam();
    if (firstTeam) {
      setSelectedTeamForCreate(firstTeam);
      setIsCreateModalOpen(true);
    }
  };

  // Quando funil for criado
  const handleProjectCreated = (newProject: KanbanProject) => {
    // Adicionar novo funil à lista
    setAllProjects(prev => [...prev, newProject]);

    // Selecionar o funil recém-criado
    const teamIdToUse = newProject.teamId || undefined;
    onProjectChange(newProject.id, teamIdToUse);

    setIsCreateModalOpen(false);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        <SelectText>
          {loading ? (
            <>Carregando...</>
          ) : selectedProject ? (
            <>
              <ProjectIcon>
                {selectedProject.isPersonal ? (
                  <MdHome size={18} />
                ) : (
                  <MdFolder size={18} />
                )}
              </ProjectIcon>
              <span>{selectedProject.name}</span>
            </>
          ) : (
            <>Selecione um funil...</>
          )}
        </SelectText>
        <DropdownIcon $isOpen={isOpen}>
          <MdArrowDropDown size={24} />
        </DropdownIcon>
      </SelectButton>

      <Dropdown $isOpen={isOpen}>
        <SearchInput
          type='text'
          placeholder='Buscar funis...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onClick={e => e.stopPropagation()}
        />
        <OptionsList>
          {loading ? (
            <EmptyState>Carregando funis...</EmptyState>
          ) : filteredProjects.length === 0 ? (
            <EmptyState>
              {searchTerm
                ? 'Nenhum funil encontrado'
                : 'Nenhum funil disponível'}
            </EmptyState>
          ) : (
            <>
              {personalProject && (
                <>
                  <SectionHeader>Workspace Pessoal</SectionHeader>
                  <OptionItem
                    $isSelected={selectedProjectId === personalProject.id}
                    onClick={() => handleSelectProject(personalProject)}
                  >
                    <OptionIcon>
                      <MdHome size={18} />
                    </OptionIcon>
                    <OptionInfo>
                      <OptionName>{personalProject.name}</OptionName>
                      <OptionTeam>Workspace Pessoal</OptionTeam>
                    </OptionInfo>
                    {selectedProjectId === personalProject.id && (
                      <CheckIcon>
                        <MdCheck size={18} />
                      </CheckIcon>
                    )}
                  </OptionItem>
                </>
              )}
              {teamProjects.length > 0 && (
                <>
                  <SectionHeader>Funis das Equipes</SectionHeader>
                  {teamProjects.map(project => {
                    const isSelected = selectedProjectId === project.id;
                    return (
                      <OptionItem
                        key={project.id}
                        $isSelected={isSelected}
                        onClick={() => handleSelectProject(project)}
                      >
                        <OptionIcon>
                          <MdFolder size={18} />
                        </OptionIcon>
                        <OptionInfo>
                          <OptionName>{project.name}</OptionName>
                          <OptionTeam>{getTeamName(project)}</OptionTeam>
                        </OptionInfo>
                        {isSelected && (
                          <CheckIcon>
                            <MdCheck size={18} />
                          </CheckIcon>
                        )}
                      </OptionItem>
                    );
                  })}
                </>
              )}

              {/* Botão para criar novo funil */}
              {canCreateProject && teams.length > 0 && (
                <CreateProjectButton
                  onClick={handleCreateProject}
                  disabled={!getFirstAvailableTeam()}
                  title={
                    !getFirstAvailableTeam()
                      ? 'Nenhuma equipe disponível'
                      : 'Criar novo funil'
                  }
                >
                  <MdAdd size={18} />
                  Criar Novo Funil
                </CreateProjectButton>
              )}
            </>
          )}
        </OptionsList>
      </Dropdown>

      {/* Modal de criação de funil */}
      {selectedTeamForCreate && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedTeamForCreate(null);
          }}
          teamId={selectedTeamForCreate}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </SelectContainer>
  );
};
