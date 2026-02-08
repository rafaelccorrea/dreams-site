import { useMemo } from 'react';
import { usePermissionsContext } from '../contexts/PermissionsContext';

// Permissões do módulo de documentos
export const DOCUMENT_PERMISSIONS = {
  VIEW: 'document:read',
  CREATE: 'document:create',
  UPDATE: 'document:update',
  DELETE: 'document:delete',
  APPROVE: 'document:approve',
  DOWNLOAD: 'document:download',
} as const;

/**
 * Hook para verificar permissões do módulo de documentos
 * Usa o contexto otimizado que reage a mudanças em tempo real via WebSocket
 */
export const useDocumentPermissions = () => {
  const { hasPermission } = usePermissionsContext();

  const permissions = useMemo(
    () => ({
      canView: hasPermission(DOCUMENT_PERMISSIONS.VIEW),
      canCreate: hasPermission(DOCUMENT_PERMISSIONS.CREATE),
      canUpdate: hasPermission(DOCUMENT_PERMISSIONS.UPDATE),
      canDelete: hasPermission(DOCUMENT_PERMISSIONS.DELETE),
      canApprove: hasPermission(DOCUMENT_PERMISSIONS.APPROVE),
      canDownload: hasPermission(DOCUMENT_PERMISSIONS.DOWNLOAD),
    }),
    [hasPermission]
  );

  return permissions;
};
