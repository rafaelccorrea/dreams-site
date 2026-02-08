import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  MdHistory,
  MdFolder,
  MdCheckCircle,
  MdCalendarToday,
  MdPerson,
  MdArrowBack,
} from 'react-icons/md';
import { projectsApi } from '../../services/projectsApi';
import type { KanbanProject } from '../../types/kanban';

interface ProjectHistoryProps {
  teamId: string;
  onBack: () => void;
}

const HistoryContainer = styled.div`
  padding: 24px;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const HistoryTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const ProjectCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ProjectIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const ProjectStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
`;

const ProjectDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
`;

const EmptyMessage = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 64px 24px;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({
  teamId,
  onBack,
}) => {
  const [projects, setProjects] = useState<KanbanProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedProjects();
  }, [teamId]);

  const fetchCompletedProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar teamId antes de fazer a requisição
      if (!teamId || teamId === 'undefined' || teamId === 'null') {
        throw new Error('ID da equipe é obrigatório');
      }

      // Buscar todos os projetos da equipe
      const allProjects = await projectsApi.getProjectsByTeam(teamId);

      // Filtrar apenas projetos finalizados
      const completedProjects = allProjects.filter(
        project => project.status === 'completed'
      );

      setProjects(completedProjects);
    } catch (err: any) {
      console.error('Erro ao buscar projetos finalizados:', err);
      setError(err.message || 'Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <BackButton onClick={onBack}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
          <HistoryTitle>
            <MdHistory size={32} />
            Histórico de Funis
          </HistoryTitle>
        </HistoryHeader>
        <LoadingState>
          <p>Carregando histórico...</p>
        </LoadingState>
      </HistoryContainer>
    );
  }

  if (error) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <BackButton onClick={onBack}>
            <MdArrowBack size={20} />
            Voltar
          </BackButton>
          <HistoryTitle>
            <MdHistory size={32} />
            Histórico de Funis
          </HistoryTitle>
        </HistoryHeader>
        <EmptyState>
          <EmptyIcon>
            <MdHistory size={40} />
          </EmptyIcon>
          <EmptyTitle>Erro ao carregar</EmptyTitle>
          <EmptyMessage>{error}</EmptyMessage>
        </EmptyState>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <BackButton onClick={onBack}>
          <MdArrowBack size={20} />
          Voltar
        </BackButton>
        <HistoryTitle>
          <MdHistory size={32} />
          Histórico de Funis
        </HistoryTitle>
      </HistoryHeader>

      {projects.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <MdHistory size={40} />
          </EmptyIcon>
          <EmptyTitle>Nenhum funil finalizado</EmptyTitle>
          <EmptyMessage>
            Ainda não há funis finalizados para exibir no histórico.
          </EmptyMessage>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map(project => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <ProjectIcon>
                  <MdFolder size={24} />
                </ProjectIcon>
                <ProjectInfo>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectStatus>
                    <MdCheckCircle size={16} />
                    Finalizado
                  </ProjectStatus>
                </ProjectInfo>
              </ProjectHeader>

              {project.description && (
                <ProjectDescription>{project.description}</ProjectDescription>
              )}

              <ProjectDetails>
                {project.startDate && (
                  <DetailItem>
                    <MdCalendarToday size={16} />
                    Iniciado em {formatDate(project.startDate)}
                  </DetailItem>
                )}
                {project.completedAt && (
                  <DetailItem>
                    <MdCheckCircle size={16} />
                    Finalizado em {formatDate(project.completedAt)}
                  </DetailItem>
                )}
                {project.createdBy && (
                  <DetailItem>
                    <MdPerson size={16} />
                    Criado por {project.createdBy.name}
                  </DetailItem>
                )}
                {project.completedBy && (
                  <DetailItem>
                    <MdPerson size={16} />
                    Finalizado por {project.completedBy.name}
                  </DetailItem>
                )}
              </ProjectDetails>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}
    </HistoryContainer>
  );
};
