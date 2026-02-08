import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const ShimmerContainer = styled.div`
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
`;

const HeaderShimmer = styled.div`
  margin-bottom: 24px;
`;

const TitleShimmer = styled.div`
  height: 32px;
  width: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SubtitleShimmer = styled.div`
  height: 20px;
  width: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
`;

const SectionShimmer = styled.div`
  margin-bottom: 24px;
`;

const SectionTitleShimmer = styled.div`
  height: 24px;
  width: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const CardShimmer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const CardHeaderShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const IconShimmer = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const CardContentShimmer = styled.div`
  flex: 1;
`;

const CardTitleShimmer = styled.div`
  height: 20px;
  width: 80%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const CardDescriptionShimmer = styled.div`
  height: 16px;
  width: 60%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const ProjectsGridShimmer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const ProjectCardShimmer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
`;

const ProjectHeaderShimmer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

const ProjectIconShimmer = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ProjectContentShimmer = styled.div`
  flex: 1;
`;

const ProjectTitleShimmer = styled.div`
  height: 18px;
  width: 70%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProjectDescriptionShimmer = styled.div`
  height: 14px;
  width: 90%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 4px;
`;

const ProjectDetailsShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const DetailItemShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailIconShimmer = styled.div`
  width: 12px;
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 2px;
`;

const DetailTextShimmer = styled.div`
  height: 14px;
  width: 120px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`;

const StatusBadgeShimmer = styled.div`
  height: 24px;
  width: 80px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 12px;
  margin-left: auto;
`;

const CreateButtonShimmer = styled.div`
  height: 40px;
  width: 160px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ProjectSelectionShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      <HeaderShimmer>
        <TitleShimmer />
        <SubtitleShimmer />
      </HeaderShimmer>

      {/* Team Section Shimmer */}
      <SectionShimmer>
        <SectionTitleShimmer />
        <CardShimmer>
          <CardHeaderShimmer>
            <IconShimmer />
            <CardContentShimmer>
              <CardTitleShimmer />
              <CardDescriptionShimmer />
            </CardContentShimmer>
          </CardHeaderShimmer>
        </CardShimmer>
      </SectionShimmer>

      {/* Projects Section Shimmer */}
      <SectionShimmer>
        <SectionTitleShimmer />
        <CreateButtonShimmer />
        <ProjectsGridShimmer>
          {[1, 2, 3].map(index => (
            <ProjectCardShimmer key={index}>
              <ProjectHeaderShimmer>
                <ProjectIconShimmer />
                <ProjectContentShimmer>
                  <ProjectTitleShimmer />
                  <ProjectDescriptionShimmer />
                </ProjectContentShimmer>
                <StatusBadgeShimmer />
              </ProjectHeaderShimmer>

              <ProjectDetailsShimmer>
                <DetailItemShimmer>
                  <DetailIconShimmer />
                  <DetailTextShimmer />
                </DetailItemShimmer>
                <DetailItemShimmer>
                  <DetailIconShimmer />
                  <DetailTextShimmer />
                </DetailItemShimmer>
                <DetailItemShimmer>
                  <DetailIconShimmer />
                  <DetailTextShimmer />
                </DetailItemShimmer>
              </ProjectDetailsShimmer>
            </ProjectCardShimmer>
          ))}
        </ProjectsGridShimmer>
      </SectionShimmer>
    </ShimmerContainer>
  );
};

export default ProjectSelectionShimmer;
