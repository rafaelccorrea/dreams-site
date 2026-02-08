import React from 'react';
import { useTotalStorage } from '../../hooks/useTotalStorage';
import { useStorageLimits } from '../../hooks/useStorageLimits';
import type { CompanyStorageInfo } from '../../types/storage';

interface StorageDashboardProps {
  className?: string;
  showCompaniesBreakdown?: boolean;
  onRefresh?: () => void;
  storageLimitGB?: number; // Limite opcional que pode ser passado como prop
}

/**
 * Componente de dashboard de armazenamento
 *
 * Exibe o uso consolidado de armazenamento de todas as empresas do owner,
 * com barra de progresso e breakdown por empresa.
 */
export function StorageDashboard({
  className,
  showCompaniesBreakdown = true,
  onRefresh,
  storageLimitGB: propStorageLimitGB,
}: StorageDashboardProps) {
  const { data, loading, error, refetch } = useTotalStorage();
  const { data: limitsData } = useStorageLimits();

  const handleRefresh = () => {
    refetch(true); // Forçar recálculo
    onRefresh?.();
  };

  if (loading) {
    return <div className={className}>Carregando...</div>;
  }

  if (error) {
    return (
      <div className={className}>
        <div style={{ color: 'red' }}>Erro: {error}</div>
        <button onClick={handleRefresh}>Tentar novamente</button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Calcular limite total
  // Prioridade: prop > dados da API > buscar dos limites de planos
  const totalStorageLimitGB =
    propStorageLimitGB !== undefined
      ? propStorageLimitGB
      : data.totalStorageLimitGB !== undefined
        ? data.totalStorageLimitGB
        : (limitsData?.plans?.[0]?.limitGB ?? -1); // -1 significa ilimitado

  const usagePercentage =
    totalStorageLimitGB === -1
      ? 0
      : Math.round((data.totalSizeGB / totalStorageLimitGB) * 100);

  const isNearLimit = usagePercentage >= 80;
  const isOverLimit = usagePercentage >= 100;

  // Helper para calcular tamanho em GB de bytes
  const bytesToGB = (bytes: number) => bytes / 1024 / 1024 / 1024;

  return (
    <div className={className}>
      <div style={{ marginBottom: '24px' }}>
        <h2>Armazenamento</h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
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
              backgroundColor: isOverLimit
                ? '#f44336'
                : isNearLimit
                  ? '#ff9800'
                  : '#4caf50',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            {data.totalSizeGB.toFixed(2)} GB de{' '}
            {totalStorageLimitGB === -1
              ? 'Ilimitado'
              : `${totalStorageLimitGB} GB`}
          </span>
          <span>{usagePercentage}% usado</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          {data.totalFileCount} arquivos totais
        </div>
      </div>

      {isNearLimit && !isOverLimit && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#856404',
          }}
        >
          ⚠️ Você está usando {usagePercentage}% do seu armazenamento
        </div>
      )}

      {isOverLimit && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '16px',
            color: '#721c24',
          }}
        >
          ❌ Limite de armazenamento excedido! Não é possível fazer novos
          uploads.
        </div>
      )}

      {showCompaniesBreakdown && data.companies.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3>Uso por Empresa ({data.totalCompanies} empresas)</h3>
          {data.companies.map((company: CompanyStorageInfo) => (
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
                {company.totalSizeGB.toFixed(2)} GB ({company.fileCount}{' '}
                arquivos)
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                <span>
                  Imagens: {company.imagesCount} (
                  {bytesToGB(company.imagesSizeBytes).toFixed(2)} GB)
                </span>
                <span>
                  Documentos: {company.documentsCount} (
                  {bytesToGB(company.documentsSizeBytes).toFixed(2)} GB)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <button onClick={handleRefresh}>Atualizar</button>
      </div>
    </div>
  );
}
