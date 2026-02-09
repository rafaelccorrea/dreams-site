import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  MdExpandMore,
  MdExpandLess,
  MdAdd,
  MdDelete,
  MdSave,
  MdCalendarToday,
  MdAttachMoney,
  MdPerson,
  MdHome,
  MdGroup,
  MdWork,
  MdWarning,
  MdCheckCircle,
  MdPeople,
  MdError,
  MdSearch,
  MdClose,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdShare,
  MdContentCopy,
  MdCloudUpload,
  MdPictureAsPdf,
} from 'react-icons/md';
import {
  FichaVendaContainer,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
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
  ErrorMessage,
  HelperText,
  CheckboxWrapper,
  CheckboxInput,
  CheckboxLabel,
  Button,
  ComissaoItem,
  ComissaoItemHeader,
  ComissaoItemTitle,
  RemoveButton,
  AddButton,
  FormFooter,
  FooterLeft,
  FooterRight,
  FooterSecondaryGroup,
  FooterPrimaryGroup,
  FooterHighlightButton,
  PercentageBadge,
  CalculatedLabel,
  CalculatedAmount,
  Divider,
  InfoBox,
  InfoBoxText,
  IndicativeCardsGrid,
  CepSearchButton,
  AutocompleteWrapper,
  HistoricoButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalSummary,
  SummarySection,
  SummaryTitle,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  ModalWarning,
  ModalWarningText,
  ModalFooter,
  ModalButton,
  BlockingOverlay,
  BlockingModalCard,
  BlockingModalIcon,
  BlockingModalTitle,
  BlockingModalMessage,
} from '../styles/pages/FichaVendaPageStyles';
import {
  maskCPF,
  maskCPFouCNPJ,
  maskRG,
  maskCelPhone,
  maskCEP,
  validateCPF,
  validateEmail,
  formatCurrency,
  getNumericValue,
  formatCurrencyValue,
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
  criarFichaVenda,
  buscarFichaVendaPorId,
  atualizarFichaVendaPorId,
  listarFichasVenda,
  baixarPdfFichaVenda,
  reenviarEmailFichaVenda,
} from '../services/fichaVendaApi';
import type {
  CreateSaleFormDto,
  StatusFichaProposta,
} from '../services/fichaVendaApi';
import {
  getPublicProperties,
  propriedadeParaImovelFicha,
} from '../services/publicPropertyApi';
import type { Property } from '../types/property';
import {
  buscarCorretores,
  buscarGestores,
  importPorcentagens,
  identificarUsuarioPorCpf,
  type TempUniaoUser,
} from '../services/tempUniaoUsersApi';
import {
  listarPropostas,
  buscarPropostaPorId,
  type PropostaListItem,
} from '../services/fichaPropostaApi';
import SelectCorretorModal from '../components/modals/SelectCorretorModal';

// Lista de profissões comuns
const PROFISSOES_COMUNS = [
  'Advogado',
  'Arquiteto',
  'Arquiteta',
  'Corretor',
  'Corretora',
  'Dentista',
  'Engenheiro',
  'Engenheira',
  'Médico',
  'Médica',
  'Veterinário',
  'Veterinária',
  'Contador',
  'Contadora',
  'Administrador',
  'Administradora',
  'Empresário',
  'Empresária',
  'Professor',
  'Professora',
  'Enfermeiro',
  'Enfermeira',
  'Psicólogo',
  'Psicóloga',
  'Farmacêutico',
  'Farmacêutica',
  'Vendedor',
  'Vendedora',
  'Gerente',
  'Diretor',
  'Diretora',
  'Analista',
  'Assistente',
  'Técnico',
  'Técnica',
  'Designer',
  'Programador',
  'Programadora',
  'Consultor',
  'Consultora',
  'Autônomo',
  'Autônoma',
  'Aposentado',
  'Aposentada',
  'Estudante',
  'Outro',
];

// Tipos
interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface Pessoa {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  email: string;
  celular: string;
  profissao: string;
  endereco: Endereco;
}

interface CaptadorItem {
  id: string;
  nome?: string;
  porcentagem?: number;
}

interface ComissaoCorretor {
  id: string;
  /** UUID do corretor (temp-uniao-users) enviado à API */
  corretorId?: string;
  corretor: string;
  porcentagem: number;
  /** @deprecated Preferir captadores (até 3 por corretor). */
  captador?: string;
  /** Até 3 captadores por corretor, com porcentagem opcional */
  captadores?: CaptadorItem[];
}

interface ComissaoGerencia {
  nivel: number;
  porcentagem: number;
  nome?: string;
}

// Lista de unidades
const UNIDADES = ['União Esmeralda', 'União Rio Branco'];

interface FichaVendaForm {
  // Bloco 1 - Metadados
  dataVenda: string;
  secretariaPresentes: string;
  midiaOrigem: string;
  gerente?: string;
  unidadeVenda: string;

  // Bloco 2 - Comprador
  comprador: Pessoa;

  // Bloco 3 - Comprador Cônjuge/Sócio
  possuiCompradorConjuge: boolean;
  compradorConjuge?: Pessoa;

  // Bloco 4 - Vendedor
  vendedor: Pessoa;

  // Bloco 5 - Vendedor Cônjuge/Sócio
  possuiVendedorConjuge: boolean;
  vendedorConjuge?: Pessoa;

  // Bloco 6 - Imóvel
  imovel: {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    codigo: string;
  };

  // Bloco 7 - Financeiro
  valorVenda: string;
  comissaoTotal: string;
  valorMeta: string; // Calculado automaticamente (5%)

  // Bloco 8 - Distribuição de Comissão
  comissoesCorretores: ComissaoCorretor[];
  comissoesGerencias: ComissaoGerencia[];

  // Bloco 9 - Colaboradores
  colaboradorPreAtendimento: string;
  colaboradorCentralCaptacao: string;
}

interface FichaEnviada {
  id: string;
  numero: string;
  dataVenda: string;
  valorVenda: number;
  createdAt: string;
  dados: any;
  status?: StatusFichaProposta;
}

/** Normaliza nome da unidade da API (sem acento) para o valor do select no front (com acento) */
function normalizeUnidadeFromApi(unidade: string | undefined): string {
  if (!unidade) return 'União Esmeralda';
  const u = unidade.trim();
  if (u === 'Uniao Esmeralda' || u === 'União Esmeralda')
    return 'União Esmeralda';
  if (u === 'Uniao Rio Branco' || u === 'União Rio Branco')
    return 'União Rio Branco';
  return u;
}

/** Converte pessoa vinda da API para o formato do formulário (máscaras em CPF/celular e defaults para strings) */
function apiPessoaToFormPessoa(
  p:
    | {
        nome?: string | null;
        cpf?: string | null;
        rg?: string | null;
        dataNascimento?: string | null;
        email?: string | null;
        celular?: string | null;
        profissao?: string | null;
        endereco?: {
          cep?: string | null;
          rua?: string | null;
          numero?: string | null;
          complemento?: string | null;
          bairro?: string | null;
          cidade?: string | null;
          estado?: string | null;
        } | null;
      }
    | null
    | undefined
): Pessoa {
  if (!p) {
    return {
      nome: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      email: '',
      celular: '',
      profissao: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
    };
  }
  const rawCpf = String(p.cpf ?? '').replace(/\D/g, '');
  const rawCel = String(p.celular ?? '').replace(/\D/g, '');
  const e = p.endereco;
  return {
    nome: p.nome ?? '',
    cpf: rawCpf ? maskCPF(rawCpf) : '',
    rg: p.rg ?? '',
    dataNascimento: p.dataNascimento ?? '',
    email: p.email ?? '',
    celular: rawCel ? maskCelPhone(rawCel) : '',
    profissao: p.profissao ?? '',
    endereco: {
      cep: e?.cep ?? '',
      rua: e?.rua ?? '',
      numero: e?.numero ?? '',
      complemento: e?.complemento ?? '',
      bairro: e?.bairro ?? '',
      cidade: e?.cidade ?? '',
      estado: e?.estado ?? '',
    },
  };
}

/** Mapeia dados da API (GET /ficha-venda/:id) para o estado do formulário */
function apiDataToFormData(apiData: {
  venda: CreateSaleFormDto['venda'];
  comprador: CreateSaleFormDto['comprador'];
  compradorConjuge?: CreateSaleFormDto['compradorConjuge'];
  vendedor: CreateSaleFormDto['vendedor'];
  vendedorConjuge?: CreateSaleFormDto['vendedorConjuge'];
  imovel: CreateSaleFormDto['imovel'];
  financeiro: CreateSaleFormDto['financeiro'];
  comissoes: CreateSaleFormDto['comissoes'];
  colaboradores?: CreateSaleFormDto['colaboradores'];
}): Partial<FichaVendaForm> {
  return {
    dataVenda: apiData.venda.dataVenda ?? '',
    secretariaPresentes: apiData.venda.secretariaPresentes ?? '',
    midiaOrigem: apiData.venda.midiaOrigem ?? '',
    gerente: apiData.venda.gerente ?? '',
    unidadeVenda: normalizeUnidadeFromApi(apiData.venda.unidadeVenda),
    comprador: apiPessoaToFormPessoa(apiData.comprador),
    possuiCompradorConjuge: !!apiData.compradorConjuge,
    compradorConjuge: apiData.compradorConjuge
      ? apiPessoaToFormPessoa(apiData.compradorConjuge)
      : undefined,
    vendedor: apiPessoaToFormPessoa(apiData.vendedor),
    possuiVendedorConjuge: !!apiData.vendedorConjuge,
    vendedorConjuge: apiData.vendedorConjuge
      ? apiPessoaToFormPessoa(apiData.vendedorConjuge)
      : undefined,
    imovel: {
      cep: apiData.imovel.cep ?? '',
      endereco: apiData.imovel.endereco ?? '',
      numero: apiData.imovel.numero ?? '',
      complemento: apiData.imovel.complemento ?? '',
      bairro: apiData.imovel.bairro ?? '',
      cidade: apiData.imovel.cidade ?? '',
      estado: apiData.imovel.estado ?? '',
      codigo: apiData.imovel.codigo ?? '',
    },
    valorVenda: formatCurrencyValue(apiData.financeiro.valorVenda),
    comissaoTotal: formatCurrencyValue(apiData.financeiro.comissaoTotal),
    valorMeta: formatCurrencyValue(apiData.financeiro.valorMeta),
    comissoesCorretores: apiData.comissoes.corretores.map((c, i) => {
      const captadores =
        (c as any).captadores?.length > 0
          ? (c as any).captadores
          : (c as any).captador
            ? [{ id: (c as any).captador, nome: undefined, porcentagem: undefined }]
            : [];
      return {
        id: `row_${c.id}_${i}`,
        corretorId: c.id,
        corretor: '',
        porcentagem: c.porcentagem,
        captador: c.captador ?? undefined,
        captadores,
      };
    }),
    comissoesGerencias: apiData.comissoes.gerencias ?? [],
    colaboradorPreAtendimento: apiData.colaboradores?.preAtendimento ?? '',
    colaboradorCentralCaptacao: apiData.colaboradores?.centralCaptacao ?? '',
  };
}

/** Mapeia dados de uma proposta (ficha-proposta) para pré-preenchimento da ficha de venda. Proponente → Comprador, Proprietário → Vendedor. */
function mapPropostaDataToFichaVendaForm(
  propostaData: any
): Partial<FichaVendaForm> {
  // Aceita dados no nível raiz (GET /api/ficha-proposta/:id) ou aninhados em proposta (formato antigo)
  const p = propostaData?.proponente;
  const pc = propostaData?.proponenteConjuge;
  const prop = propostaData?.proprietario;
  const propc = propostaData?.proprietarioConjuge;
  const im = propostaData?.imovel;
  const proposta = propostaData?.proposta;

  const pessoaFromProponente = (pro: any): Pessoa => ({
    nome: pro?.nome ?? '',
    rg: pro?.rg ?? '',
    cpf: pro?.cpf ? maskCPF(String(pro.cpf).replace(/\D/g, '')) : '',
    dataNascimento: pro?.dataNascimento ?? '',
    email: pro?.email ?? '',
    celular: pro?.telefone
      ? maskCelPhone(String(pro.telefone).replace(/\D/g, ''))
      : (pro?.celular ?? ''),
    profissao: pro?.profissao ?? '',
    endereco: {
      cep: pro?.cep ?? '',
      rua: pro?.residenciaAtual ?? pro?.rua ?? '',
      numero: '',
      complemento: '',
      bairro: pro?.bairro ?? '',
      cidade: pro?.cidade ?? '',
      estado: pro?.estado ?? '',
    },
  });

  // Normalizar unidadeVenda (remover acentos se necessário)
  const normalizeUnidade = (nome?: string): string => {
    if (!nome) return 'União Esmeralda';
    return nome.replace(/ã/g, 'a').replace(/õ/g, 'o');
  };

  return {
    dataVenda:
      proposta?.dataProposta ??
      propostaData?.dataProposta ??
      new Date().toISOString().split('T')[0],
    unidadeVenda: normalizeUnidade(
      proposta?.unidadeVenda ?? propostaData?.unidadeVenda
    ),
    comprador: p ? pessoaFromProponente(p) : undefined,
    possuiCompradorConjuge: !!pc,
    compradorConjuge: pc ? pessoaFromProponente(pc) : undefined,
    vendedor: prop ? pessoaFromProponente(prop) : undefined,
    possuiVendedorConjuge: !!propc,
    vendedorConjuge: propc ? pessoaFromProponente(propc) : undefined,
    imovel: im
      ? {
          cep: im?.cep ?? '',
          endereco: im?.endereco ?? '',
          numero: '',
          complemento: '',
          bairro: im?.bairro ?? '',
          cidade: im?.cidade ?? '',
          estado: im?.estado ?? '',
          codigo: im?.matricula ?? im?.codigo ?? '',
        }
      : undefined,
    valorVenda:
      proposta?.precoProposto != null
        ? formatCurrencyValue(proposta.precoProposto)
        : propostaData?.precoProposto != null
          ? formatCurrencyValue(propostaData.precoProposto)
          : '',
  };
}

// Mesmas chaves da Ficha de Proposta para sessão única (login em uma página vale na outra)
const STORAGE_USER_CPF = 'ficha_proposta_user_cpf';
const STORAGE_USER_TIPO = 'ficha_proposta_user_tipo';
const STORAGE_USER_DATA = 'ficha_proposta_user_data';
const STORAGE_SESSION_EXPIRES_AT = 'ficha_proposta_session_expires_at';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

type FichaSession = {
  cpf: string;
  tipo: 'gestor' | 'corretor';
  user: TempUniaoUser;
};

function getValidFichaSession(): FichaSession | null {
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

const FichaVendaPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: fichaIdFromUrl } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado para controlar largura da tela
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [hasLoadedSharedData, setHasLoadedSharedData] = useState(false);
  const [loadingFichaById, setLoadingFichaById] = useState(false);
  const [fichaNotFound, setFichaNotFound] = useState(false);
  const [, setHasLoadedFichaById] = useState(false);
  /** Número da ficha carregada (ex: FV-2024-001) para nome do PDF */
  const [loadedFichaFormNumber, setLoadedFichaFormNumber] = useState<
    string | null
  >(null);
  /** Status da ficha carregada (rascunho | disponivel). Quando 'disponivel', formulário fica somente leitura. */
  const [loadedFichaStatus, setLoadedFichaStatus] =
    useState<StatusFichaProposta | null>(null);
  /** Ao true, o próximo envio envia status: 'disponivel' (botão "Finalizar ficha"). */
  const [finalizarAoSalvar, setFinalizarAoSalvar] = useState(false);
  /** 403 ao carregar ficha por ID: usuário não é o gestor vinculado à ficha */
  const [fichaAccessDenied, setFichaAccessDenied] = useState(false);
  /** Salvando progresso antes de abrir o modal de compartilhar (ou criando ficha para gerar link) */
  const [isSavingForShare, setIsSavingForShare] = useState(false);

  const isFichaFinalizada = loadedFichaStatus === 'disponivel';

  // Login por CPF (sessão compartilhada com Ficha de Proposta)
  const [session, setSession] = useState<FichaSession | null>(() =>
    getValidFichaSession()
  );
  const userCpf = session?.cpf ?? null;
  const userTipo = session?.tipo ?? null;
  const userData = session?.user ?? null;
  const [loginCpf, setLoginCpf] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cores do tema do sistema
  const themeColors = {
    primary: '#A63126',
    primaryDark: '#8B251C',
    primaryLight: '#C44336',
    error: '#E05A5A',
    errorDark: '#C44336',
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFichasAnteriores, setShowFichasAnteriores] = useState(false);
  const [fichasEnviadas, setFichasEnviadas] = useState<FichaEnviada[]>([]);
  /** Filtros da listagem de fichas (gestor/super user pode filtrar por data e busca) */
  const [filtroDataInicioFicha, setFiltroDataInicioFicha] =
    useState<string>('');
  const [filtroDataFimFicha, setFiltroDataFimFicha] = useState<string>('');
  const [filtroSearchFicha, setFiltroSearchFicha] = useState<string>('');
  const [loadingFichas, setLoadingFichas] = useState(false);
  const [showReenviarEmailModal, setShowReenviarEmailModal] = useState(false);
  const [reenviarEmailText, setReenviarEmailText] = useState('');
  const [isReenviandoEmail, setIsReenviandoEmail] = useState(false);
  // Estados para seções colapsáveis e "outro" em mídia/profissão (usados em resetForm)
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    metadados: true,
    comprador: true,
    compradorConjuge: false,
    vendedor: true,
    vendedorConjuge: false,
    imovel: true,
    financeiro: true,
    comissoes: true,
    colaboradores: true,
  });
  const [midiaOutro, setMidiaOutro] = useState(false);
  const [profissaoOutro, setProfissaoOutro] = useState<Record<string, boolean>>(
    {
      comprador: false,
      compradorConjuge: false,
      vendedor: false,
      vendedorConjuge: false,
    }
  );

  // Estado para corretor selecionado
  const [corretorSelecionado, setCorretorSelecionado] =
    useState<TempUniaoUser | null>(null);
  const [showSelectCorretorModal, setShowSelectCorretorModal] = useState(false);
  const [showAddCorretorComissaoModal, setShowAddCorretorComissaoModal] =
    useState(false);
  const [showImportPorcentagensModal, setShowImportPorcentagensModal] =
    useState(false);
  const [filePorcentagens, setFilePorcentagens] = useState<File | null>(null);
  const [importPorcentagensPassword, setImportPorcentagensPassword] =
    useState('');
  const [importingPorcentagens, setImportingPorcentagens] = useState(false);
  const [gestoresDisponiveis, setGestoresDisponiveis] = useState<
    TempUniaoUser[]
  >([]);
  const [loadingGestores, setLoadingGestores] = useState(false);
  const [corretoresDisponiveis, setCorretoresDisponiveis] = useState<
    TempUniaoUser[]
  >([]);
  const [loadingCorretores, setLoadingCorretores] = useState(false);
  // Propostas da equipe para preencher ficha de venda a partir de uma proposta
  const [propostasList, setPropostasList] = useState<PropostaListItem[]>([]);
  const [loadingPropostas, setLoadingPropostas] = useState(false);
  const [propostaSelecionadaId, setPropostaSelecionadaId] =
    useState<string>('');

  // Handler para seleção de corretor
  const handleSelectCorretor = (corretor: TempUniaoUser) => {
    setCorretorSelecionado(corretor);
    localStorage.setItem('corretor_selecionado', JSON.stringify(corretor));
    setShowSelectCorretorModal(false);
    showSuccess(`Corretor ${corretor.nome} selecionado com sucesso!`);
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

  // Restaurar corretor quando usuário logado é corretor
  useEffect(() => {
    if (userCpf && userTipo === 'corretor' && userData) {
      setCorretorSelecionado(userData);
    } else if (userTipo === 'gestor') {
      setCorretorSelecionado(null);
    }
  }, [userCpf, userTipo, userData]);

  // Carregar corretor do localStorage só se ainda não tiver (ex.: voltou da Proposta)
  useEffect(() => {
    if (corretorSelecionado || !userCpf) return;
    try {
      const saved = localStorage.getItem('corretor_selecionado');
      if (saved) {
        const corretor = JSON.parse(saved);
        setCorretorSelecionado(corretor);
      }
    } catch (error) {
      console.error('Erro ao carregar corretor selecionado:', error);
    }
  }, [userCpf, corretorSelecionado]);

  // Carregar gestores para os selects de Gerente e Gerências (GET /api/gestores ou /api/temp-uniao-users/gestores)
  useEffect(() => {
    if (!userCpf) return;
    setLoadingGestores(true);
    buscarGestores()
      .then(setGestoresDisponiveis)
      .catch(err => {
        console.error('Erro ao carregar gestores:', err);
        showError('Não foi possível carregar a lista de gestores.');
      })
      .finally(() => setLoadingGestores(false));
  }, [userCpf]);

  // Carregar corretores para os selects de Corretor e Captador na distribuição de comissão
  useEffect(() => {
    if (!userCpf) return;
    setLoadingCorretores(true);
    buscarCorretores()
      .then(setCorretoresDisponiveis)
      .catch(err => {
        console.error('Erro ao carregar corretores:', err);
        showError('Não foi possível carregar a lista de corretores.');
      })
      .finally(() => setLoadingCorretores(false));
  }, [userCpf]);

  // Carregar propostas da equipe para o select "Preencher a partir de uma proposta" (somente gestores)
  useEffect(() => {
    if (!userCpf || userTipo !== 'gestor') return;
    setLoadingPropostas(true);
    listarPropostas({ gestorCpf: userCpf, limit: 100 })
      .then(res => setPropostasList(res.data?.propostas ?? []))
      .catch(err => {
        console.error('Erro ao carregar propostas:', err);
        setPropostasList([]);
      })
      .finally(() => setLoadingPropostas(false));
  }, [userCpf, userTipo]);

  /** Aplica filtros na listagem de fichas (gestor/super user) */
  const aplicarFiltrosFichas = () => {
    if (!userCpf || userTipo !== 'gestor') return;
    setLoadingFichas(true);
    listarFichasVenda({
      gestorCpf: userCpf,
      dataInicio: filtroDataInicioFicha?.trim() || undefined,
      dataFim: filtroDataFimFicha?.trim() || undefined,
      search: filtroSearchFicha?.trim() || undefined,
    })
      .then(res => {
        const fichas = (res.data?.fichas ?? []).map(f => ({
          id: f.id,
          numero: f.numero ?? f.formNumber ?? '',
          dataVenda: f.dataVenda ?? f.venda?.dataVenda ?? '',
          valorVenda: f.valorVenda ?? f.financeiro?.valorVenda ?? 0,
          createdAt: f.createdAt ?? '',
          dados: undefined,
          status: f.status,
        }));
        setFichasEnviadas(fichas);
      })
      .catch(() => setFichasEnviadas([]))
      .finally(() => setLoadingFichas(false));
  };

  const [historicoDados, setHistoricoDados] = useState<{
    nomes: string[];
    cpfs: string[];
    emails: string[];
    celulares: string[];
  }>({
    nomes: [],
    cpfs: [],
    emails: [],
    celulares: [],
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreateSaleFormDto | null>(null);

  // Carregar dados salvos do localStorage
  const loadSavedData = (): Partial<FichaVendaForm> | null => {
    try {
      const saved = localStorage.getItem('ficha_venda_draft');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    }
    return null;
  };

  // Carregar fichas enviadas do localStorage somente do usuário logado (por CPF)
  const loadFichasEnviadas = useCallback(
    (cpf: string | null): FichaEnviada[] => {
      if (!cpf) return [];
      try {
        const key = `fichas_venda_enviadas_${cpf.replace(/\D/g, '')}`;
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
      } catch (error) {
        console.error('Erro ao carregar fichas enviadas:', error);
      }
      return [];
    },
    []
  );

  // Salvar ficha enviada no localStorage (disponível para uso futuro)
  const _saveFichaEnviada = useCallback(
    (ficha: FichaEnviada, cpf: string | null) => {
      if (!cpf) return;
      try {
        const key = `fichas_venda_enviadas_${cpf.replace(/\D/g, '')}`;
        const fichas = loadFichasEnviadas(cpf);
        fichas.unshift(ficha);
        const fichasLimitadas = fichas.slice(0, 50);
        localStorage.setItem(key, JSON.stringify(fichasLimitadas));
        setFichasEnviadas(fichasLimitadas);
      } catch (error) {
        console.error('Erro ao salvar ficha enviada:', error);
      }
    },
    [loadFichasEnviadas]
  );

  // Carregar histórico de dados das fichas enviadas (somente do usuário logado)
  const loadHistoricoDados = useCallback(() => {
    if (!userCpf) return;
    try {
      const fichas = loadFichasEnviadas(userCpf);
      const nomes = new Set<string>();
      const cpfs = new Set<string>();
      const emails = new Set<string>();
      const celulares = new Set<string>();

      fichas.forEach(ficha => {
        if (ficha.dados?.comprador?.nome) nomes.add(ficha.dados.comprador.nome);
        if (ficha.dados?.comprador?.cpf) cpfs.add(ficha.dados.comprador.cpf);
        if (ficha.dados?.comprador?.email)
          emails.add(ficha.dados.comprador.email);
        if (ficha.dados?.comprador?.celular)
          celulares.add(ficha.dados.comprador.celular);

        if (ficha.dados?.vendedor?.nome) nomes.add(ficha.dados.vendedor.nome);
        if (ficha.dados?.vendedor?.cpf) cpfs.add(ficha.dados.vendedor.cpf);
        if (ficha.dados?.vendedor?.email)
          emails.add(ficha.dados.vendedor.email);
        if (ficha.dados?.vendedor?.celular)
          celulares.add(ficha.dados.vendedor.celular);
      });

      setHistoricoDados({
        nomes: Array.from(nomes).slice(0, 20),
        cpfs: Array.from(cpfs).slice(0, 20),
        emails: Array.from(emails).slice(0, 20),
        celulares: Array.from(celulares).slice(0, 20),
      });
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, [userCpf, loadFichasEnviadas]);

  // Salvar dados automaticamente no localStorage
  const saveDraft = (data: Partial<FichaVendaForm>) => {
    try {
      localStorage.setItem('ficha_venda_draft', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  };

  // Função auxiliar para decodificar base64 de forma segura
  const decodeBase64 = (str: string): string => {
    try {
      // 1. Limpar a string e substituir caracteres URL-safe
      let base64 = str.trim().replace(/-/g, '+').replace(/_/g, '/');

      // 2. Adicionar padding se necessário
      while (base64.length % 4) {
        base64 += '=';
      }

      // 3. Decodificar de forma segura para Unicode
      // atob() cria uma string onde cada caractere é um byte (0-255)
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 4. Usar TextDecoder para converter os bytes em uma string UTF-8 correta
      return new TextDecoder().decode(bytes);
    } catch (error) {
      console.error('Erro ao decodificar base64:', error);
      throw error;
    }
  };

  // Carregar dados compartilhados da URL (reativo)
  const sharedData = React.useMemo(() => {
    try {
      const sharedToken = searchParams.get('shared');
      if (sharedToken) {
        console.log(
          '🔍 Token compartilhado recebido (primeiros 50 chars):',
          sharedToken.substring(0, 50) + '...'
        );
        console.log('🔍 Token completo length:', sharedToken.length);

        // searchParams.get() já faz decode automático do encodeURIComponent
        // Então o token já deve estar decodificado
        let tokenToDecode = sharedToken;

        // Tentar decodificar base64 diretamente (caso já esteja decodificado)
        try {
          const decoded = decodeBase64(tokenToDecode);
          const data = JSON.parse(decoded);
          console.log('✅ Dados compartilhados carregados da URL:', data);
          return data;
        } catch (base64Error) {
          console.log(
            '⚠️ Primeira tentativa falhou, tentando decodificar novamente...',
            base64Error
          );
          // Se falhar, tentar decodificar novamente (pode ter sido codificado duas vezes)
          try {
            tokenToDecode = decodeURIComponent(sharedToken);
            const decoded = decodeBase64(tokenToDecode);
            const data = JSON.parse(decoded);
            console.log(
              '✅ Dados compartilhados carregados da URL (segunda tentativa):',
              data
            );
            return data;
          } catch (secondError) {
            console.error('❌ Segunda tentativa também falhou:', secondError);
            // Tentar sem decodeBase64 (caso já esteja em formato correto)
            try {
              const decoded = atob(sharedToken);
              const data = JSON.parse(decoded);
              console.log(
                '✅ Dados compartilhados carregados (terceira tentativa - atob direto):',
                data
              );
              return data;
            } catch (thirdError) {
              console.error('❌ Todas as tentativas falharam:', thirdError);
              throw thirdError;
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados compartilhados:', error);
    }
    return null;
  }, [searchParams]);

  // Carregar dados salvos apenas uma vez
  const [savedData] = useState(() => loadSavedData());
  const hasSavedData = !!savedData;

  // Função para obter valores padrão do formulário
  const getDefaultValues = (): FichaVendaForm => ({
    dataVenda: savedData?.dataVenda || new Date().toISOString().split('T')[0],
    possuiCompradorConjuge: savedData?.possuiCompradorConjuge || false,
    possuiVendedorConjuge: savedData?.possuiVendedorConjuge || false,
    comprador: savedData?.comprador || {
      nome: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      email: '',
      celular: '',
      profissao: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
    },
    vendedor: savedData?.vendedor || {
      nome: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      email: '',
      celular: '',
      profissao: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
    },
    compradorConjuge: savedData?.compradorConjuge,
    vendedorConjuge: savedData?.vendedorConjuge,
    imovel: savedData?.imovel || {
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      codigo: '',
    },
    valorVenda: savedData?.valorVenda || '',
    comissaoTotal: savedData?.comissaoTotal || '',
    valorMeta: savedData?.valorMeta || '',
    comissoesCorretores: savedData?.comissoesCorretores || [],
    comissoesGerencias: savedData?.comissoesGerencias || [],
    colaboradorPreAtendimento: savedData?.colaboradorPreAtendimento || '',
    colaboradorCentralCaptacao: savedData?.colaboradorCentralCaptacao || '',
    secretariaPresentes: savedData?.secretariaPresentes || '',
    midiaOrigem: savedData?.midiaOrigem || '',
    gerente: savedData?.gerente || '',
    unidadeVenda: savedData?.unidadeVenda || 'União Esmeralda',
  });

  const defaultValues = getDefaultValues();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    getValues,
    formState: { errors, isDirty },
  } = useForm<FichaVendaForm>({
    defaultValues,
  });

  /** Verifica se os dados têm o mínimo obrigatório para o PATCH não retornar 400 (evita chamar API sem preencher obrigatórios). */
  const hasMinimalRequiredForSave = useCallback(
    (data: FichaVendaForm): boolean => {
      const v = data;
      if (!v?.dataVenda?.trim() || !v?.unidadeVenda?.trim()) return false;
      const comp = v.comprador;
      if (
        !comp?.nome?.trim() ||
        !comp?.cpf?.replace(/\D/g, '') ||
        (comp.cpf?.replace(/\D/g, '')?.length ?? 0) < 11
      )
        return false;
      if (
        !comp?.dataNascimento?.trim() ||
        !comp?.email?.trim() ||
        !comp?.celular?.replace(/\D/g, '')
      )
        return false;
      const endComp = comp?.endereco;
      if (
        !endComp?.cep?.replace(/\D/g, '') ||
        !endComp?.rua?.trim() ||
        !endComp?.numero?.trim() ||
        !endComp?.bairro?.trim() ||
        !endComp?.cidade?.trim() ||
        !endComp?.estado?.trim()
      )
        return false;
      const vend = v.vendedor;
      if (
        !vend?.nome?.trim() ||
        !vend?.cpf?.replace(/\D/g, '') ||
        (vend.cpf?.replace(/\D/g, '')?.length ?? 0) < 11
      )
        return false;
      if (
        !vend?.dataNascimento?.trim() ||
        !vend?.email?.trim() ||
        !vend?.celular?.replace(/\D/g, '')
      )
        return false;
      const endVend = vend?.endereco;
      if (
        !endVend?.cep?.replace(/\D/g, '') ||
        !endVend?.rua?.trim() ||
        !endVend?.numero?.trim() ||
        !endVend?.bairro?.trim() ||
        !endVend?.cidade?.trim() ||
        !endVend?.estado?.trim()
      )
        return false;
      const im = v.imovel;
      if (
        !im?.cep?.replace(/\D/g, '') ||
        !im?.endereco?.trim() ||
        !im?.numero?.trim() ||
        !im?.bairro?.trim() ||
        !im?.cidade?.trim() ||
        !im?.estado?.trim() ||
        !im?.codigo?.trim()
      )
        return false;
      const valorVenda = getNumericValue(v.valorVenda ?? '');
      if (valorVenda <= 0) return false;
      return true;
    },
    []
  );

  // Hooks watch devem ser chamados antes de qualquer return condicional
  const midiaOrigemValue = watch('midiaOrigem');
  const compradorProfissao = watch('comprador.profissao');
  const compradorConjugeProfissao = watch('compradorConjuge.profissao');
  const vendedorProfissao = watch('vendedor.profissao');
  const vendedorConjugeProfissao = watch('vendedorConjuge.profissao');

  // Função para resetar o formulário sem recarregar a página
  const resetForm = useCallback(() => {
    const emptyValues: FichaVendaForm = {
      dataVenda: new Date().toISOString().split('T')[0],
      secretariaPresentes: '',
      midiaOrigem: '',
      gerente: '',
      unidadeVenda: 'União Esmeralda',
      possuiCompradorConjuge: false,
      possuiVendedorConjuge: false,
      comprador: {
        nome: '',
        cpf: '',
        rg: '',
        dataNascimento: '',
        email: '',
        celular: '',
        profissao: '',
        endereco: {
          cep: '',
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
      },
      vendedor: {
        nome: '',
        cpf: '',
        rg: '',
        dataNascimento: '',
        email: '',
        celular: '',
        profissao: '',
        endereco: {
          cep: '',
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
      },
      compradorConjuge: undefined,
      vendedorConjuge: undefined,
      imovel: {
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        codigo: '',
      },
      valorVenda: '',
      comissaoTotal: '',
      valorMeta: '',
      comissoesCorretores: [],
      comissoesGerencias: [],
      colaboradorPreAtendimento: '',
      colaboradorCentralCaptacao: '',
    };

    reset(emptyValues);
    setMidiaOutro(false);
    setProfissaoOutro({
      comprador: false,
      compradorConjuge: false,
      vendedor: false,
      vendedorConjuge: false,
    });

    // Resetar seções expandidas
    setExpandedSections({
      metadados: true,
      comprador: true,
      compradorConjuge: false,
      vendedor: true,
      vendedorConjuge: false,
      imovel: true,
      financeiro: true,
      comissoes: true,
      colaboradores: true,
    });
  }, [reset, setMidiaOutro, setProfissaoOutro, setExpandedSections]);

  // Carregar dados salvos após montagem e habilitar scroll
  useEffect(() => {
    // Habilitar scroll na página
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';

    // Garantir tema light
    document.body.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');

    // Carregar fichas da equipe do gestor via API (somente gestores/super user; gestorCpf obrigatório)
    if (userCpf && userTipo === 'gestor') {
      listarFichasVenda({ gestorCpf: userCpf })
        .then(res => {
          const fichas = (res.data?.fichas ?? []).map(f => ({
            id: f.id,
            numero: f.numero ?? f.formNumber ?? '',
            dataVenda: f.dataVenda ?? f.venda?.dataVenda ?? '',
            valorVenda: f.valorVenda ?? f.financeiro?.valorVenda ?? 0,
            createdAt: f.createdAt ?? '',
            dados: undefined,
            status: f.status,
          }));
          setFichasEnviadas(fichas);
        })
        .catch(() => setFichasEnviadas([]));
    }

    setIsLoading(false);
    if (savedData) {
      showInfo(
        'Rascunho carregado automaticamente. Seus dados foram restaurados.'
      );
    }

    // Cleanup: não restaurar overflow aqui, o wrapper faz isso
    return () => {
      // Não restaurar aqui para evitar conflitos
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCpf, userTipo]); // Recarregar fichas quando o gestor logar

  // Carregar histórico de dados após carregar fichas (apenas uma vez após o carregamento inicial)
  useEffect(() => {
    if (!isLoading) {
      loadHistoricoDados();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); // loadHistoricoDados é estável (useCallback com deps vazias)

  // Carregar ficha por ID quando a URL for /ficha-venda/:id (acesso por link compartilhado — sem restrição de gestor)
  useEffect(() => {
    if (!fichaIdFromUrl) {
      setHasLoadedFichaById(true);
      setFichaNotFound(false);
      setFichaAccessDenied(false);
      setLoadedFichaFormNumber(null);
      setLoadedFichaStatus(null);
      return;
    }

    let cancelled = false;
    setLoadingFichaById(true);
    setFichaNotFound(false);
    setFichaAccessDenied(false);

    // Sempre usar API sem gestorCpf: quem acessa pelo link (compartilhado) pode ver/editar sem ser o gestor da ficha
    const loadFicha = buscarFichaVendaPorId(fichaIdFromUrl, true);

    loadFicha
      .then(data => {
        if (cancelled) return;
        if (!data) {
          setFichaNotFound(true);
          return;
        }
        setFichaAccessDenied(false);
        setLoadedFichaFormNumber(data.formNumber ?? data.numero ?? null);
        // Garantir que o status retornado pela API (rascunho | disponivel) seja refletido na UI
        const statusFromApi =
          (data && typeof data === 'object' && 'status' in data
            ? (data as { status: StatusFichaProposta }).status
            : undefined);
        setLoadedFichaStatus(
          statusFromApi === 'disponivel' ? 'disponivel' : 'rascunho'
        );
        const defaults = getDefaultValues();
        const fromApi = apiDataToFormData(data);
        reset({ ...defaults, ...fromApi } as FichaVendaForm);
        setMidiaOutro(
          !!(
            fromApi.midiaOrigem &&
            fromApi.midiaOrigem !== 'Instagram' &&
            fromApi.midiaOrigem !== 'Facebook' &&
            fromApi.midiaOrigem !== 'Google'
          )
        );
        setProfissaoOutro({
          comprador: !!(
            fromApi.comprador?.profissao &&
            !PROFISSOES_COMUNS.includes(fromApi.comprador.profissao)
          ),
          compradorConjuge: !!(
            fromApi.compradorConjuge?.profissao &&
            !PROFISSOES_COMUNS.includes(
              fromApi.compradorConjuge?.profissao ?? ''
            )
          ),
          vendedor: !!(
            fromApi.vendedor?.profissao &&
            !PROFISSOES_COMUNS.includes(fromApi.vendedor.profissao)
          ),
          vendedorConjuge: !!(
            fromApi.vendedorConjuge?.profissao &&
            !PROFISSOES_COMUNS.includes(
              fromApi.vendedorConjuge?.profissao ?? ''
            )
          ),
        });
        setExpandedSections({
          metadados: true,
          comprador: true,
          compradorConjuge: !!fromApi.possuiCompradorConjuge,
          vendedor: true,
          vendedorConjuge: !!fromApi.possuiVendedorConjuge,
          imovel: true,
          financeiro: true,
          comissoes: true,
          colaboradores: true,
        });
        showSuccess('Ficha carregada. Você pode continuar o preenchimento.');
      })
      .catch((err: any) => {
        if (cancelled) return;
        const is403 = err?.statusCode === 403 || err?.response?.status === 403;
        if (is403) {
          setFichaAccessDenied(true);
          setFichaNotFound(false);
        } else {
          setFichaNotFound(true);
          setFichaAccessDenied(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingFichaById(false);
          setHasLoadedFichaById(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fichaIdFromUrl, userTipo, userCpf]);

  // Verificar se mídia de origem é "Outro" ou valor customizado ao carregar dados
  useEffect(() => {
    const opcoesMidia = [
      'Instagram',
      'Facebook',
      'Google',
      'Google Ads',
      'Facebook Ads',
      'LinkedIn',
      'YouTube',
      'TikTok',
      'WhatsApp',
      'Indicação',
      'Site',
      'Jornal',
      'Rádio',
      'TV',
    ];
    if (midiaOrigemValue && !opcoesMidia.includes(midiaOrigemValue)) {
      setMidiaOutro(true);
    } else if (midiaOrigemValue === 'Outro') {
      setMidiaOutro(true);
    } else {
      setMidiaOutro(false);
    }
  }, [midiaOrigemValue]);

  useEffect(() => {
    if (compradorProfissao && !PROFISSOES_COMUNS.includes(compradorProfissao)) {
      setProfissaoOutro(prev => ({ ...prev, comprador: true }));
    } else if (compradorProfissao && compradorProfissao !== 'Outro') {
      setProfissaoOutro(prev => ({ ...prev, comprador: false }));
    }
  }, [compradorProfissao]);

  useEffect(() => {
    if (
      compradorConjugeProfissao &&
      !PROFISSOES_COMUNS.includes(compradorConjugeProfissao)
    ) {
      setProfissaoOutro(prev => ({ ...prev, compradorConjuge: true }));
    } else if (
      compradorConjugeProfissao &&
      compradorConjugeProfissao !== 'Outro'
    ) {
      setProfissaoOutro(prev => ({ ...prev, compradorConjuge: false }));
    }
  }, [compradorConjugeProfissao]);

  useEffect(() => {
    if (vendedorProfissao && !PROFISSOES_COMUNS.includes(vendedorProfissao)) {
      setProfissaoOutro(prev => ({ ...prev, vendedor: true }));
    } else if (vendedorProfissao && vendedorProfissao !== 'Outro') {
      setProfissaoOutro(prev => ({ ...prev, vendedor: false }));
    }
  }, [vendedorProfissao]);

  useEffect(() => {
    if (
      vendedorConjugeProfissao &&
      !PROFISSOES_COMUNS.includes(vendedorConjugeProfissao)
    ) {
      setProfissaoOutro(prev => ({ ...prev, vendedorConjuge: true }));
    } else if (
      vendedorConjugeProfissao &&
      vendedorConjugeProfissao !== 'Outro'
    ) {
      setProfissaoOutro(prev => ({ ...prev, vendedorConjuge: false }));
    }
  }, [vendedorConjugeProfissao]);

  // Carregar dados compartilhados quando a página carregar ou URL mudar
  useEffect(() => {
    if (sharedData && !isLoading && !hasLoadedSharedData) {
      console.log(
        '🔄 Limpando dados existentes e carregando dados compartilhados...',
        sharedData
      );
      setHasLoadedSharedData(true);

      // 1. PRIMEIRO: Limpar todos os dados existentes
      // Limpar localStorage
      localStorage.removeItem('ficha_venda_draft');

      // Limpar formulário usando reset com valores vazios
      resetForm();

      // Resetar estados relacionados
      setMidiaOutro(false);
      setProfissaoOutro({
        comprador: false,
        compradorConjuge: false,
        vendedor: false,
        vendedorConjuge: false,
      });

      // Aguardar um pouco para garantir que o reset foi aplicado
      setTimeout(() => {
        console.log('📥 Preenchendo formulário com dados compartilhados...');

        // 2. DEPOIS: Preencher com dados compartilhados
        // Preencher campos simples primeiro
        if (sharedData.dataVenda) setValue('dataVenda', sharedData.dataVenda);
        if (sharedData.possuiCompradorConjuge !== undefined)
          setValue('possuiCompradorConjuge', sharedData.possuiCompradorConjuge);
        if (sharedData.possuiVendedorConjuge !== undefined)
          setValue('possuiVendedorConjuge', sharedData.possuiVendedorConjuge);
        if (sharedData.secretariaPresentes)
          setValue('secretariaPresentes', sharedData.secretariaPresentes);
        if (sharedData.midiaOrigem) {
          setValue('midiaOrigem', sharedData.midiaOrigem);
          // Verificar se precisa mostrar campo "Outro"
          if (sharedData.midiaOrigem === 'Outro') {
            setMidiaOutro(true);
          }
        }
        if (sharedData.gerente) setValue('gerente', sharedData.gerente);
        if (sharedData.valorVenda)
          setValue('valorVenda', sharedData.valorVenda);
        if (sharedData.comissaoTotal)
          setValue('comissaoTotal', sharedData.comissaoTotal);
        if (sharedData.valorMeta) setValue('valorMeta', sharedData.valorMeta);
        if (sharedData.colaboradorPreAtendimento)
          setValue(
            'colaboradorPreAtendimento',
            sharedData.colaboradorPreAtendimento
          );
        if (sharedData.colaboradorCentralCaptacao)
          setValue(
            'colaboradorCentralCaptacao',
            sharedData.colaboradorCentralCaptacao
          );

        // Preencher objetos aninhados (preencher o objeto inteiro)
        if (sharedData.comprador) {
          setValue('comprador', sharedData.comprador);
          // Verificar profissão "Outro"
          if (
            sharedData.comprador.profissao &&
            !PROFISSOES_COMUNS.includes(sharedData.comprador.profissao)
          ) {
            setProfissaoOutro(prev => ({ ...prev, comprador: true }));
          }
        }
        if (sharedData.compradorConjuge) {
          setValue('compradorConjuge', sharedData.compradorConjuge);
          // Verificar profissão "Outro"
          if (
            sharedData.compradorConjuge.profissao &&
            !PROFISSOES_COMUNS.includes(sharedData.compradorConjuge.profissao)
          ) {
            setProfissaoOutro(prev => ({ ...prev, compradorConjuge: true }));
          }
        }
        if (sharedData.vendedor) {
          setValue('vendedor', sharedData.vendedor);
          // Verificar profissão "Outro"
          if (
            sharedData.vendedor.profissao &&
            !PROFISSOES_COMUNS.includes(sharedData.vendedor.profissao)
          ) {
            setProfissaoOutro(prev => ({ ...prev, vendedor: true }));
          }
        }
        if (sharedData.vendedorConjuge) {
          setValue('vendedorConjuge', sharedData.vendedorConjuge);
          // Verificar profissão "Outro"
          if (
            sharedData.vendedorConjuge.profissao &&
            !PROFISSOES_COMUNS.includes(sharedData.vendedorConjuge.profissao)
          ) {
            setProfissaoOutro(prev => ({ ...prev, vendedorConjuge: true }));
          }
        }
        if (sharedData.imovel) {
          setValue('imovel', sharedData.imovel);
        }

        // Preencher arrays
        if (
          sharedData.comissoesCorretores &&
          Array.isArray(sharedData.comissoesCorretores)
        ) {
          setValue('comissoesCorretores', sharedData.comissoesCorretores);
        }
        if (
          sharedData.comissoesGerencias &&
          Array.isArray(sharedData.comissoesGerencias)
        ) {
          setValue('comissoesGerencias', sharedData.comissoesGerencias);
        }

        // Expandir todas as seções para mostrar os dados
        setExpandedSections({
          metadados: true,
          comprador: true,
          compradorConjuge: !!sharedData.possuiCompradorConjuge,
          vendedor: true,
          vendedorConjuge: !!sharedData.possuiVendedorConjuge,
          imovel: true,
          financeiro: true,
          comissoes: true,
          colaboradores: true,
        });

        showInfo('Dados compartilhados carregados com sucesso!');
      }, 100);
    }
  }, [sharedData, isLoading, setValue, hasLoadedSharedData, resetForm]);

  // Carregar dados da proposta quando vier de /ficha-proposta (fromProposta na URL)
  useEffect(() => {
    const fromPropostaId = searchParams.get('fromProposta');
    if (
      fromPropostaId &&
      !isLoading &&
      !hasLoadedSharedData &&
      !fichaIdFromUrl
    ) {
      try {
        const propostaDataStr = sessionStorage.getItem(
          'ficha_venda_from_proposta'
        );
        if (propostaDataStr) {
          const propostaData = JSON.parse(propostaDataStr);
          console.log(
            '📋 Carregando dados da proposta para Ficha de Venda:',
            propostaData
          );

          // Limpar sessionStorage após ler
          sessionStorage.removeItem('ficha_venda_from_proposta');

          // Limpar parâmetro da URL
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('fromProposta');
          setSearchParams(newSearchParams, { replace: true });

          // Mapear dados da proposta para o formulário
          const base = getDefaultValues();
          const fromP = mapPropostaDataToFichaVendaForm(propostaData);
          const merged = { ...base };
          (Object.keys(fromP) as (keyof FichaVendaForm)[]).forEach(k => {
            const v = fromP[k];
            if (v !== undefined) (merged as any)[k] = v;
          });

          reset(merged);
          setExpandedSections({
            metadados: true,
            comprador: true,
            compradorConjuge: !!merged.possuiCompradorConjuge,
            vendedor: true,
            vendedorConjuge: !!merged.possuiVendedorConjuge,
            imovel: true,
            financeiro: true,
            comissoes: true,
            colaboradores: true,
          });

          showSuccess(
            'Ficha de venda preenchida com os dados da proposta. Revise e complete os campos que faltarem.'
          );
        }
      } catch (err) {
        console.error('Erro ao carregar dados da proposta:', err);
        showError('Erro ao carregar dados da proposta.');
      }
    }
    // getDefaultValues e resetForm são estáveis / intencionalmente omitidos para evitar reexecução
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchParams,
    isLoading,
    hasLoadedSharedData,
    fichaIdFromUrl,
    setValue,
    reset,
    setSearchParams,
  ]);

  // Salvar automaticamente quando houver mudanças (localStorage)
  useEffect(() => {
    if (!isLoading) {
      const subscription = watch(data => {
        saveDraft(data as Partial<FichaVendaForm>);
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isLoading]);

  // Salvar progresso no back a cada 30s somente quando houver alteração e dados obrigatórios preenchidos (evita PATCH desnecessário e 400)
  useEffect(() => {
    if (!fichaIdFromUrl || isFichaFinalizada || isLoading) return;
    const interval = setInterval(async () => {
      const data = getValues();
      if (!isDirty) return;
      if (!hasMinimalRequiredForSave(data)) return;
      try {
        // Não enviar status no auto-save: backend preserva o atual e evita sobrescrever "disponivel" com "rascunho"
        const payload = { ...preparePayload(data) } as CreateSaleFormDto;
        await atualizarFichaVendaPorId(fichaIdFromUrl, payload);
      } catch {
        // Silencioso: não incomodar o usuário a cada falha de auto-save
      }
    }, 30000);
    return () => clearInterval(interval);
    // preparePayload estável; omitido para evitar reexecução do interval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fichaIdFromUrl,
    isFichaFinalizada,
    isLoading,
    loadedFichaStatus,
    getValues,
    isDirty,
    hasMinimalRequiredForSave,
  ]);

  // Watch valores para cálculos
  const valorVenda = watch('valorVenda');
  const comissoesCorretoresWatch = watch('comissoesCorretores');
  const comissoesGerenciasWatch = watch('comissoesGerencias');
  const comissoesCorretores = React.useMemo(
    () => comissoesCorretoresWatch || [],
    [comissoesCorretoresWatch]
  );
  const comissoesGerencias = React.useMemo(
    () => comissoesGerenciasWatch || [],
    [comissoesGerenciasWatch]
  );

  /** Lista para o select Captador: corretores + gestores (tudo). Deduplicado por id. */
  const opcoesCaptador = React.useMemo(() => {
    const ids = new Set<string>();
    const list: TempUniaoUser[] = [];
    [...corretoresDisponiveis, ...gestoresDisponiveis].forEach(u => {
      if (!ids.has(u.id)) {
        ids.add(u.id);
        list.push(u);
      }
    });
    return list;
  }, [corretoresDisponiveis, gestoresDisponiveis]);

  // Calcular valor de meta (5% do valor de venda)
  useEffect(() => {
    const valor = getNumericValue(valorVenda || '0');
    if (valor > 0) {
      const meta = valor * 0.05;
      setValue('valorMeta', formatCurrencyValue(meta));
    } else {
      setValue('valorMeta', '');
    }
  }, [valorVenda, setValue]);

  /**
   * Total de porcentagens de comissão (corretores + gerências).
   * REGRA DE NEGÓCIO: A ficha de venda NÃO exige que o total seja 100%.
   * Já foi alterado no passado para exigir 100% — NÃO voltar a exigir.
   * Backend e front só exigem: se houver itens de comissão, a soma deve ser > 0.
   */
  const totalPorcentagens = React.useMemo(() => {
    const totalCorretores = comissoesCorretores.reduce(
      (sum, c) => sum + (c.porcentagem || 0),
      0
    );
    const totalGerencias = comissoesGerencias.reduce(
      (sum, g) => sum + (g.porcentagem || 0),
      0
    );
    return totalCorretores + totalGerencias;
  }, [comissoesCorretores, comissoesGerencias]);

  // Toggle seção
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Estados para loading de CEP
  const [loadingCEP, setLoadingCEP] = useState<Record<string, boolean>>({});
  // Busca de imóvel por código (lista de propriedades públicas)
  const [propriedadesBusca, setPropriedadesBusca] = useState<Property[]>([]);
  const [loadingPropriedades, setLoadingPropriedades] = useState(false);
  const [showDropdownImovel, setShowDropdownImovel] = useState(false);
  const [buscaCodigoImovel, setBuscaCodigoImovel] = useState('');

  // Buscar endereço por CEP
  const buscarCEP = async (
    cep: string,
    pessoa: 'comprador' | 'compradorConjuge' | 'vendedor' | 'vendedorConjuge'
  ) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;

    setLoadingCEP(prev => ({ ...prev, [pessoa]: true }));

    try {
      const addressData = await fetchAddressByZipCode(cleanCEP);
      setValue(`${pessoa}.endereco.rua`, addressData.street);
      setValue(`${pessoa}.endereco.bairro`, addressData.neighborhood);
      setValue(`${pessoa}.endereco.cidade`, addressData.city);
      setValue(`${pessoa}.endereco.estado`, addressData.state);
      showSuccess('Endereço encontrado!');
    } catch {
      showError('CEP não encontrado ou inválido');
    } finally {
      setLoadingCEP(prev => ({ ...prev, [pessoa]: false }));
    }
  };

  // Buscar endereço do imóvel por CEP (disponível para uso em campo imóvel)
  const _buscarCEPImovel = async (cep: string) => {
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
  // Referência para uso futuro (evita aviso de variável não lida)
  void [_saveFichaEnviada, _buscarCEPImovel];

  // Cidade padrão para busca de propriedades (API exige cidade)
  const CIDADE_PADRAO_BUSCA_IMOVEL = 'Marília';

  // Buscar propriedades por código para preencher bloco imóvel
  const buscarPropriedadesPorCodigo = async () => {
    const codigo = watch('imovel.codigo')?.trim() || buscaCodigoImovel.trim();
    if (!codigo) {
      showWarning('Digite o código do imóvel para buscar.');
      return;
    }
    const cidade = watch('imovel.cidade')?.trim() || CIDADE_PADRAO_BUSCA_IMOVEL;
    setLoadingPropriedades(true);
    setShowDropdownImovel(false);
    setPropriedadesBusca([]);
    try {
      const result = await getPublicProperties(
        { code: codigo, city: cidade },
        { page: 1, limit: 20 }
      );
      const list = (result as any).data ?? (result as any).properties ?? [];
      const arr = Array.isArray(list) ? list : [];
      setPropriedadesBusca(arr);
      setShowDropdownImovel(true);
      if (arr.length === 0)
        showInfo('Nenhum imóvel encontrado com esse código.');
    } catch {
      showError('Erro ao buscar imóveis. Tente novamente.');
    } finally {
      setLoadingPropriedades(false);
    }
  };

  const selecionarPropriedadeParaImovel = (prop: Property) => {
    const imovel = propriedadeParaImovelFicha(prop);
    setValue('imovel.cep', maskCEP(imovel.cep));
    setValue('imovel.endereco', imovel.endereco);
    setValue('imovel.numero', imovel.numero);
    setValue('imovel.complemento', imovel.complemento ?? '');
    setValue('imovel.bairro', imovel.bairro);
    setValue('imovel.cidade', imovel.cidade);
    setValue('imovel.estado', imovel.estado);
    setValue('imovel.codigo', imovel.codigo);
    setShowDropdownImovel(false);
    setPropriedadesBusca([]);
    showSuccess('Imóvel preenchido com os dados da propriedade.');
  };

  // Componente helper para campos de endereço
  const renderAddressFields = (
    prefix: 'comprador' | 'compradorConjuge' | 'vendedor' | 'vendedorConjuge',
    errors: any
  ) => {
    return (
      <>
        <Divider style={{ gridColumn: '1 / -1', margin: '24px 0' }} />

        <FormGroup>
          <FormLabel>CEP</FormLabel>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <FormInput
              type='text'
              {...register(`${prefix}.endereco.cep`)}
              placeholder='00000-000'
              maxLength={9}
              onChange={e => {
                const masked = maskCEP(e.target.value);
                setValue(`${prefix}.endereco.cep`, masked);
              }}
              $hasError={!!errors?.endereco?.cep}
              style={{ flex: 1 }}
            />
            <CepSearchButton
              type='button'
              onClick={() => {
                const cep = watch(`${prefix}.endereco.cep` as any);
                if (cep && cep.replace(/\D/g, '').length === 8) {
                  buscarCEP(cep, prefix);
                } else {
                  showWarning('CEP deve conter 8 dígitos');
                }
              }}
              disabled={loadingCEP[prefix]}
            >
              {loadingCEP[prefix] ? (
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
          {errors?.endereco?.cep && (
            <ErrorMessage>{errors.endereco.cep.message}</ErrorMessage>
          )}
          <HelperText>
            Digite o CEP e clique em "Buscar" para preencher o endereço
            automaticamente
          </HelperText>
        </FormGroup>

        <FormGroup>
          <FormLabel>
            Rua <RequiredIndicator>*</RequiredIndicator>
          </FormLabel>
          <FormInput
            type='text'
            {...register(`${prefix}.endereco.rua`, {
              required: 'Rua é obrigatória',
            })}
            placeholder='Nome da rua'
            $hasError={!!errors?.endereco?.rua}
          />
          {errors?.endereco?.rua && (
            <ErrorMessage>{errors.endereco.rua.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>
            Número <RequiredIndicator>*</RequiredIndicator>
          </FormLabel>
          <FormInput
            type='text'
            {...register(`${prefix}.endereco.numero`, {
              required: 'Número é obrigatório',
            })}
            placeholder='123 ou S/N'
            $hasError={!!errors?.endereco?.numero}
          />
          {errors?.endereco?.numero && (
            <ErrorMessage>{errors.endereco.numero.message}</ErrorMessage>
          )}
          <HelperText>Permite "S/N" para sem número</HelperText>
        </FormGroup>

        <FormGroup>
          <FormLabel>Complemento</FormLabel>
          <FormInput
            type='text'
            {...register(`${prefix}.endereco.complemento`)}
            placeholder='Apto, Bloco, etc.'
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>
            Bairro <RequiredIndicator>*</RequiredIndicator>
          </FormLabel>
          <FormInput
            type='text'
            {...register(`${prefix}.endereco.bairro`, {
              required: 'Bairro é obrigatório',
            })}
            placeholder='Nome do bairro'
            $hasError={!!errors?.endereco?.bairro}
          />
          {errors?.endereco?.bairro && (
            <ErrorMessage>{errors.endereco.bairro.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>
            Cidade <RequiredIndicator>*</RequiredIndicator>
          </FormLabel>
          <FormInput
            type='text'
            {...register(`${prefix}.endereco.cidade`, {
              required: 'Cidade é obrigatória',
            })}
            placeholder='Nome da cidade'
            $hasError={!!errors?.endereco?.cidade}
          />
          {errors?.endereco?.cidade && (
            <ErrorMessage>{errors.endereco.cidade.message}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <FormLabel>
            Estado (UF) <RequiredIndicator>*</RequiredIndicator>
          </FormLabel>
          <FormInput
            type='text'
            {...register(`${prefix}.endereco.estado`, {
              required: 'Estado é obrigatório',
              maxLength: 2,
              pattern: {
                value: /^[A-Z]{2}$/,
                message: 'Digite apenas a sigla do estado (ex: SP, RJ)',
              },
            })}
            placeholder='SP'
            maxLength={2}
            style={{ textTransform: 'uppercase' }}
            onChange={e => {
              setValue(
                `${prefix}.endereco.estado`,
                e.target.value.toUpperCase()
              );
            }}
            $hasError={!!errors?.endereco?.estado}
          />
          {errors?.endereco?.estado && (
            <ErrorMessage>{errors.endereco.estado.message}</ErrorMessage>
          )}
        </FormGroup>
      </>
    );
  };

  // Adicionar corretor
  const addCorretor = () => {
    const current = watch('comissoesCorretores') || [];
    setValue('comissoesCorretores', [
      ...current,
      {
        id: `corretor_${Date.now()}`,
        corretorId: '',
        corretor: '',
        porcentagem: 0,
        captadores: [],
      },
    ]);
  };

  // Remover corretor
  const removeCorretor = (id: string) => {
    const current = watch('comissoesCorretores') || [];
    setValue(
      'comissoesCorretores',
      current.filter(c => c.id !== id)
    );
  };

  // Adicionar corretor da lista (com porcentagem sugerida pela API temp-uniao-users)
  const addCorretorFromList = (corretor: TempUniaoUser) => {
    const current = watch('comissoesCorretores') || [];
    setValue('comissoesCorretores', [
      ...current,
      {
        id: `corretor_${Date.now()}`,
        corretorId: corretor.id,
        corretor: corretor.nome,
        porcentagem:
          typeof corretor.porcentagem === 'number' ? corretor.porcentagem : 0,
        captador: undefined,
        captadores: [],
      },
    ]);
    setShowAddCorretorComissaoModal(false);
    showSuccess(
      corretor.porcentagem != null
        ? `Corretor "${corretor.nome}" adicionado com ${corretor.porcentagem}% de comissão.`
        : `Corretor "${corretor.nome}" adicionado.`
    );
  };

  // Importar porcentagens em massa (Excel/CSV) – requer senha de aprovação
  const handleImportPorcentagens = async () => {
    if (!filePorcentagens) {
      showWarning('Selecione um arquivo (Excel .xlsx ou CSV).');
      return;
    }
    if (!importPorcentagensPassword?.trim()) {
      showWarning('Informe a senha de aprovação para importar porcentagens.');
      return;
    }
    const ext = filePorcentagens.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'csv') {
      showError('Use um arquivo Excel (.xlsx) ou CSV.');
      return;
    }
    setImportingPorcentagens(true);
    try {
      const result = await importPorcentagens(
        filePorcentagens,
        importPorcentagensPassword.trim()
      );
      setShowImportPorcentagensModal(false);
      setFilePorcentagens(null);
      setImportPorcentagensPassword('');
      const updated =
        result.updated ?? result.data?.updated ?? result.data?.imported;
      const msg =
        updated != null
          ? `Porcentagens importadas: ${updated} corretores atualizados.`
          : result.message || 'Porcentagens importadas com sucesso.';
      showSuccess(msg);
      const errors = result.errors ?? result.data?.errors;
      if (errors?.length) {
        showWarning(
          `Alguns registros com erro: ${errors.map((e: any) => e.error || e.message || e).join('; ')}`
        );
      }
    } catch (err: any) {
      showError(
        err?.message ||
          'Erro ao importar arquivo. Verifique o formato (CPF e Porcentagem) e a senha.'
      );
    } finally {
      setImportingPorcentagens(false);
    }
  };

  // Adicionar gerência
  const addGerencia = (nivel: number) => {
    const current = watch('comissoesGerencias') || [];
    if (!current.find(g => g.nivel === nivel)) {
      setValue('comissoesGerencias', [
        ...current,
        {
          nivel,
          porcentagem: 0,
          nome: 'Rafael Correa',
        },
      ]);
    }
  };

  // Remover gerência
  const removeGerencia = (nivel: number) => {
    const current = watch('comissoesGerencias') || [];
    setValue(
      'comissoesGerencias',
      current.filter(g => g.nivel !== nivel)
    );
  };

  // Handler de máscara CPF
  const handleCPFChange = (value: string, field: string) => {
    const masked = maskCPF(value);
    setValue(field as any, masked);
  };

  // Handler de máscara Celular
  const handleCelularChange = (value: string, field: string) => {
    const masked = maskCelPhone(value);
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
  const preparePayload = (data: FichaVendaForm): CreateSaleFormDto => {
    return {
      venda: {
        dataVenda: data.dataVenda,
        secretariaPresentes: data.secretariaPresentes || undefined,
        midiaOrigem: data.midiaOrigem || undefined,
        gerente: data.gerente?.trim() || undefined,
        unidadeVenda: normalizeUnidadeName(data.unidadeVenda),
      },
      comprador: {
        nome: data.comprador.nome.trim(),
        cpf: data.comprador.cpf.replace(/\D/g, ''),
        rg: data.comprador.rg.replace(/\D/g, ''),
        dataNascimento: data.comprador.dataNascimento,
        email: data.comprador.email.trim().toLowerCase(),
        celular: data.comprador.celular.replace(/\D/g, ''),
        profissao: data.comprador.profissao?.trim() || undefined,
        endereco: {
          cep: data.comprador.endereco.cep.replace(/\D/g, ''),
          rua: data.comprador.endereco.rua.trim(),
          numero: data.comprador.endereco.numero.trim(),
          complemento: data.comprador.endereco.complemento?.trim() || undefined,
          bairro: data.comprador.endereco.bairro.trim(),
          cidade: data.comprador.endereco.cidade.trim(),
          estado: data.comprador.endereco.estado.toUpperCase(),
        },
      },
      compradorConjuge:
        data.possuiCompradorConjuge && data.compradorConjuge
          ? {
              nome: data.compradorConjuge.nome.trim(),
              cpf: data.compradorConjuge.cpf.replace(/\D/g, ''),
              rg: (data.compradorConjuge.rg || '').replace(/\D/g, ''),
              dataNascimento: data.compradorConjuge.dataNascimento,
              email: data.compradorConjuge.email.trim().toLowerCase(),
              celular: data.compradorConjuge.celular.replace(/\D/g, ''),
              profissao: data.compradorConjuge.profissao?.trim() || undefined,
              endereco: {
                cep: data.compradorConjuge.endereco.cep.replace(/\D/g, ''),
                rua: data.compradorConjuge.endereco.rua.trim(),
                numero: data.compradorConjuge.endereco.numero.trim(),
                complemento:
                  data.compradorConjuge.endereco.complemento?.trim() ||
                  undefined,
                bairro: data.compradorConjuge.endereco.bairro.trim(),
                cidade: data.compradorConjuge.endereco.cidade.trim(),
                estado: data.compradorConjuge.endereco.estado.toUpperCase(),
              },
            }
          : null,
      vendedor: {
        nome: data.vendedor.nome.trim(),
        cpf: data.vendedor.cpf.replace(/\D/g, ''),
        rg: data.vendedor.rg.replace(/\D/g, ''),
        dataNascimento: data.vendedor.dataNascimento,
        email: data.vendedor.email.trim().toLowerCase(),
        celular: data.vendedor.celular.replace(/\D/g, ''),
        profissao: data.vendedor.profissao?.trim() || undefined,
        endereco: {
          cep: data.vendedor.endereco.cep.replace(/\D/g, ''),
          rua: data.vendedor.endereco.rua.trim(),
          numero: data.vendedor.endereco.numero.trim(),
          complemento: data.vendedor.endereco.complemento?.trim() || undefined,
          bairro: data.vendedor.endereco.bairro.trim(),
          cidade: data.vendedor.endereco.cidade.trim(),
          estado: data.vendedor.endereco.estado.toUpperCase(),
        },
      },
      vendedorConjuge:
        data.possuiVendedorConjuge && data.vendedorConjuge
          ? {
              nome: data.vendedorConjuge.nome.trim(),
              cpf: data.vendedorConjuge.cpf.replace(/\D/g, ''),
              rg: (data.vendedorConjuge.rg || '').replace(/\D/g, ''),
              dataNascimento: data.vendedorConjuge.dataNascimento,
              email: data.vendedorConjuge.email.trim().toLowerCase(),
              celular: data.vendedorConjuge.celular.replace(/\D/g, ''),
              profissao: data.vendedorConjuge.profissao?.trim() || undefined,
              endereco: {
                cep: data.vendedorConjuge.endereco.cep.replace(/\D/g, ''),
                rua: data.vendedorConjuge.endereco.rua.trim(),
                numero: data.vendedorConjuge.endereco.numero.trim(),
                complemento:
                  data.vendedorConjuge.endereco.complemento?.trim() ||
                  undefined,
                bairro: data.vendedorConjuge.endereco.bairro.trim(),
                cidade: data.vendedorConjuge.endereco.cidade.trim(),
                estado: data.vendedorConjuge.endereco.estado.toUpperCase(),
              },
            }
          : null,
      imovel: {
        cep: data.imovel.cep.replace(/\D/g, ''),
        endereco: data.imovel.endereco.trim(),
        numero: data.imovel.numero.trim(),
        complemento: data.imovel.complemento?.trim() || undefined,
        bairro: data.imovel.bairro.trim(),
        cidade: data.imovel.cidade.trim(),
        estado: data.imovel.estado.toUpperCase(),
        codigo: data.imovel.codigo.trim(),
      },
      financeiro: {
        valorVenda: getNumericValue(data.valorVenda),
        comissaoTotal: getNumericValue(data.comissaoTotal),
        valorMeta: getNumericValue(data.valorMeta),
      },
      comissoes: {
        // Backend exige UUID em id; usar corretorId (UUID do temp-uniao-users) e ignorar linhas sem UUID válido
        corretores: data.comissoesCorretores
          .filter(c =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
              (c.corretorId || '').trim()
            )
          )
          .map(c => {
            const captadores =
              (c.captadores?.length ?? 0) > 0
                ? (c.captadores ?? [])
                    .slice(0, 3)
                    .filter(cap => (cap.id || '').trim())
                    .map(cap => ({
                      id: cap.id.trim(),
                      nome: cap.nome?.trim() || undefined,
                      porcentagem:
                        cap.porcentagem != null && !Number.isNaN(Number(cap.porcentagem))
                          ? Math.min(100, Math.max(0, Number(cap.porcentagem)))
                          : undefined,
                    }))
                : c.captador?.trim()
                  ? [{ id: c.captador.trim(), nome: undefined, porcentagem: undefined }]
                  : [];
            const item: {
              id: string;
              porcentagem: number;
              captador: string | null;
              captadores?: Array<{ id: string; nome?: string; porcentagem?: number }>;
            } = {
              id: (c.corretorId || '').trim(),
              porcentagem: c.porcentagem,
              captador: c.captador?.trim() || null,
            };
            if (captadores.length > 0) item.captadores = captadores;
            return item;
          }),
        gerencias: data.comissoesGerencias,
      },
      colaboradores: {
        preAtendimento: data.colaboradorPreAtendimento?.trim() || undefined,
        centralCaptacao: data.colaboradorCentralCaptacao?.trim() || undefined,
      },
    };
  };

  // Enviar para API (chamado após confirmação) – POST (criar) ou PATCH (atualizar quando abriu por link)
  const sendToApi = async (payload: CreateSaleFormDto) => {
    setIsSubmitting(true);

    try {
      const isEdicao = !!fichaIdFromUrl;
      console.log('📋 Dados da Ficha de Venda:', payload);
      console.log(
        '🌐',
        isEdicao
          ? `PATCH ${API_BASE_URL}/api/ficha-venda/${fichaIdFromUrl}`
          : `POST ${API_BASE_URL}/api/ficha-venda`
      );

      const response = isEdicao
        ? await atualizarFichaVendaPorId(fichaIdFromUrl!, payload)
        : await criarFichaVenda(payload);

      console.log('✅ Resposta da API:', response);

      // Atualizar lista de fichas da equipe (gestor) via API
      if (userCpf) {
        listarFichasVenda({ gestorCpf: userCpf })
          .then(res => {
            const fichas = (res.data?.fichas ?? []).map(f => ({
              id: f.id,
              numero: f.numero ?? f.formNumber ?? '',
              dataVenda: f.dataVenda ?? f.venda?.dataVenda ?? '',
              valorVenda: f.valorVenda ?? f.financeiro?.valorVenda ?? 0,
              createdAt: f.createdAt ?? '',
              dados: undefined,
              status: f.status,
            }));
            setFichasEnviadas(fichas);
          })
          .catch(() => {});
      }
      loadHistoricoDados();

      setShowConfirmModal(false);
      setPendingPayload(null);
      if (pendingPayload?.status === 'disponivel') {
        setFinalizarAoSalvar(false);
        // Limpar tudo e ir para nova ficha em branco
        resetForm();
        setLoadedFichaFormNumber(null);
        setLoadedFichaStatus(null);
        localStorage.removeItem('ficha_venda_draft');
        setShowShareModal(false);
        setHasLoadedFichaById(true);
        navigate('/ficha-venda', { replace: true });
      }

      showSuccess(`✅ ${response.message}`, { autoClose: 5000 });

      if (pendingPayload?.status === 'disponivel') {
        // Já tratado acima: nova ficha em branco
      } else if (isEdicao) {
        // Continuar preenchimento: manter formulário e URL
        setHasLoadedFichaById(true);
      } else {
        // Nova ficha: ir para a URL com id para permitir compartilhar e próximos saves como PATCH
        localStorage.removeItem('ficha_venda_draft');
        navigate(`/ficha-venda/${response.data.id}`, { replace: true });
        setHasLoadedFichaById(false); // permitir que o efeito não faça GET de novo (opcional: já temos dados)
        // Opcional: abrir modal de compartilhar
        const baseUrl =
          window.location.origin +
          (window.location.pathname.split('/ficha-venda')[0] || '');
        setShareLink(`${baseUrl}/ficha-venda/${response.data.id}`);
        setTimeout(() => setShowShareModal(true), 800);
      }
    } catch (error: any) {
      console.error('Erro ao enviar ficha de venda:', error);
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors
          .map((err: any) => `${err.field}: ${err.message}`)
          .join('\n');
        showError(`${error.message}\n\n${errorMessages}`, { autoClose: 8000 });
      } else {
        showError(
          error.message ||
            (fichaIdFromUrl
              ? 'Erro ao salvar alterações.'
              : 'Erro ao cadastrar ficha de venda. Tente novamente.'),
          { autoClose: 6000 }
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit - mostra modal de confirmação
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

  const onSubmit = async (data: FichaVendaForm) => {
    // Validar todos os campos obrigatórios
    const isValid = await trigger();

    if (!isValid) {
      // Encontrar o primeiro campo com erro usando função auxiliar
      const firstError = findFirstError(errors);

      if (firstError) {
        // Mostrar toast de erro
        showError(firstError.message);

        // Fazer scroll para o primeiro campo com erro
        setTimeout(() => {
          // Tentar encontrar o campo pelo name
          let fieldElement = document.querySelector(
            `[name="${firstError.field}"]`
          ) as HTMLElement;

          // Se não encontrar, tentar por ID
          if (!fieldElement) {
            fieldElement = document.querySelector(
              `#${firstError.field}`
            ) as HTMLElement;
          }

          // Se ainda não encontrar, tentar por data-field
          if (!fieldElement) {
            fieldElement = document.querySelector(
              `[data-field="${firstError.field}"]`
            ) as HTMLElement;
          }

          // Se encontrou o campo, fazer scroll e focus
          if (fieldElement) {
            fieldElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            // Tentar fazer focus no input dentro do campo se for um container
            const input = fieldElement.querySelector(
              'input, select, textarea'
            ) as HTMLElement | null;
            if (input) {
              input.focus();
            } else if (fieldElement instanceof HTMLElement) {
              fieldElement.focus();
            }
          } else {
            // Se não encontrou o campo específico, tentar encontrar a seção relacionada
            const sectionKey = firstError.field.split('.')[0];
            const sectionElement = document.querySelector(
              `[data-section="${sectionKey}"]`
            ) as HTMLElement;
            if (sectionElement) {
              sectionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }
        }, 100);
      } else {
        // Fallback: erro genérico
        showError('Por favor, preencha todos os campos obrigatórios.');
      }

      return;
    }

    // COMISSÕES: NÃO exige 100%. Regra: se há itens, soma > 0 (não voltar a fixar 100%).
    const temComissoes =
      comissoesCorretores.length > 0 || comissoesGerencias.length > 0;
    if (temComissoes && totalPorcentagens <= 0) {
      showError('Informe ao menos uma porcentagem de comissão.');
      setTimeout(() => {
        const comissoesSection = document.querySelector(
          '[data-section="comissoes"]'
        ) as HTMLElement;
        if (comissoesSection) {
          comissoesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
      return;
    }

    // Em edição: só chama PATCH se houve alteração (evita 400 e chamadas desnecessárias)
    if (fichaIdFromUrl && !isDirty) {
      showInfo('Nenhuma alteração para salvar.');
      return;
    }

    // Preparar payload (incluir status: rascunho ou disponivel quando "Finalizar ficha")
    const status: StatusFichaProposta = finalizarAoSalvar
      ? 'disponivel'
      : (loadedFichaStatus ?? 'rascunho');
    const payload = { ...preparePayload(data), status };

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
    setFinalizarAoSalvar(false);
  };

  // Limpar rascunho
  const handleClearDraft = () => {
    if (
      window.confirm(
        'Deseja realmente limpar o formulário? Todos os dados não salvos serão perdidos.'
      )
    ) {
      localStorage.removeItem('ficha_venda_draft');
      resetForm();
      // Limpar parâmetro shared da URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('shared');
      setSearchParams(newSearchParams);
      showInfo('Formulário limpo com sucesso.');
    }
  };

  // Preencher ficha de venda a partir da proposta selecionada (gestor)
  const handleSelecionarProposta = async (propostaId: string) => {
    setPropostaSelecionadaId(propostaId);
    if (!propostaId || !userCpf) return;
    try {
      const result = await buscarPropostaPorId(propostaId, {
        gestorCpf: userCpf,
      });
      if (!result.success || !result.data?.id) {
        showError('Proposta não encontrada ou sem permissão.');
        return;
      }
      const propostaData: PropostaListItem = result.data;
      const base = getDefaultValues();
      const fromP = mapPropostaDataToFichaVendaForm(propostaData);
      const merged = { ...base };
      (Object.keys(fromP) as (keyof FichaVendaForm)[]).forEach(k => {
        const v = fromP[k];
        if (v !== undefined) (merged as any)[k] = v;
      });
      reset(merged);
      setExpandedSections({
        metadados: true,
        comprador: true,
        compradorConjuge: !!merged.possuiCompradorConjuge,
        vendedor: true,
        vendedorConjuge: !!merged.possuiVendedorConjuge,
        imovel: true,
        financeiro: true,
        comissoes: true,
        colaboradores: true,
      });
      showSuccess(
        'Ficha de venda preenchida com os dados da proposta. Revise e complete os campos que faltarem.'
      );
    } catch (err: any) {
      console.error('Erro ao carregar proposta:', err);
      showError(err?.message ?? 'Erro ao carregar proposta.');
    }
  };

  // Compartilhar a qualquer momento: salva no back só se houver alteração e obrigatórios preenchidos; senão só exibe o link
  const handleShareFicha = async () => {
    const baseUrl =
      window.location.origin +
      (window.location.pathname.split('/ficha-venda')[0] || '');
    if (fichaIdFromUrl) {
      const data = getValues();
      if (isDirty && hasMinimalRequiredForSave(data)) {
        setIsSavingForShare(true);
        try {
          // Não enviar status no PATCH de compartilhar: backend preserva o atual (evita sobrescrever "disponivel")
          const payload = { ...preparePayload(data) } as CreateSaleFormDto;
          await atualizarFichaVendaPorId(fichaIdFromUrl, payload);
        } catch (err: any) {
          console.error('Erro ao salvar progresso para compartilhar:', err);
          showError(
            err?.message ?? 'Erro ao salvar progresso. Tente novamente.'
          );
          setIsSavingForShare(false);
          return;
        } finally {
          setIsSavingForShare(false);
        }
      }
      setShareLink(`${baseUrl}/ficha-venda/${fichaIdFromUrl}`);
      setShowShareModal(true);
      return;
    }
    // Ainda não tem ficha: criar (POST) para obter id e gerar o link
    const valid = await trigger();
    if (!valid) {
      showError(
        'Preencha os campos obrigatórios para criar a ficha e gerar o link de compartilhamento.'
      );
      return;
    }
    // COMISSÕES: NÃO exige 100% (não voltar a exigir). Só exige soma > 0 quando há itens.
    const corretores = watch('comissoesCorretores') || [];
    const gerencias = watch('comissoesGerencias') || [];
    const temComissoes = corretores.length > 0 || gerencias.length > 0;
    const somaComissoes =
      (corretores as { porcentagem?: number }[]).reduce(
        (s, c) => s + (c.porcentagem || 0),
        0
      ) +
      (gerencias as { porcentagem?: number }[]).reduce(
        (s, g) => s + (g.porcentagem || 0),
        0
      );
    if (temComissoes && somaComissoes <= 0) {
      showError(
        'Informe ao menos uma porcentagem de comissão para criar a ficha e gerar o link.'
      );
      return;
    }
    setIsSavingForShare(true);
    try {
      const payload = {
        ...preparePayload(getValues()),
        status: 'rascunho' as const,
      };
      const response = await criarFichaVenda(payload);
      const id = response.data?.id;
      if (!id) throw new Error('Resposta da API sem id');
      setShareLink(`${baseUrl}/ficha-venda/${id}`);
      navigate(`/ficha-venda/${id}`, { replace: true });
      setShowShareModal(true);
      setLoadedFichaFormNumber(response.data?.numero ?? null);
      setLoadedFichaStatus('rascunho');
      showSuccess(
        'Ficha criada. Compartilhe o link para outra pessoa continuar o preenchimento.'
      );
      if (userCpf) {
        listarFichasVenda({ gestorCpf: userCpf })
          .then(res => {
            const fichas = (res.data?.fichas ?? []).map(f => ({
              id: f.id,
              numero: f.numero ?? f.formNumber ?? '',
              dataVenda: f.dataVenda ?? f.venda?.dataVenda ?? '',
              valorVenda: f.valorVenda ?? f.financeiro?.valorVenda ?? 0,
              createdAt: f.createdAt ?? '',
              dados: undefined,
              status: f.status,
            }));
            setFichasEnviadas(fichas);
          })
          .catch(() => {});
      }
    } catch (err: any) {
      console.error('Erro ao criar ficha para compartilhar:', err);
      showError(
        err?.message ??
          'Erro ao criar ficha. Preencha os campos obrigatórios e tente novamente.'
      );
    } finally {
      setIsSavingForShare(false);
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

  // Baixar PDF da ficha (somente gestor da equipe)
  const handleBaixarPdf = async () => {
    if (!fichaIdFromUrl || !userCpf || userTipo !== 'gestor') return;
    try {
      await baixarPdfFichaVenda(
        fichaIdFromUrl,
        userCpf,
        loadedFichaFormNumber ?? undefined
      );
      showSuccess('PDF baixado com sucesso.');
    } catch (err: any) {
      console.error('Erro ao baixar PDF:', err);
      showError(err?.message ?? 'Erro ao baixar PDF.');
    }
  };

  const handleOpenReenviarEmail = () => {
    setReenviarEmailText('');
    setShowReenviarEmailModal(true);
  };

  const handleCloseReenviarEmail = () => {
    if (!isReenviandoEmail) {
      setShowReenviarEmailModal(false);
      setReenviarEmailText('');
    }
  };

  const handleSubmitReenviarEmail = async () => {
    if (!fichaIdFromUrl || !userCpf || userTipo !== 'gestor') return;
    const emails = reenviarEmailText
      .split(/[\n,;]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);
    const validEmails = emails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (validEmails.length === 0) {
      showError('Digite ao menos um email válido (separados por vírgula ou um por linha).');
      return;
    }
    setIsReenviandoEmail(true);
    try {
      const result = await reenviarEmailFichaVenda(fichaIdFromUrl, userCpf, validEmails);
      if (result.success) {
        showSuccess(result.message ?? 'Email reenviado com sucesso.');
        setShowReenviarEmailModal(false);
        setReenviarEmailText('');
      } else {
        showError(result.message ?? 'Falha ao reenviar email.');
      }
    } catch (err: any) {
      showError(err?.message ?? 'Erro ao reenviar email.');
    } finally {
      setIsReenviandoEmail(false);
    }
  };

  /**
   * Finalizar ficha (marca como disponível; após isso não pode mais editar).
   * COMISSÕES: NÃO exigir 100% para liberar Finalizar. Já foi alterado para 100% no passado — NÃO voltar.
   * Regra: se há itens de comissão, só exige soma > 0 (backend idem).
   */
  const handleFinalizarFicha = async () => {
    const valid = await trigger();
    if (!valid) {
      showError('Preencha todos os campos obrigatórios antes de finalizar.');
      return;
    }
    // Soma > 0 quando há itens; NUNCA exigir total === 100%
    const corretores = watch('comissoesCorretores') || [];
    const gerencias = watch('comissoesGerencias') || [];
    const temComissoes = corretores.length > 0 || gerencias.length > 0;
    const somaComissoes = totalPorcentagens;
    if (temComissoes && somaComissoes <= 0) {
      showError('Informe ao menos uma porcentagem de comissão para finalizar.');
      return;
    }
    const payload = {
      ...preparePayload(getValues()),
      status: 'disponivel' as const,
    };
    setFinalizarAoSalvar(true);
    setPendingPayload(payload);
    setShowConfirmModal(true);
  };

  // Preencher dados de exemplo
  const handleFillExampleData = () => {
    if (
      window.confirm(
        'Deseja preencher o formulário com dados de exemplo? Os dados atuais serão substituídos.'
      )
    ) {
      const exampleData: Partial<FichaVendaForm> = {
        dataVenda: new Date().toISOString().split('T')[0],
        secretariaPresentes: 'Sim',
        midiaOrigem: 'Instagram',
        gerente: 'Rafael Correa',
        unidadeVenda: 'União Esmeralda',
        possuiCompradorConjuge: true,
        possuiVendedorConjuge: false,
        comprador: {
          nome: 'João da Silva',
          cpf: '11144477735',
          rg: '123456789',
          dataNascimento: '1990-05-20',
          email: 'joao.silva@email.com',
          celular: '11987654321',
          profissao: 'Engenheiro',
          endereco: {
            cep: '01310100',
            rua: 'Avenida Paulista',
            numero: '1000',
            complemento: 'Apto 101',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP',
          },
        },
        compradorConjuge: {
          nome: 'Maria da Silva',
          cpf: '12345678909',
          rg: '987654321',
          dataNascimento: '1992-08-15',
          email: 'maria.silva@email.com',
          celular: '11912345678',
          profissao: 'Arquiteta',
          endereco: {
            cep: '01310100',
            rua: 'Avenida Paulista',
            numero: '1000',
            complemento: 'Apto 101',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP',
          },
        },
        vendedor: {
          nome: 'Pedro Santos',
          cpf: '98765432100',
          rg: '111222333',
          dataNascimento: '1985-03-10',
          email: 'pedro.santos@email.com',
          celular: '11999998888',
          profissao: 'Corretor',
          endereco: {
            cep: '04567890',
            rua: 'Rua das Flores',
            numero: '500',
            complemento: '',
            bairro: 'Jardim Paulista',
            cidade: 'São Paulo',
            estado: 'SP',
          },
        },
        vendedorConjuge: undefined,
        imovel: {
          cep: '01234567',
          endereco: 'Rua Exemplo',
          numero: '123',
          complemento: 'Bloco A',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          codigo: 'IMV-001',
        },
        valorVenda: '500000',
        comissaoTotal: '25000',
        valorMeta: '25000',
        // Comissões de corretores vazias: o backend exige UUID reais (temp-uniao-users). Preencha pelo botão "Adicionar corretor".
        comissoesCorretores: [],
        comissoesGerencias: [
          { nivel: 1, porcentagem: 5, nome: 'Rafael Correa' },
          { nivel: 2, porcentagem: 5, nome: 'Rafael Correa' },
        ],
        // Colaboradores vazios (evita enviar IDs inválidos se o backend esperar UUID)
        colaboradorPreAtendimento: '',
        colaboradorCentralCaptacao: '',
      };

      // Preencher todos os campos usando setValue
      // Campos simples
      setValue('dataVenda', exampleData.dataVenda || '');
      setValue('secretariaPresentes', exampleData.secretariaPresentes || '');
      setValue('midiaOrigem', exampleData.midiaOrigem || '');
      setValue('gerente', exampleData.gerente || '');
      setValue(
        'possuiCompradorConjuge',
        exampleData.possuiCompradorConjuge || false
      );
      setValue(
        'possuiVendedorConjuge',
        exampleData.possuiVendedorConjuge || false
      );

      // Comprador
      if (exampleData.comprador) {
        setValue('comprador.nome', exampleData.comprador.nome);
        setValue('comprador.cpf', exampleData.comprador.cpf);
        setValue('comprador.rg', exampleData.comprador.rg || '');
        setValue(
          'comprador.dataNascimento',
          exampleData.comprador.dataNascimento
        );
        setValue('comprador.email', exampleData.comprador.email);
        setValue('comprador.celular', exampleData.comprador.celular);
        setValue('comprador.profissao', exampleData.comprador.profissao);
        setValue('comprador.endereco.cep', exampleData.comprador.endereco.cep);
        setValue('comprador.endereco.rua', exampleData.comprador.endereco.rua);
        setValue(
          'comprador.endereco.numero',
          exampleData.comprador.endereco.numero
        );
        setValue(
          'comprador.endereco.complemento',
          exampleData.comprador.endereco.complemento
        );
        setValue(
          'comprador.endereco.bairro',
          exampleData.comprador.endereco.bairro
        );
        setValue(
          'comprador.endereco.cidade',
          exampleData.comprador.endereco.cidade
        );
        setValue(
          'comprador.endereco.estado',
          exampleData.comprador.endereco.estado
        );
      }

      // Comprador Cônjuge
      if (exampleData.compradorConjuge) {
        setValue('compradorConjuge.nome', exampleData.compradorConjuge.nome);
        setValue('compradorConjuge.cpf', exampleData.compradorConjuge.cpf);
        setValue('compradorConjuge.rg', exampleData.compradorConjuge.rg || '');
        setValue(
          'compradorConjuge.dataNascimento',
          exampleData.compradorConjuge.dataNascimento
        );
        setValue('compradorConjuge.email', exampleData.compradorConjuge.email);
        setValue(
          'compradorConjuge.celular',
          exampleData.compradorConjuge.celular
        );
        setValue(
          'compradorConjuge.profissao',
          exampleData.compradorConjuge.profissao
        );
        setValue(
          'compradorConjuge.endereco.cep',
          exampleData.compradorConjuge.endereco.cep
        );
        setValue(
          'compradorConjuge.endereco.rua',
          exampleData.compradorConjuge.endereco.rua
        );
        setValue(
          'compradorConjuge.endereco.numero',
          exampleData.compradorConjuge.endereco.numero
        );
        setValue(
          'compradorConjuge.endereco.complemento',
          exampleData.compradorConjuge.endereco.complemento
        );
        setValue(
          'compradorConjuge.endereco.bairro',
          exampleData.compradorConjuge.endereco.bairro
        );
        setValue(
          'compradorConjuge.endereco.cidade',
          exampleData.compradorConjuge.endereco.cidade
        );
        setValue(
          'compradorConjuge.endereco.estado',
          exampleData.compradorConjuge.endereco.estado
        );
      }

      // Vendedor
      if (exampleData.vendedor) {
        setValue('vendedor.nome', exampleData.vendedor.nome);
        setValue('vendedor.cpf', exampleData.vendedor.cpf);
        setValue('vendedor.rg', exampleData.vendedor.rg || '');
        setValue(
          'vendedor.dataNascimento',
          exampleData.vendedor.dataNascimento
        );
        setValue('vendedor.email', exampleData.vendedor.email);
        setValue('vendedor.celular', exampleData.vendedor.celular);
        setValue('vendedor.profissao', exampleData.vendedor.profissao);
        setValue('vendedor.endereco.cep', exampleData.vendedor.endereco.cep);
        setValue('vendedor.endereco.rua', exampleData.vendedor.endereco.rua);
        setValue(
          'vendedor.endereco.numero',
          exampleData.vendedor.endereco.numero
        );
        setValue(
          'vendedor.endereco.complemento',
          exampleData.vendedor.endereco.complemento
        );
        setValue(
          'vendedor.endereco.bairro',
          exampleData.vendedor.endereco.bairro
        );
        setValue(
          'vendedor.endereco.cidade',
          exampleData.vendedor.endereco.cidade
        );
        setValue(
          'vendedor.endereco.estado',
          exampleData.vendedor.endereco.estado
        );
      }

      // Imóvel
      if (exampleData.imovel) {
        setValue('imovel.cep', exampleData.imovel.cep);
        setValue('imovel.endereco', exampleData.imovel.endereco);
        setValue('imovel.numero', exampleData.imovel.numero);
        setValue('imovel.complemento', exampleData.imovel.complemento);
        setValue('imovel.bairro', exampleData.imovel.bairro);
        setValue('imovel.cidade', exampleData.imovel.cidade);
        setValue('imovel.estado', exampleData.imovel.estado);
        setValue('imovel.codigo', exampleData.imovel.codigo);
      }

      // Financeiro
      setValue('valorVenda', exampleData.valorVenda || '');
      setValue('comissaoTotal', exampleData.comissaoTotal || '');
      setValue('valorMeta', exampleData.valorMeta || '');

      // Comissões
      setValue('comissoesCorretores', exampleData.comissoesCorretores || []);
      setValue('comissoesGerencias', exampleData.comissoesGerencias || []);

      // Colaboradores
      setValue(
        'colaboradorPreAtendimento',
        exampleData.colaboradorPreAtendimento || ''
      );
      setValue(
        'colaboradorCentralCaptacao',
        exampleData.colaboradorCentralCaptacao || ''
      );

      // Expandir todas as seções
      setExpandedSections({
        metadados: true,
        comprador: true,
        compradorConjuge: true,
        vendedor: true,
        vendedorConjuge: false,
        imovel: true,
        financeiro: true,
        comissoes: true,
        colaboradores: true,
      });

      showSuccess('Formulário preenchido com dados de exemplo!');
    }
  };

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
              📄 Ficha de Venda
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

  // Ficha de Venda é somente para gestores; corretores não acessam
  if (userTipo === 'corretor') {
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
            maxWidth: '480px',
            width: '100%',
            background: 'var(--color-card-background)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          {(import.meta.env.VITE_LOGO_URL_UNIAO as string) && (
            <img
              src={import.meta.env.VITE_LOGO_URL_UNIAO as string}
              alt='União'
              style={{
                maxWidth: '160px',
                height: 'auto',
                marginBottom: '24px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          )}
          <PageTitle style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
            Acesso restrito a gestores
          </PageTitle>
          <PageSubtitle
            style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '24px',
            }}
          >
            A Ficha de Venda é utilizada apenas por gestores. Você está logado
            como corretor. Para cadastrar propostas de compra, use a Ficha de
            Proposta.
          </PageSubtitle>
          <Button
            type='button'
            $variant='primary'
            onClick={handleLogout}
            style={{ padding: '12px 24px' }}
          >
            Sair
          </Button>
        </div>
      </FichaVendaContainer>
    );
  }

  if (isLoading || loadingFichaById) {
    return (
      <FichaVendaContainer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--color-primary)20',
              borderTop: '4px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {loadingFichaById
              ? 'Carregando ficha para continuar preenchimento...'
              : 'Carregando formulário...'}
          </p>
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
      <SelectCorretorModal
        isOpen={showAddCorretorComissaoModal}
        onClose={() => setShowAddCorretorComissaoModal(false)}
        onSelect={addCorretorFromList}
        title='Adicionar corretor à comissão'
        confirmButtonText='Adicionar'
      />
      {/* Modal Importar porcentagens */}
      {showImportPorcentagensModal && (
        <ModalOverlay
          $isOpen={showImportPorcentagensModal}
          onClick={() =>
            !importingPorcentagens && setShowImportPorcentagensModal(false)
          }
        >
          <ModalContainer
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '480px' }}
          >
            <ModalHeader>
              <ModalTitle>
                <MdCloudUpload size={24} />
                Importar porcentagens
              </ModalTitle>
              <ModalCloseButton
                onClick={() =>
                  !importingPorcentagens &&
                  setShowImportPorcentagensModal(false)
                }
                disabled={importingPorcentagens}
              >
                <MdClose />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p
                style={{
                  marginBottom: '16px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                }}
              >
                Envie uma planilha com <strong>2 colunas</strong>:{' '}
                <strong>CPF</strong> (do corretor) e{' '}
                <strong>Porcentagem</strong> (0–100). Formatos aceitos: Excel
                (.xlsx) ou CSV.
              </p>
              <FormGroup>
                <FormLabel>Arquivo</FormLabel>
                <FormInput
                  type='file'
                  accept='.xlsx,.csv'
                  onChange={e =>
                    setFilePorcentagens(e.target.files?.[0] ?? null)
                  }
                  style={{ padding: '8px' }}
                />
                {filePorcentagens && (
                  <HelperText style={{ marginTop: '8px' }}>
                    {filePorcentagens.name} (
                    {(filePorcentagens.size / 1024).toFixed(1)} KB)
                  </HelperText>
                )}
              </FormGroup>
              <FormGroup>
                <FormLabel>
                  Senha de aprovação <RequiredIndicator>*</RequiredIndicator>
                </FormLabel>
                <FormInput
                  type='password'
                  value={importPorcentagensPassword}
                  onChange={e => setImportPorcentagensPassword(e.target.value)}
                  placeholder='Senha para autorizar a importação'
                  autoComplete='off'
                />
                <HelperText>
                  Obrigatória para autorizar a atualização das porcentagens dos
                  corretores.
                </HelperText>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                $variant='secondary'
                onClick={() => setShowImportPorcentagensModal(false)}
                disabled={importingPorcentagens}
              >
                Cancelar
              </ModalButton>
              <ModalButton
                $variant='primary'
                onClick={handleImportPorcentagens}
                disabled={
                  !filePorcentagens ||
                  !importPorcentagensPassword.trim() ||
                  importingPorcentagens
                }
              >
                {importingPorcentagens ? (
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
                  <>Enviar</>
                )}
              </ModalButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          height: 'auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'var(--color-background)',
          padding: '0',
          margin: '0',
          position: 'relative',
        }}
      >
        <FichaVendaContainer
          style={{
            padding:
              windowWidth > 768
                ? '0 48px 64px 48px'
                : windowWidth <= 480
                  ? '0 12px 40px 12px'
                  : '0 24px 48px 24px',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Modal bloqueante: acesso negado — usuário não vê nem acessa a ficha */}
          {fichaAccessDenied && (
            <BlockingOverlay>
              <BlockingModalCard>
                <BlockingModalIcon>
                  <MdError size={40} />
                </BlockingModalIcon>
                <BlockingModalTitle>Acesso negado</BlockingModalTitle>
                <BlockingModalMessage>
                  Somente o gestor vinculado a esta ficha (CPF cadastrado na
                  unidade) pode listar, visualizar e editar. Faça login com o
                  CPF do gestor da ficha ou acesse com outro link.
                </BlockingModalMessage>
                <Button
                  type='button'
                  $variant='primary'
                  onClick={() => navigate('/ficha-venda', { replace: true })}
                  style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}
                >
                  Ir para Ficha de Venda
                </Button>
              </BlockingModalCard>
            </BlockingOverlay>
          )}

          {/* Modal bloqueante: ficha não encontrada */}
          {fichaNotFound && !fichaAccessDenied && (
            <BlockingOverlay>
              <BlockingModalCard>
                <BlockingModalIcon>
                  <MdError size={40} />
                </BlockingModalIcon>
                <BlockingModalTitle>Ficha não encontrada</BlockingModalTitle>
                <BlockingModalMessage>
                  O link pode estar incorreto ou a ficha foi removida.
                </BlockingModalMessage>
                <Button
                  type='button'
                  $variant='primary'
                  onClick={() => navigate('/ficha-venda', { replace: true })}
                  style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}
                >
                  Criar nova ficha
                </Button>
              </BlockingModalCard>
            </BlockingOverlay>
          )}

          {/* Conteúdo da ficha só é exibido quando não há acesso negado e ficha existe */}
          {!fichaAccessDenied && !fichaNotFound && (
            <>
              <PageHeader>
                <PageHeaderTitle>
                  <PageTitle>📋 Ficha de Venda de Terceiros</PageTitle>
                  <PageSubtitle>
                    Preencha todas as informações da venda para cadastro no
                    sistema
                  </PageSubtitle>
                  {userData && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginTop: '6px',
                      }}
                    >
                      {userTipo === 'gestor' ? 'Gestor' : 'Corretor'}:{' '}
                      {userData.nome}
                      {userData.unidade && ` · ${userData.unidade}`}
                    </div>
                  )}
                </PageHeaderTitle>
                <PageHeaderActions>
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
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.2)';
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
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    🗑️ Limpar Formulário
                  </Button>
                </PageHeaderActions>
              </PageHeader>

              {/* Preencher a partir de uma proposta (somente gestores) */}
              <div
                style={{
                  background: 'var(--color-card-background)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '32px',
                  border: '2px solid var(--color-border)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <MdPerson size={24} style={{ color: themeColors.primary }} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                    }}
                  >
                    Preencher a partir de uma proposta
                  </h3>
                </div>
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Selecione uma proposta da equipe para pré-preencher a ficha de
                  venda com comprador, vendedor, imóvel e valor.
                </p>
                <FormGroup style={{ marginBottom: 0 }}>
                  <FormLabel>Proposta</FormLabel>
                  <FormSelect
                    value={propostaSelecionadaId}
                    onChange={e => handleSelecionarProposta(e.target.value)}
                    disabled={loadingPropostas}
                    style={{ maxWidth: '100%' }}
                  >
                    <option value=''>
                      Selecione uma proposta para preencher a ficha...
                    </option>
                    {propostasList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.numero} — {p.proponente?.nome ?? 'Proponente'} —{' '}
                        {p.dataProposta
                          ? new Date(p.dataProposta).toLocaleDateString('pt-BR')
                          : ''}{' '}
                        —{' '}
                        {p.precoProposto != null
                          ? formatCurrencyValue(p.precoProposto)
                          : ''}
                      </option>
                    ))}
                  </FormSelect>
                  {loadingPropostas && (
                    <HelperText>Carregando propostas...</HelperText>
                  )}
                </FormGroup>
              </div>

              {/* Cards Indicativos */}
              <IndicativeCardsGrid
                style={{
                  gridTemplateColumns:
                    windowWidth > 768
                      ? 'repeat(auto-fit, minmax(280px, 1fr))'
                      : '1fr',
                  gap: '24px',
                  marginBottom: '40px',
                }}
              >
                <div
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                    borderRadius: '20px',
                    padding: '28px',
                    color: 'white',
                    boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px ${themeColors.primary}66`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${themeColors.primary}4D`;
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      filter: 'blur(40px)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          opacity: 0.95,
                        }}
                      >
                        Valor da Venda
                      </div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <MdAttachMoney size={24} />
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {watch('valorVenda')
                        ? formatCurrencyValue(
                            getNumericValue(watch('valorVenda'))
                          )
                        : 'R$ 0,00'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryLight} 100%)`,
                    borderRadius: '20px',
                    padding: '28px',
                    color: 'white',
                    boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px ${themeColors.primary}66`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${themeColors.primary}4D`;
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      filter: 'blur(40px)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          opacity: 0.95,
                        }}
                      >
                        Valor de Meta (5%)
                      </div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <MdCheckCircle size={24} />
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {watch('valorMeta')
                        ? formatCurrencyValue(
                            getNumericValue(watch('valorMeta'))
                          )
                        : 'R$ 0,00'}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                    borderRadius: '20px',
                    padding: '28px',
                    color: 'white',
                    boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 32px ${themeColors.primary}66`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${themeColors.primary}4D`;
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      filter: 'blur(40px)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          opacity: 0.95,
                        }}
                      >
                        Total de Comissões
                      </div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <MdPeople size={24} />
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {totalPorcentagens.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background:
                      totalPorcentagens > 0
                        ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`
                        : `linear-gradient(135deg, ${themeColors.error} 0%, ${themeColors.errorDark} 100%)`,
                    borderRadius: '20px',
                    padding: '28px',
                    color: 'white',
                    boxShadow:
                      totalPorcentagens > 0
                        ? `0 8px 24px ${themeColors.primary}4D`
                        : `0 8px 24px ${themeColors.error}4D`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      totalPorcentagens > 0
                        ? `0 12px 32px ${themeColors.primary}66`
                        : `0 12px 32px ${themeColors.error}66`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      totalPorcentagens > 0
                        ? `0 8px 24px ${themeColors.primary}4D`
                        : `0 8px 24px ${themeColors.error}4D`;
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      filter: 'blur(40px)',
                    }}
                  />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          opacity: 0.95,
                        }}
                      >
                        Status
                      </div>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {totalPorcentagens > 0 ? (
                          <MdCheckCircle size={24} />
                        ) : (
                          <MdError size={24} />
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {hasSavedData ? 'Rascunho' : 'Novo'}
                    </div>
                  </div>
                </div>
              </IndicativeCardsGrid>

              {/* Fichas Anteriores */}
              <div
                style={{
                  background: 'var(--color-card-background)',
                  borderRadius: '20px',
                  padding: '32px',
                  marginBottom: '40px',
                  border: '2px solid var(--color-border)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: `0 4px 12px ${themeColors.primary}4D`,
                      }}
                    >
                      <MdSave size={24} />
                    </div>
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: 'var(--color-text)',
                        }}
                      >
                        Fichas Anteriores ({fichasEnviadas.length})
                      </h3>
                      {corretorSelecionado && (
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)',
                            marginTop: '4px',
                          }}
                        >
                          Corretor: {corretorSelecionado.nome}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      type='button'
                      $variant='secondary'
                      onClick={() => setShowSelectCorretorModal(true)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: 600,
                      }}
                    >
                      <MdPerson style={{ marginRight: '8px' }} />
                      Trocar Corretor
                    </Button>
                    <Button
                      type='button'
                      $variant='secondary'
                      onClick={() =>
                        setShowFichasAnteriores(!showFichasAnteriores)
                      }
                      style={{
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {showFichasAnteriores ? 'Ocultar' : 'Ver Fichas'}
                    </Button>
                  </div>
                </div>

                {showFichasAnteriores && (
                  <>
                    {/* Filtros: data e busca (gestor/super user) */}
                    {userTipo === 'gestor' && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px',
                          alignItems: 'flex-end',
                          marginBottom: '20px',
                          padding: '16px',
                          background: 'var(--color-background-secondary)',
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <label
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <span
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            Data início
                          </span>
                          <input
                            type='date'
                            value={filtroDataInicioFicha}
                            onChange={e =>
                              setFiltroDataInicioFicha(e.target.value)
                            }
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.9375rem',
                            }}
                          />
                        </label>
                        <label
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '0.875rem',
                          }}
                        >
                          <span
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            Data fim
                          </span>
                          <input
                            type='date'
                            value={filtroDataFimFicha}
                            onChange={e =>
                              setFiltroDataFimFicha(e.target.value)
                            }
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.9375rem',
                            }}
                          />
                        </label>
                        <label
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '0.875rem',
                            flex: '1',
                            minWidth: '180px',
                          }}
                        >
                          <span
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            Busca
                          </span>
                          <input
                            type='text'
                            placeholder='Número, comprador, CPF, endereço'
                            value={filtroSearchFicha}
                            onChange={e => setFiltroSearchFicha(e.target.value)}
                            onKeyDown={e =>
                              e.key === 'Enter' && aplicarFiltrosFichas()
                            }
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.9375rem',
                            }}
                          />
                        </label>
                        <Button
                          type='button'
                          $variant='primary'
                          onClick={aplicarFiltrosFichas}
                          disabled={loadingFichas}
                          style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            fontWeight: 600,
                          }}
                        >
                          {loadingFichas ? 'Filtrando...' : 'Filtrar'}
                        </Button>
                        <Button
                          type='button'
                          $variant='secondary'
                          onClick={() => {
                            setFiltroDataInicioFicha('');
                            setFiltroDataFimFicha('');
                            setFiltroSearchFicha('');
                            if (userCpf) {
                              setLoadingFichas(true);
                              listarFichasVenda({ gestorCpf: userCpf })
                                .then(res => {
                                  const fichas = (res.data?.fichas ?? []).map(
                                    f => ({
                                      id: f.id,
                                      numero: f.numero ?? f.formNumber ?? '',
                                      dataVenda:
                                        f.dataVenda ?? f.venda?.dataVenda ?? '',
                                      valorVenda:
                                        f.valorVenda ??
                                        f.financeiro?.valorVenda ??
                                        0,
                                      createdAt: f.createdAt ?? '',
                                      dados: undefined,
                                      status: f.status,
                                    })
                                  );
                                  setFichasEnviadas(fichas);
                                })
                                .catch(() => setFichasEnviadas([]))
                                .finally(() => setLoadingFichas(false));
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: 600,
                          }}
                        >
                          Limpar
                        </Button>
                      </div>
                    )}
                    {loadingFichas && fichasEnviadas.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '24px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        Carregando fichas...
                      </div>
                    ) : fichasEnviadas.length > 0 ? (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fill, minmax(300px, 1fr))',
                          gap: '20px',
                        }}
                      >
                        {fichasEnviadas.map(ficha => (
                          <div
                            key={ficha.id}
                            onClick={() => navigate(`/ficha-venda/${ficha.id}`)}
                            style={{
                              background: 'var(--color-background-secondary)',
                              border: '2px solid var(--color-border)',
                              borderRadius: '16px',
                              padding: '24px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
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
                              e.currentTarget.style.transform = 'translateY(0)';
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
                                  gap: '8px',
                                  flexWrap: 'wrap',
                                }}
                              >
                                {ficha.numero}
                                {ficha.status && (
                                  <span
                                    style={{
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      background:
                                        ficha.status === 'disponivel'
                                          ? 'var(--color-success-light, #d4edda)'
                                          : 'var(--color-warning-light, #fff3cd)',
                                      color:
                                        ficha.status === 'disponivel'
                                          ? 'var(--color-success, #155724)'
                                          : 'var(--color-warning-dark, #856404)',
                                    }}
                                  >
                                    {ficha.status === 'disponivel'
                                      ? 'Disponível'
                                      : 'Rascunho'}
                                  </span>
                                )}
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
                                  Data da Venda:{' '}
                                  <strong>
                                    {new Date(
                                      ficha.dataVenda
                                    ).toLocaleDateString('pt-BR')}
                                  </strong>
                                </div>
                                <div>
                                  Enviada em:{' '}
                                  {formatarDataHora(ficha.createdAt)}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: '1.5rem',
                                  fontWeight: 700,
                                  color: themeColors.primary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <MdAttachMoney size={24} />
                                {formatCurrencyValue(ficha.valorVenda)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '48px 24px',
                          textAlign: 'center',
                          background: 'var(--color-background-secondary)',
                          borderRadius: '16px',
                          border: '2px dashed var(--color-border)',
                        }}
                      >
                        <MdSave
                          size={48}
                          style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: '16px',
                          }}
                        />
                        <p
                          style={{
                            margin: 0,
                            color: 'var(--color-text-secondary)',
                            fontSize: '1rem',
                          }}
                        >
                          Nenhuma ficha enviada ainda. As fichas enviadas com
                          sucesso aparecerão aqui.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {hasSavedData && !isFichaFinalizada && (
                <InfoBox $type='info' style={{ marginBottom: '24px' }}>
                  <InfoBoxText>
                    💾 Seus dados estão sendo salvos automaticamente. Você pode
                    continuar de onde parou.
                  </InfoBoxText>
                </InfoBox>
              )}

              {isFichaFinalizada && (
                <InfoBox $type='info' style={{ marginBottom: '24px' }}>
                  <MdCheckCircle size={20} style={{ flexShrink: 0 }} />
                  <InfoBoxText>
                    <strong>Ficha finalizada.</strong> Esta ficha não pode mais
                    ser editada. Você pode baixar o PDF no rodapé.
                  </InfoBoxText>
                </InfoBox>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ marginTop: '32px' }}
              >
                <fieldset
                  style={{ border: 'none', margin: 0, padding: 0 }}
                  disabled={isFichaFinalizada}
                >
                  {/* Bloco 1 - Metadados da Venda */}
                  <CollapsibleSection $isExpanded={expandedSections.metadados}>
                    <SectionHeader onClick={() => toggleSection('metadados')}>
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdCalendarToday />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>
                            Dados da Venda
                          </StyledSectionTitle>
                          <SectionDescription>
                            Informações gerais sobre a venda
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon $isExpanded={expandedSections.metadados}>
                        {expandedSections.metadados ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent $isExpanded={expandedSections.metadados}>
                      <FormGrid $columns={2}>
                        <FormGroup>
                          <FormLabel>
                            Data da Venda{' '}
                            <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='date'
                            {...register('dataVenda', {
                              required: 'Data da venda é obrigatória',
                            })}
                            $hasError={!!errors.dataVenda}
                          />
                          {errors.dataVenda && (
                            <ErrorMessage>
                              {errors.dataVenda.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Espumante de Brinde (Secretaria de Vendas)
                          </FormLabel>
                          <FormSelect {...register('secretariaPresentes')}>
                            <option value=''>Selecione...</option>
                            <option value='Sim'>Sim</option>
                            <option value='Não'>Não</option>
                          </FormSelect>
                          <HelperText>
                            Espumante de brinde para o cliente
                          </HelperText>
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>Mídia de Origem</FormLabel>
                          {!midiaOutro ? (
                            <FormSelect
                              {...register('midiaOrigem')}
                              onChange={e => {
                                const value = e.target.value;
                                if (value === 'Outro') {
                                  setMidiaOutro(true);
                                  setValue('midiaOrigem', '');
                                } else {
                                  setValue('midiaOrigem', value);
                                }
                              }}
                            >
                              <option value=''>Selecione...</option>
                              <option value='Instagram'>Instagram</option>
                              <option value='Facebook'>Facebook</option>
                              <option value='Google'>Google</option>
                              <option value='Google Ads'>Google Ads</option>
                              <option value='Facebook Ads'>Facebook Ads</option>
                              <option value='LinkedIn'>LinkedIn</option>
                              <option value='YouTube'>YouTube</option>
                              <option value='TikTok'>TikTok</option>
                              <option value='WhatsApp'>WhatsApp</option>
                              <option value='Indicação'>Indicação</option>
                              <option value='Site'>Site</option>
                              <option value='Jornal'>Jornal</option>
                              <option value='Rádio'>Rádio</option>
                              <option value='TV'>TV</option>
                              <option value='Outro'>Outro</option>
                            </FormSelect>
                          ) : (
                            <div>
                              <FormSelect
                                value='Outro'
                                onChange={e => {
                                  if (e.target.value !== 'Outro') {
                                    setMidiaOutro(false);
                                    setValue('midiaOrigem', e.target.value);
                                  }
                                }}
                                style={{ marginBottom: '8px' }}
                              >
                                <option value='Outro'>Outro</option>
                                <option value='Instagram'>Instagram</option>
                                <option value='Facebook'>Facebook</option>
                                <option value='Google'>Google</option>
                                <option value='Google Ads'>Google Ads</option>
                                <option value='Facebook Ads'>
                                  Facebook Ads
                                </option>
                                <option value='LinkedIn'>LinkedIn</option>
                                <option value='YouTube'>YouTube</option>
                                <option value='TikTok'>TikTok</option>
                                <option value='WhatsApp'>WhatsApp</option>
                                <option value='Indicação'>Indicação</option>
                                <option value='Site'>Site</option>
                                <option value='Jornal'>Jornal</option>
                                <option value='Rádio'>Rádio</option>
                                <option value='TV'>TV</option>
                              </FormSelect>
                              <FormInput
                                type='text'
                                {...register('midiaOrigem', {
                                  required: 'Digite a mídia de origem',
                                })}
                                placeholder='Digite a mídia de origem'
                                $hasError={!!errors.midiaOrigem}
                                onChange={e =>
                                  setValue('midiaOrigem', e.target.value)
                                }
                              />
                            </div>
                          )}
                          {midiaOutro && errors.midiaOrigem && (
                            <ErrorMessage>
                              {errors.midiaOrigem.message}
                            </ErrorMessage>
                          )}
                          <HelperText>Preenchido pelo gestor</HelperText>
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>Gerente</FormLabel>
                          <FormSelect
                            {...register('gerente')}
                            $hasError={!!errors.gerente}
                            style={{ width: '100%', minWidth: 0 }}
                          >
                            <option value=''>Selecione o gerente...</option>
                            {gestoresDisponiveis.map(g => (
                              <option key={g.id} value={g.nome}>
                                {g.nome}
                                {g.unidade ? ` · ${g.unidade}` : ''}
                              </option>
                            ))}
                          </FormSelect>
                          {loadingGestores && (
                            <HelperText>Carregando gestores...</HelperText>
                          )}
                          {!loadingGestores && (
                            <HelperText>
                              Gerente responsável (opcional)
                            </HelperText>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Unidade de Venda{' '}
                            <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormSelect
                            {...register('unidadeVenda', {
                              required: 'Unidade de venda é obrigatória',
                            })}
                            $hasError={!!errors.unidadeVenda}
                          >
                            <option value=''>Selecione...</option>
                            {UNIDADES.map(unidade => (
                              <option key={unidade} value={unidade}>
                                {unidade}
                              </option>
                            ))}
                          </FormSelect>
                          {errors.unidadeVenda && (
                            <ErrorMessage>
                              {errors.unidadeVenda.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>
                      </FormGrid>
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 2 - Comprador */}
                  <CollapsibleSection $isExpanded={expandedSections.comprador}>
                    <SectionHeader onClick={() => toggleSection('comprador')}>
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdPerson />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>Comprador</StyledSectionTitle>
                          <SectionDescription>
                            Dados pessoais do comprador
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon $isExpanded={expandedSections.comprador}>
                        {expandedSections.comprador ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent $isExpanded={expandedSections.comprador}>
                      <FormGrid $columns={2}>
                        <FormGroup>
                          <FormLabel>
                            Nome Completo{' '}
                            <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <AutocompleteWrapper>
                            <FormInput
                              type='text'
                              {...register('comprador.nome', {
                                required: 'Nome é obrigatório',
                              })}
                              placeholder='Digite o nome completo'
                              $hasError={!!errors.comprador?.nome}
                              list='historico-nomes'
                              autoComplete='off'
                            />
                            <datalist id='historico-nomes'>
                              {historicoDados.nomes.map((nome, idx) => (
                                <option key={idx} value={nome} />
                              ))}
                            </datalist>
                          </AutocompleteWrapper>
                          {historicoDados.nomes.length > 0 && (
                            <HistoricoButton
                              type='button'
                              onClick={() => {
                                if (historicoDados.nomes.length > 0) {
                                  const nome = historicoDados.nomes[0];
                                  setValue('comprador.nome', nome);
                                  // Tentar encontrar dados completos deste nome
                                  const fichas = loadFichasEnviadas(userCpf);
                                  const ficha = fichas.find(
                                    f =>
                                      f.dados?.comprador?.nome === nome ||
                                      f.dados?.vendedor?.nome === nome
                                  );
                                  if (ficha?.dados?.comprador?.nome === nome) {
                                    const dados = ficha.dados.comprador;
                                    if (dados.cpf)
                                      setValue(
                                        'comprador.cpf',
                                        maskCPF(dados.cpf)
                                      );
                                    if (dados.dataNascimento)
                                      setValue(
                                        'comprador.dataNascimento',
                                        dados.dataNascimento
                                      );
                                    if (dados.email)
                                      setValue('comprador.email', dados.email);
                                    if (dados.celular)
                                      setValue(
                                        'comprador.celular',
                                        maskCelPhone(dados.celular)
                                      );
                                    if (dados.profissao)
                                      setValue(
                                        'comprador.profissao',
                                        dados.profissao
                                      );
                                    if (dados.endereco) {
                                      setValue(
                                        'comprador.endereco.cep',
                                        maskCEP(dados.endereco.cep)
                                      );
                                      setValue(
                                        'comprador.endereco.rua',
                                        dados.endereco.rua
                                      );
                                      setValue(
                                        'comprador.endereco.numero',
                                        dados.endereco.numero
                                      );
                                      setValue(
                                        'comprador.endereco.complemento',
                                        dados.endereco.complemento || ''
                                      );
                                      setValue(
                                        'comprador.endereco.bairro',
                                        dados.endereco.bairro
                                      );
                                      setValue(
                                        'comprador.endereco.cidade',
                                        dados.endereco.cidade
                                      );
                                      setValue(
                                        'comprador.endereco.estado',
                                        dados.endereco.estado
                                      );
                                    }
                                    showInfo('Dados do histórico carregados!');
                                  }
                                }
                              }}
                            >
                              📋 Usar dados salvos
                            </HistoricoButton>
                          )}
                          {errors.comprador?.nome && (
                            <ErrorMessage>
                              {errors.comprador.nome.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            CPF <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <AutocompleteWrapper>
                            <FormInput
                              type='text'
                              {...register('comprador.cpf', {
                                required: 'CPF é obrigatório',
                                validate: value =>
                                  !value ||
                                  validateCPF(value) ||
                                  'CPF inválido',
                              })}
                              placeholder='000.000.000-00'
                              maxLength={14}
                              onChange={e => {
                                handleCPFChange(
                                  e.target.value,
                                  'comprador.cpf'
                                );
                              }}
                              $hasError={!!errors.comprador?.cpf}
                              list='historico-cpfs'
                              autoComplete='off'
                            />
                            <datalist id='historico-cpfs'>
                              {historicoDados.cpfs.map((cpf, idx) => (
                                <option key={idx} value={maskCPF(cpf)} />
                              ))}
                            </datalist>
                          </AutocompleteWrapper>
                          {errors.comprador?.cpf && (
                            <ErrorMessage>
                              {errors.comprador.cpf.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            RG <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.rg', {
                              required: 'RG é obrigatório',
                            })}
                            placeholder='00.000.000-0'
                            maxLength={13}
                            onChange={e => {
                              const masked = maskRG(e.target.value);
                              setValue('comprador.rg', masked);
                            }}
                            $hasError={!!errors.comprador?.rg}
                          />
                          {errors.comprador?.rg && (
                            <ErrorMessage>
                              {errors.comprador.rg.message}
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
                            {...register('comprador.dataNascimento', {
                              required: 'Data de nascimento é obrigatória',
                              validate: value =>
                                !value ||
                                validateAge(value) ||
                                'Deve ter mais de 18 anos',
                            })}
                            $hasError={!!errors.comprador?.dataNascimento}
                          />
                          {errors.comprador?.dataNascimento && (
                            <ErrorMessage>
                              {errors.comprador.dataNascimento.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            E-mail <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='email'
                            {...register('comprador.email', {
                              required: 'E-mail é obrigatório',
                              validate: value =>
                                !value ||
                                validateEmail(value) ||
                                'E-mail inválido',
                            })}
                            placeholder='email@exemplo.com'
                            onChange={e => {
                              setValue(
                                'comprador.email',
                                e.target.value.toLowerCase()
                              );
                            }}
                            $hasError={!!errors.comprador?.email}
                            list='historico-emails'
                            autoComplete='off'
                          />
                          <datalist id='historico-emails'>
                            {historicoDados.emails.map((email, idx) => (
                              <option key={idx} value={email} />
                            ))}
                          </datalist>
                          {errors.comprador?.email && (
                            <ErrorMessage>
                              {errors.comprador.email.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Celular <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <AutocompleteWrapper>
                            <FormInput
                              type='text'
                              {...register('comprador.celular', {
                                required: 'Celular é obrigatório',
                              })}
                              placeholder='(00) 00000-0000'
                              maxLength={15}
                              onChange={e => {
                                handleCelularChange(
                                  e.target.value,
                                  'comprador.celular'
                                );
                              }}
                              $hasError={!!errors.comprador?.celular}
                              list='historico-celulares'
                              autoComplete='off'
                            />
                            <datalist id='historico-celulares'>
                              {historicoDados.celulares.map((cel, idx) => (
                                <option key={idx} value={maskCelPhone(cel)} />
                              ))}
                            </datalist>
                          </AutocompleteWrapper>
                          {errors.comprador?.celular && (
                            <ErrorMessage>
                              {errors.comprador.celular.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Profissão <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          {!profissaoOutro.comprador ? (
                            <FormSelect
                              {...register('comprador.profissao', {
                                required: 'Profissão é obrigatória',
                              })}
                              onChange={e => {
                                const value = e.target.value;
                                if (value === 'Outro') {
                                  setProfissaoOutro(prev => ({
                                    ...prev,
                                    comprador: true,
                                  }));
                                  setValue('comprador.profissao', '');
                                } else {
                                  setValue('comprador.profissao', value);
                                }
                              }}
                              $hasError={!!errors.comprador?.profissao}
                            >
                              <option value=''>Selecione...</option>
                              {PROFISSOES_COMUNS.map(prof => (
                                <option key={prof} value={prof}>
                                  {prof}
                                </option>
                              ))}
                            </FormSelect>
                          ) : (
                            <div>
                              <FormSelect
                                value='Outro'
                                onChange={e => {
                                  if (e.target.value !== 'Outro') {
                                    setProfissaoOutro(prev => ({
                                      ...prev,
                                      comprador: false,
                                    }));
                                    setValue(
                                      'comprador.profissao',
                                      e.target.value
                                    );
                                  }
                                }}
                                style={{ marginBottom: '8px' }}
                              >
                                <option value='Outro'>Outro</option>
                                {PROFISSOES_COMUNS.filter(
                                  p => p !== 'Outro'
                                ).map(prof => (
                                  <option key={prof} value={prof}>
                                    {prof}
                                  </option>
                                ))}
                              </FormSelect>
                              <FormInput
                                type='text'
                                {...register('comprador.profissao', {
                                  required: 'Digite a profissão',
                                })}
                                placeholder='Digite a profissão'
                                $hasError={!!errors.comprador?.profissao}
                                onChange={e =>
                                  setValue(
                                    'comprador.profissao',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                          {profissaoOutro.comprador &&
                            errors.comprador?.profissao && (
                              <ErrorMessage>
                                {errors.comprador.profissao.message}
                              </ErrorMessage>
                            )}
                        </FormGroup>

                        <Divider
                          style={{ gridColumn: '1 / -1', margin: '24px 0' }}
                        />

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
                              {...register('comprador.endereco.cep')}
                              placeholder='00000-000'
                              maxLength={9}
                              onChange={e => {
                                const masked = maskCEP(e.target.value);
                                setValue('comprador.endereco.cep', masked);
                                if (masked.replace(/\D/g, '').length === 8) {
                                  buscarCEP(masked, 'comprador');
                                }
                              }}
                              $hasError={!!errors.comprador?.endereco?.cep}
                              style={{ flex: 1 }}
                            />
                            {loadingCEP.comprador && (
                              <div
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  border: '2px solid var(--color-primary)',
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                  marginTop: '12px',
                                }}
                              />
                            )}
                          </div>
                          {errors.comprador?.endereco?.cep && (
                            <ErrorMessage>
                              {errors.comprador.endereco.cep.message}
                            </ErrorMessage>
                          )}
                          <HelperText>
                            Digite o CEP para buscar o endereço automaticamente
                          </HelperText>
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Rua <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.endereco.rua', {
                              required: 'Rua é obrigatória',
                            })}
                            placeholder='Nome da rua'
                            $hasError={!!errors.comprador?.endereco?.rua}
                          />
                          {errors.comprador?.endereco?.rua && (
                            <ErrorMessage>
                              {errors.comprador.endereco.rua.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Número <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.endereco.numero', {
                              required: 'Número é obrigatório',
                            })}
                            placeholder='123 ou S/N'
                            $hasError={!!errors.comprador?.endereco?.numero}
                          />
                          {errors.comprador?.endereco?.numero && (
                            <ErrorMessage>
                              {errors.comprador.endereco.numero.message}
                            </ErrorMessage>
                          )}
                          <HelperText>Permite "S/N" para sem número</HelperText>
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>Complemento</FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.endereco.complemento')}
                            placeholder='Apto, Bloco, etc.'
                          />
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Bairro <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.endereco.bairro', {
                              required: 'Bairro é obrigatório',
                            })}
                            placeholder='Nome do bairro'
                            $hasError={!!errors.comprador?.endereco?.bairro}
                          />
                          {errors.comprador?.endereco?.bairro && (
                            <ErrorMessage>
                              {errors.comprador.endereco.bairro.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Cidade <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.endereco.cidade', {
                              required: 'Cidade é obrigatória',
                            })}
                            placeholder='Nome da cidade'
                            $hasError={!!errors.comprador?.endereco?.cidade}
                          />
                          {errors.comprador?.endereco?.cidade && (
                            <ErrorMessage>
                              {errors.comprador.endereco.cidade.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Estado (UF) <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('comprador.endereco.estado', {
                              required: 'Estado é obrigatório',
                              maxLength: 2,
                              pattern: {
                                value: /^[A-Z]{2}$/,
                                message:
                                  'Digite apenas a sigla do estado (ex: SP, RJ)',
                              },
                            })}
                            placeholder='SP'
                            maxLength={2}
                            style={{ textTransform: 'uppercase' }}
                            onChange={e => {
                              setValue(
                                'comprador.endereco.estado',
                                e.target.value.toUpperCase()
                              );
                            }}
                            $hasError={!!errors.comprador?.endereco?.estado}
                          />
                          {errors.comprador?.endereco?.estado && (
                            <ErrorMessage>
                              {errors.comprador.endereco.estado.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>
                      </FormGrid>
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 3 - Comprador Cônjuge/Sócio */}
                  <CollapsibleSection
                    $isExpanded={
                      expandedSections.compradorConjuge ||
                      watch('possuiCompradorConjuge')
                    }
                  >
                    <SectionHeader
                      onClick={() => toggleSection('compradorConjuge')}
                    >
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdGroup />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>
                            Comprador - Cônjuge ou Sócio
                          </StyledSectionTitle>
                          <SectionDescription>
                            Dados do cônjuge ou sócio do comprador (opcional)
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon
                        $isExpanded={
                          expandedSections.compradorConjuge ||
                          watch('possuiCompradorConjuge')
                        }
                      >
                        {expandedSections.compradorConjuge ||
                        watch('possuiCompradorConjuge') ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent
                      $isExpanded={
                        expandedSections.compradorConjuge ||
                        watch('possuiCompradorConjuge')
                      }
                    >
                      <FormGroup>
                        <CheckboxWrapper>
                          <CheckboxInput
                            type='checkbox'
                            {...register('possuiCompradorConjuge')}
                            onChange={e => {
                              setValue(
                                'possuiCompradorConjuge',
                                e.target.checked
                              );
                              if (e.target.checked) {
                                setExpandedSections(prev => ({
                                  ...prev,
                                  compradorConjuge: true,
                                }));
                              }
                            }}
                          />
                          <CheckboxLabel>Possui cônjuge/sócio?</CheckboxLabel>
                        </CheckboxWrapper>
                      </FormGroup>

                      {watch('possuiCompradorConjuge') && (
                        <FormGrid $columns={2}>
                          <FormGroup>
                            <FormLabel>
                              Nome Completo{' '}
                              <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('compradorConjuge.nome', {
                                required: watch('possuiCompradorConjuge')
                                  ? 'Nome é obrigatório'
                                  : false,
                              })}
                              placeholder='Digite o nome completo'
                              $hasError={!!errors.compradorConjuge?.nome}
                            />
                            {errors.compradorConjuge?.nome && (
                              <ErrorMessage>
                                {errors.compradorConjuge.nome.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              CPF <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('compradorConjuge.cpf', {
                                required: watch('possuiCompradorConjuge')
                                  ? 'CPF é obrigatório'
                                  : false,
                                validate: value =>
                                  !watch('possuiCompradorConjuge') ||
                                  !value ||
                                  validateCPF(value) ||
                                  'CPF inválido',
                              })}
                              placeholder='000.000.000-00'
                              maxLength={14}
                              onChange={e => {
                                handleCPFChange(
                                  e.target.value,
                                  'compradorConjuge.cpf'
                                );
                              }}
                              $hasError={!!errors.compradorConjuge?.cpf}
                            />
                            {errors.compradorConjuge?.cpf && (
                              <ErrorMessage>
                                {errors.compradorConjuge.cpf.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              RG <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('compradorConjuge.rg', {
                                required: watch('possuiCompradorConjuge')
                                  ? 'RG é obrigatório'
                                  : false,
                              })}
                              placeholder='00.000.000-0'
                              maxLength={13}
                              onChange={e => {
                                const masked = maskRG(e.target.value);
                                setValue('compradorConjuge.rg', masked);
                              }}
                              $hasError={!!errors.compradorConjuge?.rg}
                            />
                            {errors.compradorConjuge?.rg && (
                              <ErrorMessage>
                                {errors.compradorConjuge.rg.message}
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
                              {...register('compradorConjuge.dataNascimento', {
                                required: watch('possuiCompradorConjuge')
                                  ? 'Data de nascimento é obrigatória'
                                  : false,
                                validate: value =>
                                  !watch('possuiCompradorConjuge') ||
                                  !value ||
                                  validateAge(value) ||
                                  'Deve ter mais de 18 anos',
                              })}
                              $hasError={
                                !!errors.compradorConjuge?.dataNascimento
                              }
                            />
                            {errors.compradorConjuge?.dataNascimento && (
                              <ErrorMessage>
                                {errors.compradorConjuge.dataNascimento.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              E-mail <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='email'
                              {...register('compradorConjuge.email', {
                                required: watch('possuiCompradorConjuge')
                                  ? 'E-mail é obrigatório'
                                  : false,
                                validate: value =>
                                  !watch('possuiCompradorConjuge') ||
                                  !value ||
                                  validateEmail(value) ||
                                  'E-mail inválido',
                              })}
                              placeholder='email@exemplo.com'
                              onChange={e => {
                                setValue(
                                  'compradorConjuge.email',
                                  e.target.value.toLowerCase()
                                );
                              }}
                              $hasError={!!errors.compradorConjuge?.email}
                            />
                            {errors.compradorConjuge?.email && (
                              <ErrorMessage>
                                {errors.compradorConjuge.email.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              Celular <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('compradorConjuge.celular', {
                                required: watch('possuiCompradorConjuge')
                                  ? 'Celular é obrigatório'
                                  : false,
                              })}
                              placeholder='(00) 00000-0000'
                              maxLength={15}
                              onChange={e => {
                                handleCelularChange(
                                  e.target.value,
                                  'compradorConjuge.celular'
                                );
                              }}
                              $hasError={!!errors.compradorConjuge?.celular}
                            />
                            {errors.compradorConjuge?.celular && (
                              <ErrorMessage>
                                {errors.compradorConjuge.celular.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              Profissão <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            {!profissaoOutro.compradorConjuge ? (
                              <FormSelect
                                {...register('compradorConjuge.profissao', {
                                  required: watch('possuiCompradorConjuge')
                                    ? 'Profissão é obrigatória'
                                    : false,
                                })}
                                onChange={e => {
                                  const value = e.target.value;
                                  if (value === 'Outro') {
                                    setProfissaoOutro(prev => ({
                                      ...prev,
                                      compradorConjuge: true,
                                    }));
                                    setValue('compradorConjuge.profissao', '');
                                  } else {
                                    setValue(
                                      'compradorConjuge.profissao',
                                      value
                                    );
                                  }
                                }}
                                $hasError={!!errors.compradorConjuge?.profissao}
                              >
                                <option value=''>Selecione...</option>
                                {PROFISSOES_COMUNS.map(prof => (
                                  <option key={prof} value={prof}>
                                    {prof}
                                  </option>
                                ))}
                              </FormSelect>
                            ) : (
                              <div>
                                <FormSelect
                                  value='Outro'
                                  onChange={e => {
                                    if (e.target.value !== 'Outro') {
                                      setProfissaoOutro(prev => ({
                                        ...prev,
                                        compradorConjuge: false,
                                      }));
                                      setValue(
                                        'compradorConjuge.profissao',
                                        e.target.value
                                      );
                                    }
                                  }}
                                  style={{ marginBottom: '8px' }}
                                >
                                  <option value='Outro'>Outro</option>
                                  {PROFISSOES_COMUNS.filter(
                                    p => p !== 'Outro'
                                  ).map(prof => (
                                    <option key={prof} value={prof}>
                                      {prof}
                                    </option>
                                  ))}
                                </FormSelect>
                                <FormInput
                                  type='text'
                                  {...register('compradorConjuge.profissao', {
                                    required: watch('possuiCompradorConjuge')
                                      ? 'Digite a profissão'
                                      : false,
                                  })}
                                  placeholder='Digite a profissão'
                                  $hasError={
                                    !!errors.compradorConjuge?.profissao
                                  }
                                  onChange={e =>
                                    setValue(
                                      'compradorConjuge.profissao',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                            {profissaoOutro.compradorConjuge &&
                              errors.compradorConjuge?.profissao && (
                                <ErrorMessage>
                                  {errors.compradorConjuge.profissao.message}
                                </ErrorMessage>
                              )}
                          </FormGroup>

                          {renderAddressFields(
                            'compradorConjuge',
                            errors.compradorConjuge
                          )}
                        </FormGrid>
                      )}
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 4 - Vendedor */}
                  <CollapsibleSection $isExpanded={expandedSections.vendedor}>
                    <SectionHeader onClick={() => toggleSection('vendedor')}>
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdWork />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>Vendedor</StyledSectionTitle>
                          <SectionDescription>
                            Dados pessoais do vendedor
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon $isExpanded={expandedSections.vendedor}>
                        {expandedSections.vendedor ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent $isExpanded={expandedSections.vendedor}>
                      <FormGrid $columns={2}>
                        <FormGroup>
                          <FormLabel>
                            Nome Completo{' '}
                            <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('vendedor.nome', {
                              required: 'Nome é obrigatório',
                            })}
                            placeholder='Digite o nome completo'
                            $hasError={!!errors.vendedor?.nome}
                          />
                          {errors.vendedor?.nome && (
                            <ErrorMessage>
                              {errors.vendedor.nome.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            CPF <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('vendedor.cpf', {
                              required: 'CPF é obrigatório',
                              validate: value =>
                                validateCPF(value) || 'CPF inválido',
                            })}
                            placeholder='000.000.000-00'
                            maxLength={14}
                            onChange={e => {
                              handleCPFChange(e.target.value, 'vendedor.cpf');
                            }}
                            $hasError={!!errors.vendedor?.cpf}
                          />
                          {errors.vendedor?.cpf && (
                            <ErrorMessage>
                              {errors.vendedor.cpf.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            RG <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('vendedor.rg', {
                              required: 'RG é obrigatório',
                            })}
                            placeholder='00.000.000-0'
                            maxLength={13}
                            onChange={e => {
                              const masked = maskRG(e.target.value);
                              setValue('vendedor.rg', masked);
                            }}
                            $hasError={!!errors.vendedor?.rg}
                          />
                          {errors.vendedor?.rg && (
                            <ErrorMessage>
                              {errors.vendedor.rg.message}
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
                            {...register('vendedor.dataNascimento', {
                              required: 'Data de nascimento é obrigatória',
                              validate: value =>
                                validateAge(value) ||
                                'Deve ter mais de 18 anos',
                            })}
                            $hasError={!!errors.vendedor?.dataNascimento}
                          />
                          {errors.vendedor?.dataNascimento && (
                            <ErrorMessage>
                              {errors.vendedor.dataNascimento.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            E-mail <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='email'
                            {...register('vendedor.email', {
                              required: 'E-mail é obrigatório',
                              validate: value =>
                                validateEmail(value) || 'E-mail inválido',
                            })}
                            placeholder='email@exemplo.com'
                            onChange={e => {
                              setValue(
                                'vendedor.email',
                                e.target.value.toLowerCase()
                              );
                            }}
                            $hasError={!!errors.vendedor?.email}
                          />
                          {errors.vendedor?.email && (
                            <ErrorMessage>
                              {errors.vendedor.email.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Celular <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('vendedor.celular', {
                              required: 'Celular é obrigatório',
                            })}
                            placeholder='(00) 00000-0000'
                            maxLength={15}
                            onChange={e => {
                              handleCelularChange(
                                e.target.value,
                                'vendedor.celular'
                              );
                            }}
                            $hasError={!!errors.vendedor?.celular}
                          />
                          {errors.vendedor?.celular && (
                            <ErrorMessage>
                              {errors.vendedor.celular.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Profissão <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          {!profissaoOutro.vendedor ? (
                            <FormSelect
                              {...register('vendedor.profissao', {
                                required: 'Profissão é obrigatória',
                              })}
                              onChange={e => {
                                const value = e.target.value;
                                if (value === 'Outro') {
                                  setProfissaoOutro(prev => ({
                                    ...prev,
                                    vendedor: true,
                                  }));
                                  setValue('vendedor.profissao', '');
                                } else {
                                  setValue('vendedor.profissao', value);
                                }
                              }}
                              $hasError={!!errors.vendedor?.profissao}
                            >
                              <option value=''>Selecione...</option>
                              {PROFISSOES_COMUNS.map(prof => (
                                <option key={prof} value={prof}>
                                  {prof}
                                </option>
                              ))}
                            </FormSelect>
                          ) : (
                            <div>
                              <FormSelect
                                value='Outro'
                                onChange={e => {
                                  if (e.target.value !== 'Outro') {
                                    setProfissaoOutro(prev => ({
                                      ...prev,
                                      vendedor: false,
                                    }));
                                    setValue(
                                      'vendedor.profissao',
                                      e.target.value
                                    );
                                  }
                                }}
                                style={{ marginBottom: '8px' }}
                              >
                                <option value='Outro'>Outro</option>
                                {PROFISSOES_COMUNS.filter(
                                  p => p !== 'Outro'
                                ).map(prof => (
                                  <option key={prof} value={prof}>
                                    {prof}
                                  </option>
                                ))}
                              </FormSelect>
                              <FormInput
                                type='text'
                                {...register('vendedor.profissao', {
                                  required: 'Digite a profissão',
                                })}
                                placeholder='Digite a profissão'
                                $hasError={!!errors.vendedor?.profissao}
                                onChange={e =>
                                  setValue('vendedor.profissao', e.target.value)
                                }
                              />
                            </div>
                          )}
                          {profissaoOutro.vendedor &&
                            errors.vendedor?.profissao && (
                              <ErrorMessage>
                                {errors.vendedor.profissao.message}
                              </ErrorMessage>
                            )}
                        </FormGroup>

                        {renderAddressFields('vendedor', errors.vendedor)}
                      </FormGrid>
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 5 - Vendedor Cônjuge/Sócio */}
                  <CollapsibleSection
                    $isExpanded={
                      expandedSections.vendedorConjuge ||
                      watch('possuiVendedorConjuge')
                    }
                  >
                    <SectionHeader
                      onClick={() => toggleSection('vendedorConjuge')}
                    >
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdGroup />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>
                            Vendedor - Cônjuge ou Sócio
                          </StyledSectionTitle>
                          <SectionDescription>
                            Dados do cônjuge ou sócio do vendedor (opcional)
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon
                        $isExpanded={
                          expandedSections.vendedorConjuge ||
                          watch('possuiVendedorConjuge')
                        }
                      >
                        {expandedSections.vendedorConjuge ||
                        watch('possuiVendedorConjuge') ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent
                      $isExpanded={
                        expandedSections.vendedorConjuge ||
                        watch('possuiVendedorConjuge')
                      }
                    >
                      <FormGroup>
                        <CheckboxWrapper>
                          <CheckboxInput
                            type='checkbox'
                            {...register('possuiVendedorConjuge')}
                            onChange={e => {
                              setValue(
                                'possuiVendedorConjuge',
                                e.target.checked
                              );
                              if (e.target.checked) {
                                setExpandedSections(prev => ({
                                  ...prev,
                                  vendedorConjuge: true,
                                }));
                              }
                            }}
                          />
                          <CheckboxLabel>Possui cônjuge/sócio?</CheckboxLabel>
                        </CheckboxWrapper>
                      </FormGroup>

                      {watch('possuiVendedorConjuge') && (
                        <FormGrid $columns={2}>
                          <FormGroup>
                            <FormLabel>
                              Nome Completo{' '}
                              <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('vendedorConjuge.nome', {
                                required: watch('possuiVendedorConjuge')
                                  ? 'Nome é obrigatório'
                                  : false,
                              })}
                              placeholder='Digite o nome completo'
                              $hasError={!!errors.vendedorConjuge?.nome}
                            />
                            {errors.vendedorConjuge?.nome && (
                              <ErrorMessage>
                                {errors.vendedorConjuge.nome.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              CPF <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('vendedorConjuge.cpf', {
                                required: watch('possuiVendedorConjuge')
                                  ? 'CPF é obrigatório'
                                  : false,
                                validate: value =>
                                  !watch('possuiVendedorConjuge') ||
                                  !value ||
                                  validateCPF(value) ||
                                  'CPF inválido',
                              })}
                              placeholder='000.000.000-00'
                              maxLength={14}
                              onChange={e => {
                                handleCPFChange(
                                  e.target.value,
                                  'vendedorConjuge.cpf'
                                );
                              }}
                              $hasError={!!errors.vendedorConjuge?.cpf}
                            />
                            {errors.vendedorConjuge?.cpf && (
                              <ErrorMessage>
                                {errors.vendedorConjuge.cpf.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              RG <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('vendedorConjuge.rg', {
                                required: watch('possuiVendedorConjuge')
                                  ? 'RG é obrigatório'
                                  : false,
                              })}
                              placeholder='00.000.000-0'
                              maxLength={13}
                              onChange={e => {
                                const masked = maskRG(e.target.value);
                                setValue('vendedorConjuge.rg', masked);
                              }}
                              $hasError={!!errors.vendedorConjuge?.rg}
                            />
                            {errors.vendedorConjuge?.rg && (
                              <ErrorMessage>
                                {errors.vendedorConjuge.rg.message}
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
                              {...register('vendedorConjuge.dataNascimento', {
                                required: watch('possuiVendedorConjuge')
                                  ? 'Data de nascimento é obrigatória'
                                  : false,
                                validate: value =>
                                  !watch('possuiVendedorConjuge') ||
                                  !value ||
                                  validateAge(value) ||
                                  'Deve ter mais de 18 anos',
                              })}
                              $hasError={
                                !!errors.vendedorConjuge?.dataNascimento
                              }
                            />
                            {errors.vendedorConjuge?.dataNascimento && (
                              <ErrorMessage>
                                {errors.vendedorConjuge.dataNascimento.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              E-mail <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='email'
                              {...register('vendedorConjuge.email', {
                                required: watch('possuiVendedorConjuge')
                                  ? 'E-mail é obrigatório'
                                  : false,
                                validate: value =>
                                  !watch('possuiVendedorConjuge') ||
                                  !value ||
                                  validateEmail(value) ||
                                  'E-mail inválido',
                              })}
                              placeholder='email@exemplo.com'
                              onChange={e => {
                                setValue(
                                  'vendedorConjuge.email',
                                  e.target.value.toLowerCase()
                                );
                              }}
                              $hasError={!!errors.vendedorConjuge?.email}
                            />
                            {errors.vendedorConjuge?.email && (
                              <ErrorMessage>
                                {errors.vendedorConjuge.email.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              Celular <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            <FormInput
                              type='text'
                              {...register('vendedorConjuge.celular', {
                                required: watch('possuiVendedorConjuge')
                                  ? 'Celular é obrigatório'
                                  : false,
                              })}
                              placeholder='(00) 00000-0000'
                              maxLength={15}
                              onChange={e => {
                                handleCelularChange(
                                  e.target.value,
                                  'vendedorConjuge.celular'
                                );
                              }}
                              $hasError={!!errors.vendedorConjuge?.celular}
                            />
                            {errors.vendedorConjuge?.celular && (
                              <ErrorMessage>
                                {errors.vendedorConjuge.celular.message}
                              </ErrorMessage>
                            )}
                          </FormGroup>

                          <FormGroup>
                            <FormLabel>
                              Profissão <RequiredIndicator>*</RequiredIndicator>
                            </FormLabel>
                            {!profissaoOutro.vendedorConjuge ? (
                              <FormSelect
                                {...register('vendedorConjuge.profissao', {
                                  required: watch('possuiVendedorConjuge')
                                    ? 'Profissão é obrigatória'
                                    : false,
                                })}
                                onChange={e => {
                                  const value = e.target.value;
                                  if (value === 'Outro') {
                                    setProfissaoOutro(prev => ({
                                      ...prev,
                                      vendedorConjuge: true,
                                    }));
                                    setValue('vendedorConjuge.profissao', '');
                                  } else {
                                    setValue(
                                      'vendedorConjuge.profissao',
                                      value
                                    );
                                  }
                                }}
                                $hasError={!!errors.vendedorConjuge?.profissao}
                              >
                                <option value=''>Selecione...</option>
                                {PROFISSOES_COMUNS.map(prof => (
                                  <option key={prof} value={prof}>
                                    {prof}
                                  </option>
                                ))}
                              </FormSelect>
                            ) : (
                              <div>
                                <FormSelect
                                  value='Outro'
                                  onChange={e => {
                                    if (e.target.value !== 'Outro') {
                                      setProfissaoOutro(prev => ({
                                        ...prev,
                                        vendedorConjuge: false,
                                      }));
                                      setValue(
                                        'vendedorConjuge.profissao',
                                        e.target.value
                                      );
                                    }
                                  }}
                                  style={{ marginBottom: '8px' }}
                                >
                                  <option value='Outro'>Outro</option>
                                  {PROFISSOES_COMUNS.filter(
                                    p => p !== 'Outro'
                                  ).map(prof => (
                                    <option key={prof} value={prof}>
                                      {prof}
                                    </option>
                                  ))}
                                </FormSelect>
                                <FormInput
                                  type='text'
                                  {...register('vendedorConjuge.profissao', {
                                    required: watch('possuiVendedorConjuge')
                                      ? 'Digite a profissão'
                                      : false,
                                  })}
                                  placeholder='Digite a profissão'
                                  $hasError={
                                    !!errors.vendedorConjuge?.profissao
                                  }
                                  onChange={e =>
                                    setValue(
                                      'vendedorConjuge.profissao',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                            {profissaoOutro.vendedorConjuge &&
                              errors.vendedorConjuge?.profissao && (
                                <ErrorMessage>
                                  {errors.vendedorConjuge.profissao.message}
                                </ErrorMessage>
                              )}
                          </FormGroup>

                          {renderAddressFields(
                            'vendedorConjuge',
                            errors.vendedorConjuge
                          )}
                        </FormGrid>
                      )}
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 6 - Imóvel */}
                  <CollapsibleSection $isExpanded={expandedSections.imovel}>
                    <SectionHeader onClick={() => toggleSection('imovel')}>
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdHome />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>Imóvel</StyledSectionTitle>
                          <SectionDescription>
                            Informações do imóvel vendido
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
                          <FormLabel>
                            CEP <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('imovel.cep', {
                              required: 'CEP é obrigatório',
                            })}
                            placeholder='Preenchido ao selecionar o imóvel'
                            maxLength={9}
                            readOnly
                            $hasError={!!errors.imovel?.cep}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
                          />
                          {errors.imovel?.cep && (
                            <ErrorMessage>
                              {errors.imovel.cep.message}
                            </ErrorMessage>
                          )}
                          <HelperText>
                            Preenchido automaticamente ao buscar e selecionar o
                            imóvel pelo código
                          </HelperText>
                        </FormGroup>

                        <FormGroup style={{ position: 'relative' }}>
                          <FormLabel>
                            Código do Imóvel{' '}
                            <RequiredIndicator>*</RequiredIndicator>
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
                              {...register('imovel.codigo', {
                                required: 'Código do imóvel é obrigatório',
                              })}
                              placeholder='IMV-001 ou digite e busque'
                              $hasError={!!errors.imovel?.codigo}
                              style={{ flex: 1 }}
                              onFocus={() =>
                                buscaCodigoImovel &&
                                setShowDropdownImovel(
                                  propriedadesBusca.length > 0
                                )
                              }
                              onChange={e =>
                                setBuscaCodigoImovel(e.target.value)
                              }
                            />
                            <CepSearchButton
                              type='button'
                              onClick={buscarPropriedadesPorCodigo}
                              disabled={loadingPropriedades}
                            >
                              {loadingPropriedades ? (
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
                          {errors.imovel?.codigo && (
                            <ErrorMessage>
                              {errors.imovel.codigo.message}
                            </ErrorMessage>
                          )}
                          <HelperText>
                            Busque pelo código para preencher o imóvel
                            automaticamente
                          </HelperText>
                          {showDropdownImovel &&
                            propriedadesBusca.length > 0 && (
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
                                {propriedadesBusca.map(prop => (
                                  <button
                                    key={prop.id}
                                    type='button'
                                    onClick={() =>
                                      selecionarPropriedadeParaImovel(prop)
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
                                      borderBottom:
                                        '1px solid var(--color-border)',
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

                        <Divider
                          style={{ gridColumn: '1 / -1', margin: '24px 0' }}
                        />

                        <FormGroup style={{ gridColumn: '1 / -1' }}>
                          <FormLabel>
                            Rua <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('imovel.endereco', {
                              required: 'Rua é obrigatória',
                            })}
                            placeholder='Preenchido ao selecionar o imóvel'
                            readOnly
                            $hasError={!!errors.imovel?.endereco}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
                          />
                          {errors.imovel?.endereco && (
                            <ErrorMessage>
                              {errors.imovel.endereco.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Número <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('imovel.numero', {
                              required: 'Número é obrigatório',
                            })}
                            placeholder='Preenchido ao selecionar o imóvel'
                            readOnly
                            $hasError={!!errors.imovel?.numero}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
                          />
                          {errors.imovel?.numero && (
                            <ErrorMessage>
                              {errors.imovel.numero.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>Complemento</FormLabel>
                          <FormInput
                            type='text'
                            {...register('imovel.complemento')}
                            placeholder='Preenchido ao selecionar o imóvel'
                            readOnly
                            $hasError={!!errors.imovel?.complemento}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
                          />
                          {errors.imovel?.complemento && (
                            <ErrorMessage>
                              {errors.imovel.complemento.message}
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
                            placeholder='Preenchido ao selecionar o imóvel'
                            readOnly
                            $hasError={!!errors.imovel?.bairro}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
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
                            })}
                            placeholder='Preenchido ao selecionar o imóvel'
                            readOnly
                            $hasError={!!errors.imovel?.cidade}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
                          />
                          {errors.imovel?.cidade && (
                            <ErrorMessage>
                              {errors.imovel.cidade.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <FormLabel>
                            Estado <RequiredIndicator>*</RequiredIndicator>
                          </FormLabel>
                          <FormInput
                            type='text'
                            {...register('imovel.estado', {
                              required: 'Estado é obrigatório',
                            })}
                            placeholder='Preenchido ao selecionar o imóvel'
                            maxLength={2}
                            readOnly
                            $hasError={!!errors.imovel?.estado}
                            style={{
                              backgroundColor:
                                'var(--color-background-secondary)',
                              cursor: 'default',
                            }}
                          />
                          {errors.imovel?.estado && (
                            <ErrorMessage>
                              {errors.imovel.estado.message}
                            </ErrorMessage>
                          )}
                        </FormGroup>
                      </FormGrid>
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 7 - Financeiro */}
                  <CollapsibleSection $isExpanded={expandedSections.financeiro}>
                    <SectionHeader onClick={() => toggleSection('financeiro')}>
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdAttachMoney />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>Financeiro</StyledSectionTitle>
                          <SectionDescription>
                            Valores da venda e comissões
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon $isExpanded={expandedSections.financeiro}>
                        {expandedSections.financeiro ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent $isExpanded={expandedSections.financeiro}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px',
                          marginBottom: '24px',
                        }}
                      >
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '-50px',
                              right: '-50px',
                              width: '150px',
                              height: '150px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.1)',
                              filter: 'blur(40px)',
                            }}
                          />
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '12px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <MdAttachMoney size={24} />
                              </div>
                              <FormLabel
                                style={{
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  margin: 0,
                                  opacity: 0.9,
                                }}
                              >
                                Valor de Venda{' '}
                                <RequiredIndicator
                                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                >
                                  *
                                </RequiredIndicator>
                              </FormLabel>
                            </div>
                            <FormInput
                              type='text'
                              {...register('valorVenda', {
                                required: 'Valor de venda é obrigatório',
                                validate: value => {
                                  const num = getNumericValue(value);
                                  return (
                                    num > 0 || 'Valor deve ser maior que zero'
                                  );
                                },
                              })}
                              placeholder='R$ 0,00'
                              onChange={e => {
                                handleMoneyChange(e.target.value, 'valorVenda');
                              }}
                              $hasError={!!errors.valorVenda}
                              style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'var(--color-text)',
                                width: '100%',
                              }}
                            />
                            {errors.valorVenda && (
                              <ErrorMessage
                                style={{
                                  color: 'rgba(255, 255, 255, 0.95)',
                                  marginTop: '8px',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {errors.valorVenda.message}
                              </ErrorMessage>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '-50px',
                              right: '-50px',
                              width: '150px',
                              height: '150px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.1)',
                              filter: 'blur(40px)',
                            }}
                          />
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '12px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <MdAttachMoney size={24} />
                              </div>
                              <FormLabel
                                style={{
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  margin: 0,
                                  opacity: 0.9,
                                }}
                              >
                                Comissão Total{' '}
                                <RequiredIndicator
                                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                >
                                  *
                                </RequiredIndicator>
                              </FormLabel>
                            </div>
                            <FormInput
                              type='text'
                              {...register('comissaoTotal', {
                                required: 'Comissão total é obrigatória',
                                validate: value => {
                                  const num = getNumericValue(value);
                                  return (
                                    num > 0 ||
                                    'Comissão deve ser maior que zero'
                                  );
                                },
                              })}
                              placeholder='R$ 0,00'
                              onChange={e => {
                                handleMoneyChange(
                                  e.target.value,
                                  'comissaoTotal'
                                );
                              }}
                              $hasError={!!errors.comissaoTotal}
                              style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: 'var(--color-text)',
                                width: '100%',
                              }}
                            />
                            {errors.comissaoTotal && (
                              <ErrorMessage
                                style={{
                                  color: 'rgba(255, 255, 255, 0.95)',
                                  marginTop: '8px',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {errors.comissaoTotal.message}
                              </ErrorMessage>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryLight} 100%)`,
                          borderRadius: '16px',
                          padding: '24px',
                          color: 'white',
                          boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                          position: 'relative',
                          overflow: 'hidden',
                          marginTop: '8px',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                          }}
                        />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '12px',
                            }}
                          >
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)',
                              }}
                            >
                              <MdCheckCircle size={20} />
                            </div>
                            <CalculatedLabel
                              style={{
                                color: 'white',
                                fontSize: '0.9375rem',
                                fontWeight: 600,
                                margin: 0,
                              }}
                            >
                              Valor para Fins de Meta (5% do valor de venda)
                            </CalculatedLabel>
                          </div>
                          <CalculatedAmount
                            style={{
                              fontSize: '1.75rem',
                              fontWeight: 700,
                              color: 'white',
                              margin: 0,
                              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            {watch('valorMeta') || 'R$ 0,00'}
                          </CalculatedAmount>
                          <HelperText
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              marginTop: '8px',
                              fontSize: '0.875rem',
                            }}
                          >
                            Valor calculado automaticamente
                          </HelperText>
                        </div>
                      </div>
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 8 - Distribuição de Comissão. REGRA: total NÃO precisa ser 100% (não voltar a exigir). */}
                  <CollapsibleSection $isExpanded={expandedSections.comissoes}>
                    <SectionHeader onClick={() => toggleSection('comissoes')}>
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdGroup />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>
                            Distribuição de Comissão
                          </StyledSectionTitle>
                          <SectionDescription>
                            Distribuição de comissões entre corretores e
                            gerências
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon $isExpanded={expandedSections.comissoes}>
                        {expandedSections.comissoes ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent $isExpanded={expandedSections.comissoes}>
                      {/* Corretores */}
                      <div style={{ marginBottom: '40px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '32px',
                            gap: '16px',
                            paddingBottom: '16px',
                            borderBottom: '2px solid var(--color-border)',
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
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: `0 4px 12px ${themeColors.primary}4D`,
                              }}
                            >
                              <MdPeople size={24} />
                            </div>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                              }}
                            >
                              Corretores
                            </h3>
                          </div>
                          <AddButton
                            type='button'
                            onClick={addCorretor}
                            style={{
                              width: 'auto',
                              minWidth: '200px',
                              padding: '12px 24px',
                              borderRadius: '10px',
                              fontSize: '0.9375rem',
                              fontWeight: 600,
                            }}
                          >
                            <MdAdd size={20} /> Adicionar Corretor
                          </AddButton>
                          <Button
                            type='button'
                            $variant='secondary'
                            onClick={() =>
                              setShowAddCorretorComissaoModal(true)
                            }
                            style={{
                              width: 'auto',
                              minWidth: '200px',
                              padding: '12px 24px',
                              borderRadius: '10px',
                              fontSize: '0.9375rem',
                              fontWeight: 600,
                            }}
                          >
                            <MdPeople
                              size={20}
                              style={{ marginRight: '8px' }}
                            />
                            Adicionar da lista
                          </Button>
                          <Button
                            type='button'
                            $variant='secondary'
                            onClick={() => {
                              setFilePorcentagens(null);
                              setShowImportPorcentagensModal(true);
                            }}
                            style={{
                              width: 'auto',
                              minWidth: '200px',
                              padding: '12px 24px',
                              borderRadius: '10px',
                              fontSize: '0.9375rem',
                              fontWeight: 600,
                            }}
                          >
                            <MdCloudUpload
                              size={20}
                              style={{ marginRight: '8px' }}
                            />
                            Importar porcentagens
                          </Button>
                        </div>

                        {comissoesCorretores.length === 0 ? (
                          <div
                            style={{
                              padding: '48px 20px',
                              textAlign: 'center',
                              background: 'var(--color-background-secondary)',
                              borderRadius: '12px',
                              border: '2px dashed var(--color-border)',
                            }}
                          >
                            <div
                              style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)',
                                margin: '0 auto 16px',
                              }}
                            >
                              <MdPeople size={32} />
                            </div>
                            <p
                              style={{
                                margin: 0,
                                color: 'var(--color-text-secondary)',
                                fontSize: '0.9375rem',
                                marginBottom: '20px',
                              }}
                            >
                              Nenhum corretor adicionado ainda
                            </p>
                            <div
                              style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                              }}
                            >
                              <AddButton
                                type='button'
                                onClick={addCorretor}
                                style={{
                                  width: 'auto',
                                  padding: '12px 24px',
                                  borderRadius: '10px',
                                }}
                              >
                                <MdAdd size={20} /> Adicionar Primeiro Corretor
                              </AddButton>
                              <Button
                                type='button'
                                $variant='secondary'
                                onClick={() =>
                                  setShowAddCorretorComissaoModal(true)
                                }
                                style={{
                                  padding: '12px 24px',
                                  borderRadius: '10px',
                                }}
                              >
                                <MdPeople
                                  size={20}
                                  style={{ marginRight: '8px' }}
                                />
                                Adicionar da lista
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fill, minmax(350px, 1fr))',
                              gap: '20px',
                            }}
                          >
                            {comissoesCorretores.map((corretor, index) => {
                              const corretorColors = [
                                {
                                  bg: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                  border: themeColors.primary,
                                },
                                {
                                  bg: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                                  border: themeColors.primaryDark,
                                },
                                {
                                  bg: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                  border: themeColors.primary,
                                },
                                {
                                  bg: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                  border: themeColors.primary,
                                },
                                {
                                  bg: `linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%)`,
                                  border: themeColors.primaryLight,
                                },
                              ];
                              const corretorColor =
                                corretorColors[index % corretorColors.length];

                              return (
                                <ComissaoItem
                                  key={corretor.id}
                                  style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: `2px solid ${corretorColor.border}`,
                                    background:
                                      'var(--color-background-secondary)',
                                  }}
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      height: '4px',
                                      background: corretorColor.bg,
                                    }}
                                  />
                                  <ComissaoItemHeader
                                    style={{ marginBottom: '20px' }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        flex: 1,
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '40px',
                                          height: '40px',
                                          borderRadius: '10px',
                                          background: corretorColor.bg,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'white',
                                          fontWeight: 700,
                                          fontSize: '1.125rem',
                                          boxShadow:
                                            '0 2px 8px rgba(0, 0, 0, 0.15)',
                                        }}
                                      >
                                        {index + 1}
                                      </div>
                                      <ComissaoItemTitle
                                        style={{
                                          fontSize: '1.125rem',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                        }}
                                      >
                                        <MdPerson
                                          size={20}
                                          style={{
                                            color: corretorColor.border,
                                          }}
                                        />
                                        Corretor {index + 1}
                                      </ComissaoItemTitle>
                                    </div>
                                    <RemoveButton
                                      type='button'
                                      onClick={() =>
                                        removeCorretor(corretor.id)
                                      }
                                      style={{
                                        padding: '8px 16px',
                                        fontSize: '0.875rem',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <MdDelete size={18} /> Remover
                                    </RemoveButton>
                                  </ComissaoItemHeader>
                                  <FormGrid
                                    $columns={1}
                                    style={{ gap: '16px' }}
                                  >
                                    <FormGroup>
                                      <FormLabel
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          marginBottom: '8px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        <MdPerson
                                          size={18}
                                          style={{
                                            color: corretorColor.border,
                                          }}
                                        />
                                        Corretor{' '}
                                        <RequiredIndicator>*</RequiredIndicator>
                                      </FormLabel>
                                      <FormSelect
                                        value={
                                          corretor.corretorId ||
                                          (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                                            (corretor.id || '').trim()
                                          )
                                            ? corretor.id
                                            : '')
                                        }
                                        onChange={e => {
                                          const val = e.target.value;
                                          const user =
                                            corretoresDisponiveis.find(
                                              c => c.id === val
                                            );
                                          const updated = [
                                            ...comissoesCorretores,
                                          ];
                                          updated[index].corretorId =
                                            val || undefined;
                                          updated[index].corretor =
                                            user?.nome ?? '';
                                          setValue(
                                            'comissoesCorretores',
                                            updated
                                          );
                                        }}
                                        style={{
                                          borderLeft: `3px solid ${corretorColor.border}`,
                                          paddingLeft: '12px',
                                          width: '100%',
                                          minWidth: 0,
                                        }}
                                      >
                                        <option value=''>
                                          Selecione o corretor...
                                        </option>
                                        {corretoresDisponiveis.map(c => (
                                          <option key={c.id} value={c.id}>
                                            {c.nome}
                                            {c.unidade ? ` · ${c.unidade}` : ''}
                                          </option>
                                        ))}
                                      </FormSelect>
                                      {loadingCorretores && (
                                        <HelperText>
                                          Carregando corretores...
                                        </HelperText>
                                      )}
                                    </FormGroup>

                                    <FormGroup>
                                      <FormLabel
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          marginBottom: '8px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        <MdAttachMoney
                                          size={18}
                                          style={{
                                            color: corretorColor.border,
                                          }}
                                        />
                                        Porcentagem{' '}
                                        <RequiredIndicator>*</RequiredIndicator>
                                      </FormLabel>
                                      <div style={{ position: 'relative' }}>
                                        <FormInput
                                          type='number'
                                          min='0'
                                          max='100'
                                          step='0.01'
                                          value={corretor.porcentagem}
                                          onChange={e => {
                                            const updated = [
                                              ...comissoesCorretores,
                                            ];
                                            updated[index].porcentagem =
                                              parseFloat(e.target.value) || 0;
                                            setValue(
                                              'comissoesCorretores',
                                              updated
                                            );
                                          }}
                                          placeholder='0.00'
                                          style={{
                                            borderLeft: `3px solid ${corretorColor.border}`,
                                            paddingLeft: '12px',
                                            paddingRight: '50px',
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: corretorColor.bg,
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            pointerEvents: 'none',
                                          }}
                                        >
                                          %
                                        </div>
                                      </div>
                                    </FormGroup>

                                    {/* Até 3 captadores por corretor */}
                                    <FormGroup
                                      style={{
                                        gridColumn: '1 / -1',
                                      }}
                                    >
                                      <FormLabel
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          marginBottom: '8px',
                                          fontWeight: 600,
                                        }}
                                      >
                                        <MdSearch
                                          size={18}
                                          style={{
                                            color: corretorColor.border,
                                          }}
                                        />
                                        Captadores (até 3, opcional)
                                      </FormLabel>
                                      {(corretor.captadores ?? (corretor.captador ? [{ id: corretor.captador, nome: undefined, porcentagem: undefined }] : [])).map((cap, capIdx) => (
                                        <div
                                          key={capIdx}
                                          style={{
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'center',
                                            marginBottom: '12px',
                                          }}
                                        >
                                          <FormSelect
                                            value={cap.id || ''}
                                            onChange={e => {
                                              const val = e.target.value;
                                              const list = corretor.captadores ?? [];
                                              const updated = [...comissoesCorretores];
                                              const newList = [...list];
                                              newList[capIdx] = val
                                                ? {
                                                    id: val,
                                                    nome: opcoesCaptador.find(u => u.id === val)?.nome,
                                                    porcentagem: cap.porcentagem,
                                                  }
                                                : { id: '', nome: undefined, porcentagem: undefined };
                                              updated[index].captadores = newList.filter(c => c.id);
                                              setValue('comissoesCorretores', updated);
                                            }}
                                            style={{
                                              flex: 1,
                                              minWidth: 0,
                                              borderLeft: `3px solid ${corretorColor.border}`,
                                              paddingLeft: '12px',
                                            }}
                                          >
                                            <option value=''>Selecione...</option>
                                            {opcoesCaptador.map(u => (
                                              <option key={u.id} value={u.id}>
                                                {u.nome}
                                                {u.unidade ? ` · ${u.unidade}` : ''}
                                              </option>
                                            ))}
                                          </FormSelect>
                                          <FormInput
                                            type='number'
                                            min={0}
                                            max={100}
                                            step={0.5}
                                            placeholder='%'
                                            value={cap.porcentagem != null ? String(cap.porcentagem) : ''}
                                            onChange={e => {
                                              const num = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                              const list = [...(corretor.captadores ?? [])];
                                              if (list[capIdx]) {
                                                list[capIdx] = {
                                                  ...list[capIdx],
                                                  porcentagem: num != null && !Number.isNaN(num) ? Math.min(100, Math.max(0, num)) : undefined,
                                                };
                                              }
                                              const updated = [...comissoesCorretores];
                                              updated[index].captadores = list;
                                              setValue('comissoesCorretores', updated);
                                            }}
                                            style={{
                                              width: '80px',
                                              paddingRight: '8px',
                                            }}
                                          />
                                          <Button
                                            type='button'
                                            $variant='secondary'
                                            onClick={() => {
                                              const list = (corretor.captadores ?? []).filter((_, i) => i !== capIdx);
                                              const updated = [...comissoesCorretores];
                                              updated[index].captadores = list;
                                              setValue('comissoesCorretores', updated);
                                            }}
                                            style={{ padding: '8px 12px' }}
                                          >
                                            <MdClose />
                                          </Button>
                                        </div>
                                      ))}
                                      {(corretor.captadores ?? []).length < 3 && (
                                        <Button
                                          type='button'
                                          $variant='secondary'
                                          onClick={() => {
                                            const list = [...(corretor.captadores ?? []), { id: '', nome: undefined, porcentagem: undefined }];
                                            const updated = [...comissoesCorretores];
                                            updated[index].captadores = list;
                                            setValue('comissoesCorretores', updated);
                                          }}
                                          style={{ marginTop: '8px' }}
                                        >
                                          <MdPerson /> Adicionar captador ({(corretor.captadores ?? []).length}/3)
                                        </Button>
                                      )}
                                    </FormGroup>
                                  </FormGrid>
                                </ComissaoItem>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <Divider />

                      {/* Gerências */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '32px',
                            gap: '16px',
                            paddingBottom: '16px',
                            borderBottom: '2px solid var(--color-border)',
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
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background:
                                  'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(166, 49, 38, 0.3)',
                              }}
                            >
                              <MdWork size={24} />
                            </div>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                              }}
                            >
                              Gerências
                            </h3>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                            gap: '20px',
                            marginBottom: '24px',
                          }}
                        >
                          {[1, 2, 3, 4].map(nivel => {
                            const gerencia = comissoesGerencias.find(
                              g => g.nivel === nivel
                            );
                            const nivelColors = [
                              {
                                bg: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                border: themeColors.primary,
                              },
                              {
                                bg: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                border: themeColors.primary,
                              },
                              {
                                bg: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                                border: themeColors.primary,
                              },
                              {
                                bg: `linear-gradient(135deg, ${themeColors.primaryDark} 0%, ${themeColors.primary} 100%)`,
                                border: themeColors.primaryDark,
                              },
                            ];
                            const nivelColor = nivelColors[nivel - 1];

                            return (
                              <ComissaoItem
                                key={nivel}
                                style={{
                                  marginBottom: 0,
                                  position: 'relative',
                                  overflow: 'hidden',
                                  border: gerencia
                                    ? `2px solid ${nivelColor.border}`
                                    : '2px dashed var(--color-border)',
                                  background: gerencia
                                    ? 'var(--color-background-secondary)'
                                    : 'var(--color-background)',
                                }}
                              >
                                {gerencia && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      height: '4px',
                                      background: nivelColor.bg,
                                    }}
                                  />
                                )}
                                <ComissaoItemHeader
                                  style={{
                                    marginBottom: gerencia ? '20px' : '0',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      flex: 1,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: gerencia
                                          ? nivelColor.bg
                                          : 'var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1.125rem',
                                        boxShadow: gerencia
                                          ? '0 2px 8px rgba(0, 0, 0, 0.15)'
                                          : 'none',
                                        transition: 'all 0.3s ease',
                                      }}
                                    >
                                      {nivel}
                                    </div>
                                    <ComissaoItemTitle
                                      style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 600,
                                        color: gerencia
                                          ? 'var(--color-text)'
                                          : 'var(--color-text-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                      }}
                                    >
                                      <MdWork
                                        size={20}
                                        style={{
                                          color: gerencia
                                            ? nivelColor.border
                                            : 'var(--color-text-secondary)',
                                        }}
                                      />
                                      Gerência {nivel}
                                    </ComissaoItemTitle>
                                  </div>
                                  {gerencia && (
                                    <RemoveButton
                                      type='button'
                                      onClick={() => removeGerencia(nivel)}
                                      style={{
                                        padding: '8px 16px',
                                        fontSize: '0.875rem',
                                        borderRadius: '8px',
                                      }}
                                    >
                                      <MdDelete size={18} /> Remover
                                    </RemoveButton>
                                  )}
                                </ComissaoItemHeader>
                                {gerencia ? (
                                  <div
                                    style={{
                                      paddingTop: '8px',
                                      transition: 'all 0.3s ease-in',
                                    }}
                                  >
                                    <FormGrid
                                      $columns={1}
                                      style={{ gap: '16px' }}
                                    >
                                      <FormGroup>
                                        <FormLabel
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '8px',
                                            fontWeight: 600,
                                          }}
                                        >
                                          <MdPerson
                                            size={18}
                                            style={{ color: nivelColor.border }}
                                          />
                                          Nome do Gestor
                                        </FormLabel>
                                        <FormSelect
                                          value={gerencia.nome || ''}
                                          onChange={e => {
                                            const updated = [
                                              ...comissoesGerencias,
                                            ];
                                            const index = updated.findIndex(
                                              g => g.nivel === nivel
                                            );
                                            if (index >= 0) {
                                              updated[index].nome =
                                                e.target.value;
                                              setValue(
                                                'comissoesGerencias',
                                                updated
                                              );
                                            }
                                          }}
                                          style={{
                                            borderLeft: `3px solid ${nivelColor.border}`,
                                            paddingLeft: '12px',
                                            width: '100%',
                                            minWidth: 0,
                                          }}
                                        >
                                          <option value=''>
                                            Selecione o gestor...
                                          </option>
                                          {gestoresDisponiveis.map(g => (
                                            <option key={g.id} value={g.nome}>
                                              {g.nome}
                                              {g.unidade
                                                ? ` · ${g.unidade}`
                                                : ''}
                                            </option>
                                          ))}
                                        </FormSelect>
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '8px',
                                            fontWeight: 600,
                                          }}
                                        >
                                          <MdAttachMoney
                                            size={18}
                                            style={{ color: nivelColor.border }}
                                          />
                                          Porcentagem{' '}
                                          <RequiredIndicator>
                                            *
                                          </RequiredIndicator>
                                        </FormLabel>
                                        <div style={{ position: 'relative' }}>
                                          <FormInput
                                            type='number'
                                            min='0'
                                            max='100'
                                            step='0.01'
                                            value={gerencia.porcentagem}
                                            onChange={e => {
                                              const updated = [
                                                ...comissoesGerencias,
                                              ];
                                              const index = updated.findIndex(
                                                g => g.nivel === nivel
                                              );
                                              if (index >= 0) {
                                                updated[index].porcentagem =
                                                  parseFloat(e.target.value) ||
                                                  0;
                                                setValue(
                                                  'comissoesGerencias',
                                                  updated
                                                );
                                              }
                                            }}
                                            placeholder='0.00'
                                            style={{
                                              borderLeft: `3px solid ${nivelColor.border}`,
                                              paddingLeft: '12px',
                                              paddingRight: '50px',
                                            }}
                                          />
                                          <div
                                            style={{
                                              position: 'absolute',
                                              right: '12px',
                                              top: '50%',
                                              transform: 'translateY(-50%)',
                                              background: nivelColor.bg,
                                              color: 'white',
                                              padding: '4px 12px',
                                              borderRadius: '6px',
                                              fontSize: '0.875rem',
                                              fontWeight: 600,
                                              pointerEvents: 'none',
                                            }}
                                          >
                                            %
                                          </div>
                                        </div>
                                      </FormGroup>
                                    </FormGrid>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      padding: '32px 20px',
                                      textAlign: 'center',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: '12px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        background: 'var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-text-secondary)',
                                        marginBottom: '8px',
                                      }}
                                    >
                                      <MdWork size={32} />
                                    </div>
                                    <p
                                      style={{
                                        margin: 0,
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.875rem',
                                        marginBottom: '16px',
                                      }}
                                    >
                                      Adicione a gerência {nivel} para
                                      configurar
                                    </p>
                                    <AddButton
                                      type='button'
                                      onClick={() => addGerencia(nivel)}
                                      style={{
                                        width: 'auto',
                                        margin: '0 auto',
                                        padding: '12px 24px',
                                        borderRadius: '10px',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                      }}
                                    >
                                      <MdAdd size={20} /> Adicionar Gerência{' '}
                                      {nivel}
                                    </AddButton>
                                  </div>
                                )}
                              </ComissaoItem>
                            );
                          })}
                        </div>
                      </div>

                      <Divider style={{ margin: '32px 0' }} />

                      {/* Total de Porcentagens */}
                      <div
                        style={{
                          background:
                            totalPorcentagens > 0
                              ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`
                              : `linear-gradient(135deg, ${themeColors.error} 0%, ${themeColors.errorDark} 100%)`,
                          borderRadius: '16px',
                          padding: '24px',
                          color: 'white',
                          boxShadow:
                            totalPorcentagens > 0
                              ? `0 8px 24px ${themeColors.primary}4D`
                              : `0 8px 24px ${themeColors.error}4D`,
                          position: 'relative',
                          overflow: 'hidden',
                          marginTop: '8px',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)',
                          }}
                        />
                        <div
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          }}
                        >
                          <div
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '14px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(10px)',
                              flexShrink: 0,
                            }}
                          >
                            {totalPorcentagens > 0 ? (
                              <MdCheckCircle size={28} />
                            ) : (
                              <MdError size={28} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                marginBottom: '8px',
                                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                              }}
                            >
                              Total de Porcentagens:{' '}
                              {totalPorcentagens.toFixed(2)}%
                            </div>
                            {totalPorcentagens > 0 && (
                              <div
                                style={{
                                  fontSize: '0.9375rem',
                                  opacity: 0.95,
                                  fontWeight: 500,
                                }}
                              >
                                Total: {totalPorcentagens.toFixed(2)}%
                              </div>
                            )}
                            {totalPorcentagens === 0 && (
                              <div
                                style={{
                                  fontSize: '0.9375rem',
                                  opacity: 0.95,
                                  fontWeight: 500,
                                }}
                              >
                                Preencha as porcentagens de comissão
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </SectionContent>
                  </CollapsibleSection>

                  {/* Bloco 9 - Colaboradores */}
                  <CollapsibleSection
                    $isExpanded={expandedSections.colaboradores}
                  >
                    <SectionHeader
                      onClick={() => toggleSection('colaboradores')}
                    >
                      <SectionHeaderLeft>
                        <SectionIcon>
                          <MdGroup />
                        </SectionIcon>
                        <SectionTitleWrapper>
                          <StyledSectionTitle>Colaboradores</StyledSectionTitle>
                          <SectionDescription>
                            Colaboradores envolvidos na venda
                          </SectionDescription>
                        </SectionTitleWrapper>
                      </SectionHeaderLeft>
                      <ExpandIcon $isExpanded={expandedSections.colaboradores}>
                        {expandedSections.colaboradores ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </ExpandIcon>
                    </SectionHeader>
                    <SectionContent
                      $isExpanded={expandedSections.colaboradores}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                          gap: '24px',
                        }}
                      >
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '-50px',
                              right: '-50px',
                              width: '150px',
                              height: '150px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.1)',
                              filter: 'blur(40px)',
                            }}
                          />
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '12px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <MdPerson size={24} />
                              </div>
                              <FormLabel
                                style={{
                                  color: 'white',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  margin: 0,
                                }}
                              >
                                Colaborador Pré-Atendimento
                              </FormLabel>
                            </div>
                            <FormInput
                              type='text'
                              {...register('colaboradorPreAtendimento')}
                              placeholder='Nome ou ID do colaborador'
                              style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                color: 'var(--color-text)',
                                width: '100%',
                              }}
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.primaryDark} 100%)`,
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            boxShadow: `0 8px 24px ${themeColors.primary}4D`,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: '-50px',
                              right: '-50px',
                              width: '150px',
                              height: '150px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.1)',
                              filter: 'blur(40px)',
                            }}
                          />
                          <div style={{ position: 'relative', zIndex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '16px',
                              }}
                            >
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '12px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <MdPhone size={24} />
                              </div>
                              <FormLabel
                                style={{
                                  color: 'white',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  margin: 0,
                                }}
                              >
                                Colaborador Central de Captação
                              </FormLabel>
                            </div>
                            <FormInput
                              type='text'
                              {...register('colaboradorCentralCaptacao')}
                              placeholder='Nome ou ID do colaborador'
                              style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                color: 'var(--color-text)',
                                width: '100%',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </SectionContent>
                  </CollapsibleSection>
                </fieldset>

                {/* Footer com botões */}
                <FormFooter>
                  <FooterLeft>
                    <PercentageBadge $isValid={totalPorcentagens > 0}>
                      {totalPorcentagens.toFixed(2)}% das comissões
                    </PercentageBadge>
                  </FooterLeft>
                  <FooterRight>
                    {/* Grupo principal: Finalizar ficha (destaque) + Salvar — só quando ficha não está finalizada */}
                    {!isFichaFinalizada && (
                      <FooterPrimaryGroup>
                        {fichaIdFromUrl && (
                          <FooterHighlightButton
                            type='button'
                            $variant='primary'
                            onClick={handleFinalizarFicha}
                            disabled={isSubmitting}
                          >
                            <MdCheckCircle size={20} />
                            Finalizar ficha
                          </FooterHighlightButton>
                        )}
                        <Button
                          type='submit'
                          $variant='primary'
                          disabled={isSubmitting}
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
                              <MdSave />{' '}
                              {fichaIdFromUrl
                                ? 'Salvar alterações'
                                : 'Salvar Ficha de Venda'}
                            </>
                          )}
                        </Button>
                      </FooterPrimaryGroup>
                    )}
                    {/* Grupo secundário: Baixar PDF, Compartilhar, Limpar */}
                    <FooterSecondaryGroup>
                      {fichaIdFromUrl && userCpf && userTipo === 'gestor' && (
                        <>
                          <Button
                            type='button'
                            $variant='secondary'
                            onClick={handleBaixarPdf}
                            disabled={isSubmitting}
                          >
                            <MdPictureAsPdf size={18} />
                            Baixar PDF
                          </Button>
                          {isFichaFinalizada && (
                            <Button
                              type='button'
                              $variant='secondary'
                              onClick={handleOpenReenviarEmail}
                              disabled={isSubmitting}
                            >
                              <MdEmail size={18} />
                              Reenviar email
                            </Button>
                          )}
                        </>
                      )}
                      {!isFichaFinalizada && (
                        <>
                          <Button
                            type='button'
                            $variant='secondary'
                            onClick={handleShareFicha}
                            disabled={isSubmitting || isSavingForShare}
                          >
                            {isSavingForShare ? (
                              <>
                                <div
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid currentColor',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                  }}
                                />
                                Salvando...
                              </>
                            ) : (
                              <>
                                <MdShare size={18} />
                                Compartilhar
                              </>
                            )}
                          </Button>
                          <Button
                            type='button'
                            $variant='secondary'
                            onClick={handleClearDraft}
                            disabled={isSubmitting}
                          >
                            Limpar Formulário
                          </Button>
                        </>
                      )}
                    </FooterSecondaryGroup>
                  </FooterRight>
                </FormFooter>
              </form>

              {/* Modal de Confirmação */}
              {showConfirmModal && pendingPayload && (
                <ModalOverlay
                  $isOpen={showConfirmModal}
                  onClick={handleCancelSubmit}
                >
                  <ModalContainer onClick={e => e.stopPropagation()}>
                    <ModalHeader>
                      <ModalTitle>
                        <MdWarning />
                        {pendingPayload.status === 'disponivel'
                          ? 'Finalizar ficha?'
                          : 'Confirmar Envio da Ficha de Venda'}
                      </ModalTitle>
                      <ModalCloseButton onClick={handleCancelSubmit}>
                        <MdClose />
                      </ModalCloseButton>
                    </ModalHeader>

                    <ModalBody>
                      {pendingPayload.status === 'disponivel' && (
                        <ModalWarning style={{ marginBottom: '16px' }}>
                          <ModalWarningText>
                            A ficha será marcada como finalizada e não poderá
                            mais ser editada.
                          </ModalWarningText>
                        </ModalWarning>
                      )}
                      <ModalSummary>
                        <SummarySection>
                          <SummaryTitle>
                            <MdCalendarToday />
                            Dados da Venda
                          </SummaryTitle>
                          <SummaryItem>
                            <SummaryLabel>Data da Venda</SummaryLabel>
                            <SummaryValue>
                              {new Date(
                                pendingPayload.venda.dataVenda
                              ).toLocaleDateString('pt-BR')}
                            </SummaryValue>
                          </SummaryItem>
                          {pendingPayload.venda.secretariaPresentes && (
                            <SummaryItem>
                              <SummaryLabel>Espumante de Brinde</SummaryLabel>
                              <SummaryValue>
                                {pendingPayload.venda.secretariaPresentes}
                              </SummaryValue>
                            </SummaryItem>
                          )}
                          {pendingPayload.venda.midiaOrigem && (
                            <SummaryItem>
                              <SummaryLabel>Mídia de Origem</SummaryLabel>
                              <SummaryValue>
                                {pendingPayload.venda.midiaOrigem}
                              </SummaryValue>
                            </SummaryItem>
                          )}
                          {pendingPayload.venda.gerente && (
                            <SummaryItem>
                              <SummaryLabel>Gerente</SummaryLabel>
                              <SummaryValue>
                                {pendingPayload.venda.gerente}
                              </SummaryValue>
                            </SummaryItem>
                          )}
                          <SummaryItem>
                            <SummaryLabel>Unidade de Venda</SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.venda.unidadeVenda}
                            </SummaryValue>
                          </SummaryItem>
                        </SummarySection>

                        <SummarySection>
                          <SummaryTitle>
                            <MdPerson />
                            Comprador
                          </SummaryTitle>
                          <SummaryItem>
                            <SummaryLabel>Nome</SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.comprador.nome}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>CPF</SummaryLabel>
                            <SummaryValue>
                              {maskCPF(pendingPayload.comprador.cpf)}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>
                              <MdEmail
                                style={{
                                  fontSize: '0.875rem',
                                  marginRight: '4px',
                                }}
                              />
                              E-mail
                            </SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.comprador.email}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>
                              <MdPhone
                                style={{
                                  fontSize: '0.875rem',
                                  marginRight: '4px',
                                }}
                              />
                              Celular
                            </SummaryLabel>
                            <SummaryValue>
                              {maskCelPhone(pendingPayload.comprador.celular)}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>
                              <MdLocationOn
                                style={{
                                  fontSize: '0.875rem',
                                  marginRight: '4px',
                                }}
                              />
                              Endereço
                            </SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.comprador.endereco.rua},{' '}
                              {pendingPayload.comprador.endereco.numero}
                              {pendingPayload.comprador.endereco.complemento &&
                                ` - ${pendingPayload.comprador.endereco.complemento}`}
                              <br />
                              {pendingPayload.comprador.endereco.bairro},{' '}
                              {pendingPayload.comprador.endereco.cidade} -{' '}
                              {pendingPayload.comprador.endereco.estado}
                              <br />
                              CEP:{' '}
                              {maskCEP(pendingPayload.comprador.endereco.cep)}
                            </SummaryValue>
                          </SummaryItem>
                        </SummarySection>

                        <SummarySection>
                          <SummaryTitle>
                            <MdPerson />
                            Vendedor
                          </SummaryTitle>
                          <SummaryItem>
                            <SummaryLabel>Nome</SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.vendedor.nome}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>CPF</SummaryLabel>
                            <SummaryValue>
                              {maskCPF(pendingPayload.vendedor.cpf)}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>
                              <MdEmail
                                style={{
                                  fontSize: '0.875rem',
                                  marginRight: '4px',
                                }}
                              />
                              E-mail
                            </SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.vendedor.email}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>
                              <MdPhone
                                style={{
                                  fontSize: '0.875rem',
                                  marginRight: '4px',
                                }}
                              />
                              Celular
                            </SummaryLabel>
                            <SummaryValue>
                              {maskCelPhone(pendingPayload.vendedor.celular)}
                            </SummaryValue>
                          </SummaryItem>
                        </SummarySection>

                        <SummarySection>
                          <SummaryTitle>
                            <MdHome />
                            Imóvel
                          </SummaryTitle>
                          <SummaryItem>
                            <SummaryLabel>Código</SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.imovel.codigo}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>Endereço</SummaryLabel>
                            <SummaryValue>
                              {pendingPayload.imovel.endereco},{' '}
                              {pendingPayload.imovel.numero}
                              {pendingPayload.imovel.complemento &&
                                ` - ${pendingPayload.imovel.complemento}`}
                              <br />
                              {pendingPayload.imovel.bairro},{' '}
                              {pendingPayload.imovel.cidade} -{' '}
                              {pendingPayload.imovel.estado}
                              <br />
                              CEP: {maskCEP(pendingPayload.imovel.cep)}
                            </SummaryValue>
                          </SummaryItem>
                        </SummarySection>

                        <SummarySection>
                          <SummaryTitle>
                            <MdAttachMoney />
                            Valores Financeiros
                          </SummaryTitle>
                          <SummaryItem>
                            <SummaryLabel>Valor da Venda</SummaryLabel>
                            <SummaryValue>
                              {formatCurrencyValue(
                                pendingPayload.financeiro.valorVenda
                              )}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>Comissão Total</SummaryLabel>
                            <SummaryValue>
                              {formatCurrencyValue(
                                pendingPayload.financeiro.comissaoTotal
                              )}
                            </SummaryValue>
                          </SummaryItem>
                          <SummaryItem>
                            <SummaryLabel>Valor de Meta (5%)</SummaryLabel>
                            <SummaryValue>
                              {formatCurrencyValue(
                                pendingPayload.financeiro.valorMeta
                              )}
                            </SummaryValue>
                          </SummaryItem>
                        </SummarySection>

                        {pendingPayload.comissoes.corretores.length > 0 && (
                          <SummarySection>
                            <SummaryTitle>
                              <MdGroup />
                              Comissões de Corretores
                            </SummaryTitle>
                            {pendingPayload.comissoes.corretores.map(
                              (corretor, idx) => {
                                const corretorNome =
                                  corretoresDisponiveis.find(
                                    c => c.id === corretor.id
                                  )?.nome ?? corretor.id;
                                const captadoresList = (corretor as any).captadores?.length
                                  ? (corretor as any).captadores
                                  : (corretor as any).captador
                                    ? [{ id: (corretor as any).captador, nome: undefined, porcentagem: undefined }]
                                    : [];
                                const captadoresTexto =
                                  captadoresList.length > 0
                                    ? captadoresList
                                        .map(
                                          (cap: any) =>
                                            `${opcoesCaptador.find(u => u.id === cap.id)?.nome ?? cap.nome ?? cap.id}${cap.porcentagem != null ? ` (${cap.porcentagem}%)` : ''}`
                                        )
                                        .join(', ')
                                    : null;
                                return (
                                  <SummaryItem key={idx}>
                                    <SummaryLabel>{corretorNome}</SummaryLabel>
                                    <SummaryValue>
                                      {corretor.porcentagem}%
                                      {captadoresTexto &&
                                        ` (Captadores: ${captadoresTexto})`}
                                    </SummaryValue>
                                  </SummaryItem>
                                );
                              }
                            )}
                          </SummarySection>
                        )}

                        {pendingPayload.comissoes.gerencias.length > 0 && (
                          <SummarySection>
                            <SummaryTitle>
                              <MdWork />
                              Comissões de Gerências
                            </SummaryTitle>
                            {pendingPayload.comissoes.gerencias.map(
                              (gerencia, idx) => (
                                <SummaryItem key={idx}>
                                  <SummaryLabel>
                                    Nível {gerencia.nivel}
                                    {(gerencia as any).nome &&
                                      ` - ${(gerencia as any).nome}`}
                                  </SummaryLabel>
                                  <SummaryValue>
                                    {gerencia.porcentagem}%
                                  </SummaryValue>
                                </SummaryItem>
                              )
                            )}
                          </SummarySection>
                        )}
                      </ModalSummary>

                      <ModalWarning>
                        <MdWarning />
                        <ModalWarningText>
                          <strong>Confirme antes de enviar:</strong> Após o
                          envio, os dados serão registrados no sistema e não
                          poderão ser alterados diretamente pelo formulário.
                          Verifique se todas as informações estão corretas.
                        </ModalWarningText>
                      </ModalWarning>
                    </ModalBody>

                    <ModalFooter>
                      <ModalButton
                        $variant='secondary'
                        onClick={handleCancelSubmit}
                        disabled={isSubmitting}
                      >
                        <MdClose />
                        Cancelar
                      </ModalButton>
                      <ModalButton
                        $variant='primary'
                        onClick={handleConfirmSubmit}
                        disabled={isSubmitting}
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
                        ) : pendingPayload.status === 'disponivel' ? (
                          <>
                            <MdCheckCircle />
                            Finalizar ficha
                          </>
                        ) : (
                          <>
                            <MdCheckCircle />
                            Confirmar e Enviar
                          </>
                        )}
                      </ModalButton>
                    </ModalFooter>
                  </ModalContainer>
                </ModalOverlay>
              )}

              {/* Modal Reenviar email (ficha finalizada) */}
              {showReenviarEmailModal && (
                <ModalOverlay
                  $isOpen={showReenviarEmailModal}
                  onClick={handleCloseReenviarEmail}
                >
                  <ModalContainer
                    onClick={e => e.stopPropagation()}
                    style={{ maxWidth: '480px' }}
                  >
                    <ModalHeader>
                      <ModalTitle>
                        <MdEmail />
                        Reenviar email
                      </ModalTitle>
                      <ModalCloseButton onClick={handleCloseReenviarEmail}>
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
                        O PDF da ficha de venda será enviado para os emails
                        informados. Digite um ou mais emails (separados por
                        vírgula ou um por linha).
                      </p>
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
                        onClick={handleCloseReenviarEmail}
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

              {/* Modal de Compartilhamento */}
              {showShareModal && (
                <ModalOverlay
                  $isOpen={showShareModal}
                  onClick={() => setShowShareModal(false)}
                >
                  <ModalContainer
                    onClick={e => e.stopPropagation()}
                    style={{ maxWidth: '600px' }}
                  >
                    <ModalHeader>
                      <ModalTitle>
                        <MdShare />
                        Compartilhar Ficha de Venda
                      </ModalTitle>
                      <ModalCloseButton
                        onClick={() => setShowShareModal(false)}
                      >
                        <MdClose />
                      </ModalCloseButton>
                    </ModalHeader>

                    <ModalBody>
                      <div style={{ marginBottom: '20px' }}>
                        <p
                          style={{
                            color: 'var(--color-text)',
                            marginBottom: '16px',
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                          }}
                        >
                          Compartilhe este link para que o{' '}
                          <strong>gestor vinculado à ficha</strong> (ou você em
                          outro dispositivo) possa continuar o preenchimento. O
                          link só permite edição enquanto a ficha estiver em{' '}
                          <strong>rascunho</strong>.
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            background: 'var(--color-background-secondary)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          <input
                            type='text'
                            value={shareLink}
                            readOnly
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--color-text)',
                              fontSize: '0.875rem',
                              fontFamily: 'monospace',
                              outline: 'none',
                            }}
                          />
                          <Button
                            type='button'
                            $variant='primary'
                            onClick={handleCopyLink}
                            style={{
                              padding: '8px 16px',
                              minWidth: 'auto',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <MdContentCopy size={18} />
                            Copiar
                          </Button>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '16px',
                          background: 'var(--color-warning-light)',
                          borderRadius: '8px',
                          border: '1px solid var(--color-warning)',
                          marginTop: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'start',
                            gap: '12px',
                          }}
                        >
                          <MdWarning
                            style={{
                              color: 'var(--color-warning)',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          />
                          <div
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--color-text)',
                            }}
                          >
                            <strong>Importante:</strong> Somente o gestor
                            vinculado a esta ficha (CPF cadastrado na unidade)
                            pode acessar o link. Compartilhe apenas com pessoas
                            autorizadas. Após finalizar a ficha, o link
                            continuará permitindo visualização (somente leitura)
                            para o gestor.
                          </div>
                        </div>
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <ModalButton
                        $variant='secondary'
                        onClick={() => setShowShareModal(false)}
                      >
                        <MdClose />
                        Fechar
                      </ModalButton>
                    </ModalFooter>
                  </ModalContainer>
                </ModalOverlay>
              )}
            </>
          )}
        </FichaVendaContainer>
      </div>
    </>
  );
};

export default FichaVendaPage;
