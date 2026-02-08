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

const Container = styled.div`
  padding: 0;
  max-width: 100%;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
  padding-top: 2rem;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 0 2rem 1.5rem 2rem;

  &:last-child {
    margin-bottom: 2rem;
  }
`;

const CardTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PaymentCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PaymentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const RentalDetailsShimmer: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <ShimmerBase $width='120px' $height='40px' />
        <ShimmerBase $width='100px' $height='40px' />
      </Header>

      {/* Detalhes do Aluguel */}
      <Card>
        <CardTitle>
          <ShimmerBase $width='200px' $height='24px' />
        </CardTitle>
        <InfoGrid>
          <InfoItem>
            <ShimmerBase $width='80px' $height='16px' />
            <ShimmerBase $width='150px' $height='20px' />
          </InfoItem>
          <InfoItem>
            <ShimmerBase $width='80px' $height='16px' />
            <ShimmerBase $width='120px' $height='20px' />
          </InfoItem>
          <InfoItem>
            <ShimmerBase $width='90px' $height='16px' />
            <ShimmerBase $width='180px' $height='20px' />
          </InfoItem>
          <InfoItem>
            <ShimmerBase $width='100px' $height='16px' />
            <ShimmerBase $width='100px' $height='20px' />
          </InfoItem>
          <InfoItem>
            <ShimmerBase $width='60px' $height='16px' />
            <ShimmerBase $width='200px' $height='20px' />
          </InfoItem>
          <InfoItem>
            <ShimmerBase $width='80px' $height='16px' />
            <ShimmerBase $width='80px' $height='20px' />
          </InfoItem>
        </InfoGrid>
      </Card>

      {/* Pagamentos */}
      <Card>
        <CardTitle>
          <ShimmerBase $width='180px' $height='24px' />
        </CardTitle>

        {[...Array(3)].map((_, index) => (
          <PaymentCard key={index}>
            <PaymentHeader>
              <ShimmerBase $width='120px' $height='20px' />
              <ShimmerBase $width='80px' $height='24px' />
            </PaymentHeader>

            <PaymentDetails>
              <InfoItem>
                <ShimmerBase $width='60px' $height='14px' />
                <ShimmerBase $width='80px' $height='16px' />
              </InfoItem>
              <InfoItem>
                <ShimmerBase $width='80px' $height='14px' />
                <ShimmerBase $width='100px' $height='16px' />
              </InfoItem>
              <InfoItem>
                <ShimmerBase $width='70px' $height='14px' />
                <ShimmerBase $width='90px' $height='16px' />
              </InfoItem>
            </PaymentDetails>

            <ButtonGroup>
              <ShimmerBase $width='100px' $height='36px' />
              <ShimmerBase $width='80px' $height='36px' />
            </ButtonGroup>
          </PaymentCard>
        ))}
      </Card>

      {/* Ações */}
      <Card>
        <CardTitle>
          <ShimmerBase $width='120px' $height='24px' />
        </CardTitle>
        <ButtonGroup>
          <ShimmerBase $width='120px' $height='40px' />
          <ShimmerBase $width='100px' $height='40px' />
          <ShimmerBase $width='140px' $height='40px' />
        </ButtonGroup>
      </Card>
    </Container>
  );
};
