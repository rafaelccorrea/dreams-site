import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  padding: clamp(12px, 2vw, 24px) clamp(12px, 3vw, 32px) clamp(20px, 3vw, 36px);
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: clamp(24px, 5vw, 40px);
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

export const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  text-align: left;
`;

export const InfoBanner = styled.div`
  margin-bottom: 16px;
  padding: 14px 18px;
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

export const BannerActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 36px);
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vw, 32px);
`;

export const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 20px);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => `${props.theme.colors.primary}15`};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(12px, 2vw, 20px);
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.cardBackground};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}20`};
  }

  &:hover {
    border-color: ${props => props.theme.colors.borderLight};
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 36px);
`;

export const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 4px;
  display: block;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  margin-top: clamp(16px, 3vw, 24px);
  padding-top: clamp(16px, 3vw, 24px);
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.textSecondary};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.hover};
      border-color: ${props.theme.colors.borderLight};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
