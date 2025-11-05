/**
 * Serviço para buscar estados e cidades usando APIs públicas
 */

export interface BrazilianState {
  id: number
  sigla: string
  nome: string
}

export interface City {
  id: number
  nome: string
}

/**
 * Busca todos os estados brasileiros usando API do IBGE
 */
export const getStates = async (): Promise<BrazilianState[]> => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    if (!response.ok) {
      throw new Error('Erro ao buscar estados')
    }
    const data = await response.json()
    return data.map((estado: any) => ({
      id: estado.id,
      sigla: estado.sigla,
      nome: estado.nome,
    }))
  } catch (error) {
    console.error('Erro ao buscar estados:', error)
    throw error
  }
}

/**
 * Busca todas as cidades de um estado usando API do IBGE
 */
export const getCitiesByState = async (stateId: number): Promise<City[]> => {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios?orderBy=nome`
    )
    if (!response.ok) {
      throw new Error('Erro ao buscar cidades')
    }
    const data = await response.json()
    return data.map((municipio: any) => ({
      id: municipio.id,
      nome: municipio.nome,
    }))
  } catch (error) {
    console.error('Erro ao buscar cidades:', error)
    throw error
  }
}

/**
 * Busca estado por sigla (ex: SP, RJ)
 */
export const getStateByCode = async (code: string): Promise<BrazilianState | null> => {
  try {
    const states = await getStates()
    return states.find((state) => state.sigla === code.toUpperCase()) || null
  } catch (error) {
    console.error('Erro ao buscar estado por código:', error)
    return null
  }
}






