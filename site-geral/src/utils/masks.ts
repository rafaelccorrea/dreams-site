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

/**
 * Formata um telefone brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatPhone = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')
  
  if (!numericValue) return ''
  
  // Limita a 11 dígitos (celular) ou 10 dígitos (fixo)
  const limitedValue = numericValue.slice(0, 11)
  
  if (limitedValue.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return limitedValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d)/, '$1-$2$3')
  } else {
    // Celular: (XX) XXXXX-XXXX
    return limitedValue
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(\d{5})-(\d)(\d)/, '$1-$2$3')
  }
}

/**
 * Remove a formatação do telefone e retorna apenas números
 */
export const unformatPhone = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Formata email em tempo real (remove espaços e converte para minúsculas)
 */
export const formatEmail = (value: string): string => {
  // Remove espaços e converte para minúsculas, mas preserva o que o usuário está digitando
  return value.toLowerCase().replace(/\s/g, '')
}

/**
 * Valida formato de telefone brasileiro
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneDigits = phone.replace(/\D/g, '')
  // Telefone deve ter 10 ou 11 dígitos (fixo ou celular)
  return phoneDigits.length >= 10 && phoneDigits.length <= 11
}

