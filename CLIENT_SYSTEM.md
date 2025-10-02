# Sistema de Cadastro de Clientes - ImobX

## 📋 Visão Geral

Sistema completo de cadastro e gestão de clientes para corretores e administradores, integrado ao sistema ImobX com permissões adequadas e disponível em todos os planos.

## ✅ Funcionalidades Implementadas

### Backend (NestJS)

#### 1. Entidade Client (`imobx/src/entities/client.entity.ts`)
- Campos completos para cadastro de clientes
- Relacionamentos com Company e User
- Enums para ClientType e ClientStatus
- Campos para preferências imobiliárias

#### 2. Migration do Banco (`imobx/db-changes/003-create-clients-table.sql`)
- Tabela `clients` com todos os campos necessários
- Tabela de relacionamento `client_properties`
- Índices para performance
- Constraints de integridade

#### 3. Serviço ClientsService (`imobx/src/services/clients.service.ts`)
- CRUD completo (Create, Read, Update, Delete)
- Soft delete para clientes
- Vinculação com propriedades
- Filtros e buscas
- Estatísticas dos clientes

#### 4. Controller ClientsController (`imobx/src/controllers/clients.controller.ts`)
- Rotas REST protegidas por permissões
- Swagger documentation
- Validação de dados
- Relacionamentos com propriedades

#### 5. Permissões (`imobx/src/enums/permission.enum.ts`)
- `CLIENT_VIEW` - Visualizar clientes
- `CLIENT_CREATE` - Criar clientes  
- `CLIENT_UPDATE` - Editar clientes
- `CLIENT_DELETE` - Excluir clientes
- `CLIENT_ASSIGN_PROPERTY` - Vincular clientes a propriedades

#### 6. Módulo ClientsModule (`imobx/src/modules/clients.module.ts`)
- Configuração do módulo
- Integração com TypeORM
- Exportação do serviço

### Frontend (React)

#### 1. Hook useClients (`imobx-front/src/hooks/useClients.ts`)
- Integração com API
- Estados de loading e error
- Métodos para CRUD
- Vincular clientes a propriedades

#### 2. Tipos (`imobx-front/src/types/client.ts`)
- Enums ClientType e ClientStatus
- Labels e cores para badges
- Interface para dados

#### 3. Modal ClientModal (`imobx-front/src/components/modals/ClientModal.tsx`)
- Formulário completo de cadastro/edição
- Validação de campos obrigatórios
- Seções organizadas (Informações básicas, Contatos, Endereço, Preferências)
- Interface responsiva

#### 4. Página ClientsPage (`imobx-front/src/pages/ClientsPage.tsx`)
- Listagem em grid de cartões
- Filtros por nome, tipo e status
- Estatísticas dos clientes
- Busca em tempo real
- Ações de editar e excluir

#### 5. Roteamento
- Rota `/clients` adicionada ao App.tsx
- Protegida por permissão `client:view`
- Menu "Clientes" adicionado no drawer

## 🎯 Campos Disponíveis

### Informações Básicas
- Nome Completo *
- Email *
- CPF *
- Telefone *
- Tipo (Comprador, Vendedor, Locatário, Locador, Investidor, Geral) *
- Status (Ativo, Inativo, Contactado, Interessado, Fechado) *

### Contatos
- Telefone Principal *
- Telefone Secundário
- WhatsApp

### Endereço
- CEP *
- Estado *
- Cidade *
- Bairro *
- Endereço Completo *

### Preferências Imobiliárias
- Cidade Preferida
- Bairro Preferido
- Valor Mínimo (R$)
- Valor Máximo (R$)
- Tipo de Propriedade Preferido
- Método de Contato Preferido
- Faixa de Renda
- Faixa de Financiamento
- Perguntas por Comodo
- Observações

## 🔐 Sistema de Permissões

### Para Corretor/Admin:
- Pode criar, visualizar e editar clientes
- Pode vincular clientes a propriedades
- Pode excluir clientes (soft delete)
- Vê apenas clientes da sua empresa

### Para Master:
- Acesso total a todas as funcionalidades
- Bypass de todas as permissões

## 🔗 Relacionamentos

### Cliente ↔ Propriedade
- Tabela de relacionamento `client_properties`
- Tipo de interesse (interessado, visualizado, contactado)
- Notas sobre o interesse
- Data de contato

## 📊 Estatísticas Disponíveis
- Total de clientes
- Clientes ativos
- Contagem por tipo (Comprador, Vendedor, etc.)
- Distribuição por status

## 🎨 Interface

### Design Responsivo
- Cartões com hover effects
- Badges coloridos por tipo e status
- Modal com seções organizadas
- Grid adaptativo

### Estados Vazios
- Mensagem informativa quando não há clientes
- Sugestões para ajustar filtros

## 🚀 Como Usar

1. **Acessar**: Menu "Pessoas" > "Clientes"
2. **Criar**: Clique em "Novo Cliente"
3. **Filtrar**: Use os campos de busca e filtros
4. **Editar**: Clique no ícone de editar no cartão do cliente
5. **Visualizar Stats**: Estatísticas aparecem na parte superior

## ✅ Status: Implementado e Testado

Sistema completamente funcional e integrado ao ImobX com todas as funcionalidades solicitadas.

## 🔄 Próximos Passos Sugeridos

1. Relatórios de clientes avançados
2. Exportação para CSV/PDF
3. Sincronização com CRM externo
4. Histórico de interações com clientes
5. Notificações para novos leads
6. Dashboard específico de vendas

