import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdArrowDropDown,
  MdClose,
} from 'react-icons/md';
import { useProjects } from '../../hooks/useProjects';
import { useTeams } from '../../hooks/useTeams';
import { usePersonalWorkspace } from '../../hooks/usePersonalWorkspace';
import type { KanbanProject } from '../../types/kanban';
import { saveKanbanState } from '../../utils/kanbanState';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SelectButton = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: 'Poppins', sans-serif;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
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

const SelectedCount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.primary}20;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
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
  border-bottom: 2px solid ${props => props.theme.colors.border};
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

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 20px;
  flex-shrink: 0;
`;

const OptionInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OptionName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const OptionTeam = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SelectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const RemoveTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

interface ProjectMultiSelectProps {
  selectedProjectIds: string[];
  onSelectionChange: (projectIds: string[]) => void;
  onProjectEnter?: (projectId: string, teamId?: string) => void;
}

export const ProjectMultiSelect: React.FC<ProjectMultiSelectProps> = ({
  selectedProjectIds,
  onSelectionChange,
  onProjectEnter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { teams } = useTeams();
  const { workspace: personalWorkspace } = usePersonalWorkspace();

  // Carregar projetos de todas as equipes
  const [allProjects, setAllProjects] = useState<KanbanProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar todos os projetos
  useEffect(() => {
    const loadAllProjects = async () => {
      setLoading(true);
      try {
        const { projectsApi } = await import('../../services/projectsApi');
        const projectsPromises = teams.map(team =>
          projectsApi.getProjectsByTeam(team.id).catch(() => [])
        );

        // Adicionar workspace pessoal se existir
        if (personalWorkspace) {
          projectsPromises.push(Promise.resolve([personalWorkspace]));
        }

        const results = await Promise.all(projectsPromises);
        const flattened = results.flat();
        setAllProjects(flattened);
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teams.length > 0 || personalWorkspace) {
      loadAllProjects();
    }
  }, [teams, personalWorkspace]);

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

  // Filtrar projetos baseado na busca
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch =
      !searchTerm ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Obter nome da equipe do projeto
  const getTeamName = (project: KanbanProject): string => {
    if (project.isPersonal) {
      return 'Workspace Pessoal';
    }
    const team = teams.find(t => t.id === project.teamId);
    return team?.name || 'Equipe desconhecida';
  };

  // Alternar seleção de projeto
  const toggleProject = (projectId: string) => {
    const isSelected = selectedProjectIds.includes(projectId);
    let newSelection: string[];

    if (isSelected) {
      newSelection = selectedProjectIds.filter(id => id !== projectId);
    } else {
      newSelection = [...selectedProjectIds, projectId];
    }

    onSelectionChange(newSelection);

    // Se foi selecionado e há callback, chamar
    if (!isSelected && onProjectEnter) {
      const project = allProjects.find(p => p.id === projectId);
      if (project) {
        // Salvar estado do kanban
        saveKanbanState({
          projectId: project.id,
          teamId: project.teamId || undefined,
          workspace: project.isPersonal ? 'personal' : undefined,
        });

        onProjectEnter(project.id, project.teamId);
      }
    }
  };

  // Remover projeto selecionado
  const removeProject = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectionChange(selectedProjectIds.filter(id => id !== projectId));
  };

  // Obter projetos selecionados
  const selectedProjects = allProjects.filter(p =>
    selectedProjectIds.includes(p.id)
  );

  // Definir workspace pessoal como padrão se não houver seleção
  useEffect(() => {
    if (personalWorkspace && selectedProjectIds.length === 0) {
      onSelectionChange([personalWorkspace.id]);
      if (onProjectEnter) {
        saveKanbanState({
          projectId: personalWorkspace.id,
          teamId: personalWorkspace.teamId || undefined,
          workspace: 'personal',
        });
        onProjectEnter(personalWorkspace.id, personalWorkspace.teamId);
      }
    }
  }, [
    personalWorkspace,
    selectedProjectIds.length,
    onSelectionChange,
    onProjectEnter,
  ]);

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        <span>
          {selectedProjects.length === 0
            ? 'Selecionar projetos...'
            : selectedProjects.length === 1
              ? selectedProjects[0].name
              : `${selectedProjects.length} projetos selecionados`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selectedProjects.length > 0 && (
            <SelectedCount>{selectedProjects.length}</SelectedCount>
          )}
          <MdArrowDropDown size={20} />
        </div>
      </SelectButton>

      {selectedProjects.length > 0 && (
        <SelectedTags>
          {selectedProjects.map(project => (
            <Tag key={project.id}>
              <span>{project.name}</span>
              <RemoveTagButton
                type='button'
                onClick={e => removeProject(project.id, e)}
                title='Remover projeto'
              >
                <MdClose size={16} />
              </RemoveTagButton>
            </Tag>
          ))}
        </SelectedTags>
      )}

      <Dropdown $isOpen={isOpen}>
        <SearchInput
          type='text'
          placeholder='Buscar projetos...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onClick={e => e.stopPropagation()}
        />
        <OptionsList>
          {loading ? (
            <EmptyState>Carregando projetos...</EmptyState>
          ) : filteredProjects.length === 0 ? (
            <EmptyState>
              {searchTerm
                ? 'Nenhum projeto encontrado'
                : 'Nenhum projeto disponível'}
            </EmptyState>
          ) : (
            filteredProjects.map(project => {
              const isSelected = selectedProjectIds.includes(project.id);
              return (
                <OptionItem
                  key={project.id}
                  $isSelected={isSelected}
                  onClick={() => toggleProject(project.id)}
                >
                  <Checkbox>
                    {isSelected ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                  </Checkbox>
                  <OptionInfo>
                    <OptionName>{project.name}</OptionName>
                    <OptionTeam>{getTeamName(project)}</OptionTeam>
                  </OptionInfo>
                </OptionItem>
              );
            })
          )}
        </OptionsList>
      </Dropdown>
    </SelectContainer>
  );
};
