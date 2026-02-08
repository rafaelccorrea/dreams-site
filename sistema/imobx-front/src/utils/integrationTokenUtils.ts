/**
 * Padronização de campos tipo token nas telas de integração.
 * Evita criar tokens com espaço: cada espaço é substituído por hífen (-).
 * Use em: Token de verificação (webhook), Verify token, e qualquer campo
 * que o usuário define como "senha" ou token para integração externa.
 */
export function normalizeTokenForIntegration(value: string): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, '-');
}

/** Normaliza para exibição/salvamento: espaços → hífen e trim */
export function normalizeTokenForSave(
  value: string | undefined | null
): string {
  if (value == null || typeof value !== 'string') return '';
  return value.replace(/\s+/g, '-').trim();
}
