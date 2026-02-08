/**
 * Tipos para APIs de Módulos por Plano
 */

export interface PlanModule {
  code: string;
  name: string;
}

export interface PlanModulesData {
  planName: string;
  planType: 'basic' | 'pro' | 'custom';
  price: number;
  modules: PlanModule[];
}

export interface PlanModulesResponse {
  basic: PlanModulesData;
  pro: PlanModulesData;
}

export interface PlanType {
  id: string;
  name: string;
  type: 'basic' | 'pro' | 'custom';
  price: number;
  maxCompanies: number;
  description: string;
  modules: string[];
  features: {
    maxUsers?: number;
    maxProperties?: number;
    storageGB?: number;
    maxTeamMembers?: number;
    [key: string]: number | undefined;
  };
  isActive: boolean;
  isDefault?: boolean;
  displayOrder: number;
  billingType?: 'monthly' | 'yearly';
  trialDays?: number;
  planChangeLockedUntil?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AllModulesResponse {
  [moduleCode: string]: string; // code -> name mapping
}

export interface ModuleAccessResponse {
  hasAccess: boolean;
}
