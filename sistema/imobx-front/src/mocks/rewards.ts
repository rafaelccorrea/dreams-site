import type {
  Reward,
  RewardRedemption,
  RewardStats,
} from '../types/rewards.types';
import { RewardCategory, RedemptionStatus } from '../types/rewards.types';

// Mock de prêmios disponíveis
export const mockRewards: Reward[] = [
  {
    id: 'reward-1',
    companyId: 'company-1',
    name: 'Vale-Compras R$ 100',
    description:
      'Vale-compras no valor de R$ 100 para usar em estabelecimentos conveniados',
    category: RewardCategory.MONETARY,
    pointsCost: 500,
    monetaryValue: 100.0,
    icon: '💰',
    imageUrl: undefined,
    stockQuantity: 10,
    redeemedCount: 3,
    isActive: true,
    displayOrder: 0,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-2',
    companyId: 'company-1',
    name: 'Vale-Compras R$ 50',
    description: 'Vale-compras no valor de R$ 50',
    category: RewardCategory.MONETARY,
    pointsCost: 250,
    monetaryValue: 50.0,
    icon: '💵',
    imageUrl: undefined,
    stockQuantity: 20,
    redeemedCount: 8,
    isActive: true,
    displayOrder: 1,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-3',
    companyId: 'company-1',
    name: 'Dia de Folga',
    description: 'Um dia de folga remunerada para usar quando preferir',
    category: RewardCategory.TIME_OFF,
    pointsCost: 1000,
    monetaryValue: undefined,
    icon: '🏖️',
    imageUrl: undefined,
    stockQuantity: 5,
    redeemedCount: 2,
    isActive: true,
    displayOrder: 2,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-4',
    companyId: 'company-1',
    name: 'Gift Card Amazon R$ 200',
    description: 'Gift card da Amazon no valor de R$ 200 para compras online',
    category: RewardCategory.GIFT,
    pointsCost: 1000,
    monetaryValue: 200.0,
    icon: '🎁',
    imageUrl: undefined,
    stockQuantity: 8,
    redeemedCount: 1,
    isActive: true,
    displayOrder: 3,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-5',
    companyId: 'company-1',
    name: 'Jantar para Dois',
    description:
      'Voucher para jantar em restaurante parceiro para duas pessoas',
    category: RewardCategory.EXPERIENCE,
    pointsCost: 750,
    monetaryValue: 150.0,
    icon: '🍽️',
    imageUrl: undefined,
    stockQuantity: 6,
    redeemedCount: 3,
    isActive: true,
    displayOrder: 4,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-6',
    companyId: 'company-1',
    name: 'Ingresso Cinema',
    description: 'Ingresso para cinema, válido em qualquer sessão',
    category: RewardCategory.EXPERIENCE,
    pointsCost: 300,
    monetaryValue: 40.0,
    icon: '🎬',
    imageUrl: undefined,
    stockQuantity: 15,
    redeemedCount: 7,
    isActive: true,
    displayOrder: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-7',
    companyId: 'company-1',
    name: 'Troféu Destaque do Mês',
    description: 'Reconhecimento especial com troféu personalizado',
    category: RewardCategory.RECOGNITION,
    pointsCost: 2000,
    monetaryValue: undefined,
    icon: '🏆',
    imageUrl: undefined,
    stockQuantity: null, // Ilimitado
    redeemedCount: 0,
    isActive: true,
    displayOrder: 6,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-8',
    companyId: 'company-1',
    name: 'Notebook Dell',
    description: 'Notebook Dell Inspiron 15 - 8GB RAM, 256GB SSD (ESGOTADO)',
    category: RewardCategory.GIFT,
    pointsCost: 5000,
    monetaryValue: 3000.0,
    icon: '💻',
    imageUrl: undefined,
    stockQuantity: 2,
    redeemedCount: 2,
    isActive: false, // INATIVO - Esgotado
    displayOrder: 7,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-9',
    companyId: 'company-1',
    name: 'Curso Online Udemy',
    description:
      'Acesso a qualquer curso da plataforma Udemy (TEMPORARIAMENTE INDISPONÍVEL)',
    category: RewardCategory.DEVELOPMENT,
    pointsCost: 400,
    monetaryValue: 80.0,
    icon: '📚',
    imageUrl: undefined,
    stockQuantity: 0,
    redeemedCount: 5,
    isActive: false, // INATIVO - Temporariamente indisponível
    displayOrder: 8,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reward-10',
    companyId: 'company-1',
    name: 'Happy Hour com a Equipe',
    description: 'Happy hour patrocinado pela empresa (DESCONTINUADO)',
    category: RewardCategory.EXPERIENCE,
    pointsCost: 200,
    monetaryValue: undefined,
    icon: '🍻',
    imageUrl: undefined,
    stockQuantity: null,
    redeemedCount: 12,
    isActive: false, // INATIVO - Descontinuado
    displayOrder: 9,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock de resgates do usuário
export const mockMyRedemptions: RewardRedemption[] = [
  {
    id: 'redemption-1',
    userId: 'user-1',
    companyId: 'company-1',
    rewardId: 'reward-1',
    status: RedemptionStatus.PENDING,
    pointsSpent: 500,
    userNotes: 'Gostaria de receber em dinheiro se possível',
    reviewedById: undefined,
    reviewedAt: undefined,
    reviewNotes: undefined,
    deliveredById: undefined,
    deliveredAt: undefined,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[0],
    user: {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@empresa.com',
    },
  },
  {
    id: 'redemption-2',
    userId: 'user-1',
    companyId: 'company-1',
    rewardId: 'reward-6',
    status: RedemptionStatus.APPROVED,
    pointsSpent: 300,
    userNotes: 'Preferência por sessão no final de semana',
    reviewedById: 'manager-1',
    reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewNotes: 'Aprovado! Pode retirar o voucher no RH.',
    deliveredById: undefined,
    deliveredAt: undefined,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[5],
    user: {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@empresa.com',
    },
    reviewedBy: {
      id: 'manager-1',
      name: 'Carlos Gestor',
    },
  },
  {
    id: 'redemption-3',
    userId: 'user-1',
    companyId: 'company-1',
    rewardId: 'reward-2',
    status: RedemptionStatus.DELIVERED,
    pointsSpent: 250,
    userNotes: undefined,
    reviewedById: 'manager-1',
    reviewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reviewNotes: 'Aprovado',
    deliveredById: 'admin-1',
    deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[1],
    user: {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@empresa.com',
    },
    reviewedBy: {
      id: 'manager-1',
      name: 'Carlos Gestor',
    },
    deliveredBy: {
      id: 'admin-1',
      name: 'Admin Sistema',
    },
  },
  {
    id: 'redemption-4',
    userId: 'user-1',
    companyId: 'company-1',
    rewardId: 'reward-5',
    status: RedemptionStatus.REJECTED,
    pointsSpent: 750,
    userNotes: 'Gostaria de usar no próximo mês',
    reviewedById: 'manager-1',
    reviewedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    reviewNotes:
      'Infelizmente os vouchers deste restaurante expiraram. Por favor, solicite outro prêmio.',
    deliveredById: undefined,
    deliveredAt: undefined,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[4],
    user: {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao@empresa.com',
    },
    reviewedBy: {
      id: 'manager-1',
      name: 'Carlos Gestor',
    },
  },
];

// Mock de solicitações pendentes (para gestores)
export const mockPendingRedemptions: RewardRedemption[] = [
  {
    id: 'redemption-5',
    userId: 'user-2',
    companyId: 'company-1',
    rewardId: 'reward-1',
    status: RedemptionStatus.PENDING,
    pointsSpent: 500,
    userNotes: 'Preciso urgente para uma despesa',
    reviewedById: undefined,
    reviewedAt: undefined,
    reviewNotes: undefined,
    deliveredById: undefined,
    deliveredAt: undefined,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[0],
    user: {
      id: 'user-2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
    },
  },
  {
    id: 'redemption-6',
    userId: 'user-3',
    companyId: 'company-1',
    rewardId: 'reward-3',
    status: RedemptionStatus.PENDING,
    pointsSpent: 1000,
    userNotes: 'Gostaria de usar na próxima sexta-feira',
    reviewedById: undefined,
    reviewedAt: undefined,
    reviewNotes: undefined,
    deliveredById: undefined,
    deliveredAt: undefined,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 horas atrás
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[2],
    user: {
      id: 'user-3',
      name: 'Pedro Costa',
      email: 'pedro@empresa.com',
    },
  },
  {
    id: 'redemption-7',
    userId: 'user-4',
    companyId: 'company-1',
    rewardId: 'reward-4',
    status: RedemptionStatus.PENDING,
    pointsSpent: 1000,
    userNotes: undefined,
    reviewedById: undefined,
    reviewedAt: undefined,
    reviewNotes: undefined,
    deliveredById: undefined,
    deliveredAt: undefined,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 horas atrás
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reward: mockRewards[3],
    user: {
      id: 'user-4',
      name: 'Ana Oliveira',
      email: 'ana@empresa.com',
    },
  },
];

// Mock de estatísticas
export const mockRewardStats: RewardStats = {
  pending: 3,
  approved: 8,
  rejected: 2,
  delivered: 15,
  total: 28,
  totalPointsSpent: 12500,
};

// Função helper para simular delay de API
export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Função para obter prêmios disponíveis
export const getMockRewards = async (
  includeInactive = false
): Promise<Reward[]> => {
  await delay(800); // Simula delay de rede
  return includeInactive ? mockRewards : mockRewards.filter(r => r.isActive);
};

// Função para obter minhas solicitações
export const getMockMyRedemptions = async (): Promise<RewardRedemption[]> => {
  await delay(600);
  return mockMyRedemptions;
};

// Função para obter solicitações pendentes
export const getMockPendingRedemptions = async (): Promise<
  RewardRedemption[]
> => {
  await delay(700);
  return mockPendingRedemptions;
};

// Função para obter estatísticas
export const getMockStats = async (): Promise<RewardStats> => {
  await delay(500);
  return mockRewardStats;
};
