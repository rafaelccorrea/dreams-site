import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Checkbox,
  Typography,
  Alert,
  Spin,
  Divider,
  Tag,
  Space,
  message,
} from 'antd';
import { usePermissions } from '../hooks/usePermissions';
import { permissionsApi } from '../services/permissionsApi';
import type { Permission } from '../services/permissionsApi';
import {
  addPermissionWithDependencies,
  removePermissionCheckDependencies,
  getDependencyMessage,
  getDependentPermissionsMessage,
  filterGalleryPermissions,
} from '../utils/permissionDependencies';
import { getCategoryLabel } from '../utils/permissionCategoryMapping';

interface UserPermissionsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userEmail: string;
}

export const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  open,
  onClose,
  userId,
  userName,
  userEmail,
}) => {
  const { userPermissions, loading, updateUserPermissions } = usePermissions();
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all permissions when modal opens
  useEffect(() => {
    if (open) {
      loadAllPermissions();
    }
  }, [open]);

  // Update selected permissions when user permissions change
  useEffect(() => {
    if (userPermissions && userPermissions.userId === userId) {
      setSelectedPermissions(userPermissions.permissions.map(p => p.id));
    }
  }, [userPermissions, userId]);

  const loadAllPermissions = async () => {
    try {
      setLoadingPermissions(true);
      setError(null);
      const permissions = await permissionsApi.getAll();
      setAllPermissions(permissions);
    } catch (err) {
      setError('Erro ao carregar permissões');
      console.error('Error loading permissions:', err);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateUserPermissions(userId, selectedPermissions);
      onClose();
    } catch (err) {
      setError('Erro ao salvar permissões');
      console.error('Error saving permissions:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original permissions
    if (userPermissions && userPermissions.userId === userId) {
      setSelectedPermissions(userPermissions.permissions.map(p => p.id));
    }
    onClose();
  };

  // Group permissions by category (excluindo galeria)
  const permissionsByCategory = filterGalleryPermissions(allPermissions).reduce(
    (acc, permission) => {
      // Normalizar categoria: se for null, undefined ou "other", derivar do nome da permissão
      let category = permission.category;
      if (
        !category ||
        category === 'other' ||
        category === 'null' ||
        category === 'undefined' ||
        category.trim() === ''
      ) {
        // Tentar extrair categoria do nome da permissão (formato: "category:action")
        const match = permission.name.match(/^([^:]+):/);
        if (match) {
          category = match[1];
        } else {
          category = 'system';
        }
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  return (
    <Modal
      title='Gerenciar Permissões'
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key='cancel' onClick={handleCancel} disabled={saving}>
          Cancelar
        </Button>,
        <Button
          key='save'
          type='primary'
          onClick={handleSave}
          disabled={saving || loading}
          loading={saving}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Typography.Text type='secondary'>
          {userName} ({userEmail})
        </Typography.Text>
      </div>

      {error && (
        <Alert
          message='Erro'
          description={error}
          type='error'
          style={{ marginBottom: 16 }}
        />
      )}

      {loadingPermissions ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size='large' />
        </div>
      ) : (
        <div>
          <Typography.Text
            type='secondary'
            style={{ marginBottom: 16, display: 'block' }}
          >
            Selecione as permissões que este usuário deve ter:
          </Typography.Text>

          {Object.entries(permissionsByCategory).map(
            ([category, permissions]) => (
              <div key={category} style={{ marginBottom: 24 }}>
                <Typography.Title level={5} style={{ marginBottom: 12 }}>
                  {getCategoryLabel(category, permissions[0]?.name)}
                </Typography.Title>

                <Form.Item>
                  <Space direction='vertical' style={{ width: '100%' }}>
                    {permissions.map(permission => (
                      <div key={permission.id}>
                        <Checkbox
                          value={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          disabled={loading || saving}
                          onChange={e => {
                            const checked = e.target.checked;
                            const permissionId = permission.id;

                            if (checked) {
                              // Adicionar permissão com dependências
                              const result = addPermissionWithDependencies(
                                selectedPermissions,
                                permissionId,
                                allPermissions
                              );
                              setSelectedPermissions(result.permissions);

                              // Mostrar notificação se dependências foram adicionadas
                              if (result.addedDependencies.length > 0) {
                                const msg = getDependencyMessage(
                                  result.addedDependencies,
                                  allPermissions
                                );
                                message.info(msg, 5);
                              }
                            } else {
                              // Remover permissão verificando dependências
                              const result = removePermissionCheckDependencies(
                                selectedPermissions,
                                permissionId,
                                allPermissions
                              );

                              if (!result.canRemove) {
                                // Não pode remover, mostrar aviso
                                const msg = getDependentPermissionsMessage(
                                  result.dependentPermissions,
                                  allPermissions
                                );
                                message.warning(msg, 7);
                              } else {
                                setSelectedPermissions(result.permissions);
                              }
                            }
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {permission.name}
                            </div>
                            {permission.description && (
                              <Typography.Text
                                type='secondary'
                                style={{ fontSize: 12 }}
                              >
                                {permission.description}
                              </Typography.Text>
                            )}
                          </div>
                        </Checkbox>
                      </div>
                    ))}
                  </Space>
                </Form.Item>

                <Divider />
              </div>
            )
          )}

          {selectedPermissions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Typography.Text
                type='secondary'
                style={{ marginBottom: 8, display: 'block' }}
              >
                Permissões selecionadas:
              </Typography.Text>
              <Space wrap>
                {selectedPermissions.map(permissionId => {
                  const permission = allPermissions.find(
                    p => p.id === permissionId
                  );
                  return permission ? (
                    <Tag key={permissionId} color='blue'>
                      {permission.name}
                    </Tag>
                  ) : null;
                })}
              </Space>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
