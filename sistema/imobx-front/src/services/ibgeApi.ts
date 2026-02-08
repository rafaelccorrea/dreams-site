// Serviço para buscar estados e cidades do IBGE
class IbgeApiService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v1';

  async getStates(): Promise<
    Array<{ id: number; sigla: string; nome: string }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/localidades/estados`);
      const data = await response.json();
      return data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      return [];
    }
  }

  async getCitiesByState(
    stateId: number
  ): Promise<Array<{ id: number; nome: string }>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/localidades/estados/${stateId}/municipios`
      );
      const data = await response.json();
      return data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return [];
    }
  }
}

export const ibgeApi = new IbgeApiService();
