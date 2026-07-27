/**
 * The Assembly's four functional blocks — FR, BR, PR, GR.
 *
 * Identity lives here rather than in the message catalogues so that the URL
 * slug and the accent colour stay identical in every language, and so
 * `projectIndexes` can point into the `projects.items` message array instead of
 * repeating twenty project names in three catalogues.
 *
 * The prose for each block lives under the `blocks` namespace in
 * `messages/*.json`, matched to this list by `code`.
 */

export type FunctionalBlockSlug = 'fr' | 'br' | 'pr' | 'gr';

export type FunctionalBlock = {
  slug: FunctionalBlockSlug;
  code: string;
  /**
   * Indexes into `projects.items`. The Assembly's own overview says every
   * project connects through all four blocks; these are the ones each block
   * serves most directly, which is what the page says on the tin.
   */
  projectIndexes: readonly number[];
  /** Full class strings so Tailwind keeps them. Same hue per block site-wide. */
  tone: {
    text: string;
    badge: string;
    border: string;
    hoverBorder: string;
    rule: string;
  };
};

export const functionalBlocks: readonly FunctionalBlock[] = [
  {
    slug: 'fr',
    code: 'FR',
    projectIndexes: [13, 9, 17, 2, 3],
    tone: {
      text: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
      border: 'border-sky-500/40',
      hoverBorder: 'hover:border-sky-500',
      rule: 'bg-sky-500',
    },
  },
  {
    slug: 'br',
    code: 'BR',
    projectIndexes: [1, 4, 5, 11, 0],
    tone: {
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      border: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-500',
      rule: 'bg-emerald-500',
    },
  },
  {
    slug: 'pr',
    code: 'PR',
    projectIndexes: [8, 14, 19, 7, 18],
    tone: {
      text: 'text-violet-600 dark:text-violet-400',
      badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
      border: 'border-violet-500/40',
      hoverBorder: 'hover:border-violet-500',
      rule: 'bg-violet-500',
    },
  },
  {
    slug: 'gr',
    code: 'GR',
    projectIndexes: [6, 10, 15, 12, 16],
    tone: {
      text: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
      border: 'border-amber-500/40',
      hoverBorder: 'hover:border-amber-500',
      rule: 'bg-amber-500',
    },
  },
] as const;

/** Shape of one entry in the `blocks.items` message array. */
export type FunctionalBlockContent = {
  code: string;
  /** The block's proper name, in English site-wide: "Foreign Relations". */
  name: string;
  /** The same idea in the reader's language: "Xalqaro aloqalar". */
  short: string;
  tagline: string;
  lead: string;
  role: string[];
  partners: string[];
  outcomes: string[];
};

export function getFunctionalBlock(slug: string): FunctionalBlock | undefined {
  return functionalBlocks.find((block) => block.slug === slug);
}

export function findBlockContent(
  items: readonly FunctionalBlockContent[],
  code: string,
): FunctionalBlockContent | undefined {
  return items.find((item) => item.code === code);
}
