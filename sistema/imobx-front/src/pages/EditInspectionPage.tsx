import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdAssignment, MdEdit, MdError } from 'react-icons/md';
import { InspectionForm } from '@/components/vistoria';
import { useInspection, useInspectionById } from '@/hooks/useVistoria';
import { useProperties } from '@/hooks/useProperties';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { useCompany } from '@/hooks/useCompany';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import {
  canExecuteFunctionality,
  getDisabledFunctionalityMessage,
} from '@/utils/permissionContextualDependencies';
import type { UpdateInspectionRequest } from '@/types/vistoria-types';
import {
  PageContainer,
  PageHeader,
  BackButton,
  PageTitle,
  PageSubtitle,
  PageTitleContainer,
  ContentContainer,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorCard,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  ErrorButton,
} from '../styles/pages/InspectionFormPageStyles';

export const EditInspectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [hasRequestedProperties, setHasRequestedProperties] = useState(false);
  const { updateInspection } = useInspection();
  const {
    inspection,
    loading: loadingInspection,
    error,
  } = useInspectionById(id || null);
  const {
    properties,
    isLoading: propertiesLoading,
    getProperties,
  } = useProperties();
  const { users, isLoading: usersLoading, getUsers } = useUsers();
  const { getCurrentUser } = useAuth();
  const { selectedCompany } = useCompany();
  const { hasPermission } = usePermissionsContext();

  const inspectors =
    users?.filter(
      user =>
        user.role === 'inspector' ||
        user.role === 'admin' ||
        user.role === 'master'
    ) || [];

  const canEditInspection =
    hasPermission('inspection:update') ||
    getCurrentUser()?.role === 'admin' ||
    getCurrentUser()?.role === 'master';

  const canChangeProperty = canExecuteFunctionality(
    hasPermission,
    'inspection:update',
    'alterar_propriedade_vistoria'
  );

  // Carregar só usuários no mount; propriedades ao abrir o select (não bloqueia abertura)
  useEffect(() => {
    getUsers({ page: 1, limit: 100 })
      .then(() => setHasLoadedData(true))
      .catch(() => setHasLoadedData(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPropertiesOnDemand = React.useCallback(() => {
    if (!canChangeProperty || hasRequestedProperties) return;
    setHasRequestedProperties(true);
    getProperties({}, { page: 1, limit: 100 });
  }, [canChangeProperty, hasRequestedProperties, getProperties]);

  // Redirecionar se não tiver permissão
  useEffect(() => {
    if (hasLoadedData && !canEditInspection) {
      navigate('/inspection', { replace: true });
    }
  }, [canEditInspection, navigate, hasLoadedData]);

  const handleSubmit = async (data: UpdateInspectionRequest) => {
    if (!id) return;

    try {
      setLoading(true);
      await updateInspection(id, data);
      navigate('/inspection');
    } catch (error) {
      console.error('Erro ao atualizar inspection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/inspection');
  };

  // Mostrar loading só enquanto carrega inspeção e usuários (propriedades carregam no select)
  if (loadingInspection || !hasLoadedData || usersLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Carregando vistoria...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  // Mostrar erro apenas se não estiver carregando e houver erro
  if (!loadingInspection && (error || !inspection)) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <MdError />
            </ErrorIcon>
            <ErrorTitle>Erro ao carregar vistoria</ErrorTitle>
            <ErrorMessage>{error || 'Vistoria não encontrada'}</ErrorMessage>
            <ErrorButton onClick={handleCancel}>
              Voltar para Vistorias
            </ErrorButton>
          </ErrorCard>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitleContainer>
          <PageTitle>Editar Vistoria</PageTitle>
          <PageSubtitle>
            Atualize os dados da vistoria: {inspection.title}
          </PageSubtitle>
        </PageTitleContainer>
        <BackButton onClick={handleCancel}>
          <MdArrowBack />
          Voltar
        </BackButton>
      </PageHeader>

      <ContentContainer>
        <InspectionForm
          inspection={inspection}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          properties={properties || []}
          onPropertySelectOpen={loadPropertiesOnDemand}
          propertiesLoading={propertiesLoading}
          inspectors={inspectors}
          loading={loading}
          isEdit={true}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default EditInspectionPage;
