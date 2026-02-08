/**
 * Exemplos práticos de como funciona o sistema de dependências de permissões
 *
 * Este arquivo demonstra o comportamento esperado do sistema
 */

import {
  addPermissionWithDependencies,
  removePermissionCheckDependencies,
  getDependencyMessage,
  getDependentPermissionsMessage,
  requiresViewPermission,
  getViewPermission,
} from '../utils/permissionDependencies';

// Mock de permissões para exemplos
const mockPermissions = [
  { id: '1', name: 'client:view', description: 'Visualizar clientes' },
  { id: '2', name: 'client:create', description: 'Criar clientes' },
  { id: '3', name: 'client:edit', description: 'Editar clientes' },
  { id: '4', name: 'client:delete', description: 'Deletar clientes' },
  { id: '5', name: 'property:view', description: 'Visualizar propriedades' },
  { id: '6', name: 'property:create', description: 'Criar propriedades' },
  { id: '7', name: 'property:edit', description: 'Editar propriedades' },
];

// ============================================================================
// EXEMPLO 1: Verificar se permissão requer view
// ============================================================================

// console.log('=== EXEMPLO 1: Verificar dependências ===\n');
const permissions = [
  'client:view',
  'client:create',
  'client:edit',
  'client:delete',
  'client:export',
];

permissions.forEach(perm => {
  const requires = requiresViewPermission(perm);
  const viewPerm = requires ? getViewPermission(perm) : 'N/A';
  // console.log(`${perm}`);
  // console.log(`  Requer view? ${requires ? '✅' : '❌'}`);
  // console.log(`  View necessária: ${viewPerm}\n`);
});

// ============================================================================
// EXEMPLO 2: Adicionar permissão com dependências
// ============================================================================

// console.log('=== EXEMPLO 2: Adicionar permissão ===\n');
// Cenário: Usuário não tem nenhuma permissão de cliente
let currentPermissions: string[] = [];

// console.log('Permissões atuais:', currentPermissions);
// console.log('\nUsuário seleciona: client:create\n');
// Adicionar client:create
const result1 = addPermissionWithDependencies(
  currentPermissions,
  '2', // ID de client:create
  mockPermissions
);

currentPermissions = result1.permissions;

// console.log('Permissões após adicionar:');
currentPermissions.forEach(id => {
  const perm = mockPermissions.find(p => p.id === id);
  // console.log(`  - ${perm?.name} (${id})`);
});

if (result1.addedDependencies.length > 0) {
  // console.log('\n📢 Notificação:');
  // console.log('  ' + getDependencyMessage(result1.addedDependencies, mockPermissions));
}

// ============================================================================
// EXEMPLO 3: Adicionar múltiplas permissões
// ============================================================================

// console.log('\n=== EXEMPLO 3: Adicionar múltiplas permissões ===\n');
// Adicionar client:edit (view já existe, não deve duplicar)
// console.log('Usuário seleciona: client:edit\n');
const result2 = addPermissionWithDependencies(
  currentPermissions,
  '3', // ID de client:edit
  mockPermissions
);

currentPermissions = result2.permissions;

// console.log('Permissões após adicionar:');
currentPermissions.forEach(id => {
  const perm = mockPermissions.find(p => p.id === id);
  // console.log(`  - ${perm?.name} (${id})`);
});

if (result2.addedDependencies.length > 0) {
  // console.log('\n📢 Notificação:');
  // console.log('  ' + getDependencyMessage(result2.addedDependencies, mockPermissions));
} else {
  // console.log('\n✅ Nenhuma dependência adicionada (view já existe)');
}

// ============================================================================
// EXEMPLO 4: Tentar remover permissão view (com dependências)
// ============================================================================

// console.log('\n=== EXEMPLO 4: Tentar remover view (BLOQUEADO) ===\n');
// console.log('Permissões atuais:');
currentPermissions.forEach(id => {
  const perm = mockPermissions.find(p => p.id === id);
  // console.log(`  - ${perm?.name}`);
});

// console.log('\nUsuário tenta desmarcar: client:view\n');
const result3 = removePermissionCheckDependencies(
  currentPermissions,
  '1', // ID de client:view
  mockPermissions
);

if (result3.canRemove) {
  // console.log('✅ Remoção permitida');
  currentPermissions = result3.permissions;
} else {
  // console.log('❌ Remoção BLOQUEADA');
  // console.log('\n⚠️ Notificação:');
  // console.log('  ' + getDependentPermissionsMessage(result3.dependentPermissions, mockPermissions));
  // console.log('\nPermissões que dependem de client:view:');
  result3.dependentPermissions.forEach(id => {
    const perm = mockPermissions.find(p => p.id === id);
    // console.log(`  - ${perm?.name}`);
  });
}

// ============================================================================
// EXEMPLO 5: Remover em ordem correta
// ============================================================================

// console.log('\n=== EXEMPLO 5: Remover em ordem correta ===\n');
// console.log('Permissões atuais:');
currentPermissions.forEach(id => {
  const perm = mockPermissions.find(p => p.id === id);
  // console.log(`  - ${perm?.name}`);
});

// Remover client:create
// console.log('\nPasso 1: Remover client:create\n');
const result4 = removePermissionCheckDependencies(
  currentPermissions,
  '2', // ID de client:create
  mockPermissions
);

if (result4.canRemove) {
  currentPermissions = result4.permissions;
  // console.log('✅ Removido com sucesso');
  // console.log('\nPermissões restantes:');
  currentPermissions.forEach(id => {
    const perm = mockPermissions.find(p => p.id === id);
    // console.log(`  - ${perm?.name}`);
  });
} else {
  // console.log('❌ Não foi possível remover');
}

// Remover client:edit
// console.log('\nPasso 2: Remover client:edit\n');
const result5 = removePermissionCheckDependencies(
  currentPermissions,
  '3', // ID de client:edit
  mockPermissions
);

if (result5.canRemove) {
  currentPermissions = result5.permissions;
  // console.log('✅ Removido com sucesso');
  // console.log('\nPermissões restantes:');
  currentPermissions.forEach(id => {
    const perm = mockPermissions.find(p => p.id === id);
    // console.log(`  - ${perm?.name}`);
  });
} else {
  // console.log('❌ Não foi possível remover');
}

// Agora remover client:view (deve funcionar)
// console.log('\nPasso 3: Remover client:view\n');
const result6 = removePermissionCheckDependencies(
  currentPermissions,
  '1', // ID de client:view
  mockPermissions
);

if (result6.canRemove) {
  currentPermissions = result6.permissions;
  // console.log('✅ Removido com sucesso (não há mais dependências)');
  // console.log('\nPermissões restantes:');
  if (currentPermissions.length === 0) {
    // console.log('  (nenhuma)');
  } else {
    currentPermissions.forEach(id => {
      const perm = mockPermissions.find(p => p.id === id);
      // console.log(`  - ${perm?.name}`);
    });
  }
} else {
  // console.log('❌ Não foi possível remover');
}

// ============================================================================
// EXEMPLO 6: Cenário complexo com múltiplas categorias
// ============================================================================

// console.log('\n=== EXEMPLO 6: Múltiplas categorias ===\n');
currentPermissions = [];

// console.log('Usuário seleciona: client:create, property:edit\n');
// Adicionar client:create
const r1 = addPermissionWithDependencies(
  currentPermissions,
  '2',
  mockPermissions
);
currentPermissions = r1.permissions;

if (r1.addedDependencies.length > 0) {
  // console.log('Ao adicionar client:create:');
  // console.log('  → ' + getDependencyMessage(r1.addedDependencies, mockPermissions));
}

// Adicionar property:edit
const r2 = addPermissionWithDependencies(
  currentPermissions,
  '7',
  mockPermissions
);
currentPermissions = r2.permissions;

if (r2.addedDependencies.length > 0) {
  // console.log('\nAo adicionar property:edit:');
  // console.log('  → ' + getDependencyMessage(r2.addedDependencies, mockPermissions));
}

// console.log('\nPermissões finais:');
currentPermissions.forEach(id => {
  const perm = mockPermissions.find(p => p.id === id);
  // console.log(`  - ${perm?.name}`);
});

// ============================================================================
// RESUMO
// ============================================================================

// console.log('\n' + '='.repeat(70));
// console.log('RESUMO DOS EXEMPLOS');
// console.log('='.repeat(70));
// console.log(`
// ✅ Exemplo 1: Demonstrou como identificar dependências
// ✅ Exemplo 2: Adicionou permissão com dependência automaticamente
// ✅ Exemplo 3: Não duplicou dependência já existente
// ✅ Exemplo 4: Bloqueou remoção indevida com mensagem clara
// ✅ Exemplo 5: Permitiu remoção na ordem correta
// ✅ Exemplo 6: Funcionou com múltiplas categorias
//
// 🎯 Todos os cenários comportam-se conforme esperado!
// `);
// ============================================================================
// DICAS DE USO
// ============================================================================

// console.log('='.repeat(70));
// console.log('DICAS DE USO');
// console.log('='.repeat(70));
// console.log(`
// 1. Sempre use addPermissionWithDependencies() ao adicionar
// 2. Sempre use removePermissionCheckDependencies() ao remover
// 3. Mostre as notificações geradas pelas funções helper
// 4. Verifique result.canRemove antes de aplicar remoção
// 5. Use getDependencyMessage() para mensagens amigáveis
//
// 📚 Veja documentação completa em: src/docs/PERMISSION_DEPENDENCIES.md
// `);
export {};
