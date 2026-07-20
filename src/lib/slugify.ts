/**
 * URL slug from an article title.
 *
 * Uzbek Latin uses the apostrophe-like modifiers in oʻ / gʻ. Stripping them
 * rather than mapping them to "-" keeps "Yangi oʻzgarishlar" as
 * "yangi-ozgarishlar" instead of "yangi-o-zgarishlar". Cyrillic input produces
 * an empty result, which the form leaves for the editor to fill in — inventing
 * a transliteration scheme would be worse than asking.
 */
const MODIFIERS = /[ʻʼ‘’'`´]/g;

export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining accents
    .replace(MODIFIERS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200); // matches SlugField(max_length=200)
}
