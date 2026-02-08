import styled from 'styled-components';

// Container principal da página de configurações
export const SettingsContainer = styled.div`
  min-height: 100vh;
  padding: 90px 24px 20px 24px;
`;

// Container do conteúdo
export const SettingsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Título da página
export const SettingsTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 24px 0;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 16px;
  }
`;

// Lista de configurações
export const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Seção de configurações
export const SettingsSection = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`;

// Cabeçalho da seção
export const SectionHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  gap: 16px;
`;

// Ícone da seção
export const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryLight} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

// Título da seção
export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-family: 'Poppins', sans-serif;
`;

// Descrição da seção
export const SectionDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-family: 'Poppins', sans-serif;
  line-height: 1.4;
`;

// Lista de itens da seção
export const SectionItems = styled.div`
  padding: 0;
`;

// Item de configuração
export const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

// Informações da configuração
export const SettingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// Nome da configuração
export const SettingName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Descrição da configuração
export const SettingDescription = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-family: 'Poppins', sans-serif;
  line-height: 1.4;
`;

// Container do controle
export const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Toggle switch
export const ToggleSwitch = styled.label<{ $isOn: boolean }>`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  background: ${props =>
    props.$isOn ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 13px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.$isOn
        ? props.theme.colors.primaryDark
        : props.theme.colors.textLight};
  }
`;

// Slider do toggle
export const ToggleSlider = styled.span<{ $isOn: boolean }>`
  position: absolute;
  top: 2px;
  left: ${props => (props.$isOn ? '24px' : '2px')};
  width: 22px;
  height: 22px;
  background: ${props => props.theme.colors.background};
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Input hidden do toggle
export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

// Botão de ação
export const SettingsActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}4D`};
  }

  &:active {
    transform: translateY(0);
  }
`;

// Botão secundário
export const SecondaryButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.textLight};
  }
`;

// Status badge
export const StatusBadge = styled.span<{
  $status: 'active' | 'inactive' | 'warning';
}>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  ${props => {
    // Detectar se é tema escuro baseado na cor de fundo
    const isDark = props.theme.colors.background === '#111827';

    switch (props.$status) {
      case 'active':
        return `
          background: ${isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'};
          color: ${isDark ? '#34d399' : '#065f46'};
          border: 1px solid ${isDark ? '#10b981' : '#10b981'};
        `;
      case 'warning':
        return `
          background: ${isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7'};
          color: ${isDark ? '#fcd34d' : '#92400e'};
          border: 1px solid ${isDark ? '#f59e0b' : '#f59e0b'};
        `;
      case 'inactive':
      default:
        return `
          background: ${isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'};
          color: ${isDark ? '#fca5a5' : '#991b1b'};
          border: 1px solid ${isDark ? '#ef4444' : '#ef4444'};
        `;
    }
  }}
`;
