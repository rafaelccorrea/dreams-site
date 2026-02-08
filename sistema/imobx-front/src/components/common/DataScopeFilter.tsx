import React from 'react';
import styled from 'styled-components';

const DataScopeSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DataScopeTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DataScopeOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  margin: 0;
  width: 1rem;
  height: 1rem;
  accent-color: ${props => props.theme.colors.primary};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  flex: 1;
`;

const Description = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
  line-height: 1.4;
`;

interface DataScopeFilterProps {
  /** Valor atual da flag onlyMyData */
  onlyMyData?: boolean;
  /** Callback chamado quando o valor muda */
  onChange: (onlyMyData: boolean) => void;
  /** Texto personalizado para o label */
  label?: string;
  /** Texto personalizado para a descrição */
  description?: string;
  /** Se deve mostrar a seção (útil para controlar visibilidade baseada no perfil do usuário) */
  show?: boolean;
}

/**
 * Componente reutilizável para filtros de escopo de dados
 *
 * Permite aos usuários escolher entre ver todos os dados (baseado na hierarquia)
 * ou apenas seus próprios dados.
 *
 * @example
 * <DataScopeFilter
 *   onlyMyData={filters.onlyMyData}
 *   onChange={(value) => setFilters({ ...filters, onlyMyData: value })}
 *   label="Mostrar apenas minhas propriedades"
 *   description="Quando marcado, mostra apenas propriedades que você cadastrou, ignorando hierarquia de usuários."
 * />
 */
export const DataScopeFilter: React.FC<DataScopeFilterProps> = ({
  onlyMyData = false,
  onChange,
  label = 'Mostrar apenas meus dados',
  description = 'Quando marcado, mostra apenas dados que você criou, ignorando hierarquia de usuários.',
  show = true,
}) => {
  if (!show) {
    return null;
  }

  return (
    <DataScopeSection>
      <DataScopeTitle>👤 Escopo de Dados</DataScopeTitle>

      <DataScopeOption>
        <Checkbox
          type='checkbox'
          id='onlyMyData'
          checked={onlyMyData}
          onChange={e => onChange(e.target.checked)}
        />
        <Label htmlFor='onlyMyData'>
          {label}
          <Description>{description}</Description>
        </Label>
      </DataScopeOption>
    </DataScopeSection>
  );
};

export default DataScopeFilter;
