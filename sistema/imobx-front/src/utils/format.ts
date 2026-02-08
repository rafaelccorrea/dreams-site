/**
 * Formatar tamanho de arquivo em bytes para formato legível
 */
export const formatarTamanhoArquivo = (bytes: number | string): string => {
  // Converter para número se for string
  const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;

  // Verificar se é um número válido
  if (isNaN(numBytes) || numBytes === 0) return '0 Bytes';

  const k = 1024;
  const tamanhos = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));

  return (
    Math.round((numBytes / Math.pow(k, i)) * 100) / 100 + ' ' + tamanhos[i]
  );
};

/**
 * Formatar data para exibição
 */
export const formatarData = (date: Date | string): string => {
  if (!date) return '-';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Verificar se a data é válida
  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  return dateObj.toLocaleDateString('pt-BR');
};

/** Fuso horário de Brasília para exibição consistente (evita diferença de 3h com UTC) */
const TIMEZONE_BRASILIA = 'America/Sao_Paulo';

/**
 * Formatar data e hora para exibição (horário de Brasília)
 */
export const formatarDataHora = (date: Date | string): string => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '-';
  return dateObj.toLocaleString('pt-BR', {
    timeZone: TIMEZONE_BRASILIA,
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

// Mantém os nomes antigos para compatibilidade com código existente
export const formatFileSize = formatarTamanhoArquivo;
export const formatDate = formatarData;
export const formatDateTime = formatarDataHora;
