import React from 'react';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { AuthThemeWrapper } from '../components/auth/AuthThemeWrapper';

const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthThemeWrapper>
      <ForgotPasswordForm />
    </AuthThemeWrapper>
  );
};

export default ForgotPasswordPage;
