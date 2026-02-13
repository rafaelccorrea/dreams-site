import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRegisterMessage } from '../../hooks/useRegisterMessage';
import { registerSchema } from '../../schemas/validation';
import type { RegisterFormData } from '../../types/auth';
import styled from 'styled-components';
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
  EmailField,
  PasswordField,
  DocumentField,
  PhoneField,
  NameField,
} from '../forms/FormFields';
import { SubmitButton } from '../forms/SubmitButton';
import { AlertMessage } from '../forms/AlertMessage';
import EmailConfirmationModal from '../modals/EmailConfirmationModal';
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
  }

  @media (max-width: 768px) {
    margin-bottom: 30px;
    img {
      height: 80px;
    }
  }
`;

const FormSubtitle = styled.p`
  color: #64748b;
  margin-bottom: 32px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
`;

const PasswordHint = styled.p<{ $hasError?: boolean }>`
  margin-top: 4px;
  margin-bottom: 16px;
  font-size: 0.8rem;
  font-family: 'Poppins', sans-serif;
  color: ${({ $hasError }) => ($hasError ? '#f97373' : '#94a3b8')};
`;

// FormSection com scroll para a página de cadastro
const ScrollableFormSection = styled(FormSection)`
  overflow-y: auto;
  justify-content: flex-start;
  padding-top: 60px;
  padding-bottom: 60px;

  @media (max-width: 992px) {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`;

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    alert,
    emailConfirmationModal,
    register,
    clearAlert,
    closeEmailConfirmationModal,
  } = useAuth();
  const welcomeMessage = useRegisterMessage();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data: any) => {
    register(data as RegisterFormData);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <WelcomeSection $bgImage={getAssetPath('login-bg.jpg')}>
          <WelcomeContent>
            <WelcomeTitle>{welcomeMessage.title}</WelcomeTitle>
            <WelcomeSubtitle>{welcomeMessage.subtitle}</WelcomeSubtitle>
          </WelcomeContent>
        </WelcomeSection>

        <ScrollableFormSection>
          <FormWrapper>
            <LogoContainer>
              <img src={getAssetPath('intellisys.png')} alt='Intellisys Logo' />
            </LogoContainer>

            <FormTitle>Cadastrar</FormTitle>
            <FormSubtitle>
              Crie sua conta para começar a gerenciar seus imóveis
            </FormSubtitle>

            <AlertMessage
              type={alert?.type || 'info'}
              message={alert?.message || ''}
              onClose={clearAlert}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <NameField
                id='name'
                label='Nome Completo'
                placeholder='Seu nome completo'
                error={errors.name}
                register={registerField}
                required
              />

              <EmailField
                id='email'
                label='Email'
                placeholder='seu@email.com'
                error={errors.email}
                register={registerField}
                required
              />

              <DocumentField
                id='document'
                label='CPF/CNPJ'
                placeholder='000.000.000-00 ou 00.000.000/0000-00'
                error={errors.document}
                register={registerField}
                required
              />

              <PhoneField
                id='phone'
                label='Telefone'
                placeholder='(11) 99999-9999'
                error={errors.phone}
                register={registerField}
              />

              <PasswordField
                id='password'
                label='Senha'
                placeholder='Digite a senha'
                error={errors.password}
                register={registerField}
                required
              />

              <PasswordHint $hasError={!!errors.password}>
                Sua senha deve ter pelo menos 8 caracteres, incluindo letra
                maiúscula, letra minúscula, número e caractere especial.
              </PasswordHint>

              <PasswordField
                id='confirmPassword'
                label='Confirmar Senha'
                placeholder='Digite a senha novamente'
                error={errors.confirmPassword}
                register={registerField}
                required
              />

              <SubmitButton
                isLoading={isLoading}
                loadingText='Criando conta...'
                defaultText='Criar Conta'
              />
            </form>

            <SignUpLink>
              Já tem uma conta?{' '}
              <button type='button' onClick={() => navigate('/login')}>
                Faça login aqui
              </button>
            </SignUpLink>
          </FormWrapper>
        </ScrollableFormSection>
      </LoginCard>

      <EmailConfirmationModal
        isOpen={emailConfirmationModal.isOpen}
        onClose={closeEmailConfirmationModal}
        email={emailConfirmationModal.email}
        redirectToLogin={true}
      />
    </LoginContainer>
  );
};

export default RegisterForm;
