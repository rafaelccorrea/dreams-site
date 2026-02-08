import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePasswordReset } from '../../hooks/usePasswordReset';
import type { ResetPasswordFormData } from '../../types/auth';
import {
  IoArrowBack,
  IoEye,
  IoEyeOff,
  IoCheckmarkCircle,
} from 'react-icons/io5';
import {
  LoginContainer,
  LoginCard,
  WelcomeSection,
  WelcomeContent,
  WelcomeTitle,
  WelcomeSubtitle,
  DecorativeElements,
  Circle1,
  Circle2,
  Wave1,
  Wave2,
  SignUpLink,
} from '../../styles/pages/AuthStyles';
import {
  CustomFormSection,
  SuccessContainer,
  AnimationContainer,
  SuccessIcon,
  SuccessTitle,
  SuccessMessage,
  PasswordFieldsContainer,
  PasswordInputContainer,
  InputWrapper,
  Label,
  Input,
  PasswordToggleButton,
  PasswordStrengthIndicator,
} from '../../styles/pages/ResetPasswordStyles';
import { BackButton } from '../../styles/pages/AuthStyles';
import { SubmitButton } from '../forms/SubmitButton';
import { AlertMessage } from '../forms/AlertMessage';

export const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isLoading, alert, resetPassword } = usePasswordReset();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong'
  >('weak');

  // Verificar força da senha
  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) return 'weak';
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    )
      return 'strong';
    return 'medium';
  };

  // Não validar token no frontend - sempre mostrar o formulário
  // A validação real acontece no backend durante o submit

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const resetData: ResetPasswordFormData = {
      token,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    await resetPassword(resetData);
    setIsSubmitted(true);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Sempre mostrar o formulário - validação acontece no backend
  if (isSubmitted && alert?.type === 'success') {
    return (
      <LoginContainer>
        <LoginCard>
          <WelcomeSection>
            <DecorativeElements>
              <Circle1 />
              <Circle2 />
              <Wave1 />
              <Wave2 />
            </DecorativeElements>
            <WelcomeContent>
              <WelcomeTitle>Senha Alterada!</WelcomeTitle>
              <WelcomeSubtitle>
                Sua senha foi redefinida com sucesso
              </WelcomeSubtitle>
            </WelcomeContent>
          </WelcomeSection>

          <CustomFormSection>
            <SuccessContainer>
              <AnimationContainer>
                <div
                  style={{
                    width: '200px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: '50%',
                    fontSize: '80px',
                    color: '#A63126',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <IoCheckmarkCircle />
                </div>
              </AnimationContainer>

              <SuccessIcon>
                <IoCheckmarkCircle size={48} />
              </SuccessIcon>

              <SuccessTitle>Senha Alterada!</SuccessTitle>

              <SuccessMessage>
                Sua senha foi redefinida com sucesso.
              </SuccessMessage>

              <SuccessMessage>
                Agora você pode fazer login com sua nova senha.
              </SuccessMessage>

              <BackButton onClick={handleBackToLogin}>
                <IoArrowBack size={20} />
                Fazer Login
              </BackButton>
            </SuccessContainer>
          </CustomFormSection>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <WelcomeSection>
          <DecorativeElements>
            <Circle1 />
            <Circle2 />
            <Wave1 />
            <Wave2 />
          </DecorativeElements>
          <WelcomeContent>
            <WelcomeTitle>Nova Senha</WelcomeTitle>
            <WelcomeSubtitle>
              Digite sua nova senha para continuar
            </WelcomeSubtitle>
          </WelcomeContent>
        </WelcomeSection>

        <CustomFormSection>
          <AlertMessage
            type={alert?.type || 'info'}
            message={alert?.message || ''}
            onClose={() => {}}
          />

          <form onSubmit={handleSubmit}>
            <BackButton onClick={handleBackToLogin}>
              <IoArrowBack size={20} />
              Voltar ao Login
            </BackButton>

            <PasswordFieldsContainer>
              <PasswordInputContainer>
                <Label htmlFor='password'>Nova Senha</Label>
                <InputWrapper>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    placeholder='Digite sua nova senha'
                    required
                    disabled={isLoading}
                  />
                  <PasswordToggleButton
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <IoEye size={20} />
                    )}
                  </PasswordToggleButton>
                </InputWrapper>
                {formData.password && (
                  <PasswordStrengthIndicator strength={passwordStrength}>
                    {passwordStrength === 'weak' && 'Senha fraca'}
                    {passwordStrength === 'medium' && 'Senha média'}
                    {passwordStrength === 'strong' && 'Senha forte'}
                  </PasswordStrengthIndicator>
                )}
              </PasswordInputContainer>

              <PasswordInputContainer>
                <Label htmlFor='confirmPassword'>Confirmar Senha</Label>
                <InputWrapper>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    placeholder='Confirme sua nova senha'
                    required
                    disabled={isLoading}
                  />
                  <PasswordToggleButton
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <IoEyeOff size={20} />
                    ) : (
                      <IoEye size={20} />
                    )}
                  </PasswordToggleButton>
                </InputWrapper>
              </PasswordInputContainer>
            </PasswordFieldsContainer>

            <SubmitButton
              isLoading={isLoading}
              loadingText='Alterando...'
              defaultText='Alterar Senha'
              disabled={
                !formData.password ||
                !formData.confirmPassword ||
                formData.password !== formData.confirmPassword
              }
            />

            <SignUpLink>
              Lembrou da senha?{' '}
              <button
                type='button'
                onClick={handleBackToLogin}
                style={{
                  color: '#A63126',
                  textDecoration: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                Fazer login
              </button>
            </SignUpLink>
          </form>
        </CustomFormSection>
      </LoginCard>
    </LoginContainer>
  );
};
