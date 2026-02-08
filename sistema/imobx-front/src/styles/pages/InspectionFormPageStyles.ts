import styled from 'styled-components';

// Layout Components
export const PageContainer = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;
`;

export const BackButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
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
  white-space: nowrap;
  flex-shrink: 0;
  align-self: flex-start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Form Components
export const FormContainer = styled.div`
  margin-top: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 40px 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 12px;

  &:first-child {
    margin-top: 0;
  }
`;

export const SectionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 32px;
  font-size: 1rem;
  line-height: 1.6;
`;

// Field Components
export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const FieldLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const RequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: bold;
  font-size: 1rem;
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

export const FieldInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const FieldSelect = styled.select`
  width: 100%;
  padding: 16px 50px 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 20px;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  option {
    padding: 12px;
    font-size: 1rem;
    background: ${props => props.theme.colors.cardBackground};
    color: ${props => props.theme.colors.text};
  }

  &::-ms-expand {
    display: none;
  }
`;

export const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  min-height: 120px;
  resize: vertical;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.2)'
        : 'rgba(0, 0, 0, 0.05)'};
  font-family: inherit;

  &:hover {
    border-color: ${props => props.theme.colors.primary}50;
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.08)'};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FieldContainerWithError = styled(FieldContainer)<{
  $hasError?: boolean;
}>`
  ${props =>
    props.$hasError &&
    `
    ${FieldInput} {
      border-color: ${props.theme.colors.error};
      box-shadow: 0 0 0 4px ${props.theme.colors.error}20;
    }
    
    ${FieldLabel} {
      color: ${props.theme.colors.error};
    }
  `}
`;

export const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

// Action Components
export const FormActions = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover:not(:disabled) {
          box-shadow: 0 6px 20px ${props.theme.colors.primary}35;
          transform: translateY(-2px);
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

// Message Components
export const SuccessMessage = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.success}20 0%,
    ${props => props.theme.colors.success}10 100%
  );
  border: 1px solid ${props => props.theme.colors.success}30;
  color: ${props => props.theme.colors.success};
  padding: 20px 24px;
  border-radius: 16px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  box-shadow: 0 4px 15px ${props => props.theme.colors.success}20;

  &::before {
    content: '✅';
    font-size: 1.5rem;
  }
`;

// Responsive adjustments
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

// Legacy compatibility
export const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
`;

// Loading Components
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
`;

// Error Components
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
  text-align: center;
`;

export const ErrorCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 30px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 500px;
  width: 100%;
`;

export const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

export const ErrorTitle = styled.h2`
  color: ${props => props.theme.colors.error};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
`;

export const ErrorMessageText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

export const ErrorButton = styled.button`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)'};
    border-color: ${props => props.theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
  }
`;
