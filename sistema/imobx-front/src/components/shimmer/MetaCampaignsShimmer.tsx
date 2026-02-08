import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmerWave = keyframes`
  0% { background-position: -140px 0; }
  100% { background-position: calc(140px + 100%) 0; }
`;

const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
  $delay?: number;
}>`
  background: linear-gradient(
    105deg,
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.backgroundSecondary} 36%,
    rgba(255, 255, 255, 0.15) 50%,
    ${props => props.theme.colors.backgroundSecondary} 64%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 140px 100%;
  animation: ${shimmerWave} 2.2s ease-in-out infinite;
  animation-delay: ${props => (props.$delay ?? 0) * 0.06}s;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$radius || '8px'};
`;

const Container = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  @media (min-width: 600px) {
    padding: 24px;
  }
  @media (min-width: 960px) {
    padding: 24px 28px;
  }
`;

const BackButtonShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const InfoBoxShimmer = styled.div`
  padding: 16px 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
`;

const FiltersSectionShimmer = styled.div`
  padding: 18px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
`;

const FilterRowShimmer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 24px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 24px;
  @media (min-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }
  @media (min-width: 900px) {
    gap: 20px;
  }
`;

const MetricsGridSecondary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 28px;
  @media (min-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }
  @media (min-width: 900px) {
    gap: 20px;
  }
`;

const MetricCardShimmer = styled.div`
  padding: 18px 16px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 76px;
  @media (min-width: 600px) {
    padding: 20px 18px;
    gap: 16px;
    min-height: 84px;
  }
`;

const SummaryStripTitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 18px;
  margin-bottom: 10px;
`;

const SummaryStripShimmer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  padding: 16px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-bottom: 24px;
`;

const ChartsSection = styled.section`
  margin-bottom: 32px;
`;

const ChartSectionTitle = styled(ShimmerBase)`
  width: 240px;
  height: 18px;
  margin-bottom: 16px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ChartCardShimmer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  min-height: 340px;
`;

const TableScrollHintShimmer = styled(ShimmerBase)`
  width: 280px;
  height: 14px;
  margin-bottom: 8px;
`;

const TableWrapShimmer = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.theme.colors.cardBackground};
`;

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 18px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const Td = styled.td`
  padding: 14px 18px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const MetaCampaignsShimmer: React.FC = () => {
  const tableColumns = [
    { w: '52px' }, // expand
    { w: '160px' }, // Campanha
    { w: '100px' }, // Conta
    { w: '90px' }, // Objetivo
    { w: '80px' }, // Status
    { w: '90px' }, // Impressões
    { w: '70px' }, // Cliques
    { w: '80px' }, // Gasto
    { w: '70px' }, // Leads
    { w: '140px' }, // Funil
    { w: '140px' }, // Responsável
    { w: '200px' }, // Automação
    { w: '100px' }, // Salvar
  ];

  return (
    <Container>
      <BackButtonShimmer $delay={0} />

      <HeaderRow>
        <HeaderLeft>
          <TitleRow>
            <ShimmerBase
              $width='32px'
              $height='32px'
              $radius='8px'
              $delay={1}
            />
            <ShimmerBase $width='200px' $height='28px' $delay={2} />
          </TitleRow>
          <ShimmerBase
            $width='90%'
            $height='18px'
            $delay={3}
            style={{ maxWidth: 480 }}
          />
        </HeaderLeft>
        <ToolbarRow>
          <ShimmerBase $width='140px' $height='38px' $delay={4} />
          <ShimmerBase $width='90px' $height='38px' $delay={5} />
          <ShimmerBase $width='80px' $height='38px' $delay={6} />
          <ShimmerBase $width='100px' $height='38px' $delay={7} />
        </ToolbarRow>
      </HeaderRow>

      <InfoBoxShimmer>
        <ShimmerBase $height='14px' $delay={8} style={{ marginBottom: 8 }} />
        <ShimmerBase
          $height='14px'
          $width='95%'
          $delay={9}
          style={{ marginBottom: 8 }}
        />
        <ShimmerBase $height='14px' $width='75%' $delay={10} />
      </InfoBoxShimmer>

      <FiltersSectionShimmer>
        <FilterRowShimmer>
          <ShimmerBase $width='70px' $height='20px' $delay={11} />
          <ShimmerBase $width='120px' $height='38px' $delay={12} />
          <ShimmerBase $width='100px' $height='38px' $delay={13} />
          <ShimmerBase $width='140px' $height='38px' $delay={14} />
          <ShimmerBase $width='200px' $height='38px' $delay={15} />
          <ShimmerBase
            $width='140px'
            $height='20px'
            $delay={16}
            style={{ marginLeft: 'auto' }}
          />
        </FilterRowShimmer>
      </FiltersSectionShimmer>

      <MetricsGrid>
        {[0, 1, 2, 3].map(i => (
          <MetricCardShimmer key={i}>
            <ShimmerBase
              $width='42px'
              $height='42px'
              $radius='10px'
              $delay={17 + i}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <ShimmerBase
                $height='12px'
                $width='60%'
                $delay={18 + i}
                style={{ marginBottom: 6 }}
              />
              <ShimmerBase $height='22px' $width='80%' $delay={19 + i} />
            </div>
          </MetricCardShimmer>
        ))}
      </MetricsGrid>

      <MetricsGridSecondary>
        {[0, 1, 2, 3].map(i => (
          <MetricCardShimmer key={i}>
            <ShimmerBase
              $width='42px'
              $height='42px'
              $radius='10px'
              $delay={21 + i}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <ShimmerBase
                $height='12px'
                $width='70%'
                $delay={22 + i}
                style={{ marginBottom: 6 }}
              />
              <ShimmerBase $height='22px' $width='90%' $delay={23 + i} />
            </div>
          </MetricCardShimmer>
        ))}
      </MetricsGridSecondary>

      <SummaryStripTitleShimmer $delay={25} />
      <SummaryStripShimmer>
        <ShimmerBase $height='16px' $width='120px' $delay={26} />
        <ShimmerBase $height='16px' $width='100px' $delay={27} />
        <ShimmerBase $height='16px' $width='90px' $delay={28} />
        <ShimmerBase $height='16px' $width='110px' $delay={29} />
      </SummaryStripShimmer>

      <ChartsSection>
        <ChartSectionTitle $delay={30} />
        <ChartsGrid>
          <ChartCardShimmer>
            <ShimmerBase
              $height='18px'
              $width='180px'
              $delay={31}
              style={{ marginBottom: 16 }}
            />
            <ShimmerBase $height='280px' $delay={32} />
          </ChartCardShimmer>
          <ChartCardShimmer>
            <ShimmerBase
              $height='18px'
              $width='160px'
              $delay={33}
              style={{ marginBottom: 16 }}
            />
            <ShimmerBase $height='280px' $delay={34} />
          </ChartCardShimmer>
        </ChartsGrid>
      </ChartsSection>

      <ChartsSection>
        <ChartSectionTitle $delay={35} />
        <ChartsGrid>
          <ChartCardShimmer>
            <ShimmerBase
              $height='18px'
              $width='140px'
              $delay={36}
              style={{ marginBottom: 16 }}
            />
            <ShimmerBase $height='260px' $delay={37} />
          </ChartCardShimmer>
          <ChartCardShimmer>
            <ShimmerBase
              $height='18px'
              $width='120px'
              $delay={38}
              style={{ marginBottom: 16 }}
            />
            <ShimmerBase $height='260px' $delay={39} />
          </ChartCardShimmer>
        </ChartsGrid>
      </ChartsSection>

      <TableScrollHintShimmer $delay={40} />

      <TableWrapShimmer>
        <Table>
          <thead>
            <tr>
              {tableColumns.map((col, i) => (
                <Th key={i} style={{ minWidth: col.w, width: col.w }}>
                  <ShimmerBase $height='16px' $width='100%' $delay={41 + i} />
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map(row => (
              <tr key={row}>
                <Td style={{ width: '52px' }}>
                  <ShimmerBase
                    $height='32px'
                    $width='32px'
                    $radius='6px'
                    $delay={54 + row}
                  />
                </Td>
                <Td style={{ minWidth: '160px' }}>
                  <ShimmerBase $height='18px' $width='85%' $delay={55 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='16px' $width='70%' $delay={56 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='16px' $width='50%' $delay={57 + row} />
                </Td>
                <Td>
                  <ShimmerBase
                    $height='24px'
                    $width='70px'
                    $radius='8px'
                    $delay={58 + row}
                  />
                </Td>
                <Td>
                  <ShimmerBase $height='16px' $width='60%' $delay={59 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='16px' $width='50%' $delay={60 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='16px' $width='55%' $delay={61 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='16px' $width='40%' $delay={62 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='36px' $width='100%' $delay={63 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='36px' $width='100%' $delay={64 + row} />
                </Td>
                <Td style={{ minWidth: '200px' }}>
                  <ShimmerBase
                    $height='36px'
                    $width='100%'
                    $delay={65 + row}
                    style={{ marginBottom: 8 }}
                  />
                  <ShimmerBase $height='36px' $width='100%' $delay={66 + row} />
                </Td>
                <Td>
                  <ShimmerBase $height='36px' $width='70px' $delay={67 + row} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapShimmer>
    </Container>
  );
};
