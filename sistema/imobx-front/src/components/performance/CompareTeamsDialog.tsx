import React, { useState } from 'react';
import styled from 'styled-components';
import { MdGroups, MdCompare } from 'react-icons/md';
import { toast } from 'react-toastify';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';
import { TeamMultiSelect } from '../common/TeamMultiSelect';
import { useCompareTeams } from '@/hooks/usePerformance';
import { PeriodSelector } from './PeriodSelector';
import { TeamSideBySideComparison } from './TeamSideBySideComparison';
import type { PeriodPreset } from '@/types/performance';
import { getPeriodDates } from '@/utils/performanceUtils';

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const ResultsSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 16px 0;
`;

const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const HighlightCard = styled.div<{ $color: string }>`
  padding: 16px;
  background: ${props => props.$color}10;
  border: 1px solid ${props => props.$color}30;
  border-radius: 8px;
`;

const HighlightLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 4px 0;
`;

const HighlightName = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 4px 0;
`;

const HighlightValue = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

interface CompareTeamsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompareTeamsDialog({
  isOpen,
  onClose,
}: CompareTeamsDialogProps) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [period, setPeriod] = useState<PeriodPreset>('30days');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const { data, loading, compare, reset } = useCompareTeams();

  const handleCompare = async () => {
    if (selectedTeams.length < 2) {
      toast.error('Selecione pelo menos 2 equipes para comparar');
      return;
    }

    if (selectedTeams.length > 4) {
      toast.error('Você pode comparar no máximo 4 equipes');
      return;
    }

    const dates = getPeriodDates(period, customStart, customEnd);
    await compare(selectedTeams, dates.start, dates.end);
  };

  const handlePeriodChange = (
    preset: PeriodPreset,
    start?: Date,
    end?: Date
  ) => {
    setPeriod(preset);
    setCustomStart(start);
    setCustomEnd(end);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={handleClose}
      title='Comparar Performance de Equipes'
      subtitle='Compare até 4 equipes lado a lado para competições e gamificação'
      maxWidth='1400px'
      icon={<MdGroups />}
      footer={
        <ModalButton
          variant='primary'
          onClick={handleCompare}
          disabled={loading || selectedTeams.length < 2}
          icon={<MdCompare />}
        >
          {loading
            ? 'Comparando...'
            : `Comparar ${selectedTeams.length} Equipes`}
        </ModalButton>
      }
    >
      <div>
        {/* Seleção de Equipes */}
        <FormGroup>
          <Label>Selecione as Equipes ({selectedTeams.length}/4)</Label>
          <TeamMultiSelect
            selectedTeamIds={selectedTeams}
            onSelect={teamId => setSelectedTeams([...selectedTeams, teamId])}
            onRemove={teamId =>
              setSelectedTeams(selectedTeams.filter(id => id !== teamId))
            }
            maxSelections={4}
          />
        </FormGroup>

        {/* Seletor de Período */}
        <FormGroup>
          <Label>Período de Análise</Label>
          <PeriodSelector value={period} onChange={handlePeriodChange} />
        </FormGroup>

        {/* Resultados da Comparação */}
        {data && (
          <ResultsSection>
            <SectionTitle>📊 Comparação de Equipes</SectionTitle>
            <TeamSideBySideComparison comparison={data} />

            {/* Vencedores por Categoria */}
            <div style={{ marginTop: '32px' }}>
              <SectionTitle>🏆 Destaques</SectionTitle>
              <HighlightGrid>
                <HighlightCard $color='#F59E0B'>
                  <HighlightLabel>🏆 Melhor Taxa de Aceitação</HighlightLabel>
                  <HighlightName>
                    {data.bestTeam.acceptanceRate.teamName}
                  </HighlightName>
                  <HighlightValue>
                    {data.bestTeam.acceptanceRate.value.toFixed(1)}%
                  </HighlightValue>
                </HighlightCard>

                <HighlightCard $color='#8B5CF6'>
                  <HighlightLabel>⭐ Melhor Score Médio</HighlightLabel>
                  <HighlightName>
                    {data.bestTeam.avgScore.teamName}
                  </HighlightName>
                  <HighlightValue>
                    {data.bestTeam.avgScore.value.toFixed(1)}
                  </HighlightValue>
                </HighlightCard>

                <HighlightCard $color='#10B981'>
                  <HighlightLabel>🎯 Mais Matches</HighlightLabel>
                  <HighlightName>
                    {data.bestTeam.totalMatches.teamName}
                  </HighlightName>
                  <HighlightValue>
                    {data.bestTeam.totalMatches.value} matches
                  </HighlightValue>
                </HighlightCard>
              </HighlightGrid>
            </div>
          </ResultsSection>
        )}
      </div>
    </ModalPadrão>
  );
}
