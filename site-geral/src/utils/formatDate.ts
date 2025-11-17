/**
 * Formata uma data para o padrão brasileiro (DD/MM/YYYY)
 * @param date - Data a ser formatada (string, Date ou timestamp)
 * @returns String formatada (ex: 31/12/2023)
 */
export const formatDate = (date: string | Date | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

/**
 * Formata uma data para o padrão brasileiro com hora (DD/MM/YYYY HH:MM)
 * @param date - Data a ser formatada
 * @returns String formatada (ex: 31/12/2023 14:30)
 */
export const formatDateTime = (date: string | Date | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Formata uma data relativa (ex: "há 2 dias")
 * @param date - Data a ser formatada
 * @returns String formatada
 */
export const formatRelativeDate = (date: string | Date | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date

  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Hoje'
  if (diffInDays === 1) return 'Ontem'
  if (diffInDays < 7) return `Há ${diffInDays} dias`
  if (diffInDays < 30) return `Há ${Math.floor(diffInDays / 7)} semanas`
  if (diffInDays < 365) return `Há ${Math.floor(diffInDays / 30)} meses`
  return `Há ${Math.floor(diffInDays / 365)} anos`
}


















