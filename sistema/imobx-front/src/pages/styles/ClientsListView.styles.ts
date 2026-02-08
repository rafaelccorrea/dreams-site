import styled from 'styled-components';

export const ClientsListContainer = styled.div`
  background: var(--theme-surface, ${props => props.theme.colors.surface});
  border: 1px solid var(--theme-border, ${props => props.theme.colors.border});
  border-radius: 12px;
  overflow-x: auto;
  overflow-y: visible;
  margin-bottom: 24px;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
`;

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 0.8fr 0.8fr 0.5fr;
  gap: 16px;
  padding: 16px 20px;
  background: var(
    --theme-background-secondary,
    ${props => props.theme.colors.backgroundSecondary}
  );
  border-bottom: 1px solid
    var(--theme-border, ${props => props.theme.colors.border});
  font-weight: 600;
  font-size: 14px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1.5fr;
    gap: 14px;
    padding: 14px 18px;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    padding: 12px 14px;
    gap: 12px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    gap: 10px;
    font-size: 11px;
  }
`;

export const HeaderWithTooltip = styled.div`
  cursor: help;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--theme-primary, ${props => props.theme.colors.primary});
    transform: translateY(-1px);
  }
`;

export const ClientRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 0.8fr 0.8fr 0.5fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid
    var(--theme-border, ${props => props.theme.colors.border});
  align-items: center;
  transition: all 0.2s ease;
  min-height: 60px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(
      --theme-background-secondary,
      ${props => props.theme.colors.backgroundSecondary}
    );
  }

  @media (max-width: 1024px) {
    grid-template-columns: 2fr 1.5fr;
    min-height: auto;
    padding: 14px 18px;
    gap: 14px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    padding: 12px 14px;
    gap: 12px;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    gap: 10px;
  }
`;

export const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  /* allow child tooltips to overflow without being clipped */
  overflow: visible;
`;

export const ClientName = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: var(--theme-text, ${props => props.theme.colors.text});
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;

  > span:first-of-type {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const ClientEmail = styled.div`
  font-size: 13px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const ClientLocation = styled.div`
  font-size: 12px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
`;

export const SpouseIndicator = styled.span`
  font-size: 14px;
  margin-left: 4px;
  cursor: help;
`;

export const ClientContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
`;

export const ClientFinancialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
`;

export const ClientPhone = styled.div`
  font-size: 14px;
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ClientTypeBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid transparent;

  ${props => {
    const theme = props.theme;
    const isDark = theme.mode === 'dark';

    switch (props.$type) {
      case 'buyer':
        return `
          background-color: ${isDark ? '#1f2937' : '#f0fdf4'};
          color: ${isDark ? '#86efac' : '#166534'};
          border-color: ${isDark ? '#374151' : '#dcfce7'};
        `;
      case 'seller':
        return `
          background-color: ${isDark ? '#1f2937' : '#fffbeb'};
          color: ${isDark ? '#fbbf24' : '#92400e'};
          border-color: ${isDark ? '#374151' : '#fef3c7'};
        `;
      case 'tenant':
        return `
          background-color: ${isDark ? '#1f2937' : '#eff6ff'};
          color: ${isDark ? '#93c5fd' : '#1e40af'};
          border-color: ${isDark ? '#374151' : '#dbeafe'};
        `;
      case 'landlord':
        return `
          background-color: ${isDark ? '#1f2937' : '#f0f9ff'};
          color: ${isDark ? '#60a5fa' : '#1e3a8a'};
          border-color: ${isDark ? '#374151' : '#e0f2fe'};
        `;
      default:
        return `
          background-color: ${isDark ? '#374151' : '#f9fafb'};
          color: ${isDark ? '#d1d5db' : '#6b7280'};
          border-color: ${isDark ? '#4b5563' : '#e5e7eb'};
        `;
    }
  }}
`;

export const ClientStatus = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid transparent;

  ${props => {
    const theme = props.theme;
    const isDark = theme.mode === 'dark';

    switch (props.$status) {
      case 'active':
        return `
          background-color: ${isDark ? '#1f2937' : '#f0fdf4'};
          color: ${isDark ? '#86efac' : '#166534'};
          border-color: ${isDark ? '#374151' : '#dcfce7'};
        `;
      case 'inactive':
        return `
          background-color: ${isDark ? '#1f2937' : '#fef2f2'};
          color: ${isDark ? '#fca5a5' : '#dc2626'};
          border-color: ${isDark ? '#374151' : '#fecaca'};
        `;
      case 'prospect':
        return `
          background-color: ${isDark ? '#1f2937' : '#eff6ff'};
          color: ${isDark ? '#93c5fd' : '#1e40af'};
          border-color: ${isDark ? '#374151' : '#dbeafe'};
        `;
      case 'lead':
        return `
          background-color: ${isDark ? '#1f2937' : '#fffbeb'};
          color: ${isDark ? '#fbbf24' : '#92400e'};
          border-color: ${isDark ? '#374151' : '#fef3c7'};
        `;
      default:
        return `
          background-color: ${isDark ? '#374151' : '#f9fafb'};
          color: ${isDark ? '#d1d5db' : '#6b7280'};
          border-color: ${isDark ? '#4b5563' : '#e5e7eb'};
        `;
    }
  }}
`;

export const RowActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
    justify-content: center;
    width: 100%;
    flex-direction: column;

    /* Forçar todos os botões dentro a serem full width */
    button {
      width: 100% !important;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

export const ActionsMenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props =>
    props.$isOpen
      ? props.theme.colors.backgroundSecondary
      : props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
    border-color: ${props => props.theme.colors.primary}40;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: auto;
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${props =>
    props.$danger ? props.theme.colors.error : props.theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  user-select: none;

  &:hover {
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}20`
        : props.theme.colors.backgroundSecondary};
    color: ${props =>
      props.$danger ? props.theme.colors.error : props.theme.colors.primary};
    transform: translateX(2px);
  }

  &:active {
    transform: scale(0.98) translateX(2px);
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}25`
        : props.theme.colors.backgroundSecondary};
  }

  &:focus {
    outline: none;
    background: ${props =>
      props.$danger
        ? `${props.theme.colors.error}15`
        : props.theme.colors.backgroundSecondary};
  }

  svg {
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

export const MenuDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 4px 0;
`;

export const MobileHidden = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
`;

export const MobileClientDetails = styled.div`
  background: var(
    --theme-background-secondary,
    ${props => props.theme.colors.backgroundSecondary}
  );
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 6px;
    border-radius: 6px;
  }
`;

export const MobileDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;

  @media (max-width: 768px) {
    font-size: 12px;
    gap: 10px;
  }
`;

export const MobileDetailLabel = styled.span`
  color: var(
    --theme-text-secondary,
    ${props => props.theme.colors.textSecondary}
  );
  font-weight: 500;
`;

export const MobileDetailValue = styled.span`
  color: var(--theme-text, ${props => props.theme.colors.text});
  font-weight: 600;
  text-align: right;
`;
