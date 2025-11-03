/**
 * Máscaras de formatação para inputs
 */

/**
 * Formata um valor para moeda brasileira (R$)
 */
export const formatCurrency = (value: string): string => {
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, '')
  
  if (!numericValue) return ''
  
  // Converte para número
  const number = Number(numericValue)
  
  // Formata como moeda sem centavos
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

/**
 * Remove a formatação de moeda e retorna apenas números
 */
export const unformatCurrency = (value: string): number => {
  return Number(value.replace(/\D/g, '')) / 100
}

/**
 * Formata um valor numérico (área em m²)
 */
export const formatNumber = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')
  if (!numericValue) return ''
  
  return Number(numericValue).toLocaleString('pt-BR')
}

/**
 * Remove a formatação numérica e retorna apenas números
 */
export const unformatNumber = (value: string): number => {
  return Number(value.replace(/\D/g, ''))
}

