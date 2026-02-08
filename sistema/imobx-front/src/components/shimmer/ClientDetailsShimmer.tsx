import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Layout } from '../layout/Layout';

// Definir a animação shimmer ANTES dos componentes
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const ClientDetailsShimmer: React.FC = () => {
  return (
    <Layout>
      <Container>
        {/* Header */}
        <Header>
          <HeaderContent>
            <TitleShimmer />
            <SubtitleShimmer />
          </HeaderContent>
          <ActionsShimmer>
            <ButtonShimmer />
            <ButtonShimmer />
          </ActionsShimmer>
        </Header>

        {/* Content */}
        <Content>
          {/* Main Content */}
          <MainColumn>
            {/* Client Header Card */}
            <Card>
              <ClientHeaderShimmer>
                <AvatarShimmer />
                <ClientInfoShimmer>
                  <NameShimmer />
                  <BadgesShimmer>
                    <BadgeShimmer />
                    <BadgeShimmer />
                    <BadgeShimmer />
                  </BadgesShimmer>
                  <ContactShimmer />
                </ClientInfoShimmer>
              </ClientHeaderShimmer>
              <SectionTitleShimmer />
              <GridShimmer>
                <ItemShimmer />
                <ItemShimmer />
                <ItemShimmer />
                <ItemShimmer />
              </GridShimmer>
            </Card>

            {/* Additional Cards */}
            <Card>
              <SectionTitleShimmer />
              <GridShimmer>
                <ItemShimmer />
                <ItemShimmer />
                <ItemShimmer />
                <ItemShimmer />
              </GridShimmer>
            </Card>

            <Card>
              <SectionTitleShimmer />
              <GridShimmer>
                <ItemShimmer />
                <ItemShimmer />
                <ItemShimmer />
                <ItemShimmer />
              </GridShimmer>
            </Card>
          </MainColumn>

          {/* Sidebar */}
          <SideColumn>
            <Card>
              <SectionTitleShimmer />
              <PreferencesShimmer>
                <PreferenceItemShimmer />
                <PreferenceItemShimmer />
                <PreferenceItemShimmer />
                <PreferenceItemShimmer />
              </PreferencesShimmer>
              <FeaturesShimmer>
                <FeatureTagShimmer />
                <FeatureTagShimmer />
                <FeatureTagShimmer />
              </FeaturesShimmer>
            </Card>

            <Card>
              <SectionTitleShimmer />
              <GridShimmer>
                <ItemShimmer />
                <ItemShimmer />
              </GridShimmer>
            </Card>
          </SideColumn>
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
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const TitleShimmer = styled.div`
  height: 32px;
  width: 300px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
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
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 150px;
  }
`;

const ActionsShimmer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ButtonShimmer = styled.div`
  height: 44px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: ${shimmer} 1.5s infinite;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Content = styled.div`
  padding: 0 24px 32px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 0 16px 24px;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const ClientHeaderShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AvatarShimmer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
  }
`;

const ClientInfoShimmer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NameShimmer = styled.div`
  height: 28px;
  width: 250px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
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
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 12px;
  animation: ${shimmer} 1.5s infinite;
`;

const ContactShimmer = styled.div`
  height: 16px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite;
`;

const SectionTitleShimmer = styled.div`
  height: 20px;
  width: 180px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite;
  margin-bottom: 16px;
`;

const GridShimmer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ItemShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &::before {
    content: '';
    height: 12px;
    width: 80px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.shimmerBackground} 25%,
      ${props => props.theme.colors.shimmerHighlight} 50%,
      ${props => props.theme.colors.shimmerBackground} 75%
    );
    background-size: 200% 100%;
    border-radius: 4px;
    animation: ${shimmer} 1.5s infinite;
  }

  &::after {
    content: '';
    height: 16px;
    width: 120px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.shimmerBackground} 25%,
      ${props => props.theme.colors.shimmerHighlight} 50%,
      ${props => props.theme.colors.shimmerBackground} 75%
    );
    background-size: 200% 100%;
    border-radius: 4px;
    animation: ${shimmer} 1.5s infinite;
  }
`;

const PreferencesShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PreferenceItemShimmer = styled.div`
  height: 44px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 8px;
  animation: ${shimmer} 1.5s infinite;
`;

const FeaturesShimmer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const FeatureTagShimmer = styled.div`
  height: 30px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.shimmerBackground} 25%,
    ${props => props.theme.colors.shimmerHighlight} 50%,
    ${props => props.theme.colors.shimmerBackground} 75%
  );
  background-size: 200% 100%;
  border-radius: 16px;
  animation: ${shimmer} 1.5s infinite;
`;

export default ClientDetailsShimmer;
