import React, { useState, useEffect } from 'react';
import { authStorage } from '../services/authStorage';

interface AuthAlertProps {
  onDismiss: () => void;
}

export const AuthAlert: React.FC<AuthAlertProps> = ({ onDismiss }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const checkAuthStatus = () => {
      const authData = authStorage.getAuthData();
      const isAuthenticated = authStorage.isAuthenticated();

      if (authData.token && !isAuthenticated) {
        setAlertMessage(
          'Sua sessão expirou. Faça login novamente para continuar.'
        );
        setShowAlert(true);
      }
    };

    // Verificar a cada 10 segundos
    const interval = setInterval(checkAuthStatus, 10000);

    // Verificar imediatamente
    checkAuthStatus();

    return () => clearInterval(interval);
  }, []);

  if (!showAlert) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            color: '#dc2626',
            fontSize: '20px',
          }}
        >
          ⚠️
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: '600',
              color: '#dc2626',
              marginBottom: '4px',
            }}
          >
            Sessão Expirada
          </div>
          <div
            style={{
              color: '#991b1b',
              fontSize: '14px',
            }}
          >
            {alertMessage}
          </div>
        </div>
        <button
          onClick={() => {
            setShowAlert(false);
            onDismiss();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};
