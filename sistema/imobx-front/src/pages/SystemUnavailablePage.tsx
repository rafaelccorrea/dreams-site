import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { subscriptionService } from '../services/subscriptionService';
import { MdLogout, MdRefresh, MdError } from 'react-icons/md';
import {
  MainContainer,
  ErrorIcon,
  MainTitle,
  Subtitle,
  ButtonGroup,
  ActionButton,
} from '../styles/pages/SystemUnavailablePageStyles';

export const SystemUnavailablePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  const handleRefresh = async () => {
    setIsChecking(true);
    try {
      const response = await subscriptionService.checkSubscriptionAccess();
      if (response === true) {
        // Usuário tem acesso novamente, redirecionar para dashboard
        navigate('/dashboard');
      } else {
        // Ainda sem acesso, recarregar página para mostrar mensagem atualizada
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      // Em caso de erro, apenas recarregar
      window.location.reload();
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MainContainer>
      <ErrorIcon>
        <MdError />
      </ErrorIcon>

      <MainTitle>Sistema Indisponível</MainTitle>

      <Subtitle>
        O sistema está temporariamente indisponível para sua empresa. Entre em
        contato com o administrador da sua empresa para resolver esta situação.
      </Subtitle>

      <ButtonGroup>
        <ActionButton
          $variant='primary'
          onClick={handleRefresh}
          disabled={isChecking}
        >
          <MdRefresh size={16} />
          {isChecking ? 'Verificando...' : 'Tentar Novamente'}
        </ActionButton>

        <ActionButton
          $variant='danger'
          onClick={handleLogout}
          disabled={isChecking}
        >
          <MdLogout size={16} />
          Voltar ao Login
        </ActionButton>
      </ButtonGroup>
    </MainContainer>
  );
};

export default SystemUnavailablePage;
