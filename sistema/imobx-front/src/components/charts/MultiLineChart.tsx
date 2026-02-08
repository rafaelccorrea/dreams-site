import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { ensureChartRegistration } from './chartConfig';
import { SafeChartWrapper } from './ChartProvider';

ensureChartRegistration();

const ChartContainer = styled.div`
  width: 100%;
  height: 350px;
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

export interface MultiLineDataset {
  label: string;
  data: number[];
  color: string;
  fill?: boolean;
}

interface MultiLineChartProps {
  labels: string[];
  datasets: MultiLineDataset[];
  loading?: boolean;
  emptyMessage?: string;
  showGrid?: boolean;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
  labels,
  datasets,
  loading = false,
  emptyMessage = 'Nenhum dado disponível',
  showGrid = true,
}) => {
  const chartData = useMemo(() => {
    if (!labels || labels.length === 0 || !datasets || datasets.length === 0) {
      return null;
    }

    return {
      labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        backgroundColor: dataset.fill ? `${dataset.color}20` : 'transparent',
        borderWidth: 3,
        fill: dataset.fill || false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: dataset.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      })),
    };
  }, [labels, datasets]);

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

  if (!chartData) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>📊 {emptyMessage}</h4>
          <p>Os gráficos aparecerão quando houver dados disponíveis</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '500' as const,
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: showGrid ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
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
        <Line data={chartData} options={options} />
      </SafeChartWrapper>
    </ChartContainer>
  );
};

export default MultiLineChart;
