import { useMemo } from 'react';
import { useChat } from './useChat';
import { useAuth } from './useAuth';
import { useModuleAccess } from './useModuleAccess';

/**
 * Hook para obter o contador de mensagens não lidas do chat
 */
export const useChatUnreadCount = (): number => {
  const moduleAccess = useModuleAccess();
  const hasChatModule = moduleAccess.isModuleAvailableForCompany('chat');
  const { rooms, messages, currentRoom } = useChat();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const unreadCount = useMemo(() => {
    if (!hasChatModule || !currentUser?.id) {
      return 0;
    }

    let total = 0;

    rooms.forEach(room => {
      // Não contar mensagens não lidas da sala atual (já está aberta)
      if (room.id === currentRoom) {
        return;
      }

      const roomMessages = messages[room.id] || [];
      const unread = roomMessages.filter(msg => {
        // Mensagem não lida se:
        // 1. Não foi enviada pelo usuário atual
        // 2. Status não é 'read' (pode ser 'sending', 'sent', 'delivered', ou undefined)
        // 3. Não foi deletada
        const isNotOwn = msg.senderId !== currentUser.id;
        // Considerar não lida se status não for 'read' (incluindo undefined, 'sending', 'sent', 'delivered')
        const isNotRead = msg.status !== 'read';
        const isNotDeleted = !msg.isDeleted;
        return isNotOwn && isNotRead && isNotDeleted;
      }).length;

      total += unread;
    });

    return total;
  }, [hasChatModule, rooms, messages, currentUser?.id, currentRoom]);

  return unreadCount;
};
