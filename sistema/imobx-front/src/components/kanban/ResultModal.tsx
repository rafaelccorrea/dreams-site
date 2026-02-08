import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdCheckCircle, MdCancel, MdRefresh } from 'react-icons/md';
import type { KanbanTask, LossReason } from '../../types/kanban';
import { LossReasonLabels } from '../../types/kanban';
import { kanbanApi } from '../../services/kanbanApi';
import { showError, showSuccess } from '../../utils/notifications';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTask;
  onUpdate?: (updatedTask: KanbanTask) => void;
  selectedResult?: 'won' | 'lost' | 'open' | null;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  padding-top: 100px;
  overflow-y: auto;
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: visible;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1001;
  margin-bottom: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: visible;
`;

const FinalizeButton = styled.button<{ $variant: 'won' | 'lost' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$variant === 'won'
      ? props.theme.colors.success
      : props.theme.colors.error};
  color: #fff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px
      ${props =>
        props.$variant === 'won'
          ? `${props.theme.colors.success}40`
          : `${props.theme.colors.error}40`};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReopenButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  margin-top: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NotesTextarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }
`;

const CurrentResult = styled.div<{ $result: 'won' | 'lost' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => {
    if (props.$result === 'won') return `${props.theme.colors.success}20`;
    return `${props.theme.colors.error}20`;
  }};
  border: 2px solid
    ${props => {
      if (props.$result === 'won') return props.theme.colors.success;
      return props.theme.colors.error;
    }};
  border-radius: 8px;
  color: ${props => {
    if (props.$result === 'won') return props.theme.colors.success;
    return props.theme.colors.error;
  }};
  font-weight: 600;
  font-size: 0.875rem;
`;

const NotesLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
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

const Select = styled.select`
  padding: 12px 14px;
  padding-right: 36px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  position: relative;
  z-index: 10;

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
    padding: 8px;
  }
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
  margin-top: -4px;
`;

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  task,
  onUpdate,
  selectedResult,
}) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(task.resultNotes || '');
  const [lossReason, setLossReason] = useState<LossReason | ''>(
    task.lossReason || ''
  );
  const [error, setError] = useState('');

  // Reset form when modal opens with a new result
  useEffect(() => {
    if (isOpen) {
      if (selectedResult && !task.result) {
        // Novo resultado sendo marcado - limpar campos
        setNotes('');
        setLossReason('');
        setError('');
      } else if (task.result) {
        // Editando resultado existente - carregar valores existentes
        setNotes(task.resultNotes || '');
        setLossReason(task.lossReason || '');
        setError('');
      } else if (selectedResult) {
        // Caso especial: selectedResult mas sem task.result ainda
        setNotes('');
        setLossReason('');
        setError('');
      }
    }
  }, [isOpen, selectedResult, task.result, task.resultNotes, task.lossReason]);

  const handleFinalize = async () => {
    const result = selectedResult || task.result;
    if (!result) return;

    // Validação: se for perda, lossReason é obrigatório
    if (result === 'lost' && !lossReason) {
      setError('Por favor, selecione um motivo de perda');
      return;
    }

    setError('');

    // Salvar estado anterior para rollback
    const previousTask = { ...task };

    // Optimistic update - atualizar imediatamente (para 'open' limpar result/resultDate)
    const optimisticTask: KanbanTask = {
      ...task,
      result: result === 'open' ? undefined : result,
      resultDate: result === 'open' ? undefined : new Date().toISOString(),
      resultNotes: result === 'open' ? undefined : notes.trim() || undefined,
      lossReason: result === 'lost' ? (lossReason as LossReason) : undefined,
    };

    if (onUpdate) {
      onUpdate(optimisticTask);
    }

    try {
      setLoading(true);
      await kanbanApi.markTaskResult(task.id, {
        result: result as 'won' | 'lost' | 'open' | 'cancelled',
        lossReason: result === 'lost' ? (lossReason as LossReason) : undefined,
        notes: result === 'open' ? undefined : notes.trim() || undefined,
      });
      onClose();
      if (result === 'open') {
        showSuccess('Tarefa voltou para em andamento!');
      } else {
        showSuccess(
          `Tarefa marcada como ${result === 'won' ? 'vendida' : 'perdida'}!`
        );
      }
    } catch (error: any) {
      console.error('Erro ao marcar resultado:', error);
      if (onUpdate) {
        onUpdate(previousTask);
      }
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

  const currentResult = selectedResult || task.result;
  const isEditing = task.result && !selectedResult;
  const canReopen = task.result === 'won' || task.result === 'lost';

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isEditing
              ? 'Editar Resultado'
              : currentResult === 'won'
                ? 'Marcar como Vendido'
                : 'Marcar como Perdido'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {isEditing && task.result && (
            <CurrentResult $result={task.result}>
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
              {task.resultDate && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.8,
                    marginLeft: 'auto',
                  }}
                >
                  {new Date(task.resultDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              )}
            </CurrentResult>
          )}

          {currentResult === 'lost' && (
            <FormGroup>
              <Label htmlFor='lossReason'>
                Motivo de perda <span className='required'>*</span>
              </Label>
              <Select
                id='lossReason'
                value={lossReason}
                onChange={e => {
                  setLossReason(e.target.value as LossReason);
                  setError(''); // Limpar erro ao selecionar
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

          <FormGroup>
            <NotesLabel htmlFor='notes'>Descrição (opcional):</NotesLabel>
            <NotesTextarea
              id='notes'
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder='Adicione observações sobre o resultado...'
              disabled={loading}
            />
          </FormGroup>

          {canReopen && (
            <ReopenButton
              type='button'
              onClick={() => {
                (async () => {
                  setError('');
                  const previousTask = { ...task };
                  const optimisticTask: KanbanTask = {
                    ...task,
                    result: undefined,
                    resultDate: undefined,
                    resultNotes: undefined,
                    lossReason: undefined,
                  };
                  if (onUpdate) onUpdate(optimisticTask);
                  try {
                    setLoading(true);
                    await kanbanApi.markTaskResult(task.id, { result: 'open' });
                    onClose();
                    showSuccess('Tarefa voltou para em andamento!');
                  } catch (err: any) {
                    if (onUpdate) onUpdate(previousTask);
                    showError(
                      err.message || 'Erro ao voltar para em andamento'
                    );
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              disabled={loading}
            >
              <MdRefresh size={18} />
              Voltar para Em andamento
            </ReopenButton>
          )}

          {currentResult !== 'open' && (
            <FinalizeButton
              $variant={currentResult || 'won'}
              onClick={handleFinalize}
              disabled={
                loading ||
                !currentResult ||
                (currentResult === 'lost' && !lossReason)
              }
            >
              {currentResult === 'won' ? (
                <>
                  <MdCheckCircle size={18} />
                  Finalizar como Vendido
                </>
              ) : currentResult === 'lost' ? (
                <>
                  <MdCancel size={18} />
                  Finalizar como Perdido
                </>
              ) : (
                <>
                  <MdCheckCircle size={18} />
                  Finalizar
                </>
              )}
            </FinalizeButton>
          )}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};
