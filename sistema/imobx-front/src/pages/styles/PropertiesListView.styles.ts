import styled from 'styled-components';

export const PropertiesListContainer = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow-x: auto;
  overflow-y: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
`;
export const ListHeader = styled.div`
  display: grid;
  grid-template-columns:
    minmax(320px, 3fr) /* Propriedade */
    minmax(140px, 1fr) /* Localização (reduzido) */
    minmax(110px, 0.7fr) /* Tipo (reduzido) */
    minmax(150px, 1fr) /* Preço */
    minmax(180px, 1fr) /* Especificações (reduzido) */
    minmax(120px, 0.6fr) /* Ações (submenu) */;
  gap: 20px;
  padding: 16px 20px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    text-align: center;

    &:nth-child(1) {
      justify-content: flex-start;
      text-align: left;
    }
    &:nth-child(2) {
      justify-content: center;
    }
    &:nth-child(3) {
      justify-content: center;
    }
    &:nth-child(4) {
      justify-content: center;
    }
    &:nth-child(5) {
      justify-content: center;
    }
    &:nth-child(6) {
      justify-content: center;
    }
  }

  @media (max-width: 1100px) {
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 12px;
  }

  @media (max-width: 640px) {
    display: none; /* Em mobile, o cabeçalho consome espaço e polui a leitura */
  }
`;

export const PropertyRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(320px, 3fr)
    minmax(140px, 1fr)
    minmax(110px, 0.7fr)
    minmax(150px, 1fr)
    minmax(180px, 1fr)
    minmax(120px, 0.6fr);
  gap: 20px;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background-color 0.2s ease;
  align-items: center;

  > * {
    min-width: 0;

    &:nth-child(1) {
      justify-self: start;
    }
    &:nth-child(2) {
      justify-self: center;
    }
    &:nth-child(3) {
      justify-self: center;
    }
    &:nth-child(4) {
      justify-self: center;
    }
    &:nth-child(5) {
      justify-self: center;
    }
    &:nth-child(6) {
      justify-self: center;
    }
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 12px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr; /* Card de uma coluna no mobile */
    gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    background: ${props => props.theme.colors.cardBackground};
    margin: 8px 12px;
    border: 1px solid ${props => props.theme.colors.border};
  }
`;

export const PropertyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  @media (max-width: 640px) {
    align-items: flex-start;
    gap: 12px;
  }
`;

export const PropertyImagesStack = styled.div`
  position: relative;
  width: 88px;
  height: 60px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 74px;
    height: 50px;
  }
`;

export const PropertyImage = styled.div<{
  $imageUrl?: string;
  $index?: number;
  $total?: number;
}>`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${props =>
    props.$imageUrl
      ? `url(${props.$imageUrl}) center center / cover`
      : props.theme.colors.backgroundSecondary};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 24px;
  border: 2px solid ${props => props.theme.colors.cardBackground};
  position: ${props =>
    props.$index !== undefined && props.$index > 0 ? 'absolute' : 'relative'};
  top: 0;
  left: ${props =>
    props.$index !== undefined && props.$index > 0
      ? `${props.$index * 8}px`
      : '0'};
  z-index: ${props =>
    props.$total !== undefined && props.$index !== undefined
      ? props.$total - props.$index
      : 1};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    left: ${props =>
      props.$index !== undefined && props.$index > 0
        ? `${props.$index * 6}px`
        : '0'};
  }
`;

export const ImageCount = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  border: 2px solid ${props => props.theme.colors.cardBackground};
  z-index: 1000;
  min-width: 20px;
  text-align: center;
`;

export const PropertyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const PropertyTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const PropertyCode = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-family: monospace;
`;

export const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const PropertyPrice = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  white-space: nowrap;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  /* Em mobile, trazer o preço para uma linha inteira logo abaixo do título */
  @media (max-width: 640px) {
    justify-self: start;
    text-align: left;
    grid-column: 1 / -1;
    font-size: 18px;
    margin-top: 2px;
  }
`;

export const PropertyType = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const PropertySpecs = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 12px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  width: 100%;

  @media (max-width: 768px) {
    gap: 8px;
    font-size: 12px;
  }
`;

export const PropertySpec = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  min-width: fit-content;

  svg {
    flex-shrink: 0;
  }
`;

export const PropertySpecPlaceholder = styled.div`
  width: 0;
  visibility: hidden;
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }

  /* Em mobile, ações ocupam a última linha com alinhamento à direita */
  @media (max-width: 640px) {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info';
  $customBackground?: string;
  $customColor?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  min-width: 34px;
  min-height: 34px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    font-size: 14px;
  }

  ${props => {
    // Se tem customBackground, usar ele
    if (props.$customBackground) {
      return `
        background: ${props.$customBackground};
        color: ${props.$customColor || 'white'};
        
        &:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `;
    }

    if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        
        &:hover {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'success') {
      return `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        
        &:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'info') {
      return `
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        
        &:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `;
    } else if (props.$variant === 'primary') {
      return `
        background: ${props.theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${props.theme.colors.primaryDark};
          transform: translateY(-1px);
        }
      `;
    } else {
      return `
        background: ${props.theme.colors.backgroundSecondary};
        color: ${props.theme.colors.textSecondary};
        
        &:hover {
          background: ${props.theme.colors.background};
          color: ${props.theme.colors.text};
          transform: translateY(-1px);
        }
      `;
    }
  }}

  &:active {
    transform: scale(0.95);
  }
`;

export const MobileHidden = styled.div`
  @media (max-width: 900px) {
    display: none;
  }
`;

export const TabletHidden = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobilePropertyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const MobileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

export const MobileDetailLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

export const MobileDetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

// Wrapper para botões de ação para garantir tamanho consistente
export const ActionButtonWrapper = styled.span`
  display: inline-block;

  /* Garantir que botões dentro tenham tamanho consistente */
  button {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;

    @media (max-width: 768px) {
      width: 32px !important;
      height: 32px !important;
      min-width: 32px !important;
      min-height: 32px !important;
    }
  }
`;

export const ActionsMenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const ActionsMenu = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 8px;
  min-width: 220px;
  z-index: 1000;
`;

export const ActionsMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  text-align: left;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary}15;
    color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
