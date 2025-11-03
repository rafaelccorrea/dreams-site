/**
 * Formata um número como moeda brasileira (R$)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como moeda (ex: R$ 1.234,56)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Converte uma string de moeda para número
 * @param value - String formatada como moeda (ex: "R$ 1.234,56")
 * @returns Número
 */
export const parseCurrency = (value: string): number => {
  return parseFloat(
    value
      .replace(/[R$\s]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
  )
}


