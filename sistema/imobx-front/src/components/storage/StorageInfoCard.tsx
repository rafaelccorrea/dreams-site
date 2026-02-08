import React from 'react';
import { useTotalStorage } from '../../hooks/useTotalStorage';
import { useStorageLimits } from '../../hooks/useStorageLimits';
import { formatGB } from '../../utils/storageValidation';

interface StorageInfoCardProps {
  className?: string;
  compact?: boolean;
}

/**
 * Componente compacto para exibir informações de armazenamento
 * Ideal para uso em cards ou seções menores
 */
export function StorageInfoCard({
  className,
  compact = false,
}: StorageInfoCardProps) {
  const { data, loading, error } = useTotalStorage();
  const { data: limitsData } = useStorageLimits();

  if (loading) {
    return (
      <div className={className} style={{ padding: '16px' }}>
        Carregando informações de armazenamento...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={className} style={{ padding: '16px', color: 'red' }}>
        Erro ao carregar informações de armazenamento
      </div>
    );
  }

  // Calcular limite total
  const totalStorageLimitGB =
    data.totalStorageLimitGB !== undefined
      ? data.totalStorageLimitGB
      : (limitsData?.plans?.[0]?.limitGB ?? -1);

  const usagePercentage =
    totalStorageLimitGB === -1
      ? 0
      : Math.round((data.totalSizeGB / totalStorageLimitGB) * 100);

  const isNearLimit = usagePercentage >= 80;
  const isOverLimit = usagePercentage >= 100;

  if (compact) {
    return (
      <div className={className} style={{ padding: '12px' }}>
        <div style={{ marginBottom: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
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
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
          }}
        >
          <span>
            {formatGB(data.totalSizeGB)} /{' '}
            {totalStorageLimitGB === -1
              ? 'Ilimitado'
              : formatGB(totalStorageLimitGB)}
          </span>
          <span>{usagePercentage}% usado</span>
        </div>
        {isOverLimit && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#f8d7da',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#721c24',
            }}
          >
            ⚠️ Limite excedido
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '16px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Armazenamento</h3>
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            width: '100%',
            height: '16px',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
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
            {formatGB(data.totalSizeGB)} de{' '}
            {totalStorageLimitGB === -1
              ? 'Ilimitado'
              : formatGB(totalStorageLimitGB)}
          </span>
          <span>{usagePercentage}% usado</span>
        </div>
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          {data.totalFileCount} arquivos em {data.totalCompanies} empresa(s)
        </div>
      </div>

      {isNearLimit && !isOverLimit && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '14px',
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
            marginBottom: '12px',
            fontSize: '14px',
            color: '#721c24',
          }}
        >
          ❌ Limite de armazenamento excedido! Não é possível fazer novos
          uploads.
        </div>
      )}
    </div>
  );
}
