// Traduções dos roles de usuário
export const translateUserRole = (role: string, isOwner?: boolean): string => {
  switch (role) {
    case 'user':
      return 'Colaborador';
    case 'manager':
      return 'Gestor';
    case 'admin':
      return isOwner ? 'Proprietário' : 'Administrativo';
    case 'master':
      return 'Gerenciador';
    default:
      return role;
  }
};

// Traduções reversas (português para inglês)
export const translateRoleToEnglish = (role: string): string => {
  switch (role) {
    case 'Colaborador':
      return 'user';
    case 'Gestor':
      return 'manager';
    case 'Proprietário':
      return 'admin';
    case 'Gerenciador':
      return 'master';
    default:
      return role;
  }
};

// Obter ícone para cada role
export const getRoleIcon = (role: string): string => {
  switch (role) {
    case 'user':
      return '👤';
    case 'manager':
      return '📊';
    case 'admin':
      return '👑';
    case 'master':
      return '🔧';
    default:
      return '👤';
  }
};

// Obter cor para cada role
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'user':
      return '#3b82f6'; // Azul
    case 'manager':
      return '#10b981'; // Verde
    case 'admin':
      return '#7c3aed'; // Roxo
    case 'master':
      return '#dc2626'; // Vermelho
    default:
      return '#6b7280'; // Cinza
  }
};
