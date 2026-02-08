import React, { useMemo } from 'react';
import styled from 'styled-components';
import { MdPersonOff, MdClear } from 'react-icons/md';
import { Avatar } from '../common/Avatar';
import type { KanbanTask } from '../../types/kanban';

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0;
  overflow-x: auto;
  overflow-y: visible;
  box-shadow: none;
  -webkit-overflow-scrolling: touch;
  flex: 1;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 10px;
  }

  @media (max-width: 768px) {
    gap: 8px;

    &::-webkit-scrollbar {
      height: 3px;
    }
  }
`;

const FilterLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  margin-right: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-right: 6px;
  }
`;

const AvatarButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  background: transparent;
  border: 2px solid
    ${props => (props.$isActive ? props.theme.colors.primary : 'transparent')};
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: visible;
  box-sizing: border-box;

  & > * {
    display: block;
  }

  &:hover {
    transform: scale(1.05);
    border-color: ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    border-width: 2px;

    &:hover {
      transform: scale(1.03);
    }
  }
`;

const UnassignedButton = styled(AvatarButton)`
  width: 36px;
  height: 36px;
  background: ${props =>
    props.$isActive
      ? props.theme.colors.primary + '20'
      : props.theme.colors.border};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const TaskCount = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 8px;
  min-width: 16px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 0.55rem;
    padding: 1px 3px;
    min-width: 14px;
    bottom: -3px;
    right: -3px;
  }
`;

const ClearButton = styled.button`
  background: ${props => props.theme.colors.border};
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 7px 14px;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.7rem;
    gap: 4px;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding-bottom: 14;
  margin-bottom: -4px;
`;

interface AssigneeFilterProps {
  tasks: KanbanTask[];
  selectedAssigneeId: string | null;
  onAssigneeSelect: (assigneeId: string | null) => void;
}

export const AssigneeFilter: React.FC<AssigneeFilterProps> = ({
  tasks,
  selectedAssigneeId,
  onAssigneeSelect,
}) => {
  // Extrair responsáveis únicos com contagem de tarefas
  const assignees = useMemo(() => {
    const assigneeMap = new Map<
      string,
      {
        id: string;
        name: string;
        avatar?: string;
        count: number;
      }
    >();

    let unassignedCount = 0;

    tasks.forEach(task => {
      if (task.assignedTo) {
        const existing = assigneeMap.get(task.assignedTo.id);
        if (existing) {
          existing.count++;
        } else {
          assigneeMap.set(task.assignedTo.id, {
            id: task.assignedTo.id,
            name: task.assignedTo.name,
            avatar: task.assignedTo.avatar,
            count: 1,
          });
        }
      } else {
        unassignedCount++;
      }
    });

    return {
      assigned: Array.from(assigneeMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      unassignedCount,
    };
  }, [tasks]);

  const handleAssigneeClick = (assigneeId: string | null) => {
    // Se clicar no mesmo, desseleciona
    if (selectedAssigneeId === assigneeId) {
      onAssigneeSelect(null);
    } else {
      onAssigneeSelect(assigneeId);
    }
  };

  const handleClearFilter = () => {
    onAssigneeSelect(null);
  };

  // Se não há responsáveis, não mostrar filtro
  if (assignees.assigned.length === 0 && assignees.unassignedCount === 0) {
    return null;
  }

  // Determinar tamanho do avatar baseado na largura da tela
  const avatarSize =
    typeof window !== 'undefined' && window.innerWidth <= 768 ? 32 : 36;

  return (
    <FilterContainer>
      <FilterLabel>Equipe:</FilterLabel>

      {/* Cards sem responsável */}
      {assignees.unassignedCount > 0 && (
        <AvatarWrapper>
          <UnassignedButton
            $isActive={selectedAssigneeId === 'unassigned'}
            onClick={() => handleAssigneeClick('unassigned')}
            title={`${assignees.unassignedCount} tarefa(s) sem responsável`}
          >
            <MdPersonOff size={avatarSize === 32 ? 14 : 16} />
          </UnassignedButton>
          <TaskCount>{assignees.unassignedCount}</TaskCount>
        </AvatarWrapper>
      )}

      {/* Responsáveis */}
      {assignees.assigned.map(assignee => (
        <AvatarWrapper key={assignee.id}>
          <AvatarButton
            $isActive={selectedAssigneeId === assignee.id}
            onClick={() => handleAssigneeClick(assignee.id)}
            title={`${assignee.name} - ${assignee.count} tarefa(s)`}
          >
            <Avatar
              name={assignee.name}
              image={assignee.avatar}
              size={avatarSize}
            />
          </AvatarButton>
          <TaskCount>{assignee.count}</TaskCount>
        </AvatarWrapper>
      ))}

      {/* Botão de limpar filtro */}
      {selectedAssigneeId && (
        <ClearButton onClick={handleClearFilter}>
          <MdClear size={16} />
          Limpar filtro
        </ClearButton>
      )}
    </FilterContainer>
  );
};
