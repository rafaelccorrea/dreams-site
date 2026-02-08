import React, { useState } from 'react';
import { MdCompare, MdGroups, MdDateRange, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { TeamMultiSelect } from '../components/common/TeamMultiSelect';
import { useCompareTeams } from '../hooks/usePerformance';
import { PermissionButton } from '../components/common/PermissionButton';
import { SharedUsersAlert } from '../components/common/SharedUsersAlert';
import { ManualAssignmentModal } from '../components/modals/ManualAssignmentModal';
import { toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';
import {
  Container,
  Header,
  HeaderLeft,
  HeaderRight,
  Title,
  Subtitle,
  BackButton,
  FiltersSection,
  FilterRow,
  FilterGroup,
  Label,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  ResultsSection,
  LoadingState,
  StatsTable,
  ComparisonTable,
  TeamHeaderCell,
  TeamIcon,
  TeamName,
  MetricValue,
  FilterRowTwoCols,
  Input,
  Select,
  PeriodBadge,
  ComparisonContainer,
  ComparisonTitle,
  ComparisonCard,
  ComparisonCardTitle,
  ComparisonMetricGrid,
  ComparisonTeamNameContainer,
  ComparisonValueContainer,
  ComparisonValue,
  BestTeamContainer,
  BestTeamTitle,
  BestTeamCard,
} from '../styles/pages/CompareTeamsPageStyles';

const ComparisonValueStyled = ComparisonValue;

const PriceInput = styled(NumericFormat)`
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

function CompareTeamsPage() {
  const navigate = useNavigate();

  // Inicializar datas: primeiro dia do mês e data atual
  const getFirstDayOfMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  };

  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getToday());
  const [propertyType, setPropertyType] = useState<'sale' | 'rental' | 'all'>(
    'all'
  );
  const [region, setRegion] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [excludeSharedUsers, setExcludeSharedUsers] = useState(false);
  const [isManualAssignmentModalOpen, setIsManualAssignmentModalOpen] =
    useState(false);
  const [manualAssignments, setManualAssignments] = useState<
    Record<string, string>
  >({});
  const [pendingSharedUsers, setPendingSharedUsers] = useState<any[]>([]);
  const { data, loading, compare } = useCompareTeams();

  // Detectar usuários compartilhados após a comparação
  React.useEffect(() => {
    if (data?.sharedUsers && data.sharedUsers.length > 0) {
      setPendingSharedUsers(data.sharedUsers);
    } else {
      setPendingSharedUsers([]);
    }
  }, [data]);

  const handleOpenManualAssignment = () => {
    setIsManualAssignmentModalOpen(true);
  };

  const handleCloseManualAssignment = () => {
    setIsManualAssignmentModalOpen(false);
  };

  const handleConfirmManualAssignment = async (
    assignments: Record<string, string>
  ) => {
    setManualAssignments(assignments);
    setIsManualAssignmentModalOpen(false);

    // Re-executar comparação com as atribuições manuais
    const filters: any = {
      teamIds: selectedTeamIds,
    };

    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    // Sempre enviar propertyType (incluindo 'all')
    if (propertyType) filters.propertyType = propertyType;
    if (region && region.trim() !== '') {
      filters.region = region.trim().toUpperCase();
    }
    if (minPrice) {
      const cleanMinPrice = minPrice.replace(/[R$\s.]/g, '').replace(',', '.');
      filters.minPrice = parseFloat(cleanMinPrice);
    }
    if (maxPrice) {
      const cleanMaxPrice = maxPrice.replace(/[R$\s.]/g, '').replace(',', '.');
      filters.maxPrice = parseFloat(cleanMaxPrice);
    }
    filters.assignSharedUsersTo = assignments;
    filters.excludeSharedUsers = false; // Desativar exclusão quando usar atribuição manual

    await compare(selectedTeamIds, filters);
  };

  const handleTeamSelect = (teamId: string) => {
    if (!selectedTeamIds.includes(teamId) && selectedTeamIds.length < 4) {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
    }
  };

  const handleTeamRemove = (teamId: string) => {
    setSelectedTeamIds(selectedTeamIds.filter(id => id !== teamId));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Apenas permitir letras e máximo 2 caracteres
    if (value === '' || /^[A-Z]{0,2}$/.test(value)) {
      setRegion(value);
    }
  };

  const handleCompare = async () => {
    if (selectedTeamIds.length < 2) {
      toast.warning('Selecione pelo menos 2 equipes para comparar');
      return;
    }

    // Validação de período: ambas as datas devem estar preenchidas ou nenhuma
    const hasStartDate = !!startDate;
    const hasEndDate = !!endDate;

    if (hasStartDate && !hasEndDate) {
      toast.warning('Selecione a data final do período');
      return;
    }

    if (!hasStartDate && hasEndDate) {
      toast.warning('Selecione a data inicial do período');
      return;
    }

    // Validação: data início não pode ser maior que data fim
    if (hasStartDate && hasEndDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        toast.error('A data inicial não pode ser maior que a data final');
        return;
      }
    }

    // Validação de região: apenas 2 letras (UF)
    if (region && region.trim() !== '') {
      const cleanRegion = region.trim().toUpperCase();
      if (cleanRegion.length !== 2 || !/^[A-Z]{2}$/.test(cleanRegion)) {
        toast.error(
          'A região deve conter exatamente 2 letras (ex: SP, RJ, MG)'
        );
        return;
      }
    }

    // Validação de preço: preço mínimo não pode ser maior que máximo
    if (minPrice && maxPrice) {
      const cleanMinPrice = minPrice.replace(/[R$\s.]/g, '').replace(',', '.');
      const cleanMaxPrice = maxPrice.replace(/[R$\s.]/g, '').replace(',', '.');
      const minValue = parseFloat(cleanMinPrice);
      const maxValue = parseFloat(cleanMaxPrice);

      if (minValue > maxValue) {
        toast.error('O preço mínimo não pode ser maior que o preço máximo');
        return;
      }
    }

    const filters: any = {
      teamIds: selectedTeamIds,
    };

    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    // Sempre enviar propertyType (incluindo 'all')
    if (propertyType) filters.propertyType = propertyType;
    if (region && region.trim() !== '') {
      filters.region = region.trim().toUpperCase();
    }
    if (minPrice) {
      // Remove formatação (R$, pontos e vírgulas) e converte para número
      const cleanMinPrice = minPrice.replace(/[R$\s.]/g, '').replace(',', '.');
      filters.minPrice = parseFloat(cleanMinPrice);
    }
    if (maxPrice) {
      // Remove formatação (R$, pontos e vírgulas) e converte para número
      const cleanMaxPrice = maxPrice.replace(/[R$\s.]/g, '').replace(',', '.');
      filters.maxPrice = parseFloat(cleanMaxPrice);
    }
    // Se há atribuições manuais, usar elas em vez de excluir
    if (Object.keys(manualAssignments).length > 0) {
      filters.assignSharedUsersTo = manualAssignments;
      filters.excludeSharedUsers = false; // Desativar exclusão quando usar atribuição manual
    } else {
      filters.excludeSharedUsers = excludeSharedUsers;
    }

    await compare(selectedTeamIds, filters);
  };

  // Calcular estatísticas consolidadas
  const getConsolidatedStats = () => {
    if (!data?.teams) return null;

    const totalSales = data.teams.reduce(
      (sum: number, team: any) => sum + (team.totalSales || 0),
      0
    );
    const totalRentals = data.teams.reduce(
      (sum: number, team: any) => sum + (team.totalRentals || 0),
      0
    );
    const totalRevenue = data.teams.reduce(
      (sum: number, team: any) =>
        sum + (team.salesRevenue || 0) + (team.rentalsRevenue || 0),
      0
    );
    const totalCommissions = data.teams.reduce(
      (sum: number, team: any) => sum + (team.totalCommissions || 0),
      0
    );
    const avgConversionRate =
      data.teams.reduce(
        (sum: number, team: any) => sum + (team.conversionRate || 0),
        0
      ) / data.teams.length;

    return {
      totalSales,
      totalRentals,
      totalRevenue,
      totalCommissions,
      avgConversionRate: Number(avgConversionRate.toFixed(1)),
    };
  };

  const consolidatedStats = getConsolidatedStats();

  // Formatar período para exibição
  const formatPeriod = (start?: string, end?: string) => {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return `${startDate.toLocaleDateString('pt-BR', options)} a ${endDate.toLocaleDateString('pt-BR', options)}`;
  };

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderLeft>
            <Title>Comparação de Performance de Equipes</Title>
            <Subtitle>
              Compare o desempenho de até 4 equipes lado a lado com métricas
              detalhadas
            </Subtitle>
          </HeaderLeft>
          <HeaderRight>
            <BackButton onClick={() => navigate(-1)}>
              <MdArrowBack />
              Voltar
            </BackButton>
          </HeaderRight>
        </Header>

        <FiltersSection>
          <FilterRow>
            <FilterGroup>
              <Label>
                <MdGroups />
                Selecione as Equipes ({selectedTeamIds.length}/4)
              </Label>
              <TeamMultiSelect
                selectedTeamIds={selectedTeamIds}
                onSelect={handleTeamSelect}
                onRemove={handleTeamRemove}
                maxSelections={4}
              />
            </FilterGroup>
          </FilterRow>

          {/* Filtros Avançados */}
          <FilterRow>
            <FilterGroup>
              <Label>
                <MdDateRange />
                Período
              </Label>
              <FilterRowTwoCols>
                <div>
                  <Label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                    Data Início
                  </Label>
                  <Input
                    type='date'
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    placeholder='Data inicial'
                  />
                </div>
                <div>
                  <Label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
                    Data Fim
                  </Label>
                  <Input
                    type='date'
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    placeholder='Data final'
                  />
                </div>
              </FilterRowTwoCols>
            </FilterGroup>
          </FilterRow>

          <FilterRow>
            <FilterGroup>
              <Label>Tipo de Propriedade</Label>
              <Select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value as any)}
              >
                <option value='all'>Todos</option>
                <option value='sale'>Apenas Vendas</option>
                <option value='rental'>Apenas Aluguéis</option>
              </Select>
            </FilterGroup>
            <FilterGroup>
              <Label>Região (UF)</Label>
              <Input
                type='text'
                value={region}
                onChange={handleRegionChange}
                placeholder='Ex: SP, RJ, MG'
                maxLength={2}
              />
            </FilterGroup>
            <FilterGroup>
              <Label>Faixa de Preço (R$)</Label>
              <FilterRowTwoCols>
                <PriceInput
                  placeholder='Mín'
                  thousandSeparator='.'
                  decimalSeparator=','
                  decimalScale={2}
                  prefix='R$ '
                  value={minPrice}
                  onValueChange={values => setMinPrice(values.value)}
                />
                <PriceInput
                  placeholder='Máx'
                  thousandSeparator='.'
                  decimalSeparator=','
                  decimalScale={2}
                  prefix='R$ '
                  value={maxPrice}
                  onValueChange={values => setMaxPrice(values.value)}
                />
              </FilterRowTwoCols>
            </FilterGroup>
          </FilterRow>

          <FilterRow>
            <FilterGroup>
              <Label>
                <input
                  type='checkbox'
                  checked={excludeSharedUsers}
                  onChange={e => setExcludeSharedUsers(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                Excluir usuários compartilhados entre equipes
              </Label>
            </FilterGroup>
            <PermissionButton
              permission='performance:compare'
              variant='primary'
              size='medium'
              onClick={handleCompare}
              disabled={selectedTeamIds.length < 2 || loading}
            >
              <MdCompare />
              {loading
                ? 'Comparando...'
                : `Comparar ${selectedTeamIds.length} Equipes`}
            </PermissionButton>
          </FilterRow>
        </FiltersSection>

        {loading ? (
          <LoadingState>🔄 Carregando dados de comparação...</LoadingState>
        ) : data ? (
          <ResultsSection>
            {/* Badge de Período */}
            {data.period && (
              <PeriodBadge>
                📅 Período de comparação:{' '}
                {formatPeriod(data.period.start, data.period.end)}
              </PeriodBadge>
            )}

            {/* Alerta de Usuários Compartilhados */}
            {data.sharedUsers && data.sharedUsers.length > 0 && (
              <SharedUsersAlert
                sharedUsers={data.sharedUsers}
                teamsData={data.teams || []}
                onOpenManualAssignment={handleOpenManualAssignment}
              />
            )}

            {/* Estatísticas Consolidadas */}
            {consolidatedStats && (
              <StatsTable>
                <thead>
                  <tr>
                    <th>Métrica</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>💰 Total de Vendas</td>
                    <td>{consolidatedStats.totalSales}</td>
                  </tr>
                  <tr>
                    <td>🏠 Total de Aluguéis</td>
                    <td>{consolidatedStats.totalRentals}</td>
                  </tr>
                  <tr>
                    <td>💵 Receita Total</td>
                    <td>
                      R${' '}
                      {consolidatedStats.totalRevenue.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                  <tr>
                    <td>💵 Comissões Totais</td>
                    <td>
                      R${' '}
                      {consolidatedStats.totalCommissions.toLocaleString(
                        'pt-BR'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>📊 Taxa de Conversão Média</td>
                    <td>{consolidatedStats.avgConversionRate}%</td>
                  </tr>
                </tbody>
              </StatsTable>
            )}

            {/* Comparação lado a lado das equipes */}
            {data.teams && data.teams.length > 0 && (
              <>
                <ComparisonTable>
                  <thead>
                    <tr>
                      <th>Métrica</th>
                      {data.teams.map((team: any) => (
                        <TeamHeaderCell key={team.teamId}>
                          <TeamIcon>
                            <MdGroups />
                          </TeamIcon>
                          <TeamName>
                            {team.teamName} ({team.memberCount || 0})
                          </TeamName>
                        </TeamHeaderCell>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>💰 Total de Vendas</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>{team.totalSales || 0}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>🏠 Total de Aluguéis</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>{team.totalRentals || 0}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>💵 Receita de Vendas</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>
                          R${' '}
                          {(team.salesRevenue || 0).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>💵 Receita de Aluguéis</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>
                          R${' '}
                          {(team.rentalsRevenue || 0).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>💰 Total de Comissões</td>
                      {data.teams.map((team: any) => (
                        <MetricValue key={team.teamId} $highlight>
                          R${' '}
                          {(team.totalCommissions || 0).toLocaleString(
                            'pt-BR',
                            { minimumFractionDigits: 2 }
                          )}
                        </MetricValue>
                      ))}
                    </tr>
                    <tr>
                      <td>🎯 Total de Matches</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>{team.totalMatches || 0}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>✅ Matches Aceitos</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>{team.acceptedMatches || 0}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>📊 Taxa de Conversão</td>
                      {data.teams.map((team: any) => (
                        <td key={team.teamId}>
                          {(team.conversionRate || 0).toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </ComparisonTable>

                {/* Seção de Comparação de Métricas */}
                {data.comparison && data.comparison.length > 0 && (
                  <ComparisonContainer>
                    <ComparisonTitle>
                      📊 Comparação Detalhada de Métricas
                    </ComparisonTitle>
                    {data.comparison.map((comparison: any, index: number) => (
                      <ComparisonCard key={index}>
                        <ComparisonCardTitle>
                          {comparison.metric}
                        </ComparisonCardTitle>
                        {comparison.teams.map((teamData: any) => (
                          <ComparisonMetricGrid key={teamData.teamId}>
                            <ComparisonTeamNameContainer>
                              {teamData.teamName}
                            </ComparisonTeamNameContainer>
                            <ComparisonValueContainer>
                              <ComparisonValueStyled
                                $isWinner={teamData.rank === 1}
                              >
                                {typeof teamData.value === 'number' &&
                                teamData.value > 0 &&
                                teamData.value < 1
                                  ? teamData.value.toFixed(2)
                                  : typeof teamData.value === 'number' &&
                                      teamData.value >= 1000
                                    ? 'R$ ' +
                                      teamData.value.toLocaleString('pt-BR')
                                    : teamData.value}
                              </ComparisonValueStyled>
                              {teamData.rank === 1 && <span>🥇</span>}
                            </ComparisonValueContainer>
                          </ComparisonMetricGrid>
                        ))}
                      </ComparisonCard>
                    ))}
                  </ComparisonContainer>
                )}

                {/* Seção Best Team */}
                {data.bestTeam && (
                  <BestTeamContainer>
                    <BestTeamTitle>
                      🏆 Melhor Equipe por Categoria
                    </BestTeamTitle>
                    {data.bestTeam.acceptanceRate && (
                      <BestTeamCard>
                        <strong>Taxa de Aceitação:</strong>{' '}
                        {data.bestTeam.acceptanceRate.teamName} (
                        {data.bestTeam.acceptanceRate.value}%)
                      </BestTeamCard>
                    )}
                    {data.bestTeam.avgScore && (
                      <BestTeamCard>
                        <strong>Score Médio:</strong>{' '}
                        {data.bestTeam.avgScore.teamName} (
                        {data.bestTeam.avgScore.value})
                      </BestTeamCard>
                    )}
                    {data.bestTeam.totalMatches && (
                      <BestTeamCard>
                        <strong>Total de Matches:</strong>{' '}
                        {data.bestTeam.totalMatches.teamName} (
                        {data.bestTeam.totalMatches.value})
                      </BestTeamCard>
                    )}
                  </BestTeamContainer>
                )}
              </>
            )}
          </ResultsSection>
        ) : (
          <EmptyState>
            <EmptyIcon>🎯</EmptyIcon>
            <EmptyTitle>Pronto para comparar equipes?</EmptyTitle>
            <EmptyText>
              Selecione pelo menos 2 equipes e clique em "Comparar Equipes"
            </EmptyText>
          </EmptyState>
        )}

        {/* Modal de Atribuição Manual */}
        <ManualAssignmentModal
          isOpen={isManualAssignmentModalOpen}
          onClose={handleCloseManualAssignment}
          onConfirm={handleConfirmManualAssignment}
          sharedUsers={pendingSharedUsers}
          teams={data?.teams || []}
        />
      </Container>
    </Layout>
  );
}

export default CompareTeamsPage;
