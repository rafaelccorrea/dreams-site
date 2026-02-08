import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdHome, MdRefresh, MdEdit } from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import {
  formatCurrency,
  formatArea,
  getNumericValue,
  formatCurrencyValue,
} from '../utils/masks';

// Função auxiliar para converter número do backend para formato de área brasileiro
// Converte número para string de dígitos que será formatada por formatArea
const formatAreaFromNumber = (value: number | null | undefined): string => {
  if (!value || value === 0) return '';
  // Converter número para string de dígitos (ex: 120.5 -> "12050" para ser formatado como "120,50")
  // Multiplicar por 100 para preservar 2 casas decimais
  const valueInCents = Math.round(value * 100);
  return valueInCents.toString();
};
import { useAddress } from '../hooks/useAddress';
import { formatZipCode } from '../services/addressApi';
import { toast } from 'react-toastify';
import { propertyApi } from '../services/propertyApi';
import { galleryApi, type GalleryImage } from '../services/galleryApi';
import type { PropertyType, PropertyStatus } from '../types/property';
import { PropertyStatus as PropertyStatusEnum } from '../types/property';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { useModuleAccess } from '../hooks/useModuleAccess';
import { useGenerateDescription } from '../hooks/useGenerateDescription';
import type { GeneratedDescription } from '../types/ai';
import { PropertyAIDescriptionModal } from '../components/modals/PropertyAIDescriptionModal';
import { PropertyFormShimmer } from '../components/common/Shimmer';
import { PropertySuccessModal } from '../components/modals/PropertySuccessModal';
import { ClientSelector } from '../components/common/ClientSelector';
import { CondominiumSelector } from '../components/common/CondominiumSelector';
import { InfoTooltip } from '../components/common/InfoTooltip';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { usePropertyClients } from '../hooks/usePropertyClients';
import { useStatesCities } from '../hooks/useStatesCities';
import { useUsers } from '../hooks/useUsers';
import { PropertyLinkImport } from '../components/property/PropertyLinkImport';
import type { PropertyImportData } from '../types/propertyImport';
import { WatermarkInfoModal } from '../components/modals/WatermarkInfoModal';
import { useOwner } from '../hooks/useOwner';
import { companyApi } from '../services/companyApi';
import {
  ComplementMultiSelect,
  type ComplementItem,
} from '../components/forms/ComplementMultiSelect';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  ProgressContainer,
  ProgressTitle,
  ProgressSteps,
  Step,
  StepNumber,
  FormContainer,
  SectionTitle,
  SectionDescription,
  FieldContainer,
  FieldLabel,
  RequiredIndicator,
  ErrorMessage,
  FieldContainerWithError,
  FieldInput,
  FieldTextarea,
  FieldSelect,
  RowContainer,
  FormActions,
  Button,
  SuccessMessage,
} from '../styles/pages/CreatePropertyPageStyles';

// Definição das seções
const sections = [
  {
    id: 'basic',
    title: 'Informações Básicas',
    description: 'Dados essenciais da propriedade',
    icon: '📝',
  },
  {
    id: 'location',
    title: 'Localização',
    description: 'Endereço e localização da propriedade',
    icon: '📍',
  },
  {
    id: 'characteristics',
    title: 'Características',
    description: 'Detalhes físicos da propriedade',
    icon: '🏗️',
  },
  {
    id: 'pricing',
    title: 'Valores',
    description: 'Preços e custos relacionados',
    icon: '💰',
  },
  {
    id: 'gallery',
    title: 'Galeria',
    description: 'Imagens da propriedade',
    icon: '📸',
  },
  {
    id: 'clients',
    title: 'Clientes',
    description: 'Vincular clientes à propriedade',
    icon: '👥',
  },
  {
    id: 'mcmv',
    title: 'MCMV',
    description: 'Informações do programa Minha Casa Minha Vida',
    icon: '🏠',
  },
  {
    id: 'owner',
    title: 'Proprietário',
    description: 'Informações do proprietário da propriedade',
    icon: '👤',
  },
  {
    id: 'review',
    title: 'Revisão',
    description: 'Confirme os dados antes de salvar',
    icon: '✅',
  },
];

// Componente principal
const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isModuleAvailableForCompany } = useModuleAccess();
  const hasMCMVModule = isModuleAvailableForCompany('mcmv');

  // Detectar se é modo de edição
  const isEditMode = Boolean(id);
  const propertyId = id;

  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(
    null
  );
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<GalleryImage[]>([]);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [propertyLoadError, setPropertyLoadError] = useState<string | null>(
    null
  );
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClientsLocal, setSelectedClientsLocal] = useState<any[]>([]);
  // IA - geração de descrições
  const {
    generate,
    loading: aiLoading,
    error: aiError,
    clearError: clearAiError,
  } = useGenerateDescription();
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [generatedVariants, setGeneratedVariants] = useState<
    GeneratedDescription[]
  >([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [descriptionEditable, setDescriptionEditable] = useState<boolean>(true);
  const [hasAutoGeneratedOnReview, setHasAutoGeneratedOnReview] =
    useState<boolean>(false);
  const [aiGenerationError, setAiGenerationError] = useState<boolean>(false);
  const [complementArray, setComplementArray] = useState<string[]>([]);

  // Hook para verificar assinatura
  const { checkSubscription } = useSubscription();
  const { getCurrentUser } = useAuth();
  const { isOwner } = useOwner();

  // Estado para modal de marca d'água
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Hook para gerenciar clientes da propriedade
  const { availableClients, fetchAvailableClients, assignClientsToProperty } =
    usePropertyClients();

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

  // Hook para buscar usuários (para seleção de captador)
  const { users, getUsers } = useUsers();

  // Hook para verificar permissões
  const permissionsContext = usePermissionsContextOptional();
  const hasCondominiumPermission =
    permissionsContext?.hasPermission('condominium:view') || false;

  const [formData, setFormData] = useState({
    // Informações Básicas
    title: '',
    description: '',
    type: '',
    status: 'draft',

    // Localização
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',

    // Características
    totalArea: '',
    builtArea: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',

    // Valores
    salePrice: '',
    rentPrice: '',
    condominiumFee: '',
    iptu: '',

    // Negociação
    acceptsNegotiation: false,
    minSalePrice: '',
    minRentPrice: '',
    offerBelowMinSaleAction: 'reject' as 'reject' | 'pending' | 'notify',
    offerBelowMinRentAction: 'reject' as 'reject' | 'pending' | 'notify',

    // Características adicionais
    features: [] as string[],
    isActive: true,
    isFeatured: false,
    isAvailableForSite: false,

    // Campos MCMV (disponíveis apenas para empresas com módulo MCMV habilitado)
    mcmvEligible: false,
    mcmvIncomeRange: '' as 'faixa1' | 'faixa2' | 'faixa3' | '',
    mcmvMaxValue: '',
    mcmvSubsidy: '',
    mcmvDocumentation: [] as string[],
    mcmvNotes: '',

    // Captador
    capturedById: '',

    // Informações do Proprietário
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerDocument: '',
    ownerAddress: '',

    // Condomínio
    isCondominium: false,
    condominiumId: '',
  });

  // Inicializar capturedById com o usuário atual
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.id && !formData.capturedById) {
      setFormData(prev => ({
        ...prev,
        capturedById: currentUser.id,
      }));
    }
  }, [getCurrentUser]);

  // Verificar se deve mostrar modal de marca d'água
  useEffect(() => {
    const checkWatermarkModal = async () => {
      // Apenas mostrar se não for modo de edição
      if (isEditMode) return;

      // Apenas mostrar se usuário for owner
      if (!isOwner) return;

      try {
        // Buscar ID da empresa selecionada
        const selectedCompanyId = localStorage.getItem(
          'dream_keys_selected_company_id'
        );
        if (!selectedCompanyId) return;

        setCompanyId(selectedCompanyId);

        // Verificar se já foi mostrado antes (usando localStorage)
        const hasSeenModal = localStorage.getItem(
          `watermark_modal_shown_${selectedCompanyId}`
        );
        if (hasSeenModal === 'true') return;

        // Buscar dados da empresa
        const company = await companyApi.getCompanyById(selectedCompanyId);

        // Verificar se empresa não tem marca d'água
        if (company.watermark) return;

        // Verificar se é a primeira propriedade (total === 0)
        const propertiesResponse = await propertyApi.getProperties(
          {},
          { page: 1, limit: 1 }
        );
        if (propertiesResponse.total > 0) return;

        // Todas as condições atendidas, mostrar modal
        setShowWatermarkModal(true);
      } catch (error) {
        console.error(
          'Erro ao verificar condições do modal de marca dágua:',
          error
        );
      }
    };

    checkWatermarkModal();
  }, [isEditMode, isOwner]);

  // Carregar lista de usuários
  useEffect(() => {
    getUsers({ page: 1, limit: 100 });
  }, [getUsers]);

  // Atualiza dados do formulário quando endereço é encontrado
  // Carregar dados da propriedade no modo de edição
  useEffect(() => {
    const loadPropertyData = async () => {
      if (isEditMode && propertyId) {
        // console.log('🔄 Iniciando carregamento da propriedade:', propertyId);
        setIsLoadingProperty(true);
        setPropertyLoadError(null); // Limpar erro anterior
        try {
          // console.log('🔄 Carregando dados da propriedade para edição...');
          const response = await propertyApi.getPropertyById(propertyId);

          // Converter complement string para array de ComplementItem
          if (response.complement) {
            // Tentar parsear como "Tipo: Valor" ou apenas "Tipo"
            const parts = response.complement
              .split(',')
              .map(c => c.trim())
              .filter(c => c);
            const items: ComplementItem[] = parts.map(part => {
              const colonIndex = part.indexOf(':');
              if (colonIndex > 0) {
                return {
                  type: part.substring(0, colonIndex).trim(),
                  value: part.substring(colonIndex + 1).trim(),
                };
              }
              return { type: part };
            });
            setComplementArray(items);
          } else {
            setComplementArray([]);
          }

          // Preencher o formulário com os dados da propriedade
          setFormData({
            title: response.title || '',
            description: response.description || '',
            type: response.type || 'house',
            status: response.status || 'available',
            street: response.street || '',
            number: response.number || '',
            complement: response.complement || '',
            neighborhood: response.neighborhood || '',
            city: response.city || '',
            state: response.state || '',
            zipCode: response.zipCode || '',
            totalArea: response.totalArea
              ? formatArea(formatAreaFromNumber(response.totalArea))
              : '',
            builtArea: response.builtArea
              ? formatArea(formatAreaFromNumber(response.builtArea))
              : '',
            bedrooms: response.bedrooms?.toString() || '',
            bathrooms: response.bathrooms?.toString() || '',
            parkingSpaces: response.parkingSpaces?.toString() || '',
            salePrice: response.salePrice
              ? formatCurrencyValue(response.salePrice)
              : '',
            rentPrice: response.rentPrice
              ? formatCurrencyValue(response.rentPrice)
              : '',
            condominiumFee: response.condominiumFee
              ? formatCurrencyValue(response.condominiumFee)
              : '',
            iptu: response.iptu ? formatCurrencyValue(response.iptu) : '',
            features: response.features || [],
            // Negociação
            acceptsNegotiation: response.acceptsNegotiation ?? false,
            minSalePrice: response.minSalePrice
              ? formatCurrencyValue(response.minSalePrice)
              : '',
            minRentPrice: response.minRentPrice
              ? formatCurrencyValue(response.minRentPrice)
              : '',
            offerBelowMinSaleAction:
              response.offerBelowMinSaleAction || 'reject',
            offerBelowMinRentAction:
              response.offerBelowMinRentAction || 'reject',
            isActive: response.isActive ?? true,
            isFeatured: response.isFeatured ?? false,
            // Campos MCMV
            mcmvEligible: response.mcmvEligible ?? false,
            mcmvIncomeRange: response.mcmvIncomeRange || '',
            mcmvMaxValue: response.mcmvMaxValue
              ? formatCurrencyValue(response.mcmvMaxValue)
              : '',
            mcmvSubsidy: response.mcmvSubsidy
              ? formatCurrencyValue(response.mcmvSubsidy)
              : '',
            mcmvDocumentation: response.mcmvDocumentation || [],
            mcmvNotes: response.mcmvNotes || '',
            // Captador - usar usuário atual como fallback para propriedades antigas sem capturedById
            capturedById: response.capturedById || getCurrentUser()?.id || '',
            // Informações do Proprietário
            ownerName: response.owner?.name || '',
            ownerEmail: response.owner?.email || '',
            ownerPhone: response.owner?.phone || '',
            ownerDocument: response.owner?.document || '',
            ownerAddress: response.owner?.address || '',
            // Condomínio
            isCondominium: !!response.condominiumId,
            condominiumId: response.condominiumId || '',
          });

          // Se a propriedade não tinha capturedById, garantir que está preenchido
          if (!response.capturedById) {
            const currentUser = getCurrentUser();
            if (currentUser?.id) {
              setFormData(prev => ({
                ...prev,
                capturedById: currentUser.id,
              }));
            }
          }

          // Carregar imagens existentes
          if (response.images && response.images.length > 0) {
            const galleryImages: GalleryImage[] = response.images.map(img => ({
              id: img.id,
              propertyId: response.id,
              url: img.url,
              alt: img.category || 'Imagem da propriedade',
              isMain: img.isMain,
              order: img.order || 0,
              createdAt: img.createdAt,
              updatedAt: img.createdAt,
            }));
            // Ordenar imagens por ordem
            const sortedImages = galleryImages.sort(
              (a, b) => a.order - b.order
            );
            setUploadedImages(sortedImages);
            setOriginalImages(sortedImages); // Guardar imagens originais para comparação
            setImagePreviews(response.images.map(img => img.url));
          } else {
            setOriginalImages([]);
          }

          // console.log('✅ Dados da propriedade carregados:', response);
        } catch (error) {
          console.error('❌ Erro ao carregar propriedade:', error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Erro desconhecido ao carregar propriedade';
          setPropertyLoadError(errorMessage);
          toast.error('Erro ao carregar dados da propriedade');

          // CORREÇÃO: Não redirecionar imediatamente, mostrar erro na tela
          // navigate('/properties');
        } finally {
          setIsLoadingProperty(false);
        }
      }
    };

    loadPropertyData();
  }, [isEditMode, propertyId, navigate]);

  useEffect(() => {
    if (addressData) {
      setFormData(prev => ({
        ...prev,
        street: addressData.street,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
      }));

      // Sincronizar estado e cidade quando endereço é encontrado via CEP
      if (addressData.state && states.length > 0) {
        const stateFound = states.find(s => s.sigla === addressData.state);
        if (stateFound) {
          handleSetSelectedState(stateFound);
        }
      }
    }
  }, [addressData, states, handleSetSelectedState]);

  // Sincronizar cidade selecionada quando cidades são carregadas e há cidade no formData
  useEffect(() => {
    if (selectedState && cities.length > 0 && formData.city && !loadingCities) {
      const cityFound = cities.find(c => c.nome === formData.city);
      if (cityFound && selectedCity?.id !== cityFound.id) {
        handleSetSelectedCity(cityFound);
      }
    }
  }, [
    cities,
    formData.city,
    selectedState,
    loadingCities,
    selectedCity,
    handleSetSelectedCity,
  ]);

  // Sincronizar estado quando carregar propriedade existente
  useEffect(() => {
    if (isEditMode && formData.state && states.length > 0) {
      const stateFound = states.find(s => s.sigla === formData.state);
      if (stateFound && selectedState?.id !== stateFound.id) {
        handleSetSelectedState(stateFound);
      }
    }
  }, [
    isEditMode,
    formData.state,
    states,
    selectedState,
    handleSetSelectedState,
  ]);

  // Verificar assinatura antes de permitir criação de propriedade
  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const currentUser = getCurrentUser();

        // Se for usuário master, não precisa verificar
        if (currentUser?.role === 'master') {
          // console.log('👑 Usuário master - bypass da verificação de assinatura');
          return;
        }

        // console.log('🔍 CreatePropertyPage: Iniciando verificação de assinatura...');
        // Verificar se tem assinatura ativa
        const status = await checkSubscription();

        // console.log('🔍 CreatePropertyPage: Status da assinatura:', status);
        if (!status.hasActiveSubscription) {
          console.warn('⚠️ CreatePropertyPage: Sem assinatura ativa');
          toast.error(
            'Empresa não possui assinatura ativa. É necessário ter uma assinatura ativa para criar propriedades.'
          );
          const statusReason =
            status.statusReason ??
            (status.subscription?.status as string | undefined);
          const targetRoute =
            statusReason === 'none'
              ? '/subscription-plans'
              : currentUser?.role === 'admin'
                ? '/subscription-management'
                : '/system-unavailable';
          navigate(targetRoute);
          return;
        }

        // console.log('✅ CreatePropertyPage: Assinatura verificada com sucesso');
      } catch (error: any) {
        console.error('❌ CreatePropertyPage: Erro ao verificar assinatura:', {
          message: error?.message,
          error,
        });

        // Se for erro de autenticação, redirecionar
        if (error?.message?.includes('não autenticado')) {
          toast.error('Sessão expirada. Faça login novamente.');
          navigate('/login');
          return;
        }

        // Para outros erros, permitir acesso sem mostrar toast (evitar bloquear usuários)
        // Removido toast.warning para não incomodar o usuário na criação de propriedade
        // console.log('⚠️ CreatePropertyPage: Permitindo acesso apesar do erro de verificação');
      }
    };

    verifySubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem do componente

  // Carregar clientes disponíveis
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.id) {
      fetchAvailableClients(currentUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Formatação especial para campos monetários
    if (
      [
        'salePrice',
        'rentPrice',
        'condominiumFee',
        'iptu',
        'minSalePrice',
        'minRentPrice',
      ].includes(name)
    ) {
      const formattedValue = formatCurrency(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    // Máscara para CEP
    else if (name === 'zipCode') {
      const formattedValue = formatZipCode(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));

      // Buscar endereço quando CEP estiver completo
      if (value.replace(/\D/g, '').length === 8) {
        searchByZipCode(value);
      }
    }
    // Máscara para áreas
    else if (['totalArea', 'builtArea'].includes(name)) {
      const formattedValue = formatArea(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }));
    }
    // Validação para números inteiros
    else if (
      ['bedrooms', 'bathrooms', 'parkingSpaces', 'number'].includes(name)
    ) {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    }
    // Campos normais
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Funções para gerenciar clientes
  const handleClientsChange = (clients: any[]) => {
    setSelectedClientsLocal(clients);
  };

  // Aceitar variação de IA
  const handleAcceptAIVariant = (variant: GeneratedDescription) => {
    setFormData(prev => ({
      ...prev,
      title: variant.title,
      description: variant.description,
    }));
    setAiEnabled(false); // Desmarcar checkbox para permitir edição de título e descrição
    setDescriptionEditable(true);
    setShowAIModal(false);
    toast.success(
      'Título e descrição aplicados ao formulário. Você pode editá-los se desejar.'
    );
  };

  // Auto-gerar na etapa de revisão (step 9 = índice 8)
  useEffect(() => {
    const autoGenerateOnReview = async () => {
      if (currentSection !== 8) {
        // Limpar erro ao sair da revisão
        setAiGenerationError(false);
        return;
      }
      if (!aiEnabled) {
        setAiGenerationError(false);
        return;
      }
      if (hasAutoGeneratedOnReview) return;
      if (generatedVariants.length >= 3) return;
      // Validar se temos insumos suficientes para geração
      const canGenerate =
        formData.type &&
        formData.city &&
        formData.totalArea &&
        String(formData.totalArea).trim() !== '';
      if (!canGenerate) {
        setAiGenerationError(true);
        return;
      }
      try {
        setAiGenerationError(false);
        const req = {
          type: formData.type as any,
          city: formData.city,
          neighborhood: formData.neighborhood || undefined,
          totalArea:
            parseFloat(String(formData.totalArea).replace(',', '.')) || 0,
          builtArea: formData.builtArea
            ? parseFloat(String(formData.builtArea).replace(',', '.'))
            : undefined,
          bedrooms: formData.bedrooms
            ? parseInt(formData.bedrooms, 10)
            : undefined,
          bathrooms: formData.bathrooms
            ? parseInt(formData.bathrooms, 10)
            : undefined,
          parkingSpaces: formData.parkingSpaces
            ? parseInt(formData.parkingSpaces, 10)
            : undefined,
          salePrice: formData.salePrice
            ? parseFloat(getNumericValue(formData.salePrice))
            : undefined,
          rentPrice: formData.rentPrice
            ? parseFloat(getNumericValue(formData.rentPrice))
            : undefined,
          condominiumFee: formData.condominiumFee
            ? parseFloat(getNumericValue(formData.condominiumFee))
            : undefined,
          iptu: formData.iptu
            ? parseFloat(getNumericValue(formData.iptu))
            : undefined,
          features: formData.features || [],
          additionalInfo: undefined,
          // Campos MCMV (apenas se módulo estiver habilitado e imóvel for elegível)
          ...(hasMCMVModule && formData.mcmvEligible
            ? {
                mcmvEligible: formData.mcmvEligible,
                mcmvIncomeRange: formData.mcmvIncomeRange || undefined,
                mcmvMaxValue: formData.mcmvMaxValue
                  ? parseFloat(getNumericValue(formData.mcmvMaxValue))
                  : undefined,
                mcmvSubsidy: formData.mcmvSubsidy
                  ? parseFloat(getNumericValue(formData.mcmvSubsidy))
                  : undefined,
                mcmvNotes: formData.mcmvNotes || undefined,
              }
            : {}),
        };
        const result = await generate(req);
        if (result) {
          const next = [...generatedVariants, result];
          setGeneratedVariants(next);
          setSelectedVariantIndex(next.length - 1);
          setHasAutoGeneratedOnReview(true);
          setAiGenerationError(false);
          // Preenche campos para salvar com a última geração (silenciosamente)
          setFormData(prev => ({
            ...prev,
            title: result.title || prev.title,
            description: result.description || prev.description,
          }));
        } else {
          setAiGenerationError(true);
        }
      } catch (err: any) {
        // Erro silencioso - apenas marca o estado
        setAiGenerationError(true);
      }
    };
    autoGenerateOnReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  const handleAssignClients = async () => {
    if (selectedClientsLocal.length === 0) return;

    if (createdPropertyId) {
      const clientIds = selectedClientsLocal.map(client => client.id);
      await assignClientsToProperty(createdPropertyId, clientIds);
      setShowClientSelector(false);
      setSelectedClientsLocal([]);
      toast.success('Clientes vinculados com sucesso!');
    } else {
      toast.warning('Salve a propriedade primeiro para vincular clientes');
    }
  };

  // Função para validar seção atual
  // Função para validar uma seção específica (usada para validação de steps anteriores)
  const validateSection = (sectionIndex: number): boolean => {
    switch (sectionIndex) {
      case 0: // Informações Básicas
        // Se IA está habilitada, não precisa de título nem descrição (serão gerados na Step 8)
        const titleValid = aiEnabled ? true : formData.title.trim() !== '';
        const descriptionValid = aiEnabled
          ? true
          : formData.description.trim() !== '';
        const typeValid = formData.type !== '';
        const statusValid = formData.status !== '';
        return titleValid && descriptionValid && typeValid && statusValid;

      case 1: {
        // Localização
        const zipCodeValid = formData.zipCode.replace(/\D/g, '').length === 8;
        return (
          zipCodeValid &&
          formData.street.trim() !== '' &&
          formData.number.trim() !== '' &&
          formData.neighborhood.trim() !== '' &&
          selectedState !== null &&
          selectedCity !== null &&
          formData.city.trim() !== '' &&
          formData.state !== ''
        );
      }

      case 2: {
        // Características
        // Normalizar valores: remover espaços e garantir que seja string
        const totalAreaStr = String(formData.totalArea || '').trim();
        const builtAreaStr = String(formData.builtArea || '').trim();

        // Função auxiliar para converter string formatada para número
        const parseAreaValue = (value: string): number => {
          if (!value || value.trim() === '') return 0;
          // Remover pontos de milhar e substituir vírgula por ponto
          const cleaned = value.replace(/\./g, '').replace(',', '.');
          const num = parseFloat(cleaned);
          return isNaN(num) ? 0 : num;
        };

        // Converter para número
        const totalAreaNum = parseAreaValue(totalAreaStr);
        const builtAreaNum = parseAreaValue(builtAreaStr);

        // Validar área total: deve ser maior que 0
        const totalAreaValid = totalAreaNum > 0;

        // Validar área construída: se preenchida, deve ser maior que 0 e não maior que área total
        // Se área construída está vazia, é válida (opcional)
        // Se está preenchida, deve ser maior que 0 e não maior que área total
        const builtAreaValid =
          builtAreaStr === '' ||
          (builtAreaNum > 0 &&
            totalAreaNum > 0 &&
            builtAreaNum <= totalAreaNum);

        return totalAreaValid && builtAreaValid;
      }

      case 3: {
        // Valores
        const salePriceValid =
          formData.salePrice.trim() !== ''
            ? parseFloat(getNumericValue(formData.salePrice)) > 0
            : false;
        const rentPriceValid =
          formData.rentPrice.trim() !== ''
            ? parseFloat(getNumericValue(formData.rentPrice)) > 0
            : false;

        // Validar se tem pelo menos um preço
        const hasPrice = salePriceValid || rentPriceValid;
        if (!hasPrice) {
          return false;
        }

        // Se aceita negociação, validar se tem pelo menos um valor mínimo
        if (formData.acceptsNegotiation) {
          const hasMinSalePrice =
            formData.minSalePrice &&
            formData.minSalePrice.trim() !== '' &&
            parseFloat(getNumericValue(formData.minSalePrice)) > 0;
          const hasMinRentPrice =
            formData.minRentPrice &&
            formData.minRentPrice.trim() !== '' &&
            parseFloat(getNumericValue(formData.minRentPrice)) > 0;

          // Se tem preço de venda mas não tem valor mínimo de venda, invalidar
          if (salePriceValid && !hasMinSalePrice) {
            return false;
          }

          // Se tem preço de aluguel mas não tem valor mínimo de aluguel, invalidar
          if (rentPriceValid && !hasMinRentPrice) {
            return false;
          }

          // Deve ter pelo menos um valor mínimo se aceita negociação
          if (!hasMinSalePrice && !hasMinRentPrice) {
            return false;
          }
        }

        return true;
      }

      case 4: // Galeria
        // Em modo de edição, considerar imagens existentes (menos as removidas) + novas imagens
        if (isEditMode) {
          // uploadedImages já não contém as imagens removidas (foram filtradas)
          // removedImageIds são apenas para deletar no backend
          const imagesToKeep = Math.max(0, uploadedImages.length);
          const totalImages = imagesToKeep + selectedImages.length;
          return totalImages >= 5; // Deve ter ao menos 5 imagens (existente ou nova)
        }
        // Em modo de criação
        // Se a propriedade já foi criada, considerar imagens já enviadas (uploadedImages)
        // uploadedImages já não contém as imagens removidas (foram filtradas)
        if (createdPropertyId) {
          // Propriedade já criada: imagens novas já foram enviadas e estão em uploadedImages
          // Não subtrair removedImageIds porque uploadedImages já não contém essas imagens
          return uploadedImages.length >= 5; // Mínimo 5 imagens obrigatórias
        }
        // Propriedade ainda não criada: considerar apenas imagens selecionadas
        return selectedImages.length >= 5; // Mínimo 5 imagens obrigatórias

      case 5: // Clientes
        return true; // Sempre válida (opcional)
      case 6: // MCMV
        // Validar apenas se módulo estiver habilitado e mcmvEligible for true
        if (!hasMCMVModule || !formData.mcmvEligible) {
          return true; // Se não tem módulo ou não é elegível, não precisa validar
        }
        // Se é elegível, validar campos obrigatórios
        if (!formData.mcmvIncomeRange) {
          return false;
        }
        if (
          formData.mcmvMaxValue &&
          parseFloat(formData.mcmvMaxValue.replace(',', '.')) <= 0
        ) {
          return false;
        }
        return true;
      case 7: // Proprietário
        return (
          formData.ownerName.trim() !== '' &&
          formData.ownerEmail.trim() !== '' &&
          formData.ownerEmail.includes('@') &&
          formData.ownerPhone.trim() !== '' &&
          formData.ownerDocument.trim() !== '' &&
          formData.ownerAddress.trim() !== ''
        );
      case 8: // Revisão
        return true; // Sempre pode finalizar na revisão

      default:
        return false;
    }
  };

  const validateCurrentSection = () => {
    return validateSection(currentSection);
  };

  const getValidationMessage = () => {
    switch (currentSection) {
      case 0:
        return 'Preencha o título, descrição, tipo e status da propriedade.';
      case 1:
        return 'Preencha um CEP válido e todos os campos de endereço.';
      case 2: {
        // Verificar se área construída é maior que área total
        if (
          formData.builtArea.trim() !== '' &&
          parseFloat(formData.builtArea.replace(',', '.')) >
            parseFloat(formData.totalArea.replace(',', '.'))
        ) {
          return 'A área construída não pode ser maior que a área total.';
        }
        return 'Informe a área total da propriedade.';
      }
      case 3: {
        // Verificar se tem preço
        const salePriceValid =
          formData.salePrice.trim() !== ''
            ? parseFloat(getNumericValue(formData.salePrice)) > 0
            : false;
        const rentPriceValid =
          formData.rentPrice.trim() !== ''
            ? parseFloat(getNumericValue(formData.rentPrice)) > 0
            : false;

        if (!salePriceValid && !rentPriceValid) {
          return 'Informe pelo menos um preço (venda ou aluguel).';
        }

        // Se aceita negociação, validar valores mínimos
        if (formData.acceptsNegotiation) {
          const hasMinSalePrice =
            formData.minSalePrice &&
            formData.minSalePrice.trim() !== '' &&
            parseFloat(getNumericValue(formData.minSalePrice)) > 0;
          const hasMinRentPrice =
            formData.minRentPrice &&
            formData.minRentPrice.trim() !== '' &&
            parseFloat(getNumericValue(formData.minRentPrice)) > 0;

          if (salePriceValid && !hasMinSalePrice) {
            return 'Você marcou "Aceita Negociação" e tem preço de venda. Configure o valor mínimo de venda.';
          }

          if (rentPriceValid && !hasMinRentPrice) {
            return 'Você marcou "Aceita Negociação" e tem preço de aluguel. Configure o valor mínimo de aluguel.';
          }

          if (!hasMinSalePrice && !hasMinRentPrice) {
            return 'Para aceitar negociação, é necessário configurar pelo menos um valor mínimo (venda ou aluguel).';
          }
        }

        return 'Preencha todos os campos obrigatórios.';
      }
      case 4:
        if (isEditMode) {
          // uploadedImages já não contém as imagens removidas
          const imagesToKeep = Math.max(0, uploadedImages.length);
          const totalImages = imagesToKeep + selectedImages.length;
          if (totalImages < 5) {
            return 'A propriedade deve ter pelo menos 5 imagens. Adicione novas imagens ou mantenha as existentes.';
          }
        }
        // Se a propriedade já foi criada, considerar imagens já enviadas
        if (createdPropertyId) {
          // uploadedImages já não contém as imagens removidas
          if (uploadedImages.length < 5) {
            return 'A propriedade deve ter pelo menos 5 imagens. Adicione mais imagens.';
          }
        } else {
          // Propriedade ainda não criada
          if (selectedImages.length < 5) {
            return 'Selecione pelo menos 5 imagens da propriedade.';
          }
        }
        return '';
      case 7:
        return 'Preencha todos os campos do proprietário.';
      default:
        return 'Preencha todos os campos obrigatórios.';
    }
  };

  const getFieldError = (fieldName: string) => {
    switch (fieldName) {
      case 'title':
        return formData.title.trim() === '';
      case 'description':
        return formData.description.trim() === '';
      case 'type':
        return formData.type === '';
      case 'status':
        return formData.status === '';
      case 'zipCode':
        return formData.zipCode.replace(/\D/g, '').length !== 8;
      case 'street':
        return (formData.street || '').trim() === '';
      case 'number':
        return (formData.number || '').trim() === '';
      case 'neighborhood':
        return (formData.neighborhood || '').trim() === '';
      case 'city':
        return (
          !selectedState || !selectedCity || (formData.city || '').trim() === ''
        );
      case 'state':
        return !selectedState || formData.state === '';
      case 'totalArea':
        return (
          (formData.totalArea || '').trim() === '' ||
          parseFloat((formData.totalArea || '').replace(',', '.')) <= 0
        );
      case 'builtArea':
        return (
          (formData.builtArea || '').trim() !== '' &&
          (parseFloat((formData.builtArea || '').replace(',', '.')) <= 0 ||
            parseFloat((formData.builtArea || '').replace(',', '.')) >
              parseFloat((formData.totalArea || '').replace(',', '.')))
        );
      case 'salePrice':
        return (
          (formData.salePrice || '').trim() !== '' &&
          parseFloat(getNumericValue(formData.salePrice || '')) <= 0
        );
      case 'rentPrice':
        return (
          (formData.rentPrice || '').trim() !== '' &&
          parseFloat(getNumericValue(formData.rentPrice || '')) <= 0
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!validateCurrentSection()) {
      toast.error(getValidationMessage());
      return;
    }

    // Validar armazenamento antes de avançar da seção de imagens (seção 4)
    if (currentSection === 4 && selectedImages.length > 0) {
      try {
        const { validateMultipleFilesStorage } = await import(
          '../utils/storageValidation'
        );
        const storageValidation = await validateMultipleFilesStorage(
          selectedImages,
          false
        );

        if (!storageValidation.canUpload) {
          toast.error(
            storageValidation.reason ||
              `Limite de armazenamento excedido. Uso atual: ${storageValidation.totalStorageUsedGB.toFixed(2)} GB de ${storageValidation.totalStorageLimitGB} GB. Remova algumas imagens ou faça upgrade do plano.`
          );
          return;
        }
      } catch (error: any) {
        console.error('Erro ao validar armazenamento:', error);
        // Continuar mesmo se houver erro na validação (não bloquear completamente)
        toast.warning(
          'Não foi possível verificar o armazenamento disponível. O upload será validado novamente ao salvar.'
        );
      }
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      // Scroll para o topo ao avançar de etapa (usar setTimeout para garantir que aconteça após renderização)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      // Scroll para o topo ao voltar de etapa (usar setTimeout para garantir que aconteça após renderização)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  // Função para aplicar dados importados do link externo
  const handleDataImported = async (importedData: PropertyImportData) => {
    try {
      // Aplicar dados básicos
      const updates: any = {};

      if (importedData.title) updates.title = importedData.title;
      if (importedData.description)
        updates.description = importedData.description;
      if (importedData.type) updates.type = importedData.type;
      if (importedData.status) updates.status = importedData.status;

      // Aplicar localização
      if (importedData.street) updates.street = importedData.street;
      if (importedData.number) updates.number = importedData.number;
      if (importedData.complement) updates.complement = importedData.complement;
      if (importedData.neighborhood)
        updates.neighborhood = importedData.neighborhood;
      if (importedData.city) updates.city = importedData.city;
      if (importedData.state) {
        updates.state = importedData.state;
        // Sincronizar estado selecionado
        const stateFound = states.find(s => s.sigla === importedData.state);
        if (stateFound) {
          handleSetSelectedState(stateFound);
        }
      }
      if (importedData.zipCode) {
        // Converter para string se for número e aplicar máscara
        const zipCodeStr =
          typeof importedData.zipCode === 'number'
            ? importedData.zipCode.toString()
            : importedData.zipCode;
        updates.zipCode = formatZipCode(zipCodeStr);
      }

      // Aplicar características físicas com máscara
      if (importedData.totalArea) {
        // Converter número para string de dígitos antes de formatar
        const totalAreaStr =
          typeof importedData.totalArea === 'number'
            ? importedData.totalArea.toString()
            : importedData.totalArea.toString().replace(/\D/g, '');
        updates.totalArea = formatArea(totalAreaStr);
      }
      if (importedData.builtArea) {
        const builtAreaStr =
          typeof importedData.builtArea === 'number'
            ? importedData.builtArea.toString()
            : importedData.builtArea.toString().replace(/\D/g, '');
        updates.builtArea = formatArea(builtAreaStr);
      }
      if (importedData.bedrooms)
        updates.bedrooms = importedData.bedrooms.toString();
      if (importedData.bathrooms)
        updates.bathrooms = importedData.bathrooms.toString();
      if (importedData.parkingSpaces)
        updates.parkingSpaces = importedData.parkingSpaces.toString();

      // Aplicar valores monetários com máscara
      if (importedData.salePrice) {
        // Converter número para string de dígitos antes de formatar
        let salePriceStr: string;
        if (typeof importedData.salePrice === 'number') {
          // Converter número para string com 2 casas decimais
          // Ex: 3300000 -> "3300000.00" -> "330000000" -> "3.300.000,00"
          // Ex: 3300000.50 -> "3300000.50" -> "330000050" -> "3.300.000,50"
          const numStr = importedData.salePrice.toFixed(2);
          // Remover o ponto decimal e manter apenas dígitos
          salePriceStr = numStr.replace(/\./g, '').replace(/\D/g, '');
        } else {
          // Se já for string, remover caracteres não numéricos
          salePriceStr = importedData.salePrice.toString().replace(/\D/g, '');
          // Se não tiver centavos (menos de 3 dígitos), adicionar 00
          if (salePriceStr.length < 3) {
            salePriceStr = salePriceStr.padEnd(3, '0');
          }
        }
        updates.salePrice = formatCurrency(salePriceStr);
      }
      if (importedData.rentPrice) {
        let rentPriceStr: string;
        if (typeof importedData.rentPrice === 'number') {
          const numStr = importedData.rentPrice.toFixed(2);
          rentPriceStr = numStr.replace(/\./g, '').replace(/\D/g, '');
        } else {
          rentPriceStr = importedData.rentPrice.toString().replace(/\D/g, '');
          if (rentPriceStr.length < 3) {
            rentPriceStr = rentPriceStr.padEnd(3, '0');
          }
        }
        updates.rentPrice = formatCurrency(rentPriceStr);
      }
      if (importedData.condominiumFee) {
        let condominiumFeeStr: string;
        if (typeof importedData.condominiumFee === 'number') {
          const numStr = importedData.condominiumFee.toFixed(2);
          condominiumFeeStr = numStr.replace(/\./g, '').replace(/\D/g, '');
        } else {
          condominiumFeeStr = importedData.condominiumFee
            .toString()
            .replace(/\D/g, '');
          if (condominiumFeeStr.length < 3) {
            condominiumFeeStr = condominiumFeeStr.padEnd(3, '0');
          }
        }
        updates.condominiumFee = formatCurrency(condominiumFeeStr);
      }
      if (importedData.iptu) {
        let iptuStr: string;
        if (typeof importedData.iptu === 'number') {
          const numStr = importedData.iptu.toFixed(2);
          iptuStr = numStr.replace(/\./g, '').replace(/\D/g, '');
        } else {
          iptuStr = importedData.iptu.toString().replace(/\D/g, '');
          if (iptuStr.length < 3) {
            iptuStr = iptuStr.padEnd(3, '0');
          }
        }
        updates.iptu = formatCurrency(iptuStr);
      }

      // Aplicar características
      if (importedData.features && importedData.features.length > 0) {
        updates.features = importedData.features;
      }

      // Aplicar atualizações ao formulário
      setFormData(prev => ({ ...prev, ...updates }));

      // Se houver URLs de imagens, tentar fazer download (será implementado quando backend estiver pronto)
      // Por enquanto, apenas mostrar aviso se houver imagens
      if (importedData.imageUrls && importedData.imageUrls.length > 0) {
        toast.info(
          `${importedData.imageUrls.length} imagem(ns) encontrada(s). ` +
            'As imagens serão importadas quando você chegar na etapa de Galeria.'
        );
        // TODO: Implementar download de imagens quando backend estiver pronto
      }

      toast.success(
        'Dados importados aplicados ao formulário! Revise e ajuste se necessário.'
      );
    } catch (error) {
      console.error('Erro ao aplicar dados importados:', error);
      toast.error(
        'Erro ao aplicar dados importados. Por favor, preencha manualmente.'
      );
    }
  };

  // Função para lidar com clique nas steps
  const handleStepClick = (stepIndex: number) => {
    // Na criação, não permitir clicar nas steps - apenas usar botões Próximo/Anterior
    if (!isEditMode) {
      return;
    }

    // Na edição, permitir navegar para qualquer step, mas validar seções anteriores ao avançar
    if (stepIndex === currentSection) {
      return; // Já está na step atual
    }

    // Se está tentando avançar, validar todas as seções anteriores até a step desejada
    if (stepIndex > currentSection) {
      // Validar todas as seções desde a atual até a step desejada
      for (let i = currentSection; i < stepIndex; i++) {
        if (!validateSection(i)) {
          toast.error(
            `Não é possível avançar. Preencha todos os campos obrigatórios da etapa "${sections[i].title}".`
          );
          return;
        }
      }
    }
    // Se está voltando, permitir sem validação (pode voltar para editar)

    // Permitir navegação
    setCurrentSection(stepIndex);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleCreateProperty = async () => {
    // console.log(`🚀 Iniciando ${isEditMode ? 'atualização' : 'criação'} de propriedade...`);
    // console.log('📋 Dados do formulário:', formData);
    // console.log('📸 Imagens selecionadas:', selectedImages.length);
    setIsLoading(true);

    try {
      // Construir endereço completo para exibição/compatibilidade
      const addressParts = [
        formData.street,
        formData.number,
        complementArray.length > 0 ? complementArray.join(', ') : '',
      ].filter(Boolean);

      const fullAddress = addressParts.join(', ');

      // Obter ID do usuário atual (captador)
      const currentUser = getCurrentUser();
      if (!currentUser?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Validar negociação: se acceptsNegotiation é true, deve ter pelo menos um valor mínimo
      if (formData.acceptsNegotiation) {
        const hasMinSalePrice =
          formData.minSalePrice && formData.minSalePrice.trim() !== '';
        const hasMinRentPrice =
          formData.minRentPrice && formData.minRentPrice.trim() !== '';

        if (!hasMinSalePrice && !hasMinRentPrice) {
          toast.error(
            'Para aceitar negociação, é necessário configurar pelo menos um valor mínimo (venda ou aluguel).'
          );
          setIsLoading(false);
          return;
        }
      }

      // Criar a propriedade
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type as PropertyType,
        status: formData.status as PropertyStatus,
        address: fullAddress, // Endereço completo concatenado (para compatibilidade)
        street: formData.street, // Rua separada
        number: formData.number, // Número separado
        complement:
          complementArray.length > 0
            ? complementArray
                .map(item =>
                  item.value ? `${item.type}: ${item.value}` : item.type
                )
                .join(', ')
            : undefined, // Complemento separado
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        totalArea: parseFloat(formData.totalArea.replace(',', '.')),
        builtArea: formData.builtArea
          ? parseFloat(formData.builtArea.replace(',', '.'))
          : 0,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        parkingSpaces: formData.parkingSpaces
          ? parseInt(formData.parkingSpaces)
          : 0,
        salePrice: formData.salePrice ? getNumericValue(formData.salePrice) : 0,
        rentPrice: formData.rentPrice ? getNumericValue(formData.rentPrice) : 0,
        condominiumFee: formData.condominiumFee
          ? getNumericValue(formData.condominiumFee)
          : 0,
        iptu: formData.iptu ? getNumericValue(formData.iptu) : 0,
        features: formData.features,
        // isActive não deve ser enviado - será true por padrão no backend
        isFeatured: formData.isFeatured,
        isAvailableForSite: formData.isAvailableForSite || false,
        // Campo obrigatório: ID do captador
        capturedById: formData.capturedById || currentUser.id,
        // Negociação
        // Só enviar acceptsNegotiation como true se houver pelo menos um valor mínimo
        acceptsNegotiation:
          formData.acceptsNegotiation &&
          ((formData.minSalePrice && formData.minSalePrice.trim() !== '') ||
            (formData.minRentPrice && formData.minRentPrice.trim() !== ''))
            ? true
            : false,
        minSalePrice:
          formData.acceptsNegotiation &&
          formData.minSalePrice &&
          formData.minSalePrice.trim() !== ''
            ? getNumericValue(formData.minSalePrice)
            : undefined,
        minRentPrice:
          formData.acceptsNegotiation &&
          formData.minRentPrice &&
          formData.minRentPrice.trim() !== ''
            ? getNumericValue(formData.minRentPrice)
            : undefined,
        offerBelowMinSaleAction:
          formData.acceptsNegotiation &&
          formData.salePrice &&
          formData.minSalePrice &&
          formData.minSalePrice.trim() !== ''
            ? formData.offerBelowMinSaleAction
            : undefined,
        offerBelowMinRentAction:
          formData.acceptsNegotiation &&
          formData.rentPrice &&
          formData.minRentPrice &&
          formData.minRentPrice.trim() !== ''
            ? formData.offerBelowMinRentAction
            : undefined,
        // Condomínio vinculado (apenas se checkbox estiver marcado e tiver ID)
        condominiumId:
          formData.isCondominium &&
          formData.condominiumId &&
          formData.condominiumId.trim() !== ''
            ? formData.condominiumId
            : undefined,
        // Campos MCMV (apenas se módulo estiver habilitado)
        ...(hasMCMVModule && {
          mcmvEligible: formData.mcmvEligible,
          mcmvIncomeRange: formData.mcmvIncomeRange || undefined,
          mcmvMaxValue: formData.mcmvMaxValue
            ? getNumericValue(formData.mcmvMaxValue)
            : undefined,
          mcmvSubsidy: formData.mcmvSubsidy
            ? getNumericValue(formData.mcmvSubsidy)
            : undefined,
          mcmvDocumentation:
            formData.mcmvDocumentation.length > 0
              ? formData.mcmvDocumentation
              : undefined,
          mcmvNotes: formData.mcmvNotes || undefined,
        }),
        // Campos do proprietário (obrigatórios)
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        ownerDocument: formData.ownerDocument,
        ownerAddress: formData.ownerAddress,
      };

      // Validar se está tentando publicar no site
      if (formData.isAvailableForSite) {
        // Validar se a propriedade está ativa
        if (!formData.isActive) {
          toast.error(
            'Apenas propriedades ativas podem ser publicadas no site Dream Keys.'
          );
          setIsLoading(false);
          return;
        }

        // Validar se o status é disponível
        if (formData.status !== PropertyStatusEnum.AVAILABLE) {
          toast.error(
            'Apenas propriedades com status "Disponível" podem ser publicadas no site Dream Keys.'
          );
          setIsLoading(false);
          return;
        }

        // Validar se tem pelo menos 5 imagens válidas
        const validImages = selectedImages.filter(
          img =>
            img && (img.url || img.file) && (img.url?.trim() !== '' || img.file)
        );

        if (validImages.length < 5) {
          toast.error(
            `A propriedade precisa ter no mínimo 5 imagens válidas para ser publicada no site. Atualmente possui ${validImages.length} imagem(ns).`
          );
          setIsLoading(false);
          return;
        }
      }

      // Se estiver editando e tentando publicar, validar status, isActive e imagens existentes + novas
      if (isEditMode && propertyId && formData.isAvailableForSite) {
        // Validar se a propriedade está ativa
        if (!formData.isActive) {
          toast.error(
            'Apenas propriedades ativas podem ser publicadas no site Dream Keys.'
          );
          setIsLoading(false);
          return;
        }

        // Validar se o status é disponível
        if (formData.status !== PropertyStatusEnum.AVAILABLE) {
          toast.error(
            'Apenas propriedades com status "Disponível" podem ser publicadas no site Dream Keys.'
          );
          setIsLoading(false);
          return;
        }

        try {
          const existingProperty =
            await propertyApi.getPropertyById(propertyId);
          const existingValidImages =
            existingProperty.images?.filter(
              img => img && img.url && img.url.trim() !== ''
            ) || [];
          const newValidImages = selectedImages.filter(
            img =>
              img &&
              (img.url || img.file) &&
              (img.url?.trim() !== '' || img.file)
          );
          // Remover imagens que serão removidas
          const imagesToKeep = existingValidImages.filter(
            img => !removedImageIds.includes(img.id)
          );
          const totalValidImages = imagesToKeep.length + newValidImages.length;

          if (totalValidImages < 5) {
            toast.error(
              `A propriedade precisa ter no mínimo 5 imagens válidas para ser publicada no site. Atualmente possui ${totalValidImages} imagem(ns).`
            );
            setIsLoading(false);
            return;
          }
        } catch (err: any) {
          toast.error(
            'Não foi possível validar as imagens da propriedade. Tente novamente.'
          );
          setIsLoading(false);
          return;
        }
      }

      const getCreationErrorMessage = (error: any) =>
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao criar propriedade. Tente novamente.';

      await toast.promise(
        (async () => {
          if (isEditMode && propertyId) {
            // Deletar imagens removidas antes de atualizar a propriedade
            if (removedImageIds.length > 0) {
              try {
                await Promise.all(
                  removedImageIds.map(imageId =>
                    galleryApi.deleteImage(imageId)
                  )
                );
                // Limpar lista de IDs removidos após deletar
                setRemovedImageIds([]);
              } catch (deleteError) {
                console.error('❌ Erro ao deletar imagens:', deleteError);
                toast.error('Erro ao remover imagens. Tente novamente.');
                throw deleteError;
              }
            }

            // Atualizar propriedade (sem enviar IDs de imagens removidas)
            const updatedProperty = await propertyApi.updateProperty(
              propertyId,
              propertyData
            );
            setCreatedPropertyId(propertyId);

            // Upload de novas imagens
            if (selectedImages.length > 0) {
              try {
                const uploadedImgs = await galleryApi.uploadImages(
                  propertyId,
                  selectedImages,
                  'general',
                  undefined,
                  undefined,
                  undefined,
                  true
                );
                setUploadedImages(prev => [...prev, ...uploadedImgs]);
                setSelectedImages([]);
                setImagePreviews([]);
              } catch (uploadError) {
                console.error(
                  '❌ Erro ao fazer upload de imagens:',
                  uploadError
                );
                toast.error(
                  'Erro ao fazer upload de imagens. Tente novamente.'
                );
              }
            }

            return updatedProperty;
          }

          let createdProperty;
          if (selectedImages.length > 0) {
            createdProperty = await propertyApi.createPropertyWithImages(
              propertyData,
              selectedImages
            );
            setCreatedPropertyId(createdProperty.id);

            if (createdProperty.images && createdProperty.images.length > 0) {
              const galleryImages: GalleryImage[] = createdProperty.images.map(
                img => ({
                  id: img.id,
                  propertyId: createdProperty.id,
                  url: img.url,
                  alt: img.category || 'Imagem da propriedade',
                  isMain: img.isMain,
                  order: 0,
                  createdAt: img.createdAt,
                  updatedAt: img.createdAt,
                })
              );
              setUploadedImages(galleryImages);
              setImagePreviews(createdProperty.images.map(img => img.url));
            }
          } else {
            createdProperty = await propertyApi.createProperty(propertyData);
            setCreatedPropertyId(createdProperty.id);
          }

          return createdProperty;
        })(),
        {
          pending: isEditMode
            ? 'Atualizando propriedade...'
            : 'Criando propriedade...',
          success: isEditMode
            ? 'Propriedade atualizada com sucesso!'
            : 'Propriedade criada com sucesso!',
          error: {
            render({ data }) {
              return getCreationErrorMessage(data);
            },
          },
        }
      );

      setCurrentSection(5);
    } catch (error) {
      console.error('Erro ao criar propriedade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = useCallback(() => {
    // Só mostrar modal de sucesso se a propriedade foi realmente criada/atualizada
    if (createdPropertyId) {
      setShowSuccessModal(true);
    } else {
      // Se não tem ID da propriedade, significa que houve erro na criação
      toast.error('Erro ao criar propriedade. Tente novamente.');
      navigate('/properties');
    }
  }, [createdPropertyId, navigate]);

  // Auto-finalizar quando createdPropertyId for definido (para evitar erro toast)
  useEffect(() => {
    if (createdPropertyId && currentSection === 5) {
      // Só finalizar se estamos na seção de revisão
      handleFinalize();
    }
  }, [createdPropertyId, currentSection, handleFinalize]);

  // Dimensões exigidas para fotos da propriedade
  const IMAGE_SIZE = { width: 1080, height: 1080 };

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Erro ao carregar imagem'));
      };
      img.src = url;
    });
  };

  // Funções para gerenciar imagens
  const handleImageSelect = async (files: File[]) => {
    const validFiles: File[] = [];
    const previews: string[] = [];

    // Validar armazenamento antes de processar os arquivos
    try {
      const { validateMultipleFilesStorage } = await import(
        '../utils/storageValidation'
      );
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const storageValidation = await validateMultipleFilesStorage(
        files,
        false
      );

      if (!storageValidation.canUpload) {
        toast.error(
          storageValidation.reason ||
            `Limite de armazenamento excedido. Uso atual: ${storageValidation.totalStorageUsedGB.toFixed(2)} GB de ${storageValidation.totalStorageLimitGB} GB`
        );
        return;
      }
    } catch (error: any) {
      console.error('Erro ao validar armazenamento:', error);
      // Continuar mesmo se houver erro na validação (não bloquear completamente)
      toast.warning(
        'Não foi possível verificar o armazenamento disponível. O upload será validado novamente ao salvar.'
      );
    }

    for (const file of files) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: Tipo de arquivo não suportado`);
        continue;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: Arquivo muito grande (máximo 10MB)`);
        continue;
      }

      // Validar dimensões: apenas 1080 x 1080
      try {
        const { width, height } = await getImageDimensions(file);
        if (width !== IMAGE_SIZE.width || height !== IMAGE_SIZE.height) {
          toast.error(
            `${file.name}: A imagem deve ter exatamente ${IMAGE_SIZE.width} x ${IMAGE_SIZE.height} pixels. Encontrado: ${width} x ${height}.`
          );
          continue;
        }
      } catch (err) {
        toast.error(
          `${file.name}: Não foi possível verificar as dimensões da imagem.`
        );
        continue;
      }

      validFiles.push(file);

      // Criar preview
      try {
        const preview = await new Promise<string>(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        previews.push(preview);
      } catch (error) {
        console.error('Erro ao criar preview:', error);
      }
    }

    // Se a propriedade já foi criada, fazer upload imediatamente das novas imagens
    if (createdPropertyId && validFiles.length > 0) {
      try {
        const uploadedImgs = await galleryApi.uploadImages(
          createdPropertyId,
          validFiles,
          'general',
          undefined,
          undefined,
          undefined,
          true
        );

        // Somar as novas imagens às existentes
        setUploadedImages(prev => [...prev, ...uploadedImgs]);

        // Atualizar previews com as URLs das imagens enviadas
        const newPreviews = uploadedImgs.map(img => img.url);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        toast.success(
          `${validFiles.length} imagem(ns) adicionada(s) com sucesso!`
        );
      } catch (uploadError) {
        console.error('❌ Erro ao fazer upload de imagens:', uploadError);
        toast.error('Erro ao fazer upload de imagens. Tente novamente.');
        // Se falhar, adicionar às imagens selecionadas para tentar novamente depois
        setSelectedImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...previews]);
      }
    } else {
      // Se a propriedade ainda não foi criada, apenas adicionar às selecionadas
      setSelectedImages(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...previews]);

      if (validFiles.length > 0) {
        toast.success(`${validFiles.length} imagem(ns) selecionada(s)`);
      }
    }
  };

  const removeImage = (index: number) => {
    // Permitir remoção - validação será feita apenas ao tentar avançar
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    toast.info(
      'Imagem removida. Lembre-se: é necessário ter pelo menos 5 imagens para continuar.'
    );
  };

  // Funções para reordenação de imagens existentes
  const moveImageUp = async (index: number) => {
    if (index > 0) {
      try {
        setUploadedImages(prev => {
          const newImages = [...prev];
          [newImages[index - 1], newImages[index]] = [
            newImages[index],
            newImages[index - 1],
          ];
          return newImages;
        });

        // Salvar nova ordem no backend
        const newImageIds = uploadedImages.map((_, i) => {
          if (i === index - 1) return uploadedImages[index].id;
          if (i === index) return uploadedImages[index - 1].id;
          return uploadedImages[i].id;
        });

        await galleryApi.reorderImages(newImageIds);
        toast.success('Imagem movida para cima');
      } catch (error) {
        console.error('Erro ao mover imagem:', error);
        toast.error('Erro ao mover imagem');
        // Reverter mudança em caso de erro
        setUploadedImages(prev => {
          const newImages = [...prev];
          [newImages[index - 1], newImages[index]] = [
            newImages[index],
            newImages[index - 1],
          ];
          return newImages;
        });
      }
    }
  };

  const moveImageDown = async (index: number) => {
    if (index < uploadedImages.length - 1) {
      try {
        setUploadedImages(prev => {
          const newImages = [...prev];
          [newImages[index], newImages[index + 1]] = [
            newImages[index + 1],
            newImages[index],
          ];
          return newImages;
        });

        // Salvar nova ordem no backend
        const newImageIds = uploadedImages.map((_, i) => {
          if (i === index) return uploadedImages[index + 1].id;
          if (i === index + 1) return uploadedImages[index].id;
          return uploadedImages[i].id;
        });

        await galleryApi.reorderImages(newImageIds);
        toast.success('Imagem movida para baixo');
      } catch (error) {
        console.error('Erro ao mover imagem:', error);
        toast.error('Erro ao mover imagem');
        // Reverter mudança em caso de erro
        setUploadedImages(prev => {
          const newImages = [...prev];
          [newImages[index], newImages[index + 1]] = [
            newImages[index + 1],
            newImages[index],
          ];
          return newImages;
        });
      }
    }
  };

  const setAsMainImage = async (index: number) => {
    try {
      const image = uploadedImages[index];
      if (image) {
        await galleryApi.setMainImage(image.id);
        setUploadedImages(prev => {
          const newImages = prev.map((img, i) => ({
            ...img,
            isMain: i === index,
          }));
          return newImages;
        });
        toast.success('Imagem definida como principal');
      }
    } catch (error) {
      console.error('Erro ao definir imagem principal:', error);
      toast.error('Erro ao definir imagem principal');
    }
  };

  // Funções para drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedImageIndex === null || draggedImageIndex === dropIndex) {
      setDraggedImageIndex(null);
      return;
    }

    // Salvar estado anterior para reverter em caso de erro
    const oldImages = [...uploadedImages];

    try {
      setUploadedImages(prev => {
        const newImages = [...prev];
        const draggedImage = newImages[draggedImageIndex];

        // Remove a imagem da posição original
        newImages.splice(draggedImageIndex, 1);

        // Insere a imagem na nova posição
        newImages.splice(dropIndex, 0, draggedImage);

        return newImages;
      });

      // Criar nova ordem de IDs baseada na nova posição
      const newImageIds = oldImages.map((image, i) => {
        if (i === draggedImageIndex) {
          // A imagem arrastada vai para dropIndex
          return oldImages[dropIndex].id;
        } else if (i === dropIndex) {
          // A imagem que estava em dropIndex vai para draggedImageIndex
          return oldImages[draggedImageIndex].id;
        }
        return image.id;
      });

      await galleryApi.reorderImages(newImageIds);
      toast.success('Ordem das imagens atualizada');
    } catch (error) {
      console.error('Erro ao reordenar imagem:', error);
      toast.error('Erro ao reordenar imagem');
      // Reverter mudança em caso de erro
      setUploadedImages(oldImages);
    }

    setDraggedImageIndex(null);
  };

  // Funções para reordenação de imagens selecionadas (novas)
  const moveSelectedImageUp = (index: number) => {
    if (index > 0) {
      setSelectedImages(prev => {
        const newImages = [...prev];
        [newImages[index - 1], newImages[index]] = [
          newImages[index],
          newImages[index - 1],
        ];
        return newImages;
      });

      setImagePreviews(prev => {
        const newPreviews = [...prev];
        [newPreviews[index - 1], newPreviews[index]] = [
          newPreviews[index],
          newPreviews[index - 1],
        ];
        return newPreviews;
      });

      toast.success('Imagem movida para cima');
    }
  };

  const moveSelectedImageDown = (index: number) => {
    if (index < selectedImages.length - 1) {
      setSelectedImages(prev => {
        const newImages = [...prev];
        [newImages[index], newImages[index + 1]] = [
          newImages[index + 1],
          newImages[index],
        ];
        return newImages;
      });

      setImagePreviews(prev => {
        const newPreviews = [...prev];
        [newPreviews[index], newPreviews[index + 1]] = [
          newPreviews[index + 1],
          newPreviews[index],
        ];
        return newPreviews;
      });

      toast.success('Imagem movida para baixo');
    }
  };

  // Funções auxiliares para tradução
  const translatePropertyType = (type: string): string => {
    const typeMap: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      commercial: 'Comercial',
      land: 'Terreno',
      rural: 'Rural',
    };
    return typeMap[type] || type;
  };

  const translatePropertyStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      draft: 'Rascunho',
      available: 'Disponível',
      rented: 'Alugado',
      sold: 'Vendido',
      maintenance: 'Manutenção',
    };
    return statusMap[status] || status;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Informações Básicas
        return (
          <>
            {/* Componente de Importação por Link - apenas no modo de criação */}
            {!isEditMode && (
              <PropertyLinkImport onDataImported={handleDataImported} />
            )}

            <FieldContainerWithError $hasError={getFieldError('title')}>
              <FieldLabel>
                Título da Propriedade
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldInput
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Ex: Casa com 3 quartos na Zona Sul'
                disabled={aiEnabled}
                style={{ opacity: aiEnabled ? 0.6 : 1 }}
                required
              />
              {getFieldError('title') && (
                <ErrorMessage>Este campo é obrigatório</ErrorMessage>
              )}
            </FieldContainerWithError>

            <FieldContainer>
              <FieldLabel>
                Descrição
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldTextarea
                name='description'
                value={formData.description}
                onChange={e => {
                  const value = e.target.value;
                  if (value.length <= 2000) {
                    handleInputChange(e);
                  }
                }}
                placeholder='Descreva detalhadamente a propriedade...'
                disabled={aiEnabled}
                style={{ opacity: aiEnabled ? 0.6 : 1 }}
                required
                maxLength={2000}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {formData.description.length}/2000 caracteres
              </div>
              {/* Step 1: apenas a flag de IA */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 12,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <input
                    type='checkbox'
                    checked={aiEnabled}
                    onChange={e => {
                      setAiEnabled(e.target.checked);
                      setDescriptionEditable(!e.target.checked);
                      setAiGenerationError(false); // Limpar erro ao desmarcar
                    }}
                  />
                  <span style={{ color: 'var(--color-text)' }}>
                    Criar Título e descrição com IA
                  </span>
                </label>
                {aiEnabled && (
                  <span
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 12,
                    }}
                  >
                    O título e a descrição serão gerados automaticamente na
                    etapa de revisão.
                  </span>
                )}
              </div>
            </FieldContainer>

            <RowContainer>
              <FieldContainer>
                <FieldLabel>
                  Tipo de Propriedade
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldSelect
                  name='type'
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value=''>Selecione o tipo</option>
                  <option value='house'>Casa</option>
                  <option value='apartment'>Apartamento</option>
                  <option value='commercial'>Comercial</option>
                  <option value='land'>Terreno</option>
                  <option value='rural'>Rural</option>
                </FieldSelect>
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Status</FieldLabel>
                <FieldSelect
                  name='status'
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value='draft'>Rascunho</option>
                  <option value='available'>Disponível</option>
                  <option value='rented'>Alugado</option>
                  <option value='sold'>Vendido</option>
                </FieldSelect>
              </FieldContainer>
            </RowContainer>

            <FieldContainer>
              <FieldLabel>
                Captador
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldSelect
                name='capturedById'
                value={formData.capturedById}
                onChange={handleInputChange}
                required
              >
                <option value=''>Selecione o captador</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.email ? `(${user.email})` : ''}
                  </option>
                ))}
              </FieldSelect>
              <small
                style={{
                  color: 'var(--color-text-secondary)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Usuário responsável por capturar/cadastrar esta propriedade
              </small>
            </FieldContainer>
          </>
        );

      case 1: // Localização
        return (
          <>
            <FieldContainerWithError $hasError={getFieldError('zipCode')}>
              <FieldLabel>
                CEP
                <RequiredIndicator>*</RequiredIndicator>
                {isAddressLoading && (
                  <span style={{ marginLeft: '8px', color: '#3b82f6' }}>
                    🔍 Buscando...
                  </span>
                )}
              </FieldLabel>
              <FieldInput
                type='text'
                name='zipCode'
                value={formData.zipCode}
                onChange={handleInputChange}
                maxLength={9}
                required
                disabled={isAddressLoading}
              />
              {getFieldError('zipCode') && (
                <ErrorMessage>CEP deve ter 8 dígitos</ErrorMessage>
              )}
              {addressError && <ErrorMessage>{addressError}</ErrorMessage>}
              <small
                style={{
                  color: 'var(--color-text-secondary)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Digite o CEP para preenchimento automático do endereço (rua,
                bairro, cidade e estado)
              </small>
            </FieldContainerWithError>

            <FieldContainer>
              <FieldLabel>
                Rua/Logradouro
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldInput
                type='text'
                name='street'
                value={formData.street}
                onChange={handleInputChange}
                required
                readOnly
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                title='Este campo é preenchido automaticamente ao informar o CEP'
              />
            </FieldContainer>

            <RowContainer>
              <FieldContainer>
                <FieldLabel>
                  Número
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  name='number'
                  value={formData.number}
                  onChange={handleInputChange}
                  pattern='[0-9]*'
                  inputMode='numeric'
                  required
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Complemento</FieldLabel>
                <ComplementMultiSelect
                  value={complementArray}
                  onChange={setComplementArray}
                  propertyType={formData.type}
                  placeholder='Selecione os complementos'
                />
              </FieldContainer>
            </RowContainer>

            <FieldContainer>
              <FieldLabel>
                Bairro
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldInput
                type='text'
                name='neighborhood'
                value={formData.neighborhood}
                onChange={handleInputChange}
                required
                readOnly
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                title='Este campo é preenchido automaticamente ao informar o CEP'
              />
            </FieldContainer>

            <RowContainer>
              <FieldContainerWithError $hasError={getFieldError('state')}>
                <FieldLabel>
                  Estado
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldSelect
                  name='state'
                  value={selectedState?.id || ''}
                  onChange={e => {
                    const stateId = e.target.value;
                    const state = states.find(s => s.id === stateId);
                    handleSetSelectedState(state || null);
                    setFormData(prev => ({
                      ...prev,
                      state: state?.sigla || '',
                      city: '', // Limpar cidade quando mudar estado
                    }));
                  }}
                  required
                  disabled={true}
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  title='Este campo é preenchido automaticamente ao informar o CEP'
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
                </FieldSelect>
                {getFieldError('state') && (
                  <ErrorMessage>Este campo é obrigatório</ErrorMessage>
                )}
              </FieldContainerWithError>

              <FieldContainerWithError $hasError={getFieldError('city')}>
                <FieldLabel>
                  Cidade
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldSelect
                  name='city'
                  value={selectedCity?.id || ''}
                  onChange={e => {
                    const cityId = e.target.value;
                    const cityObj = cities.find(c => c.id === cityId);
                    handleSetSelectedCity(cityObj || null);
                    setFormData(prev => ({
                      ...prev,
                      city: cityObj?.nome || '',
                    }));
                  }}
                  required
                  disabled={true}
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  title='Este campo é preenchido automaticamente ao informar o CEP'
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
                </FieldSelect>
                {getFieldError('city') && (
                  <ErrorMessage>
                    {!selectedState
                      ? 'Selecione primeiro um estado'
                      : 'Este campo é obrigatório'}
                  </ErrorMessage>
                )}
              </FieldContainerWithError>
            </RowContainer>

            {/* Campo de Condomínio - apenas se tiver permissão */}
            {hasCondominiumPermission && (
              <>
                <FieldContainer>
                  <FieldLabel
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={formData.isCondominium}
                      onChange={e => {
                        setFormData(prev => ({
                          ...prev,
                          isCondominium: e.target.checked,
                          // Limpar condominiumId se desmarcar
                          condominiumId: e.target.checked
                            ? prev.condominiumId
                            : '',
                        }));
                      }}
                      style={{ marginRight: '8px' }}
                    />
                    Esta propriedade pertence a um condomínio
                    <InfoTooltip
                      content='Ao marcar esta opção e selecionar um condomínio, todas as imagens ativas do condomínio serão automaticamente copiadas para esta propriedade.'
                      direction='up'
                    />
                  </FieldLabel>
                </FieldContainer>

                {formData.isCondominium && (
                  <FieldContainer>
                    <FieldLabel>
                      Selecionar Condomínio
                      <InfoTooltip
                        content='As imagens do condomínio selecionado serão automaticamente copiadas para esta propriedade.'
                        direction='up'
                      />
                    </FieldLabel>
                    <CondominiumSelector
                      value={formData.condominiumId || undefined}
                      onChange={condominiumId => {
                        setFormData(prev => ({
                          ...prev,
                          condominiumId: condominiumId || '',
                        }));
                      }}
                      placeholder='Selecione um condomínio'
                    />
                    <small
                      style={{
                        color: 'var(--color-text-secondary)',
                        marginTop: '4px',
                        display: 'block',
                      }}
                    >
                      As imagens do condomínio serão automaticamente copiadas
                      para esta propriedade
                    </small>
                  </FieldContainer>
                )}
              </>
            )}
          </>
        );

      case 2: // Características
        return (
          <>
            <RowContainer>
              <FieldContainer>
                <FieldLabel>
                  Área Total (m²)
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  name='totalArea'
                  value={formData.totalArea}
                  onChange={handleInputChange}
                  placeholder='Ex: 120,50'
                  required
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Área Construída (m²)</FieldLabel>
                <FieldInput
                  type='text'
                  name='builtArea'
                  value={formData.builtArea}
                  onChange={handleInputChange}
                  placeholder='Ex: 100,00'
                />
              </FieldContainer>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <FieldLabel>Quartos</FieldLabel>
                <FieldInput
                  type='text'
                  name='bedrooms'
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder='ex: 1'
                  pattern='[0-9]*'
                  inputMode='numeric'
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Banheiros</FieldLabel>
                <FieldInput
                  type='text'
                  name='bathrooms'
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder='ex: 1'
                  pattern='[0-9]*'
                  inputMode='numeric'
                />
              </FieldContainer>
            </RowContainer>

            <FieldContainer>
              <FieldLabel>Vagas de Garagem</FieldLabel>
              <FieldInput
                type='text'
                name='parkingSpaces'
                value={formData.parkingSpaces}
                onChange={handleInputChange}
                placeholder='ex: 1'
                pattern='[0-9]*'
                inputMode='numeric'
              />
            </FieldContainer>

            {/* Características da Propriedade */}
            <FieldContainer>
              <FieldLabel>Características da Propriedade</FieldLabel>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                {[
                  'Piscina',
                  'Churrasqueira',
                  'Área de Lazer',
                  'Garagem Coberta',
                  'Elevador',
                  'Academia',
                  'Portaria 24h',
                  'Segurança',
                  'Jardim',
                  'Varanda',
                  'Sacada',
                  'Lavanderia',
                  'Depósito',
                  'Ar Condicionado',
                  'Mobiliado',
                  'Internet',
                  'TV a Cabo',
                  'Aquecimento',
                  'Lareira',
                  'Home Theater',
                ].map(feature => (
                  <label
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: 'var(--color-text)',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={formData.features.includes(feature)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            features: [...prev.features, feature],
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            features: prev.features.filter(f => f !== feature),
                          }));
                        }
                      }}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: 'var(--color-primary)',
                      }}
                    />
                    <span style={{ fontSize: '14px' }}>{feature}</span>
                  </label>
                ))}
              </div>
            </FieldContainer>
          </>
        );

      case 3: // Valores
        return (
          <>
            <RowContainer>
              <FieldContainer>
                <FieldLabel>Preço de Venda</FieldLabel>
                <FieldInput
                  type='text'
                  name='salePrice'
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  placeholder='R$ 500.000,00'
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Preço de Aluguel</FieldLabel>
                <FieldInput
                  type='text'
                  name='rentPrice'
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  placeholder='R$ 2.000,00'
                />
              </FieldContainer>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <FieldLabel>Condomínio</FieldLabel>
                <FieldInput
                  type='text'
                  name='condominiumFee'
                  value={formData.condominiumFee}
                  onChange={handleInputChange}
                  placeholder='R$ 500,00'
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>IPTU Anual</FieldLabel>
                <FieldInput
                  type='text'
                  name='iptu'
                  value={formData.iptu}
                  onChange={handleInputChange}
                  placeholder='R$ 1.200,00'
                />
              </FieldContainer>
            </RowContainer>

            {/* Negociação */}
            <div
              style={{
                marginTop: '32px',
                padding: '20px',
                background: 'var(--color-background-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
              }}
            >
              <FieldContainer>
                <FieldLabel
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={formData.acceptsNegotiation}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        acceptsNegotiation: e.target.checked,
                        // Limpar valores mínimos se desmarcar
                        ...(e.target.checked
                          ? {}
                          : {
                              minSalePrice: '',
                              minRentPrice: '',
                            }),
                      }));
                    }}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: 'var(--color-primary)',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>
                    💬 Aceita Negociação de Valores
                  </span>
                </FieldLabel>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '16px',
                    marginLeft: '26px',
                  }}
                >
                  Permite que usuários façam ofertas (lances) para esta
                  propriedade. Você precisará definir valores mínimos aceitos.
                  <br />
                  <strong style={{ color: 'var(--color-text)' }}>
                    ⚠️ Os valores mínimos são confidenciais e não são exibidos
                    publicamente.
                  </strong>
                </p>

                {formData.acceptsNegotiation && (
                  <>
                    {formData.salePrice && (
                      <FieldContainer
                        style={{ marginTop: '16px', marginLeft: '26px' }}
                      >
                        <FieldLabel>
                          Valor Mínimo de Venda (R$)
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-secondary)',
                              marginLeft: '8px',
                            }}
                          >
                            (deve ser menor que o preço de venda)
                          </span>
                        </FieldLabel>
                        <FieldInput
                          type='text'
                          name='minSalePrice'
                          value={formData.minSalePrice}
                          onChange={handleInputChange}
                          placeholder='R$ 400.000,00'
                        />
                        {formData.minSalePrice &&
                          formData.salePrice &&
                          parseFloat(getNumericValue(formData.minSalePrice)) >=
                            parseFloat(getNumericValue(formData.salePrice)) && (
                            <ErrorMessage style={{ marginTop: '8px' }}>
                              ⚠️ O valor mínimo deve ser menor que o preço de
                              venda
                            </ErrorMessage>
                          )}
                        {formData.minSalePrice && (
                          <FieldContainer style={{ marginTop: '16px' }}>
                            <FieldLabel
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              Ação quando oferta estiver abaixo do mínimo
                              <InfoTooltip
                                content={
                                  formData.offerBelowMinSaleAction === 'reject'
                                    ? '🔴 Rejeitar automaticamente: Quando uma oferta de venda estiver abaixo do valor mínimo configurado, o sistema automaticamente rejeitará a oferta e definirá seu status como "rejected". O usuário receberá uma resposta de sucesso (201 Created), mas a oferta será criada já rejeitada. Isso evita que ofertas muito baixas fiquem pendentes.'
                                    : formData.offerBelowMinSaleAction ===
                                        'pending'
                                      ? '🟡 Manter pendente para análise: Quando uma oferta de venda estiver abaixo do valor mínimo, ela será criada com status "pending" e ficará disponível para sua análise manual. Você poderá aceitar ou rejeitar posteriormente através da interface de ofertas.'
                                      : '🔔 Notificar e manter pendente: Quando uma oferta de venda estiver abaixo do valor mínimo, o sistema criará a oferta com status "pending" e enviará uma notificação para você. A oferta ficará disponível para análise, mas você será alertado sobre ofertas que estão abaixo do seu piso mínimo.'
                                }
                                direction='down'
                              />
                            </FieldLabel>
                            <select
                              name='offerBelowMinSaleAction'
                              value={formData.offerBelowMinSaleAction}
                              onChange={e =>
                                setFormData(prev => ({
                                  ...prev,
                                  offerBelowMinSaleAction: e.target.value as
                                    | 'reject'
                                    | 'pending'
                                    | 'notify',
                                }))
                              }
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-background)',
                                color: 'var(--color-text)',
                                fontSize: '14px',
                                cursor: 'pointer',
                              }}
                            >
                              <option value='reject'>
                                Rejeitar automaticamente
                              </option>
                              <option value='pending'>
                                Manter pendente para análise
                              </option>
                              <option value='notify'>
                                Notificar e manter pendente
                              </option>
                            </select>
                            <p
                              style={{
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                                marginTop: '8px',
                              }}
                            >
                              {formData.offerBelowMinSaleAction === 'reject' &&
                                'Ofertas abaixo do mínimo serão rejeitadas automaticamente.'}
                              {formData.offerBelowMinSaleAction === 'pending' &&
                                'Ofertas abaixo do mínimo ficarão pendentes para sua análise.'}
                              {formData.offerBelowMinSaleAction === 'notify' &&
                                'Você será notificado sobre ofertas abaixo do mínimo.'}
                            </p>
                          </FieldContainer>
                        )}
                      </FieldContainer>
                    )}

                    {formData.rentPrice && (
                      <FieldContainer
                        style={{ marginTop: '16px', marginLeft: '26px' }}
                      >
                        <FieldLabel>
                          Valor Mínimo de Aluguel (R$)
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-secondary)',
                              marginLeft: '8px',
                            }}
                          >
                            (deve ser menor que o preço de aluguel)
                          </span>
                        </FieldLabel>
                        <FieldInput
                          type='text'
                          name='minRentPrice'
                          value={formData.minRentPrice}
                          onChange={handleInputChange}
                          placeholder='R$ 1.800,00'
                        />
                        {formData.minRentPrice &&
                          formData.rentPrice &&
                          parseFloat(getNumericValue(formData.minRentPrice)) >=
                            parseFloat(getNumericValue(formData.rentPrice)) && (
                            <ErrorMessage style={{ marginTop: '8px' }}>
                              ⚠️ O valor mínimo deve ser menor que o preço de
                              aluguel
                            </ErrorMessage>
                          )}
                        {formData.minRentPrice && (
                          <FieldContainer style={{ marginTop: '16px' }}>
                            <FieldLabel
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              Ação quando oferta estiver abaixo do mínimo
                              <InfoTooltip
                                content={
                                  formData.offerBelowMinRentAction === 'reject'
                                    ? '🔴 Rejeitar automaticamente: Quando uma oferta de aluguel estiver abaixo do valor mínimo configurado, o sistema automaticamente rejeitará a oferta e definirá seu status como "rejected". O usuário receberá uma resposta de sucesso (201 Created), mas a oferta será criada já rejeitada. Isso evita que ofertas muito baixas fiquem pendentes.'
                                    : formData.offerBelowMinRentAction ===
                                        'pending'
                                      ? '🟡 Manter pendente para análise: Quando uma oferta de aluguel estiver abaixo do valor mínimo, ela será criada com status "pending" e ficará disponível para sua análise manual. Você poderá aceitar ou rejeitar posteriormente através da interface de ofertas.'
                                      : '🔔 Notificar e manter pendente: Quando uma oferta de aluguel estiver abaixo do valor mínimo, o sistema criará a oferta com status "pending" e enviará uma notificação para você. A oferta ficará disponível para análise, mas você será alertado sobre ofertas que estão abaixo do seu piso mínimo.'
                                }
                                direction='down'
                              />
                            </FieldLabel>
                            <select
                              name='offerBelowMinRentAction'
                              value={formData.offerBelowMinRentAction}
                              onChange={e =>
                                setFormData(prev => ({
                                  ...prev,
                                  offerBelowMinRentAction: e.target.value as
                                    | 'reject'
                                    | 'pending'
                                    | 'notify',
                                }))
                              }
                              style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-background)',
                                color: 'var(--color-text)',
                                fontSize: '14px',
                                cursor: 'pointer',
                              }}
                            >
                              <option value='reject'>
                                Rejeitar automaticamente
                              </option>
                              <option value='pending'>
                                Manter pendente para análise
                              </option>
                              <option value='notify'>
                                Notificar e manter pendente
                              </option>
                            </select>
                            <p
                              style={{
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                                marginTop: '8px',
                              }}
                            >
                              {formData.offerBelowMinRentAction === 'reject' &&
                                'Ofertas abaixo do mínimo serão rejeitadas automaticamente.'}
                              {formData.offerBelowMinRentAction === 'pending' &&
                                'Ofertas abaixo do mínimo ficarão pendentes para sua análise.'}
                              {formData.offerBelowMinRentAction === 'notify' &&
                                'Você será notificado sobre ofertas abaixo do mínimo.'}
                            </p>
                          </FieldContainer>
                        )}
                      </FieldContainer>
                    )}

                    {!formData.salePrice && !formData.rentPrice && (
                      <div
                        style={{
                          marginTop: '16px',
                          marginLeft: '26px',
                          padding: '12px',
                          background: '#FEF3C7',
                          border: '1px solid #FCD34D',
                          borderRadius: '6px',
                          color: '#92400E',
                          fontSize: '14px',
                        }}
                      >
                        ⚠️ Defina pelo menos um preço (venda ou aluguel) para
                        configurar valores mínimos
                      </div>
                    )}

                    {/* Alerta quando aceita negociação mas não tem valores mínimos */}
                    {formData.acceptsNegotiation &&
                      (() => {
                        const hasMinSalePrice =
                          formData.minSalePrice &&
                          formData.minSalePrice.trim() !== '' &&
                          parseFloat(getNumericValue(formData.minSalePrice)) >
                            0;
                        const hasMinRentPrice =
                          formData.minRentPrice &&
                          formData.minRentPrice.trim() !== '' &&
                          parseFloat(getNumericValue(formData.minRentPrice)) >
                            0;
                        const salePriceValid =
                          formData.salePrice &&
                          parseFloat(getNumericValue(formData.salePrice)) > 0;
                        const rentPriceValid =
                          formData.rentPrice &&
                          parseFloat(getNumericValue(formData.rentPrice)) > 0;

                        const needsMinSale = salePriceValid && !hasMinSalePrice;
                        const needsMinRent = rentPriceValid && !hasMinRentPrice;
                        const needsAnyMin =
                          !hasMinSalePrice && !hasMinRentPrice;

                        if (needsMinSale || needsMinRent || needsAnyMin) {
                          return (
                            <div
                              style={{
                                marginTop: '16px',
                                marginLeft: '26px',
                                padding: '12px',
                                background: '#FEE2E2',
                                border: '1px solid #FCA5A5',
                                borderRadius: '6px',
                                color: '#991B1B',
                                fontSize: '14px',
                                fontWeight: '500',
                              }}
                            >
                              ⚠️ <strong>Atenção:</strong> Para aceitar
                              negociação, é necessário configurar pelo menos um
                              valor mínimo.
                              {needsMinSale &&
                                ' Configure o valor mínimo de venda.'}
                              {needsMinRent &&
                                ' Configure o valor mínimo de aluguel.'}
                              {needsAnyMin &&
                                !needsMinSale &&
                                !needsMinRent &&
                                ' Configure pelo menos um valor mínimo (venda ou aluguel).'}
                            </div>
                          );
                        }
                        return null;
                      })()}
                  </>
                )}
              </FieldContainer>
            </div>
          </>
        );

      case 4: // Galeria
        return (
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--color-text)' }}>
              Galeria de Imagens
            </h3>
            <p
              style={{
                marginBottom: '24px',
                color: 'var(--color-text-secondary)',
              }}
            >
              Selecione pelo menos 5 imagens da propriedade (exatamente 1080 ×
              1080 pixels). A propriedade será criada automaticamente ao
              avançar.
            </p>

            {/* Área de upload */}
            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                background: 'var(--color-background-secondary)',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = e => {
                  const files = Array.from(
                    (e.target as HTMLInputElement).files || []
                  );
                  handleImageSelect(files);
                };
                input.click();
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                }}
              >
                Clique para selecionar imagens
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Dimensão obrigatória: 1080 × 1080 px • Formatos: JPEG, PNG, GIF,
                WebP • Máximo: 10MB por imagem • Limite: 10 imagens
              </div>
            </div>

            {/* Imagens já existentes (modo de edição) */}
            {isEditMode && uploadedImages.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{ marginBottom: '16px', color: 'var(--color-text)' }}
                >
                  Imagens Existentes ({uploadedImages.length})
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {uploadedImages.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={e => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={e => handleDrop(e, index)}
                      style={{
                        position: 'relative',
                        background: 'var(--color-card-background)',
                        border: image.isMain
                          ? '2px solid var(--color-primary)'
                          : '1px solid var(--color-border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'move',
                        opacity: draggedImageIndex === index ? 0.5 : 1,
                        transform:
                          draggedImageIndex === index
                            ? 'scale(0.95)'
                            : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || 'Imagem da propriedade'}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                        }}
                      />

                      {/* Badge de imagem principal */}
                      {image.isMain && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          ⭐ Principal
                        </div>
                      )}

                      {/* Controles de ordem */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          display: 'flex',
                          gap: '4px',
                        }}
                      >
                        {/* Botão definir como principal */}
                        <button
                          onClick={() => setAsMainImage(index)}
                          style={{
                            background: image.isMain
                              ? 'var(--color-success)'
                              : 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                          title={
                            image.isMain
                              ? 'Imagem principal'
                              : 'Definir como principal'
                          }
                        >
                          ⭐
                        </button>

                        {/* Botão remover */}
                        <button
                          onClick={() => {
                            // Obter ID da imagem a ser removida
                            const imageToRemove = uploadedImages[index];
                            if (imageToRemove?.id) {
                              // Adicionar ID à lista de imagens removidas
                              setRemovedImageIds(prev => [
                                ...prev,
                                imageToRemove.id,
                              ]);
                            }
                            // Remover da lista de uploadedImages
                            setUploadedImages(prev =>
                              prev.filter((_, i) => i !== index)
                            );
                            toast.info(
                              'Imagem marcada para remoção. Será removida ao salvar. Lembre-se: é necessário ter pelo menos 5 imagens para continuar.'
                            );
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                          title='Remover imagem'
                        >
                          ×
                        </button>
                      </div>

                      {/* Informações da imagem */}
                      <div style={{ padding: '12px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--color-text)',
                            }}
                          >
                            Posição {index + 1}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-success)',
                            }}
                          >
                            ✓ Já enviada
                          </div>
                        </div>

                        {/* Controles de movimento */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                          }}
                        >
                          <button
                            onClick={() => moveImageUp(index)}
                            disabled={index === 0}
                            style={{
                              background:
                                index === 0
                                  ? 'var(--color-background-secondary)'
                                  : 'var(--color-primary)',
                              color:
                                index === 0
                                  ? 'var(--color-text-secondary)'
                                  : 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: index === 0 ? 'not-allowed' : 'pointer',
                              fontSize: '11px',
                              opacity: index === 0 ? 0.5 : 1,
                            }}
                            title='Mover para cima'
                          >
                            ↑ Cima
                          </button>

                          <button
                            onClick={() => moveImageDown(index)}
                            disabled={index === uploadedImages.length - 1}
                            style={{
                              background:
                                index === uploadedImages.length - 1
                                  ? 'var(--color-background-secondary)'
                                  : 'var(--color-primary)',
                              color:
                                index === uploadedImages.length - 1
                                  ? 'var(--color-text-secondary)'
                                  : 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor:
                                index === uploadedImages.length - 1
                                  ? 'not-allowed'
                                  : 'pointer',
                              fontSize: '11px',
                              opacity:
                                index === uploadedImages.length - 1 ? 0.5 : 1,
                            }}
                            title='Mover para baixo'
                          >
                            ↓ Baixo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instruções de uso */}
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'var(--color-background-secondary)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <strong>💡 Dicas:</strong>
                  <ul style={{ margin: '8px 0 0 20px' }}>
                    <li>Arraste e solte as imagens para reordenar</li>
                    <li>
                      Clique na estrela (⭐) para definir como imagem principal
                    </li>
                    <li>Use os botões "Cima/Baixo" para ajustar a posição</li>
                    <li>A primeira imagem será a principal por padrão</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Lista de imagens selecionadas - sempre mostrar se houver imagens */}
            {selectedImages.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{ marginBottom: '16px', color: 'var(--color-text)' }}
                >
                  {isEditMode
                    ? 'Novas Imagens Selecionadas'
                    : 'Imagens Selecionadas'}{' '}
                  ({selectedImages.length})
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {selectedImages.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        background: 'var(--color-card-background)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={imagePreviews[index]}
                        alt={file.name}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                        }}
                      />

                      {/* Botão remover */}
                      <button
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                        title='Remover imagem'
                      >
                        ×
                      </button>

                      {/* Informações da imagem */}
                      <div style={{ padding: '12px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--color-text)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              flex: 1,
                            }}
                          >
                            {file.name}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-warning)',
                              marginLeft: '8px',
                            }}
                          >
                            ⏳ Pendente
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '8px',
                          }}
                        >
                          {formatFileSize(file.size)}
                        </div>

                        {/* Controles de movimento */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                          }}
                        >
                          <button
                            onClick={() => moveSelectedImageUp(index)}
                            disabled={index === 0}
                            style={{
                              background:
                                index === 0
                                  ? 'var(--color-background-secondary)'
                                  : 'var(--color-primary)',
                              color:
                                index === 0
                                  ? 'var(--color-text-secondary)'
                                  : 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: index === 0 ? 'not-allowed' : 'pointer',
                              fontSize: '11px',
                              opacity: index === 0 ? 0.5 : 1,
                            }}
                            title='Mover para cima'
                          >
                            ↑ Cima
                          </button>

                          <button
                            onClick={() => moveSelectedImageDown(index)}
                            disabled={index === selectedImages.length - 1}
                            style={{
                              background:
                                index === selectedImages.length - 1
                                  ? 'var(--color-background-secondary)'
                                  : 'var(--color-primary)',
                              color:
                                index === selectedImages.length - 1
                                  ? 'var(--color-text-secondary)'
                                  : 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor:
                                index === selectedImages.length - 1
                                  ? 'not-allowed'
                                  : 'pointer',
                              fontSize: '11px',
                              opacity:
                                index === selectedImages.length - 1 ? 0.5 : 1,
                            }}
                            title='Mover para baixo'
                          >
                            ↓ Baixo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem informativa sobre quantidade de imagens */}
            <div
              style={{
                padding: '16px',
                background: (() => {
                  let totalImages;
                  if (isEditMode) {
                    totalImages =
                      Math.max(0, uploadedImages.length) +
                      selectedImages.length;
                  } else if (createdPropertyId) {
                    totalImages = Math.max(0, uploadedImages.length);
                  } else {
                    totalImages = selectedImages.length;
                  }
                  return totalImages >= 5 ? '#d1fae5' : '#fef3c7';
                })(),
                border: (() => {
                  let totalImages;
                  if (isEditMode) {
                    totalImages =
                      Math.max(0, uploadedImages.length) +
                      selectedImages.length;
                  } else if (createdPropertyId) {
                    totalImages = Math.max(0, uploadedImages.length);
                  } else {
                    totalImages = selectedImages.length;
                  }
                  return totalImages >= 5
                    ? '1px solid #10b981'
                    : '1px solid #fcd34d';
                })(),
                borderRadius: '8px',
                color: (() => {
                  let totalImages;
                  if (isEditMode) {
                    totalImages =
                      Math.max(0, uploadedImages.length) +
                      selectedImages.length;
                  } else if (createdPropertyId) {
                    totalImages = Math.max(0, uploadedImages.length);
                  } else {
                    totalImages = selectedImages.length;
                  }
                  return totalImages >= 5 ? '#065f46' : '#92400e';
                })(),
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {(() => {
                let totalImages;
                if (isEditMode) {
                  totalImages =
                    Math.max(0, uploadedImages.length) + selectedImages.length;
                } else if (createdPropertyId) {
                  totalImages = Math.max(0, uploadedImages.length);
                } else {
                  totalImages = selectedImages.length;
                }
                if (totalImages >= 5) {
                  return `✅ ${totalImages} imagem(ns) selecionada(s). Você pode continuar.`;
                } else {
                  return `⚠️ ${totalImages} de 5 imagens selecionadas. Adicione mais ${5 - totalImages} imagem(ns) para continuar.`;
                }
              })()}
            </div>
          </div>
        );

      case 5: // Clientes
        return (
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--color-text)' }}>
              Vincular Clientes
            </h3>
            <p
              style={{
                marginBottom: '24px',
                color: 'var(--color-text-secondary)',
              }}
            >
              Selecione os clientes que devem ser vinculados a esta propriedade.
              Clientes sem vínculo ou vinculados ao responsável serão exibidos.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setShowClientSelector(true)}
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>👥</span>
                Selecionar Clientes
              </button>
            </div>

            {selectedClientsLocal.length > 0 && (
              <div>
                <h4
                  style={{ marginBottom: '16px', color: 'var(--color-text)' }}
                >
                  Clientes Selecionados ({selectedClientsLocal.length})
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {selectedClientsLocal.map(client => (
                    <div
                      key={client.id}
                      style={{
                        padding: '16px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        background: 'var(--color-background-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ fontSize: '24px' }}>👤</div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: '500',
                            color: 'var(--color-text)',
                          }}
                        >
                          {client.name}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {client.email} • {client.phone}
                        </div>
                        {client.responsibleUser && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-text-light)',
                            }}
                          >
                            Responsável: {client.responsibleUser.name}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedClientsLocal(prev =>
                            prev.filter(c => c.id !== client.id)
                          );
                        }}
                        style={{
                          background: 'var(--color-error)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 6: // MCMV
        if (!hasMCMVModule) {
          return (
            <div
              style={{
                padding: '24px',
                background: 'var(--color-background-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <h3 style={{ marginBottom: '12px', color: 'var(--color-text)' }}>
                Módulo MCMV não disponível
              </h3>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: '16px',
                }}
              >
                As opções MCMV estão disponíveis apenas para empresas com o
                módulo MCMV habilitado.
              </p>
              <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>
                Entre em contato com o suporte para habilitar o módulo MCMV.
              </p>
            </div>
          );
        }

        return (
          <>
            <FieldContainer>
              <FieldLabel>
                <input
                  type='checkbox'
                  checked={formData.mcmvEligible}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      mcmvEligible: e.target.checked,
                      // Limpar campos se desmarcar
                      ...(e.target.checked
                        ? {}
                        : {
                            mcmvIncomeRange: '',
                            mcmvMaxValue: '',
                            mcmvSubsidy: '',
                            mcmvDocumentation: [],
                            mcmvNotes: '',
                          }),
                    }));
                  }}
                  style={{ marginRight: '8px' }}
                />
                Elegível para MCMV
              </FieldLabel>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  marginTop: '8px',
                }}
              >
                Marque esta opção se a propriedade pode ser financiada via
                programa Minha Casa Minha Vida
              </p>
            </FieldContainer>

            {formData.mcmvEligible && (
              <>
                <RowContainer>
                  <FieldContainerWithError
                    $hasError={
                      !formData.mcmvIncomeRange && formData.mcmvEligible
                    }
                  >
                    <FieldLabel>
                      Faixa de Renda MCMV
                      {formData.mcmvEligible && (
                        <RequiredIndicator>*</RequiredIndicator>
                      )}
                    </FieldLabel>
                    <FieldSelect
                      name='mcmvIncomeRange'
                      value={formData.mcmvIncomeRange}
                      onChange={handleInputChange}
                      required={formData.mcmvEligible}
                    >
                      <option value=''>Selecione a faixa</option>
                      <option value='faixa1'>Faixa 1 (até R$ 1.800)</option>
                      <option value='faixa2'>
                        Faixa 2 (R$ 1.801 até R$ 2.600)
                      </option>
                      <option value='faixa3'>
                        Faixa 3 (R$ 2.601 até R$ 4.000)
                      </option>
                    </FieldSelect>
                    {!formData.mcmvIncomeRange && formData.mcmvEligible && (
                      <ErrorMessage>
                        Selecione a faixa de renda MCMV
                      </ErrorMessage>
                    )}
                  </FieldContainerWithError>

                  <FieldContainer>
                    <FieldLabel>Valor Máximo para MCMV</FieldLabel>
                    <FieldInput
                      type='text'
                      name='mcmvMaxValue'
                      value={formData.mcmvMaxValue}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value) {
                          const formatted = formatCurrency(value);
                          setFormData(prev => ({
                            ...prev,
                            mcmvMaxValue: formatted,
                          }));
                        } else {
                          setFormData(prev => ({ ...prev, mcmvMaxValue: '' }));
                        }
                      }}
                      placeholder='R$ 0,00'
                    />
                  </FieldContainer>
                </RowContainer>

                <FieldContainer>
                  <FieldLabel>Valor do Subsídio</FieldLabel>
                  <FieldInput
                    type='text'
                    name='mcmvSubsidy'
                    value={formData.mcmvSubsidy}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value) {
                        const formatted = formatCurrency(value);
                        setFormData(prev => ({
                          ...prev,
                          mcmvSubsidy: formatted,
                        }));
                      } else {
                        setFormData(prev => ({ ...prev, mcmvSubsidy: '' }));
                      }
                    }}
                    placeholder='R$ 0,00'
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Documentos Necessários</FieldLabel>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginTop: '8px',
                    }}
                  >
                    {[
                      'CPF',
                      'RG',
                      'Comprovante de Renda',
                      'Comprovante de Residência',
                      'CadÚnico',
                      'Certidão de Casamento',
                      'Certidão de Nascimento dos Dependentes',
                    ].map(doc => (
                      <label
                        key={doc}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={formData.mcmvDocumentation.includes(doc)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                mcmvDocumentation: [
                                  ...prev.mcmvDocumentation,
                                  doc,
                                ],
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                mcmvDocumentation:
                                  prev.mcmvDocumentation.filter(d => d !== doc),
                              }));
                            }
                          }}
                        />
                        <span>{doc}</span>
                      </label>
                    ))}
                  </div>
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>Observações MCMV</FieldLabel>
                  <FieldTextarea
                    name='mcmvNotes'
                    value={formData.mcmvNotes}
                    onChange={e => {
                      const value = e.target.value;
                      if (value.length <= 1000) {
                        handleInputChange(e);
                      }
                    }}
                    placeholder='Observações específicas sobre MCMV para esta propriedade...'
                    rows={4}
                    maxLength={1000}
                  />
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {formData.mcmvNotes.length}/1000 caracteres
                  </div>
                </FieldContainer>
              </>
            )}
          </>
        );

      case 7: // Proprietário
        return (
          <>
            <FieldContainerWithError $hasError={!formData.ownerName.trim()}>
              <FieldLabel>
                Nome do Proprietário
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldInput
                type='text'
                name='ownerName'
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder='Ex: João Silva'
                maxLength={255}
                required
              />
              {!formData.ownerName.trim() && (
                <ErrorMessage>Este campo é obrigatório</ErrorMessage>
              )}
            </FieldContainerWithError>

            <RowContainer>
              <FieldContainerWithError
                $hasError={
                  !formData.ownerEmail.trim() ||
                  !formData.ownerEmail.includes('@')
                }
              >
                <FieldLabel>
                  Email do Proprietário
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='email'
                  name='ownerEmail'
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  placeholder='Ex: joao.silva@email.com'
                  maxLength={255}
                  required
                />
                {!formData.ownerEmail.trim() && (
                  <ErrorMessage>Este campo é obrigatório</ErrorMessage>
                )}
                {formData.ownerEmail.trim() &&
                  !formData.ownerEmail.includes('@') && (
                    <ErrorMessage>Email inválido</ErrorMessage>
                  )}
              </FieldContainerWithError>

              <FieldContainerWithError $hasError={!formData.ownerPhone.trim()}>
                <FieldLabel>
                  Telefone do Proprietário
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='tel'
                  name='ownerPhone'
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  placeholder='Ex: (11) 98765-4321'
                  maxLength={20}
                  required
                />
                {!formData.ownerPhone.trim() && (
                  <ErrorMessage>Este campo é obrigatório</ErrorMessage>
                )}
              </FieldContainerWithError>
            </RowContainer>

            <FieldContainerWithError $hasError={!formData.ownerDocument.trim()}>
              <FieldLabel>
                CPF ou CNPJ do Proprietário
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldInput
                type='text'
                name='ownerDocument'
                value={formData.ownerDocument}
                onChange={handleInputChange}
                placeholder='Ex: 123.456.789-00 ou 12.345.678/0001-90'
                maxLength={18}
                required
              />
              {!formData.ownerDocument.trim() && (
                <ErrorMessage>Este campo é obrigatório</ErrorMessage>
              )}
            </FieldContainerWithError>

            <FieldContainerWithError $hasError={!formData.ownerAddress.trim()}>
              <FieldLabel>
                Endereço do Proprietário
                <RequiredIndicator>*</RequiredIndicator>
              </FieldLabel>
              <FieldTextarea
                name='ownerAddress'
                value={formData.ownerAddress}
                onChange={handleInputChange}
                placeholder='Ex: Rua Exemplo, 456, São Paulo - SP'
                required
              />
              {!formData.ownerAddress.trim() && (
                <ErrorMessage>Este campo é obrigatório</ErrorMessage>
              )}
            </FieldContainerWithError>
          </>
        );

      case 8: // Revisão
        return (
          <div>
            <h3 style={{ marginBottom: '24px', color: 'var(--color-text)' }}>
              📋 Resumo da Propriedade
            </h3>

            {/* IA - Área de revisão com gerar novamente e editar */}
            {aiEnabled && (
              <div
                style={{
                  marginBottom: '24px',
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <h4 style={{ margin: 0, color: 'var(--color-text)' }}>
                    ✨ Descrição com IA
                  </h4>
                  <div
                    style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <button
                      type='button'
                      onClick={async () => {
                        if (generatedVariants.length >= 3) return;
                        const canGenerate =
                          formData.type &&
                          formData.city &&
                          formData.totalArea &&
                          String(formData.totalArea).trim() !== '';
                        if (!canGenerate) {
                          toast.error('Preencha tipo, cidade e área total.');
                          return;
                        }
                        try {
                          const req = {
                            type: formData.type as any,
                            city: formData.city,
                            neighborhood: formData.neighborhood || undefined,
                            totalArea:
                              parseFloat(
                                String(formData.totalArea).replace(',', '.')
                              ) || 0,
                            builtArea: formData.builtArea
                              ? parseFloat(
                                  String(formData.builtArea).replace(',', '.')
                                )
                              : undefined,
                            bedrooms: formData.bedrooms
                              ? parseInt(formData.bedrooms, 10)
                              : undefined,
                            bathrooms: formData.bathrooms
                              ? parseInt(formData.bathrooms, 10)
                              : undefined,
                            parkingSpaces: formData.parkingSpaces
                              ? parseInt(formData.parkingSpaces, 10)
                              : undefined,
                            salePrice: formData.salePrice
                              ? parseFloat(getNumericValue(formData.salePrice))
                              : undefined,
                            rentPrice: formData.rentPrice
                              ? parseFloat(getNumericValue(formData.rentPrice))
                              : undefined,
                            condominiumFee: formData.condominiumFee
                              ? parseFloat(
                                  getNumericValue(formData.condominiumFee)
                                )
                              : undefined,
                            iptu: formData.iptu
                              ? parseFloat(getNumericValue(formData.iptu))
                              : undefined,
                            features: formData.features || [],
                            additionalInfo: undefined,
                            // Campos MCMV (apenas se módulo estiver habilitado e imóvel for elegível)
                            ...(hasMCMVModule && formData.mcmvEligible
                              ? {
                                  mcmvEligible: formData.mcmvEligible,
                                  mcmvIncomeRange:
                                    formData.mcmvIncomeRange || undefined,
                                  mcmvMaxValue: formData.mcmvMaxValue
                                    ? parseFloat(
                                        getNumericValue(formData.mcmvMaxValue)
                                      )
                                    : undefined,
                                  mcmvSubsidy: formData.mcmvSubsidy
                                    ? parseFloat(
                                        getNumericValue(formData.mcmvSubsidy)
                                      )
                                    : undefined,
                                  mcmvNotes: formData.mcmvNotes || undefined,
                                }
                              : {}),
                          };
                          const result = await generate(req);
                          if (result) {
                            const next = [...generatedVariants, result];
                            setGeneratedVariants(next);
                            setSelectedVariantIndex(next.length - 1);
                            // Atualiza os campos com a última geração
                            setFormData(prev => ({
                              ...prev,
                              title: result.title || prev.title,
                              description:
                                result.description || prev.description,
                            }));
                            toast.success('Nova descrição gerada.');
                          } else {
                            toast.error('Erro ao gerar descrição.');
                          }
                        } catch {
                          toast.error('Erro ao gerar descrição.');
                        }
                      }}
                      disabled={aiLoading || generatedVariants.length >= 3}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 10,
                        border: 'none',
                        background:
                          aiLoading || generatedVariants.length >= 3
                            ? 'var(--color-border)'
                            : 'var(--color-primary)',
                        color: 'white',
                        cursor:
                          aiLoading || generatedVariants.length >= 3
                            ? 'not-allowed'
                            : 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      title='Gerar novamente'
                      onMouseEnter={e => {
                        if (!aiLoading && generatedVariants.length < 3) {
                          e.currentTarget.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <MdRefresh size={18} />
                      {aiLoading
                        ? 'Gerando...'
                        : `Gerar novamente (${3 - generatedVariants.length} restante${3 - generatedVariants.length === 1 ? '' : 's'})`}
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setAiEnabled(false); // Desmarcar checkbox para permitir edição
                        setDescriptionEditable(true);
                        setCurrentSection(0); // levar para edição no formulário
                        toast.info(
                          'Você pode editar o título e a descrição na etapa 1.'
                        );
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'var(--color-primary)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <MdEdit size={18} />
                      Editar
                    </button>
                  </div>
                </div>

                {/* Preview rápido da última geração */}
                <div style={{ display: 'grid', gap: 8 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-secondary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      Título
                    </div>
                    <div
                      style={{ fontWeight: 700, color: 'var(--color-text)' }}
                    >
                      {generatedVariants[selectedVariantIndex]?.title ||
                        formData.title ||
                        '—'}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--color-text-secondary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      Descrição
                    </div>
                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        color: 'var(--color-text)',
                      }}
                    >
                      {generatedVariants[selectedVariantIndex]?.description ||
                        formData.description ||
                        '—'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {generatedVariants.length}/3 geradas
                </div>
              </div>
            )}

            {/* Seção: Informações Básicas */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                📝 Informações Básicas
              </h4>
              <div
                style={{
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong>Título:</strong> {formData.title || 'Não informado'}
                  </div>
                  <div>
                    <strong>Tipo:</strong>{' '}
                    {formData.type
                      ? translatePropertyType(formData.type)
                      : 'Não informado'}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    {formData.status
                      ? translatePropertyStatus(formData.status)
                      : 'Não informado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Localização */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                📍 Localização
              </h4>
              <div
                style={{
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong>Endereço:</strong>{' '}
                    {formData.street
                      ? `${formData.street}, ${formData.number}${complementArray.length > 0 ? ', ' + complementArray.map(item => (item.value ? `${item.type}: ${item.value}` : item.type)).join(', ') : ''}`
                      : 'Não informado'}
                  </div>
                  <div>
                    <strong>Bairro:</strong>{' '}
                    {formData.neighborhood || 'Não informado'}
                  </div>
                  <div>
                    <strong>Cidade:</strong> {formData.city || 'Não informado'}
                  </div>
                  <div>
                    <strong>Estado:</strong> {formData.state || 'Não informado'}
                  </div>
                  <div>
                    <strong>CEP:</strong> {formData.zipCode || 'Não informado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Características */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                🏠 Características
              </h4>
              <div
                style={{
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong>Área Total:</strong>{' '}
                    {formData.totalArea
                      ? `${formData.totalArea.replace(',', '.')} m²`
                      : 'Não informado'}
                  </div>
                  {formData.builtArea && (
                    <div>
                      <strong>Área Construída:</strong>{' '}
                      {formData.builtArea.replace(',', '.')} m²
                    </div>
                  )}
                  {formData.bedrooms && (
                    <div>
                      <strong>Quartos:</strong> {formData.bedrooms}
                    </div>
                  )}
                  {formData.bathrooms && (
                    <div>
                      <strong>Banheiros:</strong> {formData.bathrooms}
                    </div>
                  )}
                  {formData.parkingSpaces && (
                    <div>
                      <strong>Vagas:</strong> {formData.parkingSpaces}
                    </div>
                  )}
                </div>

                {/* Características selecionadas */}
                {formData.features.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--color-text)',
                        marginBottom: '8px',
                      }}
                    >
                      Características:
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seção: MCMV */}
            {hasMCMVModule && formData.mcmvEligible && (
              <div style={{ marginBottom: '24px' }}>
                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--color-text)',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  🏠 MCMV
                </h4>
                <div
                  style={{
                    background: 'var(--color-background-secondary)',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <strong>Elegível:</strong> Sim
                    </div>
                    {formData.mcmvIncomeRange && (
                      <div>
                        <strong>Faixa de Renda:</strong>{' '}
                        {formData.mcmvIncomeRange === 'faixa1'
                          ? 'Faixa 1 (até R$ 1.800)'
                          : formData.mcmvIncomeRange === 'faixa2'
                            ? 'Faixa 2 (R$ 1.801 até R$ 2.600)'
                            : formData.mcmvIncomeRange === 'faixa3'
                              ? 'Faixa 3 (R$ 2.601 até R$ 4.000)'
                              : formData.mcmvIncomeRange}
                      </div>
                    )}
                    {formData.mcmvMaxValue && (
                      <div>
                        <strong>Valor Máximo:</strong> {formData.mcmvMaxValue}
                      </div>
                    )}
                    {formData.mcmvSubsidy && (
                      <div>
                        <strong>Subsídio:</strong> {formData.mcmvSubsidy}
                      </div>
                    )}
                    {formData.mcmvDocumentation.length > 0 && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Documentos:</strong>{' '}
                        {formData.mcmvDocumentation.join(', ')}
                      </div>
                    )}
                    {formData.mcmvNotes && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Observações:</strong> {formData.mcmvNotes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Seção: Valores */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                💰 Valores
              </h4>
              <div
                style={{
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {formData.salePrice &&
                    parseFloat(getNumericValue(formData.salePrice)) > 0 && (
                      <div>
                        <strong>Preço de Venda:</strong>{' '}
                        {formatCurrencyValue(
                          getNumericValue(formData.salePrice)
                        )}
                      </div>
                    )}
                  {formData.rentPrice &&
                    parseFloat(getNumericValue(formData.rentPrice)) > 0 && (
                      <div>
                        <strong>Preço de Aluguel:</strong>{' '}
                        {formatCurrencyValue(
                          getNumericValue(formData.rentPrice)
                        )}
                        /mês
                      </div>
                    )}
                  {formData.condominiumFee &&
                    parseFloat(getNumericValue(formData.condominiumFee)) >
                      0 && (
                      <div>
                        <strong>Condomínio:</strong>{' '}
                        {formatCurrencyValue(
                          getNumericValue(formData.condominiumFee)
                        )}
                        /mês
                      </div>
                    )}
                  {formData.iptu &&
                    parseFloat(getNumericValue(formData.iptu)) > 0 && (
                      <div>
                        <strong>IPTU:</strong>{' '}
                        {formatCurrencyValue(getNumericValue(formData.iptu))}
                        /ano
                      </div>
                    )}
                </div>

                {/* Negociação */}
                {formData.acceptsNegotiation && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: 'var(--color-background)',
                      borderRadius: '8px',
                      border: '2px solid var(--color-primary)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--color-primary)',
                      }}
                    >
                      💬 Aceita Negociação de Valores
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {formData.minSalePrice &&
                        parseFloat(getNumericValue(formData.minSalePrice)) >
                          0 && (
                          <>
                            <div>
                              <strong>Valor Mínimo de Venda:</strong>{' '}
                              {formatCurrencyValue(
                                getNumericValue(formData.minSalePrice)
                              )}
                            </div>
                            <div>
                              <strong>
                                Ação para Ofertas Abaixo do Mínimo (Venda):
                              </strong>{' '}
                              {formData.offerBelowMinSaleAction === 'reject' &&
                                '🔴 Rejeitar automaticamente'}
                              {formData.offerBelowMinSaleAction === 'pending' &&
                                '🟡 Manter pendente para análise'}
                              {formData.offerBelowMinSaleAction === 'notify' &&
                                '🔔 Notificar e manter pendente'}
                            </div>
                          </>
                        )}
                      {formData.minRentPrice &&
                        parseFloat(getNumericValue(formData.minRentPrice)) >
                          0 && (
                          <>
                            <div>
                              <strong>Valor Mínimo de Aluguel:</strong>{' '}
                              {formatCurrencyValue(
                                getNumericValue(formData.minRentPrice)
                              )}
                              /mês
                            </div>
                            <div>
                              <strong>
                                Ação para Ofertas Abaixo do Mínimo (Aluguel):
                              </strong>{' '}
                              {formData.offerBelowMinRentAction === 'reject' &&
                                '🔴 Rejeitar automaticamente'}
                              {formData.offerBelowMinRentAction === 'pending' &&
                                '🟡 Manter pendente para análise'}
                              {formData.offerBelowMinRentAction === 'notify' &&
                                '🔔 Notificar e manter pendente'}
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seção: Proprietário */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                👤 Informações do Proprietário
              </h4>
              <div
                style={{
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong>Nome:</strong>{' '}
                    {formData.ownerName || 'Não informado'}
                  </div>
                  <div>
                    <strong>Email:</strong>{' '}
                    {formData.ownerEmail || 'Não informado'}
                  </div>
                  <div>
                    <strong>Telefone:</strong>{' '}
                    {formData.ownerPhone || 'Não informado'}
                  </div>
                  <div>
                    <strong>CPF/CNPJ:</strong>{' '}
                    {formData.ownerDocument || 'Não informado'}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Endereço:</strong>{' '}
                    {formData.ownerAddress || 'Não informado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Galeria */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                📸 Galeria de Imagens
              </h4>
              <div
                style={{
                  background: 'var(--color-background-secondary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <strong>Total de Imagens:</strong>{' '}
                  {isEditMode
                    ? `${uploadedImages.length + selectedImages.length} (${uploadedImages.length} existente(s) + ${selectedImages.length} nova(s))`
                    : `${selectedImages.length}`}
                </div>

                {isEditMode && uploadedImages.length > 0 && (
                  <div
                    style={{
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <strong>Imagens Existentes:</strong> {uploadedImages.length}
                  </div>
                )}

                {selectedImages.length > 0 && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: '12px',
                      marginTop: '12px',
                    }}
                  >
                    {selectedImages.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          background: 'var(--color-card-background)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={imagePreviews[index]}
                          alt={file.name}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                          }}
                        />
                        <div
                          style={{
                            padding: '6px',
                            fontSize: '10px',
                            color: 'var(--color-text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {((isEditMode &&
                  uploadedImages.length + selectedImages.length < 5) ||
                  (!isEditMode && selectedImages.length < 5)) && (
                  <div
                    style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      fontStyle: 'italic',
                      marginTop: '12px',
                    }}
                  >
                    ⚠️ A propriedade deve ter pelo menos 5 imagens
                  </div>
                )}
              </div>
            </div>

            {/* Status da Criação */}
            {createdPropertyId && (
              <div
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#d1fae5',
                  borderRadius: '8px',
                  border: '1px solid #10b981',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <strong style={{ color: '#065f46' }}>
                    Propriedade criada com sucesso!
                  </strong>
                </div>
                <p style={{ color: '#047857', fontSize: '14px', margin: 0 }}>
                  ID da propriedade: {createdPropertyId}
                </p>
                {uploadedImages.length > 0 && (
                  <p
                    style={{
                      color: '#047857',
                      fontSize: '14px',
                      margin: '8px 0 0 0',
                    }}
                  >
                    {uploadedImages.length} imagem(ns) adicionada(s) na galeria
                  </p>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <PageContainer>
          <SuccessMessage>
            ✅ Propriedade criada com sucesso! Redirecionando...
          </SuccessMessage>
        </PageContainer>
      </Layout>
    );
  }

  // Mostrar shimmer enquanto carrega dados da propriedade
  if (isLoadingProperty) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <PropertyFormShimmer />
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  // Mostrar tela de erro se houver problema no carregamento
  if (propertyLoadError) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'var(--color-card-background)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ color: 'var(--color-error)', marginBottom: '16px' }}>
                ❌ Erro ao Carregar Propriedade
              </h2>
              <p style={{ color: 'var(--color-text)', marginBottom: '24px' }}>
                {propertyLoadError}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={() => {
                    setPropertyLoadError(null);
                    window.location.reload();
                  }}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Tentar Novamente
                </button>
                <button
                  onClick={() => navigate('/properties')}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--color-background-secondary)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  ← Voltar para Propriedades
                </button>
              </div>
            </div>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>
                {isEditMode ? 'Editar Propriedade' : 'Nova Propriedade'}
              </PageTitle>
              <PageSubtitle>
                {isEditMode
                  ? 'Atualize as informações da propriedade'
                  : 'Cadastre uma nova propriedade no sistema'}
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/properties')}>
              ← Voltar
            </BackButton>
          </PageHeader>

          <ProgressContainer>
            <ProgressTitle>Progresso</ProgressTitle>
            <ProgressSteps>
              {sections.map((section, index) => {
                // Na edição, permitir clicar em:
                // - Steps anteriores (pode voltar)
                // - Step atual
                // - Steps futuras se todas as anteriores estão validadas
                // Na criação, não permitir clicar (apenas visual)
                const isValid = validateSection(index);
                let isClickable = false;

                if (isEditMode) {
                  if (index <= currentSection) {
                    // Pode clicar em steps anteriores ou na atual
                    isClickable = true;
                  } else {
                    // Para steps futuras, verificar se todas as anteriores estão validadas
                    let allPreviousValid = true;
                    for (let i = currentSection; i < index; i++) {
                      if (!validateSection(i)) {
                        allPreviousValid = false;
                        break;
                      }
                    }
                    isClickable = allPreviousValid;
                  }
                }

                return (
                  <Step
                    key={section.id}
                    $active={index === currentSection}
                    $completed={index < currentSection}
                    $clickable={isClickable}
                    $invalid={!isValid && index < currentSection}
                    onClick={() => handleStepClick(index)}
                    style={{
                      cursor: isClickable ? 'pointer' : 'default',
                      opacity: !isClickable && !isEditMode ? 0.6 : 1,
                    }}
                    title={
                      !isEditMode
                        ? 'Use os botões "Próximo" e "Anterior" para navegar'
                        : !isValid && index < currentSection
                          ? 'Esta etapa possui campos obrigatórios não preenchidos'
                          : isClickable
                            ? `Clique para ir para: ${section.title}`
                            : 'Complete as etapas anteriores primeiro'
                    }
                  >
                    <StepNumber
                      $completed={index < currentSection}
                      $invalid={!isValid && index < currentSection}
                    >
                      {index < currentSection ? '✓' : index + 1}
                    </StepNumber>
                    {section.title}
                  </Step>
                );
              })}
            </ProgressSteps>
          </ProgressContainer>

          <FormContainer>
            <SectionTitle>
              {sections[currentSection].icon} {sections[currentSection].title}
            </SectionTitle>
            <SectionDescription>
              {sections[currentSection].description}
            </SectionDescription>

            <PropertyAIDescriptionModal
              isOpen={showAIModal}
              onClose={() => setShowAIModal(false)}
              variants={generatedVariants}
              selectedIndex={selectedVariantIndex}
              onSelectIndex={setSelectedVariantIndex}
              onAccept={handleAcceptAIVariant}
            />

            {renderSection()}

            <FormActions>
              <div>
                {currentSection > 0 && (
                  <Button
                    type='button'
                    className='secondary'
                    onClick={handlePrevious}
                    disabled={isLoading}
                  >
                    ← Anterior
                  </Button>
                )}
              </div>

              <div>
                {currentSection < sections.length - 1 ? (
                  <Button
                    type='button'
                    className='primary'
                    onClick={handleNext}
                    disabled={isLoading || !validateCurrentSection()}
                  >
                    Próximo →
                  </Button>
                ) : (
                  <Button
                    type='button'
                    className='primary'
                    onClick={async () => {
                      // Verificar se há erro na geração de IA
                      if (aiEnabled && aiGenerationError) {
                        toast.error(
                          'Não foi possível gerar o título e descrição com IA. Por favor, desmarque a opção de IA e preencha manualmente, ou edite os campos na etapa 1.'
                        );
                        return;
                      }
                      if (!createdPropertyId) {
                        // console.log('🔘 Finalizar - criando propriedade automaticamente...');
                        try {
                          await handleCreateProperty();
                          // handleFinalize será chamado automaticamente quando createdPropertyId for atualizado
                        } catch (error) {
                          // Se houver erro na criação, não chamar handleFinalize
                          console.error(
                            'Erro na criação da propriedade:',
                            error
                          );
                        }
                      } else {
                        handleFinalize();
                      }
                    }}
                    disabled={isLoading || (aiEnabled && aiGenerationError)}
                  >
                    ✅ Finalizar
                  </Button>
                )}
              </div>
            </FormActions>
          </FormContainer>
        </PageContent>
      </PageContainer>

      {showClientSelector && (
        <ClientSelector
          selectedClients={selectedClientsLocal}
          onClientsChange={handleClientsChange}
          availableClients={availableClients}
          onClose={() => setShowClientSelector(false)}
          propertyTitle={formData.title}
        />
      )}

      {showWatermarkModal && companyId && (
        <WatermarkInfoModal
          isOpen={showWatermarkModal}
          onClose={() => {
            setShowWatermarkModal(false);
            // Marcar como visto no localStorage
            if (companyId) {
              localStorage.setItem(
                `watermark_modal_shown_${companyId}`,
                'true'
              );
            }
          }}
          companyId={companyId}
        />
      )}

      <PropertySuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        isEditMode={isEditMode}
        propertyId={createdPropertyId}
      />
    </Layout>
  );
};

export default CreatePropertyPage;
