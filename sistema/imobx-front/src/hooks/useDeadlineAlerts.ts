import { useState, useEffect, useCallback } from 'react';
import type { KanbanTask } from '../types/kanban';

interface DeadlineAlert {
  id: string;
  taskId: string;
  taskTitle: string;
  type: 'warning' | 'overdue';
  dueDate: Date;
  daysRemaining: number;
  message: string;
  isRead: boolean;
}

interface UseDeadlineAlertsReturn {
  alerts: DeadlineAlert[];
  unreadCount: number;
  addAlert: (alert: Omit<DeadlineAlert, 'id' | 'isRead'>) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  clearAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  refreshAlerts: (tasks: KanbanTask[]) => void;
}

const STORAGE_KEY = 'kanban-deadline-alerts';

const getDeadlineStatus = (
  dueDate: Date
): { type: 'warning' | 'overdue' | 'ok'; daysRemaining: number } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { type: 'overdue', daysRemaining: Math.abs(diffDays) };
  } else if (diffDays <= 2) {
    return { type: 'warning', daysRemaining: diffDays };
  }

  return { type: 'ok', daysRemaining: diffDays };
};

const generateAlertMessage = (
  type: 'warning' | 'overdue',
  daysRemaining: number
): string => {
  if (type === 'overdue') {
    return `Tarefa vencida há ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}`;
  } else {
    return `Tarefa vence em ${daysRemaining} dia${daysRemaining > 1 ? 's' : ''}`;
  }
};

export const useDeadlineAlerts = (): UseDeadlineAlertsReturn => {
  const [alerts, setAlerts] = useState<DeadlineAlert[]>([]);

  // Carregar alertas do localStorage no mount (preserva estado "lido")
  useEffect(() => {
    try {
      const savedAlerts = localStorage.getItem(STORAGE_KEY);
      if (savedAlerts) {
        const parsed = JSON.parse(savedAlerts);
        const alertsWithDates = parsed.map((alert: any) => ({
          ...alert,
          dueDate: new Date(alert.dueDate),
        }));
        setAlerts(alertsWithDates);
      }
    } catch (error) {
      console.error('Erro ao carregar alertas de prazo:', error);
    }
  }, []);

  // Salvar alertas no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (error) {
      console.error('Erro ao salvar alertas de prazo:', error);
    }
  }, [alerts]);

  const addAlert = useCallback(
    (alert: Omit<DeadlineAlert, 'id' | 'isRead'>) => {
      const newAlert: DeadlineAlert = {
        ...alert,
        id: `alert-${Date.now()}-${alert.taskId}`,
        isRead: false,
      };

      setAlerts(prev => {
        // Verificar se já existe um alerta para esta tarefa
        const existingAlertIndex = prev.findIndex(
          a => a.taskId === alert.taskId
        );

        if (existingAlertIndex >= 0) {
          // Atualizar alerta existente se o tipo mudou
          const existingAlert = prev[existingAlertIndex];
          if (
            existingAlert.type !== alert.type ||
            existingAlert.daysRemaining !== alert.daysRemaining
          ) {
            const updated = [...prev];
            updated[existingAlertIndex] = {
              ...newAlert,
              isRead: existingAlert.isRead,
            };
            return updated;
          }
          return prev; // Não há mudanças
        }

        // Adicionar novo alerta
        return [...prev, newAlert];
      });
    },
    []
  );

  const markAsRead = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  }, []);

  const clearAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const refreshAlerts = useCallback((tasks: KanbanTask[]) => {
    // Não limpar alertas quando tasks está vazio/undefined (ex.: loading) para preservar estado "lido" no localStorage
    if (!tasks || tasks.length === 0) {
      return;
    }

    const newAlerts: Omit<DeadlineAlert, 'id' | 'isRead'>[] = [];

    tasks.forEach(task => {
      if (task.dueDate) {
        const status = getDeadlineStatus(new Date(task.dueDate));

        if (status.type === 'warning' || status.type === 'overdue') {
          newAlerts.push({
            taskId: task.id,
            taskTitle: task.title,
            type: status.type,
            dueDate: new Date(task.dueDate),
            daysRemaining: status.daysRemaining,
            message: generateAlertMessage(status.type, status.daysRemaining),
          });
        }
      }
    });

    // Atualizar alertas baseado nas tarefas atuais (preservando isRead dos alertas existentes)
    setAlerts(prev => {
      const currentTaskIds = tasks.map(task => task.id);
      const updatedAlerts = prev.filter(alert =>
        currentTaskIds.includes(alert.taskId)
      );

      // Adicionar novos alertas
      newAlerts.forEach(newAlert => {
        const existingAlert = updatedAlerts.find(
          alert => alert.taskId === newAlert.taskId
        );

        if (!existingAlert) {
          updatedAlerts.push({
            ...newAlert,
            id: `alert-${Date.now()}-${newAlert.taskId}`,
            isRead: false,
          });
        } else if (
          existingAlert.type !== newAlert.type ||
          existingAlert.daysRemaining !== newAlert.daysRemaining
        ) {
          // Atualizar alerta existente se houver mudanças
          const index = updatedAlerts.findIndex(
            alert => alert.taskId === newAlert.taskId
          );
          updatedAlerts[index] = {
            ...newAlert,
            id: existingAlert.id,
            isRead: existingAlert.isRead,
          };
        }
      });

      // Ordenar por urgência: vencidas primeiro, depois por dias restantes
      return updatedAlerts.sort((a, b) => {
        if (a.type === 'overdue' && b.type !== 'overdue') return -1;
        if (b.type === 'overdue' && a.type !== 'overdue') return 1;
        return a.daysRemaining - b.daysRemaining;
      });
    });
  }, []);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return {
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    markAllAsRead,
    clearAlert,
    clearAllAlerts,
    refreshAlerts,
  };
};
