import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Layout } from '../components/layout/Layout';
import { companyApi } from '../services/companyApi';
import { toast } from 'react-toastify';
import { formatCNPJ, validateCNPJ, formatCEP } from '../utils/masks';
import { WatermarkUpload } from '../components/company/WatermarkUpload';
import {
  MdArrowBack,
  MdBusiness,
  MdDescription,
  MdLocationOn,
  MdImage,
  MdSearch,
  MdOpenInNew,
  MdWaterDrop,
} from 'react-icons/md';
import {
  PageContainer,
  PageHeader,
  HeaderLeft,
  HeaderRight,
  PageTitle,
  PageSubtitle,
  BackButton,
  ContentGrid,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  SectionDescription,
  SectionContent,
  FormGrid,
  FormGroup,
  Label,
  Input,
  TextArea,
  Button,
  ButtonGroup,
  ErrorText,
  LoadingOverlay,
  LoadingSpinner,
  AvatarUploadContainer,
  AvatarPreview,
  AvatarPlaceholder,
  UploadButton,
  HiddenInput,
  CEPGroup,
  CEPButton,
} from '../styles/pages/CreateCompanyPageStyles';

const schema = yup.object({
  name: yup.string().required('Nome da empresa é obrigatório'),
  cnpj: yup
    .string()
    .required('CNPJ é obrigatório')
    .test('cnpj-valid', 'CNPJ inválido', value => {
      if (!value) return false;
      return validateCNPJ(value);
    }),
  corporateName: yup.string().required('Razão social é obrigatória'),
  address: yup.string().required('Endereço é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  state: yup
    .string()
    .required('Estado é obrigatório')
    .max(2, 'Use a sigla do estado (ex: SP)'),
  zipCode: yup.string().required('CEP é obrigatório'),
  phone: yup.string().optional(),
  email: yup.string().email('E-mail inválido').optional(),
  description: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

const EditCompanyPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);
  const [watermark, setWatermark] = useState<string | null>(null);
  const logoPreviewUrlRef = useRef<string | null>(null);
  const [logoPreviewKey, setLogoPreviewKey] = useState(0); // Para forçar atualização da imagem

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Carregar dados da empresa
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const company = await companyApi.getCompanyById(id);
        reset({
          name: company.name || '',
          cnpj: company.cnpj || '',
          corporateName: company.corporateName || '',
          address: company.address || '',
          city: company.city || '',
          state: company.state || '',
          zipCode: company.zipCode || '',
          phone: company.phone || '',
          email: company.email || '',
          description: company.description || '',
        });
        // Revogar URL anterior se existir
        if (logoPreviewUrlRef.current) {
          URL.revokeObjectURL(logoPreviewUrlRef.current);
          logoPreviewUrlRef.current = null;
        }
        setLogoPreview(company.logo || company.logoUrl || null);
        setWatermark(company.watermark || null);
      } catch (e: any) {
        toast.error(e?.message || 'Erro ao carregar empresa');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, reset]);

  // Cleanup: revogar URL quando componente desmontar
  useEffect(() => {
    return () => {
      if (logoPreviewUrlRef.current) {
        URL.revokeObjectURL(logoPreviewUrlRef.current);
      }
    };
  }, []);

  const handleBack = () => navigate(-1);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const input = event.target;

    // Sempre limpar o input primeiro para evitar problemas de cache
    if (input) {
      // Guardar o valor atual antes de limpar
      const currentValue = input.value;

      // Limpar imediatamente
      input.value = '';

      // Se não houver arquivo, retornar
      if (!file) {
        return;
      }

      // Verificar se o arquivo mudou comparando nome e tamanho
      // Isso ajuda a evitar problemas quando o mesmo arquivo é selecionado novamente
      if (
        logoFile &&
        logoFile.name === file.name &&
        logoFile.size === file.size &&
        logoFile.lastModified === file.lastModified
      ) {
        // É o mesmo arquivo, não fazer nada
        return;
      }
    } else if (!file) {
      return;
    }

    // Validar tamanho
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    // Revogar URL anterior se existir (pode ser de uma seleção anterior)
    if (logoPreviewUrlRef.current) {
      try {
        URL.revokeObjectURL(logoPreviewUrlRef.current);
      } catch (e) {
        // Ignorar erro se URL já foi revogada
      }
      logoPreviewUrlRef.current = null;
    }

    // Limpar preview anterior e arquivo antes de criar novo
    setLogoPreview(null);
    setLogoFile(null);

    // Criar nova URL do objeto imediatamente
    try {
      const previewUrl = URL.createObjectURL(file);
      logoPreviewUrlRef.current = previewUrl;

      // Atualizar estado de forma síncrona para evitar race conditions
      setLogoPreview(previewUrl);
      setLogoFile(file);
      setLogoPreviewKey(prev => prev + 1); // Forçar atualização da imagem
    } catch (error) {
      console.error('Erro ao criar preview:', error);
      toast.error('Erro ao processar imagem. Tente novamente.');
      setLogoPreview(null);
      setLogoFile(null);
    }
  };

  const searchCEP = async () => {
    const cep = watch('zipCode')?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      toast.error('CEP inválido. Digite os 8 dígitos.');
      return;
    }
    setIsSearchingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      setValue('address', data.logradouro || '');
      setValue('city', data.localidade || '');
      setValue('state', data.uf || '');
      toast.success('Endereço encontrado!');
    } catch {
      toast.error('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setIsSearchingCEP(false);
    }
  };

  const onSubmit = async (data: FormData, event?: React.BaseSyntheticEvent) => {
    // Prevenir submit automático
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!id) return;
    try {
      setIsLoading(true);

      // Se há um novo arquivo de logo, fazer upload primeiro
      let logoUrl = logoPreview;
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        const uploadResult = await companyApi.uploadLogo(id, formData);
        logoUrl = uploadResult.logoUrl;

        // Revogar URL do preview local após upload
        if (logoPreviewUrlRef.current) {
          URL.revokeObjectURL(logoPreviewUrlRef.current);
          logoPreviewUrlRef.current = null;
        }
      }

      const payload = { ...data, logo: logoUrl || undefined };
      await companyApi.updateCompany(id, payload);
      toast.success('Empresa atualizada com sucesso!');
      navigate('/profile');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao atualizar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
            <p>Salvando alterações...</p>
          </LoadingOverlay>
        )}

        <PageHeader>
          <HeaderLeft>
            <PageTitle>Editar Empresa</PageTitle>
            <PageSubtitle>
              Ajuste as informações da empresa. Dados soltos, próximos às
              margens como nas outras telas.
            </PageSubtitle>
          </HeaderLeft>
          <HeaderRight>
            {id && (
              <BackButton
                onClick={() =>
                  window.open(
                    `https://www.intellisys.com.br/imobiliaria/${id}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                style={{
                  marginRight: '12px',
                  background: 'var(--color-background-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background =
                    'var(--color-background-secondary)';
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <MdOpenInNew size={20} />
                Ver no Site
              </BackButton>
            )}
            <BackButton onClick={handleBack}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </HeaderRight>
        </PageHeader>

        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          onKeyDown={e => {
            // Prevenir submit ao pressionar Enter em qualquer campo (exceto textarea)
            if (
              e.key === 'Enter' &&
              e.target instanceof HTMLInputElement &&
              e.target.type !== 'submit' &&
              e.target.type !== 'textarea'
            ) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <ContentGrid>
            <Section>
              <SectionHeader>
                <SectionIcon $color='#3b82f6'>
                  <MdDescription />
                </SectionIcon>
                <div>
                  <SectionTitle>Identificação</SectionTitle>
                  <SectionDescription>
                    Informações básicas da empresa
                  </SectionDescription>
                </div>
              </SectionHeader>
              <SectionContent>
                <AvatarUploadContainer>
                  <AvatarPreview>
                    {logoPreview ? (
                      <img
                        key={logoPreviewKey}
                        src={logoPreview}
                        alt='Logo preview'
                        onError={e => {
                          console.error('Erro ao carregar preview do logo');
                          // Se houver erro, limpar preview
                          if (logoPreviewUrlRef.current) {
                            URL.revokeObjectURL(logoPreviewUrlRef.current);
                            logoPreviewUrlRef.current = null;
                          }
                          setLogoPreview(null);
                          setLogoFile(null);
                        }}
                      />
                    ) : (
                      <AvatarPlaceholder>
                        <MdImage size={48} />
                        <span>Logo da Empresa</span>
                      </AvatarPlaceholder>
                    )}
                  </AvatarPreview>
                  <div>
                    <UploadButton
                      type='button'
                      onClick={() =>
                        document.getElementById('logo-input')?.click()
                      }
                    >
                      <MdImage size={20} />
                      {logoPreview ? 'Alterar Logo' : 'Adicionar Logo'}
                    </UploadButton>
                    <HiddenInput
                      id='logo-input'
                      type='file'
                      accept='image/*'
                      onChange={handleLogoChange}
                    />
                  </div>
                </AvatarUploadContainer>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor='name'>Nome da Empresa *</Label>
                    <Input
                      id='name'
                      type='text'
                      placeholder='Ex: Dream Keys Filial São Paulo'
                      {...register('name')}
                      $hasError={!!errors.name}
                    />
                    {errors.name && (
                      <ErrorText>{errors.name.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor='cnpj'>CNPJ *</Label>
                    <Input
                      id='cnpj'
                      type='text'
                      placeholder='00.000.000/0000-00'
                      maxLength={18}
                      value={watch('cnpj') || ''}
                      onChange={e =>
                        setValue('cnpj', formatCNPJ(e.target.value), {
                          shouldValidate: true,
                        })
                      }
                      $hasError={!!errors.cnpj}
                    />
                    {errors.cnpj && (
                      <ErrorText>{errors.cnpj.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor='corporateName'>Razão Social *</Label>
                    <Input
                      id='corporateName'
                      type='text'
                      {...register('corporateName')}
                      $hasError={!!errors.corporateName}
                    />
                    {errors.corporateName && (
                      <ErrorText>{errors.corporateName.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor='email'>E-mail</Label>
                    <Input
                      id='email'
                      type='email'
                      {...register('email')}
                      $hasError={!!errors.email}
                    />
                    {errors.email && (
                      <ErrorText>{errors.email.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor='phone'>Telefone</Label>
                    <Input
                      id='phone'
                      type='text'
                      placeholder='(00) 00000-0000'
                      {...register('phone')}
                      $hasError={!!errors.phone}
                    />
                    {errors.phone && (
                      <ErrorText>{errors.phone.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor='description'>Descrição</Label>
                    <TextArea
                      id='description'
                      rows={3}
                      {...register('description')}
                      $hasError={!!errors.description}
                    />
                    {errors.description && (
                      <ErrorText>{errors.description.message}</ErrorText>
                    )}
                  </FormGroup>
                </FormGrid>
              </SectionContent>
            </Section>

            <Section>
              <SectionHeader>
                <SectionIcon $color='#10b981'>
                  <MdLocationOn />
                </SectionIcon>
                <div>
                  <SectionTitle>Localização</SectionTitle>
                  <SectionDescription>
                    Endereço e informações de localização
                  </SectionDescription>
                </div>
              </SectionHeader>
              <SectionContent>
                <FormGrid>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor='zipCode'>CEP *</Label>
                    <CEPGroup>
                      <Input
                        id='zipCode'
                        type='text'
                        placeholder='00000-000'
                        maxLength={9}
                        value={watch('zipCode') || ''}
                        onChange={e =>
                          setValue('zipCode', formatCEP(e.target.value), {
                            shouldValidate: true,
                          })
                        }
                        $hasError={!!errors.zipCode}
                        style={{ flex: 1 }}
                      />
                      <CEPButton
                        type='button'
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          searchCEP();
                        }}
                        disabled={isSearchingCEP}
                      >
                        <MdSearch size={20} />
                        {isSearchingCEP ? 'Buscando...' : 'Buscar CEP'}
                      </CEPButton>
                    </CEPGroup>
                    {errors.zipCode && (
                      <ErrorText>{errors.zipCode.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor='address'>Endereço *</Label>
                    <Input
                      id='address'
                      type='text'
                      {...register('address')}
                      $hasError={!!errors.address}
                    />
                    {errors.address && (
                      <ErrorText>{errors.address.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor='city'>Cidade *</Label>
                    <Input
                      id='city'
                      type='text'
                      {...register('city')}
                      $hasError={!!errors.city}
                    />
                    {errors.city && (
                      <ErrorText>{errors.city.message}</ErrorText>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor='state'>Estado *</Label>
                    <Input
                      id='state'
                      type='text'
                      maxLength={2}
                      {...register('state')}
                      $hasError={!!errors.state}
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.state && (
                      <ErrorText>{errors.state.message}</ErrorText>
                    )}
                  </FormGroup>
                </FormGrid>
              </SectionContent>
            </Section>

            {id && (
              <Section id='watermark-section'>
                <SectionHeader>
                  <SectionIcon $color='#06b6d4'>
                    <MdWaterDrop />
                  </SectionIcon>
                  <div>
                    <SectionTitle>Marca d'Água</SectionTitle>
                    <SectionDescription>
                      Configure a marca dágua que será aplicada nas imagens das
                      propriedades
                    </SectionDescription>
                  </div>
                </SectionHeader>
                <SectionContent>
                  <WatermarkUpload
                    companyId={id}
                    currentWatermark={watermark}
                    onUploadSuccess={watermarkUrl => {
                      setWatermark(watermarkUrl);
                    }}
                    disabled={isLoading}
                  />
                </SectionContent>
              </Section>
            )}
          </ContentGrid>

          <ButtonGroup>
            <Button
              type='button'
              $variant='secondary'
              onClick={handleBack}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type='submit' $variant='primary' disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </form>
      </PageContainer>
    </Layout>
  );
};

export default EditCompanyPage;
