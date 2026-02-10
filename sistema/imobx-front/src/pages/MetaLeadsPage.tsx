import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MdArrowBack, MdOpenInNew } from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa';
import { Layout } from '../components/layout/Layout';
import { metaCampaignApi } from '../services/metaCampaignApi';
import type {
  MetaLeadItem,
  MetaLeadsListResponse,
  MetaLeadWebhookLogItem,
  MetaLeadWebhookLogResponse,
} from '../types/metaCampaign';
import { getNavigationUrl } from '../utils/pathUtils';

const PageContainer = styled.div`
  padding: 12px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  @media (min-width: 480px) {
    padding: 16px;
  }
  @media (min-width: 600px) {
    padding: 24px;
  }
  @media (min-width: 960px) {
    padding: 24px 28px;
  }
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 16px;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
  @media (max-width: 480px) {
    padding: 12px 14px;
    min-height: 48px;
    margin-bottom: 12px;
  }
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const HeaderRow = styled.div`
  margin-bottom: 24px;
  @media (max-width: 480px) {
    margin-bottom: 18px;
  }
`;

const Title = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  @media (min-width: 480px) {
    font-size: 1.5rem;
    gap: 12px;
  }
  @media (min-width: 600px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
  max-width: 560px;
  @media (min-width: 480px) {
    font-size: 0.9375rem;
  }
`;

const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.cardBackground};
  margin-bottom: 20px;
  @media (max-width: 480px) {
    margin-bottom: 16px;
    border-radius: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 18px;
  font-weight: 600;
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  vertical-align: middle;
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.75rem;
  }
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Td = styled.td`
  padding: 14px 18px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  vertical-align: middle;
  font-size: 0.875rem;
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8125rem;
  }
`;

const LinkToTask = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  padding: 8px 4px;
  margin: -4px 0;
  border-radius: 6px;
  transition: opacity 0.2s;
  @media (max-width: 480px) {
    padding: 10px 6px;
    margin: -6px 0;
  }
  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 18px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 10px;
    font-size: 0.8125rem;
  }
`;

const PaginationBtn = styled.button`
  padding: 10px 16px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
  @media (max-width: 480px) {
    padding: 10px 12px;
    min-height: 48px;
    font-size: 0.8125rem;
  }
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 32px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 24px 0 10px 0;
  }
`;

const EmptyRow = styled.tr`
  td {
    padding: 24px 18px;
    text-align: center;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.875rem;
    @media (max-width: 480px) {
      padding: 20px 12px;
      font-size: 0.8125rem;
    }
  }
`;

const LoadingRow = styled.tr`
  td {
    padding: 24px 18px;
    text-align: center;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.875rem;
    @media (max-width: 480px) {
      padding: 20px 12px;
      font-size: 0.8125rem;
    }
  }
`;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const STATUS_LABEL: Record<string, string> = {
  task_created: 'Tarefa criada',
  no_redirect: 'Sem funil configurado',
  task_failed: 'Falha ao criar tarefa',
  no_details: 'Sem detalhes na Meta',
};

const MetaLeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MetaLeadsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [webhookLog, setWebhookLog] =
    useState<MetaLeadWebhookLogResponse | null>(null);
  const [webhookLoading, setWebhookLoading] = useState(true);
  const [webhookPage, setWebhookPage] = useState(1);
  const webhookLimit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await metaCampaignApi.getLeads({ page, limit });
      setData(res);
    } catch {
      setData({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadWebhookLog = useCallback(async () => {
    setWebhookLoading(true);
    try {
      const res = await metaCampaignApi.getWebhookLeadsLog({
        page: webhookPage,
        limit: webhookLimit,
      });
      setWebhookLog(res);
    } catch {
      setWebhookLog({ data: [], total: 0, page: 1, limit: webhookLimit });
    } finally {
      setWebhookLoading(false);
    }
  }, [webhookPage]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadWebhookLog();
  }, [loadWebhookLog]);

  const leads = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;
  const webhookRows = webhookLog?.data ?? [];
  const webhookTotalPages = Math.ceil((webhookLog?.total ?? 0) / webhookLimit);

  return (
    <Layout>
      <PageContainer>
        <BackButton
          type='button'
          onClick={() => navigate('/integrations/meta-campaign/campaigns')}
          title='Voltar para a lista de campanhas da Meta'
        >
          <MdArrowBack size={20} />
          Voltar às campanhas
        </BackButton>

        <HeaderRow>
          <Title>
            <FaFacebookF size={28} color='#1877F2' />
            Leads da Meta
          </Title>
          <Subtitle>
            Tarefas no CRM que vieram das campanhas Facebook/Instagram. Clique
            no link para abrir a tarefa no Kanban.
          </Subtitle>
        </HeaderRow>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th title='Título da tarefa criada no CRM a partir do lead'>
                  Tarefa
                </Th>
                <Th title='Nome da campanha da Meta que gerou o lead'>
                  Campanha
                </Th>
                <Th title='Funil do Kanban onde a tarefa foi criada'>Funil</Th>
                <Th title='Data e hora de criação da tarefa no CRM'>
                  Criado em
                </Th>
                <Th title='Abrir a tarefa no Kanban' style={{ width: 120 }}>
                  Ação
                </Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingRow>
                  <Td colSpan={5}>Carregando...</Td>
                </LoadingRow>
              ) : leads.length === 0 ? (
                <EmptyRow>
                  <Td colSpan={5}>—</Td>
                </EmptyRow>
              ) : (
                leads.map((lead: MetaLeadItem) => (
                  <tr key={lead.id}>
                    <Td>
                      <strong>{lead.title}</strong>
                    </Td>
                    <Td>{lead.campaign || lead.metaCampaignId || '—'}</Td>
                    <Td>{lead.projectName || '—'}</Td>
                    <Td>{formatDate(lead.createdAt)}</Td>
                    <Td>
                      <LinkToTask
                        href={getNavigationUrl(`/kanban/task/${lead.id}`)}
                        target='_blank'
                        rel='noopener noreferrer'
                        title='Abrir esta tarefa no Kanban em nova aba'
                      >
                        <MdOpenInNew size={18} />
                        Abrir tarefa
                      </LinkToTask>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>

        <Pagination>
          <span>{data?.total ?? 0} lead(s) no total</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PaginationBtn
              type='button'
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              title='Página anterior'
            >
              Anterior
            </PaginationBtn>
            <span>
              Página {data?.page ?? 1} de {totalPages || 1}
            </span>
            <PaginationBtn
              type='button'
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              title='Próxima página'
            >
              Próxima
            </PaginationBtn>
          </div>
        </Pagination>

        <SectionTitle>Registros via webhook (quem entrou por campanha)</SectionTitle>
        <Subtitle style={{ marginBottom: 12 }}>
          Todos os leads que chegaram pelo webhook da Meta. Mostra quem entrou,
          em qual campanha e se virou tarefa no CRM.
        </Subtitle>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Lead / Nome</Th>
                <Th>Campanha</Th>
                <Th>E-mail</Th>
                <Th>Telefone</Th>
                <Th>Status</Th>
                <Th>Recebido em</Th>
                <Th style={{ width: 100 }}>Ação</Th>
              </tr>
            </thead>
            <tbody>
              {webhookLoading ? (
                <LoadingRow>
                  <Td colSpan={7}>Carregando...</Td>
                </LoadingRow>
              ) : webhookRows.length === 0 ? (
                <EmptyRow>
                  <Td colSpan={7}>Nenhum registro ainda.</Td>
                </EmptyRow>
              ) : (
                webhookRows.map((row: MetaLeadWebhookLogItem) => (
                  <tr key={row.id}>
                    <Td>
                      <strong>{row.leadTitle || row.leadgenId || '—'}</strong>
                    </Td>
                    <Td>{row.metaCampaignName || row.metaCampaignId || '—'}</Td>
                    <Td>{row.leadEmail || '—'}</Td>
                    <Td>{row.leadPhone || '—'}</Td>
                    <Td>{STATUS_LABEL[row.status] ?? row.status}</Td>
                    <Td>{formatDate(row.createdAt)}</Td>
                    <Td>
                      {row.kanbanTaskId ? (
                        <LinkToTask
                          href={getNavigationUrl(
                            `/kanban/task/${row.kanbanTaskId}`
                          )}
                          target='_blank'
                          rel='noopener noreferrer'
                          title='Abrir tarefa no Kanban'
                        >
                          <MdOpenInNew size={18} />
                          Tarefa
                        </LinkToTask>
                      ) : (
                        '—'
                      )}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>

        <Pagination>
          <span>
            {webhookLog?.total ?? 0} registro(s) no total (webhook)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PaginationBtn
              type='button'
              disabled={webhookPage <= 1}
              onClick={() => setWebhookPage(p => Math.max(1, p - 1))}
              title='Página anterior'
            >
              Anterior
            </PaginationBtn>
            <span>
              Página {webhookLog?.page ?? 1} de {webhookTotalPages || 1}
            </span>
            <PaginationBtn
              type='button'
              disabled={webhookPage >= webhookTotalPages}
              onClick={() => setWebhookPage(p => p + 1)}
              title='Próxima página'
            >
              Próxima
            </PaginationBtn>
          </div>
        </Pagination>
      </PageContainer>
    </Layout>
  );
};

export default MetaLeadsPage;
