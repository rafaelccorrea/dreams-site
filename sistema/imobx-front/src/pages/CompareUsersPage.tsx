import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdCompare,
  MdPerson,
  MdDateRange,
  MdTrendingUp,
  MdArrowBack,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { UserMultiSelect } from '../components/common/UserMultiSelect';
import { useCompareUsers } from '../hooks/usePerformance';
import { PermissionButton } from '../components/common/PermissionButton';
import { toast } from 'react-toastify';
import { NumericFormat } from 'react-number-format';

const Container = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeaderRight = styled.div`
  margin-left: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.25rem;
  }
`;

const FiltersSection = styled.div`
  padding: 24px;
  margin-bottom: 32px;
  background: ${props =>
    props.theme.colors.surface || props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 20px;
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: end;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterRowTwoCols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterRowThreeCols = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 10px 14px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

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

const ResultsSection = styled.div`
  margin-top: 32px;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    margin-top: 24px;
    gap: 24px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    gap: 20px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: transparent;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 24px;
  font-size: 1.125rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
  background: transparent;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    background: transparent;
  }

  th {
    background: transparent;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    color: ${props => props.theme.colors.text};
    font-size: 0.95rem;
  }

  tbody tr:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 10px 12px;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 8px 10px;
      font-size: 0.8125rem;
    }
  }
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
  background: transparent;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    background: transparent;
  }

  th {
    background: ${props => props.theme.colors.primary};
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  th:first-child {
    position: sticky;
    left: 0;
    z-index: 11;
    background: ${props => props.theme.colors.primary};
  }

  td {
    color: ${props => props.theme.colors.text};
    font-size: 0.95rem;
  }

  td:first-child {
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
    background: transparent;
    position: sticky;
    left: 0;
    z-index: 9;
  }

  tbody tr:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    th,
    td {
      padding: 12px 14px;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    th:first-child,
    td:first-child {
      position: static;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 10px 12px;
      font-size: 0.8125rem;
    }
  }
`;

const UserHeaderCell = styled.th`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px !important;

  @media (max-width: 768px) {
    padding: 12px 14px !important;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px !important;
    gap: 6px;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: white;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const MetricValue = styled.td<{ $highlight?: boolean }>`
  font-weight: 700;
  color: ${props =>
    props.$highlight
      ? props.theme.colors.primary
      : props.theme.colors.text} !important;
`;

function CompareUsersPage() {
  const navigate = useNavigate();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [propertyType, setPropertyType] = useState<'sale' | 'rental' | 'all'>(
    'all'
  );
  const [region, setRegion] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { data, loading, compare } = useCompareUsers();

  const handleUserSelect = (userId: string) => {
    if (!selectedUserIds.includes(userId) && selectedUserIds.length < 4) {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    // Apenas permitir letras e máximo 2 caracteres
    if (value === '' || /^[A-Z]{0,2}$/.test(value)) {
      setRegion(value);
    }
  };

  const handleCompare = async () => {
    if (selectedUserIds.length < 2) {
      toast.warning('Selecione pelo menos 2 corretores para comparar');
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
      userIds: selectedUserIds,
    };

    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (propertyType && propertyType !== 'all')
      filters.propertyType = propertyType;
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

    await compare(selectedUserIds, filters);
  };

  // Calcular estatísticas consolidadas
  const getConsolidatedStats = () => {
    if (!data?.users) return null;

    const totalSales = data.users.reduce(
      (sum, user) => sum + (user.totalSales || 0),
      0
    );
    const totalRentals = data.users.reduce(
      (sum, user) => sum + (user.totalRentals || 0),
      0
    );
    const totalRevenue = data.users.reduce(
      (sum, user) =>
        sum + (user.salesRevenue || 0) + (user.rentalsRevenue || 0),
      0
    );
    const totalCommissions = data.users.reduce(
      (sum, user) => sum + (user.totalCommissions || 0),
      0
    );
    const avgAcceptanceRate =
      data.users.reduce((sum, user) => sum + (user.acceptanceRate || 0), 0) /
      data.users.length;

    return {
      totalSales,
      totalRentals,
      totalRevenue,
      totalCommissions,
      avgAcceptanceRate: Number(avgAcceptanceRate.toFixed(1)),
    };
  };

  const consolidatedStats = getConsolidatedStats();

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderLeft>
            <Title>Comparação de Performance de Corretores</Title>
            <Subtitle>
              Compare o desempenho de até 4 corretores lado a lado com métricas
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
                <MdPerson />
                Selecione os Corretores ({selectedUserIds.length}/4)
              </Label>
              <UserMultiSelect
                selectedUserIds={selectedUserIds}
                onSelect={handleUserSelect}
                onRemove={handleUserRemove}
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
            <div />
            <PermissionButton
              permission='performance:compare'
              variant='primary'
              size='medium'
              onClick={handleCompare}
              disabled={selectedUserIds.length < 2 || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              <MdCompare />
              {loading
                ? 'Comparando...'
                : `Comparar ${selectedUserIds.length} Corretores`}
            </PermissionButton>
          </FilterRow>
        </FiltersSection>

        {loading ? (
          <LoadingState>🔄 Carregando dados de comparação...</LoadingState>
        ) : data ? (
          <ResultsSection>
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
                    <td>✅ Taxa de Aceite Média</td>
                    <td>{consolidatedStats.avgAcceptanceRate}%</td>
                  </tr>
                </tbody>
              </StatsTable>
            )}

            {/* Comparação lado a lado dos corretores */}
            {data.users && data.users.length > 0 && (
              <ComparisonTable>
                <thead>
                  <tr>
                    <th>Métrica</th>
                    {data.users.map(user => (
                      <UserHeaderCell key={user.userId}>
                        <UserAvatar src={user.userAvatar} alt={user.userName} />
                        <UserName>{user.userName}</UserName>
                      </UserHeaderCell>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>💰 Vendas</td>
                    {data.users.map(user => (
                      <td key={user.userId}>{user.totalSales}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>🏠 Aluguéis</td>
                    {data.users.map(user => (
                      <td key={user.userId}>{user.totalRentals}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>💵 Receita Vendas</td>
                    {data.users.map(user => (
                      <td key={user.userId}>
                        R${' '}
                        {user.salesRevenue.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>💵 Receita Aluguéis</td>
                    {data.users.map(user => (
                      <td key={user.userId}>
                        R${' '}
                        {user.rentalsRevenue.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>💵 Comissões</td>
                    {data.users.map(user => (
                      <MetricValue key={user.userId} $highlight>
                        R${' '}
                        {user.totalCommissions.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </MetricValue>
                    ))}
                  </tr>
                  <tr>
                    <td>📊 Taxa Conversão</td>
                    {data.users.map(user => (
                      <td key={user.userId}>{user.conversionRate}%</td>
                    ))}
                  </tr>
                  <tr>
                    <td>✅ Taxa Aceite</td>
                    {data.users.map(user => (
                      <td key={user.userId}>{user.acceptanceRate}%</td>
                    ))}
                  </tr>
                </tbody>
              </ComparisonTable>
            )}
          </ResultsSection>
        ) : (
          <EmptyState>
            <EmptyIcon>🎯</EmptyIcon>
            <EmptyTitle>Pronto para comparar corretores?</EmptyTitle>
            <EmptyText>
              Selecione pelo menos 2 corretores e clique em "Comparar
              Corretores"
            </EmptyText>
          </EmptyState>
        )}
      </Container>
    </Layout>
  );
}

export default CompareUsersPage;
