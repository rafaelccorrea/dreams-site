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
  // Remove tudo que não é dígito
  const numericValue = value.replace(/\D/g, '')
  return numericValue ? Number(numericValue) : 0
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
 * Formata um valor numérico (área em m²) com suporte a decimais
 */
export const formatArea = (value: string): string => {
  if (!value) return ''
  
  // Remove tudo exceto dígitos
  let cleaned = value.replace(/\D/g, '')
  
  if (!cleaned) return ''
  
  // Se tiver mais de 2 dígitos, assume que os últimos 2 são decimais
  let integerPart = cleaned
  let decimalPart = ''
  
  if (cleaned.length > 2) {
    integerPart = cleaned.slice(0, -2)
    decimalPart = cleaned.slice(-2)
  } else if (cleaned.length === 2) {
    integerPart = cleaned.slice(0, 1)
    decimalPart = cleaned.slice(1)
  } else {
    integerPart = cleaned
  }
  
  // Formata parte inteira com separador de milhares
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  // Retorna com vírgula para decimais (padrão brasileiro)
  if (decimalPart) {
    return `${formattedInteger},${decimalPart}`
  }
  
  return formattedInteger
}

/**
 * Remove a formatação numérica e retorna apenas números (com ponto para decimais)
 */
export const unformatArea = (value: string): number => {
  // Remove pontos de milhares e substitui vírgula por ponto
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  const number = parseFloat(cleaned)
  return isNaN(number) ? 0 : number
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

/**
 * Formata CEP brasileiro (XXXXX-XXX)
 */
export const formatCEP = (value: string): string => {
  const numericValue = value.replace(/\D/g, '').slice(0, 8)
  
  if (!numericValue) return ''
  
  if (numericValue.length <= 5) {
    return numericValue
  } else {
    return numericValue.replace(/(\d{5})(\d)/, '$1-$2')
  }
}

/**
 * Remove a formatação do CEP e retorna apenas números
 */
export const unformatCEP = (value: string): string => {
  return value.replace(/\D/g, '')
}

/**
 * Valida formato de CEP brasileiro
 */
export const isValidCEP = (cep: string): boolean => {
  const numericValue = cep.replace(/\D/g, '')
  return numericValue.length === 8
}

