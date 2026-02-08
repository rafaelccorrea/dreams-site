import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  MdClose,
  MdFilterList,
  MdPerson,
  MdBadge,
  MdHome,
  MdCalendarToday,
  MdAttachMoney,
  MdCheckCircle,
} from 'react-icons/md';
import type { RentalFilter, RentalStatus } from '@/types/rental.types';
import { RentalStatusOptions } from '@/types/rental.types';
import { useProperties } from '@/hooks/useProperties';
import { maskCPF, maskCNPJ } from '@/utils/masks';
import { useDebounce } from '@/hooks/useDebounce';
import DataScopeFilter from '../common/DataScopeFilter';

interface RentalFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RentalFilter;
  onApplyFilters: (filters: RentalFilter) => void;
  onClearFilters: () => void;
}

export const RentalFiltersModal: React.FC<RentalFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const { properties } = useProperties();
  const [localFilters, setLocalFilters] = useState<RentalFilter>(filters);

  // Estados locais para campos de texto com debounce
  const [tenantNameInput, setTenantNameInput] = useState(
    filters.tenantName || ''
  );
  const [tenantDocumentInput, setTenantDocumentInput] = useState(
    filters.tenantDocument || ''
  );

  // Aplicar debounce (500ms, mínimo 3 caracteres)
  const debouncedTenantName = useDebounce(tenantNameInput, 500, 3);
  const debouncedTenantDocument = useDebounce(tenantDocumentInput, 500, 3);

  // Sincronizar valores debounced com os filtros locais
  useEffect(() => {
    if (tenantNameInput.length >= 3 || tenantNameInput.length === 0) {
      setLocalFilters(prev => ({ ...prev, tenantName: debouncedTenantName }));
    }
  }, [debouncedTenantName]);

  useEffect(() => {
    if (tenantDocumentInput.length >= 3 || tenantDocumentInput.length === 0) {
      setLocalFilters(prev => ({
        ...prev,
        tenantDocument: debouncedTenantDocument,
      }));
    }
  }, [debouncedTenantDocument]);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      setTenantNameInput(filters.tenantName || '');
      setTenantDocumentInput(filters.tenantDocument || '');
    }
  }, [isOpen, filters]);

  const handleDocumentChange = (value: string) => {
    // Remove tudo que não é alfanumérico
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');

    // Se tem letras, é CNPJ alfanumérico (independente do tamanho)
    const hasLetters = /[A-Za-z]/.test(cleaned);
    let formatted = '';

    if (hasLetters) {
      // CNPJ alfanumérico da SERPRO
      formatted = maskCNPJ(value);
    } else if (cleaned.length <= 11) {
      // CPF (só números, 11 dígitos)
      formatted = maskCPF(value);
    } else {
      // CNPJ numérico (só números, mais de 11 dígitos)
      formatted = maskCNPJ(value);
    }

    setLocalFilters({ ...localFilters, tenantDocument: formatted });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setTenantNameInput('');
    setTenantDocumentInput('');
    setLocalFilters({ page: 1, limit: 12, onlyMyData: false });
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    const filterKeys = Object.keys(localFilters).filter(
      key => key !== 'page' && key !== 'limit'
    );
    return filterKeys.filter(key => {
      const value = localFilters[key as keyof RentalFilter];
      return value !== undefined && value !== null && value !== '';
    }).length;
  };

  const activeCount = getActiveFiltersCount();

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose} $isOpen={isOpen}>
      <Modal onClick={e => e.stopPropagation()} $isOpen={isOpen}>
        <Header>
          <TitleSection>
            <IconWrapper>
              <MdFilterList />
            </IconWrapper>
            <TitleWrapper>
              <Title>Filtros Avançados de Aluguel</Title>
              <Subtitle>Refine sua busca com filtros detalhados</Subtitle>
            </TitleWrapper>
          </TitleSection>
          {activeCount > 0 && (
            <ActiveBadge>
              <MdCheckCircle />
              {activeCount}{' '}
              {activeCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </ActiveBadge>
          )}
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Content>
          {/* Seção: Informações do Inquilino */}
          <FilterSection>
            <SectionTitle>
              <MdPerson />
              Informações do Inquilino
            </SectionTitle>
            <FilterGrid>
              <FilterGroup>
                <Label>
                  <MdPerson size={16} />
                  Nome do Inquilino
                  {tenantNameInput.length > 0 && tenantNameInput.length < 3 && (
                    <span
                      style={{
                        color: '#f59e0b',
                        marginLeft: '8px',
                        fontSize: '0.75rem',
                      }}
                    >
                      (mín. 3 caracteres)
                    </span>
                  )}
                </Label>
                <Input
                  type='text'
                  placeholder='Digite o nome completo... (mín. 3 caracteres)'
                  value={tenantNameInput}
                  onChange={e => setTenantNameInput(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <Label>
                  <MdBadge size={16} />
                  Documento (CPF/CNPJ)
                  {tenantDocumentInput.length > 0 &&
                    tenantDocumentInput.length < 3 && (
                      <span
                        style={{
                          color: '#f59e0b',
                          marginLeft: '8px',
                          fontSize: '0.75rem',
                        }}
                      >
                        (mín. 3 caracteres)
                      </span>
                    )}
                </Label>
                <Input
                  type='text'
                  placeholder='Digite o documento... (mín. 3 caracteres)'
                  value={tenantDocumentInput}
                  onChange={e => {
                    const value = e.target.value;
                    // Remove tudo que não é alfanumérico
                    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');
                    const hasLetters = /[A-Za-z]/.test(cleaned);
                    let formatted = '';

                    if (hasLetters) {
                      formatted = maskCNPJ(value);
                    } else if (cleaned.length <= 11) {
                      formatted = maskCPF(value);
                    } else {
                      formatted = maskCNPJ(value);
                    }

                    setTenantDocumentInput(formatted);
                  }}
                  maxLength={18}
                />
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          {/* Seção: Propriedade e Status */}
          <FilterSection>
            <SectionTitle>
              <MdHome />
              Propriedade e Status
            </SectionTitle>
            <FilterGrid>
              <FilterGroup>
                <Label>
                  <MdHome size={16} />
                  Propriedade
                </Label>
                <Select
                  value={localFilters.propertyId || ''}
                  onChange={e =>
                    setLocalFilters({
                      ...localFilters,
                      propertyId: e.target.value,
                    })
                  }
                >
                  <option value=''>Todas as propriedades</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.title}
                    </option>
                  ))}
                </Select>
              </FilterGroup>

              <FilterGroup>
                <Label>
                  <MdCheckCircle size={16} />
                  Status do Aluguel
                </Label>
                <Select
                  value={localFilters.status || ''}
                  onChange={e =>
                    setLocalFilters({
                      ...localFilters,
                      status: e.target.value as RentalStatus,
                    })
                  }
                >
                  <option value=''>Todos os status</option>
                  {RentalStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          {/* Seção: Período */}
          <FilterSection>
            <SectionTitle>
              <MdCalendarToday />
              Período do Contrato
            </SectionTitle>
            <FilterGrid>
              <FilterGroup>
                <Label>
                  <MdCalendarToday size={16} />
                  Data de Início (De)
                </Label>
                <Input
                  type='date'
                  value={localFilters.startDateFrom || ''}
                  onChange={e =>
                    setLocalFilters({
                      ...localFilters,
                      startDateFrom: e.target.value,
                    })
                  }
                />
              </FilterGroup>

              <FilterGroup>
                <Label>
                  <MdCalendarToday size={16} />
                  Data de Início (Até)
                </Label>
                <Input
                  type='date'
                  value={localFilters.startDateTo || ''}
                  onChange={e =>
                    setLocalFilters({
                      ...localFilters,
                      startDateTo: e.target.value,
                    })
                  }
                />
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          {/* Seção: Escopo de Dados */}
          <DataScopeFilter
            onlyMyData={localFilters.onlyMyData}
            onChange={value =>
              setLocalFilters({ ...localFilters, onlyMyData: value })
            }
            label='Mostrar apenas meus aluguéis'
            description='Quando marcado, mostra apenas aluguéis que você criou, ignorando hierarquia de usuários.'
          />
        </Content>

        <Footer>
          <ButtonGroup>
            <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
            {activeCount > 0 && (
              <ClearButton onClick={handleClear}>
                <MdClose />
                Limpar Filtros
              </ClearButton>
            )}
            <ApplyButton onClick={handleApply}>
              <MdFilterList />
              Aplicar Filtros
              {activeCount > 0 && <CountBadge>{activeCount}</CountBadge>}
            </ApplyButton>
          </ButtonGroup>
        </Footer>
      </Modal>
    </Overlay>
  );
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 1.5rem;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid ${props => props.theme.colors.border}40;

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 1.25rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.cardBackground} 0%,
    ${props => props.theme.colors.backgroundSecondary}40 100%
  );
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px ${props => props.theme.colors.primary}40;

  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ActiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15,
    ${props => props.theme.colors.primary}25
  );
  color: ${props => props.theme.colors.primary};
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.primary}40;
  animation: ${pulse} 2s ease-in-out infinite;

  svg {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.danger}20;
    color: ${props => props.theme.colors.danger};
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }

  svg {
    font-size: 1.5rem;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}40;
    border-radius: 10px;
    transition: background 0.2s;

    &:hover {
      background: ${props => props.theme.colors.primary}60;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem;
  background: ${props => props.theme.colors.background}60;
  border-radius: 1.25rem;
  border: 1px solid ${props => props.theme.colors.border}60;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.border};
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}10;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${props => props.theme.colors.border}40;

  svg {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  svg {
    color: ${props => props.theme.colors.primary}80;
  }
`;

const Input = styled.input`
  padding: 0.875rem 1.125rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15;
    background: ${props => props.theme.colors.cardBackground};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.875rem 1.125rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15;
  }

  option {
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
    padding: 0.5rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  padding: 1.75rem 2.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary}40;

  @media (max-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

const SecondaryButton = styled.button`
  padding: 0.875rem 1.75rem;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.text}40;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ClearButton = styled.button`
  padding: 0.875rem 1.75rem;
  background: ${props => props.theme.colors.danger}15;
  color: ${props => props.theme.colors.danger};
  border: 2px solid ${props => props.theme.colors.danger}40;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    background: ${props => props.theme.colors.danger}25;
    border-color: ${props => props.theme.colors.danger};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ApplyButton = styled.button`
  padding: 0.875rem 1.75rem;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  position: relative;

  svg {
    font-size: 1.125rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.theme.colors.primary}50;
  }

  &:active {
    transform: translateY(0);
  }
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
`;
