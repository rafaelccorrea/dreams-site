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
  MdAccountBalance,
  MdAssignment,
  MdFavorite,
  MdRefresh,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import {
  useClients,
  MaritalStatus,
  EmploymentStatus,
} from '../../hooks/useClients';
import { useSpouse } from '../../hooks/useSpouse';
import { useStatesCities } from '../../hooks/useStatesCities';
import {
  ClientType,
  ClientStatus,
  CLIENT_TYPE_LABELS,
  CLIENT_STATUS_LABELS,
  ClientSource,
  CLIENT_SOURCE_LABELS,
} from '../../types/client';
import {
  MARITAL_STATUS_LABELS,
  EMPLOYMENT_STATUS_LABELS,
  CONTRACT_TYPE_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
} from '../../types/client';
import {
  validateEmail,
  maskPhoneAuto,
  maskCPF,
  maskRG,
  maskCEP,
  validateCreditScore,
} from '../../utils/masks';
import { SpouseForm } from './SpouseForm';
import { DesiredFeaturesInput } from '../common/DesiredFeaturesInput';
import type { DesiredFeatures } from '../../types/match';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: any) => Promise<void>;
  client?: any;
}

// Styled Components (mantidos do arquivo original)
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  z-index: 999999;
  overflow-y: auto;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ModalContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  width: calc(100% - 40px);
  max-width: 1200px;
  margin: 100px auto 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.theme.colors.border};
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
  padding: 24px;
  background: ${props => props.theme.colors.surface};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthSection = styled.div`
  grid-column: 1 / -1;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
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
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
`;

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  client,
}) => {
  const { createSpouse, updateSpouse, deleteSpouse } = useSpouse();
  const {
    states,
    cities,
    selectedState,
    selectedCity,
    loadingStates,
    loadingCities,
    setSelectedState,
    setSelectedCity,
    getCityDisplayName,
  } = useStatesCities();

  const [formData, setFormData] = useState({
    // Dados básicos
    name: '',
    email: '',
    cpf: '',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    birthDate: '',
    anniversaryDate: '',
    rg: '',

    // Endereço
    zipCode: '',
    address: '',
    city: '',
    state: '',
    neighborhood: '',

    // Tipo e status
    type: ClientType.GENERAL,
    status: ClientStatus.ACTIVE,
    leadSource: '',

    // Situação pessoal
    maritalStatus: '',
    hasDependents: false,
    numberOfDependents: '',
    dependentsNotes: '',

    // Dados profissionais
    employmentStatus: '',
    companyName: '',
    jobPosition: '',
    jobStartDate: '',
    jobEndDate: '',
    isCurrentlyWorking: true,
    companyTimeMonths: '',
    contractType: '',
    isRetired: false,

    // Dados financeiros
    monthlyIncome: '',
    grossSalary: '',
    netSalary: '',
    thirteenthSalary: '',
    vacationPay: '',
    otherIncomeSources: '',
    otherIncomeAmount: '',
    familyIncome: '',
    creditScore: '',
    lastCreditCheck: '',

    // Dados bancários
    bankName: '',
    bankAgency: '',
    accountType: '',

    // Patrimônio
    hasProperty: false,
    hasVehicle: false,

    // Referências
    referenceName: '',
    referencePhone: '',
    referenceRelationship: '',
    professionalReferenceName: '',
    professionalReferencePhone: '',
    professionalReferencePosition: '',

    // Preferências imobiliárias
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
    desiredFeatures: {},
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [cepTimeout, setCepTimeout] = useState<NodeJS.Timeout | null>(null);

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
          birthDate: client.birthDate || '',
          anniversaryDate: client.anniversaryDate || '',
          rg: client.rg || '',
          zipCode: client.zipCode || '',
          address: client.address || '',
          city: client.city || '',
          state: client.state || '',
          neighborhood: client.neighborhood || '',
          type: client.type || ClientType.GENERAL,
          status: client.status || ClientStatus.ACTIVE,
          leadSource: client.leadSource || '',
          maritalStatus: client.maritalStatus || '',
          hasDependents: client.hasDependents || false,
          numberOfDependents: client.numberOfDependents || '',
          dependentsNotes: client.dependentsNotes || '',
          employmentStatus: client.employmentStatus || '',
          companyName: client.companyName || '',
          jobPosition: client.jobPosition || '',
          jobStartDate: client.jobStartDate || '',
          jobEndDate: client.jobEndDate || '',
          isCurrentlyWorking: client.isCurrentlyWorking ?? true,
          companyTimeMonths: client.companyTimeMonths || '',
          contractType: client.contractType || '',
          isRetired: client.isRetired || false,
          monthlyIncome: client.monthlyIncome || '',
          grossSalary: client.grossSalary || '',
          netSalary: client.netSalary || '',
          thirteenthSalary: client.thirteenthSalary || '',
          vacationPay: client.vacationPay || '',
          otherIncomeSources: client.otherIncomeSources || '',
          otherIncomeAmount: client.otherIncomeAmount || '',
          familyIncome: client.familyIncome || '',
          creditScore: client.creditScore || '',
          lastCreditCheck: client.lastCreditCheck || '',
          bankName: client.bankName || '',
          bankAgency: client.bankAgency || '',
          accountType: client.accountType || '',
          hasProperty: client.hasProperty || false,
          hasVehicle: client.hasVehicle || false,
          referenceName: client.referenceName || '',
          referencePhone: client.referencePhone || '',
          referenceRelationship: client.referenceRelationship || '',
          professionalReferenceName: client.professionalReferenceName || '',
          professionalReferencePhone: client.professionalReferencePhone || '',
          professionalReferencePosition:
            client.professionalReferencePosition || '',
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
          desiredFeatures: client.desiredFeatures || {},
        });
      } else {
        // Reset form for new client
        setFormData({
          name: '',
          email: '',
          cpf: '',
          phone: '',
          secondaryPhone: '',
          whatsapp: '',
          birthDate: '',
          anniversaryDate: '',
          rg: '',
          zipCode: '',
          address: '',
          city: '',
          state: '',
          neighborhood: '',
          type: ClientType.GENERAL,
          status: ClientStatus.ACTIVE,
          leadSource: '',
          maritalStatus: '',
          hasDependents: false,
          numberOfDependents: '',
          dependentsNotes: '',
          employmentStatus: '',
          companyName: '',
          jobPosition: '',
          jobStartDate: '',
          jobEndDate: '',
          isCurrentlyWorking: true,
          companyTimeMonths: '',
          contractType: '',
          isRetired: false,
          monthlyIncome: '',
          grossSalary: '',
          netSalary: '',
          thirteenthSalary: '',
          vacationPay: '',
          otherIncomeSources: '',
          otherIncomeAmount: '',
          familyIncome: '',
          creditScore: '',
          lastCreditCheck: '',
          bankName: '',
          bankAgency: '',
          accountType: '',
          hasProperty: false,
          hasVehicle: false,
          referenceName: '',
          referencePhone: '',
          referenceRelationship: '',
          professionalReferenceName: '',
          professionalReferencePhone: '',
          professionalReferencePosition: '',
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
          desiredFeatures: {},
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [client, isOpen]);

  // Cleanup timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (cepTimeout) {
        clearTimeout(cepTimeout);
      }
    };
  }, [cepTimeout]);

  // Carregar estado e cidade quando cliente for editado
  useEffect(() => {
    if (client && client.preferredCity) {
      // Tentar extrair estado e cidade do campo preferredCity
      const cityParts = client.preferredCity.split(' - ');
      if (cityParts.length === 2) {
        const cityName = cityParts[0];
        const stateSigla = cityParts[1];

        // Encontrar o estado pela sigla
        const state = states.find(s => s.sigla === stateSigla);
        if (state) {
          setSelectedState(state);

          // Aguardar as cidades carregarem e então encontrar a cidade
          setTimeout(() => {
            const city = cities.find(c => c.nome === cityName);
            if (city) {
              setSelectedCity(city);
            }
          }, 1000);
        }
      }
    }
  }, [client, states, cities]);

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

    // Validar creditScore se preenchido
    if (formData.creditScore) {
      const score = parseFloat(formData.creditScore.toString());
      if (!validateCreditScore(score)) {
        newErrors.creditScore = 'Score de crédito deve estar entre 0 e 1000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');

    if (cleanCEP.length !== 8) return;

    setIsLoadingCEP(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCEP}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }

    // Buscar endereço automaticamente quando CEP for preenchido (com debounce)
    if (field === 'zipCode' && value) {
      if (cepTimeout) {
        clearTimeout(cepTimeout);
      }

      const timeout = setTimeout(() => {
        fetchAddressByCEP(value);
      }, 500); // 500ms de delay

      setCepTimeout(timeout);
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

  const handleSpouseSave = async (spouseData: any) => {
    if (!client?.id) return;

    if (client.spouse?.id) {
      await updateSpouse(client.spouse.id, spouseData);
    } else {
      await createSpouse(client.id, spouseData);
    }
  };

  const handleSpouseDelete = async (spouseId: string) => {
    await deleteSpouse(spouseId);
  };

  const shouldShowSpouse =
    formData.maritalStatus === MaritalStatus.MARRIED ||
    formData.maritalStatus === MaritalStatus.COMMON_LAW;
  const shouldShowDependentsDetails = formData.hasDependents;
  const shouldShowEmploymentFields =
    formData.employmentStatus === EmploymentStatus.EMPLOYED ||
    formData.employmentStatus === EmploymentStatus.SELF_EMPLOYED;
  const shouldShowJobEndDate = !formData.isCurrentlyWorking;

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
            {/* Seção: Informações Básicas */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPerson size={20} />
                </SectionIcon>
                <SectionTitle>👤 Dados Básicos</SectionTitle>
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
                  placeholder='Digite o nome completo...'
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
                    onChange={e =>
                      handleInputChange('cpf', maskCPF(e.target.value))
                    }
                    placeholder='000.000.000-00'
                    maxLength={14}
                    $hasError={!!errors.cpf}
                  />
                  {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
                </FormGroup>
              </GridContainer>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPerson size={16} />
                    </IconWrapper>
                    RG
                  </Label>
                  <Input
                    type='text'
                    value={formData.rg}
                    onChange={e =>
                      handleInputChange('rg', maskRG(e.target.value))
                    }
                    placeholder='00.000.000-0'
                    maxLength={12}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPerson size={16} />
                    </IconWrapper>
                    Data de Nascimento
                  </Label>
                  <Input
                    type='date'
                    value={formData.birthDate}
                    onChange={e =>
                      handleInputChange('birthDate', e.target.value)
                    }
                  />
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdPerson size={16} />
                  </IconWrapper>
                  Tipo *
                </Label>
                <Select
                  value={formData.type}
                  onChange={e => handleInputChange('type', e.target.value)}
                >
                  {Object.entries(CLIENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
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

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdPerson size={16} />
                  </IconWrapper>
                  Origem do Lead
                </Label>
                <Select
                  value={formData.leadSource}
                  onChange={e =>
                    handleInputChange('leadSource', e.target.value)
                  }
                >
                  <option value=''>Selecione...</option>
                  {Object.entries(CLIENT_SOURCE_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Select>
              </FormGroup>
            </Section>

            {/* Seção: Contatos */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdPhone size={20} />
                </SectionIcon>
                <SectionTitle>📞 Contatos</SectionTitle>
              </SectionHeader>

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

              <GridContainer>
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
                      handleInputChange(
                        'whatsapp',
                        maskPhoneAuto(e.target.value)
                      )
                    }
                    placeholder='(11) 99999-9999'
                    maxLength={15}
                  />
                </FormGroup>
              </GridContainer>
            </Section>

            {/* Seção: Endereço */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdLocationOn size={20} />
                </SectionIcon>
                <SectionTitle>📍 Endereço</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      {isLoadingCEP ? (
                        <MdRefresh
                          size={16}
                          style={{ animation: 'spin 1s linear infinite' }}
                        />
                      ) : (
                        <MdLocationOn size={16} />
                      )}
                    </IconWrapper>
                    CEP *{' '}
                    {isLoadingCEP && (
                      <span
                        style={{
                          color: '#10B981',
                          fontSize: '12px',
                          marginLeft: '8px',
                        }}
                      >
                        Buscando...
                      </span>
                    )}
                  </Label>
                  <Input
                    type='text'
                    value={formData.zipCode}
                    onChange={e =>
                      handleInputChange('zipCode', maskCEP(e.target.value))
                    }
                    placeholder='00000-000'
                    maxLength={9}
                    $hasError={!!errors.zipCode}
                    disabled={isLoadingCEP}
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
                    onChange={e =>
                      handleInputChange('state', e.target.value.toUpperCase())
                    }
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
                  placeholder='Rua das Flores, 123, Apto 45'
                  $hasError={!!errors.address}
                />
                {errors.address && (
                  <ErrorMessage>{errors.address}</ErrorMessage>
                )}
              </FormGroup>
            </Section>

            {/* Seção: Situação Pessoal */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdFavorite size={20} />
                </SectionIcon>
                <SectionTitle>💍 Situação Pessoal</SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdFavorite size={16} />
                  </IconWrapper>
                  Estado Civil
                </Label>
                <Select
                  value={formData.maritalStatus}
                  onChange={e =>
                    handleInputChange('maritalStatus', e.target.value)
                  }
                >
                  <option value=''>Selecione...</option>
                  {Object.entries(MARITAL_STATUS_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Select>
              </FormGroup>

              <CheckboxGroup>
                <Checkbox
                  type='checkbox'
                  checked={formData.hasDependents}
                  onChange={e =>
                    handleInputChange('hasDependents', e.target.checked)
                  }
                />
                <label>Possui dependentes</label>
              </CheckboxGroup>

              {shouldShowDependentsDetails && (
                <>
                  <FormGroup>
                    <Label>
                      <IconWrapper>
                        <MdPerson size={16} />
                      </IconWrapper>
                      Número de Dependentes
                    </Label>
                    <Input
                      type='number'
                      min='0'
                      value={formData.numberOfDependents}
                      onChange={e =>
                        handleInputChange('numberOfDependents', e.target.value)
                      }
                      placeholder='Quantos dependentes?'
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>
                      <IconWrapper>
                        <MdNote size={16} />
                      </IconWrapper>
                      Observações sobre Dependentes
                    </Label>
                    <TextArea
                      value={formData.dependentsNotes}
                      onChange={e =>
                        handleInputChange('dependentsNotes', e.target.value)
                      }
                      placeholder='Informações sobre os dependentes...'
                    />
                  </FormGroup>
                </>
              )}
            </Section>

            {/* Seção: Dados Profissionais */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdBusiness size={20} />
                </SectionIcon>
                <SectionTitle>💼 Dados Profissionais</SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdBusiness size={16} />
                  </IconWrapper>
                  Situação Profissional
                </Label>
                <Select
                  value={formData.employmentStatus}
                  onChange={e =>
                    handleInputChange('employmentStatus', e.target.value)
                  }
                >
                  <option value=''>Selecione...</option>
                  {Object.entries(EMPLOYMENT_STATUS_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Select>
              </FormGroup>

              {shouldShowEmploymentFields && (
                <>
                  <GridContainer>
                    <FormGroup>
                      <Label>
                        <IconWrapper>
                          <MdBusiness size={16} />
                        </IconWrapper>
                        Empresa
                      </Label>
                      <Input
                        type='text'
                        value={formData.companyName}
                        onChange={e =>
                          handleInputChange('companyName', e.target.value)
                        }
                        placeholder='Nome da empresa...'
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <IconWrapper>
                          <MdBusiness size={16} />
                        </IconWrapper>
                        Cargo/Função
                      </Label>
                      <Input
                        type='text'
                        value={formData.jobPosition}
                        onChange={e =>
                          handleInputChange('jobPosition', e.target.value)
                        }
                        placeholder='Cargo atual...'
                      />
                    </FormGroup>
                  </GridContainer>

                  <GridContainer>
                    <FormGroup>
                      <Label>
                        <IconWrapper>
                          <MdBusiness size={16} />
                        </IconWrapper>
                        Tipo de Contrato
                      </Label>
                      <Select
                        value={formData.contractType}
                        onChange={e =>
                          handleInputChange('contractType', e.target.value)
                        }
                      >
                        <option value=''>Selecione...</option>
                        {CONTRACT_TYPE_OPTIONS.map(type => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        <IconWrapper>
                          <MdBusiness size={16} />
                        </IconWrapper>
                        Data de Início
                      </Label>
                      <Input
                        type='date'
                        value={formData.jobStartDate}
                        onChange={e =>
                          handleInputChange('jobStartDate', e.target.value)
                        }
                      />
                    </FormGroup>
                  </GridContainer>

                  <CheckboxGroup>
                    <Checkbox
                      type='checkbox'
                      checked={formData.isCurrentlyWorking}
                      onChange={e =>
                        handleInputChange(
                          'isCurrentlyWorking',
                          e.target.checked
                        )
                      }
                    />
                    <label>Ainda está trabalhando</label>
                  </CheckboxGroup>

                  {shouldShowJobEndDate && (
                    <FormGroup>
                      <Label>
                        <IconWrapper>
                          <MdBusiness size={16} />
                        </IconWrapper>
                        Data de Término
                      </Label>
                      <Input
                        type='date'
                        value={formData.jobEndDate}
                        onChange={e =>
                          handleInputChange('jobEndDate', e.target.value)
                        }
                      />
                    </FormGroup>
                  )}
                </>
              )}

              <CheckboxGroup>
                <Checkbox
                  type='checkbox'
                  checked={formData.isRetired}
                  onChange={e =>
                    handleInputChange('isRetired', e.target.checked)
                  }
                />
                <label>É aposentado(a)</label>
              </CheckboxGroup>
            </Section>

            {/* Seção: Informações Financeiras */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdAccountBalance size={20} />
                </SectionIcon>
                <SectionTitle>💰 Informações Financeiras</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Renda Mensal
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
                    value={formData.monthlyIncome}
                    onValueChange={values => {
                      handleInputChange(
                        'monthlyIncome',
                        values.floatValue || ''
                      );
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Renda Familiar
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
                    value={formData.familyIncome}
                    onValueChange={values => {
                      handleInputChange(
                        'familyIncome',
                        values.floatValue || ''
                      );
                    }}
                  />
                </FormGroup>
              </GridContainer>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Salário Bruto
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
                    value={formData.grossSalary}
                    onValueChange={values => {
                      handleInputChange('grossSalary', values.floatValue || '');
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Salário Líquido
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
                    value={formData.netSalary}
                    onValueChange={values => {
                      handleInputChange('netSalary', values.floatValue || '');
                    }}
                  />
                </FormGroup>
              </GridContainer>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Score de Crédito (0-1000)
                  </Label>
                  <Input
                    type='number'
                    min='0'
                    max='1000'
                    value={formData.creditScore}
                    onChange={e =>
                      handleInputChange('creditScore', e.target.value)
                    }
                    placeholder='Ex: 750'
                    $hasError={!!errors.creditScore}
                  />
                  {errors.creditScore && (
                    <ErrorMessage>{errors.creditScore}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Última Consulta de Crédito
                  </Label>
                  <Input
                    type='date'
                    value={formData.lastCreditCheck}
                    onChange={e =>
                      handleInputChange('lastCreditCheck', e.target.value)
                    }
                  />
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdAccountBalance size={16} />
                  </IconWrapper>
                  Outras Fontes de Renda
                </Label>
                <TextArea
                  value={formData.otherIncomeSources}
                  onChange={e =>
                    handleInputChange('otherIncomeSources', e.target.value)
                  }
                  placeholder='Descreva outras fontes de renda (aluguel, investimentos, etc)...'
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdAccountBalance size={16} />
                  </IconWrapper>
                  Valor de Outras Rendas
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
                  value={formData.otherIncomeAmount}
                  onValueChange={values => {
                    handleInputChange(
                      'otherIncomeAmount',
                      values.floatValue || ''
                    );
                  }}
                />
              </FormGroup>
            </Section>

            {/* Seção: Dados Bancários */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdAccountBalance size={20} />
                </SectionIcon>
                <SectionTitle>🏦 Dados Bancários</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Banco
                  </Label>
                  <Input
                    type='text'
                    value={formData.bankName}
                    onChange={e =>
                      handleInputChange('bankName', e.target.value)
                    }
                    placeholder='Nome do banco...'
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdAccountBalance size={16} />
                    </IconWrapper>
                    Agência
                  </Label>
                  <Input
                    type='text'
                    value={formData.bankAgency}
                    onChange={e =>
                      handleInputChange('bankAgency', e.target.value)
                    }
                    placeholder='0000'
                  />
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdAccountBalance size={16} />
                  </IconWrapper>
                  Tipo de Conta
                </Label>
                <Select
                  value={formData.accountType}
                  onChange={e =>
                    handleInputChange('accountType', e.target.value)
                  }
                >
                  <option value=''>Selecione...</option>
                  {ACCOUNT_TYPE_OPTIONS.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </Section>

            {/* Seção: Patrimônio */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdHome size={20} />
                </SectionIcon>
                <SectionTitle>🏠 Patrimônio e Bens</SectionTitle>
              </SectionHeader>

              <CheckboxGroup>
                <Checkbox
                  type='checkbox'
                  checked={formData.hasProperty}
                  onChange={e =>
                    handleInputChange('hasProperty', e.target.checked)
                  }
                />
                <label>Possui imóvel próprio</label>
              </CheckboxGroup>

              <CheckboxGroup>
                <Checkbox
                  type='checkbox'
                  checked={formData.hasVehicle}
                  onChange={e =>
                    handleInputChange('hasVehicle', e.target.checked)
                  }
                />
                <label>Possui veículo próprio</label>
              </CheckboxGroup>
            </Section>

            {/* Seção: Referências */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdAssignment size={20} />
                </SectionIcon>
                <SectionTitle>📞 Referências</SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdPerson size={16} />
                  </IconWrapper>
                  Nome da Referência Pessoal
                </Label>
                <Input
                  type='text'
                  value={formData.referenceName}
                  onChange={e =>
                    handleInputChange('referenceName', e.target.value)
                  }
                  placeholder='Nome completo...'
                />
              </FormGroup>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPhone size={16} />
                    </IconWrapper>
                    Telefone da Referência
                  </Label>
                  <Input
                    type='tel'
                    value={formData.referencePhone}
                    onChange={e =>
                      handleInputChange(
                        'referencePhone',
                        maskPhoneAuto(e.target.value)
                      )
                    }
                    placeholder='(11) 99999-9999'
                    maxLength={15}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPerson size={16} />
                    </IconWrapper>
                    Relação
                  </Label>
                  <Input
                    type='text'
                    value={formData.referenceRelationship}
                    onChange={e =>
                      handleInputChange('referenceRelationship', e.target.value)
                    }
                    placeholder='Amigo, familiar, etc...'
                  />
                </FormGroup>
              </GridContainer>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdPerson size={16} />
                  </IconWrapper>
                  Nome da Referência Profissional
                </Label>
                <Input
                  type='text'
                  value={formData.professionalReferenceName}
                  onChange={e =>
                    handleInputChange(
                      'professionalReferenceName',
                      e.target.value
                    )
                  }
                  placeholder='Nome completo...'
                />
              </FormGroup>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdPhone size={16} />
                    </IconWrapper>
                    Telefone Profissional
                  </Label>
                  <Input
                    type='tel'
                    value={formData.professionalReferencePhone}
                    onChange={e =>
                      handleInputChange(
                        'professionalReferencePhone',
                        maskPhoneAuto(e.target.value)
                      )
                    }
                    placeholder='(11) 99999-9999'
                    maxLength={15}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdBusiness size={16} />
                    </IconWrapper>
                    Cargo/Posição
                  </Label>
                  <Input
                    type='text'
                    value={formData.professionalReferencePosition}
                    onChange={e =>
                      handleInputChange(
                        'professionalReferencePosition',
                        e.target.value
                      )
                    }
                    placeholder='Cargo da referência...'
                  />
                </FormGroup>
              </GridContainer>
            </Section>

            {/* Seção: Preferências Imobiliárias */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdHome size={20} />
                </SectionIcon>
                <SectionTitle>🏘️ Preferências Imobiliárias</SectionTitle>
              </SectionHeader>

              <GridContainer>
                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdHome size={16} />
                    </IconWrapper>
                    Estado Preferido
                  </Label>
                  <Select
                    value={selectedState?.id || ''}
                    onChange={e => {
                      const stateId = parseInt(e.target.value);
                      const state = states.find(s => s.id === stateId);
                      setSelectedState(state || null);
                      handleInputChange('preferredCity', getCityDisplayName());
                    }}
                    disabled={loadingStates}
                  >
                    <option value=''>
                      {loadingStates
                        ? 'Carregando estados...'
                        : 'Selecione o estado'}
                    </option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.nome} - {state.sigla}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>
                    <IconWrapper>
                      <MdHome size={16} />
                    </IconWrapper>
                    Cidade Preferida
                  </Label>
                  <Select
                    value={selectedCity?.id || ''}
                    onChange={e => {
                      const cityId = parseInt(e.target.value);
                      const city = cities.find(c => c.id === cityId);
                      setSelectedCity(city || null);
                      handleInputChange('preferredCity', getCityDisplayName());
                    }}
                    disabled={!selectedState || loadingCities}
                  >
                    <option value=''>
                      {!selectedState
                        ? 'Selecione primeiro o estado'
                        : loadingCities
                          ? 'Carregando cidades...'
                          : 'Selecione a cidade'}
                    </option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.nome}
                      </option>
                    ))}
                  </Select>
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
                    Valor Mínimo
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
                    Valor Máximo
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

            {/* Seção: Características Desejadas */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdFavorite size={20} />
                </SectionIcon>
                <SectionTitle>✨ Características Desejadas</SectionTitle>
              </SectionHeader>

              <DesiredFeaturesInput
                value={formData.desiredFeatures as DesiredFeatures}
                onChange={features =>
                  handleInputChange('desiredFeatures', features)
                }
              />
            </Section>

            {/* Seção: Observações */}
            <Section>
              <SectionHeader>
                <SectionIcon>
                  <MdNote size={20} />
                </SectionIcon>
                <SectionTitle>📝 Observações</SectionTitle>
              </SectionHeader>

              <FormGroup>
                <Label>
                  <IconWrapper>
                    <MdNote size={16} />
                  </IconWrapper>
                  Observações Gerais
                </Label>
                <TextArea
                  value={formData.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                  placeholder='Informações adicionais sobre o cliente...'
                />
              </FormGroup>
            </Section>

            {/* Seção: Cônjuge (Full Width) */}
            {client && shouldShowSpouse && (
              <FullWidthSection>
                <SpouseForm
                  clientId={client.id}
                  spouse={client.spouse}
                  onSave={handleSpouseSave}
                  onDelete={handleSpouseDelete}
                />
              </FullWidthSection>
            )}
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
