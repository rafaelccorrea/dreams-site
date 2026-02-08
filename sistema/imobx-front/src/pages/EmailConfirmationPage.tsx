import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEnvelope,
} from 'react-icons/fa';
import { authApi } from '../services/api';
import { AuthThemeWrapper } from '../components/auth/AuthThemeWrapper';
import {
  LoginContainer,
  LoginCard,
  WelcomeSection,
  FormSection,
  WelcomeContent,
  WelcomeTitle,
  WelcomeSubtitle,
  DecorativeElements,
  Circle1,
  Circle2,
  Wave1,
  Wave2,
} from '../styles/pages/AuthStyles';

const ConfirmationContent = styled.div`
  text-align: center;
  padding: 20px;
`;

const IconContainer = styled.div<{ $status: 'loading' | 'success' | 'error' }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 32px;

  ${props => {
    switch (props.$status) {
      case 'loading':
        return `
          background: ${props.theme.colors.primary}20;
          color: ${props.theme.colors.primary};
        `;
      case 'success':
        return `
          background: #10B98120;
          color: #10B981;
        `;
      case 'error':
        return `
          background: #EF444420;
          color: #EF4444;
        `;
      default:
        return '';
    }
  }}
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const Message = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const Button = styled.button`
  padding: 14px 28px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmailConfirmationPage: React.FC = () => {
  const { token: tokenParam } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pegar token tanto dos parâmetros da rota quanto da query string
  const getToken = () => {
    // Primeiro tenta pegar dos parâmetros da rota (/confirm-email/:token)
    if (tokenParam) {
      return tokenParam;
    }

    // Se não tiver, tenta pegar da query string (/verify-email?token=...)
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('token');
  };

  useEffect(() => {
    const confirmRegistration = async () => {
      // Prevenir chamadas duplas
      if (isProcessing) {
        return;
      }

      const token = getToken();

      if (!token) {
        setStatus('error');
        setMessage('Token de confirmação não encontrado.');
        return;
      }

      setIsProcessing(true);

      try {
        const response = await authApi.confirmRegistration(token);

        if (response.success) {
          setStatus('success');
          setMessage(response.message);

          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            navigate('/login', {
              state: {
                message:
                  'Conta confirmada com sucesso! Faça login para continuar.',
                email: response.user?.email,
              },
            });
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Erro ao confirmar registro.');
        }
      } catch (error: any) {
        console.error('Erro ao confirmar registro:', error);

        setStatus('error');

        if (error.response?.status === 400) {
          if (error.response.data.message?.includes('expirado')) {
            setMessage(
              'Token de confirmação expirado. Solicite um novo registro.'
            );
          } else if (error.response.data.message?.includes('inválido')) {
            setMessage('Token de confirmação inválido.');
          } else {
            setMessage(
              error.response.data.message || 'Erro ao confirmar registro.'
            );
          }
        } else if (error.response?.status === 409) {
          setMessage('Usuário já foi criado com este email.');
        } else {
          setMessage('Erro interno do servidor. Tente novamente mais tarde.');
        }
      }
    };

    confirmRegistration();
  }, [tokenParam, location, navigate, isProcessing]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <FaSpinner />;
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaTimesCircle />;
      default:
        return <FaEnvelope />;
    }
  };

  const renderTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirmando sua conta...';
      case 'success':
        return 'Conta confirmada!';
      case 'error':
        return 'Erro na confirmação';
      default:
        return 'Confirmação de Email';
    }
  };

  return (
    <AuthThemeWrapper>
      <LoginContainer>
        <DecorativeElements>
          <Circle1 />
          <Circle2 />
          <Wave1 />
          <Wave2 />
        </DecorativeElements>

        <LoginCard>
          <WelcomeSection>
            <WelcomeContent>
              <WelcomeTitle>Confirmação de Email</WelcomeTitle>
              <WelcomeSubtitle>Verificando sua conta...</WelcomeSubtitle>
            </WelcomeContent>
          </WelcomeSection>

          <FormSection>
            <ConfirmationContent>
              <IconContainer $status={status}>
                {status === 'loading' ? <Spinner /> : renderIcon()}
              </IconContainer>

              <Title>{renderTitle()}</Title>

              <Message>{message}</Message>

              {status === 'success' && (
                <Message style={{ fontSize: '14px', opacity: 0.8 }}>
                  Você será redirecionado para a página de login em alguns
                  segundos...
                </Message>
              )}

              {status === 'error' && (
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                  }}
                >
                  <Button onClick={handleGoToLogin}>Ir para Login</Button>
                  <Button
                    onClick={handleGoToRegister}
                    style={{
                      background: 'transparent',
                      color: '#666',
                      border: '2px solid #ddd',
                    }}
                  >
                    Novo Registro
                  </Button>
                </div>
              )}
            </ConfirmationContent>
          </FormSection>
        </LoginCard>
      </LoginContainer>
    </AuthThemeWrapper>
  );
};

export default EmailConfirmationPage;
