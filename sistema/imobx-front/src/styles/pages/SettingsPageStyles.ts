import styled from 'styled-components';

// Container principal da página de configurações
export const SettingsContainer = styled.div`
  min-height: 100vh;
  padding: 32px;
  background: ${props => props.theme.colors.background};
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// Container do conteúdo
export const SettingsContent = styled.div`
  width: 100%;
`;

// Header moderno
export const SettingsHeader = styled.div`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

// Título da página
export const SettingsTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0 0 12px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const SettingsSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Grid de configurações
export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

// Seção de configurações moderna
export const SettingsSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};
  transition: all 0.3s ease;
  position: relative;
  z-index: 0;
  will-change: transform, box-shadow;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.4)'
          : 'rgba(0, 0, 0, 0.12)'};
    border-color: ${props => props.theme.colors.primary}40;
    z-index: 2;
  }
`;

// Cabeçalho da seção moderno
export const SectionHeader = styled.div`
  padding: 32px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary}10 0%,
    ${props => props.theme.colors.primary}05 100%
  );
  border-bottom: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

// Container do header
export const SectionHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

// Ícone da seção moderno
export const SectionIcon = styled.div<{ $color?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    ${props => props.$color || props.theme.colors.primary} 0%,
    ${props => props.$color || props.theme.colors.primaryDark} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px
    ${props => props.$color || props.theme.colors.primary}30;
`;

// Informações da seção
export const SectionInfo = styled.div`
  flex: 1;
`;

// Título da seção
export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Descrição da seção
export const SectionDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
`;

// Lista de itens da seção
export const SectionItems = styled.div`
  padding: 0;
`;

// Item de configuração moderno
export const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  @media (max-width: 768px) {
    padding: 18px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

// Informações do item
export const SettingInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Ícone do item
export const SettingIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

// Conteúdo do item
export const SettingContent = styled.div`
  flex: 1;
`;

// Nome do item
export const SettingName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Descrição do item
export const SettingDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

// Controles do item
export const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  & > * {
    min-width: 0;
  }

  & > input {
    flex: 1 1 220px;
    max-width: 100%;
  }
`;

// Toggle switch moderno
export const ToggleSwitch = styled.label<{ $isOn: boolean }>`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 32px;
  cursor: pointer;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

export const ToggleSlider = styled.span<{ $isOn: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props =>
    props.$isOn ? props.theme.colors.primary : props.theme.colors.border};
  transition: all 0.3s ease;
  border-radius: 32px;
  box-shadow: 0 2px 8px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.1)'};

  &:before {
    position: absolute;
    content: '';
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background: white;
    transition: all 0.3s ease;
    border-radius: 50%;
    transform: ${props => (props.$isOn ? 'translateX(28px)' : 'translateX(0)')};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    box-shadow: 0 4px 12px
      ${props =>
        props.$isOn
          ? props.theme.colors.primary + '40'
          : 'rgba(0, 0, 0, 0.15)'};
  }
`;

// Badge de status moderno
export const StatusBadge = styled.span<{
  $status: 'active' | 'inactive' | 'warning' | 'success';
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.$status) {
      case 'active':
        return `
          background: ${props.theme.mode === 'dark' ? '#065f46' : '#d1fae5'};
          color: ${props.theme.mode === 'dark' ? '#6ee7b7' : '#065f46'};
        `;
      case 'success':
        return `
          background: ${props.theme.mode === 'dark' ? '#1e3a8a' : '#dbeafe'};
          color: ${props.theme.mode === 'dark' ? '#93c5fd' : '#1e40af'};
        `;
      case 'warning':
        return `
          background: ${props.theme.mode === 'dark' ? '#92400e' : '#fef3c7'};
          color: ${props.theme.mode === 'dark' ? '#fbbf24' : '#92400e'};
        `;
      case 'inactive':
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}
`;

// Botão de ação moderno
export const ActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  max-width: 100%;
  white-space: nowrap;

  ${props => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
        color: white;
        box-shadow: 0 4px 16px ${props.theme.colors.primary}30;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${props.theme.colors.primary}40;
        }
      `;
    } else if (props.$variant === 'danger') {
      return `
        background: ${props.theme.mode === 'dark' ? '#7f1d1d' : '#fee2e2'};
        color: ${props.theme.mode === 'dark' ? '#fca5a5' : '#991b1b'};
        border: 2px solid ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'dark' ? '#991b1b' : '#fecaca'};
          transform: translateY(-2px);
        }
      `;
    } else {
      return `
        background: ${props.theme.mode === 'light' ? '#F3F4F6' : props.theme.colors.background};
        color: ${props.theme.colors.text};
        border: 2px solid ${props.theme.colors.border};

        &:hover:not(:disabled) {
          background: ${props.theme.mode === 'light' ? '#E5E7EB' : props.theme.colors.primary + '10'};
          border-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.primary};
          transform: translateY(-2px);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
    font-size: 0.9rem;
    padding: 12px 18px;
  }
`;

// Seção de estatísticas
export const StatsSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
`;

export const StatCard = styled.div<{
  $type?: 'total' | 'active' | 'warning' | 'success';
}>`
  text-align: center;
  padding: 24px;
  border-radius: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px
      ${props =>
        props.theme.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.1)'};
  }
`;

export const StatValue = styled.div<{
  $type?: 'total' | 'active' | 'warning' | 'success';
}>`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => {
    switch (props.$type) {
      case 'total':
        return props.theme.colors.primary;
      case 'active':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#3b82f6';
      default:
        return props.theme.colors.text;
    }
  }};
  margin-bottom: 8px;
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

// Seção de ações rápidas
export const QuickActionsSection = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px
    ${props =>
      props.theme.mode === 'dark'
        ? 'rgba(0, 0, 0, 0.3)'
        : 'rgba(0, 0, 0, 0.08)'};

  @media (max-width: 768px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

export const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

export const QuickActionCard = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${props => props.theme.colors.primary}20;
  }

  &:active {
    transform: translateY(-2px);
  }
`;

export const QuickActionIcon = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color || props.theme.colors.primary}20;
  color: ${props => props.$color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

export const QuickActionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const QuickActionDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`;

// Estados vazios e de erro
export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 2px dashed ${props => props.theme.colors.border};
  margin: 40px 0;

  @media (max-width: 768px) {
    padding: 60px 16px;
    margin: 32px 0;
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

// Legacy components for compatibility
export const SettingsList = SettingsGrid;
export const SettingsActionButton = ActionButton;
export const SecondaryButton = ActionButton;
