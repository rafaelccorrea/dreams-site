// Traduções para status de assinaturas
export const subscriptionStatusTranslations: Record<string, string> = {
  active: 'Ativa',
  expired: 'Expirada',
  cancelled: 'Cancelada',
  inactive: 'Inativa',
  pending: 'Pendente',
  suspended: 'Suspensa',
};

// Traduções para tipos de planos
export const planTypeTranslations: Record<string, string> = {
  basic: 'Básico',
  professional: 'Profissional',
  pro: 'Profissional',
  custom: 'Personalizado',
  enterprise: 'Empresarial',
};

// Funções helper
export const translateSubscriptionStatus = (status: string): string => {
  return subscriptionStatusTranslations[status] || status;
};

export const translatePlanType = (type: string): string => {
  return planTypeTranslations[type] || type;
};

// Obter classe CSS para cor do status
export const getStatusColorClass = (
  status: string
): 'success' | 'error' | 'warning' | 'default' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
    case 'cancelled':
      return 'error';
    case 'pending':
    case 'suspended':
      return 'warning';
    default:
      return 'default';
  }
};

// Obter ícone para porcentagem de uso
export const getUsageIcon = (percentage: number): '✅' | '⚠️' | '🟠' | '🔴' => {
  if (percentage < 60) return '✅';
  if (percentage < 80) return '⚠️';
  if (percentage <= 100) return '🟠';
  return '🔴';
};

// Obter classe de cor para porcentagem de uso
export const getUsageColorClass = (
  percentage: number
): 'success' | 'warning' | 'danger' | 'error' => {
  if (percentage < 60) return 'success';
  if (percentage < 80) return 'warning';
  if (percentage <= 100) return 'danger';
  return 'error';
};
