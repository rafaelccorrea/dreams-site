import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdTrendingUp, MdInfo } from 'react-icons/md';
import { goalsApi } from '../../services/goalsApi';
import type { Goal } from '../../types/goal';
import { formatCurrency } from '../../utils/formatNumbers';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

interface GoalSelectorProps {
  selectedGoalId: string | null;
  onGoalChange: (goalId: string | null) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({
  selectedGoalId,
  onGoalChange,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const activeGoals = await goalsApi.getActiveMonthlyGoals();
        setGoals(activeGoals);

        // Se não houver meta selecionada e houver metas disponíveis, selecionar a primeira
        if (!selectedGoalId && activeGoals.length > 0) {
          onGoalChange(activeGoals[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar metas ativas:', error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <GoalSelectorContainer>
        <GoalSelectorLabel>
          <MdTrendingUp size={16} />
          Meta Mensal
        </GoalSelectorLabel>
        <GoalSelect disabled>
          <option>Carregando metas...</option>
        </GoalSelect>
      </GoalSelectorContainer>
    );
  }

  if (goals.length === 0) {
    return (
      <GoalSelectorContainer>
        <GoalSelectorLabel>
          <MdTrendingUp size={16} />
          Meta Mensal
          <InfoTooltip title='Nenhuma meta mensal ativa configurada no momento'>
            <MdInfo size={14} />
          </InfoTooltip>
        </GoalSelectorLabel>
        <GoalSelect disabled>
          <option>Nenhuma meta disponível</option>
        </GoalSelect>
      </GoalSelectorContainer>
    );
  }

  return (
    <GoalSelectorContainer>
      <GoalSelectorLabel>
        <MdTrendingUp size={16} />
        Meta Mensal
        {goals.length > 1 && (
          <InfoTooltip
            title={`${goals.length} metas mensais ativas disponíveis`}
          >
            <MdInfo size={14} />
          </InfoTooltip>
        )}
      </GoalSelectorLabel>
      <GoalSelect
        value={selectedGoalId || ''}
        onChange={e => onGoalChange(e.target.value || null)}
      >
        {goals.map(goal => (
          <option key={goal.id} value={goal.id}>
            {goal.title} - {formatCurrency(goal.targetValue)}
            {goal.startDate &&
              goal.endDate &&
              ` (${dayjs(goal.startDate).format('DD/MM')} - ${dayjs(goal.endDate).format('DD/MM')})`}
          </option>
        ))}
      </GoalSelect>
    </GoalSelectorContainer>
  );
};

export default GoalSelector;

// Styled Components
const GoalSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const GoalSelectorLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GoalSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InfoTooltip = styled.div`
  position: relative;
  cursor: help;
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 4px;

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 8px;
    background: ${props => props.theme.colors.text};
    color: ${props => props.theme.colors.background};
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 1000;
    margin-bottom: 4px;
  }
`;
