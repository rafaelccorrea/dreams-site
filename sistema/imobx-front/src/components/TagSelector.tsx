import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdAdd, MdClose, MdCreate } from 'react-icons/md';
import { useTags } from '../hooks/useTags';
import { toast } from 'react-toastify';

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagChange: (tagIds: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
}

const TagSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const TagSelectorLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const SelectedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  padding: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
`;

const TagChip = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}30;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  max-width: 200px;
`;

const TagName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const DeleteTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: auto;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TagDropdown = styled.div<{ $isOpen: boolean }>`
  position: relative;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  z-index: 1100;
`;

const TagDropdownContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  z-index: 1100;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 4px;
`;

const TagOption = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props =>
    props.$isSelected ? props.theme.colors.primaryLight : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const TagOptionColor = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$color};
  flex-shrink: 0;
`;

const TagOptionText = styled.div`
  flex: 1;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const AddTagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px dashed ${props => props.theme.colors.border};
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-style: italic;
`;

const CreateTagButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px dashed ${props => props.theme.colors.primary};
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
  margin-top: 8px;

  &:hover {
    background: ${props => props.theme.colors.primaryLight};
    border-color: ${props => props.theme.colors.primaryDark};
  }
`;

const CreateTagModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const CreateTagContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const CreateTagTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CreateTagForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CreateTagInput = styled.input`
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CreateTagActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CreateTagButtonAction = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primary};
      opacity: 0.9;
      color: white;
    }
  `
      : `
    background: transparent;
    color: ${props.theme.colors.textSecondary};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.hover || props.theme.colors.background};
      color: ${props.theme.colors.text};
    }
  `}
`;

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagIds,
  onTagChange,
  disabled = false,
  maxTags = 5,
}) => {
  const { tags, loading, createTag, deleteTag } = useTags();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Tags são carregadas automaticamente pelo hook useTags

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTagIds.includes(tag.id));

  const handleTagSelect = (tagId: string) => {
    if (selectedTagIds.length >= maxTags) {
      return;
    }

    const newSelectedIds = [...selectedTagIds, tagId];
    onTagChange(newSelectedIds);
  };

  const handleTagRemove = (tagId: string) => {
    const newSelectedIds = selectedTagIds.filter(id => id !== tagId);
    onTagChange(newSelectedIds);
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    if (!confirm(`Tem certeza que deseja excluir a tag "${tagName}"?`)) {
      return;
    }

    try {
      setIsDeleting(tagId);
      await deleteTag(tagId);
      toast.success(`Tag "${tagName}" excluída com sucesso!`);

      // Remover da seleção se estiver selecionada
      if (selectedTagIds.includes(tagId)) {
        const newSelectedIds = selectedTagIds.filter(id => id !== tagId);
        onTagChange(newSelectedIds);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao excluir tag';
      toast.error(`Erro ao excluir tag: ${errorMessage}`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }

    // Verificar se já existe uma tag com o mesmo nome
    const existingTag = tags.find(
      tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );

    if (existingTag) {
      toast.error('Já existe uma tag com este nome');
      return;
    }

    try {
      setIsCreating(true);

      const newTag = await createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });

      toast.success(`Tag "${newTag.name}" criada com sucesso!`);

      // Adicionar a nova tag automaticamente se não exceder o limite
      if (selectedTagIds.length < maxTags) {
        onTagChange([...selectedTagIds, newTag.id]);
      }

      // Fechar modal e limpar campos
      setIsCreateModalOpen(false);
      setNewTagName('');
      setNewTagColor('#3b82f6');
    } catch (error: any) {
      console.error('Erro ao criar tag:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Erro ao criar tag';
      toast.error(`Erro ao criar tag: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewTagName('');
    setNewTagColor('#3b82f6');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Não fechar se clicar no dropdown ou em elementos filhos
      if (
        !target.closest('[data-tag-selector]') &&
        !target.closest('[data-tag-dropdown]')
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <TagSelectorContainer data-tag-selector>
      <TagSelectorLabel>
        Tags ({selectedTagIds.length}/{maxTags})
      </TagSelectorLabel>

      <SelectedTagsContainer>
        {selectedTags.map(tag => (
          <TagChip key={tag.id} $color={tag.color}>
            <TagName>
              {tag.name}
              {tag.isDefault && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.8)',
                    marginLeft: '4px',
                    fontStyle: 'italic',
                  }}
                >
                  (padrão)
                </span>
              )}
            </TagName>
            {!disabled && (
              <RemoveTagButton onClick={() => handleTagRemove(tag.id)}>
                <MdClose size={12} />
              </RemoveTagButton>
            )}
          </TagChip>
        ))}

        {!disabled && selectedTagIds.length < maxTags && (
          <AddTagButton onClick={handleToggleDropdown}>
            <MdAdd size={14} />
            Adicionar Tag
          </AddTagButton>
        )}
      </SelectedTagsContainer>

      <TagDropdown $isOpen={isDropdownOpen} data-tag-dropdown>
        <TagDropdownContent>
          {loading ? (
            <EmptyState>Carregando tags...</EmptyState>
          ) : (
            <>
              {availableTags.length === 0 ? (
                <EmptyState>Nenhuma tag disponível</EmptyState>
              ) : (
                availableTags.map(tag => (
                  <TagOption
                    key={tag.id}
                    $isSelected={false}
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    <TagOptionColor $color={tag.color} />
                    <TagOptionText>
                      {tag.name}
                      {tag.isDefault && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginLeft: '4px',
                            fontStyle: 'italic',
                          }}
                        >
                          (padrão)
                        </span>
                      )}
                    </TagOptionText>
                    {!tag.isDefault && (
                      <DeleteTagButton
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteTag(tag.id, tag.name);
                        }}
                        disabled={isDeleting === tag.id}
                        title='Excluir tag'
                      >
                        {isDeleting === tag.id ? (
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid transparent',
                              borderTop: '2px solid currentColor',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                        ) : (
                          <MdClose size={12} />
                        )}
                      </DeleteTagButton>
                    )}
                  </TagOption>
                ))
              )}

              <CreateTagButton onClick={handleOpenCreateModal}>
                <MdCreate size={14} />
                Criar Nova Tag
              </CreateTagButton>
            </>
          )}
        </TagDropdownContent>
      </TagDropdown>

      {/* Modal para criar nova tag */}
      <CreateTagModal $isOpen={isCreateModalOpen}>
        <CreateTagContent>
          <CreateTagTitle>Criar Nova Tag</CreateTagTitle>

          <CreateTagForm>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Nome da Tag
              </label>
              <CreateTagInput
                type='text'
                placeholder='Digite o nome da tag'
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (newTagName.trim()) handleCreateTag();
                  }
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
              >
                Cor da Tag
              </label>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <CreateTagInput
                  type='color'
                  value={newTagColor}
                  onChange={e => setNewTagColor(e.target.value)}
                  style={{ width: '60px', height: '40px', padding: '4px' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {newTagColor}
                </span>
              </div>
            </div>
          </CreateTagForm>

          <CreateTagActions>
            <CreateTagButtonAction
              type='button'
              onClick={handleCloseCreateModal}
            >
              Cancelar
            </CreateTagButtonAction>
            <CreateTagButtonAction
              type='button'
              $variant='primary'
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid currentColor',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px',
                    }}
                  />
                  Criando...
                </>
              ) : (
                'Criar Tag'
              )}
            </CreateTagButtonAction>
          </CreateTagActions>
        </CreateTagContent>
      </CreateTagModal>
    </TagSelectorContainer>
  );
};
