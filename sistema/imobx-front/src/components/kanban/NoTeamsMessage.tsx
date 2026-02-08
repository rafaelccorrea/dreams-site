import React from 'react';
import styled from 'styled-components';
import { MdGroup, MdAdd, MdInfo } from 'react-icons/md';
import { getPermissionDescription } from '../../utils/permissionDescriptions';

const NoTeamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 48px 24px;
`;

const NoTeamsIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 24px;
  opacity: 0.6;
`;

const NoTeamsTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const NoTeamsText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
  max-width: 600px;
`;

const NoTeamsSubMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 32px 0;
  line-height: 1.5;
  max-width: 500px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => `${props.theme.colors.primary}10`};
  }
`;

const InfoBox = styled.div`
  background: ${props => `${props.theme.colors.primary}10`};
  border: 1px solid ${props => `${props.theme.colors.primary}30`};
  border-radius: 12px;
  padding: 20px;
  margin-top: 32px;
  max-width: 500px;
`;

const InfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

interface NoTeamsMessageProps {
  onCreateTeam: () => void;
  onRequestAccess?: () => void;
  showRequestAccess?: boolean;
  hasTeamPermission?: boolean;
  teamsError?: string | null;
  onRetry?: () => void;
}

export const NoTeamsMessage: React.FC<NoTeamsMessageProps> = ({
  onCreateTeam,
  onRequestAccess,
  showRequestAccess = true,
  hasTeamPermission = true,
  teamsError = null,
  onRetry,
}) => {
  // Se não tem permissão para ver equipes, mostrar mensagem específica
  if (!hasTeamPermission) {
    return (
      <NoTeamsContainer>
        <NoTeamsIcon>
          <MdGroup />
        </NoTeamsIcon>

        <NoTeamsTitle>Acesso Restrito</NoTeamsTitle>

        <NoTeamsText>
          Você não tem permissão para visualizar equipes.
        </NoTeamsText>

        <NoTeamsSubMessage>
          Para acessar o Kanban, você precisa da permissão{' '}
          <strong>{getPermissionDescription('team:view')}</strong>. Entre em
          contato com um administrador para solicitar acesso às equipes.
        </NoTeamsSubMessage>

        <ActionButtons>
          {onRequestAccess && (
            <PrimaryButton onClick={onRequestAccess}>
              <MdGroup size={20} />
              Solicitar Acesso
            </PrimaryButton>
          )}
        </ActionButtons>

        <InfoBox>
          <InfoTitle>
            <MdInfo size={16} />
            Por que isso acontece?
          </InfoTitle>
          <InfoText>
            O sistema Kanban organiza tarefas por equipes. Sem permissão para
            visualizar equipes, você não pode acessar os quadros Kanban. Um
            administrador pode conceder a permissão necessária.
          </InfoText>
        </InfoBox>
      </NoTeamsContainer>
    );
  }

  // Se há erro ao carregar equipes, mostrar erro específico
  if (teamsError) {
    return (
      <NoTeamsContainer>
        <NoTeamsIcon>
          <MdGroup />
        </NoTeamsIcon>

        <NoTeamsTitle>Erro ao Carregar Equipes</NoTeamsTitle>

        <NoTeamsText>
          Ocorreu um erro ao tentar carregar as equipes disponíveis.
        </NoTeamsText>

        <NoTeamsSubMessage>{teamsError}</NoTeamsSubMessage>

        <ActionButtons>
          {onRetry && (
            <PrimaryButton onClick={onRetry}>
              <MdAdd size={20} />
              Tentar Novamente
            </PrimaryButton>
          )}
        </ActionButtons>
      </NoTeamsContainer>
    );
  }

  // Mensagem padrão para quando não há equipes
  return (
    <NoTeamsContainer>
      <NoTeamsIcon>
        <MdGroup />
      </NoTeamsIcon>

      <NoTeamsTitle>Nenhuma equipe disponível</NoTeamsTitle>

      <NoTeamsText>
        Para usar o Kanban, você precisa ter pelo menos uma equipe cadastrada ou
        estar vinculado a uma equipe existente.
      </NoTeamsText>

      <NoTeamsSubMessage>
        O sistema Kanban organiza tarefas por equipes, permitindo que você
        gerencie projetos de forma colaborativa com sua equipe.
      </NoTeamsSubMessage>

      <ActionButtons>
        <PrimaryButton onClick={onCreateTeam}>
          <MdAdd size={20} />
          Criar Nova Equipe
        </PrimaryButton>

        {showRequestAccess && onRequestAccess && (
          <SecondaryButton onClick={onRequestAccess}>
            <MdGroup size={20} />
            Solicitar Acesso a Equipe
          </SecondaryButton>
        )}
      </ActionButtons>

      <InfoBox>
        <InfoTitle>
          <MdInfo size={16} />
          Como funciona?
        </InfoTitle>
        <InfoText>
          As equipes são grupos de usuários que trabalham juntos em projetos.
          Cada equipe tem seu próprio quadro Kanban com colunas e tarefas
          específicas. Você pode criar uma nova equipe ou solicitar acesso a uma
          equipe existente.
        </InfoText>
      </InfoBox>
    </NoTeamsContainer>
  );
};
