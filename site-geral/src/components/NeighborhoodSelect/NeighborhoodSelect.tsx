import { useMemo, useState, useEffect } from 'react'
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

  & .MuiInputLabel-root {
    background: rgba(255, 255, 255, 0.8);
    padding: 0 4px;
    transform: translate(14px, 9px) scale(1);
    
    &.MuiInputLabel-shrink {
      transform: translate(14px, -9px) scale(0.75);
      background: rgba(255, 255, 255, 0.95);
    }
    
    &.Mui-focused {
      transform: translate(14px, -9px) scale(0.75);
      background: rgba(255, 255, 255, 1);
    }
  }
  
  & .MuiOutlinedInput-notchedOutline {
    legend {
      width: auto !important;
      span {
        padding: 0 4px;
      }
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
  placeholder = 'Todos',
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

  const [open, setOpen] = useState(false)

  // Fecha o menu quando o valor mudar (garante que funcione mesmo dentro de Drawer)
  useEffect(() => {
    if (value && value !== '') {
      setOpen(false)
    }
  }, [value])

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as string
    
    onChange(newValue)
    
    // Fecha o menu após selecionar
    setOpen(false)
  }


  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  // Verifica se o valor atual existe nas opções disponíveis
  // Se estiver carregando ou não houver bairros, sempre usa string vazia
  const selectValue = useMemo(() => {
    // Se está carregando, retorna string vazia temporariamente
    if (loading) {
      return ''
    }
    
    // Se não há bairros disponíveis ainda, retorna string vazia
    if (uniqueNeighborhoods.length === 0) {
      return ''
    }
    
    // Se não há valor, retorna string vazia
    if (!value) {
      return ''
    }
    
    // Verifica se o valor existe nas opções disponíveis
    const exists = uniqueNeighborhoods.some(n => n.name === value)
    const result = exists ? value : ''
    return result
  }, [value, uniqueNeighborhoods, loading])

  return (
    <StyledSelect fullWidth variant="outlined">
      <InputLabel 
        id={`neighborhood-select-label-${label}`}
        shrink={true}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`neighborhood-select-label-${label}`}
        id={`neighborhood-select-${label}`}
        value={selectValue}
        onChange={handleChange}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        label={label}
        disabled={loading || !city}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || selected === '') {
            return <em>{placeholder}</em>
          }
          return selected
        }}
        sx={{
          textTransform: 'none',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: '2px',
          },
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
          disablePortal: false,
          disableScrollLock: true,
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
            <MenuItem 
              value=""
              onClick={() => {
                const syntheticEvent = {
                  target: { value: '' }
                } as SelectChangeEvent<string>
                handleChange(syntheticEvent)
              }}
            >
              <em>{placeholder}</em>
            </MenuItem>
            {uniqueNeighborhoods.map((neighborhood) => (
              <MenuItem 
                key={neighborhood.name} 
                value={neighborhood.name}
                sx={{ py: 1.5 }}
                onClick={() => {
                  // Cria evento sintético e chama handleChange diretamente
                  const syntheticEvent = {
                    target: { value: neighborhood.name }
                  } as SelectChangeEvent<string>
                  handleChange(syntheticEvent)
                }}
              >
                <LocationOn sx={{ color: 'text.secondary', fontSize: 20, mr: 1.5, flexShrink: 0, pointerEvents: 'none' }} />
                <ListItemText
                  primary={neighborhood.name}
                  secondary={
                    `${neighborhood.count} propriedade${neighborhood.count !== 1 ? 's' : ''}${
                      neighborhood.avgPrice ? ` • Média: R$ ${neighborhood.avgPrice.toLocaleString('pt-BR')}` : ''
                    }`
                  }
                  primaryTypographyProps={{
                    sx: { fontWeight: 500, pointerEvents: 'none' }
                  }}
                  secondaryTypographyProps={{
                    sx: { fontSize: '0.75rem', pointerEvents: 'none' }
                  }}
                  sx={{ pointerEvents: 'none' }}
                />
              </MenuItem>
            ))}
          </>
        )}
      </Select>
    </StyledSelect>
  )
}

