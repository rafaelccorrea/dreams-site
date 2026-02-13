import styled from 'styled-components';

// —— Layout ———————————————————————————————————————————————————————————————
export const PageContainer = styled.div`
  padding: 24px 32px 32px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 16px 20px 24px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.borderLight};
    color: ${props => props.theme.colors.primary};
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.25;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
`;

// —— Content: two columns on desktop, single on mobile ———————————————————
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 28px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// —— Cards: clean, no gradient bar ——————————————————————————————————————————
export const Card = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 28px 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 1px 3px rgba(0,0,0,0.2)'
      : '0 1px 3px rgba(0,0,0,0.06)'};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${props =>
      props.theme.mode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.25)'
        : '0 4px 12px rgba(0,0,0,0.08)'};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  letter-spacing: -0.01em;
`;

export const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => `${props.theme.colors.primary}12`};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
`;

// —— Form ——————————————————————————————————————————————————————————————————
export const FormGroup = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;

  svg {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.9375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:hover {
    border-color: ${props => props.theme.colors.borderLight};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}18`};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 36px 12px 14px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.9375rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}18`};
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

// —— Messages —————————————————————————————————————————————————────────—————
export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.8125rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: ${props => `${props.theme.colors.primary}0c`};
  border: 1px solid ${props => `${props.theme.colors.primary}25`};
  border-radius: 10px;
  margin-bottom: 20px;

  svg {
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const InfoText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.45;
`;

// —— Action bar (sticky footer) —————————————————————————————————────────————
export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding: 20px 24px;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 14px;
  box-shadow: ${props =>
    props.theme.mode === 'dark'
      ? '0 -2px 10px rgba(0,0,0,0.2)'
      : '0 -2px 10px rgba(0,0,0,0.04)'};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-top: 24px;
    padding: 16px 20px;
  }
`;

export const ActionBarSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};

  svg {
    flex-shrink: 0;
    opacity: 0.8;
  }
`;

export const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.15s;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.borderLight};
  }
`;
