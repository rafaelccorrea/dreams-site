import React from 'react';
import { Layout } from '../components/layout/Layout';
import { CommissionConfigForm } from '../components/forms/CommissionConfigForm';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  position: relative;
`;

const AdminBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 12px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ShowAlertButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover {
    background: ${props => props.theme.colors.surface};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const CommissionConfigPage: React.FC = () => {
  const handleShowAlert = () => {
    localStorage.removeItem('hideCommissionInfo');
    toast.success(
      '✅ Alerta de configuração de comissões reativado! Você verá o alerta no dashboard novamente.',
      {
        position: 'top-right',
        autoClose: 4000,
      }
    );
  };
  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>
            Configurações de Comissão
            <AdminBadge>🔒 Apenas Administrador Proprietário</AdminBadge>
          </PageTitle>
          <PageSubtitle>
            Configure os percentuais de comissão para vendas e aluguéis da sua
            empresa
          </PageSubtitle>
          <ShowAlertButton onClick={handleShowAlert}>
            🔔 Reativar alerta no dashboard
          </ShowAlertButton>
        </PageHeader>

        <CommissionConfigForm />
      </PageContainer>
    </Layout>
  );
};

export default CommissionConfigPage;
