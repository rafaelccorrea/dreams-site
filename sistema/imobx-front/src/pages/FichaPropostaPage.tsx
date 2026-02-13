import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import {
  MdExpandMore,
  MdExpandLess,
  MdSave,
  MdCalendarToday,
  MdAttachMoney,
  MdPerson,
  MdHome,
  MdGroup,
  MdWarning,
  MdCheckCircle,
  MdError,
  MdSearch,
  MdClose,
  MdShare,
  MdContentCopy,
  MdTrendingUp,
  MdBarChart,
  MdPieChart,
  MdDraw,
  MdDescription,
  MdAdd,
  MdDelete,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdPeople,
} from 'react-icons/md';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  FichaVendaContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  CollapsibleSection,
  SectionHeader,
  SectionHeaderLeft,
  SectionIcon,
  SectionTitleWrapper,
  SectionTitle as StyledSectionTitle,
  SectionDescription,
  ExpandIcon,
  SectionContent,
  FormGrid,
  FormGroup,
  FormLabel,
  RequiredIndicator,
  FormInput,
  FormSelect,
  FormTextarea,
  ErrorMessage,
  HelperText,
  CheckboxWrapper,
  CheckboxInput,
  CheckboxLabel,
  Button,
  FormFooter,
  FooterLeft,
  FooterRight,
  Divider,
  InfoBox,
  InfoBoxText,
  CepSearchButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalButton,
  PageContentWrap,
  ContraPropostaSection,
  ContraPropostaHeader,
  ContraPropostaTitle,
  ContraPropostaList,
  ContraPropostaItemCard,
  ContraPropostaItemMain,
  ContraPropostaItemMeta,
  ContraPropostaStatusBadge,
  ContraPropostaItemActions,
} from '../styles/pages/FichaVendaPageStyles';
import {
  maskCPF,
  maskCPFouCNPJ,
  maskRG,
  maskCEP,
  maskPhoneAuto,
  validateCPF,
  validateEmail,
  validateCEP,
  formatCurrency,
  getNumericValue,
  formatCurrencyValue,
  maskCurrencyReais,
} from '../utils/masks';
import { formatarDataHora } from '../utils/format';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from '../utils/notifications';
import { fetchAddressByZipCode } from '../services/addressApi';
import { API_BASE_URL } from '../config/apiConfig';
import {
  getPublicProperties,
  propriedadeParaImovelFichaProposta,
} from '../services/publicPropertyApi';
import type { Property } from '../types/property';
import {
  criarFichaProposta,
  atualizarProposta,
  extrairDadosDaImagem,
  listarPropostas,
  buscarPropostaPorId,
  getUrlPdfProposta,
  reenviarEmailProposta,
  type CreatePurchaseProposalDto,
  type UpdatePurchaseProposalDto,
  type PropostaListItem,
  type PropostaStatus,
} from '../services/fichaPropostaApi';
import {
  criarContraProposta,
  listarContraPropostas,
  atualizarStatusContraProposta,
  excluirContraProposta,
  getUrlPdfContraProposta,
  type CreateContraPropostaDto,
  type ContraPropostaItem,
} from '../services/contraPropostaApi';
import {
  buscarCorretores,
  buscarGestores,
  identificarUsuarioPorCpf,
  type TempUniaoUser,
} from '../services/tempUniaoUsersApi';
import SelectCorretorModal from '../components/modals/SelectCorretorModal';
import PropostaAssinaturasModal from '../components/modals/PropostaAssinaturasModal';
import ContraPropostaAssinaturasModal from '../components/modals/ContraPropostaAssinaturasModal';
import {
  ModernModalOverlay,
  ModernModalContainer,
  ModernModalHeader,
  ModernModalHeaderContent,
  ModernModalTitle,
  ModernModalSubtitle,
  ModernModalCloseButton,
  ModernModalContent,
  ModernFormGrid,
  ModernFormGroup,
  ModernFormLabel,
  ModernRequiredIndicator,
  ModernFormInput,
  ModernFormSelect,
  ModernModalFooter,
  ModernButton,
  ModernSummaryGrid,
  ModernSummaryCard,
  ModernSummaryCardTitle,
  ModernSummaryRow,
  ModernSummaryLabel,
  ModernSummaryValue,
  ModernConfirmWarning,
  ModernConfirmWarningText,
} from '../styles/components/ModernModalStyles';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Lista de estados civis
const ESTADOS_CIVIS = [
  'Solteiro',
  'Solteira',
  'Casado',
  'Casada',
  'Divorciado',
  'Divorciada',
  'Viúvo',
  'Viúva',
  'União Estável',
];

// Lista de regimes de casamento
const REGIMES_CASAMENTO = [
  'Comunhão universal de bens',
  'Comunhão parcial de bens',
  'Separação total de bens',
  'Participação final nos aquestos',
];

// Lista de nacionalidades comuns
const NACIONALIDADES = [
  'Brasileiro',
  'Brasileira',
  'Argentino',
  'Argentina',
  'Chileno',
  'Chilena',
  'Uruguaio',
  'Uruguaia',
  'Paraguaio',
  'Paraguaia',
  'Outro',
];

// Lista de estados brasileiros (UFs válidas)
const ESTADOS_BRASIL = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

// Validar UF (estado)
const validateUF = (uf: string): boolean => {
  if (!uf) return false;
  return ESTADOS_BRASIL.includes(uf.toUpperCase());
};

// Lista de unidades
const UNIDADES = ['União Esmeralda', 'União Rio Branco'];

// Chaves de sessionStorage para sessão da Ficha de Proposta
const STORAGE_USER_CPF = 'ficha_proposta_user_cpf';
const STORAGE_USER_TIPO = 'ficha_proposta_user_tipo';
const STORAGE_USER_DATA = 'ficha_proposta_user_data';
const STORAGE_SESSION_EXPIRES_AT = 'ficha_proposta_session_expires_at';

// Sessão válida por 12 horas (sem token no back; controle só no front)
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

type FichaPropostaSession = {
  cpf: string;
  tipo: 'gestor' | 'corretor';
  user: TempUniaoUser;
};

/** Retorna a sessão atual só se ainda estiver válida; se expirada, limpa o storage e retorna null */
function getValidFichaPropostaSession(): FichaPropostaSession | null {
  try {
    const expiresAt = sessionStorage.getItem(STORAGE_SESSION_EXPIRES_AT);
    if (!expiresAt || Date.now() >= Number(expiresAt)) {
      sessionStorage.removeItem(STORAGE_USER_CPF);
      sessionStorage.removeItem(STORAGE_USER_TIPO);
      sessionStorage.removeItem(STORAGE_USER_DATA);
      sessionStorage.removeItem(STORAGE_SESSION_EXPIRES_AT);
      return null;
    }
    const cpf = sessionStorage.getItem(STORAGE_USER_CPF);
    const tipo = sessionStorage.getItem(STORAGE_USER_TIPO) as
      | 'gestor'
      | 'corretor'
      | null;
    const data = sessionStorage.getItem(STORAGE_USER_DATA);
    if (!cpf || !tipo || !data) return null;
    const user = JSON.parse(data) as TempUniaoUser;
    return { cpf, tipo, user };
  } catch {
    return null;
  }
}

// Tipos
interface FichaPropostaForm {
  // Bloco 1 - Proposta
  proposta: {
    numero?: string;
    dataProposta: string;
    prazoValidade: number;
    precoProposto: string;
    condicoesPagamento: string;
    valorSinal?: string; // Opcional
    prazoPagamentoSinal?: number; // Opcional
    porcentagemComissao: number;
    prazoEntrega: number;
    multaMensal: string;
    unidadeVenda: string;
    unidadeCaptacao: string;
  };

  // Bloco 2 - Proponente
  proponente: {
    nome: string;
    rg: string;
    cpf: string;
    nacionalidade: string;
    estadoCivil: string;
    regimeCasamento?: string;
    dataNascimento: string;
    profissao?: string;
    email: string;
    telefone: string;
    residenciaAtual: string;
    bairro: string;
    cep: string;
    cidade: string;
    estado: string;
  };

  // Bloco 3 - Proponente Cônjuge
  possuiProponenteConjuge: boolean;
  proponenteConjuge?: {
    nome: string;
    rg: string;
    cpf: string;
    profissao?: string;
    email: string;
    telefone: string;
  };

  // Bloco 4 - Imóvel
  imovel: {
    matricula?: string; // Opcional
    cartorio?: string; // Opcional
    cadastroPrefeitura?: string;
    cep?: string;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
  };

  // Bloco 5 - Proprietário
  proprietario: {
    nome: string;
    rg: string;
    cpf: string;
    nacionalidade: string;
    estadoCivil: string;
    regimeCasamento?: string;
    dataNascimento: string;
    profissao?: string;
    email: string;
    telefone: string;
    residenciaAtual: string;
    bairro: string;
  };

  // Bloco 6 - Proprietário Cônjuge
  possuiProprietarioConjuge: boolean;
  proprietarioConjuge?: {
    nome: string;
    rg: string;
    cpf: string;
    profissao?: string;
    email: string;
    telefone: string;
  };

  // Bloco 7 - Corretores (até 3)
  corretores?: Array<{
    id: string;
    nome: string;
    email: string;
  }>;

  // Bloco 8 - Captadores (até 3)
  captadores?: Array<{
    id: string;
    nome: string;
    porcentagem?: number;
  }>;
}

// Usar o tipo da API
type PropostaEnviada = PropostaListItem & {
  dados?: any; // Para compatibilidade com dados antigos do localStorage
};

const FichaPropostaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: propostaIdFromUrl } = useParams<{ id?: string }>();
  /** Status da proposta atual (quando aberta por ID). Assinaturas só aparecem quando 'disponivel'. */
  const [statusPropostaAtual, setStatusPropostaAtual] = useState<'rascunho' | 'disponivel' | ''>('');

  // Estado para controlar largura da tela
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const isMobilePropostas = windowWidth < 992;
  const [hasLoadedSharedData, setHasLoadedSharedData] = useState(false);
  /** 403 ao carregar proposta por ID: usuário não está vinculado à proposta */
  const [propostaAccessDenied, setPropostaAccessDenied] = useState(false);
  const [, setLoadingPropostaById] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cores do tema do sistema
  const themeColors = useMemo(
    () => ({
      primary: '#A63126',
      primaryDark: '#8B251C',
      primaryLight: '#C44336',
      error: '#E05A5A',
      errorDark: '#C44336',
    }),
    []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingDraftServer, setSavingDraftServer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [propostasEnviadas, setPropostasEnviadas] = useState<PropostaEnviada[]>(
    []
  );
  const [showPropostasAnteriores, setShowPropostasAnteriores] = useState(false);
  const [showPropostasPorEtapa, setShowPropostasPorEtapa] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreatePurchaseProposalDto | null>(null);
  const [, setIsExtractingImage] = useState(false);
  const [, setMissingFields] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [, setPreviewImage] = useState<string | null>(null);
  const [loadingPropostas, setLoadingPropostas] = useState(false);
  const [pagePropostas, setPagePropostas] = useState(1);
  const [totalPagesPropostas, setTotalPagesPropostas] = useState(1);
  const [totalPropostas, setTotalPropostas] = useState(0);

  // Estados para corretores e gestores
  const [corretoresDisponiveis, setCorretoresDisponiveis] = useState<
    TempUniaoUser[]
  >([]);
  const [gestoresDisponiveis, setGestoresDisponiveis] = useState<
    TempUniaoUser[]
  >([]);
  const [loadingCorretores, setLoadingCorretores] = useState(false);
  const [loadingGestores, setLoadingGestores] = useState(false);

  // Estado para corretor selecionado (corretor logado é preenchido automaticamente; gestor pode adicionar via "Adicionar da lista")
  const [corretorSelecionado, setCorretorSelecionado] =
    useState<TempUniaoUser | null>(null);
  const [showSelectCorretorModal, setShowSelectCorretorModal] = useState(false);
  /** Proposta selecionada para modal de assinaturas Autentique (só disponível com JWT) */
  const [propostaAssinaturasModal, setPropostaAssinaturasModal] = useState<{
    id: string;
    numero: string;
  } | null>(null);
  const [contraPropostas, setContraPropostas] = useState<ContraPropostaItem[]>(
    []
  );
  const [loadingContraPropostas, setLoadingContraPropostas] = useState(false);
  const [pageContraPropostas, setPageContraPropostas] = useState(1);
  const [totalPagesContraPropostas, setTotalPagesContraPropostas] = useState(1);
  const [totalContraPropostas, setTotalContraPropostas] = useState(0);
  const [showContraPropostaModal, setShowContraPropostaModal] = useState(false);
  const [submittingContraProposta, setSubmittingContraProposta] =
    useState(false);
  const [updatingContraPropostaStatusId, setUpdatingContraPropostaStatusId] =
    useState<string | null>(null);
  const [deletingContraPropostaId, setDeletingContraPropostaId] = useState<
    string | null
  >(null);
  /** Modal de assinaturas da contra proposta: id + opcional e-mail/nome para pré-preencher */
  const [contraPropostaAssinaturasModal, setContraPropostaAssinaturasModal] =
    useState<{
      id: string;
      defaultRecipientEmail?: string;
      defaultRecipientName?: string;
    } | null>(null);
  const [reenviarEmailModal, setReenviarEmailModal] = useState<{
    propostaId: string;
    numero: string;
    /** Etapa máxima liberada na proposta (1–3); define quais opções de etapa ficam habilitadas no reenvio */
    etapaProposta?: 1 | 2 | 3;
  } | null>(null);
  const [reenviarEmailText, setReenviarEmailText] = useState('');
  const [reenviarEmailEtapaSelecionada, setReenviarEmailEtapaSelecionada] = useState<1 | 2 | 3>(1);
  const [isReenviandoEmail, setIsReenviandoEmail] = useState(false);
  const [contraPropostaForm, setContraPropostaForm] = useState<{
    sellerName: string;
    corretorName: string;
    corretorCpf: string;
    proposedPrice: string;
    downPayment: string;
    paymentConditions: string;
    createdByType: 'corretor' | 'gestor' | 'cliente';
    recipientEmail: string;
  }>({
    sellerName: '',
    corretorName: '',
    corretorCpf: '',
    proposedPrice: '',
    downPayment: '',
    paymentConditions: '',
    createdByType: 'corretor',
    recipientEmail: '',
  });

  /** Etapa do fluxo: 1 = Comprador, 2 = Proprietário, 3 = Corretor e Captadores. Dados da proposta e imóvel sempre visíveis. */
  const [etapaAtual, setEtapaAtual] = useState<1 | 2 | 3>(() => {
    try {
      const s = localStorage.getItem('ficha_proposta_etapa');
      if (s === '1' || s === '2' || s === '3') return Number(s) as 1 | 2 | 3;
    } catch {
      // ignorar falha de localStorage
    }
    return 1;
  });
  /** Máxima etapa liberada pelas assinaturas (vinda do backend). Só é > 1 quando comprador/proprietário assinam. Impede avançar sem assinar. */
  const [maxEtapaLiberada, setMaxEtapaLiberada] = useState<1 | 2 | 3>(1);
  useEffect(() => {
    try {
      localStorage.setItem('ficha_proposta_etapa', String(etapaAtual));
    } catch {
      // ignorar falha de localStorage
    }
  }, [etapaAtual]);

  /** Busca de imóvel por código (API pública de propriedades) */
  const [buscaCodigoImovelProposta, setBuscaCodigoImovelProposta] =
    useState('');
  const [loadingPropriedadesProposta, setLoadingPropriedadesProposta] =
    useState(false);
  const [propriedadesBuscaProposta, setPropriedadesBuscaProposta] = useState<
    Property[]
  >([]);
  const [showDropdownImovelProposta, setShowDropdownImovelProposta] =
    useState(false);

  /** Filtro de status na listagem (rascunho | disponivel) – conforme doc status/visibilidade */
  const [filtroStatusProposta, setFiltroStatusProposta] = useState<
    PropostaStatus | ''
  >('');
  /** Filtros opcionais: data e busca (gestor/super user e corretor podem usar) */
  const [filtroDataInicioProposta, setFiltroDataInicioProposta] =
    useState<string>('');
  const [filtroDataFimProposta, setFiltroDataFimProposta] =
    useState<string>('');
  const [filtroSearchProposta, setFiltroSearchProposta] = useState<string>('');

  // Estados de login (sessão válida por 12h; controle no front, sem token no back)
  const [session, setSession] = useState<FichaPropostaSession | null>(() =>
    getValidFichaPropostaSession()
  );
  const userCpf = session?.cpf ?? null;
  const userTipo = session?.tipo ?? null;
  const userData = session?.user ?? null;

  /** Após assinatura, só gestor pode editar etapa anterior; corretor não pode. */
  const podeEditarEtapa = useCallback(
    (etapa: 1 | 2 | 3) => userTipo === 'gestor' || maxEtapaLiberada <= etapa,
    [userTipo, maxEtapaLiberada]
  );

  const [loginCpf, setLoginCpf] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Carregar dados salvos do localStorage
  const loadSavedData = (): Partial<FichaPropostaForm> | null => {
    try {
      const saved = localStorage.getItem('ficha_proposta_draft');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
    return null;
  };

  // Salvar dados no localStorage
  const saveDraft = (data: Partial<FichaPropostaForm>) => {
    try {
      localStorage.setItem('ficha_proposta_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  };

  const handleLogin = async () => {
    const cpf = loginCpf.replace(/\D/g, '');
    if (cpf.length !== 11 && cpf.length !== 14) {
      setLoginError('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
      return;
    }
    setLoginError('');
    setLoginLoading(true);
    try {
      const result = await identificarUsuarioPorCpf(cpf);
      if (!result.tipo || !result.user) {
        setLoginError('CPF ou CNPJ não cadastrado.');
        return;
      }
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      sessionStorage.setItem(STORAGE_USER_CPF, cpf);
      sessionStorage.setItem(STORAGE_USER_TIPO, result.tipo);
      sessionStorage.setItem(STORAGE_USER_DATA, JSON.stringify(result.user));
      sessionStorage.setItem(STORAGE_SESSION_EXPIRES_AT, String(expiresAt));
      setSession({ cpf, tipo: result.tipo, user: result.user });
      // Corretor logado vira o corretor da proposta automaticamente; gestor não precisa selecionar no início
      if (result.tipo === 'corretor') {
        setCorretorSelecionado(result.user);
        localStorage.setItem(
          'corretor_selecionado',
          JSON.stringify(result.user)
        );
      } else {
        setCorretorSelecionado(null);
        localStorage.removeItem('corretor_selecionado');
      }
      setLoginCpf('');
      showSuccess(
        result.tipo === 'gestor'
          ? 'Acesso gestor liberado.'
          : 'Acesso liberado.'
      );
    } catch {
      setLoginError('Erro ao verificar CPF. Tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_USER_CPF);
    sessionStorage.removeItem(STORAGE_USER_TIPO);
    sessionStorage.removeItem(STORAGE_USER_DATA);
    sessionStorage.removeItem(STORAGE_SESSION_EXPIRES_AT);
    localStorage.removeItem('corretor_selecionado');
    setSession(null);
    setCorretorSelecionado(null);
    showInfo('Você saiu. Informe o CPF novamente para acessar.');
  };

  // Handler para seleção de corretor
  const handleSelectCorretor = (corretor: TempUniaoUser) => {
    setCorretorSelecionado(corretor);
    localStorage.setItem('corretor_selecionado', JSON.stringify(corretor));
    setShowSelectCorretorModal(false);

    // Pré-preencher corretor 01
    if (corretoresForm.length === 0) {
      setValue(
        'corretores',
        [
          {
            id: corretor.id,
            nome: corretor.nome,
            email: corretor.email,
          },
        ],
        { shouldValidate: true, shouldDirty: true }
      );
    }

    // Carregar propostas se tiver CPF
    if (corretor.cpf) {
      carregarPropostas();
    }
  };

  // Carregar propostas da API (paginação 5 em 5, mais recentes primeiro). Aceita override de status e número da página.
  const carregarPropostas = async (
    overrideStatus?: PropostaStatus | '',
    pagina: number = 1
  ) => {
    if (loadingPropostas || !userCpf || !userTipo) return;
    const statusFilter =
      overrideStatus !== undefined ? overrideStatus : filtroStatusProposta;
    setLoadingPropostas(true);
    try {
      const baseFilters = {
        page: pagina,
        limit: 5,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(filtroDataInicioProposta?.trim()
          ? { dataInicio: filtroDataInicioProposta.trim() }
          : {}),
        ...(filtroDataFimProposta?.trim()
          ? { dataFim: filtroDataFimProposta.trim() }
          : {}),
        ...(filtroSearchProposta?.trim()
          ? { search: filtroSearchProposta.trim() }
          : {}),
      };
      const filters =
        userTipo === 'gestor'
          ? { gestorCpf: userCpf, ...baseFilters }
          : { corretorCpf: userCpf, ...baseFilters };
      const response = await listarPropostas(filters);
      const inner = response?.data;
      if (response.success && inner) {
        const propostas = inner.propostas ?? [];
        setPropostasEnviadas(
          Array.isArray(propostas) ? (propostas as PropostaEnviada[]) : []
        );
        setTotalPropostas(inner.total ?? 0);
        setPagePropostas(inner.page ?? pagina);
        setTotalPagesPropostas(inner.totalPages ?? 1);
      } else {
        showError(response.message || 'Erro ao carregar propostas');
        setPropostasEnviadas([]);
        setTotalPagesPropostas(1);
        setTotalPropostas(0);
      }
    } catch (error: any) {
      console.error('Erro ao carregar propostas:', error);
      showError(error?.message || 'Erro ao carregar propostas da API');
      setPropostasEnviadas([]);
      setTotalPagesPropostas(1);
      setTotalPropostas(0);
    } finally {
      setLoadingPropostas(false);
    }
  };

  // Carregar dados compartilhados da URL
  const sharedData = React.useMemo(() => {
    const sharedParam = searchParams.get('shared');
    if (sharedParam) {
      try {
        const decoded = decodeURIComponent(sharedParam);
        const jsonData = atob(decoded);
        return JSON.parse(jsonData) as Partial<FichaPropostaForm>;
      } catch (error) {
        console.error('Erro ao decodificar dados compartilhados:', error);
        return null;
      }
    }
    return null;
  }, [searchParams]);

  const savedData = loadSavedData();
  const hasSavedData = !!savedData;

  const getDefaultValues = (): FichaPropostaForm => {
    return {
      proposta: {
        dataProposta:
          savedData?.proposta?.dataProposta ||
          new Date().toISOString().split('T')[0],
        prazoValidade: savedData?.proposta?.prazoValidade || 30,
        precoProposto: savedData?.proposta?.precoProposto || '',
        condicoesPagamento: savedData?.proposta?.condicoesPagamento || '',
        valorSinal: savedData?.proposta?.valorSinal || undefined,
        prazoPagamentoSinal:
          savedData?.proposta?.prazoPagamentoSinal || undefined,
        porcentagemComissao: savedData?.proposta?.porcentagemComissao || 0,
        prazoEntrega: savedData?.proposta?.prazoEntrega || 60,
        multaMensal: savedData?.proposta?.multaMensal || '0',
        unidadeVenda: savedData?.proposta?.unidadeVenda || 'União Esmeralda',
        unidadeCaptacao:
          savedData?.proposta?.unidadeCaptacao || 'União Esmeralda',
      },
      proponente: {
        nome: savedData?.proponente?.nome || '',
        rg: savedData?.proponente?.rg || '',
        cpf: savedData?.proponente?.cpf || '',
        nacionalidade: savedData?.proponente?.nacionalidade || 'Brasileiro',
        estadoCivil: savedData?.proponente?.estadoCivil || '',
        regimeCasamento: savedData?.proponente?.regimeCasamento || '',
        dataNascimento: savedData?.proponente?.dataNascimento || '',
        profissao: savedData?.proponente?.profissao || '',
        email: savedData?.proponente?.email || '',
        telefone: savedData?.proponente?.telefone || '',
        residenciaAtual: savedData?.proponente?.residenciaAtual || '',
        bairro: savedData?.proponente?.bairro || '',
        cep: savedData?.proponente?.cep || '',
        cidade: savedData?.proponente?.cidade || '',
        estado: savedData?.proponente?.estado || '',
      },
      possuiProponenteConjuge: savedData?.possuiProponenteConjuge || false,
      proponenteConjuge: savedData?.proponenteConjuge || undefined,
      imovel: {
        matricula: savedData?.imovel?.matricula || '',
        cartorio: savedData?.imovel?.cartorio || '',
        cadastroPrefeitura: savedData?.imovel?.cadastroPrefeitura || '',
        endereco: savedData?.imovel?.endereco || '',
        bairro: savedData?.imovel?.bairro || '',
        cidade: savedData?.imovel?.cidade || '',
        estado: savedData?.imovel?.estado || '',
      },
      proprietario: {
        nome: savedData?.proprietario?.nome || '',
        rg: savedData?.proprietario?.rg || '',
        cpf: savedData?.proprietario?.cpf || '',
        nacionalidade: savedData?.proprietario?.nacionalidade || 'Brasileiro',
        estadoCivil: savedData?.proprietario?.estadoCivil || '',
        regimeCasamento: savedData?.proprietario?.regimeCasamento || '',
        dataNascimento: savedData?.proprietario?.dataNascimento || '',
        profissao: savedData?.proprietario?.profissao || '',
        email: savedData?.proprietario?.email || '',
        telefone: savedData?.proprietario?.telefone || '',
        residenciaAtual: savedData?.proprietario?.residenciaAtual || '',
        bairro: savedData?.proprietario?.bairro || '',
      },
      possuiProprietarioConjuge: savedData?.possuiProprietarioConjuge || false,
      proprietarioConjuge: savedData?.proprietarioConjuge || undefined,
      corretores: savedData?.corretores || [],
      captadores: savedData?.captadores || [],
    };
  };

  const defaultValues = getDefaultValues();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors },
    control,
  } = useForm<FichaPropostaForm>({
    defaultValues,
  });

  // Usar useWatch para garantir reatividade
  const emptyCorretoresArray = useMemo(
    () => [] as NonNullable<FichaPropostaForm['corretores']>,
    []
  );
  const emptyCaptadoresArray = useMemo(
    () => [] as NonNullable<FichaPropostaForm['captadores']>,
    []
  );
  const corretoresForm =
    useWatch({ control, name: 'corretores' }) ?? emptyCorretoresArray;
  const captadoresForm =
    useWatch({ control, name: 'captadores' }) ?? emptyCaptadoresArray;

  // Função para resetar o formulário
  const resetForm = useCallback(() => {
    const emptyValues: FichaPropostaForm = {
      proposta: {
        dataProposta: new Date().toISOString().split('T')[0],
        prazoValidade: 30,
        precoProposto: '',
        condicoesPagamento: '',
        valorSinal: undefined,
        prazoPagamentoSinal: undefined,
        porcentagemComissao: 0,
        prazoEntrega: 60,
        multaMensal: '0',
        unidadeVenda: 'União Esmeralda',
        unidadeCaptacao: 'União Esmeralda',
      },
      proponente: {
        nome: '',
        rg: '',
        cpf: '',
        nacionalidade: 'Brasileiro',
        estadoCivil: '',
        regimeCasamento: '',
        dataNascimento: '',
        profissao: '',
        email: '',
        telefone: '',
        residenciaAtual: '',
        bairro: '',
        cep: '',
        cidade: '',
        estado: '',
      },
      possuiProponenteConjuge: false,
      proponenteConjuge: undefined,
      imovel: {
        matricula: '',
        cartorio: '',
        cadastroPrefeitura: '',
        cep: '',
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
      proprietario: {
        nome: '',
        rg: '',
        cpf: '',
        nacionalidade: 'Brasileiro',
        estadoCivil: '',
        regimeCasamento: '',
        dataNascimento: '',
        profissao: '',
        email: '',
        telefone: '',
        residenciaAtual: '',
        bairro: '',
      },
      possuiProprietarioConjuge: false,
      proprietarioConjuge: undefined,
      corretores: [],
      captadores: [],
    };

    reset(emptyValues);

    // Voltar para etapa 1 ao limpar e travar novamente (nova proposta)
    setEtapaAtual(1);
    setMaxEtapaLiberada(1);

    // Resetar seções expandidas
    setExpandedSections({
      proposta: true,
      proponente: true,
      proponenteConjuge: false,
      imovel: true,
      proprietario: true,
      proprietarioConjuge: false,
      corretores: false,
      captadores: false,
    });
  }, [reset]);

  // Verificar expiração da sessão a cada minuto (12h sem token no back; controle no front)
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const valid = getValidFichaPropostaSession();
      if (!valid) {
        setSession(null);
        setCorretorSelecionado(null);
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Restaurar corretor quando usuário já está logado (corretor) – API de login retorna os dados, não é mais necessário selecionar no início
  useEffect(() => {
    if (userCpf && userTipo === 'corretor' && userData) {
      setCorretorSelecionado(userData);
    } else if (userTipo === 'gestor') {
      setCorretorSelecionado(null);
    }
  }, [userCpf, userTipo, userData]);

  // Pré-preencher corretor 01 quando um corretor for selecionado
  useEffect(() => {
    if (corretorSelecionado) {
      // Verificar se já existe algum corretor preenchido
      const currentCorretores = corretoresForm || [];
      if (currentCorretores.length === 0) {
        setValue(
          'corretores',
          [
            {
              id: corretorSelecionado.id,
              nome: corretorSelecionado.nome,
              email: corretorSelecionado.email,
            },
          ],
          { shouldValidate: true, shouldDirty: true }
        );
      }
    }
  }, [corretorSelecionado, corretoresForm, setValue]);

  // Carregar dados após montagem
  useEffect(() => {
    // Habilitar scroll na página
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    // Garantir tema light
    document.body.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
    setIsLoading(false);
    if (savedData) {
      showInfo(
        'Rascunho carregado automaticamente. Seus dados foram restaurados.'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Carregar lista de propostas quando o usuário estiver logado (ao abrir a página ou logo após o login, sem precisar de F5)
  useEffect(() => {
    if (userCpf && userTipo) carregarPropostas();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carregarPropostas estável por closure
  }, [userCpf, userTipo]);

  // Carregar dados compartilhados quando a página carregar
  useEffect(() => {
    if (sharedData && !isLoading && !hasLoadedSharedData) {
      console.log('🔄 Carregando dados compartilhados...', sharedData);
      setHasLoadedSharedData(true);

      // Limpar dados existentes
      localStorage.removeItem('ficha_proposta_draft');
      localStorage.removeItem('ficha_proposta_etapa');
      resetForm();

      // Aguardar um pouco para garantir que o reset foi aplicado
      setTimeout(() => {
        // Preencher com dados compartilhados
        if (sharedData.proposta) {
          Object.keys(sharedData.proposta).forEach(key => {
            const value = (sharedData.proposta as any)[key];
            if (value !== undefined) {
              setValue(`proposta.${key}` as any, value);
            }
          });
        }

        if (sharedData.proponente) {
          Object.keys(sharedData.proponente).forEach(key => {
            const value = (sharedData.proponente as any)[key];
            if (value !== undefined) {
              setValue(`proponente.${key}` as any, value);
            }
          });
        }

        if (sharedData.proponenteConjuge) {
          setValue('possuiProponenteConjuge', true);
          Object.keys(sharedData.proponenteConjuge).forEach(key => {
            const value = (sharedData.proponenteConjuge as any)[key];
            if (value !== undefined) {
              setValue(`proponenteConjuge.${key}` as any, value);
            }
          });
        }

        if (sharedData.imovel) {
          Object.keys(sharedData.imovel).forEach(key => {
            const value = (sharedData.imovel as any)[key];
            if (value !== undefined) {
              setValue(`imovel.${key}` as any, value);
            }
          });
        }

        if (sharedData.proprietario) {
          Object.keys(sharedData.proprietario).forEach(key => {
            const value = (sharedData.proprietario as any)[key];
            if (value !== undefined) {
              setValue(`proprietario.${key}` as any, value);
            }
          });
        }

        if (sharedData.proprietarioConjuge) {
          setValue('possuiProprietarioConjuge', true);
          Object.keys(sharedData.proprietarioConjuge).forEach(key => {
            const value = (sharedData.proprietarioConjuge as any)[key];
            if (value !== undefined) {
              setValue(`proprietarioConjuge.${key}` as any, value);
            }
          });
        }

        // Expandir todas as seções
        setExpandedSections({
          proposta: true,
          proponente: true,
          proponenteConjuge: !!sharedData.possuiProponenteConjuge,
          imovel: true,
          proprietario: true,
          proprietarioConjuge: !!sharedData.possuiProprietarioConjuge,
          corretores:
            !!sharedData.corretores && sharedData.corretores.length > 0,
          captadores:
            !!sharedData.captadores && sharedData.captadores.length > 0,
        });

        showInfo('Dados compartilhados carregados com sucesso!');
      }, 100);
    }
  }, [sharedData, isLoading, setValue, hasLoadedSharedData, resetForm]);

  // Carregar proposta por ID quando a URL for /ficha-proposta/:id (compartilhamento – exige CPF vinculado)
  useEffect(() => {
    const id = (propostaIdFromUrl ?? '').toString().trim();
    if (!id || id === 'undefined' || id === 'null') {
      setPropostaAccessDenied(false);
      setStatusPropostaAtual('');
      return;
    }
    if (!userCpf || !userTipo) {
      setPropostaAccessDenied(false);
      return;
    }
    let cancelled = false;
    setLoadingPropostaById(true);
    setPropostaAccessDenied(false);
    buscarPropostaPorId(
      id,
      userTipo === 'gestor' ? { gestorCpf: userCpf } : { corretorCpf: userCpf }
    )
      .then(result => {
        if (cancelled) return;
        const data = result.success ? result.data : (result as any);
        if (!data || !data.id) return;
        setPropostaAccessDenied(false);
        const d = data as any;
        if (d.proposta) {
          Object.keys(d.proposta).forEach(key => {
            const v = d.proposta[key];
            if (v !== undefined) setValue(`proposta.${key}` as any, v);
          });
        } else {
          if (d.dataProposta) setValue('proposta.dataProposta', d.dataProposta);
          if (d.precoProposto != null)
            setValue('proposta.precoProposto', d.precoProposto);
        }
        if (d.proponente) {
          Object.keys(d.proponente).forEach(key => {
            const v = d.proponente[key];
            if (v !== undefined) setValue(`proponente.${key}` as any, v);
          });
        }
        if (d.proponenteConjuge) {
          setValue('possuiProponenteConjuge', true);
          Object.keys(d.proponenteConjuge).forEach(key => {
            const v = d.proponenteConjuge[key];
            if (v !== undefined) setValue(`proponenteConjuge.${key}` as any, v);
          });
        }
        if (d.imovel) {
          Object.keys(d.imovel).forEach(key => {
            const v = d.imovel[key];
            if (v !== undefined) setValue(`imovel.${key}` as any, v);
          });
        }
        if (d.proprietario) {
          Object.keys(d.proprietario).forEach(key => {
            const v = d.proprietario[key];
            if (v !== undefined) setValue(`proprietario.${key}` as any, v);
          });
        }
        if (d.proprietarioConjuge) {
          setValue('possuiProprietarioConjuge', true);
          Object.keys(d.proprietarioConjuge).forEach(key => {
            const v = d.proprietarioConjuge[key];
            if (v !== undefined)
              setValue(`proprietarioConjuge.${key}` as any, v);
          });
        }
        if (d.corretores?.length) setValue('corretores', d.corretores);
        const captadores = d.captadores?.length ? d.captadores : d.captadoresData?.length ? d.captadoresData : [];
        if (captadores.length) setValue('captadores', captadores);
        // Etapa vinda do backend (definida pelas assinaturas): só libera etapas 2/3 após assinaturas
        if (d.etapa === 1 || d.etapa === 2 || d.etapa === 3) {
          setMaxEtapaLiberada(d.etapa);
          setEtapaAtual(d.etapa);
        }
        setStatusPropostaAtual(d.status === 'disponivel' ? 'disponivel' : d.status === 'rascunho' ? 'rascunho' : '');
        showSuccess('Proposta carregada. Você pode continuar o preenchimento.');
      })
      .catch((err: any) => {
        if (cancelled) return;
        const is403 = err?.statusCode === 403 || err?.response?.status === 403;
        setPropostaAccessDenied(!!is403);
        if (!is403) showError(err?.message || 'Erro ao carregar proposta.');
      })
      .finally(() => {
        if (!cancelled) setLoadingPropostaById(false);
      });
    return () => {
      cancelled = true;
    };
  }, [propostaIdFromUrl, userCpf, userTipo, setValue, setEtapaAtual]);

  // Abrir modal de assinaturas automaticamente após envio com sucesso (navegação com state)
  useEffect(() => {
    const state = location.state as { openAssinaturas?: boolean; proposalNumero?: string } | undefined;
    if (propostaIdFromUrl && state?.openAssinaturas) {
      const numero = state.proposalNumero ?? propostasEnviadas.find(p => p.id === propostaIdFromUrl)?.numero ?? 'Proposta';
      setPropostaAssinaturasModal({ id: propostaIdFromUrl, numero });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [propostaIdFromUrl, location.state, location.pathname, navigate, propostasEnviadas]);

  // Salvar automaticamente quando houver mudanças
  useEffect(() => {
    if (!isLoading) {
      const subscription = watch(data => {
        saveDraft(data as Partial<FichaPropostaForm>);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isLoading]);

  // Estados para seções colapsáveis
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    proposta: true,
    proponente: true,
    proponenteConjuge: false,
    imovel: true,
    proprietario: true,
    proprietarioConjuge: false,
    corretores: false,
    captadores: false,
  });

  // Toggle seção
  const toggleSection = (section: string) => {
    const wasExpanded = expandedSections[section];

    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));

    // Carregar corretores quando a seção for expandida
    if (
      section === 'corretores' &&
      !wasExpanded &&
      corretoresDisponiveis.length === 0
    ) {
      carregarCorretores();
    }

    // Carregar gestores quando a seção de captadores for expandida
    if (
      section === 'captadores' &&
      !wasExpanded &&
      gestoresDisponiveis.length === 0
    ) {
      carregarGestores();
    }
  };

  // Carregar lista de corretores
  const carregarCorretores = async () => {
    if (loadingCorretores || corretoresDisponiveis.length > 0) return;

    setLoadingCorretores(true);
    try {
      const corretores = await buscarCorretores();
      console.log('✅ Corretores carregados:', corretores);
      setCorretoresDisponiveis(corretores);
    } catch (error: any) {
      console.error('❌ Erro ao carregar corretores:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        'Erro ao carregar lista de corretores';
      showError(errorMessage);
    } finally {
      setLoadingCorretores(false);
    }
  };

  // Carregar lista de gestores
  const carregarGestores = async () => {
    if (loadingGestores || gestoresDisponiveis.length > 0) return;

    setLoadingGestores(true);
    try {
      const gestores = await buscarGestores();
      console.log('✅ Gestores carregados:', gestores);
      setGestoresDisponiveis(gestores);
    } catch (error: any) {
      console.error('❌ Erro ao carregar gestores:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        'Erro ao carregar lista de gestores';
      showError(errorMessage);
    } finally {
      setLoadingGestores(false);
    }
  };

  // Carregar contra propostas da proposta atual (paginação 5 em 5, mais recentes primeiro)
  const carregarContraPropostas = React.useCallback(
    async (pagina: number = 1) => {
      if (!propostaIdFromUrl) return;
      setLoadingContraPropostas(true);
      try {
        const params = userCpf
          ? {
              ...(userTipo === 'gestor'
                ? { gestorCpf: userCpf }
                : { corretorCpf: userCpf }),
              page: pagina,
              limit: 5,
            }
          : { page: pagina, limit: 5 };
        const res = await listarContraPropostas(propostaIdFromUrl, params);
        setContraPropostas(res.data);
        setTotalPagesContraPropostas(res.totalPages);
        setTotalContraPropostas(res.total);
        setPageContraPropostas(res.page);
      } catch {
        setContraPropostas([]);
        setTotalPagesContraPropostas(1);
        setTotalContraPropostas(0);
      } finally {
        setLoadingContraPropostas(false);
      }
    },
    [propostaIdFromUrl, userCpf, userTipo]
  );

  React.useEffect(() => {
    if (propostaIdFromUrl && userCpf) carregarContraPropostas(1);
    else if (propostaIdFromUrl && !userCpf) {
      setContraPropostas([]);
      setPageContraPropostas(1);
      setTotalPagesContraPropostas(1);
      setTotalContraPropostas(0);
    }
  }, [propostaIdFromUrl, userCpf, carregarContraPropostas]);

  const abrirModalContraProposta = () => {
    const proprietarioNome = watch('proprietario.nome') || '';
    const corretores = watch('corretores') || [];
    const primeiroCorretor = corretores[0];
    const valorProposta = watch('proposta.precoProposto');
    setContraPropostaForm({
      sellerName: proprietarioNome,
      corretorName: primeiroCorretor?.nome || '',
      corretorCpf: '',
      proposedPrice:
        valorProposta != null && Number(valorProposta) >= 0
          ? formatCurrencyValue(Number(valorProposta))
          : '',
      downPayment: '',
      paymentConditions: '',
      createdByType:
        userTipo === 'gestor' ? 'gestor' : userCpf ? 'corretor' : 'cliente',
      recipientEmail: '',
    });
    setShowContraPropostaModal(true);
  };

  const enviarContraProposta = async () => {
    if (!propostaIdFromUrl) return;
    const valor = getNumericValue(contraPropostaForm.proposedPrice);
    if (valor <= 0 || isNaN(valor)) {
      showError('Informe um valor proposto válido.');
      return;
    }
    setSubmittingContraProposta(true);
    try {
      const dto: CreateContraPropostaDto = {
        proposalId: propostaIdFromUrl,
        sellerName: contraPropostaForm.sellerName.trim() || 'Vendedor',
        corretorName: contraPropostaForm.corretorName.trim() || 'Corretor',
        corretorCpf:
          contraPropostaForm.corretorCpf.replace(/\D/g, '') || undefined,
        proposedPrice: valor,
        downPayment: contraPropostaForm.downPayment
          ? getNumericValue(contraPropostaForm.downPayment)
          : undefined,
        paymentConditions:
          contraPropostaForm.paymentConditions.trim() || undefined,
        createdByType: contraPropostaForm.createdByType,
        createdByCpf: userCpf?.replace(/\D/g, ''),
        recipientEmail: contraPropostaForm.recipientEmail.trim() || undefined,
      };
      const params = userCpf
        ? userTipo === 'gestor'
          ? { gestorCpf: userCpf }
          : { corretorCpf: userCpf }
        : undefined;
      const res = await criarContraProposta(dto, params);
      showSuccess('Contra proposta criada com sucesso.');
      setShowContraPropostaModal(false);
      carregarContraPropostas(1);
      if (res?.data?.id && userCpf && userTipo) {
        setContraPropostaAssinaturasModal({
          id: res.data.id,
          defaultRecipientEmail:
            contraPropostaForm.recipientEmail.trim() || undefined,
          defaultRecipientName:
            contraPropostaForm.sellerName.trim() || undefined,
        });
      }
    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'Erro ao criar contra proposta.'
      );
    } finally {
      setSubmittingContraProposta(false);
    }
  };

  const responderContraProposta = async (
    id: string,
    status: 'aprovada' | 'recusada'
  ) => {
    setUpdatingContraPropostaStatusId(id);
    const params = userCpf
      ? userTipo === 'gestor'
        ? { gestorCpf: userCpf }
        : { corretorCpf: userCpf }
      : undefined;
    try {
      await atualizarStatusContraProposta(id, status, params);
      showSuccess(
        `Contra proposta ${status === 'aprovada' ? 'aprovada' : 'recusada'} com sucesso.`
      );
      carregarContraPropostas(pageContraPropostas);
    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'Erro ao atualizar status.'
      );
    } finally {
      setUpdatingContraPropostaStatusId(null);
    }
  };

  const excluirContraPropostaClick = async (id: string) => {
    if (
      !window.confirm(
        'Excluir esta contra proposta? Só é possível excluir se não houver assinaturas já realizadas.'
      )
    )
      return;
    setDeletingContraPropostaId(id);
    const params = userCpf
      ? userTipo === 'gestor'
        ? { gestorCpf: userCpf }
        : { corretorCpf: userCpf }
      : undefined;
    try {
      await excluirContraProposta(id, params);
      showSuccess('Contra proposta excluída com sucesso.');
      carregarContraPropostas(pageContraPropostas);
    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          'Erro ao excluir contra proposta.'
      );
    } finally {
      setDeletingContraPropostaId(null);
    }
  };

  // Estados para loading de CEP
  const [loadingCEP, setLoadingCEP] = useState<Record<string, boolean>>({});

  // Buscar endereço por CEP (proponente)
  const buscarCEPProponente = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    setLoadingCEP(prev => ({ ...prev, proponente: true }));

    try {
      const addressData = await fetchAddressByZipCode(cleanCEP);
      setValue('proponente.residenciaAtual', addressData.street);
      setValue('proponente.bairro', addressData.neighborhood);
      setValue('proponente.cidade', addressData.city);
      setValue('proponente.estado', addressData.state);
      showSuccess('Endereço encontrado!');
    } catch {
      showError('CEP não encontrado ou inválido');
    } finally {
      setLoadingCEP(prev => ({ ...prev, proponente: false }));
    }
  };

  // Buscar endereço do imóvel por CEP
  const buscarCEPImovel = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    setLoadingCEP(prev => ({ ...prev, imovel: true }));

    try {
      const addressData = await fetchAddressByZipCode(cleanCEP);
      setValue('imovel.endereco', addressData.street);
      setValue('imovel.bairro', addressData.neighborhood);
      setValue('imovel.cidade', addressData.city);
      setValue('imovel.estado', addressData.state);
      showSuccess('Endereço encontrado!');
    } catch {
      showError('CEP não encontrado ou inválido');
    } finally {
      setLoadingCEP(prev => ({ ...prev, imovel: false }));
    }
  };

  const CIDADE_PADRAO_BUSCA_IMOVEL = 'Marília';

  // Buscar imóvel por código (API pública de propriedades) – preenche bloco imóvel
  const buscarPropriedadesPorCodigoProposta = async () => {
    const codigo = buscaCodigoImovelProposta?.trim();
    if (!codigo) {
      showWarning('Digite o código do imóvel para buscar.');
      return;
    }
    const cidade = watch('imovel.cidade')?.trim() || CIDADE_PADRAO_BUSCA_IMOVEL;
    setLoadingPropriedadesProposta(true);
    setShowDropdownImovelProposta(false);
    setPropriedadesBuscaProposta([]);
    try {
      const result = await getPublicProperties(
        { code: codigo, city: cidade },
        { page: 1, limit: 20 }
      );
      const list = (result as any).data ?? (result as any).properties ?? [];
      const arr = Array.isArray(list) ? list : [];
      setPropriedadesBuscaProposta(arr);
      setShowDropdownImovelProposta(true);
      if (arr.length === 0)
        showInfo('Nenhum imóvel encontrado com esse código.');
    } catch {
      showError('Erro ao buscar imóveis. Tente novamente.');
    } finally {
      setLoadingPropriedadesProposta(false);
    }
  };

  const selecionarPropriedadeParaImovelProposta = (prop: Property) => {
    const imovel = propriedadeParaImovelFichaProposta(prop);
    setValue('imovel.matricula', imovel.matricula);
    setValue('imovel.cep', maskCEP(imovel.cep));
    setValue('imovel.endereco', imovel.endereco);
    setValue('imovel.bairro', imovel.bairro);
    setValue('imovel.cidade', imovel.cidade);
    setValue('imovel.estado', imovel.estado);
    setShowDropdownImovelProposta(false);
    setPropriedadesBuscaProposta([]);
    showSuccess('Imóvel preenchido com os dados da propriedade.');
  };

  // Preencher ficha de venda a partir da proposta selecionada
  const handlePreencherFichaVenda = async (propostaId: string) => {
    const id = (propostaId ?? '').toString().trim();
    if (!id || id === 'undefined' || id === 'null') {
      showError('ID da proposta é obrigatório.');
      return;
    }
    if (!userCpf || !userTipo) {
      showError('É necessário estar logado para preencher a ficha de venda.');
      return;
    }
    try {
      const result = await buscarPropostaPorId(
        id,
        userTipo === 'gestor'
          ? { gestorCpf: userCpf }
          : { corretorCpf: userCpf }
      );
      const propostaData: PropostaListItem | undefined = result.success
        ? result.data
        : undefined;
      if (!propostaData?.id) {
        showError('Proposta não encontrada ou sem permissão.');
        return;
      }
      // Salvar dados da proposta em sessionStorage para a FichaVendaPage ler
      sessionStorage.setItem(
        'ficha_venda_from_proposta',
        JSON.stringify(propostaData)
      );
      // Navegar para ficha-venda
      navigate('/ficha-venda?fromProposta=' + id);
      showSuccess('Redirecionando para Ficha de Venda...');
    } catch (err: any) {
      console.error('Erro ao buscar proposta:', err);
      showError(err?.message || 'Erro ao carregar proposta.');
    }
  };

  const handleSubmitReenviarEmail = async () => {
    if (!reenviarEmailModal || !userCpf || !userTipo) return;
    const emails = reenviarEmailText
      .split(/[\n,;]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);
    const validEmails = emails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (validEmails.length === 0) {
      showError('Digite ao menos um email válido (separados por vírgula ou um por linha).');
      return;
    }
    const maxEtapa = reenviarEmailModal.etapaProposta ?? 1;
    const etapaToSend = reenviarEmailEtapaSelecionada <= maxEtapa ? reenviarEmailEtapaSelecionada : 1;
    setIsReenviandoEmail(true);
    try {
      const result = await reenviarEmailProposta(
        reenviarEmailModal.propostaId,
        userTipo === 'gestor' ? userCpf : undefined,
        userTipo === 'corretor' ? userCpf : undefined,
        validEmails,
        etapaToSend
      );
      if (result.success) {
        showSuccess(result.message ?? 'Email reenviado com sucesso.');
        setReenviarEmailModal(null);
        setReenviarEmailText('');
        setReenviarEmailEtapaSelecionada(1);
      } else {
        showError(result.message ?? 'Falha ao reenviar email.');
      }
    } catch (err: any) {
      showError(err?.message ?? 'Erro ao reenviar email.');
    } finally {
      setIsReenviandoEmail(false);
    }
  };

  // Handler de máscara CPF
  const handleCPFChange = (value: string, field: string) => {
    const masked = maskCPF(value);
    setValue(field as any, masked);
  };

  // Handler de máscara Moeda
  const handleMoneyChange = (value: string, field: string) => {
    const masked = formatCurrency(value);
    setValue(field as any, masked);
  };

  // Validar idade mínima (18 anos)
  const validateAge = (dateString: string): boolean => {
    if (!dateString) return true;
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  // Validar data não pode ser no futuro
  const validateDateNotFuture = (dateString: string): boolean => {
    if (!dateString) return true;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Fim do dia de hoje
    return selectedDate <= today;
  };

  // Validar valor monetário mínimo
  const validateMinValue = (value: string, min: number = 0.01): boolean => {
    if (!value) return false;
    const numericValue = getNumericValue(value);
    return numericValue >= min;
  };

  // Validar nome (mínimo 3 caracteres)
  const validateName = (name: string): boolean => {
    if (!name) return false;
    const trimmed = name.trim();
    return trimmed.length >= 3 && trimmed.split(' ').length >= 2; // Mínimo 2 palavras
  };

  // Validar RG (mínimo 4 dígitos)
  const validateRG = (rg: string): boolean => {
    if (!rg) return false;
    const cleanRG = rg.replace(/\D/g, '');
    return cleanRG.length >= 4; // Mínimo 4 dígitos
  };

  // Normalizar nome da unidade removendo acentos (API espera "Uniao" ao invés de "União")
  const normalizeUnidadeName = (nome: string): string => {
    return nome
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
      .replace(/ã/g, 'a')
      .replace(/õ/g, 'o');
  };

  // Preparar payload
  const preparePayload = (
    data: FichaPropostaForm
  ): CreatePurchaseProposalDto => {
    const payload: CreatePurchaseProposalDto = {
      proposta: {
        dataProposta: data.proposta.dataProposta,
        prazoValidade: data.proposta.prazoValidade,
        precoProposto: getNumericValue(data.proposta.precoProposto),
        condicoesPagamento: data.proposta.condicoesPagamento.trim(),
        porcentagemComissao: data.proposta.porcentagemComissao ?? 0,
        prazoEntrega: data.proposta.prazoEntrega ?? 0,
        multaMensal: data.proposta.multaMensal
          ? getNumericValue(data.proposta.multaMensal)
          : 0,
        unidadeVenda: normalizeUnidadeName(data.proposta.unidadeVenda),
        unidadeCaptacao: normalizeUnidadeName(data.proposta.unidadeCaptacao),
      },
      proponente: {
        nome: data.proponente.nome.trim(),
        rg: data.proponente.rg.replace(/\D/g, ''),
        cpf: data.proponente.cpf.replace(/\D/g, ''),
        nacionalidade: data.proponente.nacionalidade.trim(),
        estadoCivil: data.proponente.estadoCivil.trim(),
        regimeCasamento: data.proponente.regimeCasamento?.trim() || undefined,
        dataNascimento: data.proponente.dataNascimento,
        profissao: data.proponente.profissao?.trim() || undefined,
        email: data.proponente.email.trim(),
        telefone: data.proponente.telefone.replace(/\D/g, ''),
        residenciaAtual: data.proponente.residenciaAtual.trim(),
        bairro: data.proponente.bairro.trim(),
        cep: data.proponente.cep.replace(/\D/g, ''),
        cidade: data.proponente.cidade.trim(),
        estado: data.proponente.estado.toUpperCase(),
      },
      proponenteConjuge:
        data.possuiProponenteConjuge && data.proponenteConjuge
          ? {
              nome: data.proponenteConjuge.nome.trim(),
              rg: data.proponenteConjuge.rg.replace(/\D/g, ''),
              cpf: data.proponenteConjuge.cpf.replace(/\D/g, ''),
              profissao: data.proponenteConjuge.profissao?.trim() || undefined,
              email: data.proponenteConjuge.email.trim(),
              telefone: data.proponenteConjuge.telefone.replace(/\D/g, ''),
            }
          : null,
      imovel: {
        matricula: data.imovel.matricula?.trim() ?? '',
        cartorio: data.imovel.cartorio?.trim() ?? '',
        cadastroPrefeitura: data.imovel.cadastroPrefeitura?.trim() || undefined,
        endereco: data.imovel.endereco.trim(),
        bairro: data.imovel.bairro.trim(),
        cidade: data.imovel.cidade.trim(),
        estado: data.imovel.estado.toUpperCase(),
      },
      proprietario: {
        nome: (data.proprietario?.nome || '').trim(),
        rg: (data.proprietario?.rg || '').replace(/\D/g, ''),
        cpf: (data.proprietario?.cpf || '').replace(/\D/g, ''),
        nacionalidade: (data.proprietario?.nacionalidade || '').trim(),
        estadoCivil: (data.proprietario?.estadoCivil || '').trim(),
        regimeCasamento:
          data.proprietario?.regimeCasamento?.trim() || undefined,
        dataNascimento: data.proprietario?.dataNascimento ?? '',
        profissao: data.proprietario?.profissao?.trim() || undefined,
        email: (data.proprietario?.email || '').trim(),
        telefone: (data.proprietario?.telefone || '').replace(/\D/g, ''),
        residenciaAtual: (data.proprietario?.residenciaAtual || '').trim(),
        bairro: (data.proprietario?.bairro || '').trim(),
      },
      proprietarioConjuge:
        data.possuiProprietarioConjuge && data.proprietarioConjuge
          ? {
              nome: data.proprietarioConjuge.nome.trim(),
              rg: data.proprietarioConjuge.rg.replace(/\D/g, ''),
              cpf: data.proprietarioConjuge.cpf.replace(/\D/g, ''),
              profissao:
                data.proprietarioConjuge.profissao?.trim() || undefined,
              email: data.proprietarioConjuge.email.trim(),
              telefone: data.proprietarioConjuge.telefone.replace(/\D/g, ''),
            }
          : null,
      // Ao enviar (confirmar no modal), proposta já sai como disponível (não rascunho)
      status: 'disponivel',
    };

    // Adicionar valorSinal e prazoPagamentoSinal apenas se preenchidos
    if (data.proposta.valorSinal && data.proposta.valorSinal.trim() !== '') {
      payload.proposta.valorSinal = getNumericValue(data.proposta.valorSinal);
    }
    if (
      data.proposta.prazoPagamentoSinal !== undefined &&
      data.proposta.prazoPagamentoSinal !== null
    ) {
      payload.proposta.prazoPagamentoSinal = data.proposta.prazoPagamentoSinal;
    }

    // Adicionar corretores se houver (até 3)
    if (data.corretores && data.corretores.length > 0) {
      payload.corretores = data.corretores.slice(0, 3).map(c => ({
        id: c.id.trim(),
        nome: c.nome.trim(),
        email: c.email.trim(),
      }));
    }

    // Adicionar captadores se houver (até 3)
    if (data.captadores && data.captadores.length > 0) {
      payload.captadores = data.captadores.slice(0, 3).map(c => ({
        id: c.id.trim(),
        nome: c.nome.trim(),
        ...(c.porcentagem != null && !Number.isNaN(Number(c.porcentagem))
          ? { porcentagem: Math.min(100, Math.max(0, Number(c.porcentagem))) }
          : {}),
      }));
    }

    return payload;
  };

  // Enviar para API
  const sendToApi = async (payload: CreatePurchaseProposalDto) => {
    setIsSubmitting(true);

    try {
      console.log('📋 Dados da Proposta de Compra:', payload);
      console.log('📋 Payload JSON:', JSON.stringify(payload, null, 2));
      console.log('🌐 URL da API:', `${API_BASE_URL}/api/ficha-proposta`);

      // Enviar para API
      const response = await criarFichaProposta(payload);
      console.log('✅ Resposta da API:', response);

      let propostaId = (response.data?.id ?? '').toString().trim();
      // Se a API não retornou o id no body, obter da listagem (primeira proposta = mais recente)
      if (!propostaId && userCpf && userTipo) {
        try {
          const filters =
            userTipo === 'gestor'
              ? { gestorCpf: userCpf, page: 1, limit: 5 }
              : { corretorCpf: userCpf, page: 1, limit: 5 };
          const listResponse = await listarPropostas(filters);
          const propostas =
            listResponse?.data?.propostas ??
            (listResponse as any)?.propostas ??
            [];
          const primeira = Array.isArray(propostas) ? propostas[0] : null;
          propostaId = (primeira?.id ?? '').toString().trim();
        } catch (e) {
          console.warn(
            'Não foi possível obter id da proposta pela listagem:',
            e
          );
        }
      }

      // Recarregar propostas da API após envio bem-sucedido
      carregarPropostas();

      // Limpar rascunho e formulário após finalizar etapa 1 (envio da proposta)
      localStorage.removeItem('ficha_proposta_draft');
      localStorage.removeItem('ficha_proposta_etapa');
      resetForm();

      // Fechar modal
      setShowConfirmModal(false);
      setPendingPayload(null);

      showSuccess('Proposta enviada. Formulário limpo para nova proposta. Use "Ver Propostas" para abrir assinaturas da proposta enviada.', { autoClose: 6000 });

      // Redirecionar para /ficha-proposta (sem id) com formulário limpo; abrir lista para acessar a proposta enviada
      navigate('/ficha-proposta', { replace: true });
      setShowPropostasAnteriores(true);
    } catch (error: any) {
      console.error('Erro ao enviar proposta de compra:', error);

      // Tratar erros conforme documentação da API
      if (error.errors && Array.isArray(error.errors)) {
        // Erros de validação - mostrar cada erro
        const errorMessages = error.errors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join('\n');
        showError(`${error.message}\n\n${errorMessages}`, { autoClose: 8000 });
      } else {
        // Erro genérico
        showError(
          error.message ||
            'Erro ao cadastrar proposta de compra. Tente novamente.',
          { autoClose: 6000 }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função auxiliar para encontrar o primeiro erro recursivamente
  const findFirstError = (
    errorObj: any,
    path: string = ''
  ): { field: string; message: string } | null => {
    if (!errorObj || typeof errorObj !== 'object') {
      return null;
    }

    // Se tem message, é um erro de campo
    if (errorObj.message) {
      return { field: path, message: errorObj.message };
    }

    // Percorrer todas as chaves do objeto
    for (const key in errorObj) {
      if (Object.prototype.hasOwnProperty.call(errorObj, key)) {
        const newPath = path ? `${path}.${key}` : key;
        const result = findFirstError(errorObj[key], newPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const onSubmit = async (data: FichaPropostaForm) => {
    // Validar todos os campos obrigatórios
    const isValid = await trigger();

    if (!isValid) {
      // Encontrar o primeiro campo com erro
      const firstError = findFirstError(errors);

      if (firstError) {
        showError(firstError.message);

        // Fazer scroll para o primeiro campo com erro
        setTimeout(() => {
          let fieldElement = document.querySelector(
            `[name="${firstError.field}"]`
          ) as HTMLElement;

          if (!fieldElement) {
            fieldElement = document.querySelector(
              `#${firstError.field}`
            ) as HTMLElement;
          }

          if (fieldElement) {
            fieldElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            const input = fieldElement.querySelector(
              'input, select, textarea'
            ) as HTMLElement | null;
            if (input) {
              input.focus();
            } else if (fieldElement instanceof HTMLElement) {
              fieldElement.focus();
            }
          }
        }, 100);
      } else {
        showError('Por favor, preencha todos os campos obrigatórios.');
      }

      return;
    }

    // Preparar payload
    const payload = preparePayload(data);

    // Mostrar modal de confirmação
    setPendingPayload(payload);
    setShowConfirmModal(true);
  };

  // Confirmar envio
  const handleConfirmSubmit = () => {
    if (pendingPayload) {
      sendToApi(pendingPayload);
    }
  };

  // Cancelar envio
  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
    setPendingPayload(null);
  };

  // Salvar rascunho no servidor (POST se sem ID, PATCH se com ID). Exige corretor/gestor logado.
  // Serve para: não perder o preenchimento; continuar depois em outro dispositivo; aparecer na lista como rascunho.
  const salvarRascunhoNoServidor = async () => {
    if (!userCpf || !userTipo) {
      showWarning('Faça login (CPF do corretor ou gestor) para salvar o rascunho no servidor.');
      return;
    }
    setSavingDraftServer(true);
    showInfo('Salvando rascunho no servidor...', { autoClose: 2000 });
    const data = getValues();
    let payload: CreatePurchaseProposalDto;
    try {
      payload = preparePayload(data);
    } catch (e) {
      setSavingDraftServer(false);
      const detail = e instanceof Error ? e.message : '';
      showError(
        detail
          ? `Não foi possível montar o rascunho: ${detail}. Preencha proposta, proponente (nome, CPF, email) e imóvel (endereço) para salvar.`
          : 'Preencha os campos obrigatórios da proposta, proponente e imóvel para salvar o rascunho.',
        { autoClose: 6000 }
      );
      return;
    }
    payload.status = 'rascunho';

    try {
      if (!propostaIdFromUrl || propostaIdFromUrl.trim() === '') {
        const response = await criarFichaProposta(payload as CreatePurchaseProposalDto);
        const newId = (response.data?.id ?? '').toString().trim();
        if (newId && newId !== 'undefined') {
          setMaxEtapaLiberada(1);
          setEtapaAtual(1);
          localStorage.removeItem('ficha_proposta_draft');
          localStorage.removeItem('ficha_proposta_etapa');
          showSuccess('Rascunho salvo no servidor. Você pode continuar o preenchimento ou ver o rascunho na lista.', { autoClose: 5000 });
          navigate(`/ficha-proposta/${newId}`, { replace: true });
          if (userCpf && userTipo) carregarPropostas();
        } else {
          showSuccess('Rascunho salvo.', { autoClose: 4000 });
          carregarPropostas();
        }
      } else {
        const cpfParam = userTipo === 'gestor' ? { gestorCpf: userCpf } : { corretorCpf: userCpf };
        await atualizarProposta(propostaIdFromUrl.trim(), payload as UpdatePurchaseProposalDto, cpfParam);
        showSuccess('Rascunho atualizado no servidor. Seus dados foram guardados.', { autoClose: 5000 });
        carregarPropostas();
      }
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message ?? err?.message ?? err?.errors?.[0]?.message;
      const msg = apiMsg || 'Erro ao salvar rascunho no servidor. Tente novamente.';
      showError(msg, { autoClose: 6000 });
    } finally {
      setSavingDraftServer(false);
    }
  };

  // Preencher dados de exemplo
  const handleFillExampleData = () => {
    if (
      window.confirm(
        'Deseja preencher o formulário com dados de exemplo? Os dados atuais serão substituídos.'
      )
    ) {
      const exampleData: Partial<FichaPropostaForm> = {
        proposta: {
          dataProposta: new Date().toISOString().split('T')[0],
          prazoValidade: 30,
          precoProposto: '500000',
          condicoesPagamento:
            'Entrada de 30% (R$ 150.000,00) e financiamento do restante em 120 meses com taxa de juros de 8,5% ao ano.',
          valorSinal: '50000',
          prazoPagamentoSinal: 15,
          porcentagemComissao: 5.0,
          prazoEntrega: 60,
          multaMensal: '2000',
          unidadeVenda: 'União Esmeralda',
          unidadeCaptacao: 'União Esmeralda',
        },
        proponente: {
          nome: 'João da Silva',
          cpf: '11144477735',
          rg: '123456789',
          nacionalidade: 'Brasileiro',
          estadoCivil: 'Casado',
          regimeCasamento: 'Comunhão parcial de bens',
          dataNascimento: '1990-05-20',
          profissao: 'Engenheiro',
          email: 'joao.silva@email.com',
          telefone: '11987654321',
          residenciaAtual: 'Avenida Paulista, 1000, Apto 101',
          bairro: 'Bela Vista',
          cep: '01310100',
          cidade: 'São Paulo',
          estado: 'SP',
        },
        possuiProponenteConjuge: true,
        proponenteConjuge: {
          nome: 'Maria da Silva',
          cpf: '12345678909',
          rg: '987654321',
          profissao: 'Arquiteta',
          email: 'maria.silva@email.com',
          telefone: '11912345678',
        },
        imovel: {
          matricula: '12345',
          cartorio: '1º Ofício de Registro de Imóveis',
          cadastroPrefeitura: 'CAD-123456',
          endereco: 'Rua das Flores, 456',
          bairro: 'Jardim Paulista',
          cidade: 'São Paulo',
          estado: 'SP',
        },
        proprietario: {
          nome: 'Pedro Santos',
          cpf: '98765432100',
          rg: '111222333',
          nacionalidade: 'Brasileiro',
          estadoCivil: 'Casado',
          regimeCasamento: 'Comunhão parcial de bens',
          dataNascimento: '1980-03-15',
          profissao: 'Advogado',
          email: 'pedro.santos@email.com',
          telefone: '11999998888',
          residenciaAtual: 'Rua do Proprietário, 789',
          bairro: 'Vila Nova',
        },
        possuiProprietarioConjuge: true,
        proprietarioConjuge: {
          nome: 'Ana Santos',
          cpf: '12345678909',
          rg: '444555666',
          profissao: 'Médica',
          email: 'ana.santos@email.com',
          telefone: '11988887777',
        },
        corretores: [
          {
            id: 'COR-001',
            nome: 'João Corretor',
            email: 'joao.corretor@email.com',
          },
        ],
        captadores: [
          {
            id: 'CAP-001',
            nome: 'Maria Captadora',
          },
        ],
      };

      // Preencher todos os campos usando setValue
      // Proposta
      if (exampleData.proposta) {
        setValue('proposta.dataProposta', exampleData.proposta.dataProposta);
        setValue('proposta.prazoValidade', exampleData.proposta.prazoValidade);
        setValue(
          'proposta.precoProposto',
          formatCurrencyValue(parseFloat(exampleData.proposta.precoProposto))
        );
        setValue(
          'proposta.condicoesPagamento',
          exampleData.proposta.condicoesPagamento
        );
        if (exampleData.proposta.valorSinal) {
          setValue(
            'proposta.valorSinal',
            formatCurrencyValue(parseFloat(exampleData.proposta.valorSinal))
          );
        }
        if (exampleData.proposta.prazoPagamentoSinal) {
          setValue(
            'proposta.prazoPagamentoSinal',
            exampleData.proposta.prazoPagamentoSinal
          );
        }
        setValue(
          'proposta.porcentagemComissao',
          exampleData.proposta.porcentagemComissao
        );
        setValue('proposta.prazoEntrega', exampleData.proposta.prazoEntrega);
        setValue(
          'proposta.multaMensal',
          formatCurrencyValue(parseFloat(exampleData.proposta.multaMensal))
        );
        setValue('proposta.unidadeVenda', exampleData.proposta.unidadeVenda);
        setValue(
          'proposta.unidadeCaptacao',
          exampleData.proposta.unidadeCaptacao
        );
      }

      // Proponente
      if (exampleData.proponente) {
        setValue('proponente.nome', exampleData.proponente.nome);
        setValue('proponente.cpf', maskCPF(exampleData.proponente.cpf));
        setValue('proponente.rg', maskRG(exampleData.proponente.rg));
        setValue(
          'proponente.nacionalidade',
          exampleData.proponente.nacionalidade
        );
        setValue('proponente.estadoCivil', exampleData.proponente.estadoCivil);
        setValue(
          'proponente.regimeCasamento',
          exampleData.proponente.regimeCasamento || ''
        );
        setValue(
          'proponente.dataNascimento',
          exampleData.proponente.dataNascimento
        );
        setValue(
          'proponente.profissao',
          exampleData.proponente.profissao || ''
        );
        setValue('proponente.email', exampleData.proponente.email);
        setValue(
          'proponente.telefone',
          maskPhoneAuto(exampleData.proponente.telefone)
        );
        setValue(
          'proponente.residenciaAtual',
          exampleData.proponente.residenciaAtual
        );
        setValue('proponente.bairro', exampleData.proponente.bairro);
        setValue('proponente.cep', maskCEP(exampleData.proponente.cep));
        setValue('proponente.cidade', exampleData.proponente.cidade);
        setValue('proponente.estado', exampleData.proponente.estado);
      }

      // Proponente Cônjuge
      setValue(
        'possuiProponenteConjuge',
        exampleData.possuiProponenteConjuge || false
      );
      if (exampleData.proponenteConjuge) {
        setValue('proponenteConjuge.nome', exampleData.proponenteConjuge.nome);
        setValue(
          'proponenteConjuge.cpf',
          maskCPF(exampleData.proponenteConjuge.cpf)
        );
        setValue(
          'proponenteConjuge.rg',
          maskRG(exampleData.proponenteConjuge.rg)
        );
        setValue(
          'proponenteConjuge.profissao',
          exampleData.proponenteConjuge.profissao || ''
        );
        setValue(
          'proponenteConjuge.email',
          exampleData.proponenteConjuge.email
        );
        setValue(
          'proponenteConjuge.telefone',
          maskPhoneAuto(exampleData.proponenteConjuge.telefone)
        );
      }

      // Imóvel
      if (exampleData.imovel) {
        setValue('imovel.matricula', exampleData.imovel.matricula);
        setValue('imovel.cartorio', exampleData.imovel.cartorio);
        setValue(
          'imovel.cadastroPrefeitura',
          exampleData.imovel.cadastroPrefeitura || ''
        );
        setValue('imovel.endereco', exampleData.imovel.endereco);
        setValue('imovel.bairro', exampleData.imovel.bairro);
        setValue('imovel.cidade', exampleData.imovel.cidade);
        setValue('imovel.estado', exampleData.imovel.estado);
      }

      // Proprietário
      if (exampleData.proprietario) {
        setValue('proprietario.nome', exampleData.proprietario.nome);
        setValue('proprietario.cpf', maskCPF(exampleData.proprietario.cpf));
        setValue('proprietario.rg', maskRG(exampleData.proprietario.rg));
        setValue(
          'proprietario.nacionalidade',
          exampleData.proprietario.nacionalidade
        );
        setValue(
          'proprietario.estadoCivil',
          exampleData.proprietario.estadoCivil
        );
        setValue(
          'proprietario.regimeCasamento',
          exampleData.proprietario.regimeCasamento || ''
        );
        setValue(
          'proprietario.dataNascimento',
          exampleData.proprietario.dataNascimento
        );
        setValue(
          'proprietario.profissao',
          exampleData.proprietario.profissao || ''
        );
        setValue('proprietario.email', exampleData.proprietario.email);
        setValue(
          'proprietario.telefone',
          maskPhoneAuto(exampleData.proprietario.telefone)
        );
        setValue(
          'proprietario.residenciaAtual',
          exampleData.proprietario.residenciaAtual
        );
        setValue('proprietario.bairro', exampleData.proprietario.bairro);
      }

      // Proprietário Cônjuge
      setValue(
        'possuiProprietarioConjuge',
        exampleData.possuiProprietarioConjuge || false
      );
      if (exampleData.proprietarioConjuge) {
        setValue(
          'proprietarioConjuge.nome',
          exampleData.proprietarioConjuge.nome
        );
        setValue(
          'proprietarioConjuge.cpf',
          maskCPF(exampleData.proprietarioConjuge.cpf)
        );
        setValue(
          'proprietarioConjuge.rg',
          maskRG(exampleData.proprietarioConjuge.rg)
        );
        setValue(
          'proprietarioConjuge.profissao',
          exampleData.proprietarioConjuge.profissao || ''
        );
        setValue(
          'proprietarioConjuge.email',
          exampleData.proprietarioConjuge.email
        );
        setValue(
          'proprietarioConjuge.telefone',
          maskPhoneAuto(exampleData.proprietarioConjuge.telefone)
        );
      }

      // Corretores
      if (exampleData.corretores && exampleData.corretores.length > 0) {
        setValue('corretores', exampleData.corretores);
      }

      // Captadores
      if (exampleData.captadores && exampleData.captadores.length > 0) {
        setValue('captadores', exampleData.captadores);
      }

      // Expandir todas as seções
      setExpandedSections({
        proposta: true,
        proponente: true,
        proponenteConjuge: true,
        imovel: true,
        proprietario: true,
        proprietarioConjuge: true,
        corretores: true,
        captadores: true,
      });

      // Manter etapas "incompletas": só etapa 1 desbloqueada; não alterar maxEtapaLiberada
      setEtapaAtual(1);

      showSuccess('Formulário preenchido com dados de exemplo (apenas etapa 1 liberada).');
    }
  };

  // Limpar rascunho
  const handleClearDraft = () => {
    if (
      window.confirm(
        'Deseja realmente limpar o formulário? Todos os dados não salvos serão perdidos.'
      )
    ) {
      localStorage.removeItem('ficha_proposta_draft');
      localStorage.removeItem('ficha_proposta_etapa');
      resetForm();
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('shared');
      setSearchParams(newSearchParams);
      showInfo('Formulário limpo com sucesso.');
    }
  };

  // Gerar link compartilhável (por ID da proposta salva ou dados em base64)
  const handleShareProposta = () => {
    if (propostaIdFromUrl) {
      const baseUrl =
        window.location.origin +
        (window.location.pathname.split('/ficha-proposta')[0] || '');
      setShareLink(`${baseUrl}/ficha-proposta/${propostaIdFromUrl}`);
      setShowShareModal(true);
      return;
    }

    const formData = watch();
    if (!formData.proponente?.nome && !formData.proprietario?.nome) {
      showError(
        'Preencha pelo menos alguns dados antes de compartilhar ou salve a proposta para gerar o link por ID (acessível a todos vinculados).'
      );
      return;
    }

    try {
      const jsonData = JSON.stringify(formData);
      const encoded = btoa(jsonData);
      const urlSafeEncoded = encodeURIComponent(encoded);
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?shared=${urlSafeEncoded}`;
      setShareLink(shareUrl);
      setShowShareModal(true);
    } catch (error) {
      console.error('Erro ao gerar link compartilhável:', error);
      showError('Erro ao gerar link compartilhável.');
    }
  };

  // Copiar link para área de transferência
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      showSuccess('Link copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      showError('Erro ao copiar link.');
    }
  };

  /** Usado pela seção "Upload de Imagem para OCR" quando estiver visível (atualmente oculta). */
  const processImageFiles = async (files: File[]) => {
    // Validar quantidade de imagens
    if (files.length === 0) {
      showError('Nenhuma imagem selecionada.');
      return;
    }

    if (files.length > 2) {
      showError('Máximo de 2 imagens permitidas.');
      return;
    }

    // Validar tipos de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        showError(
          `Formato de imagem inválido: ${file.name}. Use JPEG, PNG ou WEBP.`
        );
        return;
      }

      // Validar tamanho (máximo 10MB por imagem)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showError(
          `Imagem muito grande: ${file.name}. Tamanho máximo: 10MB por imagem.`
        );
        return;
      }
    }

    // Criar preview da primeira imagem
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }

    setIsExtractingImage(true);

    try {
      const result = await extrairDadosDaImagem(files);

      if (result.success && result.data) {
        // Preencher formulário com dados extraídos
        if (result.data.proposta) {
          Object.keys(result.data.proposta).forEach(key => {
            const value = (result.data.proposta as any)[key];
            if (value !== undefined) {
              if (
                key === 'precoProposto' ||
                key === 'valorSinal' ||
                key === 'multaMensal'
              ) {
                setValue(`proposta.${key}` as any, formatCurrencyValue(value));
              } else {
                setValue(`proposta.${key}` as any, value);
              }
            }
          });
        }

        if (result.data.proponente) {
          Object.keys(result.data.proponente).forEach(key => {
            const value = (result.data.proponente as any)[key];
            if (value !== undefined) {
              if (key === 'cpf') {
                setValue(`proponente.${key}` as any, maskCPF(String(value)));
              } else {
                setValue(`proponente.${key}` as any, value);
              }
            }
          });
        }

        if (result.data.proponenteConjuge) {
          setValue('possuiProponenteConjuge', true);
          Object.keys(result.data.proponenteConjuge).forEach(key => {
            const value = (result.data.proponenteConjuge as any)[key];
            if (value !== undefined) {
              if (key === 'cpf') {
                setValue(
                  `proponenteConjuge.${key}` as any,
                  maskCPF(String(value))
                );
              } else {
                setValue(`proponenteConjuge.${key}` as any, value);
              }
            }
          });
        }

        if (result.data.imovel) {
          Object.keys(result.data.imovel).forEach(key => {
            const value = (result.data.imovel as any)[key];
            if (value !== undefined) {
              setValue(`imovel.${key}` as any, value);
            }
          });
        }

        if (result.data.proprietario) {
          Object.keys(result.data.proprietario).forEach(key => {
            const value = (result.data.proprietario as any)[key];
            if (value !== undefined) {
              if (key === 'cpf') {
                setValue(`proprietario.${key}` as any, maskCPF(String(value)));
              } else {
                setValue(`proprietario.${key}` as any, value);
              }
            }
          });
        }

        if (result.data.proprietarioConjuge) {
          setValue('possuiProprietarioConjuge', true);
          Object.keys(result.data.proprietarioConjuge).forEach(key => {
            const value = (result.data.proprietarioConjuge as any)[key];
            if (value !== undefined) {
              if (key === 'cpf') {
                setValue(
                  `proprietarioConjuge.${key}` as any,
                  maskCPF(String(value))
                );
              } else {
                setValue(`proprietarioConjuge.${key}` as any, value);
              }
            }
          });
        }

        if (result.data.corretores && result.data.corretores.length > 0) {
          setValue('corretores', result.data.corretores);
        }

        if (result.data.captadores && result.data.captadores.length > 0) {
          setValue('captadores', result.data.captadores);
        }

        // Atualizar campos faltantes
        setMissingFields(result.missingFields || []);

        // Expandir todas as seções
        setExpandedSections({
          proposta: true,
          proponente: true,
          proponenteConjuge: !!result.data.proponenteConjuge,
          imovel: true,
          proprietario: true,
          proprietarioConjuge: !!result.data.proprietarioConjuge,
          corretores:
            !!result.data.corretores && result.data.corretores.length > 0,
          captadores:
            !!result.data.captadores && result.data.captadores.length > 0,
        });

        // Mostrar mensagem de sucesso
        if (result.missingFields && result.missingFields.length > 0) {
          showWarning(
            `Dados extraídos com sucesso!\n\n${result.missingFields.length} campo(s) não foram identificados. Por favor, verifique e complete manualmente.`,
            { autoClose: 8000 }
          );
        } else {
          showSuccess(
            'Dados extraídos com sucesso! Revise os campos antes de enviar.',
            { autoClose: 5000 }
          );
        }
      } else {
        throw new Error(result.message || 'Erro ao processar imagem');
      }
    } catch (error: any) {
      console.error('Erro ao extrair dados da imagem:', error);
      showError(
        error.message ||
          'Erro ao processar imagem. Tente novamente ou preencha manualmente.',
        { autoClose: 6000 }
      );
      setPreviewImage(null);
    } finally {
      setIsExtractingImage(false);
    }
  };
  void processImageFiles; // reservado para seção OCR quando exibida

  // Calcular estatísticas das propostas (ANTES do return condicional)
  const estatisticas = useMemo(() => {
    if (propostasEnviadas.length === 0) {
      return {
        total: 0,
        valorTotal: 0,
        valorMedio: 0,
        valorMaximo: 0,
        valorMinimo: 0,
        ultimos30Dias: 0,
      };
    }

    const valores = propostasEnviadas.map(p => p.precoProposto);
    const valorTotal = valores.reduce((sum, val) => sum + val, 0);
    const valorMedio = valorTotal / valores.length;
    const valorMaximo = Math.max(...valores);
    const valorMinimo = Math.min(...valores);

    const hoje = new Date();
    const ultimos30Dias = propostasEnviadas.filter(p => {
      const data = new Date(p.createdAt);
      const diffTime = hoje.getTime() - data.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }).length;

    return {
      total: propostasEnviadas.length,
      valorTotal,
      valorMedio,
      valorMaximo,
      valorMinimo,
      ultimos30Dias,
    };
  }, [propostasEnviadas]);

  // Dados para gráfico de linha (evolução temporal)
  const evolucaoTemporalData = useMemo(() => {
    if (propostasEnviadas.length === 0) return null;

    // Agrupar por mês
    const porMes: Record<string, { count: number; valor: number }> = {};

    propostasEnviadas.forEach(proposta => {
      const data = new Date(proposta.createdAt);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

      if (!porMes[mesAno]) {
        porMes[mesAno] = { count: 0, valor: 0 };
      }
      porMes[mesAno].count++;
      porMes[mesAno].valor += proposta.precoProposto;
    });

    const meses = Object.keys(porMes).sort((a, b) => {
      const [mesA, anoA] = a.split('/').map(Number);
      const [mesB, anoB] = b.split('/').map(Number);
      if (anoA !== anoB) return anoA - anoB;
      return mesA - mesB;
    });

    return {
      labels: meses,
      datasets: [
        {
          label: 'Quantidade de Propostas',
          data: meses.map(mes => porMes[mes].count),
          borderColor: themeColors.primary,
          backgroundColor: `${themeColors.primary}20`,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Valor Total (R$ milhões)',
          data: meses.map(mes => porMes[mes].valor / 1000000),
          borderColor: themeColors.primary,
          backgroundColor: `${themeColors.primary}20`,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1',
        },
      ],
    };
  }, [propostasEnviadas, themeColors]);

  // Dados para gráfico de barras (distribuição mensal)
  const distribuicaoMensalData = useMemo(() => {
    if (propostasEnviadas.length === 0) return null;

    const ultimos6Meses: Record<string, number> = {};
    const hoje = new Date();

    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      ultimos6Meses[mesAno] = 0;
    }

    propostasEnviadas.forEach(proposta => {
      const data = new Date(proposta.createdAt);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      if (ultimos6Meses[mesAno] !== undefined) {
        ultimos6Meses[mesAno]++;
      }
    });

    const meses = Object.keys(ultimos6Meses);
    const valores = meses.map(mes => ultimos6Meses[mes]);

    return {
      labels: meses,
      datasets: [
        {
          label: 'Propostas',
          data: valores,
          backgroundColor: meses.map((_, i) => {
            const colors = [
              `${themeColors.primary}CC`,
              `${themeColors.primary}CC`,
              `${themeColors.primary}CC`,
              `${themeColors.primaryDark}CC`,
              `${themeColors.primaryDark}CC`,
              `${themeColors.primaryDark}CC`,
            ];
            return colors[i % colors.length];
          }),
          borderColor: meses.map((_, i) => {
            const colors = [
              themeColors.primary,
              themeColors.primary,
              themeColors.primary,
              themeColors.primaryDark,
              themeColors.primaryDark,
              themeColors.primaryDark,
            ];
            return colors[i % colors.length];
          }),
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [propostasEnviadas, themeColors]);

  // Dados para gráfico de pizza (faixas de valor)
  const faixasValorData = useMemo(() => {
    if (propostasEnviadas.length === 0) return null;

    const faixas = {
      'Até R$ 200k': 0,
      'R$ 200k - R$ 500k': 0,
      'R$ 500k - R$ 1M': 0,
      'Acima de R$ 1M': 0,
    };

    propostasEnviadas.forEach(proposta => {
      const valor = proposta.precoProposto;
      if (valor <= 200000) {
        faixas['Até R$ 200k']++;
      } else if (valor <= 500000) {
        faixas['R$ 200k - R$ 500k']++;
      } else if (valor <= 1000000) {
        faixas['R$ 500k - R$ 1M']++;
      } else {
        faixas['Acima de R$ 1M']++;
      }
    });

    const labels = Object.keys(faixas);
    const valores = Object.values(faixas);

    return {
      labels,
      datasets: [
        {
          data: valores,
          backgroundColor: [
            `${themeColors.primary}CC`,
            `${themeColors.primary}CC`,
            `${themeColors.primary}CC`,
            `${themeColors.primaryDark}CC`,
          ],
          borderColor: [
            themeColors.primary,
            themeColors.primary,
            themeColors.primary,
            themeColors.primaryDark,
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [propostasEnviadas, themeColors]);

  // Propostas finalizadas: conforme purchase_proposals (status = disponivel)
  const propostasFinalizadas = useMemo(
    () =>
      propostasEnviadas.filter(
        p => (p as PropostaListItem).status === 'disponivel'
      ) as PropostaListItem[],
    [propostasEnviadas]
  );
  // Propostas por etapa: agrupamento conforme proposal_stage_history (etapa 1, 2 ou 3 vinda do backend)
  const propostasPorEtapa = useMemo(
    () => ({
      etapa1: propostasEnviadas.filter(
        p => (p as PropostaListItem).etapa === 1
      ) as PropostaListItem[],
      etapa2: propostasEnviadas.filter(
        p => (p as PropostaListItem).etapa === 2
      ) as PropostaListItem[],
      etapa3: propostasEnviadas.filter(
        p => (p as PropostaListItem).etapa === 3
      ) as PropostaListItem[],
    }),
    [propostasEnviadas]
  );

  // Opções dos gráficos
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 12, weight: 'bold' as const },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        ticks: {
          font: { size: 11 },
          callback: function (value: any) {
            return 'R$ ' + value.toFixed(1) + 'M';
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 11 },
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12, weight: 'bold' as const },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Hooks watch devem ser chamados antes de qualquer return condicional
  const possuiProponenteConjuge = watch('possuiProponenteConjuge');
  const possuiProprietarioConjuge = watch('possuiProprietarioConjuge');
  const proponenteEstadoCivil = watch('proponente.estadoCivil');
  const proprietarioEstadoCivil = watch('proprietario.estadoCivil');

  if (isLoading) {
    return (
      <FichaVendaContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          Carregando...
        </div>
      </FichaVendaContainer>
    );
  }

  if (!userCpf || !userTipo) {
    return (
      <FichaVendaContainer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'var(--color-card-background)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            {(import.meta.env.VITE_LOGO_URL_UNIAO as string) && (
              <img
                src={import.meta.env.VITE_LOGO_URL_UNIAO as string}
                alt='União'
                style={{
                  maxWidth: '180px',
                  height: 'auto',
                  marginBottom: '20px',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
            )}
            <PageTitle style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
              📋 Ficha de Proposta
            </PageTitle>
            <PageSubtitle
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              Informe seu CPF para acessar
            </PageSubtitle>
          </div>
          <FormGroup>
            <FormLabel>CPF</FormLabel>
            <FormInput
              type='text'
              value={loginCpf}
              onChange={e => {
                setLoginCpf(maskCPFouCNPJ(e.target.value));
                setLoginError('');
              }}
              placeholder='CPF ou CNPJ'
              maxLength={18}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              $hasError={!!loginError}
            />
            {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
          </FormGroup>
          <Button
            type='button'
            $variant='primary'
            onClick={handleLogin}
            disabled={loginLoading}
            style={{ width: '100%', marginTop: '16px', padding: '12px' }}
          >
            {loginLoading ? 'Verificando...' : 'Entrar'}
          </Button>
        </div>
      </FichaVendaContainer>
    );
  }

  return (
    <>
      <SelectCorretorModal
        isOpen={showSelectCorretorModal}
        onClose={() => setShowSelectCorretorModal(false)}
        onSelect={handleSelectCorretor}
        selectedCorretorId={corretorSelecionado?.id}
      />

      {propostaAssinaturasModal && userCpf && userTipo && (
        <PropostaAssinaturasModal
          isOpen={!!propostaAssinaturasModal}
          onClose={() => setPropostaAssinaturasModal(null)}
          proposalId={propostaAssinaturasModal.id}
          proposalNumber={propostaAssinaturasModal.numero}
          userCpf={userCpf}
          userTipo={userTipo}
          onSent={() => carregarPropostas()}
        />
      )}

      {contraPropostaAssinaturasModal && userCpf && userTipo && (
        <ContraPropostaAssinaturasModal
          isOpen={!!contraPropostaAssinaturasModal}
          onClose={() => setContraPropostaAssinaturasModal(null)}
          contraPropostaId={contraPropostaAssinaturasModal.id}
          proposalNumber={
            (watch('proposta.numero') as string | undefined) ?? undefined
          }
          accessParams={
            userTipo === 'gestor'
              ? { gestorCpf: userCpf }
              : { corretorCpf: userCpf }
          }
          defaultRecipientEmail={
            contraPropostaAssinaturasModal.defaultRecipientEmail
          }
          defaultRecipientName={
            contraPropostaAssinaturasModal.defaultRecipientName
          }
          onSent={() => carregarContraPropostas(pageContraPropostas)}
        />
      )}

      {reenviarEmailModal && (
        <ModalOverlay
          $isOpen={!!reenviarEmailModal}
          onClick={() => {
            if (!isReenviandoEmail) {
              setReenviarEmailModal(null);
              setReenviarEmailText('');
              setReenviarEmailEtapaSelecionada(1);
            }
          }}
        >
          <ModalContainer
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            <ModalHeader>
              <ModalTitle>
                <MdEmail />
                Reenviar email – Proposta {reenviarEmailModal.numero}
              </ModalTitle>
              <ModalCloseButton
                onClick={() => {
                  if (!isReenviandoEmail) {
                    setReenviarEmailModal(null);
                    setReenviarEmailText('');
                    setReenviarEmailEtapaSelecionada(1);
                  }
                }}
              >
                <MdClose />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p
                style={{
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                }}
              >
                O PDF da proposta será enviado para os emails informados. Escolha
                a etapa do PDF e digite um ou mais emails (separados por vírgula ou um por linha).
              </p>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text)' }}>
                  PDF da etapa
                </label>
                <select
                  value={Math.min(reenviarEmailEtapaSelecionada, reenviarEmailModal?.etapaProposta ?? 1)}
                  onChange={e => setReenviarEmailEtapaSelecionada(Number(e.target.value) as 1 | 2 | 3)}
                  disabled={isReenviandoEmail}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    background: 'var(--color-background)',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value={1}>Etapa 1 – Comprador / Imóvel / Proposta</option>
                  <option value={2} disabled={(reenviarEmailModal?.etapaProposta ?? 1) < 2}>
                    Etapa 2 – Proprietário
                  </option>
                  <option value={3} disabled={(reenviarEmailModal?.etapaProposta ?? 1) < 3}>
                    Etapa 3 – Corretor e Captadores
                  </option>
                </select>
              </div>
              <textarea
                value={reenviarEmailText}
                onChange={e => setReenviarEmailText(e.target.value)}
                placeholder="ex: email1@exemplo.com, email2@exemplo.com"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.95rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
                disabled={isReenviandoEmail}
              />
            </ModalBody>
            <ModalFooter>
              <ModalButton
                $variant='secondary'
                onClick={() => {
                  if (!isReenviandoEmail) {
                    setReenviarEmailModal(null);
                    setReenviarEmailText('');
                    setReenviarEmailEtapaSelecionada(1);
                  }
                }}
                disabled={isReenviandoEmail}
              >
                <MdClose />
                Cancelar
              </ModalButton>
              <ModalButton
                $variant='primary'
                onClick={handleSubmitReenviarEmail}
                disabled={isReenviandoEmail || !reenviarEmailText.trim()}
              >
                {isReenviandoEmail ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MdEmail />
                    Reenviar PDF
                  </>
                )}
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {showContraPropostaModal && (
        <ModernModalOverlay
          $isOpen={true}
          onClick={() =>
            !submittingContraProposta && setShowContraPropostaModal(false)
          }
        >
          <ModernModalContainer
            $isOpen={true}
            onClick={e => e.stopPropagation()}
          >
            <ModernModalHeader>
              <ModernModalHeaderContent>
                <div>
                  <ModernModalTitle>Criar contra proposta</ModernModalTitle>
                  <ModernModalSubtitle>
                    Preencha os dados. Após criar, você poderá enviar para
                    assinatura (ex.: Authentique). O e-mail do destinatário é
                    opcional.
                  </ModernModalSubtitle>
                </div>
                <ModernModalCloseButton
                  type='button'
                  onClick={() =>
                    !submittingContraProposta &&
                    setShowContraPropostaModal(false)
                  }
                  disabled={submittingContraProposta}
                  aria-label='Fechar'
                >
                  <MdClose size={22} />
                </ModernModalCloseButton>
              </ModernModalHeaderContent>
            </ModernModalHeader>
            <ModernModalContent>
              <ModernFormGrid>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Vendedor (proprietário){' '}
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={contraPropostaForm.sellerName}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        sellerName: e.target.value,
                      }))
                    }
                    placeholder='Nome do vendedor'
                  />
                </ModernFormGroup>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Corretor{' '}
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={contraPropostaForm.corretorName}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        corretorName: e.target.value,
                      }))
                    }
                    placeholder='Nome do corretor'
                  />
                </ModernFormGroup>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Valor proposto{' '}
                    <ModernRequiredIndicator>*</ModernRequiredIndicator>
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={contraPropostaForm.proposedPrice}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        proposedPrice: maskCurrencyReais(e.target.value),
                      }))
                    }
                    placeholder='R$ 0,00'
                  />
                </ModernFormGroup>
                <ModernFormGroup>
                  <ModernFormLabel>E-mail do destinatário</ModernFormLabel>
                  <ModernFormInput
                    type='email'
                    value={contraPropostaForm.recipientEmail}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        recipientEmail: e.target.value,
                      }))
                    }
                    placeholder='email@exemplo.com (para envio e assinatura)'
                  />
                </ModernFormGroup>
                <ModernFormGroup>
                  <ModernFormLabel>Sinal (opcional)</ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={contraPropostaForm.downPayment}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        downPayment: maskCurrencyReais(e.target.value),
                      }))
                    }
                    placeholder='R$ 0,00'
                  />
                </ModernFormGroup>
                <ModernFormGroup>
                  <ModernFormLabel>
                    Condições de pagamento (opcional)
                  </ModernFormLabel>
                  <ModernFormInput
                    type='text'
                    value={contraPropostaForm.paymentConditions}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        paymentConditions: e.target.value,
                      }))
                    }
                    placeholder='Ex.: à vista, parcelado...'
                  />
                </ModernFormGroup>
                <ModernFormGroup>
                  <ModernFormLabel>Criado por</ModernFormLabel>
                  <ModernFormSelect
                    value={contraPropostaForm.createdByType}
                    onChange={e =>
                      setContraPropostaForm(f => ({
                        ...f,
                        createdByType: e.target.value as
                          | 'corretor'
                          | 'gestor'
                          | 'cliente',
                      }))
                    }
                  >
                    <option value='corretor'>Corretor</option>
                    <option value='gestor'>Gestor</option>
                    <option value='cliente'>Cliente</option>
                  </ModernFormSelect>
                </ModernFormGroup>
              </ModernFormGrid>
            </ModernModalContent>
            <ModernModalFooter>
              <ModernButton
                $variant='secondary'
                type='button'
                onClick={() => setShowContraPropostaModal(false)}
                disabled={submittingContraProposta}
              >
                Cancelar
              </ModernButton>
              <ModernButton
                $variant='primary'
                type='button'
                onClick={enviarContraProposta}
                disabled={submittingContraProposta}
              >
                {submittingContraProposta ? 'Criando...' : 'Criar'}
              </ModernButton>
            </ModernModalFooter>
          </ModernModalContainer>
        </ModernModalOverlay>
      )}

      <FichaVendaContainer>
        <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

        {propostaAccessDenied && (
          <InfoBox $type='error' style={{ marginBottom: '24px' }}>
            <MdError size={20} />
            <div>
              <strong>Acesso negado.</strong> Somente corretores, captadores ou
              gestores vinculados a esta proposta podem acessá-la. Faça login
              com um CPF vinculado à proposta ou use outro link.
              <Button
                type='button'
                $variant='primary'
                onClick={() => navigate('/ficha-proposta', { replace: true })}
                style={{ marginTop: '12px' }}
              >
                Ir para Ficha de Proposta
              </Button>
            </div>
          </InfoBox>
        )}

        {propostaIdFromUrl && !userCpf && (
          <InfoBox $type='info' style={{ marginBottom: '24px' }}>
            <InfoBoxText>
              Faça login com seu CPF (corretor, captador ou gestor vinculado à
              proposta) para acessar e continuar o preenchimento.
            </InfoBoxText>
          </InfoBox>
        )}

        <PageHeader
          style={{
            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
            borderRadius: '0 0 24px 24px',
            padding: '48px 32px',
            marginBottom: '40px',
            boxShadow: `0 8px 32px ${themeColors.primary}33`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
              filter: 'blur(60px)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1 }}>
                <PageTitle
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '12px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  📋 Ficha de Proposta de Compra
                </PageTitle>
                <PageSubtitle
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '1.125rem',
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Preencha todos os dados da proposta de compra. Os dados são
                  salvos automaticamente.
                </PageSubtitle>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  type='button'
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '10px 20px',
                  }}
                >
                  Sair
                </Button>
                <Button
                  type='button'
                  onClick={handleFillExampleData}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '10px 20px',
                    fontSize: '14px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ✨ Preencher Dados de Exemplo
                </Button>
                <Button
                  type='button'
                  onClick={handleClearDraft}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '10px 20px',
                    fontSize: '14px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🗑️ Limpar Formulário
                </Button>
              </div>
            </div>
          </div>
        </PageHeader>

        <PageContentWrap>
          {/* Contra propostas (quando visualizando uma proposta por ID) */}
          {propostaIdFromUrl && (
            <ContraPropostaSection>
              <ContraPropostaHeader>
                <ContraPropostaTitle>Contra propostas</ContraPropostaTitle>
                <Button
                  type='button'
                  $variant='primary'
                  onClick={abrirModalContraProposta}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '44px',
                  }}
                >
                  <MdAdd size={20} />
                  Criar contra proposta
                </Button>
              </ContraPropostaHeader>
              {loadingContraPropostas ? (
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9375rem',
                  }}
                >
                  Carregando...
                </p>
              ) : contraPropostas.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.9375rem',
                  }}
                >
                  Nenhuma contra proposta ainda. Corretor, gestor ou cliente
                  podem gerar uma contra proposta com vendedor, corretor e
                  valores.
                </p>
              ) : (
                <>
                  <ContraPropostaList>
                    {contraPropostas.map(cp => {
                      const status = cp.status || 'pendente';
                      const isUpdating =
                        updatingContraPropostaStatusId === cp.id;
                      const params = userCpf
                        ? userTipo === 'gestor'
                          ? { gestorCpf: userCpf }
                          : { corretorCpf: userCpf }
                        : undefined;
                      return (
                        <ContraPropostaItemCard key={cp.id}>
                          <ContraPropostaItemMain>
                            <span>
                              <strong>Vendedor:</strong> {cp.sellerName} ·{' '}
                              <strong>Corretor:</strong> {cp.corretorName} ·{' '}
                              <strong>Valor:</strong>{' '}
                              {formatCurrencyValue(Number(cp.proposedPrice))}
                              {cp.downPayment != null &&
                                Number(cp.downPayment) > 0 &&
                                ` · Sinal: ${formatCurrencyValue(Number(cp.downPayment))}`}
                            </span>
                            <ContraPropostaItemMeta>
                              ({cp.createdByType},{' '}
                              {formatarDataHora(cp.createdAt)})
                            </ContraPropostaItemMeta>
                          </ContraPropostaItemMain>
                          <ContraPropostaStatusBadge $status={status}>
                            {status === 'pendente'
                              ? 'Pendente'
                              : status === 'aprovada'
                                ? 'Aprovada'
                                : 'Recusada'}
                          </ContraPropostaStatusBadge>
                          {params && (
                            <ContraPropostaItemActions>
                              <Button
                                type='button'
                                $variant='secondary'
                                style={{
                                  padding: '8px 14px',
                                  fontSize: '0.875rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  minHeight: '44px',
                                }}
                                onClick={() =>
                                  window.open(
                                    getUrlPdfContraProposta(
                                      cp.id,
                                      userTipo === 'gestor'
                                        ? { gestorCpf: userCpf }
                                        : { corretorCpf: userCpf }
                                    ),
                                    '_blank'
                                  )
                                }
                              >
                                <MdDescription size={18} /> Ver PDF
                              </Button>
                              <Button
                                type='button'
                                $variant='secondary'
                                style={{
                                  padding: '8px 14px',
                                  fontSize: '0.875rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  minHeight: '44px',
                                }}
                                onClick={() =>
                                  setContraPropostaAssinaturasModal({
                                    id: cp.id,
                                    defaultRecipientEmail: cp.recipientEmail,
                                    defaultRecipientName: cp.sellerName,
                                  })
                                }
                              >
                                <MdDraw size={18} /> Assinaturas
                              </Button>
                              <Button
                                type='button'
                                $variant='secondary'
                                style={{
                                  padding: '8px 14px',
                                  fontSize: '0.875rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  minHeight: '44px',
                                  color: 'var(--color-error)',
                                }}
                                onClick={() =>
                                  excluirContraPropostaClick(cp.id)
                                }
                                disabled={deletingContraPropostaId === cp.id}
                              >
                                <MdDelete size={18} />{' '}
                                {deletingContraPropostaId === cp.id
                                  ? 'Excluindo...'
                                  : 'Excluir'}
                              </Button>
                              {status === 'pendente' && (
                                <>
                                  <Button
                                    type='button'
                                    $variant='primary'
                                    disabled={isUpdating}
                                    style={{
                                      padding: '8px 14px',
                                      fontSize: '0.875rem',
                                      minHeight: '44px',
                                    }}
                                    onClick={() =>
                                      responderContraProposta(cp.id, 'aprovada')
                                    }
                                  >
                                    {isUpdating ? '...' : 'Aprovar'}
                                  </Button>
                                  <Button
                                    type='button'
                                    $variant='secondary'
                                    disabled={isUpdating}
                                    style={{
                                      padding: '8px 14px',
                                      fontSize: '0.875rem',
                                      minHeight: '44px',
                                    }}
                                    onClick={() =>
                                      responderContraProposta(cp.id, 'recusada')
                                    }
                                  >
                                    Recusar
                                  </Button>
                                </>
                              )}
                            </ContraPropostaItemActions>
                          )}
                        </ContraPropostaItemCard>
                      );
                    })}
                  </ContraPropostaList>
                  {totalPagesContraPropostas > 1 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginTop: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Button
                        type='button'
                        $variant='secondary'
                        disabled={
                          pageContraPropostas <= 1 || loadingContraPropostas
                        }
                        onClick={() =>
                          carregarContraPropostas(pageContraPropostas - 1)
                        }
                        style={{ minHeight: '44px', padding: '8px 16px' }}
                      >
                        Anterior
                      </Button>
                      <span
                        style={{
                          fontSize: '0.9375rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Página {pageContraPropostas} de{' '}
                        {totalPagesContraPropostas}{' '}
                        {totalContraPropostas > 0 &&
                          `(${totalContraPropostas} no total)`}
                      </span>
                      <Button
                        type='button'
                        $variant='secondary'
                        disabled={
                          pageContraPropostas >= totalPagesContraPropostas ||
                          loadingContraPropostas
                        }
                        onClick={() =>
                          carregarContraPropostas(pageContraPropostas + 1)
                        }
                        style={{ minHeight: '44px', padding: '8px 16px' }}
                      >
                        Próxima
                      </Button>
                    </div>
                  )}
                </>
              )}
            </ContraPropostaSection>
          )}

          {/* Propostas Anteriores */}
          {(propostasEnviadas.length > 0 || loadingPropostas) && (
            <div
              style={{
                background: 'var(--color-card-background)',
                borderRadius: isMobilePropostas ? '16px' : '24px',
                padding: isMobilePropostas ? '24px 20px' : '40px',
                marginBottom: isMobilePropostas ? '24px' : '40px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobilePropostas ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobilePropostas ? 'stretch' : 'center',
                  gap: isMobilePropostas ? '24px' : '24px',
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: isMobilePropostas ? '40px' : '48px',
                      height: isMobilePropostas ? '40px' : '48px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 4px 12px ${themeColors.primary}4D`,
                      flexShrink: 0,
                    }}
                  >
                    <MdSave size={isMobilePropostas ? 20 : 24} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: isMobilePropostas ? '1.25rem' : '1.5rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                      }}
                    >
                      Propostas Finalizadas ({propostasFinalizadas.length})
                    </h3>
                    {userData && (
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          marginTop: '4px',
                        }}
                      >
                        {userTipo === 'gestor' ? 'Gestor' : 'Corretor'}:{' '}
                        {userData.nome}
                        {userData.unidade && ` · ${userData.unidade}`}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobilePropostas ? 'column' : 'row',
                    gap: isMobilePropostas ? '14px' : '12px',
                    alignItems: isMobilePropostas ? 'stretch' : 'center',
                    flexWrap: isMobilePropostas ? 'nowrap' : 'wrap',
                    width: isMobilePropostas ? '100%' : undefined,
                    minWidth: 0,
                  }}
                >
                  {showPropostasAnteriores && (
                    <>
                      <select
                        value={filtroStatusProposta}
                        onChange={e => {
                          const v = e.target.value as PropostaStatus | '';
                          setFiltroStatusProposta(v);
                          carregarPropostas(v, 1);
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9375rem',
                          fontWeight: 500,
                          background: 'var(--color-background)',
                          color: 'var(--color-text)',
                          minWidth: isMobilePropostas ? undefined : '140px',
                          width: isMobilePropostas ? '100%' : undefined,
                        }}
                      >
                        <option value=''>Todos</option>
                        <option value='rascunho'>Rascunho</option>
                        <option value='disponivel'>Disponível</option>
                      </select>
                      <input
                        type='date'
                        value={filtroDataInicioProposta}
                        onChange={e =>
                          setFiltroDataInicioProposta(e.target.value)
                        }
                        placeholder='Data início'
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9375rem',
                          minWidth: isMobilePropostas ? undefined : '130px',
                          width: isMobilePropostas ? '100%' : undefined,
                        }}
                      />
                      <input
                        type='date'
                        value={filtroDataFimProposta}
                        onChange={e => setFiltroDataFimProposta(e.target.value)}
                        placeholder='Data fim'
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9375rem',
                          minWidth: isMobilePropostas ? undefined : '130px',
                          width: isMobilePropostas ? '100%' : undefined,
                        }}
                      />
                      <input
                        type='text'
                        placeholder='Busca (número, nome, CPF)'
                        value={filtroSearchProposta}
                        onChange={e => setFiltroSearchProposta(e.target.value)}
                        onKeyDown={e =>
                          e.key === 'Enter' && carregarPropostas(undefined, 1)
                        }
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.9375rem',
                          minWidth: isMobilePropostas ? undefined : '160px',
                          width: isMobilePropostas ? '100%' : undefined,
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap',
                          flexDirection: isMobilePropostas ? 'row' : 'row',
                        }}
                      >
                        <Button
                          type='button'
                          $variant='secondary'
                          onClick={() => carregarPropostas(undefined, 1)}
                          disabled={loadingPropostas}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            fontWeight: 600,
                            flex: isMobilePropostas ? 1 : undefined,
                            minWidth: isMobilePropostas ? 0 : undefined,
                          }}
                        >
                          Filtrar
                        </Button>
                        <Button
                          type='button'
                          $variant='secondary'
                          onClick={() => {
                            setFiltroDataInicioProposta('');
                            setFiltroDataFimProposta('');
                            setFiltroSearchProposta('');
                            carregarPropostas(
                              filtroStatusProposta || undefined,
                              1
                            );
                          }}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            fontWeight: 600,
                            flex: isMobilePropostas ? 1 : undefined,
                            minWidth: isMobilePropostas ? 0 : undefined,
                          }}
                        >
                          Limpar
                        </Button>
                      </div>
                    </>
                  )}
                  {userTipo !== 'corretor' && (
                    <Button
                      type='button'
                      $variant='secondary'
                      onClick={() => setShowSelectCorretorModal(true)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        minHeight: '44px',
                        width: isMobilePropostas ? '100%' : undefined,
                      }}
                    >
                      <MdPerson style={{ marginRight: '8px' }} />
                      Trocar Corretor
                    </Button>
                  )}
                  {loadingPropostas && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      Carregando...
                    </div>
                  )}
                  <Button
                    type='button'
                    $variant='secondary'
                    onClick={() => {
                      if (!showPropostasAnteriores) {
                        carregarPropostas(undefined, 1);
                      }
                      setShowPropostasAnteriores(!showPropostasAnteriores);
                    }}
                    disabled={loadingPropostas}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      minHeight: '44px',
                      width: isMobilePropostas ? '100%' : undefined,
                    }}
                  >
                    {showPropostasAnteriores ? 'Ocultar' : 'Ver Propostas'}
                  </Button>
                </div>
              </div>

              {showPropostasAnteriores && (
                <>
                  {loadingPropostas ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <div
                        style={{
                          fontSize: '1rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Carregando propostas...
                      </div>
                    </div>
                  ) : propostasFinalizadas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <div
                        style={{
                          fontSize: '1rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Nenhuma proposta finalizada.
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Cards de Estatísticas */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: isMobilePropostas
                            ? 'repeat(2, 1fr)'
                            : 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: isMobilePropostas ? '16px' : '20px',
                          marginBottom: isMobilePropostas ? '24px' : '32px',
                        }}
                      >
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: isMobilePropostas ? '16px' : '24px',
                            color: 'white',
                            boxShadow: `0 4px 16px ${themeColors.primary}40`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.875rem',
                              opacity: 0.9,
                              marginBottom: '8px',
                            }}
                          >
                            Total de Propostas
                          </div>
                          <div
                            style={{
                              fontSize: isMobilePropostas ? '1.5rem' : '2rem',
                              fontWeight: 700,
                            }}
                          >
                            {totalPropostas > 0
                              ? totalPropostas
                              : estatisticas.total}
                          </div>
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: isMobilePropostas ? '16px' : '24px',
                            color: 'white',
                            boxShadow: `0 4px 16px ${themeColors.primary}40`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.875rem',
                              opacity: 0.9,
                              marginBottom: '8px',
                            }}
                          >
                            Valor Total
                          </div>
                          <div
                            style={{
                              fontSize: isMobilePropostas ? '1rem' : '2rem',
                              fontWeight: 700,
                            }}
                          >
                            {formatCurrencyValue(estatisticas.valorTotal)}
                          </div>
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: isMobilePropostas ? '16px' : '24px',
                            color: 'white',
                            boxShadow: `0 4px 16px ${themeColors.primary}40`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.875rem',
                              opacity: 0.9,
                              marginBottom: '8px',
                            }}
                          >
                            Valor Médio
                          </div>
                          <div
                            style={{
                              fontSize: isMobilePropostas ? '1rem' : '2rem',
                              fontWeight: 700,
                            }}
                          >
                            {formatCurrencyValue(estatisticas.valorMedio)}
                          </div>
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
                            borderRadius: '16px',
                            padding: isMobilePropostas ? '16px' : '24px',
                            color: 'white',
                            boxShadow: `0 4px 16px ${themeColors.primary}40`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.875rem',
                              opacity: 0.9,
                              marginBottom: '8px',
                            }}
                          >
                            Últimos 30 Dias
                          </div>
                          <div
                            style={{
                              fontSize: isMobilePropostas ? '1.5rem' : '2rem',
                              fontWeight: 700,
                            }}
                          >
                            {estatisticas.ultimos30Dias}
                          </div>
                        </div>
                      </div>

                      {/* Gráficos */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: isMobilePropostas
                            ? '1fr'
                            : 'repeat(auto-fit, minmax(400px, 1fr))',
                          gap: isMobilePropostas ? '20px' : '24px',
                          marginBottom: isMobilePropostas ? '24px' : '32px',
                        }}
                      >
                        {/* Gráfico de Linha - Evolução Temporal */}
                        {evolucaoTemporalData && (
                          <div
                            style={{
                              background: 'var(--color-background-secondary)',
                              borderRadius: isMobilePropostas ? '16px' : '20px',
                              padding: isMobilePropostas ? '16px' : '24px',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                              }}
                            >
                              <MdTrendingUp
                                size={24}
                                color={themeColors.primary}
                              />
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: '1.125rem',
                                  fontWeight: 700,
                                  color: 'var(--color-text)',
                                }}
                              >
                                Evolução Temporal
                              </h4>
                            </div>
                            <div
                              style={{
                                height: isMobilePropostas ? '220px' : '300px',
                              }}
                            >
                              <Line
                                data={evolucaoTemporalData}
                                options={lineChartOptions}
                              />
                            </div>
                          </div>
                        )}

                        {/* Gráfico de Pizza - Faixas de Valor */}
                        {faixasValorData && (
                          <div
                            style={{
                              background: 'var(--color-background-secondary)',
                              borderRadius: isMobilePropostas ? '16px' : '20px',
                              padding: isMobilePropostas ? '16px' : '24px',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                              }}
                            >
                              <MdPieChart
                                size={24}
                                color={themeColors.primary}
                              />
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: '1.125rem',
                                  fontWeight: 700,
                                  color: 'var(--color-text)',
                                }}
                              >
                                Distribuição por Faixa de Valor
                              </h4>
                            </div>
                            <div
                              style={{
                                height: isMobilePropostas ? '220px' : '300px',
                              }}
                            >
                              <Doughnut
                                data={faixasValorData}
                                options={doughnutChartOptions}
                              />
                            </div>
                          </div>
                        )}

                        {/* Gráfico de Barras - Distribuição Mensal */}
                        {distribuicaoMensalData && (
                          <div
                            style={{
                              background: 'var(--color-background-secondary)',
                              borderRadius: isMobilePropostas ? '16px' : '20px',
                              padding: isMobilePropostas ? '16px' : '24px',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                              gridColumn: '1 / -1',
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                              }}
                            >
                              <MdBarChart
                                size={24}
                                color={themeColors.primary}
                              />
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: '1.125rem',
                                  fontWeight: 700,
                                  color: 'var(--color-text)',
                                }}
                              >
                                Distribuição Mensal (Últimos 6 Meses)
                              </h4>
                            </div>
                            <div
                              style={{
                                height: isMobilePropostas ? '200px' : '250px',
                              }}
                            >
                              <Bar
                                data={distribuicaoMensalData}
                                options={barChartOptions}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Lista de Propostas Finalizadas */}
                      {propostasFinalizadas.length > 0 ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobilePropostas ? '20px' : '16px',
                          }}
                        >
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: isMobilePropostas
                                ? '1fr'
                                : 'repeat(auto-fill, minmax(300px, 1fr))',
                              gap: isMobilePropostas ? '20px' : '20px',
                            }}
                          >
                            {propostasFinalizadas.map(proposta => (
                              <div
                                key={proposta.id}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      'Deseja carregar esta proposta no formulário? Os dados atuais serão substituídos.'
                                    )
                                  ) {
                                    // Carregar dados da proposta (dados completos quando disponível)
                                    const dados = (proposta as PropostaListItem & { dados?: CreatePurchaseProposalDto }).dados;
                                    if (dados) {

                                      // Carregar proposta
                                      if (dados.proposta) {
                                        setValue(
                                          'proposta.dataProposta',
                                          dados.proposta.dataProposta
                                        );
                                        setValue(
                                          'proposta.prazoValidade',
                                          dados.proposta.prazoValidade
                                        );
                                        setValue(
                                          'proposta.precoProposto',
                                          formatCurrencyValue(
                                            dados.proposta.precoProposto
                                          )
                                        );
                                        setValue(
                                          'proposta.condicoesPagamento',
                                          dados.proposta.condicoesPagamento
                                        );
                                        setValue(
                                          'proposta.valorSinal',
                                          formatCurrencyValue(
                                            dados.proposta.valorSinal ?? 0
                                          )
                                        );
                                        setValue(
                                          'proposta.prazoPagamentoSinal',
                                          dados.proposta.prazoPagamentoSinal
                                        );
                                        setValue(
                                          'proposta.porcentagemComissao',
                                          dados.proposta.porcentagemComissao
                                        );
                                        setValue(
                                          'proposta.prazoEntrega',
                                          dados.proposta.prazoEntrega
                                        );
                                        setValue(
                                          'proposta.multaMensal',
                                          formatCurrencyValue(
                                            dados.proposta.multaMensal
                                          )
                                        );
                                      }

                                      // Carregar proponente
                                      if (dados.proponente) {
                                        Object.keys(dados.proponente).forEach(
                                          key => {
                                            const value = (
                                              dados.proponente as any
                                            )[key];
                                            if (value !== undefined) {
                                              if (key === 'cpf') {
                                                setValue(
                                                  `proponente.${key}` as any,
                                                  maskCPF(String(value))
                                                );
                                              } else {
                                                setValue(
                                                  `proponente.${key}` as any,
                                                  value
                                                );
                                              }
                                            }
                                          }
                                        );
                                      }

                                      // Carregar outros campos...
                                      showInfo(
                                        'Proposta carregada. Revise os dados antes de enviar.'
                                      );
                                    }
                                  }
                                }}
                                style={{
                                  background:
                                    'var(--color-background-secondary)',
                                  border: '2px solid var(--color-border)',
                                  borderRadius: '16px',
                                  padding: isMobilePropostas ? '20px' : '24px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  minWidth: 0,
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.borderColor =
                                    themeColors.primary;
                                  e.currentTarget.style.transform =
                                    'translateY(-4px)';
                                  e.currentTarget.style.boxShadow = `0 8px 24px ${themeColors.primary}33`;
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.borderColor =
                                    'var(--color-border)';
                                  e.currentTarget.style.transform =
                                    'translateY(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                  }}
                                />
                                <div style={{ marginTop: '8px' }}>
                                  <div
                                    style={{
                                      fontSize: '1.125rem',
                                      fontWeight: 700,
                                      color: themeColors.primary,
                                      marginBottom: '12px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    {proposta.numero}
                                    {(() => {
                                      const statusProposta = (
                                        proposta as PropostaListItem
                                      ).status;
                                      if (
                                        statusProposta !== 'rascunho' &&
                                        statusProposta !== 'disponivel'
                                      )
                                        return null;
                                      const ehRascunho =
                                        statusProposta === 'rascunho';
                                      return (
                                        <span
                                          style={{
                                            fontSize: '0.6875rem',
                                            fontWeight: 700,
                                            padding: '4px 8px',
                                            borderRadius: '999px',
                                            textTransform: 'uppercase',
                                            background: ehRascunho
                                              ? 'rgba(108, 117, 125, 0.2)'
                                              : 'rgba(40, 167, 69, 0.15)',
                                            color: ehRascunho
                                              ? '#495057'
                                              : '#1e7e34',
                                          }}
                                        >
                                          {ehRascunho
                                            ? 'Rascunho'
                                            : 'Disponível'}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '0.875rem',
                                      color: 'var(--color-text-secondary)',
                                      marginBottom: '16px',
                                      lineHeight: 1.6,
                                    }}
                                  >
                                    <div>
                                      Data da Proposta:{' '}
                                      <strong>
                                        {new Date(
                                          proposta.dataProposta
                                        ).toLocaleDateString('pt-BR')}
                                      </strong>
                                    </div>
                                    <div>
                                      Enviada em:{' '}
                                      {formatarDataHora(proposta.createdAt)}
                                    </div>
                                  </div>
                                  {/* 3 steps com status por etapa */}
                                  {(() => {
                                    const p = proposta as PropostaListItem;
                                    const etapa = p.etapa ?? 1;
                                    const step1Label = p.status === 'rascunho' ? 'Rascunho' : 'Enviado';
                                    const step2Label = etapa >= 2 ? 'Comprador assinou' : 'Pendente';
                                    const step3Label = etapa >= 3 ? 'Concluído' : 'Pendente';
                                    return (
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: '8px',
                                          marginBottom: '12px',
                                          fontSize: '0.75rem',
                                        }}
                                      >
                                        <span
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: 'rgba(0,0,0,0.06)',
                                            fontWeight: 600,
                                            color: 'var(--color-text)',
                                          }}
                                        >
                                          Etapa 1: {step1Label}
                                        </span>
                                        <span
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: etapa >= 2 ? 'rgba(40, 167, 69, 0.15)' : 'rgba(108, 117, 125, 0.15)',
                                            fontWeight: 600,
                                            color: etapa >= 2 ? '#1e7e34' : '#495057',
                                          }}
                                        >
                                          Etapa 2: {step2Label}
                                        </span>
                                        <span
                                          style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: etapa >= 3 ? 'rgba(40, 167, 69, 0.15)' : 'rgba(108, 117, 125, 0.15)',
                                            fontWeight: 600,
                                            color: etapa >= 3 ? '#1e7e34' : '#495057',
                                          }}
                                        >
                                          Etapa 3: {step3Label}
                                        </span>
                                      </div>
                                    );
                                  })()}
                                  <div
                                    style={{
                                      fontSize: isMobilePropostas
                                        ? '1.25rem'
                                        : '1.5rem',
                                      fontWeight: 700,
                                      color: themeColors.primary,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      marginBottom: '12px',
                                    }}
                                  >
                                    <MdAttachMoney
                                      size={isMobilePropostas ? 20 : 24}
                                    />
                                    {formatCurrencyValue(
                                      proposta.precoProposto
                                    )}
                                  </div>
                                  {userCpf && userTipo && (
                                    <div
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        width: '100%',
                                      }}
                                    >
                                      <Button
                                        type='button'
                                        $variant='primary'
                                        onClick={e => {
                                          e.stopPropagation();
                                          navigate(
                                            `/ficha-proposta/${proposta.id}`,
                                            { replace: false }
                                          );
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: isMobilePropostas
                                            ? '10px 12px'
                                            : '8px 12px',
                                          fontSize: '0.875rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '6px',
                                          minHeight: '44px',
                                        }}
                                      >
                                        <MdSearch size={18} /> Ver detalhes da
                                        proposta
                                      </Button>
                                      {/* Baixar PDF: uma opção por etapa; etapas 2 e 3 só habilitadas conforme progresso */}
                                      {[1, 2, 3].map(etapaNum => {
                                        const p = proposta as PropostaListItem;
                                        const etapaAtual = p.etapa ?? 1;
                                        const habilitado = etapaAtual >= etapaNum;
                                        return (
                                          <Button
                                            key={etapaNum}
                                            type='button'
                                            $variant='secondary'
                                            disabled={!habilitado}
                                            onClick={e => {
                                              e.stopPropagation();
                                              if (!habilitado) return;
                                              window.open(
                                                getUrlPdfProposta(proposta.id, userCpf, userTipo, etapaNum as 1 | 2 | 3),
                                                '_blank'
                                              );
                                            }}
                                            title={habilitado ? `Baixar PDF da Etapa ${etapaNum}` : `Conclua a etapa ${etapaNum - 1} para liberar`}
                                            style={{
                                              width: '100%',
                                              padding: isMobilePropostas ? '10px 12px' : '8px 12px',
                                              fontSize: '0.875rem',
                                              minHeight: '44px',
                                              opacity: habilitado ? 1 : 0.6,
                                            }}
                                          >
                                            PDF Etapa {etapaNum}
                                          </Button>
                                        );
                                      })}
                                      <Button
                                        type='button'
                                        $variant='secondary'
                                        onClick={e => {
                                          e.stopPropagation();
                                          const p = proposta as PropostaListItem;
                                          setReenviarEmailModal({
                                            propostaId: proposta.id,
                                            numero: proposta.numero,
                                            etapaProposta: p.etapa ?? 1,
                                          });
                                          setReenviarEmailEtapaSelecionada(1);
                                          setReenviarEmailText('');
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: isMobilePropostas
                                            ? '10px 12px'
                                            : '8px 12px',
                                          fontSize: '0.875rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '6px',
                                          minHeight: '44px',
                                        }}
                                      >
                                        <MdEmail size={18} /> Reenviar email
                                      </Button>
                                      {/* Assinaturas: Etapa 1 (Comprador) sempre; Etapa 2 (Proprietário) só se etapa >= 2 */}
                                      {(proposta as PropostaListItem).status === 'disponivel' && (
                                        <>
                                          <Button
                                            type='button'
                                            $variant='secondary'
                                            onClick={e => {
                                              e.stopPropagation();
                                              setPropostaAssinaturasModal({
                                                id: proposta.id,
                                                numero: proposta.numero,
                                              });
                                            }}
                                            style={{
                                              width: '100%',
                                              padding: isMobilePropostas ? '10px 12px' : '8px 12px',
                                              fontSize: '0.875rem',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              gap: '6px',
                                              minHeight: '44px',
                                            }}
                                          >
                                            <MdDraw size={18} /> Assinaturas (Comprador)
                                          </Button>
                                          {((proposta as PropostaListItem).etapa ?? 1) >= 2 && (
                                            <Button
                                              type='button'
                                              $variant='secondary'
                                              onClick={e => {
                                                e.stopPropagation();
                                                setPropostaAssinaturasModal({
                                                  id: proposta.id,
                                                  numero: proposta.numero,
                                                });
                                              }}
                                              style={{
                                                width: '100%',
                                                padding: isMobilePropostas ? '10px 12px' : '8px 12px',
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                minHeight: '44px',
                                              }}
                                            >
                                              <MdDraw size={18} /> Assinaturas (Proprietário)
                                            </Button>
                                          )}
                                        </>
                                      )}
                                      <Button
                                        type='button'
                                        $variant='primary'
                                        onClick={e => {
                                          e.stopPropagation();
                                          handlePreencherFichaVenda(
                                            proposta.id
                                          );
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: isMobilePropostas
                                            ? '10px 12px'
                                            : '8px 12px',
                                          fontSize: '0.875rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: '6px',
                                          minHeight: '44px',
                                        }}
                                      >
                                        <MdDescription size={18} /> Preencher
                                        Ficha de Venda
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {totalPagesPropostas > 1 && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                marginTop: '24px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <Button
                                type='button'
                                $variant='secondary'
                                disabled={
                                  pagePropostas <= 1 || loadingPropostas
                                }
                                onClick={() =>
                                  carregarPropostas(
                                    undefined,
                                    pagePropostas - 1
                                  )
                                }
                                style={{
                                  minHeight: '44px',
                                  padding: '8px 16px',
                                }}
                              >
                                Anterior
                              </Button>
                              <span
                                style={{
                                  fontSize: '0.9375rem',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                Página {pagePropostas} de {totalPagesPropostas}{' '}
                                {totalPropostas > 0 &&
                                  `(${totalPropostas} no total)`}
                              </span>
                              <Button
                                type='button'
                                $variant='secondary'
                                disabled={
                                  pagePropostas >= totalPagesPropostas ||
                                  loadingPropostas
                                }
                                onClick={() =>
                                  carregarPropostas(
                                    undefined,
                                    pagePropostas + 1
                                  )
                                }
                                style={{
                                  minHeight: '44px',
                                  padding: '8px 16px',
                                }}
                              >
                                Próxima
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Propostas por etapa */}
          {(propostasEnviadas.length > 0 || loadingPropostas) && (
            <div
              style={{
                background: 'var(--color-card-background)',
                borderRadius: isMobilePropostas ? '16px' : '24px',
                padding: isMobilePropostas ? '24px 20px' : '40px',
                marginBottom: isMobilePropostas ? '24px' : '40px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowPropostasPorEtapa(prev => !prev)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowPropostasPorEtapa(prev => !prev);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: showPropostasPorEtapa ? '24px' : 0,
                  paddingBottom: showPropostasPorEtapa ? '20px' : 0,
                  borderBottom: showPropostasPorEtapa
                    ? '2px solid var(--color-border)'
                    : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: isMobilePropostas ? '40px' : '48px',
                      height: isMobilePropostas ? '40px' : '48px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: `0 4px 12px ${themeColors.primary}4D`,
                      flexShrink: 0,
                    }}
                  >
                    <MdBarChart size={isMobilePropostas ? 20 : 24} />
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: isMobilePropostas ? '1.25rem' : '1.5rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                    }}
                  >
                    Propostas por etapa
                  </h3>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-text-secondary)',
                    transition: 'transform 0.2s ease',
                    transform: showPropostasPorEtapa ? 'rotate(0deg)' : 'rotate(-90deg)',
                  }}
                >
                  <MdExpandMore size={28} />
                </div>
              </div>
              {showPropostasPorEtapa && [
                {
                  etapa: 1,
                  titulo: 'Etapa 1 – Comprador',
                  list: propostasPorEtapa.etapa1,
                },
                {
                  etapa: 2,
                  titulo: 'Etapa 2 – Proprietário',
                  list: propostasPorEtapa.etapa2,
                },
                {
                  etapa: 3,
                  titulo: 'Etapa 3 – Corretor e Captadores',
                  list: propostasPorEtapa.etapa3,
                },
              ].map(({ etapa, titulo, list }) => (
                <div
                  key={etapa}
                  style={{
                    marginBottom: etapa < 3 ? (isMobilePropostas ? '28px' : '32px') : 0,
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: '16px',
                      marginTop: 0,
                    }}
                  >
                    {titulo} ({list.length})
                  </h4>
                  {list.length === 0 ? (
                    <div
                      style={{
                        padding: '20px',
                        background: 'var(--color-background-secondary)',
                        borderRadius: '12px',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.9375rem',
                      }}
                    >
                      Nenhuma proposta nesta etapa.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobilePropostas
                          ? '1fr'
                          : 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: isMobilePropostas ? '16px' : '20px',
                      }}
                    >
                      {list.map(proposta => (
                        <div
                          key={proposta.id}
                          onClick={() => {
                            if (
                              window.confirm(
                                'Deseja carregar esta proposta no formulário? Os dados atuais serão substituídos.'
                              )
                            ) {
                              const dados = (proposta as any).dados;
                              if (dados?.proposta) {
                                setValue(
                                  'proposta.dataProposta',
                                  dados.proposta.dataProposta
                                );
                                setValue(
                                  'proposta.precoProposto',
                                  formatCurrencyValue(
                                    dados.proposta.precoProposto
                                  )
                                );
                                setValue(
                                  'proposta.condicoesPagamento',
                                  dados.proposta.condicoesPagamento || ''
                                );
                                if (dados.proponente) {
                                  Object.keys(dados.proponente).forEach(
                                    (key: string) => {
                                      const value = (dados.proponente as any)[
                                        key
                                      ];
                                      if (value !== undefined && key === 'cpf') {
                                        setValue(
                                          `proponente.${key}` as any,
                                          maskCPF(String(value))
                                        );
                                      } else if (value !== undefined) {
                                        setValue(
                                          `proponente.${key}` as any,
                                          value
                                        );
                                      }
                                    }
                                  );
                                }
                                showInfo(
                                  'Proposta carregada. Revise os dados antes de enviar.'
                                );
                              }
                            }
                          }}
                          style={{
                            background: 'var(--color-background-secondary)',
                            border: '2px solid var(--color-border)',
                            borderRadius: '16px',
                            padding: isMobilePropostas ? '16px' : '20px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: themeColors.primary,
                              marginBottom: '8px',
                            }}
                          >
                            {proposta.numero}
                          </div>
                          <div
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--color-text-secondary)',
                              marginBottom: '8px',
                            }}
                          >
                            {new Date(
                              proposta.dataProposta
                            ).toLocaleDateString('pt-BR')}{' '}
                            · {formatCurrencyValue(proposta.precoProposto)}
                          </div>
                          {userCpf && userTipo && (
                            <Button
                              type='button'
                              $variant='primary'
                              onClick={e => {
                                e.stopPropagation();
                                navigate(`/ficha-proposta/${proposta.id}`, {
                                  replace: false,
                                });
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                fontSize: '0.8125rem',
                                minHeight: '40px',
                              }}
                            >
                              <MdSearch size={16} /> Ver detalhes
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload de Imagem para OCR - OCULTO TEMPORARIAMENTE */}
          {/* 
        <div style={{
          background: 'var(--color-card-background)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '2px solid var(--color-border)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
        }}>
          ... seção OCR oculta ...
        </div>
        */}

          {hasSavedData && (
            <InfoBox
              $type='info'
              style={{
                marginBottom: '32px',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              <InfoBoxText>
                💾 Seus dados estão sendo salvos automaticamente. Você pode
                continuar de onde parou.
              </InfoBoxText>
            </InfoBox>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            {/* Stepper: 3 etapas - Comprador → Proprietário → Corretor e Captadores */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '8px',
                padding: '20px 24px',
                background: 'var(--color-card-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              {[
                { num: 1 as const, label: 'Etapa 1 – Comprador', desc: 'Dados do comprador (somente nesta etapa)' },
                { num: 2 as const, label: 'Etapa 2 – Proprietário', desc: 'Após assinatura do comprador; dados do comprador não são exibidos' },
                { num: 3 as const, label: 'Etapa 3 – Corretor e Captadores', desc: 'Após assinatura do proprietário; vários gestores podem preencher até o envio final' },
              ].map(({ num, label, desc }) => {
                // Só desbloqueia etapa quando o backend liberar (assinaturas). Não dá para avançar sem assinar.
                const desbloqueada = maxEtapaLiberada >= num;
                const travada = !desbloqueada;
                return (
                <button
                  key={num}
                  type="button"
                  onClick={() => !travada && setEtapaAtual(num)}
                  disabled={travada}
                  title={travada ? 'Esta etapa é liberada apenas após a assinatura da etapa anterior' : undefined}
                  style={{
                    flex: '1 1 200px',
                    minWidth: 0,
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: etapaAtual === num ? '2px solid var(--color-primary, #A63126)' : '1px solid var(--color-border)',
                    background: etapaAtual === num ? 'rgba(166, 49, 38, 0.08)' : travada ? 'var(--color-background-secondary)' : 'var(--color-background)',
                    color: etapaAtual === num ? 'var(--color-primary, #A63126)' : travada ? 'var(--color-text-secondary)' : 'var(--color-text)',
                    fontWeight: etapaAtual === num ? 700 : 500,
                    fontSize: '0.9375rem',
                    textAlign: 'left',
                    cursor: travada ? 'not-allowed' : 'pointer',
                    opacity: travada ? 0.75 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'block', marginBottom: '2px' }}>{label}</span>
                  <span style={{ fontSize: '0.8125rem', opacity: 0.85, fontWeight: 400 }}>{desc}</span>
                </button>
                );
              })}
            </div>

            {/* Por etapa: texto de assinatura + um único botão Assinaturas (só após envio da proposta) */}
            {(() => {
              const textosAssinatura = {
                1: 'Para liberar a etapa 2, envie a proposta (botão "Enviar Proposta" abaixo) e, após o envio, use Assinaturas para enviar ao comprador.',
                2: 'Para liberar a etapa 3, envie para assinatura do proprietário.',
                3: 'Etapa 3 – Corretor e Captadores. Envio final; assinaturas já realizadas nas etapas anteriores.',
              };
              const mostrarBotaoAssinaturas = propostaIdFromUrl && userCpf && userTipo && statusPropostaAtual === 'disponivel';
              return (
                <div
                  style={{
                    marginBottom: '24px',
                    padding: '20px 24px',
                    background: 'var(--color-card-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '20px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    Assinatura – Etapa {etapaAtual}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {textosAssinatura[etapaAtual as 1 | 2 | 3]}
                  </p>
                  {mostrarBotaoAssinaturas && (
                    <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <Button
                        type='button'
                        $variant='secondary'
                        onClick={() => {
                          const numero = propostasEnviadas.find(p => p.id === propostaIdFromUrl)?.numero ?? 'Proposta atual';
                          setPropostaAssinaturasModal({ id: propostaIdFromUrl, numero });
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        <MdDraw size={18} /> Assinaturas (Comprador)
                      </Button>
                      {maxEtapaLiberada >= 2 && (
                        <Button
                          type='button'
                          $variant='secondary'
                          onClick={() => {
                            const numero = propostasEnviadas.find(p => p.id === propostaIdFromUrl)?.numero ?? 'Proposta atual';
                            setPropostaAssinaturasModal({ id: propostaIdFromUrl, numero });
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        >
                          <MdDraw size={18} /> Assinaturas (Proprietário)
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Bloco 1 - Proposta */}
            <CollapsibleSection
              $isExpanded={expandedSections.proposta}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.proposta
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader onClick={() => toggleSection('proposta')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdCalendarToday />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>Dados da Proposta</StyledSectionTitle>
                    <SectionDescription>
                      Informações gerais sobre a proposta de compra
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.proposta}>
                  {expandedSections.proposta ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent $isExpanded={expandedSections.proposta}>
                <FormGrid $columns={2}>
                  <FormGroup>
                    <FormLabel>
                      Data da Proposta <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='date'
                      {...register('proposta.dataProposta', {
                        required: 'Data da proposta é obrigatória',
                        validate: value =>
                          !value ||
                          validateDateNotFuture(value) ||
                          'Data não pode ser no futuro',
                      })}
                      max={new Date().toISOString().split('T')[0]}
                      $hasError={!!errors.proposta?.dataProposta}
                    />
                    {errors.proposta?.dataProposta && (
                      <ErrorMessage>
                        {errors.proposta.dataProposta.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Prazo de Validade (dias úteis){' '}
                      <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='number'
                      {...register('proposta.prazoValidade', {
                        required: 'Prazo de validade é obrigatório',
                        min: { value: 1, message: 'Mínimo 1 dia útil' },
                        max: { value: 365, message: 'Máximo 365 dias úteis' },
                        valueAsNumber: true,
                      })}
                      min={1}
                      max={365}
                      $hasError={!!errors.proposta?.prazoValidade}
                    />
                    {errors.proposta?.prazoValidade && (
                      <ErrorMessage>
                        {errors.proposta.prazoValidade.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Número de dias úteis para validade da proposta (máximo 365
                      dias)
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Preço Proposto <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proposta.precoProposto', {
                        required: 'Preço proposto é obrigatório',
                        validate: value =>
                          !value ||
                          validateMinValue(value, 0.01) ||
                          'Valor mínimo é R$ 0,01',
                      })}
                      placeholder='R$ 0,00'
                      onChange={e => {
                        handleMoneyChange(
                          e.target.value,
                          'proposta.precoProposto'
                        );
                        // Trigger validação do valor do sinal também
                        trigger('proposta.valorSinal');
                      }}
                      $hasError={!!errors.proposta?.precoProposto}
                    />
                    {errors.proposta?.precoProposto && (
                      <ErrorMessage>
                        {errors.proposta.precoProposto.message}
                      </ErrorMessage>
                    )}
                    <HelperText>Valor total da proposta de compra</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Valor do Sinal/Arras</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proposta.valorSinal', {
                        validate: value => {
                          if (!value || value.trim() === '') return true; // Opcional
                          if (!validateMinValue(value, 0.01))
                            return 'Valor mínimo é R$ 0,01';
                          // Validar se não é maior que o preço proposto
                          const precoProposto = watch('proposta.precoProposto');
                          if (precoProposto) {
                            const valorSinalNum = getNumericValue(value);
                            const precoPropostoNum =
                              getNumericValue(precoProposto);
                            if (valorSinalNum > precoPropostoNum) {
                              return 'Valor do sinal não pode ser maior que o preço proposto';
                            }
                          }
                          return true;
                        },
                      })}
                      placeholder='R$ 0,00'
                      onChange={e => {
                        handleMoneyChange(
                          e.target.value,
                          'proposta.valorSinal'
                        );
                        // Trigger validação do preço proposto também
                        trigger('proposta.precoProposto');
                      }}
                      $hasError={!!errors.proposta?.valorSinal}
                    />
                    {errors.proposta?.valorSinal && (
                      <ErrorMessage>
                        {errors.proposta.valorSinal.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Valor do sinal/arras (opcional - não pode ser maior que o
                      preço proposto)
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Prazo para Pagamento do Sinal (dias úteis)
                    </FormLabel>
                    <FormInput
                      type='number'
                      {...register('proposta.prazoPagamentoSinal', {
                        validate: value => {
                          if (
                            value === undefined ||
                            value === null ||
                            (typeof value === 'number' && isNaN(value))
                          )
                            return true; // Opcional
                          const numValue =
                            typeof value === 'number' ? value : Number(value);
                          if (isNaN(numValue) || numValue < 1)
                            return 'Mínimo 1 dia útil';
                          if (numValue > 365) return 'Máximo 365 dias úteis';
                          return true;
                        },
                        valueAsNumber: true,
                      })}
                      min={1}
                      max={365}
                      $hasError={!!errors.proposta?.prazoPagamentoSinal}
                    />
                    {errors.proposta?.prazoPagamentoSinal && (
                      <ErrorMessage>
                        {errors.proposta.prazoPagamentoSinal.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Prazo em dias úteis para pagamento do sinal (opcional -
                      máximo 365 dias)
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Porcentagem de Comissão (%){' '}
                      <span style={{ fontWeight: 400, opacity: 0.9 }}>
                        {' '}
                        (negociável)
                      </span>
                    </FormLabel>
                    <FormInput
                      type='number'
                      {...register('proposta.porcentagemComissao', {
                        min: { value: 0, message: 'Mínimo 0%' },
                        max: { value: 100, message: 'Máximo 100%' },
                        valueAsNumber: true,
                        validate: value => {
                          if (value != null && (value < 0 || value > 100))
                            return 'Porcentagem deve estar entre 0 e 100';
                          return true;
                        },
                      })}
                      min={0}
                      max={100}
                      step={0.01}
                      $hasError={!!errors.proposta?.porcentagemComissao}
                    />
                    {errors.proposta?.porcentagemComissao && (
                      <ErrorMessage>
                        {errors.proposta.porcentagemComissao.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Valor entre 0 e 100 (ex: 5.5 para 5,5%)
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Prazo para Entrega do Imóvel (dias úteis){' '}
                      <span style={{ fontWeight: 400, opacity: 0.9 }}>
                        {' '}
                        (negociável)
                      </span>
                    </FormLabel>
                    <FormInput
                      type='number'
                      {...register('proposta.prazoEntrega', {
                        min: { value: 0, message: 'Mínimo 0' },
                        max: { value: 365, message: 'Máximo 365 dias úteis' },
                        valueAsNumber: true,
                      })}
                      min={0}
                      max={365}
                      $hasError={!!errors.proposta?.prazoEntrega}
                    />
                    {errors.proposta?.prazoEntrega && (
                      <ErrorMessage>
                        {errors.proposta.prazoEntrega.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Prazo em dias úteis para entrega do imóvel (opcional)
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Multa Mensal por Atraso{' '}
                      <span style={{ fontWeight: 400, opacity: 0.9 }}>
                        {' '}
                        (negociável)
                      </span>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proposta.multaMensal', {
                        validate: value =>
                          !value ||
                          validateMinValue(value, 0) ||
                          'Valor mínimo é R$ 0,00',
                      })}
                      placeholder='R$ 0,00'
                      onChange={e => {
                        handleMoneyChange(
                          e.target.value,
                          'proposta.multaMensal'
                        );
                      }}
                      $hasError={!!errors.proposta?.multaMensal}
                    />
                    {errors.proposta?.multaMensal && (
                      <ErrorMessage>
                        {errors.proposta.multaMensal.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Multa mensal por atraso na entrega do imóvel (pode ser
                      zero)
                    </HelperText>
                  </FormGroup>

                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <FormLabel>
                      Condições de Pagamento{' '}
                      <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormTextarea
                      {...register('proposta.condicoesPagamento', {
                        required: 'Condições de pagamento são obrigatórias',
                        minLength: {
                          value: 10,
                          message:
                            'Descreva as condições de pagamento com mais detalhes (mínimo 10 caracteres)',
                        },
                      })}
                      placeholder='Descreva as condições de pagamento (ex: Entrada de 30% e financiamento do restante em 120 meses)'
                      rows={4}
                      maxLength={500}
                      $hasError={!!errors.proposta?.condicoesPagamento}
                    />
                    {errors.proposta?.condicoesPagamento && (
                      <ErrorMessage>
                        {errors.proposta.condicoesPagamento.message}
                      </ErrorMessage>
                    )}
                    <HelperText>Máximo 500 caracteres</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Unidade de Venda <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormSelect
                      {...register('proposta.unidadeVenda', {
                        required: 'Unidade de venda é obrigatória',
                      })}
                      $hasError={!!errors.proposta?.unidadeVenda}
                    >
                      <option value=''>Selecione...</option>
                      {UNIDADES.map(unidade => (
                        <option key={unidade} value={unidade}>
                          {unidade}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.proposta?.unidadeVenda && (
                      <ErrorMessage>
                        {errors.proposta.unidadeVenda.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Unidade de Captação{' '}
                      <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormSelect
                      {...register('proposta.unidadeCaptacao', {
                        required: 'Unidade de captação é obrigatória',
                      })}
                      $hasError={!!errors.proposta?.unidadeCaptacao}
                    >
                      <option value=''>Selecione...</option>
                      {UNIDADES.map(unidade => (
                        <option key={unidade} value={unidade}>
                          {unidade}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.proposta?.unidadeCaptacao && (
                      <ErrorMessage>
                        {errors.proposta.unidadeCaptacao.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>
              </SectionContent>
            </CollapsibleSection>

            {/* Etapa 1: Comprador – somente nesta etapa os dados do comprador são exibidos */}
            {etapaAtual === 1 && (
            <>
            {/* Bloco 2 - Proponente */}
            <CollapsibleSection
              $isExpanded={expandedSections.proponente}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.proponente
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader onClick={() => toggleSection('proponente')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdPerson />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>
                      Proponente (Comprador)
                    </StyledSectionTitle>
                    <SectionDescription>
                      Dados pessoais do proponente
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.proponente}>
                  {expandedSections.proponente ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent $isExpanded={expandedSections.proponente}>
                {!podeEditarEtapa(1) && (
                  <InfoBox $type='info' style={{ marginBottom: '16px' }}>
                    <InfoBoxText>
                      Somente gestor pode editar esta etapa após a assinatura do comprador.
                    </InfoBoxText>
                  </InfoBox>
                )}
                <div
                  style={{
                    pointerEvents: podeEditarEtapa(1) ? 'auto' : 'none',
                    opacity: podeEditarEtapa(1) ? 1 : 0.9,
                  }}
                >
                <FormGrid $columns={2}>
                  <FormGroup>
                    <FormLabel>
                      Nome Completo <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.nome', {
                        required: 'Nome é obrigatório',
                        validate: value =>
                          !value ||
                          validateName(value) ||
                          'Digite nome completo (mínimo 2 palavras)',
                        minLength: {
                          value: 3,
                          message: 'Nome deve ter no mínimo 3 caracteres',
                        },
                        maxLength: {
                          value: 150,
                          message: 'Nome deve ter no máximo 150 caracteres',
                        },
                      })}
                      placeholder='Digite o nome completo'
                      maxLength={150}
                      $hasError={!!errors.proponente?.nome}
                    />
                    {errors.proponente?.nome && (
                      <ErrorMessage>
                        {errors.proponente.nome.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      CPF <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.cpf', {
                        required: 'CPF é obrigatório',
                        validate: value => {
                          if (!value) return 'CPF é obrigatório';
                          if (!validateCPF(value)) return 'CPF inválido';
                          // Verificar se não é igual ao CPF do proprietário
                          const proprietarioCpf = watch('proprietario.cpf');
                          if (
                            proprietarioCpf &&
                            value.replace(/\D/g, '') ===
                              proprietarioCpf.replace(/\D/g, '')
                          ) {
                            return 'CPF do proponente não pode ser igual ao CPF do proprietário';
                          }
                          return true;
                        },
                      })}
                      placeholder='000.000.000-00'
                      maxLength={14}
                      onChange={e => {
                        handleCPFChange(e.target.value, 'proponente.cpf');
                        trigger('proprietario.cpf');
                      }}
                      $hasError={!!errors.proponente?.cpf}
                    />
                    {errors.proponente?.cpf && (
                      <ErrorMessage>
                        {errors.proponente.cpf.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      RG <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.rg', {
                        required: 'RG é obrigatório',
                        validate: value =>
                          !value ||
                          validateRG(value) ||
                          'RG inválido (mínimo 4 dígitos)',
                      })}
                      placeholder='00.000.000-0'
                      maxLength={13}
                      onChange={e => {
                        const masked = maskRG(e.target.value);
                        setValue('proponente.rg', masked);
                      }}
                      $hasError={!!errors.proponente?.rg}
                    />
                    {errors.proponente?.rg && (
                      <ErrorMessage>
                        {errors.proponente.rg.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Data de Nascimento{' '}
                      <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='date'
                      {...register('proponente.dataNascimento', {
                        required: 'Data de nascimento é obrigatória',
                        validate: value => {
                          if (!value) return 'Data de nascimento é obrigatória';
                          if (!validateAge(value))
                            return 'Deve ter mais de 18 anos';
                          // Validar que não é data futura
                          const birthDate = new Date(value);
                          const today = new Date();
                          if (birthDate > today)
                            return 'Data de nascimento não pode ser no futuro';
                          return true;
                        },
                      })}
                      max={new Date().toISOString().split('T')[0]}
                      $hasError={!!errors.proponente?.dataNascimento}
                    />
                    {errors.proponente?.dataNascimento ? (
                      <ErrorMessage>
                        {errors.proponente.dataNascimento.message}
                      </ErrorMessage>
                    ) : (
                      <HelperText>Idade mínima: 18 anos</HelperText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Nacionalidade <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormSelect
                      {...register('proponente.nacionalidade', {
                        required: 'Nacionalidade é obrigatória',
                      })}
                      $hasError={!!errors.proponente?.nacionalidade}
                    >
                      {NACIONALIDADES.map(nac => (
                        <option key={nac} value={nac}>
                          {nac}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.proponente?.nacionalidade && (
                      <ErrorMessage>
                        {errors.proponente.nacionalidade.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Estado Civil <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormSelect
                      {...register('proponente.estadoCivil', {
                        required: 'Estado civil é obrigatório',
                      })}
                      $hasError={!!errors.proponente?.estadoCivil}
                    >
                      <option value=''>Selecione...</option>
                      {ESTADOS_CIVIS.map(ec => (
                        <option key={ec} value={ec}>
                          {ec}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.proponente?.estadoCivil && (
                      <ErrorMessage>
                        {errors.proponente.estadoCivil.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  {proponenteEstadoCivil &&
                    (proponenteEstadoCivil === 'Casado' ||
                      proponenteEstadoCivil === 'Casada' ||
                      proponenteEstadoCivil === 'União Estável') && (
                      <FormGroup>
                        <FormLabel>Regime de Casamento</FormLabel>
                        <FormSelect
                          {...register('proponente.regimeCasamento', {
                            required:
                              'Regime de casamento é obrigatório quando estado civil é Casado/União Estável',
                          })}
                          $hasError={!!errors.proponente?.regimeCasamento}
                        >
                          <option value=''>Selecione...</option>
                          {REGIMES_CASAMENTO.map(reg => (
                            <option key={reg} value={reg}>
                              {reg}
                            </option>
                          ))}
                        </FormSelect>
                        {errors.proponente?.regimeCasamento && (
                          <ErrorMessage>
                            {errors.proponente.regimeCasamento.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>
                    )}

                  <FormGroup>
                    <FormLabel>Profissão</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.profissao', {
                        maxLength: {
                          value: 100,
                          message:
                            'Profissão deve ter no máximo 100 caracteres',
                        },
                      })}
                      placeholder='Digite a profissão'
                      maxLength={100}
                    />
                    <HelperText>Campo opcional</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Email <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='email'
                      {...register('proponente.email', {
                        required: 'Email é obrigatório',
                        validate: value =>
                          !value || validateEmail(value) || 'Email inválido',
                      })}
                      placeholder='exemplo@email.com'
                      $hasError={!!errors.proponente?.email}
                    />
                    {errors.proponente?.email && (
                      <ErrorMessage>
                        {errors.proponente.email.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Telefone <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.telefone', {
                        required: 'Telefone é obrigatório',
                        validate: value => {
                          if (!value) return 'Telefone é obrigatório';
                          const clean = value.replace(/\D/g, '');
                          if (clean.length < 10 || clean.length > 11) {
                            return 'Telefone deve ter 10 ou 11 dígitos (com DDD)';
                          }
                          return true;
                        },
                      })}
                      placeholder='(00) 00000-0000'
                      maxLength={15}
                      onChange={e => {
                        const masked = maskPhoneAuto(e.target.value);
                        setValue('proponente.telefone', masked);
                      }}
                      $hasError={!!errors.proponente?.telefone}
                    />
                    {errors.proponente?.telefone && (
                      <ErrorMessage>
                        {errors.proponente.telefone.message}
                      </ErrorMessage>
                    )}
                    <HelperText>Telefone fixo ou celular com DDD</HelperText>
                  </FormGroup>

                  <Divider style={{ gridColumn: '1 / -1', margin: '24px 0' }} />

                  <FormGroup>
                    <FormLabel>
                      CEP <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'stretch',
                      }}
                    >
                      <FormInput
                        type='text'
                        {...register('proponente.cep', {
                          required: 'CEP é obrigatório',
                          validate: value =>
                            !value ||
                            validateCEP(value) ||
                            'CEP inválido (deve ter 8 dígitos)',
                        })}
                        placeholder='00000-000'
                        maxLength={9}
                        onChange={e => {
                          const masked = maskCEP(e.target.value);
                          setValue('proponente.cep', masked);
                        }}
                        $hasError={!!errors.proponente?.cep}
                        style={{ flex: 1 }}
                      />
                      <CepSearchButton
                        type='button'
                        onClick={() => {
                          const cep = watch('proponente.cep');
                          if (cep && cep.replace(/\D/g, '').length === 8) {
                            buscarCEPProponente(cep);
                          } else {
                            showWarning('CEP deve conter 8 dígitos');
                          }
                        }}
                        disabled={loadingCEP.proponente}
                      >
                        {loadingCEP.proponente ? (
                          <>
                            <div
                              style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid white',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }}
                            />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <MdSearch /> Buscar
                          </>
                        )}
                      </CepSearchButton>
                    </div>
                    {errors.proponente?.cep && (
                      <ErrorMessage>
                        {errors.proponente.cep.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Digite o CEP e clique em "Buscar" para preencher o
                      endereço automaticamente
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Residência Atual <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.residenciaAtual', {
                        required: 'Residência atual é obrigatória',
                        minLength: {
                          value: 5,
                          message: 'Endereço deve ter no mínimo 5 caracteres',
                        },
                        maxLength: {
                          value: 200,
                          message: 'Endereço deve ter no máximo 200 caracteres',
                        },
                      })}
                      placeholder='Endereço completo'
                      maxLength={200}
                      $hasError={!!errors.proponente?.residenciaAtual}
                    />
                    {errors.proponente?.residenciaAtual && (
                      <ErrorMessage>
                        {errors.proponente.residenciaAtual.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Bairro <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.bairro', {
                        required: 'Bairro é obrigatório',
                        minLength: {
                          value: 2,
                          message: 'Bairro deve ter no mínimo 2 caracteres',
                        },
                        maxLength: {
                          value: 100,
                          message: 'Bairro deve ter no máximo 100 caracteres',
                        },
                      })}
                      placeholder='Nome do bairro'
                      maxLength={100}
                      $hasError={!!errors.proponente?.bairro}
                    />
                    {errors.proponente?.bairro && (
                      <ErrorMessage>
                        {errors.proponente.bairro.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Cidade <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.cidade', {
                        required: 'Cidade é obrigatória',
                        minLength: {
                          value: 2,
                          message: 'Cidade deve ter no mínimo 2 caracteres',
                        },
                        maxLength: {
                          value: 100,
                          message: 'Cidade deve ter no máximo 100 caracteres',
                        },
                      })}
                      placeholder='Nome da cidade'
                      maxLength={100}
                      $hasError={!!errors.proponente?.cidade}
                    />
                    {errors.proponente?.cidade && (
                      <ErrorMessage>
                        {errors.proponente.cidade.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Estado (UF) <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('proponente.estado', {
                        required: 'Estado é obrigatório',
                        maxLength: 2,
                        pattern: {
                          value: /^[A-Z]{2}$/,
                          message:
                            'Digite apenas a sigla do estado (ex: SP, RJ)',
                        },
                        validate: value =>
                          !value ||
                          validateUF(value) ||
                          'UF inválida. Use a sigla de um estado brasileiro (ex: SP, RJ, MG)',
                      })}
                      placeholder='SP'
                      maxLength={2}
                      style={{ textTransform: 'uppercase' }}
                      onChange={e => {
                        setValue(
                          'proponente.estado',
                          e.target.value.toUpperCase()
                        );
                      }}
                      $hasError={!!errors.proponente?.estado}
                      list='estados-brasil'
                    />
                    <datalist id='estados-brasil'>
                      {ESTADOS_BRASIL.map(uf => (
                        <option key={uf} value={uf} />
                      ))}
                    </datalist>
                    {errors.proponente?.estado && (
                      <ErrorMessage>
                        {errors.proponente.estado.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Digite a sigla do estado (ex: SP, RJ, MG)
                    </HelperText>
                  </FormGroup>
                </FormGrid>
                </div>
              </SectionContent>
            </CollapsibleSection>

            {/* Bloco 3 - Proponente Cônjuge */}
            <CollapsibleSection
              $isExpanded={expandedSections.proponenteConjuge}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.proponenteConjuge
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader onClick={() => toggleSection('proponenteConjuge')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdGroup />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>
                      Proponente Cônjuge/Sócio
                    </StyledSectionTitle>
                    <SectionDescription>
                      Dados do cônjuge ou sócio do proponente (opcional)
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.proponenteConjuge}>
                  {expandedSections.proponenteConjuge ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent $isExpanded={expandedSections.proponenteConjuge}>
                {!podeEditarEtapa(1) && (
                  <InfoBox $type='info' style={{ marginBottom: '16px' }}>
                    <InfoBoxText>
                      Somente gestor pode editar esta etapa após a assinatura do comprador.
                    </InfoBoxText>
                  </InfoBox>
                )}
                <div
                  style={{
                    pointerEvents: podeEditarEtapa(1) ? 'auto' : 'none',
                    opacity: podeEditarEtapa(1) ? 1 : 0.9,
                  }}
                >
                <FormGrid $columns={2}>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <CheckboxWrapper>
                      <CheckboxInput
                        type='checkbox'
                        {...register('possuiProponenteConjuge')}
                        onChange={e => {
                          setValue('possuiProponenteConjuge', e.target.checked);
                          if (!e.target.checked) {
                            setValue('proponenteConjuge', undefined);
                          } else {
                            setValue('proponenteConjuge', {
                              nome: '',
                              rg: '',
                              cpf: '',
                              email: '',
                              telefone: '',
                            });
                          }
                        }}
                      />
                      <CheckboxLabel>Possui cônjuge ou sócio</CheckboxLabel>
                    </CheckboxWrapper>
                  </FormGroup>

                  {possuiProponenteConjuge && (
                    <>
                      <FormGroup>
                        <FormLabel>
                          Nome Completo <RequiredIndicator>*</RequiredIndicator>
                        </FormLabel>
                        <FormInput
                          type='text'
                          {...register('proponenteConjuge.nome', {
                            required: possuiProponenteConjuge
                              ? 'Nome é obrigatório'
                              : false,
                            validate: value => {
                              if (!possuiProponenteConjuge) return true;
                              return (
                                !value ||
                                validateName(value) ||
                                'Digite nome completo (mínimo 2 palavras)'
                              );
                            },
                            minLength: possuiProponenteConjuge
                              ? {
                                  value: 3,
                                  message:
                                    'Nome deve ter no mínimo 3 caracteres',
                                }
                              : undefined,
                            maxLength: possuiProponenteConjuge
                              ? {
                                  value: 150,
                                  message:
                                    'Nome deve ter no máximo 150 caracteres',
                                }
                              : undefined,
                          })}
                          placeholder='Digite o nome completo'
                          maxLength={150}
                          $hasError={!!errors.proponenteConjuge?.nome}
                        />
                        {errors.proponenteConjuge?.nome && (
                          <ErrorMessage>
                            {errors.proponenteConjuge.nome.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>
                          CPF <RequiredIndicator>*</RequiredIndicator>
                        </FormLabel>
                        <FormInput
                          type='text'
                          {...register('proponenteConjuge.cpf', {
                            required: possuiProponenteConjuge
                              ? 'CPF é obrigatório'
                              : false,
                            validate: value => {
                              if (!possuiProponenteConjuge) return true;
                              if (!value) return 'CPF é obrigatório';
                              if (!validateCPF(value)) return 'CPF inválido';
                              // Verificar se não é igual ao CPF do proponente
                              const proponenteCpf = watch('proponente.cpf');
                              if (
                                proponenteCpf &&
                                value.replace(/\D/g, '') ===
                                  proponenteCpf.replace(/\D/g, '')
                              ) {
                                return 'CPF do cônjuge não pode ser igual ao CPF do proponente';
                              }
                              return true;
                            },
                          })}
                          placeholder='000.000.000-00'
                          maxLength={14}
                          onChange={e => {
                            handleCPFChange(
                              e.target.value,
                              'proponenteConjuge.cpf'
                            );
                            trigger('proponente.cpf');
                          }}
                          $hasError={!!errors.proponenteConjuge?.cpf}
                        />
                        {errors.proponenteConjuge?.cpf && (
                          <ErrorMessage>
                            {errors.proponenteConjuge.cpf.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>
                          RG <RequiredIndicator>*</RequiredIndicator>
                        </FormLabel>
                        <FormInput
                          type='text'
                          {...register('proponenteConjuge.rg', {
                            required: possuiProponenteConjuge
                              ? 'RG é obrigatório'
                              : false,
                            validate: value => {
                              if (!possuiProponenteConjuge) return true;
                              return (
                                !value ||
                                validateRG(value) ||
                                'RG inválido (mínimo 4 dígitos)'
                              );
                            },
                          })}
                          placeholder='00.000.000-0'
                          maxLength={13}
                          onChange={e => {
                            const masked = maskRG(e.target.value);
                            setValue('proponenteConjuge.rg', masked);
                          }}
                          $hasError={!!errors.proponenteConjuge?.rg}
                        />
                        {errors.proponenteConjuge?.rg && (
                          <ErrorMessage>
                            {errors.proponenteConjuge.rg.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Profissão</FormLabel>
                        <FormInput
                          type='text'
                          {...register('proponenteConjuge.profissao', {
                            maxLength: {
                              value: 100,
                              message:
                                'Profissão deve ter no máximo 100 caracteres',
                            },
                          })}
                          placeholder='Digite a profissão'
                          maxLength={100}
                        />
                        <HelperText>Campo opcional</HelperText>
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>
                          Email <RequiredIndicator>*</RequiredIndicator>
                        </FormLabel>
                        <FormInput
                          type='email'
                          {...register('proponenteConjuge.email', {
                            required: possuiProponenteConjuge
                              ? 'Email é obrigatório'
                              : false,
                            validate: value => {
                              if (!possuiProponenteConjuge) return true;
                              return (
                                !value ||
                                validateEmail(value) ||
                                'Email inválido'
                              );
                            },
                          })}
                          placeholder='exemplo@email.com'
                          $hasError={!!errors.proponenteConjuge?.email}
                        />
                        {errors.proponenteConjuge?.email && (
                          <ErrorMessage>
                            {errors.proponenteConjuge.email.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>
                          Telefone <RequiredIndicator>*</RequiredIndicator>
                        </FormLabel>
                        <FormInput
                          type='text'
                          {...register('proponenteConjuge.telefone', {
                            required: possuiProponenteConjuge
                              ? 'Telefone é obrigatório'
                              : false,
                            validate: value => {
                              if (!possuiProponenteConjuge) return true;
                              if (!value) return 'Telefone é obrigatório';
                              const clean = value.replace(/\D/g, '');
                              if (clean.length < 10 || clean.length > 11) {
                                return 'Telefone deve ter 10 ou 11 dígitos (com DDD)';
                              }
                              return true;
                            },
                          })}
                          placeholder='(00) 00000-0000'
                          maxLength={15}
                          onChange={e => {
                            const masked = maskPhoneAuto(e.target.value);
                            setValue('proponenteConjuge.telefone', masked);
                          }}
                          $hasError={!!errors.proponenteConjuge?.telefone}
                        />
                        {errors.proponenteConjuge?.telefone && (
                          <ErrorMessage>
                            {errors.proponenteConjuge.telefone.message}
                          </ErrorMessage>
                        )}
                        <HelperText>
                          Telefone fixo ou celular com DDD
                        </HelperText>
                      </FormGroup>
                    </>
                  )}
                </FormGrid>
                </div>
              </SectionContent>
            </CollapsibleSection>

            </>
            )}

            {/* Bloco 4 - Imóvel */}
            <CollapsibleSection
              $isExpanded={expandedSections.imovel}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.imovel
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader onClick={() => toggleSection('imovel')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdHome />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>Imóvel</StyledSectionTitle>
                    <SectionDescription>
                      Dados do imóvel objeto da proposta
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.imovel}>
                  {expandedSections.imovel ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent $isExpanded={expandedSections.imovel}>
                <FormGrid $columns={2}>
                  <FormGroup>
                    <FormLabel>Matrícula</FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.matricula', {
                        maxLength: {
                          value: 50,
                          message: 'Matrícula deve ter no máximo 50 caracteres',
                        },
                      })}
                      placeholder='Número da matrícula (opcional)'
                      maxLength={50}
                      $hasError={!!errors.imovel?.matricula}
                    />
                    {errors.imovel?.matricula && (
                      <ErrorMessage>
                        {errors.imovel.matricula.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Número da matrícula do imóvel no cartório
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Cartório</FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.cartorio', {
                        maxLength: {
                          value: 100,
                          message: 'Cartório deve ter no máximo 100 caracteres',
                        },
                      })}
                      placeholder='Número do cartório (opcional)'
                      maxLength={100}
                      $hasError={!!errors.imovel?.cartorio}
                    />
                    {errors.imovel?.cartorio && (
                      <ErrorMessage>
                        {errors.imovel.cartorio.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Nome ou número do cartório onde o imóvel está registrado
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Cadastro na Prefeitura</FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.cadastroPrefeitura')}
                      placeholder='Número do cadastro (opcional)'
                    />
                  </FormGroup>

                  <FormGroup
                    style={{ gridColumn: '1 / -1', position: 'relative' }}
                  >
                    <FormLabel>Buscar imóvel por código</FormLabel>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'stretch',
                      }}
                    >
                      <FormInput
                        type='text'
                        value={buscaCodigoImovelProposta}
                        onChange={e =>
                          setBuscaCodigoImovelProposta(e.target.value)
                        }
                        placeholder='Código do imóvel (ex.: IMV-001)'
                        style={{ flex: 1 }}
                        onFocus={() =>
                          buscaCodigoImovelProposta &&
                          setShowDropdownImovelProposta(
                            propriedadesBuscaProposta.length > 0
                          )
                        }
                      />
                      <CepSearchButton
                        type='button'
                        onClick={buscarPropriedadesPorCodigoProposta}
                        disabled={loadingPropriedadesProposta}
                      >
                        {loadingPropriedadesProposta ? (
                          <>
                            <div
                              style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid white',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }}
                            />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <MdSearch size={18} /> Buscar imóvel
                          </>
                        )}
                      </CepSearchButton>
                    </div>
                    <HelperText>
                      Digite o código e clique em &quot;Buscar imóvel&quot; para
                      preencher endereço, matrícula (código) e CEP
                      automaticamente
                    </HelperText>
                    {showDropdownImovelProposta &&
                      propriedadesBuscaProposta.length > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '4px',
                            background: 'var(--color-background)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            zIndex: 10,
                            maxHeight: '280px',
                            overflowY: 'auto',
                          }}
                        >
                          {propriedadesBuscaProposta.map(prop => (
                            <button
                              key={prop.id}
                              type='button'
                              onClick={() =>
                                selecionarPropriedadeParaImovelProposta(prop)
                              }
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                textAlign: 'left',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                color: 'var(--color-text)',
                                borderBottom: '1px solid var(--color-border)',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background =
                                  'var(--color-background-secondary)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background =
                                  'transparent';
                              }}
                            >
                              <strong>{prop.code ?? prop.id}</strong>
                              {prop.address && ` — ${prop.address}`}
                              {(prop.city || prop.state) &&
                                ` · ${[prop.city, prop.state].filter(Boolean).join(' - ')}`}
                            </button>
                          ))}
                        </div>
                      )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>CEP</FormLabel>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'stretch',
                      }}
                    >
                      <FormInput
                        type='text'
                        {...register('imovel.cep', {
                          validate: value =>
                            !value ||
                            validateCEP(value) ||
                            'CEP inválido (deve ter 8 dígitos)',
                        })}
                        placeholder='00000-000'
                        maxLength={9}
                        onChange={e => {
                          const masked = maskCEP(e.target.value);
                          setValue('imovel.cep', masked);
                        }}
                        style={{ flex: 1 }}
                      />
                      <CepSearchButton
                        type='button'
                        onClick={() => {
                          const cepRaw = watch('imovel.cep');
                          const cep = typeof cepRaw === 'string' ? cepRaw : '';
                          if (cep && cep.replace(/\D/g, '').length === 8) {
                            buscarCEPImovel(cep);
                          } else {
                            showWarning('CEP deve conter 8 dígitos');
                          }
                        }}
                        disabled={loadingCEP.imovel}
                      >
                        {loadingCEP.imovel ? (
                          <>
                            <div
                              style={{
                                width: '14px',
                                height: '14px',
                                border: '2px solid white',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }}
                            />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <MdSearch /> Buscar
                          </>
                        )}
                      </CepSearchButton>
                    </div>
                    <HelperText>
                      Digite o CEP e clique em "Buscar" para preencher o
                      endereço automaticamente
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Endereço <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.endereco', {
                        required: 'Endereço é obrigatório',
                        minLength: {
                          value: 5,
                          message: 'Endereço deve ter no mínimo 5 caracteres',
                        },
                        maxLength: {
                          value: 200,
                          message: 'Endereço deve ter no máximo 200 caracteres',
                        },
                      })}
                      placeholder='Endereço completo do imóvel'
                      maxLength={200}
                      $hasError={!!errors.imovel?.endereco}
                    />
                    {errors.imovel?.endereco && (
                      <ErrorMessage>
                        {errors.imovel.endereco.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Bairro <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.bairro', {
                        required: 'Bairro é obrigatório',
                      })}
                      placeholder='Nome do bairro'
                      $hasError={!!errors.imovel?.bairro}
                    />
                    {errors.imovel?.bairro && (
                      <ErrorMessage>
                        {errors.imovel.bairro.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Cidade <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.cidade', {
                        required: 'Cidade é obrigatória',
                        minLength: {
                          value: 2,
                          message: 'Cidade deve ter no mínimo 2 caracteres',
                        },
                        maxLength: {
                          value: 100,
                          message: 'Cidade deve ter no máximo 100 caracteres',
                        },
                      })}
                      placeholder='Nome da cidade'
                      maxLength={100}
                      $hasError={!!errors.imovel?.cidade}
                    />
                    {errors.imovel?.cidade && (
                      <ErrorMessage>
                        {errors.imovel.cidade.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>
                      Estado (UF) <RequiredIndicator>*</RequiredIndicator>
                    </FormLabel>
                    <FormInput
                      type='text'
                      {...register('imovel.estado', {
                        required: 'Estado é obrigatório',
                        maxLength: 2,
                        pattern: {
                          value: /^[A-Z]{2}$/,
                          message:
                            'Digite apenas a sigla do estado (ex: SP, RJ)',
                        },
                        validate: value =>
                          !value ||
                          validateUF(value) ||
                          'UF inválida. Use a sigla de um estado brasileiro (ex: SP, RJ, MG)',
                      })}
                      placeholder='SP'
                      maxLength={2}
                      style={{ textTransform: 'uppercase' }}
                      onChange={e => {
                        setValue('imovel.estado', e.target.value.toUpperCase());
                      }}
                      $hasError={!!errors.imovel?.estado}
                      list='estados-brasil-imovel'
                    />
                    <datalist id='estados-brasil-imovel'>
                      {ESTADOS_BRASIL.map(uf => (
                        <option key={uf} value={uf} />
                      ))}
                    </datalist>
                    {errors.imovel?.estado && (
                      <ErrorMessage>
                        {errors.imovel.estado.message}
                      </ErrorMessage>
                    )}
                    <HelperText>
                      Digite a sigla do estado (ex: SP, RJ, MG)
                    </HelperText>
                  </FormGroup>
                </FormGrid>
              </SectionContent>
            </CollapsibleSection>

            {/* Etapa 2 e 3: Proprietário – após assinatura do comprador; dados do comprador não são exibidos */}
            {etapaAtual >= 2 && (
            <>
            {/* Bloco 5 - Proprietário */}
            <CollapsibleSection $isExpanded={expandedSections.proprietario}>
              <SectionHeader onClick={() => toggleSection('proprietario')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdPerson />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>Proprietário</StyledSectionTitle>
                    <SectionDescription>
                      Dados pessoais do proprietário do imóvel
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.proprietario}>
                  {expandedSections.proprietario ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent $isExpanded={expandedSections.proprietario}>
                {!podeEditarEtapa(2) && (
                  <InfoBox $type='info' style={{ marginBottom: '16px' }}>
                    <InfoBoxText>
                      Somente gestor pode editar esta etapa após a assinatura do proprietário.
                    </InfoBoxText>
                  </InfoBox>
                )}
                <div
                  style={{
                    pointerEvents: podeEditarEtapa(2) ? 'auto' : 'none',
                    opacity: podeEditarEtapa(2) ? 1 : 0.9,
                  }}
                >
                <FormGrid $columns={2}>
                  <FormGroup>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.nome', {
                        validate: value =>
                          !value ||
                          validateName(value) ||
                          'Digite nome completo (mínimo 2 palavras)',
                        minLength: {
                          value: 3,
                          message: 'Nome deve ter no mínimo 3 caracteres',
                        },
                        maxLength: {
                          value: 150,
                          message: 'Nome deve ter no máximo 150 caracteres',
                        },
                      })}
                      placeholder='Digite o nome completo (corretor pode preencher na visita)'
                      maxLength={150}
                      $hasError={!!errors.proprietario?.nome}
                    />
                    {errors.proprietario?.nome && (
                      <ErrorMessage>
                        {errors.proprietario.nome.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>CPF</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.cpf', {
                        validate: value => {
                          if (!value) return true;
                          if (!validateCPF(value)) return 'CPF inválido';
                          const proponenteCpf = watch('proponente.cpf');
                          if (
                            proponenteCpf &&
                            value.replace(/\D/g, '') ===
                              proponenteCpf.replace(/\D/g, '')
                          ) {
                            return 'CPF do proprietário não pode ser igual ao CPF do proponente';
                          }
                          return true;
                        },
                      })}
                      placeholder='000.000.000-00'
                      maxLength={14}
                      onChange={e => {
                        handleCPFChange(e.target.value, 'proprietario.cpf');
                        trigger('proponente.cpf');
                      }}
                      $hasError={!!errors.proprietario?.cpf}
                    />
                    {errors.proprietario?.cpf && (
                      <ErrorMessage>
                        {errors.proprietario.cpf.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>RG</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.rg', {
                        validate: value =>
                          !value ||
                          validateRG(value) ||
                          'RG inválido (mínimo 4 dígitos)',
                      })}
                      placeholder='00.000.000-0'
                      maxLength={13}
                      onChange={e => {
                        const masked = maskRG(e.target.value);
                        setValue('proprietario.rg', masked);
                      }}
                      $hasError={!!errors.proprietario?.rg}
                    />
                    {errors.proprietario?.rg && (
                      <ErrorMessage>
                        {errors.proprietario.rg.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormInput
                      type='date'
                      {...register('proprietario.dataNascimento', {
                        validate: value => {
                          if (!value) return true;
                          if (!validateAge(value))
                            return 'Deve ter mais de 18 anos';
                          const birthDate = new Date(value);
                          const today = new Date();
                          if (birthDate > today)
                            return 'Data de nascimento não pode ser no futuro';
                          return true;
                        },
                      })}
                      max={new Date().toISOString().split('T')[0]}
                      $hasError={!!errors.proprietario?.dataNascimento}
                    />
                    {errors.proprietario?.dataNascimento ? (
                      <ErrorMessage>
                        {errors.proprietario.dataNascimento.message}
                      </ErrorMessage>
                    ) : (
                      <HelperText>Idade mínima: 18 anos</HelperText>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Nacionalidade</FormLabel>
                    <FormSelect
                      {...register('proprietario.nacionalidade')}
                      $hasError={!!errors.proprietario?.nacionalidade}
                    >
                      {NACIONALIDADES.map(nac => (
                        <option key={nac} value={nac}>
                          {nac}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.proprietario?.nacionalidade && (
                      <ErrorMessage>
                        {errors.proprietario.nacionalidade.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Estado Civil</FormLabel>
                    <FormSelect
                      {...register('proprietario.estadoCivil')}
                      $hasError={!!errors.proprietario?.estadoCivil}
                    >
                      <option value=''>Selecione...</option>
                      {ESTADOS_CIVIS.map(ec => (
                        <option key={ec} value={ec}>
                          {ec}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.proprietario?.estadoCivil && (
                      <ErrorMessage>
                        {errors.proprietario.estadoCivil.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  {proprietarioEstadoCivil &&
                    (proprietarioEstadoCivil === 'Casado' ||
                      proprietarioEstadoCivil === 'Casada' ||
                      proprietarioEstadoCivil === 'União Estável') && (
                      <FormGroup>
                        <FormLabel>Regime de Casamento</FormLabel>
                        <FormSelect
                          {...register('proprietario.regimeCasamento')}
                          $hasError={!!errors.proprietario?.regimeCasamento}
                        >
                          <option value=''>Selecione...</option>
                          {REGIMES_CASAMENTO.map(reg => (
                            <option key={reg} value={reg}>
                              {reg}
                            </option>
                          ))}
                        </FormSelect>
                        {errors.proprietario?.regimeCasamento && (
                          <ErrorMessage>
                            {errors.proprietario.regimeCasamento.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>
                    )}

                  <FormGroup>
                    <FormLabel>Profissão</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.profissao', {
                        maxLength: {
                          value: 100,
                          message:
                            'Profissão deve ter no máximo 100 caracteres',
                        },
                      })}
                      placeholder='Digite a profissão'
                      maxLength={100}
                    />
                    <HelperText>Campo opcional</HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormInput
                      type='email'
                      {...register('proprietario.email', {
                        validate: value =>
                          !value || validateEmail(value) || 'Email inválido',
                      })}
                      placeholder='exemplo@email.com'
                      $hasError={!!errors.proprietario?.email}
                    />
                    {errors.proprietario?.email && (
                      <ErrorMessage>
                        {errors.proprietario.email.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Telefone</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.telefone', {
                        validate: value => {
                          if (!value) return true;
                          const clean = value.replace(/\D/g, '');
                          if (clean.length < 10 || clean.length > 11) {
                            return 'Telefone deve ter 10 ou 11 dígitos (com DDD)';
                          }
                          return true;
                        },
                      })}
                      placeholder='(00) 00000-0000'
                      maxLength={15}
                      onChange={e => {
                        const masked = maskPhoneAuto(e.target.value);
                        setValue('proprietario.telefone', masked);
                      }}
                      $hasError={!!errors.proprietario?.telefone}
                    />
                    <HelperText>
                      Telefone fixo ou celular com DDD (captador pode preencher
                      depois)
                    </HelperText>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Residência Atual</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.residenciaAtual', {
                        minLength: {
                          value: 5,
                          message: 'Endereço deve ter no mínimo 5 caracteres',
                        },
                        maxLength: {
                          value: 200,
                          message: 'Endereço deve ter no máximo 200 caracteres',
                        },
                      })}
                      placeholder='Endereço completo'
                      maxLength={200}
                      $hasError={!!errors.proprietario?.residenciaAtual}
                    />
                    {errors.proprietario?.residenciaAtual && (
                      <ErrorMessage>
                        {errors.proprietario.residenciaAtual.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Bairro</FormLabel>
                    <FormInput
                      type='text'
                      {...register('proprietario.bairro')}
                      placeholder='Nome do bairro'
                      $hasError={!!errors.proprietario?.bairro}
                    />
                    {errors.proprietario?.bairro && (
                      <ErrorMessage>
                        {errors.proprietario.bairro.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>
                <HelperText style={{ marginTop: 8 }}>
                  Proprietário e cônjuge: nada obrigatório. O corretor pode
                  preencher só até dados do imóvel e corretores e liberar para
                  assinatura do comprador; o captador completa os dados do
                  vendedor depois e libera assinatura dos vendedores.
                </HelperText>
                </div>
              </SectionContent>
            </CollapsibleSection>

            {/* Bloco 6 - Proprietário Cônjuge */}
            <CollapsibleSection
              $isExpanded={expandedSections.proprietarioConjuge}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.proprietarioConjuge
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader
                onClick={() => toggleSection('proprietarioConjuge')}
              >
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdGroup />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>
                      Proprietário Cônjuge/Sócio
                    </StyledSectionTitle>
                    <SectionDescription>
                      Dados do cônjuge ou sócio do proprietário (opcional)
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.proprietarioConjuge}>
                  {expandedSections.proprietarioConjuge ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent
                $isExpanded={expandedSections.proprietarioConjuge}
              >
                {!podeEditarEtapa(2) && (
                  <InfoBox $type='info' style={{ marginBottom: '16px' }}>
                    <InfoBoxText>
                      Somente gestor pode editar esta etapa após a assinatura do proprietário.
                    </InfoBoxText>
                  </InfoBox>
                )}
                <div
                  style={{
                    pointerEvents: podeEditarEtapa(2) ? 'auto' : 'none',
                    opacity: podeEditarEtapa(2) ? 1 : 0.9,
                  }}
                >
                <FormGrid $columns={2}>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <CheckboxWrapper>
                      <CheckboxInput
                        type='checkbox'
                        {...register('possuiProprietarioConjuge')}
                        onChange={e => {
                          setValue(
                            'possuiProprietarioConjuge',
                            e.target.checked
                          );
                          if (!e.target.checked) {
                            setValue('proprietarioConjuge', undefined);
                          } else {
                            setValue('proprietarioConjuge', {
                              nome: '',
                              rg: '',
                              cpf: '',
                              email: '',
                              telefone: '',
                            });
                          }
                        }}
                      />
                      <CheckboxLabel>Possui cônjuge ou sócio</CheckboxLabel>
                    </CheckboxWrapper>
                  </FormGroup>

                  {possuiProprietarioConjuge && (
                    <>
                      <FormGroup>
                        <FormLabel>Nome Completo (cônjuge)</FormLabel>
                        <FormInput
                          type='text'
                          {...register('proprietarioConjuge.nome', {
                            validate: value =>
                              !value ||
                              validateName(value) ||
                              'Digite nome completo (mínimo 2 palavras)',
                            minLength: {
                              value: 3,
                              message: 'Nome deve ter no mínimo 3 caracteres',
                            },
                            maxLength: {
                              value: 150,
                              message: 'Nome deve ter no máximo 150 caracteres',
                            },
                          })}
                          placeholder='Digite o nome completo'
                          maxLength={150}
                          $hasError={!!errors.proprietarioConjuge?.nome}
                        />
                        {errors.proprietarioConjuge?.nome && (
                          <ErrorMessage>
                            {errors.proprietarioConjuge.nome.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>CPF (cônjuge)</FormLabel>
                        <FormInput
                          type='text'
                          {...register('proprietarioConjuge.cpf', {
                            validate: value => {
                              if (!value) return true;
                              if (!validateCPF(value)) return 'CPF inválido';
                              const proprietarioCpf = watch('proprietario.cpf');
                              if (
                                proprietarioCpf &&
                                value.replace(/\D/g, '') ===
                                  proprietarioCpf.replace(/\D/g, '')
                              ) {
                                return 'CPF do cônjuge não pode ser igual ao CPF do proprietário';
                              }
                              return true;
                            },
                          })}
                          placeholder='000.000.000-00'
                          maxLength={14}
                          onChange={e => {
                            handleCPFChange(
                              e.target.value,
                              'proprietarioConjuge.cpf'
                            );
                            trigger('proprietario.cpf');
                          }}
                          $hasError={!!errors.proprietarioConjuge?.cpf}
                        />
                        {errors.proprietarioConjuge?.cpf && (
                          <ErrorMessage>
                            {errors.proprietarioConjuge.cpf.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>RG (cônjuge)</FormLabel>
                        <FormInput
                          type='text'
                          {...register('proprietarioConjuge.rg', {
                            validate: value =>
                              !value ||
                              validateRG(value) ||
                              'RG inválido (mínimo 4 dígitos)',
                          })}
                          placeholder='00.000.000-0'
                          maxLength={13}
                          onChange={e => {
                            const masked = maskRG(e.target.value);
                            setValue('proprietarioConjuge.rg', masked);
                          }}
                          $hasError={!!errors.proprietarioConjuge?.rg}
                        />
                        {errors.proprietarioConjuge?.rg && (
                          <ErrorMessage>
                            {errors.proprietarioConjuge.rg.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Profissão</FormLabel>
                        <FormInput
                          type='text'
                          {...register('proprietarioConjuge.profissao', {
                            maxLength: {
                              value: 100,
                              message:
                                'Profissão deve ter no máximo 100 caracteres',
                            },
                          })}
                          placeholder='Digite a profissão'
                          maxLength={100}
                        />
                        <HelperText>Campo opcional</HelperText>
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Email (cônjuge)</FormLabel>
                        <FormInput
                          type='email'
                          {...register('proprietarioConjuge.email', {
                            validate: value =>
                              !value ||
                              validateEmail(value) ||
                              'Email inválido',
                          })}
                          placeholder='exemplo@email.com'
                          $hasError={!!errors.proprietarioConjuge?.email}
                        />
                        {errors.proprietarioConjuge?.email && (
                          <ErrorMessage>
                            {errors.proprietarioConjuge.email.message}
                          </ErrorMessage>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <FormLabel>Telefone (cônjuge)</FormLabel>
                        <FormInput
                          type='text'
                          {...register('proprietarioConjuge.telefone', {
                            validate: value => {
                              if (!value) return true;
                              const clean = value.replace(/\D/g, '');
                              if (clean.length < 10 || clean.length > 11) {
                                return 'Telefone deve ter 10 ou 11 dígitos (com DDD)';
                              }
                              return true;
                            },
                          })}
                          placeholder='(00) 00000-0000'
                          maxLength={15}
                          onChange={e => {
                            const masked = maskPhoneAuto(e.target.value);
                            setValue('proprietarioConjuge.telefone', masked);
                          }}
                          $hasError={!!errors.proprietarioConjuge?.telefone}
                        />
                        {errors.proprietarioConjuge?.telefone && (
                          <ErrorMessage>
                            {errors.proprietarioConjuge.telefone.message}
                          </ErrorMessage>
                        )}
                        <HelperText>
                          Telefone fixo ou celular com DDD
                        </HelperText>
                      </FormGroup>
                    </>
                  )}
                </FormGrid>
                </div>
              </SectionContent>
            </CollapsibleSection>

            </>
            )}

            {/* Etapa 3: Corretor e Captadores – vários gestores podem preencher até o envio final */}
            {etapaAtual >= 3 && (
            <>
            {/* Bloco 7 - Corretores */}
            <CollapsibleSection
              $isExpanded={expandedSections.corretores || false}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.corretores
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader onClick={() => toggleSection('corretores')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdPerson />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>Corretores de Venda</StyledSectionTitle>
                    <SectionDescription>
                      Até 3 corretores (opcional)
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.corretores || false}>
                  {expandedSections.corretores ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent
                $isExpanded={expandedSections.corretores || false}
              >
                <FormGrid $columns={1}>
                  <InfoBox $type='info' style={{ marginBottom: '24px' }}>
                    <InfoBoxText>
                      💡 Você pode adicionar até 3 corretores de venda.
                    </InfoBoxText>
                  </InfoBox>

                  {loadingCorretores && corretoresDisponiveis.length === 0 ? (
                    <HelperText
                      style={{ textAlign: 'center', padding: '20px' }}
                    >
                      Carregando lista de corretores...
                    </HelperText>
                  ) : corretoresDisponiveis.length === 0 ? (
                    <HelperText
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'var(--color-error)',
                      }}
                    >
                      ⚠️ Nenhum corretor disponível. Clique em "Adicionar
                      Corretor" para carregar a lista.
                    </HelperText>
                  ) : (
                    <>
                      {corretoresForm.map((corretor, index) => (
                        <div
                          key={index}
                          style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px',
                            background: 'var(--color-card-background)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '16px',
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: 600,
                              }}
                            >
                              Corretor {index + 1}
                            </h4>
                            {corretoresForm.length > 0 && (
                              <Button
                                type='button'
                                $variant='secondary'
                                onClick={() => {
                                  const updated = corretoresForm.filter(
                                    (_, i) => i !== index
                                  );
                                  setValue('corretores', updated, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                style={{
                                  padding: '8px 16px',
                                  fontSize: '0.875rem',
                                }}
                              >
                                <MdClose /> Remover
                              </Button>
                            )}
                          </div>
                          <FormGrid $columns={3}>
                            <FormGroup>
                              <FormLabel>
                                Corretor{' '}
                                <RequiredIndicator>*</RequiredIndicator>
                              </FormLabel>
                              <FormSelect
                                value={corretor?.id || ''}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const selectedId = e.target.value;
                                  console.log(
                                    '🔍 Corretor selecionado:',
                                    selectedId
                                  );

                                  if (!selectedId) {
                                    // Se selecionar "Selecione...", limpar o corretor
                                    const updated = [...corretoresForm];
                                    updated[index] = {
                                      id: '',
                                      nome: '',
                                      email: '',
                                    };
                                    setValue('corretores', updated, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                    return;
                                  }

                                  const selected = corretoresDisponiveis.find(
                                    c => c.id === selectedId
                                  );
                                  console.log(
                                    '🔍 Corretor encontrado:',
                                    selected
                                  );

                                  if (selected) {
                                    const updated = [...corretoresForm];
                                    updated[index] = {
                                      id: selected.id,
                                      nome: selected.nome,
                                      email: selected.email,
                                    };
                                    console.log(
                                      '✅ Atualizando corretores:',
                                      updated
                                    );
                                    setValue('corretores', updated, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                  } else {
                                    console.warn(
                                      '⚠️ Corretor não encontrado:',
                                      selectedId
                                    );
                                  }
                                }}
                                $hasError={false}
                              >
                                <option value=''>
                                  Selecione um corretor...
                                </option>
                                {corretoresDisponiveis.length > 0 ? (
                                  corretoresDisponiveis.map(c => (
                                    <option key={c.id} value={c.id}>
                                      {c.nome} - {c.email}
                                    </option>
                                  ))
                                ) : (
                                  <option value='' disabled>
                                    Nenhum corretor disponível
                                  </option>
                                )}
                              </FormSelect>
                            </FormGroup>
                            <FormGroup>
                              <FormLabel>Nome</FormLabel>
                              <FormInput
                                type='text'
                                value={corretor?.nome || ''}
                                readOnly
                                style={{
                                  background:
                                    'var(--color-background-secondary)',
                                }}
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormLabel>Email</FormLabel>
                              <FormInput
                                type='email'
                                value={corretor?.email || ''}
                                readOnly
                                style={{
                                  background:
                                    'var(--color-background-secondary)',
                                }}
                              />
                            </FormGroup>
                          </FormGrid>
                        </div>
                      ))}

                      {corretoresForm.length < 3 && (
                        <Button
                          type='button'
                          $variant='secondary'
                          onClick={() => {
                            if (corretoresDisponiveis.length === 0) {
                              carregarCorretores();
                              return;
                            }
                            if (corretoresForm.length < 3) {
                              setValue(
                                'corretores',
                                [
                                  ...corretoresForm,
                                  { id: '', nome: '', email: '' },
                                ],
                                { shouldValidate: true, shouldDirty: true }
                              );
                            }
                          }}
                          disabled={corretoresForm.length === 3}
                          style={{ width: '100%', marginTop: '16px' }}
                        >
                          <MdPerson /> Adicionar Corretor (
                          {corretoresForm.length}/3)
                        </Button>
                      )}
                    </>
                  )}
                </FormGrid>
              </SectionContent>
            </CollapsibleSection>

            {/* Bloco 8 - Captadores */}
            <CollapsibleSection
              $isExpanded={expandedSections.captadores || false}
              style={{
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                boxShadow: expandedSections.captadores
                  ? '0 8px 24px rgba(0, 0, 0, 0.08)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '24px',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
              }}
            >
              <SectionHeader onClick={() => toggleSection('captadores')}>
                <SectionHeaderLeft>
                  <SectionIcon>
                    <MdPerson />
                  </SectionIcon>
                  <SectionTitleWrapper>
                    <StyledSectionTitle>Captadores</StyledSectionTitle>
                    <SectionDescription>
                      Até 3 captadores (opcional)
                    </SectionDescription>
                  </SectionTitleWrapper>
                </SectionHeaderLeft>
                <ExpandIcon $isExpanded={expandedSections.captadores || false}>
                  {expandedSections.captadores ? (
                    <MdExpandLess />
                  ) : (
                    <MdExpandMore />
                  )}
                </ExpandIcon>
              </SectionHeader>
              <SectionContent
                $isExpanded={expandedSections.captadores || false}
              >
                <FormGrid $columns={1}>
                  <InfoBox $type='info' style={{ marginBottom: '24px' }}>
                    <InfoBoxText>
                      💡 Você pode adicionar até 3 captadores (gestores). Opcionalmente informe a porcentagem de cada um.
                    </InfoBoxText>
                  </InfoBox>

                  {loadingGestores && gestoresDisponiveis.length === 0 ? (
                    <HelperText
                      style={{ textAlign: 'center', padding: '20px' }}
                    >
                      Carregando lista de gestores...
                    </HelperText>
                  ) : gestoresDisponiveis.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <HelperText
                        style={{
                          color: 'var(--color-text-secondary)',
                          marginBottom: '16px',
                        }}
                      >
                        ⚠️ Nenhum gestor disponível. Clique no botão abaixo para
                        carregar a lista.
                      </HelperText>
                      <Button
                        type='button'
                        $variant='primary'
                        onClick={async () => {
                          await carregarGestores();
                          if (
                            gestoresDisponiveis.length > 0 &&
                            captadoresForm.length < 3
                          ) {
                            const updated = [
                              ...captadoresForm,
                              { id: '', nome: '', porcentagem: undefined },
                            ];
                            setValue('captadores', updated, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                        disabled={loadingGestores}
                        style={{ padding: '12px 24px' }}
                      >
                        {loadingGestores
                          ? 'Carregando...'
                          : 'Carregar Gestores e Adicionar Captador'}
                      </Button>
                    </div>
                  ) : (
                    <>
                      {captadoresForm.map((captador, index) => (
                        <div
                          key={index}
                          style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '16px',
                            background: 'var(--color-card-background)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '16px',
                            }}
                          >
                            <h4
                              style={{
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: 600,
                              }}
                            >
                              Captador {index + 1}
                            </h4>
                            {captadoresForm.length > 0 && (
                              <Button
                                type='button'
                                $variant='secondary'
                                onClick={() => {
                                  const updated = captadoresForm.filter(
                                    (_, i) => i !== index
                                  );
                                  setValue('captadores', updated, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                style={{
                                  padding: '8px 16px',
                                  fontSize: '0.875rem',
                                }}
                              >
                                <MdClose /> Remover
                              </Button>
                            )}
                          </div>
                          <FormGrid $columns={3}>
                            <FormGroup>
                              <FormLabel>
                                Gestor/Captador{' '}
                                <RequiredIndicator>*</RequiredIndicator>
                              </FormLabel>
                              <FormSelect
                                value={captador?.id || ''}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const selectedId = e.target.value;
                                  console.log(
                                    '🔍 Captador selecionado:',
                                    selectedId
                                  );

                                  if (!selectedId) {
                                    // Se selecionar "Selecione...", limpar o captador
                                    const updated = [...captadoresForm];
                                    updated[index] = { id: '', nome: '', porcentagem: undefined };
                                    setValue('captadores', updated, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                    return;
                                  }

                                  const selected = gestoresDisponiveis.find(
                                    g => g.id === selectedId
                                  );

                                  if (selected) {
                                    const updated = [...captadoresForm];
                                    updated[index] = {
                                      id: selected.id,
                                      nome: selected.nome,
                                      porcentagem: captador?.porcentagem,
                                    };
                                    setValue('captadores', updated, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    });
                                  } else {
                                    console.warn(
                                      '⚠️ Gestor não encontrado:',
                                      selectedId
                                    );
                                  }
                                }}
                                $hasError={false}
                              >
                                <option value=''>Selecione um gestor...</option>
                                {gestoresDisponiveis.length > 0 ? (
                                  gestoresDisponiveis.map(g => (
                                    <option key={g.id} value={g.id}>
                                      {g.nome}
                                    </option>
                                  ))
                                ) : (
                                  <option value='' disabled>
                                    Nenhum gestor disponível
                                  </option>
                                )}
                              </FormSelect>
                            </FormGroup>
                            <FormGroup>
                              <FormLabel>Nome</FormLabel>
                              <FormInput
                                type='text'
                                value={captador?.nome || ''}
                                readOnly
                                style={{
                                  background:
                                    'var(--color-background-secondary)',
                                }}
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormLabel>Porcentagem (%)</FormLabel>
                              <FormInput
                                type='number'
                                min={0}
                                max={100}
                                step={0.5}
                                placeholder='0-100'
                                value={
                                  captador?.porcentagem != null
                                    ? String(captador.porcentagem)
                                    : ''
                                }
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const raw = e.target.value;
                                  const num =
                                    raw === ''
                                      ? undefined
                                      : parseFloat(raw);
                                  const updated = [...captadoresForm];
                                  updated[index] = {
                                    ...updated[index],
                                    id: updated[index]?.id ?? '',
                                    nome: updated[index]?.nome ?? '',
                                    porcentagem:
                                      num !== undefined && !Number.isNaN(num)
                                        ? Math.min(100, Math.max(0, num))
                                        : undefined,
                                  };
                                  setValue('captadores', updated, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                              />
                            </FormGroup>
                          </FormGrid>
                        </div>
                      ))}

                      {captadoresForm.length < 3 && (
                        <Button
                          type='button'
                          $variant='secondary'
                          onClick={() => {
                            if (gestoresDisponiveis.length === 0) {
                              carregarGestores();
                              return;
                            }
                            if (captadoresForm.length < 3) {
                              setValue(
                                'captadores',
                                [...captadoresForm, { id: '', nome: '', porcentagem: undefined }],
                                { shouldValidate: true, shouldDirty: true }
                              );
                            }
                          }}
                          disabled={captadoresForm.length === 3}
                          style={{ width: '100%', marginTop: '16px' }}
                        >
                          <MdPerson /> Adicionar Captador (
                          {captadoresForm.length}/3)
                        </Button>
                      )}
                    </>
                  )}
                </FormGrid>
              </SectionContent>
            </CollapsibleSection>

            </>
            )}

            {/* Footer com botões */}
            <FormFooter
              style={{
                background: 'var(--color-card-background)',
                borderRadius: '20px',
                padding: '32px',
                marginTop: '40px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <FooterLeft
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
              >
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={handleClearDraft}
                  style={{
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MdClose /> Limpar Formulário
                </Button>
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={handleShareProposta}
                  style={{
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MdShare /> Compartilhar
                </Button>
              </FooterLeft>
              <FooterRight
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px',
                }}
              >
                {etapaAtual < 3 && (
                  <InfoBoxText
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-secondary)',
                      margin: 0,
                    }}
                  >
                    Avance até a Etapa 3 para preencher corretor/captadores e
                    enviar a proposta.
                  </InfoBoxText>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {userCpf && userTipo && (
                      <Button
                        type='button'
                        $variant='secondary'
                        disabled={savingDraftServer || isSubmitting}
                        onClick={salvarRascunhoNoServidor}
                        style={{
                          borderRadius: '12px',
                          padding: '14px 24px',
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        title="Guarda o preenchimento no servidor para continuar depois ou não perder dados"
                      >
                        {savingDraftServer ? (
                          <>
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid currentColor',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                                flexShrink: 0,
                              }}
                            />
                            Salvando...
                          </>
                        ) : (
                          <><MdSave /> Salvar rascunho no servidor</>
                        )}
                      </Button>
                    )}
                    <Button
                      type='submit'
                      $variant='primary'
                      disabled={isSubmitting}
                      style={{
                        borderRadius: '12px',
                        padding: '14px 32px',
                        fontWeight: 700,
                        fontSize: '1.0625rem',
                        boxShadow: isSubmitting
                          ? 'none'
                          : `0 4px 16px ${themeColors.primary}40`,
                        transition: 'all 0.2s ease',
                        transform: isSubmitting ? 'scale(0.98)' : 'scale(1)',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid white',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite',
                            }}
                          />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <MdCheckCircle /> Enviar Proposta
                        </>
                      )}
                    </Button>
                  </div>
                  {userCpf && userTipo && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', maxWidth: '320px', textAlign: 'right' }}>
                      Guarda o preenchimento para continuar depois ou não perder dados.
                    </span>
                  )}
                </div>
              </FooterRight>
            </FormFooter>
          </form>
        </PageContentWrap>

        {/* Modal de Confirmação - Estilo moderno */}
        <ModernModalOverlay
          $isOpen={showConfirmModal}
          onClick={handleCancelSubmit}
        >
          <ModernModalContainer
            $isOpen={showConfirmModal}
            onClick={e => e.stopPropagation()}
          >
            <ModernModalHeader>
              <ModernModalHeaderContent>
                <div>
                  <ModernModalTitle>
                    <MdWarning size={28} style={{ flexShrink: 0 }} /> Confirmar
                    Envio da Proposta
                  </ModernModalTitle>
                  <ModernModalSubtitle>
                    Revise os dados da Etapa {etapaAtual} abaixo. Após confirmar, um
                    PDF será gerado e enviado por e-mail automaticamente.
                  </ModernModalSubtitle>
                </div>
                <ModernModalCloseButton
                  type='button'
                  onClick={handleCancelSubmit}
                  disabled={isSubmitting}
                  aria-label='Fechar'
                >
                  <MdClose size={22} />
                </ModernModalCloseButton>
              </ModernModalHeaderContent>
            </ModernModalHeader>
            <ModernModalContent>
              <ModernConfirmWarning>
                <MdWarning
                  size={24}
                  style={{ color: 'var(--color-primary)', flexShrink: 0 }}
                />
                <ModernConfirmWarningText>
                  Por favor, confira todas as informações antes de enviar. Após
                  o envio, a proposta ficará disponível e o PDF será enviado por
                  e-mail aos envolvidos.
                </ModernConfirmWarningText>
              </ModernConfirmWarning>

              {pendingPayload && (
                <ModernSummaryGrid>
                  {/* Etapa 1: Dados da Proposta + Proponente (+ Cônjuge) */}
                  {etapaAtual === 1 && (
                    <>
                  <ModernSummaryCard>
                    <ModernSummaryCardTitle>
                      <MdCalendarToday size={20} /> Dados da Proposta
                    </ModernSummaryCardTitle>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Data da Proposta</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {new Date(
                          pendingPayload.proposta.dataProposta
                        ).toLocaleDateString('pt-BR')}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Preço Proposto</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {formatCurrencyValue(
                          pendingPayload.proposta.precoProposto
                        )}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    {pendingPayload.proposta.valorSinal !== undefined &&
                      pendingPayload.proposta.valorSinal !== null && (
                        <ModernSummaryRow>
                          <ModernSummaryLabel>Valor do Sinal</ModernSummaryLabel>
                          <ModernSummaryValue>
                            {formatCurrencyValue(
                              pendingPayload.proposta.valorSinal
                            )}
                          </ModernSummaryValue>
                        </ModernSummaryRow>
                      )}
                    {pendingPayload.proposta.prazoPagamentoSinal != null && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>
                          Prazo pag. sinal (dias)
                        </ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proposta.prazoPagamentoSinal}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proposta.prazoValidade != null && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Prazo validade (dias)</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proposta.prazoValidade}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proposta.condicoesPagamento && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Condições de pagamento</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proposta.condicoesPagamento}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {(pendingPayload.proposta.porcentagemComissao ?? 0) > 0 && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Comissão (%)</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proposta.porcentagemComissao}%
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {(pendingPayload.proposta.prazoEntrega ?? 0) > 0 && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Prazo entrega (dias)</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proposta.prazoEntrega}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {(pendingPayload.proposta.multaMensal ?? 0) > 0 && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Multa mensal</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {formatCurrencyValue(
                            pendingPayload.proposta.multaMensal!
                          )}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Unidade de Venda</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {pendingPayload.proposta.unidadeVenda}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Unidade de Captação</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {pendingPayload.proposta.unidadeCaptacao}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                  </ModernSummaryCard>

                  <ModernSummaryCard>
                    <ModernSummaryCardTitle>
                      <MdPerson size={20} /> Proponente
                    </ModernSummaryCardTitle>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Nome</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {pendingPayload.proponente.nome}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>CPF</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {maskCPF(pendingPayload.proponente.cpf)}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    {pendingPayload.proponente.email && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>E-mail</ModernSummaryLabel>
                        <ModernSummaryValue>
                          <MdEmail size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          {pendingPayload.proponente.email}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proponente.telefone && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Telefone</ModernSummaryLabel>
                        <ModernSummaryValue>
                          <MdPhone size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          {maskPhoneAuto(pendingPayload.proponente.telefone)}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proponente.dataNascimento && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Data de nascimento</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {new Date(
                            pendingPayload.proponente.dataNascimento
                          ).toLocaleDateString('pt-BR')}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proponente.profissao && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Profissão</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proponente.profissao}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proponente.residenciaAtual && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Residência atual</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proponente.residenciaAtual}
                          {pendingPayload.proponente.bairro &&
                            `, ${pendingPayload.proponente.bairro}`}
                          {pendingPayload.proponente.cidade &&
                            ` — ${pendingPayload.proponente.cidade}/${pendingPayload.proponente.estado}`}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                  </ModernSummaryCard>

                  {pendingPayload.proponenteConjuge && (
                    <ModernSummaryCard>
                      <ModernSummaryCardTitle>
                        <MdPeople size={20} /> Cônjuge do Proponente
                      </ModernSummaryCardTitle>
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Nome</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proponenteConjuge.nome}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                      <ModernSummaryRow>
                        <ModernSummaryLabel>CPF</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {maskCPF(pendingPayload.proponenteConjuge.cpf)}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                      {pendingPayload.proponenteConjuge.email && (
                        <ModernSummaryRow>
                          <ModernSummaryLabel>E-mail</ModernSummaryLabel>
                          <ModernSummaryValue>
                            {pendingPayload.proponenteConjuge.email}
                          </ModernSummaryValue>
                        </ModernSummaryRow>
                      )}
                      {pendingPayload.proponenteConjuge.telefone && (
                        <ModernSummaryRow>
                          <ModernSummaryLabel>Telefone</ModernSummaryLabel>
                          <ModernSummaryValue>
                            {maskPhoneAuto(
                              pendingPayload.proponenteConjuge.telefone
                            )}
                          </ModernSummaryValue>
                        </ModernSummaryRow>
                      )}
                    </ModernSummaryCard>
                  )}
                    </>
                  )}

                  {/* Etapa 2: Imóvel + Proprietário (+ Cônjuge) */}
                  {etapaAtual === 2 && (
                    <>
                  <ModernSummaryCard>
                    <ModernSummaryCardTitle>
                      <MdHome size={20} /> Imóvel
                    </ModernSummaryCardTitle>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Endereço</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {pendingPayload.imovel.endereco}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    {(pendingPayload.imovel.bairro ||
                      pendingPayload.imovel.cidade) && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Bairro / Cidade / UF</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {[
                            pendingPayload.imovel.bairro,
                            pendingPayload.imovel.cidade,
                            pendingPayload.imovel.estado,
                          ]
                            .filter(Boolean)
                            .join(' — ')}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.imovel.matricula && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Matrícula</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.imovel.matricula}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.imovel.cartorio && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Cartório</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.imovel.cartorio}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.imovel.cadastroPrefeitura && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Cadastro prefeitura</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.imovel.cadastroPrefeitura}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                  </ModernSummaryCard>

                  <ModernSummaryCard>
                    <ModernSummaryCardTitle>
                      <MdPerson size={20} /> Proprietário
                    </ModernSummaryCardTitle>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>Nome</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {pendingPayload.proprietario.nome}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    <ModernSummaryRow>
                      <ModernSummaryLabel>CPF</ModernSummaryLabel>
                      <ModernSummaryValue>
                        {maskCPF(pendingPayload.proprietario.cpf)}
                      </ModernSummaryValue>
                    </ModernSummaryRow>
                    {pendingPayload.proprietario.email && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>E-mail</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proprietario.email}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                    {pendingPayload.proprietario.telefone && (
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Telefone</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {maskPhoneAuto(
                            pendingPayload.proprietario.telefone
                          )}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                    )}
                  </ModernSummaryCard>

                  {pendingPayload.proprietarioConjuge && (
                    <ModernSummaryCard>
                      <ModernSummaryCardTitle>
                        <MdPeople size={20} /> Cônjuge do Proprietário
                      </ModernSummaryCardTitle>
                      <ModernSummaryRow>
                        <ModernSummaryLabel>Nome</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {pendingPayload.proprietarioConjuge.nome}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                      <ModernSummaryRow>
                        <ModernSummaryLabel>CPF</ModernSummaryLabel>
                        <ModernSummaryValue>
                          {maskCPF(pendingPayload.proprietarioConjuge.cpf)}
                        </ModernSummaryValue>
                      </ModernSummaryRow>
                      {pendingPayload.proprietarioConjuge.email && (
                        <ModernSummaryRow>
                          <ModernSummaryLabel>E-mail</ModernSummaryLabel>
                          <ModernSummaryValue>
                            {pendingPayload.proprietarioConjuge.email}
                          </ModernSummaryValue>
                        </ModernSummaryRow>
                      )}
                      {pendingPayload.proprietarioConjuge.telefone && (
                        <ModernSummaryRow>
                          <ModernSummaryLabel>Telefone</ModernSummaryLabel>
                          <ModernSummaryValue>
                            {maskPhoneAuto(
                              pendingPayload.proprietarioConjuge.telefone
                            )}
                          </ModernSummaryValue>
                        </ModernSummaryRow>
                      )}
                    </ModernSummaryCard>
                  )}
                    </>
                  )}

                  {/* Etapa 3: Corretores + Captadores */}
                  {etapaAtual === 3 && (
                    <>
                  {pendingPayload.corretores &&
                    pendingPayload.corretores.length > 0 && (
                      <ModernSummaryCard>
                        <ModernSummaryCardTitle>
                          <MdBusiness size={20} /> Corretores
                        </ModernSummaryCardTitle>
                        {pendingPayload.corretores.map((c, i) => (
                          <ModernSummaryRow key={i}>
                            <ModernSummaryLabel>
                              {pendingPayload.corretores!.length > 1
                                ? `Corretor ${i + 1}`
                                : 'Corretor'}
                            </ModernSummaryLabel>
                            <ModernSummaryValue>
                              {c.nome}
                              {c.email ? ` — ${c.email}` : ''}
                            </ModernSummaryValue>
                          </ModernSummaryRow>
                        ))}
                      </ModernSummaryCard>
                    )}

                  {pendingPayload.captadores &&
                    pendingPayload.captadores.length > 0 && (
                      <ModernSummaryCard>
                        <ModernSummaryCardTitle>
                          <MdPeople size={20} /> Captadores
                        </ModernSummaryCardTitle>
                        {pendingPayload.captadores.map((cap, i) => (
                          <ModernSummaryRow key={i}>
                            <ModernSummaryLabel>
                              {pendingPayload.captadores!.length > 1
                                ? `Captador ${i + 1}`
                                : 'Captador'}
                            </ModernSummaryLabel>
                            <ModernSummaryValue>
                              {cap.nome}
                              {cap.porcentagem != null
                                ? ` — ${cap.porcentagem}%`
                                : ''}
                            </ModernSummaryValue>
                          </ModernSummaryRow>
                        ))}
                      </ModernSummaryCard>
                    )}
                    </>
                  )}
                </ModernSummaryGrid>
              )}
            </ModernModalContent>
            <ModernModalFooter>
              <ModernButton
                $variant='secondary'
                type='button'
                onClick={handleCancelSubmit}
                disabled={isSubmitting}
              >
                Cancelar
              </ModernButton>
              <ModernButton
                $variant='primary'
                type='button'
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <MdCheckCircle size={20} /> Confirmar e Enviar
                  </>
                )}
              </ModernButton>
            </ModernModalFooter>
          </ModernModalContainer>
        </ModernModalOverlay>

        {/* Modal de Compartilhamento */}
        <ModalOverlay
          $isOpen={showShareModal}
          onClick={() => setShowShareModal(false)}
        >
          <ModalContainer onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <MdShare /> Compartilhar Proposta
              </ModalTitle>
              <ModalCloseButton onClick={() => setShowShareModal(false)}>
                <MdClose />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <InfoBox $type='info'>
                <InfoBoxText>
                  Compartilhe este link para que{' '}
                  <strong>
                    corretores, captadores ou gestores vinculados à proposta
                  </strong>{' '}
                  possam continuar o preenchimento. O link só permite edição
                  enquanto a proposta estiver em <strong>rascunho</strong>.
                  Somente quem está vinculado à proposta (corretor, captador ou
                  gestor) pode acessar o link.
                </InfoBoxText>
              </InfoBox>

              <FormGroup style={{ marginTop: '24px' }}>
                <FormLabel>Link Compartilhável</FormLabel>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <FormInput
                    type='text'
                    value={shareLink}
                    readOnly
                    style={{
                      flex: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    }}
                  />
                  <Button
                    type='button'
                    $variant='primary'
                    onClick={handleCopyLink}
                    style={{ minWidth: 'auto', padding: '12px 16px' }}
                  >
                    <MdContentCopy size={20} />
                  </Button>
                </div>
                <HelperText>Clique no botão para copiar o link</HelperText>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                $variant='secondary'
                onClick={() => setShowShareModal(false)}
              >
                Fechar
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      </FichaVendaContainer>
    </>
  );
};

export default FichaPropostaPage;
