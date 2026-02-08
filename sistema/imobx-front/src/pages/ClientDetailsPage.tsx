import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdEdit,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWork,
  MdAttachMoney,
  MdFamilyRestroom,
  MdHome,
  MdNote,
  MdHouse,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { clientsApi } from '../services/clientsApi';
import { toast } from 'react-toastify';
import { formatPhoneDisplay, maskCPF, maskRG, maskCEP } from '../utils/masks';
import { getTypeText } from '../utils/propertyUtils';
import { translateType } from '../utils/galleryTranslations';
import {
  ClickableEmail,
  ClickablePhone,
} from '../components/common/ClickableContact';
import { LeadSourceBadge } from '../components/common/LeadSourceBadge';
import { ClientDetailsShimmer } from '../components/shimmer/ClientDetailsShimmer';
import { ClientInteractionsPanel } from '../components/clients/ClientInteractionsPanel';
import { ChecklistSection } from '../components/checklists/ChecklistSection';
import { useMatches } from '../hooks/useMatches';
import { useMatchActions } from '../hooks/useMatchActions';
import { MatchCard } from '../components/common/MatchCard';
import { Spinner } from '../components/common/Spinner';
import { FollowupButton } from '../components/ai/FollowupButton';
import { ConversationSummaryCard } from '../components/ai/ConversationSummaryCard';
import { ProposalGeneratorButton } from '../components/ai/ProposalGeneratorButton';
import { LeadClassificationCard } from '../components/ai/LeadClassificationCard';
import { useModuleAccess } from '../hooks/useModuleAccess';
import {
  ClientDetailsContainer,
  ClientDetailsHeader,
  ClientDetailsHeaderContent,
  ClientDetailsActions,
  BackButton,
  ActionButton,
  ClientDetailsContent,
  MainContent,
  Sidebar,
  ClientCard,
  ClientHeader,
  ClientAvatar,
  ClientInfo,
  ClientName,
  ClientBadges,
  ClientTypeBadge,
  ClientStatusBadge,
  ClientContact,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  PreferencesGrid,
  PreferenceItem,
  PreferenceLabel,
  PreferenceValue,
  FeaturesGrid,
  FeatureTag,
  SpouseCard,
  SpouseInfo,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  LoadingContainer,
  LoadingText,
} from '../styles/pages/ClientDetailsPageStyles';

// Helper to format currency
const formatCurrency = (value?: number | null): string => {
  if (value === null || value === undefined) return 'Não informado';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper to format date
const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Não informado';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

// Helper to get marital status label
const getMaritalStatusLabel = (status?: string | null): string => {
  if (!status) return 'Não informado';
  const statusMap: { [key: string]: string } = {
    single: 'Solteiro(a)',
    married: 'Casado(a)',
    divorced: 'Divorciado(a)',
    widowed: 'Viúvo(a)',
    separated: 'Separado(a)',
    union: 'União Estável',
  };
  return statusMap[status] || status;
};

// Helper to get employment status label
const getEmploymentStatusLabel = (status?: string | null): string => {
  if (!status) return 'Não informado';
  const statusMap: { [key: string]: string } = {
    employed: 'Empregado(a)',
    unemployed: 'Desempregado(a)',
    self_employed: 'Autônomo(a)',
    retired: 'Aposentado(a)',
    student: 'Estudante',
    other: 'Outro',
  };
  return statusMap[status] || status;
};

// Helper to get client type label
const getTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    buyer: 'Comprador',
    seller: 'Vendedor',
    tenant: 'Locatário',
    landlord: 'Locador',
  };
  return typeMap[type] || type;
};

// Helper to get client status label
const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    active: 'Ativo',
    inactive: 'Inativo',
    prospect: 'Prospect',
    lead: 'Lead',
    opportunity: 'Oportunidade',
    contacted: 'Contatado',
    qualified: 'Qualificado',
    unqualified: 'Não Qualificado',
    closed: 'Fechado',
    converted: 'Convertido',
    pending: 'Pendente',
    archived: 'Arquivado',
  };
  return statusMap[status] || status;
};

// Helper to get income proof type label
const getIncomeProofTypeLabel = (type?: string | null): string => {
  if (!type) return 'Não informado';
  const typeMap: { [key: string]: string } = {
    payslip: 'Holerite',
    income_tax: 'Declaração de IR',
    bank_statement: 'Extrato Bancário',
    contract: 'Contrato de Trabalho',
    decore: 'Decore',
    other: 'Outro',
  };
  return typeMap[type] || type;
};

// Helper to get account type label
const getAccountTypeLabel = (type?: string | null): string => {
  if (!type) return 'Não informado';
  const typeMap: { [key: string]: string } = {
    checking: 'Conta Corrente',
    savings: 'Poupança',
    salary: 'Conta Salário',
    payment: 'Conta Pagamento',
    other: 'Outro',
  };
  return typeMap[type] || type;
};

// Helper to get contract type label
const getContractTypeLabel = (type?: string | null): string => {
  if (!type) return 'Não informado';
  const typeMap: { [key: string]: string } = {
    CLT: 'CLT',
    PJ: 'Pessoa Jurídica',
    autonomo: 'Autônomo',
    estagio: 'Estágio',
    temporario: 'Temporário',
    freelancer: 'Freelancer',
    other: 'Outro',
  };
  return typeMap[type] || type;
};

// Helper to get property type label (com mais opções)
const getPropertyTypeLabel = (type?: string | null): string => {
  if (!type) return 'Não informado';
  // Normalizar para lowercase para garantir que a tradução funcione
  const normalizedType = type.toLowerCase().trim();
  // Usar translateType que tem mais tipos
  return translateType(normalizedType);
};

const ClientDetailsPage: React.FC = () => {
  // Sempre chamar useParams primeiro
  const { id } = useParams<{ id: string }>();

  // Sempre chamar useNavigate em seguida
  const navigate = useNavigate();

  // Sempre chamar useModuleAccess antes de outros hooks customizados
  const { isModuleAvailableForCompany } = useModuleAccess();

  // Sempre chamar todos os useState na mesma ordem
  const [client, setClient] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasAIAssistantModule = isModuleAvailableForCompany('ai_assistant');

  // Sempre chamar useMatchActions antes de useMatches para manter ordem consistente
  const { acceptMatch, ignoreMatch, processing } = useMatchActions();

  // Estabilizar parâmetros do useMatches para evitar recriações desnecessárias
  // Sempre criar o objeto, mesmo se id for undefined
  const matchesParams = useMemo(() => {
    // Sempre retornar um objeto com a mesma estrutura
    const params: {
      clientId?: string;
      status: 'pending';
      autoFetch: boolean;
    } = {
      clientId: id || undefined,
      status: 'pending',
      autoFetch: !!id,
    };
    return params;
  }, [id]);

  // Sempre chamar useMatches com os parâmetros estabilizados
  // IMPORTANTE: Sempre chamar useMatches, mesmo se id for undefined
  const {
    matches,
    loading: matchesLoading,
    refetch: refetchMatches,
  } = useMatches(matchesParams);

  // Sempre chamar useCallback antes de useEffect
  const loadClientDetails = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const clientData = await clientsApi.getClient(id);
      setClient(clientData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao carregar dados do cliente';
      toast.error(errorMessage);
      console.error('Erro ao carregar cliente:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Sempre chamar useEffect por último
  useEffect(() => {
    loadClientDetails();
  }, [loadClientDetails]);

  if (isLoading) {
    return (
      <Layout>
        <ClientDetailsShimmer />
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <ClientDetailsContainer>
          <EmptyState>
            <EmptyIcon>😕</EmptyIcon>
            <EmptyTitle>Cliente não encontrado</EmptyTitle>
            <EmptyDescription>
              O cliente que você está procurando não existe ou foi removido.
            </EmptyDescription>
            <BackButton onClick={() => navigate('/clients')}>
              <MdArrowBack size={20} />
              Voltar para Clientes
            </BackButton>
          </EmptyState>
        </ClientDetailsContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <ClientDetailsContainer>
        {/* Header */}
        <ClientDetailsHeader>
          <ClientDetailsHeaderContent>
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '4px',
                  color: 'var(--text)',
                }}
              >
                {client.name}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Detalhes completos e informações do cliente
              </p>
            </div>
            <ClientDetailsActions>
              {hasAIAssistantModule && (
                <>
                  <FollowupButton clientId={client.id} />
                  <ProposalGeneratorButton clientId={client.id} />
                </>
              )}
              <ActionButton
                onClick={() => navigate(`/clients/edit/${client.id}`)}
              >
                <MdEdit size={20} />
                Editar
              </ActionButton>
              <BackButton onClick={() => navigate('/clients')}>
                <MdArrowBack size={20} />
                Voltar
              </BackButton>
            </ClientDetailsActions>
          </ClientDetailsHeaderContent>
        </ClientDetailsHeader>

        {/* Content */}
        <ClientDetailsContent>
          {/* Main Content */}
          <MainContent>
            {/* Client Header Card */}
            <ClientCard>
              <ClientHeader>
                <ClientAvatar>
                  {client.name?.charAt(0)?.toUpperCase() || '?'}
                </ClientAvatar>
                <ClientInfo>
                  <ClientName>{client.name}</ClientName>
                  <ClientBadges>
                    <ClientTypeBadge $type={client.type}>
                      {getTypeLabel(client.type)}
                    </ClientTypeBadge>
                    <ClientStatusBadge $status={client.status}>
                      {getStatusLabel(client.status)}
                    </ClientStatusBadge>
                    {client.leadSource && (
                      <LeadSourceBadge source={client.leadSource} />
                    )}
                  </ClientBadges>
                  <ClientContact>
                    <div>
                      <MdEmail />
                      <ClickableEmail email={client.email} />
                    </div>
                    {client.phone && (
                      <div>
                        <MdPhone />
                        <ClickablePhone
                          phone={formatPhoneDisplay(client.phone)}
                        />
                      </div>
                    )}
                  </ClientContact>
                </ClientInfo>
              </ClientHeader>

              {/* Basic Info */}
              <SectionTitle>
                <MdPerson />
                Informações Pessoais
              </SectionTitle>
              <InfoGrid>
                {client.cpf && (
                  <InfoItem>
                    <InfoLabel>CPF</InfoLabel>
                    <InfoValue>{maskCPF(client.cpf)}</InfoValue>
                  </InfoItem>
                )}
                {client.rg && (
                  <InfoItem>
                    <InfoLabel>RG</InfoLabel>
                    <InfoValue>{maskRG(client.rg)}</InfoValue>
                  </InfoItem>
                )}
                {client.birthDate && (
                  <InfoItem>
                    <InfoLabel>Data de Nascimento</InfoLabel>
                    <InfoValue>{formatDate(client.birthDate)}</InfoValue>
                  </InfoItem>
                )}
                {client.maritalStatus && (
                  <InfoItem>
                    <InfoLabel>Estado Civil</InfoLabel>
                    <InfoValue>
                      {getMaritalStatusLabel(client.maritalStatus)}
                    </InfoValue>
                  </InfoItem>
                )}
                {client.nationality && (
                  <InfoItem>
                    <InfoLabel>Nacionalidade</InfoLabel>
                    <InfoValue>{client.nationality}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </ClientCard>

            {/* Address */}
            {(client.address || client.city) && (
              <ClientCard>
                <SectionTitle>
                  <MdLocationOn />
                  Endereço
                </SectionTitle>
                <InfoGrid>
                  {client.address && (
                    <InfoItem>
                      <InfoLabel>Logradouro</InfoLabel>
                      <InfoValue>{client.address}</InfoValue>
                    </InfoItem>
                  )}
                  {client.neighborhood && (
                    <InfoItem>
                      <InfoLabel>Bairro</InfoLabel>
                      <InfoValue>{client.neighborhood}</InfoValue>
                    </InfoItem>
                  )}
                  {client.city && (
                    <InfoItem>
                      <InfoLabel>Cidade/Estado</InfoLabel>
                      <InfoValue>
                        {client.city}
                        {client.state ? ` - ${client.state}` : ''}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.zipCode && (
                    <InfoItem>
                      <InfoLabel>CEP</InfoLabel>
                      <InfoValue>{maskCEP(client.zipCode)}</InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </ClientCard>
            )}

            {/* Professional Info */}
            {client.employmentStatus && (
              <ClientCard>
                <SectionTitle>
                  <MdWork />
                  Dados Profissionais
                </SectionTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Situação Profissional</InfoLabel>
                    <InfoValue>
                      {getEmploymentStatusLabel(client.employmentStatus)}
                    </InfoValue>
                  </InfoItem>
                  {client.companyName && (
                    <InfoItem>
                      <InfoLabel>Empresa</InfoLabel>
                      <InfoValue>{client.companyName}</InfoValue>
                    </InfoItem>
                  )}
                  {client.jobPosition && (
                    <InfoItem>
                      <InfoLabel>Cargo</InfoLabel>
                      <InfoValue>{client.jobPosition}</InfoValue>
                    </InfoItem>
                  )}
                  {client.jobStartDate && (
                    <InfoItem>
                      <InfoLabel>Data de Admissão</InfoLabel>
                      <InfoValue>{formatDate(client.jobStartDate)}</InfoValue>
                    </InfoItem>
                  )}
                  {client.companyTimeMonths && (
                    <InfoItem>
                      <InfoLabel>Tempo na Empresa</InfoLabel>
                      <InfoValue>{client.companyTimeMonths} meses</InfoValue>
                    </InfoItem>
                  )}
                  {client.contractType && (
                    <InfoItem>
                      <InfoLabel>Tipo de Contrato</InfoLabel>
                      <InfoValue>
                        {getContractTypeLabel(client.contractType)}
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </ClientCard>
            )}

            {/* Financial Info */}
            {(client.monthlyIncome || client.additionalIncome) && (
              <ClientCard>
                <SectionTitle>
                  <MdAttachMoney />
                  Dados Financeiros
                </SectionTitle>
                <InfoGrid>
                  {client.monthlyIncome && (
                    <InfoItem>
                      <InfoLabel>Renda Mensal</InfoLabel>
                      <InfoValue>
                        {formatCurrency(client.monthlyIncome)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.additionalIncome && (
                    <InfoItem>
                      <InfoLabel>Renda Adicional</InfoLabel>
                      <InfoValue>
                        {formatCurrency(client.additionalIncome)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.incomeProofType && (
                    <InfoItem>
                      <InfoLabel>Tipo de Comprovação</InfoLabel>
                      <InfoValue>
                        {getIncomeProofTypeLabel(client.incomeProofType)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.bankName && (
                    <InfoItem>
                      <InfoLabel>Banco</InfoLabel>
                      <InfoValue>{client.bankName}</InfoValue>
                    </InfoItem>
                  )}
                  {client.bankAccount && (
                    <InfoItem>
                      <InfoLabel>Agência/Conta</InfoLabel>
                      <InfoValue>{client.bankAccount}</InfoValue>
                    </InfoItem>
                  )}
                  {client.accountType && (
                    <InfoItem>
                      <InfoLabel>Tipo de Conta</InfoLabel>
                      <InfoValue>
                        {getAccountTypeLabel(client.accountType)}
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </ClientCard>
            )}

            {/* Spouse Info */}
            {client.spouse && (
              <SpouseCard>
                <SectionTitle>
                  <MdFamilyRestroom />
                  Dados do Cônjuge
                </SectionTitle>
                <SpouseInfo>
                  {client.spouse.name && (
                    <InfoItem>
                      <InfoLabel>Nome</InfoLabel>
                      <InfoValue>{client.spouse.name}</InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.cpf && (
                    <InfoItem>
                      <InfoLabel>CPF</InfoLabel>
                      <InfoValue>{maskCPF(client.spouse.cpf)}</InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.rg && (
                    <InfoItem>
                      <InfoLabel>RG</InfoLabel>
                      <InfoValue>{maskRG(client.spouse.rg)}</InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.birthDate && (
                    <InfoItem>
                      <InfoLabel>Data de Nascimento</InfoLabel>
                      <InfoValue>
                        {formatDate(client.spouse.birthDate)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.phone && (
                    <InfoItem>
                      <InfoLabel>Telefone</InfoLabel>
                      <InfoValue>
                        <ClickablePhone
                          phone={formatPhoneDisplay(client.spouse.phone)}
                        />
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.email && (
                    <InfoItem>
                      <InfoLabel>Email</InfoLabel>
                      <InfoValue>
                        <ClickableEmail email={client.spouse.email} />
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.occupation && (
                    <InfoItem>
                      <InfoLabel>Ocupação</InfoLabel>
                      <InfoValue>{client.spouse.occupation}</InfoValue>
                    </InfoItem>
                  )}
                  {client.spouse.income && (
                    <InfoItem>
                      <InfoLabel>Renda</InfoLabel>
                      <InfoValue>
                        {formatCurrency(client.spouse.income)}
                      </InfoValue>
                    </InfoItem>
                  )}
                </SpouseInfo>
              </SpouseCard>
            )}

            {/* MCMV Info */}
            {(typeof client.mcmvInterested === 'boolean' ||
              typeof client.mcmvEligible === 'boolean' ||
              client.mcmvIncomeRange ||
              client.mcmvCadunicoNumber ||
              client.mcmvPreRegistrationDate ||
              client.leadSource === 'dream_keys') && (
              <ClientCard>
                <SectionTitle>
                  <MdHouse />
                  Informações Minha Casa Minha Vida
                </SectionTitle>
                <InfoGrid>
                  {typeof client.mcmvInterested === 'boolean' && (
                    <InfoItem>
                      <InfoLabel>
                        Interessado em Minha Casa Minha Vida
                      </InfoLabel>
                      <InfoValue>
                        {client.mcmvInterested ? 'Sim' : 'Não'}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {typeof client.mcmvEligible === 'boolean' && (
                    <InfoItem>
                      <InfoLabel>Elegível para Minha Casa Minha Vida</InfoLabel>
                      <InfoValue>
                        {client.mcmvEligible ? 'Sim' : 'Não'}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.mcmvIncomeRange && (
                    <InfoItem>
                      <InfoLabel>
                        Faixa de Renda Minha Casa Minha Vida
                      </InfoLabel>
                      <InfoValue>
                        {client.mcmvIncomeRange === 'faixa1'
                          ? 'Faixa 1 (até R$ 1.800)'
                          : client.mcmvIncomeRange === 'faixa2'
                            ? 'Faixa 2 (R$ 1.801 até R$ 2.600)'
                            : client.mcmvIncomeRange === 'faixa3'
                              ? 'Faixa 3 (R$ 2.601 até R$ 4.000)'
                              : client.mcmvIncomeRange}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.mcmvCadunicoNumber && (
                    <InfoItem>
                      <InfoLabel>Número do CadÚnico</InfoLabel>
                      <InfoValue>{client.mcmvCadunicoNumber}</InfoValue>
                    </InfoItem>
                  )}
                  {client.mcmvPreRegistrationDate && (
                    <InfoItem>
                      <InfoLabel>
                        Data do Pré-Cadastro Minha Casa Minha Vida
                      </InfoLabel>
                      <InfoValue>
                        {formatDate(client.mcmvPreRegistrationDate)}
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.leadSource === 'dream_keys' && (
                    <InfoItem>
                      <InfoLabel>Origem do Lead</InfoLabel>
                      <InfoValue>
                        <LeadSourceBadge source={client.leadSource} />
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </ClientCard>
            )}

            {/* Notes */}
            {client.notes && (
              <ClientCard>
                <SectionTitle>
                  <MdNote />
                  Observações
                </SectionTitle>
                <div
                  style={{
                    padding: '12px',
                    background: 'var(--background)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {client.notes}
                </div>
              </ClientCard>
            )}

            {/* Matches - Imóveis Compatíveis */}
            <ClientCard style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '24px 24px 0 24px' }}>
                <SectionTitle>
                  🎯 Imóveis Compatíveis
                  {matches && matches.length > 0 && ` (${matches.length})`}
                </SectionTitle>
              </div>
              {matchesLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <Spinner size={40} />
                  <div
                    style={{
                      marginTop: '12px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Carregando imóveis compatíveis...
                  </div>
                </div>
              ) : !matches || matches.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 24px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    🎯
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    Nenhum imóvel compatível encontrado
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    Quando houver imóveis compatíveis com este cliente, eles
                    aparecerão aqui.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0',
                    width: '100%',
                    marginTop: '16px',
                  }}
                >
                  {matches.map((match, index) => (
                    <div
                      key={match.id}
                      style={{
                        width: '100%',
                        borderTop:
                          index > 0 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <MatchCard
                        match={match}
                        onAccept={async () => {
                          const result = await acceptMatch(match.id);
                          if (result.success) {
                            refetchMatches();
                          }
                        }}
                        onIgnore={async (reason?: string, notes?: string) => {
                          const result = await ignoreMatch(
                            match.id,
                            reason as any,
                            notes
                          );
                          if (result.success) {
                            refetchMatches();
                          }
                        }}
                        showProperty={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </ClientCard>

            <ClientCard>
              <ClientInteractionsPanel clientId={client.id} />
            </ClientCard>

            {/* Checklists Section */}
            <ChecklistSection
              clientId={client.id}
              showCreateButton={true}
              limit={5}
            />
          </MainContent>

          {/* Sidebar */}
          <Sidebar>
            {/* AI Assistant - Conversation Summary */}
            {hasAIAssistantModule && (
              <>
                <ConversationSummaryCard clientId={client.id} />
                <LeadClassificationCard clientId={client.id} />
              </>
            )}

            {/* Property Preferences */}
            {(client.minValue ||
              client.maxValue ||
              client.preferredPropertyTypes) && (
              <ClientCard>
                <SectionTitle>
                  <MdHome />
                  Preferências de Imóvel
                </SectionTitle>
                <PreferencesGrid>
                  {client.minValue && (
                    <PreferenceItem>
                      <PreferenceLabel>Valor Mínimo</PreferenceLabel>
                      <PreferenceValue>
                        {formatCurrency(client.minValue)}
                      </PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.maxValue && (
                    <PreferenceItem>
                      <PreferenceLabel>Valor Máximo</PreferenceLabel>
                      <PreferenceValue>
                        {formatCurrency(client.maxValue)}
                      </PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.minBedrooms && (
                    <PreferenceItem>
                      <PreferenceLabel>Quartos (mín)</PreferenceLabel>
                      <PreferenceValue>{client.minBedrooms}</PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.minBathrooms && (
                    <PreferenceItem>
                      <PreferenceLabel>Banheiros (mín)</PreferenceLabel>
                      <PreferenceValue>{client.minBathrooms}</PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.minArea && (
                    <PreferenceItem>
                      <PreferenceLabel>Área Mínima</PreferenceLabel>
                      <PreferenceValue>{client.minArea} m²</PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.maxArea && (
                    <PreferenceItem>
                      <PreferenceLabel>Área Máxima</PreferenceLabel>
                      <PreferenceValue>{client.maxArea} m²</PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.parkingSpaces && (
                    <PreferenceItem>
                      <PreferenceLabel>Vagas de Garagem</PreferenceLabel>
                      <PreferenceValue>{client.parkingSpaces}</PreferenceValue>
                    </PreferenceItem>
                  )}
                  {client.preferredPropertyType &&
                    !client.preferredPropertyTypes && (
                      <PreferenceItem>
                        <PreferenceLabel>Tipo de Imóvel</PreferenceLabel>
                        <PreferenceValue>
                          {getPropertyTypeLabel(client.preferredPropertyType)}
                        </PreferenceValue>
                      </PreferenceItem>
                    )}
                </PreferencesGrid>

                {/* Property Types */}
                {client.preferredPropertyTypes &&
                  client.preferredPropertyTypes.length > 0 && (
                    <>
                      <InfoLabel
                        style={{
                          marginTop: '16px',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Tipos de Imóvel
                      </InfoLabel>
                      <FeaturesGrid>
                        {client.preferredPropertyTypes.map(
                          (type: string, index: number) => (
                            <FeatureTag key={index}>
                              {getPropertyTypeLabel(type)}
                            </FeatureTag>
                          )
                        )}
                      </FeaturesGrid>
                    </>
                  )}

                {/* Preferred Neighborhoods */}
                {client.preferredNeighborhoods &&
                  client.preferredNeighborhoods.length > 0 && (
                    <>
                      <InfoLabel
                        style={{
                          marginTop: '16px',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Bairros Preferidos
                      </InfoLabel>
                      <FeaturesGrid>
                        {client.preferredNeighborhoods.map(
                          (neighborhood: string, index: number) => (
                            <FeatureTag key={index}>{neighborhood}</FeatureTag>
                          )
                        )}
                      </FeaturesGrid>
                    </>
                  )}

                {/* Preferred Features */}
                {client.preferredFeatures &&
                  client.preferredFeatures.length > 0 && (
                    <>
                      <InfoLabel
                        style={{
                          marginTop: '16px',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Características Desejadas
                      </InfoLabel>
                      <FeaturesGrid>
                        {client.preferredFeatures.map(
                          (feature: string, index: number) => (
                            <FeatureTag key={index}>{feature}</FeatureTag>
                          )
                        )}
                      </FeaturesGrid>
                    </>
                  )}
              </ClientCard>
            )}

            {/* Additional Contacts */}
            {(client.whatsapp || client.secondaryPhone) && (
              <ClientCard>
                <SectionTitle>
                  <MdPhone />
                  Contatos Adicionais
                </SectionTitle>
                <InfoGrid>
                  {client.whatsapp && (
                    <InfoItem>
                      <InfoLabel>WhatsApp</InfoLabel>
                      <InfoValue>
                        <ClickablePhone
                          phone={formatPhoneDisplay(client.whatsapp)}
                        />
                      </InfoValue>
                    </InfoItem>
                  )}
                  {client.secondaryPhone && (
                    <InfoItem>
                      <InfoLabel>Telefone Secundário</InfoLabel>
                      <InfoValue>
                        <ClickablePhone
                          phone={formatPhoneDisplay(client.secondaryPhone)}
                        />
                      </InfoValue>
                    </InfoItem>
                  )}
                </InfoGrid>
              </ClientCard>
            )}
          </Sidebar>
        </ClientDetailsContent>
      </ClientDetailsContainer>
    </Layout>
  );
};

export default ClientDetailsPage;
