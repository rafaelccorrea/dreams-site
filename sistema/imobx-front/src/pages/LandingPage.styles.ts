import styled, { keyframes } from 'styled-components';

// Cores do sistema (tons de vermelho do sistema light)
export const PRIMARY_COLOR = '#A63126';
export const PRIMARY_DARK = '#8B251C';
export const PRIMARY_DARKER = '#6B1D15';
export const PRIMARY_LIGHT = '#C44336';
export const PRIMARY_BG_START = '#A63126';
export const PRIMARY_BG_MID = '#8B251C';
export const PRIMARY_BG_END = '#6B1D15';
export const BACKGROUND = '#ffffff';
export const TEXT_PRIMARY = '#111827'; // gray900
export const TEXT_SECONDARY = '#6b7280';
export const GRAY_900 = '#111827';
export const GRAY_800 = '#1f2937';
export const GRAY_700 = '#374151';
export const GRAY_600 = '#4b5563';
export const GRAY_500 = '#6b7280';
export const GRAY_400 = '#9ca3af';
export const ORANGE_COLOR = '#FF6B35';

// Animações
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// Container principal com scroll suave
export const LandingContainer = styled.div`
  min-height: 100vh;
  background: ${BACKGROUND};
  color: ${GRAY_900};
  scroll-behavior: smooth;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  position: relative;
  -webkit-overflow-scrolling: touch;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: default;

  /* Seleção de texto */
  ::selection {
    background-color: ${PRIMARY_COLOR};
    color: white;
  }

  ::-moz-selection {
    background-color: ${PRIMARY_COLOR};
    color: white;
  }

  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 10px;

    @media (max-width: 768px) {
      width: 6px;
    }
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: ${PRIMARY_COLOR};
    border-radius: 5px;

    @media (max-width: 768px) {
      border-radius: 3px;
    }

    &:hover {
      background: ${PRIMARY_DARK};
    }
  }
`;

// Header fixo
export const HeaderWrapper = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #f8fafc;
  backdrop-filter: blur(20px);
  box-shadow: ${props =>
    props.scrolled
      ? '0 4px 30px rgba(0, 0, 0, 0.1)'
      : '0 2px 20px rgba(0, 0, 0, 0.05)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(166, 49, 38, 0.1);
  height: 80px;
  display: flex;
  align-items: center;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
    height: 75px;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    height: 65px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${PRIMARY_COLOR} 0%,
      ${PRIMARY_DARK} 50%,
      ${PRIMARY_DARKER} 100%
    );
    opacity: ${props => (props.scrolled ? 1 : 0)};
    transition: opacity 0.4s ease;
  }
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  padding-left: 220px;

  @media (max-width: 1024px) {
    padding-left: 180px;
  }

  @media (max-width: 768px) {
    padding-left: 140px;
    z-index: 1001;
  }

  @media (max-width: 480px) {
    padding-left: 120px;
  }
`;

export const Logo = styled.img`
  height: 180px;
  width: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  opacity: 1;
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1003;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  @media (max-width: 1024px) {
    height: 150px;
    left: 1.5rem;
  }

  @media (max-width: 768px) {
    height: 120px;
    left: 1rem;
    z-index: 1003;
  }

  @media (max-width: 480px) {
    height: 100px;
    left: 1rem;
    z-index: 1003;
  }

  &:hover {
    transform: translateY(-50%) scale(1.05);
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

export const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    min-height: auto;
    max-height: 90vh;
    background: white;
    flex-direction: column;
    padding: 80px 2rem 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: ${props =>
      props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    transition: transform 0.3s ease;
    gap: 0;
    overflow: visible;
    z-index: 999;
    pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
  }

  @media (max-width: 480px) {
    padding: 70px 1.5rem 1.5rem;
    max-height: 85vh;
  }
`;

export const NavLink = styled.a`
  color: ${GRAY_600};
  text-decoration: none;
  font-weight: 400;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  font-size: 1rem;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  display: inline-block;

  @media (max-width: 1024px) {
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    font-size: 1.125rem;
    padding: 1rem 0;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    pointer-events: auto;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    display: block;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.625rem 0;
  }

  &:hover {
    color: ${PRIMARY_COLOR};
  }

  &:focus {
    outline: none;
  }

  &:active {
    color: ${PRIMARY_COLOR};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${PRIMARY_COLOR};
    transition: width 0.3s ease;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover::after {
    width: 100%;
  }
`;

export const LoginButton = styled.button`
  background: ${PRIMARY_COLOR};
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(166, 49, 38, 0.3);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  @media (max-width: 1024px) {
    padding: 0.65rem 1.5rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.95rem;
  }

  &:hover {
    background: ${PRIMARY_DARK};
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(166, 49, 38, 0.5);

    svg {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

export const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 2rem;
  color: ${TEXT_PRIMARY};
  cursor: pointer;
  padding: 0.5rem;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  position: relative;
  pointer-events: auto;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: flex;
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    padding: 0.375rem;
  }
`;

export const MenuOverlay = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    opacity: ${props => (props.isOpen ? 1 : 0)};
    visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  }
`;

// Hero Section
export const HeroSection = styled.section`
  padding: 0;
  margin: 0;
  padding-top: 80px;
  text-align: center;
  animation: ${fadeIn} 0.8s ease;
  position: relative;
  background: ${BACKGROUND};
  overflow: hidden;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    padding-top: 80px;
    min-height: calc(90vh - 80px);
  }

  @media (max-width: 768px) {
    padding-top: 80px;
    min-height: calc(80vh - 80px);
  }

  @media (max-width: 480px) {
    padding-top: 80px;
    min-height: calc(70vh - 80px);
  }
`;

export const VideoBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  clip-path: inset(0 0 20px 0);

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 2rem 80px;
  width: 100%;

  @media (max-width: 1024px) {
    padding: 100px 1.5rem 60px;
  }

  @media (max-width: 768px) {
    padding: 90px 1rem 50px;
  }

  @media (max-width: 480px) {
    padding: 80px 1rem 40px;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  text-shadow:
    0 4px 20px rgba(0, 0, 0, 0.5),
    0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
`;

export const HeroTitleOrange = styled.span`
  color: ${ORANGE_COLOR};
  text-shadow:
    0 4px 20px rgba(255, 107, 53, 0.5),
    0 2px 10px rgba(255, 107, 53, 0.3);
`;

export const HeroTitlePrimary = styled.span`
  color: ${PRIMARY_COLOR};
  text-shadow:
    0 4px 20px rgba(166, 49, 38, 0.5),
    0 2px 10px rgba(166, 49, 38, 0.3);
`;

export const HeroSubtitle = styled.p`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: -0.01em;
  text-shadow:
    0 2px 15px rgba(0, 0, 0, 0.5),
    0 1px 5px rgba(0, 0, 0, 0.3);

  @media (max-width: 1024px) {
    font-size: 1.3rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.15rem;
    margin-bottom: 1.75rem;
    padding: 0 0.5rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

export const CTAButton = styled.button`
  background: linear-gradient(
    135deg,
    ${PRIMARY_COLOR} 0%,
    ${PRIMARY_DARK} 50%,
    ${PRIMARY_DARKER} 100%
  );
  color: white;
  padding: 1.2rem 3rem;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 6px 30px rgba(166, 49, 38, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease 0.5s both;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
    font-size: 1.3rem;
  }

  @media (max-width: 1024px) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
    max-width: 100%;
  }

  &:hover {
    background: linear-gradient(
      135deg,
      ${PRIMARY_DARKER} 0%,
      ${PRIMARY_DARK} 50%,
      ${PRIMARY_COLOR} 100%
    );
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(166, 49, 38, 0.5);

    svg {
      transform: translateX(5px);
    }
  }

  &:active {
    transform: translateY(-1px) scale(1);
  }
`;

// Stats Section
export const StatsSection = styled.section`
  position: relative;
  padding: 80px 2rem;
  background: ${BACKGROUND};
  color: ${GRAY_600};
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    padding: 60px 1.5rem;
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 50px 1rem;
    scroll-margin-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 40px 1rem;
  }
`;

export const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;

  @media (max-width: 1024px) {
    gap: 2.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

export const StatCard = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.8s ease;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(166, 49, 38, 0.15);
    border-color: ${PRIMARY_COLOR};
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

export const StatIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  color: ${PRIMARY_COLOR};
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  &:nth-child(1) {
    animation-delay: 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    animation-delay: 1s;
  }
`;

export const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: ${GRAY_600};
  font-family: 'Inter', sans-serif;
  background: linear-gradient(
    135deg,
    ${PRIMARY_COLOR} 0%,
    ${PRIMARY_DARK} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${GRAY_700};
  letter-spacing: 0.01em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// Carrossel de Features
export const FeaturesSection = styled.section`
  padding: 40px 2rem 80px;
  max-width: 1200px;
  margin: 0 auto;
  background: ${BACKGROUND};
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    padding: 30px 1.5rem 60px;
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 25px 1rem 50px;
    scroll-margin-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 40px 1rem;
  }
`;

export const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

export const ResourceCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: ${fadeInUp} 0.6s ease both;
  text-align: center;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:nth-child(5) {
    animation-delay: 0.5s;
  }

  &:nth-child(6) {
    animation-delay: 0.6s;
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(166, 49, 38, 0.15);
    border-color: ${PRIMARY_COLOR};
  }
`;

export const ResourceIcon = styled.div`
  font-size: 3.5rem;
  color: ${PRIMARY_COLOR};
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

export const ResourceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${GRAY_600};
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const ResourceDescription = styled.p`
  font-size: 1rem;
  color: ${GRAY_700};
  line-height: 1.7;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: ${GRAY_600};
  letter-spacing: -0.03em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.25rem;
  text-align: center;
  color: ${GRAY_700};
  font-weight: 400;
  letter-spacing: -0.01em;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

// Partners Section - Carrossel de Logos
export const PartnersSection = styled.section`
  padding: 60px 0;
  background: ${BACKGROUND};
  overflow: hidden;
  position: relative;
  width: 100%;
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 40px 0;
    scroll-margin-top: 70px;
  }
`;

export const PartnersTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${GRAY_600};
  letter-spacing: -0.03em;
  font-family: 'Inter', sans-serif;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const PartnersSubtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: ${GRAY_700};
  font-weight: 400;
  margin-bottom: 3rem;
  padding: 0 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const LogosCarousel = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
  margin: 2rem 0;
  padding: 2rem 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 150px;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
  }

  &::after {
    right: 0;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0;
    &::before,
    &::after {
      width: 80px;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem 0;
  }
`;

export const LogosTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  animation: scrollLogos 20s linear infinite;
  width: fit-content;
  padding: 0;

  @keyframes scrollLogos {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @media (max-width: 768px) {
    gap: 3rem;
  }

  @media (max-width: 480px) {
    gap: 2rem;
  }
`;

export const LogoItem = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  width: 200px;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  filter: grayscale(100%);
  opacity: 0.7;

  &:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    width: auto;
    height: auto;
  }

  @media (max-width: 768px) {
    height: 100px;
    width: 160px;
    padding: 1rem 1.5rem;
  }

  @media (max-width: 480px) {
    height: 80px;
    width: 140px;
    padding: 0.75rem 1rem;
  }
`;

// About Section
export const AboutSection = styled.section`
  padding: 80px 2rem;
  background: ${BACKGROUND};
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    padding: 60px 1.5rem;
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 50px 1rem;
    scroll-margin-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 40px 1rem;
  }
`;

export const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

export const AboutText = styled.div`
  animation: ${fadeIn} 0.8s ease;
`;

export const AboutTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: ${GRAY_600};
  letter-spacing: -0.03em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.25rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export const AboutDescription = styled.p`
  font-size: 1.15rem;
  color: ${GRAY_700};
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-weight: 400;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.6s ease both;
  border: 2px solid transparent;

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.75rem;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 8px 25px rgba(166, 49, 38, 0.15);
    border-color: ${PRIMARY_COLOR};
  }
`;

export const FeatureItemIcon = styled.div`
  font-size: 2rem;
  color: ${PRIMARY_COLOR};
  flex-shrink: 0;
`;

export const FeatureItemContent = styled.div``;

export const FeatureItemTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${GRAY_600};
  letter-spacing: -0.01em;
  font-family: 'Inter', sans-serif;
`;

export const FeatureItemDescription = styled.p`
  font-size: 0.95rem;
  color: ${GRAY_700};
  line-height: 1.7;
  font-weight: 400;
`;

// Plans Section
export const PlansSection = styled.section`
  padding: 80px 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: ${BACKGROUND};
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    padding: 60px 1.5rem;
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 50px 1rem;
    scroll-margin-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 40px 1rem;
  }
`;

export const BetaWarningCard = styled.div`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #a63126;
  border-radius: 16px;
  padding: 24px;
  margin: 2rem auto 0;
  max-width: 800px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  box-shadow: 0 4px 20px rgba(166, 49, 38, 0.15);
  animation: ${fadeInUp} 0.6s ease both;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    margin-top: 1.5rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    gap: 12px;
    margin-top: 1.25rem;
    border-radius: 10px;
  }
`;

export const BetaWarningIcon = styled.div`
  font-size: 3rem;
  flex-shrink: 0;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    align-self: center;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const BetaWarningContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BetaWarningTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #8b251c;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.375rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const BetaWarningMessage = styled.p`
  font-size: 1.0625rem;
  color: #a63126;
  margin: 0;
  line-height: 1.7;

  strong {
    color: #8b251c;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.25rem;
    margin-top: 1.5rem;
  }
`;

export const PlanCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: ${fadeInUp} 0.6s ease both;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${PRIMARY_COLOR} 0%,
      ${PRIMARY_DARK} 50%,
      ${PRIMARY_DARKER} 100%
    );
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 12px 40px rgba(166, 49, 38, 0.2);
    border-color: ${PRIMARY_COLOR};

    &::before {
      transform: scaleX(1);
    }
  }
`;

// Benefits Section
export const BenefitsSection = styled.section`
  padding: 80px 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: ${BACKGROUND};
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    padding: 60px 1.5rem;
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 50px 1rem;
    scroll-margin-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 40px 1rem;
  }
`;

export const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

export const BenefitCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: ${fadeInUp} 0.6s ease both;
  text-align: center;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:nth-child(5) {
    animation-delay: 0.5s;
  }

  &:nth-child(6) {
    animation-delay: 0.6s;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(166, 49, 38, 0.15);
    border-color: ${PRIMARY_COLOR};
  }
`;

export const BenefitIcon = styled.div`
  font-size: 3rem;
  color: ${PRIMARY_COLOR};
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

export const BenefitTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${GRAY_600};
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const BenefitDescription = styled.p`
  font-size: 1rem;
  color: ${GRAY_700};
  line-height: 1.7;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const PlanName = styled.h3`
  font-size: 1.875rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${GRAY_600};
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }
`;

export const PlanPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const PlanPriceValue = styled.div<{ $isBeta?: boolean }>`
  font-size: 3rem;
  font-weight: 800;
  color: ${PRIMARY_COLOR};
  display: flex;
  flex-direction: ${props => (props.$isBeta ? 'column' : 'row')};
  align-items: ${props => (props.$isBeta ? 'flex-start' : 'baseline')};
  gap: ${props => (props.$isBeta ? '0.5rem' : '0.25rem')};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }

  span {
    font-size: 1.2rem;
    color: ${TEXT_SECONDARY};
    font-weight: 400;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

export const PlanPriceStrikethrough = styled.span`
  text-decoration: line-through;
  color: ${TEXT_SECONDARY};
  opacity: 0.6;
  font-size: 2rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const PlanPriceBeta = styled.span`
  color: #059669;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid #10b981;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 0.4rem 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    padding: 0.35rem 0.7rem;
  }
`;

export const PlanPriceNote = styled.p`
  font-size: 0.875rem;
  color: ${TEXT_SECONDARY};
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const PlanPricePrefix = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${TEXT_SECONDARY};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;

  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }

  @media (max-width: 480px) {
    margin: 1.25rem 0;
  }
`;

export const PlanFeature = styled.li`
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: ${TEXT_SECONDARY};

  @media (max-width: 768px) {
    padding: 0.625rem 0;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0;
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  svg {
    color: ${PRIMARY_COLOR};
    flex-shrink: 0;
    font-size: 1.2rem;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

export const PlanButton = styled.button`
  width: 100%;
  background: ${PRIMARY_COLOR};
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;

  svg {
    transition: transform 0.3s ease;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.95rem;
  }

  &:hover {
    background: ${PRIMARY_DARK};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(166, 49, 38, 0.4);

    svg {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

// Chat de Suporte
export const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: ${props => (props.isOpen ? '2rem' : '6rem')};
  right: 2rem;
  width: ${props => (props.isOpen ? '380px' : '60px')};
  height: ${props => (props.isOpen ? '500px' : '60px')};
  background: white;
  border-radius: ${props => (props.isOpen ? '20px' : '50%')};
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${props => (props.isOpen ? 'calc(100vw - 2rem)' : '55px')};
    height: ${props => (props.isOpen ? 'calc(100vh - 4rem)' : '55px')};
    bottom: ${props => (props.isOpen ? '1rem' : '5.5rem')};
    right: 1rem;
    max-height: ${props => (props.isOpen ? '600px' : '55px')};
  }

  @media (max-width: 480px) {
    width: ${props => (props.isOpen ? 'calc(100vw - 1rem)' : '50px')};
    height: ${props => (props.isOpen ? 'calc(100vh - 2rem)' : '50px')};
    bottom: ${props => (props.isOpen ? '0.5rem' : '5rem')};
    right: 0.5rem;
    border-radius: ${props => (props.isOpen ? '15px' : '50%')};
  }
`;

export const ChatHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${PRIMARY_COLOR} 0%,
    ${PRIMARY_DARK} 100%
  );
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px 20px 0 0;

  @media (max-width: 480px) {
    padding: 0.875rem 1.25rem;
    border-radius: 15px 15px 0 0;
  }
`;

export const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

export const ChatHeaderText = styled.div`
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: white;
  }
  p {
    margin: 0;
    font-size: 0.75rem;
    opacity: 0.9;
    color: white;
  }
`;

export const ChatCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: rotate(90deg);
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const Message = styled.div<{ isBot: boolean }>`
  display: flex;
  justify-content: ${props => (props.isBot ? 'flex-start' : 'flex-end')};
  animation: ${fadeInUp} 0.3s ease;
`;

export const MessageBubble = styled.div<{ isBot: boolean }>`
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: ${props =>
    props.isBot ? '0 16px 16px 16px' : '16px 0 16px 16px'};
  background: ${props => (props.isBot ? 'white' : PRIMARY_COLOR)};
  color: ${props => (props.isBot ? GRAY_700 : 'white')};
  font-size: 0.9rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    max-width: 85%;
    font-size: 0.85rem;
    padding: 0.625rem 0.875rem;
  }
`;

export const SuggestedQuestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export const SuggestedQuestionButton = styled.button`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.625rem 1rem;
  font-size: 0.85rem;
  color: ${GRAY_700};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: ${PRIMARY_COLOR};
    color: white;
    border-color: ${PRIMARY_COLOR};
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(166, 49, 38, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateX(2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.875rem;
  }
`;

export const ChatInputContainer = styled.div`
  padding: 1rem 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
  }
`;

export const ChatInput = styled.input`
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  background: white;
  color: ${GRAY_900};
  font-family: 'Inter', sans-serif;

  &:focus {
    border-color: ${PRIMARY_COLOR};
  }

  &:disabled {
    background: #f8fafc;
    color: ${GRAY_500};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: ${GRAY_500};
  }
`;

export const ChatSendButton = styled.button`
  background: ${PRIMARY_COLOR};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;

  &:hover:not(:disabled) {
    background: ${PRIMARY_DARK};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background: ${GRAY_400};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ChatToggleButton = styled.button`
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${PRIMARY_COLOR};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(166, 49, 38, 0.4);
  font-size: 1.5rem;
  transition: all 0.3s;
  z-index: 999;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(166, 49, 38, 0.6);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.4rem;
    bottom: 5.5rem;
    right: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
    bottom: 5rem;
    right: 1rem;
  }
`;

// Footer
export const WhatsAppButton = styled.a`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(37, 211, 102, 0.3);
  z-index: 1000;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: white;
  overflow: hidden;
  border: none;
  outline: none;

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.25s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
    background: #20ba5a !important;

    svg {
      transform: scale(1.08);
    }
  }

  &:active {
    transform: translateY(-1px) scale(1);
    box-shadow: 0 2px 10px rgba(37, 211, 102, 0.35);
    background: #1da851 !important;
  }

  &:focus {
    outline: none;
    background: #25d366;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    bottom: 1.5rem;
    right: 1.5rem;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    bottom: 1rem;
    right: 1rem;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const Footer = styled.footer`
  background: linear-gradient(
    135deg,
    ${PRIMARY_BG_START} 0%,
    ${PRIMARY_BG_MID} 50%,
    ${PRIMARY_BG_END} 100%
  );
  color: white;
  padding: 4rem 2rem 2rem;
  margin-top: 0;

  @media (max-width: 1024px) {
    padding: 3rem 1.5rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1rem 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem 1rem;
  }
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    gap: 2.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

export const FooterSection = styled.div``;

export const FooterTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

export const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }
`;

export const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  outline: none;

  &:hover {
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

export const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    gap: 0.625rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 0.5rem;
  }
`;

export const DeveloperInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }

  .heart {
    color: #ef4444;
    display: inline-block;
    margin: 0 0.25rem;
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  @keyframes heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

export const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

// System Images Section
export const SystemImagesSection = styled.section`
  padding: 80px 2rem;
  background: ${BACKGROUND};
  scroll-margin-top: 80px;

  @media (max-width: 1024px) {
    padding: 60px 1.5rem;
    scroll-margin-top: 75px;
  }

  @media (max-width: 768px) {
    padding: 50px 1rem;
    scroll-margin-top: 70px;
  }

  @media (max-width: 480px) {
    padding: 40px 1rem;
  }
`;

export const SystemImagesSampleNote = styled.div`
  max-width: 1400px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid ${PRIMARY_COLOR};
  border-radius: 16px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(166, 49, 38, 0.15);
  animation: ${fadeInUp} 0.6s ease both;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
    gap: 0.75rem;
  }
`;

export const SystemImagesSampleIcon = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
  line-height: 1;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const SystemImagesSampleText = styled.p`
  font-size: 1.1rem;
  color: ${PRIMARY_DARK};
  margin: 0;
  line-height: 1.7;
  font-weight: 400;

  strong {
    color: ${PRIMARY_DARKER};
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

export const SystemImagesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const SystemImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-top: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const SystemImageCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: ${fadeInUp} 0.6s ease both;
  cursor: pointer;
  position: relative;
  user-select: none;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:nth-child(5) {
    animation-delay: 0.5s;
  }

  &:nth-child(6) {
    animation-delay: 0.6s;
  }

  &:nth-child(7) {
    animation-delay: 0.7s;
  }

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(166, 49, 38, 0.15);
    border-color: ${PRIMARY_COLOR};

    img {
      transform: scale(1.05);
    }
  }
`;

export const SystemImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  background: #f8fafc;
`;

export const SystemImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const SystemImageLabel = styled.div`
  padding: 1.25rem 1.5rem;
  background: white;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem 1rem;
  }
`;

export const SystemImageTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${GRAY_600};
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 0.35rem;
  }
`;

export const SystemImageDescription = styled.p`
  font-size: 0.95rem;
  color: ${GRAY_700};
  margin: 0;
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.5;
  }
`;

// Modal Fullscreen
export const SystemImageModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const SystemImageModalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const SystemImageModalCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  z-index: 3;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    top: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
    top: 10px;
    right: 10px;
  }
`;

export const SystemImageModalNavigationButton = styled.button<{
  $position: 'left' | 'right';
}>`
  position: absolute;
  ${props => (props.$position === 'left' ? 'left: 20px;' : 'right: 20px;')}
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-size: 28px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  z-index: 3;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 24px;
    ${props => (props.$position === 'left' ? 'left: 15px;' : 'right: 15px;')}
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    ${props => (props.$position === 'left' ? 'left: 10px;' : 'right: 10px;')}
  }
`;

export const SystemImageModalImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    align-items: flex-start;
    padding-top: 60px;
  }
`;

export const SystemImageModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  @media (max-width: 768px) {
    object-fit: contain;
    height: auto;
    max-height: 100%;
  }

  @media (max-width: 480px) {
    object-fit: contain;
    height: auto;
    max-height: calc(100vh - 200px);
  }
`;

export const SystemImageModalContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.85) 60%,
    rgba(0, 0, 0, 0) 100%
  );
  padding: 3rem 2rem 2rem;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem 1.5rem;
    position: relative;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.9) 100%
    );
    margin-top: auto;
  }

  @media (max-width: 480px) {
    padding: 2rem 1.25rem 1.25rem;
  }
`;

export const SystemImageModalTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-align: center;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
`;

export const SystemImageModalDescription = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 1rem 0;
  line-height: 1.8;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }
`;

export const SystemImageModalCounter = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  font-weight: 500;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;
