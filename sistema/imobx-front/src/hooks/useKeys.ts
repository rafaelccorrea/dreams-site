import { useState, useEffect, useCallback } from 'react';
import keyService, {
  type Key,
  type KeyControl,
  type CreateKeyData,
  type UpdateKeyData,
  type CreateKeyControlData,
  type ReturnKeyData,
  type KeyStatistics,
} from '../services/keyService';
import { useToast } from './useToast';
import { useAutoReloadOnCompanyChange } from './useCompanyMonitor';

export const useKeys = (propertyId?: string) => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getAllKeys(propertyId);
      // Garantir que sempre seja um array
      const keysArray = Array.isArray(data)
        ? data
        : data?.keys && Array.isArray(data.keys)
          ? data.keys
          : [];
      setKeys(keysArray);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar chaves');
      showToast('Erro ao carregar chaves', 'error');
      setKeys([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, [propertyId, showToast]);

  const createKey = useCallback(
    async (data: CreateKeyData) => {
      try {
        const newKey = await keyService.createKey(data);
        setKeys(prev => [newKey, ...prev]);
        showToast('Chave criada com sucesso', 'success');
        return newKey;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao criar chave';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  const updateKey = useCallback(
    async (id: string, data: UpdateKeyData) => {
      try {
        const updatedKey = await keyService.updateKey(id, data);
        setKeys(prev => prev.map(key => (key.id === id ? updatedKey : key)));
        showToast('Chave atualizada com sucesso', 'success');
        return updatedKey;
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Erro ao atualizar chave';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  const deleteKey = useCallback(
    async (id: string) => {
      try {
        await keyService.deleteKey(id);
        setKeys(prev => prev.filter(key => key.id !== id));
        showToast('Chave excluída com sucesso', 'success');
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao excluir chave';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  // Função para atualizar o status de uma chave após checkout/return
  const updateKeyStatus = useCallback(
    (keyId: string, newStatus: 'available' | 'in_use') => {
      setKeys(prev =>
        prev.map(key =>
          key.id === keyId ? { ...key, status: newStatus } : key
        )
      );
    },
    []
  );

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  // Função estável para recarregar chaves (sem dependências para evitar loop)
  const reloadKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getAllKeys(propertyId);
      // Garantir que sempre seja um array
      const keysArray = Array.isArray(data)
        ? data
        : data?.keys && Array.isArray(data.keys)
          ? data.keys
          : [];
      setKeys(keysArray);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao recarregar chaves');
      console.error('Erro ao recarregar chaves:', err);
      setKeys([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar chaves automaticamente
  useAutoReloadOnCompanyChange(reloadKeys);

  return {
    keys,
    loading,
    error,
    refetch: fetchKeys,
    createKey,
    updateKey,
    deleteKey,
    updateKeyStatus,
  };
};

export const useKeyControls = (
  status?: 'checked_out' | 'returned' | 'overdue' | 'lost'
) => {
  const [keyControls, setKeyControls] = useState<KeyControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchKeyControls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getAllKeyControls(status);
      // Garantir que sempre seja um array
      const controlsArray = Array.isArray(data)
        ? data
        : data?.keyControls && Array.isArray(data.keyControls)
          ? data.keyControls
          : [];
      setKeyControls(controlsArray);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao carregar controles de chave'
      );
      showToast('Erro ao carregar controles de chave', 'error');
      setKeyControls([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, [status, showToast]);

  const checkoutKey = useCallback(
    async (data: CreateKeyControlData) => {
      try {
        setLoading(true);
        const newControl = await keyService.checkoutKey(data);
        setKeyControls(prev => [newControl, ...prev]);
        showToast('Chave retirada com sucesso! ✅', 'success');
        return newControl;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao retirar chave';
        showToast(message, 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const returnKey = useCallback(
    async (keyControlId: string, data: ReturnKeyData) => {
      try {
        setLoading(true);
        const returnedControl = await keyService.returnKey(keyControlId, data);
        setKeyControls(prev =>
          prev.map(control =>
            control.id === keyControlId ? returnedControl : control
          )
        );
        showToast('Chave devolvida com sucesso! ✅', 'success');
        return returnedControl;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao devolver chave';
        showToast(message, 'error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchKeyControls();
  }, [fetchKeyControls]);

  // Função estável para recarregar controles (sem dependências para evitar loop)
  const reloadKeyControls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getAllKeyControls(status);
      // Garantir que sempre seja um array
      const controlsArray = Array.isArray(data)
        ? data
        : data?.keyControls && Array.isArray(data.keyControls)
          ? data.keyControls
          : [];
      setKeyControls(controlsArray);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao recarregar controles de chave'
      );
      console.error('Erro ao recarregar controles de key:', err);
      setKeyControls([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar controles automaticamente
  useAutoReloadOnCompanyChange(reloadKeyControls);

  return {
    keyControls,
    loading,
    error,
    refetch: fetchKeyControls,
    checkoutKey,
    returnKey,
  };
};

export const useUserKeyControls = (
  status?: 'checked_out' | 'returned' | 'overdue' | 'lost'
) => {
  const [keyControls, setKeyControls] = useState<KeyControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchUserKeyControls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getUserKeyControls(status);
      // Garantir que sempre seja um array
      const controlsArray = Array.isArray(data)
        ? data
        : data?.keyControls && Array.isArray(data.keyControls)
          ? data.keyControls
          : [];
      setKeyControls(controlsArray);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar suas chaves');
      showToast('Erro ao carregar suas chaves', 'error');
      setKeyControls([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, [status, showToast]);

  const checkoutKey = useCallback(
    async (data: CreateKeyControlData) => {
      try {
        const newControl = await keyService.checkoutKey(data);
        setKeyControls(prev => [newControl, ...prev]);
        showToast('Chave retirada com sucesso', 'success');
        return newControl;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao retirar chave';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  const returnKey = useCallback(
    async (keyControlId: string, data: ReturnKeyData) => {
      try {
        const returnedControl = await keyService.returnKey(keyControlId, data);
        setKeyControls(prev =>
          prev.map(control =>
            control.id === keyControlId ? returnedControl : control
          )
        );
        showToast('Chave devolvida com sucesso', 'success');
        return returnedControl;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao devolver chave';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchUserKeyControls();
  }, [fetchUserKeyControls]);

  // Função estável para recarregar controles do usuário (sem dependências para evitar loop)
  const reloadUserKeyControls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getUserKeyControls(status);
      // Garantir que sempre seja um array
      const controlsArray = Array.isArray(data)
        ? data
        : data?.keyControls && Array.isArray(data.keyControls)
          ? data.keyControls
          : [];
      setKeyControls(controlsArray);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao recarregar suas chaves');
      console.error('Erro ao recarregar suas chaves:', err);
      setKeyControls([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar controles do usuário automaticamente
  useAutoReloadOnCompanyChange(reloadUserKeyControls);

  return {
    keyControls,
    loading,
    error,
    refetch: fetchUserKeyControls,
    checkoutKey,
    returnKey,
  };
};

export const useKeyStatistics = () => {
  const [statistics, setStatistics] = useState<KeyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getKeyStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estatísticas');
      showToast('Erro ao carregar estatísticas', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Função estável para recarregar estatísticas (sem dependências para evitar loop)
  const reloadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getKeyStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao recarregar estatísticas'
      );
      console.error('Erro ao recarregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar estatísticas automaticamente
  useAutoReloadOnCompanyChange(reloadStatistics);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};

export const useOverdueKeys = () => {
  const [overdueKeys, setOverdueKeys] = useState<KeyControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchOverdueKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getOverdueKeys();
      // Garantir que sempre seja um array
      const overdueArray = Array.isArray(data)
        ? data
        : data?.overdueKeys && Array.isArray(data.overdueKeys)
          ? data.overdueKeys
          : [];
      setOverdueKeys(overdueArray);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao carregar chaves em atraso'
      );
      showToast('Erro ao carregar chaves em atraso', 'error');
      setOverdueKeys([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchOverdueKeys();
  }, [fetchOverdueKeys]);

  // Função estável para recarregar chaves em atraso (sem dependências para evitar loop)
  const reloadOverdueKeys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await keyService.getOverdueKeys();
      // Garantir que sempre seja um array
      const overdueArray = Array.isArray(data)
        ? data
        : data?.overdueKeys && Array.isArray(data.overdueKeys)
          ? data.overdueKeys
          : [];
      setOverdueKeys(overdueArray);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao recarregar chaves em atraso'
      );
      console.error('Erro ao recarregar chaves em atraso:', err);
      setOverdueKeys([]); // Garantir que seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar loop

  // Monitorar mudanças de empresa e recarregar chaves em atraso automaticamente
  useAutoReloadOnCompanyChange(reloadOverdueKeys);

  return {
    overdueKeys,
    loading,
    error,
    refetch: fetchOverdueKeys,
  };
};
