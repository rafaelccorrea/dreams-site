import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Layout } from '../layout/Layout';

// Animação do shimmer
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const MCMVLeadDetailsShimmer: React.FC = () => {
  return (
    <Layout>
      <Container>
        {/* Header */}
        <Header>
          <BackButtonShimmer />
          <HeaderContent>
            <TitleShimmer />
            <SubtitleShimmer />
          </HeaderContent>
        </Header>

        {/* Content */}
        <Content>
          {/* Main Card */}
          <Card>
            <CardHeader>
              <NameShimmer />
              <BadgesShimmer>
                <BadgeShimmer />
                <BadgeShimmer />
              </BadgesShimmer>
            </CardHeader>

            <SectionTitleShimmer />
            <InfoGrid>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <InfoItem key={i}>
                  <LabelShimmer />
                  <ValueShimmer />
                </InfoItem>
              ))}
            </InfoGrid>

            <SectionTitleShimmer />
            <InfoGrid>
              {[1, 2, 3, 4].map(i => (
                <InfoItem key={i}>
                  <LabelShimmer />
                  <ValueShimmer />
                </InfoItem>
              ))}
            </InfoGrid>
          </Card>

          {/* Actions Card */}
          <Card>
            <SectionTitleShimmer />
            <ActionsContainer>
              <ActionButtonShimmer />
              <ActionButtonShimmer />
              <ActionButtonShimmer />
              <ActionButtonShimmer />
            </ActionsContainer>
          </Card>
        </Content>
      </Container>
    </Layout>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButtonShimmer = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: ${shimmer} 1.5s infinite;
`;

const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleShimmer = styled.div`
  height: 32px;
  width: 300px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SubtitleShimmer = styled.div`
  height: 16px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 150px;
  }
`;

const Content = styled.div`
  padding: 0 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 0 16px 24px;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const NameShimmer = styled.div`
  height: 28px;
  width: 250px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 180px;
  }
`;

const BadgesShimmer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const BadgeShimmer = styled.div`
  height: 24px;
  width: 80px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: ${shimmer} 1.5s infinite;
`;

const SectionTitleShimmer = styled.div`
  height: 20px;
  width: 180px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite;
  margin-bottom: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelShimmer = styled.div`
  height: 14px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: ${shimmer} 1.5s infinite;
`;

const ValueShimmer = styled.div`
  height: 18px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: ${shimmer} 1.5s infinite;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButtonShimmer = styled.div`
  height: 44px;
  width: 150px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 25%,
    ${props => props.theme.colors.shimmerHighlight || '#e8e8e8'} 50%,
    ${props => props.theme.colors.shimmerBackground || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default MCMVLeadDetailsShimmer;
