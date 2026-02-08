import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { AuthThemeWrapper } from '../components/auth/AuthThemeWrapper';

const RegisterPage: React.FC = () => {
  return (
    <AuthThemeWrapper>
      <RegisterForm />
    </AuthThemeWrapper>
  );
};

export default RegisterPage;
