import styled from 'styled-components';

export const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; // Usar 'cover' para preencher todo o card
  border-radius: 8px;
  transition: transform 0.3s ease;
  background: var(--color-background-secondary);

  &:hover {
    transform: scale(1.02);
  }
`;

export const CarouselOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`;

export const CarouselModal = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  background: transparent;
  cursor: default;
`;

export const NavigationButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$position}: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: white;
    border-color: rgba(0, 0, 0, 0.2);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  svg {
    font-size: 20px;
    color: var(--color-text);
  }

  /* Dark theme adaptation */
  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    svg {
      color: white;
    }
  }

  /* Light theme explicit */
  .light-theme & {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      background: white;
      border-color: rgba(0, 0, 0, 0.2);
    }

    svg {
      color: var(--color-text);
    }
  }

  /* Dark theme explicit */
  .dark-theme & {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    svg {
      color: white;
    }
  }
`;

export const ThumbnailStrip = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-background-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 2px;
  }
`;

export const ThumbnailItem = styled.div<{ isActive: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid
    ${props => (props.isActive ? 'var(--color-primary)' : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    transform: scale(1.05);
  }

  img {
    opacity: ${props => (props.isActive ? 1 : 0.7)};
    transition: opacity 0.2s ease;
  }

  &:hover img {
    opacity: 1;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: white;
    border-color: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  svg {
    color: var(--color-text);
  }

  /* Dark theme adaptation */
  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    svg {
      color: white;
    }
  }

  /* Light theme explicit */
  .light-theme & {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      background: white;
      border-color: rgba(0, 0, 0, 0.2);
    }

    svg {
      color: var(--color-text);
    }
  }

  /* Dark theme explicit */
  .dark-theme & {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    svg {
      color: white;
    }
  }
`;

export const FullscreenButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    border-color: rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
  }

  svg {
    color: var(--color-text);
  }

  /* Dark theme adaptation */
  @media (prefers-color-scheme: dark) {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    svg {
      color: white;
    }
  }

  /* Light theme explicit */
  .light-theme & {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(0, 0, 0, 0.1);

    &:hover {
      background: white;
      border-color: rgba(0, 0, 0, 0.2);
    }

    svg {
      color: var(--color-text);
    }
  }

  /* Dark theme explicit */
  .dark-theme & {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    svg {
      color: white;
    }
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  fontsize: 12px;
  font-weight: 600;
`;
