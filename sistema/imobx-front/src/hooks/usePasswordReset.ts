import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import type {
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../types/auth';

interface UsePasswordResetReturn {
  isLoading: boolean;
  alert: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null;
  forgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
  resetPassword: (data: ResetPasswordFormData) => Promise<void>;
  verifyToken: (token: string) => Promise<boolean>;
  clearAlert: () => void;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const clearAlert = () => setAlert(null);

  const handleError = (error: any, defaultMessage: string) => {
    console.error('Erro no reset de senha:', error);

    let errorMessage = defaultMessage;

    if (error.response?.status === 404) {
      errorMessage = 'Email não encontrado em nosso sistema.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Dados inválidos. Verifique os campos.';
    } else if (error.response?.status === 410) {
      errorMessage = 'Token de reset expirado. Solicite um novo link.';
    } else if (error.response?.status === 422) {
      errorMessage = 'Senha não atende aos critérios de segurança.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    setAlert({
      type: 'error',
      message: errorMessage,
    });
  };

  const forgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setAlert(null);

    try {
      // console.log('Solicitando reset de senha para:', data.email);
      const response = await authApi.forgotPassword(data.email);

      // console.log('Resposta do forgot password:', response);
      setAlert({
        type: 'success',
        message:
          'Email de recuperação enviado! Verifique sua caixa de entrada.',
      });

      // Redirecionar para página de confirmação após 3 segundos
      setTimeout(() => {
        navigate('/forgot-password-confirmation', {
          state: { email: data.email },
        });
      }, 3000);
    } catch (error: any) {
      handleError(error, 'Erro interno do servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setAlert(null);

    try {
      // console.log('Resetando senha com token:', data.token);
      const response = await authApi.resetPassword(data.token, data.password);

      // console.log('Resposta do reset password:', response);
      setAlert({
        type: 'success',
        message: 'Senha alterada com sucesso! Redirecionando para login...',
      });

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      handleError(error, 'Erro interno do servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // console.log('Verificando token de reset:', token);
      const response = await authApi.verifyResetToken(token);

      // console.log('Token válido:', response);
      return response.valid || true;
    } catch (error: any) {
      console.error('Token inválido:', error);
      return false;
    }
  };

  return {
    isLoading,
    alert,
    forgotPassword,
    resetPassword,
    verifyToken,
    clearAlert,
  };
};
