import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCustomPlanCalculator } from '../../hooks/useCustomPlanCalculator';
import { MdClose, MdCheck } from 'react-icons/md';

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: any[];
  addons: any;
  initialModules?: string[];
  initialAddons?: {
    companies?: number;
    users?: number;
    properties?: number;
    storage?: number;
    apiCalls?: number;
  };
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  z-index: 9999999 !important;
  padding: 100px 20px 20px 20px;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 10000000 !important;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: ${props => props.theme.colors.cardBackground};
  z-index: 1000000;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
`;

const ModuleItem = styled.label<{ $isSelected: boolean; $isDisabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-radius: 8px;
  cursor: ${props => (props.$isDisabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  background: ${props =>
    props.$isSelected
      ? `${props.theme.colors.primary}10`
      : props.theme.colors.background};
  opacity: ${props => (props.$isDisabled ? 0.6 : 1)};

  &:hover {
    ${props =>
      !props.$isDisabled &&
      `
      border-color: ${props.theme.colors.primary};
      transform: translateY(-2px);
    `}
  }
`;

const ModuleCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ModuleDescription = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 2px;
`;

const ModulePrice = styled.div<{ $isFree: boolean }>`
  font-weight: 600;
  color: ${props =>
    props.$isFree ? props.theme.colors.success : props.theme.colors.primary};
  font-size: 0.9rem;
`;

const AddonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const AddonItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const AddonLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddonSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const QuoteSection = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  border: 2px solid ${props => props.theme.colors.primary};
`;

const QuoteTitle = styled.h3`
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
  text-align: center;
`;

const QuoteLine = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

const QuoteSubline = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0 4px 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const QuoteDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 12px 0;
`;

const QuoteTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0 0 0;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 12px;
  border-top: 2px solid ${props => props.theme.colors.primary};
`;

const ContractButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000001;
  border-radius: 16px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
`;

const CloseButtonDisabled = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: not-allowed;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
`;

export const CustomPlanModal: React.FC<CustomPlanModalProps> = ({
  isOpen,
  onClose,
  modules,
  addons,
  initialModules = [],
  initialAddons = {},
}) => {
  const {
    modules: selectedModules,
    setModules,
    toggleModule,
    addons: selectedAddons,
    setAddons,
    updateAddon,
    quote,
    loading,
    error,
  } = useCustomPlanCalculator();

  // Módulos base obrigatórios
  const baseModules = [
    'user_management',
    'company_management',
    'image_gallery',
  ];

  // Inicializar com módulos e addons atuais quando o modal abrir
  useEffect(() => {
    if (isOpen && initialModules.length > 0) {
      setModules(initialModules);
      if (initialAddons && Object.keys(initialAddons).length > 0) {
        setAddons({
          companies: initialAddons.companies || 0,
          users: initialAddons.users || 0,
          properties: initialAddons.properties || 0,
          storage: initialAddons.storage || 0,
          apiCalls: initialAddons.apiCalls || 0,
        });
      }
    }
  }, [isOpen, initialModules, initialAddons, setModules, setAddons]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <ModalOverlay
      $isOpen={isOpen}
      onClick={handleClose}
      style={{ zIndex: 9999999 }}
    >
      <ModalContent
        onClick={e => e.stopPropagation()}
        style={{ zIndex: 10000000 }}
      >
        <ModalHeader>
          <ModalTitle>🛠️ Monte Seu Plano Personalizado</ModalTitle>
          {loading ? (
            <CloseButtonDisabled disabled>
              <MdClose size={24} />
            </CloseButtonDisabled>
          ) : (
            <CloseButton onClick={handleClose}>
              <MdClose size={24} />
            </CloseButton>
          )}
        </ModalHeader>

        <ModalBody>
          {/* Módulos */}
          <Section>
            <SectionTitle>📦 Escolha seus Módulos</SectionTitle>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '16px',
              }}
            >
              Módulos marcados são incluídos na base do plano
            </p>

            <ModulesGrid>
              {modules.map(module => {
                const isBase = baseModules.includes(module.code);
                const isSelected =
                  isBase || selectedModules.includes(module.code);
                const price = parseFloat(module.price);

                return (
                  <ModuleItem
                    key={module.code}
                    $isSelected={isSelected}
                    $isDisabled={isBase}
                  >
                    <ModuleCheckbox
                      type='checkbox'
                      checked={isSelected}
                      disabled={isBase || loading}
                      onChange={() =>
                        !isBase && !loading && toggleModule(module.code)
                      }
                    />
                    <ModuleInfo>
                      <ModuleName>
                        <span>{module.icon}</span>
                        <span>{module.name}</span>
                      </ModuleName>
                      <ModuleDescription>
                        {module.description}
                      </ModuleDescription>
                    </ModuleInfo>
                    <ModulePrice $isFree={price === 0 || isBase}>
                      {price === 0 || isBase
                        ? 'Incluído'
                        : `+ R$ ${price.toFixed(2)}`}
                    </ModulePrice>
                  </ModuleItem>
                );
              })}
            </ModulesGrid>
          </Section>

          {/* Add-ons */}
          <Section>
            <SectionTitle>➕ Recursos Adicionais</SectionTitle>

            <AddonGroup>
              {/* Empresas */}
              {addons.byType?.company && (
                <AddonItem>
                  <AddonLabel>🏢 Empresas Adicionais</AddonLabel>
                  <AddonSelect
                    value={selectedAddons.companies}
                    disabled={loading}
                    onChange={e =>
                      !loading &&
                      updateAddon('companies', parseInt(e.target.value))
                    }
                  >
                    <option value='0'>Nenhuma (R$ 0)</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>
                        {n} empresa{n > 1 ? 's' : ''} (R${' '}
                        {(n * 99.9).toFixed(2)})
                      </option>
                    ))}
                  </AddonSelect>
                </AddonItem>
              )}

              {/* Usuários */}
              {addons.byType?.user && (
                <AddonItem>
                  <AddonLabel>👥 Usuários Adicionais</AddonLabel>
                  <AddonSelect
                    value={selectedAddons.users}
                    disabled={loading}
                    onChange={e =>
                      !loading && updateAddon('users', parseInt(e.target.value))
                    }
                  >
                    <option value='0'>0 usuários (R$ 0)</option>
                    {addons.byType.user.map((addon: any) => (
                      <option key={addon.id} value={addon.quantity}>
                        {addon.quantity} usuários (R${' '}
                        {parseFloat(addon.price).toFixed(2)})
                      </option>
                    ))}
                  </AddonSelect>
                </AddonItem>
              )}

              {/* Propriedades */}
              {addons.byType?.property && (
                <AddonItem>
                  <AddonLabel>🏠 Propriedades Adicionais</AddonLabel>
                  <AddonSelect
                    value={selectedAddons.properties}
                    disabled={loading}
                    onChange={e =>
                      !loading &&
                      updateAddon('properties', parseInt(e.target.value))
                    }
                  >
                    <option value='0'>0 (R$ 0)</option>
                    {addons.byType.property.map((addon: any) => (
                      <option key={addon.id} value={addon.quantity}>
                        {addon.quantity} propriedades (R${' '}
                        {parseFloat(addon.price).toFixed(2)})
                      </option>
                    ))}
                  </AddonSelect>
                </AddonItem>
              )}

              {/* Storage */}
              {addons.byType?.storage && (
                <AddonItem>
                  <AddonLabel>💾 Armazenamento Adicional</AddonLabel>
                  <AddonSelect
                    value={selectedAddons.storage}
                    disabled={loading}
                    onChange={e =>
                      !loading &&
                      updateAddon('storage', parseInt(e.target.value))
                    }
                  >
                    <option value='0'>0 GB (R$ 0)</option>
                    {addons.byType.storage.map((addon: any) => (
                      <option key={addon.id} value={addon.quantity}>
                        {addon.quantity} GB (R${' '}
                        {parseFloat(addon.price).toFixed(2)})
                      </option>
                    ))}
                  </AddonSelect>
                </AddonItem>
              )}
            </AddonGroup>
          </Section>

          {/* Orçamento */}
          {quote && (
            <QuoteSection>
              <QuoteTitle>💰 Seu Orçamento Personalizado</QuoteTitle>

              <QuoteLine>
                <span>Base da Plataforma</span>
                <span>R$ {quote.basePrice.toFixed(2)}</span>
              </QuoteLine>

              <QuoteLine>
                <span>Módulos Selecionados ({quote.modulesList.length})</span>
                <span>R$ {quote.modulesTotal.toFixed(2)}</span>
              </QuoteLine>

              {quote.modulesList.map(m => (
                <QuoteSubline key={m.code}>
                  <span>
                    {m.icon} {m.name}
                  </span>
                  <span>R$ {m.price.toFixed(2)}</span>
                </QuoteSubline>
              ))}

              {quote.addonsTotal > 0 && (
                <>
                  <QuoteLine style={{ marginTop: '12px' }}>
                    <span>Recursos Adicionais</span>
                    <span>R$ {quote.addonsTotal.toFixed(2)}</span>
                  </QuoteLine>

                  {quote.addonsBreakdown.companies.quantity > 0 && (
                    <QuoteSubline>
                      <span>
                        🏢 {quote.addonsBreakdown.companies.quantity} empresa(s)
                      </span>
                      <span>
                        R$ {quote.addonsBreakdown.companies.price.toFixed(2)}
                      </span>
                    </QuoteSubline>
                  )}

                  {quote.addonsBreakdown.users.quantity > 0 && (
                    <QuoteSubline>
                      <span>
                        👥 {quote.addonsBreakdown.users.quantity} usuário(s)
                      </span>
                      <span>
                        R$ {quote.addonsBreakdown.users.price.toFixed(2)}
                      </span>
                    </QuoteSubline>
                  )}

                  {quote.addonsBreakdown.properties.quantity > 0 && (
                    <QuoteSubline>
                      <span>
                        🏠 {quote.addonsBreakdown.properties.quantity}{' '}
                        propriedade(s)
                      </span>
                      <span>
                        R$ {quote.addonsBreakdown.properties.price.toFixed(2)}
                      </span>
                    </QuoteSubline>
                  )}

                  {quote.addonsBreakdown.storage.quantity > 0 && (
                    <QuoteSubline>
                      <span>
                        💾 {quote.addonsBreakdown.storage.quantity} GB
                      </span>
                      <span>
                        R$ {quote.addonsBreakdown.storage.price.toFixed(2)}
                      </span>
                    </QuoteSubline>
                  )}
                </>
              )}

              <QuoteDivider />

              <QuoteTotal>
                <span>Total Mensal</span>
                <span>R$ {quote.totalMonthly.toFixed(2)}/mês</span>
              </QuoteTotal>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  padding: '12px',
                  background: 'var(--color-success-light)',
                  borderRadius: '8px',
                  color: 'var(--color-success)',
                }}
              >
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>
                  💰 Pagamento Anual
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                  R$ {quote.totalAnnual.toFixed(2)}/ano
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Economize R$ {quote.annualSavings.toFixed(2)} (2 meses
                  grátis!)
                </div>
              </div>

              <ContractButton
                disabled={loading || selectedModules.length === 0}
              >
                {loading ? '⏳ Calculando...' : '🚀 Contratar Este Plano'}
              </ContractButton>
            </QuoteSection>
          )}

          {error && (
            <div
              style={{
                padding: '16px',
                background: 'var(--color-error-light)',
                borderRadius: '8px',
                color: 'var(--color-error)',
                marginTop: '16px',
              }}
            >
              ❌ {error}
            </div>
          )}
        </ModalBody>

        {/* Loading Overlay */}
        {loading && (
          <LoadingOverlay>
            <LoadingSpinner />
            <LoadingText>
              ⏳ Calculando seu plano personalizado...
              <br />
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Aguarde enquanto processamos sua solicitação
              </span>
            </LoadingText>
          </LoadingOverlay>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};
