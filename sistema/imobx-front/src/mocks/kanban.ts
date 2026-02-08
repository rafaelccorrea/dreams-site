import type {
  KanbanBoard,
  KanbanColumn,
  KanbanTask,
  KanbanPermissions,
  KanbanFilterOptions,
} from '../types/kanban';

export const mockKanbanPermissions: KanbanPermissions = {
  canCreateTasks: true,
  canEditTasks: true,
  canDeleteTasks: true,
  canMoveTasks: true,
  canCreateColumns: true,
  canEditColumns: true,
  canDeleteColumns: true,
};

export const mockKanbanBoard: KanbanBoard = {
  columns: [
    {
      id: '1',
      title: 'Para Fazer',
      color: '#3B82F6',
      position: 0,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Em Progresso',
      color: '#F59E0B',
      position: 1,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Concluído',
      color: '#10B981',
      position: 2,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Configurar sistema de notificações',
      description:
        'Implementar sistema de notificações em tempo real para alertas de prazo',
      columnId: '1',
      assignedToId: 'user-1',
      assignedToName: 'João Silva',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dias
      tags: ['urgente', 'sistema'],
      position: 0,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-2',
      title: 'Revisar documentação da API',
      description: 'Revisar e atualizar a documentação da API REST',
      columnId: '2',
      assignedToId: 'user-2',
      assignedToName: 'Maria Santos',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias
      tags: ['documentação'],
      position: 0,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-3',
      title: 'Implementar testes unitários',
      description: 'Criar testes unitários para os componentes principais',
      columnId: '3',
      assignedToId: 'user-3',
      assignedToName: 'Pedro Costa',
      priority: 'low',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás (vencido)
      tags: ['testes', 'qualidade'],
      position: 0,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-4',
      title: 'Otimizar performance do banco',
      description: 'Analisar e otimizar queries do banco de dados',
      columnId: '1',
      assignedToId: 'user-1',
      assignedToName: 'João Silva',
      priority: 'urgent',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia
      tags: ['performance', 'banco'],
      position: 1,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'task-5',
      title: 'Atualizar dependências',
      description:
        'Atualizar todas as dependências do projeto para versões mais recentes',
      columnId: '2',
      assignedToId: 'user-2',
      assignedToName: 'Maria Santos',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      tags: ['manutenção'],
      position: 1,
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  team: [
    {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@empresa.com',
      avatar: null,
      role: 'developer',
    },
    {
      id: 'user-2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      avatar: null,
      role: 'developer',
    },
    {
      id: 'user-3',
      name: 'Pedro Costa',
      email: 'pedro@empresa.com',
      avatar: null,
      role: 'tester',
    },
  ],
};

export const mockKanbanFilterOptions: KanbanFilterOptions = {
  users: [
    { id: 'user-1', name: 'João Silva', email: 'joao@empresa.com' },
    { id: 'user-2', name: 'Maria Santos', email: 'maria@empresa.com' },
    { id: 'user-3', name: 'Pedro Costa', email: 'pedro@empresa.com' },
  ],
  priorities: [
    { value: 'urgent', label: 'Urgente', color: '#DC2626' },
    { value: 'high', label: 'Alta', color: '#EA580C' },
    { value: 'medium', label: 'Média', color: '#D97706' },
    { value: 'low', label: 'Baixa', color: '#059669' },
  ],
  statuses: [
    { value: 'todo', label: 'Para Fazer', color: '#3B82F6' },
    { value: 'in-progress', label: 'Em Progresso', color: '#F59E0B' },
    { value: 'done', label: 'Concluído', color: '#10B981' },
  ],
  tags: [
    { id: 'urgente', name: 'urgente', color: '#DC2626' },
    { id: 'sistema', name: 'sistema', color: '#7C3AED' },
    { id: 'documentação', name: 'documentação', color: '#2563EB' },
    { id: 'testes', name: 'testes', color: '#059669' },
    { id: 'qualidade', name: 'qualidade', color: '#0891B2' },
    { id: 'performance', name: 'performance', color: '#CA8A04' },
    { id: 'banco', name: 'banco', color: '#DC2626' },
    { id: 'manutenção', name: 'manutenção', color: '#6B7280' },
  ],
};
