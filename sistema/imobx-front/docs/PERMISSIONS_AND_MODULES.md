# 🔐 Permissões e Módulos - Sistema de Controle de Acesso

Esta documentação descreve como o sistema verifica **permissões** e **módulos** do usuário para controlar o acesso a rotas, exibição de telas, botões e elementos da interface. Este é um sistema crítico para segurança e controle de acesso.

---

## 📋 Visão Geral

O sistema utiliza uma arquitetura de **duas camadas** para controle de acesso:

1. **Permissões** - Controle fino de ações específicas (ex: `property:view`, `client:create`)
2. **Módulos** - Controle de funcionalidades completas (ex: `property_management`, `client_management`)

### Diferença entre Permissões e Módulos

**Permissões:**
- Granularidade: Ação específica
- Exemplos: `property:view`, `property:create`, `property:update`, `property:delete`
- Uso: Controlar botões, ações, campos específicos
- Verificação: `hasPermission('property:view')`

**Módulos:**
- Granularidade: Funcionalidade completa
- Exemplos: `property_management`, `client_management`, `kanban_management`
- Uso: Controlar acesso a rotas/páginas inteiras
- Verificação: `isModuleAvailable('property_management')`

**Relação:**
- Um módulo pode requerer múltiplas permissões
- Uma permissão pode estar associada a um módulo específico
- Ambos devem ser verificados para acesso completo

---

## 🔄 Como Funciona

### Fluxo de Verificação

```
1. Usuário faz login
   ↓
2. Sistema carrega permissões (my-permissions)
   ↓
3. Sistema carrega empresa (com availableModules)
   ↓
4. PermissõesContext disponibiliza permissões
   ↓
5. CompanyContext disponibiliza módulos
   ↓
6. Componentes verificam permissões/módulos
   ↓
7. Renderização condicional baseada em acesso
```

---

## 🎣 Hooks e Contextos

### PermissionsContext

**Arquivo**: `src/contexts/PermissionsContext.tsx`

**Função**: Fornecer permissões do usuário para toda a aplicação

**Interface:**
```typescript
interface PermissionsContextType {
  userPermissions: {
    permissionNames: string[];
    role: string;
    companyId: string;
  } | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isLoading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
  invalidateCache: () => void;
  cacheStats: {
    exists: boolean;
    isValid: boolean;
    isStale: boolean;
    age?: number;
    permissionsCount?: number;
    role?: string;
  };
}
```

**Uso:**
```typescript
import { usePermissionsContext, usePermissionsContextOptional } from '../contexts/PermissionsContext';

// Hook obrigatório (lança erro se não estiver no Provider)
const { hasPermission, userPermissions } = usePermissionsContext();

// Hook opcional (retorna null se não estiver no Provider)
const permissionsContext = usePermissionsContextOptional();
const hasPermission = permissionsContext?.hasPermission('property:view') ?? false;
```

---

### useModuleAccess

**Arquivo**: `src/hooks/useModuleAccess.ts`

**Função**: Hook unificado para verificar módulos e permissões

**Interface:**
```typescript
interface UseModuleAccessReturn {
  // Estado
  availableModules: ModuleInfo[];
  modulesByCategory: Record<string, ModuleInfo[]>;
  isLoading: boolean;
  
  // Verificações de módulo
  isModuleAvailableForCompany: (moduleId: string) => boolean;
  hasPermissionForModule: (moduleId: string) => boolean;
  canAccessRoutePath: (route: string) => boolean;
  
  // Verificações de permissão
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  
  // Dados brutos
  companyModules: string[];
  userPermissionNames: string[];
}
```

**Uso:**
```typescript
import { useModuleAccess } from '../hooks/useModuleAccess';

function MyComponent() {
  const { 
    hasPermission,
    isModuleAvailableForCompany,
    hasPermissionForModule
  } = useModuleAccess();
  
  // Verificar permissão
  const canView = hasPermission('property:view');
  
  // Verificar módulo
  const hasModule = isModuleAvailableForCompany('property_management');
  
  // Verificar se tem permissão para módulo
  const canAccess = hasPermissionForModule('property_management');
}
```

---

## 🛡️ Componentes de Proteção

### 1. PermissionRoute

**Arquivo**: `src/components/PermissionRoute.tsx`

**Função**: Proteger rotas baseado em permissões

**Props:**
```typescript
interface PermissionRouteProps {
  children: React.ReactNode;
  permission?: string;              // Permissão única
  permissions?: string[];           // Múltiplas permissões
  requireAll?: boolean;             // Requer todas (padrão: false = qualquer uma)
  fallbackPath?: string;            // Não usado (retorna null)
}
```

**Comportamento:**
- Se não tem permissão: **Não renderiza nada** (retorna `null`)
- Se tem permissão: Renderiza `children`
- **Bypass para roles**: `master`, `admin`, `manager` sempre têm acesso

**Exemplo de Uso:**
```typescript
<Route
  path="/properties"
  element={
    <PermissionRoute permission="property:view">
      <PropertiesPage />
    </PermissionRoute>
  }
/>

// Múltiplas permissões (qualquer uma)
<PermissionRoute permissions={['property:view', 'property:create']}>
  <PropertiesPage />
</PermissionRoute>

// Múltiplas permissões (todas)
<PermissionRoute 
  permissions={['property:view', 'property:update']} 
  requireAll={true}
>
  <EditPropertyPage />
</PermissionRoute>
```

---

### 2. ModuleRoute

**Arquivo**: `src/components/ModuleRoute.tsx`

**Função**: Proteger rotas baseado em módulos disponíveis

**Props:**
```typescript
interface ModuleRouteProps {
  children: React.ReactNode;
  requiredModule: string;          // ID do módulo necessário
  redirectTo?: string;              // Rota de redirecionamento (padrão: '/dashboard')
  showToast?: boolean;              // Mostrar toast de erro (padrão: true)
}
```

**Comportamento:**
- Verifica se módulo está disponível na empresa
- Verifica se usuário tem permissões para o módulo
- Se não tem acesso: **Redireciona** para `redirectTo` e mostra toast
- **Bypass para roles**: `master`, `admin`, `manager` sempre têm acesso

**Exemplo de Uso:**
```typescript
<Route
  path="/rentals"
  element={
    <ModuleRoute requiredModule="rental_management">
      <RentalsPage />
    </ModuleRoute>
  }
/>

// Com redirecionamento customizado
<ModuleRoute 
  requiredModule="ai_assistant" 
  redirectTo="/dashboard"
  showToast={true}
>
  <AIAssistantPage />
</ModuleRoute>
```

---

### 3. PermissionWrapper

**Arquivo**: `src/components/PermissionWrapper.tsx`

**Função**: Controlar renderização de elementos baseado em permissões e módulos

**Props:**
```typescript
interface PermissionWrapperProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  moduleId?: string;                // Módulo necessário (opcional)
  fallback?: React.ReactNode;       // Elemento a mostrar se não tem acesso
  hideIfNoPermission?: boolean;    // Ocultar completamente (padrão: true)
}
```

**Comportamento:**
- Se `hideIfNoPermission === true`: Retorna `null` se não tem acesso
- Se `hideIfNoPermission === false`: Retorna `fallback` se não tem acesso
- Verifica módulo primeiro (se especificado), depois permissões

**Exemplo de Uso:**
```typescript
// Ocultar completamente se não tem permissão
<PermissionWrapper permission="property:create">
  <button>Criar Propriedade</button>
</PermissionWrapper>

// Mostrar fallback se não tem permissão
<PermissionWrapper 
  permission="property:delete"
  fallback={<span>Sem permissão para deletar</span>}
  hideIfNoPermission={false}
>
  <button>Deletar</button>
</PermissionWrapper>

// Verificar módulo e permissão
<PermissionWrapper 
  moduleId="property_management"
  permission="property:view"
>
  <PropertiesList />
</PermissionWrapper>
```

---

### 4. PermissionButton

**Arquivo**: `src/components/common/PermissionButton.tsx`

**Função**: Botão que se desabilita automaticamente se não tem permissão

**Props:**
```typescript
interface PermissionButtonProps {
  permission: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}
```

**Comportamento:**
- Se tem permissão: Botão normal e funcional
- Se não tem permissão: Botão desabilitado com tooltip explicativo
- Tooltip automático: "Você não tem permissão para [ação]. Entre em contato com um administrador."

**Exemplo de Uso:**
```typescript
import { PermissionButton } from '../components/common/PermissionButton';

<PermissionButton
  permission="property:create"
  onClick={handleCreate}
  variant="primary"
>
  Criar Propriedade
</PermissionButton>

// Com tooltip customizado
<PermissionButton
  permission="property:delete"
  onClick={handleDelete}
  variant="danger"
  tooltip="Você precisa de permissão de exclusão"
>
  Deletar
</PermissionButton>
```

---

### 5. PermissionMenuItem

**Arquivo**: `src/components/common/PermissionMenuItem.tsx`

**Função**: Item de menu que se desabilita ou oculta se não tem permissão

**Props:**
```typescript
interface PermissionMenuItemProps {
  permission: string;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  hideIfNoPermission?: boolean;    // Ocultar se não tem permissão
}
```

**Comportamento:**
- Se `hideIfNoPermission === true`: Não renderiza se não tem permissão
- Se `hideIfNoPermission === false`: Renderiza desabilitado com tooltip
- Tooltip automático explicando falta de permissão

**Exemplo de Uso:**
```typescript
import { PermissionMenuItem } from '../components/common/PermissionMenuItem';

// Ocultar se não tem permissão
<PermissionMenuItem
  permission="property:delete"
  onClick={handleDelete}
  hideIfNoPermission={true}
  danger={true}
>
  <MdDelete /> Deletar Propriedade
</PermissionMenuItem>

// Mostrar desabilitado se não tem permissão
<PermissionMenuItem
  permission="property:update"
  onClick={handleEdit}
  hideIfNoPermission={false}
>
  <MdEdit /> Editar
</PermissionMenuItem>
```

---

### 6. ModuleGuard

**Arquivo**: `src/components/ModuleGuard.tsx`

**Função**: Guard que verifica módulo baseado na rota atual

**Props:**
```typescript
interface ModuleGuardProps {
  children: React.ReactNode;
  fallbackRoute?: string;          // Rota de redirecionamento (padrão: '/dashboard')
}
```

**Comportamento:**
- Detecta automaticamente o módulo necessário baseado na rota atual
- Verifica se módulo está disponível na empresa
- Verifica se usuário tem permissões para o módulo
- Se não tem acesso: **Redireciona** para `fallbackRoute`
- **Bypass para roles**: `master`, `admin`, `manager` sempre têm acesso

**Exemplo de Uso:**
```typescript
// Usar como wrapper de rota
<Route
  path="/properties"
  element={
    <ModuleGuard fallbackRoute="/dashboard">
      <PropertiesPage />
    </ModuleGuard>
  }
/>
```

---

### 7. ModuleGuard (do ModuleRoute.tsx)

**Arquivo**: `src/components/ModuleRoute.tsx` (função `ModuleGuard`)

**Função**: Mostrar conteúdo apenas se módulo estiver disponível

**Props:**
```typescript
interface ModuleGuardProps {
  children: React.ReactNode;
  module: string;
  fallback?: React.ReactNode;
}
```

**Comportamento:**
- Verifica se módulo está disponível
- Se não está disponível: Retorna `fallback` (ou `null`)
- **Bypass para roles**: `master`, `admin`, `manager` sempre têm acesso

**Exemplo de Uso:**
```typescript
import { ModuleGuard } from '../components/ModuleRoute';

<ModuleGuard module="rental_management">
  <RentalButton />
</ModuleGuard>

// Com fallback
<ModuleGuard 
  module="ai_assistant"
  fallback={<UpgradeBadge moduleName="ai_assistant" />}
>
  <AIAssistantButton />
</ModuleGuard>
```

---

## 📊 Verificação de Permissões

### Verificação Simples

```typescript
import { usePermissionsContextOptional } from '../contexts/PermissionsContext';

function MyComponent() {
  const permissionsContext = usePermissionsContextOptional();
  const hasPermission = permissionsContext?.hasPermission('property:view') ?? false;
  
  if (!hasPermission) {
    return <div>Sem permissão</div>;
  }
  
  return <div>Conteúdo protegido</div>;
}
```

---

### Verificação Múltipla (Qualquer Uma)

```typescript
const hasAnyPermission = permissionsContext?.hasAnyPermission([
  'property:view',
  'property:create'
]) ?? false;

if (hasAnyPermission) {
  // Usuário tem pelo menos uma das permissões
}
```

---

### Verificação Múltipla (Todas)

```typescript
const hasAllPermissions = permissionsContext?.hasAllPermissions([
  'property:view',
  'property:update'
]) ?? false;

if (hasAllPermissions) {
  // Usuário tem todas as permissões
}
```

---

### Verificação com Hook useModuleAccess

```typescript
import { useModuleAccess } from '../hooks/useModuleAccess';

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useModuleAccess();
  
  const canView = hasPermission('property:view');
  const canEdit = hasPermission('property:update');
  const canDelete = hasPermission('property:delete');
  
  // Verificar múltiplas
  const canManage = hasAllPermissions(['property:view', 'property:update']);
}
```

---

## 🏢 Verificação de Módulos

### Verificar se Módulo está Disponível

```typescript
import { useModuleAccess } from '../hooks/useModuleAccess';

function MyComponent() {
  const { isModuleAvailableForCompany } = useModuleAccess();
  
  const hasPropertyModule = isModuleAvailableForCompany('property_management');
  const hasClientModule = isModuleAvailableForCompany('client_management');
  
  if (!hasPropertyModule) {
    return <div>Módulo não disponível no seu plano</div>;
  }
  
  return <PropertiesPage />;
}
```

---

### Verificar Permissão para Módulo

```typescript
const { hasPermissionForModule } = useModuleAccess();

// Verifica se usuário tem permissões necessárias para o módulo
const canAccessPropertyModule = hasPermissionForModule('property_management');
```

---

### Verificar Acesso a Rota

```typescript
const { canAccessRoutePath } = useModuleAccess();

// Verifica módulo + permissões para uma rota específica
const canAccessProperties = canAccessRoutePath('/properties');
```

---

## 🎨 Exemplos Práticos

### Exemplo 1: Proteger Rota Completa

```typescript
// App.tsx
<Route
  path="/properties"
  element={
    <ModuleRoute requiredModule="property_management">
      <PermissionRoute permission="property:view">
        <PropertiesPage />
      </PermissionRoute>
    </ModuleRoute>
  }
/>
```

**Ordem de verificação:**
1. Verifica se módulo `property_management` está disponível
2. Verifica se usuário tem permissão `property:view`
3. Se ambos passarem, renderiza a página

---

### Exemplo 2: Botão Condicional

```typescript
function PropertiesPage() {
  const { hasPermission } = useModuleAccess();
  
  return (
    <div>
      <h1>Propriedades</h1>
      
      {/* Botão com verificação manual */}
      {hasPermission('property:create') && (
        <button onClick={handleCreate}>
          Criar Propriedade
        </button>
      )}
      
      {/* Botão com componente PermissionButton */}
      <PermissionButton
        permission="property:create"
        onClick={handleCreate}
      >
        Criar Propriedade
      </PermissionButton>
    </div>
  );
}
```

---

### Exemplo 3: Menu Condicional

```typescript
function PropertyMenu() {
  return (
    <Menu>
      <PermissionMenuItem
        permission="property:view"
        onClick={() => navigate('/properties')}
      >
        Ver Propriedades
      </PermissionMenuItem>
      
      <PermissionMenuItem
        permission="property:create"
        onClick={() => navigate('/properties/create')}
        hideIfNoPermission={true}
      >
        Criar Propriedade
      </PermissionMenuItem>
      
      <PermissionMenuItem
        permission="property:delete"
        onClick={handleDelete}
        danger={true}
        hideIfNoPermission={true}
      >
        Deletar
      </PermissionMenuItem>
    </Menu>
  );
}
```

---

### Exemplo 4: Seção Condicional Completa

```typescript
function PropertyDetailsPage() {
  const { hasPermission } = useModuleAccess();
  
  return (
    <div>
      <h1>Detalhes da Propriedade</h1>
      
      {/* Informações básicas - sempre visíveis */}
      <PropertyInfo property={property} />
      
      {/* Seção de ações - condicional */}
      <PermissionWrapper permission="property:update">
        <EditButton onClick={handleEdit} />
      </PermissionWrapper>
      
      <PermissionWrapper 
        permission="property:delete"
        fallback={<span>Sem permissão para deletar</span>}
        hideIfNoPermission={false}
      >
        <DeleteButton onClick={handleDelete} />
      </PermissionWrapper>
      
      {/* Seção de módulo específico */}
      <ModuleGuard module="ai_assistant">
        <AIAnalysisSection property={property} />
      </ModuleGuard>
    </div>
  );
}
```

---

### Exemplo 5: Drawer/Navegação

```typescript
// Drawer.tsx - Exemplo de como itens são filtrados
const navigationItems = [
  {
    id: 'properties',
    title: 'Propriedades',
    path: '/properties',
    permission: 'property:view',
    requiredModule: 'property_management',
  },
  {
    id: 'clients',
    title: 'Clientes',
    path: '/clients',
    permission: 'client:view',
    requiredModule: 'client_management',
  }
];

// Filtro automático baseado em permissões e módulos
const filteredItems = navigationItems.filter(item => {
  // Verificar módulo
  if (item.requiredModule && !isModuleAvailable(item.requiredModule)) {
    return false;
  }
  
  // Verificar permissão
  if (item.permission && !hasPermission(item.permission)) {
    return false;
  }
  
  return true;
});
```

---

## 🔄 Bypass de Roles

### Roles com Acesso Total

Os seguintes roles **sempre têm acesso**, independente de permissões ou módulos:

- `master` - Acesso total ao sistema
- `admin` - Acesso administrativo
- `manager` - Acesso de gerência

**Implementação:**
```typescript
const userRole = currentUser?.role?.toLowerCase();
const hasRoleBypass = ['master', 'admin', 'manager'].includes(userRole);

if (!hasAccess && hasRoleBypass) {
  hasAccess = true; // Bypass automático
}
```

**Nota**: Este bypass é aplicado automaticamente em:
- `PermissionRoute`
- `ModuleRoute`
- `ModuleGuard`
- Verificações de permissão em geral

---

## 📝 Mapeamento Permissão → Módulo

**Arquivo**: `src/utils/permissionModuleMapping.ts`

**Função**: Mapear qual módulo é necessário para uma permissão

**Uso:**
```typescript
import { getRequiredModuleForPermission } from '../utils/permissionModuleMapping';

const module = getRequiredModuleForPermission('property:view');
// Retorna: 'property_management'

const module = getRequiredModuleForPermission('client:create');
// Retorna: 'client_management'
```

**Mapeamentos Principais:**

| Permissão | Módulo Necessário |
|-----------|-------------------|
| `property:*` | `property_management` |
| `client:*` | `client_management` |
| `kanban:*` | `kanban_management` |
| `inspection:*` | `vistoria` |
| `key:*` | `key_control` |
| `rental:*` | `rental_management` |
| `calendar:*` | `calendar_management` |
| `commission:*` | `commission_management` |
| `match:*` | `match_system` |
| `team:*` | `team_management` |
| `financial:*` | `financial_management` |
| `marketing:*` | `marketing_tools` |
| `bi:*` | `business_intelligence` |
| `gamification:*` | `gamification` |

---

## 🗂️ Mapeamento de Módulos

**Arquivo**: `src/utils/moduleMapping.ts`

**Função**: Definir informações sobre cada módulo

**Estrutura:**
```typescript
interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  requiredPermissions: string[];  // Permissões necessárias
  category: string;
}
```

**Exemplo:**
```typescript
property_management: {
  id: 'property_management',
  name: 'Propriedades',
  description: 'Gerenciar propriedades',
  icon: '🏠',
  route: '/properties',
  requiredPermissions: ['property:view'],
  category: 'Gestão',
}
```

---

## 🎯 Casos de Uso Comuns

### Caso 1: Página com Múltiplas Ações

```typescript
function PropertiesPage() {
  const { hasPermission } = useModuleAccess();
  
  return (
    <div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Botão sempre visível */}
        <button onClick={handleRefresh}>Atualizar</button>
        
        {/* Botão condicional */}
        {hasPermission('property:create') && (
          <button onClick={handleCreate}>Criar</button>
        )}
        
        {/* Botão com componente */}
        <PermissionButton
          permission="property:export"
          onClick={handleExport}
        >
          Exportar
        </PermissionButton>
      </div>
      
      <PropertiesList />
    </div>
  );
}
```

---

### Caso 2: Menu Dropdown com Permissões

```typescript
function PropertyActionsMenu({ property }) {
  return (
    <DropdownMenu>
      <PermissionMenuItem
        permission="property:view"
        onClick={() => navigate(`/properties/${property.id}`)}
      >
        Ver Detalhes
      </PermissionMenuItem>
      
      <PermissionMenuItem
        permission="property:update"
        onClick={() => navigate(`/properties/${property.id}/edit`)}
      >
        Editar
      </PermissionMenuItem>
      
      <PermissionMenuItem
        permission="property:delete"
        onClick={() => handleDelete(property.id)}
        danger={true}
        hideIfNoPermission={true}
      >
        Deletar
      </PermissionMenuItem>
    </DropdownMenu>
  );
}
```

---

### Caso 3: Formulário com Campos Condicionais

```typescript
function PropertyForm() {
  const { hasPermission } = useModuleAccess();
  
  return (
    <form>
      <input name="title" placeholder="Título" />
      <input name="price" placeholder="Preço" />
      
      {/* Campo apenas para quem pode editar preço */}
      <PermissionWrapper permission="property:update_price">
        <input name="discount" placeholder="Desconto" />
      </PermissionWrapper>
      
      {/* Seção completa condicional */}
      {hasPermission('property:view_financial') && (
        <FinancialSection />
      )}
    </form>
  );
}
```

---

### Caso 4: Dashboard com Cards Condicionais

```typescript
function Dashboard() {
  const { hasPermission, isModuleAvailableForCompany } = useModuleAccess();
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {/* Card sempre visível */}
        <DashboardCard title="Visão Geral" />
        
        {/* Card condicional por permissão */}
        {hasPermission('property:view') && (
          <DashboardCard title="Propriedades" />
        )}
        
        {/* Card condicional por módulo */}
        {isModuleAvailableForCompany('client_management') && (
          <DashboardCard title="Clientes" />
        )}
        
        {/* Card condicional por módulo E permissão */}
        {isModuleAvailableForCompany('financial_management') && 
         hasPermission('financial:view') && (
          <DashboardCard title="Financeiro" />
        )}
      </div>
    </div>
  );
}
```

---

## 🚨 Tratamento de Estados

### Loading State

```typescript
const { isLoading } = useModuleAccess();

if (isLoading) {
  return <LoadingSpinner />;
}
```

---

### Sem Permissões

```typescript
const permissionsContext = usePermissionsContextOptional();

if (!permissionsContext || !permissionsContext.userPermissions) {
  return <div>Carregando permissões...</div>;
}

if (permissionsContext.userPermissions.permissionNames.length === 0) {
  return <div>Você não tem permissões atribuídas</div>;
}
```

---

### Módulo Não Disponível

```typescript
const { isModuleAvailableForCompany } = useModuleAccess();

if (!isModuleAvailableForCompany('property_management')) {
  return (
    <div>
      <h2>Módulo não disponível</h2>
      <p>O módulo de Propriedades não está incluído no seu plano.</p>
      <button onClick={() => navigate('/subscription')}>
        Ver Planos
      </button>
    </div>
  );
}
```

---

## 🔍 Debugging

### Verificar Permissões do Usuário

```typescript
const permissionsContext = usePermissionsContextOptional();

console.log('Permissões do usuário:', permissionsContext?.userPermissions?.permissionNames);
console.log('Tem property:view?', permissionsContext?.hasPermission('property:view'));
```

---

### Verificar Módulos Disponíveis

```typescript
const { selectedCompany } = useCompanyContext();

console.log('Módulos da empresa:', selectedCompany?.availableModules);
console.log('Tem property_management?', 
  selectedCompany?.availableModules?.includes('property_management')
);
```

---

### Verificar Cache de Permissões

```typescript
const { cacheStats } = usePermissionsContext();

console.log('Cache stats:', {
  exists: cacheStats.exists,
  isValid: cacheStats.isValid,
  isStale: cacheStats.isStale,
  age: cacheStats.age,
  permissionsCount: cacheStats.permissionsCount
});
```

---

## 🚀 Boas Práticas

### ✅ Faça:

1. **Use componentes de proteção** (`PermissionRoute`, `PermissionButton`, etc)
2. **Verifique módulo E permissão** quando necessário
3. **Use `useModuleAccess`** para verificações unificadas
4. **Oculte elementos** se não tem acesso (melhor UX)
5. **Mostre tooltips** explicativos quando desabilitar
6. **Aguarde carregamento** antes de verificar permissões
7. **Use cache** de permissões para performance

### ❌ Evite:

1. **Verificar permissões diretamente** sem usar hooks/contextos
2. **Hardcode verificações** de permissão
3. **Ignorar módulos** - sempre verificar se módulo está disponível
4. **Fazer verificações no backend** sem verificar no frontend (segurança em camadas)
5. **Mostrar elementos desabilitados** sem explicação
6. **Fazer múltiplas chamadas** de API de permissões
7. **Assumir que permissões existem** - sempre verificar

---

## 📊 Fluxo de Decisão

### Quando Usar Cada Componente

```
Proteger Rota?
  ├─ Sim → ModuleRoute + PermissionRoute
  └─ Não → Continuar

Proteger Botão/Ação?
  ├─ Ocultar se não tem? → PermissionButton ou verificação manual
  └─ Mostrar desabilitado? → PermissionButton com tooltip

Proteger Seção/Elemento?
  ├─ Ocultar completamente? → PermissionWrapper (hideIfNoPermission=true)
  └─ Mostrar fallback? → PermissionWrapper (hideIfNoPermission=false)

Proteger Menu Item?
  ├─ Ocultar se não tem? → PermissionMenuItem (hideIfNoPermission=true)
  └─ Mostrar desabilitado? → PermissionMenuItem (hideIfNoPermission=false)

Verificar Módulo?
  ├─ Proteger rota? → ModuleRoute
  └─ Proteger elemento? → ModuleGuard
```

---

## 🔄 Atualização de Permissões

### Refresh Manual

```typescript
const { refreshPermissions } = usePermissionsContext();

// Forçar atualização
await refreshPermissions();
```

### Invalidação de Cache

```typescript
const { invalidateCache } = usePermissionsContext();

// Invalidar cache (próxima verificação buscará da API)
invalidateCache();
```

### WebSocket (Atualização Automática)

O sistema possui WebSocket que atualiza permissões automaticamente quando mudam no backend.

---

## 📚 Referências

- **PermissionsContext**: `src/contexts/PermissionsContext.tsx`
- **PermissionRoute**: `src/components/PermissionRoute.tsx`
- **ModuleRoute**: `src/components/ModuleRoute.tsx`
- **PermissionWrapper**: `src/components/PermissionWrapper.tsx`
- **PermissionButton**: `src/components/common/PermissionButton.tsx`
- **PermissionMenuItem**: `src/components/common/PermissionMenuItem.tsx`
- **useModuleAccess**: `src/hooks/useModuleAccess.ts`
- **moduleMapping**: `src/utils/moduleMapping.ts`
- **permissionModuleMapping**: `src/utils/permissionModuleMapping.ts`

---

## 🎓 Checklist para Desenvolvedores

Ao criar novas funcionalidades:

- [ ] Identificar permissões necessárias
- [ ] Identificar módulo necessário (se houver)
- [ ] Proteger rota com `ModuleRoute` e `PermissionRoute`
- [ ] Proteger botões com `PermissionButton` ou verificação manual
- [ ] Proteger menus com `PermissionMenuItem`
- [ ] Proteger seções com `PermissionWrapper`
- [ ] Testar com usuário sem permissões
- [ ] Testar com usuário sem módulo
- [ ] Verificar tooltips e mensagens de erro
- [ ] Verificar bypass de roles (master/admin/manager)

---

**Versão da Documentação**: 1.0.0  
**Data de Criação**: 2024-01-20  
**Última Atualização**: 2024-01-20






















