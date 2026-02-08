import styled from 'styled-components';

export const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 20px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 10px 20px;
    min-width: 0;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 13px;

    span {
      display: none;
    }
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const FilterInput = styled.input`
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
  min-width: 200px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    display: block;
    border: none;
    background: transparent;
  }

  tbody {
    @media (max-width: 768px) {
      display: block;
      width: 100%;
    }
  }
`;

export const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background: ${props => props.theme.colors.background};
  }

  @media (max-width: 768px) {
    display: block;
    background: ${props => props.theme.colors.cardBackground};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 12px;
    margin-bottom: 16px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableCell = styled.td`
  padding: 16px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid ${props => props.theme.colors.border}30;

    &:before {
      content: attr(data-label);
      font-weight: 600;
      color: ${props => props.theme.colors.textSecondary};
      margin-right: 12px;
      flex-shrink: 0;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 8px 0;

    &:before {
      margin-right: 0;
      margin-bottom: 4px;
    }
  }
`;

export const Badge = styled.span<{ $permanent?: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => (props.$permanent ? '#ef4444' : '#f59e0b')};
  color: white;
`;

export const ActionsCell = styled.td`
  padding: 16px;
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    display: block;
    padding: 12px 0 0 0;
    border-top: 1px solid ${props => props.theme.colors.border};
    margin-top: 12px;
  }
`;

export const ActionButton = styled.button<{
  $variant?: 'danger' | 'secondary';
}>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  ${props => {
    if (props.$variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { opacity: 0.9; }
      `;
    }
    return `
      background: ${props.theme.colors.cardBackground};
      color: ${props.theme.colors.text};
      border: 1px solid ${props.theme.colors.border};
      &:hover { background: ${props.theme.colors.background}; }
    `;
  }}
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 32px 12px;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    width: 100%;
    border-radius: 8px;
    max-height: 95vh;
  }
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 16px; /* Evita zoom no iOS */
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
  background: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  min-height: 80px;
  resize: vertical;

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 16px; /* Evita zoom no iOS */
    min-height: 100px;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 20px;
  }
`;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props =>
    props.$variant === 'primary'
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    &:hover { opacity: 0.9; }
  `
      : `
    background: ${props.theme.colors.cardBackground};
    color: ${props.theme.colors.text};
    border: 1px solid ${props.theme.colors.border};
    &:hover { background: ${props.theme.colors.background}; }
  `}

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
  }
`;
