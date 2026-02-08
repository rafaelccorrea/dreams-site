import React from 'react';
import styled from 'styled-components';
import {
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdTrendingUp,
} from 'react-icons/md';
import { InfoTooltip } from '../common/InfoTooltip';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  interest: string;
  source: string;
  score: number;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
  };
  status: string;
  interestType: string;
}

interface RecentLeadsWidgetProps {
  leads?: Lead[];
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Mendes',
    phone: '(21) 98765-4321',
    email: 'carlos@email.com',
    location: 'Zona Sul',
    interest: 'Apartamento 3 quartos',
    source: 'Website',
    score: 85,
    createdAt: '2024-01-20T10:30:00',
    status: 'new',
    interestType: 'buyer',
  },
  {
    id: '2',
    name: 'Ana Paula',
    phone: '(21) 91234-5678',
    email: 'ana@email.com',
    location: 'Barra',
    interest: 'Casa com piscina',
    source: 'Instagram',
    score: 92,
    createdAt: '2024-01-20T09:15:00',
    status: 'contacted',
    interestType: 'buyer',
  },
  {
    id: '3',
    name: 'Roberto Lima',
    phone: '(21) 99876-5432',
    email: 'roberto@email.com',
    location: 'Centro',
    interest: 'Comercial',
    source: 'Indicação',
    score: 78,
    createdAt: '2024-01-19T16:45:00',
    status: 'new',
    interestType: 'buyer',
  },
];

const RecentLeadsWidget: React.FC<RecentLeadsWidgetProps> = ({
  leads = mockLeads,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      Website: '#3B82F6',
      Instagram: '#EC4899',
      Facebook: '#1877F2',
      Indicação: '#10B981',
      Outros: '#6B7280',
    };
    return colors[source] || colors['Outros'];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Menos de 1 minuto
    if (diffSecs < 60) return 'agora';

    // Minutos (1-59)
    if (diffMins < 60) {
      return diffMins === 1 ? 'há 1min' : `há ${diffMins}min`;
    }

    // Horas (1-23)
    if (diffHours < 24) {
      return diffHours === 1 ? 'há 1h' : `há ${diffHours}h`;
    }

    // Ontem
    if (diffDays === 1) return 'ontem';

    // Dias (2-6)
    if (diffDays < 7) {
      return `há ${diffDays} dias`;
    }

    // Mais de uma semana - mostra a data
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <Widget>
      <WidgetHeader>
        <HeaderLeft>
          <HeaderIcon>
            <MdTrendingUp />
          </HeaderIcon>
          <div>
            <WidgetTitle>Leads Recentes</WidgetTitle>
            <WidgetSubtitle>{leads.length} novos</WidgetSubtitle>
          </div>
        </HeaderLeft>
        <InfoTooltip content='Lista dos leads mais recentes cadastrados no sistema, mostrando informações de contato, interesse e score de qualificação.' />
      </WidgetHeader>

      {leads.length > 0 ? (
        <LeadsList>
          {leads.map(lead => (
            <LeadCard key={lead.id}>
              <LeadHeader>
                <LeadAvatar>
                  <MdPerson size={24} />
                </LeadAvatar>
                <LeadMainInfo>
                  <LeadName>{lead.name}</LeadName>
                  <LeadTime>{formatTimeAgo(lead.createdAt)}</LeadTime>
                </LeadMainInfo>
                <LeadScore $color={getScoreColor(lead.score)}>
                  {lead.score}
                </LeadScore>
              </LeadHeader>

              <LeadBody>
                <LeadInterest>{lead.interest}</LeadInterest>
                <LeadDetails>
                  <LeadDetail>
                    <MdPhone size={14} />
                    {lead.phone}
                  </LeadDetail>
                  <LeadDetail>
                    <MdLocationOn size={14} />
                    {lead.location}
                  </LeadDetail>
                </LeadDetails>
              </LeadBody>

              <LeadFooter>
                <LeadSource $color={getSourceColor(lead.source)}>
                  {lead.source}
                </LeadSource>
                <LeadAction>Entrar em contato</LeadAction>
              </LeadFooter>
            </LeadCard>
          ))}
        </LeadsList>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <MdTrendingUp size={48} />
          </EmptyIcon>
          <EmptyTitle>Nenhum lead encontrado</EmptyTitle>
          <EmptyDescription>
            Não há leads recentes para exibir.
            <br />
            Os novos leads aparecerão aqui quando forem cadastrados.
          </EmptyDescription>
        </EmptyState>
      )}
    </Widget>
  );
};

export default RecentLeadsWidget;

// Styled Components
const Widget = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

const WidgetTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  line-height: 1.3;
`;

const WidgetSubtitle = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const LeadsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LeadCard = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LeadHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const LeadAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const LeadMainInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const LeadName = styled.div`
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LeadTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const LeadScore = styled.div<{ $color: string }>`
  padding: 4px 10px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 20px;
  flex-shrink: 0;
`;

const LeadBody = styled.div`
  margin-bottom: 12px;
`;

const LeadInterest = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const LeadDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const LeadDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const LeadFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const LeadSource = styled.div<{ $color: string }>`
  padding: 4px 10px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
`;

const LeadAction = styled.button`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}dd;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.colors.primary}40;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
  max-width: 280px;
`;
