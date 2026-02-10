import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { MdSchedule, MdPerson, MdEmail, MdPhone } from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { KanbanTask, UpdateTaskFieldsDto } from '../../types/kanban';
import { kanbanApi } from '../../services/kanbanApi';
import { showError } from '../../utils/notifications';
import {
  formatCurrency,
  getNumericValue,
  formatCurrencyValue,
} from '../../utils/masks';

// Função auxiliar para formatar valor para input (sem R$)
const formatValueForInput = (value: number): string => {
  if (!value) return '';
  // Formatar como moeda e remover o "R$ "
  return formatCurrencyValue(value).replace('R$ ', '').trim();
};

interface TaskAdditionalFieldsProps {
  task: KanbanTask;
  onUpdate?: (updatedTask: KanbanTask) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const OriginSection = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const OriginTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OriginRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  & svg {
    flex-shrink: 0;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ContactList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContactItem = styled.li`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  padding: 8px 12px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  & strong {
    color: ${props => props.theme.colors.text};
  }
`;

const FieldInput = styled.input`
  padding: 12px 16px;
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  font-family: inherit;
  width: 100%;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}15`};
    background: ${props => props.theme.colors.surface};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.border};
  }
`;

const FieldSelect = styled.select`
  padding: 12px 16px;
  border: 1.5px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => `${props.theme.colors.primary}15`};
    background-color: ${props => props.theme.colors.surface};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.border};
  }

  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    padding: 8px;
  }
`;

const qualificationOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'frio', label: 'Frio' },
  { value: 'morno', label: 'Morno' },
  { value: 'quente', label: 'Quente' },
  { value: 'fechado', label: 'Fechado' },
];

const sourceOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'Facebook Ads', label: 'Facebook Ads' },
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Indicação', label: 'Indicação' },
  { value: 'Site', label: 'Site' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'OLX', label: 'OLX' },
  { value: 'ZAP', label: 'ZAP' },
  { value: 'Outro', label: 'Outro' },
];

const campaignOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'Campanha Q1 2025', label: 'Campanha Q1 2025' },
  { value: 'Campanha Q2 2025', label: 'Campanha Q2 2025' },
  { value: 'Campanha Q3 2025', label: 'Campanha Q3 2025' },
  { value: 'Campanha Q4 2025', label: 'Campanha Q4 2025' },
  { value: 'Campanha Q1 2026', label: 'Campanha Q1 2026' },
  { value: 'Black Friday', label: 'Black Friday' },
  { value: 'Lançamento', label: 'Lançamento' },
  { value: 'Outro', label: 'Outro' },
];

const sectorOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'Residencial', label: 'Residencial' },
  { value: 'Comercial', label: 'Comercial' },
  { value: 'Rural', label: 'Rural' },
  { value: 'Terreno', label: 'Terreno' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Outro', label: 'Outro' },
];

export const TaskAdditionalFields: React.FC<TaskAdditionalFieldsProps> = ({
  task,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<UpdateTaskFieldsDto>({
    qualification: task.qualification || '',
    totalValue: task.totalValue || undefined,
    closingForecast: task.closingForecast
      ? task.closingForecast.split('T')[0]
      : '',
    source: task.source || '',
    campaign: task.campaign && task.campaign !== 'V' ? task.campaign : '',
    preService: task.preService || '',
    vgc: task.vgc || '',
    transferDate: task.transferDate ? task.transferDate.split('T')[0] : '',
    sector: task.sector || '',
  });
  const [displayValues, setDisplayValues] = useState<{
    totalValue?: string;
    vgc?: string;
  }>({
    totalValue: task.totalValue ? formatValueForInput(task.totalValue) : '',
    vgc: task.vgc
      ? typeof task.vgc === 'string'
        ? formatValueForInput(Number(task.vgc))
        : formatValueForInput(task.vgc)
      : '',
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedTaskIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Só atualizar campos se:
    // 1. É uma task diferente (navegação para outra task)
    // 2. Não estamos salvando no momento
    const isDifferentTask =
      lastSavedTaskIdRef.current === null ||
      task.id !== lastSavedTaskIdRef.current;

    if (isDifferentTask && !isSavingRef.current) {
      setFields({
        qualification: task.qualification || '',
        totalValue: task.totalValue || undefined,
        closingForecast: task.closingForecast
          ? task.closingForecast.split('T')[0]
          : '',
        source: task.source || '',
        campaign: task.campaign && task.campaign !== 'V' ? task.campaign : '',
        preService: task.preService || '',
        vgc: task.vgc || '',
        transferDate: task.transferDate ? task.transferDate.split('T')[0] : '',
        sector: task.sector || '',
      });
      setDisplayValues({
        totalValue: task.totalValue ? formatValueForInput(task.totalValue) : '',
        vgc: task.vgc
          ? typeof task.vgc === 'string'
            ? formatValueForInput(Number(task.vgc))
            : formatValueForInput(task.vgc)
          : '',
      });
      lastSavedTaskIdRef.current = task.id;
    }
  }, [task.id]); // Apenas task.id para detectar mudança de task

  const handleSave = useCallback(async () => {
    if (loading) return;

    // Salvar estado anterior para rollback
    const previousTask = { ...task };

    // Marcar que estamos salvando para evitar reset dos campos
    isSavingRef.current = true;

    // Optimistic update - atualizar imediatamente
    const dataToSave: UpdateTaskFieldsDto = {
      ...fields,
      totalValue: displayValues.totalValue
        ? getNumericValue(displayValues.totalValue)
        : undefined,
      vgc: displayValues.vgc
        ? String(getNumericValue(displayValues.vgc.replace(/[^\d,]/g, '')))
        : undefined,
      closingForecast: fields.closingForecast || undefined,
      transferDate: fields.transferDate || undefined,
    };

    const optimisticTask: KanbanTask = {
      ...task,
      ...dataToSave,
      totalValue: dataToSave.totalValue,
      vgc: dataToSave.vgc,
    };

    if (onUpdate) {
      onUpdate(optimisticTask);
    }

    // Verificar se há Company ID antes de fazer a requisição
    const hasCompanyId = !!localStorage.getItem(
      'dream_keys_selected_company_id'
    );
    if (!hasCompanyId) {
      // Se não houver Company ID (ex: durante logout), não fazer a requisição
      return;
    }

    try {
      setLoading(true);
      const updatedTask = await kanbanApi.updateTaskFields(task.id, dataToSave);
      // Atualizar a referência para evitar reset
      lastSavedTaskIdRef.current = updatedTask.id;
      // NÃO chamar onUpdate novamente - já foi atualizado otimisticamente
      // Apenas verificar se há diferenças e sincronizar se necessário (sem sobrescrever)
    } catch (error: any) {
      console.error('Erro ao atualizar campos:', error);
      // Rollback - reverter para estado anterior
      if (onUpdate) {
        onUpdate(previousTask);
      }
      // Reverter campos locais também
      setFields({
        qualification: previousTask.qualification || '',
        totalValue: previousTask.totalValue || undefined,
        closingForecast: previousTask.closingForecast
          ? previousTask.closingForecast.split('T')[0]
          : '',
        source: previousTask.source || '',
        campaign:
          previousTask.campaign && previousTask.campaign !== 'V'
            ? previousTask.campaign
            : '',
        preService: previousTask.preService || '',
        vgc: previousTask.vgc || '',
        transferDate: previousTask.transferDate
          ? previousTask.transferDate.split('T')[0]
          : '',
        sector: previousTask.sector || '',
      });
      setDisplayValues({
        totalValue: previousTask.totalValue
          ? formatValueForInput(previousTask.totalValue)
          : '',
        vgc: previousTask.vgc
          ? typeof previousTask.vgc === 'string'
            ? formatValueForInput(Number(previousTask.vgc))
            : formatValueForInput(previousTask.vgc)
          : '',
      });
      showError(error.message || 'Erro ao atualizar campos');
    } finally {
      setLoading(false);
      // Aguardar um pouco antes de permitir reset novamente
      setTimeout(() => {
        isSavingRef.current = false;
      }, 100);
    }
  }, [fields, displayValues, task, onUpdate, loading]);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 5000); // Salva após 5 segundos de inatividade
  }, [handleSave]);

  useEffect(() => {
    // Salvar ao desmontar o componente
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Verificar se há Company ID antes de tentar salvar durante o unmount
      // Isso evita erros durante logout quando o Company ID já foi removido
      const hasCompanyId = !!localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      const isAuthenticated = !!localStorage.getItem('dream_keys_access_token');

      // Salvar mudanças pendentes ao sair apenas se houver Company ID e usuário autenticado
      if (
        hasCompanyId &&
        isAuthenticated &&
        !isSavingRef.current &&
        (Object.keys(fields).length > 0 ||
          Object.keys(displayValues).length > 0)
      ) {
        handleSave();
      }
    };
  }, [handleSave, fields, displayValues]);

  // Salvar ao sair da página/aba
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Verificar se há Company ID antes de tentar salvar
      const hasCompanyId = !!localStorage.getItem(
        'dream_keys_selected_company_id'
      );
      const isAuthenticated = !!localStorage.getItem('dream_keys_access_token');

      if (
        hasCompanyId &&
        isAuthenticated &&
        !isSavingRef.current &&
        (Object.keys(fields).length > 0 ||
          Object.keys(displayValues).length > 0)
      ) {
        // Limpar timeout e salvar imediatamente
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        handleSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleSave, fields, displayValues]);

  return (
    <Container>
      <Header>
        <Title>Campos Adicionais</Title>
      </Header>

      <FieldsGrid>
        <FieldGroup>
          <FieldLabel>Qualificação</FieldLabel>
          <FieldSelect
            value={fields.qualification || ''}
            onChange={e => {
              setFields(prev => ({ ...prev, qualification: e.target.value }));
              scheduleSave();
            }}
          >
            {qualificationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FieldSelect>
        </FieldGroup>

        {/* Campo Valor Total comentado - não vamos usar por enquanto */}
        {/* <FieldGroup>
          <FieldLabel>Valor Total</FieldLabel>
          <FieldInput
            type="text"
            value={displayValues.totalValue || ''}
            onChange={e => {
              const inputValue = e.target.value;
              
              // Se estiver vazio, limpar
              if (inputValue === '') {
                setDisplayValues(prev => ({ ...prev, totalValue: '' }));
                scheduleSave();
                return;
              }
              
              // Remove tudo que não é dígito
              const rawValue = inputValue.replace(/\D/g, '');
              
              // Se não há dígitos, limpar
              if (rawValue === '') {
                setDisplayValues(prev => ({ ...prev, totalValue: '' }));
                scheduleSave();
                return;
              }

              // Formatar manualmente
              let formatted = rawValue;
              
              // Adicionar vírgula para centavos (últimos 2 dígitos)
              if (formatted.length > 2) {
                const integerPart = formatted.slice(0, -2);
                const decimalPart = formatted.slice(-2);
                formatted = integerPart + ',' + decimalPart;
              } else if (formatted.length === 2) {
                formatted = '0,' + formatted;
              } else if (formatted.length === 1) {
                formatted = '0,0' + formatted;
              }
              
              // Adicionar pontos para separar milhares apenas na parte inteira
              const parts = formatted.split(',');
              if (parts[0] && parts[0].length > 3) {
                // Remove zeros à esquerda antes de formatar
                const cleanInteger = parts[0].replace(/^0+/, '') || '0';
                parts[0] = cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                formatted = parts.join(',');
              } else if (parts[0] && parts[0].startsWith('0') && parts[0].length > 1) {
                // Remove zeros à esquerda
                parts[0] = parts[0].replace(/^0+/, '') || '0';
                formatted = parts.join(',');
              }
              
              setDisplayValues(prev => ({ ...prev, totalValue: formatted }));
              scheduleSave();
            }}
            placeholder="R$ 0,00"
            maxLength={20}
          />
        </FieldGroup> */}

        <FieldGroup>
          <FieldLabel>Previsão de Fechamento</FieldLabel>
          <FieldInput
            type='date'
            value={fields.closingForecast || ''}
            onChange={e => {
              setFields(prev => ({ ...prev, closingForecast: e.target.value }));
              scheduleSave();
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Origem na negociação</FieldLabel>
          <FieldSelect
            value={fields.source || ''}
            onChange={e => {
              setFields(prev => ({ ...prev, source: e.target.value }));
              scheduleSave();
            }}
          >
            {sourceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {fields.source &&
              !sourceOptions.some(o => o.value === fields.source) && (
                <option value={fields.source}>{fields.source}</option>
              )}
          </FieldSelect>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Campanha na negociação</FieldLabel>
          <FieldSelect
            value={
              fields.campaign && fields.campaign !== 'V' ? fields.campaign : ''
            }
            onChange={e => {
              let value = e.target.value;
              if (value === 'V' || value.trim() === 'V') value = '';
              setFields(prev => ({ ...prev, campaign: value }));
              scheduleSave();
            }}
          >
            {campaignOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {fields.campaign &&
              fields.campaign !== 'V' &&
              !campaignOptions.some(o => o.value === fields.campaign) && (
                <option value={fields.campaign}>{fields.campaign}</option>
              )}
          </FieldSelect>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>VGC (Valor Geral de Contrato)</FieldLabel>
          <FieldInput
            type='text'
            value={displayValues.vgc || ''}
            onChange={e => {
              const formatted = formatCurrency(e.target.value);
              setDisplayValues(prev => ({ ...prev, vgc: formatted }));
              scheduleSave();
            }}
            placeholder='R$ 0,00'
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Data de Transferência</FieldLabel>
          <FieldInput
            type='date'
            value={fields.transferDate || ''}
            onChange={e => {
              setFields(prev => ({ ...prev, transferDate: e.target.value }));
              scheduleSave();
            }}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Setor</FieldLabel>
          <FieldSelect
            value={fields.sector || ''}
            onChange={e => {
              setFields(prev => ({ ...prev, sector: e.target.value }));
              scheduleSave();
            }}
          >
            {sectorOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {fields.sector &&
              !sectorOptions.some(o => o.value === fields.sector) && (
                <option value={fields.sector}>{fields.sector}</option>
              )}
          </FieldSelect>
        </FieldGroup>
      </FieldsGrid>

      {(task.externalId ||
        task.lastActivityAt ||
        (task.contactSnapshot && task.contactSnapshot.length > 0)) && (
        <OriginSection>
          <OriginTitle>Dados da origem</OriginTitle>
          {task.lastActivityAt && (
            <OriginRow>
              <MdSchedule size={18} />
              <span>
                Última atividade:{' '}
                {format(
                  new Date(task.lastActivityAt),
                  "dd/MM/yyyy 'às' HH:mm",
                  { locale: ptBR }
                )}
              </span>
            </OriginRow>
          )}
          {task.contactSnapshot && task.contactSnapshot.length > 0 && (
            <>
              <OriginRow>
                <MdPerson size={18} />
                <span>Contatos ({task.contactSnapshot.length})</span>
              </OriginRow>
              <ContactList>
                {task.contactSnapshot.map((c, i) => (
                  <ContactItem key={c.id || i}>
                    {c.name && <strong>{c.name}</strong>}
                    {c.email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <MdEmail size={14} />
                        {c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <MdPhone size={14} />
                        {c.phone}
                      </span>
                    )}
                    {!c.name && !c.email && !c.phone && (
                      <span>Contato sem dados</span>
                    )}
                  </ContactItem>
                ))}
              </ContactList>
            </>
          )}
        </OriginSection>
      )}
    </Container>
  );
};
