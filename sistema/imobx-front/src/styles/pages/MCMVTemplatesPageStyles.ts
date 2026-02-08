import styled from 'styled-components';
import type { TemplateType } from '../../types/mcmv';

export const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 20px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const TemplateCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 8px;
  }
`;

export const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }
`;

export const TemplateName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    width: 100%;
  }
`;

export const TypeBadge = styled.span<{ $type: string | TemplateType }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.$type) {
      case 'email':
        return '#3b82f6';
      case 'whatsapp':
        return '#10b981';
      case 'sms':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  }};
  color: white;
  margin-left: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    margin-left: 0;
    font-size: 11px;
    padding: 4px 10px;
  }
`;

export const TemplateDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 10px;
  }
`;

export const TemplateContent = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  max-height: 100px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 12px;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
    max-height: 80px;
    margin-bottom: 12px;
  }
`;

export const VariablesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

export const VariableTag = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
`;

export const TemplateActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'danger' | 'secondary';
}>`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { opacity: 0.9; }
      `;
    }
    return `
      background: ${props.theme.colors.cardBackground};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover { background: ${props.theme.colors.background}; }
    `;
  }}

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
    font-size: 13px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 32px 12px;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    width: 100%;
    border-radius: 8px;
    max-height: 95vh;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 16px; /* Evita zoom no iOS */
    min-height: 100px;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 20px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover { opacity: 0.9; }
  `
      : `
    background: ${props.theme.colors.cardBackground};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    &:hover { background: ${props.theme.colors.background}; }
  `}

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
  }
`;

export const HelpText = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 4px 0 0 0;

  @media (max-width: 480px) {
    font-size: 11px;
    line-height: 1.4;
  }
`;
