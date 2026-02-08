import React from 'react';
import styled, { keyframes } from 'styled-components';

export const DocumentsShimmer: React.FC = () => {
  return (
    <Container>
      {/* Documents Table Shimmer */}
      <TableWrapper>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <CheckboxHeaderShimmer>
                  <CheckboxShimmer />
                </CheckboxHeaderShimmer>
                <HeaderCellShimmer>Cliente/Propriedade</HeaderCellShimmer>
                <HeaderCellShimmer>Tipo</HeaderCellShimmer>
                <HeaderCellShimmer>Tags</HeaderCellShimmer>
                <HeaderCellShimmer>Tamanho</HeaderCellShimmer>
                <HeaderCellShimmer>Status</HeaderCellShimmer>
                <HeaderCellShimmer>Assinaturas</HeaderCellShimmer>
                <HeaderCellShimmer>Vencimento</HeaderCellShimmer>
                <HeaderCellShimmer>Upload</HeaderCellShimmer>
                <HeaderCellShimmer
                  style={{ minWidth: '80px', position: 'sticky', right: 0 }}
                >
                  Ações
                </HeaderCellShimmer>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <TableRowShimmer key={i}>
                  <CheckboxCellShimmer>
                    <CheckboxShimmer />
                  </CheckboxCellShimmer>

                  <ClientCellShimmer>
                    <EntityIconShimmer />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <LineShimmer
                        style={{
                          width: '70%',
                          height: '14px',
                          marginBottom: '6px',
                        }}
                      />
                      <LineShimmer style={{ width: '50%', height: '12px' }} />
                    </div>
                  </ClientCellShimmer>

                  <TypeCellShimmer>
                    <BadgeShimmer style={{ width: '100px', height: '24px' }} />
                  </TypeCellShimmer>

                  <TagsCellShimmer>
                    <TagsListShimmer>
                      <TagBadgeShimmer
                        style={{ width: '60px', height: '22px' }}
                      />
                      {i % 3 === 0 && (
                        <TagBadgeShimmer
                          style={{ width: '50px', height: '22px' }}
                        />
                      )}
                    </TagsListShimmer>
                  </TagsCellShimmer>

                  <SizeCellShimmer>
                    <LineShimmer style={{ width: '70px', height: '14px' }} />
                  </SizeCellShimmer>

                  <StatusCellShimmer>
                    <BadgeShimmer style={{ width: '90px', height: '24px' }} />
                  </StatusCellShimmer>

                  <SignatureCellShimmer>
                    <SignatureInfoShimmer>
                      <SignatureBadgesShimmer>
                        <SmallBadgeShimmer
                          style={{ width: '60px', height: '20px' }}
                        />
                        {i % 2 === 0 && (
                          <SmallBadgeShimmer
                            style={{ width: '60px', height: '20px' }}
                          />
                        )}
                      </SignatureBadgesShimmer>
                      <LineShimmer
                        style={{
                          width: '40px',
                          height: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </SignatureInfoShimmer>
                  </SignatureCellShimmer>

                  <ExpiryCellShimmer>
                    {i % 4 === 0 ? (
                      <LineShimmer style={{ width: '100px', height: '14px' }} />
                    ) : (
                      <LineShimmer style={{ width: '80px', height: '14px' }} />
                    )}
                  </ExpiryCellShimmer>

                  <UploadCellShimmer>
                    <LineShimmer style={{ width: '90px', height: '14px' }} />
                  </UploadCellShimmer>

                  <ActionsCellShimmer>
                    <ActionButtonShimmer />
                  </ActionsCellShimmer>
                </TableRowShimmer>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </Container>
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

// Styled Components
const Container = styled.div`
  width: 100%;
  background: ${props => props.theme.colors.background || '#ffffff'};
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  position: relative;
`;

const TableContainer = styled.div`
  width: 100%;
  min-width: 1200px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableRow = styled.tr``;

const TableBody = styled.tbody``;

const ShimmerBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => (props.theme.mode === 'dark' ? '#1e293b' : '#f1f5f9')} 0%,
    ${props => (props.theme.mode === 'dark' ? '#334155' : '#e2e8f0')} 25%,
    ${props => (props.theme.mode === 'dark' ? '#475569' : '#cbd5e1')} 50%,
    ${props => (props.theme.mode === 'dark' ? '#334155' : '#e2e8f0')} 75%,
    ${props => (props.theme.mode === 'dark' ? '#1e293b' : '#f1f5f9')} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 6px;
`;

const CheckboxHeaderShimmer = styled.th`
  padding: 16px 12px;
  width: 50px;
  text-align: center;
`;

const CheckboxCellShimmer = styled.td`
  padding: 16px 12px;
  text-align: center;
`;

const CheckboxShimmer = styled(ShimmerBase)`
  width: 20px;
  height: 20px;
  margin: 0 auto;
  border-radius: 4px;
`;

const HeaderCellShimmer = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const TableRowShimmer = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary}20;
  }
`;

const ClientCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 200px;
`;

const EntityIconShimmer = styled(ShimmerBase)`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  display: inline-block;
  margin-right: 12px;
  vertical-align: middle;
`;

const TypeCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 120px;
`;

const TagsCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 150px;
`;

const TagsListShimmer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

const TagBadgeShimmer = styled(ShimmerBase)`
  border-radius: 12px;
`;

const SizeCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 100px;
  white-space: nowrap;
`;

const StatusCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 120px;
`;

const SignatureCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 140px;
`;

const SignatureInfoShimmer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SignatureBadgesShimmer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const SmallBadgeShimmer = styled(ShimmerBase)`
  border-radius: 12px;
`;

const ExpiryCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 120px;
  white-space: nowrap;
`;

const UploadCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 120px;
  white-space: nowrap;
`;

const ActionsCellShimmer = styled.td`
  padding: 16px 12px;
  min-width: 80px;
  width: 80px;
  position: sticky;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  z-index: 1;
`;

const ActionButtonShimmer = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin: 0 auto;
`;

const BadgeShimmer = styled(ShimmerBase)`
  border-radius: 12px;
`;

const LineShimmer = styled(ShimmerBase)`
  display: block;
`;

export default DocumentsShimmer;
