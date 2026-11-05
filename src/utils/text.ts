/**
 * Normalizes text by converting to lowercase, stripping diacritics / accents, and trimming.
 * e.g., "Čiližská Radvaň" -> "cilizska radvan"
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
