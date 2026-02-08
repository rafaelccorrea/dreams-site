import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const Container = styled.div`
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 20px;
`;

const Line = styled.div<{ w?: string; h?: number }>`
  height: ${p => (p.h ? `${p.h}px` : '14px')};
  width: ${p => p.w || '100%'};
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const Badge = styled(Line)`
  width: 80px;
  height: 20px;
  border-radius: 999px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const Action = styled(Line)`
  width: 36px;
  height: 36px;
  border-radius: 12px;
`;

const AssetsShimmer: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <Container>
      <Grid>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <Row>
              <Line w='70%' h={20} />
              <Badge />
            </Row>
            <Line w='90%' />
            <Line w='60%' style={{ marginTop: 6 }} />
            <Row style={{ marginTop: 14 }}>
              <Line w='35%' />
              <Line w='25%' />
              <Line w='20%' />
            </Row>
            <Actions>
              <Action />
              <Action />
              <Action />
            </Actions>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default AssetsShimmer;
