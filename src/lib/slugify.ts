/**
 * URL slug from an article title.
 *
 * Uzbek Latin uses the apostrophe-like modifiers in oʻ / gʻ. Stripping them
 * rather than mapping them to "-" keeps "Yangi oʻzgarishlar" as
 * "yangi-ozgarishlar" instead of "yangi-o-zgarishlar".
 *
 * Cyrillic is transliterated. It used to be dropped, on the reasoning that
 * inventing a scheme was worse than asking the editor — but the slug is
 * required, so a Russian-only title produced an empty slug and a form that
 * refused to submit with nothing but the browser's own tooltip to explain why.
 * A predictable romanisation is the lesser evil, and the editor can still
 * overwrite whatever it produces.
 */
const MODIFIERS = /[ʻʼ‘’'`´]/g;

/** Russian and Uzbek Cyrillic, romanised the way Uzbek Latin spells it. */
const CYRILLIC: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  // Uzbek Cyrillic additions.
  ў: 'o', ғ: 'g', қ: 'q', ҳ: 'h', ҷ: 'j', ә: 'a', і: 'i',
};

function romanise(value: string): string {
  let out = '';
  for (const char of value) {
    out += CYRILLIC[char] ?? char;
  }
  return out;
}

export function slugify(title: string): string {
  return romanise(
    title
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '') // strip combining accents
      .replace(MODIFIERS, '')
      .toLowerCase(),
  )
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200); // matches SlugField(max_length=200)
}
