import styled from 'styled-components';
import {
  MdExpandMore,
  MdExpandLess,
  MdAdd,
  MdDelete,
  MdSave,
} from 'react-icons/md';

// Container principal
export const FichaVendaContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 0;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* Permitir scroll mesmo com overflow hidden no body */
  height: auto;

  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 5px;

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

// Header
export const PageHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  border-radius: 0;
  padding: 32px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 1024px) {
    padding: 28px;
    margin-bottom: 28px;
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    margin-bottom: 20px;
    gap: 16px;
  }
`;

export const PageHeaderTitle = styled.div`
  flex: 1;
  min-width: 0;
`;

export const PageHeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  margin: 0;
  opacity: 0.95;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

// Seção colapsável
export const CollapsibleSection = styled.div<{ $isExpanded: boolean }>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: 2px solid
    ${props =>
      props.$isExpanded
        ? props.theme.colors.primary
        : props.theme.colors.border};
  border-bottom: 2px solid
    ${props =>
      props.$isExpanded
        ? props.theme.colors.primary
        : props.theme.colors.border};
  margin-bottom: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: none;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-top-color: ${props => props.theme.colors.primary};
    border-bottom-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  cursor: pointer;
  user-select: none;
  background: ${props => props.theme.colors.backgroundSecondary};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
  }

  @media (max-width: 1024px) {
    padding: 22px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const SectionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

export const SectionIcon = styled.div`
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 12px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    font-size: 1.5rem;
    width: 44px;
    height: 44px;
  }
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 1024px) {
    font-size: 1.375rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary}10;
  color: ${props => props.theme.colors.primary};
  transition: transform 0.3s ease;
  transform: ${props =>
    props.$isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

// Conteúdo da seção
export const SectionContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => (props.$isExpanded ? '5000px' : '0')};
  overflow: hidden;
  transition:
    max-height 0.4s ease,
    padding 0.3s ease;
  padding: ${props => (props.$isExpanded ? '32px' : '0 32px')};

  @media (max-width: 1024px) {
    padding: ${props => (props.$isExpanded ? '28px' : '0 28px')};
  }

  @media (max-width: 768px) {
    padding: ${props => (props.$isExpanded ? '24px' : '0 24px')};
  }

  @media (max-width: 480px) {
    padding: ${props => (props.$isExpanded ? '16px' : '0 16px')};
  }
`;

// Grid de formulário
export const FormGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(
      ${props => Math.min(props.$columns || 2, 2)},
      1fr
    );
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

// Grupo de formulário
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
`;

export const FormLabel = styled.label`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RequiredIndicator = styled.span`
  color: ${props => props.theme.colors.error};
  font-weight: 700;
`;

export const FormInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  line-height: 1.5;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }

  @media (max-width: 1024px) {
    padding: 12px 14px;
    font-size: 0.9375rem;
  }
`;

export const FormTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }

  @media (max-width: 1024px) {
    padding: 11px 14px;
    font-size: 0.9375rem;
    min-height: 90px;
  }
`;

export const FormSelect = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid
    ${props =>
      props.$hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    padding: 11px 14px;
    font-size: 0.9375rem;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.error};
  margin-top: 4px;
`;

export const HelperText = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

// Checkbox e Radio
export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  padding: 12px;
  border-radius: 12px;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

export const CheckboxInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

export const CheckboxLabel = styled.span`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

// Botões
export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'success';
}>`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryDark};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
          border: 2px solid ${props.theme.colors.border};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.hover};
            border-color: ${props.theme.colors.primary};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error};
          color: white;
          &:hover:not(:disabled) {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px ${props.theme.colors.error}40;
          }
        `;
      case 'success':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryDark};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  @media (max-width: 1024px) {
    padding: 11px 22px;
    font-size: 0.9375rem;
    gap: 7px;
  }
`;

// Distribuição de comissão
export const ComissaoItem = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 1024px) {
    padding: 18px;
    margin-bottom: 14px;
  }
`;

export const ComissaoItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ComissaoItemTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const RemoveButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }
`;

export const AddButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border: 2px dashed ${props => props.theme.colors.primary};
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Footer com botões de ação
export const FormFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: ${props => props.theme.colors.cardBackground};
  border-top: 2px solid ${props => props.theme.colors.border};
  padding: 24px;
  margin-top: 32px;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  border-radius: 0;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    padding: 22px;
    margin-top: 28px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
    margin-top: 24px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-top: 20px;
    gap: 12px;
  }
`;

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    button {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

/** Grupo de botões secundários do footer (Baixar PDF, Compartilhar, Limpar) */
export const FooterSecondaryGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    order: 2;
  }
`;

/** Grupo dos botões principais do footer (Finalizar + Salvar) */
export const FooterPrimaryGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    order: 1;
    gap: 10px;
  }
`;

/** Botão de destaque para "Finalizar ficha" */
export const FooterHighlightButton = styled(Button)`
  padding: 14px 28px;
  font-size: 1.0625rem;
  font-weight: 700;
  box-shadow: 0 4px 14px ${props => props.theme.colors.primary}50;
  border: 2px solid ${props => props.theme.colors.primary};

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}60;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 24px;
    font-size: 1rem;
  }
`;

// Badge de porcentagem total
export const PercentageBadge = styled.div<{ $isValid: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props =>
    props.$isValid
      ? `${props.theme.colors.primary}20`
      : `${props.theme.colors.error}20`};
  color: ${props =>
    props.$isValid ? props.theme.colors.primary : props.theme.colors.error};
  border: 1px solid
    ${props =>
      props.$isValid ? props.theme.colors.primary : props.theme.colors.error};
`;

// Valor calculado
export const CalculatedValue = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}5 100%
  );
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    padding: 14px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const CalculatedLabel = styled.span`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const CalculatedAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};

  @media (max-width: 1024px) {
    font-size: 1.375rem;
  }
`;

// Divider
export const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${props => props.theme.colors.border};
  margin: 24px 0;
`;

// Alert/Info box
export const InfoBox = styled.div<{
  $type?: 'info' | 'warning' | 'success' | 'error';
}>`
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  ${props => {
    switch (props.$type) {
      case 'warning':
        return `
          background: ${props.theme.colors.warning}20;
          border: 2px solid ${props.theme.colors.warning};
          color: ${props.theme.colors.warning};
        `;
      case 'success':
        return `
          background: ${props.theme.colors.primary}20;
          border: 2px solid ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.error}20;
          border: 2px solid ${props.theme.colors.error};
          color: ${props.theme.colors.error};
        `;
      default:
        /* info e default: primary (sem azul/verde no layout das fichas) */
        return `
          background: ${props.theme.colors.primary}20;
          border: 2px solid ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
        `;
    }
  }}

  @media (max-width: 1024px) {
    padding: 14px;
    margin-bottom: 20px;
    gap: 10px;
  }
`;

export const InfoBoxText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  flex: 1;
`;

// Overlay e modal de acesso negado / ficha não encontrada (bloqueia toda a página)
export const BlockingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 24px;
  box-sizing: border-box;
`;

export const BlockingModalCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  max-width: 480px;
  width: 100%;
  padding: 32px;
  text-align: center;
  border: 2px solid ${props => props.theme.colors.border};

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

export const BlockingModalIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

export const BlockingModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const BlockingModalMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0 0 24px;
`;

// Loading spinner animation
export const LoadingSpinner = styled.div`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

// Cards indicativos
export const IndicativeCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
`;

export const IndicativeCard = styled.div<{
  $color: 'blue' | 'green' | 'orange' | 'red';
}>`
  background: ${props => props.theme.colors.cardBackground};
  border-left: 4px solid
    ${props => {
      switch (props.$color) {
        case 'blue':
          return props.theme.colors.primary;
        case 'green':
          return props.theme.colors.success;
        case 'orange':
          return props.theme.colors.warning;
        case 'red':
          return props.theme.colors.error;
        default:
          return props.theme.colors.primary;
      }
    }};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 1024px) {
    padding: 18px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CardIcon = styled.div<{
  $color: 'blue' | 'green' | 'orange' | 'red';
}>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: ${props => {
    switch (props.$color) {
      case 'blue':
        return `${props.theme.colors.primary}20`;
      case 'green':
        return `${props.theme.colors.success}20`;
      case 'orange':
        return `${props.theme.colors.warning}20`;
      case 'red':
        return `${props.theme.colors.error}20`;
      default:
        return `${props.theme.colors.primary}20`;
    }
  }};
  color: ${props => {
    switch (props.$color) {
      case 'blue':
        return props.theme.colors.primary;
      case 'green':
        return props.theme.colors.success;
      case 'orange':
        return props.theme.colors.warning;
      case 'red':
        return props.theme.colors.error;
      default:
        return props.theme.colors.primary;
    }
  }};
`;

export const CardValue = styled.div<{
  $color: 'blue' | 'green' | 'orange' | 'red';
}>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => {
    switch (props.$color) {
      case 'blue':
        return props.theme.colors.primary;
      case 'green':
        return props.theme.colors.success;
      case 'orange':
        return props.theme.colors.warning;
      case 'red':
        return props.theme.colors.error;
      default:
        return props.theme.colors.primary;
    }
  }};
  margin: 0;
`;

// Seção de fichas anteriores
export const FichasAnterioresSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  border: 2px solid ${props => props.theme.colors.border};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 20px;
    margin-bottom: 28px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 24px;
    border-radius: 8px;
  }
`;

export const FichasAnterioresHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const FichasAnterioresTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

export const FichasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FichaItem = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  cursor: pointer;
  gap: 16px;
  flex-wrap: wrap;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    text-align: left;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const FichaItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const FichaItemNumber = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const FichaItemDate = styled.span`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const FichaItemValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  margin-right: 16px;
`;

export const FichaItemActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

// Botão de buscar CEP
export const CepSearchButton = styled.button`
  padding: 14px 20px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  height: 48px;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    border-color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.theme.colors.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 1024px) {
    padding: 12px 18px;
    font-size: 0.84375rem;
    height: 46px;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.8125rem;
  }
`;

// Autocomplete/Datalist
export const AutocompleteWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const AutocompleteList = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  list-style: none;
  padding: 8px 0;
  margin: 0;
`;

export const AutocompleteItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:active {
    background: ${props => props.theme.colors.hover};
  }
`;

export const HistoricoButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  margin-top: 4px;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

// Modal de Confirmação
export const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(4px);
  overflow-y: auto;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 12px;
    align-items: flex-start;
    padding-top: 24px;
  }
`;

export const ModalContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin: auto 20px;

  @media (max-width: 1024px) {
    max-width: 90%;
    max-height: 85vh;
    margin: auto 16px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    margin: auto 12px;
    max-height: 88vh;
    border-radius: 12px;
  }
`;

export const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 1024px) {
    padding: 20px;
    gap: 12px;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;

  svg {
    color: ${props => props.theme.colors.warning};
    font-size: 1.75rem;
  }

  @media (max-width: 1024px) {
    font-size: 1.375rem;
    gap: 10px;

    svg {
      font-size: 1.5rem;
    }
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 1.5rem;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 1024px) {
    padding: 20px;
  }
`;

export const ModalSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SummaryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const SummaryLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SummaryValue = styled.span`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

export const ModalWarning = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.warning}20;
  border: 2px solid ${props => props.theme.colors.warning};
  border-radius: 12px;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    color: ${props => props.theme.colors.warning};
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const ModalWarningText = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.5;
`;

export const ModalFooter = styled.div`
  padding: 24px;
  border-top: 2px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 1024px) {
    padding: 20px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

export const ModalButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 140px;

  ${props => {
    if (props.$variant === 'secondary') {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.hover};
        }
      `;
    }
    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.colors.error};
        color: white;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.errorDark};
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${props.theme.colors.error}40;
        }
      `;
    }
    return `
      background: ${props.theme.colors.primary};
      color: white;
      
      &:hover:not(:disabled) {
        background: ${props.theme.colors.primaryDark};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${props.theme.colors.primary}40;
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// --- Responsivo: área de conteúdo e contra propostas (mobile-first) ---
export const PageContentWrap = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px 80px 16px;

  @media (min-width: 480px) {
    padding: 0 24px 100px 24px;
  }

  @media (min-width: 768px) {
    padding: 0 32px 120px 32px;
  }
`;

export const ContraPropostaSection = styled.div`
  background: var(--color-card-background);
  border-radius: 24px;
  padding: 20px 16px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);

  @media (min-width: 480px) {
    padding: 24px 20px;
  }

  @media (min-width: 768px) {
    padding: 24px 32px;
  }
`;

export const ContraPropostaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ContraPropostaTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);

  @media (min-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const ContraPropostaList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ContraPropostaItemCard = styled.li`
  font-size: 0.9375rem;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background-secondary, #f8f9fa);

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 12px 16px;
    gap: 8px;
  }
`;

export const ContraPropostaItemMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 8px;

  strong {
    font-weight: 600;
  }
`;

export const ContraPropostaItemMeta = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  margin-left: 0;

  @media (min-width: 768px) {
    margin-left: 8px;
  }
`;

export const ContraPropostaStatusBadge = styled.span<{ $status: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  align-self: flex-start;
  ${p =>
    p.$status === 'aprovada'
      ? 'background: var(--color-success); color: white;'
      : p.$status === 'recusada'
        ? 'background: var(--color-error); color: white;'
        : 'background: var(--color-background-secondary); color: var(--color-text-secondary);'}
`;

export const ContraPropostaItemActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  @media (max-width: 767px) {
    width: 100%;
    flex-direction: column;

    button {
      width: 100%;
      min-height: 44px;
      justify-content: center;
      padding: 12px 16px;
      font-size: 0.875rem;
    }
  }
`;
