import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';
// Import chart registration utilities
import { ensureChartRegistration } from './chartConfig';
import { SafeChartWrapper } from './ChartProvider';

// Ensure registration happens synchronously when module loads
ensureChartRegistration();

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};

  h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

export interface CategoryData {
  label: string;
  value: number;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
  loading?: boolean;
  emptyMessage?: string;
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data,
  loading = false,
  emptyMessage = 'Nenhum dado disponível',
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        values: [],
      };
    }

    // Filtrar apenas itens com valores > 0
    const filteredData = data.filter(item => item.value > 0);

    return {
      labels: filteredData.map(item => item.label),
      values: filteredData.map(item => item.value),
    };
  }, [data]);

  if (loading) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>Carregando...</h4>
          <p>Preparando dados do gráfico</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  // Se não há dados, mostrar mensagem
  if (chartData.values.length === 0 || chartData.values.every(v => v === 0)) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>📊 {emptyMessage}</h4>
          <p>Os gráficos aparecerão quando houver dados disponíveis</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  const colors = [
    'rgba(59, 130, 246, 0.8)', // Blue
    'rgba(16, 185, 129, 0.8)', // Green
    'rgba(245, 158, 11, 0.8)', // Orange
    'rgba(139, 92, 246, 0.8)', // Purple
    'rgba(236, 72, 153, 0.8)', // Pink
    'rgba(6, 182, 212, 0.8)', // Cyan
    'rgba(251, 146, 60, 0.8)', // Orange-500
    'rgba(34, 197, 94, 0.8)', // Green-500
    'rgba(147, 51, 234, 0.8)', // Purple-500
    'rgba(239, 68, 68, 0.8)', // Red-500
  ];

  const borderColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(251, 146, 60, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(147, 51, 234, 1)',
    'rgba(239, 68, 68, 1)',
  ];

  // Gerar cores se houver mais itens que cores disponíveis
  const generateColors = (count: number) => {
    if (count <= colors.length) {
      return {
        backgrounds: colors.slice(0, count),
        borders: borderColors.slice(0, count),
      };
    }

    // Se precisar de mais cores, gerar gradientes
    const generated = [];
    const generatedBorders = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      generated.push(`hsla(${hue}, 70%, 60%, 0.8)`);
      generatedBorders.push(`hsl(${hue}, 70%, 50%)`);
    }
    return {
      backgrounds: generated,
      borders: generatedBorders,
    };
  };

  const colorScheme = generateColors(chartData.labels.length);

  const chartDataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: colorScheme.backgrounds,
        borderColor: colorScheme.borders,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartContainer>
      <SafeChartWrapper
        fallback={
          <EmptyState>
            <h4>Carregando...</h4>
            <p>Preparando gráfico</p>
          </EmptyState>
        }
      >
        <Pie data={chartDataConfig} options={options} />
      </SafeChartWrapper>
    </ChartContainer>
  );
};

export default CategoryDistributionChart;
