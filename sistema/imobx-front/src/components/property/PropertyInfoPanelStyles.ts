import styled from 'styled-components';

export const InfoContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--color-background-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary);
  }
`;

export const InfoSection = styled.div`
  padding: 0 24px 24px;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-top: 16px;
`;

export const InfoGrid = styled.div`
  display: grid;
  gap: 12px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
  word-break: break-word;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  background: ${props => props.$status}20;
  color: ${props => props.$status};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--color-background-secondary);
  border-radius: 12px;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

export const UserDetails = styled.div`
  flex: 1;
`;

export const KeyStatus = styled.div<{ $hasKey: boolean }>`
  padding: 16px;
  background: ${props => (props.$hasKey ? '#10B98120' : '#6B728020')};
  border-radius: 12px;
  border: 1px solid ${props => (props.$hasKey ? '#10B981' : '#6B7280')};
`;

export const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const FeatureTag = styled.span`
  background: var(--color-primary);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
`;

export const PriceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;
