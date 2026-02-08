import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  MdArrowBack,
  MdFolder,
  MdCheckCircle,
  MdArchive,
  MdCancel,
  MdCalendarToday,
  MdPerson,
  MdAccessTime,
  MdDescription,
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const ProjectIcon = styled.div<{ $status: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$status) {
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

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const ProjectDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const ProjectsHistory: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<KanbanProjectResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setError('ID da equipe não fornecido');
      setLoading(false);
      return;
    }

    const fetchProjectsHistory = async () => {
      try {
        setLoading(true);
        const data = await projectsApi.getProjectsHistory(teamId);
        setProjects(data);
      } catch (err: any) {
        console.error('Erro ao buscar histórico de projetos:', err);
        if (err.response?.status === 403) {
          setError(
            'Você não tem permissão para visualizar o histórico de projetos'
          );
        } else {
          setError('Erro ao carregar histórico de projetos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsHistory();
  }, [teamId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle size={20} />;
      case 'archived':
        return <MdArchive size={20} />;
      case 'cancelled':
        return <MdCancel size={20} />;
      default:
        return <MdFolder size={20} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
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
    });
  };

  const stats = {
    completed: projects.filter(p => p.status === 'completed').length,
    archived: projects.filter(p => p.status === 'archived').length,
    cancelled: projects.filter(p => p.status === 'cancelled').length,
    total: projects.length,
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Carregando histórico de projetos...</LoadingContainer>
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
          <Title>Histórico de Projetos</Title>
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

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={16} />
          Voltar
        </BackButton>
        <Title>Histórico de Projetos</Title>
      </Header>

      {projects.length > 0 ? (
        <>
          <StatsContainer>
            <StatCard>
              <StatNumber>{stats.total}</StatNumber>
              <StatLabel>Total de Projetos</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.completed}</StatNumber>
              <StatLabel>Concluídos</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.archived}</StatNumber>
              <StatLabel>Arquivados</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.cancelled}</StatNumber>
              <StatLabel>Cancelados</StatLabel>
            </StatCard>
          </StatsContainer>

          <ProjectsGrid>
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                onClick={() =>
                  navigate(`/project-history/${teamId}/${project.id}`)
                }
              >
                <ProjectHeader>
                  <ProjectIcon $status={project.status}>
                    {getStatusIcon(project.status)}
                  </ProjectIcon>
                  <ProjectInfo>
                    <ProjectName>{project.name}</ProjectName>
                    {project.description && (
                      <ProjectDescription>
                        {project.description}
                      </ProjectDescription>
                    )}
                  </ProjectInfo>
                </ProjectHeader>

                <ProjectDetails>
                  <DetailItem>
                    <MdPerson size={14} />
                    <span>Criado por: {project.createdBy.name}</span>
                  </DetailItem>

                  <DetailItem>
                    <MdAccessTime size={14} />
                    <span>Criado em: {formatDate(project.createdAt)}</span>
                  </DetailItem>

                  {project.completedAt && (
                    <DetailItem>
                      <MdCheckCircle size={14} />
                      <span>
                        Finalizado em: {formatDate(project.completedAt)}
                      </span>
                    </DetailItem>
                  )}

                  {project.completedBy && (
                    <DetailItem>
                      <MdPerson size={14} />
                      <span>Finalizado por: {project.completedBy.name}</span>
                    </DetailItem>
                  )}

                  <DetailItem>
                    <span>Progresso: {project.progress}%</span>
                  </DetailItem>

                  <DetailItem>
                    <span>
                      Tarefas: {project.taskCount} ({project.completedTaskCount}{' '}
                      concluídas)
                    </span>
                  </DetailItem>
                </ProjectDetails>

                <StatusBadge $status={project.status}>
                  {getStatusIcon(project.status)}
                  {getStatusLabel(project.status)}
                </StatusBadge>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <MdFolder size={32} />
          </EmptyIcon>
          <EmptyTitle>Nenhum projeto no histórico</EmptyTitle>
          <EmptyDescription>
            Não há projetos finalizados, arquivados ou cancelados para exibir.
          </EmptyDescription>
        </EmptyState>
      )}
    </Container>
  );
};

export default ProjectsHistory;
