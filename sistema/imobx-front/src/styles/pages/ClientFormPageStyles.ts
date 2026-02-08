import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  /* 📱 MOBILE */
  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  /* 📱 MOBILE */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const BackButton = styled.button`
  background: ${props =>
    props.theme.colors.cardBackground || props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  /* 📱 MOBILE */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

export const FormContainer = styled.form`
  background: transparent;
  border-radius: 0;
  border: none;
  overflow: visible;
`;

export const Section = styled.div`
  padding: 0;
  margin-bottom: 32px;
  border-bottom: none;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SectionDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const FieldContainer = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const RequiredIndicator = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

export const FieldInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid
    ${props => (props.$hasError ? '#EF4444' : props.theme.colors.border)};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#EF4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props => (props.$hasError ? '#FEE2E2' : props.theme.colors.primary)}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FieldSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid
    ${props => (props.$hasError ? '#EF4444' : props.theme.colors.border)};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#EF4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props => (props.$hasError ? '#FEE2E2' : props.theme.colors.primary)}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FieldTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid
    ${props => (props.$hasError ? '#EF4444' : props.theme.colors.border)};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#EF4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props => (props.$hasError ? '#FEE2E2' : props.theme.colors.primary)}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FieldContainerWithError = styled(FieldContainer)``;

export const ErrorMessage = styled.span`
  display: block;
  font-size: 13px;
  color: #ef4444;
  margin-top: 6px;
`;

export const RowContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  user-select: none;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px 0 0 0;
  background: transparent;
  border-top: none;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 0;
    margin-top: 24px;

    button {
      width: 100%;
    }
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary}dd;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.background};
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  padding: 8px 0;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
