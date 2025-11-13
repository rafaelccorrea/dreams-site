import { Box, Paper, Tabs, Tab, Grid } from '@mui/material'
import styled from 'styled-components'
import { ShimmerBase } from './Shimmer'
import { PageContainer, PageHeader, PageContent } from '../PageContainer'

const ShimmerTitle = styled(ShimmerBase)`
  height: 48px;
  width: 400px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: 600px) {
    width: 250px;
    height: 36px;
  }
`

const ShimmerChip = styled(ShimmerBase)`
  height: 32px;
  width: 150px;
  border-radius: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ShimmerDescription = styled(ShimmerBase)`
  height: 24px;
  width: 80%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  &:nth-child(2) {
    width: 60%;
  }

  @media (max-width: 600px) {
    width: 90%;
  }
`

const ShimmerField = styled(ShimmerBase)`
  height: 56px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ShimmerButton = styled(ShimmerBase)`
  height: 48px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ShimmerCheckbox = styled(ShimmerBase)`
  height: 20px;
  width: 20px;
  margin-right: ${({ theme }) => theme.spacing.sm};
  border-radius: 4px;
`

const ShimmerLabel = styled(ShimmerBase)`
  height: 16px;
  width: 200px;
`

const ShimmerDivider = styled(ShimmerBase)`
  height: 1px;
  width: 100%;
  margin: ${({ theme }) => theme.spacing.lg} 0;
`

export const McmvPageShimmer = () => {
  return (
    <PageContainer>
      <PageHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <ShimmerTitle />
          <ShimmerChip />
        </Box>
        <Box>
          <ShimmerDescription />
          <ShimmerDescription />
        </Box>
      </PageHeader>

      <PageContent>
        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 72,
              },
            }}
          >
            <Tab label="Verificar Elegibilidade" disabled />
            <Tab label="Simular Financiamento" disabled />
            <Tab label="Pré-cadastro" disabled />
          </Tabs>

          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Grid container spacing={3}>
              {/* Primeira linha - 2 campos */}
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>

              {/* Segunda linha - 2 campos */}
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>

              {/* Terceira linha - 2 campos */}
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>

              {/* Divider */}
              <Grid item xs={12}>
                <ShimmerDivider />
              </Grid>

              {/* Quarta linha - 2 campos */}
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>

              {/* Quinta linha - 1 campo */}
              <Grid item xs={12} md={6}>
                <ShimmerField />
              </Grid>

              {/* Checkbox */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShimmerCheckbox />
                  <ShimmerLabel />
                </Box>
              </Grid>

              {/* Botão */}
              <Grid item xs={12}>
                <ShimmerButton />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </PageContent>
    </PageContainer>
  )
}

