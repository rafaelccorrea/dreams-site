import { useEffect, useRef } from 'react';
import { useCompanyContext } from '../contexts';

/**
 * Hook para monitorar mudanças na empresa selecionada
 * Dispara callbacks quando a empresa é alterada
 */
export const useCompanyMonitor = (
  onCompanyChange?: (companyId: string | null) => void
) => {
  const { selectedCompany } = useCompanyContext();
  const previousCompanyId = useRef<string | null>(null);

  useEffect(() => {
    const currentCompanyId = selectedCompany?.id || null;

    // Verificar se a empresa mudou
    if (previousCompanyId.current !== currentCompanyId) {
      // Disparar callback se fornecido
      if (onCompanyChange) {
        onCompanyChange(currentCompanyId);
      }

      // Atualizar referência
      previousCompanyId.current = currentCompanyId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany?.id]);

  return {
    currentCompanyId: selectedCompany?.id || null,
    currentCompany: selectedCompany,
    hasCompany: !!selectedCompany,
  };
};

/**
 * Hook para recarregar dados automaticamente quando a empresa muda
 * @param reloadFunction - Função a ser executada quando a empresa mudar
 * @param enabled - Se false, o hook não fará nada (padrão: true)
 */
export const useAutoReloadOnCompanyChange = (
  reloadFunction: () => void | Promise<void>,
  enabled: boolean = true
): void => {
  const { selectedCompany } = useCompanyContext();
  const previousCompanyId = useRef<string | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Se desabilitado, não fazer nada
    if (!enabled) {
      return;
    }

    const currentCompanyId = selectedCompany?.id || null;

    // Pular o primeiro carregamento (inicialização)
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      previousCompanyId.current = currentCompanyId;
      return;
    }

    // Verificar se a empresa mudou
    if (previousCompanyId.current !== currentCompanyId) {
      // Recarregar dados
      const handleReload = async () => {
        try {
          // Aguardar um pouco para garantir que o localStorage foi atualizado
          await new Promise(resolve => setTimeout(resolve, 100));

          // console.log('🔄 Executando função de recarregamento após mudança de empresa...');
          await reloadFunction();
          // console.log('✅ Dados recarregados com sucesso após mudança de empresa');
        } catch (error) {
          console.error(
            '❌ Erro ao recarregar dados após mudança de empresa:',
            error
          );
        }
      };

      handleReload();

      // Atualizar referência
      previousCompanyId.current = currentCompanyId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, selectedCompany?.id]);
};
