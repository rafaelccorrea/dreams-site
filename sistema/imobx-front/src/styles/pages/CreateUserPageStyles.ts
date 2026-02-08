import styled from 'styled-components';

// Container Principal
export const Container = styled.div`
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

// Botão Voltar
export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(-4px);
  }
`;

// Botão Voltar Alinhado à Direita
export const BackButtonRight = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    transform: translateX(4px);
  }
`;

// Header
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

// Cards/Sections
export const Section = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const SectionHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

// Form Elements
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RequiredIndicator = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

export const Input = styled.input`
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

export const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.8125rem;
  margin-top: -4px;
`;

// Info Box
export const InfoBox = styled.div`
  background: ${props => props.theme.colors.primary}15;
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

// Permissions Grid
export const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

export const PermissionCategory = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const CategoryIcon = styled.span`
  font-size: 1.5rem;
`;

export const CategoryTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const PermissionItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
  }

  input[type='checkbox'] {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export const PermissionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const PermissionName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

export const PermissionDescription = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Actions
export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 0;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;

    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryHover || props.theme.colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: transparent;
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};

    &:hover:not(:disabled) {
      background: ${props.theme.colors.cardBackground};
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Aliases para manter compatibilidade
export const PageContainer = Container;
export const PageContent = Container;
export const PageHeader = Header;
export const PageTitleContainer = Header;
export const PageTitle = Title;
export const PageSubtitle = Subtitle;
export const FormContainer = Section;
export const FieldContainer = styled(FormGroup)`
  margin-bottom: 20px;
`;
export const FieldLabel = Label;
export const FieldInput = Input;
export const FieldSelect = Select;
export const FieldContainerWithError = styled(FormGroup)<{
  $hasError?: boolean;
}>`
  ${props =>
    props.$hasError &&
    `
    ${Input}, ${Select} {
      border-color: #ef4444;
    }
  `}
`;
export const RowContainer = FormGrid;
export const SectionTitle2 = SectionTitle;
