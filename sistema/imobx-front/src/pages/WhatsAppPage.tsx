import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { WhatsAppMessagesList } from '../components/whatsapp/WhatsAppMessagesList';
import { WhatsAppConversationViewer } from '../components/whatsapp/WhatsAppConversationViewer';
import { WhatsAppNotificationDashboard } from '../components/whatsapp/WhatsAppNotificationDashboard';
import { WhatsAppShimmer } from '../components/shimmer/WhatsAppShimmer';
import { whatsappApi } from '../services/whatsappApi';
import { showError } from '../utils/notifications';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';
import {
  MdSettings,
  MdWarning,
  MdArrowBack,
  MdLock,
  MdMenu,
  MdNotificationsActive,
  MdDashboard,
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import type { WhatsAppConfig } from '../types/whatsapp';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
  padding: 0 !important;
  margin: 0 !important;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ChatLayout = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const DashboardButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  padding: 16px 16px 0 0;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 12px 12px 0 0;
  }

  @media (max-width: 480px) {
    padding: 10px 10px 0 0;
  }
`;

const SidebarContainer = styled.div<{ $isMobile?: boolean; $isOpen?: boolean }>`
  width: 480px;
  min-width: 420px;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease;
  padding: 0;
  margin: 0;

  @media (max-width: 1024px) {
    width: 400px;
    min-width: 350px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 400px;
    height: 100%;
    z-index: 1000;
    transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
    box-shadow: ${props =>
      props.$isOpen ? '4px 0 12px rgba(0, 0, 0, 0.15)' : 'none'};
    border-right: none;
  }
`;

const ChatContainer = styled.div<{ $isMobile?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${props => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.7)'
        : 'rgba(0, 0, 0, 0.5)'};
    z-index: 999;
    backdrop-filter: blur(4px);
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: ${props => props.theme.colors.cardBackground};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 100;
  }
`;

const MobileMenuButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
    background: none;
    border: none;
    color: ${props => props.theme.colors.text};
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.theme.colors.backgroundSecondary};
    }
  }
`;

const ConfigRequiredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 24px 16px;
  text-align: center;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 20px 12px;
    min-height: 50vh;
  }

  @media (max-width: 480px) {
    padding: 16px 8px;
    min-height: 40vh;
  }
`;

const ConfigRequiredIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(245, 158, 11, 0.15)'
      : 'rgba(245, 158, 11, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }
`;

const ConfigRequiredTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }
`;

const ConfigRequiredText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 32px 0;
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    margin-bottom: 24px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 20px;
    line-height: 1.5;
  }
`;

const ConfigButton = styled.button`
  padding: 14px 28px;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    min-height: 48px;
    font-size: 0.875rem;
    width: 100%;
    white-space: normal;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  padding: 10px 20px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  margin-bottom: 16px;
  align-self: flex-start;

  @media (max-width: 480px) {
    padding: 12px 16px;
    min-height: 48px;
    font-size: 0.875rem;
    margin-bottom: 12px;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const PermissionDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 20px;
    min-height: 50vh;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    min-height: 40vh;
  }
`;

const PermissionDeniedIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(239, 68, 68, 0.15)'
      : 'rgba(239, 68, 68, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }
`;

const PermissionDeniedTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 8px;
  }
`;

const PermissionDeniedText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 32px 0;
  max-width: 600px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    margin-bottom: 24px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 20px;
    line-height: 1.5;
  }
`;

const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  text-align: center;
  padding: 40px 16px;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 30px 12px;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 20px 8px;
    font-size: 0.875rem;
  }
`;

const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.3;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const DashboardPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
  padding: 0;
  margin: 0;
`;

const DashboardContentWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 16px 24px 16px;

  @media (max-width: 768px) {
    padding: 0 12px 20px 12px;
  }

  @media (max-width: 480px) {
    padding: 0 8px 16px 8px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const WhatsAppPage: React.FC = () => {
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(
    null
  );
  const [selectedContactName, setSelectedContactName] = useState<
    string | undefined
  >(undefined);
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Verificar permissões antes de renderizar
  const hasViewPermission =
    permissionsContext?.hasPermission('whatsapp:view') ?? false;
  const hasViewMessagesPermission =
    permissionsContext?.hasPermission('whatsapp:view_messages') ?? false;
  const hasAccess = hasViewPermission || hasViewMessagesPermission;

  // Se não tiver permissão, redirecionar para dashboard
  React.useEffect(() => {
    if (permissionsContext && !permissionsContext.isLoading && !hasAccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [permissionsContext, hasAccess, navigate]);

  // Não renderizar se não tiver permissão
  if (!permissionsContext || permissionsContext.isLoading) {
    return (
      <Layout>
        <WhatsAppShimmer />
      </Layout>
    );
  }

  if (!hasAccess) {
    return null;
  }

  const [showNotificationDashboard, setShowNotificationDashboard] =
    useState(false);

  // Verificar role para dashboard de notificações
  const user = getCurrentUser();
  const userRole = user?.role?.toLowerCase();
  const isAdminOrManager = userRole
    ? ['admin', 'manager', 'master'].includes(userRole)
    : false;

  // Se não tiver permissão, redirecionar para dashboard
  React.useEffect(() => {
    if (permissionsContext && !permissionsContext.isLoading && !hasAccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [permissionsContext, hasAccess, navigate]);

  // Não renderizar se não tiver permissão ou se ainda estiver carregando
  if (!permissionsContext || permissionsContext.isLoading) {
    return (
      <Layout>
        <WhatsAppShimmer />
      </Layout>
    );
  }

  if (!hasAccess) {
    return null;
  }

  const handleViewConversation = (
    phoneNumber: string,
    contactName?: string
  ) => {
    setSelectedPhoneNumber(phoneNumber);
    setSelectedContactName(contactName);
  };

  // Forçar recompilação - removido viewMode

  useEffect(() => {
    checkWhatsAppConfig();

    // Remover padding do MainScrollArea apenas na página de WhatsApp
    const scrollArea = document.querySelector(
      '[data-scroll-container="main"]'
    ) as HTMLElement;
    if (scrollArea) {
      scrollArea.style.padding = '0';
      scrollArea.style.margin = '0';
      scrollArea.style.height = '100%';
      scrollArea.style.overflow = 'hidden';
    }

    // Cleanup: restaurar padding quando sair da página
    return () => {
      if (scrollArea) {
        scrollArea.style.padding = '';
        scrollArea.style.margin = '';
        scrollArea.style.height = '';
        scrollArea.style.overflow = '';
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fechar menu mobile quando selecionar uma conversa
    if (selectedPhoneNumber && isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedPhoneNumber, isMobile]);

  const checkWhatsAppConfig = async () => {
    setLoading(true);
    setConfigError(null);
    try {
      const config = await whatsappApi.getConfig();
      if (!config.isActive) {
        setConfigError(
          'A configuração do WhatsApp está inativa. Ative-a nas configurações de integrações.'
        );
      } else {
        setWhatsappConfig(config);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setConfigError(
          'WhatsApp não está configurado. Configure a integração antes de usar.'
        );
      } else {
        console.error('Erro ao verificar configuração WhatsApp:', error);
        setConfigError('Erro ao verificar configuração do WhatsApp.');
      }
      setWhatsappConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedPhoneNumber(null);
    setSelectedContactName(undefined);
  };

  const handleGoToIntegrations = () => {
    navigate('/integrations');
  };

  // Verificar permissões antes de renderizar
  if (!hasAccess) {
    return (
      <Layout>
        <PageContainer>
          <BackButton onClick={() => navigate(-1)}>
            <MdArrowBack size={18} />
            Voltar
          </BackButton>
          <PermissionDeniedContainer>
            <PermissionDeniedIcon>
              <MdLock size={64} color='#EF4444' />
            </PermissionDeniedIcon>
            <PermissionDeniedTitle>Acesso Negado</PermissionDeniedTitle>
            <PermissionDeniedText>
              Você não tem permissão para acessar esta funcionalidade.
              <br />
              <br />
              Entre em contato com o administrador do sistema para solicitar
              acesso.
            </PermissionDeniedText>
          </PermissionDeniedContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <WhatsAppShimmer />
        </PageContainer>
      </Layout>
    );
  }

  // Se não estiver configurado, mostrar tela de configuração obrigatória
  if (!whatsappConfig || !whatsappConfig.isActive) {
    return (
      <Layout>
        <PageContainer>
          <BackButton onClick={() => navigate(-1)}>
            <MdArrowBack size={18} />
            Voltar
          </BackButton>
          <ConfigRequiredContainer>
            <ConfigRequiredIcon>
              <FaWhatsapp size={64} color='#F59E0B' />
            </ConfigRequiredIcon>
            <ConfigRequiredTitle>Configuração Obrigatória</ConfigRequiredTitle>
            <ConfigRequiredText>
              {configError ||
                'O WhatsApp precisa ser configurado antes de ser utilizado.'}
              <br />
              <br />
              Configure a integração com WhatsApp Business API na página de
              Integrações para começar a receber e enviar mensagens.
            </ConfigRequiredText>
            <ConfigButton onClick={handleGoToIntegrations}>
              <MdSettings size={20} />
              Ir para Configurações de Integrações
            </ConfigButton>
          </ConfigRequiredContainer>
        </PageContainer>
      </Layout>
    );
  }

  if (showNotificationDashboard && isAdminOrManager) {
    return (
      <Layout>
        <DashboardPageContainer>
          <div
            style={{
              padding: '16px 16px 0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <BackButton onClick={() => setShowNotificationDashboard(false)}>
              <MdArrowBack size={18} />
              Voltar para Conversas
            </BackButton>
          </div>
          <DashboardContentWrapper>
            <WhatsAppNotificationDashboard />
          </DashboardContentWrapper>
        </DashboardPageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <ChatLayout>
          {isAdminOrManager && !selectedPhoneNumber && (
            <DashboardButtonContainer>
              <ConfigButton
                onClick={() => setShowNotificationDashboard(true)}
                style={{
                  background: '#F59E0B',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                }}
              >
                <MdNotificationsActive size={18} />
                Dashboard de Notificações
              </ConfigButton>
            </DashboardButtonContainer>
          )}
          <MobileOverlay
            $isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarContainer $isMobile={isMobile} $isOpen={isMobileMenuOpen}>
            <WhatsAppMessagesList
              onMessageClick={message => {
                handleViewConversation(
                  message.phoneNumber,
                  message.contactName
                );
              }}
              selectedPhoneNumber={selectedPhoneNumber}
              hasFunnelConfigured={!!whatsappConfig?.defaultProjectId}
            />
          </SidebarContainer>
          <ChatContainer $isMobile={isMobile}>
            {isMobile && !selectedPhoneNumber && (
              <MobileHeader>
                <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
                  <MdMenu size={24} />
                </MobileMenuButton>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaWhatsapp size={20} />
                  WhatsApp
                </div>
                <div style={{ width: '40px' }} /> {/* Spacer */}
              </MobileHeader>
            )}
            {selectedPhoneNumber ? (
              <WhatsAppConversationViewer
                phoneNumber={selectedPhoneNumber}
                contactName={selectedContactName}
                onBack={handleBackToList}
                hasFunnelConfigured={!!whatsappConfig?.defaultProjectId}
                onOpenMenu={() => setIsMobileMenuOpen(true)}
              />
            ) : (
              <EmptyStateContainer>
                <div>
                  <EmptyStateIcon>
                    <FaWhatsapp size={64} />
                  </EmptyStateIcon>
                  <p>Selecione uma conversa para começar</p>
                </div>
              </EmptyStateContainer>
            )}
          </ChatContainer>
        </ChatLayout>
      </PageContainer>
    </Layout>
  );
};

export default WhatsAppPage;
