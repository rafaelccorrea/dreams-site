import React, { useState } from 'react';
import styled from 'styled-components';

interface SharedUser {
  userId: string;
  userName: string;
  teams: string[];
  totalSales: number;
  totalRentals: number;
}

interface Team {
  teamId: string;
  teamName: string;
}

interface ManualAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (assignments: Record<string, string>) => void;
  sharedUsers: SharedUser[];
  teams: Team[];
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};

  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const UserSection = styled.div`
  margin-bottom: 20px;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const UserStats = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const TeamSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  ${props =>
    props.variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryHover};
    }
  `
      : `
    background: ${props.theme.colors.secondary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.secondaryHover};
    }
  `}
`;

const DescriptionText = styled.p`
  margin-bottom: 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyStateText = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const UserTeamsInfo = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

export const ManualAssignmentModal: React.FC<ManualAssignmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sharedUsers,
  teams,
}) => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const handleAssignmentChange = (userId: string, teamId: string) => {
    setAssignments(prev => ({
      ...prev,
      [userId]: teamId,
    }));
  };

  const handleConfirm = () => {
    // Validar se todos os usuários foram atribuídos
    const unassignedUsers = sharedUsers.filter(
      user => !assignments[user.userId]
    );
    if (unassignedUsers.length > 0) {
      alert(
        `Por favor, atribua todos os usuários compartilhados. Usuários não atribuídos: ${unassignedUsers.map(u => u.userName).join(', ')}`
      );
      return;
    }

    onConfirm(assignments);
    setAssignments({});
  };

  const handleClose = () => {
    setAssignments({});
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>🎯 Atribuição Manual de Usuários</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <div>
          <DescriptionText>
            Os seguintes usuários estão em múltiplos times. Atribua cada um a um
            time específico para a comparação:
          </DescriptionText>

          {sharedUsers.length === 0 ? (
            <EmptyStateText>
              Nenhum usuário compartilhado encontrado.
            </EmptyStateText>
          ) : (
            sharedUsers.map(user => (
              <UserSection key={user.userId}>
                <UserItem>
                  <UserInfo>
                    <UserName>{user.userName}</UserName>
                    <UserStats>
                      {user.totalSales} vendas, {user.totalRentals} aluguéis
                    </UserStats>
                    <UserTeamsInfo>
                      Presente em:{' '}
                      {user.teams
                        .map(
                          teamId =>
                            teams.find(t => t.teamId === teamId)?.teamName ||
                            teamId
                        )
                        .join(', ')}
                    </UserTeamsInfo>
                  </UserInfo>
                  <TeamSelect
                    value={assignments[user.userId] || ''}
                    onChange={e =>
                      handleAssignmentChange(user.userId, e.target.value)
                    }
                  >
                    <option value=''>Selecione um time</option>
                    {teams.map(team => (
                      <option key={team.teamId} value={team.teamId}>
                        {team.teamName}
                      </option>
                    ))}
                  </TeamSelect>
                </UserItem>
              </UserSection>
            ))
          )}
        </div>

        <ModalFooter>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant='primary' onClick={handleConfirm}>
            Confirmar Atribuições ({Object.keys(assignments).length}/
            {sharedUsers.length})
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};
