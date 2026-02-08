import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import styled, { useTheme } from 'styled-components';
import { ensureChartRegistration } from './chartConfig';
import { SafeChartWrapper } from './ChartProvider';

ensureChartRegistration();

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const ChartContainer = styled.div`
  width: 100%;
  height: 320px;
  padding: 20px 16px;
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

export interface BarChartDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  label?: string;
  color?: string;
  loading?: boolean;
  emptyMessage?: string;
  showGrid?: boolean;
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  label = 'Valor',
  color = '#3B82F6',
  loading = false,
  emptyMessage = 'Nenhum dado disponível',
  showGrid = true,
  horizontal = false,
}) => {
  const theme = useTheme() as {
    mode?: 'light' | 'dark';
    rawColors?: Record<string, string>;
  };
  const isDark = theme?.mode === 'dark';
  const tickColor = isDark
    ? (theme?.rawColors?.textSecondary ?? '#B3B3B3')
    : 'rgba(0, 0, 0, 0.55)';
  const gridColor = isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)';

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
        backgroundColor: (context: {
          chart: {
            ctx: CanvasRenderingContext2D;
            chartArea?: {
              top: number;
              bottom: number;
              left: number;
              right: number;
            };
          };
        }) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return hexToRgba(color, 0.7);
          const isHorizontal = horizontal;
          const gradient = ctx.createLinearGradient(
            isHorizontal ? chartArea.left : 0,
            isHorizontal ? 0 : chartArea.bottom,
            isHorizontal ? chartArea.right : 0,
            isHorizontal ? 0 : chartArea.top
          );
          gradient.addColorStop(0, hexToRgba(color, 0.45));
          gradient.addColorStop(0.7, hexToRgba(color, 0.85));
          gradient.addColorStop(1, color);
          return gradient;
        },
        borderColor: color,
        borderWidth: 1,
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.75,
        categoryPercentage: 0.85,
        hoverBackgroundColor: color,
        hoverBorderColor: color,
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 600,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark
          ? 'rgba(40, 40, 40, 0.98)'
          : 'rgba(30, 30, 30, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        padding: 14,
        cornerRadius: 10,
        titleFont: {
          size: 13,
          weight: '600' as const,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function (context: {
            parsed: { x?: number; y?: number };
            dataset: { label: string };
          }) {
            const value = context.parsed[horizontal ? 'x' : 'y'];
            return ` ${context.dataset.label}: ${typeof value === 'number' ? value.toLocaleString('pt-BR') : value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: showGrid ? gridColor : 'transparent',
          drawTicks: true,
        },
        ticks: {
          font: { size: 12 },
          color: tickColor,
          padding: 8,
        },
      },
      x: {
        grid: {
          display: showGrid,
          color: gridColor,
        },
        ticks: {
          font: { size: 12 },
          color: tickColor,
          padding: 8,
          maxRotation: 45,
          minRotation: 0,
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
        <Bar data={chartDataConfig} options={options} />
      </SafeChartWrapper>
    </ChartContainer>
  );
};

export default BarChart;
