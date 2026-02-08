import { useState, useCallback } from 'react';
import type {
  TokenInfo,
  ValidateCpfResponse,
  PublicUploadDocumentDto,
  PublicUploadMultipleDto,
  PublicUploadResponse,
  PublicUploadMultipleResponse,
} from '../types/document';
import {
  getTokenInfo,
  validateClientCpf,
  uploadPublicDocument,
  uploadMultiplePublicDocuments,
  validatePublicFile,
} from '../services/uploadTokenApi';

export const usePublicDocumentUpload = (token: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [cpfValidated, setCpfValidated] = useState(false);
  const [clientName, setClientName] = useState<string>('');
  const [validatedCpf, setValidatedCpf] = useState<string>('');
  const [uploadedDocuments, setUploadedDocuments] = useState<
    PublicUploadResponse[]
  >([]);

  /**
   * Verificar informações do token
   */
  const checkToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const info = await getTokenInfo(token);
      setTokenInfo(info);

      // NUNCA tratar erro de CPF como erro de token
      // O endpoint /info não deveria validar CPF, mas se validar, ignoramos
      const isCpfError =
        info.message &&
        (info.message.includes('CPF') ||
          info.message.includes('cpf') ||
          info.message.includes('cliente deste link'));

      if (!info.valid && !isCpfError) {
        setError(info.message);
      }

      // Se é erro de CPF, consideramos o token válido para prosseguir
      return isCpfError ? { valid: true, message: 'Token válido' } : info;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Link inválido ou expirado';
      setError(errorMessage);
      setTokenInfo({ valid: false, message: errorMessage });
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Validar CPF do cliente
   */
  const validateCpf = useCallback(
    async (cpf: string): Promise<ValidateCpfResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await validateClientCpf(token, cpf);

        if (result.valid) {
          setCpfValidated(true);
          setClientName(result.clientName || '');
          setValidatedCpf(cpf);
        } else {
          setError(
            result.message || 'CPF não corresponde ao cliente deste link'
          );
        }

        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao validar CPF';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  /**
   * Upload de documento único
   */
  const uploadDocument = useCallback(
    async (
      data: Omit<PublicUploadDocumentDto, 'cpf'>
    ): Promise<PublicUploadResponse | null> => {
      if (!cpfValidated || !validatedCpf) {
        setError('CPF não validado. Valide seu CPF antes de fazer upload.');
        return null;
      }

      // Validar arquivo
      const validation = validatePublicFile(data.file);
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await uploadPublicDocument(token, {
          ...data,
          cpf: validatedCpf,
        });

        // Adicionar à lista de documentos enviados
        setUploadedDocuments(prev => [...prev, result]);

        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao enviar documento';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, cpfValidated, validatedCpf]
  );

  /**
   * Upload de múltiplos documentos
   */
  const uploadMultiple = useCallback(
    async (
      data: Omit<PublicUploadMultipleDto, 'cpf'>
    ): Promise<PublicUploadMultipleResponse | null> => {
      if (!cpfValidated || !validatedCpf) {
        setError('CPF não validado. Valide seu CPF antes de fazer upload.');
        return null;
      }

      // Validar todos os arquivos
      const errors: string[] = [];
      data.files.forEach(file => {
        const validation = validatePublicFile(file);
        if (!validation.valid) {
          errors.push(validation.error!);
        }
      });

      if (errors.length > 0) {
        setError(`Erros encontrados:\n${errors.join('\n')}`);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await uploadMultiplePublicDocuments(token, {
          ...data,
          cpf: validatedCpf,
        });

        // Adicionar à lista de documentos enviados
        setUploadedDocuments(prev => [...prev, ...result.documents]);

        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'Erro ao enviar documentos';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, cpfValidated, validatedCpf]
  );

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resetar validação de CPF
   */
  const resetCpfValidation = useCallback(() => {
    setCpfValidated(false);
    setClientName('');
    setValidatedCpf('');
    setUploadedDocuments([]);
  }, []);

  return {
    loading,
    error,
    tokenInfo,
    cpfValidated,
    clientName,
    uploadedDocuments,
    checkToken,
    validateCpf,
    uploadDocument,
    uploadMultiple,
    clearError,
    resetCpfValidation,
  };
};
