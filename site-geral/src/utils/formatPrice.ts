/**
 * Formata preço que pode vir como string ou number
 */
export const formatPrice = (price: string | number | null | undefined): string => {
  if (price === null || price === undefined || price === '') return 'Consulte'
  
  // Converte string para number se necessário
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
  if (isNaN(numericPrice) || numericPrice === 0) return 'Consulte'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

/**
 * Formata área que pode vir como string ou number
 */
export const formatArea = (area: string | number | null | undefined): string => {
  if (area === null || area === undefined || area === '') return '0'
  
  const numericArea = typeof area === 'string' ? parseFloat(area) : area
  
  if (isNaN(numericArea)) return '0'
  
  return numericArea.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}


















