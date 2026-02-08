/**
 * Utilitários para validações e ações condicionais no Kanban
 * Implementa a lógica de fromColumnId e requireAdjacentPosition
 */

import type { KanbanColumn } from '../types/kanban';
import type {
  ColumnValidation,
  ColumnAction,
  ActionTrigger,
} from '../types/kanbanValidations';

/**
 * Verifica se duas colunas são adjacentes (posição ±1)
 * ⚠️ IMPORTANTE: Movimento para trás é permitido, mas validações/ações com requireAdjacentPosition
 * só se aplicam quando o movimento é para frente (toPosition = fromPosition + 1)
 */
export const isAdjacent = (
  fromPosition: number,
  toPosition: number
): boolean => {
  // Verifica se são adjacentes (posição ±1)
  return Math.abs(toPosition - fromPosition) === 1;
};

/**
 * Verifica se o movimento é para frente (toPosition = fromPosition + 1)
 * ⚠️ IMPORTANTE: Validações/ações com requireAdjacentPosition só se aplicam para movimento para frente
 */
export const isForwardMovement = (
  fromPosition: number,
  toPosition: number
): boolean => {
  return toPosition === fromPosition + 1;
};

/**
 * Obtém as validações aplicáveis para uma transição entre colunas
 * Considera fromColumnId, toColumnId e requireAdjacentPosition
 *
 * ⚠️ IMPORTANTE: A validação deve estar na coluna de DESTINO (toColumnId ou columnId)
 * e só se aplica se vier da coluna de ORIGEM especificada (fromColumnId)
 */
export const getApplicableValidations = (
  columns: KanbanColumn[],
  fromColumnId: string,
  toColumnId: string,
  validations: ColumnValidation[]
): ColumnValidation[] => {
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);

  if (!fromColumn || !toColumn) {
    return [];
  }

  const fromPosition = fromColumn.position;
  const toPosition = toColumn.position;

  return validations.filter(validation => {
    // Só considerar validações ativas
    if (!validation.isActive) {
      return false;
    }

    // ✅ IMPORTANTE: A validação deve estar na coluna de DESTINO (toColumnId ou columnId)
    const isInDestinationColumn =
      validation.toColumnId === toColumnId ||
      validation.columnId === toColumnId;

    if (!isInDestinationColumn) {
      return false;
    }

    // Se tem fromColumnId definido, só aplica se a origem corresponder
    if (validation.fromColumnId && validation.fromColumnId !== fromColumnId) {
      return false;
    }

    // Se requireAdjacentPosition é true, verificar se são adjacentes E movimento é para frente
    // ⚠️ IMPORTANTE: Movimento para trás NÃO aplica a validação - permite que o usuário volte sem ser bloqueado
    if (validation.requireAdjacentPosition) {
      // Verificar se são adjacentes
      if (Math.abs(toPosition - fromPosition) !== 1) {
        return false; // Não são adjacentes
      }
      // Verificar se é movimento para frente
      if (!isForwardMovement(fromPosition, toPosition)) {
        return false; // Movimento para trás não aplica validação
      }
    }

    return true;
  });
};

/**
 * Obtém as ações aplicáveis para uma transição entre colunas
 * Considera fromColumnId, toColumnId, requireAdjacentPosition e trigger (ON_ENTER/ON_EXIT)
 *
 * ⚠️ IMPORTANTE:
 * - Para ON_ENTER: A ação deve estar na coluna de DESTINO (toColumnId ou columnId)
 * - Para ON_EXIT: A ação deve estar na coluna de ORIGEM (fromColumnId ou columnId)
 * - fromColumnId na ação sempre se refere à coluna de ORIGEM do movimento
 */
export const getApplicableActions = (
  columns: KanbanColumn[],
  fromColumnId: string,
  toColumnId: string,
  trigger: ActionTrigger,
  actions: ColumnAction[]
): ColumnAction[] => {
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);

  if (!fromColumn || !toColumn) {
    return [];
  }

  const fromPosition = fromColumn.position;
  const toPosition = toColumn.position;

  // ✅ Filtrar ações da coluna correta baseado no trigger
  // Para ON_ENTER: ações da coluna de destino (toColumnId)
  // Para ON_EXIT: ações da coluna de origem (fromColumnId)
  const targetColumnActions = actions.filter(action => {
    if (trigger === 'on_enter') {
      // Ação deve estar na coluna de destino
      return action.toColumnId === toColumnId || action.columnId === toColumnId;
    } else if (trigger === 'on_exit') {
      // Ação deve estar na coluna de origem
      return (
        action.toColumnId === fromColumnId || action.columnId === fromColumnId
      );
    } else {
      // Para ON_STAY, verificar se está na coluna atual (toColumnId)
      return action.toColumnId === toColumnId || action.columnId === toColumnId;
    }
  });

  return targetColumnActions.filter(action => {
    // Só considerar ações ativas e com o trigger correto
    if (!action.isActive || action.trigger !== trigger) {
      return false;
    }

    // ✅ Para ON_ENTER: fromColumnId na ação se refere à coluna de ORIGEM do movimento
    // ✅ Para ON_EXIT: fromColumnId na ação se refere à coluna de DESTINO do movimento (para onde estava indo)
    // Mas segundo a doc, fromColumnId sempre se refere à origem, então:
    // - ON_ENTER: fromColumnId deve ser igual a fromColumnId (origem do movimento)
    // - ON_EXIT: fromColumnId deve ser igual a toColumnId (destino do movimento, de onde está saindo)
    const expectedFromColumnId =
      trigger === 'on_exit'
        ? toColumnId // Ao sair, fromColumnId se refere ao destino (para onde estava indo)
        : fromColumnId; // Ao entrar, fromColumnId se refere à origem (de onde veio)

    // Se tem fromColumnId definido, só aplica se corresponder
    if (action.fromColumnId && action.fromColumnId !== expectedFromColumnId) {
      return false;
    }

    // Se requireAdjacentPosition é true, verificar se são adjacentes E movimento é para frente
    // ⚠️ IMPORTANTE: Movimento para trás NÃO executa a ação - permite que o usuário volte sem executar ações automáticas
    if (action.requireAdjacentPosition) {
      // Verificar se são adjacentes
      if (Math.abs(toPosition - fromPosition) !== 1) {
        return false; // Não são adjacentes
      }
      // Verificar se é movimento para frente
      if (!isForwardMovement(fromPosition, toPosition)) {
        return false; // Movimento para trás não executa ação
      }
    }

    return true;
  });
};

/**
 * Verifica se um movimento é permitido considerando validações de posição adjacente
 *
 * ⚠️ IMPORTANTE: Verifica validações na coluna de DESTINO (toColumnId ou columnId)
 * que requerem posição adjacente e que se aplicam à origem especificada
 */
export const canMoveToColumn = (
  columns: KanbanColumn[],
  fromColumnId: string,
  toColumnId: string,
  validations: ColumnValidation[]
): { canMove: boolean; reason?: string } => {
  const fromColumn = columns.find(c => c.id === fromColumnId);
  const toColumn = columns.find(c => c.id === toColumnId);

  if (!fromColumn || !toColumn) {
    return { canMove: false, reason: 'Coluna não encontrada' };
  }

  const fromPosition = fromColumn.position;
  const toPosition = toColumn.position;

  // ✅ Verificar validações que requerem posição adjacente na coluna de DESTINO
  // ⚠️ IMPORTANTE: requireAdjacentPosition só permite movimento para frente (toPosition = fromPosition + 1)
  const adjacentValidations = validations.filter(
    v =>
      v.isActive &&
      v.requireAdjacentPosition &&
      // A validação deve estar na coluna de destino
      (v.toColumnId === toColumnId || v.columnId === toColumnId) &&
      // Se tem fromColumnId, deve corresponder à origem
      (!v.fromColumnId || v.fromColumnId === fromColumnId)
  );

  // ⚠️ IMPORTANTE: Movimento para trás é permitido, mas validações com requireAdjacentPosition
  // só se aplicam quando o movimento é para frente (toPosition = fromPosition + 1)
  // Se houver validações adjacentes e o movimento for para trás, não aplicar (permitir movimento)
  if (adjacentValidations.length > 0) {
    const isForward = isForwardMovement(fromPosition, toPosition);
    if (!isForward) {
      // Movimento para trás: não aplicar validação, permitir movimento
      return { canMove: true };
    }
    // Movimento para frente: aplicar validação normalmente
    // (a validação já foi filtrada acima para garantir que se aplica)
  }

  return { canMove: true };
};

/**
 * Valida uma tarefa localmente contra validações aplicáveis
 * Retorna warnings e errors separados
 */
export const validateTaskForValidations = (
  task: any, // KanbanTask
  validations: ColumnValidation[]
): {
  valid: boolean;
  hasBlockingErrors: boolean;
  warnings: string[];
  errors: string[];
} => {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const validation of validations) {
    // Aqui você pode implementar validação local se necessário
    // Por enquanto, apenas coletamos as mensagens
    // A validação real é feita no backend

    if (validation.behavior === 'block') {
      // Para validações que bloqueiam, adicionar como erro
      errors.push(validation.message);
    } else if (validation.behavior === 'warn') {
      // Para validações que avisam, adicionar como warning
      warnings.push(validation.message);
    }
    // Para mark_incomplete, não adicionamos nada aqui
  }

  return {
    valid: errors.length === 0,
    hasBlockingErrors: errors.length > 0,
    warnings,
    errors,
  };
};

/**
 * Verifica se uma coluna e sua coluna relacionada (adjacente) podem ser movidas
 * Se uma coluna tem validação/ação para a próxima coluna, ambas não podem ser movidas
 *
 * Exemplo:
 * - Coluna 0 tem ação para Coluna 1 → Coluna 0 e Coluna 1 não podem ser movidas
 * - Coluna 2 tem validação para Coluna 3 → Coluna 2 e Coluna 3 não podem ser movidas
 */
export const canMoveColumnWithRelations = (
  columnId: string,
  columns: KanbanColumn[],
  allValidations: ColumnValidation[],
  allActions: ColumnAction[]
): {
  canMove: boolean;
  reason?: string;
  relatedColumnId?: string;
  relatedColumnName?: string;
} => {
  const column = columns.find(c => c.id === columnId);
  if (!column) {
    return { canMove: false, reason: 'Coluna não encontrada' };
  }

  const columnPosition = column.position;

  // Encontrar a coluna seguinte (posição + 1)
  const nextColumn = columns.find(c => c.position === columnPosition + 1);

  // Verificar se a próxima coluna tem validações/ações
  // Se a coluna seguinte tem validação/ação, a coluna atual não pode ser movida
  // IMPORTANTE: Se a próxima coluna tem validação/ação (mesmo com fromColumnId: null),
  // ambas as colunas não podem ser movidas para preservar a relação
  const nextColumnHasValidation =
    nextColumn &&
    allValidations.some(v => {
      if (!v.isActive) return false;
      // Se a validação está na próxima coluna (columnId ou toColumnId)
      // (independente do fromColumnId, pois a validação existe e pode afetar a relação)
      return v.columnId === nextColumn.id || v.toColumnId === nextColumn.id;
    });

  const nextColumnHasAction =
    nextColumn &&
    allActions.some(a => {
      if (!a.isActive) return false;
      // Se a ação está na próxima coluna, bloqueia a movimentação
      // (independente do fromColumnId, pois a ação existe e pode afetar a relação)
      return a.columnId === nextColumn.id || a.toColumnId === nextColumn.id;
    });

  // Verificar se esta coluna tem validações/ações que apontam para a próxima coluna
  const hasValidationToNext =
    nextColumn &&
    allValidations.some(v => {
      if (!v.isActive) return false;
      // A validação está nesta coluna (columnId = columnId) E tem toColumnId = próxima coluna
      return v.columnId === columnId && v.toColumnId === nextColumn.id;
    });

  const hasActionToNext =
    nextColumn &&
    allActions.some(a => {
      if (!a.isActive) return false;
      // A ação está nesta coluna (columnId = columnId) E tem toColumnId = próxima coluna
      return a.columnId === columnId && a.toColumnId === nextColumn.id;
    });

  // Se a próxima coluna tem validação/ação OU esta coluna tem validação/ação para a próxima, ambas não podem ser movidas
  if (
    nextColumnHasValidation ||
    nextColumnHasAction ||
    hasValidationToNext ||
    hasActionToNext
  ) {
    const reasons: string[] = [];
    if (nextColumnHasValidation || hasValidationToNext)
      reasons.push('validação');
    if (nextColumnHasAction || hasActionToNext) reasons.push('ação');

    return {
      canMove: false,
      reason: `A coluna seguinte possui ${reasons.join(' e ')} configurada. Ambas as colunas não podem ser movidas para preservar a relação entre elas.`,
      relatedColumnId: nextColumn?.id,
      relatedColumnName: nextColumn?.title,
    };
  }

  // Verificar se esta coluna tem validações/ações (ela mesma é destino)
  // Se esta coluna tem validação/ação, ela não pode ser movida (e a anterior também não, se existir)
  const thisColumnHasValidation = allValidations.some(v => {
    if (!v.isActive) return false;
    // Se a validação está nesta coluna (columnId ou toColumnId)
    return v.columnId === columnId || v.toColumnId === columnId;
  });

  const thisColumnHasAction = allActions.some(a => {
    if (!a.isActive) return false;
    // Se a ação está nesta coluna (columnId ou toColumnId)
    return a.columnId === columnId || a.toColumnId === columnId;
  });

  // Se esta coluna tem validação/ação, ela não pode ser movida
  // Verificar se alguma coluna anterior tem validação/ação apontando para esta coluna
  const previousColumn = columns.find(c => c.position === columnPosition - 1);
  if (previousColumn) {
    // Se esta coluna tem validação/ação, verificar se está relacionada com a anterior
    const previousHasValidationToThis =
      thisColumnHasValidation &&
      allValidations.some(v => {
        if (!v.isActive || v.columnId !== columnId) return false;
        // Se fromColumnId é null, se aplica a qualquer origem (incluindo coluna anterior)
        // Se fromColumnId é coluna anterior, se aplica especificamente da coluna anterior
        return v.fromColumnId === null || v.fromColumnId === previousColumn.id;
      });

    const previousHasActionToThis =
      thisColumnHasAction &&
      allActions.some(a => {
        if (!a.isActive || a.columnId !== columnId) return false;
        // Se fromColumnId é null, se aplica a qualquer origem (incluindo coluna anterior)
        // Se fromColumnId é coluna anterior, se aplica especificamente da coluna anterior
        return a.fromColumnId === null || a.fromColumnId === previousColumn.id;
      });

    // Se esta coluna tem validação/ação (mesmo sem relação específica com anterior), bloquear
    // IMPORTANTE: Se a coluna tem validação/ação, ela não pode ser movida
    if (thisColumnHasValidation || thisColumnHasAction) {
      const reasons: string[] = [];
      if (thisColumnHasValidation) reasons.push('validação');
      if (thisColumnHasAction) reasons.push('ação');

      // Se está relacionada com a anterior, mencionar ambas
      if (previousHasValidationToThis || previousHasActionToThis) {
        return {
          canMove: false,
          reason: `A coluna anterior possui ${reasons.join(' e ')} configurada para esta coluna. Ambas as colunas não podem ser movidas para preservar a relação entre elas.`,
          relatedColumnId: previousColumn.id,
          relatedColumnName: previousColumn.title,
        };
      }

      // Se não está relacionada especificamente, mas tem validação/ação, bloquear mesmo assim
      return {
        canMove: false,
        reason: `Esta coluna possui ${reasons.join(' e ')} configurada. A coluna anterior e esta coluna não podem ser movidas para preservar a relação entre elas.`,
        relatedColumnId: previousColumn.id,
        relatedColumnName: previousColumn.title,
      };
    }
  } else {
    // Se não tem coluna anterior mas esta coluna tem validação/ação, bloquear
    if (thisColumnHasValidation || thisColumnHasAction) {
      // Se não tem coluna anterior mas esta coluna tem validação/ação, ela não pode ser movida sozinha
      // (mas isso é menos comum, geralmente validações são entre colunas adjacentes)
      const reasons: string[] = [];
      if (thisColumnHasValidation) reasons.push('validação');
      if (thisColumnHasAction) reasons.push('ação');

      return {
        canMove: false,
        reason: `Esta coluna possui ${reasons.join(' e ')} configurada e não pode ser movida.`,
      };
    }
  }

  return { canMove: true };
};

/**
 * Verifica se uma coluna está sendo usada em validações ou ações
 * Retorna informações sobre onde a coluna está sendo usada
 * Agora verifica tanto como origem (fromColumnId) quanto como destino (columnId/toColumnId)
 */
export const isColumnUsedInValidationsOrActions = (
  columnId: string,
  allValidations: ColumnValidation[],
  allActions: ColumnAction[]
): {
  isUsed: boolean;
  usedInValidations: Array<{
    validationId: string;
    columnId: string;
    message: string;
    role: 'origin' | 'destination';
  }>;
  usedInActions: Array<{
    actionId: string;
    columnId: string;
    trigger: string;
    role: 'origin' | 'destination';
  }>;
  reason?: string;
} => {
  const usedInValidations: Array<{
    validationId: string;
    columnId: string;
    message: string;
    role: 'origin' | 'destination';
  }> = [];
  const usedInActions: Array<{
    actionId: string;
    columnId: string;
    trigger: string;
    role: 'origin' | 'destination';
  }> = [];

  // Verificar validações
  for (const validation of allValidations) {
    if (!validation.isActive) continue;

    // Verificar se a coluna está sendo usada como coluna de destino (toColumnId ou columnId)
    const isDestination =
      validation.columnId === columnId || validation.toColumnId === columnId;
    if (isDestination) {
      usedInValidations.push({
        validationId: validation.id,
        columnId: validation.columnId,
        message: validation.message,
        role: 'destination',
      });
    }

    // Verificar se a coluna está sendo usada como coluna de origem (fromColumnId)
    if (validation.fromColumnId === columnId) {
      usedInValidations.push({
        validationId: validation.id,
        columnId: validation.columnId,
        message: validation.message,
        role: 'origin',
      });
    }
  }

  // Verificar ações
  for (const action of allActions) {
    if (!action.isActive) continue;

    // Verificar se a coluna está sendo usada como coluna de destino (toColumnId ou columnId)
    const isDestination =
      action.columnId === columnId || action.toColumnId === columnId;
    if (isDestination) {
      usedInActions.push({
        actionId: action.id,
        columnId: action.columnId,
        trigger: action.trigger,
        role: 'destination',
      });
    }

    // Verificar se a coluna está sendo usada como coluna de origem (fromColumnId)
    if (action.fromColumnId === columnId) {
      usedInActions.push({
        actionId: action.id,
        columnId: action.columnId,
        trigger: action.trigger,
        role: 'origin',
      });
    }
  }

  const isUsed = usedInValidations.length > 0 || usedInActions.length > 0;

  let reason = '';
  if (isUsed) {
    const reasons: string[] = [];
    if (usedInValidations.length > 0) {
      const asOrigin = usedInValidations.filter(
        v => v.role === 'origin'
      ).length;
      const asDestination = usedInValidations.filter(
        v => v.role === 'destination'
      ).length;
      const parts: string[] = [];
      if (asOrigin > 0) parts.push(`${asOrigin} como origem`);
      if (asDestination > 0) parts.push(`${asDestination} como destino`);
      reasons.push(
        `${usedInValidations.length} validação(ões) (${parts.join(', ')})`
      );
    }
    if (usedInActions.length > 0) {
      const asOrigin = usedInActions.filter(a => a.role === 'origin').length;
      const asDestination = usedInActions.filter(
        a => a.role === 'destination'
      ).length;
      const parts: string[] = [];
      if (asOrigin > 0) parts.push(`${asOrigin} como origem`);
      if (asDestination > 0) parts.push(`${asDestination} como destino`);
      reasons.push(`${usedInActions.length} ação(ões) (${parts.join(', ')})`);
    }
    reason = `Esta coluna está sendo usada em ${reasons.join(' e ')}. Remova ou desative essas configurações antes de movê-la ou excluí-la.`;
  }

  return {
    isUsed,
    usedInValidations,
    usedInActions,
    reason,
  };
};
