/**
 * Utility function para combinar classNames condicionalmente
 * Versão simplificada do clsx/classnames
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
