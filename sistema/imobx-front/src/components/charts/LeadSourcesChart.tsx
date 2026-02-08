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

interface LeadSource {
  source: string;
  label: string;
  count: number;
  percentage: number;
}

interface LeadSourcesChartProps {
  data: {
    sources: LeadSource[];
    total: number;
    withoutSource: number;
  };
  loading?: boolean;
}

const LeadSourcesChart: React.FC<LeadSourcesChartProps> = ({
  data,
  loading = false,
}) => {
  const chartData = useMemo(() => {
    if (!data.sources || data.sources.length === 0) {
      return { labels: [], values: [] };
    }

    // Ordenar por count (maior primeiro) e pegar os top 8
    const sortedSources = [...data.sources]
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      labels: sortedSources.map(s => s.label),
      values: sortedSources.map(s => s.count),
      percentages: sortedSources.map(s => s.percentage),
    };
  }, [data]);

  if (loading) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>Carregando...</h4>
          <p>Preparando dados de origem</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  if (
    !data.sources ||
    data.sources.length === 0 ||
    chartData.values.length === 0
  ) {
    return (
      <ChartContainer>
        <EmptyState>
          <h4>👥 Nenhum dado de origem</h4>
          <p>
            Os gráficos aparecerão quando houver leads com origem registrada
          </p>
        </EmptyState>
      </ChartContainer>
    );
  }

  const colors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
  ];

  const borderColors = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
  ];

  const chartDataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.values,
        backgroundColor: colors.slice(0, chartData.labels.length),
        borderColor: borderColors.slice(0, chartData.labels.length),
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
            const percentage =
              chartData.percentages && chartData.percentages[context.dataIndex]
                ? chartData.percentages[context.dataIndex].toFixed(1)
                : '0';
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

export default LeadSourcesChart;
