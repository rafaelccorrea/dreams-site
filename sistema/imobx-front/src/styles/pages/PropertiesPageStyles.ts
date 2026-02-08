import styled from 'styled-components';
import { MdSearch } from 'react-icons/md';

export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};

  @media (max-width: 1024px) {
    padding: 20px;
  }

  /* 📱 MOBILE: Reduzir padding */
  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    margin-bottom: 20px;
    padding-bottom: 16px;
    gap: 14px;
  }

  /* 📱 MOBILE: Stack vertical */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
`;

export const PageTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => (props.theme.mode === 'light' ? '#6B7280' : '#FFFFFF')};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const OptimizationButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.25);

  svg {
    font-size: 1.1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;

export const CreateButton = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px ${props => props.theme.colors.primary}20;

  @media (max-width: 1024px) {
    padding: 14px 20px;
    font-size: 0.95rem;
  }

  &:hover {
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}30;
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }

  /* 📱 MOBILE: Largura total */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

export const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 1024px) {
    padding: 14px;
    margin-bottom: 20px;
    gap: 14px;
    border-radius: 18px;
  }

  /* 📱 MOBILE: Stack vertical */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 16px;
    margin-bottom: 16px;
  }
`;

export const LeftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 1024px) {
    gap: 16px;
  }

  /* 📱 MOBILE: Coluna, largura total e menor gap */
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 1024px) {
    gap: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 800px;

  @media (max-width: 1024px) {
    max-width: 600px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    padding: 14px 18px 14px 48px;
    font-size: 0.95rem;
    border-radius: 14px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px 12px 46px;
    font-size: 0.9rem;
    border-radius: 12px;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchIcon = styled(MdSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
`;

export const FilterToggle = styled.button`
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 11px 18px;
    font-size: 13px;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
    width: 100%;
    min-height: 44px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
    min-height: 42px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const IntelligentSearchButton = styled(FilterToggle)`
  background: ${props => props.theme.colors.purple};
  color: white;
  border: 2px solid ${props => props.theme.colors.purple};

  &:hover {
    background: ${props => {
      // Extrair o valor hexadecimal da cor roxa e escurecer um pouco
      const purple = props.theme.colors.purple;
      // Se for uma variável CSS, usar fallback
      if (purple.includes('var(')) {
        return '#7C3AED'; // Versão mais escura do roxo
      }
      return purple;
    }};
    border-color: ${props => {
      const purple = props.theme.colors.purple;
      if (purple.includes('var(')) {
        return '#7C3AED';
      }
      return purple;
    }};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;

  /* Evita qualquer scroll horizontal inesperado */
  overflow-x: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
    margin-bottom: 28px;
  }

  /* Tablets menores em landscape: permitir 2 colunas confortáveis */
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  /* Telas muito pequenas: garantir que o card ocupe 100% e tenha respiro lateral */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const PropertyCard = styled.div`
  background: ${props =>
    props.theme.mode === 'light'
      ? '#FFFFFF'
      : props.theme.colors.cardBackground};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.12);
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 380px;
  cursor: pointer;
  position: relative;

  @media (max-width: 1024px) {
    border-radius: 18px;
    min-height: 360px;
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    min-height: 340px;
  }

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
      ${props => props.theme.colors.primaryDark} 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-4px);
  }
`;

export const PropertyImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 3rem;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    height: 190px;
  }

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 170px;
  }
`;

export const PropertyContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  align-items: stretch; /* garante que tudo ocupe a largura toda */

  @media (max-width: 1024px) {
    padding: 20px;
    gap: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 8px;
  }
`;

export const PropertyHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 10px;
`;

export const PropertyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.3;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1.05rem;
    align-items: flex-start;
  }
`;

export const PropertyCode = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 4px 10px;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background: ${props => props.theme.colors.cardBackground};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const PropertyPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${props => props.theme.colors.primary};
  width: 100%;
  /* Permitir quebra de linha em telas menores para não estourar o card */
  white-space: normal;
  word-break: break-word;
  text-align: left;
  margin-top: 2px;

  @media (max-width: 1024px) {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    text-align: left;
  }
`;

export const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 12px;
  font-weight: 500;
  min-height: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 10px;
  }
`;

export const PropertyDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 10px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 10px;
  }
`;

export const PropertyDetail = styled.div`
  text-align: left;
  padding: 10px 10px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

export const PropertyDetailValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

export const PropertyDetailLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PropertyActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.colors.border};

  /* Já empilhado em todas as resoluções */
`;

export const PropertyActionButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  min-height: 44px;
  position: relative;
  overflow: hidden;

  /* No mobile, cada botão ocupa 100% da largura disponível */
  @media (max-width: 768px) {
    width: 100%;
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
`;

export const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 60px 20px;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary}05 0%,
      ${props => props.theme.colors.primaryDark}05 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

export const EmptyStateCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 32px;
  padding: 64px 40px;
  text-align: center;
  max-width: 560px;
  width: 100%;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px ${props => props.theme.colors.primary}10;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.12),
      0 0 0 1px ${props => props.theme.colors.primary}15;
  }

  @media (max-width: 768px) {
    padding: 48px 24px;
    border-radius: 24px;
  }
`;

export const EmptyStateIcon = styled.div`
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
  font-size: 3.5rem;
  position: relative;
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

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.primary}20,
      ${props => props.theme.colors.primaryDark}20
    );
    z-index: -1;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 3rem;
    margin-bottom: 24px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const EmptyStateDescription = styled.p`
  font-size: 1.0625rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 40px 0;
  line-height: 1.7;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 32px;
  }
`;

export const EmptyStateAction = styled.button`
  background: linear-gradient(
    135deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px 40px;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px ${props => props.theme.colors.primary}30,
    0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s ease,
      height 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 28px ${props => props.theme.colors.primary}40,
      0 4px 12px rgba(0, 0, 0, 0.15);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 2px 12px ${props => props.theme.colors.primary}30,
      0 1px 4px rgba(0, 0, 0, 0.1);
  }

  svg {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(90deg) scale(1.1);
  }

  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
    width: 100%;
    max-width: 280px;
  }
`;

export const EmptyStateSecondaryAction = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 12px;

  &:hover {
    background: ${props => props.theme.colors.border};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 0.9375rem;
    width: 100%;
    max-width: 280px;
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
`;

export const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$active
      ? props.theme.colors.primary
      : props.theme.colors.cardBackground};
  color: ${props => (props.$active ? 'white' : props.theme.colors.text)};
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.$active
        ? props.theme.colors.primaryDark
        : props.theme.colors.primary}20;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Legacy components for backward compatibility
export const CustomButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'small' | 'medium' | 'large';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;

  ${props => {
    const size = props.$size || 'medium';
    const sizes = {
      small: '10px 16px',
      medium: '14px 20px',
      large: '18px 28px',
    };
    const fontSizes = {
      small: '0.875rem',
      medium: '0.95rem',
      large: '1.125rem',
    };

    return `
      padding: ${sizes[size]};
      font-size: ${fontSizes[size]};
    `;
  }}

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryDark} 100%);
          color: white;
            box-shadow: 0 4px 12px ${props => `${props.theme.colors.primary}40`};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px ${props => `${props.theme.colors.primary}59`};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.error} 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'secondary':
      default:
        return `
          background: ${props.theme.colors.cardBackground};
          color: ${props.theme.colors.text};
          border: 2px solid ${props.theme.colors.border};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.backgroundSecondary};
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const CustomInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 0.95rem;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.colors.border};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.25rem;
  pointer-events: none;
  transition: color 0.3s ease;

  ${SearchWrapper}:focus-within & {
    color: ${props => props.theme.colors.primary};
  }
`;

export const Space = styled.div<{ $size?: 'small' | 'middle' | 'large' }>`
  display: flex;
  gap: ${props => {
    switch (props.$size) {
      case 'small':
        return '8px';
      case 'large':
        return '24px';
      case 'middle':
      default:
        return '16px';
    }
  }};
`;
