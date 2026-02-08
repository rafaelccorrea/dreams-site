import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types/chat';
import { useAuth } from './useAuth';

interface ArchivedMessagesStorage {
  [roomId: string]: string[]; // Array de IDs de mensagens arquivadas por sala
}

const STORAGE_KEY = 'chat_archived_messages';

/**
 * Hook para gerenciar mensagens arquivadas localmente
 * Armazena no localStorage para persistência
 */
export const useArchivedMessages = () => {
  const { getCurrentUser } = useAuth();
  const [archivedMessageIds, setArchivedMessageIds] =
    useState<ArchivedMessagesStorage>({});

  // Carregar mensagens arquivadas do localStorage ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ArchivedMessagesStorage;
        setArchivedMessageIds(parsed);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens arquivadas:', error);
    }
  }, []);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(archivedMessageIds));
    } catch (error) {
      console.error('Erro ao salvar mensagens arquivadas:', error);
    }
  }, [archivedMessageIds]);

  /**
   * Arquivar uma mensagem
   */
  const archiveMessage = useCallback((roomId: string, messageId: string) => {
    setArchivedMessageIds(prev => {
      const roomArchived = prev[roomId] || [];
      if (roomArchived.includes(messageId)) {
        return prev; // Já está arquivada
      }
      return {
        ...prev,
        [roomId]: [...roomArchived, messageId],
      };
    });
  }, []);

  /**
   * Desarquivar uma mensagem
   */
  const unarchiveMessage = useCallback((roomId: string, messageId: string) => {
    setArchivedMessageIds(prev => {
      const roomArchived = prev[roomId] || [];
      if (!roomArchived.includes(messageId)) {
        return prev; // Já está desarquivada
      }
      return {
        ...prev,
        [roomId]: roomArchived.filter(id => id !== messageId),
      };
    });
  }, []);

  /**
   * Verificar se uma mensagem está arquivada
   */
  const isMessageArchived = useCallback(
    (roomId: string, messageId: string): boolean => {
      return archivedMessageIds[roomId]?.includes(messageId) || false;
    },
    [archivedMessageIds]
  );

  /**
   * Obter todas as mensagens arquivadas de uma sala
   */
  const getArchivedMessageIds = useCallback(
    (roomId: string): string[] => {
      return archivedMessageIds[roomId] || [];
    },
    [archivedMessageIds]
  );

  /**
   * Contar mensagens arquivadas em uma sala
   */
  const getArchivedCount = useCallback(
    (roomId: string): number => {
      return archivedMessageIds[roomId]?.length || 0;
    },
    [archivedMessageIds]
  );

  /**
   * Filtrar mensagens arquivadas de uma lista de mensagens
   */
  const filterArchivedMessages = useCallback(
    (roomId: string, messages: ChatMessage[]): ChatMessage[] => {
      const archivedIds = archivedMessageIds[roomId] || [];
      return messages.filter(msg => !archivedIds.includes(msg.id));
    },
    [archivedMessageIds]
  );

  /**
   * Filtrar apenas mensagens arquivadas de uma lista de mensagens
   */
  const getArchivedMessages = useCallback(
    (roomId: string, messages: ChatMessage[]): ChatMessage[] => {
      const archivedIds = archivedMessageIds[roomId] || [];
      return messages.filter(msg => archivedIds.includes(msg.id));
    },
    [archivedMessageIds]
  );

  return {
    archiveMessage,
    unarchiveMessage,
    isMessageArchived,
    getArchivedMessageIds,
    getArchivedCount,
    filterArchivedMessages,
    getArchivedMessages,
  };
};
