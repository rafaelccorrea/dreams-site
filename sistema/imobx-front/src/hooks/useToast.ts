import { useCallback } from 'react';
import { showNotification } from '../utils/notifications';

export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
}

export const useToast = () => {
  const showToast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const {
        type = 'info',
        duration = 5000,
        position = 'top-right',
      } = options;

      showNotification(message, {
        type,
        autoClose: duration,
        position,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, options: Omit<ToastOptions, 'type'> = {}) => {
      showToast(message, { ...options, type: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, options: Omit<ToastOptions, 'type'> = {}) => {
      showToast(message, { ...options, type: 'error' });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options: Omit<ToastOptions, 'type'> = {}) => {
      showToast(message, { ...options, type: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options: Omit<ToastOptions, 'type'> = {}) => {
      showToast(message, { ...options, type: 'info' });
    },
    [showToast]
  );

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
