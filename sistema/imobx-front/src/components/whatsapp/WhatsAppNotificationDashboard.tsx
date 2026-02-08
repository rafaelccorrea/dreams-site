import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdWarning,
  MdSchedule,
  MdRefresh,
  MdTrendingUp,
  MdTrendingDown,
  MdCheckCircle,
} from 'react-icons/md';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { whatsappApi } from '../../services/whatsappApi';
import { showError } from '../../utils/notifications';
import {
  formatPhoneDisplay,
  formatMessageTime,
  calculateMessageTimeStatus,
} from '../../utils/whatsappUtils';
import { SafeChartWrapper } from '../charts/ChartProvider';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import type {
  WhatsAppMessageWithRelations,
  MessagesNeedingNotificationStatistics,
} from '../../types/whatsapp';
import dayjs from 'dayjs';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 8px 0 32px;
  background: transparent;
  min-height: min-content;

  @media (max-width: 768px) {
    gap: 20px;
    padding-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 16px;
    padding-bottom: 20px;
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DashboardTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: ${props =>
      props.theme.colors.primaryDark || props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div<{
  $type?: 'critical' | 'delayed' | 'onTime' | 'total';
}>`
  background: ${props => {
    if (props.$type === 'critical') {
      return props.theme.mode === 'dark'
        ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.18) 0%, rgba(239, 68, 68, 0.06) 100%)'
        : 'linear-gradient(145deg, #FEF2F2 0%, #FEE2E2 100%)';
    }
    if (props.$type === 'delayed') {
      return props.theme.mode === 'dark'
        ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.06) 100%)'
        : 'linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%)';
    }
    if (props.$type === 'onTime') {
      return props.theme.mode === 'dark'
        ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.06) 100%)'
        : 'linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%)';
    }
    return props.theme.colors.cardBackground;
  }};
  border: 1px solid
    ${props => {
      if (props.$type === 'critical')
        return props.theme.mode === 'dark'
          ? 'rgba(239, 68, 68, 0.25)'
          : 'rgba(239, 68, 68, 0.2)';
      if (props.$type === 'delayed')
        return props.theme.mode === 'dark'
          ? 'rgba(245, 158, 11, 0.25)'
          : 'rgba(245, 158, 11, 0.2)';
      if (props.$type === 'onTime')
        return props.theme.mode === 'dark'
          ? 'rgba(16, 185, 129, 0.25)'
          : 'rgba(16, 185, 129, 0.2)';
      return props.theme.colors.border;
    }};
  border-radius: 14px;
  padding: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.2)'
      : '0 2px 10px rgba(0,0,0,0.04)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 8px 24px rgba(0,0,0,0.25)'
        : '0 8px 24px rgba(0,0,0,0.08)'};
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatIcon = styled.div<{
  $type?: 'critical' | 'delayed' | 'onTime' | 'total';
}>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.$type === 'critical') return 'rgba(239, 68, 68, 0.2)';
    if (props.$type === 'delayed') return 'rgba(245, 158, 11, 0.2)';
    if (props.$type === 'onTime') return 'rgba(16, 185, 129, 0.2)';
    return props.theme.colors.backgroundSecondary;
  }};
  color: ${props => {
    if (props.$type === 'critical') return '#EF4444';
    if (props.$type === 'delayed') return '#F59E0B';
    if (props.$type === 'onTime') return '#10B981';
    return props.theme.colors.primary;
  }};
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.375rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
  font-weight: 500;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 14px;
  padding: 22px;
  transition: box-shadow 0.2s ease;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.2)'
      : '0 2px 10px rgba(0,0,0,0.04)'};

  &:hover {
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 6px 20px rgba(0,0,0,0.25)'
        : '0 6px 20px rgba(0,0,0,0.06)'};
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 18px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
`;

const ChartContainer = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  min-height: 350px;

  @media (max-width: 768px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 14px;
  padding: 22px;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.2)'
      : '0 2px 10px rgba(0,0,0,0.04)'};

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 10px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const SectionTitle = styled.h3<{ $color?: string }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.$color || props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MessageAlert = styled.div<{ $type: 'critical' | 'delayed' }>`
  padding: 14px 16px;
  background: ${props => {
    if (props.theme.mode === 'dark') {
      return props.$type === 'critical'
        ? 'rgba(239, 68, 68, 0.12)'
        : 'rgba(245, 158, 11, 0.12)';
    }
    return props.$type === 'critical' ? '#FEF2F2' : '#FFFBEB';
  }};
  border: 1px solid
    ${props => {
      if (props.theme.mode === 'dark') {
        return props.$type === 'critical'
          ? 'rgba(239, 68, 68, 0.25)'
          : 'rgba(245, 158, 11, 0.25)';
      }
      return props.$type === 'critical'
        ? 'rgba(239, 68, 68, 0.2)'
        : 'rgba(245, 158, 11, 0.2)';
    }};
  border-radius: 10px;
  border-left: 4px solid
    ${props => (props.$type === 'critical' ? '#EF4444' : '#F59E0B')};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateX(2px);
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.2)'
        : '0 4px 12px rgba(0,0,0,0.06)'};
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const PhoneNumber = styled.div`
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
`;

const MessageText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  line-height: 1.5;
`;

const MessageMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ConversationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.06)'};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.6875rem;
  font-weight: 600;
  margin-left: 8px;
  letter-spacing: 0.02em;
`;

const EmptyState = styled.div`
  padding: 32px 24px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9375rem;
  border-radius: 10px;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.02)'};
`;

interface WhatsAppNotificationDashboardProps {
  className?: string;
}

export const WhatsAppNotificationDashboard: React.FC<
  WhatsAppNotificationDashboardProps
> = ({ className }) => {
  const permissionsContext = usePermissionsContextOptional();
  const [delayedMessages, setDelayedMessages] = useState<
    WhatsAppMessageWithRelations[]
  >([]);
  const [criticalMessages, setCriticalMessages] = useState<
    WhatsAppMessageWithRelations[]
  >([]);
  const [onTimeMessages, setOnTimeMessages] = useState<
    WhatsAppMessageWithRelations[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] =
    useState<MessagesNeedingNotificationStatistics | null>(null);

  // Verificar permissão
  const hasViewMessagesPermission =
    permissionsContext?.hasPermission('whatsapp:view_messages') ?? false;

  useEffect(() => {
    loadMessages();

    // Atualizar apenas quando a página está visível e a cada 10 segundos (reduzido de 60s para atualizações mais rápidas)
    let intervalId: NodeJS.Timeout | null = null;

    const refreshIfVisible = () => {
      if (!document.hidden) {
        loadMessages();
      }
    };

    // Atualizar quando a página volta a ficar visível
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadMessages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Intervalo reduzido (10 segundos) e apenas quando visível para atualizações mais rápidas
    intervalId = setInterval(refreshIfVisible, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadMessages = async () => {
    // Verificar permissão antes de chamar API
    if (!hasViewMessagesPermission) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fazer uma única chamada com todos os status - backend retorna mensagens e estatísticas
      const response = await whatsappApi.getMessagesNeedingNotification([
        'on_time',
        'delayed',
        'critical',
      ]);

      // Salvar estatísticas retornadas pelo backend
      if (response.statistics) {
        setStatistics(response.statistics);
      }

      // Carregar configuração de notificações para calcular o status de cada mensagem (fallback)
      let notificationConfig;
      try {
        // Verificar permissão antes de chamar API
        const canViewConfig =
          permissionsContext?.hasPermission('whatsapp:view') ?? false;
        if (canViewConfig) {
          notificationConfig = await whatsappApi.getNotificationConfig();
        }
      } catch (configError: any) {
        // Se não houver configuração, usar valores padrão
        notificationConfig = {
          id: '',
          companyId: '',
          onTimeMinutes: 15,
          delayedMinutes: 30,
          criticalMinutes: 60,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Separar mensagens por status
      // Se o backend já retornar o campo timeStatus, usar ele; caso contrário, calcular
      const delayed: WhatsAppMessageWithRelations[] = [];
      const critical: WhatsAppMessageWithRelations[] = [];
      const onTime: WhatsAppMessageWithRelations[] = [];

      response.messages.forEach(msg => {
        // Tentar usar timeStatus do backend primeiro, se disponível
        const timeStatus =
          (msg as any).timeStatus ||
          calculateMessageTimeStatus(msg, notificationConfig);

        if (timeStatus === 'delayed') {
          delayed.push(msg as WhatsAppMessageWithRelations);
        } else if (timeStatus === 'critical') {
          critical.push(msg as WhatsAppMessageWithRelations);
        } else if (timeStatus === 'on_time') {
          onTime.push(msg as WhatsAppMessageWithRelations);
        }
      });

      setDelayedMessages(delayed);
      setCriticalMessages(critical);
      setOnTimeMessages(onTime);
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error);
      if (error.response?.status !== 404) {
        showError('Erro ao carregar mensagens que precisam de atenção');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  // Agrupar mensagens por número de telefone (conversas)
  const groupedDelayedMessages = useMemo(() => {
    const conversationMap = new Map<
      string,
      {
        phoneNumber: string;
        contactName?: string;
        lastMessage: WhatsAppMessageWithRelations;
        messageCount: number;
        unreadCount: number;
      }
    >();

    delayedMessages.forEach(message => {
      const phoneNumber = message.phoneNumber;
      const existing = conversationMap.get(phoneNumber);

      if (!existing) {
        conversationMap.set(phoneNumber, {
          phoneNumber,
          contactName: message.contactName,
          lastMessage: message,
          messageCount: 1,
          unreadCount:
            !message.readAt && message.direction === 'inbound' ? 1 : 0,
        });
      } else {
        const messageTime = new Date(message.createdAt).getTime();
        const lastMessageTime = new Date(
          existing.lastMessage.createdAt
        ).getTime();

        if (messageTime > lastMessageTime) {
          existing.lastMessage = message;
          existing.contactName = message.contactName || existing.contactName;
        }

        existing.messageCount++;
        if (!message.readAt && message.direction === 'inbound') {
          existing.unreadCount++;
        }
      }
    });

    return Array.from(conversationMap.values()).sort((a, b) => {
      const timeA = new Date(a.lastMessage.createdAt).getTime();
      const timeB = new Date(b.lastMessage.createdAt).getTime();
      return timeB - timeA;
    });
  }, [delayedMessages]);

  const groupedCriticalMessages = useMemo(() => {
    const conversationMap = new Map<
      string,
      {
        phoneNumber: string;
        contactName?: string;
        lastMessage: WhatsAppMessageWithRelations;
        messageCount: number;
        unreadCount: number;
      }
    >();

    criticalMessages.forEach(message => {
      const phoneNumber = message.phoneNumber;
      const existing = conversationMap.get(phoneNumber);

      if (!existing) {
        conversationMap.set(phoneNumber, {
          phoneNumber,
          contactName: message.contactName,
          lastMessage: message,
          messageCount: 1,
          unreadCount:
            !message.readAt && message.direction === 'inbound' ? 1 : 0,
        });
      } else {
        const messageTime = new Date(message.createdAt).getTime();
        const lastMessageTime = new Date(
          existing.lastMessage.createdAt
        ).getTime();

        if (messageTime > lastMessageTime) {
          existing.lastMessage = message;
          existing.contactName = message.contactName || existing.contactName;
        }

        existing.messageCount++;
        if (!message.readAt && message.direction === 'inbound') {
          existing.unreadCount++;
        }
      }
    });

    return Array.from(conversationMap.values()).sort((a, b) => {
      const timeA = new Date(a.lastMessage.createdAt).getTime();
      const timeB = new Date(b.lastMessage.createdAt).getTime();
      return timeB - timeA;
    });
  }, [criticalMessages]);

  // Usar estatísticas do backend se disponíveis, caso contrário calcular localmente
  const totalMessages =
    statistics?.totalToday ??
    delayedMessages.length + criticalMessages.length + onTimeMessages.length;
  const criticalCount =
    statistics?.byStatus?.critical ?? criticalMessages.length;
  const delayedCount = statistics?.byStatus?.delayed ?? delayedMessages.length;
  const onTimeCount = statistics?.byStatus?.onTime ?? onTimeMessages.length;

  // Dados para gráfico de distribuição (Doughnut)
  const distributionChartData = useMemo(
    () => ({
      labels: ['Em Dia', 'Atrasadas', 'Críticas'],
      datasets: [
        {
          data: [onTimeCount, delayedCount, criticalCount],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 2,
        },
      ],
    }),
    [onTimeCount, delayedCount, criticalCount]
  );

  // Dados para gráfico de barras (distribuição por hora do dia)
  // Usar statistics.byHour do backend se disponível, caso contrário calcular localmente
  const hourlyDistribution = useMemo(() => {
    if (statistics?.byHour && statistics.byHour.length > 0) {
      // Usar dados do backend
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const hourCounts = hours.map(hour => {
        const hourData = statistics.byHour.find(h => h.hour === hour);
        return hourData?.count || 0;
      });

      return {
        labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
        datasets: [
          {
            label: 'Mensagens',
            data: hourCounts,
            backgroundColor: (context: any) => {
              const value = context.parsed.y;
              if (value === 0) return 'rgba(156, 163, 175, 0.2)';
              if (value <= 2) return 'rgba(245, 158, 11, 0.6)';
              return 'rgba(239, 68, 68, 0.6)';
            },
            borderColor: (context: any) => {
              const value = context.parsed.y;
              if (value === 0) return 'rgba(156, 163, 175, 0.3)';
              if (value <= 2) return '#F59E0B';
              return '#EF4444';
            },
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      };
    }

    // Fallback: calcular localmente
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const hourCounts = hours.map(hour => {
      const allMessages = [...criticalMessages, ...delayedMessages];
      return allMessages.filter(msg => {
        const msgHour = dayjs(msg.createdAt).hour();
        return msgHour === hour;
      }).length;
    });

    return {
      labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
      datasets: [
        {
          label: 'Mensagens',
          data: hourCounts,
          backgroundColor: (context: any) => {
            const value = context.parsed.y;
            if (value === 0) return 'rgba(156, 163, 175, 0.2)';
            if (value <= 2) return 'rgba(245, 158, 11, 0.6)';
            return 'rgba(239, 68, 68, 0.6)';
          },
          borderColor: (context: any) => {
            const value = context.parsed.y;
            if (value === 0) return 'rgba(156, 163, 175, 0.3)';
            if (value <= 2) return '#F59E0B';
            return '#EF4444';
          },
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    };
  }, [statistics?.byHour, criticalMessages, delayedMessages]);

  // Dados para gráfico de linha (tendência dos últimos 7 dias)
  const trendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      return dayjs().subtract(6 - i, 'day');
    });

    const criticalTrend = days.map(day => {
      return criticalMessages.filter(msg => {
        return dayjs(msg.createdAt).isSame(day, 'day');
      }).length;
    });

    const delayedTrend = days.map(day => {
      return delayedMessages.filter(msg => {
        return dayjs(msg.createdAt).isSame(day, 'day');
      }).length;
    });

    return {
      labels: days.map(d => d.format('DD/MM')),
      datasets: [
        {
          label: 'Críticas',
          data: criticalTrend,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Atrasadas',
          data: delayedTrend,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [criticalMessages, delayedMessages]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <DashboardContainer className={className}>
      <DashboardHeader>
        <DashboardTitle>Dashboard de Notificações WhatsApp</DashboardTitle>
        <RefreshButton onClick={loadMessages} disabled={loading}>
          <MdRefresh size={18} />
          {loading ? 'Atualizando...' : 'Atualizar'}
        </RefreshButton>
      </DashboardHeader>

      <StatsGrid>
        <StatCard $type='total'>
          <StatHeader>
            <StatIcon $type='total'>
              <MdCheckCircle size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{totalMessages}</StatValue>
          <StatLabel>Total de Mensagens</StatLabel>
        </StatCard>

        <StatCard $type='onTime'>
          <StatHeader>
            <StatIcon $type='onTime'>
              <MdCheckCircle size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{onTimeCount}</StatValue>
          <StatLabel>Em Dia</StatLabel>
        </StatCard>

        <StatCard $type='delayed'>
          <StatHeader>
            <StatIcon $type='delayed'>
              <MdSchedule size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{delayedCount}</StatValue>
          <StatLabel>Atrasadas</StatLabel>
        </StatCard>

        <StatCard $type='critical'>
          <StatHeader>
            <StatIcon $type='critical'>
              <MdWarning size={24} />
            </StatIcon>
          </StatHeader>
          <StatValue>{criticalCount}</StatValue>
          <StatLabel>Críticas</StatLabel>
        </StatCard>

        {statistics && (
          <>
            <StatCard $type='total'>
              <StatHeader>
                <StatIcon $type='total'>
                  <MdCheckCircle size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.totalThisWeek || 0}</StatValue>
              <StatLabel>Esta Semana</StatLabel>
            </StatCard>

            <StatCard $type='total'>
              <StatHeader>
                <StatIcon $type='total'>
                  <MdCheckCircle size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.totalThisMonth || 0}</StatValue>
              <StatLabel>Este Mês</StatLabel>
            </StatCard>

            <StatCard $type='onTime'>
              <StatHeader>
                <StatIcon $type='onTime'>
                  <MdSchedule size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.averageResponseTime || 0} min</StatValue>
              <StatLabel>Tempo Médio de Resposta</StatLabel>
            </StatCard>

            <StatCard $type='delayed'>
              <StatHeader>
                <StatIcon $type='delayed'>
                  <MdWarning size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.unreadCount || 0}</StatValue>
              <StatLabel>Não Lidas</StatLabel>
            </StatCard>

            <StatCard $type='onTime'>
              <StatHeader>
                <StatIcon $type='onTime'>
                  <MdCheckCircle size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.readCount || 0}</StatValue>
              <StatLabel>Lidas</StatLabel>
            </StatCard>

            <StatCard $type='total'>
              <StatHeader>
                <StatIcon $type='total'>
                  <MdCheckCircle size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.withTask || 0}</StatValue>
              <StatLabel>Com Tarefa</StatLabel>
            </StatCard>

            <StatCard $type='delayed'>
              <StatHeader>
                <StatIcon $type='delayed'>
                  <MdWarning size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.withoutTask || 0}</StatValue>
              <StatLabel>Sem Tarefa</StatLabel>
            </StatCard>

            <StatCard $type='onTime'>
              <StatHeader>
                <StatIcon $type='onTime'>
                  <MdCheckCircle size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.assignedCount || 0}</StatValue>
              <StatLabel>Atribuídas</StatLabel>
            </StatCard>

            <StatCard $type='delayed'>
              <StatHeader>
                <StatIcon $type='delayed'>
                  <MdWarning size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{statistics.unassignedCount || 0}</StatValue>
              <StatLabel>Não Atribuídas</StatLabel>
            </StatCard>
          </>
        )}
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <MdTrendingUp size={20} />
            Distribuição de Status
          </ChartTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Doughnut data={distributionChartData} options={chartOptions} />
            </SafeChartWrapper>
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <MdSchedule size={20} />
            Distribuição por Hora do Dia
          </ChartTitle>
          <ChartContainer>
            <SafeChartWrapper>
              <Bar data={hourlyDistribution} options={barChartOptions} />
            </SafeChartWrapper>
          </ChartContainer>
        </ChartCard>

        <ChartCard style={{ gridColumn: '1 / -1' }}>
          <ChartTitle>
            <MdTrendingDown size={20} />
            Tendência dos Últimos 7 Dias
          </ChartTitle>
          <ChartContainer style={{ height: '250px' }}>
            <SafeChartWrapper>
              <Line data={trendData} options={lineChartOptions} />
            </SafeChartWrapper>
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle $color='#F59E0B'>
            <MdSchedule size={20} />
            Atrasadas ({delayedMessages.length})
          </SectionTitle>
        </SectionHeader>
        {groupedDelayedMessages.length === 0 ? (
          <EmptyState>Nenhuma mensagem atrasada no momento.</EmptyState>
        ) : (
          <MessageList>
            {groupedDelayedMessages.map(conversation => (
              <MessageAlert key={conversation.phoneNumber} $type='delayed'>
                <MessageHeader>
                  <PhoneNumber>
                    {formatPhoneDisplay(conversation.phoneNumber)}
                    {conversation.messageCount > 1 && (
                      <ConversationBadge>
                        {conversation.messageCount} mensagens
                      </ConversationBadge>
                    )}
                    {conversation.unreadCount > 0 && (
                      <ConversationBadge
                        style={{
                          background: '#EF4444',
                          color: 'white',
                        }}
                      >
                        {conversation.unreadCount} não lidas
                      </ConversationBadge>
                    )}
                  </PhoneNumber>
                </MessageHeader>
                <MessageText>
                  {conversation.lastMessage.message?.substring(0, 100) ||
                    'Mensagem de mídia'}
                  {conversation.lastMessage.message &&
                    conversation.lastMessage.message.length > 100 &&
                    '...'}
                </MessageText>
                <MessageMeta>
                  <span>📞 {conversation.contactName || 'Sem nome'}</span>
                  {conversation.lastMessage.assignedTo && (
                    <span>
                      👤 Atribuído a: {conversation.lastMessage.assignedTo.name}
                    </span>
                  )}
                  <span>
                    🕐 {formatMessageTime(conversation.lastMessage.createdAt)}
                  </span>
                </MessageMeta>
              </MessageAlert>
            ))}
          </MessageList>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle $color='#EF4444'>
            <MdWarning size={20} />
            Críticas ({groupedCriticalMessages.length} conversas,{' '}
            {criticalMessages.length} mensagens)
          </SectionTitle>
        </SectionHeader>
        {groupedCriticalMessages.length === 0 ? (
          <EmptyState>Nenhuma mensagem crítica no momento.</EmptyState>
        ) : (
          <MessageList>
            {groupedCriticalMessages.map(conversation => (
              <MessageAlert key={conversation.phoneNumber} $type='critical'>
                <MessageHeader>
                  <PhoneNumber>
                    {formatPhoneDisplay(conversation.phoneNumber)}
                    {conversation.messageCount > 1 && (
                      <ConversationBadge>
                        {conversation.messageCount} mensagens
                      </ConversationBadge>
                    )}
                    {conversation.unreadCount > 0 && (
                      <ConversationBadge
                        style={{
                          background: '#EF4444',
                          color: 'white',
                        }}
                      >
                        {conversation.unreadCount} não lidas
                      </ConversationBadge>
                    )}
                  </PhoneNumber>
                </MessageHeader>
                <MessageText>
                  {conversation.lastMessage.message?.substring(0, 100) ||
                    'Mensagem de mídia'}
                  {conversation.lastMessage.message &&
                    conversation.lastMessage.message.length > 100 &&
                    '...'}
                </MessageText>
                <MessageMeta>
                  <span>📞 {conversation.contactName || 'Sem nome'}</span>
                  {conversation.lastMessage.assignedTo && (
                    <span>
                      👤 Atribuído a: {conversation.lastMessage.assignedTo.name}
                    </span>
                  )}
                  <span>
                    🕐 {formatMessageTime(conversation.lastMessage.createdAt)}
                  </span>
                </MessageMeta>
              </MessageAlert>
            ))}
          </MessageList>
        )}
      </Section>
    </DashboardContainer>
  );
};
