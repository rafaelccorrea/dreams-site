import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  MdCloudUpload,
  MdDelete,
  MdImage,
  MdCheckCircle,
} from 'react-icons/md';
import { api } from '@/services/api';
import { toast } from 'react-toastify';

interface LogoUploadProps {
  companyId?: string;
  currentLogo?: string | null;
  onLogoChange?: (logoUrl: string | null) => void;
  onFileChange?: (file: File | null) => void; // Callback para retornar o File
  disabled?: boolean;
  isCreating?: boolean; // Indica se está criando nova empresa
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  companyId,
  currentLogo,
  onLogoChange,
  onFileChange,
  disabled = false,
  isCreating = false,
}) => {
  const [logo, setLogo] = useState<string | null>(currentLogo || null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato inválido. Use JPEG, PNG, WEBP ou SVG.');
      return;
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo: 5MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreview(result);

      // Se está criando, apenas salva o preview e notifica
      if (isCreating) {
        setSelectedFile(file);
        onLogoChange?.(result); // Passa o preview temporariamente
        onFileChange?.(file); // Passa o File para o componente pai
        toast.success('Logo selecionada! Será enviada ao salvar a empresa.');
      }
    };
    reader.readAsDataURL(file);

    // Se já existe companyId, faz upload imediatamente
    if (companyId && !isCreating) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(
          `/companies/${companyId}/upload-logo`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        setLogo(response.data.logoUrl);
        setPreview(response.data.logoUrl);
        onLogoChange?.(response.data.logoUrl);
        toast.success('Logo atualizada com sucesso!');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao fazer upload');
        setPreview(logo);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = async () => {
    if (isCreating) {
      // Se está criando, apenas limpa o preview
      setPreview(null);
      setSelectedFile(null);
      onLogoChange?.(null);
      onFileChange?.(null); // Notifica que o arquivo foi removido
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Logo removida');
      return;
    }

    if (!companyId || !logo) return;

    try {
      setUploading(true);
      await api.delete(`/companies/${companyId}/logo`);

      setLogo(null);
      setPreview(null);
      setSelectedFile(null);
      onLogoChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Logo removida com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao remover logo');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Função para upload após criação da empresa
  const uploadAfterCreation = async (
    newCompanyId: string
  ): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post(
        `/companies/${newCompanyId}/upload-logo`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data.logoUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      return null;
    }
  };

  // Expor método para uso externo (formulário pai)
  React.useImperativeHandle(React.useRef({ uploadAfterCreation }), () => ({
    uploadAfterCreation,
  }));

  return (
    <Container>
      <Label>Logo da Empresa</Label>
      <HintText>
        Recomendado: 200x200px ou maior, PNG com fundo transparente
      </HintText>

      <UploadArea $isDragging={false}>
        {preview ? (
          <PreviewContainer>
            <LogoPreview src={preview} alt='Logo da empresa' />
            {isCreating && selectedFile && (
              <SuccessBadge>
                <MdCheckCircle />
                Pronta para enviar
              </SuccessBadge>
            )}
            {!disabled && (
              <ActionButtons>
                <ChangeButton onClick={handleClick} disabled={uploading}>
                  <MdCloudUpload />
                  Alterar
                </ChangeButton>
                <RemoveButton onClick={handleRemove} disabled={uploading}>
                  <MdDelete />
                  Remover
                </RemoveButton>
              </ActionButtons>
            )}
          </PreviewContainer>
        ) : (
          <EmptyState onClick={!disabled ? handleClick : undefined}>
            <MdImage />
            <EmptyText>Nenhuma logo selecionada</EmptyText>
            {!disabled && (
              <EmptyHint>Clique para selecionar ou arraste aqui</EmptyHint>
            )}
          </EmptyState>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg,image/jpg,image/png,image/webp,image/svg+xml'
          onChange={handleFileSelect}
          disabled={uploading || disabled}
          style={{ display: 'none' }}
          id='logo-upload-input'
        />

        {!disabled && !preview && (
          <UploadButton onClick={handleClick} disabled={uploading}>
            <MdCloudUpload />
            {uploading ? 'Enviando...' : 'Selecionar Logo'}
          </UploadButton>
        )}
      </UploadArea>

      <SupportedFormats>
        📁 Formatos aceitos: JPG, PNG, WEBP, SVG | 📏 Tamanho máximo: 5MB
      </SupportedFormats>

      {isCreating && selectedFile && (
        <InfoBox>
          💡 A logo será enviada automaticamente após criar a empresa
        </InfoBox>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const HintText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: -0.5rem;
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px dashed
    ${props =>
      props.$isDragging
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 0.75rem;
  background: ${props =>
    props.$isDragging
      ? props.theme.colors.primary + '10'
      : props.theme.colors.backgroundSecondary};
  transition: all 0.2s;
  min-height: 200px;
  justify-content: center;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const LogoPreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SuccessBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.success}15;
  color: ${props => props.theme.colors.success};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;

  svg {
    font-size: 1.125rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  padding: 2rem;
  cursor: pointer;
  width: 100%;
  text-align: center;

  svg {
    font-size: 3rem;
    opacity: 0.5;
  }

  &:hover {
    svg {
      opacity: 0.7;
    }
  }
`;

const EmptyText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
`;

const EmptyHint = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  opacity: 0.8;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.25rem;
  }
`;

const ChangeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1rem;
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.error}15;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error}30;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.error}25;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    font-size: 1rem;
  }
`;

const SupportedFormats = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 0.5rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
`;

const InfoBox = styled.div`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary}10;
  border-left: 3px solid ${props => props.theme.colors.primary};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

export default LogoUpload;
