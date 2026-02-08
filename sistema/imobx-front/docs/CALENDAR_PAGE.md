# 📅 Documentação do Calendário de Agendamentos

## Índice

1. [Visão Geral](#-visão-geral)
2. [Estrutura de Dados](#-estrutura-de-dados)
3. [Tipos e Status](#-tipos-e-status)
4. [Endpoints da API](#-endpoints-da-api) (10 endpoints)
5. [Validações](#-validações)
6. [Hooks](#-hooks)
7. [Páginas](#-páginas)
8. [Componentes](#-componentes)
9. [Sistema de Convites](#-sistema-de-convites)
10. [Participantes](#-participantes)
11. [Integração com FullCalendar](#-integração-com-fullcalendar)
12. [Filtros e Busca](#-filtros-e-busca)
13. [Permissões](#-permissões)
14. [Cores Personalizadas](#-cores-personalizadas)
15. [Vinculação com Propriedades e Clientes](#-vinculação-com-propriedades-e-clientes)
16. [Próximas Melhorias](#-próximas-melhorias)

---

## 📋 Visão Geral

O sistema de Calendário de Agendamentos permite que corretores gerenciem seus compromissos, visitas, reuniões e outros eventos relacionados ao trabalho imobiliário. O sistema inclui:

- ✅ **CRUD Completo**: Criar, listar, visualizar, editar e excluir agendamentos
- ✅ **Calendário Visual**: Interface usando FullCalendar com múltiplas visualizações (mês, semana, dia)
- ✅ **Sistema de Convites**: Convidar outros usuários para participar de agendamentos
- ✅ **Participantes**: Gerenciar participantes dos agendamentos
- ✅ **Filtros e Busca**: Buscar agendamentos por diversos critérios
- ✅ **Vinculação**: Associar agendamentos a propriedades e clientes
- ✅ **Status e Tipos**: Diferentes tipos de agendamento (visita, reunião, vistoria, etc.)
- ✅ **Visibilidade**: Controle de visibilidade (público, privado, equipe)
- ✅ **Cores Personalizadas**: Diferentes cores para visualização no calendário
- ✅ **Validações**: Validação de datas, campos obrigatórios, etc.
- ✅ **Responsivo**: Funciona em desktop, tablet e mobile

---

## 📊 Estrutura de Dados

### Appointment (Agendamento)

```typescript
interface Appointment {
  id: string;
  title: string;
  description?: string;
  type: string;              // Tipo do agendamento (visit, meeting, etc.)
  status: string;            // Status (scheduled, confirmed, completed, etc.)
  visibility: string;        // Visibilidade (public, private, team)
  startDate: string;         // ISO string
  endDate: string;           // ISO string
  location?: string;
  notes?: string;
  color: string;             // Cor hex para exibição
  isRecurring?: boolean;
  userId: string;            // ID do criador
  companyId: string;
  propertyId?: string;       // ID da propriedade vinculada (opcional)
  clientId?: string;         // ID do cliente vinculado (opcional)
  participantIds?: string[]; // IDs dos participantes
  createdAt: string;
  updatedAt: string;
  property?: any;            // Objeto da propriedade (se vinculado)
  client?: any;              // Objeto do cliente (se vinculado)
  user?: any;                // Objeto do usuário criador
  invites?: AppointmentInvite[]; // Convites enviados
  participants?: {           // Lista de participantes com detalhes
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
    role: string;
  }[];
}
```

### CreateAppointmentData

```typescript
interface CreateAppointmentData {
  title: string;             // Obrigatório
  description?: string;      // Máx. 300 caracteres
  type: string;              // Obrigatório
  status?: string;           // Padrão: 'scheduled'
  visibility?: string;       // Padrão: 'private'
  startDate: string;         // Obrigatório (ISO string)
  endDate: string;           // Obrigatório (ISO string)
  location?: string;
  notes?: string;            // Máx. 300 caracteres
  color?: string;            // Padrão: '#3B82F6'
  isRecurring?: boolean;
  propertyId?: string;
  clientId?: string;
  participantIds?: string[];
  inviteUserIds?: string[];  // IDs de usuários para enviar convites
}
```

### UpdateAppointmentData

```typescript
type UpdateAppointmentData = Partial<CreateAppointmentData>;
```

### AppointmentInvite (Convite)

```typescript
interface AppointmentInvite {
  id: string;
  appointmentId: string;
  inviterUserId: string;
  invitedUserId: string;
  companyId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  message?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  appointment: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
    type: string;
    visibility: string;
    color: string;
  };
  inviter: {
    id: string;
    name: string;
    email: string;
  };
  invitedUser: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
  };
}
```

---

## 🏷️ Tipos e Status

### Tipos de Agendamento

| Tipo | Valor | Descrição |
|------|-------|-----------|
| Visita | `visit` | Visita a propriedade |
| Reunião | `meeting` | Reunião com cliente/equipe |
| Vistoria | `inspection` | Vistoria técnica |
| Documentação | `documentation` | Encontro para documentação |
| Manutenção | `maintenance` | Manutenção de propriedade |
| Marketing | `marketing` | Evento de marketing |
| Treinamento | `training` | Treinamento/workshop |
| Outro | `other` | Outro tipo |

### Status de Agendamento

| Status | Valor | Descrição |
|--------|-------|-----------|
| Agendado | `scheduled` | Agendado mas não confirmado |
| Confirmado | `confirmed` | Confirmado pelo cliente/participante |
| Em andamento | `in_progress` | Evento em execução |
| Concluído | `completed` | Evento finalizado |
| Cancelado | `cancelled` | Cancelado |
| Não compareceu | `no_show` | Cliente não compareceu |

### Níveis de Visibilidade

| Visibilidade | Valor | Descrição |
|--------------|-------|-----------|
| Público | `public` | Todos podem ver |
| Privado | `private` | Apenas criador e participantes |
| Equipe | `team` | Apenas membros da equipe |

### Status de Convite

| Status | Valor | Descrição |
|--------|-------|-----------|
| Pendente | `pending` | Aguardando resposta |
| Aceito | `accepted` | Convite aceito |
| Recusado | `declined` | Convite recusado |
| Cancelado | `cancelled` | Convite cancelado |

---

## 🔌 Endpoints da API

### Base URL
```
/appointments
```

### 1. Listar Agendamentos

**Endpoint:**
```
GET /appointments
```

**Query Parameters:**
```typescript
{
  status?: string;
  type?: string;
  startDate?: string;      // ISO string
  endDate?: string;        // ISO string
  propertyId?: string;
  clientId?: string;
  page?: number;
  limit?: number;
  onlyMyData?: boolean;    // true/false
}
```

**Resposta:**
```typescript
{
  appointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Exemplo:**
```typescript
// Listar todos os agendamentos
GET /appointments

// Listar agendamentos de hoje
GET /appointments?startDate=2024-01-01T00:00:00&endDate=2024-01-01T23:59:59

// Listar apenas meus agendamentos
GET /appointments?onlyMyData=true
```

### 2. Buscar Agendamento por ID

**Endpoint:**
```
GET /appointments/:id
```

**Resposta:**
```typescript
Appointment
```

**Exemplo:**
```typescript
GET /appointments/abc-123-def
```

### 3. Criar Agendamento

**Endpoint:**
```
POST /appointments
```

**Body:**
```typescript
CreateAppointmentData
```

**Resposta:**
```typescript
Appointment
```

**Exemplo:**
```typescript
POST /appointments
{
  "title": "Visita ao apartamento",
  "description": "Visita técnica com cliente",
  "type": "visit",
  "status": "scheduled",
  "visibility": "private",
  "startDate": "2024-01-15T14:00:00.000Z",
  "endDate": "2024-01-15T15:30:00.000Z",
  "location": "Rua Exemplo, 123",
  "color": "#3B82F6",
  "propertyId": "prop-123",
  "clientId": "client-456",
  "inviteUserIds": ["user-789"]
}
```

**Nota:** Se `inviteUserIds` for fornecido, o sistema criará automaticamente convites para os usuários especificados.

### 4. Atualizar Agendamento

**Endpoint:**
```
PATCH /appointments/:id
```

**Body:**
```typescript
UpdateAppointmentData
```

**Resposta:**
```typescript
Appointment
```

**Exemplo:**
```typescript
PATCH /appointments/abc-123-def
{
  "status": "confirmed",
  "location": "Novo endereço, 456"
}
```

### 5. Excluir Agendamento

**Endpoint:**
```
DELETE /appointments/:id
```

**Resposta:**
```
204 No Content
```

**Nota:** A exclusão de um agendamento cancela automaticamente todos os convites pendentes.

### 6. Adicionar Participante

**Endpoint:**
```
POST /appointments/:appointmentId/participants/:userId
```

**Resposta:**
```typescript
Appointment
```

**Exemplo:**
```typescript
POST /appointments/abc-123/participants/user-456
```

### 7. Remover Participante

**Endpoint:**
```
DELETE /appointments/:appointmentId/participants/:userId
```

**Resposta:**
```typescript
Appointment
```

**Exemplo:**
```typescript
DELETE /appointments/abc-123/participants/user-456
```

---

## 🔔 Sistema de Convites

O sistema de convites permite que usuários convidem outros usuários para participar de agendamentos.

### Endpoints de Convites

#### 1. Listar Meus Convites

**Endpoint:**
```
GET /appointment-invites/my-invites
```

**Resposta:**
```typescript
AppointmentInvite[]
```

#### 2. Listar Convites Pendentes

**Endpoint:**
```
GET /appointment-invites/pending
```

**Resposta:**
```typescript
AppointmentInvite[]
```

#### 3. Criar Convite

**Endpoint:**
```
POST /appointment-invites
```

**Body:**
```typescript
{
  appointmentId: string;
  invitedUserId: string;
  message?: string;  // Mensagem opcional
}
```

**Resposta:**
```typescript
AppointmentInvite
```

#### 4. Responder Convite

**Endpoint:**
```
PATCH /appointment-invites/:id/respond
```

**Body:**
```typescript
{
  status: 'accepted' | 'declined';
  responseMessage?: string;  // Mensagem opcional
}
```

**Resposta:**
```typescript
AppointmentInvite
```

**Exemplo:**
```typescript
PATCH /appointment-invites/invite-123/respond
{
  "status": "accepted",
  "responseMessage": "Confirmado, estarei presente!"
}
```

#### 5. Cancelar Convite

**Endpoint:**
```
DELETE /appointment-invites/:id
```

**Resposta:**
```
204 No Content
```

### Fluxo de Convites

1. **Criação com Convites:**
   - Ao criar um agendamento, é possível fornecer `inviteUserIds`
   - O sistema cria automaticamente convites para cada usuário
   - Os usuários recebem notificações

2. **Convite Manual:**
   - Na página de detalhes ou na criação, é possível convidar usuários adicionalmente
   - Usa o modal `InviteModal` para selecionar usuários

3. **Resposta ao Convite:**
   - Usuários podem aceitar ou recusar convites
   - A resposta atualiza o status do convite
   - O criador do agendamento é notificado

4. **Cancelamento:**
   - O criador pode cancelar convites
   - Excluir um agendamento cancela todos os convites

---

## ✅ Validações

### Validações Frontend

#### Campos Obrigatórios
- ✅ `title`: Obrigatório (string não vazia)
- ✅ `startDate`: Obrigatório (datetime válido)
- ✅ `endDate`: Obrigatório (datetime válido)
- ✅ `type`: Obrigatório (deve ser um tipo válido)

#### Regras de Negócio

1. **Datas:**
   - `startDate` não pode estar no passado (na criação)
   - `endDate` deve ser posterior a `startDate`
   - Datas devem ser válidas (ISO string)

2. **Campos de Texto:**
   - `description`: Máximo 300 caracteres
   - `notes`: Máximo 300 caracteres
   - `title`: Sem limite específico (mas recomendado máximo 100 caracteres)

3. **Cor:**
   - Deve ser uma cor válida (hex color)
   - Padrão: `#3B82F6` (azul)

4. **Permissões:**
   - Apenas o criador pode editar/excluir um agendamento
   - Visibilidade controla quem pode ver o agendamento

### Validações de Datas (Frontend)

```typescript
const validateDates = (start: string, end: string): { startDate: string; endDate: string } => {
  const errors = { startDate: '', endDate: '' };
  const now = new Date();
  const brasiliaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
  brasiliaNow.setSeconds(0, 0);

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Data de início não pode estar no passado (na criação)
    if (startDate < brasiliaNow) {
      errors.startDate = 'A data/hora de início não pode estar no passado';
    }

    // Data de término não pode estar no passado
    if (!errors.startDate && endDate < brasiliaNow) {
      errors.endDate = 'A data/hora de término não pode estar no passado';
    }

    // Data de término deve ser posterior à de início
    if (!errors.startDate && !errors.endDate && endDate <= startDate) {
      errors.endDate = 'A data/hora de término deve ser posterior à data/hora de início';
    }
  }

  return errors;
};
```

---

## 🎣 Hooks

### useAppointments

**Localização:** `src/hooks/useAppointments.ts`

**Funcionalidades:**
- Carregar lista de agendamentos
- Buscar agendamento por ID
- Criar agendamento
- Atualizar agendamento
- Excluir agendamento
- Adicionar participante
- Remover participante

**Interface:**
```typescript
const {
  appointments,        // Appointment[]
  isLoading,          // boolean
  error,              // string | null
  loadAppointments,   // () => Promise<void>
  getAppointmentById, // (id: string) => Promise<Appointment>
  createAppointment,  // (data: CreateAppointmentData) => Promise<Appointment>
  updateAppointment,  // (id: string, data: UpdateAppointmentData) => Promise<Appointment>
  deleteAppointment,  // (id: string) => Promise<void>
  addParticipant,     // (appointmentId: string, userId: string) => Promise<Appointment>
  removeParticipant,  // (appointmentId: string, userId: string) => Promise<Appointment>
} = useAppointments();
```

**Uso:**
```typescript
import { useAppointments } from '../hooks/useAppointments';

const { appointments, loadAppointments, createAppointment } = useAppointments();

// Carregar agendamentos
useEffect(() => {
  loadAppointments();
}, []);

// Criar agendamento
const handleCreate = async () => {
  try {
    await createAppointment({
      title: 'Nova visita',
      type: 'visit',
      startDate: '2024-01-15T14:00:00.000Z',
      endDate: '2024-01-15T15:00:00.000Z',
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
  }
};
```

**Nota:** O hook `createAppointment` automaticamente cria convites se `inviteUserIds` for fornecido no `CreateAppointmentData`.

### useAppointmentInvites

**Localização:** `src/hooks/useAppointmentInvites.ts`

**Funcionalidades:**
- Carregar lista de convites
- Carregar convites pendentes
- Criar convite
- Responder convite (aceitar/recusar)
- Cancelar convite

**Interface:**
```typescript
const {
  invites,            // AppointmentInvite[]
  pendingInvites,     // AppointmentInvite[]
  isLoading,          // boolean
  error,              // string | null
  loadInvites,        // () => Promise<void>
  loadPendingInvites, // () => Promise<void>
  createInvite,       // (data: CreateAppointmentInviteData) => Promise<AppointmentInvite>
  respondToInvite,    // (inviteId: string, data: RespondInviteData) => Promise<AppointmentInvite>
  cancelInvite,       // (inviteId: string) => Promise<void>
} = useAppointmentInvites();
```

**Uso:**
```typescript
import { useAppointmentInvites } from '../hooks/useAppointmentInvites';

const { pendingInvites, respondToInvite } = useAppointmentInvites();

// Aceitar convite
const handleAccept = async (inviteId: string) => {
  try {
    await respondToInvite(inviteId, { status: 'accepted' });
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
  }
};
```

---

## 📄 Páginas

### CalendarPage

**Localização:** `src/pages/CalendarPage.tsx`

**Rota:** `/calendar`

**Funcionalidades:**
- Exibir calendário visual (FullCalendar)
- Visualizações: mês, semana, dia (responsive)
- Buscar agendamentos
- Criar agendamento (clicando em data/hora)
- Visualizar detalhes (clicando em evento)
- Estatísticas (total, hoje, esta semana, concluídos)
- Gerenciar convites pendentes
- Responsivo (mobile, tablet, desktop)

**Componentes Utilizados:**
- `FullCalendar` (biblioteca externa)
- `InviteModal`
- `InvitesList`
- `CalendarShimmer` (loading)

### CreateAppointmentPage

**Localização:** `src/pages/CreateAppointmentPage.tsx`

**Rota:** `/calendar/create`

**Query Params:**
- `startDate`: Data/hora inicial (opcional)
- `endDate`: Data/hora final (opcional)

**Funcionalidades:**
- Formulário completo de criação
- Seleção de tipo, visibilidade, cor
- Validação de datas em tempo real
- Seleção de usuários para convites
- Vinculação com propriedade/cliente (via props futuros)
- Validação de campos obrigatórios

**Campos do Formulário:**
- Título* (obrigatório)
- Descrição (máx. 300 caracteres)
- Tipo* (obrigatório)
- Visibilidade (requer permissão `calendar:manage_visibility`)
- Data/Hora Início* (obrigatório)
- Data/Hora Fim* (obrigatório)
- Local
- Observações (máx. 300 caracteres)
- Convidar Colaboradores (UserSelector)
- Cor do Agendamento

### EditAppointmentPage

**Localização:** `src/pages/EditAppointmentPage.tsx`

**Rota:** `/calendar/edit/:id`

**Funcionalidades:**
- Formulário de edição (similar à criação)
- Carregar dados do agendamento
- Gerenciar participantes (adicionar/remover)
- Atualizar status
- Validação de permissão (apenas criador pode editar)
- Validação de datas

**Campos Editáveis:**
- Todos os campos do formulário de criação
- Status (adicionado na edição)
- Participantes (lista + adicionar/remover)

### AppointmentDetailsPage

**Localização:** `src/pages/AppointmentDetailsPage.tsx`

**Rota:** `/calendar/details/:id`

**Funcionalidades:**
- Visualizar detalhes completos do agendamento
- Informações gerais (status, tipo, visibilidade)
- Data e horário
- Localização e descrição
- Observações
- Vinculação com propriedade/cliente
- Lista de convites (agrupados por status)
- Estatísticas de convites
- Ações: Editar, Excluir (apenas para criador)
- Modal de confirmação de exclusão

**Seções:**
1. **Informações Gerais**: Status, Tipo, Visibilidade
2. **Data e Horário**: Início, Fim, Duração
3. **Relacionados**: Propriedade, Cliente (se vinculados)
4. **Localização**: Endereço/local
5. **Descrição**: Descrição detalhada
6. **Observações**: Notas adicionais
7. **Criado por**: Informações do criador
8. **Convites**: Lista completa com estatísticas

---

## 🧩 Componentes

### InviteModal

**Localização:** `src/components/modals/InviteModal.tsx`

**Props:**
```typescript
interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  appointmentTitle: string;
}
```

**Funcionalidades:**
- Buscar usuários
- Selecionar usuário para convidar
- Adicionar mensagem personalizada (opcional)
- Enviar convite

**Uso:**
```typescript
<InviteModal
  isOpen={showInviteModal}
  onClose={() => setShowInviteModal(false)}
  appointmentId={appointment.id}
  appointmentTitle={appointment.title}
/>
```

### InvitesList

**Localização:** `src/components/lists/InvitesList.tsx`

**Props:**
```typescript
interface InvitesListProps {
  invites: AppointmentInvite[];
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
  isLoading?: boolean;
}
```

**Funcionalidades:**
- Exibir lista de convites
- Mostrar status de cada convite
- Botões para aceitar/recusar (se pendente)
- Informações do agendamento
- Informações do convidante
- Mensagem do convite (se houver)
- Detectar convites expirados (agendamento já finalizado)

---

## 🎨 Integração com FullCalendar

O sistema utiliza a biblioteca **FullCalendar** para exibir o calendário visual.

### Plugins Utilizados

```typescript
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptLocale from '@fullcalendar/core/locales/pt-br';
```

### Visualizações

- **Mês** (`dayGridMonth`): Visualização mensal (padrão)
- **Semana** (`timeGridWeek`): Visualização semanal
- **Dia** (`timeGridDay`): Visualização diária (apenas desktop)

### Funcionalidades

1. **Eventos:**
   - Conversão de `Appointment[]` para eventos do FullCalendar
   - Cores personalizadas por agendamento
   - Eventos multi-dia são divididos em múltiplos eventos (um por dia)

2. **Interação:**
   - Clique em evento: Navega para página de detalhes
   - Seleção de data/hora: Navega para criação com datas pré-preenchidas

3. **Responsividade:**
   - Mobile: Apenas visualização mensal
   - Tablet: Mês e semana
   - Desktop: Mês, semana e dia

4. **Formatação de Datas:**
   - O sistema mantém o timezone local do navegador
   - Datas são formatadas para evitar problemas de timezone
   - Horários são exibidos corretamente

### Exemplo de Conversão de Eventos

```typescript
const calendarEvents = appointments.map(appointment => {
  // Eventos que duram múltiplos dias são divididos
  const startDate = new Date(appointment.startDate);
  const endDate = new Date(appointment.endDate);
  const daysDifference = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 0) {
    // Criar eventos para cada dia
    // ...
  } else {
    // Evento de um dia apenas
    return {
      id: appointment.id,
      title: appointment.title,
      start: formatDateForCalendar(appointment.startDate),
      end: formatDateForCalendar(appointment.endDate),
      allDay: false,
      color: appointment.color,
      extendedProps: {
        type: appointment.type,
        status: appointment.status,
        // ... outras propriedades
      },
    };
  }
});
```

---

## 🔍 Filtros e Busca

### AppointmentFilters

**Localização:** `src/types/filters.ts`

```typescript
interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  visibility?: string;
  userId?: string;
  propertyId?: string;
  clientId?: string;
  search?: string;
  isRecurring?: boolean;
  isActive?: boolean;
  onlyMyData?: boolean;
  page?: number;
  limit?: number;
}
```

### Busca na Página

A página `CalendarPage` inclui um campo de busca que filtra agendamentos por:
- Título
- Descrição
- Local

**Implementação:**
```typescript
const filteredAppointments = useMemo(() => {
  if (!searchTerm) return appointments;

  return appointments.filter(appointment =>
    appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [appointments, searchTerm]);
```

---

## 🔐 Permissões

### Permissões Relacionadas

| Permissão | Descrição |
|-----------|-----------|
| `calendar:create` | Criar agendamentos |
| `calendar:update` | Editar agendamentos |
| `calendar:delete` | Excluir agendamentos |
| `calendar:view` | Visualizar agendamentos |
| `calendar:manage_visibility` | Gerenciar visibilidade de agendamentos |

### Verificações de Permissão

1. **Criação:** Requer `calendar:create`
2. **Edição:** Requer `calendar:update` + ser o criador do agendamento
3. **Exclusão:** Requer `calendar:delete` + ser o criador do agendamento
4. **Visibilidade:** Requer `calendar:manage_visibility` para alterar

### Exemplo de Uso

```typescript
import { PermissionButton } from '../components/common/PermissionButton';

<PermissionButton
  permission="calendar:create"
  onClick={handleCreate}
  variant="primary"
>
  Novo Agendamento
</PermissionButton>
```

---

## 🎨 Cores Personalizadas

O sistema permite escolher cores personalizadas para agendamentos, facilitando a identificação visual no calendário.

### Cores Disponíveis

```typescript
const colors = [
  '#3B82F6', // Azul (padrão)
  '#10B981', // Verde
  '#F59E0B', // Amarelo
  '#EF4444', // Vermelho
  '#8B5CF6', // Roxo
  '#06B6D4', // Ciano
  '#84CC16', // Lima
  '#F97316', // Laranja
  '#EC4899', // Rosa
  '#6366F1', // Índigo
];
```

### Uso

As cores são exibidas:
- No calendário visual (FullCalendar)
- Na seleção de cor (ColorPicker)
- Como identidade visual do agendamento

---

## 🔗 Vinculação com Propriedades e Clientes

Os agendamentos podem ser vinculados a propriedades e clientes para melhor organização e contexto.

### Vinculação

```typescript
interface CreateAppointmentData {
  // ...
  propertyId?: string;  // ID da propriedade
  clientId?: string;    // ID do cliente
}
```

### Exibição

Quando um agendamento está vinculado:
- Na página de detalhes, exibe informações da propriedade/cliente
- Permite navegação para propriedade/cliente relacionado
- Facilita filtros e buscas

**Exemplo na Página de Detalhes:**
```typescript
{appointment.property && (
  <InfoItem>
    <InfoLabel>
      <MdHome size={16} />
      Propriedade
    </InfoLabel>
    <InfoValue>{appointment.property.title}</InfoValue>
  </InfoItem>
)}

{appointment.client && (
  <InfoItem>
    <InfoLabel>
      <MdPerson size={16} />
      Cliente
    </InfoLabel>
    <InfoValue>{appointment.client.name}</InfoValue>
  </InfoItem>
)}
```

---

## 🚀 Próximas Melhorias

- [ ] Agendamentos recorrentes (isRecurring)
- [ ] Notificações por email
- [ ] Lembretes antes do agendamento
- [ ] Sincronização com Google Calendar / Outlook
- [ ] Exportar calendário (ICS)
- [ ] Agendamentos em lote
- [ ] Templates de agendamento
- [ ] Relatórios de agendamentos
- [ ] Métricas de comparecimento
- [ ] Integração com sistema de chamadas
- [ ] Agendamentos por propriedade/cliente (página dedicada)
- [ ] Filtros avançados na interface
- [ ] Drag & drop no calendário (reagendar)
- [ ] Timezone personalizado por usuário

---

## 📝 Notas Técnicas

### Timezone

- O sistema usa o timezone de **Brasília (America/Sao_Paulo)** como referência
- Datas são armazenadas em UTC no backend
- Frontend converte para timezone local do navegador para exibição
- Validações consideram o horário de Brasília

### Performance

- Lista de agendamentos carregada uma vez (sem paginação por padrão)
- Busca feita no frontend (pode ser otimizada para backend)
- FullCalendar renderiza eventos de forma eficiente
- Componentes usam `useMemo` e `useCallback` para otimização

### Acessibilidade

- Tooltips informativos em campos
- Labels descritivos
- Botões com ícones e texto
- Cores com contraste adequado
- Navegação por teclado

---

**Última atualização:** Janeiro 2025


