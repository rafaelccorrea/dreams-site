import React from 'react';
import styled from 'styled-components';
import {
  MdLock,
  MdClose,
  MdTrendingUp,
  MdContactSupport,
  MdStar,
  MdCheckCircle,
  MdSecurity,
  MdSpeed,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ModuleUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  moduleDescription?: string;
}

export const ModuleUpgradeModal: React.FC<ModuleUpgradeModalProps> = ({
  isOpen,
  onClose,
  moduleName,
  moduleDescription,
}) => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  if (!isOpen) return null;

  // CORREÇÃO: Apenas admin e master podem ver planos
  const canViewPlans = user?.role === 'admin' || user?.role === 'master';

  const handleUpgrade = () => {
    onClose();
    navigate('/subscription-management');
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <IconWrapper>
            <LockIcon>
              <MdLock size={48} />
            </LockIcon>
            <ShineEffect />
          </IconWrapper>

          <Title>Módulo Bloqueado</Title>

          <ModuleBadge>
            <MdStar size={16} />
            {moduleName}
          </ModuleBadge>

          <Description>
            O módulo <strong>{moduleName}</strong> não está disponível no plano
            atual da empresa.
            {moduleDescription && (
              <>
                <br />
                <br />
                {moduleDescription}
              </>
            )}
          </Description>

          {canViewPlans ? (
            // Admin/Master - pode fazer upgrade
            <UpgradeSection>
              <UpgradeTitle>🚀 Desbloqueie Recursos Avançados</UpgradeTitle>
              <BenefitsGrid>
                <BenefitCard>
                  <BenefitIcon $color='#10b981'>
                    <MdSpeed />
                  </BenefitIcon>
                  <BenefitText>
                    <BenefitTitle>Performance</BenefitTitle>
                    <BenefitDesc>Recursos otimizados</BenefitDesc>
                  </BenefitText>
                </BenefitCard>

                <BenefitCard>
                  <BenefitIcon $color='#3b82f6'>
                    <MdSecurity />
                  </BenefitIcon>
                  <BenefitText>
                    <BenefitTitle>Segurança</BenefitTitle>
                    <BenefitDesc>Controle total</BenefitDesc>
                  </BenefitText>
                </BenefitCard>

                <BenefitCard>
                  <BenefitIcon $color='#8b5cf6'>
                    <MdTrendingUp />
                  </BenefitIcon>
                  <BenefitText>
                    <BenefitTitle>Crescimento</BenefitTitle>
                    <BenefitDesc>Escale seu negócio</BenefitDesc>
                  </BenefitText>
                </BenefitCard>

                <BenefitCard>
                  <BenefitIcon $color='#f59e0b'>
                    <MdCheckCircle />
                  </BenefitIcon>
                  <BenefitText>
                    <BenefitTitle>Suporte</BenefitTitle>
                    <BenefitDesc>Assistência premium</BenefitDesc>
                  </BenefitText>
                </BenefitCard>
              </BenefitsGrid>
            </UpgradeSection>
          ) : (
            // Usuário comum - deve contatar admin
            <ContactSection>
              <ContactIcon>
                <MdContactSupport size={32} />
              </ContactIcon>
              <ContactTitle>Solicite Acesso</ContactTitle>
              <ContactText>
                Entre em contato com o <strong>administrador da empresa</strong>{' '}
                para solicitar acesso a este módulo.
              </ContactText>
              <ContactSteps>
                <Step>
                  <StepNumber>1</StepNumber>
                  <StepText>Converse com seu administrador</StepText>
                </Step>
                <Step>
                  <StepNumber>2</StepNumber>
                  <StepText>Solicite o upgrade do plano</StepText>
                </Step>
                <Step>
                  <StepNumber>3</StepNumber>
                  <StepText>Desfrute dos novos recursos</StepText>
                </Step>
              </ContactSteps>
            </ContactSection>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Entendi</CancelButton>
          {canViewPlans && (
            <UpgradeButton onClick={handleUpgrade}>
              <MdTrendingUp size={20} />
              Ver Planos
            </UpgradeButton>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
  z-index: 1001;
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid ${props => props.theme.colors.border};

  @keyframes slideIn {
    from {
      transform: translate(-50%, -45%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
    transform: scale(1.05);
  }
`;

const ModalBody = styled.div`
  padding: 0 48px 48px;
  text-align: center;
`;

const IconWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.3);
`;

const LockIcon = styled.div`
  color: white;
  z-index: 2;
`;

const ShineEffect = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  border-radius: 50%;
  animation: shine 2s infinite;

  @keyframes shine {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModuleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
`;

const Description = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 40px;

  strong {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
  }
`;

const UpgradeSection = styled.div`
  margin-bottom: 32px;
`;

const UpgradeTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 24px;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  max-width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const BenefitCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const BenefitIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const BenefitText = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const BenefitDesc = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ContactSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const ContactIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  color: white;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
`;

const ContactTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const ContactText = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 24px;

  strong {
    color: #3b82f6;
    font-weight: 600;
  }
`;

const ContactSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const StepText = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px 48px 48px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UpgradeButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

  &:hover {
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
