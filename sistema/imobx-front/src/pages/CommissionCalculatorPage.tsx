import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { useCommissions } from '../hooks/useCommissions';
import type { CommissionCalculation } from '../hooks/useCommissions';
import { CommissionShimmer } from '../components/shimmer/CommissionShimmer';
import {
  MdCalculate,
  MdAdd,
  MdAttachMoney,
  MdTrendingUp,
  MdCheckCircle,
  MdPending,
  MdFilterList,
  MdClear,
  MdSettings,
  MdDelete,
  MdSearch,
} from 'react-icons/md';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { PermissionButton } from '../components/common/PermissionButton';
import { FilterDrawer } from '../components/common/FilterDrawer';
import DataScopeFilter from '../components/common/DataScopeFilter';
import { useCommissionSettings } from '../hooks/useCommissionSettings';
import styled from 'styled-components';
import * as S from '../styles/pages/CommissionCalculatorPageStyles';
import type { CommissionType, CommissionStatus } from '../types/commission';

export const CommissionCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    commissions,
    statistics,
    isLoading,
    isCalculating,
    isCreating,
    isDeleting,
    loadCommissions,
    loadStatistics,
    calculateCommission,
    createCommission,
    deleteCommission,
  } = useCommissions();

  const { settings, getTotalTaxRate, getCommissionRate } =
    useCommissionSettings();

  const [calculatorData, setCalculatorData] = useState({
    baseValue: '100000',
    percentage: '6',
    taxPercentage: '15',
  });

  // Estado para controlar se está usando configurações padrão
  const [isUsingDefaultSettings, setIsUsingDefaultSettings] = useState(true);

  // Atualizar valores padrão quando as configurações mudarem
  useEffect(() => {
    const defaultPercentage = getCommissionRate('sale').toString();
    const defaultTaxPercentage = getTotalTaxRate().toString();

    setCalculatorData(prev => ({
      ...prev,
      percentage: defaultPercentage,
      taxPercentage: defaultTaxPercentage,
    }));

    // Marcar como usando configurações padrão quando carregar da API
    setIsUsingDefaultSettings(true);
  }, [settings, getCommissionRate, getTotalTaxRate]);

  const [calculation, setCalculation] = useState<CommissionCalculation | null>(
    null
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveData, setSaveData] = useState({
    title: '',
    type: 'SALE' as CommissionType,
    notes: '',
  });

  // Estados para exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commissionToDelete, setCommissionToDelete] = useState<string | null>(
    null
  );

  // Estados para filtros
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filters, setFilters] = useState<{
    status?: CommissionStatus;
    type?: CommissionType;
    propertyId?: string;
    clientId?: string;
    clientName: string;
    search: string;
    minValue?: number;
    maxValue?: number;
    startDate?: string;
    endDate?: string;
    paid?: boolean;
    onlyMyData: boolean;
  }>({
    status: undefined,
    type: undefined,
    propertyId: undefined,
    clientId: undefined,
    clientName: '',
    search: '',
    minValue: undefined,
    maxValue: undefined,
    startDate: undefined,
    endDate: undefined,
    paid: undefined,
    onlyMyData: false,
  });
  // Filtros locais para o drawer
  const [localFilters, setLocalFilters] = useState<{
    status?: CommissionStatus;
    type?: CommissionType;
    propertyId?: string;
    clientId?: string;
    clientName: string;
    search: string;
    minValue?: number;
    maxValue?: number;
    startDate?: string;
    endDate?: string;
    paid?: boolean;
    onlyMyData: boolean;
  }>({
    status: undefined,
    type: undefined,
    propertyId: undefined,
    clientId: undefined,
    clientName: '',
    search: '',
    minValue: undefined,
    maxValue: undefined,
    startDate: undefined,
    endDate: undefined,
    paid: undefined,
    onlyMyData: false,
  });

  // Inicializar filtros locais quando o drawer abrir
  useEffect(() => {
    if (showFiltersModal) {
      setLocalFilters(filters);
    }
  }, [showFiltersModal]);

  useEffect(() => {
    loadCommissions();
    loadStatistics();
  }, [loadCommissions, loadStatistics]);

  // Filtrar comissões baseado nos filtros aplicados
  const filteredCommissions = useMemo(() => {
    if (!commissions || !Array.isArray(commissions)) {
      return [];
    }

    return commissions.filter(commission => {
      if (filters.status && commission.status !== filters.status) return false;
      if (filters.type && commission.type !== filters.type) return false;

      if (filters.startDate) {
        const commissionDate = new Date(commission.createdAt);
        const startDate = new Date(filters.startDate);
        if (commissionDate < startDate) return false;
      }

      if (filters.endDate) {
        const commissionDate = new Date(commission.createdAt);
        const endDate = new Date(filters.endDate);
        if (commissionDate > endDate) return false;
      }

      if (filters.minValue && commission.netValue < filters.minValue)
        return false;
      if (filters.maxValue && commission.netValue > filters.maxValue)
        return false;

      return true;
    });
  }, [commissions, filters]);

  const clearFilters = () => {
    setFilters({
      status: undefined,
      type: undefined,
      propertyId: undefined,
      clientId: undefined,
      clientName: '',
      search: '',
      minValue: undefined,
      maxValue: undefined,
      startDate: undefined,
      endDate: undefined,
      paid: undefined,
      onlyMyData: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== '' && value !== false
  );

  // Handlers para detectar mudanças nos campos
  const handlePercentageChange = (values: any) => {
    setCalculatorData({ ...calculatorData, percentage: values.value });
    // Se alterou a porcentagem, não está mais usando configurações padrão
    setIsUsingDefaultSettings(false);
  };

  const handleTaxPercentageChange = (values: any) => {
    setCalculatorData({ ...calculatorData, taxPercentage: values.value });
    // Se alterou o imposto, não está mais usando configurações padrão
    setIsUsingDefaultSettings(false);
  };

  const handleCalculate = async () => {
    if (!calculatorData.baseValue || !calculatorData.percentage) {
      return;
    }

    const result = await calculateCommission({
      baseValue: parseFloat(calculatorData.baseValue),
      percentage: parseFloat(calculatorData.percentage),
      taxPercentage: calculatorData.taxPercentage
        ? parseFloat(calculatorData.taxPercentage)
        : 0,
    });

    if (result) {
      // console.log('✅ Resultado do cálculo:', result);
      // Calcular detalhes usando as configurações do corretor
      const grossCommission = result.commissionValue;
      const detailedResult = {
        ...result,
        breakdown: {
          // Receitas
          grossCommission,
          companyBonus:
            (grossCommission * settings.companyBonusPercentage) / 100,
          referralBonus: settings.referralBonusEnabled
            ? settings.referralBonusValue
            : 0,

          // Impostos
          incomeTax: (grossCommission * settings.incomeTaxPercentage) / 100,
          socialSecurity:
            (grossCommission * settings.socialSecurityPercentage) / 100,
          otherTaxes: (grossCommission * settings.otherTaxesPercentage) / 100,

          // Custos
          advertisingCost: settings.advertisingCost,
          transportCost: settings.transportCost,
          officeExpenses: (grossCommission * settings.officeExpenses) / 100,
        },
      };

      setCalculation(detailedResult);
    } else {
      // console.log('❌ Nenhum resultado retornado');
    }
  };

  const handleSave = async () => {
    if (!calculation || !saveData.title) return;

    try {
      await createCommission({
        title: saveData.title,
        type: saveData.type,
        baseValue: calculation.baseValue,
        percentage: calculation.percentage,
        userId: '', // TODO: pegar do contexto de autenticação
        propertyId: '', // TODO: pegar do contexto
        expectedPaymentDate: new Date().toISOString(),
        notes: saveData.notes,
      });

      setShowSaveModal(false);
      setCalculation(null);
      setCalculatorData({
        baseValue: '100000',
        percentage: getCommissionRate('sale').toString(),
        taxPercentage: getTotalTaxRate().toString(),
      });
      setSaveData({ title: '', type: 'SALE', notes: '' });
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleDeleteClick = (commissionId: string) => {
    setCommissionToDelete(commissionId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!commissionToDelete) return;

    try {
      await deleteCommission(commissionToDelete);
      setShowDeleteModal(false);
      setCommissionToDelete(null);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommissionToDelete(null);
  };

  const formatCurrency = (value: number) => {
    // Verificar se o valor é válido (não é NaN, null ou undefined)
    if (value === null || value === undefined || isNaN(value)) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <Layout>
        <CommissionShimmer />
      </Layout>
    );
  }

  return (
    <Layout>
      <S.Container>
        <S.Header>
          <div>
            <S.Title>Calculadora de Comissões</S.Title>
            <S.Subtitle>
              Calcule e gerencie suas comissões de forma simples
            </S.Subtitle>
          </div>
          <S.SettingsButton onClick={() => navigate('/commissions/settings')}>
            <MdSettings size={20} />
            Minhas Configurações
          </S.SettingsButton>
        </S.Header>

        {statistics && (
          <S.StatsGrid>
            <S.StatCard>
              <S.StatIcon>
                <MdAttachMoney size={24} />
              </S.StatIcon>
              <S.StatLabel>Total a Receber</S.StatLabel>
              <S.StatValue>
                {formatCurrency(statistics.totalPending)}
              </S.StatValue>
            </S.StatCard>
            <S.StatCard>
              <S.StatIcon style={{ color: '#10B981' }}>
                <MdCheckCircle size={24} />
              </S.StatIcon>
              <S.StatLabel>Total Recebido</S.StatLabel>
              <S.StatValue>{formatCurrency(statistics.totalPaid)}</S.StatValue>
            </S.StatCard>
            <S.StatCard>
              <S.StatIcon style={{ color: '#F59E0B' }}>
                <MdPending size={24} />
              </S.StatIcon>
              <S.StatLabel>Pendentes</S.StatLabel>
              <S.StatValue>{statistics.pending}</S.StatValue>
            </S.StatCard>
            <S.StatCard>
              <S.StatIcon style={{ color: '#3B82F6' }}>
                <MdTrendingUp size={24} />
              </S.StatIcon>
              <S.StatLabel>Este Mês</S.StatLabel>
              <S.StatValue>
                {formatCurrency(statistics.thisMonthValue)}
              </S.StatValue>
            </S.StatCard>
          </S.StatsGrid>
        )}

        <S.CalculatorCard>
          <S.CalculatorTitle>Calculadora Rápida</S.CalculatorTitle>

          <S.FormGrid>
            <S.FormGroup>
              <S.Label>Valor da Transação (R$)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={calculatorData.baseValue}
                onValueChange={values => {
                  setCalculatorData({
                    ...calculatorData,
                    baseValue: values.value,
                  });
                }}
                thousandSeparator='.'
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                prefix='R$ '
                placeholder='R$ 100.000,00'
                allowNegative={false}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Percentual de Comissão (%)</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={calculatorData.percentage}
                onValueChange={handlePercentageChange}
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                suffix=' %'
                placeholder='6,00 %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
              {isUsingDefaultSettings && (
                <S.InfoMessage>
                  ℹ️ Usando as configurações padrão de porcentagem cadastradas
                  pelo administrador
                </S.InfoMessage>
              )}
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Percentual de Imposto (%) - Opcional</S.Label>
              <NumericFormat
                customInput={S.Input}
                value={calculatorData.taxPercentage}
                onValueChange={handleTaxPercentageChange}
                decimalSeparator=','
                decimalScale={2}
                fixedDecimalScale
                suffix=' %'
                placeholder='15,00 %'
                allowNegative={false}
                isAllowed={values => {
                  const { floatValue } = values;
                  return floatValue === undefined || floatValue <= 100;
                }}
              />
            </S.FormGroup>
          </S.FormGrid>

          <S.ButtonGroup>
            <PermissionButton
              permission='commission:calculate'
              onClick={handleCalculate}
              disabled={isCalculating}
              variant='primary'
            >
              <MdCalculate size={20} />
              {isCalculating ? 'Calculando...' : 'Calcular'}
            </PermissionButton>
          </S.ButtonGroup>

          {calculation && calculation.breakdown && (
            <S.ResultCard>
              <S.ResultTitle>📊 Holerite Detalhado</S.ResultTitle>

              {/* Receitas */}
              <S.PayslipSection>
                <S.PayslipSectionTitle>💰 Receitas</S.PayslipSectionTitle>
                <S.PayslipItem>
                  <S.PayslipLabel>
                    Comissão Bruta ({calculatorData.percentage}%)
                  </S.PayslipLabel>
                  <S.PayslipValue $positive>
                    {formatCurrency(calculation.breakdown.grossCommission)}
                  </S.PayslipValue>
                </S.PayslipItem>
                {calculation.breakdown.companyBonus > 0 && (
                  <S.PayslipItem>
                    <S.PayslipLabel>
                      Bônus da Empresa ({settings.companyBonusPercentage}%)
                    </S.PayslipLabel>
                    <S.PayslipValue $positive>
                      {formatCurrency(calculation.breakdown.companyBonus)}
                    </S.PayslipValue>
                  </S.PayslipItem>
                )}
                {calculation.breakdown.referralBonus > 0 && (
                  <S.PayslipItem>
                    <S.PayslipLabel>Bônus por Indicação</S.PayslipLabel>
                    <S.PayslipValue $positive>
                      {formatCurrency(calculation.breakdown.referralBonus)}
                    </S.PayslipValue>
                  </S.PayslipItem>
                )}
                <S.PayslipSubtotal>
                  <S.PayslipLabel>Subtotal de Receitas</S.PayslipLabel>
                  <S.PayslipValue $positive>
                    {formatCurrency(
                      calculation.breakdown.grossCommission +
                        calculation.breakdown.companyBonus +
                        calculation.breakdown.referralBonus
                    )}
                  </S.PayslipValue>
                </S.PayslipSubtotal>
              </S.PayslipSection>

              {/* Impostos */}
              <S.PayslipSection>
                <S.PayslipSectionTitle>
                  🏛️ Impostos e Taxas
                </S.PayslipSectionTitle>
                <S.PayslipItem>
                  <S.PayslipLabel>
                    Imposto de Renda ({settings.incomeTaxPercentage}%)
                  </S.PayslipLabel>
                  <S.PayslipValue $negative>
                    - {formatCurrency(calculation.breakdown.incomeTax)}
                  </S.PayslipValue>
                </S.PayslipItem>
                <S.PayslipItem>
                  <S.PayslipLabel>
                    INSS ({settings.socialSecurityPercentage}%)
                  </S.PayslipLabel>
                  <S.PayslipValue $negative>
                    - {formatCurrency(calculation.breakdown.socialSecurity)}
                  </S.PayslipValue>
                </S.PayslipItem>
                {calculation.breakdown.otherTaxes > 0 && (
                  <S.PayslipItem>
                    <S.PayslipLabel>
                      Outras Taxas ({settings.otherTaxesPercentage}%)
                    </S.PayslipLabel>
                    <S.PayslipValue $negative>
                      - {formatCurrency(calculation.breakdown.otherTaxes)}
                    </S.PayslipValue>
                  </S.PayslipItem>
                )}
                <S.PayslipSubtotal>
                  <S.PayslipLabel>Total de Impostos</S.PayslipLabel>
                  <S.PayslipValue $negative>
                    -{' '}
                    {formatCurrency(
                      calculation.breakdown.incomeTax +
                        calculation.breakdown.socialSecurity +
                        calculation.breakdown.otherTaxes
                    )}
                  </S.PayslipValue>
                </S.PayslipSubtotal>
              </S.PayslipSection>

              {/* Custos */}
              <S.PayslipSection>
                <S.PayslipSectionTitle>
                  📉 Custos Operacionais
                </S.PayslipSectionTitle>
                <S.PayslipItem>
                  <S.PayslipLabel>Publicidade</S.PayslipLabel>
                  <S.PayslipValue $negative>
                    - {formatCurrency(calculation.breakdown.advertisingCost)}
                  </S.PayslipValue>
                </S.PayslipItem>
                <S.PayslipItem>
                  <S.PayslipLabel>Transporte</S.PayslipLabel>
                  <S.PayslipValue $negative>
                    - {formatCurrency(calculation.breakdown.transportCost)}
                  </S.PayslipValue>
                </S.PayslipItem>
                <S.PayslipItem>
                  <S.PayslipLabel>
                    Despesas de Escritório ({settings.officeExpenses}%)
                  </S.PayslipLabel>
                  <S.PayslipValue $negative>
                    - {formatCurrency(calculation.breakdown.officeExpenses)}
                  </S.PayslipValue>
                </S.PayslipItem>
                <S.PayslipSubtotal>
                  <S.PayslipLabel>Total de Custos</S.PayslipLabel>
                  <S.PayslipValue $negative>
                    -{' '}
                    {formatCurrency(
                      calculation.breakdown.advertisingCost +
                        calculation.breakdown.transportCost +
                        calculation.breakdown.officeExpenses
                    )}
                  </S.PayslipValue>
                </S.PayslipSubtotal>
              </S.PayslipSection>

              {/* Valor Final */}
              <S.PayslipFinal>
                <S.PayslipFinalLabel>
                  💵 Valor Líquido Final
                </S.PayslipFinalLabel>
                <S.PayslipFinalValue>
                  {formatCurrency(
                    calculation.breakdown.grossCommission +
                      calculation.breakdown.companyBonus +
                      calculation.breakdown.referralBonus -
                      calculation.breakdown.incomeTax -
                      calculation.breakdown.socialSecurity -
                      calculation.breakdown.otherTaxes -
                      calculation.breakdown.advertisingCost -
                      calculation.breakdown.transportCost -
                      calculation.breakdown.officeExpenses
                  )}
                </S.PayslipFinalValue>
              </S.PayslipFinal>

              <S.Button onClick={() => setShowSaveModal(true)}>
                <MdAdd size={20} />
                Salvar Comissão
              </S.Button>
            </S.ResultCard>
          )}
        </S.CalculatorCard>

        <S.CommissionsSection>
          <S.SectionHeader>
            <S.SectionTitle>Minhas Comissões</S.SectionTitle>
            <S.FilterToggleButton onClick={() => setShowFiltersModal(true)}>
              <MdFilterList size={20} />
              Filtros
              {Object.values(filters).some(
                value => value !== undefined && value !== '' && value !== false
              ) && (
                <S.FilterBadge>
                  {
                    Object.values(filters).filter(
                      value =>
                        value !== undefined && value !== '' && value !== false
                    ).length
                  }
                </S.FilterBadge>
              )}
            </S.FilterToggleButton>
          </S.SectionHeader>

          {filteredCommissions.length === 0 ? (
            <S.EmptyState>
              <MdAttachMoney size={64} />
              <p>Nenhuma comissão registrada ainda</p>
            </S.EmptyState>
          ) : (
            <S.CommissionsList>
              {filteredCommissions.map(commission => (
                <S.CommissionItem key={commission.id}>
                  <S.CommissionHeader>
                    <S.CommissionTitle>{commission.title}</S.CommissionTitle>
                    <S.CommissionStatus $status={commission.status}>
                      {commission.status === 'PENDING' && 'Pendente'}
                      {commission.status === 'APPROVED' && 'Aprovado'}
                      {commission.status === 'PAID' && 'Pago'}
                      {commission.status === 'REJECTED' && 'Rejeitado'}
                    </S.CommissionStatus>
                  </S.CommissionHeader>
                  <S.CommissionDetails>
                    <S.CommissionDetail>
                      <span>Tipo:</span>
                      <strong>
                        {commission.type === 'SALE' && 'Venda'}
                        {commission.type === 'RENTAL' && 'Aluguel'}
                      </strong>
                    </S.CommissionDetail>
                    <S.CommissionDetail>
                      <span>Base:</span>
                      <strong>{formatCurrency(commission.baseValue)}</strong>
                    </S.CommissionDetail>
                    <S.CommissionDetail>
                      <span>%:</span>
                      <strong>{commission.percentage}%</strong>
                    </S.CommissionDetail>
                    <S.CommissionDetail>
                      <span>Líquido:</span>
                      <strong>{formatCurrency(commission.netValue)}</strong>
                    </S.CommissionDetail>
                  </S.CommissionDetails>
                  <S.CommissionActions>
                    <S.ActionButton
                      $variant='delete'
                      onClick={() => handleDeleteClick(commission.id)}
                      title='Excluir comissão'
                      disabled={isDeleting}
                    >
                      <MdDelete size={18} />
                    </S.ActionButton>
                  </S.CommissionActions>
                </S.CommissionItem>
              ))}
            </S.CommissionsList>
          )}
        </S.CommissionsSection>

        {showSaveModal && (
          <S.ModalOverlay onClick={() => setShowSaveModal(false)}>
            <S.ModalContent onClick={e => e.stopPropagation()}>
              <S.ModalTitle>Salvar Comissão</S.ModalTitle>
              <S.FormGroup>
                <S.Label>Título</S.Label>
                <S.Input
                  value={saveData.title}
                  onChange={e =>
                    setSaveData({ ...saveData, title: e.target.value })
                  }
                  placeholder='Ex: Comissão venda apto 101'
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.Label>Tipo</S.Label>
                <S.Select
                  value={saveData.type}
                  onChange={e =>
                    setSaveData({
                      ...saveData,
                      type: e.target.value as CommissionType,
                    })
                  }
                >
                  <option value='SALE'>Venda</option>
                  <option value='RENTAL'>Aluguel</option>
                </S.Select>
              </S.FormGroup>
              <S.FormGroup>
                <S.Label>Observações</S.Label>
                <S.TextArea
                  value={saveData.notes}
                  onChange={e => {
                    if (e.target.value.length <= 300) {
                      setSaveData({ ...saveData, notes: e.target.value });
                    }
                  }}
                  placeholder='Observações adicionais... (máx. 300 caracteres)'
                  maxLength={300}
                  rows={3}
                />
              </S.FormGroup>
              <S.ButtonGroup>
                <S.Button onClick={handleSave} disabled={isCreating}>
                  {isCreating ? 'Salvando...' : 'Salvar'}
                </S.Button>
                <S.Button
                  onClick={() => setShowSaveModal(false)}
                  $variant='secondary'
                >
                  Cancelar
                </S.Button>
              </S.ButtonGroup>
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {showDeleteModal && (
          <S.ModalOverlay onClick={handleCancelDelete}>
            <S.ModalContent onClick={e => e.stopPropagation()}>
              <S.ModalHeader>
                <h2>Confirmar Exclusão</h2>
              </S.ModalHeader>
              <S.ModalBody>
                <p>Tem certeza que deseja excluir esta comissão?</p>
                <p
                  style={{
                    color: '#ef4444',
                    marginTop: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  Esta ação não pode ser desfeita.
                </p>
              </S.ModalBody>
              <S.ButtonGroup>
                <S.Button
                  type='button'
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                >
                  Cancelar
                </S.Button>
                <S.Button
                  type='button'
                  $variant='primary'
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  style={{ backgroundColor: '#ef4444' }}
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </S.Button>
              </S.ButtonGroup>
            </S.ModalContent>
          </S.ModalOverlay>
        )}

        {/* Modal de Filtros */}
        <FilterDrawer
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title='Filtros de Comissões'
          footer={
            <>
              {Object.values(localFilters).some(
                value => value !== undefined && value !== '' && value !== false
              ) && (
                <ClearButton
                  onClick={() => {
                    const cleared: typeof localFilters = {
                      status: undefined,
                      type: undefined,
                      propertyId: undefined,
                      clientId: undefined,
                      clientName: '',
                      search: '',
                      minValue: undefined,
                      maxValue: undefined,
                      startDate: undefined,
                      endDate: undefined,
                      paid: undefined,
                      onlyMyData: false,
                    };
                    setLocalFilters(cleared);
                    setFilters(cleared);
                    setShowFiltersModal(false);
                  }}
                >
                  <MdClear size={16} />
                  Limpar Filtros
                </ClearButton>
              )}
              <ApplyButton
                onClick={() => {
                  setFilters(localFilters);
                  setShowFiltersModal(false);
                }}
              >
                <MdFilterList size={16} />
                Aplicar Filtros
              </ApplyButton>
            </>
          }
        >
          <FiltersContainer>
            <FilterSection>
              <FilterSectionTitle>
                <MdSearch size={20} />
                Busca por Texto
              </FilterSectionTitle>

              <FilterSearchContainer>
                <SearchIcon>
                  <MdSearch size={18} />
                </SearchIcon>
                <SearchInput
                  type='text'
                  placeholder='Buscar por cliente ou propriedade...'
                  value={localFilters.search || ''}
                  onChange={e =>
                    setLocalFilters(prev => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                />
              </FilterSearchContainer>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>💰 Filtros por Categoria</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Status</FilterLabel>
                  <FilterSelect
                    value={localFilters.status || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        status: (e.target.value || undefined) as
                          | CommissionStatus
                          | undefined,
                      }))
                    }
                  >
                    <option value=''>Todos os status</option>
                    <option value='PENDING'>Pendente</option>
                    <option value='APPROVED'>Aprovado</option>
                    <option value='PAID'>Pago</option>
                    <option value='REJECTED'>Rejeitado</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Nome do Cliente</FilterLabel>
                  <FilterInput
                    type='text'
                    placeholder='Nome do cliente...'
                    value={localFilters.clientName || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Pagamento</FilterLabel>
                  <FilterSelect
                    value={
                      localFilters.paid !== undefined
                        ? localFilters.paid.toString()
                        : ''
                    }
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        paid:
                          e.target.value === 'true'
                            ? true
                            : e.target.value === 'false'
                              ? false
                              : undefined,
                      }))
                    }
                  >
                    <option value=''>Todos</option>
                    <option value='true'>Apenas pagas</option>
                    <option value='false'>Apenas não pagas</option>
                  </FilterSelect>
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>📅 Filtro por Data</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Data Inicial</FilterLabel>
                  <FilterInput
                    type='date'
                    value={localFilters.startDate || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        startDate: e.target.value || undefined,
                      }))
                    }
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Data Final</FilterLabel>
                  <FilterInput
                    type='date'
                    value={localFilters.endDate || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        endDate: e.target.value || undefined,
                      }))
                    }
                  />
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>💵 Filtro por Valor</FilterSectionTitle>

              <FilterGrid>
                <FilterGroup>
                  <FilterLabel>Valor Mínimo</FilterLabel>
                  <FilterInput
                    type='number'
                    placeholder='Valor mínimo...'
                    value={localFilters.minValue || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        minValue: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Valor Máximo</FilterLabel>
                  <FilterInput
                    type='number'
                    placeholder='Valor máximo...'
                    value={localFilters.maxValue || ''}
                    onChange={e =>
                      setLocalFilters(prev => ({
                        ...prev,
                        maxValue: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </FilterGroup>
              </FilterGrid>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>🔒 Escopo de Dados</FilterSectionTitle>

              <DataScopeFilter
                onlyMyData={localFilters.onlyMyData || false}
                onChange={value =>
                  setLocalFilters(prev => ({ ...prev, onlyMyData: value }))
                }
                label='Mostrar apenas minhas comissões'
                description='Quando marcado, mostra apenas comissões que você criou, ignorando hierarquia de usuários.'
              />
            </FilterSection>

            {Object.values(localFilters).some(
              value => value !== undefined && value !== '' && value !== false
            ) && (
              <FilterStats>
                <span>Filtros ativos aplicados</span>
              </FilterStats>
            )}
          </FiltersContainer>
        </FilterDrawer>
      </S.Container>
    </Layout>
  );
};

// Styled Components para FilterDrawer
const FiltersContainer = styled.div`
  padding: 0;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterSectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 6px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const FilterSearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const SearchInput = styled(FilterInput)`
  padding-left: 40px;
`;

const FilterStats = styled.div`
  padding: 12px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.dangerHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default CommissionCalculatorPage;
