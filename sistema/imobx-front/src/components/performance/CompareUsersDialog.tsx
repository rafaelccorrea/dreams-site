import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdCompare } from 'react-icons/md';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';
import { UserMultiSelect } from '../common/UserMultiSelect';
import { useCompareUsers } from '@/hooks/usePerformance';
import { PeriodSelector } from './PeriodSelector';
import { SideBySideComparison } from './SideBySideComparison';
import { ComparisonRankingTable } from './ComparisonRankingTable';
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

interface CompareUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedUsers?: string[];
}

export function CompareUsersDialog({
  isOpen,
  onClose,
  preSelectedUsers = [],
}: CompareUsersDialogProps) {
  const [selectedUsers, setSelectedUsers] =
    useState<string[]>(preSelectedUsers);
  const [period, setPeriod] = useState<PeriodPreset>('30days');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const { data, loading, compare, reset } = useCompareUsers();

  useEffect(() => {
    if (preSelectedUsers.length > 0) {
      setSelectedUsers(preSelectedUsers);
    }
  }, [preSelectedUsers]);

  const handleCompare = async () => {
    if (selectedUsers.length < 2) return;
    if (selectedUsers.length > 5) return;

    const dates = getPeriodDates(period, customStart, customEnd);
    await compare(selectedUsers, dates.start, dates.end);
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
      title='Comparar Performance de Corretores'
      subtitle='Compare até 5 corretores lado a lado para identificar os melhores performers'
      maxWidth='1400px'
      icon={<MdCompare />}
      footer={
        <ModalButton
          variant='primary'
          onClick={handleCompare}
          disabled={loading || selectedUsers.length < 2}
          icon={<MdCompare />}
        >
          {loading
            ? 'Comparando...'
            : `Comparar ${selectedUsers.length} Corretores`}
        </ModalButton>
      }
    >
      <div>
        {/* Seleção de Usuários */}
        <FormGroup>
          <Label>Selecione os Corretores ({selectedUsers.length}/5)</Label>
          <UserMultiSelect
            selectedUserIds={selectedUsers}
            onSelect={userId => setSelectedUsers([...selectedUsers, userId])}
            onRemove={userId =>
              setSelectedUsers(selectedUsers.filter(id => id !== userId))
            }
            maxSelections={5}
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
            <div style={{ marginBottom: '32px' }}>
              <SectionTitle>📊 Comparação Lado a Lado</SectionTitle>
              <SideBySideComparison comparison={data} />
            </div>

            <div>
              <SectionTitle>🏆 Rankings por Métrica</SectionTitle>
              <ComparisonRankingTable comparison={data.comparison} />
            </div>
          </ResultsSection>
        )}
      </div>
    </ModalPadrão>
  );
}
