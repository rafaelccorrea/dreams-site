/**
 * Painel de Debug para WebSocket
 * Use apenas em desenvolvimento para diagnosticar problemas de conexão
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { API_BASE_URL } from '../../config/apiConfig';
import { getNavigationUrl } from '../../utils/pathUtils';

export const WebSocketDebugPanel: React.FC = () => {
  const { connected } = useNotifications();
  const { getToken, getCurrentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    const user = getCurrentUser();

    setTokenInfo({
      hasToken: !!token,
      tokenLength: token?.length || 0,
      userId: user?.id || 'N/A',
      userName: user?.name || 'N/A',
      apiUrl: API_BASE_URL,
      wsUrl: `${API_BASE_URL}/notifications`,
      timestamp: new Date().toISOString(),
    });
  }, [getToken, getCurrentUser]);

  // Ocultar em produção
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <Container>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} $connected={connected}>
        {connected ? '🟢' : '🔴'} WebSocket Debug
      </ToggleButton>

      {isOpen && (
        <Panel>
          <Title>🔌 WebSocket Status</Title>

          <StatusRow>
            <Label>Conexão:</Label>
            <Value $status={connected ? 'success' : 'error'}>
              {connected ? '✅ Conectado' : '❌ Desconectado'}
            </Value>
          </StatusRow>

          <Divider />

          <Title>🔑 Autenticação</Title>

          <StatusRow>
            <Label>Token:</Label>
            <Value $status={tokenInfo?.hasToken ? 'success' : 'error'}>
              {tokenInfo?.hasToken
                ? `✅ Presente (${tokenInfo.tokenLength} chars)`
                : '❌ Ausente'}
            </Value>
          </StatusRow>

          <StatusRow>
            <Label>User ID:</Label>
            <Value>{tokenInfo?.userId}</Value>
          </StatusRow>

          <StatusRow>
            <Label>Nome:</Label>
            <Value>{tokenInfo?.userName}</Value>
          </StatusRow>

          <Divider />

          <Title>🌐 URLs</Title>

          <StatusRow>
            <Label>API URL:</Label>
            <Value>{tokenInfo?.apiUrl}</Value>
          </StatusRow>

          <StatusRow>
            <Label>WebSocket URL:</Label>
            <Value>{tokenInfo?.wsUrl}</Value>
          </StatusRow>

          <Divider />

          <Title>🛠️ Ações</Title>

          <ButtonGroup>
            <ActionButton onClick={() => window.location.reload()}>
              🔄 Recarregar
            </ActionButton>
            <ActionButton
              onClick={() => {
                localStorage.clear();
                window.location.href = getNavigationUrl('/login');
              }}
            >
              🗑️ Limpar Cache
            </ActionButton>
            <ActionButton
              onClick={() => {
                console.log('=== DEBUG INFO ===');
                console.log('Connected:', connected);
                console.log('Token Info:', tokenInfo);
                console.log('LocalStorage:', {
                  token: !!localStorage.getItem('dream_keys_access_token'),
                  user: localStorage.getItem('dream_keys_user'),
                  company: localStorage.getItem(
                    'dream_keys_selected_company_id'
                  ),
                });
                console.log('==================');
                alert('Informações impressas no console!');
              }}
            >
              📋 Logs no Console
            </ActionButton>
          </ButtonGroup>

          <InfoText>
            💡 Verifique o console do navegador (F12) para logs detalhados
          </InfoText>
        </Panel>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
`;

const ToggleButton = styled.button<{ $connected: boolean }>`
  background: ${props => (props.$connected ? '#10b981' : '#ef4444')};
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;

const Panel = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 400px;
  max-height: 600px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

const Value = styled.span<{ $status?: 'success' | 'error' }>`
  font-size: 14px;
  color: ${props =>
    props.$status === 'success'
      ? '#10b981'
      : props.$status === 'error'
        ? '#ef4444'
        : '#1f2937'};
  font-weight: 600;
  word-break: break-all;
  text-align: right;
  max-width: 200px;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
`;

const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
`;
