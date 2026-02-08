import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { webSocketService } from '../../services/websocketService';
import MonitoringStatus from './MonitoringStatus';
import {
  MdDashboard,
  MdBusiness,
  MdPeople,
  MdGroup,
  MdViewKanban,
  MdPayment,
  MdSettings,
} from 'react-icons/md';

// Animações
const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const GlobalMonitoringContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
`;

const MonitoringPanel = styled.div<{ isOpen: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  animation: ${props => (props.isOpen ? slideIn : slideOut)} 0.3s ease-in-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PanelTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ModuleItem = styled.div<{
  status: 'connected' | 'disconnected' | 'loading' | 'error';
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${props => {
    switch (props.status) {
      case 'connected':
        return '#f0fdf4';
      case 'disconnected':
        return '#fef2f2';
      case 'loading':
        return '#fffbeb';
      case 'error':
        return '#fef2f2';
      default:
        return '#f9fafb';
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.status) {
        case 'connected':
          return '#bbf7d0';
        case 'disconnected':
          return '#fecaca';
        case 'loading':
          return '#fed7aa';
        case 'error':
          return '#fecaca';
        default:
          return '#e5e7eb';
      }
    }};
  transition: all 0.2s ease;
`;

const ModuleIcon = styled.div<{
  status: 'connected' | 'disconnected' | 'loading' | 'error';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: ${props => {
    switch (props.status) {
      case 'connected':
        return '#16a34a';
      case 'disconnected':
        return '#dc2626';
      case 'loading':
        return '#d97706';
      case 'error':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  }};
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const ModuleStatus = styled.div<{
  status: 'connected' | 'disconnected' | 'loading' | 'error';
}>`
  font-size: 12px;
  color: ${props => {
    switch (props.status) {
      case 'connected':
        return '#16a34a';
      case 'disconnected':
        return '#dc2626';
      case 'loading':
        return '#d97706';
      case 'error':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  }};
`;

const ModuleLastUpdate = styled.div`
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
`;

const GlobalActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.variant === 'primary'
      ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const FloatingToggle = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

interface ModuleStatus {
  module: string;
  status: 'connected' | 'disconnected' | 'loading' | 'error';
  lastUpdate?: Date | null;
  icon: React.ComponentType<{ size?: number }>;
}

export const GlobalMonitoringPanel: React.FC = () => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  const [isOpen, setIsOpen] = useState(false);
  const [modulesStatus, setModulesStatus] = useState<ModuleStatus[]>([]);
  const [globalConnected, setGlobalConnected] = useState(false);

  // Configuração dos módulos
  const modules: ModuleStatus[] = [
    {
      module: 'dashboard',
      status: 'connected',
      icon: MdDashboard,
    },
    {
      module: 'properties',
      status: 'connected',
      icon: MdBusiness,
    },
    {
      module: 'users',
      status: 'connected',
      icon: MdPeople,
    },
    {
      module: 'teams',
      status: 'connected',
      icon: MdGroup,
    },
    {
      module: 'kanban',
      status: 'connected',
      icon: MdViewKanban,
    },
    {
      module: 'subscriptions',
      status: 'connected',
      icon: MdPayment,
    },
  ];

  useEffect(() => {
    if (!user) return;

    // Configurar WebSocket para monitoramento global
    webSocketService.connect();

    // Escutar eventos de conexão
    webSocketService.on('connect', () => {
      setGlobalConnected(true);
      // console.log('WebSocket conectado globalmente');
    });

    webSocketService.on('disconnect', () => {
      setGlobalConnected(false);
      // console.log('WebSocket desconectado globalmente');
    });

    // Escutar atualizações de todos os módulos
    modules.forEach(module => {
      const eventName = `${module.module}_update`;

      webSocketService.on(eventName, data => {
        setModulesStatus(prev =>
          prev.map(m =>
            m.module === module.module
              ? { ...m, status: 'connected', lastUpdate: new Date() }
              : m
          )
        );
      });
    });

    // Escutar eventos gerais
    webSocketService.on('data_update', data => {
      setModulesStatus(prev =>
        prev.map(m =>
          m.module === data.module
            ? { ...m, status: 'connected', lastUpdate: new Date() }
            : m
        )
      );
    });

    // Inicializar status dos módulos
    setModulesStatus(modules);

    return () => {
      webSocketService.disconnect();
    };
  }, [user]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const refreshAllModules = () => {
    // Emitir evento para atualizar todos os módulos
    webSocketService.emit('refresh_all_modules');

    // Atualizar status local
    setModulesStatus(prev => prev.map(m => ({ ...m, status: 'loading' })));
  };

  const toggleAllMonitoring = (enabled: boolean) => {
    // Emitir evento para pausar/retomar monitoramento
    webSocketService.emit('toggle_monitoring', { enabled });
  };

  const getModuleStatusText = (status: string) => {
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

  const formatLastUpdate = (date: Date | null | undefined) => {
    if (!date) return '';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) {
      return `${seconds}s atrás`;
    } else if (minutes < 60) {
      return `${minutes}m atrás`;
    } else {
      return date.toLocaleTimeString('pt-BR');
    }
  };

  if (!user) return null;

  return (
    <>
      {!isOpen && (
        <FloatingToggle onClick={togglePanel}>
          <MdSettings />
        </FloatingToggle>
      )}

      {isOpen && (
        <GlobalMonitoringContainer>
          <MonitoringPanel isOpen={isOpen}>
            <PanelHeader>
              <PanelTitle>
                <MdSettings size={18} />
                Monitoramento Global
              </PanelTitle>
              <ToggleButton onClick={togglePanel}>×</ToggleButton>
            </PanelHeader>

            <ModulesList>
              {modulesStatus.map(module => {
                const IconComponent = module.icon;

                return (
                  <ModuleItem key={module.module} status={module.status}>
                    <ModuleIcon status={module.status}>
                      <IconComponent size={16} />
                    </ModuleIcon>

                    <ModuleInfo>
                      <ModuleName>
                        {module.module.charAt(0).toUpperCase() +
                          module.module.slice(1)}
                      </ModuleName>
                      <ModuleStatus status={module.status}>
                        {getModuleStatusText(module.status)}
                      </ModuleStatus>
                      {module.lastUpdate && (
                        <ModuleLastUpdate>
                          {formatLastUpdate(module.lastUpdate)}
                        </ModuleLastUpdate>
                      )}
                    </ModuleInfo>
                  </ModuleItem>
                );
              })}
            </ModulesList>

            <GlobalActions>
              <ActionButton variant='primary' onClick={refreshAllModules}>
                Atualizar Tudo
              </ActionButton>
              <ActionButton
                variant='secondary'
                onClick={() => toggleAllMonitoring(!globalConnected)}
              >
                {globalConnected ? 'Pausar' : 'Retomar'}
              </ActionButton>
            </GlobalActions>
          </MonitoringPanel>

          <MonitoringStatus
            status={globalConnected ? 'connected' : 'disconnected'}
            lastUpdate={modulesStatus.find(m => m.lastUpdate)?.lastUpdate}
            onRefresh={refreshAllModules}
            onToggle={toggleAllMonitoring}
            enabled={globalConnected}
            module='Sistema Global'
          />
        </GlobalMonitoringContainer>
      )}
    </>
  );
};

export default GlobalMonitoringPanel;
