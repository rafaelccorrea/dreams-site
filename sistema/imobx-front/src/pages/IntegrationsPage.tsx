import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { IntegrationsShimmer } from '../components/shimmer/IntegrationsShimmer';
import { whatsappApi } from '../services/whatsappApi';
import { metaCampaignApi } from '../services/metaCampaignApi';
import { grupoZapApi } from '../services/grupoZapApi';
import { leadDistributionApi } from '../services/leadDistributionApi';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';
import {
  MdSettings,
  MdCheckCircle,
  MdArrowForward,
  MdInfo,
  MdWarning,
  MdLock,
  MdPeople,
  MdNotificationsActive,
  MdArrowBack,
  MdCampaign,
  MdHome,
} from 'react-icons/md';
import { FaWhatsapp, FaFacebookF } from 'react-icons/fa';
import type { WhatsAppConfig } from '../types/whatsapp';
import { formatPhoneDisplay } from '../utils/whatsappUtils';

const PageContainer = styled.div`
  padding: 0;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: 0;
  }

  @media (max-width: 768px) {
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.875rem;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const IntegrationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const IntegrationCard = styled.div<{
  $isConfigured: boolean;
  $integrationId?: string;
}>`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
  @media (max-width: 480px) {
    min-height: 240px;
  }
  background: ${props => {
    if (props.$integrationId === 'whatsapp' && props.$isConfigured) {
      return 'linear-gradient(135deg, rgba(37, 211, 102, 0.05) 0%, rgba(37, 211, 102, 0.02) 100%)';
    }
    if (props.$integrationId === 'meta-campaign' && props.$isConfigured) {
      return 'linear-gradient(135deg, rgba(24, 119, 242, 0.06) 0%, rgba(88, 101, 242, 0.03) 100%)';
    }
    if (props.$integrationId === 'grupo-zap' && props.$isConfigured) {
      return 'linear-gradient(135deg, rgba(0, 166, 81, 0.06) 0%, rgba(0, 166, 81, 0.02) 100%)';
    }
    if (props.$integrationId === 'lead-distribution' && props.$isConfigured) {
      return 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)';
    }
    return props.theme.colors.cardBackground;
  }};
  border: 2px solid
    ${props => {
      if (props.$integrationId === 'whatsapp' && props.$isConfigured)
        return '#10B981';
      if (props.$integrationId === 'meta-campaign' && props.$isConfigured)
        return '#1877F2';
      if (props.$integrationId === 'grupo-zap' && props.$isConfigured)
        return '#00A651';
      if (props.$integrationId === 'lead-distribution' && props.$isConfigured)
        return '#6366F1';
      return props.theme.colors.border;
    }};
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${props =>
    props.$integrationId === 'whatsapp' &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #25D366 0%, #128C7E 100%);
      opacity: ${props.$isConfigured ? 1 : 0.3};
      transition: opacity 0.3s ease;
    }
  `}
  ${props =>
    props.$integrationId === 'meta-campaign' &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #1877F2 0%, #5865F2 50%, #E1306C 100%);
      opacity: ${props.$isConfigured ? 1 : 0.4};
      transition: opacity 0.3s ease;
    }
  `}
  ${props =>
    props.$integrationId === 'grupo-zap' &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #00A651 0%, #008C4A 100%);
      opacity: ${props.$isConfigured ? 1 : 0.4};
      transition: opacity 0.3s ease;
    }
  `}
  ${props =>
    props.$integrationId === 'lead-distribution' &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%);
      opacity: ${props.$isConfigured ? 1 : 0.4};
      transition: opacity 0.3s ease;
    }
  `}

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 10px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => {
      if (props.$integrationId === 'whatsapp' && props.$isConfigured)
        return '0 12px 32px rgba(37, 211, 102, 0.2)';
      if (props.$integrationId === 'meta-campaign' && props.$isConfigured)
        return '0 12px 32px rgba(24, 119, 242, 0.18)';
      if (props.$integrationId === 'grupo-zap' && props.$isConfigured)
        return '0 12px 32px rgba(0, 166, 81, 0.18)';
      if (props.$integrationId === 'lead-distribution' && props.$isConfigured)
        return '0 12px 32px rgba(99, 102, 241, 0.18)';
      return '0 12px 32px rgba(0, 0, 0, 0.12)';
    }};
    border-color: ${props => {
      if (props.$integrationId === 'whatsapp' && props.$isConfigured)
        return '#10B981';
      if (props.$integrationId === 'meta-campaign')
        return props.$isConfigured ? '#1877F2' : props.theme.colors.primary;
      if (props.$integrationId === 'grupo-zap')
        return props.$isConfigured ? '#00A651' : props.theme.colors.primary;
      if (props.$integrationId === 'lead-distribution')
        return props.$isConfigured ? '#6366F1' : props.theme.colors.primary;
      return props.$isConfigured ? '#10B981' : props.theme.colors.primary;
    }};

    @media (max-width: 768px) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }
  }
`;

const IntegrationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const IntegrationIcon = styled.div<{ $color: string; $integrationId?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => {
    if (props.$integrationId === 'whatsapp')
      return 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
    if (props.$integrationId === 'meta-campaign')
      return 'linear-gradient(135deg, #1877F2 0%, #5865F2 100%)';
    if (props.$integrationId === 'grupo-zap')
      return 'linear-gradient(135deg, #00A651 0%, #008C4A 100%)';
    if (props.$integrationId === 'lead-distribution')
      return 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
    return `${props.$color}20`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: ${props => {
    if (props.$integrationId === 'whatsapp')
      return '0 4px 12px rgba(37, 211, 102, 0.3)';
    if (props.$integrationId === 'meta-campaign')
      return '0 4px 12px rgba(24, 119, 242, 0.35)';
    if (props.$integrationId === 'grupo-zap')
      return '0 4px 12px rgba(0, 166, 81, 0.35)';
    if (props.$integrationId === 'lead-distribution')
      return '0 4px 12px rgba(99, 102, 241, 0.35)';
    return 'none';
  }};
  transition: all 0.3s ease;
  color: ${props =>
    props.$integrationId === 'whatsapp' ||
    props.$integrationId === 'meta-campaign' ||
    props.$integrationId === 'grupo-zap' ||
    props.$integrationId === 'lead-distribution'
      ? 'white'
      : 'inherit'};

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 22px;
    border-radius: 10px;
  }
`;

const IntegrationInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const IntegrationName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }
`;

const IntegrationDescription = styled.p`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.3;
  }
`;

const StatusBadge = styled.div<{ $isConfigured: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  width: fit-content;

  ${props =>
    props.$isConfigured
      ? `
    background: #10B98120;
    color: #10B981;
  `
      : `
    background: #F59E0B20;
    color: #F59E0B;
  `}

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    padding: 5px 10px;
    gap: 4px;
  }
`;

const IntegrationDetails = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  padding: 12px;
  margin-left: -4px;
  margin-right: -4px;

  @media (max-width: 480px) {
    margin-top: 10px;
    padding-top: 10px;
    padding: 10px;
    margin-left: -2px;
    margin-right: -2px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.875rem;
  gap: 12px;

  @media (max-width: 480px) {
    font-size: 0.8125rem;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 2px;
  }
`;

const DetailValue = styled.span<{ $isActive?: boolean }>`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  text-align: right;
  word-break: break-word;

  ${props =>
    props.$isActive &&
    `
    color: #10B981;
  `}

  @media (max-width: 480px) {
    text-align: left;
    width: 100%;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  min-height: 44px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 480px) {
    padding: 12px 16px;
    min-height: 48px;
    font-size: 0.9375rem;
  }

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CardBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const CardActions = styled.div`
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
`;

const ConfigButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConfigButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cardBackground};
  cursor: pointer;
  transition: all 0.2s ease;

  @media (max-width: 480px) {
    min-height: 48px;
    padding: 12px 14px;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const WarningMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #f59e0b15;
  border: 1px solid #f59e0b30;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.875rem;
  color: #f59e0b;

  @media (max-width: 480px) {
    margin-top: 12px;
    padding: 10px;
    font-size: 0.8125rem;
    gap: 6px;
    flex-direction: column;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 30px 12px;
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;

  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 12px;
  }
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  isConfigured: boolean;
  config?: any;
  onConfigure: () => void;
}

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const { getCurrentUser } = useAuth();
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig | null>(
    null
  );
  const [metaCampaignConfigured, setMetaCampaignConfigured] = useState(false);
  const [grupoZapConfigured, setGrupoZapConfigured] = useState(false);
  const [leadDistributionConfigured, setLeadDistributionConfigured] =
    useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar permissões e roles
  const user = getCurrentUser();
  const userRole = user?.role?.toLowerCase();
  const isAdminOrManager = userRole
    ? ['admin', 'manager', 'master'].includes(userRole)
    : false;

  // Verificar permissões do WhatsApp
  const hasViewPermission =
    permissionsContext?.hasPermission('whatsapp:view') ?? false;
  const hasViewMessagesPermission =
    permissionsContext?.hasPermission('whatsapp:view_messages') ?? false;
  const hasManageConfigPermission =
    permissionsContext?.hasPermission('whatsapp:manage_config') ?? false;
  const hasIntegrationViewPermission =
    permissionsContext?.hasPermission('integration:view') ?? false;
  // Permissões integrações plano PRO (Meta Campanhas e Portal Grupo ZAP)
  const hasMetaCampaignView =
    permissionsContext?.hasPermission('meta_campaign:view') ?? false;
  const hasMetaCampaignManageConfig =
    permissionsContext?.hasPermission('meta_campaign:manage_config') ?? false;
  const hasGrupoZapView =
    permissionsContext?.hasPermission('grupo_zap:view') ?? false;
  const hasGrupoZapManageConfig =
    permissionsContext?.hasPermission('grupo_zap:manage_config') ?? false;
  const hasLeadDistributionView =
    permissionsContext?.hasPermission('lead_distribution:view') ?? false;
  const hasLeadDistributionManageConfig =
    permissionsContext?.hasPermission('lead_distribution:manage_config') ??
    false;
  const hasAccess =
    hasViewPermission ||
    hasViewMessagesPermission ||
    hasManageConfigPermission ||
    hasIntegrationViewPermission ||
    hasMetaCampaignView ||
    hasMetaCampaignManageConfig ||
    hasGrupoZapView ||
    hasGrupoZapManageConfig ||
    hasLeadDistributionView ||
    hasLeadDistributionManageConfig;

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
        <IntegrationsShimmer />
      </Layout>
    );
  }

  if (!hasAccess) {
    return null;
  }

  const canViewWhatsApp =
    permissionsContext?.hasPermission('whatsapp:view') ?? false;
  const canManageConfig =
    (permissionsContext?.hasPermission('whatsapp:manage_config') ?? false) &&
    isAdminOrManager;
  const canManageMetaCampaign = hasMetaCampaignManageConfig;
  const canManageGrupoZap = hasGrupoZapManageConfig;
  const canManageLeadDistribution = hasLeadDistributionManageConfig;

  useEffect(() => {
    loadIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      // Carregar configuração do WhatsApp apenas se tiver permissão
      if (canViewWhatsApp || canManageConfig) {
        try {
          const config = await whatsappApi.getConfig();
          setWhatsappConfig(config);
        } catch (error: any) {
          if (error.response?.status === 403) {
            // Sem permissão, não mostrar erro
            setWhatsappConfig(null);
          } else if (error.response?.status !== 404) {
            console.error('Erro ao carregar configuração WhatsApp:', error);
            setWhatsappConfig(null);
          } else {
            setWhatsappConfig(null);
          }
        }
      }
      if (hasMetaCampaignView || hasMetaCampaignManageConfig) {
        try {
          const metaConfig = await metaCampaignApi.getConfig();
          setMetaCampaignConfigured(!!metaConfig?.isActive);
        } catch {
          setMetaCampaignConfigured(false);
        }
      }
      if (hasGrupoZapView || hasGrupoZapManageConfig) {
        try {
          const grupoZapConfig = await grupoZapApi.getConfig();
          // Configurado quando isActive ou quando já tem URLs geradas (feed/webhook)
          setGrupoZapConfigured(
            !!(
              grupoZapConfig?.isActive ||
              grupoZapConfig?.feedToken ||
              grupoZapConfig?.webhookToken
            )
          );
        } catch {
          setGrupoZapConfigured(false);
        }
      }
      if (hasLeadDistributionView || hasLeadDistributionManageConfig) {
        try {
          const configs = await leadDistributionApi.list();
          setLeadDistributionConfigured(configs.length > 0);
        } catch {
          setLeadDistributionConfigured(false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
    } finally {
      setLoading(false);
    }
  };

  const integrations: Integration[] = [
    // Mostrar WhatsApp apenas se tiver permissão de visualização ou gerenciamento
    ...(canViewWhatsApp || canManageConfig
      ? [
          {
            id: 'whatsapp',
            name: 'WhatsApp Business API',
            description:
              whatsappConfig && whatsappConfig.isActive
                ? 'Integração ativa! Receba e envie mensagens, crie tarefas automaticamente e use IA para análise de leads.'
                : 'Integração com WhatsApp Business API para receber e enviar mensagens, criar tarefas automaticamente e usar IA para análise de leads.',
            icon: <FaWhatsapp size={32} color='white' />,
            iconColor: '#25D366',
            isConfigured: !!whatsappConfig && whatsappConfig.isActive,
            config: whatsappConfig,
            onConfigure: () => navigate('/integrations/whatsapp/config'),
          },
        ]
      : []),
    // Integração Campanha META FACEBOOK (plano PRO)
    ...(hasMetaCampaignView || hasMetaCampaignManageConfig
      ? [
          {
            id: 'meta-campaign',
            name: 'Campanha META (Facebook/Instagram)',
            description:
              'Integração com Meta Ads para criar e gerenciar campanhas de anúncios no Facebook e Instagram. Sincronize leads e métricas com o CRM.',
            icon: <FaFacebookF size={28} color='white' />,
            iconColor: '#1877F2',
            isConfigured: metaCampaignConfigured,
            onConfigure: () => navigate('/integrations/meta-campaign/config'),
          },
        ]
      : []),
    // Integração Portal Grupo ZAP (plano PRO)
    ...(hasGrupoZapView || hasGrupoZapManageConfig
      ? [
          {
            id: 'grupo-zap',
            name: 'Portal Grupo ZAP',
            description:
              'Integração com o portal do Grupo ZAP (ZAP, Viva Real, OLX) para publicação de imóveis, sincronização de anúncios e captação de leads.',
            icon: <MdHome size={28} color='white' />,
            iconColor: '#00A651',
            isConfigured: grupoZapConfigured,
            onConfigure: () => navigate('/integrations/grupo-zap/config'),
          },
        ]
      : []),
    // Distribuição de Leads (plano PRO)
    ...(hasLeadDistributionView || hasLeadDistributionManageConfig
      ? [
          {
            id: 'lead-distribution',
            name: 'Distribuição de Leads',
            description:
              'Configure distribuição automática de leads, SLA de primeiro contato, alertas e reatribuição por funil ou globalmente.',
            icon: <MdPeople size={28} color='white' />,
            iconColor: '#6366F1',
            isConfigured: leadDistributionConfigured,
            onConfigure: () =>
              navigate('/integrations/lead-distribution/config'),
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <IntegrationsShimmer />
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <Header>
            <HeaderLeft>
              <Title>Integrações</Title>
              <Subtitle>
                Configure e gerencie integrações com serviços externos para
                expandir as funcionalidades do sistema
              </Subtitle>
            </HeaderLeft>
            <BackButton onClick={() => navigate(-1)}>
              <MdArrowBack size={18} />
              Voltar
            </BackButton>
          </Header>

          <IntegrationsGrid>
            {integrations.map(integration => (
              <IntegrationCard
                key={integration.id}
                $isConfigured={integration.isConfigured}
                $integrationId={integration.id}
              >
                <CardBody>
                  <IntegrationHeader>
                    <IntegrationIcon
                      $color={integration.iconColor}
                      $integrationId={integration.id}
                    >
                      {integration.icon}
                    </IntegrationIcon>
                    <IntegrationInfo>
                      <IntegrationName>{integration.name}</IntegrationName>
                      <IntegrationDescription>
                        {integration.description}
                      </IntegrationDescription>
                      <StatusBadge $isConfigured={integration.isConfigured}>
                        {integration.isConfigured ? (
                          <>
                            <MdCheckCircle size={16} />
                            Configurado
                          </>
                        ) : (
                          <>
                            <MdWarning size={16} />
                            Não Configurado
                          </>
                        )}
                      </StatusBadge>
                    </IntegrationInfo>
                  </IntegrationHeader>

                  {integration.id === 'whatsapp' && whatsappConfig && (
                    <IntegrationDetails>
                      <DetailItem>
                        <DetailLabel
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <MdCheckCircle
                            size={16}
                            style={{
                              marginRight: '6px',
                              color: whatsappConfig.isActive
                                ? '#10B981'
                                : '#6B7280',
                            }}
                          />
                          Status
                        </DetailLabel>
                        <DetailValue $isActive={whatsappConfig.isActive}>
                          {whatsappConfig.isActive ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                background: '#10B98115',
                                borderRadius: '6px',
                                color: '#10B981',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                              }}
                            >
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#10B981',
                                  display: 'inline-block',
                                  boxShadow:
                                    '0 0 0 2px rgba(16, 185, 129, 0.2)',
                                }}
                              ></span>
                              Ativo
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                background: '#6B728015',
                                borderRadius: '6px',
                                color: '#6B7280',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                              }}
                            >
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#6B7280',
                                  display: 'inline-block',
                                }}
                              ></span>
                              Inativo
                            </span>
                          )}
                        </DetailValue>
                      </DetailItem>
                      {whatsappConfig.phoneNumber && (
                        <DetailItem>
                          <DetailLabel
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <FaWhatsapp
                              size={14}
                              style={{ marginRight: '6px', color: '#25D366' }}
                            />
                            Número
                          </DetailLabel>
                          <DetailValue
                            style={{
                              fontWeight: 600,
                              color: '#25D366',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <FaWhatsapp size={12} />
                            {formatPhoneDisplay(whatsappConfig.phoneNumber) ||
                              whatsappConfig.phoneNumber}
                          </DetailValue>
                        </DetailItem>
                      )}
                      {whatsappConfig.phoneNumberId && (
                        <DetailItem>
                          <DetailLabel>Phone Number ID</DetailLabel>
                          <DetailValue
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.8125rem',
                              background: 'rgba(0, 0, 0, 0.04)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(0, 0, 0, 0.08)',
                            }}
                          >
                            {whatsappConfig.phoneNumberId}
                          </DetailValue>
                        </DetailItem>
                      )}
                      {whatsappConfig.businessName && (
                        <DetailItem>
                          <DetailLabel>Negócio</DetailLabel>
                          <DetailValue
                            style={{ fontWeight: 600, fontSize: '0.9375rem' }}
                          >
                            {whatsappConfig.businessName}
                          </DetailValue>
                        </DetailItem>
                      )}
                    </IntegrationDetails>
                  )}

                  {integration.id === 'whatsapp' &&
                    whatsappConfig &&
                    whatsappConfig.isActive && (
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '12px',
                          background:
                            'linear-gradient(135deg, rgba(37, 211, 102, 0.08) 0%, rgba(18, 140, 126, 0.08) 100%)',
                          borderRadius: '10px',
                          border: '1px solid rgba(37, 211, 102, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.8125rem',
                            color: '#128C7E',
                            fontWeight: 600,
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <FaWhatsapp size={14} />
                          Funcionalidades Ativas
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '8px',
                            fontSize: '0.8125rem',
                            color: '#128C7E',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#10B981' }}>✓</span>
                            Recebimento de mensagens
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#10B981' }}>✓</span>
                            Envio de mensagens
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#10B981' }}>✓</span>
                            Criação automática de tarefas
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#10B981' }}>✓</span>
                            Análise de leads com IA
                          </div>
                        </div>
                      </div>
                    )}

                  {integration.id === 'meta-campaign' &&
                    integration.isConfigured && (
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '12px',
                          background:
                            'linear-gradient(135deg, rgba(24, 119, 242, 0.08) 0%, rgba(88, 101, 242, 0.06) 100%)',
                          borderRadius: '10px',
                          border: '1px solid rgba(24, 119, 242, 0.25)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.8125rem',
                            color: '#1877F2',
                            fontWeight: 600,
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <FaFacebookF size={14} />
                          Recursos da integração
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '8px',
                            fontSize: '0.8125rem',
                            color: '#1877F2',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#1877F2' }}>✓</span>
                            Campanhas Facebook e Instagram
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#1877F2' }}>✓</span>
                            Leads sincronizados com CRM
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#1877F2' }}>✓</span>
                            Métricas e redirecionamento
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#1877F2' }}>✓</span>
                            Tarefas automáticas no funil
                          </div>
                        </div>
                      </div>
                    )}

                  {integration.id === 'grupo-zap' &&
                    integration.isConfigured && (
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '12px',
                          background:
                            'linear-gradient(135deg, rgba(0, 166, 81, 0.08) 0%, rgba(0, 140, 74, 0.06) 100%)',
                          borderRadius: '10px',
                          border: '1px solid rgba(0, 166, 81, 0.25)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.8125rem',
                            color: '#008C4A',
                            fontWeight: 600,
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <MdHome size={14} />
                          Recursos da integração
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '8px',
                            fontSize: '0.8125rem',
                            color: '#008C4A',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#00A651' }}>✓</span>
                            ZAP, Viva Real e OLX
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#00A651' }}>✓</span>
                            Publicação de imóveis
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#00A651' }}>✓</span>
                            Sincronização de anúncios
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span style={{ color: '#00A651' }}>✓</span>
                            Captação de leads
                          </div>
                        </div>
                      </div>
                    )}

                  {!integration.isConfigured && (
                    <WarningMessage>
                      <MdInfo size={18} />
                      <div>
                        Esta integração precisa ser configurada antes de ser
                        utilizada.
                        {((integration.id === 'whatsapp' && canManageConfig) ||
                          (integration.id === 'meta-campaign' &&
                            canManageMetaCampaign) ||
                          (integration.id === 'grupo-zap' &&
                            canManageGrupoZap) ||
                          (integration.id === 'lead-distribution' &&
                            canManageLeadDistribution)) &&
                          ' Clique no card para configurar.'}
                      </div>
                    </WarningMessage>
                  )}
                </CardBody>

                <CardActions>
                  {(integration.id === 'whatsapp' && canManageConfig) ||
                  (integration.id === 'meta-campaign' &&
                    canManageMetaCampaign) ||
                  (integration.id === 'grupo-zap' && canManageGrupoZap) ||
                  (integration.id === 'lead-distribution' &&
                    canManageLeadDistribution) ? (
                    <>
                      {integration.id === 'whatsapp' &&
                        integration.isConfigured &&
                        isAdminOrManager && (
                          <ConfigButtonsContainer>
                            <ConfigButton
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                navigate('/integrations/whatsapp/distribution');
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <MdPeople size={18} />
                                <span>
                                  Configurar Distribuição de Mensagens
                                </span>
                              </div>
                              <MdArrowForward size={16} />
                            </ConfigButton>
                            <ConfigButton
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                navigate(
                                  '/integrations/whatsapp/notifications'
                                );
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <MdNotificationsActive size={18} />
                                <span>Configurar Notificações por Tempo</span>
                              </div>
                              <MdArrowForward size={16} />
                            </ConfigButton>
                          </ConfigButtonsContainer>
                        )}
                      {integration.id === 'meta-campaign' &&
                        integration.isConfigured &&
                        canManageMetaCampaign && (
                          <ConfigButtonsContainer>
                            <ConfigButton
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                navigate(
                                  '/integrations/meta-campaign/campaigns'
                                );
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <MdCampaign size={18} />
                                <span>
                                  Gerenciar Campanhas e Redirecionamento
                                </span>
                              </div>
                              <MdArrowForward size={16} />
                            </ConfigButton>
                          </ConfigButtonsContainer>
                        )}
                      <ActionButton
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (integration.id === 'whatsapp') {
                            navigate('/integrations/whatsapp/config');
                          } else if (integration.id === 'meta-campaign') {
                            navigate('/integrations/meta-campaign/config');
                          } else if (integration.id === 'grupo-zap') {
                            navigate('/integrations/grupo-zap/config');
                          } else if (integration.id === 'lead-distribution') {
                            navigate('/integrations/lead-distribution/config');
                          } else {
                            integration.onConfigure();
                          }
                        }}
                        type='button'
                      >
                        <MdSettings size={18} />
                        {integration.isConfigured
                          ? 'Gerenciar Configuração'
                          : 'Configurar Integração'}
                        <MdArrowForward size={18} />
                      </ActionButton>
                    </>
                  ) : (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '14px',
                        background: '#F59E0B15',
                        border: '1px solid #F59E0B30',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        fontSize: '0.875rem',
                        color: '#F59E0B',
                        lineHeight: '1.5',
                      }}
                    >
                      <MdLock
                        size={20}
                        style={{ flexShrink: 0, marginTop: '2px' }}
                      />
                      <div>
                        <strong
                          style={{ display: 'block', marginBottom: '4px' }}
                        >
                          Permissão necessária
                        </strong>
                        Você não tem permissão para configurar esta integração.
                        Entre em contato com o administrador do sistema para
                        solicitar acesso.
                      </div>
                    </div>
                  )}
                </CardActions>
              </IntegrationCard>
            ))}
          </IntegrationsGrid>

          {integrations.length === 0 && (
            <EmptyState>
              <EmptyStateIcon>🔌</EmptyStateIcon>
              <EmptyStateText>
                Nenhuma integração disponível no momento.
                <br />
                Novas integrações serão adicionadas em breve.
              </EmptyStateText>
            </EmptyState>
          )}
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default IntegrationsPage;
