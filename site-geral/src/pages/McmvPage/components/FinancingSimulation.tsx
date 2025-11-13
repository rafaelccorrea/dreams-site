import { useState, useMemo, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Calculate,
  Home,
  AttachMoney,
  TrendingUp,
  CreditCard,
  Info,
} from '@mui/icons-material'
import { 
  simulateFinancing, 
  SimulateFinancingResponse,
  getBankInterestRates,
  BankInterestRate,
  BankInterestRatesResponse,
} from '../../../services/mcmvService'
import { formatCurrency, unformatCurrency } from '../../../utils/masks'

interface FinancingSimulationProps {
  defaultCity: string
  defaultState: string
}

export const FinancingSimulation = (_props: FinancingSimulationProps) => {
  const [propertyValue, setPropertyValue] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [familySize, setFamilySize] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [interestRate, setInterestRate] = useState('4.5')
  const [selectedBank, setSelectedBank] = useState<BankInterestRate | null>(null)
  const [bankRates, setBankRates] = useState<BankInterestRate[]>([])
  const [loadingRates, setLoadingRates] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SimulateFinancingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Carregar taxas de juros dos bancos
  useEffect(() => {
    const loadBankRates = async () => {
      setLoadingRates(true)
      try {
        const response = await getBankInterestRates()
        setBankRates(response.rates)
        // Se houver taxas disponíveis, definir a primeira como padrão
        if (response.rates.length > 0 && !selectedBank) {
          const defaultBank = response.rates[0]
          setSelectedBank(defaultBank)
          setInterestRate(defaultBank.interestRate.toString())
        }
      } catch (err) {
        console.error('Erro ao carregar taxas de juros dos bancos:', err)
        // Se falhar, continua com a taxa padrão manual
      } finally {
        setLoadingRates(false)
      }
    }

    loadBankRates()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Atualizar taxa de juros quando banco for selecionado
  useEffect(() => {
    if (selectedBank) {
      setInterestRate(selectedBank.interestRate.toString().replace('.', ','))
    }
  }, [selectedBank])

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'propertyValue':
        if (!value) return 'Valor do imóvel é obrigatório'
        const propertyValueNum = unformatCurrency(value)
        if (propertyValueNum <= 0) return 'Valor do imóvel deve ser maior que zero'
        if (propertyValueNum > 10000000) return 'Valor do imóvel não pode ser maior que R$ 10.000.000,00'
        return ''
      case 'monthlyIncome':
        if (!value) return 'Renda mensal é obrigatória'
        const incomeValue = unformatCurrency(value)
        if (incomeValue <= 0) return 'Renda mensal deve ser maior que zero'
        if (incomeValue > 50000) return 'Renda mensal não pode ser maior que R$ 50.000,00'
        return ''
      case 'familySize':
        if (!value) return 'Tamanho da família é obrigatório'
        const size = parseInt(value)
        if (isNaN(size) || size < 1 || size > 10) return 'Tamanho da família deve ser entre 1 e 10 pessoas'
        return ''
      case 'loanTerm':
        if (!value) return ''
        const term = parseInt(value)
        if (isNaN(term) || term < 5 || term > 35) return 'Prazo deve ser entre 5 e 35 anos'
        return ''
      case 'interestRate':
        if (!value) return ''
        const rate = parseFloat(value.replace(',', '.'))
        if (isNaN(rate) || rate < 0 || rate > 100) return 'Taxa de juros deve ser entre 0% e 100%'
        return ''
      default:
        return ''
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    let formattedValue = value
    switch (field) {
      case 'propertyValue':
        formattedValue = formatCurrency(value)
        setPropertyValue(formattedValue)
        break
      case 'monthlyIncome':
        formattedValue = formatCurrency(value)
        setMonthlyIncome(formattedValue)
        break
      case 'familySize':
        formattedValue = value.replace(/\D/g, '').slice(0, 2)
        setFamilySize(formattedValue)
        break
      case 'loanTerm':
        formattedValue = value.replace(/\D/g, '').slice(0, 2)
        setLoanTerm(formattedValue || '30')
        break
      case 'interestRate':
        // Permite números e vírgula/ponto
        formattedValue = value.replace(/[^\d,.]/g, '').replace(',', '.')
        // Limita a uma casa decimal
        const parts = formattedValue.split('.')
        if (parts.length > 1) {
          formattedValue = parts[0] + '.' + parts[1].slice(0, 1)
        }
        setInterestRate(formattedValue || '4.5')
        break
      default:
        return
    }

    const error = validateField(field, formattedValue)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  // Verificar se o formulário está válido
  const isFormValid = useMemo(() => {
    // Verificar valor do imóvel
    if (!propertyValue) return false
    const propertyValueNum = unformatCurrency(propertyValue)
    if (propertyValueNum <= 0 || propertyValueNum > 10000000) return false

    // Verificar renda mensal
    if (!monthlyIncome) return false
    const incomeValue = unformatCurrency(monthlyIncome)
    if (incomeValue <= 0 || incomeValue > 50000) return false

    // Verificar tamanho da família
    if (!familySize) return false
    const size = parseInt(familySize)
    if (isNaN(size) || size < 1 || size > 10) return false

    // Verificar campos opcionais se preenchidos
    if (loanTerm && loanTerm !== '30') {
      const term = parseInt(loanTerm)
      if (isNaN(term) || term < 5 || term > 35) return false
    }

    if (interestRate && interestRate !== '4.5') {
      const rate = parseFloat(interestRate.replace(',', '.'))
      if (isNaN(rate) || rate < 0 || rate > 100) return false
    }

    return true
  }, [propertyValue, monthlyIncome, familySize, loanTerm, interestRate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    // Validar todos os campos obrigatórios
    const newErrors: Record<string, string> = {}
    const requiredFields = [
      { field: 'propertyValue', value: propertyValue },
      { field: 'monthlyIncome', value: monthlyIncome },
      { field: 'familySize', value: familySize },
    ]

    requiredFields.forEach(({ field, value }) => {
      const error = validateField(field, value)
      if (error) newErrors[field] = error
    })

    // Validar campos opcionais se preenchidos
    if (loanTerm && loanTerm !== '30') {
      const loanTermError = validateField('loanTerm', loanTerm)
      if (loanTermError) newErrors.loanTerm = loanTermError
    }

    if (interestRate && interestRate !== '4.5') {
      const interestRateError = validateField('interestRate', interestRate)
      if (interestRateError) newErrors.interestRate = interestRateError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setError('Por favor, corrija os erros nos campos.')
      return
    }

    const propertyValueNum = unformatCurrency(propertyValue)
    const incomeValue = unformatCurrency(monthlyIncome)
    const familySizeValue = parseInt(familySize)
    const loanTermValue = parseInt(loanTerm) || 30
    const interestRateValue = parseFloat(interestRate.replace(',', '.')) || 4.5

    setLoading(true)

    try {
      const response = await simulateFinancing({
        propertyValue: propertyValueNum,
        monthlyIncome: incomeValue,
        familySize: familySizeValue,
        loanTerm: loanTermValue,
        interestRate: interestRateValue,
        bankCode: selectedBank?.bankCode,
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao simular financiamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Simular Financiamento Minha Casa Minha Vida
      </Typography>

      <Alert 
        severity="info" 
        icon={<Info />}
        sx={{ mb: 3 }}
      >
        <Typography variant="body2" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
          Simulação baseada em valores de referência
        </Typography>
        <Typography variant="body2" component="div">
          Esta simulação é apenas uma base estimada e não representa uma proposta real. Os valores podem variar de acordo com o banco financeiro escolhido, condições de crédito, análise cadastral e outros fatores. Consulte as instituições financeiras para obter propostas oficiais.
        </Typography>
      </Alert>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Valor do Imóvel (R$)"
              value={propertyValue}
              onChange={(e) => handleFieldChange('propertyValue', e.target.value)}
              onBlur={(e) => handleFieldChange('propertyValue', e.target.value)}
              required
              placeholder="R$ 0,00"
              error={!!errors.propertyValue}
              helperText={errors.propertyValue || 'Informe o valor do imóvel'}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Renda Familiar Mensal (R$)"
              value={monthlyIncome}
              onChange={(e) => handleFieldChange('monthlyIncome', e.target.value)}
              onBlur={(e) => handleFieldChange('monthlyIncome', e.target.value)}
              required
              placeholder="R$ 0,00"
              error={!!errors.monthlyIncome}
              helperText={errors.monthlyIncome || 'Informe a renda familiar mensal'}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tamanho da Família"
              value={familySize}
              onChange={(e) => handleFieldChange('familySize', e.target.value)}
              onBlur={(e) => handleFieldChange('familySize', e.target.value)}
              required
              inputProps={{ maxLength: 2 }}
              error={!!errors.familySize}
              helperText={errors.familySize || 'Número de pessoas na família (1-10)'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Prazo do Financiamento (anos)"
              value={loanTerm}
              onChange={(e) => handleFieldChange('loanTerm', e.target.value)}
              onBlur={(e) => handleFieldChange('loanTerm', e.target.value)}
              inputProps={{ maxLength: 2 }}
              error={!!errors.loanTerm}
              helperText={errors.loanTerm || 'Padrão: 30 anos (5-35)'}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="bank-select-label">Banco (opcional)</InputLabel>
              <Select
                labelId="bank-select-label"
                id="bank-select"
                value={selectedBank?.bankCode || ''}
                label="Banco (opcional)"
                onChange={(e) => {
                  const bank = bankRates.find(b => b.bankCode === e.target.value)
                  setSelectedBank(bank || null)
                  if (bank) {
                    setInterestRate(bank.interestRate.toString().replace('.', ','))
                  }
                }}
                disabled={loadingRates}
              >
                <MenuItem value="">
                  <em>Usar taxa manual</em>
                </MenuItem>
                {loadingRates ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Carregando bancos...
                  </MenuItem>
                ) : bankRates.length === 0 ? (
                  <MenuItem disabled>
                    Nenhum banco disponível
                  </MenuItem>
                ) : (
                  bankRates.map((bank) => (
                    <MenuItem key={bank.bankCode} value={bank.bankCode}>
                      {bank.bank} - {bank.interestRate}% a.a.
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {!loadingRates && bankRates.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Taxas de bancos não disponíveis. Use a taxa manual abaixo.
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Taxa de Juros Anual (%)"
              value={interestRate}
              onChange={(e) => {
                handleFieldChange('interestRate', e.target.value)
                // Limpar seleção de banco se usuário editar manualmente
                if (selectedBank) {
                  setSelectedBank(null)
                }
              }}
              onBlur={(e) => handleFieldChange('interestRate', e.target.value)}
              error={!!errors.interestRate}
              helperText={
                errors.interestRate || 
                selectedBank 
                  ? `Taxa do ${selectedBank.bank} (atualizada em ${new Date(selectedBank.lastUpdated).toLocaleDateString('pt-BR')})`
                  : 'Informe a taxa de juros ou selecione um banco acima'
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              disabled={!!selectedBank && !loadingRates}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !isFormValid}
              startIcon={loading ? <CircularProgress size={20} /> : <Calculate />}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Simulando...' : 'Simular Financiamento'}
            </Button>
            {!isFormValid && !loading && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                Preencha todos os campos obrigatórios para continuar
              </Typography>
            )}
          </Grid>
        </Grid>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Alert 
            severity="info" 
            icon={<Info />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" component="div">
              <strong>Importante:</strong> Esta simulação é apenas uma estimativa baseada em valores de referência. Os valores reais podem variar significativamente entre diferentes bancos e instituições financeiras. Consulte as propostas oficiais das instituições para obter valores precisos e condições reais de financiamento.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {result.eligible ? (
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                Simulação Aprovada
              </Typography>
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                Simulação Não Aprovada
              </Typography>
            )}
          </Box>

          {result.eligible ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Home sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Valor do Imóvel
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      R${' '}
                      {result.propertyValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Financiamento
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      R${' '}
                      {result.loanAmount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Subsídio
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      R${' '}
                      {result.subsidy.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Entrada
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      R${' '}
                      {result.downPayment.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ mr: 1 }} />
                      <Typography variant="subtitle2">
                        Parcela Mensal
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      R${' '}
                      {result.monthlyPayment.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography variant="caption">
                      Prazo: {result.loanTerm} meses ({Math.round(result.loanTerm / 12)} anos)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Taxa de Juros
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {result.interestRate}% a.a.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Motivos:
              </Typography>
              {result.reasons.map((reason, index) => (
                <Typography key={index} variant="body2">
                  • {reason}
                </Typography>
              ))}
            </Alert>
          )}
        </Paper>
      )}
    </Box>
  )
}

