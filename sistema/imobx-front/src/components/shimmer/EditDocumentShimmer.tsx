import React from 'react';
import styled, { keyframes } from 'styled-components';

export const EditDocumentShimmer: React.FC = () => {
  return (
    <Container>
      <Header>
        <TitleShimmer />
        <ButtonShimmer />
      </Header>

      <Form>
        <FileInfoShimmer>
          <FileIconShimmer />
          <div style={{ flex: 1 }}>
            <FileNameShimmer />
            <FileSizeShimmer />
          </div>
        </FileInfoShimmer>

        <FormGroup>
          <LabelShimmer />
          <SelectShimmer />
        </FormGroup>

        <FormGroup>
          <LabelShimmer />
          <SelectShimmer />
        </FormGroup>

        <FormGroup>
          <LabelShimmer />
          <InputShimmer />
        </FormGroup>

        <FormGroup>
          <LabelShimmer />
          <TextAreaShimmer />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <LabelShimmer />
            <InputShimmer />
          </FormGroup>
          <FormGroup>
            <LabelShimmer />
            <InputShimmer />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <LabelShimmer />
          <TextAreaShimmer style={{ height: '80px' }} />
        </FormGroup>

        <ButtonGroup>
          <ButtonShimmer style={{ width: '120px' }} />
          <ButtonShimmer style={{ width: '180px' }} />
        </ButtonGroup>
      </Form>
    </Container>
  );
};

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

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
  border-radius: 0.5rem;
`;

const Container = styled.div`
  padding: 24px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
`;

const TitleShimmer = styled(ShimmerBase)`
  width: 200px;
  height: 40px;
`;

const ButtonShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 36px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelShimmer = styled(ShimmerBase)`
  width: 150px;
  height: 16px;
`;

const SelectShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const InputShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 44px;
`;

const TextAreaShimmer = styled(ShimmerBase)`
  width: 100%;
  height: 100px;
`;

const FileInfoShimmer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const FileIconShimmer = styled(ShimmerBase)`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const FileNameShimmer = styled(ShimmerBase)`
  width: 250px;
  height: 16px;
  margin-bottom: 4px;
`;

const FileSizeShimmer = styled(ShimmerBase)`
  width: 100px;
  height: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

export default EditDocumentShimmer;
