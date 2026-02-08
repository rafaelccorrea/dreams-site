import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { propertyApi } from '../services/propertyApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import { useAuth } from './useAuth';
import type {
  Property,
  CreatePropertyData,
  UpdatePropertyData,
  PropertyFilters,
  PaginationOptions,
} from '../types/property';

interface UsePropertiesReturn {
  // Estados
  properties: Property[];
  currentProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;

  // Ações
  createProperty: (data: CreatePropertyData) => Promise<Property>;
  getPropertyById: (id: string) => Promise<Property>;
  getProperties: (
    filters?: PropertyFilters,
    pagination?: PaginationOptions
  ) => Promise<void>;
  updateProperty: (id: string, data: UpdatePropertyData) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertiesByCompany: (
    companyId: string,
    pagination?: PaginationOptions
  ) => Promise<void>;
  getPropertiesByResponsibleUser: (
    userId: string,
    pagination?: PaginationOptions
  ) => Promise<void>;
  getFeaturedProperties: (pagination?: PaginationOptions) => Promise<void>;
  getPropertiesByLocation: (
    city: string,
    state: string,
    pagination?: PaginationOptions
  ) => Promise<void>;
  getPropertyStats: () => Promise<any>;

  // Utilitários
  clearError: () => void;
  setCurrentProperty: (property: Property | null) => void;
  refreshProperties: () => Promise<void>;
}

export const useProperties = (): UsePropertiesReturn => {
  const { getCurrentUser } = useAuth();

  // Estados principais
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filtros e paginação atuais (para refresh)
  const [currentFilters, setCurrentFilters] = useState<PropertyFilters>({});
  const [currentPagination, setCurrentPagination] = useState<PaginationOptions>(
    {
      page: 1,
      limit: 10,
    }
  );

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Criar propriedade
  const createProperty = useCallback(
    async (data: CreatePropertyData): Promise<Property> => {
      setIsLoading(true);
      setError(null);

      try {
        // Obter ID do usuário atual (captador)
        const currentUser = getCurrentUser();
        if (!currentUser?.id) {
          throw new Error('Usuário não autenticado');
        }

        // Garantir que capturedById está presente
        const propertyData: CreatePropertyData = {
          ...data,
          capturedById: data.capturedById || currentUser.id,
        };

        // console.log('🏠 Criando propriedade via hook...');
        const getErrorMessage = (error: any) =>
          error?.response?.data?.message ||
          error?.message ||
          'Erro ao criar propriedade';

        const newProperty = await toast.promise(
          propertyApi.createProperty(propertyData),
          {
            pending: 'Criando propriedade...',
            success: 'Propriedade criada com sucesso!',
            error: {
              render({ data }) {
                return getErrorMessage(data);
              },
            },
          }
        );

        // Adicionar à lista local se estivermos na primeira página
        setProperties(prev => [newProperty, ...prev]);

        // console.log('✅ Propriedade criada via hook:', newProperty);
        return newProperty;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'Erro ao criar propriedade';
        console.error('❌ Erro ao criar propriedade via hook:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [getCurrentUser]
  );

  // Buscar propriedade por ID
  const getPropertyById = useCallback(async (id: string): Promise<Property> => {
    setIsLoading(true);
    setError(null);

    try {
      // console.log('🔍 Buscando propriedade por ID via hook...');
      const property = await propertyApi.getPropertyById(id);
      setCurrentProperty(property);

      // console.log('✅ Propriedade encontrada via hook:', property);
      return property;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar propriedade';
      console.error('❌ Erro ao buscar propriedade via hook:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listar propriedades
  const getProperties = useCallback(
    async (
      filters: PropertyFilters = {},
      pagination: PaginationOptions = { page: 1, limit: 10 }
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('📋 Listando propriedades via hook...', { filters, pagination });
        // Salvar filtros e paginação atuais
        setCurrentFilters(filters);
        setCurrentPagination(pagination);

        const response = await propertyApi.getProperties(filters, pagination);

        setProperties(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao listar propriedades';
        console.error('❌ Erro ao listar propriedades via hook:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Carregar propriedades automaticamente quando o hook é inicializado
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await propertyApi.getProperties(
          {},
          { page: 1, limit: 100 }
        );
        setProperties(response.data || []);
        setTotal(response.total || 0);
        setCurrentPage(response.page || 1);
        setTotalPages(response.totalPages || 1);
      } catch (error: any) {
        console.error('Erro ao carregar propriedades automaticamente:', error);
        setError(
          error.response?.data?.message || 'Erro ao carregar propriedades'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []); // Sem dependências para evitar loop infinito

  // Função estável para recarregar propriedades (sem dependências para evitar loop)
  const reloadProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await propertyApi.getProperties(
        {},
        { page: 1, limit: 100 }
      );
      setProperties(response.data || []);
      setTotal(response.total || 0);
      setCurrentPage(response.page || 1);
      setTotalPages(response.totalPages || 1);
    } catch (error: any) {
      console.error(
        'Erro ao recarregar propriedades após mudança de empresa:',
        error
      );
      setError(
        error.response?.data?.message || 'Erro ao recarregar propriedades'
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar propriedades automaticamente
  useAutoReloadOnCompanyChange(reloadProperties);

  // Atualizar propriedade
  const updateProperty = useCallback(
    async (id: string, data: UpdatePropertyData): Promise<Property> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('✏️ Atualizando propriedade via hook...');
        const updatedProperty = await propertyApi.updateProperty(id, data);

        // Atualizar na lista local
        setProperties(prev =>
          prev.map(property =>
            property.id === id ? updatedProperty : property
          )
        );

        // Atualizar propriedade atual se for a mesma
        if (currentProperty?.id === id) {
          setCurrentProperty(updatedProperty);
        }

        // console.log('✅ Propriedade atualizada via hook:', updatedProperty);
        return updatedProperty;
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao atualizar propriedade';
        console.error(
          '❌ Erro ao atualizar propriedade via hook:',
          errorMessage
        );
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProperty?.id]
  );

  // Excluir propriedade
  const deleteProperty = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('🗑️ Excluindo propriedade via hook...');
        await propertyApi.deleteProperty(id);

        // Remover da lista local
        setProperties(prev => prev.filter(property => property.id !== id));

        // Limpar propriedade atual se for a mesma
        if (currentProperty?.id === id) {
          setCurrentProperty(null);
        }

        // console.log('✅ Propriedade excluída via hook');
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao excluir propriedade';
        console.error('❌ Erro ao excluir propriedade via hook:', errorMessage);
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProperty?.id]
  );

  // Buscar propriedades por empresa
  const getPropertiesByCompany = useCallback(
    async (
      companyId: string,
      pagination: PaginationOptions = { page: 1, limit: 10 }
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('🏢 Buscando propriedades da empresa via hook...');
        const response = await propertyApi.getPropertiesByCompany(
          companyId,
          pagination
        );

        setProperties(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao buscar propriedades da empresa';
        console.error(
          '❌ Erro ao buscar propriedades da empresa via hook:',
          errorMessage
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar propriedades por usuário responsável
  const getPropertiesByResponsibleUser = useCallback(
    async (
      userId: string,
      pagination: PaginationOptions = { page: 1, limit: 10 }
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('👤 Buscando propriedades do usuário via hook...');
        const response = await propertyApi.getPropertiesByResponsibleUser(
          userId,
          pagination
        );

        setProperties(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao buscar propriedades do usuário';
        console.error(
          '❌ Erro ao buscar propriedades do usuário via hook:',
          errorMessage
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar propriedades destacadas
  const getFeaturedProperties = useCallback(
    async (
      pagination: PaginationOptions = { page: 1, limit: 10 }
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('⭐ Buscando propriedades destacadas via hook...');
        const response = await propertyApi.getFeaturedProperties(pagination);

        setProperties(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao buscar propriedades destacadas';
        console.error(
          '❌ Erro ao buscar propriedades destacadas via hook:',
          errorMessage
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar propriedades por localização
  const getPropertiesByLocation = useCallback(
    async (
      city: string,
      state: string,
      pagination: PaginationOptions = { page: 1, limit: 10 }
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // console.log('📍 Buscando propriedades por localização via hook...');
        const response = await propertyApi.getPropertiesByLocation(
          city,
          state,
          pagination
        );

        setProperties(response.data);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        const errorMessage =
          err.message || 'Erro ao buscar propriedades por localização';
        console.error(
          '❌ Erro ao buscar propriedades por localização via hook:',
          errorMessage
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Buscar estatísticas
  const getPropertyStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // console.log('📊 Buscando estatísticas via hook...');
      const stats = await propertyApi.getPropertyStats();

      // console.log('✅ Estatísticas encontradas via hook:', stats);
      return stats;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar estatísticas';
      console.error('❌ Erro ao buscar estatísticas via hook:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Atualizar propriedade atual
  const setCurrentPropertyCallback = useCallback(
    (property: Property | null) => {
      setCurrentProperty(property);
    },
    []
  );

  // Atualizar lista com filtros e paginação atuais
  const refreshProperties = useCallback(async (): Promise<void> => {
    await getProperties(currentFilters, currentPagination);
  }, [getProperties, currentFilters, currentPagination]);

  return {
    // Estados
    properties,
    currentProperty,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,

    // Ações
    createProperty,
    getPropertyById,
    getProperties,
    updateProperty,
    deleteProperty,
    getPropertiesByCompany,
    getPropertiesByResponsibleUser,
    getFeaturedProperties,
    getPropertiesByLocation,
    getPropertyStats,

    // Utilitários
    clearError,
    setCurrentProperty: setCurrentPropertyCallback,
    refreshProperties,
  };
};
