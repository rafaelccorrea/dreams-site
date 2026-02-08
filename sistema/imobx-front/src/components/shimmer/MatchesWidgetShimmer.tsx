import React from 'react';
import styled, { keyframes } from 'styled-components';

export const MatchesWidgetShimmer: React.FC = () => {
  return (
    <Card>
      <Header>
        <HeaderLeft>
          <IconShimmer />
          <TitleShimmer />
        </HeaderLeft>
        <BadgeShimmer />
      </Header>

      <Stats>
        <StatItem>
          <StatValueShimmer />
          <StatLabelShimmer />
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatValueShimmer />
          <StatLabelShimmer />
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatValueShimmer />
          <StatLabelShimmer />
        </StatItem>
      </Stats>

      <RecentSection>
        <SectionTitleShimmer />
        {[1, 2, 3].map(i => (
          <MatchItem key={i}>
            <MatchContent>
              <MatchHeaderShimmer>
                <MainTitleShimmer />
                <TimeShimmer />
              </MatchHeaderShimmer>

              <SubInfoShimmer />

              <ContactRow>
                <ContactShimmer />
                <ContactShimmer />
              </ContactRow>

              <DetailsRow>
                <PriceShimmer />
                <TypeShimmer />
                <LocationShimmer />
              </DetailsRow>

              <FeaturesRow>
                <FeatureShimmer />
                <FeatureShimmer />
                <FeatureShimmer />
              </FeaturesRow>
            </MatchContent>
          </MatchItem>
        ))}
      </RecentSection>
    </Card>
  );
};

// Animations
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Base Shimmer
const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    #e2e8f0 0%,
    #cbd5e1 25%,
    #94a3b8 50%,
    #cbd5e1 75%,
    #e2e8f0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease-in-out infinite;
  border-radius: 8px;
`;

// Styled Components
const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconShimmer = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 180px;
  height: 24px;
`;

const BadgeShimmer = styled(ShimmerBase)`
  width: 40px;
  height: 28px;
  border-radius: 14px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatValueShimmer = styled(ShimmerBase)`
  width: 60px;
  height: 32px;
  border-radius: 8px;
`;

const StatLabelShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 16px;
  border-radius: 6px;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: ${props => props.theme.colors.border};
`;

const RecentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 20px;
  margin-bottom: 8px;
`;

const MatchItem = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const MatchContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MatchHeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const MainTitleShimmer = styled(ShimmerBase)`
  width: 70%;
  height: 18px;
`;

const TimeShimmer = styled(ShimmerBase)`
  width: 80px;
  height: 14px;
`;

const SubInfoShimmer = styled(ShimmerBase)`
  width: 60%;
  height: 16px;
`;

const ContactRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ContactShimmer = styled(ShimmerBase)`
  width: 140px;
  height: 14px;
`;

const DetailsRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const PriceShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 20px;
  border-radius: 10px;
`;

const TypeShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 20px;
  border-radius: 10px;
`;

const LocationShimmer = styled(ShimmerBase)`
  width: 160px;
  height: 14px;
`;

const FeaturesRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FeatureShimmer = styled(ShimmerBase)`
  width: 90px;
  height: 16px;
  border-radius: 8px;
`;
