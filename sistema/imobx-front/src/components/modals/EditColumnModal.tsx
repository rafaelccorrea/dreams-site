import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdSave, MdColorLens, MdDelete } from 'react-icons/md';
import { showSuccess, showError } from '../../utils/notifications';
import type { KanbanColumn } from '../../types/kanban';

interface EditColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateColumnData) => Promise<void>;
  onDelete?: (columnId: string) => Promise<void>;
  column: KanbanColumn | null;
}

interface UpdateColumnData {
  title?: string;
  description?: string;
  color?: string;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5);
  border: 2px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.3s ease-out;
  opacity: 1;
  position: relative;
  z-index: 10001;
  display: flex;
  flex-direction: column;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.background} 0%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 1;
  position: relative;
  z-index: 10002;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 32px;
    right: 32px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.theme.colors.border},
      transparent
    );
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  background: ${props => props.theme.colors.surface};
  opacity: 1;
  position: relative;
  z-index: 10002;
  overflow-y: auto;
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ColorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorInput = styled.input`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: none;
`;

const ColorPreview = styled.div<{ $color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.$color};
  border: 2px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-top: 32px;
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const SaveButton = styled.button<{ $isSubmitting: boolean }>`
  background: ${props =>
    props.$isSubmitting
      ? props.theme.colors.border
      : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => (props.$isSubmitting ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const defaultColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
];

export const EditColumnModal: React.FC<EditColumnModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  column,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(defaultColors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (column && isOpen) {
      setTitle(column.title);
      setDescription(column.description || '');
      setColor(column.color || defaultColors[0]);
      setErrors({});
    }
  }, [column, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Título deve ter pelo menos 2 caracteres';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Título deve ter no máximo 100 caracteres';
    }

    if (description && description.length > 500) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!column || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        color,
      });

      showSuccess('Coluna atualizada com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar coluna:', error);
      showError(error.message || 'Erro ao atualizar coluna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!column || !onDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a coluna "${column.title}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(column.id);
      showSuccess('Coluna excluída com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Erro ao excluir coluna:', error);
      showError(error.message || 'Erro ao excluir coluna');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isDeleting) {
      onClose();
    }
  };

  if (!isOpen || !column) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <MdColorLens size={24} />
            Editar Coluna
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor='title'>Título *</Label>
              <Input
                id='title'
                type='text'
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder='Ex: Em Progresso, Concluído...'
                maxLength={100}
                disabled={isSubmitting || isDeleting}
              />
              {errors.title && (
                <div
                  style={{
                    color: '#EF4444',
                    fontSize: '0.875rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.title}
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor='description'>Descrição</Label>
              <TextArea
                id='description'
                value={description}
                onChange={e => {
                  if (e.target.value.length <= 300) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder='Descrição opcional da coluna... (máx. 300 caracteres)'
                maxLength={300}
                disabled={isSubmitting || isDeleting}
              />
              {errors.description && (
                <div
                  style={{
                    color: '#EF4444',
                    fontSize: '0.875rem',
                    marginTop: '4px',
                  }}
                >
                  {errors.description}
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Cor da Coluna</Label>
              <ColorGroup>
                <ColorPreview $color={color}>
                  <MdColorLens size={20} />
                </ColorPreview>
                <ColorInput
                  type='color'
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  disabled={isSubmitting || isDeleting}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {defaultColors.map(defaultColor => (
                    <ColorPreview
                      key={defaultColor}
                      $color={defaultColor}
                      onClick={() =>
                        !isSubmitting && !isDeleting && setColor(defaultColor)
                      }
                      style={{
                        cursor:
                          isSubmitting || isDeleting
                            ? 'not-allowed'
                            : 'pointer',
                        width: '32px',
                        height: '32px',
                        opacity: isSubmitting || isDeleting ? 0.6 : 1,
                      }}
                    />
                  ))}
                </div>
              </ColorGroup>
            </FormGroup>

            <ButtonGroup>
              {onDelete && (
                <DeleteButton
                  type='button'
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                >
                  <MdDelete size={16} />
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </DeleteButton>
              )}
              <ActionButtons>
                <CancelButton
                  type='button'
                  onClick={handleClose}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancelar
                </CancelButton>
                <SaveButton
                  type='submit'
                  $isSubmitting={isSubmitting}
                  disabled={isSubmitting || isDeleting}
                >
                  <MdSave size={16} />
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </SaveButton>
              </ActionButtons>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};
