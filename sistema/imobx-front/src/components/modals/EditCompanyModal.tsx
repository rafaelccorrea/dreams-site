import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdPhone,
  MdLocationOn,
  MdBusiness,
  MdImage,
  MdEmail,
  MdDescription,
  MdSearch,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { companyApi } from '../../services/companyApi';
import { formatCNPJ, formatCEP } from '../../utils/masks';
import { ModalPadrão } from '../common/ModalPadrão';
import { ModalButton } from '../common/ModalButton';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: any;
  onUpdate: (updatedCompany: any) => void;
}

// Styled Components específicos do formulário
const FormSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}40;
  }

  &[readonly] {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}40;
  }
`;

const ReadOnlyBadge = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 8px;
`;

const LogoUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const LogoPreview = styled.div<{ $logo?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: ${props =>
    props.$logo ? `url(${props.$logo})` : props.theme.colors.background};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LogoPlaceholder = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 2rem;
`;

const UploadButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  background: ${props => (props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2')};
  color: ${props => (props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b')};
  border: 1px solid
    ${props => (props.theme.mode === 'dark' ? '#991b1b' : '#fecaca')};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CEPGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const CEPButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  isOpen,
  onClose,
  company,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    website: '',
    zipCode: '',
    state: '',
    city: '',
    address: '',
    description: '',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        cnpj: company.cnpj || '',
        email: company.email || '',
        phone: company.phone || '',
        website: company.website || '',
        zipCode: company.zipCode || '',
        state: company.state || '',
        city: company.city || '',
        address: company.address || '',
        description: company.description || '',
      });
      setLogoPreview(company.logo || null);
    }
  }, [company]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onload = e => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
  };

  const searchCEP = async () => {
    const cep = formData.zipCode.replace(/\D/g, '');
    if (cep.length !== 8) {
      toast.error('CEP deve ter 8 dígitos');
      return;
    }

    setIsSearchingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        state: data.uf,
        city: data.localidade,
        address: data.logradouro,
      }));

      toast.success('CEP encontrado e preenchido automaticamente!');
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    } finally {
      setIsSearchingCEP(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const dataToSend: any = { ...formData };

      if (selectedLogo) {
        const formData = new FormData();
        formData.append('file', selectedLogo);
        const response = await companyApi.uploadLogo(company.id, formData);
        dataToSend.logo = response.logoUrl;
      } else if (logoPreview === null && selectedLogo === null) {
        dataToSend.logo = null;
      }

      await companyApi.updateCompany(company.id, dataToSend);
      toast.success('Empresa atualizada com sucesso!');
      onUpdate(dataToSend);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      website: '',
      zipCode: '',
      state: '',
      city: '',
      address: '',
      description: '',
    });
    setLogoPreview(null);
    setSelectedLogo(null);
    onClose();
  };

  return (
    <ModalPadrão
      isOpen={isOpen}
      onClose={handleClose}
      title='Editar Empresa'
      subtitle='Atualize as informações da empresa'
      icon={<MdBusiness size={24} />}
      maxWidth='1200px'
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
          >
            Salvar Alterações
          </ModalButton>
        </div>
      }
    >
      <FormSection>
        <SectionTitle>
          <MdBusiness />
          Informações Básicas
        </SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>
              <MdBusiness />
              Nome da Empresa
              <ReadOnlyBadge>Visualização</ReadOnlyBadge>
            </Label>
            <Input
              type='text'
              name='name'
              value={formData.name}
              readOnly
              placeholder='Nome da empresa'
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <MdBusiness />
              CNPJ
              <ReadOnlyBadge>Visualização</ReadOnlyBadge>
            </Label>
            <Input
              type='text'
              name='cnpj'
              value={formatCNPJ(formData.cnpj)}
              readOnly
              placeholder='00.000.000/0000-00'
            />
          </FormGroup>

          <FormGroup className='full-width'>
            <Label>
              <MdImage />
              Logo da Empresa
            </Label>
            <LogoUploadContainer>
              <LogoPreview $logo={logoPreview || undefined}>
                {logoPreview ? null : (
                  <LogoPlaceholder>
                    <MdBusiness />
                  </LogoPlaceholder>
                )}
              </LogoPreview>
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}
                >
                  <UploadButton as='label' htmlFor='logo-upload'>
                    <MdImage />
                    Escolher Logo
                  </UploadButton>
                  <input
                    id='logo-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleLogoSelect}
                    style={{ display: 'none' }}
                  />
                  {logoPreview && (
                    <RemoveButton onClick={handleRemoveLogo}>
                      Remover
                    </RemoveButton>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                </p>
              </div>
            </LogoUploadContainer>
          </FormGroup>
        </FormGrid>
      </FormSection>

      <FormSection>
        <SectionTitle>
          <MdPhone />
          Contato
        </SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>
              <MdEmail />
              Email
            </Label>
            <Input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              placeholder='contato@empresa.com'
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

          <FormGroup>
            <Label>
              <MdBusiness />
              Website
            </Label>
            <Input
              type='url'
              name='website'
              value={formData.website}
              onChange={handleInputChange}
              placeholder='https://www.empresa.com'
            />
          </FormGroup>
        </FormGrid>
      </FormSection>

      <FormSection>
        <SectionTitle>
          <MdLocationOn />
          Localização
        </SectionTitle>
        <FormGrid>
          <FormGroup>
            <Label>
              <MdLocationOn />
              CEP
            </Label>
            <CEPGroup>
              <Input
                type='text'
                name='zipCode'
                value={formData.zipCode}
                onChange={e => {
                  const formatted = formatCEP(e.target.value);
                  setFormData(prev => ({ ...prev, zipCode: formatted }));
                }}
                placeholder='00000-000'
                maxLength={9}
                style={{ flex: 1 }}
              />
              <CEPButton
                type='button'
                onClick={searchCEP}
                disabled={isSearchingCEP}
              >
                <MdSearch size={16} />
                {isSearchingCEP ? 'Buscando...' : 'Buscar CEP'}
              </CEPButton>
            </CEPGroup>
          </FormGroup>

          <FormGroup>
            <Label>
              <MdLocationOn />
              Estado
            </Label>
            <Input
              type='text'
              name='state'
              value={formData.state}
              onChange={handleInputChange}
              placeholder='SP'
              maxLength={2}
              style={{ textTransform: 'uppercase' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <MdLocationOn />
              Cidade
            </Label>
            <Input
              type='text'
              name='city'
              value={formData.city}
              onChange={handleInputChange}
              placeholder='São Paulo'
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <MdLocationOn />
              Endereço
            </Label>
            <Input
              type='text'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              placeholder='Rua, número, complemento'
            />
          </FormGroup>

          <FormGroup className='full-width'>
            <Label>
              <MdDescription />
              Descrição
            </Label>
            <TextArea
              name='description'
              value={formData.description}
              onChange={e => {
                if (e.target.value.length <= 300) {
                  handleInputChange(e);
                }
              }}
              placeholder='Descrição da empresa (máx. 300 caracteres)'
              maxLength={300}
              rows={3}
            />
          </FormGroup>
        </FormGrid>
      </FormSection>
    </ModalPadrão>
  );
};

export default EditCompanyModal;
