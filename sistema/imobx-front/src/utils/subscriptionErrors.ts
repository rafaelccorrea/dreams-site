import { toast } from 'react-toastify';

export const handleSubscriptionError = (error: any) => {
  const errorCode = error.response?.data?.code;
  const message = error.response?.data?.message;

  switch (errorCode) {
    case 'SUBSCRIPTION_NOT_FOUND':
      toast.error('Assinatura não encontrada');
      break;

    case 'PLAN_NOT_FOUND':
      toast.error('Plano selecionado não existe');
      break;

    case 'INVALID_UPGRADE':
      toast.error('Não é possível fazer upgrade para este plano');
      break;

    case 'DOWNGRADE_LIMITS_EXCEEDED':
      toast.error(
        'Você possui mais recursos do que o novo plano permite. Remova dados antes de fazer downgrade.'
      );
      break;

    case 'SUBSCRIPTION_ALREADY_CANCELLED':
      toast.error('Esta assinatura já foi cancelada');
      break;

    case 'PERMISSION_DENIED':
      toast.error('Você não tem permissão para esta ação');
      break;

    case 'PAYMENT_REQUIRED':
      toast.error('Pagamento necessário para esta operação');
      break;

    case 'SUBSCRIPTION_EXPIRED':
      toast.error(
        'Sua assinatura expirou. Renove para continuar usando o sistema'
      );
      break;

    case 'SUBSCRIPTION_SUSPENDED':
      toast.error(
        'Sua assinatura está suspensa. Entre em contato com o suporte'
      );
      break;

    case 'INVALID_CHANGE_TYPE':
      toast.error('Tipo de mudança inválido');
      break;

    case 'CUSTOM_PLAN_REQUIRED':
      toast.error('Este recurso requer um plano personalizado');
      break;

    case 'MODULE_NOT_AVAILABLE':
      toast.error('Módulo não disponível para este plano');
      break;

    case 'USAGE_LIMIT_EXCEEDED':
      toast.error('Limite de uso excedido. Faça upgrade do seu plano');
      break;

    case 'COMPANY_NOT_FOUND':
      toast.error('Empresa não encontrada');
      break;

    case 'INVALID_MODULE_LIST':
      toast.error('Lista de módulos inválida');
      break;

    case 'CANCELLATION_NOT_ALLOWED':
      toast.error('Cancelamento não permitido neste momento');
      break;

    case 'UPGRADE_NOT_ALLOWED':
      toast.error('Upgrade não permitido para este plano');
      break;

    case 'DOWNGRADE_NOT_ALLOWED':
      toast.error('Downgrade não permitido para este plano');
      break;

    case 'NETWORK_ERROR':
      toast.error('Erro de conexão. Verifique sua internet e tente novamente');
      break;

    case 'SERVER_ERROR':
      toast.error(
        'Erro interno do servidor. Tente novamente em alguns minutos'
      );
      break;

    case 'TIMEOUT':
      toast.error('Operação demorou muito para responder. Tente novamente');
      break;

    default:
      if (message) {
        toast.error(message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Erro inesperado. Tente novamente');
      }
  }
};

export const handleSubscriptionSuccess = (action: string, _data?: any) => {
  switch (action) {
    case 'upgrade':
      toast.success('✅ Upgrade realizado com sucesso!');
      break;

    case 'downgrade':
      toast.success('✅ Downgrade realizado com sucesso!');
      break;

    case 'cancel':
      toast.success('✅ Assinatura cancelada com sucesso');
      break;

    case 'suspend':
      toast.success('✅ Assinatura suspensa com sucesso');
      break;

    case 'activate':
      toast.success('✅ Assinatura ativada com sucesso');
      break;

    case 'module_add':
      toast.success('✅ Módulos adicionados com sucesso');
      break;

    case 'module_remove':
      toast.success('✅ Módulos removidos com sucesso');
      break;

    default:
      toast.success('✅ Operação realizada com sucesso');
  }
};

export const validateSubscriptionAction = (
  action: string,
  subscription: any
) => {
  if (!subscription) {
    toast.error('Dados da assinatura não encontrados');
    return false;
  }

  if (subscription.status === 'cancelled') {
    toast.error('Esta assinatura já foi cancelada');
    return false;
  }

  if (subscription.status === 'expired') {
    toast.error('Esta assinatura expirou');
    return false;
  }

  if (subscription.status === 'suspended' && action !== 'activate') {
    toast.error('Esta assinatura está suspensa');
    return false;
  }

  return true;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export const calculateDaysRemaining = (endDate: string | Date): number => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const getSubscriptionStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'var(--color-success)';
    case 'suspended':
      return 'var(--color-warning)';
    case 'cancelled':
      return 'var(--color-error)';
    case 'expired':
      return 'var(--color-error)';
    default:
      return 'var(--color-text-secondary)';
  }
};

export const getSubscriptionStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return '✅';
    case 'suspended':
      return '⚠️';
    case 'cancelled':
      return '❌';
    case 'expired':
      return '⏰';
    default:
      return '❓';
  }
};
