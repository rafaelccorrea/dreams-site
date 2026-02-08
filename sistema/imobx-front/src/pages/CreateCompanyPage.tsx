import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Layout } from '../components/layout/Layout';
import {
  formatCNPJ,
  validateCNPJ,
  formatCEP,
  maskPhoneAuto,
} from '../utils/masks';
import { companyApi } from '../services/companyApi';
import { useCompany } from '../hooks/useCompany';
import { useSubscriptionContext } from '../contexts/SubscriptionContext';
import { toast } from 'react-toastify';
import {
  MdArrowBack,
  MdDescription,
  MdLocationOn,
  MdImage,
  MdSearch,
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

type FormData = {
  name: string;
  cnpj: string;
  corporateName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  description?: string;
};

const CreateCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCompanies, companies } = useCompany();
  const { subscriptionStatus, subscriptionLimits, hasAccess, accessReason } =
    useSubscriptionContext();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  // Verificar limite de empresas
  const currentCompanyCount = companies.length;
  const maxCompanies = subscriptionStatus?.plan?.maxCompanies || 1;
  const canCreateMoreCompanies = currentCompanyCount < maxCompanies;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: '',
      cnpj: '',
      corporateName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      description: '',
    },
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

      // Preencher campos automaticamente
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

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Validar se pode criar empresa usando dados já carregados do contexto
      // Isso evita fazer uma nova chamada à API que pode falhar

      // Verificar acesso básico
      if (hasAccess === false) {
        toast.error(accessReason || 'Você não tem acesso para criar empresas');
        setIsLoading(false);
        return;
      }

      // Verificar limite de empresas usando dados do contexto
      const companyLimits = subscriptionLimits?.companies;
      if (companyLimits) {
        if (!companyLimits.canCreate) {
          const reason =
            companyLimits.remaining === 0
              ? `Limite de ${companyLimits.max} empresas atingido`
              : 'Não é possível criar mais empresas no momento';
          toast.error(reason);
          setIsLoading(false);
          return;
        }
      } else {
        // Fallback: verificar usando dados legados
        if (!canCreateMoreCompanies) {
          toast.error(`Limite de ${maxCompanies} empresas atingido`);
          setIsLoading(false);
          return;
        }
      }

      // Preparar dados da empresa com formatação correta
      // Formatar telefone: garantir formato (XX) XXXXX-XXXX
      let formattedPhone = '';
      if (data.phone) {
        const cleanPhone = data.phone.replace(/\D/g, '');
        if (cleanPhone.length >= 10) {
          // Usar máscara automática que detecta fixo ou celular
          formattedPhone = maskPhoneAuto(data.phone);
        } else {
          formattedPhone = data.phone;
        }
      }

      // Formatar CEP: garantir formato XXXXX-XXX (8 dígitos)
      let formattedZipCode = '';
      if (data.zipCode) {
        const cleanZipCode = data.zipCode.replace(/\D/g, '');
        if (cleanZipCode.length === 8) {
          // CEP completo, formatar normalmente
          formattedZipCode = formatCEP(cleanZipCode);
        } else if (cleanZipCode.length > 0 && cleanZipCode.length < 8) {
          // CEP incompleto - completar com zeros à direita
          const paddedZipCode = cleanZipCode.padEnd(8, '0');
          formattedZipCode = formatCEP(paddedZipCode);
        } else if (cleanZipCode.length > 8) {
          // CEP com mais de 8 dígitos - pegar apenas os 8 primeiros
          formattedZipCode = formatCEP(cleanZipCode.substring(0, 8));
        } else {
          // Se não tiver dígitos, usar o valor original
          formattedZipCode = data.zipCode;
        }
      }

      const companyData = {
        name: data.name,
        cnpj: data.cnpj,
        corporateName: data.corporateName,
        email: data.email || '', // Email pode ser opcional no schema mas a API pode exigir
        phone: formattedPhone,
        address: data.address,
        city: data.city,
        state: data.state.toUpperCase(), // Garantir que estado está em maiúsculo
        zipCode: formattedZipCode,
        description: data.description,
        logo: logoFile || undefined, // Enviar o arquivo File, não a preview
      };

      // Criar empresa usando o método correto
      await companyApi.createCompany(companyData);

      toast.success('Empresa criada com sucesso!');
      await refreshCompanies();

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Erro ao criar empresa:', err);
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Erro ao criar empresa';
      toast.error(errorMessage);
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
            <p>Criando empresa...</p>
          </LoadingOverlay>
        )}

        <PageHeader>
          <HeaderLeft>
            <PageTitle>Nova Empresa</PageTitle>
            <PageSubtitle>
              Preencha as informações para criar uma nova empresa
            </PageSubtitle>
          </HeaderLeft>
          <HeaderRight>
            <BackButton onClick={handleBack}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </HeaderRight>
        </PageHeader>

        <form onSubmit={handleSubmit(onSubmit as any)}>
          <ContentGrid>
            {/* Seção de Identificação */}
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
                {/* Avatar Upload */}
                <AvatarUploadContainer>
                  <AvatarPreview>
                    {logoPreview ? (
                      <img src={logoPreview} alt='Logo preview' />
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
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginTop: '8px',
                      }}
                    >
                      PNG, JPG ou WEBP (máx. 5MB)
                    </p>
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
                      onChange={e => {
                        const formatted = formatCNPJ(e.target.value);
                        setValue('cnpj', formatted, { shouldValidate: true });
                      }}
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
                      placeholder='Ex: Dream Keys Filial São Paulo Ltda'
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
                      placeholder='contato@empresa.com'
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
                      maxLength={15}
                      value={watch('phone') || ''}
                      onChange={e => {
                        const formatted = maskPhoneAuto(e.target.value);
                        setValue('phone', formatted, { shouldValidate: true });
                      }}
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
                      placeholder='Descrição opcional da empresa... (máx. 300 caracteres)'
                      maxLength={300}
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

            {/* Seção de Localização */}
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
                        onChange={e => {
                          const formatted = formatCEP(e.target.value);
                          setValue('zipCode', formatted, {
                            shouldValidate: true,
                          });
                        }}
                        $hasError={!!errors.zipCode}
                        style={{ flex: 1 }}
                      />
                      <CEPButton
                        type='button'
                        onClick={searchCEP}
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
                      placeholder='Rua, Avenida, etc.'
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
                      placeholder='Ex: São Paulo'
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
                      placeholder='Ex: SP'
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
          </ContentGrid>

          {/* Botões de ação */}
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
              {isLoading ? 'Criando...' : 'Criar Empresa'}
            </Button>
          </ButtonGroup>
        </form>
      </PageContainer>
    </Layout>
  );
};

export default CreateCompanyPage;
