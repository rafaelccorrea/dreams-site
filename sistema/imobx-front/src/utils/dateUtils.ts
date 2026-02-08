import dayjs from 'dayjs';

/**
 * Converte uma data para dayjs de forma segura
 * @param date - Data a ser convertida (string, Date, dayjs, null, undefined)
 * @returns dayjs object válido ou undefined se a data for inválida
 */
export const safeDayjs = (date: any): dayjs.Dayjs | undefined => {
  if (!date) {
    return undefined;
  }

  try {
    const dayjsObj = dayjs(date);
    return dayjsObj.isValid() ? dayjsObj : undefined;
  } catch (error) {
    console.warn('Erro ao converter data para dayjs:', error);
    return undefined;
  }
};

/**
 * Converte uma data para string no formato YYYY-MM-DD
 * @param date - Data a ser convertida
 * @returns String da data ou undefined se inválida
 */
export const safeDateFormat = (date: any): string | undefined => {
  const dayjsObj = safeDayjs(date);
  return dayjsObj ? dayjsObj.format('YYYY-MM-DD') : undefined;
};

/**
 * Converte uma data para string no formato DD/MM/YYYY
 * @param date - Data a ser convertida
 * @returns String da data ou undefined se inválida
 */
export const safeDateFormatBR = (date: any): string | undefined => {
  const dayjsObj = safeDayjs(date);
  return dayjsObj ? dayjsObj.format('DD/MM/YYYY') : undefined;
};

/**
 * Verifica se uma data é válida
 * @param date - Data a ser verificada
 * @returns true se a data for válida, false caso contrário
 */
export const isValidDate = (date: any): boolean => {
  const dayjsObj = safeDayjs(date);
  return dayjsObj !== undefined;
};

/**
 * Converte um range de datas para dayjs de forma segura
 * @param dateRange - Array com duas datas [inicio, fim]
 * @returns Array com dayjs objects válidos ou [undefined, undefined] se inválidas
 */
export const safeDateRange = (
  dateRange: any[]
): [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined] => {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return [undefined, undefined];
  }

  return [safeDayjs(dateRange[0]), safeDayjs(dateRange[1])];
};
