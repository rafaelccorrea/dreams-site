import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  MdRefresh,
  MdPause,
  MdPlayArrow,
  MdWifi,
  MdWifiOff,
  MdError,
} from 'react-icons/md';

// Animações
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StatusIndicator = styled.div<{
  status: 'connected' | 'disconnected' | 'loading' | 'error';
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;

  ${props => {
    switch (props.status) {
      case 'connected':
        return `
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'disconnected':
        return `
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        `;
      case 'loading':
        return `
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fed7aa;
        `;
      case 'error':
        return `
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        `;
      default:
        return `
          background: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        `;
    }
  }}

  &:hover {
    transform: scale(1.05);
  }
`;

const StatusIcon = styled.div<{
  status: 'connected' | 'disconnected' | 'loading' | 'error';
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => {
    switch (props.status) {
      case 'connected':
        return `
          color: #16a34a;
          animation: ${pulse} 2s ease-in-out infinite;
        `;
      case 'disconnected':
        return `
          color: #dc2626;
        `;
      case 'loading':
        return `
          color: #d97706;
          animation: ${spin} 1s linear infinite;
        `;
      case 'error':
        return `
          color: #dc2626;
        `;
      default:
        return `
          color: #6b7280;
        `;
    }
  }}
`;

const StatusText = styled.span`
  font-size: 11px;
`;

const LastUpdate = styled.span`
  font-size: 10px;
  opacity: 0.7;
  margin-left: 4px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

interface MonitoringStatusProps {
  status: 'connected' | 'disconnected' | 'loading' | 'error';
  lastUpdate?: Date | null;
  onRefresh?: () => void;
  onToggle?: (enabled: boolean) => void;
  enabled?: boolean;
  module?: string;
}

export const MonitoringStatus: React.FC<MonitoringStatusProps> = ({
  status,
  lastUpdate,
  onRefresh,
  onToggle,
  enabled = true,
  module = 'Sistema',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      case 'loading':
        return 'Carregando...';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <MdWifi size={14} />;
      case 'disconnected':
        return <MdWifiOff size={14} />;
      case 'loading':
        return <MdRefresh size={14} />;
      case 'error':
        return <MdError size={14} />;
      default:
        return <MdWifiOff size={14} />;
    }
  };

  const formatLastUpdate = () => {
    if (!lastUpdate) return '';

    const now = new Date();
    const diff = now.getTime() - lastUpdate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return `${seconds}s atrás`;
    } else if (minutes < 60) {
      return `${minutes}m atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return lastUpdate.toLocaleDateString('pt-BR');
    }
  };

  const handleClick = () => {
    if (status === 'error' && onRefresh) {
      onRefresh();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <StatusIndicator status={status} onClick={handleClick}>
      <StatusIcon status={status}>{getStatusIcon()}</StatusIcon>

      <StatusText>{getStatusText()}</StatusText>

      {lastUpdate && status === 'connected' && (
        <LastUpdate>{formatLastUpdate()}</LastUpdate>
      )}

      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            minWidth: '200px',
          }}
        >
          <div
            style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}
          >
            Monitoramento - {module}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {onRefresh && (
              <ControlButton
                onClick={e => {
                  e.stopPropagation();
                  onRefresh();
                }}
              >
                <MdRefresh size={12} />
                Atualizar Agora
              </ControlButton>
            )}

            {onToggle && (
              <ControlButton
                onClick={e => {
                  e.stopPropagation();
                  onToggle(!enabled);
                }}
              >
                {enabled ? <MdPause size={12} /> : <MdPlayArrow size={12} />}
                {enabled ? 'Pausar' : 'Retomar'} Monitoramento
              </ControlButton>
            )}
          </div>

          {lastUpdate && (
            <div
              style={{
                fontSize: '10px',
                color: '#6b7280',
                marginTop: '8px',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '8px',
              }}
            >
              Última atualização: {lastUpdate.toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      )}
    </StatusIndicator>
  );
};

export default MonitoringStatus;
