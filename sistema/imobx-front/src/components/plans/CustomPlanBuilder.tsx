import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  MdBusiness,
  MdGroup,
  MdViewKanban,
  MdAssessment,
  MdAccountBalance,
  MdCampaign,
  MdApi,
  MdSettings,
  MdTrendingUp,
  MdExtension,
  MdLabel,
  MdSupport,
  MdCheck,
  MdWarning,
  MdInfo,
  MdAdd,
  MdRemove,
} from 'react-icons/md';
import {
  modulePricingApi,
  type ModulePricing,
  type CustomPlanCalculation,
} from '../../services/modulePricingApi';

const CustomPlanBuilderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BuilderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ConfigurationPanel = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const PricingPanel = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  position: sticky;
  top: 24px;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CompanySelector = styled.div`
  margin-bottom: 32px;
`;

const CompanyLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const CompanyInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CompanyInput = styled.input`
  width: 100px;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CompanyButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const ModuleCard = styled.div<{ selected: boolean }>`
  background: ${props =>
    props.selected
      ? props.theme.colors.primary + '10'
      : props.theme.colors.background};
  border: 2px solid
    ${props =>
      props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ModuleIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
`;

const ModuleName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ModulePrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const ModuleDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const ModuleCategory = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary + '20'};
  color: ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
`;

const PricingSummary = styled.div`
  margin-bottom: 24px;
`;

const PricingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const PricingLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PricingValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 2px solid ${props => props.theme.colors.border};
  margin-top: 16px;
`;

const TotalLabel = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const DiscountBadge = styled.div`
  background: ${props => props.theme.colors.success + '20'};
  color: ${props => props.theme.colors.success};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const PrimaryButton = styled.button`
  flex: 1;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const AlertBox = styled.div<{ type: 'warning' | 'info' | 'error' }>`
  background: ${props => {
    switch (props.type) {
      case 'warning':
        return props.theme.colors.warning + '10';
      case 'error':
        return props.theme.colors.error + '10';
      default:
        return props.theme.colors.info + '10';
    }
  }};
  border: 1px solid
    ${props => {
      switch (props.type) {
        case 'warning':
          return props.theme.colors.warning + '30';
        case 'error':
          return props.theme.colors.error + '30';
        default:
          return props.theme.colors.info + '30';
      }
    }};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const AlertIcon = styled.div<{ type: 'warning' | 'info' | 'error' }>`
  font-size: 1.25rem;
  color: ${props => {
    switch (props.type) {
      case 'warning':
        return props.theme.colors.warning;
      case 'error':
        return props.theme.colors.error;
      default:
        return props.theme.colors.info;
    }
  }};
  margin-top: 2px;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const AlertMessage = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

interface CustomPlanCalculation {
  basePrice: number;
  companyMultiplier: number;
  modulePrices: Array<{
    moduleType: string;
    moduleName: string;
    price: number;
  }>;
  totalPrice: number;
  discount?: number;
  finalPrice: number;
}

const moduleIcons: Record<string, React.ComponentType> = {
  user_management: MdGroup,
  company_management: MdBusiness,
  kanban_management: MdViewKanban,
  property_management: MdBusiness,
  client_management: MdGroup,
  advanced_reports: MdAssessment,
  financial_management: MdAccountBalance,
  marketing_tools: MdCampaign,
  api_integrations: MdApi,
  custom_fields: MdSettings,
  workflow_automation: MdTrendingUp,
  business_intelligence: MdAssessment,
  third_party_integrations: MdExtension,
  white_label: MdLabel,
  priority_support: MdSupport,
};

export const CustomPlanBuilder: React.FC = () => {
  const [companyCount, setCompanyCount] = useState(1);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'user_management',
    'company_management',
  ]);
  const [availableModules, setAvailableModules] = useState<ModulePricing[]>([]);
  const [calculation, setCalculation] = useState<CustomPlanCalculation | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar módulos disponíveis
  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const modules = await modulePricingApi.getActiveModules();
        setAvailableModules(modules);
      } catch (err) {
        setError('Erro ao carregar módulos disponíveis');
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  // Calcular preço quando mudanças ocorrem
  useEffect(() => {
    const calculatePrice = async () => {
      if (selectedModules.length === 0) return;

      try {
        const calculation = await modulePricingApi.calculateCustomPlan({
          companyCount,
          selectedModules,
        });
        setCalculation(calculation);
      } catch (err) {
        setError('Erro ao calcular preço');
      }
    };

    calculatePrice();
  }, [companyCount, selectedModules]);

  const handleModuleToggle = (moduleType: string) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleType)) {
        return prev.filter(m => m !== moduleType);
      } else {
        return [...prev, moduleType];
      }
    });
  };

  const handleCompanyCountChange = (delta: number) => {
    const newCount = companyCount + delta;
    if (newCount >= 1 && newCount <= 50) {
      setCompanyCount(newCount);
    }
  };

  const handleCreatePlan = async () => {
    try {
      setLoading(true);
      const result = await modulePricingApi.createCustomPlan({
        name: `Plano Customizado - ${companyCount} empresas`,
        companyCount,
        selectedModules,
      });

      // TODO: Redirecionar para página de confirmação ou dashboard
      // console.log('Plano criado com sucesso:', result);
      alert('Plano customizado criado com sucesso!');
    } catch (err) {
      setError('Erro ao criar plano customizado');
    } finally {
      setLoading(false);
    }
  };

  const groupedModules = useMemo(() => {
    const groups: Record<string, ModulePricing[]> = {};
    availableModules.forEach(module => {
      if (!groups[module.category]) {
        groups[module.category] = [];
      }
      groups[module.category].push(module);
    });
    return groups;
  }, [availableModules]);

  const categoryNames: Record<string, string> = {
    basic: 'Módulos Básicos',
    intermediate: 'Módulos Intermediários',
    advanced: 'Módulos Avançados',
    premium: 'Módulos Premium',
  };

  if (loading) {
    return (
      <CustomPlanBuilderContainer>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div>Carregando módulos disponíveis...</div>
        </div>
      </CustomPlanBuilderContainer>
    );
  }

  return (
    <CustomPlanBuilderContainer>
      <Header>
        <Title>Construtor de Plano Customizado</Title>
        <Subtitle>
          Escolha os módulos e quantidade de empresas para criar seu plano
          personalizado
        </Subtitle>
      </Header>

      {error && (
        <AlertBox type='error'>
          <AlertIcon type='error'>
            <MdWarning />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Erro</AlertTitle>
            <AlertMessage>{error}</AlertMessage>
          </AlertContent>
        </AlertBox>
      )}

      <BuilderGrid>
        <ConfigurationPanel>
          <CompanySelector>
            <SectionTitle>
              <MdBusiness />
              Quantidade de Empresas
            </SectionTitle>
            <CompanyLabel>
              Quantas empresas você precisa gerenciar?
            </CompanyLabel>
            <CompanyInputGroup>
              <CompanyButton
                onClick={() => handleCompanyCountChange(-1)}
                disabled={companyCount <= 1}
              >
                <MdRemove />
              </CompanyButton>
              <CompanyInput
                type='number'
                value={companyCount}
                onChange={e => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 50) {
                    setCompanyCount(value);
                  }
                }}
                min={1}
                max={50}
              />
              <CompanyButton
                onClick={() => handleCompanyCountChange(1)}
                disabled={companyCount >= 50}
              >
                <MdAdd />
              </CompanyButton>
            </CompanyInputGroup>
          </CompanySelector>

          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category} style={{ marginBottom: '32px' }}>
              <SectionTitle>{categoryNames[category] || category}</SectionTitle>
              <ModulesGrid>
                {modules.map(module => {
                  const IconComponent =
                    moduleIcons[module.moduleType] || MdSettings;
                  const isSelected = selectedModules.includes(
                    module.moduleType
                  );

                  return (
                    <ModuleCard
                      key={module.id}
                      selected={isSelected}
                      onClick={() => handleModuleToggle(module.moduleType)}
                    >
                      {isSelected && (
                        <SelectedIndicator>
                          <MdCheck />
                        </SelectedIndicator>
                      )}
                      <ModuleHeader>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <ModuleIcon>
                            <IconComponent />
                          </ModuleIcon>
                          <ModuleName>{module.moduleName}</ModuleName>
                        </div>
                        <ModulePrice>
                          R$ {module.basePrice.toFixed(2)}
                        </ModulePrice>
                      </ModuleHeader>
                      <ModuleDescription>
                        {module.description}
                      </ModuleDescription>
                      <ModuleCategory>
                        {categoryNames[category] || category}
                      </ModuleCategory>
                    </ModuleCard>
                  );
                })}
              </ModulesGrid>
            </div>
          ))}
        </ConfigurationPanel>

        <PricingPanel>
          <SectionTitle>
            <MdAssessment />
            Resumo do Preço
          </SectionTitle>

          {calculation && (
            <>
              <PricingSummary>
                <PricingItem>
                  <PricingLabel>
                    Empresas ({calculation.companyMultiplier}x)
                  </PricingLabel>
                  <PricingValue>
                    R$ {calculation.basePrice.toFixed(2)}
                  </PricingValue>
                </PricingItem>

                {calculation.modulePrices.map(module => (
                  <PricingItem key={module.moduleType}>
                    <PricingLabel>{module.moduleName}</PricingLabel>
                    <PricingValue>R$ {module.price.toFixed(2)}</PricingValue>
                  </PricingItem>
                ))}

                <PricingItem>
                  <PricingLabel>Subtotal</PricingLabel>
                  <PricingValue>
                    R$ {calculation.totalPrice.toFixed(2)}
                  </PricingValue>
                </PricingItem>

                {calculation.discount && calculation.discount > 0 && (
                  <PricingItem>
                    <PricingLabel>
                      Desconto ({calculation.discount.toFixed(0)}%)
                    </PricingLabel>
                    <PricingValue style={{ color: '#10B981' }}>
                      -R${' '}
                      {(
                        (calculation.totalPrice * calculation.discount) /
                        100
                      ).toFixed(2)}
                    </PricingValue>
                  </PricingItem>
                )}
              </PricingSummary>

              <TotalPrice>
                <TotalLabel>Total Mensal</TotalLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TotalValue>
                    R$ {calculation.finalPrice.toFixed(2)}
                  </TotalValue>
                  {calculation.discount && calculation.discount > 0 && (
                    <DiscountBadge>
                      {calculation.discount.toFixed(0)}% OFF
                    </DiscountBadge>
                  )}
                </div>
              </TotalPrice>
            </>
          )}

          <ActionButtons>
            <SecondaryButton onClick={() => window.history.back()}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton
              onClick={handleCreatePlan}
              disabled={!calculation || selectedModules.length === 0}
            >
              Criar Plano
            </PrimaryButton>
          </ActionButtons>
        </PricingPanel>
      </BuilderGrid>
    </CustomPlanBuilderContainer>
  );
};
