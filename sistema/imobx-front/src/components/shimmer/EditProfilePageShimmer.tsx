import React from 'react';
import styled from 'styled-components';
import { ShimmerBase } from '../common/Shimmer';

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 0 24px 32px 24px;
  max-width: 100%;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 0 16px 24px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 300px;
  height: 32px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const SubtitleShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 16px;
  border-radius: 4px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 120px;
  height: 44px;
  border-radius: 12px;
`;

const Section = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
`;

const SectionTitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FormGroupShimmer = styled.div`
  margin-bottom: 20px;
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 16px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 48px;
  border-radius: 12px;
`;

const ActionsShimmer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 0;
`;

export const EditProfilePageShimmer: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <div>
            <TitleShimmer />
            <SubtitleShimmer />
          </div>
          <ButtonShimmer />
        </HeaderContent>
      </Header>

      <Section>
        <SectionTitleShimmer />
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
      </Section>

      <Section>
        <SectionTitleShimmer />
        <FormGroupShimmer>
          <LabelShimmer />
          <InputShimmer />
        </FormGroupShimmer>
      </Section>

      <ActionsShimmer>
        <ButtonShimmer />
        <ButtonShimmer />
      </ActionsShimmer>
    </Container>
  );
};

export default EditProfilePageShimmer;
