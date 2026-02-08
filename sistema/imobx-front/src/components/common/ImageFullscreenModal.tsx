import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';

interface ImageFullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: string;
    url: string;
    category?: string;
    isMain?: boolean;
  }>;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  z-index: 2;
`;

const Title = styled.div`
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 100%;
  max-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
`;

const Navigation = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  transition: all 0.2s ease;
  pointer-events: auto;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;

    &:hover {
      transform: none;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }

  @media (max-width: 768px) {
    padding: 8px;

    svg {
      width: 20px;
      height: 20 px;
    }
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(239, 68, 68, 0.8);
    border-color: rgba(239, 68, 68, 1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 8px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`;

const ImageCounter = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

export const ImageFullscreenModal: React.FC<ImageFullscreenModalProps> = ({
  isOpen,
  onClose,
  images,
  currentImageIndex,
  onImageChange,
}) => {
  const currentImage = images[currentImageIndex];

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentImageIndex > 0) {
            onImageChange(currentImageIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentImageIndex < images.length - 1) {
            onImageChange(currentImageIndex + 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, onImageChange, onClose, images.length]);

  // Prevenir scroll da página quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) {
    return null;
  }

  return (
    <Overlay onClick={onClose}>
      <Container onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            {currentImage.category || 'Imagem da Propriedade'}
            {currentImage.isMain && ' (Principal)'}
          </Title>
          <CloseButton onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <ImageContainer>
          <Image
            src={currentImage.url}
            alt={currentImage.category || 'Imagem da propriedade'}
            onClick={e => e.stopPropagation()}
          />
        </ImageContainer>

        <Navigation>
          <NavButton
            onClick={() => onImageChange(currentImageIndex - 1)}
            disabled={currentImageIndex === 0}
          >
            <MdKeyboardArrowLeft />
          </NavButton>
          <NavButton
            onClick={() => onImageChange(currentImageIndex + 1)}
            disabled={currentImageIndex === images.length - 1}
          >
            <MdKeyboardArrowRight />
          </NavButton>
        </Navigation>

        <Footer>
          <ImageCounter>
            {currentImageIndex + 1} de {images.length}
          </ImageCounter>
        </Footer>
      </Container>
    </Overlay>
  );
};
