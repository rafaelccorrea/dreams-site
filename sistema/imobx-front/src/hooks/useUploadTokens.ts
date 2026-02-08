import { useState, useCallback } from 'react';
import type { UploadToken, CreateUploadTokenDto } from '../types/document';
import {
  createUploadToken,
  listUploadTokens,
  sendUploadTokenByEmail,
  revokeUploadToken,
} from '../services/uploadTokenApi';

export const useUploadTokens = () => {
  const [tokens, setTokens] = useState<UploadToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Listar todos os tokens criados pelo corretor
   */
  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listUploadTokens();
      setTokens(data);
      return data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar links de upload';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Criar novo token de upload
   */
  const createToken = useCallback(
    async (data: CreateUploadTokenDto): Promise<UploadToken | null> => {
      setLoading(true);
      setError(null);

      try {
        const newToken = await createUploadToken(data);
        setTokens(prev => [newToken, ...prev]);
        return newToken;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao criar link de upload';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Enviar token por email
   */
  const sendEmail = useCallback(
    async (
      tokenId: string
    ): Promise<{ success: boolean; message: string } | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await sendUploadTokenByEmail(tokenId);
        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao enviar email';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Revogar token de upload
   */
  const revokeToken = useCallback(async (tokenId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await revokeUploadToken(tokenId);
      // Atualizar lista local
      setTokens(prev =>
        prev.map(token =>
          token.id === tokenId
            ? { ...token, status: 'revoked' as const }
            : token
        )
      );
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao revogar link';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tokens,
    loading,
    error,
    fetchTokens,
    createToken,
    sendEmail,
    revokeToken,
    clearError,
  };
};
