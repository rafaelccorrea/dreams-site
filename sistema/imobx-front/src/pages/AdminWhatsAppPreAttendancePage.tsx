import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
} from '../styles/pages/PropertiesPageStyles';
import { adminWhatsAppPreAttendanceApi } from '../services/adminWhatsAppPreAttendanceApi';
import type { CompanyWhatsAppPreAttendanceRow } from '../services/adminWhatsAppPreAttendanceApi';
import { toast } from 'react-toastify';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSmartToy, MdAutoAwesome } from 'react-icons/md';
import styled from 'styled-components';

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    background: ${props => props.theme.colors.background};
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: ${props => props.theme.colors.background};
  }
`;

const Badge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props =>
    props.$active
      ? props.theme.colors.success + '22'
      : props.theme.colors.border};
  color: ${props =>
    props.$active ? props.theme.colors.success : props.theme.colors.textSecondary};
`;

const ToggleBtn = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props =>
    props.$active ? '#fff' : props.theme.colors.text};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

export default function AdminWhatsAppPreAttendancePage() {
  const [rows, setRows] = useState<CompanyWhatsAppPreAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
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
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>
                <FaWhatsapp size={24} style={{ marginRight: 8 }} />
                WhatsApp: Chatbot e IA
              </PageTitle>
              <PageSubtitle>
                Visualize quem está usando Chatbot ou pré-atendimento com IA e
                ative ou desative por empresa (apenas Master).
              </PageSubtitle>
            </PageTitleContainer>
          </PageHeader>

          {loading ? (
            <LoadingState>Carregando empresas...</LoadingState>
          ) : rows.length === 0 ? (
            <EmptyState>Nenhuma empresa encontrada.</EmptyState>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>E-mail (owner)</th>
                    <th>WhatsApp config</th>
                    <th>Chatbot</th>
                    <th>Pré-atendimento IA</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const isTogglingChatbot =
                      toggling?.companyId === row.companyId &&
                      toggling?.type === 'chatbot';
                    const isTogglingIA =
                      toggling?.companyId === row.companyId &&
                      toggling?.type === 'ia';
                    return (
                      <tr key={row.companyId}>
                        <td>
                          <strong>{row.companyName}</strong>
                        </td>
                        <td>{row.ownerEmail || '—'}</td>
                        <td>
                          <Badge $active={row.hasWhatsAppConfig}>
                            {row.hasWhatsAppConfig ? 'Sim' : 'Não'}
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
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              flexWrap: 'wrap',
                              alignItems: 'center',
                            }}
                          >
                            <ToggleBtn
                              $active={row.usingChatbot}
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
                              <MdSmartToy size={14} style={{ marginRight: 4 }} />
                              {isTogglingChatbot
                                ? '...'
                                : row.chatbotEnabled
                                  ? 'Desativar Chatbot'
                                  : 'Ativar Chatbot'}
                            </ToggleBtn>
                            <ToggleBtn
                              $active={row.usingIA}
                              disabled={isTogglingIA}
                              onClick={() =>
                                handleToggleIA(row.companyId, row.usingIA)
                              }
                              title="Ativar/Desativar pré-atendimento com IA"
                            >
                              <MdAutoAwesome size={14} style={{ marginRight: 4 }} />
                              {isTogglingIA
                                ? '...'
                                : row.usingIA
                                  ? 'Desativar IA'
                                  : 'Ativar IA'}
                            </ToggleBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </PageContent>
      </PageContainer>
    </Layout>
  );
}
