import React, { useState, useEffect } from 'react';
import { Button, Typography, Progress } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const { Text } = Typography;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningIcon = styled.div`
  animation: ${spin} 1s linear infinite;
`;

const NotificationContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  visibility: ${props => (props.$isVisible ? 'visible' : 'hidden')};
  transform: translateY(-50%)
    translateX(${props => (props.$isVisible ? '0' : '-100%')});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const NotificationIcon = styled.div<{
  $type: 'success' | 'error' | 'processing';
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: ${props => {
    switch (props.$type) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-error)';
      case 'processing':
        return 'var(--color-primary)';
      default:
        return 'var(--color-primary)';
    }
  }};
  color: white;
  font-size: 18px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  display: block;
  margin-bottom: 4px;
`;

const NotificationDescription = styled(Text)`
  font-size: 14px;
  color: var(--color-text-secondary);
  display: block;
`;

const NotificationActions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
`;

interface ImportNotificationProps {
  isVisible: boolean;
  type: 'processing' | 'success' | 'error';
  title: string;
  description: string;
  progress?: number;
  onRefresh?: () => void;
  onClose?: () => void;
}

export const ImportNotification: React.FC<ImportNotificationProps> = ({
  isVisible,
  type,
  title,
  description,
  progress,
  onRefresh,
  onClose,
}) => {
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (isVisible && type === 'success') {
      // Auto-close após 10 segundos para sucesso
      const timer = setTimeout(() => {
        onClose?.();
      }, 10000);
      setAutoCloseTimer(timer);
    } else if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }

    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [isVisible, type, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined />;
      case 'error':
        return <CloseCircleOutlined />;
      case 'processing':
        return <SpinningIcon>⏳</SpinningIcon>;
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    onRefresh?.();
    onClose?.();
  };

  return (
    <NotificationContainer $isVisible={isVisible}>
      <NotificationHeader>
        <NotificationIcon $type={type}>{getIcon()}</NotificationIcon>
        <NotificationContent>
          <NotificationTitle>{title}</NotificationTitle>
          <NotificationDescription>{description}</NotificationDescription>
        </NotificationContent>
      </NotificationHeader>

      {type === 'processing' && progress !== undefined && (
        <Progress
          percent={progress}
          size='small'
          strokeColor='var(--color-primary)'
          style={{ marginBottom: '12px' }}
        />
      )}

      {type === 'success' && (
        <NotificationActions>
          <Button
            type='primary'
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            size='small'
          >
            Atualizar Página
          </Button>
          <Button onClick={onClose} size='small'>
            Fechar
          </Button>
        </NotificationActions>
      )}

      {type === 'error' && (
        <NotificationActions>
          <Button onClick={onClose} size='small'>
            Fechar
          </Button>
        </NotificationActions>
      )}
    </NotificationContainer>
  );
};
