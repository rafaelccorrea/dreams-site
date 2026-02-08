import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 0 !important;
  margin: 0 !important;
`;

export const FullBleed = styled.div`
  position: relative;
  width: calc(100% + 48px);
  margin-left: -24px;
  margin-right: -24px;
  margin-top: -24px;
  margin-bottom: -24px;
  padding: 24px;

  @media (max-width: 1024px) {
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
    margin-top: -20px;
    margin-bottom: -20px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    width: calc(100% + 32px);
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -16px;
    margin-bottom: -16px;
    padding: 16px;
  }

  @media (max-width: 480px) {
    width: calc(100% + 24px);
    margin-left: -12px;
    margin-right: -12px;
    margin-top: -14px;
    margin-bottom: -14px;
    padding: 14px 12px;
  }
`;

export const Container = styled.div`
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const TooltipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  color: ${props => props.theme.colors.textSecondary};
  cursor: help;
  position: relative;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const LabelWithTooltip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: 0.95rem;
`;

export const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
`;

export const CheckboxRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckboxItem = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.theme.colors.cardBackground};
  font-size: 0.9rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

export const Button = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props =>
    props.$variant === 'primary'
      ? props.theme.colors.primary
      : props.$variant === 'danger'
        ? '#ef4444'
        : props.theme.colors.cardBackground};
  color: ${props =>
    props.$variant === 'primary' || props.$variant === 'danger'
      ? 'white'
      : props.theme.colors.text};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const StatusPill = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  background: ${props =>
    props.$active ? 'rgba(34,197,94,0.12)' : 'rgba(107,114,128,0.12)'};
  color: ${props => (props.$active ? '#22c55e' : '#6b7280')};
  font-weight: 700;
  font-size: 0.9rem;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const Inline = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Hint = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  padding: 24px 12px;
`;

export const Shimmer = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 25%,
    ${props => props.theme.colors.border || '#e0e0e0'} 50%,
    ${props => props.theme.colors.backgroundSecondary || '#f0f0f0'} 75%
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

export const ShimmerField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ShimmerRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;
