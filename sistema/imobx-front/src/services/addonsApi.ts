import { api } from './api';
import type {
  AddonPricing,
  SubscriptionAddon,
  PurchaseAddonDto,
  RecalculatePriceResponse,
  AddonLimits,
} from '../types/addons';

/**
 * Serviço de API para compra de extras (add-ons) para assinaturas
 *
 * Os extras permitem que usuários comprem:
 * - Usuários adicionais (+10, +20, etc.)
 * - Propriedades adicionais (+50, +100, etc.)
 * - Armazenamento adicional (+5 GB, +10 GB, etc.)
 */
class AddonsApiService {
  /**
   * Lista os tipos de add-ons disponíveis com seus preços unitários
   *
   * @param subscriptionId - ID da assinatura
   * @returns Lista de add-ons disponíveis com preços
   */
  async getAvailableAddons(subscriptionId: string): Promise<AddonPricing[]> {
    try {
      const response = await api.get<AddonPricing[]>(
        `/subscriptions/${subscriptionId}/addons/available`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching available addons:', error);
      throw error;
    }
  }

  /**
   * Lista todos os add-ons (ativos e cancelados) de uma assinatura
   *
   * @param subscriptionId - ID da assinatura
   * @returns Lista de add-ons da assinatura
   */
  async getAddons(subscriptionId: string): Promise<SubscriptionAddon[]> {
    try {
      const response = await api.get<SubscriptionAddon[]>(
        `/subscriptions/${subscriptionId}/addons`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching addons:', error);
      throw error;
    }
  }

  /**
   * Lista apenas os add-ons ativos de uma assinatura
   *
   * @param subscriptionId - ID da assinatura
   * @returns Lista de add-ons ativos
   */
  async getActiveAddons(subscriptionId: string): Promise<SubscriptionAddon[]> {
    try {
      const response = await api.get<SubscriptionAddon[]>(
        `/subscriptions/${subscriptionId}/addons/active`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching active addons:', error);
      throw error;
    }
  }

  /**
   * Compra um add-on e atualiza o valor da assinatura no Asaas
   *
   * @param subscriptionId - ID da assinatura
   * @param purchaseDto - Dados da compra do add-on
   * @returns Add-on criado
   */
  async purchaseAddon(
    subscriptionId: string,
    purchaseDto: PurchaseAddonDto
  ): Promise<SubscriptionAddon> {
    try {
      const response = await api.post<SubscriptionAddon>(
        `/subscriptions/${subscriptionId}/addons/purchase`,
        purchaseDto
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing addon:', error);
      throw error;
    }
  }

  /**
   * Cancela um add-on ativo, removendo-o do valor da assinatura
   *
   * @param subscriptionId - ID da assinatura
   * @param addonId - ID do add-on a ser cancelado
   * @returns Add-on cancelado
   */
  async cancelAddon(
    subscriptionId: string,
    addonId: string
  ): Promise<SubscriptionAddon> {
    try {
      const response = await api.delete<SubscriptionAddon>(
        `/subscriptions/${subscriptionId}/addons/${addonId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling addon:', error);
      throw error;
    }
  }

  /**
   * Recalcula o preço total da assinatura baseado no plano + add-ons ativos
   * e atualiza no Asaas
   *
   * @param subscriptionId - ID da assinatura
   * @returns Resposta com novo preço
   */
  async recalculatePrice(
    subscriptionId: string
  ): Promise<RecalculatePriceResponse> {
    try {
      const response = await api.post<RecalculatePriceResponse>(
        `/subscriptions/${subscriptionId}/addons/recalculate`
      );
      return response.data;
    } catch (error) {
      console.error('Error recalculating price:', error);
      throw error;
    }
  }

  /**
   * Obtém os limites totais (plano base + add-ons ativos)
   *
   * @param subscriptionId - ID da assinatura
   * @returns Limites totais para usuários, propriedades e armazenamento
   */
  async getLimits(subscriptionId: string): Promise<AddonLimits> {
    try {
      const response = await api.get<AddonLimits>(
        `/subscriptions/${subscriptionId}/addons/limits`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching addon limits:', error);
      throw error;
    }
  }
}

export const addonsApi = new AddonsApiService();
