import styled from 'styled-components';

export const EditProfileContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background: ${props => props.theme.colors.background};
  transition: background-color 0.3s ease;
`;

export const EditProfileHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 0;
  margin-bottom: 32px;
`;

export const EditProfileHeaderContent = styled.div`
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 0 16px;
  }
`;

export const EditProfileTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EditProfileSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const EditProfileContent = styled.div`
  width: 100%;
  padding: 0 24px 32px 24px;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 0 16px 24px 16px;
  }
`;

export const FormSection = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 0;
  border-bottom: none;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
  letter-spacing: -0.01em;

  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 18px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.colors.primary}60;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 400;
  }
`;

export const TagsSection = styled.div`
  margin-top: 8px;
`;

export const TagsLabel = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  letter-spacing: -0.01em;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 0;
  border-top: none;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 12px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  position: relative;
  overflow: hidden;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.background};
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
`;

export const SaveButton = styled(Button).attrs({ $variant: 'primary' })``;

export const CancelButton = styled(Button).attrs({ $variant: 'secondary' })``;
