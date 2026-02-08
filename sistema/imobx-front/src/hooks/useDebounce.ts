import { useState, useEffect } from 'react';

/**
 * Hook personalizado para aplicar debounce em valores
 *
 * @param value - O valor que será debounced
 * @param delay - O tempo de atraso em milissegundos (padrão: 500ms)
 * @param minLength - Comprimento mínimo para aplicar o debounce (padrão: 3)
 * @returns O valor debounced
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500, 3);
 *
 * useEffect(() => {
 *   // Só executa quando o termo tem 3+ caracteres ou está vazio
 *   if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm.length === 0) {
 *     fetchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(
  value: T,
  delay: number = 500,
  minLength: number = 3
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Se for string, verifica o comprimento mínimo
    if (typeof value === 'string') {
      // Se estiver vazio, atualiza imediatamente
      if (value.length === 0) {
        setDebouncedValue(value);
        return;
      }

      // Se for menor que o mínimo, não atualiza
      if (value.length < minLength) {
        return;
      }
    }

    // Cria timer para debounce
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela o timer se o valor mudar antes do delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, minLength]);

  return debouncedValue;
}

/**
 * Hook personalizado para criar um handler de mudança de input com debounce
 *
 * @param callback - Função que será chamada com o valor debounced
 * @param delay - O tempo de atraso em milissegundos (padrão: 500ms)
 * @param minLength - Comprimento mínimo para aplicar o debounce (padrão: 3)
 * @returns Um objeto com o valor local e o handler de mudança
 *
 * @example
 * const { value, onChange } = useDebouncedInput((debouncedValue) => {
 *   onFiltersChange({ ...filters, search: debouncedValue });
 * });
 *
 * <input value={value} onChange={onChange} />
 */
export function useDebouncedInput(
  callback: (value: string) => void,
  initialValue: string = '',
  delay: number = 500,
  minLength: number = 3
) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay, minLength);

  useEffect(() => {
    // Só chama o callback se o valor atender aos critérios
    if (value.length >= minLength || value.length === 0) {
      callback(debouncedValue);
    }
  }, [debouncedValue, minLength, value.length]); // Removido callback das dependências

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return { value, onChange, setValue };
}

export default useDebounce;
