import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  PageContainer,
  PageContent,
  PageHeader,
  PageTitleContainer,
  PageTitle,
  PageSubtitle,
  TabsContainer,
  Tab,
  ContentCard,
  TreeContainer,
  TreeNode,
  TreeNodeContent,
  TreeNodeChildren,
  AssignSection,
  SectionTitle,
  FormGroup,
  Label,
  SearchWrapper,
  CheckboxGroup,
  CheckboxItem,
} from '../../styles/pages/HierarchyPageStyles';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ShimmerBase = styled.div<{
  $width?: string;
  $height?: string;
  $radius?: string;
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
  border-radius: ${props => props.$radius || '8px'};
`;

const ShimmerAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const ShimmerTab = styled.div`
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ShimmerTreeNodeContent = styled(TreeNodeContent)`
  background: ${props => props.theme.colors.cardBackground} !important;
  border: 2px solid ${props => props.theme.colors.border} !important;
  box-shadow: none !important;

  &::before {
    display: none;
  }

  &:hover {
    transform: none !important;
    box-shadow: none !important;
  }
`;

const ShimmerCheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
`;

const HierarchyShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageContent>
        {/* Header */}
        <PageHeader>
          <PageTitleContainer>
            <div>
              <div style={{ marginBottom: '12px' }}>
                <ShimmerBase $width='350px' $height='40px' />
              </div>
              <div>
                <ShimmerBase $width='600px' $height='20px' />
              </div>
            </div>
          </PageTitleContainer>
        </PageHeader>

        {/* Tabs */}
        <TabsContainer>
          <ShimmerTab>
            <ShimmerBase $width='24px' $height='24px' $radius='4px' />
            <ShimmerBase $width='180px' $height='20px' />
          </ShimmerTab>
          <ShimmerTab>
            <ShimmerBase $width='24px' $height='24px' $radius='4px' />
            <ShimmerBase $width='140px' $height='20px' />
          </ShimmerTab>
        </TabsContainer>

        {/* Content Card */}
        <ContentCard>
          {/* Tree View Shimmer */}
          <TreeContainer>
            {/* Info Tip Box Shimmer */}
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <ShimmerBase $width='400px' $height='20px' />
            </div>

            {/* Root Node 1 */}
            <TreeNode $level={0}>
              <ShimmerTreeNodeContent $role='admin'>
                <ShimmerBase $width='28px' $height='28px' $radius='4px' />
                <ShimmerAvatar>
                  <ShimmerBase $width='100%' $height='100%' $radius='50%' />
                </ShimmerAvatar>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <ShimmerBase $width='200px' $height='18px' />
                  <ShimmerBase $width='250px' $height='14px' />
                </div>
                <ShimmerBase $width='80px' $height='24px' $radius='12px' />
                <ShimmerBase $width='100px' $height='24px' $radius='12px' />
              </ShimmerTreeNodeContent>

              {/* Child Nodes */}
              <TreeNodeChildren>
                <TreeNode $level={1}>
                  <ShimmerTreeNodeContent $role='manager'>
                    <ShimmerBase $width='28px' $height='28px' $radius='4px' />
                    <ShimmerAvatar>
                      <ShimmerBase $width='100%' $height='100%' $radius='50%' />
                    </ShimmerAvatar>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <ShimmerBase $width='180px' $height='18px' />
                      <ShimmerBase $width='220px' $height='14px' />
                    </div>
                    <ShimmerBase $width='70px' $height='24px' $radius='12px' />
                  </ShimmerTreeNodeContent>
                </TreeNode>

                <TreeNode $level={1}>
                  <ShimmerTreeNodeContent $role='user'>
                    <ShimmerBase $width='28px' $height='28px' $radius='4px' />
                    <ShimmerAvatar>
                      <ShimmerBase $width='100%' $height='100%' $radius='50%' />
                    </ShimmerAvatar>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <ShimmerBase $width='170px' $height='18px' />
                      <ShimmerBase $width='200px' $height='14px' />
                    </div>
                    <ShimmerBase $width='70px' $height='24px' $radius='12px' />
                  </ShimmerTreeNodeContent>
                </TreeNode>
              </TreeNodeChildren>
            </TreeNode>

            {/* Root Node 2 */}
            <TreeNode $level={0}>
              <ShimmerTreeNodeContent $role='manager'>
                <ShimmerBase $width='28px' $height='28px' $radius='4px' />
                <ShimmerAvatar>
                  <ShimmerBase $width='100%' $height='100%' $radius='50%' />
                </ShimmerAvatar>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <ShimmerBase $width='190px' $height='18px' />
                  <ShimmerBase $width='240px' $height='14px' />
                </div>
                <ShimmerBase $width='80px' $height='24px' $radius='12px' />
                <ShimmerBase $width='100px' $height='24px' $radius='12px' />
              </ShimmerTreeNodeContent>

              {/* Child Nodes */}
              <TreeNodeChildren>
                <TreeNode $level={1}>
                  <ShimmerTreeNodeContent $role='user'>
                    <ShimmerBase $width='28px' $height='28px' $radius='4px' />
                    <ShimmerAvatar>
                      <ShimmerBase $width='100%' $height='100%' $radius='50%' />
                    </ShimmerAvatar>
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <ShimmerBase $width='160px' $height='18px' />
                      <ShimmerBase $width='210px' $height='14px' />
                    </div>
                    <ShimmerBase $width='70px' $height='24px' $radius='12px' />
                  </ShimmerTreeNodeContent>
                </TreeNode>
              </TreeNodeChildren>
            </TreeNode>
          </TreeContainer>
        </ContentCard>
      </PageContent>
    </PageContainer>
  );
};

export default HierarchyShimmer;
