import React, { useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdPersonOff, MdClear, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { Avatar } from '../common/Avatar';
import type { KanbanTask } from '../../types/kanban';

const MAX_COLLAPSED = 6;
const MAX_VISIBLE_IN_ROW = 10;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0;
  overflow-x: auto;
  overflow-y: visible;
  box-shadow: none;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-width: 0;
  scroll-behavior: smooth;

  /* Carrossel moderno: barra de scroll oculta, rolagem com mouse/touch mantida */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  @media (max-width: 1024px) and (min-width: 769px) {
    gap: 12px;
  }

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 4px 0;
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

  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-right: 4px;
  }
`;

const OVERLAP_PX = 10;

const AvatarStack = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const AvatarButton = styled.button<{ $isActive: boolean; $overlap?: boolean }>`
  position: relative;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props => (props.$isActive ? props.theme.colors.primary : props.theme.colors.cardBackground)};
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
  margin-left: ${props => (props.$overlap ? `-${OVERLAP_PX}px` : '0')};
  box-shadow: 0 0 0 2px ${props => props.theme.colors.cardBackground};

  & > * {
    display: block;
  }

  &:hover {
    transform: scale(1.08);
    z-index: 2;
    border-color: ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    border-width: 2px;
    margin-left: ${props => (props.$overlap ? '-8px' : '0')};

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const UnassignedButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.cardBackground};
  background: ${props =>
    props.$isActive
      ? props.theme.colors.primary + '20'
      : props.theme.colors.border};
  color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary};
  box-shadow: 0 0 0 2px ${props => props.theme.colors.cardBackground};

  &:hover {
    transform: scale(1.08);
    z-index: 2;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const TaskCount = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 999px;
  min-width: 18px;
  height: 18px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 0.55rem;
    padding: 1px 4px;
    min-width: 16px;
    height: 16px;
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
  padding-bottom: 14px;
  margin-bottom: -4px;
`;

const expandIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const VerMaisButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  margin-left: 4px;
  background: ${props => props.theme.colors.primary}18;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 20px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.813rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.primary}28;
    transform: scale(1.03);
  }
  &:active {
    transform: scale(0.98);
  }
`;

/** Quando expandido: mesmo layout de avatares agrupados (overlap), com scroll horizontal se precisar */
const ExpandedAvatarScroll = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 4px 4px 0;
  -webkit-overflow-scrolling: touch;
  animation: ${expandIn} 0.25s ease-out forwards;
  flex: 1;
  min-width: 0;
  scroll-behavior: smooth;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

const VerMenosButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  flex-shrink: 0;
  background: ${props => props.theme.colors.border};
  border: none;
  border-radius: 16px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
  }
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
  const [isExpanded, setIsExpanded] = useState(false);

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
    if (selectedAssigneeId === assigneeId) {
      onAssigneeSelect(null);
    } else {
      onAssigneeSelect(assigneeId);
    }
  };

  const handleClearFilter = () => {
    onAssigneeSelect(null);
  };

  if (assignees.assigned.length === 0 && assignees.unassignedCount === 0) {
    return null;
  }

  const avatarSize =
    typeof window !== 'undefined' && window.innerWidth <= 768 ? 32 : 36;
  const showVerMais = assignees.assigned.length > MAX_COLLAPSED;
  const visibleCollapsed = assignees.assigned.slice(0, MAX_COLLAPSED);

  return (
    <FilterContainer>
      <FilterLabel>Equipe:</FilterLabel>

      {!isExpanded ? (
        <>
          <AvatarStack>
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
            {visibleCollapsed.map((assignee, index) => (
              <AvatarWrapper key={assignee.id}>
                <AvatarButton
                  $isActive={selectedAssigneeId === assignee.id}
                  $overlap={index > 0 || assignees.unassignedCount > 0}
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
          </AvatarStack>
          {showVerMais && (
            <VerMaisButton
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label="Ver mais usuários da equipe"
            >
              <MdExpandMore size={18} />
              Ver mais ({assignees.assigned.length - MAX_COLLAPSED}+)
            </VerMaisButton>
          )}
        </>
      ) : (
        <>
          <ExpandedAvatarScroll>
            <AvatarStack>
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
              {assignees.assigned.map((assignee, index) => (
                <AvatarWrapper key={assignee.id}>
                  <AvatarButton
                    $isActive={selectedAssigneeId === assignee.id}
                    $overlap={index > 0 || assignees.unassignedCount > 0}
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
            </AvatarStack>
          </ExpandedAvatarScroll>
          <VerMenosButton
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Mostrar menos"
          >
            <MdExpandLess size={18} />
            Ver menos
          </VerMenosButton>
        </>
      )}

      {selectedAssigneeId && (
        <ClearButton onClick={handleClearFilter}>
          <MdClear size={16} />
          Limpar filtro
        </ClearButton>
      )}
    </FilterContainer>
  );
};
