import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  MdSave,
  MdBusiness,
  MdLocationOn,
  MdEmail,
  MdClear,
} from 'react-icons/md';
import { companyApi } from '../services/companyApi';
import { authApi } from '../services/api';
import { authStorage } from '../services/authStorage';
import { useSubscriptionContext } from '../contexts/SubscriptionContext';
import { AddressFields } from '../components/forms/AddressFields';
import { LogoUpload } from '../components/company/LogoUpload';
import { Layout } from '../components/layout/Layout';
import { LottieLoading } from '../components/common/LottieLoading';
import { formatCNPJ, validateCNPJ } from '../utils/masks';
import Lottie from 'lottie-react';
import { getAssetPath } from '../utils/pathUtils';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import { getNavigationUrl } from '../utils/pathUtils';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  InfoBanner,
  BannerActions,
  ContentContainer,
  Card,
  SectionWrapper,
  CardHeader,
  CardIcon,
  CardTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Form,
  ErrorMessage,
  ButtonGroup,
  Button,
  LoadingSpinner,
} from '../styles/pages/CreateFirstCompanyPageStyles';

// Styled component para o overlay de loading com backdrop blur
const LoadingOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  display: ${props => (props.$isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: ${props => (props.$isVisible ? 'auto' : 'none')};
`;

const LottieWrapper = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

interface CreateCompanyData {
  name: string;
  cnpj: string;
  corporateName: string;
  email: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Schema de validação para criação de empresa
const createCompanySchema = yup.object({
  name: yup
    .string()
    .required('Nome da empresa é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cnpj: yup
    .string()
    .required('CNPJ é obrigatório')
    .matches(
      /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[0-9]{2}$/,
      'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX (12 caracteres alfanuméricos + 2 dígitos verificadores)'
    )
    .test(
      'cnpj-valid',
      'CNPJ inválido (dígitos verificadores incorretos)',
      value => {
        if (!value) return false;
        return validateCNPJ(value);
      }
    ),
  corporateName: yup
    .string()
    .required('Razão social é obrigatória')
    .min(2, 'Razão social deve ter pelo menos 2 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (XX) XXXXX-XXXX'
    ),
  zipCode: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 00000-000'),
  street: yup.string().required('Rua é obrigatória'),
  number: yup.string().required('Número é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  state: yup
    .string()
    .required('Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres'),
});

const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const CreateFirstCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearKey, setClearKey] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);
  const { loadSubscriptionStatus, loadPlans, subscriptionStatus } =
    useSubscriptionContext();
  const { theme } = useTheme();

  // Carregar animação Lottie quando o componente montar ou quando o tema mudar
  useEffect(() => {
    const loadLottie = async () => {
      try {
        // No modo dark, usar home-icon-light.json
        // No modo light, usar loadind-home.json
        const fileName =
          theme === 'dark' ? 'home-icon-light.json' : 'loadind-home.json';
        let response = await fetch(getAssetPath(fileName));

        // Fallback: se o arquivo específico não existir, tentar o outro
        if (!response.ok) {
          const fallbackFileName =
            theme === 'dark' ? 'loadind-home.json' : 'home-icon-light.json';
          response = await fetch(getAssetPath(fallbackFileName));
        }

        if (response.ok) {
          const data = await response.json();
          setLottieAnimation(data);
        }
      } catch (error) {
        console.error('Erro ao carregar animação Lottie:', error);
      }
    };
    loadLottie();
  }, [theme]); // Recarregar quando o tema mudar
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [allowAccess, setAllowAccess] = useState<boolean | null>(null);
  const [hasExistingCompany, setHasExistingCompany] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCompanyData>({
    resolver: yupResolver(createCompanySchema),
    defaultValues: {
      name: '',
      cnpj: '',
      corporateName: '',
      email: '',
      phone: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
    mode: 'onChange',
  });

  // Acesso direto à URL create-first-company: redirecionar para verifying-access para não exibir esta URL durante a verificação
  useEffect(() => {
    if (!location.state?.fromVerifying) {
      navigate('/verifying-access', { replace: true });
    }
  }, [location.state?.fromVerifying, navigate]);

  useEffect(() => {
    if (location.state?.fromVerifying) {
      setAllowAccess(true);
      setHasExistingCompany(false);
      setCheckingSubscription(false);
      return;
    }
    // Acesso direto: a verificação ocorre em /verifying-access, não rodar aqui
    if (!location.state?.fromVerifying) return;

    let isMounted = true;

    const grantAccess = (hasCompany: boolean) => {
      if (!isMounted) return;
      setAllowAccess(true);
      setHasExistingCompany(hasCompany);

      const desiredPath = hasCompany ? '/dashboard' : '/create-first-company';
      if (location.pathname !== desiredPath) {
        navigate(desiredPath, { replace: true });
      }
    };

    const denyAccess = (redirectPath: string) => {
      if (!isMounted) return;
      setAllowAccess(false);
      setHasExistingCompany(false);
      navigate(redirectPath, { replace: true });
    };

    /** Resolve se o usuário tem empresa (API) e, se tiver, garante company selecionada no localStorage. */
    const resolveHasCompany = async (): Promise<boolean> => {
      const selectedId = localStorage.getItem('dream_keys_selected_company_id');
      if (selectedId) return true;
      try {
        const companies = await companyApi.getCompanies();
        if (companies && companies.length > 0) {
          localStorage.setItem(
            'dream_keys_selected_company_id',
            companies[0].id
          );
          return true;
        }
      } catch {
        // ignore
      }
      return false;
    };

    const ensureSubscription = async () => {
      try {
        // Verificar se o usuário é owner antes de chamar APIs de assinatura
        const user = authStorage.getUserData();
        if (!user || user.owner !== true) {
          // Usuário não é owner, não deve acessar APIs de assinatura
          // CORREÇÃO: Não navegar para /dashboard se não tem empresa, isso causa loop!
          // Apenas permitir acesso à página (o useInitializationFlow vai lidar com a navegação)
          console.log(
            '⚠️ CreateFirstCompanyPage: Usuário não é owner, não pode verificar assinatura'
          );
          setAllowAccess(true);
          setHasExistingCompany(false);
          setCheckingSubscription(false);
          return;
        }

        let hasActive = subscriptionStatus?.hasActiveSubscription ?? false;

        if (!hasActive) {
          try {
            await subscriptionService.getMySubscriptionUsage();
            hasActive = true;
            const hasCompany = await resolveHasCompany();
            grantAccess(hasCompany);
            return;
          } catch (error: any) {
            // CORREÇÃO: Capturar erro em diferentes formatos
            // Pode ser erro HTTP (error.response) ou Error simples (error.message)
            const status =
              error?.response?.status || error?.status || error?.statusCode;
            const message = (
              error?.response?.data?.message ||
              error?.message ||
              error?.response?.data?.error ||
              ''
            ).toLowerCase();

            // Log detalhado do erro para debug
            console.log(
              '🔍 CreateFirstCompanyPage: Erro ao buscar assinatura:',
              {
                status,
                message,
                errorType: error?.constructor?.name,
                error: error,
                errorResponse: error?.response,
                errorData: error?.response?.data,
              }
            );

            // CORREÇÃO: Se é um Error simples (não HTTP) e menciona assinatura, redirecionar
            if (
              !status &&
              error?.message &&
              typeof error.message === 'string'
            ) {
              const errorMessage = error.message.toLowerCase();
              if (
                errorMessage.includes('assinatura') ||
                errorMessage.includes('subscription') ||
                errorMessage.includes('nenhuma assinatura') ||
                errorMessage.includes('no subscription')
              ) {
                console.log(
                  '⚠️ CreateFirstCompanyPage: Error simples indica falta de assinatura, redirecionando para /subscription-plans'
                );
                denyAccess('/subscription-plans');
                return;
              }
            }

            // CORREÇÃO CRÍTICA: Verificar assinatura PRIMEIRO (antes de empresa)
            // Se 404 e mensagem menciona assinatura/subscription, redirecionar para planos
            if (
              status === 404 &&
              (message.includes('assinatura') ||
                message.includes('subscription') ||
                message.includes('nenhuma assinatura') ||
                message.includes('no subscription') ||
                message.includes('subscription not found'))
            ) {
              console.log(
                '⚠️ CreateFirstCompanyPage: 404 - Nenhuma assinatura encontrada, redirecionando para /subscription-plans'
              );
              denyAccess('/subscription-plans');
              return;
            }

            // CORREÇÃO: Se 404 e mensagem menciona empresa (mas não assinatura), permitir criar empresa
            if (
              status === 404 &&
              message.includes('empresa') &&
              !message.includes('assinatura')
            ) {
              console.log(
                '✅ CreateFirstCompanyPage: 404 - sem empresa, permitindo criar'
              );
              const hasCompany = await resolveHasCompany();
              grantAccess(hasCompany);
              return;
            }

            // CORREÇÃO: Se 401, redirecionar para gerenciamento
            if (status === 401) {
              console.log(
                '⚠️ CreateFirstCompanyPage: 401 - Não autorizado, redirecionando para /subscription-management'
              );
              denyAccess('/subscription-management');
              return;
            }

            // CORREÇÃO: Se 404 genérico (sem mensagem específica), assumir que não tem assinatura
            if (status === 404) {
              console.log(
                '⚠️ CreateFirstCompanyPage: 404 genérico, assumindo sem assinatura, redirecionando para /subscription-plans'
              );
              denyAccess('/subscription-plans');
              return;
            }

            // CORREÇÃO: Se status é undefined mas há erro, pode ser que o erro tenha sido transformado
            // Verificar se há alguma indicação de erro de assinatura no objeto de erro
            if (!status && error) {
              const errorString = JSON.stringify(error).toLowerCase();
              if (
                errorString.includes('assinatura') ||
                errorString.includes('subscription') ||
                errorString.includes('404')
              ) {
                console.log(
                  '⚠️ CreateFirstCompanyPage: Erro sem status mas indica falta de assinatura, redirecionando para /subscription-plans'
                );
                denyAccess('/subscription-plans');
                return;
              }
            }

            // CORREÇÃO: Se não entrou em nenhum caso acima, continuar para verificar via checkSubscriptionAccess
            console.log(
              '⚠️ CreateFirstCompanyPage: Erro não tratado no catch, continuando verificação:',
              { status, message, error }
            );
          }
        }

        const accessInfo = await subscriptionService.checkSubscriptionAccess();
        const hasCompanyResolved = await resolveHasCompany();
        const missingCompanyAssociation =
          !hasCompanyResolved &&
          typeof accessInfo.reason === 'string' &&
          accessInfo.reason.toLowerCase().includes('empresa');

        if (accessInfo.subscription || missingCompanyAssociation) {
          grantAccess(hasCompanyResolved);
          return;
        }

        if (accessInfo.hasAccess) {
          grantAccess(hasCompanyResolved);
          return;
        }

        if (isMounted) {
          setAllowAccess(false);
          setHasExistingCompany(false);
          const status = accessInfo.status as string;
          if (status === 'none') {
            navigate('/subscription-plans', { replace: true });
          } else {
            navigate('/subscription-management', { replace: true });
          }
        }
      } catch (error) {
        console.error(
          '❌ Erro ao validar assinatura antes de criar empresa:',
          error
        );
        if (isMounted) {
          setAllowAccess(false);
          setHasExistingCompany(false);
          navigate('/subscription-management', { replace: true });
        }
      } finally {
        if (isMounted) {
          setCheckingSubscription(false);
        }
      }
    };

    ensureSubscription();

    return () => {
      isMounted = false;
    };
  }, [
    subscriptionStatus?.hasActiveSubscription,
    navigate,
    location.pathname,
    location.state?.fromVerifying,
  ]);

  if (!location.state?.fromVerifying) return null;

  if (checkingSubscription) {
    return (
      <LottieLoading
        message='Verificando assinatura...'
        subtitle='Aguarde enquanto confirmamos seu acesso.'
      />
    );
  }

  if (hasExistingCompany) {
    return <Navigate to='/dashboard' replace />;
  }

  if (allowAccess === false) {
    return null;
  }

  // Função para limpar todos os campos
  const handleClearAll = () => {
    reset();
    setValue('zipCode', '');
    setValue('street', '');
    setValue('number', '');
    setValue('complement', '');
    setValue('neighborhood', '');
    setValue('city', '');
    setValue('state', '');
    setError(null);
    setClearKey(prev => prev + 1);
    // console.log('🧹 Todos os campos limpos');
  };

  const addressValues = watch([
    'zipCode',
    'street',
    'number',
    'complement',
    'neighborhood',
    'city',
    'state',
  ]);

  const isFormDisabled = isLoading || hasExistingCompany;

  // Handle address changes from AddressFields component
  const handleAddressChange = (field: string, value: string) => {
    setValue(field as keyof CreateCompanyData, value);
  };

  const onSubmit = async (data: CreateCompanyData) => {
    if (hasExistingCompany) {
      setError('Você já possui uma empresa cadastrada.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // console.log('🏢 Criando empresa:', data);
      // Transformar dados para o formato esperado pela API
      const companyData = {
        name: data.name,
        cnpj: data.cnpj,
        corporateName: data.corporateName,
        email: data.email,
        phone: data.phone,
        address: `${data.street}, ${data.number}${data.complement ? ', ' + data.complement : ''}`,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        logo: logoFile || undefined, // Enviar File ao invés de URL/base64
      };

      // Criar empresa usando a API real
      const newCompany = await companyApi.createCompany(companyData);

      // console.log('✅ Empresa criada com sucesso:', newCompany);
      // Atualizar token para incluir companyId
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        try {
          // console.log('🔄 Atualizando token com nova empresa...');
          const tokenResponse = await authApi.refreshToken(refreshToken);
          // console.log('🔄 Resposta do refresh token:', tokenResponse);
          authStorage.saveAuthData(
            tokenResponse,
            authStorage.shouldRememberUser()
          );
          // console.log('✅ Token atualizado com sucesso');
          // Salvar ID da empresa criada no localStorage para seleção automática
          localStorage.setItem('dream_keys_selected_company_id', newCompany.id);
          // console.log('🏢 Empresa selecionada automaticamente:', newCompany.id);
          // Verificar se o companyId foi incluído
        } catch (tokenError) {
          console.warn(
            '⚠️ Erro ao atualizar token, mas empresa foi criada:',
            tokenError
          );
        }
      } else {
        console.warn('⚠️ Nenhum refresh token encontrado');
      }

      // Carregar subscription após criar empresa
      try {
        await loadSubscriptionStatus();
        await loadPlans();
        // console.log('✅ Subscription carregada após criação da empresa');
      } catch (subError) {
        console.warn(
          '⚠️ Erro ao carregar subscription após criação da empresa:',
          subError
        );
      }

      // Aguardar um momento para garantir que o contexto seja atualizado
      setTimeout(() => {
        // console.log('🚀 Redirecionando para dashboard com empresa carregada...');
        // Forçar reload da página para garantir que o contexto seja atualizado
        window.location.href = getNavigationUrl('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error('❌ Erro ao criar empresa:', err);

      let errorMessage = 'Erro ao criar empresa. Tente novamente.';

      if (err.response?.status === 400) {
        errorMessage = 'Dados inválidos. Verifique os campos.';
      }
      // REMOVIDO: Verificação de CNPJ duplicado (409) - permitindo criar empresas com mesmo CNPJ como no Asaas
      // else if (err.response?.status === 409) {
      //   errorMessage = 'CNPJ já está em uso.';
      // }
      else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>Criar Primeira Empresa</PageTitle>
          <PageSubtitle>
            Para usar o sistema, você precisa criar uma empresa primeiro
          </PageSubtitle>
        </PageHeader>

        {hasExistingCompany && (
          <InfoBanner>
            <strong>Você já possui uma empresa cadastrada.</strong>
            <span>
              Para criar uma nova empresa principal, entre em contato com o
              suporte ou utilize os fluxos de gestão de empresas. Enquanto isso,
              você pode acessar as informações atuais no dashboard ou gerenciar
              sua assinatura.
            </span>
            <BannerActions>
              <Button
                type='button'
                $variant='primary'
                onClick={() => navigate('/dashboard')}
              >
                Ir para o dashboard
              </Button>
              <Button
                type='button'
                $variant='secondary'
                onClick={() => navigate('/subscription-management')}
              >
                Gerenciar assinatura
              </Button>
            </BannerActions>
          </InfoBanner>
        )}

        <ContentContainer>
          <Card>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Seção: Informações Básicas */}
              <SectionWrapper>
                <CardHeader>
                  <CardIcon>
                    <MdBusiness />
                  </CardIcon>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome da Empresa *</Label>
                    <Input
                      {...register('name')}
                      placeholder='Ex: Imobiliária ABC'
                      $hasError={!!errors.name}
                      disabled={isFormDisabled}
                    />
                    {errors.name && (
                      <ErrorMessage>{errors.name.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>CNPJ *</Label>
                    <Input
                      name='cnpj'
                      placeholder='CK.LZH.YDS/0001-91 ou 32.686.738/0001-40'
                      $hasError={!!errors.cnpj}
                      disabled={isFormDisabled}
                      maxLength={18}
                      value={watch('cnpj') || ''}
                      onChange={e => {
                        const formatted = formatCNPJ(e.target.value);
                        setValue('cnpj', formatted, { shouldValidate: true });
                      }}
                    />
                    {errors.cnpj && (
                      <ErrorMessage>{errors.cnpj.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Razão Social *</Label>
                    <Input
                      {...register('corporateName')}
                      placeholder='Ex: ABC Imobiliária Ltda'
                      $hasError={!!errors.corporateName}
                      disabled={isFormDisabled}
                    />
                    {errors.corporateName && (
                      <ErrorMessage>
                        {errors.corporateName.message}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>

                {/* Logo Upload */}
                <FormGroup style={{ marginTop: '8px' }}>
                  <LogoUpload
                    currentLogo={logoUrl}
                    onLogoChange={setLogoUrl}
                    onFileChange={setLogoFile}
                    isCreating={true}
                    disabled={isFormDisabled}
                  />
                </FormGroup>
              </SectionWrapper>

              {/* Seção: Contato */}
              <SectionWrapper>
                <CardHeader>
                  <CardIcon>
                    <MdEmail />
                  </CardIcon>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <FormGrid>
                  <FormGroup>
                    <Label>Email da Empresa *</Label>
                    <Input
                      {...register('email')}
                      type='email'
                      placeholder='Ex: contato@imobiliariaabc.com'
                      $hasError={!!errors.email}
                      disabled={isFormDisabled}
                    />
                    {errors.email && (
                      <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Telefone *</Label>
                    <Input
                      {...register('phone')}
                      placeholder='Ex: (11) 3333-4444'
                      $hasError={!!errors.phone}
                      disabled={isFormDisabled}
                      maxLength={15}
                      onChange={e => {
                        const formatted = formatPhone(e.target.value);
                        setValue('phone', formatted);
                      }}
                    />
                    {errors.phone && (
                      <ErrorMessage>{errors.phone.message}</ErrorMessage>
                    )}
                  </FormGroup>
                </FormGrid>
              </SectionWrapper>

              {/* Seção: Endereço */}
              <SectionWrapper>
                <CardHeader>
                  <CardIcon>
                    <MdLocationOn />
                  </CardIcon>
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <AddressFields
                  key={clearKey}
                  values={{
                    zipCode: addressValues[0] || '',
                    street: addressValues[1] || '',
                    number: addressValues[2] || '',
                    complement: addressValues[3] || '',
                    neighborhood: addressValues[4] || '',
                    city: addressValues[5] || '',
                    state: addressValues[6] || '',
                  }}
                  onChange={handleAddressChange}
                  errors={{
                    zipCode: errors.zipCode?.message || '',
                    street: errors.street?.message || '',
                    number: errors.number?.message || '',
                    complement: errors.complement?.message || '',
                    neighborhood: errors.neighborhood?.message || '',
                    city: errors.city?.message || '',
                    state: errors.state?.message || '',
                  }}
                  required={true}
                />
              </SectionWrapper>

              {error && (
                <ErrorMessage
                  style={{ textAlign: 'center', marginTop: '16px' }}
                >
                  {error}
                </ErrorMessage>
              )}

              <ButtonGroup>
                <Button
                  type='button'
                  $variant='secondary'
                  onClick={handleClearAll}
                  disabled={isFormDisabled}
                >
                  <MdClear />
                  Limpar Tudo
                </Button>
                <Button
                  type='submit'
                  $variant='primary'
                  disabled={isFormDisabled}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Criando Empresa...
                    </>
                  ) : hasExistingCompany ? (
                    <>
                      <MdBusiness />
                      Empresa já cadastrada
                    </>
                  ) : (
                    <>
                      <MdSave />
                      Criar Empresa
                    </>
                  )}
                </Button>
              </ButtonGroup>
            </Form>
          </Card>
        </ContentContainer>
      </PageContainer>

      {/* Modal de Loading com Lottie e fundo borrado */}
      {isLoading && lottieAnimation && (
        <LoadingOverlay $isVisible={isLoading}>
          <LottieWrapper>
            <Lottie
              animationData={lottieAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </LottieWrapper>
        </LoadingOverlay>
      )}
    </Layout>
  );
};

export default CreateFirstCompanyPage;
