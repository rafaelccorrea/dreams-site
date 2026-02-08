import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';
import { getAssetPath } from '../../utils/pathUtils';
import { useTheme } from '../../contexts/ThemeContext';

const LoadingOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: ${props => (props.$isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.3s ease;
`;

const LottieContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface LoadingScreenProps {
  isVisible: boolean;
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  const { theme } = useTheme();
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    if (!isVisible) return;

    const loadAnimation = async () => {
      try {
        // No modo dark, usar home-icon-light.json
        // No modo light, usar loadind-home.json
        const fileName =
          theme === 'dark' ? 'home-icon-light.json' : 'loadind-home.json';
        const response = await fetch(getAssetPath(fileName));

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.error('❌ Erro ao carregar animação Lottie:', err);
        setAnimationData(null);
      }
    };

    loadAnimation();
  }, [isVisible, theme]); // Recarregar quando o tema mudar

  // Se não está visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  // Se ainda não carregou ou tem erro, não mostra nada (ou pode mostrar o Lottie quando carregar)
  if (!animationData) {
    return null;
  }

  // Mostra apenas o Lottie
  return (
    <LoadingOverlay $isVisible={isVisible}>
      <LottieContainer>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </LottieContainer>
    </LoadingOverlay>
  );
};

export default LoadingScreen;
