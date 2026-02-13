import React from 'react';
import {
  AlertContainer,
  AlertContent,
  AlertIcon,
  AlertMessage as AlertMessageText,
  AlertCloseButton,
} from '../../styles/components/AlertStyles';

interface AlertMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  message,
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '●';
      case 'error':
        return '●';
      case 'warning':
        return '●';
      case 'info':
      default:
        return '●';
    }
  };

  if (!message) return null;

  return (
    <AlertContainer type={type}>
      <AlertContent>
        <AlertIcon>{getIcon()}</AlertIcon>
        <AlertMessageText>{message}</AlertMessageText>
      </AlertContent>
      {onClose && (
        <AlertCloseButton onClick={onClose} title='Fechar'>
          ×
        </AlertCloseButton>
      )}
    </AlertContainer>
  );
};
