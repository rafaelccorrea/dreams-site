/**
 * Página de Leads MCMV
 * Gerenciamento de leads do programa Minha Casa Minha Vida
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdFilterList,
  MdPersonAdd,
  MdVisibility,
  MdStar,
  MdPerson,
  MdCheckCircle,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { mcmvApi } from '../services/mcmvApi';
import type { MCMVLead, LeadStatus, LeadFilters } from '../types/mcmv';
import { Layout } from '../components/layout/Layout';
import { formatCurrency } from '../utils/formatNumbers';
import { formatPhoneDisplay, maskCPF } from '../utils/masks';
import { PermissionButton } from '../components/common/PermissionButton';
import { MCMVLeadsFiltersDrawer } from '../components/mcmv/MCMVLeadsFiltersDrawer';
import { MCMVLeadsShimmer } from '../components/shimmer/MCMVLeadsShimmer';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageSubtitle,
  PageTitle,
  FilterButton,
  Content,
  LeadsGrid,
  LeadCard,
  LeadHeader,
  LeadName,
  ScoreBadge,
  LeadInfo,
  InfoRow,
  StatusBadge,
  LeadActions,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  Pagination,
  PaginationButton,
} from '../styles/pages/MCMVLeadsPageStyles';

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

export default function MCMVLeadsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LeadStatus | 'all'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [leads, setLeads] = useState<MCMVLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const filtersToSend: LeadFilters = {
        ...filters,
        status: activeTab === 'all' ? undefined : activeTab,
      };
      const response = await mcmvApi.listLeads(filtersToSend);
      setLeads(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrev: response.hasPrev,
      });
    } catch (error: any) {
      console.error('Erro ao carregar leads:', error);
      toast.error(error.response?.data?.message || 'Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  }, [filters, activeTab]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCaptureLead = async (leadId: string) => {
    try {
      await mcmvApi.captureLead(leadId);
      toast.success('Lead capturado com sucesso!');
      fetchLeads();
    } catch (error: any) {
      console.error('Erro ao capturar lead:', error);
      toast.error(error.response?.data?.message || 'Erro ao capturar lead');
    }
  };

  const handleViewLead = (leadId: string) => {
    navigate(`/mcmv/leads/${leadId}`);
  };

  const handleConvertLead = async (leadId: string) => {
    try {
      const result = await mcmvApi.convertLeadToClient(leadId);
      toast.success('Lead convertido em cliente com sucesso!');
      navigate(`/clients/${result.clientId}`);
    } catch (error: any) {
      console.error('Erro ao converter lead:', error);
      toast.error(error.response?.data?.message || 'Erro ao converter lead');
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Leads MCMV</PageTitle>
              <PageSubtitle>
                Gerenciamento de leads do programa Minha Casa Minha Vida
              </PageSubtitle>
            </PageTitleContainer>
            <FilterButton onClick={() => setFiltersOpen(true)}>
              <MdFilterList size={20} />
              Filtros
            </FilterButton>
          </PageHeader>

          {/* Grid de Leads */}
          <Content>
            {loading ? (
              <MCMVLeadsShimmer />
            ) : !leads || leads.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📋</EmptyIcon>
                <EmptyTitle>Nenhum lead encontrado</EmptyTitle>
                <EmptyText>
                  {activeTab === 'all'
                    ? 'Quando houver novos leads disponíveis, eles aparecerão aqui'
                    : `Você não possui leads com status "${getStatusLabel(activeTab as LeadStatus)}"`}
                </EmptyText>
              </EmptyState>
            ) : (
              <>
                <LeadsGrid>
                  {leads.map(lead => (
                    <LeadCard
                      key={lead.id}
                      onClick={() => handleViewLead(lead.id)}
                    >
                      <LeadHeader>
                        <LeadName>{lead.name}</LeadName>
                        <ScoreBadge $score={lead.score}>
                          {lead.score}%
                        </ScoreBadge>
                      </LeadHeader>
                      <LeadInfo>
                        <InfoRow>
                          <MdPerson size={16} />
                          {maskCPF(lead.cpf)}
                        </InfoRow>
                        <InfoRow>📧 {lead.email}</InfoRow>
                        <InfoRow>📱 {formatPhoneDisplay(lead.phone)}</InfoRow>
                        <InfoRow>
                          📍 {lead.city}, {lead.state}
                        </InfoRow>
                        <InfoRow>
                          💰 Renda: {formatCurrency(lead.monthlyIncome)}
                        </InfoRow>
                        <InfoRow>👨‍👩‍👧‍👦 Família: {lead.familySize} pessoas</InfoRow>
                        <InfoRow>
                          {lead.eligible ? (
                            <span style={{ color: '#10b981' }}>
                              ✅ Elegível
                            </span>
                          ) : (
                            <span style={{ color: '#ef4444' }}>
                              ❌ Não elegível
                            </span>
                          )}
                        </InfoRow>
                        <InfoRow>
                          Status:{' '}
                          <StatusBadge $status={lead.status}>
                            {getStatusLabel(lead.status)}
                          </StatusBadge>
                        </InfoRow>
                        {lead.rating && (
                          <InfoRow>
                            <MdStar size={16} style={{ color: '#fbbf24' }} />
                            Avaliação: {lead.rating}/5
                          </InfoRow>
                        )}
                      </LeadInfo>
                      <LeadActions onClick={e => e.stopPropagation()}>
                        {!lead.companyId && (
                          <PermissionButton
                            permission='mcmv:lead:capture'
                            variant='primary'
                            onClick={() => handleCaptureLead(lead.id)}
                          >
                            <MdPersonAdd size={18} />
                            Capturar
                          </PermissionButton>
                        )}
                        <ActionButton onClick={() => handleViewLead(lead.id)}>
                          <MdVisibility size={18} />
                          Ver Detalhes
                        </ActionButton>
                        {lead.status === 'qualified' && !lead.clientId && (
                          <PermissionButton
                            permission='mcmv:lead:convert'
                            variant='primary'
                            onClick={() => handleConvertLead(lead.id)}
                          >
                            <MdCheckCircle size={18} />
                            Converter
                          </PermissionButton>
                        )}
                      </LeadActions>
                    </LeadCard>
                  ))}
                </LeadsGrid>

                {/* Paginação */}
                {pagination.totalPages > 1 && (
                  <Pagination>
                    <PaginationButton
                      $disabled={!pagination.hasPrev}
                      onClick={() => {
                        if (pagination.hasPrev) {
                          setFilters({ ...filters, page: pagination.page - 1 });
                        }
                      }}
                    >
                      Anterior
                    </PaginationButton>
                    <span>
                      Página {pagination.page} de {pagination.totalPages} (
                      {pagination.total} leads)
                    </span>
                    <PaginationButton
                      $disabled={!pagination.hasNext}
                      onClick={() => {
                        if (pagination.hasNext) {
                          setFilters({ ...filters, page: pagination.page + 1 });
                        }
                      }}
                    >
                      Próxima
                    </PaginationButton>
                  </Pagination>
                )}
              </>
            )}
          </Content>
        </PageContent>
      </PageContainer>

      <MCMVLeadsFiltersDrawer
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        activeTab={activeTab}
        onChange={newFilters => {
          setFilters({ ...newFilters, page: 1 });
        }}
        onTabChange={tab => {
          setActiveTab(tab);
        }}
      />
    </Layout>
  );
}
