# 👑 Implementação do Campo Owner - Frontend

## 📋 Visão Geral

Este documento descreve a implementação completa do campo `owner` no frontend do sistema imobiliário. O campo `owner` identifica quem é o **proprietário real da empresa** - ou seja, o usuário que se cadastrou por fora do sistema (via formulário público), diferenciando-o de usuários criados por administradores.

## 🎯 Funcionalidades Implementadas

### ✅ Tipos TypeScript Atualizados
- **`src/types/auth.ts`**: Adicionado campo `owner: boolean` nas interfaces `AuthResponse` e `User`
- **`src/services/authApi.ts`**: Atualizada interface `User` com campo `owner`

### ✅ Utilitários de Verificação
- **`src/utils/ownerUtils.ts`**: Funções utilitárias para verificação de owner
  - `isOwnerFromToken()`: Verifica via token JWT
  - `isOwnerFromUser()`: Verifica via objeto de usuário
  - `isOwnerFromResponse()`: Verifica via resposta da API
  - `getOwnerInfoFromToken()`: Extrai informações do token
  - Constantes e helpers para labels, ícones e cores

### ✅ Hooks React
- **`src/hooks/useOwner.ts`**: Hook principal para gerenciar estado do owner
  - `useOwner()`: Hook completo com loading, error e refresh
  - `useIsOwner()`: Hook simplificado que retorna apenas boolean
  - `useOwnerInfo()`: Hook que retorna informações completas (label, ícone, cor)

### ✅ Componentes Condicionais
- **`src/components/common/OwnerComponents.tsx`**: Componentes para renderização condicional
  - `OwnerOnly`: Renderiza conteúdo apenas para proprietários
  - `AdminOnly`: Renderiza conteúdo apenas para administradores
  - `OwnerConditional`: Renderiza conteúdo diferente para cada tipo
  - `OwnerBadge`: Badge visual indicando status de proprietário
  - `OwnerIndicator`: Indicador simples de proprietário

### ✅ Integração no Dashboard
- **`src/pages/DashboardPage.tsx`**: Dashboard atualizado com conteúdo diferenciado
  - Título e subtítulo personalizados para proprietários
  - Card especial dourado para proprietários
  - Indicadores visuais de status

### ✅ Exemplos de Uso
- **`src/examples/OwnerExamples.tsx`**: Exemplos práticos de implementação
  - Componentes condicionais
  - Hooks personalizados
  - Menu diferenciado
  - Dashboard customizado

## 🚀 Como Usar

### 1. Verificação Simples

```tsx
import { useIsOwner } from '../hooks/useOwner';

function MyComponent() {
  const isOwner = useIsOwner();
  
  return (
    <div>
      {isOwner ? (
        <p>👑 Você é o proprietário!</p>
      ) : (
        <p>👤 Você é um administrador</p>
      )}
    </div>
  );
}
```

### 2. Componente Condicional

```tsx
import { OwnerOnly, OwnerConditional } from '../components';

function Dashboard() {
  return (
    <div>
      <OwnerOnly fallback={<div>Acesso negado</div>}>
        <button>Configurações Avançadas</button>
      </OwnerOnly>
      
      <OwnerConditional
        ownerContent={<div>Painel do Proprietário</div>}
        adminContent={<div>Painel do Administrador</div>}
      />
    </div>
  );
}
```

### 3. Hook Completo

```tsx
import { useOwner } from '../hooks/useOwner';

function UserProfile() {
  const { isOwner, loading, error, ownerInfo } = useOwner();
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      <h2>{ownerInfo?.role}</h2>
      {isOwner && <span>👑 Proprietário Real</span>}
    </div>
  );
}
```

### 4. Menu Diferenciado

```tsx
import { useOwner } from '../hooks/useOwner';

function Navigation() {
  const { isOwner } = useOwner();
  
  const ownerMenu = [
    { label: 'Configurações da Empresa', path: '/company' },
    { label: 'Relatórios Financeiros', path: '/reports' },
    { label: 'Plano e Cobrança', path: '/billing' }
  ];
  
  const adminMenu = [
    { label: 'Gerenciar Usuários', path: '/users' },
    { label: 'Relatórios Básicos', path: '/reports' }
  ];
  
  const menuItems = isOwner ? ownerMenu : adminMenu;
  
  return (
    <nav>
      {menuItems.map(item => (
        <a key={item.path} href={item.path}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

## 🔧 Configuração

### Endpoints da API

O frontend está configurado para trabalhar com os seguintes endpoints:

- **`GET /auth/profile`**: Retorna dados do usuário incluindo `owner`
- **`POST /auth/login`**: Retorna dados do usuário incluindo `owner`
- **`POST /auth/register`**: Retorna dados do usuário incluindo `owner` (sempre `true`)
- **`POST /auth/refresh`**: Retorna dados do usuário incluindo `owner`

### Estrutura de Dados

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  owner: boolean; // ← Campo implementado
  // ... outros campos
}
```

### Token JWT

O campo `owner` também está disponível no token JWT:

```javascript
const payload = {
  "sub": "user-uuid",
  "email": "usuario@empresa.com",
  "role": "ADMIN",
  "owner": true // ← Campo disponível no token
}
```

## 🎨 Estilos e Indicadores Visuais

### Cores Padrão
- **Proprietário**: `#FFD700` (dourado)
- **Administrador**: `#6B7280` (cinza)

### Ícones Padrão
- **Proprietário**: `👑` (coroa)
- **Administrador**: `👤` (usuário)

### Labels Padrão
- **Proprietário**: "Proprietário Real"
- **Administrador**: "Administrador"

## 🔍 Verificação de Funcionamento

### 1. Verificar Token
```javascript
// No console do navegador
const token = localStorage.getItem('imobx_access_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Owner:', payload.owner);
```

### 2. Verificar API
```javascript
// No console do navegador
fetch('/auth/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('Owner:', data.owner));
```

### 3. Verificar Componentes
- Abrir o Dashboard e verificar se aparece o card dourado para proprietários
- Verificar se o título mostra o indicador de proprietário
- Testar componentes condicionais em diferentes páginas

## 📝 Notas Importantes

### Segurança
- O campo `owner` é apenas informativo no frontend
- A segurança real deve ser implementada no backend
- Sempre validar permissões no servidor

### Performance
- O hook `useOwner` usa cache via token JWT para verificações rápidas
- Faz requisições à API apenas quando necessário
- Escuta eventos de atualização de dados do usuário

### Compatibilidade
- Usuários antigos terão `owner: false` por padrão
- Novos cadastros públicos sempre terão `owner: true`
- O campo sempre retorna `boolean`

## 🐛 Troubleshooting

### Erro: "Failed to resolve import"
- Verificar se o arquivo `src/hooks/useOwner.ts` existe
- Verificar se o caminho do import está correto (`../../hooks/useOwner`)

### Hook não atualiza
- Verificar se o evento `user-data-updated` está sendo disparado
- Verificar se o token JWT contém o campo `owner`

### Componente não renderiza
- Verificar se o usuário está autenticado
- Verificar se o campo `owner` está presente nos dados do usuário
- Verificar se não há erros de linting

## 🚀 Próximos Passos

1. **Testar** com diferentes tipos de usuários
2. **Implementar** em outras páginas do sistema
3. **Adicionar** mais indicadores visuais
4. **Configurar** rotas protegidas por owner
5. **Documentar** casos específicos do projeto

---

*Implementação concluída em: Janeiro 2025*  
*Versão: 1.0.0*
