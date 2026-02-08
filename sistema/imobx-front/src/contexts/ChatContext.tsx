import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  openChat: (roomId: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

interface ChatProviderProps {
  children: ReactNode;
  onOpenChat?: (roomId: string) => void;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  onOpenChat,
}) => {
  const openChat = (roomId?: string) => {
    if (roomId) {
      if (onOpenChat) {
        onOpenChat(roomId);
      }
      // Disparar evento customizado para o ChatWindows ouvir
      window.dispatchEvent(
        new CustomEvent('open-chat', { detail: { roomId } })
      );
    } else {
      // Se não passou roomId, abrir primeira sala disponível ou página de chat
      window.dispatchEvent(
        new CustomEvent('open-chat', { detail: { roomId: null } })
      );
    }
  };

  const openChatWindow = (roomId?: string) => {
    openChat(roomId);
  };

  return (
    <ChatContext.Provider value={{ openChat, openChatWindow }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
