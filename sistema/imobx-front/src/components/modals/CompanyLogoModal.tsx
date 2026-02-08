import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { MdBusiness, MdCameraAlt, MdUpload } from 'react-icons/md';
import { toast } from 'react-toastify';
import { companyApi } from '../../services/companyApi';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';

interface CompanyLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: any;
  onLogoUpdated: (logoUrl: string | null) => void;
}

// Styled Components específicos do logo da empresa
const LogoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 24px 0;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const LogoPreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LogoPreviewLarge = styled.div<{ $logo?: string }>`
  width: 280px;
  height: 280px;
  border-radius: 24px;
  background: ${props =>
    props.$logo
      ? `url(${props.$logo})`
      : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 3px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 240px;
    height: 240px;
  }
`;

const LogoPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    font-size: 4rem;
    opacity: 0.5;
  }
`;

const PlaceholderText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
`;

const PlaceholderSubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const UploadActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UploadButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 8px 24px ${props => props.theme.colors.primary}30;
  min-height: 56px;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const RemoveButton = styled.button`
  background: ${props => (props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2')};
  color: ${props => (props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b')};
  border: 1px solid
    ${props => (props.theme.mode === 'dark' ? '#991b1b' : '#fecaca')};
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 56px;

  &:hover:not(:disabled) {
    background: ${props =>
      props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
    transform: translateY(-3px);
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
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const InfoTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CompanyName = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
`;

export const CompanyLogoModal: React.FC<CompanyLogoModalProps> = ({
  isOpen,
  onClose,
  company,
  onLogoUpdated,
}) => {
  const companyLogo = company?.logo || company?.logoUrl || null;
  const [preview, setPreview] = useState<string | null>(companyLogo);
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
    if (!company?.id) {
      toast.error('Empresa não encontrada');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedFile) {
        // Upload novo logo
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await companyApi.uploadLogo(company.id, formData);

        // O logo já é atualizado automaticamente pelo backend
        onLogoUpdated(response.logoUrl);
        toast.success('Logo da empresa atualizado com sucesso!');
      } else if (preview === null) {
        // Remover logo
        await companyApi.updateCompany(company.id, { logo: null });
        onLogoUpdated(null);
        toast.success('Logo da empresa removido com sucesso!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar logo da empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    const companyLogo = company?.logo || company?.logoUrl || null;
    setPreview(companyLogo);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const companyLogoForComparison = company?.logo || company?.logoUrl || null;
  const hasChanges =
    selectedFile !== null || preview !== companyLogoForComparison;

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={handleClose}
      title='Logo da Empresa'
      subtitle='Altere o logo da empresa para personalizar sua identidade visual'
      icon={<MdBusiness size={24} />}
      maxWidth='800px'
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
          {preview && (
            <ModalButton variant='danger' onClick={handleRemove}>
              Remover Logo
            </ModalButton>
          )}
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
      <LogoContainer>
        <LogoPreviewSection>
          <CompanyName>{company?.name}</CompanyName>
          <LogoPreviewLarge $logo={preview || undefined}>
            {preview ? null : (
              <LogoPlaceholder>
                <MdBusiness />
                <PlaceholderText>Nenhum logo selecionado</PlaceholderText>
                <PlaceholderSubtext>
                  Clique em "Escolher Logo" para adicionar uma imagem
                </PlaceholderSubtext>
              </LogoPlaceholder>
            )}
          </LogoPreviewLarge>
        </LogoPreviewSection>

        <UploadSection>
          <UploadActions>
            <UploadButton as='label' htmlFor='logo-upload'>
              <MdCameraAlt />
              Escolher Logo
            </UploadButton>

            <HiddenInput
              ref={fileInputRef}
              id='logo-upload'
              type='file'
              accept='image/*'
              onChange={handleFileSelect}
            />
          </UploadActions>

          <UploadInfo>
            <InfoTitle>
              <MdUpload />
              Informações sobre o Logo
            </InfoTitle>
            <InfoList>
              <li>Formatos aceitos: JPG, PNG, GIF, WebP</li>
              <li>Tamanho máximo: 5MB</li>
              <li>Dimensões recomendadas: 400x400px</li>
              <li>O logo será usado em todo o sistema</li>
            </InfoList>
          </UploadInfo>
        </UploadSection>
      </LogoContainer>
    </ModalPadrão>
  );
};

export default CompanyLogoModal;
