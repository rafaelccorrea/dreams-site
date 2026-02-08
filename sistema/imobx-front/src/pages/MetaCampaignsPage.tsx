import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdSave,
  MdRefresh,
  MdSettings,
  MdTrendingUp,
  MdTouchApp,
  MdAttachMoney,
  MdPeople,
  MdDownload,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa';
import { Layout } from '../components/layout/Layout';
import { MetaCampaignsShimmer } from '../components/shimmer/MetaCampaignsShimmer';
import BarChart from '../components/charts/BarChart';
import { LineChart } from '../components/charts';
import { metaCampaignApi } from '../services/metaCampaignApi';
import { projectsApi } from '../services/projectsApi';
import { kanbanApi } from '../services/kanbanApi';
import { showSuccess, showError } from '../utils/notifications';
import type {
  MetaCampaignItem,
  MetaCampaignRedirectConfig,
  UpsertMetaCampaignRedirectRequest,
  MetaCrmLeadsStats,
  MetaLeadgenFormItem,
  MetaRoasItem,
  MetaAdSetItem,
  MetaAdItem,
} from '../types/metaCampaign';
import type { KanbanProjectResponseDto } from '../types/kanban';

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
    max-width: none;
    margin: 0;
  }
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const Title = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  @media (min-width: 480px) {
    font-size: 1.5rem;
    gap: 10px;
  }
  @media (min-width: 600px) {
    font-size: 2rem;
    gap: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  line-height: 1.45;
  max-width: 560px;
  @media (min-width: 480px) {
    font-size: 0.9375rem;
    margin: 0 0 16px 0;
  }
  @media (min-width: 600px) {
    font-size: 1rem;
    margin: 0 0 24px 0;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 100%;
  @media (min-width: 768px) {
    width: auto;
    gap: 10px;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  height: 44px;
  min-width: 0;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100%;
  }
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8125rem;
    gap: 6px;
  }
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const ConfigLink = styled(IconButton)`
  text-decoration: none;
  border-color: rgba(24, 119, 242, 0.3);
  color: #1877f2;
  &:hover {
    background: rgba(24, 119, 242, 0.08);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 24px;
  align-items: stretch;
  @media (min-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }
  @media (min-width: 900px) {
    gap: 20px;
    margin-bottom: 24px;
  }
`;

const MetricsGridSecondary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 28px;
  align-items: stretch;
  @media (min-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }
  @media (min-width: 900px) {
    gap: 20px;
  }
`;

const SummaryStripTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 10px 0;
`;

const SummaryStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  padding: 16px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 8px 16px;
    margin-bottom: 20px;
    font-size: 0.8125rem;
  }
`;

const ComparisonStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 22px;
  padding: 14px 18px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
  .up {
    color: ${props => props.theme.colors.success || '#10B981'};
  }
  .down {
    color: ${props => props.theme.colors.error || '#E05A5A'};
  }
  @media (max-width: 480px) {
    padding: 12px 14px;
    gap: 8px 14px;
    margin-bottom: 16px;
    font-size: 0.8125rem;
  }
`;

const SummaryItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
`;

const MetricCard = styled.div`
  padding: 18px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  min-height: 76px;
  box-sizing: border-box;
  @media (min-width: 600px) {
    padding: 20px 18px;
    gap: 16px;
    min-height: 84px;
  }
`;

const MetricIcon = styled.div<{ $color: string }>`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${p => p.$color}18;
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @media (min-width: 600px) {
    width: 46px;
    height: 46px;
  }
`;

const MetricContent = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const MetricLabel = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1.25;
  letter-spacing: -0.02em;
  word-break: break-all;
  @media (min-width: 600px) {
    font-size: 1.4375rem;
  }
`;

const InfoBox = styled.div`
  padding: 16px 20px;
  background: ${props =>
    props.theme.colors.backgroundSecondary || 'rgba(24, 119, 242, 0.06)'};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.55;
  @media (max-width: 480px) {
    padding: 12px 14px;
    margin-bottom: 20px;
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;

const TableScrollHint = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  @media (max-width: 480px) {
    font-size: 0.6875rem;
    margin-bottom: 6px;
  }
  @media (min-width: 1200px) {
    display: none;
  }
`;

const TableWrap = styled.div<{ $isGrabbing?: boolean }>`
  overflow-x: auto;
  overflow-y: visible;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.cardBackground};
  -webkit-overflow-scrolling: touch;
  cursor: ${p => (p.$isGrabbing ? 'grabbing' : 'grab')};
  user-select: ${p => (p.$isGrabbing ? 'none' : 'auto')};
  ${p => (p.$isGrabbing ? '&, & * { user-select: none !important; }' : '')}
  /* Scrollbar moderna */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.border}
    ${props => props.theme.colors.backgroundSecondary};
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 0 0 12px 12px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 0.8125rem;
  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.text};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
  vertical-align: middle;
  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding: 14px 18px;
  }
`;

const ThSticky = styled(Th)`
  left: 0;
  z-index: 2;
  min-width: 160px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  @media (max-width: 480px) {
    min-width: 120px;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  vertical-align: middle;
  font-size: 0.8125rem;
  @media (min-width: 768px) {
    padding: 14px 18px;
    font-size: 0.875rem;
  }
`;

const TdSticky = styled(Td)`
  position: sticky;
  left: 0;
  background: ${props => props.theme.colors.cardBackground};
  z-index: 1;
  min-width: 160px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  @media (max-width: 480px) {
    min-width: 120px;
    padding: 10px 12px;
    font-size: 0.75rem;
  }
`;

const SelectCell = styled(Select)`
  min-width: 160px;
  width: 100%;
  padding: 8px 12px;
`;

const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${p =>
    p.$status === 'ACTIVE'
      ? '#10B98118'
      : p.$status === 'PAUSED'
        ? '#F59E0B18'
        : p.theme.colors.backgroundSecondary || '#f0f0f0'};
  color: ${p =>
    p.$status === 'ACTIVE'
      ? '#0d9668'
      : p.$status === 'PAUSED'
        ? '#b45309'
        : p.theme.colors.textSecondary || '#6B7280'};
`;

const ExpandBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DetailCell = styled.td`
  padding: 18px 18px !important;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  vertical-align: top;
`;

const DetailWrap = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const AdSetsSectionTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
`;

const AdSetBlock = styled.div`
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
`;

const AdSetHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: ${props => props.theme.colors.cardBackground};
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  &:hover {
    background: ${props =>
      props.theme.colors.hover || props.theme.colors.backgroundSecondary};
  }
`;

const AdList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 10px 14px 10px 32px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const AdItem = styled.li`
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NumCell = styled.span`
  font-variant-numeric: tabular-nums;
`;

const EmptyState = styled.p`
  padding: 32px 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 18px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  @media (max-width: 480px) {
    padding: 14px 12px;
    margin-bottom: 20px;
    gap: 14px;
  }
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px 20px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 24px;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const FilterLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  flex-shrink: 0;
  min-width: 100px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  @media (max-width: 600px) {
    min-width: 0;
    margin-bottom: 2px;
  }
`;

const FilterGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    min-width: 0;
  }
`;

const AccountChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
`;

const AccountChip = styled.button<{ $selected?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid
    ${p => (p.$selected ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${p =>
    p.$selected ? 'rgba(24, 119, 242, 0.12)' : p.theme.colors.background};
  color: ${p => (p.$selected ? p.theme.colors.primary : p.theme.colors.text)};
  cursor: pointer;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: ${p =>
      p.$selected
        ? 'rgba(24, 119, 242, 0.18)'
        : p.theme.colors.backgroundSecondary};
  }
  @media (min-width: 480px) {
    max-width: 220px;
  }
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  height: 44px;
  width: 100%;
  min-width: 0;
  max-width: 280px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
  @media (max-width: 600px) {
    max-width: none;
    height: 44px;
  }
  @media (min-width: 480px) {
    min-width: 200px;
    width: 200px;
  }
`;

const FilteredCount = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 0;
  width: 100%;
  display: inline-flex;
  align-items: center;
  @media (min-width: 768px) {
    margin-left: auto;
    width: auto;
  }
`;

const ChartsSection = styled.section`
  margin-bottom: 32px;
  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: start;
  @media (max-width: 480px) {
    gap: 16px;
  }
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  min-height: 340px;
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 16px;
    min-height: 280px;
  }
`;

const ChartTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  letter-spacing: -0.01em;
  line-height: 1.3;
  @media (min-width: 480px) {
    font-size: 1rem;
  }
`;

function formatNumber(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return n.toLocaleString('pt-BR');
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function escapeCsvCell(s: string): string {
  const str = String(s ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n'))
    return `"${str.replace(/"/g, '""')}"`;
  return str;
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Ativa',
  PAUSED: 'Pausada',
  ARCHIVED: 'Arquivada',
  DELETED: 'Excluída',
  PENDING_REVIEW: 'Em análise',
  DISAPPROVED: 'Reprovada',
  PREPAUSED: 'Pré-pausada',
  PENDING_BILLING_INFO: 'Pendente faturamento',
  CAMPAIGN_PAUSED: 'Campanha pausada',
  ADSET_PAUSED: 'Conjunto pausado',
};

function getStatusLabel(status: string | undefined): string {
  if (!status) return '—';
  const key = status.toUpperCase();
  return STATUS_LABELS[key] ?? status;
}

const DATE_PRESETS: { value: string; label: string }[] = [
  { value: 'last_7d', label: 'Últimos 7 dias' },
  { value: 'last_30d', label: 'Últimos 30 dias' },
  { value: 'last_90d', label: 'Últimos 90 dias' },
];

const MetaCampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<MetaCampaignItem[]>([]);
  const [redirects, setRedirects] = useState<MetaCampaignRedirectConfig[]>([]);
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [projectMembersMap, setProjectMembersMap] = useState<
    Record<string, Array<{ id: string; name: string; email: string }>>
  >({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState('last_30d');
  const [form, setForm] = useState<
    Record<
      string,
      {
        kanbanProjectId: string;
        responsibleUserId: string;
        postLeadTagIds?: string[];
        postLeadNote?: string;
      }
    >
  >({});
  const [teamTagsMap, setTeamTagsMap] = useState<
    Record<string, Array<{ id: string; name: string; color: string }>>
  >({});
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchName, setSearchName] = useState('');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('');
  const [hasRedirectFilter, setHasRedirectFilter] = useState<string>(''); // '' | 'yes' | 'no'
  const [isTableDragging, setIsTableDragging] = useState(false);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(
    null
  );
  const [adSetsMap, setAdSetsMap] = useState<Record<string, MetaAdSetItem[]>>(
    {}
  );
  const [adsMap, setAdsMap] = useState<Record<string, MetaAdItem[]>>({});
  const [loadingAdSetsId, setLoadingAdSetsId] = useState<string | null>(null);
  const [loadingAdsId, setLoadingAdsId] = useState<string | null>(null);
  const [expandedAdSetIds, setExpandedAdSetIds] = useState<Set<string>>(
    new Set()
  );
  const [crmLeadsStats, setCrmLeadsStats] = useState<MetaCrmLeadsStats | null>(
    null
  );
  const [previousTotals, setPreviousTotals] = useState<{
    impressions: number;
    clicks: number;
    spend: number;
    leads: number;
  } | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState<{
    tokenValid: boolean;
    syncLeads: boolean;
    hasRedirects: boolean;
  } | null>(null);
  const [dailyInsights, setDailyInsights] = useState<
    Array<{
      date: string;
      impressions: number;
      clicks: number;
      spend: number;
      leads: number;
    }>
  >([]);
  const [leadgenForms, setLeadgenForms] = useState<MetaLeadgenFormItem[]>([]);
  const [roasData, setRoasData] = useState<MetaRoasItem[]>([]);
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const accountList = useMemo(() => {
    const seen = new Map<string, { id: string; name: string }>();
    campaigns.forEach(c => {
      const id = c.adAccountId ?? '';
      if (id && !seen.has(id))
        seen.set(id, { id, name: c.adAccountName || id });
    });
    return Array.from(seen.values());
  }, [campaigns]);

  const objectiveList = useMemo(() => {
    const seen = new Set<string>();
    campaigns.forEach(c => {
      const o = (c.objective || '').trim();
      if (o) seen.add(o);
    });
    return Array.from(seen).sort();
  }, [campaigns]);

  const campaignIdsWithRedirect = useMemo(
    () => new Set(redirects.map(r => r.metaCampaignId)),
    [redirects]
  );

  const filteredCampaigns = useMemo(() => {
    let list = campaigns;
    if (selectedAccountIds.length > 0) {
      const set = new Set(selectedAccountIds);
      list = list.filter(c => c.adAccountId && set.has(c.adAccountId));
    }
    if (statusFilter) {
      const status = statusFilter.toUpperCase();
      list = list.filter(
        c => (c.effective_status || c.status || '').toUpperCase() === status
      );
    }
    if (objectiveFilter) {
      list = list.filter(c => (c.objective || '').trim() === objectiveFilter);
    }
    if (hasRedirectFilter === 'yes') {
      list = list.filter(c => campaignIdsWithRedirect.has(c.id));
    } else if (hasRedirectFilter === 'no') {
      list = list.filter(c => !campaignIdsWithRedirect.has(c.id));
    }
    if (searchName.trim()) {
      const q = searchName.trim().toLowerCase();
      list = list.filter(c => (c.name || '').toLowerCase().includes(q));
    }
    return list;
  }, [
    campaigns,
    selectedAccountIds,
    statusFilter,
    objectiveFilter,
    hasRedirectFilter,
    searchName,
    campaignIdsWithRedirect,
  ]);

  const chartLeadsData = useMemo(() => {
    const top = filteredCampaigns
      .slice()
      .sort((a, b) => (b.leads ?? 0) - (a.leads ?? 0))
      .slice(0, 12);
    return top.map(c => ({
      label:
        (c.name || c.id).slice(0, 35) +
        (c.name && c.name.length > 35 ? '…' : ''),
      value: c.leads ?? 0,
    }));
  }, [filteredCampaigns]);

  const chartSpendData = useMemo(() => {
    const top = filteredCampaigns
      .slice()
      .sort((a, b) => (b.spend ?? 0) - (a.spend ?? 0))
      .slice(0, 12);
    return top.map(c => ({
      label:
        (c.name || c.id).slice(0, 35) +
        (c.name && c.name.length > 35 ? '…' : ''),
      value: c.spend ?? 0,
    }));
  }, [filteredCampaigns]);

  const formatDayLabel = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return d && m ? `${d}/${m}` : iso;
  };
  const dailyLeadsChartData = useMemo(() => {
    return dailyInsights.map(d => ({
      label: formatDayLabel(d.date),
      value: d.leads,
    }));
  }, [dailyInsights]);
  const dailySpendChartData = useMemo(() => {
    return dailyInsights.map(d => ({
      label: formatDayLabel(d.date),
      value: d.spend,
    }));
  }, [dailyInsights]);

  const chartCrmLeadsByCampaignData = useMemo(() => {
    const stats = crmLeadsStats?.byCampaign ?? [];
    if (stats.length === 0) return [];
    return stats.slice(0, 12).map(c => ({
      label:
        (c.campaignName || c.metaCampaignId).slice(0, 35) +
        ((c.campaignName || c.metaCampaignId).length > 35 ? '…' : ''),
      value: c.count,
    }));
  }, [crmLeadsStats]);

  const chartCrmLeadsByMonthData = useMemo(() => {
    const stats = crmLeadsStats?.byMonth ?? [];
    if (stats.length === 0) return [];
    return stats.map(m => ({ label: m.monthLabel, value: m.count }));
  }, [crmLeadsStats]);

  const chartLeadgenFormsData = useMemo(() => {
    if (!leadgenForms.length) return [];
    return leadgenForms.slice(0, 12).map(f => ({
      label:
        (f.formId || '').slice(0, 20) +
        (f.formId && f.formId.length > 20 ? '…' : ''),
      value: f.leadCount ?? 0,
    }));
  }, [leadgenForms]);

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds(prev => {
      const next = prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId];
      return next;
    });
  };

  const selectAllAccounts = () => setSelectedAccountIds([]);

  const isInteractiveElement = (el: EventTarget | null): boolean => {
    if (!el || !(el instanceof HTMLElement)) return false;
    const tag = el.tagName?.toUpperCase();
    const role = el.getAttribute?.('role');
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'BUTTON' || tag === 'A')
      return true;
    if (el.closest?.('select, input, button, [role="button"]')) return true;
    return false;
  };

  const onTableMouseDown = useCallback((e: React.MouseEvent) => {
    if (isInteractiveElement(e.target)) return;
    const el = tableScrollRef.current;
    if (!el) return;
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    setIsTableDragging(true);
  }, []);

  const onTableMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isTableDragging) return;
      const el = tableScrollRef.current;
      if (!el) return;
      const dx = dragStart.current.x - e.clientX;
      el.scrollLeft = dragStart.current.scrollLeft + dx;
    },
    [isTableDragging]
  );

  const onTableMouseUp = useCallback(() => setIsTableDragging(false), []);
  const onTableMouseLeave = useCallback(() => setIsTableDragging(false), []);

  const onTableTouchStart = useCallback((e: React.TouchEvent) => {
    if (isInteractiveElement(e.target)) return;
    const el = tableScrollRef.current;
    if (!el || !e.touches[0]) return;
    dragStart.current = { x: e.touches[0].clientX, scrollLeft: el.scrollLeft };
    setIsTableDragging(true);
  }, []);

  const onTableTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTableDragging || !e.touches[0]) return;
      e.preventDefault();
      const el = tableScrollRef.current;
      if (!el) return;
      const dx = dragStart.current.x - e.touches[0].clientX;
      el.scrollLeft = dragStart.current.scrollLeft + dx;
      dragStart.current = {
        x: e.touches[0].clientX,
        scrollLeft: el.scrollLeft,
      };
    },
    [isTableDragging]
  );

  const onTableTouchEnd = useCallback(() => setIsTableDragging(false), []);

  const loadProjectMembers = useCallback((projectId: string) => {
    if (!projectId) return;
    kanbanApi
      .getProjectMembers(projectId)
      .then(members => {
        const list = (members || [])
          .map((m: any) => ({
            id: m.user?.id ?? m.id,
            name: m.user?.name ?? '',
            email: m.user?.email ?? '',
          }))
          .filter((u: any) => u.id);
        setProjectMembersMap(pm => ({ ...pm, [projectId]: list }));
      })
      .catch(() => {});
  }, []);

  const toggleCampaignExpand = useCallback(
    async (campaignId: string) => {
      setExpandedCampaignId(prev => {
        if (prev === campaignId) {
          return null;
        }
        if (!adSetsMap[campaignId]) {
          setLoadingAdSetsId(campaignId);
          metaCampaignApi
            .getCampaignAdSets(campaignId)
            .then(res => {
              setAdSetsMap(m => ({ ...m, [campaignId]: res.data ?? [] }));
              setLoadingAdSetsId(null);
            })
            .catch(() => setLoadingAdSetsId(null));
        }
        return campaignId;
      });
    },
    [adSetsMap]
  );

  const toggleAdSetExpand = useCallback(
    (adSetId: string) => {
      setExpandedAdSetIds(prev => {
        const next = new Set(prev);
        if (next.has(adSetId)) next.delete(adSetId);
        else next.add(adSetId);
        return next;
      });
      if (!adsMap[adSetId]) {
        setLoadingAdsId(adSetId);
        metaCampaignApi
          .getAdSetAds(adSetId)
          .then(res => {
            setAdsMap(m => ({ ...m, [adSetId]: res.data ?? [] }));
            setLoadingAdsId(null);
          })
          .catch(() => setLoadingAdsId(null));
      }
    },
    [adsMap]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const config = await metaCampaignApi.getConfig();
      const hasAdAccounts =
        (config?.adAccounts?.length ?? 0) > 0 || !!config?.adAccountId?.trim();
      if (!config || !hasAdAccounts) {
        navigate('/integrations/meta-campaign/config', { replace: true });
        setLoading(false);
        return;
      }

      const [
        campaignsRes,
        redirectsRes,
        projectsRes,
        crmStatsRes,
        prevTotalsRes,
        statusRes,
        dailyRes,
        formsRes,
        roasRes,
      ] = await Promise.all([
        metaCampaignApi.getCampaigns({
          insights: true,
          date_preset: datePreset,
        }),
        metaCampaignApi.getRedirectConfig(),
        projectsApi
          .getFilteredProjects({ limit: '100', page: '1', status: 'active' })
          .then(r => r.data ?? [])
          .catch(() => []),
        metaCampaignApi.getCrmLeadsStats(datePreset),
        metaCampaignApi.getPreviousTotals(datePreset),
        metaCampaignApi.getIntegrationStatus(),
        metaCampaignApi.getDailyInsights(datePreset),
        metaCampaignApi
          .getLeadgenForms(datePreset)
          .then(r => r.data ?? [])
          .catch(() => []),
        metaCampaignApi
          .getRoas(datePreset)
          .then(r => r.data ?? [])
          .catch(() => []),
      ]);
      setCampaigns(campaignsRes);
      setRedirects(redirectsRes);
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      setCrmLeadsStats(crmStatsRes);
      setPreviousTotals(prevTotalsRes);
      setIntegrationStatus(statusRes);
      setDailyInsights(dailyRes.daily ?? []);
      setLeadgenForms(formsRes);
      setRoasData(roasRes);

      const initial: Record<
        string,
        {
          kanbanProjectId: string;
          responsibleUserId: string;
          postLeadTagIds?: string[];
          postLeadNote?: string;
        }
      > = {};
      campaignsRes.forEach(c => {
        const r = redirectsRes.find(x => x.metaCampaignId === c.id);
        initial[c.id] = {
          kanbanProjectId: r?.kanbanProjectId ?? '',
          responsibleUserId: r?.responsibleUserId ?? '',
          postLeadTagIds: r?.postLeadTagIds ?? undefined,
          postLeadNote: r?.postLeadNote ?? undefined,
        };
      });
      setForm(initial);
      const teamIds = [
        ...new Set(
          (Array.isArray(projectsRes) ? projectsRes : [])
            .map((p: any) => p.teamId)
            .filter(Boolean)
        ),
      ];
      const tagsByTeam: Record<
        string,
        Array<{ id: string; name: string; color: string }>
      > = {};
      await Promise.all(
        teamIds.map(async (tid: string) => {
          try {
            const list = await kanbanApi.getTeamTags(tid);
            tagsByTeam[tid] = list;
          } catch {
            tagsByTeam[tid] = [];
          }
        })
      );
      setTeamTagsMap(tagsByTeam);
      const projectIds = [
        ...new Set(
          Object.values(initial)
            .map(v => v.kanbanProjectId)
            .filter(Boolean)
        ),
      ];
      projectIds.forEach(pid => loadProjectMembers(pid));
    } catch (e: any) {
      showError(e?.message || 'Erro ao carregar campanhas.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [navigate, datePreset, loadProjectMembers]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (campaign: MetaCampaignItem) => {
    const values = form[campaign.id];
    if (!values?.kanbanProjectId) {
      showError('Selecione um funil para redirecionamento.');
      return;
    }
    setSavingId(campaign.id);
    try {
      const payload: UpsertMetaCampaignRedirectRequest = {
        metaCampaignId: campaign.id,
        metaCampaignName: campaign.name,
        adAccountId: campaign.adAccountId,
        kanbanProjectId: values.kanbanProjectId,
        responsibleUserId: values.responsibleUserId || undefined,
        postLeadTagIds: values.postLeadTagIds?.length
          ? values.postLeadTagIds
          : undefined,
        postLeadNote: values.postLeadNote?.trim() || undefined,
      };
      await metaCampaignApi.putRedirectConfig(payload);
      showSuccess(
        'Redirecionamento salvo. Leads desta campanha irão para o funil selecionado.'
      );
      load();
    } catch (e: any) {
      showError(e?.message || 'Erro ao salvar.');
    } finally {
      setSavingId(null);
    }
  };

  const updateForm = (
    campaignId: string,
    field:
      | 'kanbanProjectId'
      | 'responsibleUserId'
      | 'postLeadTagIds'
      | 'postLeadNote',
    value: string | string[]
  ) => {
    if (field === 'kanbanProjectId') {
      loadProjectMembers(value as string);
      setForm(prev => ({
        ...prev,
        [campaignId]: {
          ...prev[campaignId],
          kanbanProjectId: value as string,
          responsibleUserId: '',
        },
      }));
    } else if (field === 'postLeadTagIds') {
      setForm(prev => ({
        ...prev,
        [campaignId]: {
          ...prev[campaignId],
          postLeadTagIds: value as string[],
        },
      }));
    } else if (field === 'postLeadNote') {
      setForm(prev => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], postLeadNote: value as string },
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [campaignId]: { ...prev[campaignId], [field]: value },
      }));
    }
  };

  const handleExportCsv = useCallback(() => {
    const headers = [
      'Campanha',
      'Conta',
      'Objetivo',
      'Status',
      'Impressões',
      'Cliques',
      'Gasto (R$)',
      'Leads',
      'Funil',
      'Responsável',
    ];
    const rows = filteredCampaigns.map(c => {
      const r = redirects.find(x => x.metaCampaignId === c.id);
      const projId = form[c.id]?.kanbanProjectId || r?.kanbanProjectId;
      const project = projects.find(p => p.id === projId);
      const respId = form[c.id]?.responsibleUserId || r?.responsibleUserId;
      const members = projId ? (projectMembersMap[projId] ?? []) : [];
      const resp = members.find(m => m.id === respId);
      return [
        escapeCsvCell(c.name || c.id),
        escapeCsvCell(c.adAccountName || c.adAccountId || ''),
        escapeCsvCell(c.objective || ''),
        escapeCsvCell(getStatusLabel(c.effective_status || c.status)),
        (c.impressions ?? 0).toLocaleString('pt-BR'),
        (c.clicks ?? 0).toLocaleString('pt-BR'),
        (c.spend ?? 0).toFixed(2),
        String(c.leads ?? 0),
        escapeCsvCell(project?.name ?? ''),
        escapeCsvCell(resp?.name ?? ''),
      ];
    });
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campanhas-meta-${datePreset}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Relatório exportado.');
  }, [
    filteredCampaigns,
    redirects,
    form,
    projects,
    projectMembersMap,
    datePreset,
  ]);

  const totals = useMemo(
    () => ({
      impressions: filteredCampaigns.reduce(
        (s, c) => s + (c.impressions ?? 0),
        0
      ),
      clicks: filteredCampaigns.reduce((s, c) => s + (c.clicks ?? 0), 0),
      spend: filteredCampaigns.reduce((s, c) => s + (c.spend ?? 0), 0),
      leads: filteredCampaigns.reduce((s, c) => s + (c.leads ?? 0), 0),
    }),
    [filteredCampaigns]
  );

  const crmLeadsTotal = crmLeadsStats?.total ?? 0;
  const captureRate =
    totals.leads > 0 ? Math.round((crmLeadsTotal / totals.leads) * 100) : 0;
  const cpl = totals.leads > 0 ? totals.spend / totals.leads : 0;
  const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;

  const summaryByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCampaigns.forEach(c => {
      const s = (c.effective_status || c.status || 'outros').toUpperCase();
      map[s] = (map[s] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([status, count]) => ({ status: getStatusLabel(status), count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCampaigns]);

  const summaryByObjective = useMemo(() => {
    const map: Record<string, number> = {};
    filteredCampaigns.forEach(c => {
      const o = (c.objective || '').trim() || 'outros';
      map[o] = (map[o] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([objective, count]) => ({ objective, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredCampaigns]);

  const countWithFunnel = useMemo(
    () =>
      filteredCampaigns.filter(c => campaignIdsWithRedirect.has(c.id)).length,
    [filteredCampaigns, campaignIdsWithRedirect]
  );

  const comparisonVariation = useMemo(() => {
    if (!previousTotals) return null;
    const p = previousTotals;
    const vari = (current: number, prev: number) =>
      prev === 0
        ? current === 0
          ? 0
          : 100
        : Math.round(((current - prev) / prev) * 100);
    return {
      impressions: vari(totals.impressions, p.impressions),
      clicks: vari(totals.clicks, p.clicks),
      spend: vari(totals.spend, p.spend),
      leads: vari(totals.leads, p.leads),
    };
  }, [totals, previousTotals]);

  return (
    <Layout>
      <PageContainer>
        <BackButton
          onClick={() => navigate('/integrations')}
          title='Voltar para a página de Integrações'
        >
          <MdArrowBack size={20} /> Voltar
        </BackButton>

        <HeaderRow>
          <div>
            <Title>
              <FaFacebookF size={28} color='#1877F2' />
              Campanhas META
            </Title>
            <Subtitle>
              Métricas das suas campanhas (Facebook/Instagram) e configuração de
              funil para leads.
            </Subtitle>
          </div>
          <Toolbar>
            <Select
              value={datePreset}
              onChange={e => setDatePreset(e.target.value)}
              title='Período das métricas'
            >
              {DATE_PRESETS.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
            <IconButton
              type='button'
              onClick={() => load()}
              disabled={loading}
              title='Atualizar'
            >
              <MdRefresh size={18} />
              Atualizar
            </IconButton>
            <IconButton
              type='button'
              onClick={handleExportCsv}
              disabled={filteredCampaigns.length === 0}
              title='Exportar relatório (CSV)'
            >
              <MdDownload size={18} />
              Exportar
            </IconButton>
            <ConfigLink
              type='button'
              onClick={() => navigate('/integrations/meta-campaign/config')}
              title='Configurações da integração'
            >
              <MdSettings size={18} />
              Configurações
            </ConfigLink>
          </Toolbar>
        </HeaderRow>

        {integrationStatus && (
          <ComparisonStrip style={{ marginBottom: 12 }}>
            <strong>Status da integração:</strong>
            <SummaryItem>
              Token:{' '}
              <span className={integrationStatus.tokenValid ? 'up' : 'down'}>
                {integrationStatus.tokenValid
                  ? 'Válido'
                  : 'Inválido ou expirado'}
              </span>
            </SummaryItem>
            <SummaryItem>
              Sync leads: {integrationStatus.syncLeads ? 'Ativo' : 'Inativo'}
            </SummaryItem>
            <SummaryItem>
              Funis configurados:{' '}
              {integrationStatus.hasRedirects ? 'Sim' : 'Nenhum'}
            </SummaryItem>
          </ComparisonStrip>
        )}
        <InfoBox>
          Use os filtros para analisar campanhas específicas. Você vê métricas
          da Meta (impressões, cliques, gasto, leads), KPIs (CPL, CPC, taxa de
          captura Meta→CRM), resumo por status e objetivo, gráficos por campanha
          e por mês, e leads capturados no seu CRM. Vincule cada campanha a um
          funil na tabela para definir para onde os leads devem ir.
        </InfoBox>

        {loading ? (
          <MetaCampaignsShimmer />
        ) : campaigns.length === 0 ? (
          <EmptyState>
            Nenhuma campanha encontrada. Verifique se a integração Meta está
            configurada com token e contas de anúncios corretos.
          </EmptyState>
        ) : (
          <>
            <FiltersSection>
              {accountList.length > 1 && (
                <FilterRow>
                  <FilterLabel>Contas:</FilterLabel>
                  <AccountChipsWrap>
                    <AccountChip
                      $selected={selectedAccountIds.length === 0}
                      onClick={selectAllAccounts}
                      title='Mostrar todas as contas'
                    >
                      Todas ({campaigns.length})
                    </AccountChip>
                    {accountList.map(acc => {
                      const count = campaigns.filter(
                        c => c.adAccountId === acc.id
                      ).length;
                      const selected = selectedAccountIds.includes(acc.id);
                      return (
                        <AccountChip
                          key={acc.id}
                          $selected={selected}
                          onClick={() => toggleAccount(acc.id)}
                          title={acc.id}
                        >
                          {acc.name || acc.id} ({count})
                        </AccountChip>
                      );
                    })}
                  </AccountChipsWrap>
                </FilterRow>
              )}
              <FilterRow>
                <FilterGroup>
                  <FilterLabel title='Filtrar por status da campanha na Meta'>
                    Status:
                  </FilterLabel>
                  <Select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    style={{ minWidth: 120 }}
                    title='Status da campanha (Ativa, Pausada, etc.)'
                  >
                    <option value=''>Todos</option>
                    <option value='ACTIVE'>Ativa</option>
                    <option value='PAUSED'>Pausada</option>
                    <option value='ARCHIVED'>Arquivada</option>
                    <option value='DELETED'>Excluída</option>
                  </Select>
                </FilterGroup>
                {objectiveList.length > 0 && (
                  <FilterGroup>
                    <FilterLabel title='Filtrar por objetivo da campanha'>
                      Objetivo:
                    </FilterLabel>
                    <Select
                      value={objectiveFilter}
                      onChange={e => setObjectiveFilter(e.target.value)}
                      style={{ minWidth: 140 }}
                      title='Objetivo da campanha (ex.: LEADS, TRAFFIC)'
                    >
                      <option value=''>Todos</option>
                      {objectiveList.map(obj => (
                        <option key={obj} value={obj}>
                          {obj}
                        </option>
                      ))}
                    </Select>
                  </FilterGroup>
                )}
                <FilterGroup>
                  <FilterLabel title='Filtrar campanhas com ou sem funil configurado'>
                    Redirecionamento:
                  </FilterLabel>
                  <Select
                    value={hasRedirectFilter}
                    onChange={e => setHasRedirectFilter(e.target.value)}
                    style={{ minWidth: 140 }}
                    title='Com funil configurado ou sem funil'
                  >
                    <option value=''>Todos</option>
                    <option value='yes'>Com funil configurado</option>
                    <option value='no'>Sem funil</option>
                  </Select>
                </FilterGroup>
                <FilterGroup>
                  <FilterLabel title='Buscar por nome da campanha'>
                    Buscar:
                  </FilterLabel>
                  <SearchInput
                    type='text'
                    placeholder='Nome da campanha...'
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                    title='Digite o nome da campanha para filtrar'
                  />
                </FilterGroup>
                <FilteredCount>
                  {filteredCampaigns.length === campaigns.length
                    ? `${campaigns.length} campanha(s)`
                    : `${filteredCampaigns.length} de ${campaigns.length} campanha(s)`}
                </FilteredCount>
              </FilterRow>
            </FiltersSection>

            {filteredCampaigns.length === 0 ? (
              <EmptyState>
                Nenhuma campanha corresponde aos filtros. Tente alterar contas,
                status ou o texto da busca.
              </EmptyState>
            ) : (
              <>
                <MetricsGrid>
                  <MetricCard title='Total de impressões das campanhas no período (Meta)'>
                    <MetricIcon $color='#1877F2'>
                      <MdTrendingUp size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>Impressões</MetricLabel>
                      <MetricValue>
                        {formatNumber(totals.impressions)}
                      </MetricValue>
                    </MetricContent>
                  </MetricCard>
                  <MetricCard title='Total de cliques nas campanhas no período (Meta)'>
                    <MetricIcon $color='#10B981'>
                      <MdTouchApp size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>Cliques</MetricLabel>
                      <MetricValue>{formatNumber(totals.clicks)}</MetricValue>
                    </MetricContent>
                  </MetricCard>
                  <MetricCard title='Gasto total em reais nas campanhas no período (Meta)'>
                    <MetricIcon $color='#F59E0B'>
                      <MdAttachMoney size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>Gasto total</MetricLabel>
                      <MetricValue>{formatCurrency(totals.spend)}</MetricValue>
                    </MetricContent>
                  </MetricCard>
                  <MetricCard title='Total de leads gerados pelos formulários da Meta no período'>
                    <MetricIcon $color='#8B5CF6'>
                      <MdPeople size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>Leads (Meta)</MetricLabel>
                      <MetricValue>{formatNumber(totals.leads)}</MetricValue>
                    </MetricContent>
                  </MetricCard>
                </MetricsGrid>

                <MetricsGridSecondary>
                  <MetricCard title='Leads que foram capturados e criados como tarefas no seu CRM no período'>
                    <MetricIcon $color='#0EA5E9'>
                      <MdPeople size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>Leads no CRM</MetricLabel>
                      <MetricValue>{formatNumber(crmLeadsTotal)}</MetricValue>
                      <SectionSubtitle
                        style={{ margin: 0, fontSize: '0.75rem' }}
                      >
                        capturados no período
                      </SectionSubtitle>
                    </MetricContent>
                  </MetricCard>
                  <MetricCard title='Percentual de leads da Meta que viraram tarefas no CRM (Meta → CRM)'>
                    <MetricIcon $color='#6366F1'>
                      <MdTrendingUp size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>Taxa de captura</MetricLabel>
                      <MetricValue>{captureRate}%</MetricValue>
                      <SectionSubtitle
                        style={{ margin: 0, fontSize: '0.75rem' }}
                      >
                        Meta → CRM
                      </SectionSubtitle>
                    </MetricContent>
                  </MetricCard>
                  <MetricCard title='Custo por lead: gasto total ÷ número de leads (Meta)'>
                    <MetricIcon $color='#F59E0B'>
                      <MdAttachMoney size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>CPL (custo/lead)</MetricLabel>
                      <MetricValue>{formatCurrency(cpl)}</MetricValue>
                    </MetricContent>
                  </MetricCard>
                  <MetricCard title='Custo por clique: gasto total ÷ número de cliques (Meta)'>
                    <MetricIcon $color='#14B8A6'>
                      <MdTouchApp size={24} />
                    </MetricIcon>
                    <MetricContent>
                      <MetricLabel>CPC (custo/clique)</MetricLabel>
                      <MetricValue>{formatCurrency(cpc)}</MetricValue>
                    </MetricContent>
                  </MetricCard>
                </MetricsGridSecondary>

                {comparisonVariation && (
                  <ComparisonStrip>
                    <strong>Comparação com período anterior:</strong>
                    <SummaryItem>
                      <span
                        className={
                          comparisonVariation.impressions >= 0 ? 'up' : 'down'
                        }
                      >
                        Impressões{' '}
                        {comparisonVariation.impressions >= 0 ? '+' : ''}
                        {comparisonVariation.impressions}%
                      </span>
                    </SummaryItem>
                    <SummaryItem>
                      <span
                        className={
                          comparisonVariation.clicks >= 0 ? 'up' : 'down'
                        }
                      >
                        Cliques {comparisonVariation.clicks >= 0 ? '+' : ''}
                        {comparisonVariation.clicks}%
                      </span>
                    </SummaryItem>
                    <SummaryItem>
                      <span
                        className={
                          comparisonVariation.spend >= 0 ? 'up' : 'down'
                        }
                      >
                        Gasto {comparisonVariation.spend >= 0 ? '+' : ''}
                        {comparisonVariation.spend}%
                      </span>
                    </SummaryItem>
                    <SummaryItem>
                      <span
                        className={
                          comparisonVariation.leads >= 0 ? 'up' : 'down'
                        }
                      >
                        Leads {comparisonVariation.leads >= 0 ? '+' : ''}
                        {comparisonVariation.leads}%
                      </span>
                    </SummaryItem>
                  </ComparisonStrip>
                )}

                <SummaryStripTitle>Resumo das campanhas</SummaryStripTitle>
                <SummaryStrip>
                  <SummaryItem>
                    <strong>{filteredCampaigns.length}</strong> campanha(s) no
                    total
                  </SummaryItem>
                  {countWithFunnel > 0 && (
                    <SummaryItem>
                      <strong>{countWithFunnel}</strong> com funil configurado
                    </SummaryItem>
                  )}
                  {summaryByStatus.slice(0, 4).map(({ status, count }) => (
                    <SummaryItem key={status}>
                      <strong>{count}</strong> {status}
                    </SummaryItem>
                  ))}
                  {summaryByObjective.length > 0 && (
                    <>
                      <span style={{ color: 'var(--color-border, #ccc)' }}>
                        |
                      </span>
                      {summaryByObjective
                        .slice(0, 3)
                        .map(({ objective, count }) => (
                          <SummaryItem key={objective}>
                            <strong>{count}</strong> {objective}
                          </SummaryItem>
                        ))}
                    </>
                  )}
                </SummaryStrip>

                <ChartsSection>
                  <ChartTitle style={{ marginBottom: 16 }}>
                    Dados da Meta (campanhas)
                  </ChartTitle>
                  <ChartsGrid>
                    <ChartCard>
                      <ChartTitle>Leads (Meta) por campanha</ChartTitle>
                      <BarChart
                        data={chartLeadsData}
                        label='Leads'
                        color='#8B5CF6'
                        emptyMessage='Nenhum lead no período'
                        horizontal
                      />
                    </ChartCard>
                    <ChartCard>
                      <ChartTitle>Gasto por campanha (R$)</ChartTitle>
                      <BarChart
                        data={chartSpendData}
                        label='Gasto'
                        color='#F59E0B'
                        emptyMessage='Nenhum gasto no período'
                        horizontal
                      />
                    </ChartCard>
                  </ChartsGrid>
                </ChartsSection>

                <ChartsSection>
                  <ChartTitle style={{ marginBottom: 16 }}>
                    Evolução no tempo (por dia)
                  </ChartTitle>
                  <ChartsGrid>
                    <ChartCard>
                      <ChartTitle>Leads por dia</ChartTitle>
                      <LineChart
                        data={dailyLeadsChartData}
                        label='Leads'
                        color='#8B5CF6'
                        emptyMessage='Nenhum dado diário no período'
                        loading={false}
                      />
                    </ChartCard>
                    <ChartCard>
                      <ChartTitle>Gasto por dia (R$)</ChartTitle>
                      <LineChart
                        data={dailySpendChartData}
                        label='Gasto'
                        color='#F59E0B'
                        emptyMessage='Nenhum dado diário no período'
                        loading={false}
                      />
                    </ChartCard>
                  </ChartsGrid>
                </ChartsSection>

                <ChartsSection>
                  <ChartTitle style={{ marginBottom: 16 }}>
                    Leads no CRM (capturados no seu sistema)
                  </ChartTitle>
                  <ChartsGrid>
                    <ChartCard>
                      <ChartTitle>Leads no CRM por campanha</ChartTitle>
                      <BarChart
                        data={chartCrmLeadsByCampaignData}
                        label='Leads'
                        color='#10B981'
                        emptyMessage='Nenhum lead capturado no período'
                        horizontal
                      />
                    </ChartCard>
                    <ChartCard>
                      <ChartTitle>Leads no CRM por mês</ChartTitle>
                      <BarChart
                        data={chartCrmLeadsByMonthData}
                        label='Leads'
                        color='#0EA5E9'
                        emptyMessage='Nenhum lead capturado no período'
                      />
                    </ChartCard>
                  </ChartsGrid>
                </ChartsSection>

                <ChartsSection>
                  <ChartTitle style={{ marginBottom: 16 }}>
                    Formulários de lead (Meta)
                  </ChartTitle>
                  <ChartsGrid>
                    <ChartCard>
                      <ChartTitle>Leads por formulário (no período)</ChartTitle>
                      <BarChart
                        data={chartLeadgenFormsData}
                        label='Leads'
                        color='#8B5CF6'
                        horizontal
                      />
                    </ChartCard>
                    <ChartCard>
                      <ChartTitle>ROAS (gasto vs receita fechada)</ChartTitle>
                      <Table>
                        <thead>
                          <tr>
                            <Th>Campanha</Th>
                            <Th style={{ textAlign: 'right' }}>Gasto</Th>
                            <Th style={{ textAlign: 'right' }}>Receita</Th>
                            <Th style={{ textAlign: 'right' }}>ROAS</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {roasData
                            .filter(r => r.spend > 0 || r.revenue > 0)
                            .slice(0, 12).length === 0 ? (
                            <tr>
                              <Td
                                colSpan={4}
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                —
                              </Td>
                            </tr>
                          ) : (
                            roasData
                              .filter(r => r.spend > 0 || r.revenue > 0)
                              .slice(0, 12)
                              .map(r => (
                                <tr key={r.metaCampaignId}>
                                  <Td>
                                    {(r.campaignName || r.metaCampaignId).slice(
                                      0,
                                      40
                                    )}
                                    {r.campaignName &&
                                    r.campaignName.length > 40
                                      ? '…'
                                      : ''}
                                  </Td>
                                  <Td style={{ textAlign: 'right' }}>
                                    <NumCell>{formatCurrency(r.spend)}</NumCell>
                                  </Td>
                                  <Td style={{ textAlign: 'right' }}>
                                    <NumCell>
                                      {formatCurrency(r.revenue)}
                                    </NumCell>
                                  </Td>
                                  <Td style={{ textAlign: 'right' }}>
                                    <NumCell>{r.roas.toFixed(2)}x</NumCell>
                                  </Td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </Table>
                    </ChartCard>
                  </ChartsGrid>
                </ChartsSection>

                <TableScrollHint title='A tabela pode ser arrastada horizontalmente para ver todas as colunas'>
                  ← Arraste a tabela ou deslize para ver mais colunas →
                </TableScrollHint>
                <TableWrap
                  ref={tableScrollRef}
                  $isGrabbing={isTableDragging}
                  onMouseDown={onTableMouseDown}
                  onMouseMove={onTableMouseMove}
                  onMouseUp={onTableMouseUp}
                  onMouseLeave={onTableMouseLeave}
                  onTouchStart={onTableTouchStart}
                  onTouchMove={onTableTouchMove}
                  onTouchEnd={onTableTouchEnd}
                >
                  <Table>
                    <thead>
                      <tr>
                        <Th
                          style={{
                            width: 52,
                            minWidth: 52,
                            padding: '14px 10px',
                          }}
                          title='Ver conjuntos de anúncios e anúncios'
                        ></Th>
                        <ThSticky title='Nome da campanha na Meta'>
                          Campanha
                        </ThSticky>
                        <Th title='Conta de anúncios da Meta'>Conta</Th>
                        <Th title='Objetivo da campanha (ex.: LEADS, TRAFFIC)'>
                          Objetivo
                        </Th>
                        <Th title='Status atual na Meta (Ativa, Pausada, etc.)'>
                          Status
                        </Th>
                        <Th
                          style={{ textAlign: 'right' }}
                          title='Número de impressões no período'
                        >
                          Impressões
                        </Th>
                        <Th
                          style={{ textAlign: 'right' }}
                          title='Número de cliques no período'
                        >
                          Cliques
                        </Th>
                        <Th
                          style={{ textAlign: 'right' }}
                          title='Gasto em reais no período'
                        >
                          Gasto
                        </Th>
                        <Th
                          style={{ textAlign: 'right' }}
                          title='Leads gerados pela campanha na Meta'
                        >
                          Leads
                        </Th>
                        <Th title='Cada campanha pode mandar leads para um funil diferente. Selecione o funil de destino dos leads desta campanha (ou use o funil padrão da configuração da integração).'>
                          Funil
                        </Th>
                        <Th title='Usuário responsável pelas tarefas criadas a partir dos leads'>
                          Responsável (opcional)
                        </Th>
                        <Th
                          title='Tag e nota aplicadas ao criar a tarefa a partir do lead'
                          style={{ minWidth: 200, width: 200 }}
                        >
                          Automação pós-lead
                        </Th>
                        <Th
                          style={{ width: 100 }}
                          title='Salvar configuração de redirecionamento'
                        ></Th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCampaigns.map(c => (
                        <React.Fragment key={c.id}>
                          <tr>
                            <Td
                              style={{
                                padding: '12px 10px',
                                verticalAlign: 'middle',
                              }}
                            >
                              <ExpandBtn
                                type='button'
                                onClick={() => toggleCampaignExpand(c.id)}
                                title={
                                  expandedCampaignId === c.id
                                    ? 'Ocultar ad sets e anúncios'
                                    : 'Ver ad sets e anúncios'
                                }
                              >
                                {expandedCampaignId === c.id ? (
                                  <MdExpandLess size={20} />
                                ) : (
                                  <MdExpandMore size={20} />
                                )}
                              </ExpandBtn>
                            </Td>
                            <TdSticky>
                              <strong>{c.name || c.id}</strong>
                            </TdSticky>
                            <Td>
                              <span title={c.adAccountId}>
                                {c.adAccountName || c.adAccountId || '—'}
                              </span>
                            </Td>
                            <Td>{c.objective || '—'}</Td>
                            <Td>
                              <StatusBadge
                                $status={c.effective_status || c.status}
                              >
                                {getStatusLabel(c.effective_status || c.status)}
                              </StatusBadge>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <NumCell>
                                {formatNumber(c.impressions ?? 0)}
                              </NumCell>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <NumCell>{formatNumber(c.clicks ?? 0)}</NumCell>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <NumCell>{formatCurrency(c.spend ?? 0)}</NumCell>
                            </Td>
                            <Td style={{ textAlign: 'right' }}>
                              <NumCell>{formatNumber(c.leads ?? 0)}</NumCell>
                            </Td>
                            <Td>
                              <SelectCell
                                value={form[c.id]?.kanbanProjectId ?? ''}
                                onChange={e =>
                                  updateForm(
                                    c.id,
                                    'kanbanProjectId',
                                    e.target.value
                                  )
                                }
                              >
                                <option value=''>Selecione o funil</option>
                                {projects.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </SelectCell>
                            </Td>
                            <Td>
                              <SelectCell
                                value={form[c.id]?.responsibleUserId ?? ''}
                                onChange={e =>
                                  updateForm(
                                    c.id,
                                    'responsibleUserId',
                                    e.target.value
                                  )
                                }
                                disabled={!form[c.id]?.kanbanProjectId}
                              >
                                <option value=''>
                                  {!form[c.id]?.kanbanProjectId
                                    ? 'Selecione um funil antes'
                                    : 'Nenhum'}
                                </option>
                                {(
                                  projectMembersMap[
                                    form[c.id]?.kanbanProjectId ?? ''
                                  ] ?? []
                                ).map(u => (
                                  <option key={u.id} value={u.id}>
                                    {u.name} {u.email ? `(${u.email})` : ''}
                                  </option>
                                ))}
                              </SelectCell>
                            </Td>
                            <Td
                              style={{
                                minWidth: 200,
                                width: 200,
                                verticalAlign: 'top',
                              }}
                            >
                              {(() => {
                                const proj = projects.find(
                                  p => p.id === form[c.id]?.kanbanProjectId
                                );
                                const tags = proj?.teamId
                                  ? (teamTagsMap[proj.teamId] ?? [])
                                  : [];
                                return (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 8,
                                    }}
                                  >
                                    <Select
                                      multiple
                                      value={form[c.id]?.postLeadTagIds ?? []}
                                      onChange={e =>
                                        updateForm(
                                          c.id,
                                          'postLeadTagIds',
                                          Array.from(
                                            e.target.selectedOptions,
                                            o => o.value
                                          )
                                        )
                                      }
                                      disabled={!form[c.id]?.kanbanProjectId}
                                      title='Tags a aplicar ao criar lead'
                                      style={{
                                        minHeight: 36,
                                        fontSize: '0.8125rem',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                      }}
                                    >
                                      {tags.map(t => (
                                        <option key={t.id} value={t.id}>
                                          {t.name}
                                        </option>
                                      ))}
                                    </Select>
                                    <input
                                      type='text'
                                      placeholder='Nota automática (opcional)'
                                      title='Texto adicionado automaticamente à tarefa ao criar o lead'
                                      value={form[c.id]?.postLeadNote ?? ''}
                                      onChange={e =>
                                        updateForm(
                                          c.id,
                                          'postLeadNote',
                                          e.target.value
                                        )
                                      }
                                      disabled={!form[c.id]?.kanbanProjectId}
                                      style={{
                                        width: '100%',
                                        padding: '8px 10px',
                                        fontSize: '0.8125rem',
                                        border:
                                          '1px solid var(--color-border, #ddd)',
                                        borderRadius: 8,
                                        background:
                                          'var(--color-card-bg, #fff)',
                                        color: 'var(--color-text, #333)',
                                        boxSizing: 'border-box',
                                      }}
                                    />
                                  </div>
                                );
                              })()}
                            </Td>
                            <Td>
                              <SaveBtn
                                type='button'
                                title='Salvar funil, responsável e automação pós-lead desta campanha'
                                disabled={
                                  savingId === c.id ||
                                  !form[c.id]?.kanbanProjectId
                                }
                                onClick={() => handleSave(c)}
                              >
                                <MdSave size={16} />
                                {savingId === c.id ? 'Salvando...' : 'Salvar'}
                              </SaveBtn>
                            </Td>
                          </tr>
                          {expandedCampaignId === c.id && (
                            <tr>
                              <DetailCell colSpan={13}>
                                <DetailWrap>
                                  <AdSetsSectionTitle>
                                    Conjuntos de anúncios (Ad sets) e anúncios
                                  </AdSetsSectionTitle>
                                  {loadingAdSetsId === c.id ? (
                                    <p
                                      style={{
                                        margin: 0,
                                        color: 'var(--color-text-secondary)',
                                      }}
                                    >
                                      Carregando ad sets...
                                    </p>
                                  ) : (adSetsMap[c.id]?.length ?? 0) === 0 ? (
                                    <p
                                      style={{
                                        margin: 0,
                                        color: 'var(--color-text-secondary)',
                                      }}
                                    >
                                      Nenhum conjunto de anúncios ou a campanha
                                      não permite listagem.
                                    </p>
                                  ) : (
                                    (adSetsMap[c.id] ?? []).map(adSet => (
                                      <AdSetBlock key={adSet.id}>
                                        <AdSetHeader
                                          type='button'
                                          onClick={() =>
                                            toggleAdSetExpand(adSet.id)
                                          }
                                        >
                                          {expandedAdSetIds.has(adSet.id) ? (
                                            <MdExpandLess size={18} />
                                          ) : (
                                            <MdExpandMore size={18} />
                                          )}
                                          <span style={{ flex: 1 }}>
                                            {adSet.name || adSet.id}
                                          </span>
                                          <StatusBadge
                                            $status={
                                              adSet.effective_status ||
                                              adSet.status
                                            }
                                          >
                                            {getStatusLabel(
                                              adSet.effective_status ||
                                                adSet.status
                                            )}
                                          </StatusBadge>
                                        </AdSetHeader>
                                        {expandedAdSetIds.has(adSet.id) && (
                                          <AdList>
                                            {loadingAdsId === adSet.id ? (
                                              <AdItem>
                                                Carregando anúncios...
                                              </AdItem>
                                            ) : (adsMap[adSet.id]?.length ??
                                                0) === 0 ? (
                                              <AdItem>
                                                Nenhum anúncio neste conjunto.
                                              </AdItem>
                                            ) : (
                                              (adsMap[adSet.id] ?? []).map(
                                                ad => (
                                                  <AdItem key={ad.id}>
                                                    <span>
                                                      {ad.name || ad.id}
                                                    </span>
                                                    <StatusBadge
                                                      $status={
                                                        ad.effective_status ||
                                                        ad.status
                                                      }
                                                    >
                                                      {getStatusLabel(
                                                        ad.effective_status ||
                                                          ad.status
                                                      )}
                                                    </StatusBadge>
                                                  </AdItem>
                                                )
                                              )
                                            )}
                                          </AdList>
                                        )}
                                      </AdSetBlock>
                                    ))
                                  )}
                                </DetailWrap>
                              </DetailCell>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </TableWrap>
              </>
            )}
          </>
        )}
      </PageContainer>
    </Layout>
  );
};

export default MetaCampaignsPage;
