import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdHistory,
  MdPerson,
  MdCalendarToday,
  MdDescription,
  MdCheckCircle,
  MdArchive,
  MdCancel,
  MdEdit,
  MdAdd,
  MdRemove,
  MdFolder,
} from 'react-icons/md';
import { projectsApi } from '../services/projectsApi';
import type { KanbanProjectResponseDto } from '../types/kanban';

const Container = styled.div`
  padding: 24px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ProjectInfo = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`;

const ProjectIcon = styled.div<{ $status: string }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.primary + '20';
      case 'completed':
        return '#10B98120';
      case 'archived':
        return '#6B728020';
      case 'cancelled':
        return '#EF444420';
      default:
        return '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.primary;
      case 'completed':
        return '#10B981';
      case 'archived':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }};
`;

const ProjectDetails = styled.div`
  flex: 1;
`;

const ProjectName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const ProjectMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.primary + '20';
      case 'completed':
        return '#10B98120';
      case 'archived':
        return '#6B728020';
      case 'cancelled':
        return '#EF444420';
      default:
        return '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return props.theme.colors.primary;
      case 'completed':
        return '#10B981';
      case 'archived':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }};
`;

const HistorySection = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HistoryItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const HistoryIcon = styled.div<{ $action: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$action) {
      case 'created':
        return props.theme.colors.primary + '20';
      case 'updated':
        return '#F59E0B20';
      case 'completed':
        return '#10B98120';
      case 'archived':
        return '#6B728020';
      case 'cancelled':
        return '#EF444420';
      default:
        return '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.$action) {
      case 'created':
        return props.theme.colors.primary;
      case 'updated':
        return '#F59E0B';
      case 'completed':
        return '#10B981';
      case 'archived':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }};
`;

const HistoryContent = styled.div`
  flex: 1;
`;

const HistoryTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const HistoryDescription = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const HistoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const HistoryChanges = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background: ${props => props.theme.colors.border}20;
  border-radius: 6px;
  font-size: 0.8rem;
`;

const ChangeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ChangeLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ChangeValue = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: 16px;
`;

interface HistoryEntry {
  id: string;
  action: string;
  description: string;
  oldValues?: any;
  newValues?: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export const ProjectHistoryDetail: React.FC = () => {
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<KanbanProjectResponseDto | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId || !projectId) {
      setError('Parâmetros inválidos');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar dados do projeto e histórico em paralelo
        const [projectData, historyData] = await Promise.all([
          projectsApi.getProjectById(projectId),
          projectsApi.getProjectHistory(projectId),
        ]);

        setProject(projectData);
        setHistory(historyData);
      } catch (err: any) {
        console.error('Erro ao buscar dados do projeto:', err);
        if (err.response?.status === 403) {
          setError('Você não tem permissão para visualizar este projeto');
        } else if (err.response?.status === 404) {
          setError('Projeto não encontrado');
        } else {
          setError('Erro ao carregar dados do projeto');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, projectId]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <MdAdd size={20} />;
      case 'updated':
        return <MdEdit size={20} />;
      case 'completed':
        return <MdCheckCircle size={20} />;
      case 'archived':
        return <MdArchive size={20} />;
      case 'cancelled':
        return <MdCancel size={20} />;
      default:
        return <MdHistory size={20} />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created':
        return 'Projeto criado';
      case 'updated':
        return 'Projeto atualizado';
      case 'completed':
        return 'Projeto finalizado';
      case 'archived':
        return 'Projeto arquivado';
      case 'cancelled':
        return 'Projeto cancelado';
      default:
        return 'Ação realizada';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <MdFolder size={30} />;
      case 'completed':
        return <MdCheckCircle size={30} />;
      case 'archived':
        return <MdArchive size={30} />;
      case 'cancelled':
        return <MdCancel size={30} />;
      default:
        return <MdFolder size={30} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'archived':
        return 'Arquivado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderHistoryChanges = (entry: HistoryEntry) => {
    if (!entry.oldValues && !entry.newValues) return null;

    const changes = [];

    if (entry.oldValues && entry.newValues) {
      // Comparar valores antigos e novos
      Object.keys(entry.newValues).forEach(key => {
        if (entry.oldValues[key] !== entry.newValues[key]) {
          changes.push({
            field: key,
            oldValue: entry.oldValues[key],
            newValue: entry.newValues[key],
          });
        }
      });
    }

    if (changes.length === 0) return null;

    return (
      <HistoryChanges>
        {changes.map((change, index) => (
          <ChangeItem key={index}>
            <ChangeLabel>{change.field}:</ChangeLabel>
            <ChangeValue>
              {change.oldValue ? `"${change.oldValue}"` : 'não definido'} →
              {change.newValue ? `"${change.newValue}"` : 'não definido'}
            </ChangeValue>
          </ChangeItem>
        ))}
      </HistoryChanges>
    );
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Carregando histórico do projeto...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <MdArrowBack size={16} />
            Voltar
          </BackButton>
          <Title>Histórico do Projeto</Title>
        </Header>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={() => navigate(-1)}>
            <MdArrowBack size={16} />
            Voltar
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <MdArrowBack size={16} />
            Voltar
          </BackButton>
          <Title>Histórico do Projeto</Title>
        </Header>
        <ErrorContainer>
          <ErrorMessage>Projeto não encontrado</ErrorMessage>
          <BackButton onClick={() => navigate(-1)}>
            <MdArrowBack size={16} />
            Voltar
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={16} />
          Voltar
        </BackButton>
        <Title>Histórico do Projeto</Title>
      </Header>

      {/* Project Information */}
      <ProjectInfo>
        <ProjectHeader>
          <ProjectIcon $status={project.status}>
            {getStatusIcon(project.status)}
          </ProjectIcon>
          <ProjectDetails>
            <ProjectName>{project.name}</ProjectName>
            {project.description && (
              <ProjectDescription>{project.description}</ProjectDescription>
            )}
            <ProjectMeta>
              <MetaItem>
                <MdPerson size={16} />
                <span>Criado por: {project.createdBy.name}</span>
              </MetaItem>
              <MetaItem>
                <MdCalendarToday size={16} />
                <span>Criado em: {formatDateOnly(project.createdAt)}</span>
              </MetaItem>
              {project.completedAt && (
                <MetaItem>
                  <MdCheckCircle size={16} />
                  <span>
                    Finalizado em: {formatDateOnly(project.completedAt)}
                  </span>
                </MetaItem>
              )}
              {project.completedBy && (
                <MetaItem>
                  <MdPerson size={16} />
                  <span>Finalizado por: {project.completedBy.name}</span>
                </MetaItem>
              )}
              <MetaItem>
                <span>Progresso: {project.progress}%</span>
              </MetaItem>
              <MetaItem>
                <span>
                  Tarefas: {project.taskCount} ({project.completedTaskCount}{' '}
                  concluídas)
                </span>
              </MetaItem>
            </ProjectMeta>
          </ProjectDetails>
        </ProjectHeader>
        <StatusBadge $status={project.status}>
          {getStatusIcon(project.status)}
          {getStatusLabel(project.status)}
        </StatusBadge>
      </ProjectInfo>

      {/* History Section */}
      <HistorySection>
        <SectionTitle>
          <MdHistory size={20} />
          Histórico de Alterações
        </SectionTitle>

        {history.length === 0 ? (
          <div
            style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}
          >
            Nenhum histórico disponível para este projeto.
          </div>
        ) : (
          <HistoryList>
            {history.map(entry => (
              <HistoryItem key={entry.id}>
                <HistoryIcon $action={entry.action}>
                  {getActionIcon(entry.action)}
                </HistoryIcon>
                <HistoryContent>
                  <HistoryTitle>{getActionLabel(entry.action)}</HistoryTitle>
                  <HistoryDescription>{entry.description}</HistoryDescription>
                  {renderHistoryChanges(entry)}
                  <HistoryMeta>
                    <span>
                      <MdPerson size={12} />
                      {entry.user ? entry.user.name : 'Sistema'}
                    </span>
                    <span>
                      <MdCalendarToday size={12} />
                      {formatDate(entry.createdAt)}
                    </span>
                  </HistoryMeta>
                </HistoryContent>
              </HistoryItem>
            ))}
          </HistoryList>
        )}
      </HistorySection>
    </Container>
  );
};

export default ProjectHistoryDetail;
