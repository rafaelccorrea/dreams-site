import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useCommissionConfig } from '../../hooks/useCommissionConfig';
import { formatCurrencyFull } from '../../utils/formatNumbers';
import type { CreateCommissionConfigDTO } from '../../types/commission';

const FormContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const FormSubtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 32px;
`;

const AlertWarning = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  color: #92400e;
`;

const AlertInfo = styled.div`
  background: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  color: #1e40af;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const RequiredIndicator = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const FormInput = styled.input<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid
    ${props => (props.$error ? '#EF4444' : props.theme.colors.border)};
  border-radius: 8px;
  font-size: 16px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
`;

const Hint = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 6px;
  margin-bottom: 0;
  line-height: 1.4;

  strong {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: #3B82F6;
    color: white;
    
    &:hover {
      background: #2563EB;
    }
    
    &:disabled {
      background: #9CA3AF;
      cursor: not-allowed;
    }
  `
      : `
    background: ${props.theme.colors.surface};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    
    &:hover {
      background: ${props.theme.colors.background};
    }
  `}
`;

const ExampleBox = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
  }
`;

const ExampleTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '⚡';
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const ExampleItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExampleLabel = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  font-size: 15px;
`;

const ExampleValue = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;

  strong {
    color: #ffd700;
    font-size: 15px;
  }
`;

const ExampleDescription = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const ExampleFooter = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
  font-size: 13px;
  line-height: 1.6;
  text-align: center;

  strong {
    color: #ffd700;
    font-weight: 700;
  }
`;

interface FormData {
  saleCommissionPercentage: number;
  rentalCommissionPercentage: number;
  companyProfitPercentage: number;
  companyRentalProfitPercentage: number;
}

export const CommissionConfigForm: React.FC = () => {
  const {
    config,
    loading,
    hasConfig,
    createConfig,
    updateConfig,
    calculateExample,
  } = useCommissionConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      saleCommissionPercentage: config?.saleCommissionPercentage || 0,
      rentalCommissionPercentage: config?.rentalCommissionPercentage || 0,
      companyProfitPercentage: config?.companyProfitPercentage || 0,
      companyRentalProfitPercentage: config?.companyRentalProfitPercentage || 0,
    },
  });

  const watchedValues = watch();

  // Reset form when config changes
  React.useEffect(() => {
    if (config) {
      reset({
        saleCommissionPercentage: config.saleCommissionPercentage,
        rentalCommissionPercentage: config.rentalCommissionPercentage,
        companyProfitPercentage: config.companyProfitPercentage,
        companyRentalProfitPercentage: config.companyRentalProfitPercentage,
      });
    }
  }, [config, reset]);

  // Calcular exemplos em tempo real com base nos valores do formulário
  const calculateLiveExample = (baseValue: number, type: 'sale' | 'rental') => {
    const percentage =
      type === 'sale'
        ? Number(watchedValues.saleCommissionPercentage || 0)
        : Number(watchedValues.rentalCommissionPercentage || 0);

    const profitPercentage =
      type === 'sale'
        ? Number(watchedValues.companyProfitPercentage || 0)
        : Number(watchedValues.companyRentalProfitPercentage || 0);

    return {
      commission: (baseValue * percentage) / 100,
      profit: (baseValue * profitPercentage) / 100,
    };
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (hasConfig) {
        await updateConfig(data);
        alert('Configuração atualizada com sucesso!');
      } else {
        await createConfig(data);
        alert('Configuração criada com sucesso!');
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar configuração');
    }
  };

  if (loading) {
    return (
      <FormContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Carregando configuração...
        </div>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>
        {hasConfig
          ? 'Configuração de Comissões'
          : 'Criar Configuração de Comissões'}
      </FormTitle>
      <FormSubtitle>
        {hasConfig
          ? 'Ajuste os percentuais de comissão para vendas e aluguéis'
          : 'Configure os percentuais de comissão para sua empresa'}
      </FormSubtitle>

      <AlertWarning
        style={{
          marginBottom: '16px',
          background: '#FEF3C7',
          borderColor: '#F59E0B',
        }}
      >
        <strong>🔒 ÁREA ADMINISTRATIVA:</strong> Apenas administradores podem
        visualizar e modificar estas configurações.
        <br />
        Alterações aqui afetam <strong>TODA A EMPRESA</strong> e todos os
        corretores.
      </AlertWarning>

      <AlertInfo style={{ marginBottom: '16px' }}>
        <strong>💡 IMPORTANTE:</strong> Estes percentuais são aplicados
        automaticamente sempre que um corretor{' '}
        <strong>registra uma venda ou aluguel</strong>.
        <br />• <strong>Venda fechada:</strong> O sistema calcula a comissão do
        corretor e o lucro da empresa com base nas porcentagens configuradas
        aqui.
        <br />• <strong>Aluguel fechado:</strong> O mesmo cálculo automático é
        aplicado usando os valores de locação.
        <br />• As comissões aparecem no relatório financeiro e no painel de
        cada corretor.
      </AlertInfo>

      {!hasConfig && (
        <AlertWarning>
          <strong>⚠️ ATENÇÃO CRÍTICA:</strong> Nenhuma configuração de comissão
          encontrada!
          <br />
          <br />
          <strong>Impacto direto:</strong>
          <br />
          • Todas as vendas e aluguéis registrados terão comissão ZERO
          <br />
          • Os corretores não receberão comissões automáticas
          <br />
          • O lucro da empresa será ZERO nas transações
          <br />
          <br />
          <strong>
            Configure agora para evitar perda de dados financeiros!
          </strong>
        </AlertWarning>
      )}

      {hasConfig && (
        <AlertInfo>
          <strong>✅ CONFIGURAÇÃO ATIVA:</strong> Os percentuais abaixo estão
          sendo aplicados em todas as vendas e aluguéis.
          <br />
          Qualquer alteração afetará <strong>
            apenas as novas transações
          </strong>{' '}
          registradas após salvar.
        </AlertInfo>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGrid>
          <FormGroup>
            <FormLabel>
              Comissão de Vendas (%)
              <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormInput
              type='number'
              step='0.01'
              min='0'
              max='100'
              placeholder='Ex: 5.00'
              $error={!!errors.saleCommissionPercentage}
              {...register('saleCommissionPercentage', {
                required: 'Campo obrigatório',
                min: { value: 0, message: 'Mínimo 0%' },
                max: { value: 100, message: 'Máximo 100%' },
              })}
            />
            {errors.saleCommissionPercentage && (
              <ErrorMessage>
                {errors.saleCommissionPercentage.message}
              </ErrorMessage>
            )}
            <Hint>
              💰 Aplicado automaticamente quando um corretor{' '}
              <strong>fecha uma venda</strong>
            </Hint>
          </FormGroup>

          <FormGroup>
            <FormLabel>
              Comissão de Aluguéis (%)
              <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormInput
              type='number'
              step='0.01'
              min='0'
              max='100'
              placeholder='Ex: 10.00'
              $error={!!errors.rentalCommissionPercentage}
              {...register('rentalCommissionPercentage', {
                required: 'Campo obrigatório',
                min: { value: 0, message: 'Mínimo 0%' },
                max: { value: 100, message: 'Máximo 100%' },
              })}
            />
            {errors.rentalCommissionPercentage && (
              <ErrorMessage>
                {errors.rentalCommissionPercentage.message}
              </ErrorMessage>
            )}
            <Hint>
              🏠 Aplicado automaticamente quando um corretor{' '}
              <strong>fecha um aluguel</strong>
            </Hint>
          </FormGroup>

          <FormGroup>
            <FormLabel>
              Lucro da Empresa - Vendas (%)
              <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormInput
              type='number'
              step='0.01'
              min='0'
              max='100'
              placeholder='Ex: 3.00'
              $error={!!errors.companyProfitPercentage}
              {...register('companyProfitPercentage', {
                required: 'Campo obrigatório',
                min: { value: 0, message: 'Mínimo 0%' },
                max: { value: 100, message: 'Máximo 100%' },
              })}
            />
            {errors.companyProfitPercentage && (
              <ErrorMessage>
                {errors.companyProfitPercentage.message}
              </ErrorMessage>
            )}
            <Hint>
              📊 Percentual que a empresa ganha em cada{' '}
              <strong>venda fechada</strong>
            </Hint>
          </FormGroup>

          <FormGroup>
            <FormLabel>
              Lucro da Empresa - Aluguéis (%)
              <RequiredIndicator>*</RequiredIndicator>
            </FormLabel>
            <FormInput
              type='number'
              step='0.01'
              min='0'
              max='100'
              placeholder='Ex: 8.00'
              $error={!!errors.companyRentalProfitPercentage}
              {...register('companyRentalProfitPercentage', {
                required: 'Campo obrigatório',
                min: { value: 0, message: 'Mínimo 0%' },
                max: { value: 100, message: 'Máximo 100%' },
              })}
            />
            {errors.companyRentalProfitPercentage && (
              <ErrorMessage>
                {errors.companyRentalProfitPercentage.message}
              </ErrorMessage>
            )}
            <Hint>
              📊 Percentual que a empresa ganha em cada{' '}
              <strong>aluguel fechado</strong>
            </Hint>
          </FormGroup>
        </FormGrid>

        <FormActions>
          <Button type='button' $variant='secondary'>
            Cancelar
          </Button>
          <Button type='submit' $variant='primary'>
            {hasConfig ? 'Atualizar Configuração' : 'Criar Configuração'}
          </Button>
        </FormActions>
      </form>

      <ExampleBox>
        <ExampleTitle>📊 Exemplo de Cálculo em Tempo Real</ExampleTitle>

        <ExampleDescription>
          Veja como os percentuais acima afetam diretamente as comissões quando
          um corretor fecha uma transação:
        </ExampleDescription>

        <ExampleItem>
          <ExampleLabel>
            💰 Quando um corretor fecha uma VENDA de R$ 100.000,00:
          </ExampleLabel>
          <ExampleValue>
            • Comissão do corretor (
            {watchedValues.saleCommissionPercentage || 0}%):{' '}
            {formatCurrencyFull(
              calculateLiveExample(100000, 'sale').commission
            )}
            <br />• Lucro da empresa (
            {watchedValues.companyProfitPercentage || 0}%):{' '}
            {formatCurrencyFull(calculateLiveExample(100000, 'sale').profit)}
            <br />
            <strong>
              • Total do negócio:{' '}
              {formatCurrencyFull(
                calculateLiveExample(100000, 'sale').commission +
                  calculateLiveExample(100000, 'sale').profit
              )}
            </strong>
          </ExampleValue>
        </ExampleItem>

        <ExampleItem>
          <ExampleLabel>
            🏠 Quando um corretor fecha um ALUGUEL de R$ 2.000,00:
          </ExampleLabel>
          <ExampleValue>
            • Comissão do corretor (
            {watchedValues.rentalCommissionPercentage || 0}%):{' '}
            {formatCurrencyFull(
              calculateLiveExample(2000, 'rental').commission
            )}
            <br />• Lucro da empresa (
            {watchedValues.companyRentalProfitPercentage || 0}%):{' '}
            {formatCurrencyFull(calculateLiveExample(2000, 'rental').profit)}
            <br />
            <strong>
              • Total do negócio:{' '}
              {formatCurrencyFull(
                calculateLiveExample(2000, 'rental').commission +
                  calculateLiveExample(2000, 'rental').profit
              )}
            </strong>
          </ExampleValue>
        </ExampleItem>

        <ExampleFooter>
          ⚡ Os valores acima atualizam em tempo real conforme você digita.
          Estes cálculos são aplicados <strong>automaticamente</strong> em cada
          venda ou aluguel registrado no sistema.
        </ExampleFooter>
      </ExampleBox>
    </FormContainer>
  );
};
