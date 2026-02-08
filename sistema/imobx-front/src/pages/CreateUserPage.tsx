import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useUsers } from '../hooks/useUsers';
import { usePermissions } from '../hooks/usePermissions';
import { useTags } from '../hooks/useTags';
import { useModules } from '../hooks/useModules';
import { getRequiredModuleForPermission } from '../utils/permissionModuleMapping';
import { TagSelector } from '../components/TagSelector';
import { ManagerSelector } from '../components/common/ManagerSelector';
import { getRoleIcon } from '../utils/roleTranslations';
import { formatPhone, formatCPF, formatCNPJ } from '../utils/masks';
import { toast } from 'react-toastify';
import CreateUserShimmer from '../components/shimmer/CreateUserShimmer';
import {
  userProfiles,
  convertPermissionNamesToIds,
} from '../utils/userProfiles';
import {
  addPermissionWithDependencies,
  removePermissionCheckDependencies,
  getDependencyMessage,
  getDependentPermissionsMessage,
  filterGalleryPermissions,
} from '../utils/permissionDependencies';
import {
  getCategoryLabel,
  getCategoryIcon,
} from '../utils/permissionCategoryMapping';
import {
  getDreamKeysAppPermissionIds,
  hasDreamKeysAppPermissionChanged,
  hasAllDreamKeysAppPermissions,
} from '../utils/dreamKeysAppPermissions';
import { MdArrowBack, MdSave, MdInfo } from 'react-icons/md';
import type { Permission } from '../services/permissionsApi';
import styled from 'styled-components';

// Permissões fixas de corretor (Funil de Vendas) que não podem ser removidas
const BROKER_FIXED_PERMISSIONS = [
  'kanban:view',
  'kanban:create',
  'kanban:update',
  'kanban:delete',
] as const;
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  BackButton,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  FieldContainer,
  FieldLabel,
  RequiredIndicator,
  ErrorMessage,
  FieldInput,
  FieldSelect,
  FieldContainerWithError,
  RowContainer,
  InfoBox,
  PermissionsGrid,
  PermissionCategory,
  CategoryHeader,
  CategoryIcon,
  CategoryTitle,
  PermissionItem,
  PermissionInfo,
  PermissionName,
  PermissionDescription,
  FormActions,
  Button,
} from '../styles/pages/CreateUserPageStyles';

// Styled components específicos para modo de permissões
const ModeButton = styled.button<{ $isActive: boolean }>`
  padding: 8px 16px;
  background-color: ${props =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.backgroundSecondary};
  color: ${props => (props.$isActive ? 'white' : props.theme.colors.text)};
  border: 1px solid
    ${props =>
      props.$isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props =>
      props.$isActive
        ? props.theme.colors.primaryDark
        : props.theme.colors.hover};
    border-color: ${props =>
      props.$isActive
        ? props.theme.colors.primaryDark
        : props.theme.colors.borderLight};
  }
`;

const CategoryCard = styled.div<{ $isSelected: boolean; $isLocked: boolean }>`
  padding: 16px;
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.success
        : props.theme.colors.border};
  border-radius: 8px;
  background-color: ${props => {
    if (props.$isLocked) return props.theme.colors.backgroundSecondary;
    if (props.$isSelected) return `${props.theme.colors.success}15`;
    return props.theme.colors.cardBackground;
  }};
  cursor: ${props => (props.$isLocked ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: ${props => (props.$isLocked ? 0.7 : 1)};
  position: relative;

  &:hover {
    ${props =>
      !props.$isLocked &&
      `
      border-color: ${props.theme.colors.success};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    `}
  }
`;

const CategoryCheckbox = styled.div<{
  $isSelected: boolean;
  $isLocked: boolean;
}>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${props =>
    props.$isSelected
      ? props.theme.colors.success
      : props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid
    ${props =>
      props.$isSelected
        ? props.theme.colors.success
        : props.theme.colors.border};
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.text};
`;

const CategoryBadge = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CategoryCount = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ModeDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

const PermissionLockBadge = styled.span`
  margin-left: 6px;
  font-size: 0.7rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SelectedPermissionsContainer = styled.div`
  margin-top: 8px;
  padding: 12px;
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const SelectedPermissionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PermissionBadge = styled.span`
  padding: 4px 10px;
  background-color: #10b981;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const PermissionSummary = styled.div`
  margin-top: 24px;
  padding: 16px 0;
`;

const SummaryTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const SummaryText = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// Helper functions (agora importadas de permissionCategoryMapping)

const getPermissionLabel = (permission: Permission) => {
  if (permission.description && permission.description.trim().length > 0) {
    return permission.description;
  }
  // Fallback: prettify the raw permission key without exposing DB-like format overtly
  const pretty = permission.name
    .replace(/[:_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/^(\w)/, m => m.toUpperCase());
  return pretty;
};

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser, isLoading: usersLoading } = useUsers();
  const {
    permissions,
    loadPermissions,
    loading: permissionsLoading,
  } = usePermissions();
  const { tags, loading: tagsLoading, loadTags } = useTags();
  const { hasModule } = useModules();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    document: '',
    phone: '',
    role: 'user' as 'user' | 'admin' | 'manager',
    managerId: null as string | null,
    hasAppAccess: false,
  });

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('empty');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [permissionMode, setPermissionMode] = useState<'basic' | 'advanced'>(
    'basic'
  );
  const [previousPermissions, setPreviousPermissions] = useState<string[]>([]); // Para rastrear mudanças

  // Filtrar permissões baseado nos módulos disponíveis
  const availablePermissions = React.useMemo(() => {
    return permissions.filter(permission => {
      const requiredModule = getRequiredModuleForPermission(permission.name);

      // Se não requer módulo específico, está disponível
      if (!requiredModule) return true;

      // Se requer módulo, verificar se empresa tem acesso
      return hasModule(requiredModule);
    });
  }, [permissions, hasModule]);

  // Obter IDs das permissões fixas de corretor (Funil de Vendas)
  const getBrokerFixedPermissionIds = React.useCallback(() => {
    return availablePermissions
      .filter(p => BROKER_FIXED_PERMISSIONS.includes(p.name as any))
      .map(p => p.id);
  }, [availablePermissions]);

  // Verificar se uma permissão é fixa de corretor
  const isBrokerFixedPermission = React.useCallback(
    (permissionId: string) => {
      const permission = availablePermissions.find(p => p.id === permissionId);
      return permission
        ? BROKER_FIXED_PERMISSIONS.includes(permission.name as any)
        : false;
    },
    [availablePermissions]
  );

  // Carregar permissões e tags ao montar o componente
  useEffect(() => {
    if (permissions.length === 0) {
      loadPermissions();
    }
    if (tags.length === 0) {
      loadTags();
    }
  }, [permissions.length, tags.length, loadPermissions, loadTags]);

  // Adicionar permissões de usuário automaticamente para manager e admin
  useEffect(() => {
    if (
      availablePermissions.length > 0 &&
      (formData.role === 'manager' || formData.role === 'admin')
    ) {
      // Obter todas as permissões da categoria 'user' ou que começam com 'user:'
      const userPermissions = availablePermissions.filter(
        p =>
          p.category === 'user' ||
          p.name.startsWith('user:') ||
          p.category === 'Gestão de Usuários'
      );

      const userPermissionIds = userPermissions.map(p => p.id);

      // Adicionar permissões de usuário se ainda não estiverem selecionadas
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        userPermissionIds.forEach(id => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
        return newPermissions;
      });
    }
  }, [formData.role, availablePermissions]);

  // Garantir que permissões fixas de corretor (Funil de Vendas) estejam sempre incluídas
  useEffect(() => {
    if (availablePermissions.length > 0) {
      const fixedPermissionIds = getBrokerFixedPermissionIds();
      if (fixedPermissionIds.length > 0) {
        setSelectedPermissions(prev => {
          const newPermissions = [...new Set([...prev, ...fixedPermissionIds])];
          return newPermissions;
        });
      }
    }
  }, [availablePermissions, getBrokerFixedPermissionIds]);

  // Selecionar automaticamente permissões do Intellisys App quando a flag for ativada
  useEffect(() => {
    if (formData.hasAppAccess && availablePermissions.length > 0) {
      const dreamKeysPermissionIds =
        getDreamKeysAppPermissionIds(availablePermissions);

      setSelectedPermissions(prev => {
        const newPermissions = [
          ...new Set([...prev, ...dreamKeysPermissionIds]),
        ];
        setPreviousPermissions(newPermissions); // Atualizar referência
        return newPermissions;
      });
    }
  }, [formData.hasAppAccess, availablePermissions]);

  // Verificar se todas as permissões do Intellisys App estão selecionadas (para manter flag sincronizada)
  useEffect(() => {
    if (availablePermissions.length > 0 && selectedPermissions.length > 0) {
      const hasAll = hasAllDreamKeysAppPermissions(
        selectedPermissions,
        availablePermissions
      );

      // Se a flag está true mas não tem todas as permissões, desativar flag
      if (formData.hasAppAccess && !hasAll) {
        setFormData(prev => ({ ...prev, hasAppAccess: false }));
        toast.warning(
          'Algumas permissões do aplicativo Intellisys foram removidas. O acesso ao app foi desativado.'
        );
      }
    }
  }, [selectedPermissions, availablePermissions, formData.hasAppAccess]);

  // Debug para verificar estado
  useEffect(() => {
    // Debug: mostrar categorias únicas das permissões
  }, [
    permissions,
    tags,
    selectedPermissions,
    selectedTags,
    permissionsLoading,
    tagsLoading,
  ]);

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    // Aplicar máscaras
    if (field === 'phone') {
      formattedValue = formatPhone(value);
    } else if (field === 'document') {
      // Detectar se é CPF ou CNPJ
      const alphanumericValue = value.replace(/[^A-Za-z0-9]/g, '');
      const hasLetters = /[A-Za-z]/.test(alphanumericValue);

      // Se tem letras, é CNPJ
      if (hasLetters) {
        formattedValue = formatCNPJ(value);
      } else if (alphanumericValue.length <= 11) {
        formattedValue = formatCPF(value);
      } else {
        formattedValue = formatCNPJ(value);
      }
    }

    setFormData(prev => {
      const newData = { ...prev, [field]: formattedValue };

      // Se o role mudou de 'user' para outro tipo, desativar acesso ao Dream Keys
      if (field === 'role' && formattedValue !== 'user' && prev.hasAppAccess) {
        newData.hasAppAccess = false;
      }

      return newData;
    });

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    // Verificar se é uma permissão de usuário e se o role é manager ou admin
    const permission = availablePermissions.find(p => p.id === permissionId);
    if (
      permission &&
      (formData.role === 'manager' || formData.role === 'admin') &&
      (permission.category === 'user' ||
        permission.name.startsWith('user:') ||
        permission.category === 'Gestão de Usuários')
    ) {
      toast.warning(
        'Permissões de usuário são obrigatórias para este perfil e não podem ser editadas'
      );
      return;
    }

    // Verificar se é uma permissão fixa de corretor (Funil de Vendas) e tentar remover
    if (!checked && isBrokerFixedPermission(permissionId)) {
      toast.warning(
        'Permissões de Funil de Vendas são obrigatórias para corretores e não podem ser removidas'
      );
      return;
    }

    setSelectedPermissions(prev => {
      let newPermissions: string[];

      if (checked) {
        // Adicionar permissão com dependências
        const result = addPermissionWithDependencies(
          prev,
          permissionId,
          availablePermissions
        );
        newPermissions = result.permissions;

        // Mostrar notificação se dependências foram adicionadas
        if (result.addedDependencies.length > 0) {
          const message = getDependencyMessage(
            result.addedDependencies,
            availablePermissions
          );
          toast.info(message, {
            autoClose: 5000,
          });
        }
      } else {
        // Remover permissão verificando dependências
        const result = removePermissionCheckDependencies(
          prev,
          permissionId,
          availablePermissions
        );

        if (!result.canRemove) {
          // Não pode remover, mostrar aviso
          const message = getDependentPermissionsMessage(
            result.dependentPermissions,
            availablePermissions
          );
          toast.warning(message, {
            autoClose: 7000,
          });
          return prev; // Não altera as permissões
        }

        newPermissions = result.permissions;
      }

      // Garantir que permissões fixas de corretor estejam sempre incluídas
      const fixedPermissionIds = getBrokerFixedPermissionIds();
      const allPermissions = [
        ...new Set([...newPermissions, ...fixedPermissionIds]),
      ];

      newPermissions = allPermissions;

      // Verificar se alguma permissão do Intellisys App foi alterada
      if (formData.hasAppAccess && availablePermissions.length > 0) {
        const hasChanged = hasDreamKeysAppPermissionChanged(
          previousPermissions,
          newPermissions,
          availablePermissions
        );

        if (hasChanged) {
          // Desativar flag e mostrar alerta
          setFormData(prevFormData => ({
            ...prevFormData,
            hasAppAccess: false,
          }));
          toast.warning(
            '⚠️ As permissões do aplicativo Intellisys foram alteradas. O acesso ao app foi desativado. Ative novamente se desejar manter o acesso.'
          );
        }
      }

      // Atualizar referência anterior
      setPreviousPermissions(newPermissions);

      // Se o usuário modificar manualmente, mudar para perfil personalizado
      setSelectedProfile('empty');
      return newPermissions;
    });
  };

  const handleProfileChange = (profileId: string) => {
    setSelectedProfile(profileId);

    // Se não for perfil personalizado, aplicar permissões do perfil
    if (profileId !== 'empty') {
      const profile = userProfiles.find(p => p.id === profileId);
      if (profile) {
        const permissionIds = convertPermissionNamesToIds(
          profile.permissionNames,
          availablePermissions
        );

        // Se for Manager ou Admin, preservar permissões de usuário obrigatórias
        if (formData.role === 'manager' || formData.role === 'admin') {
          const userPermissions = availablePermissions.filter(
            p =>
              p.category === 'user' ||
              p.name.startsWith('user:') ||
              p.category === 'Gestão de Usuários'
          );
          const userPermissionIds = userPermissions.map(p => p.id);

          // Combinar permissões do perfil com permissões obrigatórias de usuário
          const combinedPermissions = [
            ...new Set([...permissionIds, ...userPermissionIds]),
          ];
          setSelectedPermissions(combinedPermissions);
        } else {
          setSelectedPermissions(permissionIds);
        }

        toast.success(
          `Perfil "${profile.name}" aplicado com ${permissionIds.length} permissões`
        );
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.document.trim()) {
      newErrors.document = 'CPF/CNPJ é obrigatório';
    }

    // Validar que todos os usuários tenham pelo menos 1 permissão
    if (selectedPermissions.length === 0) {
      newErrors.permissions = 'É obrigatório selecionar pelo menos 1 permissão';
      toast.error('É obrigatório selecionar pelo menos 1 permissão');
    }

    // Garantir que permissões fixas de corretor (Funil de Vendas) estejam sempre incluídas
    const fixedPermissionIds = getBrokerFixedPermissionIds();
    const missingFixedPermissions = fixedPermissionIds.filter(
      id => !selectedPermissions.includes(id)
    );
    if (missingFixedPermissions.length > 0) {
      // Adicionar automaticamente as permissões fixas que estão faltando
      setSelectedPermissions(prev => [
        ...new Set([...prev, ...fixedPermissionIds]),
      ]);
    }

    // Validar se a flag de acesso ao app está ativa, todas as permissões necessárias devem estar selecionadas
    if (formData.hasAppAccess && availablePermissions.length > 0) {
      const hasAll = hasAllDreamKeysAppPermissions(
        selectedPermissions,
        availablePermissions
      );
      if (!hasAll) {
        newErrors.hasAppAccess =
          'Para ativar o acesso ao aplicativo Intellisys, todas as permissões necessárias devem estar selecionadas';
        toast.error(
          'Para ativar o acesso ao aplicativo, todas as permissões necessárias devem estar selecionadas'
        );
        // Desativar flag automaticamente
        setFormData(prev => ({ ...prev, hasAppAccess: false }));
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Garantir que todas as dependências de permissões estejam incluídas
      // Exemplo: se tem team:view, deve ter user:view
      const finalPermissions = [...selectedPermissions];
      const userViewPermission = availablePermissions.find(
        p => p.name === 'user:view'
      );

      // Verificar se tem permissões de team sem user:view
      const hasTeamPermissions = finalPermissions.some(permId => {
        const perm = availablePermissions.find(p => p.id === permId);
        return perm && perm.name.startsWith('team:');
      });

      if (
        hasTeamPermissions &&
        userViewPermission &&
        !finalPermissions.includes(userViewPermission.id)
      ) {
        // Adicionar user:view automaticamente
        finalPermissions.push(userViewPermission.id);
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        document: formData.document,
        phone: formData.phone || undefined,
        role: formData.role,
        permissionIds: finalPermissions,
        tagIds: selectedTags,
        managerId: formData.managerId || undefined,
        hasAppAccess: formData.hasAppAccess,
      };

      const createdUser = await createUser(userData);

      // Se a flag de acesso ao app estiver ativa, chamar API específica
      if (formData.hasAppAccess && createdUser.id) {
        try {
          const { usersApi } = await import('../services/usersApi');
          await usersApi.updateUserAppAccess(createdUser.id, true);
        } catch (error: any) {
          // Se falhar, ainda consideramos o usuário criado, mas mostramos aviso
          console.error('Erro ao ativar acesso ao aplicativo:', error);
          toast.warning(
            'Usuário criado, mas houve um erro ao ativar o acesso ao aplicativo. Você pode ativar manualmente.'
          );
        }
      }

      toast.success('Usuário criado com sucesso!');
      navigate('/users');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  // Função para obter o label da categoria (renomeando kanban para Funil de Vendas)
  const getCategoryDisplayLabel = (
    category: string,
    permissionName?: string
  ) => {
    const baseLabel = getCategoryLabel(category, permissionName);
    // Renomear kanban para Funil de Vendas
    if (category === 'kanban' || baseLabel.toLowerCase().includes('kanban')) {
      return baseLabel.replace(/kanban/gi, 'Funil de Vendas');
    }
    return baseLabel;
  };

  // Função para agrupar permissões por categoria
  const getPermissionsByCategory = () => {
    const filteredPermissions = filterGalleryPermissions(
      availablePermissions
    ) as Permission[];
    return filteredPermissions.reduce(
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
  };

  // Função para obter todas as permissões de uma categoria
  const getCategoryPermissionIds = (category: string) => {
    const categoryPermissions = getPermissionsByCategory()[category] || [];
    return categoryPermissions.map(p => p.id);
  };

  // Função para verificar se uma categoria está selecionada
  const isCategorySelected = (category: string) => {
    const categoryPermissionIds = getCategoryPermissionIds(category);
    const isSelected = categoryPermissionIds.every(id =>
      selectedPermissions.includes(id)
    );

    // Log para debug
    if (categoryPermissionIds.length > 0) {
      const selectedCount = categoryPermissionIds.filter(id =>
        selectedPermissions.includes(id)
      ).length;
      if (selectedCount > 0 && selectedCount < categoryPermissionIds.length) {
        console.log(
          `[Category Selection] Categoria "${category}": ${selectedCount}/${categoryPermissionIds.length} permissões selecionadas`
        );
      }
    }

    return isSelected;
  };

  // Função para selecionar/deselecionar categoria
  const toggleCategory = (category: string) => {
    // Impedir edição de permissões de usuário para manager e admin
    if (
      (formData.role === 'manager' || formData.role === 'admin') &&
      (category === 'user' || category === 'Gestão de Usuários')
    ) {
      toast.warning(
        'Permissões de usuário são obrigatórias para este perfil e não podem ser editadas'
      );
      return;
    }

    // Impedir remover categoria Funil de Vendas (kanban)
    if (category === 'kanban' || category === 'CRM') {
      toast.warning(
        'Permissões de Funil de Vendas são obrigatórias para corretores e não podem ser removidas'
      );
      return;
    }

    const categoryPermissionIds = getCategoryPermissionIds(category);
    const isSelected = isCategorySelected(category);

    if (isSelected) {
      // Remover todas as permissões da categoria, exceto as fixas de corretor
      const fixedPermissionIds = getBrokerFixedPermissionIds();
      const removableIds = categoryPermissionIds.filter(
        id => !fixedPermissionIds.includes(id)
      );

      if (removableIds.length === 0) {
        toast.warning(
          'Permissões de Funil de Vendas são obrigatórias e não podem ser removidas'
        );
        return;
      }
      setSelectedPermissions(prev =>
        prev.filter(id => !categoryPermissionIds.includes(id))
      );
    } else {
      // Adicionar todas as permissões da categoria
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        categoryPermissionIds.forEach(id => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
        return newPermissions;
      });
    }
  };

  if (permissionsLoading || tagsLoading) {
    return (
      <Layout>
        <CreateUserShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <BackButton onClick={handleBack}>
          <MdArrowBack size={20} />
          Voltar
        </BackButton>

        <PageHeader>
          <PageTitle>Criar Novo Usuário</PageTitle>
          <PageSubtitle>
            Preencha as informações abaixo para criar um novo usuário no sistema
          </PageSubtitle>
        </PageHeader>

        <form onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div style={{ marginBottom: '32px' }}>
            <SectionHeader>
              <SectionTitle>Informações Básicas</SectionTitle>
              <SectionDescription>
                Preencha os dados pessoais e de acesso do usuário
              </SectionDescription>
            </SectionHeader>

            <RowContainer>
              <FieldContainerWithError $hasError={!!errors.name}>
                <FieldLabel>
                  Nome Completo <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Digite o nome completo'
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FieldContainerWithError>

              <FieldContainerWithError $hasError={!!errors.email}>
                <FieldLabel>
                  Email <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='email'
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder='email@exemplo.com'
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FieldContainerWithError>
            </RowContainer>

            <RowContainer>
              <FieldContainerWithError $hasError={!!errors.password}>
                <FieldLabel>
                  Senha <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='password'
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder='Digite a senha'
                />
                {errors.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </FieldContainerWithError>

              <FieldContainerWithError $hasError={!!errors.document}>
                <FieldLabel>
                  CPF/CNPJ <RequiredIndicator>*</RequiredIndicator>
                </FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.document}
                  onChange={e => handleInputChange('document', e.target.value)}
                  placeholder='123.456.789-00 ou CK.LZH.YDS/0001-91'
                  maxLength={18}
                />
                {errors.document && (
                  <ErrorMessage>{errors.document}</ErrorMessage>
                )}
              </FieldContainerWithError>
            </RowContainer>

            <RowContainer>
              <FieldContainer>
                <FieldLabel>Telefone</FieldLabel>
                <FieldInput
                  type='text'
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder='(00) 00000-0000'
                  maxLength={15}
                />
              </FieldContainer>

              <FieldContainer>
                <FieldLabel>Função</FieldLabel>
                <FieldSelect
                  value={formData.role}
                  onChange={e => handleInputChange('role', e.target.value)}
                >
                  <option value='user'>
                    {getRoleIcon('user')} Colaborador
                  </option>
                  <option value='manager'>
                    {getRoleIcon('manager')} Gestor
                  </option>
                  <option value='admin'>
                    {getRoleIcon('admin')} Proprietário
                  </option>
                </FieldSelect>
              </FieldContainer>
            </RowContainer>

            {/* Gestor Responsável - apenas para usuários */}
            {formData.role === 'user' && (
              <RowContainer>
                <div style={{ width: '100%' }}>
                  <ManagerSelector
                    value={formData.managerId}
                    onChange={managerId =>
                      setFormData(prev => ({ ...prev, managerId }))
                    }
                    userRole={formData.role}
                  />
                </div>
              </RowContainer>
            )}

            {/* Acesso ao Aplicativo Dream Keys - apenas para usuários do tipo 'user' */}
            {formData.role === 'user' && (
              <>
                <RowContainer>
                  <FieldContainer style={{ width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        background: formData.hasAppAccess
                          ? '#DBEAFE'
                          : '#f3f4f6',
                        border: `2px solid ${
                          formData.hasAppAccess ? '#3B82F6' : '#e5e7eb'
                        }`,
                        borderRadius: '8px',
                      }}
                    >
                      <input
                        type='checkbox'
                        id='hasAppAccess'
                        checked={formData.hasAppAccess}
                        onChange={e => {
                          const shouldEnable = e.target.checked;

                          if (shouldEnable) {
                            // Sempre selecionar TODAS as permissões do Intellisys App quando ativar a flag
                            if (availablePermissions.length > 0) {
                              const dreamKeysPermissionIds =
                                getDreamKeysAppPermissionIds(
                                  availablePermissions
                                );

                              console.log(
                                '[Intellisys App] Permissões encontradas:',
                                dreamKeysPermissionIds.length
                              );
                              console.log(
                                '[Intellisys App] IDs das permissões:',
                                dreamKeysPermissionIds
                              );

                              // Processar todas as permissões e suas dependências
                              setSelectedPermissions(prev => {
                                console.log(
                                  '[Intellisys App] Permissões anteriores:',
                                  prev.length
                                );

                                let currentPermissions = [...prev];

                                // Processar cada permissão do Intellisys App
                                dreamKeysPermissionIds.forEach(
                                  (permissionId, index) => {
                                    console.log(
                                      `[Intellisys App] Processando permissão ${index + 1}/${dreamKeysPermissionIds.length}:`,
                                      permissionId
                                    );

                                    // Adicionar a permissão principal
                                    if (
                                      !currentPermissions.includes(permissionId)
                                    ) {
                                      currentPermissions.push(permissionId);
                                      console.log(
                                        `[Intellisys App] Permissão ${permissionId} adicionada (principal)`
                                      );
                                    }

                                    // Adicionar dependências
                                    const result =
                                      addPermissionWithDependencies(
                                        currentPermissions,
                                        permissionId,
                                        availablePermissions
                                      );

                                    if (result.addedDependencies.length > 0) {
                                      console.log(
                                        `[Intellisys App] Dependências adicionadas para ${permissionId}:`,
                                        result.addedDependencies
                                      );
                                    }

                                    currentPermissions = result.permissions;
                                    console.log(
                                      `[Intellisys App] Total de permissões após ${permissionId}:`,
                                      currentPermissions.length
                                    );
                                  }
                                );

                                // Garantir que TODAS as permissões das categorias relacionadas sejam selecionadas
                                // Isso garante que as categorias apareçam visualmente como selecionadas
                                const categoriesToSelect = [
                                  'dashboard',
                                  'property',
                                  'client',
                                  'clients',
                                  'calendar',
                                  'commission',
                                  'commissions',
                                  'kanban',
                                ];
                                const filteredPerms =
                                  filterGalleryPermissions(
                                    availablePermissions
                                  );

                                categoriesToSelect.forEach(categoryName => {
                                  const categoryPermissions =
                                    filteredPerms.filter(p => {
                                      const cat =
                                        p.category ||
                                        p.name.match(/^([^:]+):/)?.[1] ||
                                        'system';
                                      return (
                                        cat === categoryName ||
                                        cat.toLowerCase() ===
                                          categoryName.toLowerCase()
                                      );
                                    });

                                  categoryPermissions.forEach(perm => {
                                    if (!currentPermissions.includes(perm.id)) {
                                      currentPermissions.push(perm.id);
                                      console.log(
                                        `[Intellisys App] Permissão adicional da categoria ${categoryName} adicionada:`,
                                        perm.id
                                      );
                                    }
                                  });
                                });

                                // Garantir que não há duplicatas
                                const finalPermissions = [
                                  ...new Set(currentPermissions),
                                ];
                                console.log(
                                  '[Intellisys App] Permissões finais (sem duplicatas):',
                                  finalPermissions.length
                                );
                                console.log(
                                  '[Intellisys App] IDs finais:',
                                  finalPermissions
                                );

                                setPreviousPermissions(finalPermissions);
                                return finalPermissions;
                              });

                              toast.info(
                                'Permissões do aplicativo Intellisys foram selecionadas automaticamente'
                              );
                            } else {
                              console.warn(
                                '[Dream Keys App] Nenhuma permissão disponível encontrada'
                              );
                            }

                            setFormData(prev => ({
                              ...prev,
                              hasAppAccess: true,
                            }));
                          } else {
                            // Desativar flag
                            setFormData(prev => ({
                              ...prev,
                              hasAppAccess: false,
                            }));
                          }
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      />
                      <label
                        htmlFor='hasAppAccess'
                        style={{
                          flex: 1,
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: '#1f2937',
                        }}
                      >
                        📱 Acesso ao aplicativo Intellisys
                      </label>
                    </div>
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                      }}
                    >
                      {formData.hasAppAccess
                        ? 'Todas as permissões necessárias para o app serão selecionadas automaticamente'
                        : 'Ative para conceder acesso completo ao aplicativo móvel Intellisys'}
                    </div>
                  </FieldContainer>
                </RowContainer>

                {/* Card de Alerta - Mostrar quando permissões do Intellisys App foram alteradas */}
                {!formData.hasAppAccess &&
                  availablePermissions.length > 0 &&
                  selectedPermissions.length > 0 &&
                  hasAllDreamKeysAppPermissions(
                    selectedPermissions,
                    availablePermissions
                  ) && (
                    <RowContainer>
                      <div
                        style={{
                          width: '100%',
                          padding: '16px',
                          background: '#FEF3C7',
                          border: '2px solid #F59E0B',
                          borderRadius: '8px',
                          marginTop: '8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                          }}
                        >
                          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                color: '#92400E',
                                marginBottom: '4px',
                              }}
                            >
                              Acesso ao aplicativo Dream Keys desativado
                            </div>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                color: '#78350F',
                                lineHeight: '1.5',
                              }}
                            >
                              O usuário possui todas as permissões necessárias
                              para o aplicativo Dream Keys, mas o acesso está
                              desativado. Ative a opção acima para conceder
                              acesso ao app.
                            </div>
                          </div>
                        </div>
                      </div>
                    </RowContainer>
                  )}
              </>
            )}
          </div>

          {/* Permissões */}
          <div style={{ marginBottom: '32px' }}>
            <SectionHeader>
              <SectionTitle>Permissões</SectionTitle>
              <SectionDescription>
                Selecione as permissões que este usuário terá acesso no sistema
              </SectionDescription>
            </SectionHeader>

            <InfoBox>
              <MdInfo size={20} />
              As permissões definem quais funcionalidades o usuário poderá
              acessar.
              {formData.role === 'user' &&
                ' Usuários comuns devem ter pelo menos 1 permissão selecionada.'}
            </InfoBox>
            {errors.permissions && (
              <ErrorMessage>{errors.permissions}</ErrorMessage>
            )}

            {/* Seletor de Modo */}
            <FieldContainer>
              <FieldLabel>Modo de Seleção</FieldLabel>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <ModeButton
                  type='button'
                  onClick={() => setPermissionMode('basic')}
                  $isActive={permissionMode === 'basic'}
                >
                  🎯 Básico
                </ModeButton>
                <ModeButton
                  type='button'
                  onClick={() => setPermissionMode('advanced')}
                  $isActive={permissionMode === 'advanced'}
                >
                  ⚙️ Avançado
                </ModeButton>
              </div>
              <ModeDescription>
                {permissionMode === 'basic'
                  ? 'Selecione categorias completas de permissões'
                  : 'Controle granular de cada permissão individual'}
              </ModeDescription>
            </FieldContainer>

            {/* Perfil de Usuário */}
            <FieldContainer>
              <FieldLabel>Perfil de Usuário</FieldLabel>
              <FieldSelect
                value={selectedProfile}
                onChange={e => handleProfileChange(e.target.value)}
              >
                {userProfiles.map(profile => (
                  <option key={profile.id} value={profile.id}>
                    {profile.icon} {profile.name} - {profile.description}
                  </option>
                ))}
              </FieldSelect>
            </FieldContainer>

            {/* Modo Básico */}
            {permissionMode === 'basic' && (
              <div>
                {/* Botões de Ação Rápida */}
                <FieldContainer>
                  <FieldLabel>Ações Rápidas</FieldLabel>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type='button'
                      onClick={() => {
                        const allPermissionIds = filterGalleryPermissions(
                          availablePermissions
                        ).map(p => p.id);
                        setSelectedPermissions(allPermissionIds);
                        setSelectedProfile('empty');
                        toast.success(
                          `Todas as ${allPermissionIds.length} permissões foram selecionadas`
                        );
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseOver={e =>
                        (e.currentTarget.style.backgroundColor = '#059669')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.backgroundColor = '#10b981')
                      }
                    >
                      ✅ Selecionar Todas
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedPermissions([]);
                        setSelectedProfile('empty');
                        toast.info('Todas as permissões foram removidas');
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseOver={e =>
                        (e.currentTarget.style.backgroundColor = '#dc2626')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.backgroundColor = '#ef4444')
                      }
                    >
                      🗑️ Remover Todas
                    </button>
                  </div>
                </FieldContainer>

                {/* Visualização de Permissões Selecionadas */}
                {selectedPermissions.length > 0 && (
                  <FieldContainer style={{ marginTop: '16px' }}>
                    <FieldLabel>
                      Permissões Selecionadas ({selectedPermissions.length})
                    </FieldLabel>
                    <SelectedPermissionsContainer>
                      <SelectedPermissionsList>
                        {selectedPermissions.map(permissionId => {
                          const permission = availablePermissions.find(
                            p => p.id === permissionId
                          );
                          if (!permission) return null;

                          return (
                            <PermissionBadge key={permissionId}>
                              {getCategoryIcon(permission.category)}{' '}
                              {getPermissionLabel(permission)}
                            </PermissionBadge>
                          );
                        })}
                      </SelectedPermissionsList>
                    </SelectedPermissionsContainer>
                  </FieldContainer>
                )}

                <FieldLabel style={{ marginTop: '24px' }}>
                  Selecionar por Categoria
                </FieldLabel>
                {(formData.role === 'manager' || formData.role === 'admin') && (
                  <InfoBox style={{ marginTop: '12px', marginBottom: '12px' }}>
                    <MdInfo size={20} />
                    <span style={{ fontSize: '0.875rem' }}>
                      Permissões de usuário são obrigatórias para este perfil e
                      já estão incluídas automaticamente
                    </span>
                  </InfoBox>
                )}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '12px',
                    marginTop: '12px',
                  }}
                >
                  {Object.entries(getPermissionsByCategory()).map(
                    ([category, categoryPermissions]) => {
                      const isUserCategory =
                        category === 'user' ||
                        category === 'Gestão de Usuários';
                      const isLocked =
                        (formData.role === 'manager' ||
                          formData.role === 'admin') &&
                        isUserCategory;
                      const isSelected = isCategorySelected(category);

                      return (
                        <CategoryCard
                          key={category}
                          onClick={() => !isLocked && toggleCategory(category)}
                          $isSelected={isSelected}
                          $isLocked={isLocked}
                        >
                          <CategoryCheckbox
                            $isSelected={isSelected}
                            $isLocked={isLocked}
                          >
                            {isLocked ? '🔒' : isSelected ? '✓' : ''}
                          </CategoryCheckbox>
                          <CategoryInfo>
                            <CategoryName>
                              {getCategoryDisplayLabel(
                                category,
                                categoryPermissions[0]?.name
                              )}
                              {isLocked && (
                                <CategoryBadge>(obrigatório)</CategoryBadge>
                              )}
                            </CategoryName>
                            <CategoryCount>
                              {categoryPermissions.length} permissões
                            </CategoryCount>
                          </CategoryInfo>
                        </CategoryCard>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Modo Avançado */}
            {permissionMode === 'advanced' && (
              <div>
                <FieldContainer>
                  <FieldLabel>Buscar Permissões</FieldLabel>
                  <FieldInput
                    type='text'
                    value={permissionSearch}
                    onChange={e => setPermissionSearch(e.target.value)}
                    placeholder='Digite para filtrar permissões...'
                  />
                </FieldContainer>

                {/* Visualização de Permissões Selecionadas */}
                {selectedPermissions.length > 0 && (
                  <FieldContainer style={{ marginTop: '16px' }}>
                    <FieldLabel>
                      Permissões Selecionadas ({selectedPermissions.length})
                    </FieldLabel>
                    <SelectedPermissionsContainer>
                      <SelectedPermissionsList>
                        {selectedPermissions.map(permissionId => {
                          const permission = availablePermissions.find(
                            p => p.id === permissionId
                          );
                          if (!permission) return null;

                          return (
                            <PermissionBadge key={permissionId}>
                              {getCategoryIcon(permission.category)}{' '}
                              {getPermissionLabel(permission)}
                            </PermissionBadge>
                          );
                        })}
                      </SelectedPermissionsList>
                    </SelectedPermissionsContainer>
                  </FieldContainer>
                )}

                {/* Botões de Ação Rápida */}
                <FieldContainer style={{ marginTop: '24px' }}>
                  <FieldLabel>Ações Rápidas</FieldLabel>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type='button'
                      onClick={() => {
                        const allPermissionIds = filterGalleryPermissions(
                          availablePermissions
                        ).map(p => p.id);
                        setSelectedPermissions(allPermissionIds);
                        setSelectedProfile('empty');
                        toast.success(
                          `Todas as ${allPermissionIds.length} permissões foram selecionadas`
                        );
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseOver={e =>
                        (e.currentTarget.style.backgroundColor = '#059669')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.backgroundColor = '#10b981')
                      }
                    >
                      ✅ Selecionar Todas
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedPermissions([]);
                        setSelectedProfile('empty');
                        toast.info('Todas as permissões foram removidas');
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseOver={e =>
                        (e.currentTarget.style.backgroundColor = '#dc2626')
                      }
                      onMouseOut={e =>
                        (e.currentTarget.style.backgroundColor = '#ef4444')
                      }
                    >
                      🗑️ Remover Todas
                    </button>
                  </div>
                </FieldContainer>

                {!permissionsLoading && availablePermissions.length > 0 ? (
                  <PermissionsGrid>
                    {Object.entries(
                      (
                        filterGalleryPermissions(
                          availablePermissions
                        ) as Permission[]
                      )
                        .filter(
                          permission =>
                            permissionSearch === '' ||
                            permission.name
                              .toLowerCase()
                              .includes(permissionSearch.toLowerCase()) ||
                            (permission.description &&
                              permission.description
                                .toLowerCase()
                                .includes(permissionSearch.toLowerCase())) ||
                            (permission.category &&
                              permission.category
                                .toLowerCase()
                                .includes(permissionSearch.toLowerCase()))
                        )
                        .reduce(
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
                        )
                    ).map(([category, categoryPermissions]) => (
                      <PermissionCategory key={category}>
                        <CategoryHeader>
                          <CategoryIcon>
                            {getCategoryIcon(category)}
                          </CategoryIcon>
                          <CategoryTitle>
                            {getCategoryLabel(
                              category,
                              categoryPermissions[0]?.name
                            )}{' '}
                            ({categoryPermissions.length})
                          </CategoryTitle>
                        </CategoryHeader>

                        {categoryPermissions.map(permission => {
                          const isUserPermission =
                            permission.category === 'user' ||
                            permission.name.startsWith('user:') ||
                            permission.category === 'Gestão de Usuários';
                          const isLocked =
                            (formData.role === 'manager' ||
                              formData.role === 'admin') &&
                            isUserPermission;

                          return (
                            <PermissionItem
                              key={permission.id}
                              style={{ opacity: isLocked ? 0.6 : 1 }}
                            >
                              <input
                                type='checkbox'
                                checked={
                                  isLocked
                                    ? true
                                    : selectedPermissions.includes(
                                        permission.id
                                      )
                                }
                                disabled={isLocked}
                                onChange={e =>
                                  handlePermissionChange(
                                    permission.id,
                                    e.target.checked
                                  )
                                }
                                style={{
                                  cursor: isLocked ? 'not-allowed' : 'pointer',
                                }}
                              />
                              <PermissionInfo>
                                <PermissionName>
                                  {getPermissionLabel(permission)}
                                  {isLocked && (
                                    <PermissionLockBadge>
                                      🔒 (obrigatório)
                                    </PermissionLockBadge>
                                  )}
                                </PermissionName>
                                <PermissionDescription>
                                  {getCategoryLabel(
                                    permission.category,
                                    permission.name
                                  )}
                                </PermissionDescription>
                              </PermissionInfo>
                            </PermissionItem>
                          );
                        })}
                      </PermissionCategory>
                    ))}
                  </PermissionsGrid>
                ) : permissionsLoading ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#6b7280',
                    }}
                  >
                    Carregando permissões...
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#6b7280',
                    }}
                  >
                    Nenhuma permissão disponível
                  </div>
                )}

                {/* Resumo */}
                <PermissionSummary>
                  <SummaryTitle>Resumo das Permissões</SummaryTitle>
                  <SummaryText>
                    {selectedPermissions.length} permissões selecionadas
                  </SummaryText>
                </PermissionSummary>
              </div>
            )}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '32px' }}>
            <SectionHeader>
              <SectionTitle>🏷️ Tags</SectionTitle>
              <SectionDescription>
                Selecione as tags que serão associadas a este usuário
              </SectionDescription>
            </SectionHeader>

            <InfoBox>
              <MdInfo size={20} />
              As tags ajudam a organizar e categorizar os usuários
            </InfoBox>

            <FieldContainer>
              <FieldLabel>Tags do Usuário</FieldLabel>
              <TagSelector
                selectedTagIds={selectedTags}
                onTagChange={newTags => {
                  setSelectedTags(newTags);
                }}
                maxTags={5}
              />
            </FieldContainer>
          </div>

          {/* Botões de Ação */}
          <FormActions>
            <Button $variant='secondary' type='button' onClick={handleBack}>
              Cancelar
            </Button>
            <Button
              $variant='primary'
              type='submit'
              disabled={isSubmitting || usersLoading}
            >
              <MdSave size={20} />
              {isSubmitting ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </FormActions>
        </form>
      </PageContainer>
    </Layout>
  );
};

export default CreateUserPage;
