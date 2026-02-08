import styled from 'styled-components';

export const BackButton = styled.button`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.colors.border};
    transform: translateY(-2px);
  }
`;

export const FormContainer = styled.div`
  margin-top: 24px;
`;

export const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label<{ $required?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  ${props =>
    props.$required &&
    `
    &::after {
      content: ' *';
      color: ${props.theme.colors.error};
    }
  `}
`;

export const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}15;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px solid ${props => props.theme.colors.border};
`;

export const SectionTitle = styled.h3`
  grid-column: 1 / -1;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 40px 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid ${props => props.theme.colors.border};

  &:first-child {
    margin-top: 0;
  }
`;
