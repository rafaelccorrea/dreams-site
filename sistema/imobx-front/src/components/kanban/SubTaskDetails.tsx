import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  MdCheckCircle,
  MdSchedule,
  MdPerson,
  MdPersonOff,
} from 'react-icons/md';
import { kanbanSubtasksApi } from '../../services/kanbanSubtasksApi';
import type { KanbanSubTask } from '../../types/kanban';
import { Avatar } from '../common/Avatar';

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DetailsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SubTaskTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SubTaskDescription = styled.p`
  font-size: 0.938rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const DetailsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const InfoLabel = styled.strong`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  min-width: 100px;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span<{ completed: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.813rem;
  font-weight: 500;
  background: ${props =>
    props.completed
      ? `${props.theme.colors.success}20`
      : `${props.theme.colors.warning}20`};
  color: ${props =>
    props.completed ? props.theme.colors.success : props.theme.colors.warning};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
`;

interface SubTaskDetailsProps {
  subTaskId: string;
}

export const SubTaskDetails: React.FC<SubTaskDetailsProps> = ({
  subTaskId,
}) => {
  const [subTask, setSubTask] = useState<KanbanSubTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubTask() {
      try {
        setLoading(true);
        setError(null);
        const data = await kanbanSubtasksApi.getSubTask(subTaskId);
        setSubTask(data);
      } catch (err: any) {
        console.error('Erro ao carregar subtarefa:', err);
        setError(err.message || 'Erro ao carregar subtarefa');
      } finally {
        setLoading(false);
      }
    }

    if (subTaskId) {
      loadSubTask();
    }
  }, [subTaskId]);

  if (loading) {
    return <LoadingState>Carregando detalhes da subtarefa...</LoadingState>;
  }

  if (error) {
    return <ErrorState>{error}</ErrorState>;
  }

  if (!subTask) {
    return <ErrorState>Subtarefa não encontrada</ErrorState>;
  }

  return (
    <DetailsContainer>
      <DetailsHeader>
        <SubTaskTitle>{subTask.title}</SubTaskTitle>
        {subTask.description && (
          <SubTaskDescription>{subTask.description}</SubTaskDescription>
        )}
      </DetailsHeader>

      <DetailsInfo>
        <InfoRow>
          <InfoLabel>Status:</InfoLabel>
          <InfoValue>
            <StatusBadge completed={subTask.isCompleted}>
              <MdCheckCircle size={16} />
              {subTask.isCompleted ? 'Concluída' : 'Pendente'}
            </StatusBadge>
          </InfoValue>
        </InfoRow>

        {subTask.assignedTo && (
          <InfoRow>
            <InfoLabel>Responsável:</InfoLabel>
            <InfoValue>
              <Avatar
                name={subTask.assignedTo.name}
                image={subTask.assignedTo.avatar}
                size={24}
              />
              {subTask.assignedTo.name}
            </InfoValue>
          </InfoRow>
        )}

        {!subTask.assignedTo && (
          <InfoRow>
            <InfoLabel>Responsável:</InfoLabel>
            <InfoValue>
              <MdPersonOff size={16} />
              Não atribuído
            </InfoValue>
          </InfoRow>
        )}

        {subTask.dueDate && (
          <InfoRow>
            <InfoLabel>Prazo:</InfoLabel>
            <InfoValue>
              <MdSchedule size={16} />
              {format(new Date(subTask.dueDate), "dd 'de' MMM 'de' yyyy", {
                locale: ptBR,
              })}
            </InfoValue>
          </InfoRow>
        )}

        {subTask.completedAt && (
          <InfoRow>
            <InfoLabel>Concluída em:</InfoLabel>
            <InfoValue>
              <MdSchedule size={16} />
              {format(
                new Date(subTask.completedAt),
                "dd 'de' MMM 'de' yyyy 'às' HH:mm",
                { locale: ptBR }
              )}
            </InfoValue>
          </InfoRow>
        )}

        {subTask.createdBy && (
          <InfoRow>
            <InfoLabel>Criado por:</InfoLabel>
            <InfoValue>
              <MdPerson size={16} />
              {subTask.createdBy.name}
            </InfoValue>
          </InfoRow>
        )}

        <InfoRow>
          <InfoLabel>Criado em:</InfoLabel>
          <InfoValue>
            <MdSchedule size={16} />
            {format(
              new Date(subTask.createdAt),
              "dd 'de' MMM 'de' yyyy 'às' HH:mm",
              { locale: ptBR }
            )}
          </InfoValue>
        </InfoRow>
      </DetailsInfo>
    </DetailsContainer>
  );
};
