import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdNote,
  MdBusiness,
  MdHome,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { useClients } from '../../hooks/useClients';
import {
  ClientType,
  ClientStatus,
  CLIENT_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
} from '../../types/client';
import { validateEmail, maskPhoneAuto } from '../../utils/masks';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: any) => Promise<void>;
  client?: any;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
  animation: fadeIn 0.4s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow:
    0 40px 80px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes modalSlideIn {
    0% {
      transform: translateY(-30px) scale(0.95);
      opacity: 0;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.surface} 0%,
    ${props => props.theme.colors.background} 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 32px 40px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 20;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary},
      ${props => props.theme.colors.primary}80
    );
  }

  @media (max-width: 768px) {
    padding: 24px 24px 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const TitleIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.primary}15;
  padding: 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}25;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  margin-left: auto;

  &:hover {
    background: #fef2f2;
    border-color: #fee2e2;
    color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ModalBody = styled.div`
  padding: 40px 40px 20px 40px;
  max-height: calc(90vh - 140px);
  overflow-y: auto;
  background: ${props => props.theme.colors.surface};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }

  @media (max-width: 768px) {
    padding: 24px 24px 16px 24px;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
  padding: 28px;
  display: grid;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const SectionIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.primary}15;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px ${props => props.theme.colors.primary}20;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.01em;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`;

const IconWrapper = styled.div`
  color: ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.primary}10;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props => (props.$hasError ? '#DC2626' : props.theme.colors.border)};
  border-radius: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}20,
      0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 400;
  }
`;

const Select = styled.select<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props => (props.$hasError ? '#DC2626' : props.theme.colors.border)};
  border-radius: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 48px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}20,
      0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    padding: 12px;
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 16px 20px;
  border: 2px solid
    ${props => (props.$hasError ? '#DC2626' : props.theme.colors.border)};
  border-radius: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  font-weight: 500;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow:
      0 0 0 4px ${props => props.theme.colors.primary}20,
      0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.primary}60;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 400;
  }
`;

const ErrorMessage = styled.span`
  font-size: 13px;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  margin-top: 6px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;

  &::before {
    content: '⚠';
    font-size: 14px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 16px 32px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 56px;
  letter-spacing: -0.01em;
  position: relative;
  overflow: hidden;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primary}dd 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 16px ${props.theme.colors.primary}40;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, ${props.theme.colors.primary}dd 0%, ${props.theme.colors.primary}bb 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${props.theme.colors.primary}50;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `
      : `
    background: ${props.theme.mode === 'light' ? '#F3F4F6' : props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover:not(:disabled) {
      background: ${props.theme.mode === 'light' ? '#E5E7EB' : props.theme.colors.background};
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 32px;
  margin-bottom: 0;
  padding: 24px 40px 32px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  position: sticky;
  bottom: 0;
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 24px 24px;
    gap: 12px;

    button {
      width: 100%;
    }
  }
`;

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  client,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    zipCode: '',
    address: '',
    city: '',
    state: '',
    neighborhood: '',
    type: ClientType.GENERAL,
    status: ClientStatus.ACTIVE,
    incomeRange: '',
    loanRange: '',
    priceRange: '',
    preferences: '',
    notes: '',
    preferredContactMethod: '',
    preferredPropertyType: '',
    preferredCity: '',
    preferredNeighborhood: '',
    minArea: '',
    maxArea: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    minValue: '',
    maxValue: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (client) {
        setFormData({
          name: client.name || '',
          email: client.email || '',
          cpf: client.cpf || '',
          phone: client.phone || '',
          secondaryPhone: client.secondaryPhone || '',
          whatsapp: client.whatsapp || '',
          zipCode: client.zipCode || '',
          address: client.address || '',
          city: client.city || '',
          state: client.state || '',
          neighborhood: client.neighborhood || '',
          type: client.type || ClientType.GENERAL,
          status: client.status || ClientStatus.ACTIVE,
          incomeRange: client.incomeRange || '',
          loanRange: client.loanRange || '',
          priceRange: client.priceRange || '',
          preferences: client.preferences || '',
          notes: client.notes || '',
          preferredContactMethod: client.preferredContactMethod || '',
          preferredPropertyType: client.preferredPropertyType || '',
          preferredCity: client.preferredCity || '',
          preferredNeighborhood: client.preferredNeighborhood || '',
          minArea: client.minArea || '',
          maxArea: client.maxArea || '',
          minBedrooms: client.minBedrooms || '',
          maxBedrooms: client.maxBedrooms || '',
          minBathrooms: client.minBathrooms || '',
          minValue: client.minValue || '',
          maxValue: client.maxValue || '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          cpf: '',
          phone: '',
          secondaryPhone: '',
          whatsapp: '',
          zipCode: '',
          address: '',
          city: '',
          state: '',
          neighborhood: '',
          type: ClientType.GENERAL,
          status: ClientStatus.ACTIVE,
          incomeRange: '',
          loanRange: '',
          priceRange: '',
          preferences: '',
          notes: '',
          preferredContactMethod: '',
          preferredPropertyType: '',
          preferredCity: '',
          preferredNeighborhood: '',
          minArea: '',
          maxArea: '',
          minBedrooms: '',
          maxBedrooms: '',
          minBathrooms: '',
          minValue: '',
          maxValue: '',
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [client, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando ele for modificado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
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
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <TitleIcon>
              <MdPerson size={20} />
            </TitleIcon>
            <ModalTitle>
              {client ? 'Editar Cliente' : 'Novo Cliente'}
            </ModalTitle>
          </HeaderContent>
          <CloseButton onClick={handleClose}>
            <MdClose size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPerson size={20} />
                </SectionIcon>
                <SectionTitle>Informações Básicas</SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdPerson size={16} />
                  </IconWrapper>
                  Nome Completo *
                </Label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Digite o nome completo do cliente...'
                  $hasError={!!errors.name}
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdEmail size={16} />
                    </IconWrapper>
                    Email *
                  </Label>
                  <Input
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='email@exemplo.com'
                    $hasError={!!errors.email}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPerson size={16} />
                    </IconWrapper>
                    CPF *
                  </Label>
                  <Input
                    type='text'
                    value={formData.cpf}
                    onChange={e => handleInputChange('cpf', e.target.value)}
                    placeholder='000.000.000-00'
                    $hasError={!!errors.cpf}
                  />
                  {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
                </FormGroup>
              </GridContainer>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPhone size={16} />
                    </IconWrapper>
                    Tipo *
                  </Label>
                  <Select
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    $hasError={!!errors.type}
                  >
                    {Object.entries(CLIENT_TYPE_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPerson size={16} />
                    </IconWrapper>
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                    $hasError={!!errors.status}
                  >
                    {Object.entries(CLIENT_STATUS_LABELS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </Select>
                </FormGroup>
              </GridContainer>
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPhone size={20} />
                </SectionIcon>
                <SectionTitle>Contatos</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPhone size={16} />
                    </IconWrapper>
                    Telefone Principal *
                  </Label>
                  <Input
                    type='tel'
                    value={formData.phone}
                    onChange={e =>
                      handleInputChange('phone', maskPhoneAuto(e.target.value))
                    }
                    placeholder='(11) 99999-9999'
                    maxLength={15}
                    $hasError={!!errors.phone}
                  />
                  {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPhone size={16} />
                    </IconWrapper>
                    Telefone Secundário
                  </Label>
                  <Input
                    type='tel'
                    value={formData.secondaryPhone}
                    onChange={e =>
                      handleInputChange(
                        'secondaryPhone',
                        maskPhoneAuto(e.target.value)
                      )
                    }
                    placeholder='(11) 99999-9999'
                    maxLength={15}
                  />
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdPhone size={16} />
                  </IconWrapper>
                  WhatsApp
                </Label>
                <Input
                  type='tel'
                  value={formData.whatsapp}
                  onChange={e =>
                    handleInputChange('whatsapp', maskPhoneAuto(e.target.value))
                  }
                  placeholder='(11) 99999-9999'
                  maxLength={15}
                />
              </FormGroup>
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdLocationOn size={20} />
                </SectionIcon>
                <SectionTitle>Endereço</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdLocationOn size={16} />
                    </IconWrapper>
                    CEP *
                  </Label>
                  <Input
                    type='text'
                    value={formData.zipCode}
                    onChange={e => handleInputChange('zipCode', e.target.value)}
                    placeholder='00000-000'
                    $hasError={!!errors.zipCode}
                  />
                  {errors.zipCode && (
                    <ErrorMessage>{errors.zipCode}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdLocationOn size={16} />
                    </IconWrapper>
                    Estado *
                  </Label>
                  <Input
                    type='text'
                    value={formData.state}
                    onChange={e => handleInputChange('state', e.target.value)}
                    placeholder='SP'
                    maxLength={2}
                    $hasError={!!errors.state}
                  />
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FormGroup>
              </GridContainer>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdLocationOn size={16} />
                    </IconWrapper>
                    Cidade *
                  </Label>
                  <Input
                    type='text'
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    placeholder='São Paulo'
                    $hasError={!!errors.city}
                  />
                  {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdLocationOn size={16} />
                    </IconWrapper>
                    Bairro *
                  </Label>
                  <Input
                    type='text'
                    value={formData.neighborhood}
                    onChange={e =>
                      handleInputChange('neighborhood', e.target.value)
                    }
                    placeholder='Centro'
                    $hasError={!!errors.neighborhood}
                  />
                  {errors.neighborhood && (
                    <ErrorMessage>{errors.neighborhood}</ErrorMessage>
                  )}
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdLocationOn size={16} />
                  </IconWrapper>
                  Endereço Completo *
                </Label>
                <Input
                  type='text'
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder='Rua das Flores, 123'
                  $hasError={!!errors.address}
                />
                {errors.address && (
                  <ErrorMessage>{errors.address}</ErrorMessage>
                )}
              </FormGroup>
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdHome size={20} />
                </SectionIcon>
                <SectionTitle>Preferências Imobiliárias</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdHome size={16} />
                    </IconWrapper>
                    Cidade Preferida
                  </Label>
                  <Input
                    type='text'
                    value={formData.preferredCity}
                    onChange={e =>
                      handleInputChange('preferredCity', e.target.value)
                    }
                    placeholder='São Paulo'
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdHome size={16} />
                    </IconWrapper>
                    Bairro Preferido
                  </Label>
                  <Input
                    type='text'
                    value={formData.preferredNeighborhood}
                    onChange={e =>
                      handleInputChange('preferredNeighborhood', e.target.value)
                    }
                    placeholder='Centro'
                  />
                </FormGroup>
              </GridContainer>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdHome size={16} />
                    </IconWrapper>
                    Valor Mínimo (R$)
                  </Label>
                  <NumericFormat
                    customInput={Input}
                    thousandSeparator='.'
                    decimalSeparator=','
                    prefix='R$ '
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    placeholder='R$ 0,00'
                    value={formData.minValue}
                    onValueChange={values => {
                      handleInputChange('minValue', values.floatValue || '');
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdHome size={16} />
                    </IconWrapper>
                    Valor Máximo (R$)
                  </Label>
                  <NumericFormat
                    customInput={Input}
                    thousandSeparator='.'
                    decimalSeparator=','
                    prefix='R$ '
                    decimalScale={2}
                    fixedDecimalScale
                    allowNegative={false}
                    placeholder='R$ 0,00'
                    value={formData.maxValue}
                    onValueChange={values => {
                      handleInputChange('maxValue', values.floatValue || '');
                    }}
                  />
                </FormGroup>
              </GridContainer>
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdNote size={20} />
                </SectionIcon>
                <SectionTitle>Observações</SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdNote size={16} />
                  </IconWrapper>
                  Observações
                </Label>
                <TextArea
                  value={formData.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                  placeholder='Informações adicionais sobre o cliente...'
                  $hasError={!!errors.notes}
                />
              </FormGroup>
            </Section>
          </Form>

          <ButtonGroup>
            <Button
              type='button'
              $variant='secondary'
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='button'
              $variant='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : client ? 'Atualizar' : 'Criar'}{' '}
              Cliente
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
