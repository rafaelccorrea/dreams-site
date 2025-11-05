import { useState, useEffect } from 'react'
import { Fab, Zoom } from '@mui/material'
import { KeyboardArrowUp } from '@mui/icons-material'
import { ScrollToTopButton } from './ScrollToTop.styles'

export const ScrollToTop = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Mostrar quando o usuário estiver nos últimos 30% da página
      const threshold = documentHeight - windowHeight - (windowHeight * 0.3)
      setShow(scrollPosition > threshold && scrollPosition > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Zoom in={show}>
      <ScrollToTopButton
        onClick={scrollToTop}
        color="primary"
        aria-label="Voltar ao topo"
        size="medium"
      >
        <KeyboardArrowUp />
      </ScrollToTopButton>
    </Zoom>
  )
}





