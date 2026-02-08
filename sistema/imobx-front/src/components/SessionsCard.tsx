import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdComputer,
  MdPhoneAndroid,
  MdTablet,
  MdLocationOn,
  MdLogout,
} from 'react-icons/md';

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

const CardContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
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
  padding: 16px;
  background: ${props =>
    props.isCurrent
      ? `${props.theme.colors.primary}10`
      : props.theme.colors.backgroundSecondary};
  border: 1px solid
    ${props =>
      props.isCurrent ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const DeviceIcon = styled.div<{ deviceType: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
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
  font-size: 20px;
`;

const SessionInfo = styled.div`
  flex: 1;
`;

const SessionTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const SessionDetails = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2px;
`;

const SessionLocation = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SessionActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CurrentBadge = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
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
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${props => props.theme.colors.error};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

export const SessionsCard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implementar chamada para API real
      // const sessions = await authApiService.getSessions();
      // setSessions(sessions);

      setSessions([]);
    } catch (err) {
      setError('Erro ao carregar sessões');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      // Aqui você implementaria a chamada para a API
      // console.log('Logging out session:', sessionId);
      // Remover sessão da lista
      setSessions(prev => prev.filter(session => session.id !== sessionId));

      // Mostrar toast de sucesso
      // toast.success('Sessão encerrada com sucesso');
    } catch (err) {
      console.error('Error logging out session:', err);
      // toast.error('Erro ao encerrar sessão');
    }
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

  if (loading) {
    return (
      <CardContainer>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
        </CardHeader>
        <LoadingState>Carregando sessões...</LoadingState>
      </CardContainer>
    );
  }

  if (error) {
    return (
      <CardContainer>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
        </CardHeader>
        <ErrorState>{error}</ErrorState>
      </CardContainer>
    );
  }

  if (sessions.length === 0) {
    return (
      <CardContainer>
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
        </CardHeader>
        <EmptyState>
          <MdComputer size={48} />
          <p>Nenhuma sessão encontrada</p>
        </EmptyState>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>Sessões Ativas</CardTitle>
      </CardHeader>

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
                <MdLocationOn size={12} />
                {session.location}
              </SessionLocation>
            </SessionInfo>

            <SessionActions>
              {session.isCurrent && <CurrentBadge>Sessão Atual</CurrentBadge>}
              {!session.isCurrent && (
                <LogoutButton onClick={() => handleLogoutSession(session.id)}>
                  <MdLogout size={12} />
                  Encerrar
                </LogoutButton>
              )}
            </SessionActions>
          </SessionItem>
        ))}
      </SessionsList>
    </CardContainer>
  );
};
