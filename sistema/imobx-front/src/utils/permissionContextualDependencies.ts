/**
 * Sistema de Dependências Contextuais de Permissões
 *
 * Este arquivo define dependências entre permissões de diferentes módulos
 * que são necessárias para executar uma funcionalidade específica.
 *
 * Exemplo: Para criar um documento, você pode precisar de:
 * - document:create (permissão principal)
 * - property:view (para vincular documento a uma propriedade)
 * - client:view (para vincular documento a um cliente)
 *
 * IMPORTANTE: Essas são dependências de UI/Funcionalidade, não de permissões automáticas.
 * Se o usuário não tem a dependência, a funcionalidade relacionada deve ser ocultada/desabilitada.
 */

export interface ContextualDependency {
  /**
   * Permissão principal que requer outras permissões
   */
  permission: string;

  /**
   * Contexto onde essa dependência se aplica
   */
  context?: string;

  /**
   * Permissões que são necessárias para usar completamente a funcionalidade
   * Se o usuário não tiver essas permissões, partes da funcionalidade devem ser ocultas
   */
  requiredFor?: string[];

  /**
   * Permissões que são opcionais mas melhoram a experiência
   */
  optionalFor?: string[];

  /**
   * Mensagem explicativa sobre a dependência
   */
  description?: string;
}

/**
 * Mapeamento de dependências contextuais
 *
 * Estrutura: {
 *   'permissão:ação': {
 *     requiredFor: ['funcionalidade1', 'funcionalidade2'],
 *     optionalFor: ['funcionalidade3']
 *   }
 * }
 */
export const CONTEXTUAL_DEPENDENCIES: Record<string, ContextualDependency> = {
  // Documentos
  'document:create': {
    permission: 'document:create',
    context: 'create_document',
    requiredFor: [
      'vincular_documento_cliente', // Requer client:view
      'vincular_documento_propriedade', // Requer property:view
    ],
    description:
      'Para criar documentos, você precisa poder visualizar clientes ou propriedades para vincular o documento',
  },
  'document:update': {
    permission: 'document:update',
    context: 'edit_document',
    requiredFor: [
      'alterar_vinculo_cliente', // Requer client:view
      'alterar_vinculo_propriedade', // Requer property:view
    ],
    description:
      'Para editar documentos, você precisa poder visualizar clientes ou propriedades para alterar o vínculo',
  },

  // Vistorias
  'inspection:create': {
    permission: 'inspection:create',
    context: 'create_inspection',
    requiredFor: [
      'vincular_vistoria_propriedade', // Requer property:view
    ],
    description:
      'Para criar vistorias, você precisa poder visualizar propriedades',
  },
  'inspection:update': {
    permission: 'inspection:update',
    context: 'edit_inspection',
    requiredFor: [
      'alterar_propriedade_vistoria', // Requer property:view
    ],
    description:
      'Para editar vistorias, você precisa poder visualizar propriedades',
  },

  // Chaves
  'key:create': {
    permission: 'key:create',
    context: 'create_key',
    requiredFor: [
      'vincular_chave_propriedade', // Requer property:view
    ],
    description:
      'Para criar chaves, você precisa poder visualizar propriedades',
  },
  'key:update': {
    permission: 'key:update',
    context: 'edit_key',
    requiredFor: [
      'alterar_propriedade_chave', // Requer property:view
    ],
    description:
      'Para editar chaves, você precisa poder visualizar propriedades',
  },

  // Aluguéis
  'rental:create': {
    permission: 'rental:create',
    context: 'create_rental',
    requiredFor: [
      'vincular_aluguel_propriedade', // Requer property:view
    ],
    description:
      'Para criar aluguéis, você precisa poder visualizar propriedades',
  },
  'rental:update': {
    permission: 'rental:update',
    context: 'edit_rental',
    requiredFor: [
      'alterar_propriedade_aluguel', // Requer property:view
    ],
    description:
      'Para editar aluguéis, você precisa poder visualizar propriedades',
  },

  // Checklists
  'checklist:create': {
    permission: 'checklist:create',
    context: 'create_checklist',
    requiredFor: [
      'vincular_checklist_cliente', // Requer client:view
      'vincular_checklist_propriedade', // Requer property:view
    ],
    description:
      'Para criar checklists, você precisa poder visualizar clientes ou propriedades',
  },
  'checklist:update': {
    permission: 'checklist:update',
    context: 'edit_checklist',
    requiredFor: [
      'alterar_vinculo_cliente_checklist', // Requer client:view
      'alterar_vinculo_propriedade_checklist', // Requer property:view
    ],
    description:
      'Para editar checklists, você precisa poder visualizar clientes ou propriedades',
  },

  // Propostas
  'proposal:generate': {
    permission: 'proposal:generate',
    context: 'generate_proposal',
    requiredFor: [
      'selecionar_propriedade_proposta', // Requer property:view
      'selecionar_cliente_proposta', // Requer client:view
    ],
    description:
      'Para gerar propostas, você precisa poder visualizar propriedades e clientes',
  },
};

/**
 * Obtém as dependências contextuais de uma permissão
 */
export const getContextualDependencies = (
  permission: string
): ContextualDependency | null => {
  return CONTEXTUAL_DEPENDENCIES[permission] || null;
};

/**
 * Obtém todas as permissões necessárias para uma funcionalidade específica
 *
 * @param permission - Permissão principal
 * @param functionality - Funcionalidade específica (ex: 'vincular_documento_propriedade')
 * @returns Array de permissões necessárias
 */
export const getRequiredPermissionsForFunctionality = (
  permission: string,
  functionality: string
): string[] => {
  const dependency = getContextualDependencies(permission);
  if (!dependency) return [];

  // Mapeamento de funcionalidades para permissões necessárias
  const functionalityPermissions: Record<string, string> = {
    // Documentos
    vincular_documento_cliente: 'client:view',
    vincular_documento_propriedade: 'property:view',
    alterar_vinculo_cliente: 'client:view',
    alterar_vinculo_propriedade: 'property:view',

    // Vistorias
    vincular_vistoria_propriedade: 'property:view',
    alterar_propriedade_vistoria: 'property:view',

    // Chaves
    vincular_chave_propriedade: 'property:view',
    alterar_propriedade_chave: 'property:view',

    // Aluguéis
    vincular_aluguel_propriedade: 'property:view',
    alterar_propriedade_aluguel: 'property:view',

    // Checklists
    vincular_checklist_cliente: 'client:view',
    vincular_checklist_propriedade: 'property:view',
    alterar_vinculo_cliente_checklist: 'client:view',
    alterar_vinculo_propriedade_checklist: 'property:view',

    // Propostas
    selecionar_propriedade_proposta: 'property:view',
    selecionar_cliente_proposta: 'client:view',
  };

  if (dependency.requiredFor?.includes(functionality)) {
    const requiredPermission = functionalityPermissions[functionality];
    return requiredPermission ? [requiredPermission] : [];
  }

  return [];
};

/**
 * Verifica se o usuário pode executar uma funcionalidade específica
 *
 * @param hasPermission - Função que verifica se o usuário tem uma permissão
 * @param permission - Permissão principal
 * @param functionality - Funcionalidade específica
 * @returns true se o usuário pode executar a funcionalidade
 */
export const canExecuteFunctionality = (
  hasPermission: (permission: string) => boolean,
  permission: string,
  functionality: string
): boolean => {
  // Primeiro verifica se tem a permissão principal
  if (!hasPermission(permission)) {
    return false;
  }

  // Verifica se tem as permissões necessárias para a funcionalidade
  const requiredPermissions = getRequiredPermissionsForFunctionality(
    permission,
    functionality
  );
  return requiredPermissions.every(perm => hasPermission(perm));
};

/**
 * Obtém todas as funcionalidades que requerem uma permissão específica
 *
 * @param permission - Permissão a verificar (ex: 'property:view')
 * @returns Array de objetos com permissão principal e funcionalidade
 */
export const getFunctionalitiesRequiringPermission = (
  permission: string
): Array<{
  mainPermission: string;
  functionality: string;
  description?: string;
}> => {
  const result: Array<{
    mainPermission: string;
    functionality: string;
    description?: string;
  }> = [];

  Object.entries(CONTEXTUAL_DEPENDENCIES).forEach(([mainPerm, dependency]) => {
    dependency.requiredFor?.forEach(func => {
      const requiredPerms = getRequiredPermissionsForFunctionality(
        mainPerm,
        func
      );
      if (requiredPerms.includes(permission)) {
        result.push({
          mainPermission: mainPerm,
          functionality: func,
          description: dependency.description,
        });
      }
    });
  });

  return result;
};

/**
 * Obtém mensagem explicativa sobre por que uma funcionalidade está desabilitada
 */
export const getDisabledFunctionalityMessage = (
  permission: string,
  functionality: string
): string | null => {
  const dependency = getContextualDependencies(permission);
  if (!dependency || !dependency.requiredFor?.includes(functionality)) {
    return null;
  }

  const requiredPermissions = getRequiredPermissionsForFunctionality(
    permission,
    functionality
  );
  if (requiredPermissions.length === 0) {
    return null;
  }

  const permissionNames: Record<string, string> = {
    'client:view': 'visualizar clientes',
    'property:view': 'visualizar propriedades',
  };

  const missingPerms = requiredPermissions
    .map(perm => permissionNames[perm] || perm)
    .join(' e ');

  return `Esta funcionalidade requer permissão para ${missingPerms}. Entre em contato com um administrador para solicitar acesso.`;
};
