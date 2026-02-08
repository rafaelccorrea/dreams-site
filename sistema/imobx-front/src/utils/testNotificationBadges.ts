/**
 * Utilitário para testar badges de notificações no Drawer
 *
 * Uso no console do navegador:
 *
 * // Adicionar notificações de teste
 * window.testNotifications.addTestNotifications({
 *   '/inspections': 3,
 *   '/keys': 5,
 *   '/rentals': 2,
 *   '/properties': 10,
 *   '/clients': 1,
 *   '/matches': 7,
 *   '/financial': 4
 * });
 *
 * // Limpar todas as notificações de teste
 * window.testNotifications.clearTestNotifications();
 *
 * // Ver contadores atuais
 * window.testNotifications.getCounts();
 */

import type { Notification } from '../services/notificationApi';

let testNotifications: Notification[] = [];

// Listener para atualizar componentes quando notificações mudarem
let updateListeners: Set<() => void> = new Set();

/**
 * Registra um listener para atualizações
 */
export function addUpdateListener(listener: () => void): () => void {
  updateListeners.add(listener);
  return () => {
    updateListeners.delete(listener);
  };
}

/**
 * Notifica todos os listeners
 */
function notifyListeners(): void {
  updateListeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error(
        'Erro ao notificar listener de notificações de teste:',
        error
      );
    }
  });
}

/**
 * Cria uma notificação de teste
 */
function createTestNotification(
  type: string,
  entityType: string,
  route: string
): Notification {
  const id = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    type,
    priority: 'medium' as const,
    title: `Notificação de Teste - ${type}`,
    message: `Esta é uma notificação de teste para ${route}`,
    read: false,
    readAt: null,
    actionUrl: route,
    entityType,
    entityId: `test-entity-${id}`,
    metadata: { test: true, route },
    userId: 'test-user',
    companyId: 'test-company',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Mapeamento de rotas para tipos de notificações
 */
const routeToNotificationTypes: Record<
  string,
  { type: string; entityType: string }[]
> = {
  '/inspections': [
    { type: 'inspection', entityType: 'inspection' },
    { type: 'inspection_approval', entityType: 'inspection_approval' },
  ],
  '/rentals': [{ type: 'rental', entityType: 'rental' }],
  '/keys': [{ type: 'key', entityType: 'key' }],
  '/financial': [
    { type: 'payment', entityType: 'payment' },
    { type: 'inspection_approval', entityType: 'inspection_approval' },
  ],
  '/clients': [
    { type: 'client', entityType: 'client' },
    { type: 'document', entityType: 'document' },
  ],
  '/properties': [
    { type: 'property', entityType: 'property' },
    { type: 'property_match', entityType: 'property_match' },
    { type: 'document', entityType: 'document' },
  ],
  '/matches': [{ type: 'property_match', entityType: 'property_match' }],
  '/tasks': [{ type: 'task', entityType: 'task' }],
  '/appointments': [
    { type: 'appointment', entityType: 'appointment' },
    { type: 'appointment_invite', entityType: 'appointment_invite' },
  ],
  '/notes': [{ type: 'note', entityType: 'note' }],
  '/messages': [{ type: 'message', entityType: 'message' }],
  '/subscriptions': [{ type: 'subscription', entityType: 'subscription' }],
};

/**
 * Adiciona notificações de teste
 */
export function addTestNotifications(
  countsByRoute: Record<string, number>
): void {
  // Limpar notificações anteriores
  clearTestNotifications();

  // Criar novas notificações de teste
  Object.entries(countsByRoute).forEach(([route, count]) => {
    const notificationTypes = routeToNotificationTypes[route];

    if (!notificationTypes || notificationTypes.length === 0) {
      console.warn(`⚠️ Rota "${route}" não tem tipos de notificação mapeados`);
      return;
    }

    for (let i = 0; i < count; i++) {
      const notificationType = notificationTypes[i % notificationTypes.length];
      const notification = createTestNotification(
        notificationType.type,
        notificationType.entityType,
        route
      );
      testNotifications.push(notification);
    }
  });

  console.log(
    `✅ Adicionadas ${testNotifications.length} notificações de teste:`,
    countsByRoute
  );
  console.log('📋 Notificações criadas:', testNotifications);

  // Atualizar o hook de notificações se estiver disponível
  updateNotificationsHook();
}

/**
 * Limpa todas as notificações de teste
 */
export function clearTestNotifications(): void {
  testNotifications = [];
  console.log('🗑️ Notificações de teste removidas');
  updateNotificationsHook();
}

/**
 * Obtém os contadores atuais por rota
 */
export function getCountsByRoute(): Record<string, number> {
  const counts: Record<string, number> = {};

  Object.keys(routeToNotificationTypes).forEach(route => {
    counts[route] = 0;
  });

  testNotifications.forEach(notification => {
    if (notification.read) return;

    Object.entries(routeToNotificationTypes).forEach(([route, types]) => {
      const matches = types.some(
        nt =>
          nt.type === notification.type ||
          nt.entityType === notification.entityType
      );

      if (matches) {
        counts[route] = (counts[route] || 0) + 1;
      }
    });
  });

  return counts;
}

/**
 * Obtém o total de notificações não lidas
 */
export function getTotalUnreadCount(): number {
  return testNotifications.filter(n => !n.read).length;
}

/**
 * Obtém todas as notificações de teste
 */
export function getTestNotifications(): Notification[] {
  return [...testNotifications];
}

/**
 * Atualiza o hook de notificações (se disponível)
 */
function updateNotificationsHook(): void {
  // Esta função será chamada quando o hook de notificações for atualizado
  const counts = getCountsByRoute();
  const total = getTotalUnreadCount();

  console.log('📊 Contadores atualizados:');
  console.table(counts);
  console.log(`📈 Total de não lidas: ${total}`);

  // Disparar evento customizado para atualizar componentes
  window.dispatchEvent(
    new CustomEvent('test-notifications-updated', {
      detail: { notifications: testNotifications, counts, total },
    })
  );

  // Notificar listeners
  notifyListeners();
}

/**
 * Função auxiliar para testar cenários específicos
 */
export const testScenarios = {
  /**
   * Cenário 1: Muitas notificações em uma rota
   */
  manyNotifications: () => {
    addTestNotifications({
      '/properties': 25,
      '/clients': 15,
    });
  },

  /**
   * Cenário 2: Notificações distribuídas
   */
  distributedNotifications: () => {
    addTestNotifications({
      '/inspections': 3,
      '/keys': 5,
      '/rentals': 2,
      '/properties': 10,
      '/clients': 1,
      '/matches': 7,
      '/financial': 4,
    });
  },

  /**
   * Cenário 3: Poucas notificações
   */
  fewNotifications: () => {
    addTestNotifications({
      '/properties': 1,
      '/clients': 2,
    });
  },

  /**
   * Cenário 4: Mais de 99 notificações (testar badge "99+")
   */
  overflowNotifications: () => {
    addTestNotifications({
      '/properties': 150,
      '/clients': 50,
    });
  },

  /**
   * Cenário 5: Sem notificações
   */
  noNotifications: () => {
    clearTestNotifications();
  },
};

/**
 * Interface para uso no console do navegador
 */
export const testNotificationUtils = {
  add: addTestNotifications,
  clear: clearTestNotifications,
  getCounts: getCountsByRoute,
  getTotal: getTotalUnreadCount,
  getNotifications: getTestNotifications,
  scenarios: testScenarios,

  /**
   * Ajuda
   */
  help: () => {
    console.log(`
🔔 Utilitário de Teste de Notificações

📋 Métodos disponíveis:
  • add({ '/route': count })     - Adiciona notificações de teste
  • clear()                       - Remove todas as notificações de teste
  • getCounts()                  - Retorna contadores por rota
  • getTotal()                    - Retorna total de não lidas
  • getNotifications()           - Retorna todas as notificações de teste
  • scenarios.manyNotifications() - Testa muitas notificações
  • scenarios.distributedNotifications() - Testa notificações distribuídas
  • scenarios.fewNotifications()  - Testa poucas notificações
  • scenarios.overflowNotifications() - Testa mais de 99 notificações
  • scenarios.noNotifications()   - Remove todas as notificações

📝 Exemplo de uso:
  window.testNotifications.add({
    '/properties': 10,
    '/clients': 5,
    '/inspections': 3
  });

  window.testNotifications.scenarios.distributedNotifications();
    `);
  },
};

// Expor no window para uso no console do navegador
if (typeof window !== 'undefined') {
  (window as any).testNotifications = testNotificationUtils;

  // Log inicial
  console.log('🔔 Utilitário de teste de notificações carregado!');
  console.log('💡 Digite window.testNotifications.help() para ver a ajuda');
}
