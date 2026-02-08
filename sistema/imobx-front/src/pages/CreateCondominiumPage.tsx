import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdHome,
  MdArrowBack,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdBusiness,
  MdLanguage,
  MdSave,
  MdCloudUpload,
  MdDelete,
  MdImage,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { condominiumApi } from '../services/condominiumApi';
import type {
  CreateCondominiumDto,
  UpdateCondominiumDto,
} from '../types/condominium';
import { showSuccess, showError } from '../utils/notifications';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import {
  maskCEP as maskZipCode,
  maskPhoneAuto,
  maskCNPJ,
} from '../utils/masks';
import { useAddress } from '../hooks/useAddress';
import { useStatesCities } from '../hooks/useStatesCities';
import { toast } from 'react-toastify';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  FormContainer,
  SectionTitle,
  SectionDescription,
  FieldContainer,
  FieldLabel,
  RequiredIndicator,
  ErrorMessage,
  FieldInput,
  FieldTextarea,
  FieldSelect,
  RowContainer,
  FormActions,
  Button,
} from '../styles/pages/CreatePropertyPageStyles';
import { ShimmerBase } from '../components/common/Shimmer';
import styled from 'styled-components';
import {
  ComplementMultiSelect,
  type ComplementItem,
} from '../components/forms/ComplementMultiSelect';
import { SimilarityWarningModal } from '../components/modals/SimilarityWarningModal';
import type {
  SimilarCondominium,
  CondominiumImage,
} from '../types/condominium';

const FieldIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingIndicator = styled.span`
  margin-left: 8px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
`;

const CreateCondominiumPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const condominiumId = id;

  const permissionsContext = usePermissionsContextOptional();
  const hasCreatePermission =
    permissionsContext?.hasPermission('condominium:create') || false;
  const hasUpdatePermission =
    permissionsContext?.hasPermission('condominium:update') || false;
  const hasPermission = isEditMode ? hasUpdatePermission : hasCreatePermission;

  const [formData, setFormData] = useState<CreateCondominiumDto>({
    name: '',
    description: '',
    address: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    cnpj: '',
    website: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCondominium, setIsLoadingCondominium] = useState(false);
  const [showSimilarityModal, setShowSimilarityModal] = useState(false);
  const [similarCondominiums, setSimilarCondominiums] = useState<
    SimilarCondominium[]
  >([]);
  const [isCheckingSimilarity, setIsCheckingSimilarity] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<(() => void) | null>(null);
  const [complementArray, setComplementArray] = useState<ComplementItem[]>([]);
  const [images, setImages] = useState<CondominiumImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Carregar dados do condomínio no modo de edição
  useEffect(() => {
    const loadCondominiumData = async () => {
      if (isEditMode && condominiumId) {
        setIsLoadingCondominium(true);
        try {
          const condominium =
            await condominiumApi.getCondominiumById(condominiumId);

          // Converter complement string para array de ComplementItem
          if (condominium.complement) {
            // Tentar parsear como "Tipo: Valor" ou apenas "Tipo"
            const parts = condominium.complement
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

          setFormData({
            name: condominium.name || '',
            description: condominium.description || '',
            address: condominium.address || '',
            street: condominium.street || '',
            number: condominium.number || '',
            complement: condominium.complement || '',
            neighborhood: condominium.neighborhood || '',
            city: condominium.city || '',
            state: condominium.state || '',
            zipCode: condominium.zipCode || '',
            phone: condominium.phone || '',
            email: condominium.email || '',
            cnpj: condominium.cnpj || '',
            website: condominium.website || '',
          });

          // Carregar imagens do condomínio
          if (condominium.images && condominium.images.length > 0) {
            setImages(condominium.images);
          }

          // Selecionar estado e cidade
          if (condominium.state && states.length > 0) {
            const stateFound = states.find(s => s.sigla === condominium.state);
            if (stateFound) {
              handleSetSelectedState(stateFound);
            }
          }
        } catch (error: any) {
          console.error('Erro ao carregar condomínio:', error);
          toast.error('Erro ao carregar dados do condomínio');
          navigate('/condominiums');
        } finally {
          setIsLoadingCondominium(false);
        }
      }
    };

    loadCondominiumData();
  }, [isEditMode, condominiumId, navigate, states, handleSetSelectedState]);

  // Buscar endereço quando CEP mudar
  useEffect(() => {
    if (formData.zipCode && formData.zipCode.replace(/\D/g, '').length === 8) {
      searchByZipCode(formData.zipCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.zipCode]);

  // Preencher campos quando endereço for encontrado
  useEffect(() => {
    if (addressData) {
      setFormData(prev => ({
        ...prev,
        street: addressData.street || prev.street,
        neighborhood: addressData.neighborhood || prev.neighborhood,
        city: addressData.city || prev.city,
        state: addressData.state || prev.state,
        address:
          `${addressData.street || ''}, ${addressData.neighborhood || ''}, ${addressData.city || ''} - ${addressData.state || ''}`.replace(
            /^,\s*|,\s*$/g,
            ''
          ),
      }));

      // Selecionar estado automaticamente
      if (addressData.state && states.length > 0) {
        const stateFound = states.find(s => s.sigla === addressData.state);
        if (stateFound) {
          handleSetSelectedState(stateFound);
        }
      }
    }
  }, [addressData, states, handleSetSelectedState]);

  // Selecionar cidade automaticamente quando estado for selecionado e cidade estiver no formData
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

  // Selecionar cidade quando carregar condomínio no modo de edição
  useEffect(() => {
    if (
      isEditMode &&
      selectedState &&
      cities.length > 0 &&
      formData.city &&
      !loadingCities
    ) {
      const cityFound = cities.find(c => c.nome === formData.city);
      if (cityFound && selectedCity?.id !== cityFound.id) {
        handleSetSelectedCity(cityFound);
      }
    }
  }, [
    isEditMode,
    selectedState,
    cities,
    formData.city,
    loadingCities,
    selectedCity,
    handleSetSelectedCity,
  ]);

  const handleInputChange = (
    field: keyof CreateCondominiumDto,
    value: string
  ) => {
    let processedValue = value;

    // Aplicar máscaras
    if (field === 'zipCode') {
      processedValue = maskZipCode(value);
    } else if (field === 'phone') {
      processedValue = maskPhoneAuto(value);
    } else if (field === 'cnpj') {
      processedValue = maskCNPJ(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Verificação de similaridade com debounce (apenas no modo de criação)
  useEffect(() => {
    if (isEditMode || formData.name.length < 3) {
      setSimilarCondominiums([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      const checkSimilarity = async () => {
        try {
          setIsCheckingSimilarity(true);
          const result = await condominiumApi.checkSimilarity(formData.name);

          if (result.hasSimilar && result.similarCondominiums.length > 0) {
            setSimilarCondominiums(result.similarCondominiums);
          } else {
            setSimilarCondominiums([]);
          }
        } catch (error) {
          console.error('Erro ao verificar similaridade:', error);
          // Verificação silenciosa, não mostrar erro ao usuário
        } finally {
          setIsCheckingSimilarity(false);
        }
      };

      checkSimilarity();
    }, 800); // Debounce de 800ms para não interromper a digitação

    return () => clearTimeout(timeoutId);
  }, [formData.name, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do condomínio é obrigatório';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Rua/Logradouro é obrigatório';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    } else if (formData.state.length !== 2) {
      newErrors.state = 'Estado deve ter 2 letras (ex: SP)';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (formData.zipCode.replace(/\D/g, '').length !== 8) {
      newErrors.zipCode = 'CEP deve ter 8 dígitos';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const performSubmit = async () => {
    if (!hasPermission) {
      showError(
        `Você não tem permissão para ${isEditMode ? 'editar' : 'criar'} condomínios`
      );
      return;
    }

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);

    try {
      // No modo edição, fazer upload de imagens pendentes antes de atualizar
      if (isEditMode && condominiumId && selectedFiles.length > 0) {
        await uploadPendingImages(condominiumId);
      }

      // Limpar campos opcionais vazios antes de enviar
      const cleanedData: CreateCondominiumDto | UpdateCondominiumDto = {
        name: formData.name,
        description: formData.description?.trim() || undefined,
        address: formData.address,
        street: formData.street,
        number: formData.number,
        complement:
          complementArray.length > 0
            ? complementArray
                .map(item =>
                  item.value ? `${item.type}: ${item.value}` : item.type
                )
                .join(', ')
            : undefined,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        cnpj: formData.cnpj?.trim() || undefined,
        website: formData.website?.trim() || undefined,
      };

      let newCondominiumId = condominiumId;

      if (isEditMode && condominiumId) {
        await condominiumApi.updateCondominium(condominiumId, cleanedData);
        showSuccess('Condomínio atualizado com sucesso!');
        // Upload de imagens já foi feito antes (no início do performSubmit)
      } else {
        const newCondominium =
          await condominiumApi.createCondominium(cleanedData);
        newCondominiumId = newCondominium.id;
        showSuccess('Condomínio criado com sucesso!');

        // Fazer upload de imagens pendentes (modo criação)
        if (selectedFiles.length > 0) {
          await uploadPendingImages(newCondominiumId);
        }
      }

      navigate('/condominiums');
    } catch (error: any) {
      console.error('Erro ao criar condomínio:', error);
      showError(error.message || 'Erro ao criar condomínio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se estiver editando, não verificar similaridade
    if (isEditMode) {
      performSubmit();
      return;
    }

    // Sempre verificar similaridade antes de criar (verificação final)
    if (formData.name.length >= 2) {
      try {
        setIsCheckingSimilarity(true);
        const result = await condominiumApi.checkSimilarity(formData.name);

        if (result.hasSimilar && result.similarCondominiums.length > 0) {
          setSimilarCondominiums(result.similarCondominiums);

          // Verificar se há condomínios muito idênticos (score >= 80%)
          const verySimilar = result.similarCondominiums.some(
            c => c.similarityScore >= 80
          );

          if (verySimilar) {
            // Se houver condomínios muito idênticos, sempre mostrar modal
            setPendingSubmit(() => performSubmit);
            setShowSimilarityModal(true);
            setIsCheckingSimilarity(false);
            return;
          } else if (result.similarCondominiums.length > 0) {
            // Se houver similares (mesmo com score menor), também mostrar modal
            setPendingSubmit(() => performSubmit);
            setShowSimilarityModal(true);
            setIsCheckingSimilarity(false);
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao verificar similaridade:', error);
        // Continuar mesmo se houver erro na verificação
      } finally {
        setIsCheckingSimilarity(false);
      }
    }

    // Se não há similares, prosseguir normalmente
    performSubmit();
  };

  // Função para selecionar arquivos (apenas preview, sem upload)
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const previews: string[] = [];

    // Validar total de imagens (existentes + novas + pendentes)
    const totalImages = images.length + selectedFiles.length;
    if (totalImages + Array.from(files).length > 20) {
      toast.error(
        `Máximo de 20 imagens permitidas. Você já tem ${totalImages} imagem(ns).`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    for (const file of Array.from(files)) {
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: Tipo de arquivo não suportado`);
        continue;
      }

      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: Arquivo muito grande (máximo 10MB)`);
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

    if (validFiles.length === 0) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Apenas adicionar às selecionadas (preview) - upload será feito no submit
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...previews]);

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para remover imagem
  const handleRemoveImage = (imageIdOrIndex: string | number) => {
    // Se for número, é um índice de preview (imagem pendente)
    if (typeof imageIdOrIndex === 'number') {
      const index = imageIdOrIndex;
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      return;
    }

    // Se for string, é um ID de imagem já enviada
    const imageId = imageIdOrIndex;

    // Se o condomínio já existe, remover da API
    if (condominiumId) {
      const removeFromApi = async () => {
        try {
          setRemovingImageId(imageId);
          await condominiumApi.deleteImage(condominiumId, imageId);
          setImages(prev => prev.filter(img => img.id !== imageId));
          toast.success('Imagem removida com sucesso!');
        } catch (error: any) {
          console.error('Erro ao remover imagem:', error);
          toast.error(error.message || 'Erro ao remover imagem');
        } finally {
          setRemovingImageId(null);
        }
      };
      removeFromApi();
    } else {
      // Se ainda não foi criado, apenas remover do estado (não deveria acontecer, mas por segurança)
      setImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  // Função para fazer upload de imagens pendentes
  const uploadPendingImages = async (condominiumIdToUse: string) => {
    if (selectedFiles.length > 0) {
      try {
        setIsUploadingImages(true);
        const uploadedImages = await condominiumApi.uploadImages(
          condominiumIdToUse,
          selectedFiles
        );
        setImages(prev => [...prev, ...uploadedImages]);
        setSelectedFiles([]);
        setImagePreviews([]);
        toast.success(
          `${uploadedImages.length} imagem(ns) enviada(s) com sucesso!`
        );
      } catch (uploadError: any) {
        console.error(
          'Erro ao fazer upload de imagens pendentes:',
          uploadError
        );
        toast.error(uploadError.message || 'Erro ao fazer upload de imagens');
        throw uploadError; // Re-throw para que o submit possa tratar
      } finally {
        setIsUploadingImages(false);
      }
    }
  };

  if (!hasPermission) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <h2 style={{ color: 'var(--color-text)', marginBottom: '16px' }}>
                Acesso Negado
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: '24px',
                }}
              >
                Você não tem permissão para {isEditMode ? 'editar' : 'criar'}{' '}
                condomínios.
              </p>
              <Button onClick={() => navigate('/condominiums')}>
                <MdArrowBack />
                Voltar para Condomínios
              </Button>
            </div>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  if (isLoadingCondominium) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            {/* Header Shimmer */}
            <PageHeader>
              <PageTitleContainer>
                <ShimmerBase
                  $width='300px'
                  $height='32px'
                  $borderRadius='8px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase
                  $width='400px'
                  $height='18px'
                  $borderRadius='8px'
                />
              </PageTitleContainer>
              <ShimmerBase $width='120px' $height='44px' $borderRadius='12px' />
            </PageHeader>

            {/* Form Shimmer */}
            <div style={{ marginTop: '32px' }}>
              {/* Informações Básicas */}
              <div style={{ marginBottom: '32px' }}>
                <ShimmerBase
                  $width='250px'
                  $height='24px'
                  $borderRadius='8px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase
                  $width='400px'
                  $height='16px'
                  $borderRadius='8px'
                  $margin='0 0 24px 0'
                />
                <ShimmerBase
                  $width='100%'
                  $height='44px'
                  $borderRadius='8px'
                  $margin='0 0 16px 0'
                />
                <ShimmerBase
                  $width='100%'
                  $height='100px'
                  $borderRadius='8px'
                />
              </div>

              {/* Localização */}
              <div style={{ marginBottom: '32px' }}>
                <ShimmerBase
                  $width='200px'
                  $height='24px'
                  $borderRadius='8px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase
                  $width='350px'
                  $height='16px'
                  $borderRadius='8px'
                  $margin='0 0 24px 0'
                />
                <RowContainer>
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                </RowContainer>
                <ShimmerBase
                  $width='100%'
                  $height='44px'
                  $borderRadius='8px'
                  $margin='16px 0'
                />
                <RowContainer>
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                </RowContainer>
                <RowContainer style={{ marginTop: '16px' }}>
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                </RowContainer>
                <ShimmerBase
                  $width='100%'
                  $height='44px'
                  $borderRadius='8px'
                  $margin='16px 0 0 0'
                />
              </div>

              {/* Contato */}
              <div style={{ marginBottom: '32px' }}>
                <ShimmerBase
                  $width='250px'
                  $height='24px'
                  $borderRadius='8px'
                  $margin='0 0 8px 0'
                />
                <ShimmerBase
                  $width='450px'
                  $height='16px'
                  $borderRadius='8px'
                  $margin='0 0 24px 0'
                />
                <RowContainer>
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                </RowContainer>
                <RowContainer style={{ marginTop: '16px' }}>
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                  <ShimmerBase
                    $width='100%'
                    $height='44px'
                    $borderRadius='8px'
                  />
                </RowContainer>
              </div>

              {/* Botões */}
              <FormActions>
                <ShimmerBase
                  $width='120px'
                  $height='48px'
                  $borderRadius='12px'
                />
                <ShimmerBase
                  $width='180px'
                  $height='48px'
                  $borderRadius='12px'
                />
              </FormActions>
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
                <MdHome size={32} />
                {isEditMode ? 'Editar Condomínio' : 'Criar Condomínio'}
              </PageTitle>
              <PageSubtitle>
                {isEditMode
                  ? 'Edite as informações do condomínio'
                  : 'Cadastre um novo condomínio no sistema'}
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={() => navigate('/condominiums')}>
              <MdArrowBack />
              Voltar
            </BackButton>
          </PageHeader>

          <form onSubmit={handleSubmit}>
            {/* Informações Básicas */}
            <div style={{ marginBottom: '32px' }}>
              <SectionTitle>📝 Informações Básicas</SectionTitle>
              <SectionDescription>
                Dados essenciais do condomínio
              </SectionDescription>

              <FieldContainer style={{ marginTop: '24px' }}>
                <FieldLabel>
                  <FieldIcon>
                    <MdHome size={16} />
                  </FieldIcon>
                  Nome do Condomínio
                  <RequiredIndicator>*</RequiredIndicator>
                  {isCheckingSimilarity && formData.name.length >= 3 && (
                    <LoadingIndicator
                      style={{ fontSize: '0.75rem', opacity: 0.7 }}
                    >
                      Verificando...
                    </LoadingIndicator>
                  )}
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ex: Residencial Jardim das Flores'
                  required
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                {similarCondominiums.length > 0 &&
                  formData.name.length >= 3 &&
                  !isEditMode &&
                  !isCheckingSimilarity && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '12px',
                        background: '#fffbeb',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: '#92400e',
                      }}
                    >
                      <div style={{ marginBottom: '8px', fontWeight: 600 }}>
                        ⚠️ {similarCondominiums.length} condomínio(s)
                        similar(es) encontrado(s)
                      </div>
                      {similarCondominiums.map((condominium, index) => (
                        <div
                          key={condominium.id}
                          style={{
                            marginTop: index > 0 ? '8px' : '0',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '6px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                            {condominium.name}
                          </div>
                          <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>
                            {condominium.city} - {condominium.state} •{' '}
                            {condominium.similarityScore}% similar
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>
                  <FieldIcon>
                    <MdBusiness size={16} />
                  </FieldIcon>
                  Descrição
                </FieldLabel>
                <FieldTextarea
                  value={formData.description || ''}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Descreva o condomínio, suas características e áreas de lazer...'
                  rows={4}
                />
              </FieldContainer>
            </div>

            {/* Localização */}
            <div style={{ marginBottom: '32px' }}>
              <SectionTitle>📍 Localização</SectionTitle>
              <SectionDescription>
                Endereço completo do condomínio
              </SectionDescription>

              <RowContainer style={{ marginTop: '24px' }}>
                <FieldContainer>
                  <FieldLabel>
                    <FieldIcon>
                      <MdLocationOn size={16} />
                    </FieldIcon>
                    CEP
                    <RequiredIndicator>*</RequiredIndicator>
                    {isAddressLoading && (
                      <LoadingIndicator>🔍 Buscando...</LoadingIndicator>
                    )}
                  </FieldLabel>
                  <FieldInput
                    type='text'
                    value={formData.zipCode}
                    onChange={e => handleInputChange('zipCode', e.target.value)}
                    placeholder='00000-000'
                    maxLength={9}
                    required
                    disabled={isAddressLoading}
                  />
                  {errors.zipCode && (
                    <ErrorMessage>{errors.zipCode}</ErrorMessage>
                  )}
                  {addressError && <ErrorMessage>{addressError}</ErrorMessage>}
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>
                    Número
                    <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldInput
                    type='text'
                    value={formData.number}
                    onChange={e => handleInputChange('number', e.target.value)}
                    placeholder='123'
                    required
                  />
                  {errors.number && (
                    <ErrorMessage>{errors.number}</ErrorMessage>
                  )}
                </FieldContainer>
              </RowContainer>

              <FieldContainer>
                <FieldLabel>
                  Rua/Logradouro
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.street}
                  onChange={e => handleInputChange('street', e.target.value)}
                  placeholder='Rua das Flores'
                  required
                  readOnly
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  title='Este campo é preenchido automaticamente ao informar o CEP'
                />
                {errors.street && <ErrorMessage>{errors.street}</ErrorMessage>}
              </FieldContainer>

              <RowContainer>
                <FieldContainer>
                  <FieldLabel>Complemento</FieldLabel>
                  <ComplementMultiSelect
                    value={complementArray}
                    onChange={setComplementArray}
                    propertyType='condominium'
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
                  value={formData.neighborhood}
                  onChange={e =>
                    handleInputChange('neighborhood', e.target.value)
                  }
                  placeholder='Jardim das Flores'
                  required
                  readOnly
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  title='Este campo é preenchido automaticamente ao informar o CEP'
                />
                {errors.neighborhood && (
                  <ErrorMessage>{errors.neighborhood}</ErrorMessage>
                )}
              </FieldContainer>

              <RowContainer>
                <FieldContainer>
                  <FieldLabel>
                    Estado
                    <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldSelect
                    value={selectedState?.id || formData.state || ''}
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
                    style={{
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                    }}
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
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>
                    Cidade
                    <RequiredIndicator>*</RequiredIndicator>
                  </FieldLabel>
                  <FieldSelect
                    value={selectedCity?.id || formData.city || ''}
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
                    style={{
                      backgroundColor: '#f5f5f5',
                      cursor: 'not-allowed',
                    }}
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
                  {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                </FieldContainer>
              </RowContainer>

              <FieldContainer>
                <FieldLabel>
                  Endereço Completo
                  <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder='Rua das Flores, 123, Jardim das Flores, São Paulo - SP'
                  required
                />
                {errors.address && (
                  <ErrorMessage>{errors.address}</ErrorMessage>
                )}
              </FieldContainer>
            </div>

            {/* Contato */}
            <div style={{ marginBottom: '32px' }}>
              <SectionTitle>📞 Informações de Contato</SectionTitle>
              <SectionDescription>
                Telefone, email e outras informações (opcional)
              </SectionDescription>

              <RowContainer style={{ marginTop: '24px' }}>
                <FieldContainer>
                  <FieldLabel>
                    <FieldIcon>
                      <MdPhone size={16} />
                    </FieldIcon>
                    Telefone
                  </FieldLabel>
                  <FieldInput
                    type='text'
                    value={formData.phone || ''}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder='(11) 3333-4444'
                    maxLength={15}
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>
                    <FieldIcon>
                      <MdEmail size={16} />
                    </FieldIcon>
                    Email
                  </FieldLabel>
                  <FieldInput
                    type='email'
                    value={formData.email || ''}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='contato@condominio.com'
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FieldContainer>
              </RowContainer>

              <RowContainer>
                <FieldContainer>
                  <FieldLabel>
                    <FieldIcon>
                      <MdBusiness size={16} />
                    </FieldIcon>
                    CNPJ
                  </FieldLabel>
                  <FieldInput
                    type='text'
                    value={formData.cnpj || ''}
                    onChange={e => handleInputChange('cnpj', e.target.value)}
                    placeholder='12.345.678/0001-95'
                    maxLength={18}
                  />
                </FieldContainer>

                <FieldContainer>
                  <FieldLabel>
                    <FieldIcon>
                      <MdLanguage size={16} />
                    </FieldIcon>
                    Website
                  </FieldLabel>
                  <FieldInput
                    type='url'
                    value={formData.website || ''}
                    onChange={e => handleInputChange('website', e.target.value)}
                    placeholder='https://www.condominio.com'
                  />
                </FieldContainer>
              </RowContainer>
            </div>

            {/* Seção de Imagens */}
            <div style={{ marginTop: '32px' }}>
              <SectionTitle>Imagens do Condomínio</SectionTitle>
              <SectionDescription>
                Adicione até 20 imagens do condomínio (máximo 10MB por imagem)
              </SectionDescription>

              {/* Área de Upload */}
              {(condominiumId ||
                selectedFiles.length > 0 ||
                images.length > 0) && (
                <div style={{ marginTop: '16px' }}>
                  <label
                    htmlFor='image-upload'
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px',
                      border: '2px dashed var(--color-border)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: 'var(--color-background-secondary)',
                      marginBottom: '16px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor =
                        'var(--color-primary)';
                      e.currentTarget.style.background =
                        'var(--color-primary)10';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.background =
                        'var(--color-background-secondary)';
                    }}
                  >
                    <MdCloudUpload
                      size={48}
                      style={{
                        color: 'var(--color-primary)',
                        marginBottom: '12px',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        marginBottom: '4px',
                      }}
                    >
                      Clique para enviar ou arraste imagens aqui
                    </span>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      PNG, JPG, WEBP até 10MB cada (máximo 20 imagens)
                    </span>
                    <input
                      ref={fileInputRef}
                      id='image-upload'
                      type='file'
                      multiple
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                      disabled={
                        isUploadingImages ||
                        isSubmitting ||
                        images.length + selectedFiles.length >= 20
                      }
                    />
                  </label>

                  {/* Grid de Imagens */}
                  {(images.length > 0 || imagePreviews.length > 0) && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '16px',
                        marginTop: '16px',
                      }}
                    >
                      {/* Imagens já enviadas */}
                      {images.map(image => (
                        <div
                          key={image.id}
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '2px solid var(--color-border)',
                          }}
                        >
                          <img
                            src={image.fileUrl}
                            alt={image.altText || 'Imagem do condomínio'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          {image.isMain && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              Principal
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveImage(image.id)}
                            disabled={removingImageId === image.id}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#dc2626';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background =
                                'rgba(239, 68, 68, 0.9)';
                            }}
                          >
                            {removingImageId === image.id ? (
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  border: '2px solid white',
                                  borderTop: '2px solid transparent',
                                  borderRadius: '50%',
                                  animation: 'spin 1s linear infinite',
                                }}
                              />
                            ) : (
                              <MdDelete size={16} />
                            )}
                          </button>
                        </div>
                      ))}

                      {/* Previews de imagens pendentes */}
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={`preview-${index}`}
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '2px dashed var(--color-border)',
                          }}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: 'rgba(245, 158, 11, 0.9)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            Pendente
                          </div>
                          <button
                            onClick={() => handleRemoveImage(index)}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#dc2626';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background =
                                'rgba(239, 68, 68, 0.9)';
                            }}
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isUploadingImages && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'var(--color-primary)10',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: 'var(--color-primary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      Enviando imagens...
                    </div>
                  )}
                </div>
              )}

              {/* Mensagem se não há condomínio criado ainda */}
              {!condominiumId &&
                selectedFiles.length === 0 &&
                images.length === 0 && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '24px',
                      background: 'var(--color-background-secondary)',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <MdImage
                      size={32}
                      style={{ marginBottom: '8px', opacity: 0.5 }}
                    />
                    <p>As imagens serão adicionadas após criar o condomínio</p>
                  </div>
                )}
            </div>

            <FormActions>
              <Button
                type='button'
                onClick={() => navigate('/condominiums')}
                disabled={isSubmitting || isCheckingSimilarity}
              >
                <MdArrowBack />
                Cancelar
              </Button>
              <Button
                type='submit'
                className='primary'
                disabled={
                  isSubmitting ||
                  !hasPermission ||
                  isCheckingSimilarity ||
                  isUploadingImages
                }
              >
                {isSubmitting || isCheckingSimilarity ? (
                  <>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    {isCheckingSimilarity
                      ? 'Verificando...'
                      : isEditMode
                        ? 'Atualizando...'
                        : 'Criando...'}
                  </>
                ) : (
                  <>
                    <MdSave />
                    {isEditMode ? 'Atualizar Condomínio' : 'Criar Condomínio'}
                  </>
                )}
              </Button>
            </FormActions>
          </form>

          <SimilarityWarningModal
            isOpen={showSimilarityModal}
            onClose={() => {
              setShowSimilarityModal(false);
              setPendingSubmit(null);
            }}
            onContinue={() => {
              setShowSimilarityModal(false);
              if (pendingSubmit) {
                pendingSubmit();
                setPendingSubmit(null);
              }
            }}
            onCancel={() => {
              setShowSimilarityModal(false);
              setPendingSubmit(null);
            }}
            similarCondominiums={similarCondominiums}
            condominiumName={formData.name}
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default CreateCondominiumPage;
