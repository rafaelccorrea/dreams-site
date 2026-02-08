// console.log('⚡ MAIN.TSX CARREGADO!');

// CRITICAL: Register Chart.js components FIRST, before any other imports
// This prevents "linear is not a registered scale" errors with Vite code splitting
import {
  forceChartRegistration,
  verifyChartRegistration,
} from './components/charts/chartConfig';
forceChartRegistration();

// Verify registration succeeded
if (!verifyChartRegistration()) {
  console.error('[Main] Chart.js registration failed on initial load!');
  forceChartRegistration();
}

import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import PublicApp from './PublicApp.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// console.log('🚀 main.tsx: Iniciando aplicação React...');
// Base path - deve corresponder ao configurado no vite.config.ts
const basePath = '/sistema'; // 👈 ALTERE AQUI se mudar no vite.config.ts

// CORREÇÃO: Verificar se está acessando a raiz sem o base path e redirecionar
const currentPath = window.location.pathname;
if (basePath && (currentPath === '/' || !currentPath.startsWith(basePath))) {
  // Se está na raiz ou não começando com /sistema, redirecionar para /sistema
  const newPath = currentPath === '/' ? basePath : `${basePath}${currentPath}`;
  window.location.href = `${window.location.origin}${newPath}${window.location.search}${window.location.hash}`;
} else {
  // Verificar se é rota pública (considerando base path)
  const publicUploadPath = basePath
    ? `${basePath}/public/upload-documents/`
    : '/public/upload-documents/';
  const publicSignaturePath = basePath ? `${basePath}/assinar/` : '/assinar/';
  const isPublicUploadRoute =
    window.location.pathname.startsWith(publicUploadPath);
  const isPublicSignatureRoute =
    window.location.pathname.startsWith(publicSignaturePath);

  // console.log('🔍 Rota:', window.location.pathname);
  // console.log('🎯 Renderizando:', isPublicUploadRoute || isPublicSignatureRoute ? 'PublicApp' : 'App');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    isPublicUploadRoute || isPublicSignatureRoute ? (
      <ThemeProvider>
        <PublicApp />
      </ThemeProvider>
    ) : (
      <App />
    )
  );

  // console.log('✅ App renderizado!');
}
