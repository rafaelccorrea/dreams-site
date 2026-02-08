/**
 * Página de Detalhes do Lead MCMV
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdStar,
  MdPerson,
  MdCheckCircle,
  MdEdit,
  MdAssignment,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { mcmvApi } from '../services/mcmvApi';
import type { MCMVLead, LeadStatus } from '../types/mcmv';
import { Layout } from '../components/layout/Layout';
import { formatCurrency } from '../utils/formatNumbers';
import { formatPhoneDisplay, maskCPF } from '../utils/masks';
import { PermissionButton } from '../components/common/PermissionButton';
import { MCMVLeadDetailsShimmer } from '../components/shimmer/MCMVLeadDetailsShimmer';
import {
  PageContainer,
  BackButton,
  Card,
  CardTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  StatusBadge,
  ActionsContainer,
  ActionButton,
} from '../styles/pages/MCMVLeadDetailsPageStyles';

const getStatusLabel = (status: LeadStatus): string => {
  const labels: Record<LeadStatus, string> = {
    new: 'Novo',
    contacted: 'Contactado',
    qualified: 'Qualificado',
    converted: 'Convertido',
    lost: 'Perdido',
  };
  return labels[status];
};

export default function MCMVLeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<MCMVLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Como não há endpoint GET /mcmv/leads/:id, buscamos da lista
      // Tentamos buscar em várias páginas se necessário
      let foundLead: MCMVLead | null = null;
      let page = 1;
      const limit = 100;

      while (!foundLead && page <= 10) {
        // Limite de 10 páginas
        const response = await mcmvApi.listLeads({ page, limit });
        foundLead = response.items.find(l => l.id === id) || null;

        if (foundLead) {
          setLead(foundLead);
          break;
        }

        if (!response.hasNext) break;
        page++;
      }

      if (!foundLead) {
        toast.error('Lead não encontrado');
        navigate('/mcmv/leads');
      }
    } catch (error: any) {
      console.error('Erro ao carregar lead:', error);
      toast.error('Erro ao carregar lead');
      navigate('/mcmv/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: LeadStatus) => {
    if (!id) return;
    setProcessing(true);
    try {
      await mcmvApi.updateLeadStatus(id, status);
      toast.success('Status atualizado com sucesso!');
      fetchLead();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!id) return;
    setProcessing(true);
    try {
      const result = await mcmvApi.convertLeadToClient(id);
      toast.success('Lead convertido em cliente com sucesso!');
      navigate(`/clients/${result.clientId}`);
    } catch (error: any) {
      console.error('Erro ao converter lead:', error);
      toast.error(error.response?.data?.message || 'Erro ao converter lead');
    } finally {
      setProcessing(false);
    }
  };

  const handleRate = async (rating: number, comment?: string) => {
    if (!id) return;
    setProcessing(true);
    try {
      await mcmvApi.rateLead(id, rating, comment);
      toast.success('Lead avaliado com sucesso!');
      fetchLead();
    } catch (error: any) {
      console.error('Erro ao avaliar lead:', error);
      toast.error(error.response?.data?.message || 'Erro ao avaliar lead');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <MCMVLeadDetailsShimmer />;
  }

  if (!lead) {
    return (
      <Layout>
        <PageContainer>
          <div>Lead não encontrado</div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <BackButton onClick={() => navigate('/mcmv/leads')}>
          <MdArrowBack size={20} />
          Voltar para Leads
        </BackButton>

        <Card>
          <CardTitle>Informações do Lead</CardTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Nome</InfoLabel>
              <InfoValue>{lead.name}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>CPF</InfoLabel>
              <InfoValue>{maskCPF(lead.cpf)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{lead.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Telefone</InfoLabel>
              <InfoValue>{formatPhoneDisplay(lead.phone)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Cidade/Estado</InfoLabel>
              <InfoValue>
                {lead.city}, {lead.state}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Renda Mensal</InfoLabel>
              <InfoValue>{formatCurrency(lead.monthlyIncome)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Tamanho da Família</InfoLabel>
              <InfoValue>{lead.familySize} pessoas</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Faixa de Renda</InfoLabel>
              <InfoValue>{lead.incomeRange}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Elegível</InfoLabel>
              <InfoValue>
                {lead.eligible ? (
                  <span style={{ color: '#10b981' }}>✅ Sim</span>
                ) : (
                  <span style={{ color: '#ef4444' }}>❌ Não</span>
                )}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Score</InfoLabel>
              <InfoValue>{lead.score}%</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>
                <StatusBadge $status={lead.status}>
                  {getStatusLabel(lead.status)}
                </StatusBadge>
              </InfoValue>
            </InfoItem>
            {lead.rating && (
              <InfoItem>
                <InfoLabel>Avaliação</InfoLabel>
                <InfoValue>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <MdStar size={20} style={{ color: '#fbbf24' }} />
                    {lead.rating}/5
                  </div>
                  {lead.ratingComment && (
                    <div
                      style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: '#6b7280',
                      }}
                    >
                      {lead.ratingComment}
                    </div>
                  )}
                </InfoValue>
              </InfoItem>
            )}
            <InfoItem>
              <InfoLabel>Data de Criação</InfoLabel>
              <InfoValue>
                {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
              </InfoValue>
            </InfoItem>
            {lead.lastContactAt && (
              <InfoItem>
                <InfoLabel>Último Contato</InfoLabel>
                <InfoValue>
                  {new Date(lead.lastContactAt).toLocaleDateString('pt-BR')}
                </InfoValue>
              </InfoItem>
            )}
          </InfoGrid>

          <ActionsContainer>
            {lead.status !== 'converted' && lead.status !== 'lost' && (
              <>
                {lead.status === 'new' && (
                  <PermissionButton
                    permission='mcmv:lead:update'
                    variant='primary'
                    onClick={() => handleUpdateStatus('contacted')}
                    disabled={processing}
                  >
                    <MdEdit size={18} />
                    Marcar como Contactado
                  </PermissionButton>
                )}
                {lead.status === 'contacted' && (
                  <PermissionButton
                    permission='mcmv:lead:update'
                    variant='primary'
                    onClick={() => handleUpdateStatus('qualified')}
                    disabled={processing}
                  >
                    <MdCheckCircle size={18} />
                    Marcar como Qualificado
                  </PermissionButton>
                )}
                {lead.status === 'qualified' && !lead.clientId && (
                  <PermissionButton
                    permission='mcmv:lead:convert'
                    variant='primary'
                    onClick={handleConvert}
                    disabled={processing}
                  >
                    <MdCheckCircle size={18} />
                    Converter em Cliente
                  </PermissionButton>
                )}
                <PermissionButton
                  permission='mcmv:lead:update'
                  variant='secondary'
                  onClick={() => handleUpdateStatus('lost')}
                  disabled={processing}
                >
                  Marcar como Perdido
                </PermissionButton>
              </>
            )}
            {!lead.rating && (
              <PermissionButton
                permission='mcmv:lead:rate'
                variant='secondary'
                onClick={() => {
                  const rating = prompt('Avalie o lead (1-5):');
                  if (
                    rating &&
                    parseInt(rating) >= 1 &&
                    parseInt(rating) <= 5
                  ) {
                    const comment = prompt('Comentário (opcional):');
                    handleRate(parseInt(rating), comment || undefined);
                  }
                }}
                disabled={processing}
              >
                <MdStar size={18} />
                Avaliar Lead
              </PermissionButton>
            )}
          </ActionsContainer>
        </Card>
      </PageContainer>
    </Layout>
  );
}
