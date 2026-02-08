import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdTrendingUp,
  MdContactSupport,
  MdPublic,
  MdCheckCircle,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PropertyPublicUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  suggestions?: string[];
}

export const PropertyPublicUpgradeModal: React.FC<
  PropertyPublicUpgradeModalProps
> = ({
  isOpen,
  onClose,
  title = 'Upgrade Necessário',
  message = 'Esta funcionalidade está disponível apenas no plano Professional.',
  suggestions,
}) => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  if (!isOpen) return null;

  const canViewPlans = user?.role === 'admin' || user?.role === 'master';

  const handleUpgrade = () => {
    onClose();
    navigate('/subscription-management');
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            <MdClose size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <IconWrapper>
            <PublicIcon>
              <MdPublic size={48} />
            </PublicIcon>
            <ShineEffect />
          </IconWrapper>

          <Title>{title}</Title>

          <Description>
            {message}
            {!canViewPlans && (
              <>
                <br />
                <br />
                Entre em contato com o <strong>
                  administrador da empresa
                </strong>{' '}
                para solicitar acesso a esta funcionalidade.
              </>
            )}
          </Description>

          {canViewPlans ? (
            <UpgradeSection>
              <UpgradeTitle>🚀 Upgrade para Professional</UpgradeTitle>
              <BenefitsList>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>
                    Até 100 propriedades no site Dream Keys
                  </BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>Gestão de aluguéis</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>Sistema de comissões</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>Match inteligente</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>Kanban de vendas</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>Relatórios avançados</BenefitText>
                </BenefitItem>
                <BenefitItem>
                  <MdCheckCircle size={20} style={{ color: '#10b981' }} />
                  <BenefitText>Suporte prioritário</BenefitText>
                </BenefitItem>
              </BenefitsList>

              <PriceInfo>
                <PriceValue>R$ 247,90</PriceValue>
                <PricePeriod>/ mês</PricePeriod>
              </PriceInfo>
            </UpgradeSection>
          ) : (
            <ContactSection>
              <ContactIcon>
                <MdContactSupport size={32} />
              </ContactIcon>
              <ContactTitle>Solicite Acesso</ContactTitle>
              <ContactText>
                Entre em contato com o <strong>administrador da empresa</strong>{' '}
                para solicitar o upgrade do plano.
              </ContactText>
              {suggestions && suggestions.length > 0 && (
                <SuggestionsList>
                  {suggestions.map((suggestion, index) => (
                    <SuggestionItem key={index}>
                      <SuggestionNumber>{index + 1}</SuggestionNumber>
                      <SuggestionText>{suggestion}</SuggestionText>
                    </SuggestionItem>
                  ))}
                </SuggestionsList>
              )}
            </ContactSection>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose}>Entendi</CancelButton>
          {canViewPlans && (
            <UpgradeButton onClick={handleUpgrade}>
              <MdTrendingUp size={20} />
              Fazer Upgrade
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
  background: ${props => props.theme?.colors?.cardBackground || '#ffffff'};
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
  z-index: 10001;
  width: 95%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};
  color: ${props => props.theme?.colors?.text || '#333333'};

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
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f5f5f5'};
  border: none;
  color: ${props => props.theme?.colors?.textSecondary || '#757575'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme?.colors?.error || '#d32f2f'};
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
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  border-radius: 50%;
  box-shadow: 0 16px 40px rgba(76, 175, 80, 0.3);
`;

const PublicIcon = styled.div`
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
  color: ${props => props.theme?.colors?.text || '#333333'};
  margin-bottom: 16px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-size: 16px;
  color: ${props => props.theme?.colors?.textSecondary || '#757575'};
  line-height: 1.6;
  margin-bottom: 40px;

  strong {
    color: ${props => props.theme?.colors?.text || '#333333'};
    font-weight: 600;
  }
`;

const UpgradeSection = styled.div`
  margin-bottom: 32px;
`;

const UpgradeTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme?.colors?.text || '#333333'};
  margin-bottom: 24px;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  text-align: left;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f5f5f5'};
  border-radius: 8px;
`;

const BenefitText = styled.span`
  font-size: 14px;
  color: ${props => props.theme?.colors?.text || '#333333'};
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;

const PriceValue = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#333333'};
`;

const PricePeriod = styled.span`
  font-size: 18px;
  color: ${props => props.theme?.colors?.textSecondary || '#757575'};
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
  color: ${props => props.theme?.colors?.text || '#333333'};
  margin-bottom: 12px;
`;

const ContactText = styled.p`
  font-size: 16px;
  color: ${props => props.theme?.colors?.textSecondary || '#757575'};
  line-height: 1.6;
  margin-bottom: 24px;

  strong {
    color: #3b82f6;
    font-weight: 600;
  }
`;

const SuggestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f5f5f5'};
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
`;

const SuggestionNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  flex-shrink: 0;
`;

const SuggestionText = styled.span`
  font-size: 14px;
  color: ${props => props.theme?.colors?.text || '#333333'};
  flex: 1;
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
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f5f5f5'};
  color: ${props => props.theme?.colors?.text || '#333333'};
  border: 1px solid ${props => props.theme?.colors?.border || '#e0e0e0'};

  &:hover {
    background: ${props =>
      props.theme?.colors?.backgroundTertiary || '#eeeeee'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UpgradeButton = styled(Button)`
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);

  &:hover {
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
