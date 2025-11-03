import { useState } from 'react'
import { LocationOn } from '@mui/icons-material'
import { Typography } from '@mui/material'
import styled from 'styled-components'
import { useLocation } from '../../contexts/LocationContext'
import { LocationModal } from '../LocationModal'

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color ${({ theme }) => theme.transitions.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutralLight};
  }
`

const LocationText = styled(Typography)`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const LocationIndicator = () => {
  const { location } = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  if (!location) {
    return null
  }

  const locationText = `${location.city}, ${location.state}`

  return (
    <>
      <IndicatorContainer onClick={() => setModalOpen(true)}>
        <LocationText variant="body2">
          <LocationOn fontSize="small" />
          {locationText}
        </LocationText>
      </IndicatorContainer>
      <LocationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

