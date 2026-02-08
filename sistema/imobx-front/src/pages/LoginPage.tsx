import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { AuthThemeWrapper } from '../components/auth/AuthThemeWrapper';

const LoginPage: React.FC = () => {
  return (
    <AuthThemeWrapper>
      <LoginForm />
    </AuthThemeWrapper>
  );
};

export default LoginPage;
