import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { ensureChartRegistration } from '../components/charts/chartConfig';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { SafeChartWrapper } from '../components/charts/ChartProvider';
import {
  analyticsApi,
  type AnalyticsFilters,
  type CompareFilters,
} from '../services/analyticsApi';
import { formatCurrency } from '../utils/formatNumbers';
import { LottieLoading } from '../components/common/LottieLoading';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  FiltersSection,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  FilterButton,
  FilterBadge,
  PriceInfoContainer,
  PriceInfoGrid,
  ComparisonInputContainer,
  ComparisonInputWrapper,
  ComparisonButtonWrapper,
  ComparisonStatsContainer,
  StatsGrid,
  StatCard,
  StatHeader,
  StatIcon,
  StatValue,
  StatLabel,
  ChartsGrid,
  ChartCard,
  ChartTitle,
  ChartContent,
  TableCard,
  TableTitle,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  OpportunitiesGrid,
  OpportunityCard,
  OpportunityHeader,
  OpportunityTitle,
  OpportunityScore,
  OpportunityStats,
  OpportunityStat,
  OpportunityStatLabel,
  OpportunityStatValue,
  ComparisonSection,
  ComparisonHeader,
  ComparisonTitle,
  ComparisonGrid,
  ComparisonCard,
  ComparisonCardTitle,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  RetryButton,
  Badge,
} from '../styles/pages/PublicSiteAnalyticsPageStyles';
import {
  MdBarChart,
  MdTrendingUp,
  MdLocationOn,
  MdHome,
  MdAttachMoney,
  MdSearch,
  MdVisibility,
  MdCompareArrows,
  MdError,
  MdRefresh,
  MdFilterList,
} from 'react-icons/md';
import { AnalyticsFiltersDrawer } from '../components/analytics/AnalyticsFiltersDrawer';
import { InfoTooltip } from '../components/common/InfoTooltip';
import { useCompany } from '../hooks/useCompany';
import { useStatesCities } from '../hooks/useStatesCities';

const PublicSiteAnalyticsPage: React.FC = () => {
  // Garantir que Chart.js está registrado quando o componente montar
  useEffect(() => {
    ensureChartRegistration();
  }, []);

  const { selectedCompany } = useCompany();

  // Estados para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    city: selectedCompany?.city || '',
    state: selectedCompany?.state || '',
    period: 'monthly',
  });

  // Estados para dados
  const [topFilters, setTopFilters] = useState<any>(null);
  const [priceProfile, setPriceProfile] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any>(null);
  const [neighborhoodDemand, setNeighborhoodDemand] = useState<any>(null);
  const [popularProperties, setPopularProperties] = useState<any>(null);
  const [citySummary, setCitySummary] = useState<any>(null);

  // Estados para comparação
  const [compareMode, setCompareMode] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);

  // Hooks para seleção de cidades (2 selects)
  const city1Hook = useStatesCities();
  const city2Hook = useStatesCities();

  // Estados de loading e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const hasInitialized = useRef(false);

  // Criar filtros base
  const baseFilters = useMemo<AnalyticsFilters>(() => filters, [filters]);

  // Função para buscar todos os dados
  const fetchAllData = useCallback(async () => {
    if (!filters.city || !filters.state) {
      setError('Por favor, preencha cidade e estado nos filtros');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        topFiltersData,
        profile,
        opps,
        neighborhoods,
        properties,
        summary,
      ] = await Promise.all([
        analyticsApi.getTopFilters(baseFilters),
        analyticsApi.getPriceProfile(baseFilters),
        analyticsApi.getOpportunities(baseFilters),
        analyticsApi.getNeighborhoodDemand({ ...baseFilters, limit: 10 }),
        analyticsApi.getPopularProperties({ ...baseFilters, limit: 10 }),
        analyticsApi.getCitySummary(baseFilters),
      ]);

      setTopFilters(topFiltersData.data);
      setPriceProfile(profile.data);
      setOpportunities(opps.data);
      setNeighborhoodDemand(neighborhoods.data);
      setPopularProperties(properties.data);
      setCitySummary(summary.data);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar dados de analytics');
    } finally {
      setLoading(false);
    }
  }, [baseFilters, filters.city, filters.state]);

  // Inicializar filtros com dados da empresa e buscar automaticamente na primeira carga
  useEffect(() => {
    if (
      selectedCompany?.city &&
      selectedCompany?.state &&
      !hasInitialized.current
    ) {
      const initialFilters: AnalyticsFilters = {
        city: selectedCompany.city,
        state: selectedCompany.state,
        period: 'monthly',
      };
      setFilters(initialFilters);
      hasInitialized.current = true;
      isInitialMount.current = false;

      // Buscar dados imediatamente com os filtros da empresa (primeira chamada)
      const timer = setTimeout(() => {
        // Usar os filtros da empresa diretamente
        const companyFilters: AnalyticsFilters = {
          city: selectedCompany.city!,
          state: selectedCompany.state!,
          period: 'monthly',
        };

        setLoading(true);
        setError(null);

        Promise.all([
          analyticsApi.getTopFilters(companyFilters),
          analyticsApi.getPriceProfile(companyFilters),
          analyticsApi.getOpportunities(companyFilters),
          analyticsApi.getNeighborhoodDemand({ ...companyFilters, limit: 10 }),
          analyticsApi.getPopularProperties({ ...companyFilters, limit: 10 }),
          analyticsApi.getCitySummary(companyFilters),
        ])
          .then(
            ([
              topFiltersData,
              profile,
              opps,
              neighborhoods,
              properties,
              summary,
            ]) => {
              setTopFilters(topFiltersData.data);
              setPriceProfile(profile.data);
              setOpportunities(opps.data);
              setNeighborhoodDemand(neighborhoods.data);
              setPopularProperties(properties.data);
              setCitySummary(summary.data);
            }
          )
          .catch((err: any) => {
            console.error('Erro ao buscar dados:', err);
            setError(err.message || 'Erro ao carregar dados de analytics');
          })
          .finally(() => {
            setLoading(false);
          });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCompany]);

  // Buscar dados automaticamente quando filtros mudarem manualmente (após inicialização)
  useEffect(() => {
    // Ignorar se ainda não foi inicializado ou se é a primeira renderização
    if (isInitialMount.current || !hasInitialized.current) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      }
      return;
    }

    // Buscar quando filtros mudarem manualmente
    if (filters.city && filters.state) {
      fetchAllData();
    }
  }, [
    filters.city,
    filters.state,
    filters.period,
    filters.startDate,
    filters.endDate,
    fetchAllData,
  ]);

  // Função para comparar cidades
  const fetchComparison = async () => {
    if (
      !city1Hook.selectedCity ||
      !city1Hook.selectedState ||
      !city2Hook.selectedCity ||
      !city2Hook.selectedState
    ) {
      setError('Por favor, selecione duas cidades para comparar');
      return;
    }

    if (
      city1Hook.selectedCity.nome === city2Hook.selectedCity.nome &&
      city1Hook.selectedState.sigla === city2Hook.selectedState.sigla
    ) {
      setError('Por favor, selecione cidades diferentes para comparar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Formatar no formato esperado pela API: Cidade1,UF|Cidade2,UF
      const citiesString = `${city1Hook.selectedCity.nome},${city1Hook.selectedState.sigla}|${city2Hook.selectedCity.nome},${city2Hook.selectedState.sigla}`;

      const compareFilters: CompareFilters = {
        cities: citiesString,
        period: filters.period || 'monthly',
      };

      const data = await analyticsApi.compareCities(compareFilters);
      setCompareData(data.data);
    } catch (err: any) {
      console.error('Erro ao comparar cidades:', err);
      setError(err.message || 'Erro ao comparar cidades');
    } finally {
      setLoading(false);
    }
  };

  // Função para traduzir nomes de filtros
  const translateFilterName = (filterName: string): string => {
    // Traduções de chaves
    const keyTranslations: Record<string, string> = {
      operation: 'Operação',
      type: 'Tipo',
      bedrooms: 'Quartos',
      bathrooms: 'Banheiros',
      area: 'Área',
      parking: 'Vagas',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'Estado',
      zipcode: 'CEP',
      features: 'Características',
      furnished: 'Mobiliado',
      pet_friendly: 'Aceita Pets',
      elevator: 'Elevador',
      pool: 'Piscina',
      gym: 'Academia',
      security: 'Segurança 24h',
      balcony: 'Varanda',
      garage: 'Garagem',
      suite: 'Suíte',
      min_price: 'Preço Mínimo',
      max_price: 'Preço Máximo',
      min_area: 'Área Mínima',
      max_area: 'Área Máxima',
      price: 'Preço',
    };

    // Traduções de valores
    const valueTranslations: Record<string, Record<string, string>> = {
      operation: {
        sale: 'Venda',
        rent: 'Aluguel',
        temporary_rent: 'Aluguel Temporário',
      },
      type: {
        house: 'Casa',
        apartment: 'Apartamento',
        commercial: 'Comercial',
        land: 'Terreno',
        farm: 'Chácara',
        warehouse: 'Galpão',
        room: 'Quarto',
        studio: 'Kitnet',
        loft: 'Loft',
        penthouse: 'Cobertura',
        townhouse: 'Sobrado',
        condo: 'Condomínio',
      },
    };

    // Verifica se está no formato "chave: valor"
    if (filterName.includes(':')) {
      const [key, ...valueParts] = filterName.split(':');
      const value = valueParts.join(':').trim();
      const cleanKey = key.trim().toLowerCase();
      const cleanValue = value.toLowerCase();

      // Traduz a chave
      const translatedKey = keyTranslations[cleanKey] || key;

      // Tenta traduzir o valor se houver tradução específica para essa chave
      let translatedValue = value;
      if (
        valueTranslations[cleanKey] &&
        valueTranslations[cleanKey][cleanValue]
      ) {
        translatedValue = valueTranslations[cleanKey][cleanValue];
      } else {
        // Se não houver tradução específica, tenta capitalizar
        translatedValue = value.charAt(0).toUpperCase() + value.slice(1);
      }

      return `${translatedKey}: ${translatedValue}`;
    }

    // Se não estiver no formato "chave: valor", tenta traduzir diretamente
    return keyTranslations[filterName.toLowerCase()] || filterName;
  };

  // Dados para gráfico de top filtros
  const topFiltersChartData = useMemo(() => {
    if (!topFilters?.filters || topFilters.filters.length === 0) return null;

    const top10 = topFilters.filters.slice(0, 10);
    return {
      labels: top10.map((f: any) => translateFilterName(f.filter)),
      datasets: [
        {
          label: 'Uso',
          data: top10.map((f: any) => f.count),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [topFilters]);

  // Dados para gráfico de distribuição de preços
  const priceDistributionChartData = useMemo(() => {
    if (
      !priceProfile?.priceProfile?.priceDistribution ||
      priceProfile.priceProfile.priceDistribution.length === 0
    )
      return null;

    const distribution = priceProfile.priceProfile.priceDistribution;
    const total = distribution.reduce(
      (sum: number, p: any) => sum + p.count,
      0
    );

    return {
      labels: distribution.map((p: any) => {
        // Melhorar formatação dos labels
        const range = p.range;
        const percentage =
          total > 0 ? ((p.count / total) * 100).toFixed(1) : '0';
        return `${range}\n(${p.count} prop. - ${percentage}%)`;
      }),
      datasets: [
        {
          label: 'Quantidade de Propriedades',
          data: distribution.map((p: any) => p.count),
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(14, 165, 233, 0.8)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(14, 165, 233, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [priceProfile]);

  // Dados para gráfico de demanda por bairro
  const neighborhoodChartData = useMemo(() => {
    if (
      !neighborhoodDemand?.neighborhoods ||
      neighborhoodDemand.neighborhoods.length === 0
    )
      return null;

    const top10 = neighborhoodDemand.neighborhoods.slice(0, 10);
    return {
      labels: top10.map((n: any) => n.neighborhood),
      datasets: [
        {
          label: 'Buscas',
          data: top10.map((n: any) => n.searches),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [neighborhoodDemand]);

  // Dados para gráfico de oportunidades
  const opportunitiesChartData = useMemo(() => {
    if (
      !opportunities?.opportunities ||
      opportunities.opportunities.length === 0
    )
      return null;

    const sorted = [...opportunities.opportunities]
      .sort((a: any, b: any) => b.opportunityScore - a.opportunityScore)
      .slice(0, 10);
    return {
      labels: sorted.map((opp: any) => opp.location),
      datasets: [
        {
          label: 'Score de Oportunidade',
          data: sorted.map((opp: any) => opp.opportunityScore),
          backgroundColor: sorted.map((opp: any) => {
            if (opp.level === 'high') return 'rgba(16, 185, 129, 0.6)';
            if (opp.level === 'medium') return 'rgba(245, 158, 11, 0.6)';
            return 'rgba(107, 114, 128, 0.6)';
          }),
          borderColor: sorted.map((opp: any) => {
            if (opp.level === 'high') return 'rgba(16, 185, 129, 1)';
            if (opp.level === 'medium') return 'rgba(245, 158, 11, 1)';
            return 'rgba(107, 114, 128, 1)';
          }),
          borderWidth: 2,
        },
      ],
    };
  }, [opportunities]);

  // Dados para gráfico de propriedades populares
  const popularPropertiesChartData = useMemo(() => {
    if (
      !popularProperties?.properties ||
      popularProperties.properties.length === 0
    )
      return null;

    const top10 = popularProperties.properties.slice(0, 10);
    return {
      labels: top10.map((p: any) =>
        p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title
      ),
      datasets: [
        {
          label: 'Visualizações',
          data: top10.map((p: any) => p.views),
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [popularProperties]);

  // Dados para gráfico comparativo de cidades
  const comparisonChartData = useMemo(() => {
    if (!compareData?.cities || compareData.cities.length === 0) return null;

    return {
      labels: compareData.cities.map((c: any) => `${c.city} - ${c.state}`),
      datasets: [
        {
          label: 'Total de Buscas',
          data: compareData.cities.map((c: any) => c.totalSearches),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
        {
          label: 'Score de Oportunidade',
          data: compareData.cities.map((c: any) => c.opportunityScore * 100), // Multiplicar por 100 para escala similar
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          yAxisID: 'y1',
        },
      ],
    };
  }, [compareData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const comparisonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value: any) {
            return (value / 100).toFixed(0);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label.split('\n')[0]}: ${value} propriedades (${percentage}%)`;
          },
        },
      },
    },
  };

  // Opções específicas para gráfico de distribuição de preços (Bar)
  const priceDistributionChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          title: function (context: any) {
            return context[0].label.split('\n')[0];
          },
          label: function (context: any) {
            const value = context.parsed.y || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return [
              `Quantidade: ${value} propriedades`,
              `Percentual: ${percentage}%`,
            ];
          },
        },
      },
    },
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        ticks: {
          ...chartOptions.scales.x.ticks,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10,
          },
        },
      },
      y: {
        ...chartOptions.scales.y,
        ticks: {
          stepSize: 1,
          callback: function (value: any) {
            return Number.isInteger(value) ? value : '';
          },
        },
      },
    },
  };

  if (loading && !topFilters && !citySummary) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LottieLoading />
          <LoadingText>Carregando analytics...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Analytics do Site Público</PageTitle>
          <PageSubtitle>
            Análise completa de buscas, visualizações e oportunidades de mercado
          </PageSubtitle>
        </div>
        <FilterButton onClick={() => setShowFilters(true)}>
          <MdFilterList size={20} />
          Filtros
          {(filters.city || filters.state) && <FilterBadge>1</FilterBadge>}
        </FilterButton>
      </PageHeader>

      {/* Erro */}
      {error && (
        <ErrorContainer>
          <ErrorIcon>
            <MdError />
          </ErrorIcon>
          <ErrorTitle>Erro ao carregar dados</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={fetchAllData}>
            <MdRefresh /> Tentar Novamente
          </RetryButton>
        </ErrorContainer>
      )}

      {/* Resumo da Cidade */}
      {citySummary && (
        <>
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatIcon color='#3B82F6'>
                  <MdSearch />
                </StatIcon>
                <InfoTooltip
                  content='Número total de buscas realizadas pelos usuários no site público durante o período selecionado. Inclui todas as pesquisas de propriedades, mesmo que não tenham resultado em visualizações.'
                  direction='down'
                />
              </StatHeader>
              <StatValue>
                {(citySummary.summary.totalSearches || 0).toLocaleString()}
              </StatValue>
              <StatLabel>Total de Buscas</StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#10B981'>
                  <MdVisibility />
                </StatIcon>
                <InfoTooltip
                  content='Número total de vezes que os usuários visualizaram detalhes de propriedades no site público. Cada vez que um usuário abre a página de detalhes de um imóvel conta como uma visualização.'
                  direction='down'
                />
              </StatHeader>
              <StatValue>
                {(citySummary.summary.totalViews || 0).toLocaleString()}
              </StatValue>
              <StatLabel>Total de Visualizações</StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#F59E0B'>
                  <MdAttachMoney />
                </StatIcon>
                <InfoTooltip
                  content='Valor médio dos imóveis disponíveis para venda na cidade selecionada. Este valor é calculado com base em todas as propriedades ativas para venda no período analisado.'
                  direction='down'
                />
              </StatHeader>
              <StatValue>
                {formatCurrency(citySummary.summary.avgSalePrice || 0)}
              </StatValue>
              <StatLabel>Preço Médio de Venda</StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#8B5CF6'>
                  <MdHome />
                </StatIcon>
                <InfoTooltip
                  content='Valor médio dos imóveis disponíveis para aluguel na cidade selecionada. Este valor é calculado com base em todas as propriedades ativas para locação no período analisado.'
                  direction='down'
                />
              </StatHeader>
              <StatValue>
                {formatCurrency(citySummary.summary.avgRentPrice || 0)}
              </StatValue>
              <StatLabel>Preço Médio de Locação</StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#EF4444'>
                  <MdTrendingUp />
                </StatIcon>
                <InfoTooltip
                  content='Percentual de crescimento ou declínio na demanda do mercado imobiliário comparado ao período anterior. Valores positivos indicam aumento na procura, valores negativos indicam redução.'
                  direction='down'
                />
              </StatHeader>
              <StatValue>{citySummary.summary.growth}%</StatValue>
              <StatLabel>Crescimento</StatLabel>
            </StatCard>
            <StatCard>
              <StatHeader>
                <StatIcon color='#06B6D4'>
                  <MdLocationOn />
                </StatIcon>
                <InfoTooltip
                  content='Índice que avalia o potencial de oportunidades de negócio na cidade. Considera fatores como demanda, oferta, crescimento e tendências de mercado. Quanto maior o score, maior o potencial de oportunidades.'
                  direction='down'
                />
              </StatHeader>
              <StatValue>{citySummary.summary.opportunityScore}</StatValue>
              <StatLabel>Score de Oportunidade</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* Gráficos */}
          <ChartsGrid>
            {topFiltersChartData && (
              <ChartCard>
                <ChartTitle>
                  <MdBarChart /> Top Filtros Mais Usados
                </ChartTitle>
                <ChartContent>
                  <SafeChartWrapper>
                    <Bar data={topFiltersChartData} options={chartOptions} />
                  </SafeChartWrapper>
                </ChartContent>
              </ChartCard>
            )}

            {priceDistributionChartData && (
              <ChartCard>
                <ChartTitle>
                  <MdBarChart /> Distribuição de Preços
                  <InfoTooltip
                    content='Mostra a distribuição de propriedades por faixas de preço. Ajuda a identificar quais faixas de preço têm mais oferta e demanda no mercado, permitindo ajustar estratégias de precificação.'
                    direction='down'
                  />
                </ChartTitle>
                {priceProfile?.priceProfile && (
                  <PriceInfoContainer>
                    <PriceInfoGrid>
                      <div>
                        <strong>Preço Médio Venda:</strong>{' '}
                        {formatCurrency(
                          priceProfile.priceProfile.avgSalePrice || 0
                        )}
                      </div>
                      <div>
                        <strong>Preço Médio Aluguel:</strong>{' '}
                        {formatCurrency(
                          priceProfile.priceProfile.avgRentPrice || 0
                        )}
                      </div>
                      <div>
                        <strong>Faixa Mais Procurada:</strong>{' '}
                        {priceProfile.priceProfile.topPriceRange || 'N/A'}
                      </div>
                    </PriceInfoGrid>
                  </PriceInfoContainer>
                )}
                <ChartContent>
                  <SafeChartWrapper>
                    <Bar
                      data={priceDistributionChartData}
                      options={priceDistributionChartOptions}
                    />
                  </SafeChartWrapper>
                </ChartContent>
              </ChartCard>
            )}

            {neighborhoodChartData && (
              <ChartCard>
                <ChartTitle>
                  <MdBarChart /> Demanda por Bairro
                  <InfoTooltip
                    content='Mostra quais bairros têm maior demanda (número de buscas) no site público. Ajuda a identificar áreas com maior interesse dos clientes e a direcionar investimentos e estratégias de marketing.'
                    direction='down'
                  />
                </ChartTitle>
                <ChartContent>
                  <SafeChartWrapper>
                    <Bar data={neighborhoodChartData} options={chartOptions} />
                  </SafeChartWrapper>
                </ChartContent>
              </ChartCard>
            )}
          </ChartsGrid>

          {/* Gráfico de Oportunidades */}
          {opportunitiesChartData && (
            <ChartCard>
              <ChartTitle>
                <MdTrendingUp /> Oportunidades de Mercado
                <InfoTooltip
                  content='Identifica locais com maior potencial de oportunidades de negócio baseado na relação entre demanda (buscas) e oferta (propriedades disponíveis). Locais com alta demanda e baixa oferta representam as melhores oportunidades.'
                  direction='down'
                />
              </ChartTitle>
              <ChartContent>
                <SafeChartWrapper>
                  <Bar data={opportunitiesChartData} options={chartOptions} />
                </SafeChartWrapper>
              </ChartContent>
            </ChartCard>
          )}

          {/* Espaçamento entre seções */}
          <div style={{ marginTop: '48px' }} />

          {/* Gráfico de Propriedades Populares */}
          {popularPropertiesChartData && (
            <ChartCard>
              <ChartTitle>
                <MdHome /> Propriedades Mais Populares
                <InfoTooltip
                  content='Lista as propriedades mais visualizadas pelos usuários no site público. Ajuda a entender quais características, preços e localizações atraem mais atenção dos clientes.'
                  direction='down'
                />
              </ChartTitle>
              <ChartContent>
                <SafeChartWrapper>
                  <Bar
                    data={popularPropertiesChartData}
                    options={chartOptions}
                  />
                </SafeChartWrapper>
              </ChartContent>
            </ChartCard>
          )}
        </>
      )}

      {/* Seção de Comparação */}
      <ComparisonSection>
        <ComparisonHeader>
          <ComparisonTitle>
            Comparar Cidades
            <InfoTooltip
              content='Permite comparar métricas de múltiplas cidades simultaneamente. Use para identificar diferenças de mercado, oportunidades regionais e tomar decisões estratégicas baseadas em dados comparativos.'
              direction='down'
            />
          </ComparisonTitle>
        </ComparisonHeader>
        <ComparisonInputContainer>
          <ComparisonInputWrapper>
            <FilterLabel>Cidade 1</FilterLabel>
            <FilterSelect
              value={city1Hook.selectedState?.sigla || ''}
              onChange={e => {
                const state = city1Hook.states.find(
                  s => s.sigla === e.target.value
                );
                city1Hook.setSelectedState(state || null);
              }}
              disabled={city1Hook.loadingStates}
            >
              <option value=''>Selecione o estado</option>
              {city1Hook.states.map(state => (
                <option key={state.id} value={state.sigla}>
                  {state.nome}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={city1Hook.selectedCity?.nome || ''}
              onChange={e => {
                const city = city1Hook.cities.find(
                  c => c.nome === e.target.value
                );
                city1Hook.setSelectedCity(city || null);
              }}
              disabled={!city1Hook.selectedState || city1Hook.loadingCities}
            >
              <option value=''>Selecione a cidade</option>
              {city1Hook.cities.map(city => (
                <option key={city.id} value={city.nome}>
                  {city.nome}
                </option>
              ))}
            </FilterSelect>
          </ComparisonInputWrapper>

          <ComparisonInputWrapper>
            <FilterLabel>Cidade 2</FilterLabel>
            <FilterSelect
              value={city2Hook.selectedState?.sigla || ''}
              onChange={e => {
                const state = city2Hook.states.find(
                  s => s.sigla === e.target.value
                );
                city2Hook.setSelectedState(state || null);
              }}
              disabled={city2Hook.loadingStates}
            >
              <option value=''>Selecione o estado</option>
              {city2Hook.states.map(state => (
                <option key={state.id} value={state.sigla}>
                  {state.nome}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              value={city2Hook.selectedCity?.nome || ''}
              onChange={e => {
                const city = city2Hook.cities.find(
                  c => c.nome === e.target.value
                );
                city2Hook.setSelectedCity(city || null);
              }}
              disabled={!city2Hook.selectedState || city2Hook.loadingCities}
            >
              <option value=''>Selecione a cidade</option>
              {city2Hook.cities.map(city => (
                <option key={city.id} value={city.nome}>
                  {city.nome}
                </option>
              ))}
            </FilterSelect>
          </ComparisonInputWrapper>

          <ComparisonButtonWrapper>
            <FilterButton
              onClick={fetchComparison}
              disabled={
                loading ||
                !city1Hook.selectedCity ||
                !city1Hook.selectedState ||
                !city2Hook.selectedCity ||
                !city2Hook.selectedState
              }
            >
              <MdCompareArrows /> Comparar
            </FilterButton>
          </ComparisonButtonWrapper>
        </ComparisonInputContainer>

        {comparisonChartData && (
          <ChartCard>
            <ChartTitle>
              <MdCompareArrows /> Comparação entre Cidades
            </ChartTitle>
            <ChartContent>
              <SafeChartWrapper>
                <Bar
                  data={comparisonChartData}
                  options={comparisonChartOptions}
                />
              </SafeChartWrapper>
            </ChartContent>
          </ChartCard>
        )}

        {compareData && !comparisonChartData && (
          <ComparisonGrid>
            {compareData.cities.map((cityData: any, index: number) => (
              <ComparisonCard key={index}>
                <ComparisonCardTitle>
                  {cityData.city} - {cityData.state}
                </ComparisonCardTitle>
                <ComparisonStatsContainer>
                  <div>
                    <strong>Total de Buscas:</strong>{' '}
                    {(cityData.totalSearches || 0).toLocaleString()}
                  </div>
                  <div>
                    <strong>Crescimento:</strong>{' '}
                    <Badge variant={cityData.growth > 0 ? 'success' : 'danger'}>
                      {cityData.growth > 0 ? '+' : ''}
                      {cityData.growth}%
                    </Badge>
                  </div>
                  <div>
                    <strong>Preço Médio:</strong>{' '}
                    {formatCurrency(cityData.avgSalePrice || 0)}
                  </div>
                  <div>
                    <strong>Faixa de Preço Top:</strong>{' '}
                    {cityData.topPriceRange}
                  </div>
                  <div>
                    <strong>Tipo Mais Procurado:</strong> {cityData.topType}
                  </div>
                  <div>
                    <strong>Score de Oportunidade:</strong>{' '}
                    {cityData.opportunityScore}
                  </div>
                </ComparisonStatsContainer>
              </ComparisonCard>
            ))}
          </ComparisonGrid>
        )}

        {/* Espaçamento entre seções */}
        {compareData && <div style={{ marginTop: '48px' }} />}

        {compareData?.comparison && (
          <TableCard>
            <TableTitle>Análise Comparativa</TableTitle>
            <Table>
              <tbody>
                <TableRow>
                  <TableCell>
                    <strong>Maior Demanda:</strong>
                  </TableCell>
                  <TableCell>{compareData.comparison.highestDemand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Maior Crescimento:</strong>
                  </TableCell>
                  <TableCell>{compareData.comparison.highestGrowth}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Maior Oportunidade:</strong>
                  </TableCell>
                  <TableCell>
                    {compareData.comparison.highestOpportunity}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Diferença de Preço:</strong>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      compareData.comparison.priceDifference || 0
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Diferença de Demanda:</strong>
                  </TableCell>
                  <TableCell>
                    {(
                      compareData.comparison.demandDifference || 0
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              </tbody>
            </Table>
          </TableCard>
        )}
      </ComparisonSection>

      {/* Estado vazio */}
      {!loading && !error && !citySummary && (
        <EmptyState>
          <EmptyStateIcon>📊</EmptyStateIcon>
          <EmptyStateTitle>Nenhum dado carregado</EmptyStateTitle>
          <EmptyStateDescription>
            Abra os filtros, preencha cidade e estado, e clique em "Aplicar
            Filtros" para ver os analytics
          </EmptyStateDescription>
        </EmptyState>
      )}

      {/* Drawer de Filtros */}
      <AnalyticsFiltersDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={newFilters => {
          setFilters(newFilters);
        }}
        loading={loading}
      />
    </PageContainer>
  );
};

export default PublicSiteAnalyticsPage;
