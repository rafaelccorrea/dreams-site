// Serviço para buscar estados e cidades
// Estados: lista estática brasileira
// Cidades: usa IBGE (ViaCEP não oferece endpoint para listar cidades)
import { BrazilianStates } from '../types/property';

export interface State {
  id: string;
  sigla: string;
  nome: string;
}

export interface City {
  id: string;
  nome: string;
}

class ViaCepApiService {
  /**
   * Retorna lista de estados brasileiros
   * Usa a lista estática do projeto
   */
  async getStates(): Promise<State[]> {
    return BrazilianStates.map(state => ({
      id: state.value,
      sigla: state.value,
      nome: state.label,
    }));
  }

  /**
   * Busca cidades de um estado usando IBGE
   * ViaCEP não oferece endpoint para listar cidades por estado
   * @param stateId - Sigla do estado (ex: 'SP', 'RJ')
   */
  async getCitiesByState(stateId: string): Promise<City[]> {
    try {
      // Buscar código do estado no IBGE primeiro
      const statesResponse = await fetch(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      const statesData = await statesResponse.json();
      const state = statesData.find(
        (s: any) => s.sigla === stateId.toUpperCase()
      );

      if (!state) {
        return [];
      }

      // Buscar cidades do estado
      const citiesResponse = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.id}/municipios`
      );
      const citiesData = await citiesResponse.json();

      return citiesData
        .map((city: any, index: number) => ({
          id: `${stateId}-${index}`,
          nome: city.nome,
        }))
        .sort((a: City, b: City) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return [];
    }
  }
}

export const viaCepApi = new ViaCepApiService();
