import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação do shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Componente base do shimmer
const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
  $margin?: string;
}>`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.border} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => props.$borderRadius || '4px'};
  margin: ${props => props.$margin || '0'};
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const PageHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px;
  margin-bottom: 32px;
`;

const PageTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 16px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const PageContent = styled.div`
  padding: 0 24px 32px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const PhotoCard = styled.div`
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.border};
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  margin-bottom: 20px;
`;

const ChecklistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const ChecklistItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const TextArea = styled.div`
  width: 100%;
  min-height: 100px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
`;

export const InspectionDetailShimmer: React.FC = () => {
  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <PageTitleContainer>
          <div style={{ flex: 1 }}>
            <ShimmerBase
              $width='300px'
              $height='32px'
              $borderRadius='8px'
              $margin='0 0 8px 0'
            />
            <ShimmerBase $width='200px' $height='20px' $borderRadius='4px' />
          </div>
          <ShimmerBase $width='120px' $height='40px' $borderRadius='10px' />
        </PageTitleContainer>

        {/* Actions */}
        <ActionsContainer>
          <ShimmerBase $width='100px' $height='40px' $borderRadius='10px' />
          <ShimmerBase $width='100px' $height='40px' $borderRadius='10px' />
          <ShimmerBase $width='80px' $height='40px' $borderRadius='10px' />
          <ShimmerBase $width='80px' $height='40px' $borderRadius='10px' />
        </ActionsContainer>
      </PageHeader>

      <PageContent>
        <ContentGrid>
          {/* Main Content */}
          <div>
            {/* Informações da Vistoria Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='200px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <InfoGrid>
                <InfoItem>
                  <ShimmerBase
                    $width='80px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='120px'
                    $height='24px'
                    $borderRadius='20px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='60px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='100px'
                    $height='24px'
                    $borderRadius='20px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='120px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='180px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='80px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='140px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='100px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='120px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='60px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='100px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
              </InfoGrid>
            </Card>

            {/* Fotos Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='150px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <UploadArea>
                <ShimmerBase $width='64px' $height='64px' $borderRadius='50%' />
                <ShimmerBase
                  $width='200px'
                  $height='20px'
                  $borderRadius='4px'
                  $margin='12px 0 4px 0'
                />
                <ShimmerBase
                  $width='180px'
                  $height='16px'
                  $borderRadius='4px'
                />
              </UploadArea>
              <PhotosGrid>
                <PhotoCard>
                  <ShimmerBase $width='100%' $height='100%' $borderRadius='0' />
                </PhotoCard>
                <PhotoCard>
                  <ShimmerBase $width='100%' $height='100%' $borderRadius='0' />
                </PhotoCard>
                <PhotoCard>
                  <ShimmerBase $width='100%' $height='100%' $borderRadius='0' />
                </PhotoCard>
              </PhotosGrid>
            </Card>

            {/* Checklist Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='120px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <ChecklistGrid>
                <ChecklistItem>
                  <ShimmerBase
                    $width='100px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='140px'
                    $height='18px'
                    $borderRadius='4px'
                  />
                </ChecklistItem>
                <ChecklistItem>
                  <ShimmerBase
                    $width='80px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='120px'
                    $height='18px'
                    $borderRadius='4px'
                  />
                </ChecklistItem>
                <ChecklistItem>
                  <ShimmerBase
                    $width='90px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='130px'
                    $height='18px'
                    $borderRadius='4px'
                  />
                </ChecklistItem>
                <ChecklistItem>
                  <ShimmerBase
                    $width='70px'
                    $height='16px'
                    $borderRadius='4px'
                    $margin='0 0 8px 0'
                  />
                  <ShimmerBase
                    $width='110px'
                    $height='18px'
                    $borderRadius='4px'
                  />
                </ChecklistItem>
              </ChecklistGrid>
            </Card>

            {/* Observações Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='140px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <TextArea>
                <ShimmerBase
                  $width='100%'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='12px 12px 8px 12px'
                />
                <ShimmerBase
                  $width='90%'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 12px 8px 12px'
                />
                <ShimmerBase
                  $width='85%'
                  $height='16px'
                  $borderRadius='4px'
                  $margin='0 12px 12px 12px'
                />
              </TextArea>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Propriedade Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='140px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <InfoGrid>
                <InfoItem>
                  <ShimmerBase
                    $width='60px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='180px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='70px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='120px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='80px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='220px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
              </InfoGrid>
            </Card>

            {/* Inspetor Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='180px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <InfoGrid>
                <InfoItem>
                  <ShimmerBase
                    $width='60px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='160px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='60px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='200px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
              </InfoGrid>
            </Card>

            {/* Responsável Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='200px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <InfoGrid>
                <InfoItem>
                  <ShimmerBase
                    $width='60px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='150px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='90px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='140px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='80px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='130px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
              </InfoGrid>
            </Card>

            {/* Informações do Sistema Card */}
            <Card>
              <CardHeader>
                <ShimmerBase
                  $width='200px'
                  $height='24px'
                  $borderRadius='4px'
                />
              </CardHeader>
              <InfoGrid>
                <InfoItem>
                  <ShimmerBase
                    $width='90px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='180px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='100px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='180px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
                <InfoItem>
                  <ShimmerBase
                    $width='90px'
                    $height='14px'
                    $borderRadius='4px'
                    $margin='0 0 4px 0'
                  />
                  <ShimmerBase
                    $width='150px'
                    $height='16px'
                    $borderRadius='4px'
                  />
                </InfoItem>
              </InfoGrid>
            </Card>
          </div>
        </ContentGrid>
      </PageContent>
    </PageContainer>
  );
};

export default InspectionDetailShimmer;
