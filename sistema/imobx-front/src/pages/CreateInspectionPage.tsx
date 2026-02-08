import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  MdArrowBack,
  MdAssignment,
  MdAdd,
  MdHome,
  MdWarning,
  MdInfo,
} from 'react-icons/md';
import { InspectionForm } from '@/components/vistoria';
import { useInspection } from '@/hooks/useVistoria';
import { useProperties } from '@/hooks/useProperties';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '@/utils/permissionContextualDependencies';
import type { CreateInspectionRequest } from '@/types/vistoria-types';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  BackButton,
  ContentContainer,
} from '../styles/pages/InspectionFormPageStyles';
import styled from 'styled-components';

// Componente de aviso para usuários sem propriedades
const NoPropertiesWarning = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.warning}20 0%,
    ${props => props.theme.colors.warning}10 100%
  );
  border: 2px solid ${props => props.theme.colors.warning}30;
  border-radius: 20px;
  padding: 32px;
  margin: 32px 0;
  text-align: center;
  box-shadow: 0 8px 30px ${props => props.theme.colors.warning}20;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.warning} 0%,
      #f59e0b 100%
    );
  }

  @media (max-width: 768px) {
    padding: 24px;
    margin: 24px 0;
  }
`;

const WarningIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    font-size: 64px;
    color: ${props => props.theme.colors.warning};
    filter: drop-shadow(0 4px 8px ${props => props.theme.colors.warning}30);
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;

    svg {
      font-size: 48px;
    }
  }
`;

const WarningTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.warning} 0%,
    #f59e0b 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const WarningMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
`;

const CreatePropertyButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}25;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}35;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.9rem;
  }
`;

// Loading component
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
`;

// Info box for better UX
const InfoBox = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15 0%,
    ${props => props.theme.colors.primary}08 100%
  );
  border: 1px solid ${props => props.theme.colors.primary}25;
  border-radius: 18px;
  padding: 24px 28px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 6px 20px ${props => props.theme.colors.primary}15;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryDark} 100%
    );
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.primary}20;
    border-color: ${props => props.theme.colors.primary}40;
  }

  @media (max-width: 768px) {
    padding: 20px 24px;
    margin-bottom: 24px;
    gap: 14px;
  }
`;

export const CreateInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasCheckedProperties, setHasCheckedProperties] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { createInspection } = useInspection();
  const {
    properties,
    isLoading: propertiesLoading,
    getProperties,
  } = useProperties();
  const { users } = useUsers();
  const { getCurrentUser } = useAuth();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissionsContext();

  const currentUser = getCurrentUser();

  const inspectors =
    users?.filter(user => user.role === 'inspector' || user.role === 'admin') ||
    [];

  // Verificar permissão para criar vistoria
  const canCreateInspection =
    hasPermission('inspection:create') ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'master';

  // Carregar propriedades disponíveis
  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Verificar se pode vincular vistoria a propriedade
        const canLinkToProperty = canExecuteFunctionality(
          hasPermission,
          'inspection:create',
          'vincular_vistoria_propriedade'
        );

        // Só carregar propriedades se tiver permissão para vincular
        if (canLinkToProperty) {
          await getProperties({}, { page: 1, limit: 100 });
        }
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
      } finally {
        setHasCheckedProperties(true);
        setIsInitialLoading(false);
      }
    };

    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removida dependência getProperties para evitar loop

  // Redirecionar se não tiver permissão
  useEffect(() => {
    if (hasCheckedProperties && !canCreateInspection) {
      navigate('/inspection', { replace: true });
    }
  }, [canCreateInspection, navigate, hasCheckedProperties]);

  const handleSubmit = async (data: CreateInspectionRequest) => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      const companyId = selectedCompany?.id;

      if (!currentUser) {
        toast.error('Usuário não encontrado. Faça login novamente.');
        return;
      }

      if (!companyId) {
        toast.error(
          'Empresa não selecionada. Selecione uma empresa no header.'
        );
        return;
      }

      // console.log('📋 Criando vistoria:', data);
      // O backend obtém userId e companyId do request (JWT + CompanyGuard)
      // Não precisa enviar no body
      await createInspection(data);

      toast.success('Vistoria criada com sucesso!');
      navigate('/inspection');
    } catch (error: any) {
      console.error('❌ Erro ao criar inspection:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao criar vistoria';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inspection');
  };

  const handleCreateProperty = () => {
    navigate('/properties/create');
  };

  // Se ainda está carregando as propriedades
  if (isInitialLoading || propertiesLoading || !hasCheckedProperties) {
    return (
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>Nova Vistoria</PageTitle>
              <PageSubtitle>Carregando suas propriedades...</PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={handleCancel}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageHeader>

          <ContentContainer>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>
                Verificando suas propriedades disponíveis...
              </LoadingText>
            </LoadingContainer>
          </ContentContainer>
        </PageContent>
      </PageContainer>
    );
  }

  // Se não tem propriedades cadastradas (apenas após verificação completa e não estar carregando)
  if (
    hasCheckedProperties &&
    !isInitialLoading &&
    !propertiesLoading &&
    (!properties || properties.length === 0)
  ) {
    return (
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>
                <MdAssignment size={32} />
                Nova Vistoria
              </PageTitle>
              <PageSubtitle>
                Você precisa ter propriedades cadastradas para criar vistorias
              </PageSubtitle>
            </PageTitleContainer>
            <BackButton onClick={handleCancel}>
              <MdArrowBack size={20} />
              Voltar
            </BackButton>
          </PageHeader>

          <ContentContainer>
            <NoPropertiesWarning>
              <WarningIcon>
                <MdWarning />
              </WarningIcon>
              <WarningTitle>Nenhuma propriedade encontrada</WarningTitle>
              <WarningMessage>
                Para criar uma vistoria, você precisa ter pelo menos uma
                propriedade cadastrada em sua responsabilidade. Cadastre uma
                propriedade primeiro e depois retorne para criar a vistoria.
              </WarningMessage>
              <CreatePropertyButton onClick={handleCreateProperty}>
                <MdHome size={20} />
                Cadastrar Propriedade
              </CreatePropertyButton>
            </NoPropertiesWarning>
          </ContentContainer>
        </PageContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <PageTitleContainer>
            <PageTitle>Nova Vistoria</PageTitle>
            <PageSubtitle>
              Preencha os dados para criar uma nova vistoria
            </PageSubtitle>
          </PageTitleContainer>
          <BackButton onClick={handleCancel}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
        </PageHeader>

        <ContentContainer>
          <InfoBox>
            <MdInfo size={20} />
            Você tem {properties?.length || 0} propriedade(s) disponível(is)
            para vistoria
          </InfoBox>

          <InspectionForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            properties={properties || []}
            inspectors={inspectors}
            currentUser={
              currentUser
                ? { id: currentUser.id, name: currentUser.name }
                : undefined
            }
            loading={loading}
          />
        </ContentContainer>
      </PageContent>
    </PageContainer>
  );
};

export default CreateInspectionPage;
