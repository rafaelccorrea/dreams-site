import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useHierarchy } from '../hooks/useHierarchy';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { canManageHierarchy } from '../utils/hierarchyPermissions';
import { getRoleIcon, translateUserRole } from '../utils/roleTranslations';
import HierarchyShimmer from '../components/shimmer/HierarchyShimmer';
import { toast } from 'react-toastify';
import type { User } from '../services/usersApi';
import {
  MdSupervisorAccount,
  MdPerson,
  MdSearch,
  MdCheck,
  MdClose,
  MdExpandMore,
  MdExpandLess,
  MdAccountTree,
} from 'react-icons/md';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  TabsContainer,
  Tab,
  ContentCard,
  UserAvatar,
  EmptyState,
  EmptyIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  AssignSection,
  SectionTitle,
  FormGroup,
  Label,
  Select,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  CheckboxGroup,
  CheckboxItem,
  Checkbox,
  CheckboxUserInfo,
  CheckboxUserName,
  CheckboxUserEmail,
  ButtonGroup,
  Button,
  SelectionInfo,
  AccessDenied,
  AccessDeniedIcon,
  AccessDeniedText,
  AccessDeniedSubtext,
  InfoText,
  InfoTipBox,
  WarningBox,
  TreeContainer,
  TreeNode,
  TreeNodeContent,
  ExpandButton,
  RoleBadge,
  TreeNodeInfo,
  TreeNodeName,
  TreeNodeEmail,
  CountBadge,
  TreeNodeChildren,
} from '../styles/pages/HierarchyPageStyles';

const HierarchyPage: React.FC = () => {
  const { getCurrentUser } = useAuth();
  const { assignManager, loading } = useHierarchy();
  const { users, getUsers, isLoading: usersLoading } = useUsers();

  const [activeTab, setActiveTab] = useState<'view' | 'assign'>('view');
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const user = getCurrentUser();

  // Carregar usuários apenas uma vez
  useEffect(() => {
    getUsers({ limit: 100 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-expandir nós que têm filhos
  useEffect(() => {
    if (users.length > 0) {
      const newExpandedNodes = new Set<string>();
      users.forEach((u: User) => {
        const hasChildren = users.some(
          (child: User) => child.managerId === u.id
        );
        if (hasChildren) {
          newExpandedNodes.add(u.id);
        }
      });
      setExpandedNodes(newExpandedNodes);
    }
  }, [users]);

  const handleAssignManager = async () => {
    if (managers.length === 0) {
      toast.error(
        'Nenhum gestor cadastrado no sistema. Cadastre usuários com role "manager" primeiro.'
      );
      return;
    }

    if (!selectedManager) {
      toast.error('Selecione um gestor primeiro');
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error('Selecione pelo menos um colaborador');
      return;
    }

    try {
      await assignManager({
        userIds: selectedUsers,
        managerId: selectedManager,
      });

      // Limpar seleções
      setSelectedManager('');
      setSelectedUsers([]);

      // Recarregar usuários (isso acionará o useEffect que recarrega a hierarquia)
      getUsers({ limit: 100 });
    } catch (error) {
      console.error('Erro ao atribuir gestor:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedManager('');
    setSelectedUsers([]);
  };

  const managers = users.filter((u: User) => u.role === 'manager');
  const regularUsers = users.filter((u: User) => u.role === 'user');

  const filteredUsers = regularUsers.filter(
    (u: User) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleNode = (userId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedNodes(newExpanded);
  };

  // Renderizar árvore hierárquica
  const renderTreeNode = (
    currentUser: User,
    level: number = 0
  ): JSX.Element => {
    const managedUsers = users.filter(
      (u: User) => u.managerId === currentUser.id
    );
    const hasChildren = managedUsers.length > 0;
    const isExpanded = expandedNodes.has(currentUser.id);

    return (
      <TreeNode key={currentUser.id} $level={level}>
        <TreeNodeContent $role={currentUser.role}>
          {hasChildren && (
            <ExpandButton onClick={() => toggleNode(currentUser.id)}>
              {isExpanded ? (
                <MdExpandLess size={20} />
              ) : (
                <MdExpandMore size={20} />
              )}
            </ExpandButton>
          )}
          {!hasChildren && <div style={{ width: '28px' }} />}

          <UserAvatar>{currentUser.name.charAt(0).toUpperCase()}</UserAvatar>

          <TreeNodeInfo>
            <TreeNodeName>{currentUser.name}</TreeNodeName>
            <TreeNodeEmail>{currentUser.email}</TreeNodeEmail>
          </TreeNodeInfo>

          <RoleBadge $role={currentUser.role}>
            {getRoleIcon(currentUser.role)}{' '}
            {translateUserRole(currentUser.role)}
          </RoleBadge>

          {hasChildren && (
            <CountBadge>
              {managedUsers.length}{' '}
              {managedUsers.length === 1 ? 'subordinado' : 'subordinados'}
            </CountBadge>
          )}
        </TreeNodeContent>

        {hasChildren && isExpanded && (
          <TreeNodeChildren>
            {managedUsers.map(managedUser =>
              renderTreeNode(managedUser, level + 1)
            )}
          </TreeNodeChildren>
        )}
      </TreeNode>
    );
  };

  // Obter usuários raiz (sem manager)
  const getRootUsers = () => {
    return users.filter((u: User) => !u.managerId);
  };

  // Verificar se há hierarquia estruturada
  const hasHierarchy = users.some((u: User) => u.managerId);

  // Verificar permissão
  if (!canManageHierarchy(user)) {
    return (
      <Layout>
        <PageContainer>
          <AccessDenied>
            <AccessDeniedIcon>🔒</AccessDeniedIcon>
            <AccessDeniedText>Acesso Negado</AccessDeniedText>
            <AccessDeniedSubtext>
              Apenas Administradores e Masters podem acessar esta página.
            </AccessDeniedSubtext>
          </AccessDenied>
        </PageContainer>
      </Layout>
    );
  }

  if (usersLoading) {
    return (
      <Layout>
        <HierarchyShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageContent>
          <PageHeader>
            <PageTitleContainer>
              <div>
                <PageTitle>Hierarquia de Gestores</PageTitle>
                <PageSubtitle>
                  Gerencie a estrutura hierárquica da empresa e atribua gestores
                  aos colaboradores
                </PageSubtitle>
              </div>
            </PageTitleContainer>
          </PageHeader>

          <TabsContainer>
            <Tab
              $active={activeTab === 'view'}
              onClick={() => setActiveTab('view')}
            >
              <MdAccountTree size={20} />
              Estrutura Hierárquica
            </Tab>
            <Tab
              $active={activeTab === 'assign'}
              onClick={() => setActiveTab('assign')}
            >
              <MdPerson size={20} />
              Atribuir Gestor
            </Tab>
          </TabsContainer>

          <ContentCard>
            {activeTab === 'view' && (
              <>
                {users.length === 0 ? (
                  <EmptyState>
                    <EmptyIcon>
                      <MdSupervisorAccount />
                    </EmptyIcon>
                    <EmptyStateTitle>Nenhum usuário cadastrado</EmptyStateTitle>
                    <EmptyStateDescription>
                      Crie usuários e atribua gestores na aba "Atribuir Gestor"
                    </EmptyStateDescription>
                  </EmptyState>
                ) : !hasHierarchy ? (
                  <EmptyState>
                    <EmptyIcon>
                      <MdAccountTree />
                    </EmptyIcon>
                    <EmptyStateTitle>
                      Nenhuma hierarquia estruturada
                    </EmptyStateTitle>
                    <EmptyStateDescription>
                      Atribua gestores aos colaboradores na aba "Atribuir
                      Gestor" para criar a estrutura hierárquica
                    </EmptyStateDescription>
                  </EmptyState>
                ) : (
                  <TreeContainer>
                    <InfoTipBox $role={user?.role}>
                      <InfoText>
                        <strong>💡 Dica:</strong> Clique nos ícones de seta para
                        expandir/recolher a estrutura hierárquica
                      </InfoText>
                    </InfoTipBox>
                    {getRootUsers().map(rootUser =>
                      renderTreeNode(rootUser, 0)
                    )}
                  </TreeContainer>
                )}
              </>
            )}

            {activeTab === 'assign' && (
              <AssignSection>
                <SectionTitle>Atribuir Gestor aos Colaboradores</SectionTitle>

                <FormGroup>
                  <Label>Selecionar Gestor</Label>
                  {managers.length === 0 ? (
                    <WarningBox>
                      ⚠️ Nenhum gestor cadastrado no sistema.
                      <br />
                      <small>
                        Cadastre usuários com role "manager" primeiro.
                      </small>
                    </WarningBox>
                  ) : (
                    <Select
                      value={selectedManager}
                      onChange={e => setSelectedManager(e.target.value)}
                    >
                      <option value=''>Escolha um gestor...</option>
                      {managers.map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} - {manager.email}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Selecionar Colaboradores</Label>
                  <SearchWrapper>
                    <SearchIcon>
                      <MdSearch size={20} />
                    </SearchIcon>
                    <SearchInput
                      placeholder='Buscar colaborador...'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </SearchWrapper>

                  <CheckboxGroup>
                    {filteredUsers.length === 0 ? (
                      <EmptyState style={{ padding: '20px' }}>
                        <InfoText>Nenhum colaborador encontrado</InfoText>
                      </EmptyState>
                    ) : (
                      filteredUsers.map(user => (
                        <CheckboxItem key={user.id}>
                          <Checkbox
                            type='checkbox'
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                          />
                          <UserAvatar>
                            {user.name.charAt(0).toUpperCase()}
                          </UserAvatar>
                          <CheckboxUserInfo>
                            <CheckboxUserName>{user.name}</CheckboxUserName>
                            <CheckboxUserEmail>{user.email}</CheckboxUserEmail>
                          </CheckboxUserInfo>
                        </CheckboxItem>
                      ))
                    )}
                  </CheckboxGroup>
                </FormGroup>

                <ButtonGroup>
                  <Button
                    onClick={handleAssignManager}
                    disabled={
                      managers.length === 0 ||
                      !selectedManager ||
                      selectedUsers.length === 0 ||
                      loading
                    }
                  >
                    <MdCheck size={20} />
                    Atribuir Gestor
                  </Button>

                  {selectedUsers.length > 0 && (
                    <Button $variant='secondary' onClick={handleClearSelection}>
                      <MdClose size={20} />
                      Limpar Seleção
                    </Button>
                  )}
                </ButtonGroup>

                {selectedUsers.length > 0 && (
                  <SelectionInfo>
                    {selectedUsers.length} colaborador(es) selecionado(s)
                  </SelectionInfo>
                )}
              </AssignSection>
            )}
          </ContentCard>
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default HierarchyPage;
