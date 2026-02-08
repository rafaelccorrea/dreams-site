import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdHome,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdVisibility,
} from 'react-icons/md';
import { Layout } from '../components/layout/Layout';
import { condominiumApi } from '../services/condominiumApi';
import type { Condominium } from '../types/condominium';
import { toast } from 'react-toastify';
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';
import { PermissionButton } from '../components/common/PermissionButton';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import styled from 'styled-components';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  ActionsBar,
  LeftActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
} from '../styles/pages/PropertiesPageStyles';

const CondominiumsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CondominiumCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CardImage = styled.div<{ $imageUrl?: string }>`
  width: 100%;
  height: 200px;
  background: ${props =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center/cover`
      : props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CardImagePlaceholder = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 3rem;
  opacity: 0.3;
`;

const CardContent = styled.div`
  padding: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props =>
    props.$isActive
      ? props.theme.colors.success + '20'
      : props.theme.colors.error + '20'};
  color: ${props =>
    props.$isActive ? props.theme.colors.success : props.theme.colors.error};
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  margin-top: 24px;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
`;

const CondominiumsPage: React.FC = () => {
  const navigate = useNavigate();
  const permissionsContext = usePermissionsContextOptional();
  const hasViewPermission =
    permissionsContext?.hasPermission('condominium:view') || false;
  const hasCreatePermission =
    permissionsContext?.hasPermission('condominium:create') || false;
  const hasUpdatePermission =
    permissionsContext?.hasPermission('condominium:update') || false;
  const hasDeletePermission =
    permissionsContext?.hasPermission('condominium:delete') || false;

  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [condominiumToDelete, setCondominiumToDelete] =
    useState<Condominium | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCondominiums = async () => {
    try {
      setIsLoading(true);
      const response = await condominiumApi.listCondominiums({
        search: searchTerm || undefined,
        isActive: true,
      });

      // Se a resposta tem estrutura paginada
      if (Array.isArray(response)) {
        setCondominiums(response);
      } else {
        setCondominiums(response.data || []);
      }
    } catch (error: any) {
      console.error('Erro ao carregar condomínios:', error);
      toast.error('Erro ao carregar condomínios');
    } finally {
      setIsLoading(false);
    }
  };

  // Recarregar quando o termo de busca mudar
  useEffect(() => {
    if (hasViewPermission) {
      const timeoutId = setTimeout(() => {
        loadCondominiums();
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, hasViewPermission]);

  const handleDelete = async () => {
    if (!condominiumToDelete) return;

    setIsDeleting(true);
    try {
      await condominiumApi.deleteCondominium(condominiumToDelete.id);
      toast.success('Condomínio excluído com sucesso!');
      setShowDeleteModal(false);
      setCondominiumToDelete(null);
      loadCondominiums();
    } catch (error: any) {
      console.error('Erro ao excluir condomínio:', error);
      toast.error(error.message || 'Erro ao excluir condomínio');
    } finally {
      setIsDeleting(false);
    }
  };

  // A filtragem agora é feita pelo backend através do parâmetro search
  const filteredCondominiums = condominiums;

  if (!hasViewPermission) {
    return (
      <Layout>
        <PageContainer>
          <PageContent>
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <h2 style={{ color: 'var(--color-text)', marginBottom: '16px' }}>
                Acesso Negado
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: '24px',
                }}
              >
                Você não tem permissão para visualizar condomínios.
              </p>
            </div>
          </PageContent>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <PageTitle>
                <MdHome size={32} />
                Condomínios
              </PageTitle>
              <PageSubtitle>Gerencie os condomínios cadastrados</PageSubtitle>
            </PageTitleContainer>
            <HeaderActions>
              {hasCreatePermission && (
                <PermissionButton
                  permission='condominium:create'
                  variant='primary'
                  size='medium'
                  onClick={() => navigate('/condominiums/create')}
                >
                  <MdAdd />
                  Novo Condomínio
                </PermissionButton>
              )}
            </HeaderActions>
          </PageHeader>

          <ActionsBar>
            <LeftActions>
              <SearchContainer>
                <SearchInput
                  type='text'
                  placeholder='Buscar condomínios...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <SearchIcon />
              </SearchContainer>
            </LeftActions>
          </ActionsBar>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Carregando condomínios...
              </p>
            </div>
          ) : filteredCondominiums.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>🏢</EmptyStateIcon>
              <EmptyStateTitle>
                {searchTerm
                  ? 'Nenhum condomínio encontrado'
                  : 'Nenhum condomínio cadastrado'}
              </EmptyStateTitle>
              <EmptyStateDescription>
                {searchTerm
                  ? 'Tente buscar com outros termos'
                  : 'Comece cadastrando seu primeiro condomínio'}
              </EmptyStateDescription>
              {hasCreatePermission && !searchTerm && (
                <PermissionButton
                  permission='condominium:create'
                  variant='primary'
                  size='medium'
                  onClick={() => navigate('/condominiums/create')}
                >
                  <MdAdd />
                  Criar Primeiro Condomínio
                </PermissionButton>
              )}
            </EmptyState>
          ) : (
            <CondominiumsGrid>
              {filteredCondominiums.map(condominium => {
                const mainImage =
                  condominium.images?.find(img => img.isMain) ||
                  condominium.images?.[0];

                return (
                  <CondominiumCard key={condominium.id}>
                    <CardImage $imageUrl={mainImage?.fileUrl}>
                      {!mainImage && (
                        <CardImagePlaceholder>
                          <MdHome size={48} />
                        </CardImagePlaceholder>
                      )}
                    </CardImage>
                    <CardContent>
                      <CardHeader>
                        <CardTitle>
                          <MdHome size={20} />
                          {condominium.name}
                        </CardTitle>
                        <StatusBadge $isActive={condominium.isActive}>
                          {condominium.isActive ? 'Ativo' : 'Inativo'}
                        </StatusBadge>
                      </CardHeader>

                      <CardBody>
                        <CardInfo>
                          <MdLocationOn size={16} />
                          {condominium.address}
                        </CardInfo>
                        <CardInfo>
                          <MdLocationOn size={16} />
                          {condominium.city} - {condominium.state}
                        </CardInfo>
                        {condominium.phone && (
                          <CardInfo>
                            <MdPhone size={16} />
                            {condominium.phone}
                          </CardInfo>
                        )}
                        {condominium.email && (
                          <CardInfo>
                            <MdEmail size={16} />
                            {condominium.email}
                          </CardInfo>
                        )}
                        {condominium.images &&
                          condominium.images.length > 0 && (
                            <CardInfo>
                              📸 {condominium.images.length} imagem(ns)
                            </CardInfo>
                          )}
                      </CardBody>

                      <CardActions>
                        {hasUpdatePermission && (
                          <PermissionButton
                            permission='condominium:update'
                            variant='secondary'
                            size='small'
                            onClick={() => {
                              navigate(`/condominiums/edit/${condominium.id}`);
                            }}
                          >
                            <MdEdit />
                            Editar
                          </PermissionButton>
                        )}
                        {hasDeletePermission && (
                          <PermissionButton
                            permission='condominium:delete'
                            variant='danger'
                            size='small'
                            onClick={() => {
                              setCondominiumToDelete(condominium);
                              setShowDeleteModal(true);
                            }}
                          >
                            <MdDelete />
                            Excluir
                          </PermissionButton>
                        )}
                      </CardActions>
                    </CardContent>
                  </CondominiumCard>
                );
              })}
            </CondominiumsGrid>
          )}

          <ConfirmDeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setCondominiumToDelete(null);
            }}
            onConfirm={handleDelete}
            title='Excluir Condomínio'
            message={`Tem certeza que deseja excluir o condomínio "${condominiumToDelete?.name}"?`}
            itemName={condominiumToDelete?.name}
            isLoading={isDeleting}
            variant='delete'
          />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default CondominiumsPage;
