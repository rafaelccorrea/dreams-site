import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { commissionConfigApi } from '../services/commissionApi';

export interface CommissionSettings {
  // Minhas taxas de comissão
  myCommissionPercentageSale: number;
  myCommissionPercentageRental: number;
  myCommissionPercentageManagement: number;

  // Custos operacionais
  advertisingCost: number;
  transportCost: number;
  officeExpenses: number;

  // Impostos e taxas
  incomeTaxPercentage: number;
  socialSecurityPercentage: number;
  otherTaxesPercentage: number;

  // Benefícios/Bônus
  companyBonusPercentage: number;
  referralBonusEnabled: boolean;
  referralBonusValue: number;

  // Meta pessoal
  monthlyGoal: number;
}

const DEFAULT_SETTINGS: CommissionSettings = {
  myCommissionPercentageSale: 6,
  myCommissionPercentageRental: 8,
  myCommissionPercentageManagement: 10,
  advertisingCost: 500,
  transportCost: 300,
  officeExpenses: 5,
  incomeTaxPercentage: 15,
  socialSecurityPercentage: 11,
  otherTaxesPercentage: 0,
  companyBonusPercentage: 0,
  referralBonusEnabled: false,
  referralBonusValue: 500,
  monthlyGoal: 10000,
};

export const useCommissionSettings = () => {
  const [settings, setSettings] =
    useState<CommissionSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar configurações da API primeiro, depois do localStorage como fallback
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      // CORREÇÃO: Buscar configurações da API primeiro
      console.log('🏢 Buscando configurações de comissão da API...');
      try {
        const apiSettings = await commissionConfigApi.getConfig();
        console.log('✅ Configurações carregadas da API:', apiSettings);

        // Mapear dados da API para o formato do hook
        const mappedSettings: CommissionSettings = {
          myCommissionPercentageSale:
            apiSettings.saleCommissionPercentage ||
            DEFAULT_SETTINGS.myCommissionPercentageSale,
          myCommissionPercentageRental:
            apiSettings.rentalCommissionPercentage ||
            DEFAULT_SETTINGS.myCommissionPercentageRental,
          myCommissionPercentageManagement:
            DEFAULT_SETTINGS.myCommissionPercentageManagement, // Não disponível na API
          advertisingCost: DEFAULT_SETTINGS.advertisingCost, // Não disponível na API
          transportCost: DEFAULT_SETTINGS.transportCost, // Não disponível na API
          officeExpenses: DEFAULT_SETTINGS.officeExpenses, // Não disponível na API
          incomeTaxPercentage: DEFAULT_SETTINGS.incomeTaxPercentage, // Não disponível na API
          socialSecurityPercentage: DEFAULT_SETTINGS.socialSecurityPercentage, // Não disponível na API
          otherTaxesPercentage: DEFAULT_SETTINGS.otherTaxesPercentage, // Não disponível na API
          companyBonusPercentage: DEFAULT_SETTINGS.companyBonusPercentage, // Não disponível na API
          referralBonusEnabled: DEFAULT_SETTINGS.referralBonusEnabled, // Não disponível na API
          referralBonusValue: DEFAULT_SETTINGS.referralBonusValue, // Não disponível na API
          monthlyGoal: DEFAULT_SETTINGS.monthlyGoal, // Não disponível na API
        };

        setSettings(mappedSettings);
        // Salvar no localStorage para cache
        localStorage.setItem(
          'commission_settings',
          JSON.stringify(mappedSettings)
        );
        return;
      } catch (apiError) {
        console.warn(
          '⚠️ Erro ao buscar configurações da API, usando localStorage:',
          apiError
        );
      }

      // Fallback: carregar do localStorage
      const savedSettings = localStorage.getItem('commission_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        console.log('✅ Configurações carregadas do localStorage:', parsed);
      } else {
        console.log('ℹ️ Usando configurações padrão');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = useCallback(async (newSettings: CommissionSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem('commission_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      // console.log('💾 Configurações salvas:', newSettings);
      // toast.success('Configurações salvas com sucesso!'); // Removido - agora usa modal
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Resetar para padrões
  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('commission_settings');
    toast.info('Configurações resetadas para valores padrão');
  }, []);

  // Calcular lucro líquido
  const calculateNetIncome = useCallback(
    (grossCommission: number) => {
      const totalTaxPercentage =
        settings.incomeTaxPercentage +
        settings.socialSecurityPercentage +
        settings.otherTaxesPercentage;

      const taxes = (grossCommission * totalTaxPercentage) / 100;
      const expenses =
        (grossCommission * settings.officeExpenses) / 100 +
        settings.advertisingCost +
        settings.transportCost;
      const bonus = (grossCommission * settings.companyBonusPercentage) / 100;

      return {
        gross: grossCommission,
        taxes,
        expenses,
        bonus,
        net: grossCommission - taxes - expenses + bonus,
      };
    },
    [settings]
  );

  // Obter taxa de comissão por tipo
  const getCommissionRate = useCallback(
    (type: 'sale' | 'rental' | 'management') => {
      switch (type) {
        case 'sale':
          return settings.myCommissionPercentageSale;
        case 'rental':
          return settings.myCommissionPercentageRental;
        case 'management':
          return settings.myCommissionPercentageManagement;
        default:
          return settings.myCommissionPercentageSale;
      }
    },
    [settings]
  );

  // Obter taxa de imposto total
  const getTotalTaxRate = useCallback(() => {
    return (
      settings.incomeTaxPercentage +
      settings.socialSecurityPercentage +
      settings.otherTaxesPercentage
    );
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    loadSettings,
    saveSettings,
    resetToDefaults,
    calculateNetIncome,
    getCommissionRate,
    getTotalTaxRate,
  };
};
