// Teste para verificar se o axios está funcionando e se o header X-Company-ID está sendo enviado
import { api } from '../services/api';

export const testApiConnection = async () => {
  try {
    // console.log('🧪 Testando conexão com a API...');
    // Verificar se há empresa selecionada
    const selectedCompanyId = localStorage.getItem(
      'dream_keys_selected_company_id'
    );
    // console.log('🏢 Empresa selecionada no localStorage:', selectedCompanyId);
    // Teste 1: Verificar perfil do usuário (requer autenticação)
    // console.log('👤 Testando autenticação com perfil do usuário...');
    const profileResponse = await api.get('/auth/profile');
    // console.log('✅ Autenticação funcionando:', profileResponse.data);
    // Teste 2: Verificar se o header X-Company-ID está sendo enviado em outras rotas
    if (selectedCompanyId) {
      try {
        // console.log('🏢 Testando rota com X-Company-ID...');
        const companiesResponse = await api.get('/companies');
        return {
          profile: profileResponse.data,
          companies: companiesResponse.data,
          companyId: selectedCompanyId,
        };
      } catch (companyError) {
        // console.log('⚠️ Erro ao testar header X-Company-ID:', companyError);
        const errorMessage =
          companyError instanceof Error
            ? companyError.message
            : typeof companyError === 'object' &&
                companyError !== null &&
                'message' in companyError
              ? String(companyError.message)
              : 'Erro desconhecido';
        return {
          profile: profileResponse.data,
          companyId: selectedCompanyId,
          error: errorMessage,
        };
      }
    } else {
      // console.log('⚠️ Nenhuma empresa selecionada para testar header');
      return {
        profile: profileResponse.data,
        companyId: null,
      };
    }
  } catch (error) {
    console.error('❌ Erro na API:', error);
    throw error;
  }
};
