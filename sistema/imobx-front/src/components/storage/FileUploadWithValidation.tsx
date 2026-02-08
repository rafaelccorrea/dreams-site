import React, { useState } from 'react';
import { useCanUpload } from '../../hooks/useCanUpload';

interface FileUploadWithValidationProps {
  onUpload: (file: File) => Promise<void>;
  maxSizeMB?: number;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente de upload de arquivo com validação de armazenamento
 *
 * Valida o tamanho do arquivo e verifica se há espaço disponível
 * no armazenamento antes de permitir o upload.
 */
export function FileUploadWithValidation({
  onUpload,
  maxSizeMB = 10,
  accept,
  multiple = false,
  disabled = false,
  className,
}: FileUploadWithValidationProps) {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { checkCanUpload, checking } = useCanUpload();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const selectedFile = selectedFiles[0];
    const selectedFilesArray = Array.from(selectedFiles);

    // Validar tamanho máximo do arquivo
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = selectedFilesArray.filter(
      f => f.size > maxSizeBytes
    );

    if (oversizedFiles.length > 0) {
      setUploadError(
        `Arquivo(s) muito grande(s). Tamanho máximo: ${maxSizeMB}MB`
      );
      setFile(null);
      setFiles([]);
      return;
    }

    // Verificar se pode fazer upload (considera limite de armazenamento)
    try {
      const totalSize = selectedFilesArray.reduce((sum, f) => sum + f.size, 0);
      const canUpload = await checkCanUpload(totalSize);

      if (!canUpload.canUpload) {
        setUploadError(
          canUpload.reason ||
            `Limite de armazenamento excedido. Uso atual: ${canUpload.totalStorageUsedGB.toFixed(2)} GB de ${canUpload.totalStorageLimitGB} GB`
        );
        setFile(null);
        setFiles([]);
        return;
      }

      if (multiple) {
        setFiles(selectedFilesArray);
      } else {
        setFile(selectedFile);
      }
      setUploadError(null);
    } catch (error: any) {
      setUploadError(
        error?.response?.data?.message ||
          'Erro ao verificar disponibilidade de armazenamento'
      );
      setFile(null);
      setFiles([]);
    }
  };

  const handleUpload = async () => {
    if (multiple && files.length > 0) {
      try {
        for (const fileToUpload of files) {
          await onUpload(fileToUpload);
        }
        setFiles([]);
        setUploadError(null);
      } catch (error) {
        setUploadError('Erro ao fazer upload do(s) arquivo(s)');
      }
    } else if (file) {
      try {
        await onUpload(file);
        setFile(null);
        setUploadError(null);
      } catch (error) {
        setUploadError('Erro ao fazer upload do arquivo');
      }
    }
  };

  const selectedFiles = multiple ? files : file ? [file] : [];
  const totalSizeMB = selectedFiles.reduce(
    (sum, f) => sum + f.size / 1024 / 1024,
    0
  );

  return (
    <div className={className}>
      <input
        type='file'
        onChange={handleFileSelect}
        disabled={disabled || checking}
        accept={accept}
        multiple={multiple}
      />
      {uploadError && (
        <div style={{ color: 'red', marginTop: '8px' }}>{uploadError}</div>
      )}
      {selectedFiles.length > 0 && !uploadError && (
        <div style={{ marginTop: '16px' }}>
          <p>Arquivo(s) selecionado(s):</p>
          {selectedFiles.map((f, index) => (
            <p key={index}>
              {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          ))}
          <p>Tamanho total: {totalSizeMB.toFixed(2)} MB</p>
          <button onClick={handleUpload} disabled={checking || disabled}>
            {checking ? 'Verificando...' : 'Fazer Upload'}
          </button>
        </div>
      )}
    </div>
  );
}
