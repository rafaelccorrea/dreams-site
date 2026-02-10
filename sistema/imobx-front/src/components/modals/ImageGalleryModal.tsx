import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdOpenInNew,
  MdPhotoCamera,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isMain?: boolean;
  }>;
  propertyTitle: string;
  propertyId: string;
  initialIndex?: number;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  propertyTitle,
  propertyId,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const nav = useNavigate();

  if (!isOpen) return null;

  if (!images || images.length === 0) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={e => e.stopPropagation()}>
          <Header>
            <HeaderLeft>
              <Title>{propertyTitle}</Title>
            </HeaderLeft>
            <CloseButton onClick={onClose}>
              <MdClose size={24} />
            </CloseButton>
          </Header>
          <EmptyStateContainer>
            <EmptyStateIcon>
              <MdPhotoCamera size={64} />
            </EmptyStateIcon>
            <EmptyStateTitle>Nenhuma imagem disponível</EmptyStateTitle>
            <EmptyStateDescription>
              Esta propriedade ainda não possui imagens cadastradas na galeria
            </EmptyStateDescription>
          </EmptyStateContainer>
        </Modal>
      </Overlay>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleGoToProperty = () => {
    nav(`/properties/${propertyId}?fromGallery=true`);
  };

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <Title>{propertyTitle}</Title>
            <ImageCounter>
              {currentIndex + 1} / {images.length}
            </ImageCounter>
          </HeaderLeft>
          <HeaderActions>
            <ActionButton onClick={handleGoToProperty} title='Ver propriedade'>
              <MdOpenInNew size={20} />
            </ActionButton>
            <CloseButton onClick={onClose}>
              <MdClose size={24} />
            </CloseButton>
          </HeaderActions>
        </Header>

        <MainImageContainer>
          {images.length > 1 && (
            <NavButton $position='left' onClick={handlePrevious}>
              <MdChevronLeft size={32} />
            </NavButton>
          )}

          <MainImage
            src={currentImage.url}
            alt={currentImage.alt || propertyTitle}
          />

          {images.length > 1 && (
            <NavButton $position='right' onClick={handleNext}>
              <MdChevronRight size={32} />
            </NavButton>
          )}
        </MainImageContainer>

        {images.length > 1 && (
          <Thumbnails>
            {images.map((img, idx) => (
              <Thumbnail
                key={img.id}
                $active={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
              >
                <img src={img.url} alt={img.alt || `Imagem ${idx + 1}`} />
                {img.isMain && <MainBadge>Principal</MainBadge>}
              </Thumbnail>
            ))}
          </Thumbnails>
        )}
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  padding: 20px;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const ImageCounter = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 4px 12px;
  border-radius: 12px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
    border-color: ${props => props.theme.colors.error};
  }
`;

const MainImageContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  min-height: 400px;
  overflow: hidden;
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const NavButton = styled.button<{ $position: 'left' | 'right' }>`
  position: absolute;
  ${props => props.$position}: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }
`;

const Thumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  max-height: 120px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }
`;

const Thumbnail = styled.div<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid
    ${props => (props.$active ? props.theme.colors.primary : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${props => props.theme.colors.primary};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MainBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  min-height: 400px;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}15 0%,
    ${props => props.theme.colors.primaryDark}15 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  color: ${props => props.theme.colors.primary};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 ${props => props.theme.colors.primary}30;
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 20px ${props => props.theme.colors.primary}00;
    }
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

const EmptyStateDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
  max-width: 400px;
`;
