import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { MdCameraAlt, MdDelete, MdPerson, MdUpload } from 'react-icons/md';
import { toast } from 'react-toastify';
import { authApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';

interface AvatarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string | null) => void;
  currentAvatar?: string | null;
}

// Styled Components específicos do avatar
const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 20px;
  border: 2px dashed ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundTertiary};
  }
`;

const AvatarPreviewLarge = styled.div<{ $avatar?: string }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: ${props =>
    props.$avatar
      ? `url(${props.$avatar})`
      : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 4px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.02);
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.2);
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;

  ${AvatarPreviewLarge}:hover & {
    opacity: 1;
  }
`;

const OverlayIcon = styled.div`
  color: white;
  font-size: 2rem;
`;

const AvatarPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    font-size: 3rem;
    opacity: 0.6;
  }
`;

const PlaceholderText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: ${props => props.theme.colors.text};
`;

const PlaceholderSubtext = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`;

const UploadButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px ${props => props.theme.colors.primary}30;
  min-width: 160px;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const RemoveButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 16px ${props => props.theme.colors.error}30;
  min-width: 160px;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.error};
    filter: brightness(0.9);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.theme.colors.error}40;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadInfo = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  background: ${props => props.theme.colors.background};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 400px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
`;

export const AvatarEditModal: React.FC<AvatarEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentAvatar,
}) => {
  const { refreshUser } = useAuth();
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      setSelectedFile(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (selectedFile) {
        // Upload novo avatar
        const response = await authApi.uploadAvatar(selectedFile);

        // Atualizar dados do usuário no authStorage
        await refreshUser();

        onSave(response.avatarUrl);
        toast.success('Avatar atualizado com sucesso!');
      } else if (preview === null) {
        // Remover avatar
        await authApi.updateProfile({ avatar: null });

        // Atualizar dados do usuário no authStorage
        await refreshUser();

        onSave(null);
        toast.success('Avatar removido com sucesso!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPreview(currentAvatar || null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const hasChanges = selectedFile !== null || preview !== currentAvatar;

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={handleClose}
      title='Editar Avatar'
      subtitle='Altere sua foto de perfil'
      icon={<MdPerson size={24} />}
      maxWidth='600px'
      footer={
        <div
          style={{
            display: 'flex',
            gap: '12px',
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <ModalButton variant='secondary' onClick={handleClose}>
            Cancelar
          </ModalButton>
          <ModalButton
            variant='primary'
            onClick={handleSave}
            loading={isLoading}
            disabled={!hasChanges}
          >
            Salvar Alterações
          </ModalButton>
        </div>
      }
    >
      <AvatarContainer>
        <AvatarSection>
          <AvatarPreviewLarge $avatar={preview || undefined}>
            {preview ? (
              <AvatarOverlay>
                <OverlayIcon>
                  <MdCameraAlt />
                </OverlayIcon>
              </AvatarOverlay>
            ) : (
              <AvatarPlaceholder>
                <MdPerson />
                <PlaceholderText>Nenhuma foto selecionada</PlaceholderText>
                <PlaceholderSubtext>
                  Clique em "Escolher Foto" para adicionar uma imagem
                </PlaceholderSubtext>
              </AvatarPlaceholder>
            )}
          </AvatarPreviewLarge>

          <UploadSection>
            <ActionButtons>
              <UploadButton as='label' htmlFor='avatar-upload'>
                <MdUpload />
                Escolher Foto
              </UploadButton>

              {preview && (
                <RemoveButton onClick={handleRemove}>
                  <MdDelete />
                  Remover
                </RemoveButton>
              )}
            </ActionButtons>

            <HiddenInput
              ref={fileInputRef}
              id='avatar-upload'
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
            />

            <UploadInfo>
              <InfoTitle>Especificações da Imagem</InfoTitle>
              <InfoList>
                <div>📁 Formatos: JPG, PNG, GIF, WebP</div>
                <div>📏 Tamanho máximo: 5MB</div>
                <div>🖼️ Dimensões recomendadas: 400x400px</div>
                <div>✨ A imagem será redimensionada automaticamente</div>
              </InfoList>
            </UploadInfo>
          </UploadSection>
        </AvatarSection>
      </AvatarContainer>
    </ModalPadrão>
  );
};

export default AvatarEditModal;
