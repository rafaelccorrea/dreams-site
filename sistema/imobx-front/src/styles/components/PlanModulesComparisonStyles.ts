import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-text);
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const PlanCard = styled.div<{ $highlighted?: boolean }>`
  background: var(--color-background-secondary);
  border: 2px solid
    ${props =>
      props.$highlighted ? 'var(--color-primary)' : 'var(--color-border)'};
  border-radius: 12px;
  padding: 1.5rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  ${props =>
    props.$highlighted &&
    `
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  `}
`;

export const PlanHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
`;

export const PlanName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
`;

export const PlanPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
`;

export const ModulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ModulesCount = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ModuleItem = styled.div<{ $exclusive?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${props =>
    props.$exclusive ? 'rgba(0, 123, 255, 0.1)' : 'transparent'};
  transition: background 0.2s;

  &:hover {
    background: ${props =>
      props.$exclusive
        ? 'rgba(0, 123, 255, 0.15)'
        : 'var(--color-background-hover)'};
  }
`;

export const CheckIcon = styled.span`
  color: var(--color-success);
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const ModuleCode = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

export const ModuleName = styled.div`
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.4;
`;

export const ExclusiveBadge = styled.span`
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.125rem 0.5rem;
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--color-background-secondary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-background-tertiary);
  border-bottom: 2px solid var(--color-border);

  &:last-child {
    text-align: center;
  }
`;

export const TableCell = styled.td<{ $center?: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  text-align: ${props => (props.$center ? 'center' : 'left')};
`;

export const ModuleCodeSmall = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

export const CheckMark = styled.span`
  font-size: 1.25rem;
`;

export const CrossMark = styled.span`
  font-size: 1.25rem;
  opacity: 0.5;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
  font-size: 1rem;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-error);
  font-size: 1rem;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid var(--color-error);
`;
