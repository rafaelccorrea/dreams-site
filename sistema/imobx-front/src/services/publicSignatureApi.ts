import axios from 'axios';

// API pública (sem autenticação) para assinaturas
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.dreamkeys.com.br',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Obter informações de assinatura pública (sem autenticação)
 * GET /public/signatures/:signatureId
 */
export const getPublicSignature = async (signatureId: string) => {
  const response = await publicApi.get(`/public/signatures/${signatureId}`);
  return response.data;
};
