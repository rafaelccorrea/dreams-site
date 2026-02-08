import axios from 'axios';
import type { PublicStats } from '../types/publicStats';
import { API_BASE_URL } from '../config/apiConfig';

// Instância axios sem autenticação para rotas públicas
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Buscar estatísticas públicas do sistema
 * GET /public/stats
 */
export const getPublicStats = async (): Promise<PublicStats> => {
  try {
    const response = await publicApi.get('/public/stats');
    return response.data;
  } catch (error: any) {
    console.error('❌ Erro ao buscar estatísticas públicas:', error);
    // Retornar valores padrão em caso de erro
    return {
      totalProperties: 0,
      totalCompanies: 0,
      citiesServed: 0,
      partnerCompanies: [],
    };
  }
};
