import React from 'react';
import styled from 'styled-components';
import { DatePicker } from 'antd';
import { DatePickerConfig } from '../modals/DatePickerConfig';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const StyledDatePicker = styled(DatePicker)<{ $hasValue?: boolean }>`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 2px solid
    ${props =>
      props.$hasValue ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props =>
    props.$hasValue
      ? `${props.theme.colors.primary}05`
      : props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: ${props =>
    props.$hasValue
      ? `0 4px 15px ${props.theme.colors.primary}20`
      : `0 2px 8px ${props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'}`};

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus,
  &.ant-picker-focused {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  .ant-picker-input > input {
    color: ${props => props.theme.colors.text} !important;
    font-size: 1rem;
    background: transparent !important;
  }

  .ant-picker-input > input::placeholder {
    color: ${props => props.theme.colors.textSecondary} !important;
  }

  .ant-picker-suffix {
    color: ${props => props.theme.colors.textSecondary} !important;
  }

  .ant-picker-clear {
    color: ${props => props.theme.colors.textSecondary} !important;
  }

  .ant-picker-clear:hover {
    color: ${props => props.theme.colors.text} !important;
  }

  /* Dropdown do calendário */
  .ant-picker-dropdown {
    background: ${props => props.theme.colors.cardBackground} !important;
    border: 1px solid ${props => props.theme.colors.border} !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.15)'} !important;
  }

  .ant-picker-panel {
    background: ${props => props.theme.colors.cardBackground} !important;
    border: none !important;
  }

  .ant-picker-header {
    background: ${props => props.theme.colors.backgroundSecondary} !important;
    border-bottom: 1px solid ${props => props.theme.colors.border} !important;
  }

  .ant-picker-header-view {
    color: ${props => props.theme.colors.text} !important;
  }

  .ant-picker-prev-icon,
  .ant-picker-next-icon {
    color: ${props => props.theme.colors.textSecondary} !important;
  }

  .ant-picker-prev-icon:hover,
  .ant-picker-next-icon:hover {
    color: ${props => props.theme.colors.primary} !important;
  }

  .ant-picker-content th {
    color: ${props => props.theme.colors.textSecondary} !important;
    font-weight: 600 !important;
  }

  .ant-picker-cell {
    color: ${props => props.theme.colors.text} !important;
  }

  .ant-picker-cell:hover {
    background: ${props => props.theme.colors.primary}10 !important;
  }

  .ant-picker-cell-selected {
    background: ${props => props.theme.colors.primary} !important;
    color: white !important;
  }

  .ant-picker-cell-today {
    border: 1px solid ${props => props.theme.colors.primary} !important;
  }

  .ant-picker-cell-disabled {
    color: ${props => props.theme.colors.textSecondary} !important;
    opacity: 0.5 !important;
  }

  ${props =>
    props.$hasValue &&
    `
    &::after {
      content: '✓';
      position: absolute;
      right: 40px;
      top: 50%;
      transform: translateY(-50%);
      color: ${props.theme.colors.primary};
      font-weight: bold;
      font-size: 1.2rem;
      pointer-events: none;
      z-index: 1;
    }
  `}
`;

interface CustomDatePickerProps {
  value?: string | dayjs.Dayjs | null;
  onChange?: (date: dayjs.Dayjs | null) => void;
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  format?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  disabled = false,
  allowClear = true,
  format = 'DD/MM/YYYY',
}) => {
  // Converter string para dayjs se necessário
  const dayjsValue = React.useMemo(() => {
    if (!value) return null;
    if (typeof value === 'string') {
      return dayjs(value);
    }
    return value;
  }, [value]);

  const handleChange = (date: dayjs.Dayjs | null) => {
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <DatePickerConfig>
      <StyledDatePicker
        value={dayjsValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        format={format}
        $hasValue={!!dayjsValue}
        locale={{
          lang: {
            locale: 'pt-br',
            placeholder: 'Selecione uma data',
            rangePlaceholder: ['Data inicial', 'Data final'],
            today: 'Hoje',
            now: 'Agora',
            backToToday: 'Voltar para hoje',
            ok: 'OK',
            clear: 'Limpar',
            month: 'Mês',
            year: 'Ano',
            timeSelect: 'Selecionar hora',
            dateSelect: 'Selecionar data',
            monthSelect: 'Escolher mês',
            yearSelect: 'Escolher ano',
            decadeSelect: 'Escolher década',
            yearFormat: 'YYYY',
            dateFormat: 'DD/MM/YYYY',
            dayFormat: 'D',
            dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
            monthFormat: 'MMMM',
            monthBeforeYear: true,
            previousMonth: 'Mês anterior (PageUp)',
            nextMonth: 'Próximo mês (PageDown)',
            previousYear: 'Ano anterior (Control + esquerda)',
            nextYear: 'Próximo ano (Control + direita)',
            previousDecade: 'Década anterior',
            nextDecade: 'Próxima década',
            previousCentury: 'Século anterior',
            nextCentury: 'Próximo século',
          },
        }}
      />
    </DatePickerConfig>
  );
};

export default CustomDatePicker;
