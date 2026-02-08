import styled from 'styled-components';

export const PropertyDetailsContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  transition: background-color 0.3s ease;
`;

export const PropertyDetailsHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 24px 32px;
  margin-bottom: 32px;

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 20px 24px;
    margin-bottom: 28px;
  }

  @media (min-width: 1025px) and (max-width: 1400px) {
    padding: 28px;
    margin-bottom: 36px;
  }

  @media (min-width: 1401px) {
    padding: 32px 40px;
    margin-bottom: 40px;
  }

  @media (max-width: 768px) {
    padding: 16px 16px;
    margin-bottom: 24px;
  }
`;

export const PropertyDetailsHeaderContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

export const PropertyDetailsActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const BackButton = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 24px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PropertyDetailsContent = styled.div`
  width: 100%;
  padding: 0 32px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (min-width: 1401px) {
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    padding: 0 40px 28px;
  }

  @media (max-width: 1400px) and (min-width: 1201px) {
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    padding: 0 28px 24px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1.5fr 1fr;
    gap: 18px;
    padding: 0 24px 22px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 0 20px 20px;
  }

  @media (max-width: 768px) {
    padding: 0 16px 18px;
    gap: 16px;
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 16px;
  }

  @media (min-width: 1025px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 16px;
  }

  @media (min-width: 1025px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

// Card Components
export const PropertyCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: visible;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 18px;
    border-radius: 14px;
  }

  @media (min-width: 1025px) {
    padding: 22px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const PropertyHeader = styled.div`
  margin-bottom: 24px;
`;

export const PropertyTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (min-width: 1025px) {
    font-size: 2.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const PropertyCode = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text} !important;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 4px 12px;
  border-radius: 8px;
  -webkit-text-fill-color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary} !important;
    -webkit-text-fill-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const PropertyAddress = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PropertyPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 16px;
`;

export const PropertyStatus = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.$status) {
      case 'available':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
          border: 1px solid ${props.theme.colors.success}30;
        `;
      case 'rented':
        return `
          background: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
          border: 1px solid ${props.theme.colors.warning}30;
        `;
      case 'sold':
        return `
          background: ${props.theme.colors.error}20;
          color: ${props.theme.colors.error};
          border: 1px solid ${props.theme.colors.error}30;
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
          border: 1px solid ${props.theme.colors.border};
        `;
    }
  }}
`;

export const PropertyDescription = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 12px 0;
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin: 0;
  }
`;

export const PropertyCharacteristics = styled.div`
  margin-bottom: 0;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 12px 0;
  }
`;

export const CharacteristicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  @media (min-width: 1025px) and (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1401px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const CharacteristicItem = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 14px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  transition: all 0.2s ease;

  @media (min-width: 1025px) {
    padding: 16px 14px;
  }

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

export const CharacteristicValue = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const CharacteristicLabel = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const PropertyFeatures = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 16px 0;
  }
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FeatureTag = styled.span`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}20 0%,
    ${props => props.theme.colors.primary}10 100%
  );
  color: ${props => props.theme.colors.primary};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

export const PropertyPrices = styled.div`
  margin-bottom: 0;

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 12px 0;
  }
`;

export const PricesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (min-width: 1025px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const PriceItem = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  padding: 14px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  transition: all 0.2s ease;

  @media (min-width: 1025px) {
    padding: 16px 14px;
  }

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

export const PriceLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  font-weight: 500;
`;

export const PriceValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

// Action Buttons
export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  width: 100%;
  min-height: 44px;
  position: relative;
  overflow: hidden;

  @media (min-width: 769px) and (max-width: 1024px) {
    padding: 11px 18px;
    font-size: 0.875rem;
    min-height: 42px;
  }

  @media (min-width: 1025px) {
    padding: 13px 22px;
    font-size: 0.95rem;
    min-height: 46px;
  }

  @media (max-width: 768px) {
    padding: 11px 18px;
    font-size: 0.875rem;
    min-height: 42px;
  }

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.primary}25;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.primary}35;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.error} 0%, #dc2626 100%);
        color: white;
        box-shadow: 0 4px 15px ${props.theme.colors.error}25;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${props.theme.colors.error}35;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.border};
        
        &:hover {
          background: ${props.theme.colors.primary}10;
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px ${props.theme.colors.primary}15;
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

// Image Gallery
export const ImageGallery = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const GalleryItem = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.theme.colors.border};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const GalleryImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
`;

export const GalleryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GalleryItem}:hover & {
    opacity: 1;
  }
`;

export const GalleryInfo = styled.div`
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
`;

// Map Section
export const PropertyMapSection = styled.div`
  margin-bottom: 24px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const MapContainer = styled.div`
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  @media (min-width: 1025px) {
    height: 350px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    height: 280px;
  }

  @media (max-width: 768px) {
    height: 250px;
  }
`;

// Clients Section
export const PropertyClientsSection = styled.div`
  margin-bottom: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    @media (min-width: 1025px) {
      font-size: 1.125rem;
      margin-bottom: 10px;
    }
  }
`;

// Loading and Error States
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
  text-align: center;
`;

export const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.error};
  margin: 0 0 12px 0;
`;

export const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1rem;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

export const ErrorButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
  }

  &:active {
    transform: translateY(0);
  }
`;

// Location and Map Grid
export const LocationMapGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: start;

  @media (min-width: 769px) and (max-width: 1024px) {
    gap: 18px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media (min-width: 1025px) {
    gap: 22px;
  }
`;

// Responsive adjustments
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;
