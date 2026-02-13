import React, { useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { SimpleInput } from './SimpleInput';
import { MailIcon, LockIcon } from './InputIcons';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
  icon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  icon,
}) => {
  return (
    <SimpleInput
      id={id}
      label={label}
      type={type}
      placeholder={placeholder}
      error={error}
      register={register}
      required={required}
      icon={icon}
    />
  );
};

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
  showIcon?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  required = false,
  showIcon = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SimpleInput
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      error={error}
      register={register}
      required={required}
      icon={showIcon ? <LockIcon /> : undefined}
      actionButton={{
        icon: showPassword ? 'Ocultar' : 'Mostrar',
        onClick: togglePasswordVisibility,
        title: showPassword ? 'Ocultar senha' : 'Mostrar senha',
      }}
    />
  );
};

interface EmailFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  error?: FieldError;
  register: any;
  required?: boolean;
  showIcon?: boolean;
}

export const EmailField: React.FC<EmailFieldProps> = ({
  id,
  label,
  placeholder,
  error,
  register,
  required = false,
  showIcon = true,
}) => {
  return (
    <SimpleInput
      id={id}
      label={label}
      type='email'
      placeholder={placeholder}
      error={error}
      register={register}
      required={required}
      icon={showIcon ? <MailIcon /> : undefined}
    />
  );
};

// Export the new masked components
export { DocumentField } from './DocumentField';
export { PhoneField } from './PhoneField';
export { NameField } from './NameField';
