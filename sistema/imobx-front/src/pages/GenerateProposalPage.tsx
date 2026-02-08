import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdDescription,
  MdPerson,
  MdHome,
  MdAttachMoney,
  MdInfo,
  MdContentCopy,
  MdCheck,
  MdDownload,
  MdPhone,
} from 'react-icons/md';
import { useGenerateProposal } from '../hooks/useGenerateProposal';
// import { useSendProposalEmail } from '../hooks/useSendProposalEmail';
import { formatCurrency, getNumericValue } from '../utils/masks';
import { clientsApi } from '../services/clientsApi';
import { propertyApi } from '../services/propertyApi';
import { toast } from 'react-toastify';
import { Spinner } from '../components/common/Spinner';
import { Layout } from '../components/layout/Layout';
import { usePermissionsContext } from '../contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '../utils/permissionContextualDependencies';
import type { GenerateProposalResponse } from '../services/aiAssistantApi';

const PageContainer = styled.div`
  padding: 24px;
  width: 100%;
  margin: 0;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ContentCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const InfoBox = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
`;

const ActionsBar = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{
  $variant?: 'primary' | 'secondary';
  $loading?: boolean;
}>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => (props.$loading ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  opacity: ${props => (props.$loading ? 0.7 : 1)};

  ${props =>
    props.$variant === 'primary'
      ? `
    background: var(--color-primary);
    color: white;
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.backgroundSecondary};
    }
  `}

  &:disabled {
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const ProposalContainer = styled.div``;
const ProposalHeader = styled.div``;
const ProposalTitle = styled.h2``;
const ProposalBody = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
`;

const ProposalPreview = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 8px 8px 12px 8px;
  line-height: 1.7;
  color: ${props => props.theme.colors.text};
  box-shadow: none;
  text-align: initial;
  margin: 0 auto;

  /* Normalização de conteúdo vindo do backend */
  * {
    box-sizing: border-box;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${props => props.theme.colors.text};
    margin: 0 0 10px 0;
    line-height: 1.3;
  }
  p {
    margin: 0 0 12px 0;
  }
  ul,
  ol {
    margin: 0 0 12px 0;
    padding-left: 20px;
  }
  li {
    margin: 6px 0;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 8px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
  }
  th,
  td {
    padding: 8px;
    border: 1px solid ${props => props.theme.colors.border};
    text-align: left;
  }
  blockquote {
    margin: 12px 0;
    padding: 12px 16px;
    border-left: 4px solid ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  @media (max-width: 768px) {
    padding: 4px;
  }

  /* Remover interferência visual de classes do backend para manter aspecto de documento */
  .header,
  .section,
  .info-grid,
  .info-item,
  .timeline,
  .badge,
  .financial-table {
    all: revert;
  }
  .financial-table {
    width: 100%;
    border-collapse: collapse;
  }
  .financial-table th,
  .financial-table td {
    border: 1px solid ${props => props.theme.colors.border};
    padding: 8px;
    color: ${props => props.theme.colors.text};
  }
  /* Garantir que linha de total não fique com fundo branco fixo */
  .financial-table tr:last-child td {
    background: transparent !important;
  }
`;

const SummaryBox = styled.div``;

const SummaryTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const KeyPointsList = styled.ul``;

const KeyPoint = styled.li`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const RecommendationsList = styled.ul``;

const Recommendation = styled.li`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Removidos chips e cards para visual contínua

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GenerateProposalPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { generate, loading } = useGenerateProposal();
  const { hasPermission } = usePermissionsContext();

  const [propertyId, setPropertyId] = useState<string>(
    searchParams.get('propertyId') || ''
  );
  const [clientId, setClientId] = useState<string>(
    searchParams.get('clientId') || ''
  );
  const [proposalType, setProposalType] = useState<
    'sale' | 'rental' | 'investment'
  >('sale');
  const [proposedValue, setProposedValue] = useState<string>('');
  const [specialConditions, setSpecialConditions] = useState<string>('');
  const [paymentTerm, setPaymentTerm] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'financing' | 'consortium' | 'lease_purchase' | 'mixed'
  >('financing');
  const [downPayment, setDownPayment] = useState<string>('');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [includeMarketComparison, setIncludeMarketComparison] =
    useState<boolean>(true);
  const [includeTaxInfo, setIncludeTaxInfo] = useState<boolean>(true);
  const [includeTimeline, setIncludeTimeline] = useState<boolean>(true);
  const [includeRequiredDocs, setIncludeRequiredDocs] = useState<boolean>(true);
  const [validityDays, setValidityDays] = useState<string>('30');

  const [properties, setProperties] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const [proposal, setProposal] = useState<GenerateProposalResponse | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [editedText, setEditedText] = useState<string>('');
  // const { sendEmail, loading: sendingEmail } = useSendProposalEmail();
  // const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  // const [emailToSend, setEmailToSend] = useState<string>('');
  // Exibir HTML do backend como documento completo em iframe (sem sanitização para preservar estilos/print)
  const displayHtml = React.useMemo(
    () => (isEditing ? editedHtml : proposal?.proposalHtml || ''),
    [isEditing, editedHtml, proposal?.proposalHtml]
  );
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const resizeIframe = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && doc.body) {
        iframe.style.height = doc.body.scrollHeight + 'px';
        iframe.style.width = '100%';
      }
    } catch {}
  };

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertySearch]);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSearch]);

  // Debounce inputs
  useEffect(() => {
    const t = setTimeout(() => {
      // trigger effects above
      setPropertySearch(prev => prev);
    }, 400);
    return () => clearTimeout(t);
  }, [propertySearch]);

  useEffect(() => {
    const t = setTimeout(() => {
      setClientSearch(prev => prev);
    }, 400);
    return () => clearTimeout(t);
  }, [clientSearch]);

  const loadProperties = async () => {
    // Verificar se pode selecionar propriedade para proposta
    const canSelectProperty = canExecuteFunctionality(
      hasPermission,
      'proposal:generate',
      'selecionar_propriedade_proposta'
    );

    if (!canSelectProperty) {
      setLoadingProperties(false);
      return;
    }

    setLoadingProperties(true);
    try {
      const response = await propertyApi.getProperties(
        { search: propertySearch },
        { page: 1, limit: 20 }
      );
      const list = Array.isArray(response)
        ? response
        : (response &&
            (response.data ||
              response.properties ||
              response.items ||
              response.results)) ||
          [];
      setProperties(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error('Erro ao carregar propriedades');
    } finally {
      setLoadingProperties(false);
    }
  };

  const loadClients = async () => {
    // Verificar se pode selecionar cliente para proposta
    const canSelectClient = canExecuteFunctionality(
      hasPermission,
      'proposal:generate',
      'selecionar_cliente_proposta'
    );

    if (!canSelectClient) {
      setLoadingClients(false);
      return;
    }

    setLoadingClients(true);
    try {
      const response = await clientsApi.getClients({
        search: clientSearch,
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'ASC',
      });
      const list = Array.isArray(response)
        ? response
        : (response &&
            (response.data ||
              response.clients ||
              response.items ||
              response.results)) ||
          [];
      setClients(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleGenerate = async () => {
    if (!propertyId || !clientId) {
      toast.error('Selecione uma propriedade e um cliente');
      return;
    }

    const proposalData: any = {
      propertyId,
      clientId,
      proposalType,
      paymentMethod,
      includeMarketComparison,
      includeTaxInfo,
      includeTimeline,
      includeRequiredDocs,
    };

    if (proposedValue) {
      // getNumericValue retorna centavos; converter para reais
      const cents = parseFloat(getNumericValue(proposedValue) || '0');
      proposalData.proposedValue = cents / 100;
    }

    if (specialConditions) {
      proposalData.specialConditions = specialConditions;
    }

    if (paymentTerm) {
      proposalData.paymentTerm = parseInt(paymentTerm);
    }

    if (downPayment) {
      proposalData.downPayment =
        parseFloat(getNumericValue(downPayment) || '0') / 100;
    }
    if (downPaymentPercent) {
      proposalData.downPaymentPercent = parseFloat(downPaymentPercent);
    }
    if (interestRate) {
      proposalData.interestRate = parseFloat(interestRate);
    }
    if (monthlyPayment) {
      proposalData.monthlyPayment =
        parseFloat(getNumericValue(monthlyPayment) || '0') / 100;
    }
    if (validityDays) {
      proposalData.validityDays = parseInt(validityDays);
    }

    const result = await generate(proposalData);
    if (result) {
      setProposal(result);
      toast.success('Proposta gerada com sucesso!');
      // Scroll para a proposta
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedText : proposal?.proposalText;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        toast.success('Proposta copiada para a área de transferência!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Erro ao copiar proposta');
      }
    }
  };

  const getSelectedClient = () => clients.find((c: any) => c.id === clientId);
  const getSelectedProperty = () =>
    properties.find((p: any) => p.id === propertyId);

  const handleDownloadPDF = () => {
    if (!proposal && !isEditing) {
      toast.error('Gere a proposta antes de exportar.');
      return;
    }

    // Abre uma nova janela com conteúdo pronto para impressão (PDF)
    const win = window.open('', '_blank');
    if (!win) {
      toast.error('Não foi possível abrir a janela de impressão.');
      return;
    }

    const title =
      'Proposta Comercial - ' + (getSelectedProperty()?.title || 'Imóvel');
    const styles = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; margin: 24px; }
        h1,h2,h3 { margin: 0 0 8px 0; }
        .header { display:flex; justify-content: space-between; align-items:center; padding: 12px 0; border-bottom: 1px solid #ddd; margin-bottom: 16px; }
        .chip { display:inline-block; padding:6px 10px; border-radius:999px; border:1px solid #e5e7eb; background:#f9fafb; color:#111827; font-size:12px; font-weight:600; margin-left:8px; }
        .section { margin-top: 16px; }
        .label { font-size:12px; color:#6b7280; font-weight:600; }
        .value { font-size:18px; font-weight:800; color:#111827; }
        .content { line-height:1.6; margin-top: 12px; }
        ul,ol { padding-left:20px; }
      </style>
    `;

    const header = `
      <div class="header">
        <div>
          <h2>${title}</h2>
          <div class="label">Gerado em</div>
          <div>${new Date().toLocaleString('pt-BR')}</div>
        </div>
        <div>
          <span class="chip">IA Assistant</span>
        </div>
      </div>
    `;

    const suggestedValue = proposal.suggestedValue
      ? `<div class="section"><div class="label">Valor Sugerido</div><div class="value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.suggestedValue)}</div></div>`
      : '';

    const executive = proposal.executiveSummary
      ? `<div class="section"><div class="label">Resumo Executivo</div><div class="content">${proposal.executiveSummary}</div></div>`
      : '';

    const keyPoints = proposal.keyPoints?.length
      ? `<div class="section"><div class="label">Pontos Principais</div><ul>${proposal.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>`
      : '';

    const recommendations = proposal.recommendations?.length
      ? `<div class="section"><div class="label">Recomendações</div><ul>${proposal.recommendations.map(r => `<li>${r}</li>`).join('')}</ul></div>`
      : '';

    win.document.write(`
      <html>
        <head><title>${title}</title>${styles}</head>
        <body>
          ${header}
          ${suggestedValue}
          <div class="section"><div class="label">Conteúdo</div><div class="content">${isEditing ? editedHtml : proposal?.proposalHtml || ''}</div></div>
          ${executive}
          ${keyPoints}
          ${recommendations}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    // Pequeno delay para garantir render antes de imprimir
    setTimeout(() => {
      win.print();
      win.close();
    }, 200);
  };

  // const isValidEmail = (e: string) => /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(e);

  // const handleSendEmail = async () => {
  //   const client = getSelectedClient();
  //   if ((!proposal && !isEditing) || !client?.email) {
  //     toast.error('Cliente sem e-mail ou proposta não gerada.');
  //     return;
  //   }
  //   if (!emailToSend || !isValidEmail(emailToSend)) {
  //     toast.error('Informe um email válido para envio.');
  //     return;
  //   }
  //   // Montar payload conforme estado atual do formulário
  //   const payload: any = {
  //     propertyId,
  //     clientId,
  //     proposalType,
  //     // valores e condições
  //     paymentMethod,
  //     includeMarketComparison,
  //     includeTaxInfo,
  //     includeTimeline,
  //     includeRequiredDocs,
  //   };
  //   if (proposedValue) payload.proposedValue = parseFloat((getNumericValue(proposedValue) || '0')) / 100;
  //   if (specialConditions) payload.specialConditions = specialConditions;
  //   if (paymentTerm) payload.paymentTerm = parseInt(paymentTerm);
  //   if (downPayment) payload.downPayment = parseFloat((getNumericValue(downPayment) || '0')) / 100;
  //   if (downPaymentPercent) payload.downPaymentPercent = parseFloat(downPaymentPercent);
  //   if (interestRate) payload.interestRate = parseFloat(interestRate);
  //   if (monthlyPayment) payload.monthlyPayment = parseFloat((getNumericValue(monthlyPayment) || '0')) / 100;
  //   if (validityDays) payload.validityDays = parseInt(validityDays);
  //   // destinatário (do modal)
  //   payload.email = emailToSend;
  //
  //   const result = await sendEmail(payload);
  //   if (result && result.success) {
  //     toast.success(`Proposta enviada para ${result.emailSentTo}`);
  //     if (result.proposal) {
  //       setProposal(result.proposal);
  //     }
  //     setShowEmailModal(false);
  //   }
  // };

  const handleSendWhatsApp = () => {
    const client = getSelectedClient();
    if ((!proposal && !isEditing) || !(client?.whatsapp || client?.phone)) {
      toast.error('Cliente sem WhatsApp/Telefone ou proposta não gerada.');
      return;
    }
    const raw = (client.whatsapp || client.phone) as string;
    const phoneDigits = raw.replace(/\D/g, '');
    const textToSend = isEditing ? editedText : proposal?.proposalText || '';
    const text = encodeURIComponent(textToSend);
    const url = `https://wa.me/${phoneDigits}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <HeaderContent>
            <PageTitle>Gerar Proposta Comercial</PageTitle>
            <PageSubtitle>
              Crie propostas comerciais profissionais e personalizadas para seus
              clientes
            </PageSubtitle>
          </HeaderContent>
          <BackButton onClick={() => navigate(-1)}>Voltar</BackButton>
        </PageHeader>

        {/* Formulário principal fora de cards (padrão das páginas) */}
        <FormGroup>
          <Label>
            <MdHome size={18} />
            Propriedade *
          </Label>
          <SearchRow>
            <Input
              type='text'
              placeholder='Buscar propriedade por título, código ou endereço'
              value={propertySearch}
              onChange={e => setPropertySearch(e.target.value)}
            />
            <Input
              type='text'
              placeholder='Buscar cliente por nome, e-mail, telefone ou CPF'
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
            />
          </SearchRow>
          {(() => {
            const canSelectProperty = canExecuteFunctionality(
              hasPermission,
              'proposal:generate',
              'selecionar_propriedade_proposta'
            );

            if (!canSelectProperty) {
              const message = getDisabledFunctionalityMessage(
                'proposal:generate',
                'selecionar_propriedade_proposta'
              );
              return (
                <div
                  style={{
                    padding: '12px',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    color: '#92400e',
                    fontSize: '14px',
                  }}
                >
                  {message ||
                    'Você não tem permissão para selecionar propriedades para propostas.'}
                </div>
              );
            }

            return loadingProperties ? (
              <LoadingContainer>
                <Spinner size={20} />
                <span>Carregando propriedades...</span>
              </LoadingContainer>
            ) : (
              <Select
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
              >
                <option value=''>Selecione uma propriedade</option>
                {properties.map(prop => (
                  <option key={prop.id} value={prop.id}>
                    {prop.title || prop.code || prop.id}
                  </option>
                ))}
              </Select>
            );
          })()}
        </FormGroup>

        <FormGroup>
          <Label>
            <MdPerson size={18} />
            Cliente *
          </Label>
          {(() => {
            const canSelectClient = canExecuteFunctionality(
              hasPermission,
              'proposal:generate',
              'selecionar_cliente_proposta'
            );

            if (!canSelectClient) {
              const message = getDisabledFunctionalityMessage(
                'proposal:generate',
                'selecionar_cliente_proposta'
              );
              return (
                <div
                  style={{
                    padding: '12px',
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    color: '#92400e',
                    fontSize: '14px',
                  }}
                >
                  {message ||
                    'Você não tem permissão para selecionar clientes para propostas.'}
                </div>
              );
            }

            return loadingClients ? (
              <LoadingContainer>
                <Spinner size={20} />
                <span>Carregando clientes...</span>
              </LoadingContainer>
            ) : (
              <Select
                value={clientId}
                onChange={e => setClientId(e.target.value)}
              >
                <option value=''>Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            );
          })()}
        </FormGroup>

        <FormGroup>
          <Label>Tipo de Proposta *</Label>
          <Select
            value={proposalType}
            onChange={e => setProposalType(e.target.value as any)}
          >
            <option value='sale'>Venda</option>
            <option value='rental'>Aluguel</option>
            <option value='investment'>Investimento</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Forma de Pagamento</Label>
          <Select
            value={paymentMethod}
            onChange={e => setPaymentMethod(e.target.value as any)}
          >
            <option value='cash'>À vista</option>
            <option value='financing'>Financiamento</option>
            <option value='consortium'>Consórcio</option>
            <option value='lease_purchase'>Leasing/Alienação</option>
            <option value='mixed'>Misto</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <MdAttachMoney size={18} />
            Valor Proposto (opcional)
          </Label>
          <Input
            type='text'
            placeholder='Ex: R$ 450.000,00'
            value={proposedValue}
            onChange={e => setProposedValue(formatCurrency(e.target.value))}
          />
          <InfoBox>
            <MdInfo size={16} />
            Se não informado, será usado o valor da propriedade
          </InfoBox>
        </FormGroup>

        <FormGroup>
          <Label>Prazo de Pagamento em Meses (opcional)</Label>
          <Input
            type='number'
            placeholder='Ex: 120'
            value={paymentTerm}
            onChange={e => setPaymentTerm(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Entrada (R$) (opcional)</Label>
          <Input
            type='text'
            placeholder='Ex: R$ 90.000,00'
            value={downPayment}
            onChange={e => setDownPayment(formatCurrency(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>% de Entrada (opcional)</Label>
          <Input
            type='number'
            placeholder='Ex: 20'
            value={downPaymentPercent}
            onChange={e => setDownPaymentPercent(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Taxa de Juros Anual % (opcional)</Label>
          <Input
            type='number'
            step='0.01'
            placeholder='Ex: 8.5'
            value={interestRate}
            onChange={e => setInterestRate(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Parcela Mensal Estimada (R$) (opcional)</Label>
          <Input
            type='text'
            placeholder='Ex: R$ 3.500,00'
            value={monthlyPayment}
            onChange={e => setMonthlyPayment(formatCurrency(e.target.value))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Validade da Proposta (dias)</Label>
          <Input
            type='number'
            placeholder='Ex: 30'
            value={validityDays}
            onChange={e => setValidityDays(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Incluir informações adicionais</Label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '8px',
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type='checkbox'
                checked={includeMarketComparison}
                onChange={e => setIncludeMarketComparison(e.target.checked)}
              />{' '}
              Comparação de mercado
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type='checkbox'
                checked={includeTaxInfo}
                onChange={e => setIncludeTaxInfo(e.target.checked)}
              />{' '}
              Informações fiscais
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type='checkbox'
                checked={includeTimeline}
                onChange={e => setIncludeTimeline(e.target.checked)}
              />{' '}
              Timeline do processo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type='checkbox'
                checked={includeRequiredDocs}
                onChange={e => setIncludeRequiredDocs(e.target.checked)}
              />{' '}
              Documentos necessários
            </label>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Condições Especiais (opcional)</Label>
          <Textarea
            placeholder='Ex: Financiamento com entrada de 20%'
            value={specialConditions}
            onChange={e => setSpecialConditions(e.target.value)}
          />
        </FormGroup>

        <ActionsBar>
          <Button $variant='secondary' onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button
            $variant='primary'
            onClick={handleGenerate}
            disabled={loading || !propertyId || !clientId}
            $loading={loading}
          >
            {loading ? (
              <>
                <Spinner size={16} />
                Gerando...
              </>
            ) : (
              <>
                <MdDescription size={18} />
                Gerar Proposta
              </>
            )}
          </Button>
        </ActionsBar>

        {proposal && (
          <ProposalContainer>
            <ProposalBody>
              {/* Editor */}
              {isEditing && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        display: 'block',
                        marginBottom: 6,
                      }}
                    >
                      Editar HTML
                    </label>
                    <textarea
                      value={editedHtml}
                      onChange={e => setEditedHtml(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 320,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: 13,
                        padding: 10,
                        border: '1px solid var(--border, #334155)',
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        display: 'block',
                        marginBottom: 6,
                      }}
                    >
                      Texto para e-mail/WhatsApp
                    </label>
                    <textarea
                      value={editedText}
                      onChange={e => setEditedText(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 320,
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        fontSize: 13,
                        padding: 10,
                        border: '1px solid var(--border, #334155)',
                        borderRadius: 8,
                      }}
                    />
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                title='proposal'
                srcDoc={displayHtml}
                style={{ width: '100%', border: 'none', overflow: 'hidden' }}
                onLoad={resizeIframe}
              />

              <ActionsBar>
                {!isEditing ? (
                  <>
                    <Button
                      $variant='secondary'
                      onClick={() => {
                        setIsEditing(true);
                        setEditedHtml(proposal.proposalHtml);
                        setEditedText(proposal.proposalText);
                      }}
                    >
                      Editar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      $variant='secondary'
                      onClick={() => {
                        setIsEditing(false);
                        setEditedHtml('');
                        setEditedText('');
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      $variant='primary'
                      onClick={() => {
                        setProposal(prev =>
                          prev
                            ? {
                                ...prev,
                                proposalHtml: editedHtml,
                                proposalText: editedText,
                              }
                            : prev
                        );
                        setIsEditing(false);
                        toast.success('Proposta atualizada.');
                      }}
                    >
                      Salvar
                    </Button>
                  </>
                )}
                <Button $variant='secondary' onClick={handleCopy}>
                  {copied ? (
                    <>
                      <MdCheck size={18} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <MdContentCopy size={18} />
                      Copiar Texto
                    </>
                  )}
                </Button>
                <Button $variant='secondary' onClick={handleDownloadPDF}>
                  <MdDownload size={18} />
                  Exportar PDF
                </Button>
                {/* {getSelectedClient()?.email && (
                  <Button $variant="secondary" onClick={() => {
                    const cli = getSelectedClient();
                    const baseEmail = (cli?.email || '');
                    setEmailToSend(baseEmail);
                    setShowEmailModal(true);
                  }} $loading={sendingEmail} disabled={sendingEmail}>
                    {sendingEmail ? 'Enviando…' : (
                      <>
                        <MdEmail size={18} />
                        Enviar por Email
                      </>
                    )}
                  </Button>
                )} */}
                {(getSelectedClient()?.whatsapp ||
                  getSelectedClient()?.phone) && (
                  <Button $variant='primary' onClick={handleSendWhatsApp}>
                    <MdPhone size={18} />
                    Enviar por WhatsApp
                  </Button>
                )}
              </ActionsBar>

              {/* Campo de email alternativo fora do modal removido conforme solicitação */}

              {/* {showEmailModal && (
                <div style={{ position:'fixed', top:0, right:0, bottom:0, left:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 999999 }} onClick={()=>!sendingEmail && setShowEmailModal(false)}>
                  <div style={{ background:'var(--card, #0b1324)', color:'inherit', width:'min(520px, 95vw)', borderRadius:12, border:'1px solid var(--border, #334155)', padding:20 }} onClick={(e)=>e.stopPropagation()}>
                    <h3 style={{ margin:'0 0 12px 0', fontSize:18, fontWeight:700 }}>Confirmar envio da proposta</h3>
                    <div style={{ display:'grid', gap: '12px' }}>
                      <label style={{ fontWeight:600 }}>Email do destinatário</label>
                      <input
                        type="email"
                        value={emailToSend}
                        onChange={(e)=>setEmailToSend(e.target.value)}
                        style={{ width:'100%', padding:'10px 12px', border:'1px solid var(--border, #334155)', borderRadius:8, background: 'transparent', color: 'inherit' }}
                      />
                    </div>
                    <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:16 }}>
                      <Button $variant="secondary" onClick={()=> setShowEmailModal(false)} disabled={sendingEmail}>Cancelar</Button>
                      <Button $variant="primary" onClick={handleSendEmail} $loading={sendingEmail} disabled={sendingEmail}>
                        {sendingEmail ? 'Enviando…' : 'Enviar'}
                      </Button>
                    </div>
                  </div>
                </div>
              )} */}
            </ProposalBody>
          </ProposalContainer>
        )}
      </PageContainer>
    </Layout>
  );
};

export default GenerateProposalPage;
