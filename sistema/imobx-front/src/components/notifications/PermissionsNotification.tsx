import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { MdCheckCircle, MdInfo, MdClose } from 'react-icons/md';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
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
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{
  $isVisible: boolean;
  $isClosing: boolean;
}>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 320px;
  max-width: 400px;
  animation: ${props => {
      if (props.$isClosing) return slideOut;
      if (props.$isVisible) return slideIn;
      return 'none';
    }}
    0.3s ease-in-out;
  transform: ${props =>
    props.$isVisible && !props.$isClosing
      ? 'translateX(0)'
      : 'translateX(100%)'};
  opacity: ${props => (props.$isVisible && !props.$isClosing ? 1 : 0)};
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const NotificationTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificationMessage = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const IconContainer = styled.div<{ $type: 'success' | 'info' }>`
  color: ${props => {
    switch (props.$type) {
      case 'success':
        return '#10B981';
      case 'info':
        return '#3B82F6';
      default:
        return props.theme.colors.textSecondary;
    }
  }};
`;

interface PermissionsNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'info';
  title?: string;
  message?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const PermissionsNotification: React.FC<
  PermissionsNotificationProps
> = ({
  isVisible,
  onClose,
  type = 'success',
  title = 'Permissões Atualizadas',
  message = 'Suas permissões foram atualizadas automaticamente.',
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  const Icon = type === 'success' ? MdCheckCircle : MdInfo;

  return (
    <NotificationContainer $isVisible={isVisible} $isClosing={isClosing}>
      <NotificationHeader>
        <NotificationTitle>
          <IconContainer $type={type}>
            <Icon size={16} />
          </IconContainer>
          {title}
        </NotificationTitle>
        <CloseButton onClick={handleClose} title='Fechar notificação'>
          <MdClose size={14} />
        </CloseButton>
      </NotificationHeader>
      <NotificationMessage>{message}</NotificationMessage>
    </NotificationContainer>
  );
};
