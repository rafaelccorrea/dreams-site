import React from 'react';
import styled from 'styled-components';
import {
  useRealtimeMonitoring,
  MonitoringConfig,
} from '../../hooks/useRealtimeMonitoring';
import MonitoringStatus from './MonitoringStatus';

const MonitoringWrapper = styled.div`
  position: relative;
`;

const StatusContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
`;

interface RealtimeMonitoringWrapperProps {
  children: React.ReactNode;
  module: string;
  config?: Partial<MonitoringConfig>;
  showStatus?: boolean;
}

export const RealtimeMonitoringWrapper: React.FC<
  RealtimeMonitoringWrapperProps
> = ({ children, module, config = {}, showStatus = true }) => {
  const monitoringConfig: MonitoringConfig = {
    module,
    interval: 30000, // 30 segundos padrão
    enabled: true,
    ...config,
  };

  const {
    data,
    loading,
    error,
    lastUpdate,
    isConnected,
    refresh,
    toggleMonitoring,
  } = useRealtimeMonitoring(monitoringConfig);

  const getStatus = (): 'connected' | 'disconnected' | 'loading' | 'error' => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (isConnected) return 'connected';
    return 'disconnected';
  };

  return (
    <MonitoringWrapper>
      {showStatus && (
        <StatusContainer>
          <MonitoringStatus
            status={getStatus()}
            lastUpdate={lastUpdate}
            onRefresh={refresh}
            onToggle={toggleMonitoring}
            enabled={monitoringConfig.enabled}
            module={module}
          />
        </StatusContainer>
      )}

      {/* Renderizar children com dados de monitoramento */}
      {React.cloneElement(children as React.ReactElement, {
        monitoringData: data,
        monitoringLoading: loading,
        monitoringError: error,
        monitoringLastUpdate: lastUpdate,
        monitoringConnected: isConnected,
        onRefreshMonitoring: refresh,
        onToggleMonitoring: toggleMonitoring,
      })}
    </MonitoringWrapper>
  );
};

export default RealtimeMonitoringWrapper;
