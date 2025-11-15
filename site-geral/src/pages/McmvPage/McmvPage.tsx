import { useState } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  Calculate,
  PersonAdd,
  Home,
  Business,
} from '@mui/icons-material'
import { PageContainer, PageHeader, PageContent } from '../../components/PageContainer'
import { useLocation } from '../../contexts/LocationContext'
import { EligibilityCheck } from './components/EligibilityCheck'
import { FinancingSimulation } from './components/FinancingSimulation'
import { PreRegistration } from './components/PreRegistration'
import { McmvProperties } from './components/McmvProperties'
import { McmvCompanies } from './components/McmvCompanies'
import { ScrollToTop } from '../../components/ScrollToTop'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mcmv-tabpanel-${index}`}
      aria-labelledby={`mcmv-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export const McmvPage = () => {
  const { location } = useLocation()
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const hasLocation = location?.city && location?.state

  return (
    <PageContainer>
      <PageHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            Minha Casa Minha Vida
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          Verifique sua elegibilidade, simule financiamentos e realize seu pré-cadastro no programa Minha Casa Minha Vida.
        </Typography>
      </PageHeader>

      <PageContent>
        {!hasLocation && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Para utilizar os serviços do Minha Casa Minha Vida, é necessário selecionar uma cidade primeiro.
            Clique no botão de localização no topo da página para escolher sua cidade.
          </Alert>
        )}

        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Minha Casa Minha Vida tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 72,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          >
            <Tab
              icon={<CheckCircle />}
              iconPosition="start"
              label="Verificar Elegibilidade"
              id="mcmv-tab-0"
              aria-controls="mcmv-tabpanel-0"
            />
            <Tab
              icon={<Calculate />}
              iconPosition="start"
              label="Simular Financiamento"
              id="mcmv-tab-1"
              aria-controls="mcmv-tabpanel-1"
            />
            <Tab
              icon={<PersonAdd />}
              iconPosition="start"
              label="Pré-cadastro"
              id="mcmv-tab-2"
              aria-controls="mcmv-tabpanel-2"
            />
            <Tab
              icon={<Home />}
              iconPosition="start"
              label="Propriedades"
              id="mcmv-tab-3"
              aria-controls="mcmv-tabpanel-3"
            />
            <Tab
              icon={<Business />}
              iconPosition="start"
              label="Imobiliárias"
              id="mcmv-tab-4"
              aria-controls="mcmv-tabpanel-4"
            />
          </Tabs>

          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <TabPanel value={activeTab} index={0}>
              <EligibilityCheck
                defaultCity={location?.city || ''}
                defaultState={location?.state || ''}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <FinancingSimulation
                defaultCity={location?.city || ''}
                defaultState={location?.state || ''}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <PreRegistration
                defaultCity={location?.city || ''}
                defaultState={location?.state || ''}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <McmvProperties
                defaultCity={location?.city || ''}
                defaultState={location?.state || ''}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <McmvCompanies
                defaultCity={location?.city || ''}
                defaultState={location?.state || ''}
              />
            </TabPanel>
          </Box>
        </Paper>
      </PageContent>
      <ScrollToTop />
    </PageContainer>
  )
}

