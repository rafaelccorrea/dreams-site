/**
 * Serviço para integração com API ViaCEP
 * https://viacep.com.br/
 */

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string // Cidade
  uf: string // Estado (sigla)
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

/**
 * Busca dados de endereço pelo CEP usando ViaCEP
 * @param cep - CEP com ou sem formatação (ex: "12345-678" ou "12345678")
 * @returns Dados do endereço ou null se não encontrado
 */
export async function fetchCepData(cep: string): Promise<ViaCepResponse | null> {
  // Remove formatação do CEP
  const cepDigits = cep.replace(/\D/g, '')
  
  // Valida se tem 8 dígitos
  if (cepDigits.length !== 8) {
    return null
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
    
    if (!response.ok) {
      return null
    }

    const data: ViaCepResponse = await response.json()
    
    // ViaCEP retorna { erro: true } quando não encontra o CEP
    if (data.erro) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

