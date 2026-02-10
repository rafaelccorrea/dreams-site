import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { KanbanBoardComponent } from '../components/kanban';
import { ProjectSelect } from '../components/projects/ProjectSelect';
import {
  getKanbanState,
  saveKanbanState,
  clearKanbanState,
} from '../utils/kanbanState';
import { usePersonalWorkspace } from '../hooks/usePersonalWorkspace';
import { useAuth } from '../hooks/useAuth';
import { LottieLoading } from '../components/common/LottieLoading';
// import { useKanbanMonitoring } from '../hooks/useRealtimeMonitoring';

const KanbanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const teamId = searchParams.get('teamId');
  const projectId = searchParams.get('projectId');
  const workspaceType = searchParams.get('workspace');
  const { workspace: personalWorkspace, loading: personalWorkspaceLoading } =
    usePersonalWorkspace();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isInitializing, setIsInitializing] = useState(true);
  const [resolvedTeamId, setResolvedTeamId] = useState<string | null>(null);
  const [isValidatingProject, setIsValidatingProject] = useState(false);
  const [validatedProjectId, setValidatedProjectId] = useState<string | null>(
    null
  );
  const [validatedProjectData, setValidatedProjectData] = useState<{
    id: string;
    name: string;
    description?: string | null;
    teamId?: string;
    isPersonal?: boolean;
    [key: string]: any;
  } | null>(null);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  console.log('🔍 [KanbanPage] Render:', {
    teamId,
    projectId,
    workspaceType,
    personalWorkspaceLoading,
    personalWorkspace: personalWorkspace
      ? { id: personalWorkspace.id, teamId: personalWorkspace.teamId }
      : null,
    selectedProjectId,
    isInitializing,
    resolvedTeamId,
  });

  // Validar se teamId não é "undefined" (string) ou null
  const isValidTeamId = teamId && teamId !== 'undefined' && teamId !== 'null';
  const isValidProjectId =
    projectId && projectId !== 'undefined' && projectId !== 'null';

  // Verificar se há estado salvo no localStorage para o usuário atual
  const savedState = getKanbanState(currentUser?.id);

  // Validar se o estado salvo pertence ao usuário atual
  const isValidSavedState =
    savedState &&
    currentUser &&
    savedState.userId === currentUser.id &&
    (savedState.projectId || savedState.teamId);

  // Se o estado salvo não pertence ao usuário atual, limpar apenas o desse usuário
  useEffect(() => {
    if (savedState && currentUser && savedState.userId !== currentUser.id) {
      console.log(
        '⚠️ [KanbanPage] Estado salvo pertence a outro usuário, limpando...',
        {
          savedUserId: savedState.userId,
          currentUserId: currentUser.id,
        }
      );
      clearKanbanState(savedState.userId);
    }
  }, [savedState, currentUser]);

  const hasSavedState = isValidSavedState;

  // Determinar o projectId final (prioridade: URL > estado salvo validado)
  const finalProjectId = isValidProjectId
    ? projectId
    : (isValidSavedState ? savedState?.projectId : null) || null;

  // Inicializar selectedProjectId com projeto da URL ou estado salvo
  const hasInitializedProjectId = useRef(false);

  useEffect(() => {
    // Só atualizar uma vez na inicialização
    if (hasInitializedProjectId.current) {
      return;
    }

    if (finalProjectId && selectedProjectId !== finalProjectId) {
      console.log(
        '✅ [KanbanPage] Atualizando selectedProjectId:',
        finalProjectId
      );
      setSelectedProjectId(finalProjectId);
      hasInitializedProjectId.current = true;
    } else if (finalProjectId) {
      hasInitializedProjectId.current = true;
    }
  }, [finalProjectId]);

  // Inicializar com workspace pessoal se não houver projeto selecionado
  const hasInitialized = useRef(false);

  // Timeout de segurança: nunca deixar shimmer infinito (máx 8s)
  useEffect(() => {
    const t = setTimeout(() => {
      console.warn('⏰ [KanbanPage] Timeout de segurança - forçando fim do loading');
      setLoadingTimedOut(true);
      setIsInitializing(false);
      hasInitialized.current = true;
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Evitar múltiplas inicializações
    if (hasInitialized.current) {
      return;
    }

    console.log('🔍 [KanbanPage] useEffect - Inicialização:', {
      personalWorkspaceLoading,
      personalWorkspace: personalWorkspace
        ? { id: personalWorkspace.id, teamId: personalWorkspace.teamId }
        : null,
      finalProjectId,
      hasSavedState,
      selectedProjectId,
      isInitializing,
    });

    // Aguardar o carregamento do workspace pessoal
    if (personalWorkspaceLoading) {
      console.log(
        '⏳ [KanbanPage] Aguardando carregamento do workspace pessoal...'
      );
      return;
    }

    // Timeout de segurança para garantir que sempre finalize a inicialização
    const timeoutId = setTimeout(() => {
      console.log(
        '⏰ [KanbanPage] Timeout de segurança - finalizando inicialização'
      );
      setIsInitializing(false);
      hasInitialized.current = true;
    }, 5000); // 5 segundos máximo

    // Se já tem projeto selecionado, apenas atualizar selectedProjectId se necessário
    if (finalProjectId || hasSavedState) {
      console.log(
        '✅ [KanbanPage] Projeto já selecionado ou estado salvo encontrado'
      );
      if (finalProjectId && selectedProjectId !== finalProjectId) {
        console.log(
          '🔄 [KanbanPage] Atualizando selectedProjectId:',
          finalProjectId
        );
        setSelectedProjectId(finalProjectId);
      }
      clearTimeout(timeoutId);
      console.log(
        '✅ [KanbanPage] Finalizando inicialização - projeto encontrado'
      );
      setIsInitializing(false);
      hasInitialized.current = true;
      return;
    }

    // Se tem workspace pessoal e não há projeto selecionado, inicializar com workspace pessoal
    if (personalWorkspace && !finalProjectId && !hasSavedState) {
      console.log(
        '🏠 [KanbanPage] Inicializando com workspace pessoal:',
        personalWorkspace.id
      );
      // Definir workspace pessoal como padrão
      setSelectedProjectId(personalWorkspace.id);
      // Atualizar URL com workspace pessoal
      const newParams = new URLSearchParams();
      newParams.set('projectId', personalWorkspace.id);
      if (personalWorkspace.teamId) {
        newParams.set('teamId', personalWorkspace.teamId);
      }
      newParams.set('workspace', 'personal');
      console.log(
        '🔄 [KanbanPage] Navegando para:',
        `/kanban?${newParams.toString()}`
      );
      navigate(`/kanban?${newParams.toString()}`, { replace: true });
      saveKanbanState({
        projectId: personalWorkspace.id,
        teamId: personalWorkspace.teamId || undefined,
        workspace: 'personal',
        userId: currentUser?.id || undefined,
      });
      clearTimeout(timeoutId);
      console.log(
        '✅ [KanbanPage] Finalizando inicialização - workspace pessoal configurado'
      );
      setIsInitializing(false);
      hasInitialized.current = true;
    } else {
      // Se não tem projeto, apenas finalizar inicialização
      console.log(
        '⚠️ [KanbanPage] Nenhum projeto encontrado - finalizando inicialização'
      );
      clearTimeout(timeoutId);
      setIsInitializing(false);
      hasInitialized.current = true;
    }

    return () => {
      console.log('🧹 [KanbanPage] Limpando timeout de inicialização');
      clearTimeout(timeoutId);
    };
  }, [
    personalWorkspace,
    personalWorkspaceLoading,
    finalProjectId,
    hasSavedState,
  ]);
  // Monitoramento em tempo real temporariamente desabilitado
  // const {
  //   data: monitoringData,
  //   loading: monitoringLoading,
  //   error: monitoringError,
  //   lastUpdate: monitoringLastUpdate,
  //   isConnected: monitoringConnected,
  //   refresh: refreshMonitoring,
  //   toggleMonitoring,
  //   broadcastUpdate,
  // } = useKanbanMonitoring({
  //   onDataUpdate: (data) => {
  //     console.log('Kanban atualizado em tempo real:', data);
  //     // Aqui você pode processar as atualizações do Kanban
  //   },
  //   onError: (error) => {
  //     console.error('Erro no monitoramento do Kanban:', error);
  //   },
  // });

  // Usar estado salvo se não houver parâmetros na URL
  // Para workspace pessoal, usar teamId do workspace pessoal se não houver na URL
  const isPersonalWorkspace =
    workspaceType === 'personal' || savedState?.workspace === 'personal';

  // Determinar teamId final - prioridade: URL > estado salvo > resolvedTeamId > workspace pessoal
  const finalTeamId = useMemo(() => {
    let result: string | undefined;

    // Validar se o teamId do estado salvo é válido (não 'undefined' ou 'null')
    const isValidSavedTeamId =
      savedState?.teamId &&
      savedState.teamId !== 'undefined' &&
      savedState.teamId !== 'null' &&
      savedState.teamId.trim() !== '';

    if (isValidTeamId) {
      result = teamId || undefined;
      console.log('✅ [KanbanPage] finalTeamId da URL:', result);
    } else if (isValidSavedTeamId) {
      result = savedState.teamId || undefined;
      console.log('✅ [KanbanPage] finalTeamId do estado salvo:', result);
    } else if (
      resolvedTeamId &&
      resolvedTeamId !== 'undefined' &&
      resolvedTeamId !== 'null'
    ) {
      result = (resolvedTeamId === null ? undefined : resolvedTeamId) as
        | string
        | undefined;
      console.log('✅ [KanbanPage] finalTeamId resolvido:', result);
    } else if (isPersonalWorkspace && personalWorkspace?.teamId) {
      result = personalWorkspace.teamId;
      console.log('✅ [KanbanPage] finalTeamId do workspace pessoal:', result);
    } else {
      console.log('⚠️ [KanbanPage] Nenhum finalTeamId encontrado', {
        isValidTeamId,
        savedStateTeamId: savedState?.teamId,
        isValidSavedTeamId,
        resolvedTeamId,
        personalWorkspaceTeamId: personalWorkspace?.teamId,
      });
    }
    return result;
  }, [
    isValidTeamId,
    teamId,
    savedState?.teamId,
    resolvedTeamId,
    isPersonalWorkspace,
    personalWorkspace?.teamId,
  ]);

  // Validar se o projeto pertence ao usuário atual antes de carregar
  useEffect(() => {
    const validateProject = async () => {
      // Evitar validação duplicada do mesmo projeto
      if (
        !finalProjectId ||
        !currentUser ||
        isInitializing ||
        validatedProjectId === finalProjectId
      ) {
        return;
      }

      // Se já temos teamId válido e o projeto já foi validado, não precisa validar novamente
      const isValidFinalTeamId =
        finalTeamId &&
        finalTeamId !== 'undefined' &&
        finalTeamId !== 'null' &&
        finalTeamId.trim() !== '';

      if (isValidFinalTeamId && validatedProjectId === finalProjectId) {
        return;
      }

      setIsValidatingProject(true);
      const validationTimeoutId = setTimeout(() => {
        console.warn('⏰ [KanbanPage] Timeout na validação do projeto - liberando tela');
        setIsValidatingProject(false);
      }, 12000);

      console.log('🔍 [KanbanPage] Validando se projeto pertence ao usuário:', {
        projectId: finalProjectId,
        userId: currentUser.id,
        validatedProjectId,
      });

      try {
        const { projectsApi } = await import('../services/projectsApi');
        const project = await projectsApi.getProjectById(finalProjectId);

        // Verificar se o projeto existe e obter o teamId
        if (!project) {
          clearTimeout(validationTimeoutId);
          console.log(
            '⚠️ [KanbanPage] Projeto não encontrado, limpando estado'
          );
          clearKanbanState(currentUser.id);
          setSelectedProjectId(null);
          setValidatedProjectId(null);
          setValidatedProjectData(null);
          setIsValidatingProject(false);
          return;
        }

        console.log('✅ [KanbanPage] Projeto validado:', {
          id: project.id,
          teamId: project.teamId,
          isPersonal: project.isPersonal,
        });

        // Marcar projeto como validado e guardar dados para evitar nova chamada no KanbanBoard
        setValidatedProjectId(finalProjectId);
        setValidatedProjectData(project);

        // Se não temos teamId, usar o do projeto
        if (!isValidFinalTeamId && project.teamId) {
          console.log(
            '✅ [KanbanPage] Definindo resolvedTeamId do projeto validado:',
            project.teamId
          );
          setResolvedTeamId(project.teamId);
          // Atualizar URL com o teamId encontrado
          const newParams = new URLSearchParams(searchParams);
          newParams.set('teamId', project.teamId);
          if (finalProjectId) {
            newParams.set('projectId', finalProjectId);
          }
          if (project.isPersonal) {
            newParams.set('workspace', 'personal');
          }
          console.log(
            '🔄 [KanbanPage] Atualizando URL com teamId:',
            `/kanban?${newParams.toString()}`
          );
          navigate(`/kanban?${newParams.toString()}`, { replace: true });
        }

        // Salvar estado com userId para validação futura
        saveKanbanState({
          projectId: finalProjectId,
          teamId: project.teamId || finalTeamId || undefined,
          workspace: project.isPersonal ? 'personal' : undefined,
          userId: currentUser.id,
        });
      } catch (error: any) {
        console.error('❌ [KanbanPage] Erro ao validar projeto:', error);
        // Se o projeto não existe ou não pertence ao usuário, limpar estado
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 403
        ) {
          console.log(
            '⚠️ [KanbanPage] Projeto não encontrado ou sem acesso, limpando estado'
          );
          clearKanbanState(currentUser.id);
          setSelectedProjectId(null);
          setValidatedProjectId(null);
          setValidatedProjectData(null);
          // Limpar URL
          navigate('/kanban', { replace: true });
        }
      } finally {
        clearTimeout(validationTimeoutId);
        setIsValidatingProject(false);
      }
    };

    validateProject();
  }, [finalProjectId, currentUser?.id, isInitializing, validatedProjectId]);

  // Limpar resolvedTeamId e validatedProjectId quando o projeto mudar
  useEffect(() => {
    if (!finalProjectId) {
      setResolvedTeamId(null);
      setValidatedProjectId(null);
      setValidatedProjectData(null);
    } else if (finalProjectId !== validatedProjectId) {
      // Se o projeto mudou, limpar validação anterior
      setValidatedProjectId(null);
      setValidatedProjectData(null);
    }
  }, [finalProjectId, validatedProjectId]);

  // Handler para quando um projeto é selecionado
  const handleProjectChange = async (projectId: string, teamId?: string) => {
    const isPersonal = personalWorkspace?.id === projectId;

    // Para workspace pessoal, garantir que temos o teamId
    let teamIdToUse = isPersonal ? teamId || personalWorkspace?.teamId : teamId;

    // Se ainda não temos teamId, buscar do projeto (e guardar dados para o board não chamar de novo)
    if (!teamIdToUse && projectId) {
      try {
        const { projectsApi } = await import('../services/projectsApi');
        const project = await projectsApi.getProjectById(projectId);
        teamIdToUse = project?.teamId || teamIdToUse;
        if (project) {
          setValidatedProjectData(project);
          setValidatedProjectId(projectId);
        }
      } catch (error) {
        console.error('Erro ao buscar projeto:', error);
      }
    }

    // Se ainda não temos teamId, não podemos prosseguir
    if (!teamIdToUse) {
      console.error(
        '❌ Não foi possível obter teamId para o projeto selecionado'
      );
      return;
    }

    // Atualizar estado local
    setSelectedProjectId(projectId);

    // Atualizar URL
    const newParams = new URLSearchParams();
    newParams.set('teamId', teamIdToUse);
    newParams.set('projectId', projectId);
    if (isPersonal) {
      newParams.set('workspace', 'personal');
    }

    navigate(`/kanban?${newParams.toString()}`, { replace: true });

    // Salvar estado com userId
    saveKanbanState({
      projectId: projectId,
      teamId: teamIdToUse,
      workspace: isPersonal ? 'personal' : undefined,
      userId: currentUser?.id || undefined,
    });
  };

  // Mostrar loading enquanto inicializa ou valida projeto (respeitar timeout para não ficar infinito)
  const showLoading =
    !loadingTimedOut &&
    (isInitializing || personalWorkspaceLoading || isValidatingProject);

  if (showLoading) {
    console.log('⏳ [KanbanPage] Mostrando loading:', {
      isInitializing,
      personalWorkspaceLoading,
      isValidatingProject,
    });
    return (
      <Layout>
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
          }}
        >
          <LottieLoading />
        </div>
      </Layout>
    );
  }

  console.log('🎨 [KanbanPage] Renderizando conteúdo:', {
    finalTeamId,
    finalProjectId,
    selectedProjectId,
    hasTeamAndProject: !!(finalTeamId && finalProjectId),
  });

  // Validar se finalTeamId é realmente válido para renderização
  const isValidFinalTeamIdForRender =
    finalTeamId &&
    finalTeamId !== 'undefined' &&
    finalTeamId !== 'null' &&
    finalTeamId.trim() !== '';

  console.log('🎨 [KanbanPage] Renderizando conteúdo:', {
    finalTeamId,
    isValidFinalTeamIdForRender,
    finalProjectId,
    selectedProjectId,
    hasTeamAndProject: !!(isValidFinalTeamIdForRender && finalProjectId),
  });

  // Só mostrar o board após validar o projeto quando temos projectId (evita 2ª chamada getProjectById no board)
  const canShowBoard =
    isValidFinalTeamIdForRender &&
    finalProjectId &&
    (validatedProjectId === finalProjectId || !isValidatingProject);

  // Renderizar KanbanBoard quando há projeto selecionado
  // Sempre mostrar o ProjectSelect, mesmo sem projeto selecionado
  return (
    <Layout>
      {canShowBoard ? (
        <KanbanBoardComponent
          initialTeamId={finalTeamId}
          initialProjectId={finalProjectId}
          initialProjectData={
            validatedProjectData?.id === finalProjectId
              ? validatedProjectData
              : undefined
          }
          isPersonalWorkspace={isPersonalWorkspace}
          selectedProjectId={selectedProjectId}
          onProjectChange={handleProjectChange}
        />
      ) : (
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}
            >
              Funil:
            </label>
            <ProjectSelect
              selectedProjectId={selectedProjectId}
              onProjectChange={handleProjectChange}
            />
          </div>
          {finalProjectId && (!finalTeamId || isValidatingProject) ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Carregando informações do funil...
              </p>
            </div>
          ) : !finalProjectId ? (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Selecione um funil para começar
              </p>
            </div>
          ) : null}
        </div>
      )}
    </Layout>
  );
};

export default KanbanPage;
