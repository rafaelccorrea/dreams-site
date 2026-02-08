import React, { useState, useEffect } from 'react';
import { useTotalStorage } from '../../hooks/useTotalStorage';
import { useCanUpload } from '../../hooks/useCanUpload';
import { useStorageLimits } from '../../hooks/useStorageLimits';

interface StorageManagementDashboardProps {
  className?: string;
  onUpload?: (file: File) => Promise<void>;
}

/**
 * Componente completo de gerenciamento de armazenamento
 *
 * Combina dashboard de armazenamento com validação de upload de arquivos.
 */
export function StorageManagementDashboard({
  className,
  onUpload,
}: StorageManagementDashboardProps) {
  const { data: storageData, loading, refetch } = useTotalStorage();
  const { checkCanUpload } = useCanUpload();
  const { data: limitsData } = useStorageLimits();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [canUpload, setCanUpload] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      checkCanUpload(selectedFile.size)
        .then(result => {
          setCanUpload(result.canUpload);
        })
        .catch(() => {
          setCanUpload(false);
        });
    } else {
      setCanUpload(null);
    }
  }, [selectedFile, checkCanUpload]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return;

    try {
      setUploading(true);
      await onUpload(selectedFile);
      setSelectedFile(null);
      setCanUpload(null);
      refetch(true); // Atualizar dados após upload
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className={className}>Carregando...</div>;
  }

  if (!storageData) {
    return null;
  }

  // Calcular limite total
  const totalStorageLimitGB =
    storageData.totalStorageLimitGB !== undefined
      ? storageData.totalStorageLimitGB
      : (limitsData?.plans?.[0]?.limitGB ?? -1);

  const usagePercentage =
    totalStorageLimitGB === -1
      ? 0
      : Math.round((storageData.totalSizeGB / totalStorageLimitGB) * 100);

  return (
    <div className={className}>
      <div style={{ marginBottom: '32px' }}>
        <h2>Gerenciamento de Armazenamento</h2>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3>Visão Geral</h3>
        <div
          style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: `${Math.min(usagePercentage, 100)}%`,
              height: '100%',
              backgroundColor:
                usagePercentage >= 100
                  ? '#f44336'
                  : usagePercentage >= 80
                    ? '#ff9800'
                    : '#4caf50',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p>
          {storageData.totalSizeGB.toFixed(2)} GB /{' '}
          {totalStorageLimitGB === -1
            ? 'Ilimitado'
            : `${totalStorageLimitGB} GB`}
        </p>
        <p>{storageData.totalFileCount} arquivos totais</p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3>Uso por Empresa</h3>
        {storageData.companies.map(company => (
          <div
            key={company.companyId}
            style={{
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              marginTop: '12px',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>{company.companyName}</h4>
            <p style={{ margin: '4px 0' }}>
              {company.totalSizeGB.toFixed(2)} GB
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
              {company.imagesCount} imagens, {company.documentsCount} documentos
            </p>
          </div>
        ))}
      </div>

      {onUpload && (
        <div style={{ marginTop: '32px' }}>
          <h3>Upload de Arquivo</h3>
          <input type='file' onChange={handleFileSelect} />
          {selectedFile && (
            <div style={{ marginTop: '16px' }}>
              <p>Arquivo: {selectedFile.name}</p>
              <p>Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              {canUpload === false && (
                <p style={{ color: 'red' }}>
                  ❌ Não é possível fazer upload. Limite excedido.
                </p>
              )}
              {canUpload === true && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{ marginTop: '8px' }}
                >
                  {uploading ? 'Fazendo upload...' : 'Fazer Upload'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <button onClick={() => refetch(true)}>Atualizar Dados</button>
      </div>
    </div>
  );
}
