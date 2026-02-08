# 🔐 Recuperação de Senha - Como Funciona

Esta documentação descreve como o sistema de recuperação de senha (forgot password / reset password) está implementado no App Corretor.

---

## 📋 Visão Geral

O sistema de recuperação de senha permite que usuários solicitem um link de redefinição por email quando esquecem sua senha. O fluxo é composto por três etapas principais:

1. **Solicitar Reset** - Usuário informa o email e recebe um link por email
2. **Confirmar Solicitação** - Página de confirmação informando que o email foi enviado
3. **Redefinir Senha** - Usuário acessa o link e define uma nova senha

---

## 🗂️ Estrutura de Arquivos

```
src/
├── pages/
│   ├── ForgotPasswordPage.tsx              # Página inicial de solicitação
│   ├── ForgotPasswordConfirmationPage.tsx  # Página de confirmação
│   └── ResetPasswordPage.tsx               # Página de redefinição
├── components/auth/
│   ├── ForgotPasswordForm.tsx              # Formulário de solicitação
│   └── ResetPasswordForm.tsx               # Formulário de redefinição
├── hooks/
│   └── usePasswordReset.ts                 # Hook com lógica de negócio
├── services/
│   └── api.ts                              # Endpoints da API
└── types/
    └── auth.ts                             # Interfaces TypeScript
```

---

## 🔄 Fluxo Completo

```
1. Usuário clica em "Esqueceu a senha?" na tela de login
   ↓
2. Redireciona para /forgot-password
   ↓
3. Usuário digita o email e submete o formulário
   ↓
4. POST /auth/forgot-password enviado com o email
   ↓
5. Backend envia email com link de reset (token único)
   ↓
6. Frontend mostra mensagem de sucesso
   ↓
7. Redireciona para /forgot-password-confirmation
   ↓
8. Usuário clica no link recebido por email
   ↓
9. Link redireciona para /reset-password/:token
   ↓
10. Usuário digita nova senha e confirma
   ↓
11. POST /auth/reset-password enviado com token e nova senha
   ↓
12. Backend valida token e atualiza senha
   ↓
13. Frontend mostra sucesso e redireciona para /login
```

---

## 🛣️ Rotas

### `/forgot-password`
- **Componente**: `ForgotPasswordPage`
- **Formulário**: `ForgotPasswordForm`
- **Acesso**: Público (não requer autenticação)
- **Função**: Permite que o usuário solicite reset de senha informando o email

### `/forgot-password-confirmation`
- **Componente**: `ForgotPasswordConfirmationPage`
- **Acesso**: Público
- **Função**: Confirma que o email foi enviado e oferece opção de reenviar

### `/reset-password/:token`
- **Componente**: `ResetPasswordPage`
- **Formulário**: `ResetPasswordForm`
- **Acesso**: Público (com token válido)
- **Função**: Permite que o usuário defina uma nova senha usando o token recebido

---

## 🔌 Endpoints da API

### 1. Solicitar Reset de Senha

**POST** `/auth/forgot-password`

**Request Body:**
```typescript
{
  email: string;
}
```

**Exemplo:**
```json
{
  "email": "corretor@imobiliaria.com.br"
}
```

**Response 200:**
```typescript
{
  message: string;
  success: boolean;
}
```

**Exemplo:**
```json
{
  "message": "Email de recuperação enviado com sucesso",
  "success": true
}
```

**Códigos de Erro:**
- **404**: Email não encontrado no sistema
- **400**: Dados inválidos
- **429**: Muitas tentativas (rate limit)

---

### 2. Redefinir Senha

**POST** `/auth/reset-password`

**Request Body:**
```typescript
{
  token: string;
  password: string;
}
```

**Exemplo:**
```json
{
  "token": "abc123def456...",
  "password": "novaSenhaSegura123"
}
```

**Response 200:**
```typescript
{
  message: string;
  success: boolean;
}
```

**Exemplo:**
```json
{
  "message": "Senha alterada com sucesso",
  "success": true
}
```

**Códigos de Erro:**
- **400**: Dados inválidos ou token inválido
- **410**: Token expirado (Gone)
- **422**: Senha não atende aos critérios de segurança

---

### 3. Verificar Token (Opcional)

**GET** `/auth/verify-reset-token/:token`

**Response 200:**
```typescript
{
  valid: boolean;
}
```

**Exemplo:**
```json
{
  "valid": true
}
```

**Nota**: Este endpoint existe mas não é usado no frontend atualmente. A validação acontece durante o submit do formulário de reset.

---

## 💻 Implementação Frontend

### Hook: `usePasswordReset`

**Arquivo**: `src/hooks/usePasswordReset.ts`

Hook principal que gerencia toda a lógica de recuperação de senha.

**Interface:**
```typescript
interface UsePasswordResetReturn {
  isLoading: boolean;
  alert: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  } | null;
  forgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
  resetPassword: (data: ResetPasswordFormData) => Promise<void>;
  verifyToken: (token: string) => Promise<boolean>;
  clearAlert: () => void;
}
```

**Uso:**
```typescript
import { usePasswordReset } from '../hooks/usePasswordReset';

function ForgotPasswordForm() {
  const { isLoading, alert, forgotPassword, clearAlert } = usePasswordReset();
  
  const handleSubmit = async (email: string) => {
    await forgotPassword({ email });
  };
  
  // ...
}
```

**Funcionalidades:**
- Gerencia estados de loading e alertas
- Trata erros automaticamente com mensagens amigáveis
- Redireciona após operações bem-sucedidas
- Previne múltiplas submissões simultâneas

---

### Componente: `ForgotPasswordForm`

**Arquivo**: `src/components/auth/ForgotPasswordForm.tsx`

Formulário para solicitar reset de senha.

**Campos:**
- Email (obrigatório, tipo email)

**Validações:**
- Email válido (validação HTML5)
- Campo não vazio

**Estados:**
- Exibe formulário inicial
- Após sucesso, mostra mensagem de confirmação
- Redireciona para página de confirmação após 3 segundos

**Exemplo de uso:**
```typescript
<ForgotPasswordForm />
```

---

### Componente: `ResetPasswordForm`

**Arquivo**: `src/components/auth/ResetPasswordForm.tsx`

Formulário para redefinir a senha usando o token.

**Campos:**
- Nova Senha (obrigatório)
- Confirmar Senha (obrigatório)

**Validações:**
- Senhas devem ser iguais
- Indicador visual de força da senha
- Validação de critérios mínimos:
  - Mínimo 6 caracteres
  - Senha forte: 8+ caracteres, com maiúscula e número

**Indicador de Força da Senha:**
- **Fraca**: Menos de 6 caracteres
- **Média**: 6-7 caracteres ou sem maiúscula/número
- **Forte**: 8+ caracteres com maiúscula e número

**Recursos:**
- Toggle para mostrar/ocultar senha
- Feedback visual de força da senha
- Validação em tempo real

**Exemplo de uso:**
```typescript
// Token vem da URL: /reset-password/:token
<ResetPasswordForm />
```

---

### Tipos TypeScript

**Arquivo**: `src/types/auth.ts`

```typescript
// Dados do formulário de solicitação
export interface ForgotPasswordFormData {
  email: string;
}

// Dados do formulário de redefinição
export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Resposta da API - Solicitar reset
export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

// Resposta da API - Redefinir senha
export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}
```

---

## 🎨 Interface do Usuário

### Página de Solicitação (`/forgot-password`)

**Elementos:**
- Título: "Esqueceu sua senha?"
- Subtítulo explicativo
- Campo de email
- Botão "Enviar Link de Recuperação"
- Link "Voltar ao Login"
- Link "Lembrou da senha? Fazer login"

**Após envio bem-sucedido:**
- Mensagem de sucesso: "Email Enviado!"
- Confirmação de email enviado
- Redirecionamento automático após 3 segundos

---

### Página de Confirmação (`/forgot-password-confirmation`)

**Elementos:**
- Ícone de email
- Título: "Email Enviado!"
- Mensagem confirmando envio para o email informado
- Instruções para verificar caixa de entrada
- Aviso sobre pasta de spam
- Botão "Reenviar Email"
- Botão "Voltar ao Login"

---

### Página de Redefinição (`/reset-password/:token`)

**Elementos:**
- Título: "Nova Senha"
- Subtítulo: "Digite sua nova senha para continuar"
- Campo "Nova Senha" (com toggle mostrar/ocultar)
- Indicador de força da senha
- Campo "Confirmar Senha" (com toggle mostrar/ocultar)
- Botão "Alterar Senha"
- Link "Voltar ao Login"
- Link "Lembrou da senha? Fazer login"

**Após redefinição bem-sucedida:**
- Mensagem de sucesso: "Senha Alterada!"
- Confirmação de alteração
- Redirecionamento para login após 3 segundos

---

## 🛡️ Tratamento de Erros

### Erros Comuns

**404 - Email não encontrado:**
```
Mensagem: "Email não encontrado em nosso sistema."
```

**400 - Dados inválidos:**
```
Mensagem: "Dados inválidos. Verifique os campos."
```

**410 - Token expirado:**
```
Mensagem: "Token de reset expirado. Solicite um novo link."
```

**422 - Senha inválida:**
```
Mensagem: "Senha não atende aos critérios de segurança."
```

**500 - Erro do servidor:**
```
Mensagem: "Erro interno do servidor. Tente novamente."
```

### Implementação do Tratamento

O hook `usePasswordReset` possui uma função `handleError` que mapeia códigos HTTP para mensagens amigáveis:

```typescript
const handleError = (error: any, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  
  if (error.response?.status === 404) {
    errorMessage = 'Email não encontrado em nosso sistema.';
  } else if (error.response?.status === 400) {
    errorMessage = 'Dados inválidos. Verifique os campos.';
  } else if (error.response?.status === 410) {
    errorMessage = 'Token de reset expirado. Solicite um novo link.';
  } else if (error.response?.status === 422) {
    errorMessage = 'Senha não atende aos critérios de segurança.';
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  }
  
  setAlert({ type: 'error', message: errorMessage });
};
```

---

## 🔐 Segurança

### Medidas Implementadas

1. **Tokens Únicos e Temporários**
   - Cada token de reset é único e tem tempo de expiração
   - Tokens são invalidados após uso

2. **Validação no Backend**
   - A validação real do token acontece no backend
   - Frontend não valida token antes do submit (evita vazamento de informação)

3. **Rate Limiting**
   - Backend limita quantidade de requisições de reset por email
   - Previne spam e ataques de força bruta

4. **Feedback Genérico**
   - Mesmo se email não existir, mensagem genérica é mostrada
   - Previne enumeração de emails cadastrados

5. **HTTPS Obrigatório**
   - Todos os endpoints devem usar HTTPS em produção
   - Previne interceptação de tokens

---

## 📝 Exemplos de Uso

### Exemplo 1: Solicitar Reset de Senha

```typescript
import { usePasswordReset } from '../hooks/usePasswordReset';

function MyForgotPasswordComponent() {
  const { forgotPassword, isLoading, alert } = usePasswordReset();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    
    await forgotPassword({ email });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar Link'}
      </button>
      {alert && <div>{alert.message}</div>}
    </form>
  );
}
```

---

### Exemplo 2: Redefinir Senha

```typescript
import { useParams } from 'react-router-dom';
import { usePasswordReset } from '../hooks/usePasswordReset';

function MyResetPasswordComponent() {
  const { token } = useParams<{ token: string }>();
  const { resetPassword, isLoading, alert } = usePasswordReset();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    await resetPassword({
      token: token!,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="password" name="password" required />
      <input type="password" name="confirmPassword" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Alterando...' : 'Alterar Senha'}
      </button>
      {alert && <div>{alert.message}</div>}
    </form>
  );
}
```

---

### Exemplo 3: Integração com API Diretamente

```typescript
import { authApi } from '../services/api';

// Solicitar reset
const requestReset = async (email: string) => {
  try {
    const response = await authApi.forgotPassword(email);
    console.log('Email enviado:', response);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Redefinir senha
const resetPassword = async (token: string, password: string) => {
  try {
    const response = await authApi.resetPassword(token, password);
    console.log('Senha alterada:', response);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Verificar token (opcional)
const verifyToken = async (token: string) => {
  try {
    const response = await authApi.verifyResetToken(token);
    console.log('Token válido:', response.valid);
    return response.valid;
  } catch (error) {
    console.error('Token inválido:', error);
    return false;
  }
};
```

---

## 🔗 Integração com Rotas

As rotas de recuperação de senha são configuradas em `src/App.tsx`:

```typescript
// Rotas públicas (não requerem autenticação)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/forgot-password-confirmation',
  '/reset-password',
];

// Configuração de rotas
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route 
  path="/forgot-password-confirmation" 
  element={<ForgotPasswordConfirmationPage />} 
/>
<Route 
  path="/reset-password/:token" 
  element={<ResetPasswordPage />} 
/>
```

**Nota**: A rota `/reset-password/:token` usa parâmetro dinâmico para receber o token do link de email.

---

## 🚀 Boas Práticas

### ✅ Faça:

1. **Use o hook `usePasswordReset`** para gerenciar estado e lógica
2. **Valide campos no frontend** antes de enviar (UX)
3. **Exiba feedback claro** para o usuário (sucesso/erro)
4. **Mantenha tokens seguros** (não logue em produção)
5. **Trate todos os erros** com mensagens amigáveis

### ❌ Evite:

1. **Validar token no frontend** antes do submit (segurança)
2. **Expor mensagens de erro técnicas** ao usuário
3. **Permitir múltiplas submissões** simultâneas
4. **Armazenar tokens** em localStorage ou estado global
5. **Fazer requisições diretas** sem usar o hook ou service

---

## 🐛 Troubleshooting

### Problema: Email não está sendo recebido

**Soluções:**
1. Verificar pasta de spam/lixo eletrônico
2. Confirmar que o email está correto
3. Aguardar alguns minutos (pode haver delay)
4. Solicitar novo link na página de confirmação

### Problema: Token inválido ou expirado

**Soluções:**
1. Solicitar um novo link de reset
2. Verificar se o link foi usado anteriormente (tokens são de uso único)
3. Verificar se não passou muito tempo desde o envio

### Problema: Erro 422 ao definir nova senha

**Soluções:**
1. Verificar critérios de senha:
   - Mínimo de caracteres exigidos
   - Presença de maiúsculas, números, caracteres especiais
2. Consultar mensagem de erro específica retornada pela API

---

## 📚 Referências

- **Hook**: `src/hooks/usePasswordReset.ts`
- **Componentes**: `src/components/auth/ForgotPasswordForm.tsx`, `ResetPasswordForm.tsx`
- **Páginas**: `src/pages/ForgotPasswordPage.tsx`, `ForgotPasswordConfirmationPage.tsx`, `ResetPasswordPage.tsx`
- **Serviços**: `src/services/api.ts` (métodos `forgotPassword`, `resetPassword`, `verifyResetToken`)
- **Tipos**: `src/types/auth.ts`

---

**Versão da Documentação**: 1.0.0  
**Data de Criação**: 2024-01-20  
**Última Atualização**: 2024-01-20























