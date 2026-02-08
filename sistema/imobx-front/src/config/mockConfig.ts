/**
 * Configuração para modo de demonstração/teste com dados mock
 *
 * Para ativar os dados mock:
 * 1. Mude USE_MOCK_REWARDS para true
 * 2. Ou adicione ?mock=rewards na URL
 * 3. Ou configure no localStorage: localStorage.setItem('USE_MOCK_REWARDS', 'true')
 */

// Verificar localStorage
const localStorageMock =
  typeof window !== 'undefined'
    ? localStorage.getItem('USE_MOCK_REWARDS') === 'true'
    : false;

// Verificar query params
const urlParams =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('mock') === 'rewards'
    : false;

// Configuração global (você pode alterar aqui)
const GLOBAL_MOCK_REWARDS = false;

// Determinar se deve usar mock (qualquer um dos métodos)
export const USE_MOCK_REWARDS =
  GLOBAL_MOCK_REWARDS || localStorageMock || urlParams;

// Log para debug
if (USE_MOCK_REWARDS) {
  // console.log('🎭 MODO MOCK ATIVADO: Usando dados de teste para Rewards');
  // console.log('💡 Para desativar: localStorage.removeItem("USE_MOCK_REWARDS") ou remova ?mock=rewards da URL');
}

/**
 * Ativar modo mock programaticamente
 */
export const enableMockRewards = () => {
  localStorage.setItem('USE_MOCK_REWARDS', 'true');
  // console.log('✅ Modo mock ativado! Recarregue a página.');
};

/**
 * Desativar modo mock programaticamente
 */
export const disableMockRewards = () => {
  localStorage.removeItem('USE_MOCK_REWARDS');
  // console.log('❌ Modo mock desativado! Recarregue a página.');
};

// Expor funções globalmente para facilitar uso no console
if (typeof window !== 'undefined') {
  (window as any).enableMockRewards = enableMockRewards;
  (window as any).disableMockRewards = disableMockRewards;
}
