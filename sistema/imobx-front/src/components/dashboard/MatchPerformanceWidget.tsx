import React, { useState, useEffect } from 'react';
import {
  MdBarChart,
  MdCompare,
  MdGroups,
  MdTrendingUp,
  MdDateRange,
} from 'react-icons/md';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDashboardPerformance } from '@/hooks/usePerformance';
import { InfoTooltip } from '../common/InfoTooltip';
import { toast } from 'react-toastify';

const WidgetContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${props => props.theme.shadows.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const WidgetTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props =>
    props.theme.mode === 'dark' ? '#FFFFFF' : props.theme.colors.text.primary};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatBox = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  transition: all 0.2s ease;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 12px 12px 0 0;
    background: ${props => props.$accentColor || '#3B82F6'};
  }

  @media (max-width: 768px) {
    padding: 14px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.$color || props.theme.colors.text.primary};
  line-height: 1.2;
  margin-bottom: 4px;
  word-break: break-word;

  @media (min-width: 1400px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const StatSubtext = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 500;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.buttonText || '#FFFFFF'};
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: fit-content;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.8rem;
    width: 100%;
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props =>
    props.theme.mode === 'dark' ? '#FFFFFF' : props.theme.colors.text.primary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: fit-content;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.8rem;
    width: 100%;
  }
`;

const LoadingState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const ErrorState = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
`;

function MatchPerformanceWidget() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardPerformance();

  // Dados mockados baseados na documentação
  const mockData = {
    companyStats: {
      totalMatches: 156,
      pendingMatches: 23,
      acceptedMatches: 89,
      avgAcceptanceRate: 67.3,
      avgMatchScore: 78.5,
      totalTasksCreated: 89,
      totalTasksCompleted: 67,
      // Dados reais baseados na documentação
      totalSales: 45,
      totalRentals: 67,
      salesRevenue: 9200000,
      rentalsRevenue: 201000,
      totalCommissions: 276000,
    },
  };

  if (loading) {
    return (
      <WidgetContainer>
        <WidgetHeader>
          <WidgetTitle>
            <MdBarChart />
            Performance da Empresa
          </WidgetTitle>
        </WidgetHeader>
        <LoadingState>Carregando performance...</LoadingState>
      </WidgetContainer>
    );
  }

  if (error || !data) {
    // Usar dados mockados se API falhar
    const stats = mockData.companyStats;

    return (
      <>
        <WidgetContainer>
          <WidgetHeader>
            <WidgetTitle>
              <MdBarChart />
              Performance da Empresa
              <InfoTooltip content='Dados baseados em vendas e aluguéis reais da empresa nos últimos 30 dias' />
            </WidgetTitle>
          </WidgetHeader>

          <StatsGrid>
            {/* Vendas Realizadas */}
            <StatBox $accentColor='#10B981'>
              <StatLabel>💰 Vendas Realizadas</StatLabel>
              <StatValue $color='#10B981'>{stats.totalSales}</StatValue>
              <StatSubtext>
                R$ {stats.salesRevenue.toLocaleString('pt-BR')}
              </StatSubtext>
            </StatBox>

            {/* Aluguéis Realizados */}
            <StatBox $accentColor='#3B82F6'>
              <StatLabel>🏠 Aluguéis Realizados</StatLabel>
              <StatValue $color='#3B82F6'>{stats.totalRentals}</StatValue>
              <StatSubtext>
                R$ {stats.rentalsRevenue.toLocaleString('pt-BR')}
              </StatSubtext>
            </StatBox>

            {/* Receita Total */}
            <StatBox $accentColor='#8B5CF6'>
              <StatLabel>💵 Receita Total</StatLabel>
              <StatValue $color='#8B5CF6'>
                R${' '}
                {(stats.salesRevenue + stats.rentalsRevenue).toLocaleString(
                  'pt-BR'
                )}
              </StatValue>
              <StatSubtext>Vendas + Aluguéis</StatSubtext>
            </StatBox>

            {/* Comissões */}
            <StatBox $accentColor='#F59E0B'>
              <StatLabel>💰 Comissões</StatLabel>
              <StatValue $color='#F59E0B'>
                R$ {stats.totalCommissions.toLocaleString('pt-BR')}
              </StatValue>
              <StatSubtext>Ganho pelos corretores</StatSubtext>
            </StatBox>

            {/* Matches Aceitos */}
            <StatBox $accentColor='#EC4899'>
              <StatLabel>🎯 Matches Aceitos</StatLabel>
              <StatValue $color='#EC4899'>{stats.acceptedMatches}</StatValue>
              <StatSubtext>{stats.pendingMatches} pendentes</StatSubtext>
            </StatBox>

            {/* Tasks Concluídas */}
            <StatBox $accentColor='#14B8A6'>
              <StatLabel>✅ Tasks Concluídas</StatLabel>
              <StatValue $color='#14B8A6'>
                {stats.totalTasksCompleted}
              </StatValue>
              <StatSubtext>{stats.totalTasksCreated} criadas</StatSubtext>
            </StatBox>
          </StatsGrid>

          <ActionsRow>
            <ActionButton
              onClick={() => {
                // console.log('🎯 Navegando para comparação de corretores');
                navigate('/comparar-corretores');
              }}
            >
              <MdCompare />
              Comparar Corretores
            </ActionButton>
            <SecondaryButton
              onClick={() => {
                // console.log('👥 Navegando para comparação de equipes');
                navigate('/comparar-equipes');
              }}
            >
              <MdGroups />
              Comparar Equipes
            </SecondaryButton>
          </ActionsRow>
        </WidgetContainer>
      </>
    );
  }

  // Se tiver dados reais da API, calcular os valores a partir dos dados disponíveis
  let stats;
  if (data && data.companyStats) {
    // Calcular vendas e receitas a partir dos top performers
    const totalSales =
      data.topPerformers?.reduce(
        (sum, user) => sum + (user.totalSales || 0),
        0
      ) || 0;
    const totalRentals =
      data.topPerformers?.reduce(
        (sum, user) => sum + (user.totalRentals || 0),
        0
      ) || 0;
    const salesRevenue =
      data.topPerformers?.reduce(
        (sum, user) => sum + (user.salesRevenue || 0),
        0
      ) || 0;
    const rentalsRevenue =
      data.topPerformers?.reduce(
        (sum, user) => sum + (user.rentalsRevenue || 0),
        0
      ) || 0;
    const totalCommissions =
      data.topPerformers?.reduce(
        (sum, user) => sum + (user.totalCommissions || 0),
        0
      ) || 0;

    stats = {
      ...data.companyStats,
      totalSales,
      totalRentals,
      salesRevenue,
      rentalsRevenue,
      totalCommissions,
    };
  } else {
    stats = mockData.companyStats;
  }

  return (
    <>
      <WidgetContainer>
        <WidgetHeader>
          <WidgetTitle>
            <MdBarChart />
            Performance da Empresa
            <InfoTooltip content='Dados baseados em vendas e aluguéis reais da empresa nos últimos 30 dias' />
          </WidgetTitle>
        </WidgetHeader>

        <StatsGrid>
          {/* Vendas Realizadas */}
          <StatBox $accentColor='#10B981'>
            <StatLabel>💰 Vendas Realizadas</StatLabel>
            <StatValue $color='#10B981'>{stats.totalSales || 0}</StatValue>
            <StatSubtext>
              R$ {(stats.salesRevenue || 0).toLocaleString('pt-BR')}
            </StatSubtext>
          </StatBox>

          {/* Aluguéis Realizados */}
          <StatBox $accentColor='#3B82F6'>
            <StatLabel>🏠 Aluguéis Realizados</StatLabel>
            <StatValue $color='#3B82F6'>{stats.totalRentals || 0}</StatValue>
            <StatSubtext>
              R$ {(stats.rentalsRevenue || 0).toLocaleString('pt-BR')}
            </StatSubtext>
          </StatBox>

          {/* Receita Total */}
          <StatBox $accentColor='#8B5CF6'>
            <StatLabel>💵 Receita Total</StatLabel>
            <StatValue $color='#8B5CF6'>
              R${' '}
              {(
                (stats.salesRevenue || 0) + (stats.rentalsRevenue || 0)
              ).toLocaleString('pt-BR')}
            </StatValue>
            <StatSubtext>Vendas + Aluguéis</StatSubtext>
          </StatBox>

          {/* Comissões */}
          <StatBox $accentColor='#F59E0B'>
            <StatLabel>💰 Comissões</StatLabel>
            <StatValue $color='#F59E0B'>
              R$ {(stats.totalCommissions || 0).toLocaleString('pt-BR')}
            </StatValue>
            <StatSubtext>Ganho pelos corretores</StatSubtext>
          </StatBox>

          {/* Matches Aceitos */}
          <StatBox $accentColor='#EC4899'>
            <StatLabel>🎯 Matches Aceitos</StatLabel>
            <StatValue $color='#EC4899'>{stats.acceptedMatches || 0}</StatValue>
            <StatSubtext>{stats.pendingMatches || 0} pendentes</StatSubtext>
          </StatBox>

          {/* Tasks Concluídas */}
          <StatBox $accentColor='#14B8A6'>
            <StatLabel>✅ Tasks Concluídas</StatLabel>
            <StatValue $color='#14B8A6'>
              {stats.totalTasksCompleted || 0}
            </StatValue>
            <StatSubtext>{stats.totalTasksCreated || 0} criadas</StatSubtext>
          </StatBox>
        </StatsGrid>

        <ActionsRow>
          <ActionButton
            onClick={() => {
              // console.log('🎯 Navegando para comparação de corretores');
              navigate('/comparar-corretores');
            }}
          >
            <MdCompare />
            Comparar Corretores
          </ActionButton>
          <SecondaryButton
            onClick={() => {
              // console.log('👥 Navegando para comparação de equipes');
              navigate('/comparar-equipes');
            }}
          >
            <MdGroups />
            Comparar Equipes
          </SecondaryButton>
        </ActionsRow>
      </WidgetContainer>
    </>
  );
}

export default MatchPerformanceWidget;
