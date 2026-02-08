import React from 'react';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';
import { AuthThemeWrapper } from '../components/auth/AuthThemeWrapper';

const ResetPasswordPage: React.FC = () => {
  return (
    <AuthThemeWrapper>
      <ResetPasswordForm />
    </AuthThemeWrapper>
  );
};

export default ResetPasswordPage;
