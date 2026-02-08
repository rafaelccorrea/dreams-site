import React from 'react';
import { Skeleton } from 'antd';
import {
  PageContainer,
  PageContent,
  PageHeader,
  SummaryContainer,
  SummaryCard,
  SummaryIcon,
  SummaryValue,
  SummaryLabel,
  ActionsBar,
  LeftActions,
  RightActions,
  TransactionsCard,
  TransactionsTable,
  TableHeader,
  TableRow,
  TableCell,
  PaginationWrapper,
} from '../../styles/pages/FinancialPageStyles';

const FinancialShimmer: React.FC = () => {
  return (
    <PageContainer>
      <PageContent>
        {/* Header Shimmer */}
        <PageHeader>
          <div>
            <Skeleton.Input
              active
              size='large'
              style={{ width: 300, height: 40 }}
            />
            <Skeleton.Input
              active
              style={{ width: 400, height: 20, marginTop: 8 }}
            />
          </div>
        </PageHeader>

        {/* Summary Cards Shimmer */}
        <SummaryContainer>
          <SummaryCard>
            <SummaryIcon>
              <Skeleton.Avatar active size={40} />
            </SummaryIcon>
            <SummaryValue>
              <Skeleton.Input
                active
                size='large'
                style={{ width: 120, height: 32 }}
              />
            </SummaryValue>
            <SummaryLabel>
              <Skeleton.Input active style={{ width: 100, height: 16 }} />
            </SummaryLabel>
          </SummaryCard>

          <SummaryCard>
            <SummaryIcon>
              <Skeleton.Avatar active size={40} />
            </SummaryIcon>
            <SummaryValue>
              <Skeleton.Input
                active
                size='large'
                style={{ width: 120, height: 32 }}
              />
            </SummaryValue>
            <SummaryLabel>
              <Skeleton.Input active style={{ width: 100, height: 16 }} />
            </SummaryLabel>
          </SummaryCard>

          <SummaryCard>
            <SummaryIcon>
              <Skeleton.Avatar active size={40} />
            </SummaryIcon>
            <SummaryValue>
              <Skeleton.Input
                active
                size='large'
                style={{ width: 120, height: 32 }}
              />
            </SummaryValue>
            <SummaryLabel>
              <Skeleton.Input active style={{ width: 100, height: 16 }} />
            </SummaryLabel>
          </SummaryCard>
        </SummaryContainer>

        {/* Actions Shimmer */}
        <ActionsBar>
          <LeftActions>
            <Skeleton.Button active size='default' style={{ width: 100 }} />
            <Skeleton.Button active size='default' style={{ width: 100 }} />
          </LeftActions>
          <RightActions>
            <Skeleton.Button active size='large' style={{ width: 150 }} />
          </RightActions>
        </ActionsBar>

        {/* Transactions Table Shimmer */}
        <TransactionsCard>
          <TransactionsTable>
            <TableHeader>
              <TableCell>Transação</TableCell>
              <TableCell $align='center'>Valor</TableCell>
              <TableCell $align='center'>Data</TableCell>
              <TableCell $align='center'>Status</TableCell>
              <TableCell $align='center'>Tipo</TableCell>
              <TableCell $align='center'>Ações</TableCell>
            </TableHeader>

            {/* Transaction Rows Shimmer */}
            {[1, 2, 3, 4, 5].map(index => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <Skeleton.Input
                      active
                      style={{ width: 200, height: 20, marginBottom: '4px' }}
                    />
                    <Skeleton.Input
                      active
                      style={{ width: 150, height: 16, marginBottom: '4px' }}
                    />
                    <Skeleton.Input active style={{ width: 120, height: 14 }} />
                  </div>
                </TableCell>
                <TableCell $align='center'>
                  <Skeleton.Input active style={{ width: 80, height: 20 }} />
                </TableCell>
                <TableCell $align='center'>
                  <Skeleton.Input active style={{ width: 80, height: 16 }} />
                </TableCell>
                <TableCell $align='center'>
                  <Skeleton.Button active size='small' style={{ width: 60 }} />
                </TableCell>
                <TableCell $align='center'>
                  <Skeleton.Button active size='small' style={{ width: 60 }} />
                </TableCell>
                <TableCell $align='center'>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'center',
                    }}
                  >
                    <Skeleton.Button
                      active
                      size='small'
                      style={{ width: 32 }}
                    />
                    <Skeleton.Button
                      active
                      size='small'
                      style={{ width: 32 }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TransactionsTable>
        </TransactionsCard>

        {/* Pagination Shimmer */}
        <PaginationWrapper>
          <Skeleton.Button active size='default' style={{ width: 80 }} />
          <Skeleton.Input active style={{ width: 200, height: 20 }} />
          <Skeleton.Button active size='default' style={{ width: 80 }} />
        </PaginationWrapper>
      </PageContent>
    </PageContainer>
  );
};

export default FinancialShimmer;
