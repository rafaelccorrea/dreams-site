/**
 * Seletor múltiplo de equipes
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdSearch, MdGroups, MdClose } from 'react-icons/md';
import { api } from '../../services/api';

interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
}

interface TeamMultiSelectProps {
  selectedTeamIds: string[];
  onSelect: (teamId: string) => void;
  onRemove: (teamId: string) => void;
  maxSelections?: number;
}

export function TeamMultiSelect({
  selectedTeamIds,
  onSelect,
  onRemove,
  maxSelections = 4,
}: TeamMultiSelectProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teams');
      setTeams(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar time pessoal - não mostrar em nenhuma hipótese
  const isPersonalTeam = (team: Team) => {
    const teamNameLower = team.name.toLowerCase();
    const teamDescriptionLower = (team.description || '').toLowerCase();
    return (
      teamNameLower.includes('pessoal') ||
      teamNameLower.startsWith('pessoal -') ||
      teamDescriptionLower.includes('time pessoal') ||
      teamDescriptionLower.includes('tarefas particulares') ||
      team.id?.toLowerCase().startsWith('personal')
    );
  };

  const selectedTeams = teams.filter(
    t => selectedTeamIds.includes(t.id) && !isPersonalTeam(t)
  );
  const availableTeams = teams.filter(
    t => !selectedTeamIds.includes(t.id) && !isPersonalTeam(t)
  );

  const filteredTeams = availableTeams.filter(
    team =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canSelectMore = selectedTeamIds.length < maxSelections;

  return (
    <Container>
      {/* Selected Teams */}
      {selectedTeams.length > 0 && (
        <SelectedList>
          {selectedTeams.map(team => (
            <SelectedBadge key={team.id}>
              <IconContainer>
                <MdGroups />
              </IconContainer>
              <TeamName>{team.name}</TeamName>
              {team.memberCount !== undefined && (
                <MemberCount>{team.memberCount} membros</MemberCount>
              )}
              <RemoveButton onClick={() => onRemove(team.id)}>
                <MdClose size={16} />
              </RemoveButton>
            </SelectedBadge>
          ))}
        </SelectedList>
      )}

      {/* Search Input */}
      {canSelectMore && (
        <SearchContainer>
          <SearchIcon>
            <MdSearch />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Buscar equipes...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          {searchTerm && (
            <ClearButton onClick={() => setSearchTerm('')}>
              <MdClose />
            </ClearButton>
          )}
        </SearchContainer>
      )}

      {/* Dropdown List */}
      {showDropdown && canSelectMore && (
        <>
          <Overlay onClick={() => setShowDropdown(false)} />
          <Dropdown>
            {loading ? (
              <LoadingState>Carregando...</LoadingState>
            ) : filteredTeams.length === 0 ? (
              <EmptyState>
                {searchTerm
                  ? 'Nenhuma equipe encontrada'
                  : 'Todas as equipes já foram selecionadas'}
              </EmptyState>
            ) : (
              filteredTeams.slice(0, 20).map(team => (
                <TeamOption
                  key={team.id}
                  onClick={() => {
                    onSelect(team.id);
                    setSearchTerm('');
                    if (selectedTeamIds.length + 1 >= maxSelections) {
                      setShowDropdown(false);
                    }
                  }}
                >
                  <IconContainer>
                    <MdGroups />
                  </IconContainer>
                  <TeamInfo>
                    <TeamName>{team.name}</TeamName>
                    {team.description && (
                      <TeamDescription>{team.description}</TeamDescription>
                    )}
                    {team.memberCount !== undefined && (
                      <MemberCount>{team.memberCount} membros</MemberCount>
                    )}
                  </TeamInfo>
                </TeamOption>
              ))
            )}
          </Dropdown>
        </>
      )}

      {/* Hint */}
      {!canSelectMore && (
        <HintText>Máximo de {maxSelections} equipes atingido</HintText>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  position: relative;
`;

const SelectedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const SelectedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.theme.colors.primaryLight || '#F3E8FF'};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  padding: 6px 8px 6px 6px;
`;

const IconContainer = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const TeamName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const MemberCount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #ede9fe;
    color: #1f2937;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const TeamOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const TeamInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TeamDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LoadingState = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const HintText = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 8px 0 0 0;
  font-style: italic;
`;
