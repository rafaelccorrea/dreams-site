# 💬 Documentação Completa - Sistema de Chat

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Rotas Frontend](#-rotas-frontend)
3. [Endpoints da API](#-endpoints-da-api)
4. [Estrutura de Dados](#-estrutura-de-dados)
5. [WebSocket Events](#-websocket-events)
6. [Validações Completas](#-validações-completas)
7. [Fluxos Principais](#-fluxos-principais)
8. [Permissões e Módulos](#-permissões-e-módulos)
9. [Componentes Relacionados](#-componentes-relacionados)
10. [Tratamento de Erros](#-tratamento-de-erros)
11. [Próximas Melhorias](#-próximas-melhorias)

---

## 🎯 Visão Geral

O sistema de chat permite comunicação em tempo real entre usuários da empresa através de conversas diretas, grupos e canal de suporte. Utiliza WebSocket para mensagens instantâneas e API REST para operações que requerem upload de arquivos ou persistência de dados.

### Funcionalidades Principais

- ✅ **Conversas Diretas**: Chat privado entre dois usuários
- ✅ **Grupos**: Chat em grupo com múltiplos participantes
- ✅ **Suporte**: Canal especial de suporte para atendimento
- ✅ **Mensagens em Tempo Real**: WebSocket para entrega instantânea
- ✅ **Envio de Arquivos**: Suporte para imagens e documentos (PDF, DOC, XLS, etc)
- ✅ **Status de Mensagens**: Enviado, Entregue, Lido
- ✅ **Arquivamento**: Arquivar conversas
- ✅ **Histórico**: Histórico completo de mensagens e atividades do grupo
- ✅ **Edição de Mensagens**: Editar mensagens após envio
- ✅ **Exclusão de Mensagens**: Deletar mensagens (dentro de 5 minutos)
- ✅ **Administradores de Grupo**: Gerenciar administradores em grupos
- ✅ **Notificações**: Abertura automática de chat para novas mensagens
- ✅ **Mensagens Offline**: Mensagens pendentes são entregues quando voltar online

### Módulo Requerido

- **`chat`**: Módulo obrigatório para acessar funcionalidades de chat

---

## 🛣️ Rotas Frontend

### Rotas Protegidas (Requerem Autenticação e Módulo Chat)

#### 1. Chat Principal
- **Rota:** `/chat`
- **Componente:** `ChatPage`
- **Módulo:** `chat`
- **Descrição:** Página principal com listagem de conversas e chat

#### 2. Chat por Sala
- **Rota:** `/chat/:roomId`
- **Componente:** `ChatPage`
- **Módulo:** `chat`
- **Descrição:** Chat específico de uma sala/conversa

#### 3. Editar Grupo
- **Rota:** `/chat/edit-group/:roomId`
- **Componente:** `EditGroupChatPage`
- **Módulo:** `chat`
- **Descrição:** Página para editar configurações de um grupo

---

## 🔌 Endpoints da API

### Base URL
```
/api/chat
```

**Autenticação:** Requer token JWT no header `Authorization` e header `X-Company-ID`

### Índice de Endpoints (19 rotas)

#### Salas (Rooms)

1. **POST** `/chat/rooms` - Criar ou obter uma sala
2. **GET** `/chat/rooms` - Listar todas as salas do usuário
3. **GET** `/chat/rooms/:roomId` - Obter detalhes de uma sala específica
4. **PUT** `/chat/rooms/:roomId` - Atualizar informações da sala (nome, imageUrl)
5. **POST** `/chat/rooms/:roomId/upload-image` - Upload de imagem do grupo
6. **POST** `/chat/rooms/:roomId/participants` - Adicionar participantes a um grupo
7. **POST** `/chat/rooms/:roomId/participants/remove` - Remover participante de um grupo
8. **POST** `/chat/rooms/:roomId/promote-admin` - Promover usuários a administrador
9. **POST** `/chat/rooms/:roomId/remove-admin` - Remover status de administrador
10. **POST** `/chat/rooms/:roomId/archive` - Arquivar conversa
11. **POST** `/chat/rooms/:roomId/unarchive` - Desarquivar conversa
12. **POST** `/chat/rooms/:roomId/leave` - Sair de um grupo
13. **POST** `/chat/rooms/:roomId/read` - Marcar mensagens como lidas
14. **GET** `/chat/rooms/:roomId/messages` - Listar mensagens de uma sala (com paginação)
15. **GET** `/chat/rooms/:roomId/history` - Obter histórico de atividades do grupo

#### Mensagens

16. **POST** `/chat/messages` - Enviar mensagem (suporta FormData para arquivos)
17. **POST** `/chat/messages/edit` - Editar mensagem
18. **POST** `/chat/messages/delete` - Deletar mensagem

#### Utilitários

19. **GET** `/chat/company/users` - Listar usuários da empresa com status online

---

## 📝 Detalhamento de Endpoints

### POST /chat/rooms

Criar ou obter uma sala de chat. Se a sala já existir (especialmente para conversas diretas), retorna a sala existente.

**Request Body:**
```typescript
// Conversa Direta
{
  type: 'direct';
  userId: string;
}

// Grupo
{
  type: 'group';
  name: string;
  userIds: string[];
  adminIds?: string[];
  imageUrl?: string;
}

// Suporte
{
  type: 'support';
}
```

**Response (200 OK ou 201 Created):**
```typescript
ChatRoom
```

### GET /chat/rooms

Listar todas as salas do usuário (incluindo diretas, grupos e suporte).

**Response (200 OK):**
```typescript
ChatRoom[]
```

### GET /chat/rooms/:roomId

Obter detalhes completos de uma sala específica.

**Response (200 OK):**
```typescript
ChatRoom
```

### PUT /chat/rooms/:roomId

Atualizar informações da sala (nome e/ou imageUrl).

**Request Body:**
```typescript
{
  name?: string;
  imageUrl?: string;
}
```

**Response (200 OK):**
```typescript
ChatRoom
```

### POST /chat/rooms/:roomId/upload-image

Fazer upload de imagem do grupo.

**Request Body (FormData):**
```
image: File
```

**Response (200 OK):**
```typescript
ChatRoom
```

### POST /chat/rooms/:roomId/participants

Adicionar participantes a um grupo. Apenas administradores podem adicionar participantes.

**Request Body:**
```typescript
{
  userIds: string[];
}
```

**Response (200 OK):**
```typescript
ChatRoom
```

### POST /chat/rooms/:roomId/participants/remove

Remover participante de um grupo. Apenas administradores podem remover participantes.

**Request Body:**
```typescript
{
  userId: string;
}
```

**Response (200 OK):**
```typescript
void
```

### POST /chat/rooms/:roomId/promote-admin

Promover usuários a administrador do grupo. Apenas administradores podem promover outros usuários.

**Request Body:**
```typescript
{
  userIds: string[];
}
```

**Response (200 OK):**
```typescript
ChatRoom
```

### POST /chat/rooms/:roomId/remove-admin

Remover status de administrador. Apenas administradores podem remover status de administrador de outros usuários.

**Request Body:**
```typescript
{
  userIds: string[];
}
```

**Response (200 OK):**
```typescript
ChatRoom
```

### POST /chat/rooms/:roomId/archive

Arquivar uma conversa. Remove a conversa da lista principal, mas mantém o histórico.

**Response (200 OK):**
```typescript
void
```

### POST /chat/rooms/:roomId/unarchive

Desarquivar uma conversa. Restaura a conversa para a lista principal.

**Response (200 OK):**
```typescript
void
```

### POST /chat/rooms/:roomId/leave

Sair de um grupo. Não pode sair de conversas diretas ou do canal de suporte.

**Response (200 OK):**
```typescript
void
```

### POST /chat/rooms/:roomId/read

Marcar todas as mensagens não lidas de uma sala como lidas.

**Response (200 OK):**
```typescript
void
```

### GET /chat/rooms/:roomId/messages

Listar mensagens de uma sala com paginação.

**Query Parameters:**
- `limit` (number, opcional): Número máximo de mensagens a retornar (padrão: 50)
- `offset` (number, opcional): Número de mensagens a pular (padrão: 0)

**Exemplo:**
```
GET /chat/rooms/abc123/messages?limit=50&offset=0
```

**Response (200 OK):**
```typescript
ChatMessage[]
```

**Nota:** 
- As mensagens são retornadas em ordem cronológica (mais antigas primeiro)
- Padrão de paginação: `limit=50`, `offset=0`
- Para carregar mais mensagens antigas, incrementar o `offset` pelo `limit` (ex: primeira página: offset=0, segunda: offset=50, terceira: offset=100)
- O frontend mantém track do offset atual por sala para implementar scroll infinito

### GET /chat/rooms/:roomId/history

Obter histórico completo de atividades do grupo (criação, entrada/saída de participantes, etc).

**Response (200 OK):**
```typescript
ChatRoomHistory
```

### POST /chat/messages

Enviar uma mensagem. Se houver arquivo, deve usar FormData. Caso contrário, pode usar JSON.

**Request Body (JSON - sem arquivo):**
```typescript
{
  roomId: string;
  content: string;
}
```

**Request Body (FormData - com arquivo):**
```
roomId: string
content: string (opcional se houver arquivo)
files: File (pode ser múltiplos, mas geralmente apenas 1)
```

**Response (201 Created):**
```typescript
ChatMessage
```

### POST /chat/messages/edit

Editar uma mensagem. Apenas o autor pode editar sua própria mensagem.

**Request Body:**
```typescript
{
  messageId: string;
  content: string;
}
```

**Response (200 OK):**
```typescript
ChatMessage
```

### POST /chat/messages/delete

Deletar uma mensagem (soft delete). Apenas o autor pode deletar sua própria mensagem, e apenas dentro de 5 minutos após o envio.

**Request Body:**
```typescript
{
  messageId: string;
}
```

**Response (200 OK):**
```typescript
void
```

**Erros:**
- **422 Unprocessable Entity:** Mensagem tem mais de 5 minutos

### GET /chat/company/users

Listar todos os usuários da empresa com status online/offline para seleção no chat.

**Response (200 OK):**
```typescript
CompanyUser[]
```

---

## 📊 Estrutura de Dados

### ChatRoom

```typescript
interface ChatRoom {
  id: string;
  companyId: string;
  type: 'direct' | 'support' | 'group';
  name?: string;                    // Nome do grupo (não usado em direct/support)
  createdBy?: string;               // ID do criador do grupo
  imageUrl?: string;                // URL da imagem do grupo
  lastMessage?: string;             // Última mensagem da conversa
  lastMessageAt?: Date;             // Data da última mensagem
  participants: ChatParticipant[];  // Lista de participantes
  createdAt: Date;
  updatedAt: Date;
}
```

### ChatParticipant

```typescript
interface ChatParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isActive: boolean;
  isAdmin?: boolean;                // true se for administrador do grupo
  lastReadAt?: Date;                // Data da última leitura
  joinedAt: Date;                   // Data de entrada no grupo
}
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string;                // URL da imagem anexada (compatibilidade)
  fileUrl?: string;                 // URL do arquivo anexado (compatibilidade)
  fileName?: string;                // Nome do arquivo anexado
  fileType?: string;                // Tipo MIME do arquivo
  documentUrl?: string;             // URL do documento anexado
  documentName?: string;            // Nome original do documento
  documentMimeType?: string;        // Tipo MIME do documento
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tempId?: string;                  // ID temporário para mensagens otimistas
  isPending?: boolean;              // true se for mensagem pendente (offline)
  isSystemMessage?: boolean;        // true se for mensagem do sistema
  systemEventType?: 'participant_joined' | 'participant_left' | 'participant_removed';
}
```

### CreateRoomRequest

```typescript
// Conversa Direta
interface CreateDirectRoomRequest {
  type: 'direct';
  userId: string;                   // ID do outro usuário
}

// Grupo
interface CreateGroupRoomRequest {
  type: 'group';
  name: string;                     // Nome do grupo (obrigatório)
  userIds: string[];                // IDs dos participantes (obrigatório)
  adminIds?: string[];              // IDs dos administradores (opcional, criador é automaticamente admin)
  imageUrl?: string;                // URL da imagem do grupo (opcional)
}

// Suporte
interface CreateSupportRoomRequest {
  type: 'support';
}

type CreateRoomRequest = 
  | CreateDirectRoomRequest 
  | CreateGroupRoomRequest 
  | CreateSupportRoomRequest;
```

### SendMessageRequest

```typescript
interface SendMessageRequest {
  roomId: string;
  content: string;
  image?: File;                     // DEPRECATED: usar files
  file?: File;                      // DEPRECATED: usar files
  files?: File[];                   // Array de arquivos (máximo 1 arquivo por vez)
}
```

### CompanyUser

```typescript
interface CompanyUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: string;
  isOnline: boolean;                // Status online/offline
  lastActivity?: Date;
}
```

### ChatRoomHistory

```typescript
interface ChatRoomHistory {
  roomId: string;
  name: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: Date;
  participants: Array<{
    userId: string;
    userName: string;
    isAdmin: boolean;
    joinedAt: Date;
    leftAt?: Date;
    isActive: boolean;
  }>;
}
```

---

## 🔌 WebSocket Events

### Conexão

**URL:** `${API_BASE_URL}/chat?companyId={companyId}`

**Autenticação:** Token JWT no auth object e header `Authorization`

**Headers:**
```
Authorization: Bearer {token}
X-Company-ID: {companyId}
```

### Eventos Enviados (Client → Server)

#### join_room
Entrar em uma sala para receber mensagens em tempo real.

```typescript
socket.emit('join_room', {
  roomId: string;
  companyId: string;
});
```

#### leave_room
Sair de uma sala.

```typescript
socket.emit('leave_room', {
  roomId: string;
  companyId: string;
});
```

#### send_message
Enviar mensagem via WebSocket (apenas texto, sem arquivos).

```typescript
socket.emit('send_message', {
  roomId: string;
  content: string;
  companyId: string;
});
```

**Nota:** Mensagens com arquivos devem ser enviadas via API REST (FormData).

#### mark_as_read
Marcar mensagens como lidas.

```typescript
socket.emit('mark_as_read', {
  roomId: string;
  companyId: string;
});
```

#### set_company_id
Definir company ID após conexão (opcional).

```typescript
socket.emit('set_company_id', {
  companyId: string;
});
```

### Eventos Recebidos (Server → Client)

#### chat_connected
Confirmação de conexão ao chat.

```typescript
{
  // Dados podem variar conforme implementação do servidor
}
```

#### new_message
Nova mensagem recebida na sala.

```typescript
{
  message: ChatMessage;
  timestamp: string;
  isPending?: boolean;              // true se for mensagem pendente (offline)
}
```

#### message_sent
Confirmação de envio de mensagem.

```typescript
{
  messageId: string;
  timestamp: string;
}
```

#### messages_read
Confirmação de mensagens marcadas como lidas.

```typescript
{
  roomId: string;
  userId: string;
  timestamp: string;
}
```

#### message_status_update
Atualização de status de mensagem (sent → delivered → read).

```typescript
{
  messageId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}
```

#### message_edited
Mensagem foi editada.

```typescript
{
  roomId: string;
  originalMessageId: string;
  newMessage: ChatMessage;
  timestamp: string;
}
```

#### message_deleted
Mensagem foi deletada.

```typescript
{
  roomId: string;
  messageId: string;
  timestamp: string;
  deletedBy?: {
    userId: string;
    userName: string;
  };
}
```

#### room_joined
Confirmação de entrada na sala.

```typescript
{
  roomId: string;
  timestamp: string;
}
```

#### room_left
Confirmação de saída da sala.

```typescript
{
  roomId: string;
  timestamp: string;
}
```

#### participant_added
Participante foi adicionado ao grupo.

```typescript
{
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  addedBy?: string;
  addedByName?: string;
  timestamp: string;
}
```

#### participant_left
Participante saiu do grupo (voluntariamente ou removido).

```typescript
{
  roomId: string;
  userId: string;
  userName: string;
  leftAt: string;
  timestamp: string;
  removedBy?: string;
  removedByName?: string;
  isRemoved?: boolean;
}
```

#### participant_removed
Participante foi removido do grupo.

```typescript
{
  roomId: string;
  userId: string;
  userName: string;
  removedBy: string;
  removedByName: string;
  timestamp: string;
}
```

#### room_updated
Sala foi atualizada (nome, imagem, etc).

```typescript
{
  roomId: string;
  name?: string;
  imageUrl?: string;
  updatedBy?: string;
  updatedByName?: string;
  timestamp: string;
}
```

#### disconnect
Desconexão do WebSocket.

```typescript
{
  reason: string;                   // Razão da desconexão
}
```

#### error
Erro no chat.

```typescript
{
  message: string;
  error?: string;
}
```

---

## ✅ Validações Completas

### Validação de Mensagem

#### Campos Obrigatórios

1. **`roomId`** (string)
   - **Obrigatório:** ✅ Sim
   - **Validação:** 
     - Sala deve existir
     - Usuário deve ser participante da sala
     - Company ID deve estar presente no header `X-Company-ID`

2. **`content` OU `files`**
   - **Obrigatório:** ✅ Sim (pelo menos um)
   - **Validação:** 
     - Se não houver arquivo, conteúdo não pode estar vazio após trim
     - Se houver arquivo, conteúdo pode estar vazio (será substituído por emoji de arquivo)

#### Campos Opcionais

3. **`content`** (string)
   - **Obrigatório:** ❌ Não (se houver arquivo)
   - **Máximo:** 5000 caracteres
   - **Validação:** 
     - Se fornecido, deve ter no máximo 5000 caracteres
     - Espaços em branco no início/fim são removidos automaticamente (trim)
   - **Descrição:** Conteúdo textual da mensagem
   - **Mensagem de erro:** "Mensagem muito longa. Máximo de 5000 caracteres."

4. **`files`** (File[])
   - **Obrigatório:** ❌ Não (se houver conteúdo)
   - **Máximo:** 1 arquivo por mensagem
   - **Tipos Permitidos (MIME Types):**
     - Imagens: 
       - `image/jpeg`
       - `image/jpg`
       - `image/png`
     - Documentos: 
       - `application/pdf`
       - `application/msword` (DOC)
       - `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
       - `text/csv` (CSV)
       - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX)
       - `application/vnd.ms-excel` (XLS)
       - `application/xml` (XML)
       - `text/xml` (XML)
       - `text/plain` (TXT)
   - **Extensões Permitidas (validação alternativa):**
     - `.pdf`, `.png`, `.csv`, `.xlsx`, `.xls`, `.jpg`, `.jpeg`, `.xml`, `.doc`, `.docx`, `.txt`
   - **Validação de Tipo:**
     - Se tipo MIME estiver presente e não for genérico: valida por tipo MIME
     - Se tipo MIME estiver vazio, for `application/octet-stream` ou genérico: valida por extensão
     - Arquivo deve passar em pelo menos uma das validações (MIME ou extensão)
   - **Tamanho Máximo:** 10MB (10 * 1024 * 1024 bytes)
   - **Validação de Tamanho:** 
     - Arquivo deve ter no máximo 10MB
     - Mensagem de erro: "Arquivo muito grande. Tamanho máximo: 10MB."
   - **Mensagem de erro (tipo):** "Tipo de arquivo inválido. Apenas PDF, PNG, CSV, XLSX, XML, DOC, DOCX, TXT e JPG são permitidos."

#### Validações Adicionais

5. **Autenticação**
   - **Obrigatório:** ✅ Sim
   - **Validação:** 
     - Token JWT válido no header `Authorization`
     - Company ID no header `X-Company-ID`
     - Usuário autenticado no sistema
   - **Mensagem de erro:** "Usuário não autenticado" / "Empresa não selecionada"

6. **Conexão WebSocket (opcional)**
   - **Obrigatório:** ❌ Não
   - **Comportamento:** 
     - Se WebSocket não estiver conectado, mensagens com arquivos sempre usam API REST
     - Mensagens sem arquivo tentam WebSocket primeiro, com fallback para API REST
     - Se WebSocket não estiver conectado ao enviar, sistema tenta conectar automaticamente

7. **Timeout de Envio**
   - **Obrigatório:** ✅ Sim (validação interna)
   - **Validação:** 
     - Mensagem otimista que não recebe confirmação em 10 segundos é revertida
     - Preview local (blob URL) é limpo automaticamente
     - Estado é revertido para o estado anterior
   - **Mensagem de erro:** "Falha ao enviar mensagem. Tente novamente."

### Validação de Criação de Sala

#### Conversa Direta (CreateDirectRoomRequest)

1. **`type`** (string)
   - **Obrigatório:** ✅ Sim
   - **Valor:** `'direct'`

2. **`userId`** (string)
   - **Obrigatório:** ✅ Sim
   - **Validação:** 
     - Usuário deve existir na empresa
     - Usuário deve pertencer à mesma empresa do criador
     - Não pode ser o próprio usuário (não pode criar conversa direta consigo mesmo)
   - **Comportamento:** Se uma conversa direta já existir entre os dois usuários, retorna a sala existente em vez de criar nova

#### Grupo (CreateGroupRoomRequest)

1. **`type`** (string)
   - **Obrigatório:** ✅ Sim
   - **Valor:** `'group'`

2. **`name`** (string)
   - **Obrigatório:** ✅ Sim
   - **Mínimo:** 1 caractere (não vazio após trim)
   - **Máximo:** 255 caracteres
   - **Validação:** String não vazia após remover espaços

3. **`userIds`** (string[])
   - **Obrigatório:** ✅ Sim
   - **Mínimo:** 1 usuário (além do criador)
   - **Validação:** 
     - Array não vazio
     - Todos os usuários devem existir na empresa
     - Usuários devem pertencer à mesma empresa do criador
     - Criador não precisa estar incluído (é adicionado automaticamente)

4. **`adminIds`** (string[])
   - **Obrigatório:** ❌ Não
   - **Validação:** 
     - Todos os usuários devem estar presentes em `userIds`
     - Criador é automaticamente adicionado como admin (não precisa estar incluído)
   - **Padrão:** Criador é automaticamente admin

5. **`imageUrl`** (string)
   - **Obrigatório:** ❌ Não
   - **Validação:** 
     - Se fornecido, deve ser uma URL válida
     - Geralmente definido via endpoint separado `/upload-image`

#### Suporte (CreateSupportRoomRequest)

1. **`type`** (string)
   - **Obrigatório:** ✅ Sim
   - **Valor:** `'support'`

### Validação de Edição de Mensagem

1. **`messageId`** (string)
   - **Obrigatório:** ✅ Sim
   - **Validação:** Mensagem deve existir e pertencer ao usuário

2. **`content`** (string)
   - **Obrigatório:** ✅ Sim
   - **Mínimo:** 1 caractere
   - **Máximo:** 5000 caracteres

### Validação de Exclusão de Mensagem

1. **`messageId`** (string)
   - **Obrigatório:** ✅ Sim
   - **Validação:** 
     - Mensagem deve existir
     - Mensagem deve pertencer ao usuário (apenas o autor pode deletar)
     - Mensagem deve ter menos de 5 minutos de criação
       - Tempo é calculado: `(data atual - data de criação) < 5 minutos`
       - Validação é feita no frontend antes de chamar a API
   - **Mensagem de erro:** "Mensagens só podem ser deletadas dentro de 5 minutos após o envio"

**Nota:** Mesmo que a validação de tempo passe no frontend, o backend também valida. Se o backend rejeitar, retornará erro 422.

---

## 🔄 Fluxos Principais

### Fluxo: Criar Conversa Direta

```
1. Usuário seleciona outro usuário da lista
   ↓
2. POST /chat/rooms (CreateDirectRoomRequest)
   ↓
3. Sala é criada ou retornada (se já existir)
   ↓
4. Usuário é redirecionado para /chat/:roomId
   ↓
5. joinRoom() é chamado automaticamente
   ↓
6. WebSocket: join_room emitido
   ↓
7. Mensagens são carregadas via GET /chat/rooms/:roomId/messages
   ↓
8. Chat está pronto para uso
```

### Fluxo: Criar Grupo

```
1. Usuário clica em "Novo Grupo"
   ↓
2. Modal de criação é aberto
   ↓
3. Usuário preenche nome e seleciona participantes
   ↓
4. POST /chat/rooms (CreateGroupRoomRequest)
   ↓
5. Grupo é criado
   ↓
6. Usuário é redirecionado para /chat/:roomId
   ↓
7. joinRoom() é chamado automaticamente
   ↓
8. WebSocket: join_room emitido
   ↓
9. Mensagem do sistema: "Grupo criado"
   ↓
10. Chat está pronto para uso
```

### Fluxo: Enviar Mensagem (Texto)

```
1. Usuário digita mensagem e pressiona Enter ou clica em Enviar
   ↓
2. Validação: mensagem não vazia e ≤ 5000 caracteres
   ↓
3. Mensagem otimista é adicionada ao estado (status: 'sending')
   ↓
4. WebSocket conectado?
   ├─ Sim → socket.emit('send_message')
   └─ Não → POST /chat/messages (API REST)
   ↓
5. Aguardar confirmação:
   ├─ WebSocket: evento 'new_message' recebido
   └─ API REST: resposta 201 Created
   ↓
6. Mensagem otimista é substituída pela mensagem confirmada (status: 'sent')
   ↓
7. Status é atualizado via WebSocket ('delivered' → 'read')
```

### Fluxo: Enviar Mensagem (Com Arquivo)

```
1. Usuário seleciona arquivo (imagem ou documento)
   ↓
2. Validação:
   - Tipo de arquivo permitido
   - Tamanho ≤ 10MB
   ↓
3. Preview local é criado (se for imagem)
   ↓
4. Mensagem otimista é adicionada ao estado (status: 'sending')
   ↓
5. POST /chat/messages (FormData)
   - roomId: string
   - content: string (opcional)
   - files: File[]
   ↓
6. Mensagem é salva no servidor
   ↓
7. Mensagem otimista é substituída pela mensagem confirmada
   ↓
8. Preview local é removido
   ↓
9. Status é atualizado via WebSocket ('delivered' → 'read')
```

### Fluxo: Marcar Mensagens como Lidas

```
1. Usuário abre uma sala
   ↓
2. Mensagens são carregadas
   ↓
3. Sistema verifica se há mensagens não lidas do outro usuário
   ↓
4. Se houver:
   ├─ WebSocket: socket.emit('mark_as_read')
   └─ API REST: POST /chat/rooms/:roomId/read
   ↓
5. Servidor atualiza status de todas as mensagens não lidas para 'read'
   ↓
6. WebSocket: evento 'messages_read' é emitido para todos os participantes
   ↓
7. Interface é atualizada com status 'read'
```

### Fluxo: Editar Mensagem

```
1. Usuário clica em "Editar" em uma mensagem própria
   ↓
2. Modal de edição é aberto com conteúdo atual
   ↓
3. Usuário modifica o conteúdo
   ↓
4. Validação: novo conteúdo não vazio e ≤ 5000 caracteres
   ↓
5. POST /chat/messages/edit
   ↓
6. Mensagem é atualizada no servidor
   ↓
7. WebSocket: evento 'message_edited' é emitido para todos os participantes
   ↓
8. Interface é atualizada com mensagem editada
   ↓
9. Indicador "editado" é exibido
```

### Fluxo: Deletar Mensagem

```
1. Usuário clica em "Deletar" em uma mensagem própria
   ↓
2. Validação: mensagem tem menos de 5 minutos
   ↓
3. Modal de confirmação é exibido
   ↓
4. Usuário confirma exclusão
   ↓
5. POST /chat/messages/delete
   ↓
6. Mensagem é deletada no servidor (soft delete)
   ↓
7. WebSocket: evento 'message_deleted' é emitido para todos os participantes
   ↓
8. Mensagem é removida da interface
```

### Fluxo: Adicionar Participante ao Grupo

```
1. Administrador clica em "Adicionar Participante"
   ↓
2. Modal com lista de usuários é aberto
   ↓
3. Administrador seleciona usuários
   ↓
4. POST /chat/rooms/:roomId/participants
   ↓
5. Participantes são adicionados ao grupo
   ↓
6. WebSocket: evento 'participant_added' é emitido para todos os participantes
   ↓
7. Mensagem do sistema: "{userName} foi adicionado ao grupo por {adminName}"
   ↓
8. Lista de participantes é atualizada
```

### Fluxo: Remover Participante do Grupo

```
1. Administrador clica em "Remover" em um participante
   ↓
2. Modal de confirmação é exibido
   ↓
3. Administrador confirma remoção
   ↓
4. POST /chat/rooms/:roomId/participants/remove
   ↓
5. Participante é removido do grupo
   ↓
6. WebSocket: evento 'participant_removed' é emitido para todos os participantes
   ↓
7. Mensagem do sistema: "{userName} foi removido do grupo por {adminName}"
   ↓
8. Lista de participantes é atualizada
```

### Fluxo: Arquivar Conversa

```
1. Usuário clica em "Arquivar" em uma conversa
   ↓
2. POST /chat/rooms/:roomId/archive
   ↓
3. Conversa é movida para lista de arquivadas
   ↓
4. Conversa não aparece mais na lista principal
   ↓
5. Usuário pode acessar conversas arquivadas separadamente
```

### Fluxo: Conexão WebSocket e Reconexão

```
1. Usuário acessa página de chat ou componente de chat
   ↓
2. Sistema verifica se WebSocket já está conectado
   ├─ Conectado → Usa conexão existente
   └─ Não conectado → Continua para passo 3
   ↓
3. chatSocketService.connect(companyId) é chamado
   ↓
4. Socket.IO conecta ao servidor
   ↓
5. Evento 'connect' é recebido
   ↓
6. Evento 'chat_connected' é recebido (confirmação do servidor)
   ↓
7. Sistema registra automaticamente em todas as salas (join_room)
   ↓
8. Chat está pronto para receber mensagens em tempo real
   ↓
9. Se desconexão ocorrer:
   ├─ Sistema tenta reconectar automaticamente (máximo 3 tentativas)
   ├─ Delay exponencial entre tentativas (5s, 10s, 20s)
   └─ Após 3 tentativas, entra em cooldown (30s)
   ↓
10. Após cooldown, permite novas tentativas
```

---

## 🔐 Permissões e Módulos

### Módulo Requerido

- **`chat`**: Módulo obrigatório para acessar todas as funcionalidades de chat

### Permissões

**Nota:** O módulo de chat não requer permissões específicas. O acesso é controlado apenas pela disponibilidade do módulo `chat` para a empresa.

### Verificação de Acesso

```typescript
// Verificar se módulo está disponível
const hasChatModule = moduleAccess.isModuleAvailableForCompany('chat');

// Rota protegida por módulo
<ModuleRoute requiredModule="chat">
  <ChatPage />
</ModuleRoute>
```

---

## 🧩 Componentes Relacionados

### Páginas

- **`ChatPage`** - Página principal do chat com sidebar e área de mensagens
- **`EditGroupChatPage`** - Página para editar configurações de grupo

### Componentes

- **`ChatWindows`** - Componente de janelas flutuantes de chat (máximo 3 abertas)
- **`EmojiPicker`** - Seletor de emojis para mensagens
- **`CreateDirectChatModal`** - Modal para criar conversa direta
- **`CreateGroupChatModal`** - Modal para criar grupo
- **`ParticipantsListModal`** - Modal com lista de participantes do grupo
- **`GroupHistoryModal`** - Modal com histórico de atividades do grupo

### Hooks

- **`useChat`** - Hook principal para gerenciar estado e ações do chat
- **`useChatUnreadCount`** - Hook para contar mensagens não lidas
- **`useArchivedMessages`** - Hook para gerenciar mensagens arquivadas

### Serviços

- **`chatApi`** - Serviço para chamadas API REST do chat
- **`chatSocketService`** - Serviço para conexão WebSocket e eventos em tempo real

### Contextos

- **`ChatContext`** - Contexto para gerenciar estado global do chat (se aplicável)

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

#### 400 Bad Request
- Dados inválidos
- Validação falhou
- Mensagem vazia
- Tipo de arquivo não permitido
- Arquivo muito grande

#### 401 Unauthorized
- Token inválido ou expirado
- Não autenticado

#### 403 Forbidden
- Sem permissão
- Módulo não disponível
- Não é administrador (para ações de admin)

#### 404 Not Found
- Sala não encontrada
- Mensagem não encontrada
- Usuário não encontrado

#### 413 Payload Too Large
- Arquivo muito grande (>10MB)

#### 422 Unprocessable Entity
- Mensagem com mais de 5 minutos (para exclusão)
- Usuário não é participante da sala
- Validação de negócio falhou

### Tratamento de Erros WebSocket

#### connect_error
- Erro de conexão ao servidor
- Token inválido
- Company ID inválido
- **Ação:** Sistema tenta reconectar automaticamente (máximo 3 tentativas, depois cooldown de 30s)

#### disconnect
- Desconexão do servidor
- **Razões comuns:**
  - `io server disconnect` - Servidor desconectou (sem reconexão automática)
  - `io client disconnect` - Cliente desconectou intencionalmente (sem reconexão automática)
  - `transport close` - Conexão foi perdida (tenta reconectar)
  - `transport error` - Erro no transporte (tenta reconectar)

#### error
- Erro genérico do chat
- **Ação:** Exibir mensagem de erro ao usuário

### Mensagens de Erro Amigáveis

```typescript
// Exemplo de tratamento de erro
try {
  await sendMessage(roomId, content);
} catch (error: any) {
  if (error.response?.status === 413) {
    toast.error('Arquivo muito grande. Tamanho máximo: 10MB.');
  } else if (error.response?.status === 403) {
    toast.error('Você não tem permissão para realizar esta ação.');
  } else if (error.response?.status === 404) {
    toast.error('Conversa não encontrada.');
  } else {
    toast.error('Erro ao enviar mensagem. Tente novamente.');
  }
}
```

### Fallback para Mensagens Offline

Se o WebSocket não estiver conectado ao enviar uma mensagem:

1. Mensagem é enviada via API REST
2. Mensagem é salva no servidor como "pendente"
3. Quando o usuário voltar online, mensagem é entregue via WebSocket com flag `isPending: true`
4. Mensagem aparece no histórico na posição cronológica correta

---

## 🚀 Próximas Melhorias

### Funcionalidades Planejadas

- [ ] Busca de mensagens no histórico
- [ ] Mensagens fixadas (pinned messages)
- [ ] Reações em mensagens (emoji reactions)
- [ ] Respostas a mensagens específicas (reply to message)
- [ ] Menções de usuários (@username)
- [ ] Notificações push para mensagens não lidas
- [ ] Indicador de digitação (typing indicator)
- [ ] Chamadas de voz/vídeo
- [ ] Compartilhamento de localização
- [ ] Mensagens temporárias (auto-delete)
- [ ] Filtros avançados de conversas
- [ ] Exportação de histórico de conversas
- [ ] Bloqueio de usuários
- [ ] Silenciar notificações de grupos
- [ ] Customização de temas e cores

---

## 📚 Referências

- [WebSocket Events (Backend)](./CHAT_WEBSOCKET_EVENTS_BACKEND.md)
- [Permissions and Modules](./PERMISSIONS_AND_MODULES.md)

---

**Última atualização:** 2024-01-XX

