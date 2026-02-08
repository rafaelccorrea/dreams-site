import React from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';
import { getAssetPath } from '../../utils/pathUtils';
import { useTheme } from '../../contexts/ThemeContext';

// Cache para animações por tema
const animationCache: { [key: string]: any } = {};

// Função para carregar a animação baseada no tema
const loadAnimation = async (theme: 'light' | 'dark') => {
  const cacheKey = theme;

  // Se já está em cache, retornar
  if (animationCache[cacheKey]) {
    return animationCache[cacheKey];
  }

  try {
    // No modo dark, usar home-icon-light.json
    // No modo light, usar loadind-home.json
    const fileName =
      theme === 'dark' ? 'home-icon-light.json' : 'loadind-home.json';

    const response = await fetch(getAssetPath(fileName));
    if (response.ok) {
      const animationData = await response.json();
      animationCache[cacheKey] = animationData;
      return animationData;
    }

    // Fallback: se o arquivo específico não existir, tentar o outro
    try {
      const fallbackFileName =
        theme === 'dark' ? 'loadind-home.json' : 'home-icon-light.json';
      const fallbackResponse = await fetch(getAssetPath(fallbackFileName));
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        animationCache[cacheKey] = fallbackData;
        return fallbackData;
      }
    } catch {
      // Ignorar erro do fallback
    }

    return null;
  } catch (error) {
    console.error('Erro ao carregar animação Lottie:', error);
    return null;
  }
};

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const AnimationWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text, #1e293b);
  margin-top: 16px;
  text-align: center;
`;

const SubtitleText = styled.p`
  margin: 4px 0 0 0;
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #64748b);
  text-align: center;
`;

interface LottieLoadingProps {
  message?: string;
  subtitle?: string;
  asOverlay?: boolean;
}

export const LottieLoading: React.FC<LottieLoadingProps> = ({
  message,
  subtitle,
  asOverlay = false,
}) => {
  const { theme } = useTheme();
  const [animationData, setAnimationData] = React.useState<any>(null);

  React.useEffect(() => {
    loadAnimation(theme)
      .then(data => {
        if (data) setAnimationData(data);
      })
      .catch(() => {});
  }, [theme]);

  if (!animationData) return null;

  if (asOverlay) {
    return (
      <LoadingContainer>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AnimationWrapper>
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </AnimationWrapper>
          {message && <MessageText>{message}</MessageText>}
          {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
        </div>
      </LoadingContainer>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'var(--color-background, #0f172a)',
        overflow: 'hidden',
      }}
    >
      <AnimationWrapper>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </AnimationWrapper>
      {message && <MessageText>{message}</MessageText>}
      {subtitle && <SubtitleText>{subtitle}</SubtitleText>}
    </div>
  );
};
