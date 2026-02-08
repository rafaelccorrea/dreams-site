import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { MdSearch, MdPerson, MdClear } from 'react-icons/md';
import { kanbanApi } from '../../services/kanbanApi';
import type { KanbanTaskClient } from '../../types/kanban';
import {
  translateClientType,
  translateClientStatus,
} from '../../utils/translations';

interface ClientSelectProps {
  projectId: string;
  value?: string | null;
  client?: KanbanTaskClient | null;
  onChange?: (clientId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{
  $hasValue: boolean;
  $isOpen: boolean;
  $hasError?: boolean;
}>`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  opacity: ${props => (props.disabled ? 0.6 : 1)};

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 4px
      ${props =>
        props.$hasError
          ? props.theme.colors.error + '15'
          : props.theme.colors.primary + '15'};
  }

  ${props =>
    props.$isOpen &&
    `
    border-color: ${props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props.theme.colors.primary + '15'};
  `}
`;

const SelectButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const SelectButtonText = styled.span<{ $hasValue: boolean }>`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props =>
    props.$hasValue
      ? props.theme.colors.text
      : props.theme.colors.textSecondary};
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-height: 300px;
  overflow: hidden;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const OptionsList = styled.div`
  overflow-y: auto;
  max-height: 240px;
`;

const Option = styled.div<{ $isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props =>
    props.$isSelected ? props.theme.colors.primary + '15' : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.primary + '10'};
  }
`;

const OptionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OptionName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const OptionDetails = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const LoadingState = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

export const ClientSelect: React.FC<ClientSelectProps> = ({
  projectId,
  value,
  client,
  onChange,
  disabled = false,
  placeholder = 'Selecione um cliente',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<KanbanTaskClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Log quando props mudam
  useEffect(() => {
    console.log('🔵 [ClientSelect] Props atualizadas', {
      value,
      clientId: client?.id,
      clientName: client?.name,
      hasClient: !!client,
      clientsCount: clients.length,
    });
  }, [value, client, clients.length]);

  // Sincronizar clientes quando o valor mudar (para mostrar dados atualizados)
  // Só buscar se não temos o cliente completo passado como prop
  useEffect(() => {
    if (value && projectId && !client) {
      const clientExists = clients.find(c => c.id === value);
      if (!clientExists) {
        // Se o cliente não está na lista mas temos um valor, recarregar
        const fetchClients = async () => {
          try {
            const data = await kanbanApi.getProjectClients(projectId);
            setClients(data);
          } catch (error) {
            console.error('Erro ao buscar clientes:', error);
          }
        };
        fetchClients();
      }
    }
  }, [value, projectId, client]);

  // Buscar clientes
  useEffect(() => {
    if (!projectId || !isOpen) return;

    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await kanbanApi.getProjectClients(
          projectId,
          searchTerm || undefined
        );
        setClients(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchClients, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [projectId, searchTerm, isOpen]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Usar o cliente passado como prop se disponível, senão buscar na lista
  // Usar useMemo para garantir que seja recalculado quando client ou value mudarem
  const selectedClient = useMemo(() => {
    console.log('🔍 [ClientSelect] Calculando selectedClient', {
      value,
      clientId: client?.id,
      clientName: client?.name,
      hasClient: !!client,
      clientsCount: clients.length,
    });

    // Prioridade 1: Se temos o cliente como prop e ele corresponde ao value, usar ele
    if (client && value && client.id === value) {
      console.log(
        '✅ [ClientSelect] Usando client da prop (corresponde ao value)'
      );
      return client;
    }
    // Prioridade 2: Se temos client como prop mas não corresponde ao value, ainda usar se o value não está definido (atualização em progresso)
    if (client && !value) {
      console.log('✅ [ClientSelect] Usando client da prop (sem value)');
      return client;
    }
    // Prioridade 3: Se temos value, buscar na lista
    if (value) {
      const foundInList = clients.find(c => c.id === value);
      if (foundInList) {
        console.log('✅ [ClientSelect] Cliente encontrado na lista');
        return foundInList;
      }
      // Se temos value mas não encontramos na lista e não temos client como prop,
      // retornar um objeto temporário com apenas o ID para mostrar que há um valor selecionado
      // Isso evita que o componente fique "piscando" enquanto os dados são carregados
      if (!client) {
        console.log(
          '⏳ [ClientSelect] Cliente não encontrado, usando placeholder "Carregando..."'
        );
        return { id: value, name: 'Carregando...' } as KanbanTaskClient;
      }
    }
    console.log('❌ [ClientSelect] Nenhum cliente selecionado');
    return null;
  }, [client, value, clients]);

  const handleSelect = (clientId: string) => {
    console.log('🟢 [ClientSelect] Cliente selecionado:', clientId);
    onChange?.(clientId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔴 [ClientSelect] Cliente removido (clear)');
    onChange?.(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton
        type='button'
        $hasValue={!!value}
        $isOpen={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <SelectButtonContent>
          {selectedClient ? (
            <>
              <MdPerson
                size={20}
                color={selectedClient ? undefined : 'currentColor'}
              />
              <SelectButtonText $hasValue={true}>
                {(() => {
                  console.log(
                    '📝 [ClientSelect] Renderizando cliente selecionado:',
                    {
                      name: selectedClient.name,
                      id: selectedClient.id,
                      isPlaceholder: selectedClient.name === 'Carregando...',
                    }
                  );
                  return selectedClient.name;
                })()}
                {selectedClient.email && ` - ${selectedClient.email}`}
                {selectedClient.phone && ` - ${selectedClient.phone}`}
                {selectedClient.city && ` (${selectedClient.city})`}
              </SelectButtonText>
            </>
          ) : (
            <SelectButtonText $hasValue={false}>
              {(() => {
                console.log('📝 [ClientSelect] Renderizando placeholder');
                return placeholder;
              })()}
            </SelectButtonText>
          )}
        </SelectButtonContent>
        {value && !disabled && (
          <ClearButton onClick={handleClear} type='button'>
            <MdClear size={18} />
          </ClearButton>
        )}
      </SelectButton>

      <Dropdown $isOpen={isOpen}>
        <SearchInput
          type='text'
          placeholder='Buscar cliente...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onClick={e => e.stopPropagation()}
        />
        <OptionsList>
          {loading ? (
            <LoadingState>Carregando clientes...</LoadingState>
          ) : clients.length === 0 ? (
            <EmptyState>
              {searchTerm
                ? 'Nenhum cliente encontrado'
                : 'Nenhum cliente disponível'}
            </EmptyState>
          ) : (
            clients.map(client => (
              <Option
                key={client.id}
                $isSelected={client.id === value}
                onClick={() => handleSelect(client.id)}
              >
                <MdPerson size={20} />
                <OptionInfo>
                  <OptionName>{client.name}</OptionName>
                  <OptionDetails>
                    {client.email && <span>{client.email}</span>}
                    {client.phone && <span>{client.phone}</span>}
                    {client.whatsapp && client.whatsapp !== client.phone && (
                      <span>WhatsApp: {client.whatsapp}</span>
                    )}
                    {client.cpf && <span>CPF: {client.cpf}</span>}
                    {client.city && <span>{client.city}</span>}
                    {client.type && (
                      <span>Tipo: {translateClientType(client.type)}</span>
                    )}
                    {client.status && (
                      <span>
                        Status: {translateClientStatus(client.status)}
                      </span>
                    )}
                    {client.responsibleUserName && (
                      <span>Responsável: {client.responsibleUserName}</span>
                    )}
                  </OptionDetails>
                </OptionInfo>
              </Option>
            ))
          )}
        </OptionsList>
      </Dropdown>
    </SelectContainer>
  );
};
