import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../components/layout/Layout';
import { KanbanPermissionsShimmer } from '../components/shimmer/KanbanPermissionsShimmer';
import { useKanbanPermissions } from '../hooks/useKanbanPermissions';
import { companyMembersApi } from '../services/companyMembersApi';
import { kanbanApi } from '../services/kanbanApi';
import { teamApi } from '../services/teamApi';
import type { CompanyMember } from '../services/companyMembersApi';
import type { BoardPermissionItem, BoardPermissionPayload } from '../types/kanban';
import { MdArrowBack, MdSave, MdManageAccounts, MdSearch, MdVisibility, MdAdd, MdDriveFileMove, MdEdit, MdDelete, MdClear } from 'react-icons/md';
import { showError, showSuccess } from '../utils/notifications';

const PAGE_SIZE = 20;
const BOARD_PAGE_SIZE = 20;

/** Usuário exibido na lista (company member ou membro do time mapeado). */
type DisplayMember = { id: string; name: string; email: string };

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  background: ${p => p.theme.colors.cardBackground};
  color: ${p => p.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  &:hover {
    background: ${p => p.theme.colors.hover};
    border-color: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.primary};
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${p => p.theme.colors.text};
  margin: 0;
  @media (max-width: 600px) {
    font-size: 1.25rem;
  }
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${p => p.theme.colors.textSecondary};
  margin: 8px 0 0 0;
  max-width: 560px;
  line-height: 1.5;
  @media (max-width: 600px) {
    font-size: 0.8125rem;
  }
`;

const BoardSelectWrap = styled.div`
  margin-bottom: 24px;
`;
const BoardSelectLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${p => p.theme.colors.text};
  margin-bottom: 8px;
`;
const FunnelNameDisplay = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${p => p.theme.colors.text};
  padding: 4px 0;
`;
const BoardSelect = styled.select`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  font-size: 0.9375rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  background: ${p => p.theme.colors.cardBackground};
  color: ${p => p.theme.colors.text};
  cursor: pointer;
`;

const LoadMoreBoardsBtn = styled.button`
  margin-top: 8px;
  padding: 8px 14px;
  font-size: 0.8125rem;
  color: ${p => p.theme.colors.primary};
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${p => p.theme.colors.hover};
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;
const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
`;
const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${p => p.theme.colors.textSecondary};
  pointer-events: none;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 44px;
  font-size: 0.875rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 10px;
  background: ${p => p.theme.colors.cardBackground};
  color: ${p => p.theme.colors.text};
  &::placeholder {
    color: ${p => p.theme.colors.textSecondary};
  }
`;

const Card = styled.div`
  background: ${p => p.theme.colors.cardBackground};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const TableWrap = styled.div`
  overflow-x: auto;
  @media (max-width: 900px) {
    overflow-x: visible;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${p => p.theme.colors.border};
  }
  th {
    font-weight: 600;
    font-size: 0.75rem;
    color: ${p => p.theme.colors.textSecondary};
    background: ${p => p.theme.colors.backgroundSecondary};
    white-space: nowrap;
  }
  tbody tr:hover td {
    background: ${p => p.theme.colors.hover}18;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  @media (max-width: 900px) {
    display: none;
  }
`;

const ToggleCell = styled.td`
  width: 1%;
  white-space: nowrap;
  vertical-align: middle;
  text-align: center;
`;
const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  input {
    width: 18px;
    height: 18px;
    accent-color: ${p => p.theme.colors.primary};
    cursor: pointer;
  }
`;

const UserCell = styled.td`
  vertical-align: middle;
`;
const UserName = styled.div`
  font-weight: 500;
  color: ${p => p.theme.colors.text};
`;
const UserEmail = styled.div`
  font-size: 0.75rem;
  color: ${p => p.theme.colors.textSecondary};
  margin-top: 2px;
`;

const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  background: ${p => p.theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const RemoveOverrideBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 0.75rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${p => p.theme.colors.textSecondary};
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    border-color: ${p => p.theme.colors.error || '#dc2626'};
    color: ${p => p.theme.colors.error || '#dc2626'};
  }
`;

const PaginationWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${p => p.theme.colors.border};
  background: ${p => p.theme.colors.backgroundSecondary};
`;
const PaginationInfo = styled.span`
  font-size: 0.8125rem;
  color: ${p => p.theme.colors.textSecondary};
`;
const PaginationBtns = styled.div`
  display: flex;
  gap: 8px;
`;
const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  font-size: 0.8125rem;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 8px;
  background: ${p => (p.$active ? p.theme.colors.primary : p.theme.colors.cardBackground)};
  color: ${p => (p.$active ? 'white' : p.theme.colors.text)};
  cursor: pointer;
  &:hover:not(:disabled) {
    border-color: ${p => p.theme.colors.primary};
    background: ${p => (p.$active ? p.theme.colors.primary : p.theme.colors.hover)};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${p => p.theme.colors.textSecondary};
  padding: 48px 24px;
  font-size: 0.9375rem;
`;

const HintBox = styled.div`
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 12px;
  background: ${p => p.theme.colors.backgroundSecondary};
  border: 1px solid ${p => p.theme.colors.border};
  font-size: 0.8125rem;
  color: ${p => p.theme.colors.textSecondary};
  line-height: 1.5;
`;

/* Mobile: cards */
const MobileList = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: block;
    padding: 16px;
  }
`;
const UserCard = styled.div`
  padding: 16px;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 12px;
  background: ${p => p.theme.colors.cardBackground};
`;
const UserCardHeader = styled.div`
  margin-bottom: 12px;
`;
const PermRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  font-size: 0.8125rem;
  &:last-of-type {
    border-bottom: none;
  }
`;
const PermLabel = styled.span`
  color: ${p => p.theme.colors.text};
`;
const UserCardActions = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${p => p.theme.colors.border};
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GlobalBadge = styled.span`
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: ${p => p.theme.colors.backgroundSecondary};
  color: ${p => p.theme.colors.textSecondary};
`;

export const KanbanPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { canManageUsers } = useKanbanPermissions();
  const fromBoard = Boolean((location.state as any)?.fromBoard && (location.state as any)?.teamId);
  const initialTeamId = (location.state as any)?.teamId as string | undefined;
  const lockFunnel = fromBoard && Boolean(initialTeamId);

  const [boards, setBoards] = useState<Array<{ teamId: string; team: { id: string; name: string; color: string } }>>([]);
  const [boardsPage, setBoardsPage] = useState(1);
  const [boardsTotalPages, setBoardsTotalPages] = useState(1);
  const [loadingMoreBoards, setLoadingMoreBoards] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(lockFunnel ? (initialTeamId ?? '') : '');
  const [members, setMembers] = useState<DisplayMember[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [boardPermissions, setBoardPermissions] = useState<BoardPermissionItem[]>([]);
  const [localOverrides, setLocalOverrides] = useState<Record<string, BoardPermissionPayload>>({});
  const [loading, setLoading] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  /** Quando aberto pelo board: lista completa de membros do funil (para paginar no front). */
  const [teamMembersFull, setTeamMembersFull] = useState<DisplayMember[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (searchDebounced.trim()) setPage(1);
  }, [searchDebounced]);

  const loadBoards = useCallback(async () => {
    try {
      const res = await kanbanApi.getMyBoards({ page: 1, limit: BOARD_PAGE_SIZE });
      const list = res.data ?? [];
      if (lockFunnel && initialTeamId && !list.some((b: { teamId: string }) => b.teamId === initialTeamId)) {
        setBoards([{ teamId: initialTeamId, team: { id: initialTeamId, name: 'Funil atual', color: '#6366f1' } }, ...list]);
      } else {
        setBoards(list);
      }
      setBoardsPage(1);
      setBoardsTotalPages(res.totalPages ?? 1);
    } catch (e) {
      console.error(e);
      showError('Erro ao carregar funis.');
    } finally {
      setLoading(false);
    }
  }, [lockFunnel, initialTeamId]);

  const loadMoreBoards = useCallback(async () => {
    if (boardsPage >= boardsTotalPages || loadingMoreBoards) return;
    setLoadingMoreBoards(true);
    try {
      const res = await kanbanApi.getMyBoards({ page: boardsPage + 1, limit: BOARD_PAGE_SIZE });
      const list = res.data ?? [];
      setBoards(prev => [...prev, ...list]);
      setBoardsPage(prev => prev + 1);
    } catch (e) {
      console.error(e);
      showError('Erro ao carregar mais funis.');
    } finally {
      setLoadingMoreBoards(false);
    }
  }, [boardsPage, boardsTotalPages, loadingMoreBoards]);

  useEffect(() => {
    if (!canManageUsers) {
      setLoading(false);
      return;
    }
    loadBoards();
  }, [canManageUsers, loadBoards]);

  useEffect(() => {
    if (lockFunnel && initialTeamId) {
      setSelectedTeamId(initialTeamId);
    }
  }, [lockFunnel, initialTeamId]);

  const loadBoardPermissions = useCallback(async (teamId: string) => {
    setLoadingBoard(true);
    try {
      const list = await kanbanApi.getBoardPermissionsByTeam(teamId);
      setBoardPermissions(list);
      const overrides: Record<string, BoardPermissionPayload> = {};
      list.forEach(p => {
        overrides[p.userId] = {
          canView: p.canView,
          canMoveCards: p.canMoveCards,
          canDeleteCards: p.canDeleteCards,
          canCreateCards: p.canCreateCards,
          canEditCards: p.canEditCards,
        };
      });
      setLocalOverrides(overrides);
    } catch (e) {
      console.error(e);
      showError('Erro ao carregar permissões do funil.');
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTeamId) {
      loadBoardPermissions(selectedTeamId);
    } else {
      setBoardPermissions([]);
      setLocalOverrides({});
    }
  }, [selectedTeamId, loadBoardPermissions]);

  /** Carrega membros do funil (quando aberto pela tela do Kanban). */
  const loadTeamMembers = useCallback(async (teamId: string) => {
    setLoadingBoard(true);
    try {
      const raw = await teamApi.getTeamMembers(teamId);
      const list: DisplayMember[] = raw.map(tm => ({
        id: (tm as any).user?.id ?? (tm as any).userId ?? tm.id,
        name: (tm as any).user?.name ?? '',
        email: (tm as any).user?.email ?? '',
      })).filter(m => m.id);
      setTeamMembersFull(list);
    } catch (e) {
      console.error(e);
      showError('Erro ao carregar usuários do funil.');
      setTeamMembersFull([]);
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  /** Carrega usuários da empresa paginado (quando aberto pelo drawer). */
  const loadCompanyMembers = useCallback(async () => {
    if (!selectedTeamId) return;
    setLoadingBoard(true);
    try {
      const res = await companyMembersApi.getMembers({
        page,
        limit: PAGE_SIZE,
        search: searchDebounced.trim() || undefined,
      });
      const list: DisplayMember[] = (res.data || []).map(m => ({ id: m.id, name: m.name, email: m.email }));
      setMembers(list);
      setTotalMembers(res.total ?? 0);
    } catch (e) {
      console.error(e);
      showError('Erro ao carregar usuários.');
    } finally {
      setLoadingBoard(false);
    }
  }, [selectedTeamId, page, searchDebounced]);

  const filteredTeamMembers = useMemo(() => {
    if (!searchDebounced.trim()) return teamMembersFull;
    const q = searchDebounced.trim().toLowerCase();
    return teamMembersFull.filter(m =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [teamMembersFull, searchDebounced]);

  const paginatedTeamMembers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTeamMembers.slice(start, start + PAGE_SIZE);
  }, [filteredTeamMembers, page]);

  useEffect(() => {
    if (!selectedTeamId) {
      setMembers([]);
      setTotalMembers(0);
      return;
    }
    if (lockFunnel) {
      loadTeamMembers(selectedTeamId);
    }
  }, [selectedTeamId, lockFunnel, loadTeamMembers]);

  useEffect(() => {
    if (!selectedTeamId) return;
    if (lockFunnel) {
      setMembers(paginatedTeamMembers);
      setTotalMembers(filteredTeamMembers.length);
    } else {
      loadCompanyMembers();
    }
  }, [lockFunnel, selectedTeamId, loadCompanyMembers, paginatedTeamMembers, filteredTeamMembers.length, page]);

  useEffect(() => {
    if (!loading && !canManageUsers) {
      navigate('/kanban', { replace: true });
    }
  }, [loading, canManageUsers, navigate]);

  const totalPages = Math.max(1, Math.ceil(totalMembers / PAGE_SIZE));

  const getPayloadForUser = (userId: string): BoardPermissionPayload | null => {
    if (localOverrides[userId]) return localOverrides[userId];
    return null;
  };

  const setOverride = (userId: string, payload: BoardPermissionPayload) => {
    setLocalOverrides(prev => ({ ...prev, [userId]: payload }));
  };

  const toggle = (userId: string, field: keyof BoardPermissionPayload, value: boolean) => {
    const current = localOverrides[userId] ?? {
      canView: true,
      canMoveCards: false,
      canDeleteCards: false,
      canCreateCards: false,
      canEditCards: false,
    };
    setOverride(userId, { ...current, [field]: value });
  };

  const saveUser = async (userId: string, payloadOverride?: BoardPermissionPayload) => {
    if (!selectedTeamId) return;
    const payload = payloadOverride ?? localOverrides[userId];
    if (!payload) return;
    setSavingUserId(userId);
    try {
      await kanbanApi.setBoardPermission(selectedTeamId, userId, payload);
      showSuccess('Permissões salvas.');
      setLocalOverrides(prev => ({ ...prev, [userId]: payload }));
      loadBoardPermissions(selectedTeamId);
    } catch (e) {
      console.error(e);
      showError('Erro ao salvar.');
    } finally {
      setSavingUserId(null);
    }
  };

  const removeOverride = async (userId: string) => {
    if (!selectedTeamId) return;
    const perm = boardPermissions.find(p => p.userId === userId);
    if (!perm) {
      setLocalOverrides(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      return;
    }
    setSavingUserId(userId);
    try {
      await kanbanApi.deleteBoardPermission(perm.id);
      showSuccess('Personalização removida; usuário usa permissões globais.');
      setLocalOverrides(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      loadBoardPermissions(selectedTeamId);
    } catch (e) {
      console.error(e);
      showError('Erro ao remover.');
    } finally {
      setSavingUserId(null);
    }
  };

  const personalizeUser = (userId: string) => {
    setOverride(userId, {
      canView: true,
      canMoveCards: false,
      canDeleteCards: false,
      canCreateCards: false,
      canEditCards: false,
    });
  };

  if (!canManageUsers && !loading) return null;

  if (loading) {
    return (
      <Layout>
        <KanbanPermissionsShimmer />
      </Layout>
    );
  }

  if (!lockFunnel && boards.length === 0) {
    return (
      <Layout>
        <PageHeader>
          <TitleRow>
            <BackButton type="button" onClick={() => navigate('/kanban')} title="Voltar">
              <MdArrowBack size={22} />
            </BackButton>
            <PageTitle>
              <MdManageAccounts size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Permissões do Kanban
            </PageTitle>
          </TitleRow>
        </PageHeader>
        <EmptyMessage>Nenhum funil disponível para configurar.</EmptyMessage>
      </Layout>
    );
  }

  const selectedBoardName = selectedTeamId ? (boards.find(b => b.teamId === selectedTeamId)?.team.name ?? 'Funil') : '';

  return (
    <Layout>
      <PageHeader>
        <div>
          <TitleRow>
            <BackButton type="button" onClick={() => navigate('/kanban')} title="Voltar ao Kanban">
              <MdArrowBack size={22} />
            </BackButton>
            <PageTitle>
              <MdManageAccounts size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Permissões do Kanban
            </PageTitle>
          </TitleRow>
          <Description>
            {lockFunnel
              ? `Configurando permissões apenas do funil aberto. Usuários listados são os membros deste funil (${PAGE_SIZE} por página).`
              : 'Selecione um funil e configure por usuário quem pode só visualizar ou criar, mover, editar e excluir cards. Permissões do funil sobrepõem as globais.'}
          </Description>
        </div>
      </PageHeader>

      {lockFunnel ? (
        <BoardSelectWrap>
          <BoardSelectLabel>Funil</BoardSelectLabel>
          <FunnelNameDisplay>{selectedBoardName || 'Funil atual'}</FunnelNameDisplay>
        </BoardSelectWrap>
      ) : (
        <BoardSelectWrap>
          <BoardSelectLabel>Funil (quadro)</BoardSelectLabel>
          <BoardSelect
            value={selectedTeamId}
            onChange={e => {
              setSelectedTeamId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Selecione um funil (aplicação para todos)</option>
            {boards.map(b => (
              <option key={b.teamId} value={b.teamId}>
                {b.team.name}
              </option>
            ))}
          </BoardSelect>
          {!lockFunnel && boardsTotalPages > 1 && boardsPage < boardsTotalPages && (
            <LoadMoreBoardsBtn
              type="button"
              onClick={loadMoreBoards}
              disabled={loadingMoreBoards}
            >
              {loadingMoreBoards ? 'Carregando...' : `Carregar mais funis (${boardsPage}/${boardsTotalPages})`}
            </LoadMoreBoardsBtn>
          )}
        </BoardSelectWrap>
      )}

      {!selectedTeamId ? (
        <HintBox style={{ marginTop: 16 }}>
          Selecione um funil acima para configurar permissões por usuário (20 por página). A opção vazia corresponde à aplicação para todos os funis.
        </HintBox>
      ) : (
        <>
      <HintBox>
        <strong>Só visualizar:</strong> marque apenas &quot;Visualizar&quot; e deixe as demais desmarcadas — o usuário não poderá criar, mover, editar nem excluir cards nesse funil.
      </HintBox>

      <FiltersBar>
        <SearchWrap>
          <SearchIcon><MdSearch size={20} /></SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar por nome ou e-mail"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
      </FiltersBar>

      <Card>
        {loadingBoard && members.length === 0 ? (
          <EmptyMessage>Carregando usuários...</EmptyMessage>
        ) : members.length === 0 ? (
          <EmptyMessage>
            {searchDebounced ? 'Nenhum usuário encontrado para a busca.' : 'Nenhum usuário na empresa.'}
          </EmptyMessage>
        ) : (
          <>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th title="Pode ver o funil"><MdVisibility size={16} /> Vis.</th>
                    <th title="Criar cards"><MdAdd size={16} /> Criar</th>
                    <th title="Mover cards"><MdDriveFileMove size={16} /> Mover</th>
                    <th title="Editar cards"><MdEdit size={16} /> Editar</th>
                    <th title="Excluir cards"><MdDelete size={16} /> Excluir</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => {
                    const payload = getPayloadForUser(member.id);
                    const isCustom = payload !== null;
                    const perms = payload ?? {
                      canView: true,
                      canMoveCards: false,
                      canDeleteCards: false,
                      canCreateCards: false,
                      canEditCards: false,
                    };
                    return (
                      <tr key={member.id}>
                        <UserCell>
                          <UserName>{member.name}</UserName>
                          <UserEmail>{member.email}</UserEmail>
                          {!isCustom && <GlobalBadge>globais</GlobalBadge>}
                        </UserCell>
                        <ToggleCell>
                          <ToggleLabel title="Visualizar">
                            <input
                              type="checkbox"
                              checked={perms.canView}
                              onChange={e => {
                                if (!isCustom) personalizeUser(member.id);
                                toggle(member.id, 'canView', e.target.checked);
                              }}
                            />
                          </ToggleLabel>
                        </ToggleCell>
                        <ToggleCell>
                          <ToggleLabel title="Criar cards">
                            <input
                              type="checkbox"
                              checked={perms.canCreateCards}
                              onChange={e => {
                                if (!isCustom) personalizeUser(member.id);
                                toggle(member.id, 'canCreateCards', e.target.checked);
                              }}
                            />
                          </ToggleLabel>
                        </ToggleCell>
                        <ToggleCell>
                          <ToggleLabel title="Mover cards">
                            <input
                              type="checkbox"
                              checked={perms.canMoveCards}
                              onChange={e => {
                                if (!isCustom) personalizeUser(member.id);
                                toggle(member.id, 'canMoveCards', e.target.checked);
                              }}
                            />
                          </ToggleLabel>
                        </ToggleCell>
                        <ToggleCell>
                          <ToggleLabel title="Editar cards">
                            <input
                              type="checkbox"
                              checked={perms.canEditCards}
                              onChange={e => {
                                if (!isCustom) personalizeUser(member.id);
                                toggle(member.id, 'canEditCards', e.target.checked);
                              }}
                            />
                          </ToggleLabel>
                        </ToggleCell>
                        <ToggleCell>
                          <ToggleLabel title="Excluir cards">
                            <input
                              type="checkbox"
                              checked={perms.canDeleteCards}
                              onChange={e => {
                                if (!isCustom) personalizeUser(member.id);
                                toggle(member.id, 'canDeleteCards', e.target.checked);
                              }}
                            />
                          </ToggleLabel>
                        </ToggleCell>
                        <td>
                          {isCustom ? (
                            <>
                              <SaveBtn
                                type="button"
                                disabled={savingUserId === member.id}
                                onClick={() => saveUser(member.id)}
                              >
                                <MdSave size={16} />
                                {savingUserId === member.id ? 'Salvando...' : 'Salvar'}
                              </SaveBtn>
                              <RemoveOverrideBtn
                                type="button"
                                onClick={() => removeOverride(member.id)}
                                disabled={savingUserId === member.id}
                                title="Remover personalização (usa globais)"
                              >
                                <MdClear size={14} /> Remover
                              </RemoveOverrideBtn>
                            </>
                          ) : (
                            <SaveBtn
                              type="button"
                              disabled={savingUserId === member.id}
                              onClick={() => saveUser(member.id, perms)}
                            >
                              <MdSave size={16} />
                              {savingUserId === member.id ? 'Salvando...' : 'Salvar'}
                            </SaveBtn>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrap>

            <MobileList>
              {members.map(member => {
                const payload = getPayloadForUser(member.id);
                const isCustom = payload !== null;
                const perms = payload ?? {
                  canView: true,
                  canMoveCards: false,
                  canDeleteCards: false,
                  canCreateCards: false,
                  canEditCards: false,
                };
                return (
                  <UserCard key={member.id}>
                    <UserCardHeader>
                      <UserName>{member.name}</UserName>
                      <UserEmail>{member.email}</UserEmail>
                      {!isCustom && <GlobalBadge>globais</GlobalBadge>}
                    </UserCardHeader>
                    <PermRow>
                      <PermLabel>Visualizar</PermLabel>
                      <input
                        type="checkbox"
                        checked={perms.canView}
                        onChange={e => {
                          if (!isCustom) personalizeUser(member.id);
                          toggle(member.id, 'canView', e.target.checked);
                        }}
                      />
                    </PermRow>
                    <PermRow>
                      <PermLabel>Criar cards</PermLabel>
                      <input
                        type="checkbox"
                        checked={perms.canCreateCards}
                        onChange={e => {
                          if (!isCustom) personalizeUser(member.id);
                          toggle(member.id, 'canCreateCards', e.target.checked);
                        }}
                      />
                    </PermRow>
                    <PermRow>
                      <PermLabel>Mover cards</PermLabel>
                      <input
                        type="checkbox"
                        checked={perms.canMoveCards}
                        onChange={e => {
                          if (!isCustom) personalizeUser(member.id);
                          toggle(member.id, 'canMoveCards', e.target.checked);
                        }}
                      />
                    </PermRow>
                    <PermRow>
                      <PermLabel>Editar cards</PermLabel>
                      <input
                        type="checkbox"
                        checked={perms.canEditCards}
                        onChange={e => {
                          if (!isCustom) personalizeUser(member.id);
                          toggle(member.id, 'canEditCards', e.target.checked);
                        }}
                      />
                    </PermRow>
                    <PermRow>
                      <PermLabel>Excluir cards</PermLabel>
                      <input
                        type="checkbox"
                        checked={perms.canDeleteCards}
                        onChange={e => {
                          if (!isCustom) personalizeUser(member.id);
                          toggle(member.id, 'canDeleteCards', e.target.checked);
                        }}
                      />
                    </PermRow>
                    <UserCardActions>
                      {isCustom ? (
                        <>
                          <SaveBtn
                            type="button"
                            disabled={savingUserId === member.id}
                            onClick={() => saveUser(member.id)}
                          >
                            <MdSave size={16} /> Salvar
                          </SaveBtn>
                          <RemoveOverrideBtn
                            type="button"
                            onClick={() => removeOverride(member.id)}
                            disabled={savingUserId === member.id}
                          >
                            <MdClear size={14} /> Remover
                          </RemoveOverrideBtn>
                        </>
                      ) : (
                        <SaveBtn
                          type="button"
                          disabled={savingUserId === member.id}
                          onClick={() => saveUser(member.id, perms)}
                        >
                          <MdSave size={16} />
                          {savingUserId === member.id ? 'Salvando...' : 'Salvar'}
                        </SaveBtn>
                      )}
                    </UserCardActions>
                  </UserCard>
                );
              })}
            </MobileList>
          </>
        )}

        {members.length > 0 && (
          <PaginationWrap>
            <PaginationInfo>
              {totalMembers} usuário(s) · página {page} de {totalPages}
            </PaginationInfo>
            <PaginationBtns>
              <PageBtn
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Anterior
              </PageBtn>
              <PageBtn
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Próxima
              </PageBtn>
            </PaginationBtns>
          </PaginationWrap>
        )}
      </Card>
        </>
      )}
    </Layout>
  );
};
