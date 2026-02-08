import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdArrowBack,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdSchedule,
  MdEdit,
  MdDelete,
  MdHome,
  MdPerson,
  MdInfo,
  MdNote,
} from 'react-icons/md';
import { useChecklists } from '../hooks/useChecklists';
import type {
  ChecklistResponseDto,
  ItemStatus,
} from '../types/checklist.types';
import {
  ChecklistStatusLabels,
  ChecklistTypeLabels,
  ItemStatusLabels,
  ItemStatusColors,
} from '../types/checklist.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { ChecklistDetailsShimmer } from '../components/shimmer/ChecklistDetailsShimmer';
import {
  PageContainer,
  PageHeader,
  BackButton,
  HeaderActions,
  ActionButton,
  ContentGrid,
  MainContent,
  Sidebar,
  Card,
  CardTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  Badge,
  ProgressSection,
  ProgressBar,
  ProgressFill,
  ProgressText,
  ItemsList,
  ItemCard,
  ItemHeader,
  ItemTitle,
  ItemStatusSelect,
  ItemDescription,
  ItemMeta,
  DocumentsList,
  DocumentItem,
  NotesSection,
  NotesText,
  ErrorContainer,
} from './styles/ChecklistDetailsPage.styles';

const ChecklistDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchChecklistById, updateItemStatus, deleteChecklist } =
    useChecklists();
  const [checklist, setChecklist] = useState<ChecklistResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      loadChecklist();
    }
  }, [id]);

  const loadChecklist = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchChecklistById(id);
      setChecklist(data);
    } catch (error) {
      toast.error('Erro ao carregar checklist');
      navigate('/checklists');
    } finally {
      setLoading(false);
    }
  };

  const handleItemStatusChange = async (
    itemId: string,
    newStatus: ItemStatus
  ) => {
    if (!id || !checklist) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const updated = await updateItemStatus(id, itemId, newStatus);
      if (updated) {
        setChecklist(updated);
        toast.success('Status atualizado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status do item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Tem certeza que deseja remover este checklist?')) {
      const success = await deleteChecklist(id);
      if (success) {
        navigate('/checklists');
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return <ChecklistDetailsShimmer />;
  }

  if (!checklist) {
    return (
      <PageContainer>
        <ErrorContainer>
          <h2>Checklist não encontrado</h2>
          <p>
            O checklist que você está procurando não existe ou foi removido.
          </p>
          <BackButton onClick={() => navigate('/checklists')}>
            <MdArrowBack />
            Voltar para Checklists
          </BackButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <h1
            style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}
          >
            Checklist - {checklist.property?.title || 'Sem título'}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {ChecklistTypeLabels[checklist.type]} • Cliente:{' '}
            {checklist.client?.name || 'Não especificado'}
          </p>
        </div>
        <HeaderActions>
          <ActionButton onClick={() => navigate(`/checklists/${id}/edit`)}>
            <MdEdit />
            Editar
          </ActionButton>
          <ActionButton $variant='danger' onClick={handleDelete}>
            <MdDelete />
            Excluir
          </ActionButton>
          <BackButton onClick={() => navigate('/checklists')}>
            <MdArrowBack />
            Voltar
          </BackButton>
        </HeaderActions>
      </PageHeader>

      <ContentGrid>
        <MainContent>
          {/* Progress Section */}
          <Card>
            <CardTitle>📊 Progresso</CardTitle>
            <ProgressSection>
              <ProgressBar>
                <ProgressFill
                  $percentage={checklist.statistics.completionPercentage}
                />
              </ProgressBar>
              <ProgressText>
                <span>
                  {checklist.statistics.completedItems} de{' '}
                  {checklist.statistics.totalItems} itens concluídos
                </span>
                <span>{checklist.statistics.completionPercentage}%</span>
              </ProgressText>
            </ProgressSection>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Total de Itens</InfoLabel>
                <InfoValue>{checklist.statistics.totalItems}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Concluídos</InfoLabel>
                <InfoValue style={{ color: '#10b981' }}>
                  {checklist.statistics.completedItems}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Em Andamento</InfoLabel>
                <InfoValue style={{ color: '#3b82f6' }}>
                  {checklist.statistics.inProgressItems}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Pendentes</InfoLabel>
                <InfoValue style={{ color: '#6b7280' }}>
                  {checklist.statistics.pendingItems}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </Card>

          {/* Items List */}
          <Card>
            <CardTitle>📋 Itens do Checklist</CardTitle>
            <ItemsList>
              {checklist.items
                .sort((a, b) => a.order - b.order)
                .map(item => (
                  <ItemCard key={item.id} $status={item.status}>
                    <ItemHeader>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemStatusSelect
                        value={item.status}
                        onChange={e =>
                          handleItemStatusChange(
                            item.id,
                            e.target.value as ItemStatus
                          )
                        }
                        disabled={updatingItems.has(item.id)}
                      >
                        <option value='pending'>
                          {ItemStatusLabels.pending}
                        </option>
                        <option value='in_progress'>
                          {ItemStatusLabels.in_progress}
                        </option>
                        <option value='completed'>
                          {ItemStatusLabels.completed}
                        </option>
                        <option value='skipped'>
                          {ItemStatusLabels.skipped}
                        </option>
                      </ItemStatusSelect>
                    </ItemHeader>

                    {item.description && (
                      <ItemDescription>{item.description}</ItemDescription>
                    )}

                    {item.requiredDocuments &&
                      item.requiredDocuments.length > 0 && (
                        <div>
                          <InfoLabel
                            style={{ marginBottom: '8px', display: 'block' }}
                          >
                            Documentos necessários:
                          </InfoLabel>
                          <DocumentsList>
                            {item.requiredDocuments.map((doc, idx) => (
                              <DocumentItem key={idx}>
                                <MdInfo size={16} />
                                {doc}
                              </DocumentItem>
                            ))}
                          </DocumentsList>
                        </div>
                      )}

                    <ItemMeta>
                      {item.estimatedDays && (
                        <span>
                          <MdSchedule
                            size={16}
                            style={{ verticalAlign: 'middle' }}
                          />{' '}
                          Prazo estimado: {item.estimatedDays} dias
                        </span>
                      )}
                      {item.completedAt && (
                        <span>
                          <MdCheckCircle
                            size={16}
                            style={{ verticalAlign: 'middle' }}
                          />{' '}
                          Concluído em: {formatDate(item.completedAt)}
                        </span>
                      )}
                    </ItemMeta>

                    {item.notes && (
                      <NotesSection>
                        <InfoLabel
                          style={{ marginBottom: '8px', display: 'block' }}
                        >
                          <MdNote
                            size={16}
                            style={{ verticalAlign: 'middle' }}
                          />{' '}
                          Observações:
                        </InfoLabel>
                        <NotesText>{item.notes}</NotesText>
                      </NotesSection>
                    )}
                  </ItemCard>
                ))}
            </ItemsList>
          </Card>
        </MainContent>

        <Sidebar>
          {/* Info Card */}
          <Card>
            <CardTitle>ℹ️ Informações</CardTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Tipo</InfoLabel>
                <Badge $type={checklist.type}>
                  {ChecklistTypeLabels[checklist.type]}
                </Badge>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <Badge $status={checklist.status}>
                  {ChecklistStatusLabels[checklist.status]}
                </Badge>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Iniciado em</InfoLabel>
                <InfoValue>{formatDate(checklist.startedAt)}</InfoValue>
              </InfoItem>
              {checklist.completedAt && (
                <InfoItem>
                  <InfoLabel>Concluído em</InfoLabel>
                  <InfoValue>{formatDate(checklist.completedAt)}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </Card>

          {/* Property Card */}
          {checklist.property && (
            <Card>
              <CardTitle>
                <MdHome />
                Propriedade
              </CardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Título</InfoLabel>
                  <InfoValue>{checklist.property.title}</InfoValue>
                </InfoItem>
                {checklist.property.code && (
                  <InfoItem>
                    <InfoLabel>Código</InfoLabel>
                    <InfoValue>{checklist.property.code}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
              <ActionButton
                style={{ marginTop: '16px', width: '100%' }}
                onClick={() => navigate(`/properties/${checklist.propertyId}`)}
              >
                <MdHome />
                Ver Propriedade
              </ActionButton>
            </Card>
          )}

          {/* Client Card */}
          {checklist.client && (
            <Card>
              <CardTitle>
                <MdPerson />
                Cliente
              </CardTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Nome</InfoLabel>
                  <InfoValue>{checklist.client.name}</InfoValue>
                </InfoItem>
                {checklist.client.email && (
                  <InfoItem>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>{checklist.client.email}</InfoValue>
                  </InfoItem>
                )}
                {checklist.client.phone && (
                  <InfoItem>
                    <InfoLabel>Telefone</InfoLabel>
                    <InfoValue>{checklist.client.phone}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
              <ActionButton
                style={{ marginTop: '16px', width: '100%' }}
                onClick={() => navigate(`/clients/${checklist.clientId}`)}
              >
                <MdPerson />
                Ver Cliente
              </ActionButton>
            </Card>
          )}

          {/* Notes Card */}
          {checklist.notes && (
            <Card>
              <CardTitle>
                <MdNote />
                Observações Gerais
              </CardTitle>
              <NotesText>{checklist.notes}</NotesText>
            </Card>
          )}
        </Sidebar>
      </ContentGrid>
    </PageContainer>
  );
};

export default ChecklistDetailsPage;
