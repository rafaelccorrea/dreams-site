import { Grid, Card, CardContent, CardMedia } from '@mui/material'
import styled from 'styled-components'
import { ShimmerBase } from './Shimmer'

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const StyledCardMedia = styled(CardMedia)`
  height: 250px;
  position: relative;
  overflow: hidden;
`

const ShimmerImage = styled(ShimmerBase)`
  width: 100%;
  height: 100%;
`

const ShimmerPriceBadge = styled(ShimmerBase)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 100px;
  height: 35px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const CardContentStyled = styled(CardContent)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`

const ShimmerTitle = styled(ShimmerBase)`
  height: 24px;
  width: 80%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const ShimmerAddress = styled(ShimmerBase)`
  height: 16px;
  width: 60%;
`

const ShimmerDescription = styled(ShimmerBase)`
  height: 16px;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:nth-child(2) {
    width: 90%;
  }
`

const FeaturesContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const ShimmerFeature = styled(ShimmerBase)`
  height: 20px;
  width: 80px;
`

const ChipsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
  margin-top: auto;
`

const ShimmerChip = styled(ShimmerBase)`
  height: 24px;
  width: 90px;
  border-radius: 12px;
`

interface PropertyCardShimmerProps {
  count?: number
}

export const PropertyCardShimmer = ({ count = 1 }: PropertyCardShimmerProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <StyledCard>
            <StyledCardMedia>
              <ShimmerImage />
              <ShimmerPriceBadge />
            </StyledCardMedia>
            <CardContentStyled>
              <ShimmerTitle />
              <ShimmerAddress />
              <ShimmerDescription />
              <ShimmerDescription />
              <FeaturesContainer>
                <ShimmerFeature />
                <ShimmerFeature />
                <ShimmerFeature />
              </FeaturesContainer>
              <ChipsContainer>
                <ShimmerChip />
                <ShimmerChip />
                <ShimmerChip />
              </ChipsContainer>
            </CardContentStyled>
          </StyledCard>
        </Grid>
      ))}
    </>
  )
}








