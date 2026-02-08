import React from 'react';
import styled from 'styled-components';

interface SharedUser {
  userId: string;
  userName: string;
  teams: string[];
  totalSales: number;
  totalRentals: number;
  assignedTo?: string;
}

interface SharedUsersAlertProps {
  sharedUsers: SharedUser[];
  teamsData: any[];
  onOpenManualAssignment?: () => void;
}

const AlertContainer = styled.div`
  background: ${props => props.theme.colors.warningBackground || '#fff3cd'};
  border: 1px solid ${props => props.theme.colors.warningBorder || '#ffeaa7'};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const AlertTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.warningText || '#856404'};
  font-size: 16px;
  font-weight: 600;
`;

const AlertText = styled.p`
  margin: 0 0 12px 0;
  color: ${props => props.theme.colors.warningText || '#856404'};
  font-size: 14px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.warningText || '#856404'};
`;

const UserName = styled.strong`
  color: ${props => props.theme.colors.warningText || '#856404'};
`;

const TeamChip = styled.span<{ isAssigned?: boolean }>`
  background: ${props =>
    props.isAssigned
      ? props.theme.colors.primary
      : props.theme.colors.secondary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 4px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 12px;
  width: 100%;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

export const SharedUsersAlert: React.FC<SharedUsersAlertProps> = ({
  sharedUsers,
  teamsData,
  onOpenManualAssignment,
}) => {
  if (!sharedUsers || sharedUsers.length === 0) return null;

  const getTeamName = (teamId: string) => {
    return teamsData.find(t => t.teamId === teamId)?.teamName || teamId;
  };

  return (
    <AlertContainer>
      <AlertTitle>
        ⚠️ {sharedUsers.length} usuário(s) em múltiplos times
      </AlertTitle>
      <AlertText>
        Os seguintes usuários estão em mais de um time sendo comparado. Suas
        vendas são contadas em cada time.
      </AlertText>
      <UserList>
        {sharedUsers.map(user => (
          <UserItem key={user.userId}>
            <UserName>{user.userName}:</UserName>
            {user.totalSales} vendas, {user.totalRentals} aluguéis
            <div>
              {user.teams.map(teamId => (
                <TeamChip key={teamId} isAssigned={user.assignedTo === teamId}>
                  {getTeamName(teamId)}
                </TeamChip>
              ))}
            </div>
          </UserItem>
        ))}
      </UserList>
      {onOpenManualAssignment && (
        <ActionButton onClick={onOpenManualAssignment}>
          🎯 Atribuir Usuários Manuamente
        </ActionButton>
      )}
    </AlertContainer>
  );
};
