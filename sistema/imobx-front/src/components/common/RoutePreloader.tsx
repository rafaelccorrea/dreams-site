import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Preload das páginas mais acessadas
const preloadRoutes = {
  dashboard: () => import('../../pages/PropertiesPage'),
  properties: () => import('../../pages/PropertyDetailsPage'),
  financial: () => import('../../pages/FinancialPage'),
  calendar: () => import('../../pages/CalendarPage'),
  kanban: () => import('../../pages/ProjectSelection'),
  clients: () => import('../../pages/ClientsPage'),
  rentals: () => import('../../pages/RentalsPage'),
  notes: () => import('../../pages/NotesPage'),
};

export const RoutePreloader: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Preload inteligente baseado na rota atual
    const currentPath = location.pathname;

    // Delay para não interferir no carregamento da página atual
    const preloadTimer = setTimeout(() => {
      if (currentPath === '/dashboard' || currentPath === '/') {
        // No dashboard, preload das páginas mais acessadas
        preloadRoutes.properties();
        preloadRoutes.financial();
        preloadRoutes.calendar();
      } else if (currentPath.startsWith('/properties')) {
        // Nas propriedades, preload do financeiro e clientes
        preloadRoutes.financial();
        preloadRoutes.clients();
      } else if (currentPath.startsWith('/financial')) {
        // No financeiro, preload de propriedades e rentals
        preloadRoutes.properties();
        preloadRoutes.rentals();
      } else if (currentPath.startsWith('/calendar')) {
        // No calendário, preload de clientes e propriedades
        preloadRoutes.clients();
        preloadRoutes.properties();
      }
    }, 1000); // 1 segundo de delay

    return () => clearTimeout(preloadTimer);
  }, [location.pathname]);

  return null;
};

export default RoutePreloader;
