import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdFilterList,
  MdClose,
  MdExpandMore,
  MdExpandLess,
  MdClear,
} from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import { companyMembersApi } from '../../services/companyMembersApi';
import type { WhatsAppMessagesQueryParams } from '../../types/whatsapp';

const FilterButton = styled.button<{ $isActive?: boolean }>`
  padding: 10px 16px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.$isActive ? 'white' : props.theme.colors.text)};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  @media (max-width: 480px) {
    min-height: 48px;
    padding: 10px 14px;
  }
  &:hover {
    background: ${props =>
      props.$isActive
        ? props.theme.colors.primaryDark
        : props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const FiltersContainer = styled.div`
  position: relative;
  width: 100%;
`;

const FiltersPanel = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  max-height: ${props => (props.$isOpen ? '600px' : '0')};
  overflow: hidden;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const FiltersContent = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
  @media (max-width: 480px) {
    padding: 14px 12px;
    gap: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 10px 12px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 480px) {
    min-height: 48px;
  }
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  min-height: 44px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 480px) {
    min-height: 48px;
  }
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  padding: 4px 0;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
`;

const FiltersFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 12px 16px;
  }
`;

const ClearButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error}15;
    color: ${props => props.theme.colors.error};
    border-color: ${props => props.theme.colors.error}30;
  }
`;

const ActiveFiltersBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 4px;
`;

const HelpText = styled.small`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  display: block;
`;

interface WhatsAppFiltersProps {
  filters: WhatsAppMessagesQueryParams;
  onFiltersChange: (filters: WhatsAppMessagesQueryParams) => void;
  onClearFilters: () => void;
}

export const WhatsAppFilters: React.FC<WhatsAppFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { getCurrentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<WhatsAppMessagesQueryParams>(filters);
  const [users, setUsers] = useState<
    Array<{ id: string; name: string; email: string }>
  >([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Verificar se é Admin/Master/Manager
  const user = getCurrentUser();
  const userRole = user?.role?.toLowerCase();
  const isAdminOrManager = userRole
    ? ['admin', 'manager', 'master'].includes(userRole)
    : false;

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (isAdminOrManager && isOpen) {
      loadUsers();
    }
  }, [isAdminOrManager, isOpen]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const members = await companyMembersApi.getMembersSimple();
      setUsers(
        members.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email || '',
        }))
      );
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof WhatsAppMessagesQueryParams];
    return value !== undefined && value !== null && value !== '';
  });

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof WhatsAppMessagesQueryParams];
    return value !== undefined && value !== null && value !== '';
  }).length;

  const handleFilterChange = (
    key: keyof WhatsAppMessagesQueryParams,
    value: any
  ) => {
    const newFilters = {
      ...localFilters,
      [key]: value === '' ? undefined : value,
    };
    setLocalFilters(newFilters);
    // Aplicar filtros automaticamente
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setLocalFilters(filters);
    }
  };

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-filters-container]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <FiltersContainer data-filters-container>
      <FilterButton $isActive={hasActiveFilters} onClick={handleToggle}>
        <MdFilterList size={18} />
        Filtros
        {hasActiveFilters && (
          <ActiveFiltersBadge>{activeFiltersCount}</ActiveFiltersBadge>
        )}
        {isOpen ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
      </FilterButton>

      <FiltersPanel $isOpen={isOpen}>
        <FiltersContent>
          <FormGroup>
            <Label>Direção</Label>
            <Select
              value={localFilters.direction || ''}
              onChange={e => handleFilterChange('direction', e.target.value)}
            >
              <option value=''>Todas</option>
              <option value='inbound'>Recebidas</option>
              <option value='outbound'>Enviadas</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Status</Label>
            <Select
              value={localFilters.status || ''}
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <option value=''>Todos</option>
              <option value='sent'>Enviada</option>
              <option value='delivered'>Entregue</option>
              <option value='read'>Lida</option>
              <option value='failed'>Falhou</option>
              <option value='pending'>Pendente</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Tipo de Mensagem</Label>
            <Select
              value={localFilters.messageType || ''}
              onChange={e => handleFilterChange('messageType', e.target.value)}
            >
              <option value=''>Todos</option>
              <option value='text'>Texto</option>
              <option value='image'>Imagem</option>
              <option value='video'>Vídeo</option>
              <option value='audio'>Áudio</option>
              <option value='document'>Documento</option>
              <option value='location'>Localização</option>
              <option value='contact'>Contato</option>
              <option value='sticker'>Sticker</option>
              <option value='voice'>Voz</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Data Inicial</Label>
            <Input
              type='date'
              value={localFilters.startDate || ''}
              onChange={e => handleFilterChange('startDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Data Final</Label>
            <Input
              type='date'
              value={localFilters.endDate || ''}
              onChange={e => handleFilterChange('endDate', e.target.value)}
            />
          </FormGroup>

          <FormGroup style={{ gridColumn: '1 / -1' }}>
            <Label>Opções</Label>
            <CheckboxGroup>
              <CheckboxLabel>
                <Checkbox
                  type='checkbox'
                  checked={localFilters.unreadOnly || false}
                  onChange={e =>
                    handleFilterChange('unreadOnly', e.target.checked)
                  }
                />
                Apenas não lidas
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type='checkbox'
                  checked={localFilters.hasTask === true}
                  onChange={e =>
                    handleFilterChange(
                      'hasTask',
                      e.target.checked ? true : undefined
                    )
                  }
                />
                Com tarefa vinculada
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type='checkbox'
                  checked={localFilters.hasTask === false}
                  onChange={e =>
                    handleFilterChange(
                      'hasTask',
                      e.target.checked ? false : undefined
                    )
                  }
                />
                Sem tarefa vinculada
              </CheckboxLabel>
            </CheckboxGroup>
          </FormGroup>

          {/* Filtros apenas para Admin/Master/Manager */}
          {isAdminOrManager && (
            <>
              <FormGroup>
                <Label>Filtrar por SDR</Label>
                <Select
                  value={localFilters.assignedToId || ''}
                  onChange={e =>
                    handleFilterChange('assignedToId', e.target.value)
                  }
                  disabled={loadingUsers}
                >
                  <option value=''>Todos os SDRs</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Select>
                <HelpText>
                  Filtre mensagens atribuídas a um SDR específico
                </HelpText>
              </FormGroup>

              <FormGroup>
                <Label>Status de Tempo</Label>
                <Select
                  value={localFilters.timeStatus || ''}
                  onChange={e =>
                    handleFilterChange('timeStatus', e.target.value)
                  }
                >
                  <option value=''>Todos</option>
                  <option value='on_time'>Em Dia</option>
                  <option value='delayed'>Atrasadas</option>
                  <option value='critical'>Críticas</option>
                </Select>
                <HelpText>Filtre por tempo de resposta</HelpText>
              </FormGroup>
            </>
          )}
        </FiltersContent>

        {hasActiveFilters && (
          <FiltersFooter>
            <ClearButton onClick={handleClear}>
              <MdClear size={16} />
              Limpar Filtros
            </ClearButton>
            <div style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
              {activeFiltersCount}{' '}
              {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </div>
          </FiltersFooter>
        )}
      </FiltersPanel>
    </FiltersContainer>
  );
};
