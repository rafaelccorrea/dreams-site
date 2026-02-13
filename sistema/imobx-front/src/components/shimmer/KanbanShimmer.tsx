import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação de shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Container principal (usa tema para modo claro/escuro)
const KanbanShimmerContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

// Header do Kanban
const KanbanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const TeamDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TeamName = styled.div`
  width: 120px;
  height: 20px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const TeamMembers = styled.div`
  width: 80px;
  height: 16px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.div`
  width: 100px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

// Board do Kanban
const KanbanBoard = styled.div`
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 24px;
`;

// Coluna do Kanban
const KanbanColumn = styled.div`
  min-width: 320px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ColumnInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColumnColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const ColumnTitle = styled.div`
  width: 100px;
  height: 18px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ColumnCount = styled.div`
  width: 24px;
  height: 16px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
`;

// Tarefas do Kanban
const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const KanbanTask = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TaskTitle = styled.div`
  width: 150px;
  height: 16px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const TaskDescription = styled.div`
  width: 200px;
  height: 14px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const TaskPriority = styled.div`
  width: 60px;
  height: 20px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 10px;
`;

const TaskFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const TaskAssignee = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AssigneeAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const AssigneeName = styled.div`
  width: 60px;
  height: 14px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const TaskDueDate = styled.div`
  width: 80px;
  height: 14px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

interface KanbanShimmerProps {
  columnCount?: number;
  taskCountPerColumn?: number;
}

const KanbanShimmer: React.FC<KanbanShimmerProps> = ({
  columnCount = 4,
  taskCountPerColumn = 3,
}) => {
  return (
    <KanbanShimmerContainer>
      <KanbanHeader>
        <HeaderLeft>
          <TeamInfo>
            <TeamAvatar />
            <TeamDetails>
              <TeamName />
              <TeamMembers />
            </TeamDetails>
          </TeamInfo>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton />
          <ActionButton />
        </HeaderActions>
      </KanbanHeader>

      <KanbanBoard>
        {Array.from({ length: columnCount }).map((_, columnIndex) => (
          <KanbanColumn key={columnIndex}>
            <ColumnHeader>
              <ColumnInfo>
                <ColumnColor />
                <ColumnTitle />
              </ColumnInfo>
              <ColumnCount />
            </ColumnHeader>

            <TasksContainer>
              {Array.from({ length: taskCountPerColumn }).map(
                (_, taskIndex) => (
                  <KanbanTask key={taskIndex}>
                    <TaskHeader>
                      <div>
                        <TaskTitle />
                        <TaskDescription />
                      </div>
                      <TaskPriority />
                    </TaskHeader>

                    <TaskFooter>
                      <TaskAssignee>
                        <AssigneeAvatar />
                        <AssigneeName />
                      </TaskAssignee>
                      <TaskDueDate />
                    </TaskFooter>
                  </KanbanTask>
                )
              )}
            </TasksContainer>
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </KanbanShimmerContainer>
  );
};

export default KanbanShimmer;
