import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MdExpandMore, MdGroup, MdCheck } from 'react-icons/md';
import type { Team } from '../../services/teamApi';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const listener = () => setMatches(m.matches);
    m.addEventListener('change', listener);
    setMatches(m.matches);
    return () => m.removeEventListener('change', listener);
  }, [query]);
  return matches;
}

const SelectorContainer = styled.div`
  position: relative;
  min-width: 250px;
  display: flex;
  align-items: center;
  height: 44px;

  @media (max-width: 1024px) {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    min-width: 160px;
    height: 40px;
  }

  /* Mobile: compartilha linha com Filtros (parent tem max-width 52%) */
  @media (max-width: 480px) {
    min-width: 0;
    width: 100%;
    max-width: 100%;
    height: 40px;
  }
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

  @media (max-width: 768px) {
    padding: 10px 12px;
    min-height: 40px;
    font-size: 0.875rem;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    min-height: 44px;
    font-size: 0.8125rem;
  }
`;

const SelectedTeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
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
  min-width: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

  @media (max-width: 480px) {
    max-width: calc(100vw - 24px);
    left: 0;
    right: 0;
  }

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

  /* Oculta a barra de rolagem mantendo a rolagem funcional (scroll com mouse/touch) */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
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

/** No mobile: select nativo para abrir o picker do sistema (melhor UX) */
const MobileNativeSelect = styled.select`
  width: 100%;
  min-height: 44px;
  padding: 10px 36px 10px 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

interface TeamSelectorCompactProps {
  teams: Team[];
  selectedTeam: Team | null;
  onTeamSelect: (team: Team) => void;
}

function filterPersonalTeams(teams: Team[]): Team[] {
  return teams.filter(team => {
    const teamNameLower = team.name.toLowerCase();
    const teamDescriptionLower = (team.description || '').toLowerCase();
    const isPersonal =
      teamNameLower.includes('pessoal') ||
      teamNameLower.startsWith('pessoal -') ||
      teamDescriptionLower.includes('time pessoal') ||
      teamDescriptionLower.includes('tarefas particulares') ||
      team.id?.toLowerCase().startsWith('personal');
    return !isPersonal;
  });
}

export const TeamSelectorCompact: React.FC<TeamSelectorCompactProps> = ({
  teams,
  selectedTeam,
  onTeamSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const filteredTeams = filterPersonalTeams(teams);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  const handleTeamClick = (team: Team) => {
    onTeamSelect(team);
    setIsOpen(false);
  };

  const handleNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const team = filteredTeams.find(t => t.id === id);
    if (team) onTeamSelect(team);
  };

  if (isMobile) {
    return (
      <SelectorContainer ref={containerRef}>
        <MobileNativeSelect
          value={selectedTeam?.id ?? ''}
          onChange={handleNativeSelectChange}
          aria-label="Selecionar equipe"
        >
          <option value="">Selecionar Equipe</option>
          {filteredTeams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </MobileNativeSelect>
      </SelectorContainer>
    );
  }

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
        {filteredTeams.map(team => (
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
