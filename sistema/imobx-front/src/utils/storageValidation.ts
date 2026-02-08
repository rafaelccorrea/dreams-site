import { storageApi } from '../services/storageApi';
import type { CanUploadResponse } from '../types/storage';

/**
 * Utilitário para validar armazenamento antes de fazer upload
 *
 * Esta função verifica se há espaço disponível no armazenamento
 * antes de permitir o upload de arquivos.
 *
 * @param fileSizeBytes - Tamanho do arquivo em bytes
 * @param throwError - Se true, lança erro em vez de retornar false (padrão: false)
 * @returns Promise<CanUploadResponse> - Resposta com informações sobre se pode fazer upload
 *
 * @example
 * ```typescript
 * // Verificar antes de upload
 * const canUpload = await validateStorageBeforeUpload(file.size);
 * if (!canUpload.canUpload) {
 *   alert(canUpload.reason || 'Limite de armazenamento excedido');
 *   return;
 * }
 * // Prosseguir com upload
 * ```
 */
export async function validateStorageBeforeUpload(
  fileSizeBytes: number,
  throwError: boolean = false
): Promise<CanUploadResponse> {
  try {
    const result = await storageApi.canUpload(fileSizeBytes);

    if (!result.canUpload && throwError) {
      throw new Error(
        result.reason ||
          `Limite de armazenamento excedido. Uso atual: ${result.totalStorageUsedGB.toFixed(2)} GB de ${result.totalStorageLimitGB} GB`
      );
    }

    return result;
  } catch (error: any) {
    // Se for erro de rede ou API, tratar adequadamente
    if (error.response?.status === 403) {
      const errorMessage =
        error.response?.data?.message || 'Limite de armazenamento excedido';

      if (throwError) {
        throw new Error(errorMessage);
      }

      return {
        canUpload: false,
        reason: errorMessage,
        totalStorageUsedGB: 0,
        totalStorageLimitGB: 0,
        remainingGB: 0,
        wouldExceed: true,
      };
    }

    // Outros erros
    console.error('Error validating storage:', error);

    if (throwError) {
      throw error;
    }

    // Em caso de erro na validação, assumir que não pode fazer upload por segurança
    return {
      canUpload: false,
      reason: 'Erro ao verificar disponibilidade de armazenamento',
      totalStorageUsedGB: 0,
      totalStorageLimitGB: 0,
      remainingGB: 0,
      wouldExceed: false,
    };
  }
}

/**
 * Valida múltiplos arquivos antes de fazer upload
 *
 * @param files - Array de arquivos para validar
 * @param throwError - Se true, lança erro em vez de retornar false
 * @returns Promise<CanUploadResponse> - Resposta com informações sobre se pode fazer upload
 */
export async function validateMultipleFilesStorage(
  files: File[],
  throwError: boolean = false
): Promise<CanUploadResponse> {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  return validateStorageBeforeUpload(totalSize, throwError);
}

/**
 * Formata bytes para formato legível
 *
 * @param bytes - Tamanho em bytes
 * @returns String formatada (ex: "1.5 GB", "500 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formata GB para formato legível
 *
 * @param gb - Tamanho em GB
 * @returns String formatada (ex: "1.5 GB", "0.5 GB")
 */
export function formatGB(gb: number): string {
  if (gb === 0) return '0 GB';
  if (gb < 1) {
    const mb = gb * 1024;
    return `${mb.toFixed(2)} MB`;
  }
  return `${gb.toFixed(2)} GB`;
}
