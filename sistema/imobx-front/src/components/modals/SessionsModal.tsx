import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdComputer,
  MdPhoneAndroid,
  MdTablet,
  MdLocationOn,
  MdLogout,
} from 'react-icons/md';
import { authApiService } from '../../services/authApi';

interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  isCurrent: boolean;
  lastActivity: string;
  createdAt: string;
}

interface SessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SessionItem = styled.div<{ isCurrent: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: ${props =>
    props.isCurrent
      ? `${props.theme.colors.primary}10`
      : props.theme.colors.backgroundSecondary};
  border: 1px solid
    ${props =>
      props.isCurrent ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const DeviceIcon = styled.div<{ deviceType: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.deviceType) {
      case 'desktop':
        return '#3B82F6';
      case 'mobile':
        return '#10B981';
      case 'tablet':
        return '#F59E0B';
      default:
        return props.theme.colors.border;
    }
  }};
  color: white;
  font-size: 24px;
`;

const SessionInfo = styled.div`
  flex: 1;
`;

const SessionTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const SessionDetails = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const SessionLocation = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SessionActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CurrentBadge = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 16px;
  text-transform: uppercase;
  text-align: center;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.theme.colors.error}10`};
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: ${props => props.theme.colors.error};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.6;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const SessionsModal: React.FC<SessionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessions = await authApiService.getSessions();

      // Mapear os dados da API para o formato esperado pelo componente
      const mappedSessions = sessions.map(session => ({
        id: session.id,
        deviceType: getDeviceType(session.device),
        deviceName: session.device,
        browser: session.browser,
        os: session.operatingSystem || 'Unknown',
        location: 'Localização não disponível', // API não retorna localização
        ipAddress: session.ipAddress,
        isCurrent: true, // Por enquanto, todas são consideradas atuais
        lastActivity: session.lastActivity,
        createdAt: session.createdAt,
      }));

      setSessions(mappedSessions);
    } catch (err) {
      setError('Erro ao carregar sessões');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      await authApiService.revokeSession(sessionId);

      // Remover sessão da lista
      setSessions(prev => prev.filter(session => session.id !== sessionId));

      // Mostrar toast de sucesso
      // console.log('Sessão encerrada com sucesso');
    } catch (err) {
      console.error('Error logging out session:', err);
      setError('Erro ao encerrar sessão');
    }
  };

  const getDeviceType = (device: string): 'desktop' | 'mobile' | 'tablet' => {
    const deviceLower = device.toLowerCase();
    if (
      deviceLower.includes('mobile') ||
      deviceLower.includes('android') ||
      deviceLower.includes('iphone')
    ) {
      return 'mobile';
    }
    if (deviceLower.includes('tablet') || deviceLower.includes('ipad')) {
      return 'tablet';
    }
    return 'desktop';
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <MdComputer />;
      case 'mobile':
        return <MdPhoneAndroid />;
      case 'tablet':
        return <MdTablet />;
      default:
        return <MdComputer />;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Sessões Ativas</ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        {loading && <LoadingState>Carregando sessões...</LoadingState>}

        {error && <ErrorState>{error}</ErrorState>}

        {!loading && !error && sessions.length === 0 && (
          <EmptyState>
            <EmptyStateIcon>
              <MdComputer />
            </EmptyStateIcon>
            <EmptyStateTitle>Nenhuma sessão encontrada</EmptyStateTitle>
            <EmptyStateDescription>
              Não há sessões ativas no momento.
            </EmptyStateDescription>
          </EmptyState>
        )}

        {!loading && !error && sessions.length > 0 && (
          <SessionsList>
            {sessions.map(session => (
              <SessionItem key={session.id} isCurrent={session.isCurrent}>
                <DeviceIcon deviceType={session.deviceType}>
                  {getDeviceIcon(session.deviceType)}
                </DeviceIcon>

                <SessionInfo>
                  <SessionTitle>
                    {session.deviceName} • {session.browser}
                  </SessionTitle>
                  <SessionDetails>
                    {session.os} • {session.ipAddress}
                  </SessionDetails>
                  <SessionLocation>
                    <MdLocationOn size={14} />
                    {session.location}
                  </SessionLocation>
                </SessionInfo>

                <SessionActions>
                  {session.isCurrent && (
                    <CurrentBadge>Sessão Atual</CurrentBadge>
                  )}
                  {!session.isCurrent && (
                    <LogoutButton
                      onClick={() => handleLogoutSession(session.id)}
                    >
                      <MdLogout size={14} />
                      Encerrar
                    </LogoutButton>
                  )}
                </SessionActions>
              </SessionItem>
            ))}
          </SessionsList>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};
