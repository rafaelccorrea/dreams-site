import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdCloudUpload,
  MdDelete,
  MdImage,
  MdCheckCircle,
  MdWaterDrop,
} from 'react-icons/md';
import { companyWatermarkService } from '@/services/companyWatermark.service';
import { toast } from 'react-toastify';

interface WatermarkUploadProps {
  companyId: string;
  currentWatermark?: string | null;
  onUploadSuccess?: (watermarkUrl: string | null) => void;
  disabled?: boolean;
}

export const WatermarkUpload: React.FC<WatermarkUploadProps> = ({
  companyId,
  currentWatermark,
  onUploadSuccess,
  disabled = false,
}) => {
  const [preview, setPreview] = useState<string | null>(
    currentWatermark || null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar preview quando currentWatermark mudar
  useEffect(() => {
    setPreview(currentWatermark || null);
  }, [currentWatermark]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar tipo (apenas PNG)
    if (file.type !== 'image/png') {
      const errorMsg = 'Apenas arquivos PNG são permitidos para marca dágua';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validar tamanho (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      const errorMsg = 'Arquivo muito grande. Tamanho máximo: 2MB';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Criar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    try {
      setUploading(true);
      const result = await companyWatermarkService.uploadWatermark(
        companyId,
        file
      );

      setPreview(result.watermarkUrl);
      setError(null);
      toast.success('Marca dágua atualizada com sucesso!');

      if (onUploadSuccess) {
        onUploadSuccess(result.watermarkUrl);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Erro ao fazer upload da marca dágua';
      setError(errorMsg);
      toast.error(errorMsg);
      // Reverter preview em caso de erro
      setPreview(currentWatermark || null);
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!confirm('Deseja remover a marca dágua?')) return;

    try {
      setUploading(true);
      await companyWatermarkService.removeWatermark(companyId);

      setPreview(null);
      setError(null);
      toast.success('Marca dágua removida com sucesso!');

      if (onUploadSuccess) {
        onUploadSuccess(null);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Erro ao remover marca dágua';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Container>
      <Label>
        <MdWaterDrop size={20} />
        Marca d'Água
      </Label>
      <HintText>
        A marca dágua será aplicada automaticamente de forma centralizada em
        todas as imagens das propriedades.
      </HintText>

      <UploadArea $isDragging={false}>
        {preview ? (
          <PreviewContainer>
            <WatermarkPreview src={preview} alt='Preview marca dágua' />
            {!disabled && (
              <ActionButtons>
                <ChangeButton
                  type='button'
                  onClick={handleClick}
                  disabled={uploading}
                >
                  <MdCloudUpload />
                  Alterar
                </ChangeButton>
                <RemoveButton
                  type='button'
                  onClick={handleRemove}
                  disabled={uploading}
                >
                  <MdDelete />
                  Remover
                </RemoveButton>
              </ActionButtons>
            )}
          </PreviewContainer>
        ) : (
          <EmptyState
            onClick={!disabled && !uploading ? handleClick : undefined}
          >
            <MdImage />
            <EmptyText>Nenhuma marca dágua configurada</EmptyText>
            {!disabled && (
              <EmptyHint>Clique para selecionar um arquivo PNG</EmptyHint>
            )}
          </EmptyState>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/png'
          onChange={handleFileChange}
          disabled={uploading || disabled}
          style={{ display: 'none' }}
          id='watermark-upload-input'
        />

        {!disabled && !preview && (
          <UploadButton
            type='button'
            onClick={handleClick}
            disabled={uploading}
          >
            <MdCloudUpload />
            {uploading ? 'Enviando...' : 'Selecionar Marca dágua'}
          </UploadButton>
        )}
      </UploadArea>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SupportedFormats>
        📁 Formato aceito: PNG | 📏 Tamanho máximo: 2MB
      </SupportedFormats>

      <InfoBox>
        💡 A marca dágua será aplicada automaticamente de forma centralizada em
        todas as imagens das propriedades durante o upload.
      </InfoBox>
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const WatermarkPreview = styled.img`
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
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  width: 100%;
  text-align: center;

  svg {
    font-size: 3rem;
    opacity: 0.5;
  }

  &:hover {
    svg {
      opacity: ${props => (props.onClick ? '0.7' : '0.5')};
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

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.error}15;
  border-left: 3px solid ${props => props.theme.colors.error};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.error};
`;

const InfoBox = styled.div`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary}10;
  border-left: 3px solid ${props => props.theme.colors.primary};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

export default WatermarkUpload;
