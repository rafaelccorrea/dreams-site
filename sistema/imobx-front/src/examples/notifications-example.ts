// Exemplo de uso das notificações personalizadas
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showForceLogoutNotification,
} from '../utils/notifications';

// Exemplos de uso:

// Notificação de sucesso
showSuccess('Usuário criado com sucesso!');

// Notificação de erro
showError('Erro ao conectar com o servidor');

// Notificação de aviso
showWarning('Esta ação não pode ser desfeita');

// Notificação informativa
showInfo('Sistema será atualizado em 5 minutos');

// Notificação especial para logout forçado
showForceLogoutNotification(
  'Você foi desconectado porque fez login em outro dispositivo'
);

// Com opções personalizadas
showSuccess('Operação concluída!', {
  autoClose: 3000,
  position: 'top-center',
});

// Para casos especiais
showError('Erro crítico', {
  autoClose: false, // Não fecha automaticamente
  closeOnClick: false, // Não fecha ao clicar
});
