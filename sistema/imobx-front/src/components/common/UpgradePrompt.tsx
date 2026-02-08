/**
 * Componente de Prompt de Upgrade
 * Exibido quando usuário tenta acessar módulo sem permissão
 */

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  module: string;
  features?: string[];
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  module,
  features = [
    'Sistema inteligente de match cliente-imóvel',
    'Score de compatibilidade automático',
    'Notificações em tempo real',
    'Geração automática de sugestões',
    'Análise de características desejadas',
  ],
}) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <Icon>🔒</Icon>
        <Title>Módulo Exclusivo do Plano PRO</Title>
        <Description>
          O módulo de <strong>{module}</strong> está disponível apenas no plano
          PRO ou superior.
        </Description>

        <FeaturesList>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>✅</FeatureIcon>
              <FeatureText>{feature}</FeatureText>
            </FeatureItem>
          ))}
        </FeaturesList>

        <UpgradeButton onClick={() => navigate('/settings/plan')}>
          Fazer Upgrade para PRO
        </UpgradeButton>

        <BackButton onClick={() => navigate(-1)}>← Voltar</BackButton>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: ${({ theme }) => theme.colors.cardBackground};
  padding: 60px 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const Icon = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 64px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 32px 0;
  line-height: 1.6;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 28px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 32px 0;
  text-align: left;

  @media (max-width: 768px) {
    margin: 24px 0;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 14px;
  }
`;

const FeatureIcon = styled.span`
  font-size: 20px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const FeatureText = styled.span`
  flex: 1;
  line-height: 1.5;
`;

const UpgradeButton = styled.button`
  width: 100%;
  padding: 16px 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
  margin-bottom: 16px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 14px 36px;
    font-size: 15px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default UpgradePrompt;
