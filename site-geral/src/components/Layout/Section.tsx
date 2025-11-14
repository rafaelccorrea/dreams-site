import styled from 'styled-components'

interface SectionProps {
  $padding?: 'sm' | 'md' | 'lg' | 'xl'
  $background?: 'default' | 'surface' | 'primary' | 'gradient'
}

export const Section = styled.section<SectionProps>`
  width: 100%;
  padding: ${({ $padding, theme }) => {
    switch ($padding) {
      case 'sm':
        return `${theme.spacing.md} 0`
      case 'md':
        return `${theme.spacing.xl} 0`
      case 'lg':
        return `${theme.spacing['2xl']} 0`
      case 'xl':
        return `${theme.spacing['3xl']} 0`
      default:
        return `${theme.spacing.xl} 0`
    }
  }};

  background: ${({ $background, theme }) => {
    switch ($background) {
      case 'surface':
        return theme.colors.surface
      case 'primary':
        return theme.colors.primary
      case 'gradient':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      default:
        return 'transparent'
    }
  }};

  color: ${({ $background, theme }) =>
    $background === 'primary' || $background === 'gradient' ? theme.colors.white : theme.colors.textPrimary};
`











