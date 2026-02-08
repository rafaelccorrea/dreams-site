import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from 'react';
import { authStorage } from '../services/authStorage';
import { companyApi } from '../services/companyApiTemp';
import { type Company } from '../services/companyApiTemp';
import {
  CompanyContext,
  type CompanyContextType,
} from './CompanyContextDefinition';

interface CompanyProviderProps {
  children: ReactNode;
}

const normalizeCompanyModules = (company: Company): Company => {
  const normalizeModuleName = (value: unknown): string | null => {
    if (!value) return null;
    if (typeof value === 'string') return value.toLowerCase();
    if (
      typeof value === 'object' &&
      value !== null &&
      'code' in (value as Record<string, unknown>)
    ) {
      return String((value as Record<string, unknown>).code).toLowerCase();
    }
    return null;
  };

  const normalizedModules = Array.isArray(company.availableModules)
    ? company.availableModules
        .map(normalizeModuleName)
        .filter((moduleName): moduleName is string => Boolean(moduleName))
    : [];

  return {
    ...company,
    availableModules: normalizedModules,
  };
};

export const CompanyProvider: React.FC<CompanyProviderProps> = ({
  children,
}) => {
  // console.log('🏢 CompanyProvider: Componente sendo renderizado...');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedCompanies = useRef(false);

  // Verificar role do usuário - CORREÇÃO: usar authStorage ao invés de localStorage direto
  const userData = authStorage.getUserData();
  const userRole = userData?.role || 'unknown';

  const getPreferredCompany = (companiesArray: Company[]): Company | null => {
    if (!companiesArray.length) return null;
    const matrixCompany = companiesArray.find(
      company =>
        company.isMatrix === true ||
        company.isMatrix === 'true' ||
        company.isMatrix === 1 ||
        company.isMatrix === '1'
    );
    return matrixCompany || companiesArray[0];
  };

  // Carregar empresas do usuário
  const loadCompanies = useCallback(async () => {
    // console.log('🏢 CompanyContext: 🔄 loadCompanies chamado');
    try {
      setIsLoading(true);
      setError(null);

      // console.log('🏢 CompanyContext: 📡 Chamando companyApi.getCompanies()...');

      // CORREÇÃO: Usar retry para API de companies
      const { withSelectiveRetry } = await import('../utils/retryUtils');
      const userCompanies = await withSelectiveRetry(
        () => companyApi.getCompanies(),
        {
          maxRetries: 3,
          baseDelay: 1000,
          maxDelay: 5000,
        }
      );

      // console.log('🏢 CompanyContext: 📦 Resposta da API:', userCompanies);
      // console.log('🏢 CompanyContext: 🔍 É array?', Array.isArray(userCompanies));
      // Garantir que é um array
      const companiesArray = Array.isArray(userCompanies)
        ? userCompanies.map(normalizeCompanyModules)
        : [];

      // console.log('🏢 CompanyContext: 💾 Setando companies no estado...');
      setCompanies(companiesArray);

      // console.log('🏢 CompanyContext: ✅ Empresas carregadas:', companiesArray.length);
      // console.log('🏢 CompanyContext: 📋 Empresas:', companiesArray.map(c => ({ id: c.id, name: c.name })));
      // Se não há empresa selecionada e há empresas disponíveis, selecionar a primeira
      // Usar função de callback para evitar dependência de selectedCompany
      setSelectedCompany(currentSelected => {
        // console.log('🏢 CompanyContext: Verificando empresa selecionada:', { currentSelected: currentSelected?.id, companiesCount: companiesArray.length });
        if (!currentSelected && companiesArray.length > 0) {
          const savedCompanyId = localStorage.getItem(
            'dream_keys_selected_company_id'
          );
          // console.log('🏢 CompanyContext: Empresa salva no localStorage:', savedCompanyId);
          if (savedCompanyId) {
            const savedCompany = companiesArray.find(
              c => c.id === savedCompanyId
            );
            if (savedCompany) {
              // console.log('✅ CompanyContext: Empresa salva encontrada, selecionando:', savedCompany.id);
              return savedCompany;
            } else {
              // Se a empresa salva não existe mais, selecionar a primeira disponível
              const preferredCompany = getPreferredCompany(companiesArray);
              if (preferredCompany) {
                // console.log('⚠️ CompanyContext: Empresa salva não encontrada, selecionando preferida:', preferredCompany.id);
                localStorage.setItem(
                  'dream_keys_selected_company_id',
                  preferredCompany.id
                );
              }
              return preferredCompany || null;
            }
          } else {
            const preferredCompany = getPreferredCompany(companiesArray);
            if (preferredCompany) {
              // console.log('ℹ️ CompanyContext: Nenhuma empresa salva, selecionando preferida:', preferredCompany.id);
              localStorage.setItem(
                'dream_keys_selected_company_id',
                preferredCompany.id
              );
            }
            return preferredCompany || null;
          }
        }
        return currentSelected;
      });
    } catch (err: any) {
      console.error('❌ CompanyContext: Erro ao carregar empresas:', err);
      console.error('❌ CompanyContext: User role:', userRole);
      console.error('❌ CompanyContext: Error response:', err.response);
      console.error('❌ CompanyContext: Error status:', err.response?.status);
      console.error('❌ CompanyContext: Error data:', err.response?.data);

      // Tratar diferentes tipos de erro
      if (
        err.code === 'NETWORK_ERROR' ||
        err.message?.includes('Network Error')
      ) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else if (err.response?.status === 403) {
        // Se for erro 403 e o usuário for manager ou user, não mostrar erro
        if (userRole === 'manager' || userRole === 'user') {
          console.warn(
            '⚠️ CompanyContext: Manager/User não tem permissão para carregar empresas, isso é esperado'
          );
          setError(null); // Não mostrar erro
        } else {
          setError('Você não tem permissão para visualizar empresas.');
        }
      } else if (err.response?.status >= 500) {
        setError('Servidor indisponível. Tente novamente em alguns minutos.');
      } else {
        setError(err.message || 'Erro ao carregar empresas');
      }

      // Em caso de erro, manter estado vazio mas não quebrar a aplicação
      setCompanies([]);
      setSelectedCompany(null);

      // Se for erro 404 ou array vazio, marcar como "sem empresa" para evitar loops
      if (
        err.response?.status === 404 ||
        (err.response?.status === 200 &&
          Array.isArray(err.response?.data) &&
          err.response.data.length === 0)
      ) {
        console.log(
          '⚠️ CompanyContext: Usuário sem empresas, parando tentativas futuras'
        );
        hasLoadedCompanies.current = true; // Marcar como carregado para evitar loops
      }
    } finally {
      setIsLoading(false);
    }
  }, [userRole]); // Adicionado userRole às dependências

  // Selecionar empresa
  const selectCompany = (company: Company) => {
    setSelectedCompany(company);
    localStorage.setItem('dream_keys_selected_company_id', company.id);

    // console.log('✅ Empresa selecionada e salva no localStorage:', company.id);
    // Atualizar o token do usuário com a empresa selecionada (se necessário)
    // Isso pode ser implementado quando o backend suportar múltiplas empresas por usuário
  };

  // Limpar empresa selecionada
  const clearSelectedCompany = () => {
    setSelectedCompany(null);
    localStorage.removeItem('dream_keys_selected_company_id');
    hasLoadedCompanies.current = false; // Resetar ref para permitir novo carregamento
  };

  // Recarregar empresas
  const refreshCompanies = async () => {
    await loadCompanies();
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Adicionar nova empresa à lista (usado após criar uma empresa)
  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
    // Se não há empresa selecionada, selecionar a nova empresa
    if (!selectedCompany) {
      setSelectedCompany(company);
      localStorage.setItem('dream_keys_selected_company_id', company.id);
    }
  };

  // CORREÇÃO: Não carregar companies automaticamente - isso é feito no login
  // O CompanyContext agora apenas gerencia o estado das companies já carregadas
  // Removido useEffect que fazia chamada automática à API de companies
  useEffect(() => {
    // Apenas definir loading como false, sem fazer chamada à API
    setIsLoading(false);
  }, []); // Executar apenas uma vez na montagem

  // Limpar dados quando usuário faz logout e carregar quando faz login
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'dream_keys_access_token') {
        if (!e.newValue) {
          // Token foi removido, limpar dados da empresa
          clearSelectedCompany();
          setCompanies([]);
          hasLoadedCompanies.current = false; // Resetar ref para permitir novo carregamento
        } else if (e.newValue && companies.length === 0) {
          // Token foi adicionado mas não carregar companies automaticamente
          // As companies devem ser carregadas apenas quando necessário (ex: no login via useAuth)
          console.log(
            '🏢 CompanyContext: Token detectado, mas não carregando companies automaticamente'
          );
        }
      }

      // CORREÇÃO: Também detectar quando o ID da empresa é removido (logout)
      if (e.key === 'dream_keys_selected_company_id' && !e.newValue) {
        // ID da empresa foi removido, limpar estado
        setSelectedCompany(null);
        setCompanies([]);
        hasLoadedCompanies.current = false;
      }
    };

    // CORREÇÃO: Handler para evento de logout customizado
    const handleAuthLogout = () => {
      console.log('🏢 CompanyContext: Logout detectado, limpando empresas...');
      setSelectedCompany(null);
      setCompanies([]);
      hasLoadedCompanies.current = false;
    };

    // Também verificar mudanças no localStorage local (mesma aba)
    const handleLocalStorageChange = () => {
      const token = authStorage.getToken();
      const userData = authStorage.getUserData();

      if (!token && !userData) {
        // CORREÇÃO: Se não há dados de autenticação, limpar estado da empresa
        setSelectedCompany(null);
        setCompanies([]);
        hasLoadedCompanies.current = false;
      }
      // Removido carregamento automático de companies - devem ser carregadas apenas quando necessário
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleLocalStorageChange);
    window.addEventListener('auth-logout', handleAuthLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'localStorageChange',
        handleLocalStorageChange
      );
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, [companies.length, isLoading]); // REMOVIDO loadCompanies das dependências para evitar loop

  const value: CompanyContextType = {
    selectedCompany,
    companies,
    isLoading,
    error,
    selectCompany,
    refreshCompanies,
    clearSelectedCompany,
    clearError,
    addCompany,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
