import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWelcomeMessage } from '../../hooks/useWelcomeMessage';
import { loginFormSchema } from '../../schemas/validation';
import type { LoginFormData } from '../../types/auth';
import styled from 'styled-components';
import { authStorage } from '../../services/authStorage';
import LoadingScreen from '../common/LoadingScreen';
import { TwoFactorVerifyModal } from '../modals/TwoFactorVerifyModal';
import { TwoFactorSetupModal } from '../modals/TwoFactorSetupModal';
import {
  LoginContainer,
  LoginCard,
  WelcomeSection,
  FormSection,
  FormWrapper,
  WelcomeContent,
  WelcomeTitle,
  WelcomeSubtitle,
  FormTitle,
  SignUpLink,
} from '../../styles/pages/AuthStyles';
import {
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
} from '../../styles/forms/FormStyles';
import { EmailField, PasswordField } from '../forms/FormFields';
import { SubmitButton } from '../forms/SubmitButton';
import { AlertMessage } from '../forms/AlertMessage';
import { getAssetPath } from '../../utils/pathUtils';

// Logo centralizada
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;

  img {
    height: 100px;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
    img {
      height: 80px;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
    img {
      height: 64px;
    }
  }
`;

const FormSubtitle = styled.p`
  color: #64748b;
  margin-bottom: 32px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 480px) {
    margin-bottom: 24px;
    font-size: 0.9375rem;
  }
`;

const ForgotPasswordLink = styled.button`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const FormActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  margin-top: -8px;

  @media (max-width: 480px) {
    margin-bottom: 24px;
    gap: 8px;
  }
`;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, alert, login, clearAlert, mfa, mfaSetup } = useAuth();
  const welcomeMessage = useWelcomeMessage();

  const confirmationMessage = location.state?.message;

  const savedEmail = React.useMemo(() => {
    const isRemembered = authStorage.getRememberMeState();
    if (isRemembered) {
      return authStorage.getSavedEmail();
    }
    return '';
  }, []);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData & { rememberMe: boolean }>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: savedEmail,
      password: '',
      rememberMe: authStorage.getRememberMeState(),
    },
  });

  const onSubmit = async (data: LoginFormData & { rememberMe: boolean }) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <>
      <LoadingScreen isVisible={isLoading} text='Entrando...' />
      <LoginContainer>
        <LoginCard>
          <WelcomeSection $bgImage={getAssetPath('login-bg.jpg')}>
            <WelcomeContent>
              <WelcomeTitle>{welcomeMessage.title}</WelcomeTitle>
              <WelcomeSubtitle>{welcomeMessage.subtitle}</WelcomeSubtitle>
            </WelcomeContent>
          </WelcomeSection>

          <FormSection>
            <FormWrapper>
              <LogoContainer>
                <img
                  src={getAssetPath('intellisys.png')}
                  alt='Intellisys Logo'
                />
              </LogoContainer>

              <FormTitle>Entrar</FormTitle>
              <FormSubtitle>
                Acesse sua conta para gerenciar seus imóveis
              </FormSubtitle>

              {confirmationMessage && (
                <AlertMessage type='success' message={confirmationMessage} />
              )}

              {!confirmationMessage && alert && (
                <AlertMessage
                  type={alert.type}
                  message={alert.message}
                  onClose={clearAlert}
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <EmailField
                  id='email'
                  label='Email'
                  placeholder='seu@email.com'
                  error={errors.email}
                  register={registerField}
                  required
                  showIcon={false}
                />

                <PasswordField
                  id='password'
                  label='Senha'
                  placeholder='Sua senha'
                  error={errors.password}
                  register={registerField}
                  required
                  showIcon={false}
                />

                <FormActionsRow>
                  <CheckboxContainer>
                    <Checkbox
                      type='checkbox'
                      id='rememberMe'
                      value='true'
                      {...registerField('rememberMe')}
                    />
                    <CheckboxLabel htmlFor='rememberMe'>
                      Lembrar de mim
                    </CheckboxLabel>
                  </CheckboxContainer>

                  <ForgotPasswordLink
                    type='button'
                    onClick={() => navigate('/forgot-password')}
                  >
                    Esqueceu a senha?
                  </ForgotPasswordLink>
                </FormActionsRow>

                <SubmitButton
                  isLoading={isLoading}
                  loadingText='Entrando...'
                  defaultText='Entrar'
                />

                <SignUpLink>
                  Não tem uma conta?{' '}
                  <button type='button' onClick={() => navigate('/register')}>
                    Cadastre-se
                  </button>
                </SignUpLink>
              </form>
            </FormWrapper>
          </FormSection>
        </LoginCard>

        <TwoFactorVerifyModal
          isOpen={mfa.required}
          onClose={mfa.close}
          onVerify={mfa.verify}
          error={mfa.error}
        />
        <TwoFactorSetupModal
          isOpen={mfaSetup.required}
          onClose={mfaSetup.close}
          onSetup={mfaSetup.start}
          onVerify={async (code: string) => {
            const ok = await mfaSetup.verifyAndLogin(code);
            return ok;
          }}
        />
      </LoginContainer>
    </>
  );
};

export default LoginForm;
