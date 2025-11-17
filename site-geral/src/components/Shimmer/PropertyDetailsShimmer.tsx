import { Grid, Paper } from '@mui/material'
import styled from 'styled-components'
import { ShimmerBase } from './Shimmer'

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 100px);
  padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`

const ImageContainer = styled.div`
  flex: 1;
  min-height: 500px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.neutralLight};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 300px;
  }
`

const ShimmerImage = styled(ShimmerBase)`
  width: 100%;
  height: 100%;
`

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const ShimmerTitle = styled(ShimmerBase)`
  height: 32px;
  width: 70%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const ShimmerSubtitle = styled(ShimmerBase)`
  height: 20px;
  width: 50%;
`

const ShimmerPriceBox = styled(ShimmerBase)`
  height: 100px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ShimmerFeatureBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ShimmerFeature = styled(ShimmerBase)`
  height: 20px;
  width: 100px;
`

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const ShimmerText = styled(ShimmerBase)<{ lines?: number }>`
  height: 16px;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:nth-child(2) {
    width: 95%;
  }
  
  &:nth-child(3) {
    width: 90%;
  }
`

const ShimmerContactCard = styled(StyledPaper)`
  min-height: 300px;
`

const ShimmerContactTitle = styled(ShimmerBase)`
  height: 28px;
  width: 60%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ShimmerContactInfo = styled(ShimmerBase)`
  height: 20px;
  width: 80%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const ShimmerButton = styled(ShimmerBase)`
  height: 48px;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`

export const PropertyDetailsShimmer = () => {
  return (
    <Container>
      <HeaderSection>
        <ImageContainer>
          <ShimmerImage />
        </ImageContainer>

        <InfoContainer>
          <div>
            <ShimmerBase
              style={{
                height: '24px',
                width: '80px',
                marginBottom: '8px',
                borderRadius: '12px',
              }}
            />
            <ShimmerTitle />
            <ShimmerSubtitle />
          </div>

          <ShimmerPriceBox />

          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <ShimmerFeatureBox>
                  <ShimmerFeature />
                </ShimmerFeatureBox>
              </Grid>
            ))}
          </Grid>
        </InfoContainer>
      </HeaderSection>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <ShimmerTitle style={{ width: '30%', marginBottom: '16px' }} />
            <div style={{ marginBottom: '16px' }}>
              <ShimmerText />
              <ShimmerText />
              <ShimmerText />
              <ShimmerText />
            </div>
          </StyledPaper>

          <StyledPaper style={{ marginTop: '24px' }}>
            <ShimmerTitle style={{ width: '40%', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map((index) => (
                <ShimmerBase
                  key={index}
                  style={{
                    height: '32px',
                    width: '100px',
                    borderRadius: '16px',
                  }}
                />
              ))}
            </div>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <ShimmerContactCard>
            <ShimmerContactTitle />
            <div>
              <ShimmerContactInfo />
              <ShimmerContactInfo />
              <ShimmerContactInfo />
            </div>
            <ShimmerButton />
          </ShimmerContactCard>
        </Grid>
      </Grid>
    </Container>
  )
}

















