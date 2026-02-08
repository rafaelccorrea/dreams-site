import React, { createContext, memo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Drawer } from './Drawer';
import { Header } from './Header';
import { ModalProvider } from '../../contexts/ModalContext';
import { ModalManager } from '../ModalManager';
import { useDrawer } from '../../hooks/useDrawer';
import { useAuthMonitor } from '../../hooks/useAuthMonitor';
import { useCompanyLoader } from '../../hooks/useCompanyLoader';
import {
  MainContent,
  MainScrollArea,
  PageContentArea,
} from '../../styles/components/DrawerStyles';
import { PermissionsProvider } from '../../contexts/PermissionsContext';
import { SubscriptionNotification } from '../SubscriptionNotification';
import { PermissionsNotificationManager } from '../permissions/PermissionsNotificationManager';
import { ChatWindows } from '../chat/ChatWindows';
import { FloatingChatButton } from '../chat/FloatingChatButton';
import { FloatingZezinButton } from '../chat/FloatingZezinButton';
import { ChatProvider } from '../../contexts/ChatContext';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContext = createContext(false);

const LayoutShell: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, toggleDrawer } = useDrawer();
  const location = useLocation();

  // Monitorar autenticação para detectar problemas
  useAuthMonitor();

  // Garantir que as companies sejam carregadas quando o layout for renderizado
  // Isso é necessário para o header e drawer funcionarem corretamente
  useCompanyLoader();

  return (
    <PermissionsProvider>
      <ModalProvider>
        <ChatProvider>
          <Header onToggleDrawer={toggleDrawer} isDrawerOpen={isOpen} />
          <Drawer
            isOpen={isOpen}
            onToggle={toggleDrawer}
            currentPath={location.pathname}
          />
          <MainContent $drawerOpen={isOpen}>
            <MainScrollArea>
              {location.pathname.startsWith('/kanban') ? (
                children
              ) : (
                <PageContentArea>{children}</PageContentArea>
              )}
            </MainScrollArea>
          </MainContent>
          <ModalManager />
          <SubscriptionNotification />
          <PermissionsNotificationManager />
          <ChatWindows />
          <FloatingZezinButton />
          <FloatingChatButton />
        </ChatProvider>
      </ModalProvider>
    </PermissionsProvider>
  );
};

export const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const hasParentLayout = useContext(LayoutContext);

  if (hasParentLayout) {
    return <>{children}</>;
  }

  return (
    <LayoutContext.Provider value={true}>
      <LayoutShell>{children}</LayoutShell>
    </LayoutContext.Provider>
  );
});
