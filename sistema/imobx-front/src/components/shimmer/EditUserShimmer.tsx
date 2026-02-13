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
    ${props => props.theme.colors.backgroundSecondary} 0%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '8px'};
  margin: ${props => props.$margin || '0'};
`;

const PageContainer = styled.div`
  padding: 24px 32px 32px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px 20px 24px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 28px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 28px 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 1px 3px rgba(0,0,0,0.2)'
      : '0 1px 3px rgba(0,0,0,0.06)'};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: ${props => `${props.theme.colors.primary}0c`};
  border: 1px solid ${props => `${props.theme.colors.primary}25`};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ActionsBar = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
`;

export const EditUserShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <HeaderLeft>
          <ShimmerBase $width='100px' $height='44px' $borderRadius='10px' />
          <div>
            <ShimmerBase $width='200px' $height='28px' $borderRadius='6px' $margin='0 0 8px 0' />
            <ShimmerBase $width='260px' $height='18px' $borderRadius='4px' />
          </div>
        </HeaderLeft>
      </PageHeader>

      <ContentGrid>
        <LeftColumn>
          {/* Card Informações Básicas */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
              <ShimmerBase $width='180px' $height='22px' $borderRadius='6px' />
            </CardHeader>

            <FormGrid>
              <FormGroup>
                <ShimmerBase $width='120px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
                <ShimmerBase $width='100%' $height='44px' $borderRadius='10px' />
              </FormGroup>
              <FormGroup>
                <ShimmerBase $width='80px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
                <ShimmerBase $width='100%' $height='44px' $borderRadius='10px' />
              </FormGroup>
              <FormGroup>
                <ShimmerBase $width='80px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
                <ShimmerBase $width='100%' $height='44px' $borderRadius='10px' />
              </FormGroup>
              <FormGroup>
                <ShimmerBase $width='60px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
                <ShimmerBase $width='100%' $height='44px' $borderRadius='10px' />
              </FormGroup>
            </FormGrid>

            <FormGroup style={{ marginTop: 8 }}>
              <ShimmerBase $width='140px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
              <ShimmerBase $width='100%' $height='56px' $borderRadius='10px' />
            </FormGroup>

            <FormGroup>
              <ShimmerBase $width='100%' $height='64px' $borderRadius='10px' />
            </FormGroup>

            <FormGroup style={{ marginTop: 24 }}>
              <ShimmerBase $width='100%' $height='52px' $borderRadius='10px' />
            </FormGroup>

            <FormGroup style={{ marginTop: 20 }}>
              <ShimmerBase $width='160px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
              <ShimmerBase $width='100%' $height='44px' $borderRadius='10px' />
            </FormGroup>
          </Card>

          {/* Card Tags */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
              <ShimmerBase $width='80px' $height='22px' $borderRadius='6px' />
            </CardHeader>

            <FormGroup>
              <ShimmerBase $width='120px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
              <ShimmerBase $width='100%' $height='100px' $borderRadius='10px' />
            </FormGroup>
          </Card>
        </LeftColumn>

        <RightColumn>
          {/* Card Permissões */}
          <Card>
            <CardHeader>
              <ShimmerBase $width='40px' $height='40px' $borderRadius='10px' />
              <ShimmerBase $width='120px' $height='22px' $borderRadius='6px' />
            </CardHeader>

            <InfoBox>
              <ShimmerBase $width='20px' $height='20px' $borderRadius='4px' />
              <ShimmerBase $width='100%' $height='36px' $borderRadius='6px' />
            </InfoBox>

            <FormGroup>
              <ShimmerBase $width='130px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
              <div style={{ display: 'flex', gap: 12, marginTop: 8, marginBottom: 8 }}>
                <ShimmerBase $width='100px' $height='40px' $borderRadius='8px' />
                <ShimmerBase $width='110px' $height='40px' $borderRadius='8px' />
              </div>
              <ShimmerBase $width='280px' $height='14px' $borderRadius='4px' />
            </FormGroup>

            <FormGroup>
              <ShimmerBase $width='130px' $height='16px' $borderRadius='4px' $margin='0 0 8px 0' />
              <ShimmerBase $width='100%' $height='44px' $borderRadius='10px' />
            </FormGroup>

            <PermissionsGrid>
              {[1, 2, 3].map(cat => (
                <CategoryCard key={cat}>
                  <CategoryHeader>
                    <ShimmerBase $width='32px' $height='32px' $borderRadius='8px' />
                    <ShimmerBase $width='120px' $height='18px' $borderRadius='4px' />
                  </CategoryHeader>
                  {[1, 2, 3, 4].map(item => (
                    <PermissionItem key={item}>
                      <ShimmerBase $width='18px' $height='18px' $borderRadius='4px' />
                      <div style={{ flex: 1 }}>
                        <ShimmerBase $width='80%' $height='14px' $borderRadius='4px' $margin='0 0 4px 0' />
                        <ShimmerBase $width='55%' $height='12px' $borderRadius='4px' />
                      </div>
                    </PermissionItem>
                  ))}
                </CategoryCard>
              ))}
            </PermissionsGrid>
          </Card>
        </RightColumn>
      </ContentGrid>

      <ActionsBar>
        <ShimmerBase $width='180px' $height='20px' $borderRadius='4px' />
        <ShimmerBase $width='160px' $height='48px' $borderRadius='10px' />
      </ActionsBar>
    </PageContainer>
  );
};

export default EditUserShimmer;
