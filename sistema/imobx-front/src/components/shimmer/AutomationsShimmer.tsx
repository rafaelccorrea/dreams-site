import React from 'react';
import styled from 'styled-components';
import { ShimmerBase } from '../common/Shimmer';

const PageWrapper = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const Title = styled(ShimmerBase)`
  width: 200px;
  height: 28px;
  border-radius: 8px;
`;

const Subtitle = styled(ShimmerBase)`
  width: 260px;
  height: 16px;
  border-radius: 6px;
  margin-top: 6px;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Button = styled(ShimmerBase)`
  width: 150px;
  height: 38px;
  border-radius: 10px;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
`;

const TitleLine = styled(ShimmerBase)`
  width: 60%;
  height: 18px;
  border-radius: 6px;
`;

const Badge = styled(ShimmerBase)`
  width: 70px;
  height: 16px;
  border-radius: 8px;
`;

const Line = styled(ShimmerBase)`
  width: 100%;
  height: 12px;
  border-radius: 6px;
`;

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ActionsRow = styled.div`
  margin-left: auto;
`;

const MenuDot = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
`;

const cards = Array.from({ length: 6 });

export const AutomationsShimmer: React.FC = () => {
  return (
    <PageWrapper>
      <Header>
        <HeaderText>
          <Title />
          <Subtitle />
        </HeaderText>
        <Button />
      </Header>

      <Grid>
        {cards.map((_, idx) => (
          <Card key={idx}>
            <CardHeader>
              <Icon />
              <Badge />
            </CardHeader>
            <TitleLine />
            <Line />
            <Line />
            <StatsRow>
              <Line style={{ width: '30%' }} />
              <Line style={{ width: '30%' }} />
              <Line style={{ width: '35%' }} />
            </StatsRow>
            <ActionsRow>
              <MenuDot />
            </ActionsRow>
          </Card>
        ))}
      </Grid>
    </PageWrapper>
  );
};

export default AutomationsShimmer;
