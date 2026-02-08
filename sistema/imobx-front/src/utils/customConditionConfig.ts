/**
 * Configuração inteligente para validação "Condição Customizada" do Kanban.
 * Define por campo: tipo de valor, operadores permitidos e opções de valor quando aplicável.
 * Evita combinações sem sentido (ex.: "data maior que texto").
 */

export type ConditionOperator =
  | 'empty'
  | 'not_empty'
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'less_than'
  | 'greater_or_equal'
  | 'less_or_equal'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in';

export type ConditionValueType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'array';

export const CONDITION_OPERATOR_OPTIONS: {
  value: ConditionOperator;
  label: string;
}[] = [
  { value: 'empty', label: 'Está vazio' },
  { value: 'not_empty', label: 'Não está vazio' },
  { value: 'equals', label: 'Igual a' },
  { value: 'not_equals', label: 'Diferente de' },
  { value: 'greater_than', label: 'Maior que' },
  { value: 'less_than', label: 'Menor que' },
  { value: 'greater_or_equal', label: 'Maior ou igual' },
  { value: 'less_or_equal', label: 'Menor ou igual' },
  { value: 'contains', label: 'Contém' },
  { value: 'not_contains', label: 'Não contém' },
  { value: 'in', label: 'Está na lista' },
  { value: 'not_in', label: 'Não está na lista' },
];

/** Operadores que não exigem valor */
export const OPERATORS_WITHOUT_VALUE: ConditionOperator[] = [
  'empty',
  'not_empty',
];

/** Operadores que exigem array (in, not_in) */
export const OPERATORS_REQUIRING_ARRAY: ConditionOperator[] = ['in', 'not_in'];

/** Operadores de comparação numérica/data (maior, menor, etc.) */
const COMPARISON_OPERATORS: ConditionOperator[] = [
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'greater_or_equal',
  'less_or_equal',
];

/** Operadores para texto (contém, lista) */
const TEXT_OPERATORS: ConditionOperator[] = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'in',
  'not_in',
];

/** Campos da tarefa disponíveis para condição customizada */
export const CONDITION_FIELD_OPTIONS: { value: string; label: string }[] = [
  { value: 'assignedToId', label: 'Responsável' },
  { value: 'dueDate', label: 'Data de vencimento' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'title', label: 'Título' },
  { value: 'description', label: 'Descrição' },
  { value: 'projectId', label: 'Projeto' },
];

/** valueType padrão por campo */
const FIELD_VALUE_TYPE: Record<string, ConditionValueType> = {
  dueDate: 'date',
  priority: 'string',
  assignedToId: 'string',
  title: 'string',
  description: 'string',
  projectId: 'string',
};

/** Operadores permitidos por campo (evita "data contém", "texto maior que", etc.) */
const ALLOWED_OPERATORS_BY_FIELD: Record<string, ConditionOperator[]> = {
  dueDate: [
    'empty',
    'not_empty',
    'equals',
    'not_equals',
    'greater_than',
    'less_than',
    'greater_or_equal',
    'less_or_equal',
  ],
  priority: ['empty', 'not_empty', 'equals', 'not_equals', 'in', 'not_in'],
  assignedToId: ['empty', 'not_empty', 'equals', 'not_equals'],
  projectId: ['empty', 'not_empty', 'equals', 'not_equals'],
  title: [
    'empty',
    'not_empty',
    'equals',
    'not_equals',
    'contains',
    'not_contains',
    'in',
    'not_in',
  ],
  description: [
    'empty',
    'not_empty',
    'equals',
    'not_equals',
    'contains',
    'not_contains',
    'in',
    'not_in',
  ],
};

/** Opções de valor para prioridade (valor real no backend) */
export const PRIORITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

/** Retorna o valueType recomendado para o campo */
export function getValueTypeForField(field: string): ConditionValueType {
  return FIELD_VALUE_TYPE[field] ?? 'string';
}

/** Retorna os operadores permitidos para o campo */
export function getAllowedOperatorsForField(
  field: string
): ConditionOperator[] {
  return (
    ALLOWED_OPERATORS_BY_FIELD[field] ?? [
      ...OPERATORS_WITHOUT_VALUE,
      ...TEXT_OPERATORS,
    ]
  );
}

/** Retorna opções de operador filtradas por campo (para Select) */
export function getOperatorOptionsForField(
  field: string
): { value: ConditionOperator; label: string }[] {
  const allowed = new Set(getAllowedOperatorsForField(field));
  return CONDITION_OPERATOR_OPTIONS.filter(opt => allowed.has(opt.value));
}

/** Indica se o campo tem opções pré-definidas (ex.: prioridade) */
export function getValueOptionsForField(
  field: string
): { value: string; label: string }[] | null {
  if (field === 'priority') return PRIORITY_OPTIONS;
  return null;
}

/** Indica se o campo é do tipo data (para usar date picker) */
export function isDateField(field: string): boolean {
  return getValueTypeForField(field) === 'date';
}

/** Indica se o campo é prioridade (para usar select de prioridades) */
export function isPriorityField(field: string): boolean {
  return field === 'priority';
}

/** Normaliza o valor antes de enviar ao backend conforme valueType e operator */
export function normalizeConditionValue(
  value: unknown,
  valueType: ConditionValueType,
  operator: ConditionOperator
): unknown {
  if (OPERATORS_WITHOUT_VALUE.includes(operator)) return null;

  if (OPERATORS_REQUIRING_ARRAY.includes(operator)) {
    if (Array.isArray(value))
      return value.map(v => normalizeSingleValue(v, valueType));
    if (typeof value === 'string') {
      const arr = value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      return arr.map(v => normalizeSingleValue(v, valueType));
    }
    return Array.isArray(value) ? value : [];
  }

  return normalizeSingleValue(value, valueType);
}

function normalizeSingleValue(
  value: unknown,
  valueType: ConditionValueType
): unknown {
  if (value === undefined || value === null || value === '') return value;

  switch (valueType) {
    case 'number': {
      const n =
        typeof value === 'number'
          ? value
          : Number(
              String(value)
                .replace(/\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
            );
      return Number.isNaN(n) ? value : n;
    }
    case 'date': {
      if (value instanceof Date) return value.toISOString().slice(0, 10);
      const s = String(value).trim();
      if (!s) return null;
      const date = new Date(s);
      return Number.isNaN(date.getTime())
        ? value
        : date.toISOString().slice(0, 10);
    }
    case 'boolean':
      if (typeof value === 'boolean') return value;
      const lower = String(value).toLowerCase();
      return (
        lower === 'true' || lower === 'sim' || lower === '1' || lower === 'yes'
      );
    case 'array':
      return Array.isArray(value) ? value : [value];
    default:
      return typeof value === 'string' ? value : String(value);
  }
}

/** Opções de valueType para select (quando o campo permite mais de um, ex. genérico) */
export const VALUE_TYPE_OPTIONS: {
  value: ConditionValueType;
  label: string;
}[] = [
  { value: 'string', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'boolean', label: 'Sim/Não' },
  { value: 'array', label: 'Lista' },
];
