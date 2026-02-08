import { useMemo } from 'react';
import { useAuth } from './useAuth';

/**
 * Hook para filtrar dados com base na hierarquia do usuário
 *
 * @param data - Array de dados a serem filtrados
 * @param ownerField - Nome do campo que indica o dono do registro (padrão: 'userId')
 * @returns Array filtrado com base nas permissões do usuário
 *
 * @example
 * const filteredDocuments = useFilteredData(documents, 'uploadedById');
 * const filteredClients = useFilteredData(clients, 'responsibleUserId');
 */
export function useFilteredData<T extends Record<string, any>>(
  data: T[],
  ownerField: keyof T = 'userId' as keyof T
): T[] {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return [];

    // MASTER e ADMIN veem tudo
    if (user.role === 'master' || user.role === 'admin') {
      return data;
    }

    // MANAGER vê seus dados + dos gerenciados
    if (user.role === 'manager') {
      const accessibleIds = [user.id, ...(user.managedUserIds || [])];
      return data.filter(item => accessibleIds.includes(item[ownerField]));
    }

    // USER vê apenas seus dados
    return data.filter(item => item[ownerField] === user.id);
  }, [data, user, ownerField]);
}
