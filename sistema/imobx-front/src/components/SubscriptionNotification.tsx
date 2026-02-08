import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSubscription } from '../hooks/useSubscription';
import { useSubscriptionContext } from '../contexts/SubscriptionContext';
import { useTheme } from '../hooks/useTheme';
import { MdWarning, MdClose, MdStar, MdInfo } from 'react-icons/md';

const NotificationContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 80px; /* Abaixo do header */
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-bottom: 1px solid #f59e0b;
  padding: 12px 24px;
  z-index: 150;
  transform: ${props =>
    props.$isVisible ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NotificationContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const NotificationText = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const NotificationIcon = styled.div`
  color: #d97706;
  font-size: 20px;
`;

const NotificationMessage = styled.div`
  color: #92400e;
  font-weight: 500;
  font-size: 14px;
`;

const NotificationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #d97706;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #b45309;
    transform: translateY(-1px);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #92400e;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(146, 64, 14, 0.1);
  }
`;

const DarkNotificationContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 80px; /* Abaixo do header */
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1f2937, #374151);
  border-bottom: 1px solid #6b7280;
  padding: 12px 24px;
  z-index: 150;
  transform: ${props =>
    props.$isVisible ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const DarkNotificationContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const DarkNotificationText = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const DarkNotificationIcon = styled.div`
  color: #fbbf24;
  font-size: 20px;
`;

const DarkNotificationMessage = styled.div`
  color: #f9fafb;
  font-weight: 500;
  font-size: 14px;
`;

const DarkActionButton = styled.button`
  padding: 8px 16px;
  background: #fbbf24;
  color: #1f2937;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f59e0b;
    transform: translateY(-1px);
  }
`;

const DarkCloseButton = styled.button`
  background: none;
  border: none;
  color: #f9fafb;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(249, 250, 251, 0.1);
  }
`;

export const SubscriptionNotification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { subscriptionStatus } = useSubscription();
  const { subscriptionValidations, hasAccess, accessReason } =
    useSubscriptionContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Não mostrar notificação na página de criação/edição de propriedade
  const isPropertyPage =
    location.pathname.includes('/properties/create') ||
    (location.pathname.includes('/properties/') &&
      location.pathname.includes('/edit'));

  useEffect(() => {
    // Se estiver na página de propriedade, não mostrar
    if (isPropertyPage) {
      setIsVisible(false);
      return;
    }

    // Verificar se deve mostrar a notificação usando dados da nova API
    if (!isDismissed) {
      const shouldShow =
        subscriptionValidations?.isExpired ||
        subscriptionValidations?.hasOutstandingPayments ||
        subscriptionValidations?.isNearExpiry ||
        hasAccess === false ||
        (subscriptionStatus &&
          (!subscriptionStatus.hasActiveSubscription ||
            subscriptionStatus.isExpiringSoon ||
            subscriptionStatus.isExpired));

      setIsVisible(shouldShow || false);
    }
  }, [
    subscriptionStatus,
    subscriptionValidations,
    hasAccess,
    isDismissed,
    isPropertyPage,
  ]);

  const handleUpgrade = () => {
    const statusReason =
      subscriptionStatus?.statusReason ??
      (subscriptionStatus?.subscription?.status as string | undefined);
    const targetRoute =
      statusReason === 'none'
        ? '/subscription-plans'
        : '/subscription-management';
    navigate(targetRoute);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const getNotificationMessage = () => {
    // Priorizar dados da nova API
    if (subscriptionValidations) {
      if (subscriptionValidations.isExpired) {
        return 'Sua assinatura expirou. Renove agora para continuar usando o sistema.';
      }

      if (subscriptionValidations.hasOutstandingPayments) {
        return 'Há pagamentos pendentes ou atrasados. Regularize sua situação para continuar usando o sistema.';
      }

      if (subscriptionValidations.isNearExpiry) {
        return `Sua assinatura expira em ${subscriptionValidations.daysUntilExpiry} dias. Renove agora para evitar interrupções.`;
      }
    }

    // Fallback para estrutura legada
    if (!subscriptionStatus) return '';

    if (!subscriptionStatus.hasActiveSubscription) {
      return (
        accessReason ||
        'Você não possui uma assinatura ativa. Ative sua assinatura para acessar todas as funcionalidades.'
      );
    }

    if (subscriptionStatus.isExpired) {
      return 'Sua assinatura expirou. Renove agora para continuar usando o sistema.';
    }

    if (subscriptionStatus.isExpiringSoon) {
      return `Sua assinatura expira em ${subscriptionStatus.daysUntilExpiry} dias. Renove agora para evitar interrupções.`;
    }

    return '';
  };

  const getNotificationIcon = () => {
    if (!subscriptionStatus) return MdInfo;

    if (
      !subscriptionStatus.hasActiveSubscription ||
      subscriptionStatus.isExpired
    ) {
      return MdWarning;
    }

    return MdInfo;
  };

  if (!isVisible || !subscriptionStatus) {
    return null;
  }

  const message = getNotificationMessage();
  const IconComponent = getNotificationIcon();

  if (theme === 'dark') {
    return (
      <DarkNotificationContainer $isVisible={isVisible}>
        <DarkNotificationContent>
          <DarkNotificationText>
            <DarkNotificationIcon>
              <IconComponent size={20} />
            </DarkNotificationIcon>
            <DarkNotificationMessage>{message}</DarkNotificationMessage>
          </DarkNotificationText>

          <NotificationActions>
            <DarkActionButton onClick={handleUpgrade}>
              <MdStar size={16} />
              Ver Planos
            </DarkActionButton>
            <DarkCloseButton onClick={handleDismiss}>
              <MdClose size={16} />
            </DarkCloseButton>
          </NotificationActions>
        </DarkNotificationContent>
      </DarkNotificationContainer>
    );
  }

  return (
    <NotificationContainer $isVisible={isVisible}>
      <NotificationContent>
        <NotificationText>
          <NotificationIcon>
            <IconComponent size={20} />
          </NotificationIcon>
          <NotificationMessage>{message}</NotificationMessage>
        </NotificationText>

        <NotificationActions>
          <ActionButton onClick={handleUpgrade}>
            <MdStar size={16} />
            Ver Planos
          </ActionButton>
          <CloseButton onClick={handleDismiss}>
            <MdClose size={16} />
          </CloseButton>
        </NotificationActions>
      </NotificationContent>
    </NotificationContainer>
  );
};
