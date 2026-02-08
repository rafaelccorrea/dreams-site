import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  MdSettings,
  MdSave,
  MdRefresh,
  MdAttachMoney,
  MdPercent,
  MdMonetizationOn,
  MdTrendingDown,
  MdAccountBalance,
  MdTrendingUp,
  MdArrowBack,
  MdCheckCircle,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { useCommissionSettings } from '../hooks/useCommissionSettings';
import * as S from '../styles/pages/CommissionSettingsPageStyles';

interface CommissionSettings {
  // Minhas taxas de comissão
  myCommissionPercentageSale: number;
  myCommissionPercentageRental: number;
  myCommissionPercentageManagement: number;

  // Custos operacionais
  advertisingCost: number; // Custo com anúncios por transação
  transportCost: number; // Custo com transporte
  officeExpenses: number; // Despesas de escritório (% da comissão)

  // Impostos e taxas
  incomeTaxPercentage: number; // IR
  socialSecurityPercentage: number; // INSS
  otherTaxesPercentage: number; // Outras taxas

  // Benefícios/Bônus
  companyBonusPercentage: number; // Bônus da empresa
  referralBonusEnabled: boolean; // Bônus por indicação
  referralBonusValue: number;

  // Meta pessoal
  monthlyGoal: number; // Meta mensal de comissões
}

export const CommissionSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    settings,
    isLoading,
    isSaving,
    saveSettings: hookSaveSettings,
    resetToDefaults: hookResetToDefaults,
    calculateNetIncome: hookCalculateNetIncome,
  } = useCommissionSettings();

  const [localSettings, setLocalSettings] = React.useState(settings);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const saveSettings = async () => {
    const success = await hookSaveSettings(localSettings);
    if (success) {
      setShowSuccessModal(true);
      // Fechar modal automaticamente após 3 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
  };

  const resetToDefaults = () => {
    hookResetToDefaults();
  };

  const updateSetting = (key: keyof CommissionSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <Layout>
        <S.Container>
          <S.LoadingMessage>Carregando configurações...</S.LoadingMessage>
        </S.Container>
      </Layout>
    );
  }

  // Exemplo: Comissão de R$ 6.000
  const exampleCommission = 6000;
  const calculationResult = hookCalculateNetIncome(exampleCommission);
  const exampleNet = calculationResult.net;

  return (
    <Layout>
      <S.Container>
        <S.BackButton onClick={() => navigate('/commissions')}>
          <MdArrowBack size={20} />
          Voltar para Comissões
        </S.BackButton>

        <S.Header>
          <div>
            <S.Title>Minhas Configurações de Comissão</S.Title>
            <S.Subtitle>
              Configure suas taxas, custos e metas pessoais
            </S.Subtitle>
          </div>
          <S.InfoCard>
            <S.InfoLabel>Exemplo: Comissão de R$ 6.000</S.InfoLabel>
            <S.InfoValue $positive={exampleNet > 0}>
              Líquido: R$ {exampleNet.toFixed(2).replace('.', ',')}
            </S.InfoValue>
          </S.InfoCard>
        </S.Header>

        <S.SettingsGrid>
          {/* Minhas Taxas de Comissão */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardTitle>Minhas Taxas de Comissão</S.CardTitle>
            </S.CardHeader>

            <S.FormGroup>
              <S.Label>Comissão em Vendas (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.myCommissionPercentageSale.toString()}
                onValueChange={values =>
                  updateSetting(
                    'myCommissionPercentageSale',
                    parseFloat(values.value)
                  )
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              <S.HelpText>Percentual que você recebe em vendas</S.HelpText>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Comissão em Aluguéis (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.myCommissionPercentageRental.toString()}
                onValueChange={values =>
                  updateSetting(
                    'myCommissionPercentageRental',
                    parseFloat(values.value)
                  )
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              <S.HelpText>Percentual que você recebe em aluguéis</S.HelpText>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Comissão em Administração (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.myCommissionPercentageManagement.toString()}
                onValueChange={values =>
                  updateSetting(
                    'myCommissionPercentageManagement',
                    parseFloat(values.value)
                  )
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              <S.HelpText>Percentual em gestão de imóveis</S.HelpText>
            </S.FormGroup>
          </S.SettingsCard>

          {/* Custos Operacionais */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardTitle>Meus Custos Operacionais</S.CardTitle>
            </S.CardHeader>

            <S.FormGroup>
              <S.Label>Custo com Publicidade (R$)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.advertisingCost.toString()}
                onValueChange={values =>
                  updateSetting('advertisingCost', parseFloat(values.value))
                }
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                prefix='R$ '
                allowNegative={false}
              />
              <S.HelpText>Custo médio com anúncios por transação</S.HelpText>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Custo com Transporte (R$)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.transportCost.toString()}
                onValueChange={values =>
                  updateSetting('transportCost', parseFloat(values.value))
                }
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                prefix='R$ '
                allowNegative={false}
              />
              <S.HelpText>Combustível, manutenção, etc</S.HelpText>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Despesas de Escritório (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.officeExpenses.toString()}
                onValueChange={values =>
                  updateSetting('officeExpenses', parseFloat(values.value))
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              <S.HelpText>Percentual da comissão para despesas</S.HelpText>
            </S.FormGroup>
          </S.SettingsCard>

          {/* Impostos */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardTitle>Impostos e Taxas</S.CardTitle>
            </S.CardHeader>

            <S.FormGroup>
              <S.Label>Imposto de Renda (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.incomeTaxPercentage.toString()}
                onValueChange={values =>
                  updateSetting('incomeTaxPercentage', parseFloat(values.value))
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>INSS (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.socialSecurityPercentage.toString()}
                onValueChange={values =>
                  updateSetting(
                    'socialSecurityPercentage',
                    parseFloat(values.value)
                  )
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Outras Taxas (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.otherTaxesPercentage.toString()}
                onValueChange={values =>
                  updateSetting(
                    'otherTaxesPercentage',
                    parseFloat(values.value)
                  )
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              <S.HelpText>ISS, PIS, COFINS, etc</S.HelpText>
            </S.FormGroup>
          </S.SettingsCard>

          {/* Benefícios e Bônus */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardTitle>Benefícios e Bônus</S.CardTitle>
            </S.CardHeader>

            <S.FormGroup>
              <S.Label>Bônus da Empresa (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.companyBonusPercentage.toString()}
                onValueChange={values =>
                  updateSetting(
                    'companyBonusPercentage',
                    parseFloat(values.value)
                  )
                }
                decimalSeparator=','
                decimalScale={2}
                suffix=' %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              <S.HelpText>Bônus adicional sobre a comissão</S.HelpText>
            </S.FormGroup>

            <S.CheckboxGroup>
              <S.CheckboxItem>
                <S.Checkbox
                  type='checkbox'
                  checked={localSettings.referralBonusEnabled}
                  onChange={e =>
                    updateSetting('referralBonusEnabled', e.target.checked)
                  }
                />
                <S.CheckboxLabel>Recebo bônus por indicação</S.CheckboxLabel>
              </S.CheckboxItem>
            </S.CheckboxGroup>

            {localSettings.referralBonusEnabled && (
              <S.FormGroup>
                <S.Label>Valor do Bônus por Indicação (R$)</S.Label>
                <NumericFormat
                  customInput={S.Input}
                  value={localSettings.referralBonusValue.toString()}
                  onValueChange={values =>
                    updateSetting(
                      'referralBonusValue',
                      parseFloat(values.value)
                    )
                  }
                  thousandSeparator='.'
                  decimalSeparator=','
                  decimalScale={2}
                  prefix='R$ '
                  allowNegative={false}
                />
              </S.FormGroup>
            )}
          </S.SettingsCard>

          {/* Meta Pessoal */}
          <S.SettingsCard>
            <S.CardHeader>
              <S.CardTitle>Minha Meta Pessoal</S.CardTitle>
            </S.CardHeader>

            <S.FormGroup>
              <S.Label>Meta Mensal de Comissões (R$)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={localSettings.monthlyGoal.toString()}
                onValueChange={values =>
                  updateSetting('monthlyGoal', parseFloat(values.value))
                }
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                prefix='R$ '
                allowNegative={false}
              />
              <S.HelpText>Sua meta pessoal de ganhos mensais</S.HelpText>
            </S.FormGroup>
          </S.SettingsCard>
        </S.SettingsGrid>

        <S.ActionsContainer>
          <S.ActionButton onClick={resetToDefaults} variant='secondary'>
            <MdRefresh size={20} />
            Restaurar Padrões
          </S.ActionButton>

          <S.ActionButton onClick={saveSettings} disabled={isSaving}>
            <MdSave size={20} />
            {isSaving ? 'Salvando...' : 'Salvar Minhas Configurações'}
          </S.ActionButton>
        </S.ActionsContainer>
      </S.Container>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <S.SuccessModalOverlay>
          <S.SuccessModalContent>
            <S.SuccessIcon>
              <MdCheckCircle size={48} />
            </S.SuccessIcon>
            <S.SuccessTitle>Configurações Salvas!</S.SuccessTitle>
            <S.SuccessMessage>
              Suas configurações de comissão foram salvas com sucesso.
            </S.SuccessMessage>
            <S.SuccessTimer>
              Este modal fechará automaticamente em 3 segundos...
            </S.SuccessTimer>
          </S.SuccessModalContent>
        </S.SuccessModalOverlay>
      )}
    </Layout>
  );
};

export default CommissionSettingsPage;
