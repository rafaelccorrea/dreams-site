/**
 * Utilitários para gerar URLs amigáveis para SEO local
 */

// Normalizar nome da cidade (remover acentos e converter para formato URL)
export const normalizeCityName = (city: string): string => {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Mapeamento de tipos de imóvel para slugs
export const propertyTypeSlugs: Record<string, string> = {
  house: 'casas',
  apartment: 'apartamentos',
  commercial: 'imoveis-comerciais',
  land: 'terrenos',
}

// Mapeamento de operações para slugs
export const operationSlugs: Record<string, string> = {
  sale: 'a-venda',
  rent: 'para-alugar',
}

/**
 * Gera URL SEO-friendly para busca local
 * Exemplos:
 * - generateLocalUrl('Marília', 'house', 'sale') => '/casas-a-venda-em-marilia'
 * - generateLocalUrl('São Paulo', 'apartment', 'rent') => '/apartamentos-para-alugar-em-sao-paulo'
 */
export const generateLocalUrl = (
  city: string,
  type?: 'house' | 'apartment' | 'commercial' | 'land',
  operation?: 'sale' | 'rent'
): string => {
  const citySlug = normalizeCityName(city)
  
  if (type && operation) {
    const typeSlug = propertyTypeSlugs[type]
    const operationSlug = operationSlugs[operation]
    return `/${typeSlug}-${operationSlug}-em-${citySlug}`
  }
  
  if (type) {
    const typeSlug = propertyTypeSlugs[type]
    return `/${typeSlug}-em-${citySlug}`
  }
  
  return `/imoveis-em-${citySlug}`
}

/**
 * Gera múltiplas URLs para uma cidade (todas as combinações principais)
 */
export const generateLocalUrlsForCity = (city: string): Array<{ url: string; title: string }> => {
  const urls: Array<{ url: string; title: string }> = []
  
  const types: Array<'house' | 'apartment' | 'commercial' | 'land'> = ['house', 'apartment', 'commercial', 'land']
  const operations: Array<'sale' | 'rent'> = ['sale', 'rent']
  
  // Gerar todas as combinações tipo + operação
  types.forEach(type => {
    operations.forEach(operation => {
      const url = generateLocalUrl(city, type, operation)
      const typeLabel = {
        house: 'Casas',
        apartment: 'Apartamentos',
        commercial: 'Imóveis Comerciais',
        land: 'Terrenos',
      }[type]
      const operationLabel = {
        sale: 'à Venda',
        rent: 'para Locação',
      }[operation]
      
      urls.push({
        url,
        title: `${typeLabel} ${operationLabel} em ${city}`,
      })
    })
  })
  
  return urls
}








