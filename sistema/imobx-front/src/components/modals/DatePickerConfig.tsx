import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { ptBR } from 'antd/locale';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';

// Configurar plugins do dayjs
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

// Configuração para localizar DatePicker em português
export const DatePickerConfig: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    // Garantir que o dayjs está configurado para português
    dayjs.locale('pt-br');
  }, []);

  return (
    <ConfigProvider
      locale={ptBR}
      theme={{
        components: {
          DatePicker: {
            cellHoverBg: 'var(--color-primary-light)',
            cellActiveWithRangeBg: 'var(--color-primary-light)',
            cellRangeBorderColor: 'var(--color-primary)',
            cellBgDisabled: 'var(--color-background-secondary)',
            cellDisabledColor: 'var(--color-text-secondary)',
            cellHoverColor: 'white',
            cellActiveColor: 'white',
            cellSelectedBg: 'var(--color-primary)',
            cellSelectedColor: 'white',
            cellTodayColor: 'var(--color-primary)',
            cellTodayBorderColor: 'var(--color-primary)',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
