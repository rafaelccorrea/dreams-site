import React from 'react';
import styled from 'styled-components';
import { MdPerson, MdAdd, MdInfo } from 'react-icons/md';

const NoUsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 48px 24px;
`;

const NoUsersIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 24px;
  opacity: 0.6;
`;

const NoUsersTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const NoUsersText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
  max-width: 600px;
`;

const NoUsersSubMessage = styled.p`
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

interface NoUsersMessageProps {
  onCreateUser: () => void;
}

export const NoUsersMessage: React.FC<NoUsersMessageProps> = ({
  onCreateUser,
}) => {
  return (
    <NoUsersContainer>
      <NoUsersIcon>
        <MdPerson />
      </NoUsersIcon>

      <NoUsersTitle>Nenhum usuário cadastrado</NoUsersTitle>

      <NoUsersText>
        Para criar equipes, você precisa ter pelo menos um usuário cadastrado na
        empresa. As equipes são formadas por usuários que trabalham juntos em
        projetos.
      </NoUsersText>

      <NoUsersSubMessage>
        Comece cadastrando usuários na sua empresa para poder criar equipes e
        organizar o trabalho de forma colaborativa.
      </NoUsersSubMessage>

      <ActionButtons>
        <PrimaryButton onClick={onCreateUser}>
          <MdAdd size={20} />
          Cadastrar Primeiro Usuário
        </PrimaryButton>
      </ActionButtons>

      <InfoBox>
        <InfoTitle>
          <MdInfo size={16} />
          Como funciona?
        </InfoTitle>
        <InfoText>
          Primeiro você precisa cadastrar usuários na sua empresa. Depois disso,
          você poderá criar equipes e atribuir usuários a essas equipes para
          trabalhar em projetos colaborativos.
        </InfoText>
      </InfoBox>
    </NoUsersContainer>
  );
};
