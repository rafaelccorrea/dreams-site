import { Grid, Paper, Box } from '@mui/material'
import styled from 'styled-components'
import { ShimmerBase } from './Shimmer'

const StyledCard = styled(Paper)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  min-height: 180px;
`

const ShimmerAvatar = styled(ShimmerBase)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
`

const ContentContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.lg};
`

const ShimmerTitle = styled(ShimmerBase)`
  height: 24px;
  width: 70%;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
`

const ShimmerLocation = styled(ShimmerBase)`
  height: 16px;
  width: 50%;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
`

const ShimmerInfo = styled(ShimmerBase)`
  height: 16px;
  width: 80%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ShimmerInfoSmall = styled(ShimmerBase)`
  height: 16px;
  width: 60%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const PropertyCountContainer = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.neutralMedium};
  text-align: center;
`

const ShimmerBadge = styled(ShimmerBase)`
  height: 24px;
  width: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 0 auto;
`

interface BrokerCardShimmerProps {
  count?: number
}

export const BrokerCardShimmer = ({ count = 1 }: BrokerCardShimmerProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <StyledCard>
            <AvatarContainer>
              <ShimmerAvatar />
            </AvatarContainer>
            <ContentContainer>
              <ShimmerTitle />
              <ShimmerLocation />
              <ShimmerInfo />
              <ShimmerInfoSmall />
              <PropertyCountContainer>
                <ShimmerBadge />
              </PropertyCountContainer>
            </ContentContainer>
          </StyledCard>
        </Grid>
      ))}
    </>
  )
}






