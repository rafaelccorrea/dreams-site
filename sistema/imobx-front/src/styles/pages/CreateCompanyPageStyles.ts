import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 32px;
  width: 100%;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    gap: 12px;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const BackButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 32px;
`;

export const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SectionIcon = styled.div<{ $color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
  transition: all 0.3s ease;

  ${Section}:hover & {
    transform: scale(1.05);
    background: ${props => props.$color}25;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

export const SectionContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: block;
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#ef4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props => (props.$hasError ? '#ef444420' : props.theme.colors.primary)}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid
    ${props => (props.$hasError ? '#ef4444' : props.theme.colors.border)};
  border-radius: 12px;
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props =>
      props.$hasError ? '#ef4444' : props.theme.colors.primary};
    box-shadow: 0 0 0 3px
      ${props => (props.$hasError ? '#ef444420' : props.theme.colors.primary)}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  display: block;
  margin-top: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

export const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 150px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
    color: white;
    box-shadow: 0 4px 16px ${props.theme.colors.primary}30;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: ${props.theme.colors.background};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary}10;
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
      transform: translateY(-2px);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  gap: 16px;

  p {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

export const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid white;
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

// Avatar Upload Components
export const AvatarUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  gap: 8px;

  span {
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    padding: 0 8px;
  }
`;

export const UploadButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

// CEP Components
export const CEPGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CEPButton = styled.button`
  padding: 14px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Legacy exports for backward compatibility
export const FormContainer = styled.div``;
export const ErrorMessage = styled.div``;
export const SuccessMessage = styled.div``;
