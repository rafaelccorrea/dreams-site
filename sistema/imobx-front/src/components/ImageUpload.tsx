import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { MdCloudUpload, MdDelete, MdImage } from 'react-icons/md';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed
    ${props =>
      props.isDragOver
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background: ${props =>
    props.isDragOver
      ? `${props.theme.colors.primary}10`
      : props.theme.colors.backgroundSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => `${props.theme.colors.primary}05`};
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
`;

const PreviewPlaceholder = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 24px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 1);
    transform: scale(1.1);
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
  margin-top: 8px;
`;

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSize?: number; // em MB
  acceptedTypes?: string[];
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado. Use: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }

    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Tamanho máximo: ${maxSize}MB`;
    }

    return null;
  };

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      console.error('Erros de validação:', errors);
      // Aqui você pode mostrar um toast ou alerta
    }

    const newImages = [...images, ...validFiles].slice(0, maxImages);
    onImagesChange(newImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const createImageUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <UploadContainer>
      <UploadArea
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <UploadIcon>
          <MdCloudUpload />
        </UploadIcon>
        <UploadText>Clique para enviar ou arraste imagens aqui</UploadText>
        <UploadSubtext>
          PNG, JPG, WEBP até {maxSize}MB cada (máximo {maxImages} imagens)
        </UploadSubtext>
        <HiddenInput
          ref={fileInputRef}
          type='file'
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
        />
      </UploadArea>

      {images.length > 0 && (
        <PreviewContainer>
          {images.map((image, index) => (
            <PreviewItem key={index}>
              {image.type.startsWith('image/') ? (
                <PreviewImage
                  src={createImageUrl(image)}
                  alt={`Preview ${index + 1}`}
                />
              ) : (
                <PreviewPlaceholder>
                  <MdImage />
                </PreviewPlaceholder>
              )}
              <DeleteButton onClick={() => removeImage(index)}>
                <MdDelete />
              </DeleteButton>
            </PreviewItem>
          ))}
        </PreviewContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploadContainer>
  );
};
