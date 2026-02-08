import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdSwapHoriz,
  MdPerson,
  MdBusiness,
  MdSchedule,
  MdInfo,
} from 'react-icons/md';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TaskTransferHistory as TaskTransferHistoryType } from '../../types/kanban';
import { kanbanApi } from '../../services/kanbanApi';
import { showError } from '../../utils/notifications';

interface TransferHistoryProps {
  taskId: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${props => props.theme.colors.border};
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 24px;

  &::before {
    content: '';
    position: absolute;
    left: -16px;
    top: 8px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.surface};
    z-index: 1;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardTitle = styled.div`
  font-size: 0.938rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props =>
    props.$color
      ? `${props.$color}20`
      : props.theme.colors.backgroundSecondary};
  color: ${props => props.$color || props.theme.colors.text};
  border: 1px solid
    ${props => (props.$color ? `${props.$color}40` : props.theme.colors.border)};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.813rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NotesBox = styled.div`
  padding: 10px 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-size: 0.813rem;
  color: ${props => props.theme.colors.text};
  font-style: italic;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const TransferHistory: React.FC<TransferHistoryProps> = ({ taskId }) => {
  const [history, setHistory] = useState<TaskTransferHistoryType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      loadHistory();
    }
  }, [taskId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await kanbanApi.getTransferHistory(taskId);
      setHistory(data);
    } catch (error: any) {
      console.error('Erro ao carregar histórico de transferências:', error);
      showError('Erro ao carregar histórico de transferências');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>
          <MdSwapHoriz size={18} />
          Histórico de Transferências
        </Title>
        <LoadingState>Carregando histórico...</LoadingState>
      </Container>
    );
  }

  if (history.length === 0) {
    return (
      <Container>
        <Title>
          <MdSwapHoriz size={18} />
          Histórico de Transferências
        </Title>
        <EmptyState>
          <MdInfo size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
          <div>Nenhuma transferência registrada</div>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <MdSwapHoriz size={18} />
        Histórico de Transferências
      </Title>
      <Timeline>
        {history.map(transfer => (
          <TimelineItem key={transfer.id}>
            <Card>
              <CardTitle>
                <MdSwapHoriz size={16} />
                Transferido para {transfer.toProject.name}
              </CardTitle>

              <TagsContainer>
                <Tag $color='#3B82F6'>
                  <MdBusiness size={12} />
                  De: {transfer.fromProject.name}
                </Tag>
                <Tag $color='#10B981'>
                  <MdBusiness size={12} />
                  Para: {transfer.toProject.name}
                </Tag>
              </TagsContainer>

              <InfoRow>
                <MdPerson size={14} />
                <span>
                  Transferido por:{' '}
                  <strong>{transfer.transferredBy.name}</strong>
                </span>
                {transfer.assignedTo && (
                  <>
                    <span>•</span>
                    <span>
                      Responsável no destino:{' '}
                      <strong>{transfer.assignedTo.name}</strong>
                    </span>
                  </>
                )}
              </InfoRow>

              <InfoRow>
                <MdSchedule size={14} />
                <span>
                  {format(
                    new Date(transfer.transferredAt),
                    "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                    { locale: ptBR }
                  )}
                </span>
              </InfoRow>

              {transfer.notes && (
                <NotesBox>
                  <strong>Observações:</strong> {transfer.notes}
                </NotesBox>
              )}
            </Card>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
};
