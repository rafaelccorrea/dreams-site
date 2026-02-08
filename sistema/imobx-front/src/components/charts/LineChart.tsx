import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { ensureChartRegistration } from './chartConfig';
import { SafeChartWrapper } from './ChartProvider';

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

export interface LineChartDataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartDataPoint[];
  label?: string;
  color?: string;
  loading?: boolean;
  emptyMessage?: string;
  showGrid?: boolean;
  fill?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  label = 'Valor',
  color = '#3B82F6',
  loading = false,
  emptyMessage = 'Nenhum dado disponível',
  showGrid = true,
  fill = false,
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [''], values: [0] };
    }
    return {
      labels: data.map(item => item.label),
      values: data.map(item => item.value),
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

  const chartDataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label,
        data: chartData.values,
        borderColor: color,
        backgroundColor: fill ? `${color}20` : 'transparent',
        borderWidth: 3,
        fill: fill,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        callbacks: {
          label: function (context: any) {
            return `${label}: ${context.parsed.y.toLocaleString('pt-BR')}`;
          },
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
        <Line data={chartDataConfig} options={options} />
      </SafeChartWrapper>
    </ChartContainer>
  );
};

export default LineChart;
