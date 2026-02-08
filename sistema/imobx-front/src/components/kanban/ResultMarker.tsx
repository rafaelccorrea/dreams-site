import React, { useState } from 'react';
import styled from 'styled-components';
import { MdCheckCircle, MdCancel, MdEdit, MdClose } from 'react-icons/md';
import type { KanbanTask, LossReason } from '../../types/kanban';
import { LossReasonLabels } from '../../types/kanban';
import { kanbanApi } from '../../services/kanbanApi';
import { showError, showSuccess } from '../../utils/notifications';

interface ResultMarkerProps {
  task: KanbanTask;
  onUpdate?: (updatedTask: KanbanTask) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ResultBadge = styled.div<{ $result: 'won' | 'lost' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props =>
    props.$result === 'won'
      ? `${props.theme.colors.success}20`
      : `${props.theme.colors.error}20`};
  border: 2px solid
    ${props =>
      props.$result === 'won'
        ? props.theme.colors.success
        : props.theme.colors.error};
  border-radius: 8px;
  color: ${props =>
    props.$result === 'won'
      ? props.theme.colors.success
      : props.theme.colors.error};
  font-weight: 600;
  font-size: 0.875rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant: 'won' | 'lost' | 'edit' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid
    ${props => {
      switch (props.$variant) {
        case 'won':
          return props.theme.colors.success;
        case 'lost':
          return props.theme.colors.error;
        case 'edit':
          return props.theme.colors.border;
        default:
          return props.theme.colors.border;
      }
    }};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => {
    switch (props.$variant) {
      case 'won':
        return props.theme.colors.success;
      case 'lost':
        return props.theme.colors.error;
      case 'edit':
        return 'transparent';
      default:
        return 'transparent';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'won':
      case 'lost':
        return '#fff';
      case 'edit':
        return props.theme.colors.text;
      default:
        return props.theme.colors.text;
    }
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${props => {
        switch (props.$variant) {
          case 'won':
            return `${props.theme.colors.success}40`;
          case 'lost':
            return `${props.theme.colors.error}40`;
          case 'edit':
            return `${props.theme.colors.border}40`;
          default:
            return 'rgba(0, 0, 0, 0.1)';
        }
      }};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NotesLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const NotesTextarea = styled.textarea`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};

  .required {
    color: ${props => props.theme.colors.error};
    margin-left: 4px;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
  margin-top: -4px;
`;

const NotesDisplay = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  line-height: 1.5;
`;

const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ResultMarker: React.FC<ResultMarkerProps> = ({
  task,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(task.resultNotes || '');
  const [lossReason, setLossReason] = useState<LossReason | ''>(
    task.lossReason || ''
  );
  const [error, setError] = useState('');
  const [selectedResult, setSelectedResult] = useState<'won' | 'lost' | null>(
    null
  );

  const handleMarkResult = async (result: 'won' | 'lost') => {
    // Validação: se for perda, lossReason é obrigatório
    if (result === 'lost' && !lossReason) {
      setError('Por favor, selecione um motivo de perda');
      return;
    }

    setError('');

    try {
      setLoading(true);
      const updatedTask = await kanbanApi.markTaskResult(task.id, {
        result,
        lossReason: result === 'lost' ? (lossReason as LossReason) : undefined,
        notes: notes.trim() || undefined,
      });
      onUpdate?.(updatedTask);
      setIsEditing(false);
      showSuccess(
        `Tarefa marcada como ${result === 'won' ? 'vendida' : 'perdida'}!`
      );
    } catch (error: any) {
      console.error('Erro ao marcar resultado:', error);
      const errorMessage = error.message || '';
      if (
        errorMessage.includes('lossReason') ||
        errorMessage.includes('obrigatório')
      ) {
        setError('Por favor, selecione um motivo de perda');
      } else {
        showError(errorMessage || 'Erro ao marcar resultado');
      }
    } finally {
      setLoading(false);
    }
  };

  if (task.result) {
    return (
      <Container>
        <Title>Resultado</Title>
        <ResultBadge $result={task.result}>
          {task.result === 'won' ? (
            <>
              <MdCheckCircle size={20} />
              Vendido
            </>
          ) : (
            <>
              <MdCancel size={20} />
              Perdido
            </>
          )}
        </ResultBadge>
        {task.resultDate && (
          <ResultInfo>
            <div>
              <strong>Data:</strong>{' '}
              {new Date(task.resultDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            {task.result === 'lost' && task.lossReason && (
              <div>
                <strong>Motivo:</strong> {LossReasonLabels[task.lossReason]}
              </div>
            )}
          </ResultInfo>
        )}
        {task.resultNotes && (
          <NotesContainer>
            <NotesLabel>Observações:</NotesLabel>
            <NotesDisplay>{task.resultNotes}</NotesDisplay>
          </NotesContainer>
        )}
        {isEditing && (
          <>
            {task.result === 'lost' && (
              <FormGroup>
                <Label htmlFor='lossReason-edit'>
                  Motivo de perda <span className='required'>*</span>
                </Label>
                <Select
                  id='lossReason-edit'
                  value={lossReason}
                  onChange={e => {
                    setLossReason(e.target.value as LossReason);
                    setError('');
                  }}
                  disabled={loading}
                  required
                >
                  <option value=''>Selecione um motivo</option>
                  {Object.entries(LossReasonLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </FormGroup>
            )}
            <NotesContainer>
              <NotesLabel>Editar observações:</NotesLabel>
              <NotesTextarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder='Adicione observações sobre o resultado...'
              />
              <ActionsContainer>
                <ActionButton
                  $variant='won'
                  onClick={() => handleMarkResult('won')}
                  disabled={loading}
                >
                  <MdCheckCircle size={18} />
                  Salvar como Vendido
                </ActionButton>
                <ActionButton
                  $variant='lost'
                  onClick={() => handleMarkResult('lost')}
                  disabled={loading || (task.result === 'lost' && !lossReason)}
                >
                  <MdCancel size={18} />
                  Salvar como Perdido
                </ActionButton>
                <ActionButton
                  $variant='edit'
                  onClick={() => setIsEditing(false)}
                >
                  <MdClose size={18} />
                  Cancelar
                </ActionButton>
              </ActionsContainer>
            </NotesContainer>
          </>
        )}
        {!isEditing && (
          <ActionsContainer>
            <ActionButton $variant='edit' onClick={() => setIsEditing(true)}>
              <MdEdit size={18} />
              Editar Resultado
            </ActionButton>
          </ActionsContainer>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Title>Marcar Resultado</Title>
      {selectedResult === 'lost' && (
        <FormGroup>
          <Label htmlFor='lossReason-new'>
            Motivo de perda <span className='required'>*</span>
          </Label>
          <Select
            id='lossReason-new'
            value={lossReason}
            onChange={e => {
              setLossReason(e.target.value as LossReason);
              setError('');
            }}
            disabled={loading}
          >
            <option value=''>Selecione um motivo</option>
            {Object.entries(LossReasonLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
      )}
      <NotesContainer>
        <NotesLabel>Observações (opcional):</NotesLabel>
        <NotesTextarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder='Adicione observações sobre o resultado...'
        />
      </NotesContainer>
      <ActionsContainer>
        <ActionButton
          $variant='won'
          onClick={() => {
            setSelectedResult('won');
            handleMarkResult('won');
          }}
          disabled={loading}
        >
          <MdCheckCircle size={18} />
          Marcar como Vendido
        </ActionButton>
        <ActionButton
          $variant='lost'
          onClick={() => {
            if (selectedResult !== 'lost') {
              // Primeira vez clicando - mostrar o select
              setSelectedResult('lost');
              setError('');
            } else if (!lossReason) {
              // Tentando marcar sem motivo
              setError('Por favor, selecione um motivo de perda');
            } else {
              // Tem motivo, pode marcar
              handleMarkResult('lost');
            }
          }}
          disabled={loading}
        >
          <MdCancel size={18} />
          {selectedResult === 'lost' && lossReason
            ? 'Confirmar Perda'
            : 'Marcar como Perdido'}
        </ActionButton>
      </ActionsContainer>
    </Container>
  );
};
