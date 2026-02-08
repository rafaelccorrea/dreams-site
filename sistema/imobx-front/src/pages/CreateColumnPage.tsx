import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { MdArrowBack, MdCheck, MdColorLens } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { useKanban } from '../hooks/useKanban';
import { showSuccess, showError } from '../utils/notifications';
import { buildKanbanUrl } from '../utils/kanbanState';

const SimplePageContainer = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SimpleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

const SimpleTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const SimpleSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const SimpleBackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

const SimpleFormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const RequiredMark = styled.span`
  color: ${props => props.theme.colors.error};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.2s ease;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ColorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ColorInput = styled.input`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: none;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 6px;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $isLoading?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${props => (props.$isLoading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => {
    if (props.$variant === 'secondary') {
      return `
        background: transparent;
        color: ${props.theme.colors.textSecondary};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.cardBackground};
          color: ${props.theme.colors.text};
        }
      `;
    }
    return `
      background: ${props.$isLoading ? props.theme.colors.border : props.theme.colors.primary};
      color: white;
      
      &:hover:not(:disabled) {
        background: ${props.theme.colors.primaryDark};
      }
    `;
  }}

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

const CreateColumnPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const projectId = searchParams.get('projectId');
  const workspace = searchParams.get('workspace');

  const { createColumn, board } = useKanban(teamId || undefined);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(defaultColors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentColumnCount = board?.columns?.length || 0;
  const maxColumns = 6;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!teamId) {
      showError('Selecione uma equipe primeiro');
      return false;
    }

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

    // Verificar limite de colunas
    if (currentColumnCount >= maxColumns) {
      showError(
        `Máximo de ${maxColumns} colunas permitidas para manter o layout otimizado`
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createColumn({
        title: title.trim(),
        description: description.trim() || undefined,
        color,
        teamId: teamId!,
        projectId: projectId || undefined,
      });

      showSuccess('Coluna criada com sucesso!');

      // Navegar de volta para o Kanban
      handleBack();
    } catch (error: any) {
      console.error('Erro ao criar coluna:', error);
      showError(error.message || 'Erro ao criar coluna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Usar função utilitária para construir URL do Kanban
    const kanbanUrl = buildKanbanUrl({
      projectId: projectId || undefined,
      teamId: teamId || undefined,
      workspace: workspace || undefined,
    });

    navigate(kanbanUrl);
  };

  return (
    <Layout>
      <SimplePageContainer>
        <SimpleHeader>
          <div>
            <SimpleTitle>Nova Coluna</SimpleTitle>
            <SimpleSubtitle>
              Criar uma nova coluna no quadro Kanban ({currentColumnCount}/
              {maxColumns})
            </SimpleSubtitle>
          </div>
          <SimpleBackButton onClick={handleBack} type='button'>
            <MdArrowBack size={20} />
            Voltar
          </SimpleBackButton>
        </SimpleHeader>

        <SimpleFormGrid as='form' onSubmit={handleSubmit}>
          <FieldContainer>
            <FieldLabel>
              Título <RequiredMark>*</RequiredMark>
            </FieldLabel>
            <Input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Ex: Em Progresso, Concluído...'
              maxLength={100}
              disabled={isSubmitting}
              $hasError={!!errors.title}
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Descrição</FieldLabel>
            <TextArea
              value={description}
              onChange={e => {
                if (e.target.value.length <= 500) {
                  setDescription(e.target.value);
                }
              }}
              placeholder='Descrição opcional da coluna... (máx. 500 caracteres)'
              maxLength={500}
              disabled={isSubmitting}
              $hasError={!!errors.description}
            />
            {errors.description && (
              <ErrorMessage>{errors.description}</ErrorMessage>
            )}
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Cor da Coluna</FieldLabel>
            <ColorGroup>
              <ColorPreview $color={color}>
                <MdColorLens size={20} />
              </ColorPreview>
              <ColorInput
                type='color'
                value={color}
                onChange={e => setColor(e.target.value)}
                disabled={isSubmitting}
              />
              {defaultColors.map(defaultColor => (
                <ColorPreview
                  key={defaultColor}
                  $color={defaultColor}
                  onClick={() => !isSubmitting && setColor(defaultColor)}
                />
              ))}
            </ColorGroup>
          </FieldContainer>

          <ButtonsRow>
            <Button
              type='button'
              $variant='secondary'
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              $variant='primary'
              $isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <MdCheck size={18} />
              {isSubmitting ? 'Criando...' : 'Criar Coluna'}
            </Button>
          </ButtonsRow>
        </SimpleFormGrid>
      </SimplePageContainer>
    </Layout>
  );
};

export default CreateColumnPage;
