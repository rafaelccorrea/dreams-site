import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdClose, MdSave, MdPerson, MdPhone } from 'react-icons/md';
import { TagSelector } from '../TagSelector';
import { useTags } from '../../hooks/useTags';

// Styled Components
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 28px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalContent = styled.div`
  padding: 32px;
  max-height: calc(90vh - 220px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
  letter-spacing: -0.01em;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 400;
  }
`;

const TagsSection = styled.div`
  margin-top: 32px;
  margin-bottom: 0;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const TagsLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`;

const ModalActions = styled.div`
  padding: 24px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 20px 24px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    padding: 16px 20px;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; tagIds: string[] }) => void;
  initialData?: {
    name: string;
    phone: string;
    tagIds: string[];
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tagIds || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { tags, loading: tagsLoading } = useTags();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        phone: initialData.phone || '',
      });
      setSelectedTags(initialData.tagIds || []);
    }
  }, [initialData]);

  const handleClose = () => {
    setFormData({
      name: initialData?.name || '',
      phone: initialData?.phone || '',
    });
    setSelectedTags(initialData?.tagIds || []);
    onClose();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        tagIds: selectedTags,
      });
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>
            <MdPerson />
            Editar Perfil
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <MdClose />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <FormGroup>
            <Label>
              <MdPerson />
              Nome Completo
            </Label>
            <Input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Digite seu nome completo'
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <MdPhone />
              Telefone
            </Label>
            <Input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              placeholder='(11) 99999-9999'
            />
          </FormGroup>

          <TagsSection>
            <TagsLabel>Tags</TagsLabel>
            <TagSelector
              availableTags={tags}
              selectedTagIds={selectedTags}
              onSelectionChange={setSelectedTags}
              loading={tagsLoading}
            />
          </TagsSection>
        </ModalContent>

        <ModalActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            $variant='primary'
            onClick={handleSave}
            disabled={isLoading || !formData.name.trim()}
          >
            <MdSave />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditProfileModal;
