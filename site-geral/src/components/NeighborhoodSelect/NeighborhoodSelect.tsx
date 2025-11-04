import { useMemo } from 'react'
import { Select, MenuItem, FormControl, InputLabel, CircularProgress, Box, Typography, SelectChangeEvent, ListItemText } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import styled from 'styled-components'
import { useNeighborhoods } from '../../hooks/useNeighborhoods'

const StyledSelect = styled(FormControl)`
  & .MuiOutlinedInput-root {
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 12px rgba(51, 112, 166, 0.15);
    }

    &.Mui-focused {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 4px 16px rgba(51, 112, 166, 0.2);
    }
  }
`

interface NeighborhoodSelectProps {
  city?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  minCount?: number
}

export const NeighborhoodSelect = ({
  city,
  value,
  onChange,
  placeholder = 'Selecione um bairro',
  label = 'Bairro',
  minCount = 1,
}: NeighborhoodSelectProps) => {
  const { neighborhoods, loading } = useNeighborhoods({
    city,
    minCount,
    enabled: !!city, // Carrega automaticamente quando há cidade
  })

  // Remove duplicidades e ordena alfabeticamente
  const uniqueNeighborhoods = useMemo(() => {
    const seen = new Set<string>()
    const unique: Array<{ name: string; count: number; avgPrice?: number }> = []
    
    neighborhoods.forEach((neighborhood) => {
      const normalizedName = neighborhood.name.trim()
      if (!seen.has(normalizedName)) {
        seen.add(normalizedName)
        unique.push({
          name: normalizedName,
          count: neighborhood.count,
          avgPrice: neighborhood.avgPrice,
        })
      }
    })
    
    // Ordena alfabeticamente
    return unique.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }, [neighborhoods])

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string
    console.log('handleChange called:', newValue)
    onChange(newValue)
  }

  return (
    <StyledSelect fullWidth variant="outlined">
      <InputLabel id={`neighborhood-select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`neighborhood-select-label-${label}`}
        id={`neighborhood-select-${label}`}
        value={value || ''}
        onChange={handleChange}
        label={label}
        disabled={loading || !city}
        displayEmpty
        sx={{
          textTransform: 'none',
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 400,
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', justifyContent: 'center' }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Carregando bairros...
              </Typography>
            </Box>
          </MenuItem>
        ) : uniqueNeighborhoods.length === 0 ? (
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Nenhum bairro encontrado
              </Typography>
            </Box>
          </MenuItem>
        ) : (
          <>
            <MenuItem value="">
              <em>{placeholder}</em>
            </MenuItem>
            {uniqueNeighborhoods.map((neighborhood) => (
              <MenuItem 
                key={neighborhood.name} 
                value={neighborhood.name}
                sx={{ py: 1.5 }}
              >
                <LocationOn sx={{ color: 'text.secondary', fontSize: 20, mr: 1.5, flexShrink: 0 }} />
                <ListItemText
                  primary={neighborhood.name}
                  secondary={
                    `${neighborhood.count} propriedade${neighborhood.count !== 1 ? 's' : ''}${
                      neighborhood.avgPrice ? ` • Média: R$ ${neighborhood.avgPrice.toLocaleString('pt-BR')}` : ''
                    }`
                  }
                  primaryTypographyProps={{
                    sx: { fontWeight: 500 }
                  }}
                  secondaryTypographyProps={{
                    sx: { fontSize: '0.75rem' }
                  }}
                />
              </MenuItem>
            ))}
          </>
        )}
      </Select>
    </StyledSelect>
  )
}

