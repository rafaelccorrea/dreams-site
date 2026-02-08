import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ShimmerBase = styled.div<{ $width?: string; $height?: string }>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 0.5rem;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const RentalsShimmer: React.FC = () => {
  return (
    <Grid>
      {[...Array(6)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <ShimmerBase $width='60%' $height='24px' />
            <ShimmerBase $width='80px' $height='24px' />
          </CardHeader>

          <ShimmerBase
            $width='70%'
            $height='16px'
            style={{ marginBottom: '1rem' }}
          />

          <InfoSection>
            <ShimmerBase $width='100%' $height='16px' />
            <ShimmerBase $width='90%' $height='16px' />
            <ShimmerBase $width='95%' $height='16px' />
          </InfoSection>

          <ActionsRow>
            <ShimmerBase $width='100px' $height='36px' />
            <ShimmerBase $width='80px' $height='36px' />
            <ShimmerBase $width='80px' $height='36px' />
          </ActionsRow>
        </Card>
      ))}
    </Grid>
  );
};
