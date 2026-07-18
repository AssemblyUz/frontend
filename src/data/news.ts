type L = {uz: string; ru: string; en: string};

export type NewsItem = {
  /** URL slug. Must stay stable once a post is public — changing it breaks existing links. */
  slug: string;
  /** ISO date, YYYY-MM-DD. Drives ordering and the <time> element. */
  date: string;
  icon: string;
  tag: L;
  title: L;
  excerpt: L;
  /** One entry per paragraph of the article body. */
  body: L[];
};

export type LocalizedNewsItem = {
  slug: string;
  date: string;
  dateLabel: string;
  icon: string;
  tag: string;
  title: string;
  excerpt: string;
  body: string[];
};

/**
 * News and announcements shown on the home page and under /yangiliklar.
 *
 * There is no CMS behind this site — publishing a post means adding an entry to
 * this array. Order here does not matter; `getNews()` sorts newest first.
 *
 * The seed posts below are written from the Assembly's own presentation deck so
 * the section renders with real copy. Their `date` values are placeholders —
 * replace them, and the posts themselves, with actual announcements.
 */
export const news: NewsItem[] = [
  {
    slug: 'strategik-loyihalar-portfeli',
    date: '2026-06-24',
    icon: '🚀',
    tag: {uz: 'Loyihalar', ru: 'Проекты', en: 'Projects'},
    title: {
      uz: "Assambleyaning 20 ta strategik loyihasi e'lon qilindi",
      ru: 'Объявлены 20 стратегических проектов Ассамблеи',
      en: "The Assembly's 20 strategic projects announced",
    },
    excerpt: {
      uz: "Investitsiya, sanoat, eksport, innovatsiya, media, yoshlar va ayollar yo'nalishlarini qamrab olgan yagona loyihalar portfeli tadbirkor ehtiyojini kapital va natija bilan bog'laydi.",
      ru: 'Единый портфель проектов, охватывающий инвестиции, промышленность, экспорт, инновации, медиа, молодёжь и женское предпринимательство, связывает потребности предпринимателя с капиталом и результатом.',
      en: 'A single portfolio spanning investment, industry, export, innovation, media, youth and women’s entrepreneurship connects an entrepreneur’s needs to capital and measurable results.',
    },
    body: [
      {
        uz: "Assambleya o'z faoliyatini 20 ta strategik loyiha atrofida tizimlashtirdi. Portfel EDU-JOB va INVEST HUB kabi platformalardan tortib CENTRAL ASIAN SMART CITY va TERMIZ INDUSTRIAL HUB kabi yirik infratuzilma tashabbuslarigacha bo'lgan yo'nalishlarni qamrab oladi.",
        ru: 'Ассамблея систематизировала свою деятельность вокруг 20 стратегических проектов. Портфель охватывает направления от платформ EDU-JOB и INVEST HUB до крупных инфраструктурных инициатив, таких как CENTRAL ASIAN SMART CITY и TERMIZ INDUSTRIAL HUB.',
        en: 'The Assembly has organised its work around 20 strategic projects. The portfolio spans everything from platforms such as EDU-JOB and INVEST HUB to major infrastructure initiatives like CENTRAL ASIAN SMART CITY and TERMIZ INDUSTRIAL HUB.',
      },
      {
        uz: "Portfelning vazifasi oddiy: tadbirkor ehtiyojini aniq loyiha, hamkor, kapital va media natijasi bilan bog'lash. Har bir loyiha FR/BR/PR/GR bloklari orqali xalqaro, biznes, jamoatchilik va davlat imkoniyatlariga ulanadi.",
        ru: 'Задача портфеля проста: связать потребность предпринимателя с конкретным проектом, партнёром, капиталом и медийным результатом. Каждый проект подключается к международным, деловым, общественным и государственным возможностям через блоки FR/BR/PR/GR.',
        en: 'The portfolio has a simple job: connect an entrepreneur’s need to a specific project, partner, source of capital and media outcome. Each project plugs into international, business, public and government opportunities through the FR/BR/PR/GR blocks.',
      },
      {
        uz: "Loyihalar bosqichma-bosqich ishga tushiriladi. Har bir loyiha sayti tayyor bo'lgan sari Assambleya platformasida havolasi paydo bo'ladi.",
        ru: 'Проекты запускаются поэтапно. По мере готовности сайта каждого проекта на платформе Ассамблеи появляется ссылка на него.',
        en: 'The projects launch in stages. As each project’s own site goes live, a link to it appears on the Assembly platform.',
      },
    ],
  },
  {
    slug: 'ai-medianet',
    date: '2026-05-15',
    icon: '🛰️',
    tag: {uz: 'Media', ru: 'Медиа', en: 'Media'},
    title: {
      uz: "AI MediaNet — yangi avlod kommunikatsiya ekotizimi",
      ru: 'AI MediaNet — коммуникационная экосистема нового поколения',
      en: 'AI MediaNet — a next-generation communication ecosystem',
    },
    excerpt: {
      uz: "Assambleya natijalari ijtimoiy tarmoqlar, media va sun'iy intellekt yordamida ko'rinadigan ishonch kapitaliga aylanadi.",
      ru: 'Результаты Ассамблеи превращаются в видимый капитал доверия с помощью социальных сетей, медиа и искусственного интеллекта.',
      en: 'The Assembly’s results are turned into visible capital of trust through social networks, media and artificial intelligence.',
    },
    body: [
      {
        uz: "AI MediaNet — Assambleya va uning uyushmalari sahifalarini sun'iy intellekt bilan sinxron boshqaradigan kommunikatsiya qatlami. U kontent rejasi, monitoring, ijtimoiy ishonch va media ta'sirini bitta tizimga jamlaydi.",
        ru: 'AI MediaNet — коммуникационный слой, который синхронно управляет страницами Ассамблеи и её ассоциаций с помощью искусственного интеллекта. Он объединяет контент-план, мониторинг, общественное доверие и медийное влияние в одну систему.',
        en: 'AI MediaNet is the communication layer that runs the pages of the Assembly and its associations in sync, with the help of artificial intelligence. It brings the content plan, monitoring, public trust and media impact together in one system.',
      },
      {
        uz: "Tizim faoliyatni faqat yoritmaydi — auditoriya kayfiyatini, kontent samaradorligini va iqtisodiy ishonch darajasini ham kuzatadi. Bu qaysi mavzu real ta'sirga ega ekanini aniqlashga imkon beradi.",
        ru: 'Система не просто освещает деятельность — она отслеживает настроение аудитории, эффективность контента и уровень экономического доверия. Это позволяет определить, какая тема действительно оказывает влияние.',
        en: 'The system does more than cover the Assembly’s work: it tracks audience sentiment, content performance and the level of economic confidence. That makes it possible to tell which topics genuinely have impact.',
      },
      {
        uz: "Loyihalar yoritilishi, tadbirkor hikoyalari, FR/BR/PR/GR natijalari va brend kapitali — AI MediaNet ishlaydigan asosiy yo'nalishlar.",
        ru: 'Освещение проектов, истории предпринимателей, результаты FR/BR/PR/GR и капитал бренда — основные направления работы AI MediaNet.',
        en: 'Project coverage, entrepreneur stories, FR/BR/PR/GR outcomes and brand capital are the main areas AI MediaNet works across.',
      },
    ],
  },
  {
    slug: 'yol-xaritasi-va-kpi',
    date: '2026-03-03',
    icon: '📊',
    tag: {uz: 'Strategiya', ru: 'Стратегия', en: 'Strategy'},
    title: {
      uz: "Yo'l xaritasi: 90 kun, 6 oy va 12 oylik natijalar",
      ru: 'Дорожная карта: результаты на 90 дней, 6 и 12 месяцев',
      en: 'Roadmap: results at 90 days, 6 months and 12 months',
    },
    excerpt: {
      uz: "Assambleya mexanizmini amaliy boshqaruv tizimiga aylantirish uchun o'lchanadigan bosqichlar va KPI tizimi belgilandi.",
      ru: 'Определены измеримые этапы и система KPI, превращающие механизм Ассамблеи в практическую систему управления.',
      en: 'Measurable stages and a KPI system have been set to turn the Assembly’s mechanism into a working management system.',
    },
    body: [
      {
        uz: "Birinchi 90 kun ichida uyushmalar bazasi, tadbirkor ehtiyojlari va loyihalar kesimidagi xizmatlar paketini birlashtirgan CRM va xizmatlar katalogi ishga tushiriladi.",
        ru: 'В первые 90 дней запускается CRM и каталог услуг, объединяющие базу ассоциаций, потребности предпринимателей и пакет услуг в разрезе проектов.',
        en: 'In the first 90 days, a CRM and service catalogue go live, bringing together the register of associations, entrepreneurs’ needs and the service package for each project.',
      },
      {
        uz: "Olti oy ichida investorlar, banklar, konsalting va texnologik hamkorlar bilan amaliy loyihalar portfeli shakllantiriladi. O'n ikki oyda esa e'tibor natijaga va ta'sirga qaratiladi: tadbirkorlar uchun real yechimlar, media yoritish, davlat va xalqaro ishonch.",
        ru: 'В течение шести месяцев формируется портфель практических проектов с инвесторами, банками, консалтинговыми и технологическими партнёрами. Через двенадцать месяцев акцент смещается на результат и влияние: реальные решения для предпринимателей, медийное освещение, доверие государства и международных партнёров.',
        en: 'Within six months, a portfolio of practical projects takes shape with investors, banks, consulting firms and technology partners. At twelve months the focus shifts to results and impact: real solutions for entrepreneurs, media coverage, and the trust of government and international partners.',
      },
      {
        uz: "KPI tizimi Assambleyani g'oya darajasidan ijro intizomi va natija boshqaruviga olib chiqadi: 50+ uyushma, 10 000+ tadbirkor bazasi, 20 ta loyiha, 100+ hamkor va doimiy media qamrov.",
        ru: 'Система KPI выводит Ассамблею с уровня идеи на уровень исполнительской дисциплины и управления результатом: 50+ ассоциаций, база 10 000+ предпринимателей, 20 проектов, 100+ партнёров и постоянное медийное покрытие.',
        en: 'The KPI system moves the Assembly from the level of an idea to execution discipline and results management: 50+ associations, a base of 10,000+ entrepreneurs, 20 projects, 100+ partners and continuous media coverage.',
      },
    ],
  },
];

const MONTHS: Record<keyof L, readonly string[]> = {
  uz: [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
  ],
  ru: [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

function localeKey(locale: string): keyof L {
  return locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
}

/**
 * Human-readable date. Formatted from the ISO parts rather than Intl so the
 * output does not depend on which ICU data the build environment ships.
 */
export function formatNewsDate(iso: string, locale: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const l = localeKey(locale);
  const name = MONTHS[l][month - 1];
  if (l === 'uz') return `${day}-${name}, ${year}`;
  if (l === 'ru') return `${day} ${name} ${year} г.`;
  return `${day} ${name} ${year}`;
}

function localize(item: NewsItem, locale: string): LocalizedNewsItem {
  const l = localeKey(locale);
  return {
    slug: item.slug,
    date: item.date,
    dateLabel: formatNewsDate(item.date, locale),
    icon: item.icon,
    tag: item.tag[l],
    title: item.title[l],
    excerpt: item.excerpt[l],
    body: item.body.map((p) => p[l]),
  };
}

/** All posts for a locale, newest first. */
export function getNews(locale: string): LocalizedNewsItem[] {
  return [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((item) => localize(item, locale));
}

/** A single post resolved for a locale, or undefined if the slug is unknown. */
export function getNewsItem(slug: string, locale: string): LocalizedNewsItem | undefined {
  const item = news.find((n) => n.slug === slug);
  return item ? localize(item, locale) : undefined;
}

/** All post slugs — for generateStaticParams. */
export function allNewsSlugs(): string[] {
  return news.map((n) => n.slug);
}
