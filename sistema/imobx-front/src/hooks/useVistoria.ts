import { useState, useEffect, useCallback } from 'react';
import { inspectionApi } from '../services/vistoriaApi';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';
import type {
  Inspection,
  CreateInspectionRequest,
  UpdateInspectionRequest,
  InspectionFilter,
  InspectionListResponse,
} from '../types/vistoria-types';

export const useInspection = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInspection = useCallback(
    async (data: CreateInspectionRequest) => {
      try {
        setLoading(true);
        setError(null);
        const newInspection = await inspectionApi.create(data);
        setInspections(prev => [newInspection, ...prev]);
        return newInspection;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao criar inspeção');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateInspection = useCallback(
    async (id: string, data: UpdateInspectionRequest) => {
      try {
        setLoading(true);
        setError(null);
        const updatedInspection = await inspectionApi.update(id, data);
        setInspections(prev =>
          prev.map(v => (v.id === id ? updatedInspection : v))
        );
        return updatedInspection;
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao atualizar inspeção');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteInspection = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await inspectionApi.delete(id);
      setInspections(prev => prev.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir inspeção');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPhoto = useCallback(async (id: string, file: File) => {
    try {
      setLoading(true);
      setError(null);
      const updatedInspection = await inspectionApi.uploadPhoto(id, file);
      setInspections(prev =>
        prev.map(v => (v.id === id ? updatedInspection : v))
      );
      return updatedInspection;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer upload da foto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removePhoto = useCallback(async (id: string, photoUrl: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedInspection = await inspectionApi.removePhoto(id, photoUrl);
      setInspections(prev =>
        prev.map(v => (v.id === id ? updatedInspection : v))
      );
      return updatedInspection;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover foto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    inspections,
    loading,
    error,
    createInspection,
    updateInspection,
    deleteInspection,
    uploadPhoto,
    removePhoto,
    setError,
  };
};

export const useInspectionList = (filters: InspectionFilter = {}) => {
  const [data, setData] = useState<InspectionListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inspectionApi.list(filters);
      setData(response);
    } catch (err: any) {
      // CORREÇÃO: Verificar se é erro de módulo não disponível no plano
      const errorMessage =
        err.response?.data?.message ||
        err.moduleErrorMessage ||
        'Erro ao carregar inspeções';

      if (err.isModuleNotAvailable) {
        setError('MODULE_NOT_AVAILABLE');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  // Função estável para recarregar inspeções (sem dependências para evitar loop)
  const reloadInspections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inspectionApi.list(filters);
      setData(response);
      // console.log('✅ Inspeções recarregadas após mudança de empresa');
    } catch (error: any) {
      console.error(
        '❌ Erro ao recarregar inspeções após mudança de empresa:',
        error
      );
      setError(error.response?.data?.message || 'Erro ao recarregar inspeções');
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar inspeções automaticamente
  useAutoReloadOnCompanyChange(reloadInspections);

  return {
    data,
    loading,
    error,
    refetch: fetchInspections,
  };
};

export const useInspectionById = (id: string | null) => {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInspection = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      // console.log('🔍 useInspectionById - Buscando inspeção com ID:', id);
      const response = await inspectionApi.getById(id);
      // console.log('🔍 useInspectionById - Resposta recebida:', response);
      setInspection(response);
    } catch (err: any) {
      console.error('🔍 useInspectionById - Erro:', err);
      setError(err.response?.data?.message || 'Erro ao carregar inspeção');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  return {
    inspection,
    loading,
    error,
    refetch: fetchInspection,
  };
};

export const useInspectionByProperty = (propertyId: string | null) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInspections = useCallback(async () => {
    if (!propertyId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await inspectionApi.getByProperty(propertyId);
      setInspections(response);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao carregar inspeções da propriedade'
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  return {
    inspections,
    loading,
    error,
    refetch: fetchInspections,
  };
};

// Manter compatibilidade com código existente
export const useVistoria = useInspection;
export const useVistoriaList = useInspectionList;
export const useVistoriaById = useInspectionById;
export const useVistoriaByProperty = useInspectionByProperty;
