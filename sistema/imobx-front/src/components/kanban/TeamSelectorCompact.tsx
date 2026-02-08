import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MdExpandMore, MdGroup, MdCheck } from 'react-icons/md';
import type { Team } from '../../services/teamApi';

const SelectorContainer = styled.div`
  position: relative;
  min-width: 250px;
  display: flex;
  align-items: center;
  height: 44px;
`;

const SelectorButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid
    ${props =>
      props.$isOpen ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.938rem;
  color: ${props => props.theme.colors.text};
  min-height: 44px;
  box-sizing: border-box;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}20;
  }
`;

const SelectedTeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const TeamColorDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

const TeamName = styled.span`
  font-weight: 500;
  flex: 1;
  text-align: left;
`;

const DropdownIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: transform 0.2s ease;
  transform: rotate(${props => (props.$isOpen ? '180deg' : '0deg')});
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

const DropdownItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: ${props =>
    props.$isSelected ? props.theme.colors.primary + '10' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const CheckIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  margin-left: auto;
`;

interface TeamSelectorCompactProps {
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
}

export const TeamSelectorCompact: React.FC<TeamSelectorCompactProps> = ({
  teams,
  selectedTeam,
  onTeamSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleTeamClick = (team: Team) => {
    onTeamSelect(team);
    setIsOpen(false);
  };

  return (
    <SelectorContainer ref={containerRef}>
      <SelectorButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <SelectedTeamInfo>
          <MdGroup size={18} />
          {selectedTeam ? (
            <>
              <TeamColorDot $color={selectedTeam.color} />
              <TeamName>{selectedTeam.name}</TeamName>
            </>
          ) : (
            <TeamName>Selecionar Equipe</TeamName>
          )}
        </SelectedTeamInfo>
        <DropdownIcon $isOpen={isOpen}>
          <MdExpandMore size={20} />
        </DropdownIcon>
      </SelectorButton>

      <Dropdown $isOpen={isOpen}>
        {teams
          .filter(team => {
            // Filtrar time pessoal - não mostrar em nenhuma hipótese
            const teamNameLower = team.name.toLowerCase();
            const teamDescriptionLower = (team.description || '').toLowerCase();
            const isPersonal =
              teamNameLower.includes('pessoal') ||
              teamNameLower.startsWith('pessoal -') ||
              teamDescriptionLower.includes('time pessoal') ||
              teamDescriptionLower.includes('tarefas particulares') ||
              team.id?.toLowerCase().startsWith('personal');
            return !isPersonal;
          })
          .map(team => (
            <DropdownItem
              key={team.id}
              $isSelected={selectedTeam?.id === team.id}
              onClick={() => handleTeamClick(team)}
            >
              <TeamColorDot $color={team.color} />
              <TeamName>{team.name}</TeamName>
              {selectedTeam?.id === team.id && (
                <CheckIcon>
                  <MdCheck size={18} />
                </CheckIcon>
              )}
            </DropdownItem>
          ))}
      </Dropdown>
    </SelectorContainer>
  );
};
