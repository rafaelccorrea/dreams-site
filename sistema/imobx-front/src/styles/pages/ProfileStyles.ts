import styled, { keyframes } from 'styled-components';

// Animação de loading
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Container principal da página de perfil
export const ProfileContainer = styled.div`
  min-height: 100vh;
  padding: 0;
`;

// Container do conteúdo
export const ProfileContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

// Título da página
export const ProfileTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 16px 0 20px 16px;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-left: 12px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-left: 8px;
  }
`;

// Header do perfil
export const ProfileHeader = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  overflow: hidden;

  /* Gradiente sutil de fundo */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${props => props.theme.colors.primary} 0%,
      ${props => props.theme.colors.primaryLight} 100%
    );
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 24px 16px;
    gap: 20px;
  }
`;

// Seção do avatar
export const AvatarSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;

// Container do avatar
export const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryLight} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px ${props => `${props.theme.colors.primary}4D`};
  border: 4px solid ${props => props.theme.colors.background};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px ${props => `${props.theme.colors.primary}66`};
  }
`;

// Imagem do avatar
export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

// Botão de upload do avatar
export const AvatarUploadButton = styled.button`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: ${props => props.theme.colors.primary};
  position: absolute;
  bottom: -5px;
  right: -5px;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(28, 78, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Animação de loading */
  .loading-spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

// Informações do usuário no header
export const UserInfoHeader = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Nome do usuário
export const UserName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

// Função do usuário
export const UserRole = styled.div`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryLight} 100%
  );
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 2px 8px rgba(28, 78, 255, 0.3);
  align-self: flex-start;
`;

// Estatísticas do usuário
export const UserStats = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px;
  }
`;

// Item de estatística
export const StatItem = styled.div`
  text-align: center;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.borderLight};
  min-width: 80px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    min-width: 70px;
    padding: 12px;
  }
`;

// Valor da estatística
export const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 4px;
`;

// Label da estatística
export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Grid principal do perfil
export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Seção do perfil
export const ProfileSection = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// Título da seção
export const ProfileSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Poppins', sans-serif;
`;

// Lista de informações
export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Item de informação
export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.borderLight};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Ícone da informação
export const InfoIcon = styled.div`
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
  margin-right: 16px;
  color: white;
  flex-shrink: 0;
`;

// Conteúdo da informação
export const InfoContent = styled.div`
  flex: 1;
`;

// Label da informação
export const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Valor da informação
export const InfoValue = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

// Botão de editar
export const EditButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(28, 78, 255, 0.3);
  }
`;

// Card da empresa
export const CompanyCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-bottom: 0;
  }
`;

// Header da empresa
export const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

// Nome da empresa
export const CompanyName = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Poppins', sans-serif;
`;

// Ícone da empresa
export const CompanyIcon = styled.div`
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
  color: white;
  font-size: 1.25rem;
`;

// Informações da empresa
export const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// Item de informação da empresa
export const CompanyInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.borderLight};
`;

// Ícone da informação da empresa
export const CompanyInfoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

// Conteúdo da informação da empresa
export const CompanyInfoContent = styled.div`
  flex: 1;
`;

// Label da informação da empresa
export const CompanyInfoLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

// Valor da informação da empresa
export const CompanyInfoValue = styled.div`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

// Ações da empresa
export const CompanyActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Botão de ação da empresa
export const CompanyActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Poppins', sans-serif;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(28, 78, 255, 0.3);
  }

  &.secondary {
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => props.theme.colors.hover};
      border-color: ${props => props.theme.colors.textLight};
    }
  }
`;

// Grid de estatísticas
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

// Card de estatística
export const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

// Ícone do card de estatística
export const StatCardIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryLight} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 1.25rem;
`;

// Valor do card de estatística
export const StatCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 8px;
`;

// Label do card de estatística
export const StatCardLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

// Estado vazio
export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
`;

// Ícone do estado vazio
export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
  color: ${props => props.theme.colors.textLight};
`;

// Título do estado vazio
export const EmptyStateTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

// Descrição do estado vazio
export const EmptyStateDescription = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
`;

// Mensagem de erro
export const ProfileErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
`;
