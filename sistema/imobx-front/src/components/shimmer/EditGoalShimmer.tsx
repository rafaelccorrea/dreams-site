import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animação de shimmer
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Container principal
const ShimmerContainer = styled.div`
  padding: 24px;
  width: 100%;
`;

// Header shimmer
const HeaderShimmer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const TitleShimmer = styled.div`
  height: 32px;
  width: 200px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SubtitleShimmer = styled.div`
  height: 20px;
  width: 280px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
`;

const ButtonShimmer = styled.div`
  height: 44px;
  width: 120px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

// Form sections
const FormShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const SectionShimmer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
`;

const SectionTitleShimmer = styled.div`
  height: 24px;
  width: 180px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const SectionDescriptionShimmer = styled.div`
  height: 16px;
  width: 300px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 24px;
`;

const FieldShimmer = styled.div`
  margin-bottom: 20px;
`;

const LabelShimmer = styled.div`
  height: 16px;
  width: 100px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const InputShimmer = styled.div`
  height: 48px;
  width: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const RowShimmer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const TextareaShimmer = styled.div`
  height: 100px;
  width: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

const ColorPickerShimmer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ColorOptionShimmer = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 50%;
`;

const ActionsShimmer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
`;

const ActionButtonShimmer = styled.div`
  height: 48px;
  width: 140px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary} 25%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.backgroundSecondary} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
`;

export const EditGoalShimmer: React.FC = () => {
  return (
    <ShimmerContainer>
      {/* Header Shimmer */}
      <HeaderShimmer>
        <HeaderContent>
          <TitleShimmer />
          <SubtitleShimmer />
        </HeaderContent>
        <ButtonShimmer />
      </HeaderShimmer>

      {/* Form Shimmer */}
      <FormShimmer>
        {/* Section 1: Informações da Meta */}
        <SectionShimmer>
          <SectionTitleShimmer />
          <SectionDescriptionShimmer />

          <RowShimmer>
            <FieldShimmer>
              <LabelShimmer />
              <InputShimmer />
            </FieldShimmer>
            <FieldShimmer>
              <LabelShimmer />
              <InputShimmer />
            </FieldShimmer>
            <FieldShimmer>
              <LabelShimmer />
              <InputShimmer />
            </FieldShimmer>
          </RowShimmer>
        </SectionShimmer>

        {/* Section 2: Edição */}
        <SectionShimmer>
          <SectionTitleShimmer />
          <SectionDescriptionShimmer />

          <FieldShimmer>
            <LabelShimmer />
            <InputShimmer />
          </FieldShimmer>

          <FieldShimmer>
            <LabelShimmer />
            <TextareaShimmer />
          </FieldShimmer>

          <FieldShimmer>
            <LabelShimmer />
            <InputShimmer />
          </FieldShimmer>
        </SectionShimmer>

        {/* Section 3: Status */}
        <SectionShimmer>
          <SectionTitleShimmer />
          <SectionDescriptionShimmer />

          <RowShimmer>
            <FieldShimmer>
              <LabelShimmer />
              <InputShimmer />
            </FieldShimmer>
            <FieldShimmer>
              <LabelShimmer />
              <InputShimmer />
            </FieldShimmer>
          </RowShimmer>
        </SectionShimmer>

        {/* Section 4: Personalização */}
        <SectionShimmer>
          <SectionTitleShimmer />
          <SectionDescriptionShimmer />

          <FieldShimmer>
            <LabelShimmer />
            <ColorPickerShimmer>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <ColorOptionShimmer key={i} />
              ))}
            </ColorPickerShimmer>
          </FieldShimmer>

          <FieldShimmer>
            <LabelShimmer />
            <ColorPickerShimmer>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <ColorOptionShimmer key={i} />
              ))}
            </ColorPickerShimmer>
          </FieldShimmer>
        </SectionShimmer>
      </FormShimmer>

      {/* Actions Shimmer */}
      <ActionsShimmer>
        <ActionButtonShimmer />
      </ActionsShimmer>
    </ShimmerContainer>
  );
};

export default EditGoalShimmer;
