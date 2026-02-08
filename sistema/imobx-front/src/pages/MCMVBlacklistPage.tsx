/**
 * Página de Blacklist MCMV
 * Gerenciamento de bloqueios de CPF, email e telefone
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdSearch,
  MdFilterList,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { mcmvApi } from '../services/mcmvApi';
import type { BlacklistEntry, BlacklistFilters } from '../types/mcmv';
import { Layout } from '../components/layout/Layout';
import { formatPhoneDisplay, maskCPF } from '../utils/masks';
import { PermissionButton } from '../components/common/PermissionButton';
import { MCMVBlacklistFiltersDrawer } from '../components/mcmv/MCMVBlacklistFiltersDrawer';
import { MCMVBlacklistShimmer } from '../components/shimmer/MCMVBlacklistShimmer';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  AddButton,
  FilterButton,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  Badge,
  ActionsCell,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  CheckboxLabel,
  ModalActions,
  Button,
} from '../styles/pages/MCMVBlacklistPageStyles';

export default function MCMVBlacklistPage() {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BlacklistFilters>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await mcmvApi.listBlacklist(filters);
      setEntries(response);
    } catch (error: any) {
      console.error('Erro ao carregar blacklist:', error);
      toast.error(
        error.response?.data?.message || 'Erro ao carregar blacklist'
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Tem certeza que deseja remover esta entrada da blacklist?'
      )
    ) {
      return;
    }

    try {
      await mcmvApi.removeFromBlacklist(id);
      toast.success('Entrada removida da blacklist com sucesso!');
      fetchEntries();
    } catch (error: any) {
      console.error('Erro ao remover da blacklist:', error);
      toast.error(
        error.response?.data?.message || 'Erro ao remover da blacklist'
      );
    }
  };

  const handleAdd = async (data: {
    cpf?: string;
    email?: string;
    phone?: string;
    reason: string;
    isPermanent: boolean;
    expiresAt?: string;
  }) => {
    try {
      await mcmvApi.addToBlacklist(data);
      toast.success('Entrada adicionada à blacklist com sucesso!');
      setShowAddModal(false);
      fetchEntries();
    } catch (error: any) {
      console.error('Erro ao adicionar à blacklist:', error);
      toast.error(
        error.response?.data?.message || 'Erro ao adicionar à blacklist'
      );
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Blacklist MCMV</PageTitle>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            <FilterButton onClick={() => setFiltersOpen(true)}>
              <MdFilterList size={20} />
              {!isMobile && <span>Filtros</span>}
            </FilterButton>
            <PermissionButton
              permission='mcmv:blacklist:manage'
              variant='primary'
              onClick={() => setShowAddModal(true)}
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <MdAdd size={20} />
              {!isMobile && <span>Adicionar à Blacklist</span>}
            </PermissionButton>
          </div>
        </PageHeader>

        {loading ? (
          <MCMVBlacklistShimmer />
        ) : entries.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🚫</EmptyIcon>
            <EmptyTitle>Nenhuma entrada na blacklist</EmptyTitle>
            <EmptyText>
              Quando houver entradas bloqueadas, elas aparecerão aqui
            </EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>CPF</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Telefone</TableHeaderCell>
                <TableHeaderCell>Motivo</TableHeaderCell>
                <TableHeaderCell>Tipo</TableHeaderCell>
                <TableHeaderCell>Expira em</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {entries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell data-label='CPF'>
                    {entry.cpf ? maskCPF(entry.cpf) : '-'}
                  </TableCell>
                  <TableCell data-label='Email'>{entry.email || '-'}</TableCell>
                  <TableCell data-label='Telefone'>
                    {entry.phone ? formatPhoneDisplay(entry.phone) : '-'}
                  </TableCell>
                  <TableCell data-label='Motivo'>{entry.reason}</TableCell>
                  <TableCell data-label='Tipo'>
                    <Badge $permanent={entry.isPermanent}>
                      {entry.isPermanent ? 'Permanente' : 'Temporário'}
                    </Badge>
                  </TableCell>
                  <TableCell data-label='Expira em'>
                    {entry.expiresAt
                      ? new Date(entry.expiresAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </TableCell>
                  <ActionsCell>
                    <PermissionButton
                      permission='mcmv:blacklist:manage'
                      variant='danger'
                      onClick={() => handleDelete(entry.id)}
                    >
                      <MdDelete size={16} />
                      Remover
                    </PermissionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}

        {showAddModal && (
          <AddBlacklistModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAdd}
          />
        )}
      </PageContainer>

      <MCMVBlacklistFiltersDrawer
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onChange={newFilters => {
          setFilters(newFilters);
        }}
      />
    </Layout>
  );
}

// Modal simples para adicionar à blacklist
const AddBlacklistModal: React.FC<{
  onClose: () => void;
  onAdd: (data: {
    cpf?: string;
    email?: string;
    phone?: string;
    reason: string;
    isPermanent: boolean;
    expiresAt?: string;
  }) => void;
}> = ({ onClose, onAdd }) => {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf && !email && !phone) {
      toast.error('É necessário fornecer pelo menos um CPF, email ou telefone');
      return;
    }
    if (!reason) {
      toast.error('É necessário fornecer um motivo');
      return;
    }
    onAdd({
      cpf: cpf || undefined,
      email: email || undefined,
      phone: phone || undefined,
      reason,
      isPermanent,
      expiresAt: isPermanent ? undefined : expiresAt || undefined,
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>Adicionar à Blacklist</ModalTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>CPF (opcional)</Label>
            <Input
              type='text'
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              placeholder='000.000.000-00'
            />
          </FormGroup>
          <FormGroup>
            <Label>Email (opcional)</Label>
            <Input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='email@example.com'
            />
          </FormGroup>
          <FormGroup>
            <Label>Telefone (opcional)</Label>
            <Input
              type='text'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder='(00) 00000-0000'
            />
          </FormGroup>
          <FormGroup>
            <Label>Motivo *</Label>
            <TextArea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder='Descreva o motivo do bloqueio...'
              required
            />
          </FormGroup>
          <FormGroup>
            <CheckboxLabel>
              <input
                type='checkbox'
                checked={isPermanent}
                onChange={e => setIsPermanent(e.target.checked)}
              />
              <span>Bloqueio permanente</span>
            </CheckboxLabel>
          </FormGroup>
          {!isPermanent && (
            <FormGroup>
              <Label>Data de expiração</Label>
              <Input
                type='date'
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
              />
            </FormGroup>
          )}
          <ModalActions>
            <Button type='button' onClick={onClose}>
              Cancelar
            </Button>
            <Button type='submit' $variant='primary'>
              Adicionar
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};
