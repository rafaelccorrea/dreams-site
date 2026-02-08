import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
}>`
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
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
`;

const PageContainer = styled.div`
  padding: 32px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 24px;
`;

const CardHeader = styled.div`
  margin-bottom: 20px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ItemCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const ChecklistDetailsShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <HeaderLeft>
          <ShimmerBase $width='300px' $height='32px' $margin='0 0 8px 0' />
          <ShimmerBase $width='200px' $height='20px' />
        </HeaderLeft>
        <HeaderActions>
          <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
          <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
          <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
        </HeaderActions>
      </PageHeader>

      <ContentGrid>
        <MainContent>
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='120px' $height='24px' $margin='0 0 20px 0' />
            </CardHeader>
            <CardContent>
              <ShimmerBase $width='100%' $height='8px' $borderRadius='4px' />
              <ShimmerBase $width='150px' $height='16px' $margin='8px 0 0 0' />
              <InfoGrid>
                <ShimmerBase $width='100%' $height='60px' />
                <ShimmerBase $width='100%' $height='60px' />
                <ShimmerBase $width='100%' $height='60px' />
                <ShimmerBase $width='100%' $height='60px' />
              </InfoGrid>
            </CardContent>
          </Card>

          {/* Items Card */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='150px' $height='24px' $margin='0 0 20px 0' />
            </CardHeader>
            <CardContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <ItemCard key={index}>
                  <ItemHeader>
                    <ShimmerBase $width='70%' $height='20px' />
                    <ShimmerBase
                      $width='120px'
                      $height='36px'
                      $borderRadius='6px'
                    />
                  </ItemHeader>
                  <ShimmerBase $width='90%' $height='16px' />
                  <ShimmerBase $width='80%' $height='16px' />
                  <div
                    style={{ display: 'flex', gap: '12px', marginTop: '8px' }}
                  >
                    <ShimmerBase $width='120px' $height='16px' />
                    <ShimmerBase $width='150px' $height='16px' />
                  </div>
                </ItemCard>
              ))}
            </CardContent>
          </Card>
        </MainContent>

        <Sidebar>
          {/* Info Card */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='120px' $height='24px' $margin='0 0 20px 0' />
            </CardHeader>
            <CardContent>
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase $width='100%' $height='50px' />
            </CardContent>
          </Card>

          {/* Property Card */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='100px' $height='24px' $margin='0 0 20px 0' />
            </CardHeader>
            <CardContent>
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase
                $width='100%'
                $height='40px'
                $borderRadius='8px'
                $margin='8px 0 0 0'
              />
            </CardContent>
          </Card>

          {/* Client Card */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='80px' $height='24px' $margin='0 0 20px 0' />
            </CardHeader>
            <CardContent>
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase $width='100%' $height='50px' />
              <ShimmerBase
                $width='100%'
                $height='40px'
                $borderRadius='8px'
                $margin='8px 0 0 0'
              />
            </CardContent>
          </Card>
        </Sidebar>
      </ContentGrid>
    </PageContainer>
  );
};
