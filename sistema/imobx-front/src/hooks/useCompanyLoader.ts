import { useEffect, useRef } from 'react';
import { useCompany } from './useCompany';
import { authStorage } from '../services/authStorage';

/**
 * Hook para garantir que as empresas sejam carregadas quando o usuário está autenticado
 * Este hook monitora o estado de autenticação e força o carregamento de empresas quando necessário
 * IMPORTANTE: Este hook deve ser usado no dashboard para garantir que as companies sejam carregadas após o login
 */
export const useCompanyLoader = () => {
  const { companies, isLoading, refreshCompanies } = useCompany();
  const hasLoadedRef = useRef(false);
  const isCheckingRef = useRef(false);
  const hasNoCompanyError = useRef(false); // Flag para evitar loops quando não há empresa
  // CORREÇÃO: Rastrear o último userId para detectar mudanças REAIS de autenticação
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const checkAndLoadCompanies = async () => {
      // Verificar se o usuário está autenticado
      const token = authStorage.getToken();
      const userData = authStorage.getUserData();

      // Se não está autenticado, não fazer nada
      if (!token || !userData) {
        // Resetar refs quando não autenticado
        hasLoadedRef.current = false;
        lastUserIdRef.current = null;
        hasNoCompanyError.current = false;
        return;
      }

      // Se já houve erro de "sem empresa" para este usuário, não tentar novamente
      if (hasNoCompanyError.current && lastUserIdRef.current === userData.id) {
        console.log(
          '⏭️ useCompanyLoader: Usuário sem empresa detectado anteriormente, não tentando novamente'
        );
        return;
      }

      // Se já está verificando, não fazer nada
      if (isCheckingRef.current) {
        return;
      }

      // Se já tem companies carregadas, não fazer nada
      if (companies.length > 0) {
        // Resetar flag de erro se agora tem empresas
        hasNoCompanyError.current = false;
        // Atualizar lastUserId se mudou
        if (lastUserIdRef.current !== userData.id) {
          lastUserIdRef.current = userData.id;
        }
        return;
      }

      // Se está carregando, aguardar
      if (isLoading) {
        return;
      }

      // Se já tentou carregar para este usuário, não tentar novamente
      if (hasLoadedRef.current && lastUserIdRef.current === userData.id) {
        return;
      }

      // Todas as condições atendidas - carregar companies
      console.log('🔄 useCompanyLoader: Forçando carregamento de empresas...');

      isCheckingRef.current = true;
      hasLoadedRef.current = true;
      lastUserIdRef.current = userData.id;

      try {
        await refreshCompanies();
        console.log('✅ useCompanyLoader: Empresas carregadas com sucesso');
        // Resetar flag de erro se carregou com sucesso
        hasNoCompanyError.current = false;
      } catch (error: any) {
        console.error('❌ useCompanyLoader: Erro ao carregar empresas:', error);

        // Verificar se é erro de "sem empresa" (404, 403, ou array vazio)
        const isNoCompanyError =
          error?.response?.status === 404 ||
          (error?.response?.status === 403 && companies.length === 0) ||
          (error?.response?.data?.message?.includes('empresa') &&
            companies.length === 0);

        if (isNoCompanyError) {
          console.log(
            '⚠️ useCompanyLoader: Usuário sem empresa detectado, parando tentativas'
          );
          hasNoCompanyError.current = true;
        } else {
          // Outro tipo de erro, permitir nova tentativa
          hasLoadedRef.current = false;
        }
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Verificar imediatamente (apenas uma vez na montagem)
    checkAndLoadCompanies();

    // REMOVIDO: Listener de localStorageChange que causava loop infinito!
    // O evento localStorageChange é disparado frequentemente e não é confiável
    // para detectar mudanças reais de autenticação.
    // As companies devem ser carregadas:
    // 1. Na montagem inicial (acima)
    // 2. Quando companies.length ou isLoading mudam (via dependências do useEffect)
  }, [companies.length, isLoading, refreshCompanies]);

  return {
    companies,
    isLoading,
  };
};
