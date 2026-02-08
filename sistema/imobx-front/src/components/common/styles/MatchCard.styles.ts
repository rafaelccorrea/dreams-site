import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 20px;
  margin: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  flex: 1 1 100%;
  min-width: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ScoreBadge = styled.div<{ $color: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${({ $color }) => $color};
  color: white;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 6px ${({ $color }) => `${$color}40`};
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 6px 14px;
  }
`;

export const FireIcon = styled.span`
  font-size: 20px;
  animation: pulse 1s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;

export const MatchLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 16px;
`;

export const PropertyImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const PropertyInfo = styled.div`
  margin-bottom: 16px;
`;

export const PropertyTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const PropertyPrice = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const PropertyLocation = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: 12px;
`;

export const PropertySpecs = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Spec = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

export const MatchReasons = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
`;

export const ReasonsTitle = styled.h5`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const ReasonsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ReasonItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
`;

export const ReasonIcon = styled.span`
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const ReasonText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.5;
`;

export const CompatibilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  margin: 16px 0;
`;

export const CompatibilityItem = styled.div`
  color: ${({ theme }) => theme.colors.success || '#2ECC71'};
  font-size: 13px;
  font-weight: 500;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

export const AcceptButton = styled(Button)`
  flex: 1;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
  }
`;

export const ViewButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
`;

export const IgnoreButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
  }
`;
