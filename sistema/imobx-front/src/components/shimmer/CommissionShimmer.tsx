import React from 'react';
import styled from 'styled-components';

const ShimmerWrapper = styled.div`
  padding: 32px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.div`
  height: 32px;
  width: 250px;
  background: ${props => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const Subtitle = styled.div`
  height: 20px;
  width: 400px;
  background: ${props => props.theme.colors.border};
  border-radius: 6px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const StatLabel = styled.div`
  height: 16px;
  width: 100px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  margin-bottom: 12px;
`;

const StatValue = styled.div`
  height: 28px;
  width: 120px;
  background: ${props => props.theme.colors.border};
  border-radius: 6px;
`;

const CalculatorCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const InputShimmer = styled.div`
  height: 48px;
  background: ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const ButtonShimmer = styled.div`
  height: 48px;
  width: 200px;
  background: ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-top: 16px;
`;

const ListCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
`;

const ListItem = styled.div`
  height: 80px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const CommissionShimmer: React.FC = () => {
  return (
    <ShimmerWrapper>
      <Header>
        <Title />
        <Subtitle />
      </Header>

      <StatsGrid>
        {[1, 2, 3, 4].map(i => (
          <StatCard key={i}>
            <StatLabel />
            <StatValue />
          </StatCard>
        ))}
      </StatsGrid>

      <CalculatorCard>
        <FormRow>
          <InputShimmer />
          <InputShimmer />
        </FormRow>
        <FormRow>
          <InputShimmer />
          <InputShimmer />
        </FormRow>
        <ButtonShimmer />
      </CalculatorCard>

      <ListCard>
        {[1, 2, 3].map(i => (
          <ListItem key={i} />
        ))}
      </ListCard>
    </ShimmerWrapper>
  );
};
