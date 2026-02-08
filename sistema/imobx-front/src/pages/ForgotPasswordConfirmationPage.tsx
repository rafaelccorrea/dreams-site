import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCheckmarkCircle, IoMail } from 'react-icons/io5';
import { AuthThemeWrapper } from '../components/auth/AuthThemeWrapper';
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
} from '../styles/pages/AuthStyles';
import {
  CustomFormSection,
  SuccessContainer,
  AnimationContainer,
  SuccessIcon,
  SuccessTitle,
  SuccessMessage,
  ButtonContainer,
} from '../styles/pages/ForgotPasswordConfirmationStyles';
import { BackButton } from '../styles/pages/AuthStyles';

const ForgotPasswordConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'seu email';

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = () => {
    navigate('/forgot-password');
  };

  return (
    <AuthThemeWrapper>
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
              <WelcomeTitle>Email Enviado!</WelcomeTitle>
              <WelcomeSubtitle>
                Verifique sua caixa de entrada para continuar
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
                  <IoMail />
                </div>
              </AnimationContainer>

              <SuccessIcon>
                <IoCheckmarkCircle size={48} />
              </SuccessIcon>

              <SuccessTitle>Email Enviado!</SuccessTitle>

              <SuccessMessage>
                Enviamos um link de recuperação para <strong>{email}</strong>
              </SuccessMessage>

              <SuccessMessage>
                Verifique sua caixa de entrada e siga as instruções para
                redefinir sua senha.
              </SuccessMessage>

              <SuccessMessage>
                <strong>Não recebeu o email?</strong> Verifique sua pasta de
                spam ou solicite um novo link.
              </SuccessMessage>

              <ButtonContainer>
                <button
                  onClick={handleResendEmail}
                  style={{
                    background: '#A63126',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 24px',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 6px -1px rgba(166, 49, 38, 0.1)',
                  }}
                >
                  Reenviar Email
                </button>

                <BackButton onClick={handleBackToLogin}>
                  <IoArrowBack size={20} />
                  Voltar ao Login
                </BackButton>
              </ButtonContainer>
            </SuccessContainer>
          </CustomFormSection>
        </LoginCard>
      </LoginContainer>
    </AuthThemeWrapper>
  );
};

export default ForgotPasswordConfirmationPage;
