import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)'};
  padding: 40px 24px 80px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  height: auto;
  max-height: 100vh;
  position: relative;
`;

export const Header = styled.div`
  width: 100%;
  margin-bottom: 24px;
  text-align: center;
  position: relative;
`;

export const LogoutButton = styled.button`
  position: absolute;
  top: 0;
  right: 24px;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.errorDark};
    transform: translateY(-2px);
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  font-weight: 400;
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 40px auto;
  padding: 30px 20px 20px 20px; /* Padding top maior para não cortar o badge */

  /* Garantir que todos os cards tenham a mesma altura */
  grid-auto-rows: 1fr;
  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    max-width: 900px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    max-width: 500px;
  }
`;

export const PlanCard = styled.div<{
  $isPopular?: boolean;
  $featureCount: number;
}>`
  background: ${props =>
    props.theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : '#ffffff'};
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 28px 20px 20px 20px;
  border: 2px solid
    ${props =>
      props.$isPopular
        ? props.theme.colors.primary
        : props.theme.colors.border};
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: visible; /* permite badge e elementos clicáveis fora do card */

  height: 100%;
  min-height: auto;

  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 6px 16px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(59, 130, 246, 0.08) inset'
      : '0 6px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.4) inset'};

  /* Efeito de brilho no hover */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 160%;
    height: 160%;
    background: ${props =>
      props.theme.mode === 'dark'
        ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)'};
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none; /* não bloquear cliques (ex.: botão ver mais) */
  }

  &:hover {
    transform: translateY(-4px) scale(1.005);
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 12px 24px rgba(59, 130, 246, 0.22), 0 0 0 1px rgba(59, 130, 246, 0.22) inset'
        : '0 12px 24px rgba(59, 130, 246, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.16) inset'};
    border-color: ${props => props.theme.colors.primary};

    &::before {
      opacity: 1;
    }
  }

  ${props =>
    props.$isPopular &&
    `
    background: ${
      props.theme.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(139, 92, 246, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, #ffffff 50%, rgba(139, 92, 246, 0.03) 100%)'
    };
    box-shadow: 0 10px 24px ${props.theme.colors.primary}35, 
                0 0 0 1px ${props.theme.colors.primary}25 inset;
    transform: scale(1.02);
    z-index: 1;
    
    &:hover {
      transform: scale(1.02) translateY(-4px);
      box-shadow: 0 14px 28px ${props.theme.colors.primary}4d,
                  0 0 0 1px ${props.theme.colors.primary}40 inset;
    }
  `}
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary},
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}60;
  z-index: 10;
`;

export const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  margin: 0 0 6px 0;
`;

export const PlanDescription = styled.p`
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  font-size: 0.8rem;
  line-height: 1.4;
`;

export const PlanPrice = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
  margin-top: 8px;
`;

export const Currency = styled.span`
  font-size: 1rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  font-weight: 600;
`;

export const Price = styled.span`
  font-size: 2rem;
  font-weight: 800;
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(135deg, #60a5fa, #a78bfa)'
      : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

export const Period = styled.span`
  font-size: 0.85rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 3px 0;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  font-size: 0.8rem;
  line-height: 1.4;
`;

export const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: ${props =>
    props.theme.mode === 'dark' ? '#60a5fa' : props.theme.colors.primary};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 0 0 0;
  display: inline-block; /* garante área clicável */
  text-decoration: underline;
  transition: all 0.2s;

  &:hover {
    color: ${props =>
      props.theme.mode === 'dark' ? '#93c5fd' : props.theme.colors.primaryDark};
  }
`;

export const FeatureIcon = styled.span<{ $included: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props =>
    props.$included ? props.theme.colors.success : 'transparent'};
  border: ${props =>
    props.$included
      ? 'none'
      : `1px solid ${props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary}`};
  color: ${props =>
    props.$included
      ? 'white'
      : props.theme.mode === 'dark'
        ? '#ffffff'
        : props.theme.colors.textSecondary};
  font-size: 12px;
`;

export const SelectButton = styled.button<{ $isPopular?: boolean }>`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: auto;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);

  ${props =>
    props.$isPopular
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, #6366f1 50%, ${props.theme.colors.primary} 100%);
    background-size: 200% auto;
    color: white;
    animation: gradientMove 3s ease infinite;
    
    @keyframes gradientMove {
      0%, 100% { background-position: 0% center; }
      50% { background-position: 100% center; }
    }
    
    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }
  `
      : `
    background: ${props.theme.colors.backgroundSecondary};
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.primary};
      color: white;
      border-color: ${props.theme.colors.primary};
      transform: translateY(-2px);
    }
  `}

  &:disabled {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textSecondary};
    border: 2px solid ${props => props.theme.colors.border};
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    opacity: 0.65;
  }
`;

export const PlanUnavailableHint = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 0.75rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  text-align: center;
`;

// Payment Modal Styles
export const PaymentModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const PaymentContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 32px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    max-width: 800px;
  }

  @media (max-width: 768px) {
    max-width: 95vw;
    padding: 24px;
  }

  @media (max-width: 480px) {
    max-width: 100vw;
    padding: 20px;
    border-radius: 12px;
  }
`;

export const PaymentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  margin: 0 0 24px 0;
  text-align: center;
`;

export const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const PaymentMethodButton = styled.button<{
  $selected?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid
    ${props =>
      props.$selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  background: ${props =>
    props.$selected
      ? `${props.theme.colors.primary}15`
      : props.theme.colors.background};
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  opacity: ${props => (props.$disabled ? 0.6 : 1)};
  pointer-events: auto;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}10;
  }
`;

export const CloseButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
    border-color: ${props => props.theme.colors.error};
  }
`;

export const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const FormFieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const FormField = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const RequiredAsterisk = styled.span`
  color: ${props => props.theme.colors.error};
  margin-left: 4px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}22;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.55;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.error};
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButtonSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  display: inline-block;
`;

export const SubmitButton = styled.button<{ $loading?: boolean }>`
  padding: 14px 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    #6366f1 100%
  );
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  opacity: ${props => (props.$loading ? 0.7 : 1)};
  min-width: ${props => (props.$loading ? '180px' : 'auto')};

  &:hover:not(:disabled) {
    transform: ${props => (props.$loading ? 'none' : 'translateY(-2px)')};
    box-shadow: ${props =>
      props.$loading ? 'none' : '0 8px 20px rgba(59, 130, 246, 0.35)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const TrialNotice = styled.div`
  max-width: 960px;
  margin: 0 auto 16px auto;
  padding: 18px 24px;
  border-radius: 14px;
  background: ${props => `${props.theme.colors.primary}10`};
  border: 1px solid ${props => `${props.theme.colors.primary}25`};
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    color: ${props => props.theme.colors.primary};
    font-weight: 700;
  }
`;

export const TrialTag = styled.div`
  position: absolute;
  top: 14px;
  right: 18px;
  background: ${props => `${props.theme.colors.primary}15`};
  color: ${props => props.theme.colors.primary};
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid ${props => `${props.theme.colors.primary}30`};
  z-index: 12;
  pointer-events: none;
`;

export const BetaWarningCard = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
      : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'};
  border: 2px solid
    ${props => (props.theme.mode === 'dark' ? '#3b82f6' : '#3b82f6')};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 4px 12px rgba(59, 130, 246, 0.25)'
      : '0 4px 12px rgba(59, 130, 246, 0.15)'};
  animation: fadeInUp 0.6s ease both;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 14px;
    gap: 10px;
    margin-bottom: 16px;
  }
`;

export const BetaWarningIcon = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
    align-self: center;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const BetaWarningContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BetaWarningTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'dark' ? '#60a5fa' : '#1e40af')};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const BetaWarningMessage = styled.p`
  font-size: 0.9375rem;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#1e3a8a')};
  margin: 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

export const BetaWarningHighlight = styled.div`
  background: ${props =>
    props.theme.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(255, 255, 255, 0.8)'};
  border-left: 4px solid #3b82f6;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 4px;
  font-size: 0.9375rem;
  color: ${props => (props.theme.mode === 'dark' ? '#e2e8f0' : '#1e3a8a')};
  line-height: 1.6;

  strong {
    color: ${props => (props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af')};
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }
`;

export const BetaWarningFooter = styled.p`
  font-size: 0.875rem;
  color: ${props => (props.theme.mode === 'dark' ? '#cbd5e1' : '#1e40af')};
  margin: 0;
  margin-top: 4px;
  font-weight: 500;
  line-height: 1.5;

  strong {
    color: ${props => (props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af')};
  }

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const TrialContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 12px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TrialTitle = styled.h4`
  margin: 0 0 6px 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
`;

export const TrialDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  line-height: 1.4;
`;

export const TrialToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
`;

export const ToggleLabel = styled.label<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 56px;
  height: 28px;
  border-radius: 999px;
  background: ${props =>
    props.$active ? props.theme.colors.primary : props.theme.colors.border};
  transition: background 0.2s ease;
  cursor: pointer;
  padding: 4px;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

export const ToggleSlider = styled.span<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background};
  transition: transform 0.2s ease;
  transform: translateX(${props => (props.$active ? '28px' : '0')});
`;

export const TrialNote = styled.p<{ $active: boolean }>`
  margin: 12px 0 16px;
  font-size: 0.85rem;
  color: ${props =>
    props.$active
      ? props.theme.colors.success
      : props.theme.mode === 'dark'
        ? '#ffffff'
        : props.theme.colors.textSecondary};
  background: ${props =>
    props.$active ? `${props.theme.colors.success}15` : 'transparent'};
  padding: ${props => (props.$active ? '8px 12px' : '0')};
  border-radius: 10px;
`;

export const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 16px 0 8px;
  font-size: 0.85rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
`;

export const TermsCheckbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
`;

export const TermsLabel = styled.label`
  line-height: 1.5;
  cursor: pointer;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
`;

export const TermsLink = styled.a`
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
`;

export const TermsError = styled.span`
  display: block;
  color: ${props => props.theme.colors.error};
  font-size: 0.75rem;
  margin: 0 0 12px 28px;
`;

export const TrialError = styled.div`
  max-width: 960px;
  margin: 0 auto 16px auto;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${props => `${props.theme.colors.error}15`};
  border: 1px solid ${props => `${props.theme.colors.error}30`};
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
`;

export const ConfirmationOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1500;
`;

export const ConfirmationDialog = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 18px;
  max-width: 520px;
  width: 100%;
  padding: 28px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.35);
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
`;

export const ConfirmationTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
`;

export const ConfirmationDescription = styled.div`
  font-size: 0.95rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
  line-height: 1.6;
`;

export const ConfirmationList = styled.ul`
  margin: 0 0 16px 18px;
  padding: 0;

  li {
    margin-bottom: 10px;
  }

  strong {
    color: ${props =>
      props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.text};
  }
`;

export const ConfirmationNote = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${props =>
    props.theme.mode === 'dark' ? '#ffffff' : props.theme.colors.textSecondary};
`;

export const ConfirmationActions = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const ConfirmationButton = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${props =>
    props.$variant === 'secondary'
      ? `1px solid ${props.theme.colors.border}`
      : 'none'};
  background: ${props =>
    props.$variant === 'secondary'
      ? props.theme.colors.backgroundSecondary
      : `linear-gradient(135deg, ${props.theme.colors.primary} 0%, #6366f1 100%)`};
  color: ${props =>
    props.$variant === 'secondary' ? props.theme.colors.text : '#ffffff'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props =>
      props.$variant === 'secondary'
        ? '0 8px 18px rgba(15, 23, 42, 0.15)'
        : '0 10px 24px rgba(59, 130, 246, 0.28)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Adicionar keyframe de animação ao global
export const GlobalAnimations = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
