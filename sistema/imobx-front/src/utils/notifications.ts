import React from 'react';
import { toast } from 'react-toastify';

export interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left';
  autoClose?: number | false;
  hideProgressBar?: boolean;
  newestOnTop?: boolean;
  closeOnClick?: boolean;
  rtl?: boolean;
  pauseOnFocusLoss?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  theme?: 'light' | 'dark' | 'colored';
  style?: React.CSSProperties;
  /** Id customizado. Se não passar, é gerado por tipo + mensagem para evitar duplicatas. */
  toastId?: string | number;
}

/** Gera um id estável para o toast (tipo + mensagem) para evitar duplicatas. */
function getToastId(type: string, message: string): string {
  return `nt-${type}-${message}`;
}

export const showNotification = (
  message: string,
  options: NotificationOptions = {}
) => {
  const { type = 'info', toastId: customToastId, ...toastOptions } = options;

  const defaultOptions: NotificationOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...toastOptions,
  };

  const toastId = customToastId ?? getToastId(type, message);
  const autoClose = defaultOptions.autoClose ?? 5000;

  if (toast.isActive(toastId)) {
    toast.update(toastId, { autoClose });
    return toastId;
  }

  switch (type) {
    case 'success':
      return toast.success(message, { ...defaultOptions, toastId });
    case 'error':
      return toast.error(message, { ...defaultOptions, toastId });
    case 'warning':
      return toast.warning(message, { ...defaultOptions, toastId });
    case 'info':
    default:
      return toast.info(message, { ...defaultOptions, toastId });
  }
};

// Funções de conveniência
export const showSuccess = (message: string, options?: NotificationOptions) =>
  showNotification(message, { ...options, type: 'success' });

export const showError = (message: string, options?: NotificationOptions) =>
  showNotification(message, { ...options, type: 'error' });

export const showWarning = (message: string, options?: NotificationOptions) =>
  showNotification(message, { ...options, type: 'warning' });

export const showInfo = (message: string, options?: NotificationOptions) =>
  showNotification(message, { ...options, type: 'info' });

// Para casos especiais como logout forçado (não duplica; se já estiver aberto, mantém)
export const showForceLogoutNotification = (message: string) => {
  const toastId = `force-logout-${message}`;
  if (toast.isActive(toastId)) return toastId;
  return toast.error(message, {
    toastId,
    position: 'top-center',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    style: {
      backgroundColor: '#dc2626',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  });
};
