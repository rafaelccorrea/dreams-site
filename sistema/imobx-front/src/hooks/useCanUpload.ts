import { useState } from 'react';
import { storageApi } from '../services/storageApi';
import type { CanUploadResponse } from '../types/storage';

/**
 * Hook para verificar se pode fazer upload de um arquivo
 *
 * @example
 * ```tsx
 * const { checkCanUpload, checking } = useCanUpload();
 *
 * const handleFileSelect = async (file: File) => {
 *   const result = await checkCanUpload(file.size);
 *   if (!result.canUpload) {
 *     alert(result.reason);
 *     return;
 *   }
 *   // Prosseguir com upload
 * };
 * ```
 */
export function useCanUpload() {
  const [checking, setChecking] = useState(false);

  const checkCanUpload = async (
    fileSizeBytes: number
  ): Promise<CanUploadResponse> => {
    setChecking(true);
    try {
      const result = await storageApi.canUpload(fileSizeBytes);
      return result;
    } catch (error) {
      // Em caso de erro, assumir que não pode fazer upload
      console.error('Error checking can upload:', error);
      throw error;
    } finally {
      setChecking(false);
    }
  };

  return { checkCanUpload, checking };
}
