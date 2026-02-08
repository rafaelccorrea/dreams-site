import React, { useState } from 'react';
import styled from 'styled-components';
import { MdCalendarToday } from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PeriodPreset } from '@/types/performance';
import { CustomDatePicker } from '../common/CustomDatePicker';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text.secondary};
`;

interface PeriodSelectorProps {
  value: PeriodPreset;
  onChange: (
    preset: PeriodPreset,
    customStart?: Date,
    customEnd?: Date
  ) => void;
  className?: string;
}

export function PeriodSelector({
  value,
  onChange,
  className,
}: PeriodSelectorProps) {
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value as PeriodPreset;
    if (preset === 'custom') {
      onChange(preset, customStart, customEnd);
    } else {
      onChange(preset);
    }
  };

  const handleCustomDateChange = (start?: Date, end?: Date) => {
    setCustomStart(start);
    setCustomEnd(end);
    if (value === 'custom') {
      onChange('custom', start, end);
    }
  };

  return (
    <Container className={className}>
      <Select value={value} onChange={handlePresetChange}>
        <option value='7days'>Últimos 7 dias</option>
        <option value='30days'>Últimos 30 dias</option>
        <option value='thisMonth'>Este mês</option>
        <option value='lastMonth'>Mês passado</option>
        <option value='thisYear'>Este ano</option>
        <option value='custom'>Personalizado</option>
      </Select>

      {value === 'custom' && (
        <DateInputWrapper>
          <CustomDatePicker
            selectedDate={customStart}
            onChange={date => handleCustomDateChange(date, customEnd)}
            placeholder='Data inicial'
          />
          <DateLabel>até</DateLabel>
          <CustomDatePicker
            selectedDate={customEnd}
            onChange={date => handleCustomDateChange(customStart, date)}
            placeholder='Data final'
            minDate={customStart}
          />
        </DateInputWrapper>
      )}
    </Container>
  );
}
