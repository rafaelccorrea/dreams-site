import React from 'react';
import { Bar } from 'react-chartjs-2';
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

interface SalesChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  loading?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>Carregando...</h4>
          <p>Preparando dados de vendas</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  // Se não há dados, mostrar mensagem
  if (
    !data.labels ||
    data.labels.length === 0 ||
    !data.values ||
    data.values.length === 0
  ) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>📊 Nenhum dado de vendas</h4>
          <p>Os gráficos aparecerão quando houver vendas registradas</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Vendas',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            return `Vendas: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
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
        <Bar data={chartData} options={options} />
      </SafeChartWrapper>
    </ChartContainer>
  );
};

export default SalesChart;
