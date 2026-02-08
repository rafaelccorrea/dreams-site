/**
 * Utilitário para gerenciar dependências de permissões
 *
 * Regra: Permissões de ação (create, edit, delete, update) sempre requerem a permissão de view
 * Exemplo: Se tem "client:create", precisa ter "client:view"
 */

export interface PermissionDependency {
  permission: string;
  requires: string[];
  description: string;
}

/**
 * Extrai a categoria de uma permissão
 * Exemplo: "client:create" -> "client"
 */
export const getPermissionCategory = (permissionName: string): string => {
  const parts = permissionName.split(':');
  return parts[0] || '';
};

/**
 * Extrai a ação de uma permissão
 * Exemplo: "client:create" -> "create"
 */
export const getPermissionAction = (permissionName: string): string => {
  const parts = permissionName.split(':');
  return parts[1] || '';
};

/**
 * REGRA SIMPLIFICADA: Qualquer permissão que NÃO seja 'view' automaticamente requer 'view'
 *
 * Exemplos:
 * - client:create → requer client:view
 * - client:transfer → requer client:view
 * - property:edit → requer property:view
 * - user:manage → requer user:view
 * - client:view → NÃO requer nada adicional
 */

/**
 * Verifica se uma permissão requer a permissão de view
 * REGRA: Qualquer permissão que NÃO seja 'view' ou 'read' automaticamente requer 'view'
 */
export const requiresViewPermission = (permissionName: string): boolean => {
  const action = getPermissionAction(permissionName);
  // Qualquer ação que não seja 'view' ou 'read' requer permissão de view/read
  return action !== 'view' && action !== 'read';
};

/**
 * Obtém a permissão de view correspondente
 * Exemplo: "client:create" -> "client:view"
 * Casos especiais que usam 'read' ao invés de 'view':
 * - "document:download" -> "document:read"
 * - "client:export" -> "client:read"
 */
export const getViewPermission = (permissionName: string): string => {
  const category = getPermissionCategory(permissionName);

  // CASOS ESPECIAIS: Algumas categorias usam 'read' ao invés de 'view'
  const categoriesWithRead = ['document', 'client'];

  if (categoriesWithRead.includes(category)) {
    return `${category}:read`;
  }

  return `${category}:view`;
};

/**
 * Obtém todas as permissões necessárias (incluindo dependências)
 *
 * @param permissionName - Nome da permissão (ex: "client:create")
 * @returns Array com a permissão e suas dependências
 *
 * REGRAS ESPECIAIS:
 * - performance:compare → Inclui automaticamente todas as 4 permissões de performance
 *   (compare, view, view_team, view_company)
 * - property:* → Inclui automaticamente as permissões correspondentes de gallery
 * - Qualquer ação que não seja 'view' → Requer a permissão 'view' correspondente
 */
export const getRequiredPermissions = (permissionName: string): string[] => {
  const required: string[] = [permissionName];

  // REGRA ESPECIAL: performance:compare inclui TODAS as permissões de performance
  // Isso unifica as 4 permissões em uma única seleção no front
  // Quando o usuário marca "performance:compare", envia automaticamente:
  // - performance:compare
  // - performance:view
  // - performance:view_team
  // - performance:view_company
  if (permissionName === 'performance:compare') {
    required.push(
      'performance:view',
      'performance:view_team',
      'performance:view_company'
    );
    return required;
  }

  // REGRA ESPECIAL: team:view requer user:view automaticamente
  // Não é possível ver equipes sem poder ver os usuários que compõem essas equipes
  if (permissionName === 'team:view' || permissionName.startsWith('team:')) {
    if (!required.includes('user:view')) {
      required.unshift('user:view');
    }
  }

  if (requiresViewPermission(permissionName)) {
    const viewPermission = getViewPermission(permissionName);
    // Adiciona a permissão de view no início (mais importante)
    required.unshift(viewPermission);
  }

  // REGRA ESPECIAL: Permissões de propriedade requerem permissões de galeria
  // Galeria é uma extensão de propriedades (fotos das propriedades)
  const category = getPermissionCategory(permissionName);
  if (category === 'property') {
    // Adicionar todas as permissões de galeria correspondentes
    const action = getPermissionAction(permissionName);
    const galleryPermission = `gallery:${action}`;
    required.push(galleryPermission);
  }

  return required;
};

/**
 * Adiciona uma permissão e suas dependências automaticamente
 *
 * @param currentPermissions - Array com IDs das permissões atuais
 * @param newPermissionId - ID da nova permissão a adicionar
 * @param allPermissions - Array com todas as permissões disponíveis
 * @returns Novo array com a permissão e suas dependências
 */
export const addPermissionWithDependencies = (
  currentPermissions: string[],
  newPermissionId: string,
  allPermissions: Array<{ id: string; name: string }>
): {
  permissions: string[];
  addedDependencies: string[];
  galleryPermissionsAdded: string[];
} => {
  const newPermission = allPermissions.find(p => p.id === newPermissionId);
  if (!newPermission) {
    return {
      permissions: currentPermissions,
      addedDependencies: [],
      galleryPermissionsAdded: [],
    };
  }

  const requiredPermissionNames = getRequiredPermissions(newPermission.name);
  const addedDependencies: string[] = [];
  const galleryPermissionsAdded: string[] = [];

  // Encontrar IDs das permissões requeridas
  const requiredPermissionIds = requiredPermissionNames
    .map(name => {
      const perm = allPermissions.find(p => p.name === name);
      return perm?.id;
    })
    .filter((id): id is string => id !== undefined);

  // Adicionar apenas as permissões que ainda não estão no array
  const permissionsToAdd = requiredPermissionIds.filter(id => {
    const shouldAdd = !currentPermissions.includes(id);
    if (shouldAdd && id !== newPermissionId) {
      const perm = allPermissions.find(p => p.id === id);
      // Separar permissões de galeria das outras dependências
      if (perm && perm.name.startsWith('gallery:')) {
        galleryPermissionsAdded.push(id);
      } else {
        addedDependencies.push(id);
      }
    }
    return shouldAdd;
  });

  return {
    permissions: [...currentPermissions, ...permissionsToAdd],
    addedDependencies,
    galleryPermissionsAdded,
  };
};

/**
 * Remove uma permissão verificando se outras permissões dependem dela
 *
 * @param currentPermissions - Array com IDs das permissões atuais
 * @param permissionIdToRemove - ID da permissão a remover
 * @param allPermissions - Array com todas as permissões disponíveis
 * @returns Objeto com novo array e permissões que dependem desta
 */
export const removePermissionCheckDependencies = (
  currentPermissions: string[],
  permissionIdToRemove: string,
  allPermissions: Array<{ id: string; name: string }>
): {
  permissions: string[];
  dependentPermissions: string[];
  canRemove: boolean;
  galleryPermissionsRemoved: string[];
} => {
  const permissionToRemove = allPermissions.find(
    p => p.id === permissionIdToRemove
  );
  if (!permissionToRemove) {
    return {
      permissions: currentPermissions,
      dependentPermissions: [],
      canRemove: true,
      galleryPermissionsRemoved: [],
    };
  }

  // Verificar se é uma permissão de view
  const action = getPermissionAction(permissionToRemove.name);
  const category = getPermissionCategory(permissionToRemove.name);

  if (action !== 'view') {
    // Se não é view, pode remover sem problemas
    let newPermissions = currentPermissions.filter(
      id => id !== permissionIdToRemove
    );
    const galleryPermissionsRemoved: string[] = [];

    // REGRA ESPECIAL: Se é uma permissão de property e não resta mais nenhuma, remover galeria
    if (category === 'property') {
      // Remover a permissão correspondente de galeria
      const galleryPermissionName = `gallery:${action}`;
      const galleryPerm = allPermissions.find(
        p => p.name === galleryPermissionName
      );
      if (galleryPerm && newPermissions.includes(galleryPerm.id)) {
        galleryPermissionsRemoved.push(galleryPerm.id);
        newPermissions = newPermissions.filter(id => id !== galleryPerm.id);
      }

      // Se não resta nenhuma permissão de property, remover todas as de galeria
      if (!hasAnyPropertyPermission(newPermissions, allPermissions)) {
        const galleryPerms = newPermissions.filter(id => {
          const perm = allPermissions.find(p => p.id === id);
          return perm && perm.name.startsWith('gallery:');
        });
        galleryPermissionsRemoved.push(...galleryPerms);
        newPermissions = removeAllGalleryPermissions(
          newPermissions,
          allPermissions
        );
      }
    }

    return {
      permissions: newPermissions,
      dependentPermissions: [],
      canRemove: true,
      galleryPermissionsRemoved,
    };
  }

  // Se é view, verificar se há outras permissões que dependem dela
  const dependentPermissions: string[] = [];

  currentPermissions.forEach(permId => {
    if (permId === permissionIdToRemove) return;

    const perm = allPermissions.find(p => p.id === permId);
    if (!perm) return;

    const permCategory = getPermissionCategory(perm.name);
    const permAction = getPermissionAction(perm.name);

    // Se é da mesma categoria e requer view (qualquer ação que não seja 'view')
    if (permCategory === category && permAction !== 'view') {
      dependentPermissions.push(permId);
    }
  });

  // REGRA ESPECIAL: Se está tentando remover user:view, verificar se tem team:view
  // Não é possível remover user:view se tiver team:view (precisa ver usuários para ver equipes)
  if (permissionToRemove.name === 'user:view') {
    const hasTeamView = currentPermissions.some(permId => {
      const perm = allPermissions.find(p => p.id === permId);
      return perm && perm.name.startsWith('team:');
    });

    if (hasTeamView) {
      const teamPerms = currentPermissions
        .map(id => allPermissions.find(p => p.id === id))
        .filter(
          (perm): perm is { id: string; name: string } =>
            perm !== undefined && perm.name.startsWith('team:')
        );

      dependentPermissions.push(...teamPerms.map(p => p.id));
    }
  }

  if (dependentPermissions.length > 0) {
    // Não pode remover, há permissões que dependem dela
    return {
      permissions: currentPermissions,
      dependentPermissions,
      canRemove: false,
      galleryPermissionsRemoved: [],
    };
  }

  // Pode remover
  let newPermissions = currentPermissions.filter(
    id => id !== permissionIdToRemove
  );
  const galleryPermissionsRemoved: string[] = [];

  // REGRA ESPECIAL: Se é property:view e não resta mais nenhuma de property, remover galeria
  if (
    category === 'property' &&
    !hasAnyPropertyPermission(newPermissions, allPermissions)
  ) {
    const galleryPerms = newPermissions.filter(id => {
      const perm = allPermissions.find(p => p.id === id);
      return perm && perm.name.startsWith('gallery:');
    });
    galleryPermissionsRemoved.push(...galleryPerms);
    newPermissions = removeAllGalleryPermissions(
      newPermissions,
      allPermissions
    );
  }

  return {
    permissions: newPermissions,
    dependentPermissions: [],
    canRemove: true,
    galleryPermissionsRemoved,
  };
};

/**
 * Obtém o nome amigável da permissão removendo o prefixo da categoria
 * Exemplo: "client:view" -> "view"
 */
export const getPermissionActionLabel = (permissionName: string): string => {
  return getPermissionAction(permissionName);
};

/**
 * Verifica se ainda existem permissões de propriedade selecionadas
 */
export const hasAnyPropertyPermission = (
  permissions: string[],
  allPermissions: Array<{ id: string; name: string }>
): boolean => {
  return permissions.some(id => {
    const perm = allPermissions.find(p => p.id === id);
    return perm && perm.name.startsWith('property:');
  });
};

/**
 * Remove todas as permissões de galeria
 */
export const removeAllGalleryPermissions = (
  currentPermissions: string[],
  allPermissions: Array<{ id: string; name: string }>
): string[] => {
  return currentPermissions.filter(id => {
    const perm = allPermissions.find(p => p.id === id);
    return !perm || !perm.name.startsWith('gallery:');
  });
};

/**
 * Filtra permissões de galeria e auditoria para não mostrar na interface
 * Galeria é gerenciada automaticamente através de propriedades
 * Auditoria é exclusiva para usuários MASTER via roleRequired
 */
export const filterGalleryPermissions = (
  permissions: Array<{
    id: string;
    name: string;
    category?: string;
    description?: string;
  }>
): Array<{
  id: string;
  name: string;
  category?: string;
  description?: string;
}> => {
  return permissions.filter(
    p =>
      p.category !== 'gallery' &&
      !p.name.startsWith('gallery:') &&
      p.category !== 'audit' &&
      !p.name.startsWith('audit:')
  );
};

/**
 * Obtém mensagem explicativa sobre dependências adicionadas
 */
export const getDependencyMessage = (
  addedDependencies: string[],
  allPermissions: Array<{ id: string; name: string; description?: string }>
): string => {
  if (addedDependencies.length === 0) return '';

  const dependencyNames = addedDependencies
    .map(id => {
      const perm = allPermissions.find(p => p.id === id);
      // Usar descrição amigável ao invés do nome técnico
      return perm?.description || perm?.name || id;
    })
    .join(', ');

  if (addedDependencies.length === 1) {
    return `A permissão "${dependencyNames}" foi adicionada automaticamente pois é necessária.`;
  }

  return `As permissões "${dependencyNames}" foram adicionadas automaticamente pois são necessárias.`;
};

/**
 * Obtém mensagem explicativa sobre permissões dependentes
 */
export const getDependentPermissionsMessage = (
  dependentPermissions: string[],
  allPermissions: Array<{ id: string; name: string; description?: string }>
): string => {
  if (dependentPermissions.length === 0) return '';

  const dependentNames = dependentPermissions
    .map(id => {
      const perm = allPermissions.find(p => p.id === id);
      // Usar descrição amigável ao invés do nome técnico
      return perm?.description || perm?.name || id;
    })
    .join(', ');

  if (dependentPermissions.length === 1) {
    return `Não é possível remover esta permissão pois "${dependentNames}" depende dela. Remova "${dependentNames}" primeiro.`;
  }

  return `Não é possível remover esta permissão pois estas permissões dependem dela: "${dependentNames}". Remova-as primeiro.`;
};
