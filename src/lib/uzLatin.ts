/**
 * Uzbek is published in the reformed Latin alphabet: õ ğ ş ç where the 1995
 * alphabet wrote oʻ gʻ sh ch. The conversion itself happens on the server, as
 * text is saved (backend core/uzlatin.py) — nothing here rewrites content.
 *
 * What the browser needs is the opposite: a way to compare text regardless of
 * which spelling it is in. Nobody's keyboard has "ş" on it yet, so a visitor
 * searching for "o'zbekiston" or "shahar" has to find "Õzbekiston" and "şahar".
 */

/** Every character people type for the oʻ/gʻ modifier or the tutuq belgisi. */
const APOSTROPHES = /[ʻʼ‘’'`´]/g;

const FOLDED: Record<string, string> = {õ: 'o', ğ: 'g', ş: 'sh', ç: 'ch'};
const REFORMED_LETTERS = /[õğşç]/g;

/**
 * A spelling-independent form for matching, never for display.
 *
 * "Oʻzbekiston", "O'zbekiston", "Ozbekiston" and "Õzbekiston" all fold to
 * "ozbekiston"; "shahar" and "şahar" both fold to "shahar".
 */
export function foldUzbek(text: string): string {
  return text
    .toLowerCase()
    .replace(REFORMED_LETTERS, (letter) => FOLDED[letter])
    .replace(APOSTROPHES, '');
}

/** Whether `haystack` contains `needle`, whichever Uzbek spelling each uses. */
export function matchesUzbek(haystack: string, needle: string): boolean {
  return foldUzbek(haystack).includes(foldUzbek(needle));
}

/** First letter or digit of a name, for an avatar-style monogram. */
export function monogram(name: string): string {
  const match = name.match(/[\p{L}\p{N}]/u);
  return (match ? match[0] : name.charAt(0)).toUpperCase();
}
