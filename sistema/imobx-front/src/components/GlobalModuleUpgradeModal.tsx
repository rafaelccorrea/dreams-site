import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleAccess } from '../contexts/ModuleAccessContext';
import { ModuleUpgradeModal } from './modals/ModuleUpgradeModal';

/**
 * Componente global que escuta eventos de módulo não disponível
 * e exibe o modal de upgrade automaticamente
 */
export const GlobalModuleUpgradeModal: React.FC = () => {
  const {
    showModuleUpgradeModal,
    hideModuleUpgradeModal,
    isModalOpen,
    currentModule,
    currentDescription,
  } = useModuleAccess();
  const navigate = useNavigate();

  useEffect(() => {
    const handleModuleNotAvailable = (event: CustomEvent) => {
      const { moduleName, errorMessage } = event.detail;

      // Descrições personalizadas para cada módulo
      const moduleDescriptions: Record<string, string> = {
        vistoria:
          'O módulo de Vistorias permite gerenciar inspeções de imóveis, criar relatórios detalhados e acompanhar o histórico de vistorias.',
        vistorias:
          'O módulo de Vistorias permite gerenciar inspeções de imóveis, criar relatórios detalhados e acompanhar o histórico de vistorias.',
        kanban:
          'O módulo Kanban permite gerenciar tarefas visualmente, organizar fluxos de trabalho e acompanhar o progresso da sua equipe.',
        financeiro:
          'O módulo Financeiro permite controlar receitas, despesas, comissões e gerar relatórios financeiros completos.',
        relatorios:
          'O módulo de Relatórios permite gerar análises avançadas, dashboards personalizados e exportar dados.',
        teams:
          'O módulo de Equipes permite gerenciar times, atribuir membros e organizar a estrutura da sua empresa.',
        gamification:
          'O módulo de Gamificação permite criar desafios, competições e motivar sua equipe com rankings.',
      };

      const description =
        moduleDescriptions[moduleName.toLowerCase()] ||
        `O módulo ${moduleName} não está incluído no seu plano atual.`;

      showModuleUpgradeModal(moduleName, description);
    };

    // Adicionar listener para o evento customizado
    window.addEventListener(
      'module-not-available',
      handleModuleNotAvailable as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        'module-not-available',
        handleModuleNotAvailable as EventListener
      );
    };
  }, [showModuleUpgradeModal]);

  const handleClose = () => {
    hideModuleUpgradeModal();
    // Voltar para dashboard quando fechar o modal
    navigate('/dashboard');
  };

  if (!currentModule) return null;

  return (
    <ModuleUpgradeModal
      isOpen={isModalOpen}
      onClose={handleClose}
      moduleName={currentModule}
      moduleDescription={currentDescription || undefined}
    />
  );
};
