# 📊 API Documentation - User Dashboard

## Visão Geral

Esta documentação descreve a API necessária para o dashboard do usuário (colaborador) no sistema IMOBX. O dashboard exibe estatísticas pessoais, performance, conquistas e atividades recentes específicas do usuário logado.

## Endpoint Base

```
GET /api/dashboard/user
```

## Autenticação

- **Requerida**: Sim
- **Tipo**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`

## Resposta da API

### Estrutura Principal

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "avatar": "string|null"
    },
    "stats": {
      "myProperties": "number",
      "myClients": "number", 
      "myInspections": "number",
      "myAppointments": "number",
      "myCommissions": "number",
      "myTasks": "number",
      "myKeys": "number",
      "myNotes": "number"
    },
    "performance": {
      "thisMonth": "number",
      "lastMonth": "number", 
      "growthPercentage": "number",
      "ranking": "number",
      "totalUsers": "number"
    },
    "achievements": [
      {
        "id": "string",
        "icon": "string",
        "title": "string",
        "description": "string",
        "color": "string",
        "earnedAt": "string|null"
      }
    ],
    "timeStats": {
      "avgResponseTime": "string",
      "totalVisits": "number",
      "successRate": "number"
    },
    "categoryPerformance": [
      {
        "category": "string",
        "value": "number",
        "color": "string"
      }
    ],
    "recentActivities": [
      {
        "id": "string",
        "type": "string",
        "title": "string", 
        "description": "string",
        "time": "string",
        "status": "string",
        "createdAt": "string"
      }
    ],
    "upcomingAppointments": [
      {
        "id": "string",
        "title": "string",
        "date": "string",
        "time": "string", 
        "client": "string",
        "type": "string"
      }
    ],
    "monthlyGoals": {
      "sales": {
        "current": "number",
        "target": "number",
        "percentage": "number"
      },
      "properties": {
        "current": "number", 
        "target": "number",
        "percentage": "number"
      },
      "clients": {
        "current": "number",
        "target": "number", 
        "percentage": "number"
      },
      "inspections": {
        "current": "number",
        "target": "number",
        "percentage": "number"
      },
      "commissions": {
        "current": "number",
        "target": "number",
        "percentage": "number"
      }
    },
    "conversionMetrics": {
      "leadsToClients": "number",
      "visitsToSales": "number", 
      "callsToMeetings": "number"
    }
  },
  "lastUpdated": "string"
}
```

## Detalhamento dos Campos

### 1. User Info
```json
{
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "email@exemplo.com", 
    "role": "user|manager|admin|master",
    "avatar": "url_da_foto.jpg|null"
  }
}
```

### 2. Estatísticas Básicas (Stats)
```json
{
  "stats": {
    "myProperties": 12,           // Propriedades atribuídas ao usuário
    "myClients": 28,              // Clientes atribuídos ao usuário
    "myInspections": 5,           // Vistorias realizadas pelo usuário
    "myAppointments": 8,          // Agendamentos do usuário
    "myCommissions": 15420.50,    // Comissões recebidas (R$)
    "myTasks": 6,                 // Tarefas pendentes
    "myKeys": 3,                  // Chaves em posse do usuário
    "myNotes": 14                 // Anotações criadas pelo usuário
  }
}
```

### 3. Performance e Ranking
```json
{
  "performance": {
    "thisMonth": 15420.50,        // Performance atual (R$)
    "lastMonth": 13750.00,         // Performance mês anterior (R$)
    "growthPercentage": 12.15,     // Crescimento percentual
    "ranking": 3,                  // Posição no ranking
    "totalUsers": 12               // Total de usuários no ranking
  }
}
```

### 4. Conquistas (Achievements)
```json
{
  "achievements": [
    {
      "id": "uuid",
      "icon": "🏆",                // Emoji do ícone
      "title": "Top 3 Vendedor",   // Título da conquista
      "description": "3º lugar no ranking", // Descrição
      "color": "#f59e0b",          // Cor hexadecimal
      "earnedAt": "2024-01-15T10:30:00Z" // Data de conquista
    }
  ]
}
```

### 5. Estatísticas de Tempo
```json
{
  "timeStats": {
    "avgResponseTime": "2h 15min", // Tempo médio de resposta
    "totalVisits": 34,             // Total de visitas realizadas
    "successRate": 85              // Taxa de sucesso (%)
  }
}
```

### 6. Performance por Categoria
```json
{
  "categoryPerformance": [
    {
      "category": "Captação",      // Nome da categoria
      "value": 85,                 // Valor percentual
      "color": "#3b82f6"           // Cor para exibição
    }
  ]
}
```

### 7. Atividades Recentes
```json
{
  "recentActivities": [
    {
      "id": "uuid",
      "type": "property|client|inspection|appointment|commission",
      "title": "Propriedade cadastrada",
      "description": "Casa 3 quartos - Centro",
      "time": "2 horas atrás",     // Tempo relativo
      "status": "success|pending|error",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 8. Próximos Agendamentos
```json
{
  "upcomingAppointments": [
    {
      "id": "uuid",
      "title": "Visita - Casa Centro",
      "date": "2024-01-16",       // Data no formato YYYY-MM-DD
      "time": "14:00",            // Hora no formato HH:MM
      "client": "Maria Santos",    // Nome do cliente
      "type": "visit|inspection|meeting"
    }
  ]
}
```

### 9. Metas Mensais
```json
{
  "monthlyGoals": {
    "sales": {
      "current": 850000,           // Valor atual (R$)
      "target": 1200000,           // Meta (R$)
      "percentage": 71             // Percentual atingido
    },
    "properties": {
      "current": 12,               // Quantidade atual
      "target": 15,                // Meta
      "percentage": 80             // Percentual atingido
    },
    "clients": {
      "current": 28,
      "target": 30,
      "percentage": 93
    },
    "inspections": {
      "current": 5,
      "target": 10,
      "percentage": 50
    },
    "commissions": {
      "current": 15420.50,
      "target": 20000,
      "percentage": 77
    }
  }
}
```

### 10. Métricas de Conversão
```json
{
  "conversionMetrics": {
    "leadsToClients": 65,          // Taxa de conversão leads → clientes (%)
    "visitsToSales": 28,           // Taxa de conversão visitas → vendas (%)
    "callsToMeetings": 72          // Taxa de conversão ligações → reuniões (%)
  }
}
```

## Regras de Negócio

### 1. Permissões
- O usuário só vê dados relacionados às suas permissões
- Se não tem permissão `property:view`, não vê estatísticas de propriedades
- Se não tem permissão `client:view`, não vê estatísticas de clientes
- E assim por diante para cada módulo

### 2. Filtros de Dados
- **Propriedades**: Apenas propriedades atribuídas ao usuário
- **Clientes**: Apenas clientes atribuídos ao usuário  
- **Vistorias**: Apenas vistorias realizadas pelo usuário
- **Agendamentos**: Apenas agendamentos do usuário
- **Comissões**: Apenas comissões do usuário

### 3. Períodos de Cálculo
- **Este mês**: Do dia 1 até hoje do mês atual
- **Mês anterior**: Mês completo anterior
- **Ranking**: Baseado no mês atual
- **Metas**: Baseadas no mês atual

### 4. Conquistas
- Conquistas são baseadas em critérios específicos:
  - **Top 3 Vendedor**: Ranking entre os 3 primeiros
  - **Sequência de 7 dias**: Meta diária atingida por 7 dias consecutivos
  - **Cliente Satisfeito**: 5+ avaliações positivas

## Códigos de Status HTTP

- **200**: Sucesso
- **401**: Não autenticado
- **403**: Sem permissão
- **500**: Erro interno do servidor

## Exemplo de Resposta Completa

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "email": "joao@imobx.com",
      "role": "user",
      "avatar": "https://api.imobx.com/avatars/joao.jpg"
    },
    "stats": {
      "myProperties": 12,
      "myClients": 28,
      "myInspections": 5,
      "myAppointments": 8,
      "myCommissions": 15420.50,
      "myTasks": 6,
      "myKeys": 3,
      "myNotes": 14
    },
    "performance": {
      "thisMonth": 15420.50,
      "lastMonth": 13750.00,
      "growthPercentage": 12.15,
      "ranking": 3,
      "totalUsers": 12
    },
    "achievements": [
      {
        "id": "ach-001",
        "icon": "🏆",
        "title": "Top 3 Vendedor",
        "description": "3º lugar no ranking",
        "color": "#f59e0b",
        "earnedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "timeStats": {
      "avgResponseTime": "2h 15min",
      "totalVisits": 34,
      "successRate": 85
    },
    "categoryPerformance": [
      {
        "category": "Captação",
        "value": 85,
        "color": "#3b82f6"
      }
    ],
    "recentActivities": [
      {
        "id": "act-001",
        "type": "property",
        "title": "Propriedade cadastrada",
        "description": "Casa 3 quartos - Centro",
        "time": "2 horas atrás",
        "status": "success",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "upcomingAppointments": [
      {
        "id": "apt-001",
        "title": "Visita - Casa Centro",
        "date": "2024-01-16",
        "time": "14:00",
        "client": "Maria Santos",
        "type": "visit"
      }
    ],
    "monthlyGoals": {
      "sales": {
        "current": 850000,
        "target": 1200000,
        "percentage": 71
      },
      "properties": {
        "current": 12,
        "target": 15,
        "percentage": 80
      },
      "clients": {
        "current": 28,
        "target": 30,
        "percentage": 93
      },
      "inspections": {
        "current": 5,
        "target": 10,
        "percentage": 50
      },
      "commissions": {
        "current": 15420.50,
        "target": 20000,
        "percentage": 77
      }
    },
    "conversionMetrics": {
      "leadsToClients": 65,
      "visitsToSales": 28,
      "callsToMeetings": 72
    }
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Considerações de Performance

1. **Cache**: Implementar cache de 5 minutos para dados não críticos
2. **Paginação**: Limitar atividades recentes a 10 itens
3. **Agendamentos**: Limitar a próximos 7 dias
4. **Conquistas**: Limitar a 5 conquistas mais recentes

## Notas de Implementação

- Todos os valores monetários devem ser retornados como números (não strings)
- Datas devem estar no formato ISO 8601
- Tempos relativos devem ser calculados no backend
- Percentuais devem ser calculados no backend
- Cores devem seguir o padrão hexadecimal (#RRGGBB)
