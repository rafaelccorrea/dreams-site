import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdHome,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdBusiness,
  MdLanguage,
} from 'react-icons/md';
import { condominiumApi } from '../../services/condominiumApi';
import type { CreateCondominiumDto } from '../../types/condominium';
import { showSuccess, showError } from '../../utils/notifications';
import { usePermissionsContextOptional } from '../../contexts/PermissionsContext';
import {
  maskCEP as maskZipCode,
  maskPhoneAuto,
  maskCNPJ,
} from '../../utils/masks';
import { useAddress } from '../../hooks/useAddress';
import { useStatesCities } from '../../hooks/useStatesCities';
import {
  ModernModalOverlay,
  ModernModalContainer,
  ModernModalHeader,
  ModernModalHeaderContent,
  ModernModalCloseButton,
  ModernModalContent,
  ModernFormGroup,
  ModernFormLabel,
  ModernRequiredIndicator,
  ModernFormInput,
  ModernFormTextarea,
  ModernErrorMessage,
  ModernButton,
  ModernLoadingSpinner,
} from '../../styles/components/ModernModalStyles';

interface CreateCondominiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCondominiumCreated?: (condominiumId: string) => void;
}

const StyledModalContainer = styled(ModernModalContainer)`
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`;

const StyledHeader = styled(ModernModalHeader)`
  padding: 28px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const TitleText = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SubtitleText = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 4px 0 0 0;
`;

const StyledContent = styled(ModernModalContent)`
  padding: 32px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const CreateCondominiumModal: React.FC<CreateCondominiumModalProps> = ({
  isOpen,
  onClose,
  onCondominiumCreated,
}) => {
  const permissionsContext = usePermissionsContextOptional();
  const hasCreatePermission =
    permissionsContext?.hasPermission('condominium:create') || false;

  const [formData, setFormData] = useState<CreateCondominiumDto>({
    name: '',
    description: '',
    address: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    cnpj: '',
    website: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook para busca de endereço
  const {
    isLoading: isAddressLoading,
    error: addressError,
    addressData,
    searchByZipCode,
  } = useAddress();

  // Hook para estados e cidades
  const {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    handleSetSelectedState,
    handleSetSelectedCity,
  } = useStatesCities();

  // Buscar endereço quando CEP mudar
  useEffect(() => {
    if (formData.zipCode && formData.zipCode.replace(/\D/g, '').length === 8) {
      searchByZipCode(formData.zipCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.zipCode]);

  // Preencher campos quando endereço for encontrado
  useEffect(() => {
    if (addressData) {
      setFormData(prev => ({
        ...prev,
        street: addressData.street || prev.street,
        neighborhood: addressData.neighborhood || prev.neighborhood,
        city: addressData.city || prev.city,
        state: addressData.state || prev.state,
        address:
          `${addressData.street || ''}, ${addressData.neighborhood || ''}, ${addressData.city || ''} - ${addressData.state || ''}`.replace(
            /^,\s*|,\s*$/g,
            ''
          ),
      }));
    }
  }, [addressData]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        address: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
        cnpj: '',
        website: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof CreateCondominiumDto,
    value: string
  ) => {
    let processedValue = value;

    // Aplicar máscaras
    if (field === 'zipCode') {
      processedValue = maskZipCode(value);
    } else if (field === 'phone') {
      processedValue = maskPhoneAuto(value);
    } else if (field === 'cnpj') {
      processedValue = maskCNPJ(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do condomínio é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Rua/Logradouro é obrigatório';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    } else if (formData.state.length !== 2) {
      newErrors.state = 'Estado deve ter 2 letras (ex: SP)';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (formData.zipCode.replace(/\D/g, '').length !== 8) {
      newErrors.zipCode = 'CEP deve ter 8 dígitos';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasCreatePermission) {
      showError('Você não tem permissão para criar condomínios');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const condominium = await condominiumApi.createCondominium(formData);
      showSuccess('Condomínio criado com sucesso!');

      if (onCondominiumCreated) {
        onCondominiumCreated(condominium.id);
      }

      onClose();
    } catch (error: any) {
      console.error('Erro ao criar condomínio:', error);
      showError(error.message || 'Erro ao criar condomínio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModernModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <StyledModalContainer onClick={e => e.stopPropagation()}>
        <StyledHeader>
          <ModernModalHeaderContent>
            <TitleContainer>
              <IconWrapper>
                <MdHome size={28} />
              </IconWrapper>
              <div>
                <TitleText>Criar Condomínio</TitleText>
                <SubtitleText>
                  Cadastre um novo condomínio no sistema
                </SubtitleText>
              </div>
            </TitleContainer>
            <ModernModalCloseButton
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <MdClose />
            </ModernModalCloseButton>
          </ModernModalHeaderContent>
        </StyledHeader>

        <StyledContent>
          <form onSubmit={handleSubmit}>
            <FormContainer>
              {/* Nome */}
              <ModernFormGroup>
                <ModernFormLabel>
                  <FieldIcon>
                    <MdHome size={16} />
                    Nome do Condomínio
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </FieldIcon>
                </ModernFormLabel>
                <ModernFormInput
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ex: Residencial Jardim das Flores'
                  required
                />
                {errors.name && (
                  <ModernErrorMessage>{errors.name}</ModernErrorMessage>
                )}
              </ModernFormGroup>

              {/* Descrição */}
              <ModernFormGroup>
                <ModernFormLabel>
                  <FieldIcon>
                    <MdBusiness size={16} />
                    Descrição
                  </FieldIcon>
                </ModernFormLabel>
                <ModernFormTextarea
                  value={formData.description || ''}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Descreva o condomínio, suas características e áreas de lazer...'
                  rows={3}
                />
              </ModernFormGroup>

              {/* CEP */}
              <ModernFormGroup>
                <ModernFormLabel>
                  <FieldIcon>
                    <MdLocationOn size={16} />
                    CEP
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                    {isAddressLoading && (
                      <span style={{ marginLeft: '8px', color: '#3b82f6' }}>
                        🔍 Buscando...
                      </span>
                    )}
                  </FieldIcon>
                </ModernFormLabel>
                <ModernFormInput
                  type='text'
                  value={formData.zipCode}
                  onChange={e => handleInputChange('zipCode', e.target.value)}
                  placeholder='00000-000'
                  maxLength={9}
                  required
                  disabled={isAddressLoading}
                />
                {errors.zipCode && (
                  <ModernErrorMessage>{errors.zipCode}</ModernErrorMessage>
                )}
                {addressError && (
                  <ModernErrorMessage>{addressError}</ModernErrorMessage>
                )}
              </ModernFormGroup>

              {/* Rua e Número */}
              <Row>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Rua/Logradouro
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.street}
                    onChange={e => handleInputChange('street', e.target.value)}
                    placeholder='Rua das Flores'
                    required
                    readOnly={!!addressData}
                    style={
                      addressData
                        ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' }
                        : {}
                    }
                  />
                  {errors.street && (
                    <ModernErrorMessage>{errors.street}</ModernErrorMessage>
                  )}
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    Número
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.number}
                    onChange={e => handleInputChange('number', e.target.value)}
                    placeholder='123'
                    required
                  />
                  {errors.number && (
                    <ModernErrorMessage>{errors.number}</ModernErrorMessage>
                  )}
                </ModernFormGroup>
              </Row>

              {/* Complemento e Bairro */}
              <Row>
                <ModernFormGroup>
                  <ModernFormLabel>Complemento</ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.complement || ''}
                    onChange={e =>
                      handleInputChange('complement', e.target.value)
                    }
                    placeholder='Bloco A'
                  />
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    Bairro
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.neighborhood}
                    onChange={e =>
                      handleInputChange('neighborhood', e.target.value)
                    }
                    placeholder='Jardim das Flores'
                    required
                    readOnly={!!addressData}
                    style={
                      addressData
                        ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' }
                        : {}
                    }
                  />
                  {errors.neighborhood && (
                    <ModernErrorMessage>
                      {errors.neighborhood}
                    </ModernErrorMessage>
                  )}
                </ModernFormGroup>
              </Row>

              {/* Estado e Cidade */}
              <Row>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Estado
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    as='select'
                    value={selectedState?.id || formData.state || ''}
                    onChange={e => {
                      const stateId = e.target.value;
                      const state = states.find(s => s.id === stateId);
                      handleSetSelectedState(state || null);
                      if (state) {
                        handleInputChange('state', state.sigla);
                      }
                    }}
                    required
                  >
                    <option value=''>Selecione o estado</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.nome} ({state.sigla})
                      </option>
                    ))}
                  </ModernFormInput>
                  {errors.state && (
                    <ModernErrorMessage>{errors.state}</ModernErrorMessage>
                  )}
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    Cidade
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    as='select'
                    value={selectedCity?.id || formData.city || ''}
                    onChange={e => {
                      const cityId = e.target.value;
                      const city = cities.find(c => c.id === cityId);
                      handleSetSelectedCity(city || null);
                      if (city) {
                        handleInputChange('city', city.nome);
                      }
                    }}
                    required
                    disabled={!selectedState}
                  >
                    <option value=''>
                      {!selectedState
                        ? 'Selecione primeiro um estado'
                        : loadingCities
                          ? 'Carregando cidades...'
                          : 'Selecione a cidade'}
                    </option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.nome}
                      </option>
                    ))}
                  </ModernFormInput>
                  {errors.city && (
                    <ModernErrorMessage>{errors.city}</ModernErrorMessage>
                  )}
                </ModernFormGroup>
              </Row>

              {/* Endereço Completo */}
              <ModernFormGroup>
                <ModernFormLabel>
                  Endereço Completo
                  <ModernRequiredIndicator>*</ModernRequiredIndicator>
                </ModernFormLabel>
                <ModernFormInput
                  type='text'
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder='Rua das Flores, 123, Jardim das Flores, São Paulo - SP'
                  required
                />
                {errors.address && (
                  <ModernErrorMessage>{errors.address}</ModernErrorMessage>
                )}
              </ModernFormGroup>

              {/* Telefone e Email */}
              <Row>
                <ModernFormGroup>
                  <ModernFormLabel>
                    <FieldIcon>
                      <MdPhone size={16} />
                      Telefone
                    </FieldIcon>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.phone || ''}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder='(11) 3333-4444'
                    maxLength={15}
                  />
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    <FieldIcon>
                      <MdEmail size={16} />
                      Email
                    </FieldIcon>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='email'
                    value={formData.email || ''}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='contato@condominio.com'
                  />
                  {errors.email && (
                    <ModernErrorMessage>{errors.email}</ModernErrorMessage>
                  )}
                </ModernFormGroup>
              </Row>

              {/* CNPJ e Website */}
              <Row>
                <ModernFormGroup>
                  <ModernFormLabel>
                    <FieldIcon>
                      <MdBusiness size={16} />
                      CNPJ
                    </FieldIcon>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={formData.cnpj || ''}
                    onChange={e => handleInputChange('cnpj', e.target.value)}
                    placeholder='12.345.678/0001-95'
                    maxLength={18}
                  />
                </ModernFormGroup>

                <ModernFormGroup>
                  <ModernFormLabel>
                    <FieldIcon>
                      <MdLanguage size={16} />
                      Website
                    </FieldIcon>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='url'
                    value={formData.website || ''}
                    onChange={e => handleInputChange('website', e.target.value)}
                    placeholder='https://www.condominio.com'
                  />
                </ModernFormGroup>
              </Row>

              {/* Botões */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '8px',
                }}
              >
                <ModernButton
                  type='button'
                  onClick={handleClose}
                  disabled={isSubmitting}
                  style={{ background: 'transparent', color: 'inherit' }}
                >
                  Cancelar
                </ModernButton>
                <ModernButton
                  type='submit'
                  disabled={isSubmitting || !hasCreatePermission}
                >
                  {isSubmitting ? (
                    <>
                      <ModernLoadingSpinner size={16} />
                      Criando...
                    </>
                  ) : (
                    'Criar Condomínio'
                  )}
                </ModernButton>
              </div>
            </FormContainer>
          </form>
        </StyledContent>
      </StyledModalContainer>
    </ModernModalOverlay>
  );
};
