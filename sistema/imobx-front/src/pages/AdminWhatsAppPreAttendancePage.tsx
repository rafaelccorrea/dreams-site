import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { adminWhatsAppPreAttendanceApi } from '../services/adminWhatsAppPreAttendanceApi';
import type { CompanyWhatsAppPreAttendanceRow } from '../services/adminWhatsAppPreAttendanceApi';
import { toast } from 'react-toastify';
import { FaWhatsapp } from 'react-icons/fa';
import {
  MdSmartToy,
  MdAutoAwesome,
  MdRefresh,
  MdSearch,
  MdBusiness,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.header`
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

const IconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.25);
`;

const TitleBlock = styled.div`
  min-width: 0;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.45;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const SearchWrap = styled.div`
  position: relative;
  width: 100%;
  min-width: 200px;
  max-width: 280px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 20px;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px 0 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary + '20'};
  }
`;

const RefreshBtn = styled.button`
  height: 44px;
  padding: 0 18px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div<{ $accent?: 'green' | 'purple' | 'blue' }>`
  padding: 18px 20px;
  border-radius: 14px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  transition: box-shadow 0.2s;

  ${props => {
    const accent =
      props.$accent === 'green'
        ? 'rgba(37, 211, 102, 0.12)'
        : props.$accent === 'purple'
          ? 'rgba(147, 51, 234, 0.12)'
          : 'transparent';
    return accent !== 'transparent'
      ? `border-left: 4px solid ${props.$accent === 'green' ? '#25d366' : '#9333ea'}; background: ${props.theme.colors.surface};`
      : '';
  }}

  &:hover {
    box-shadow: 0 4px 20px ${props => props.theme.colors.border + '40'};
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const TableCard = styled.div`
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  overflow: hidden;
  box-shadow: 0 1px 3px ${props => props.theme.colors.border + '30'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 16px 20px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background: ${props => props.theme.colors.background};
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.theme.colors.textSecondary};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  td {
    border-bottom: 1px solid ${props => props.theme.colors.border + '60'};
  }

  tbody tr {
    transition: background 0.15s;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover td {
    background: ${props => props.theme.colors.background + '80'};
  }

  @media (max-width: 900px) {
    th:nth-child(2),
    td:nth-child(2) {
      display: none;
    }
  }
`;

const CompanyCell = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const EmailCell = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Badge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props =>
    props.$active
      ? props.theme.colors.success + '18'
      : props.theme.colors.border + '99'};
  color: ${props =>
    props.$active ? props.theme.colors.success : props.theme.colors.textSecondary};
`;

const ActionsCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const ToggleBtn = styled.button<{ $active?: boolean; $variant?: 'chatbot' | 'ia' }>`
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  ${props => {
    if (props.$active && props.$variant === 'chatbot') {
      return `
        background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(37, 211, 102, 0.35);
      `;
    }
    if (props.$active && props.$variant === 'ia') {
      return `
        background: linear-gradient(135deg, #9333ea 0%, #6b21a8 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(147, 51, 234, 0.35);
      `;
    }
    return `
      background: ${props.theme.colors.background};
      color: ${props.theme.colors.textSecondary};
      border: 1px solid ${props.theme.colors.border};
      &:hover:not(:disabled) {
        border-color: ${props.theme.colors.primary};
        color: ${props.theme.colors.primary};
      }
    `;
  }}

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: ${props => props.theme.colors.border + '40'};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
`;

const EmptyTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const LoadingWrap = styled.div`
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function AdminWhatsAppPreAttendancePage() {
  const [rows, setRows] = useState<CompanyWhatsAppPreAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toggling, setToggling] = useState<{
    companyId: string;
    type: 'chatbot' | 'ia';
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminWhatsAppPreAttendanceApi.list();
      setRows(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Erro ao carregar lista.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter(
      r =>
        r.companyName.toLowerCase().includes(q) ||
        (r.ownerEmail || '').toLowerCase().includes(q),
    );
  }, [rows, search]);

  const stats = useMemo(() => {
    const withConfig = rows.filter(r => r.hasWhatsAppConfig).length;
    const usingChatbot = rows.filter(r => r.usingChatbot).length;
    const usingIA = rows.filter(r => r.usingIA).length;
    return { total: rows.length, withConfig, usingChatbot, usingIA };
  }, [rows]);

  const handleToggleChatbot = async (companyId: string, current: boolean) => {
    setToggling({ companyId, type: 'chatbot' });
    try {
      const updated = await adminWhatsAppPreAttendanceApi.setChatbotEnabled(
        companyId,
        !current,
      );
      setRows(prev =>
        prev.map(r =>
          r.companyId === companyId
            ? {
                ...r,
                chatbotEnabled: updated.chatbotEnabled,
                usingChatbot: updated.usingChatbot,
              }
            : r,
        ),
      );
      toast.success(
        updated.chatbotEnabled ? 'Chatbot ativado.' : 'Chatbot desativado.',
      );
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Erro ao atualizar Chatbot.',
      );
    } finally {
      setToggling(null);
    }
  };

  const handleToggleIA = async (companyId: string, current: boolean) => {
    setToggling({ companyId, type: 'ia' });
    try {
      const updated = await adminWhatsAppPreAttendanceApi.setIAEnabled(
        companyId,
        !current,
      );
      setRows(prev =>
        prev.map(r =>
          r.companyId === companyId
            ? {
                ...r,
                enableAIPreAttend: updated.enableAIPreAttend,
                hasWhatsAppAIModule: updated.hasWhatsAppAIModule,
                usingIA: updated.usingIA,
                usingChatbot: updated.usingChatbot,
                chatbotEnabled: updated.chatbotEnabled,
              }
            : r,
        ),
      );
      toast.success(
        updated.usingIA ? 'Pré-atendimento com IA ativado.' : 'IA desativada.',
      );
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Erro ao atualizar IA.',
      );
    } finally {
      setToggling(null);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderLeft>
            <IconWrap>
              <FaWhatsapp />
            </IconWrap>
            <TitleBlock>
              <Title>WhatsApp — Chatbot e IA</Title>
              <Subtitle>
                Veja quem usa Chatbot ou pré-atendimento com IA e ative ou
                desative por empresa.
              </Subtitle>
            </TitleBlock>
          </HeaderLeft>
          <HeaderActions>
            <SearchWrap>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Buscar empresa ou e-mail..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </SearchWrap>
            <RefreshBtn onClick={() => load()} disabled={loading}>
              <MdRefresh size={18} />
              Atualizar
            </RefreshBtn>
          </HeaderActions>
        </PageHeader>

        {!loading && rows.length > 0 && (
          <StatsRow>
            <StatCard>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total de empresas</StatLabel>
            </StatCard>
            <StatCard $accent="green">
              <StatValue>{stats.usingChatbot}</StatValue>
              <StatLabel>Usando Chatbot</StatLabel>
            </StatCard>
            <StatCard $accent="purple">
              <StatValue>{stats.usingIA}</StatValue>
              <StatLabel>Usando IA</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.withConfig}</StatValue>
              <StatLabel>WhatsApp configurado</StatLabel>
            </StatCard>
          </StatsRow>
        )}

        {loading ? (
          <LoadingWrap>
            <LoadingSpinner />
            <span>Carregando empresas...</span>
          </LoadingWrap>
        ) : filteredRows.length === 0 ? (
          <TableCard>
            <EmptyState>
              <EmptyIcon>
                <MdBusiness />
              </EmptyIcon>
              <EmptyTitle>
                {search.trim()
                  ? 'Nenhuma empresa encontrada para essa busca'
                  : 'Nenhuma empresa encontrada'}
              </EmptyTitle>
              <span>
                {search.trim()
                  ? 'Tente outro termo ou limpe o filtro.'
                  : 'Não há empresas ativas no sistema.'}
              </span>
            </EmptyState>
          </TableCard>
        ) : (
          <TableCard>
            <Table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>E-mail (owner)</th>
                  <th>WhatsApp</th>
                  <th>Chatbot</th>
                  <th>IA</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map(row => {
                  const isTogglingChatbot =
                    toggling?.companyId === row.companyId &&
                    toggling?.type === 'chatbot';
                  const isTogglingIA =
                    toggling?.companyId === row.companyId &&
                    toggling?.type === 'ia';
                  return (
                    <tr key={row.companyId}>
                      <td>
                        <CompanyCell>{row.companyName}</CompanyCell>
                      </td>
                      <td>
                        <EmailCell>{row.ownerEmail || '—'}</EmailCell>
                      </td>
                      <td>
                        <Badge $active={row.hasWhatsAppConfig}>
                          {row.hasWhatsAppConfig ? (
                            <><MdCheckCircle size={14} /> Sim</>
                          ) : (
                            <><MdCancel size={14} /> Não</>
                          )}
                        </Badge>
                      </td>
                      <td>
                        <Badge $active={row.usingChatbot}>
                          {row.usingChatbot ? 'Em uso' : 'Não'}
                        </Badge>
                      </td>
                      <td>
                        <Badge $active={row.usingIA}>
                          {row.usingIA ? 'Em uso' : 'Não'}
                        </Badge>
                      </td>
                      <td>
                        <ActionsCell>
                          <ToggleBtn
                            $active={row.usingChatbot}
                            $variant="chatbot"
                            disabled={
                              !row.hasWhatsAppConfig || isTogglingChatbot
                            }
                            onClick={() =>
                              handleToggleChatbot(
                                row.companyId,
                                row.chatbotEnabled,
                              )
                            }
                            title="Ativar/Desativar Chatbot"
                          >
                            <MdSmartToy size={16} />
                            {isTogglingChatbot
                              ? '...'
                              : row.chatbotEnabled
                                ? 'Desativar Chatbot'
                                : 'Ativar Chatbot'}
                          </ToggleBtn>
                          <ToggleBtn
                            $active={row.usingIA}
                            $variant="ia"
                            disabled={isTogglingIA}
                            onClick={() =>
                              handleToggleIA(row.companyId, row.usingIA)
                            }
                            title="Ativar/Desativar pré-atendimento com IA"
                          >
                            <MdAutoAwesome size={16} />
                            {isTogglingIA
                              ? '...'
                              : row.usingIA
                                ? 'Desativar IA'
                                : 'Ativar IA'}
                          </ToggleBtn>
                        </ActionsCell>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableCard>
        )}
      </PageContainer>
    </Layout>
  );
}
