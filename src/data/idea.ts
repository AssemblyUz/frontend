/**
 * The «Yangi Oʻzbekiston — Yangi Renessans» statement, shown from the hero.
 *
 * The Uzbek text is supplied by the Assembly and reproduced verbatim, including
 * its punctuation. It is the authoritative version.
 *
 * The Russian and English versions are machine translations of it, generated in
 * one pass so all three stay structurally identical — same blocks, same list
 * lengths. This is official wording about state policy, so it deserves a human
 * read: replace either version here when the Assembly supplies its own, and
 * nothing else needs to change. The two titles are the established renderings of
 * the slogan rather than machine output.
 *
 * Structured rather than one HTML blob so it renders through ordinary elements —
 * no `dangerouslySetInnerHTML`, and the lists stay real lists for a screen
 * reader.
 */

export type IdeaBlock =
  | {readonly kind: 'paragraph'; readonly text: string}
  /** A sentence introducing a list, kept with it so the two never separate. */
  | {readonly kind: 'list'; readonly lead: string; readonly items: readonly string[]};

export type IdeaLocale = 'uz' | 'ru' | 'en';

export const IDEA_TITLE: Record<IdeaLocale, string> = {
  uz: '«Yangi Oʻzbekiston — Yangi Renessans»',
  ru: '«Новый Узбекистан — новый Ренессанс»',
  en: '“New Uzbekistan — New Renaissance”',
};

export const IDEA_BLOCKS: Record<IdeaLocale, readonly IdeaBlock[]> = {
  uz: [
    {
      kind: 'paragraph',
      text:
        '«Yangi Oʻzbekiston — Yangi Renessans» gʻoyasining bosh maqsadi — Oʻzbekistonni dunyoning yetakchi iqtisodiy, investitsiyaviy, innovatsion va ilmiy markazlaridan biriga aylantirishdir.',
    },
    {
      kind: 'paragraph',
      text:
        'Mazkur gʻoya mamlakatimizning geografik joylashuvi, boy tabiiy resurslari, inson kapitali, tarixiy merosi, tadbirkorlik salohiyati va xalqaro hamkorlik imkoniyatlarini yagona strategik maqsad yoʻlida birlashtirishni nazarda tutadi.',
    },
    {
      kind: 'list',
      lead: 'Gʻoyani amalga oshirish orqali:',
      items: [
        'Oʻzbekiston Markaziy Osiyoning iqtisodiy markaziga aylantiriladi;',
        'yirik xalqaro investitsiyalar va ilgʻor texnologiyalar jalb qilinadi;',
        'milliy kompaniyalar global bozorlarga olib chiqiladi;',
        'sanoat, logistika, moliya, savdo, turizm va raqamli iqtisodiyot rivojlantiriladi;',
        'yangi ish oʻrinlari va yuqori daromadli kasblar yaratiladi;',
        'ilm-fan, taʼlim va innovatsiyalar iqtisodiy taraqqiyotning asosiy kuchiga aylantiriladi;',
        'Oʻzbekistonning xalqaro iqtisodiy nufuzi va raqobatbardoshligi oshiriladi.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        '«Yangi Oʻzbekiston — Yangi Renessans» — bu mamlakatimizni isteʼmolchi iqtisodiyotdan ishlab chiqaruvchi, eksport qiluvchi, innovatsiya yaratuvchi va mintaqaviy jarayonlarni boshqaruvchi qudratli iqtisodiy davlatga aylantirish gʻoyasidir.',
    },
    {
      kind: 'paragraph',
      text:
        '«Yangi Oʻzbekiston — Yangi Renessans» — mamlakatimizda amalga oshirilayotgan keng koʻlamli islohotlarni qoʻllab-quvvatlash, jamiyatning intellektual, iqtisodiy va maʼnaviy salohiyatini safarbar etishga qaratilgan strategik gʻoyadir.',
    },
    {
      kind: 'paragraph',
      text:
        'Mazkur gʻoyaning asosiy maqsadi — davlat, jamoatchilik, xususiy sektor, ilm-fan, taʼlim, ommaviy axborot vositalari va xalqaro hamkorlarning imkoniyatlarini yagona taraqqiyot maqsadi atrofida birlashtirishdir.',
    },
    {
      kind: 'list',
      lead: 'Gʻoya quyidagi ustuvor yoʻnalishlarni qamrab oladi:',
      items: [
        'inson kapitalini rivojlantirish, ilm-fan va taʼlimni yuksaltirish;',
        'tadbirkorlik, investitsiya va innovatsiyalarni qoʻllab-quvvatlash;',
        'yoshlar va xotin-qizlarning iqtisodiy faolligini oshirish;',
        'zamonaviy texnologiyalar va raqamli boshqaruv tizimlarini joriy etish;',
        'milliy qadriyatlar, bunyodkorlik va vatanparvarlik ruhini mustahkamlash;',
        'Oʻzbekistonning xalqaro iqtisodiy va siyosiy nufuzini oshirish.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        'Oʻzbekiston Iqtisodiyoti Assambleyasi ushbu gʻoyani amalga oshirishda davlat–jamoatchilik–xususiy sektor hamkorligi asosida 4 ta strategik yoʻnalish, 20 ta loyiha va 50 ta tarmoq uyushmasini yagona tizimga birlashtirishni nazarda tutadi.',
    },
    {
      kind: 'paragraph',
      text:
        'Mazkur tizim orqali tadbirkorlar, olimlar, yoshlar, investorlar, xalqaro tashkilotlar va davlat idoralari oʻrtasida amaliy hamkorlik mexanizmlari shakllantirilib, yangi ish oʻrinlari, investitsiyalar, eksport, innovatsion loyihalar va ijtimoiy tashabbuslarni rivojlantirish koʻzda tutiladi.',
    },
    {
      kind: 'paragraph',
      text:
        '«Yangi Oʻzbekiston — Yangi Renessans» — bu faqat gʻoya emas, balki xalqimizning bilim, mehnat, birlik va bunyodkorlik salohiyatiga tayangan holda yangi taraqqiyot bosqichini barpo etishga qaratilgan umumxalq harakatidir.',
    },
  ],
  ru: [
    {
      kind: 'paragraph',
      text:
        'Основная цель идеи «Новый Узбекистан — новый Ренессанс» — превратить Узбекистан в один из ведущих экономических, инвестиционных, инновационных и научных центров мира.',
    },
    {
      kind: 'paragraph',
      text:
        'Эта идея предусматривает интеграцию географического положения нашей страны, богатых природных ресурсов, человеческого капитала, исторического наследия, предпринимательского потенциала и возможностей международного сотрудничества для достижения единой стратегической цели.',
    },
    {
      kind: 'list',
      lead: 'Реализуя идею:',
      items: [
        'Узбекистан превратится в экономический центр Центральной Азии;',
        'привлекаются крупные международные инвестиции и передовые технологии;',
        'национальные компании выводятся на глобальные рынки;',
        'будут развиваться промышленность, логистика, финансы, торговля, туризм и цифровая экономика;',
        'будут созданы новые рабочие места и высокооплачиваемые профессии;',
        'наука, образование и инновации станут главной силой экономического развития;',
        'международное экономическое влияние и конкурентоспособность Узбекистана будут увеличены.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        '«Новый Узбекистан — новый Ренессанс» — это идея превращения нашей страны из потребительской экономики в мощное экономическое государство, производящее, экспортирующее, создающее инновации и управляющее региональными процессами.',
    },
    {
      kind: 'paragraph',
      text:
        '«Новый Узбекистан — новый Ренессанс» — это стратегическая идея, направленная на поддержку масштабных реформ, реализуемых в нашей стране, мобилизацию интеллектуального, экономического и духовного потенциала общества.',
    },
    {
      kind: 'paragraph',
      text:
        'Основная цель этой идеи — объединить возможности государства, общественности, частного сектора, науки, образования, средств массовой информации и международных партнеров вокруг единой цели развития.',
    },
    {
      kind: 'list',
      lead: 'Идея охватывает следующие приоритетные направления:',
      items: [
        'развитие человеческого капитала, содействие науке и образованию;',
        'поддержка предпринимательства, инвестиций и инноваций;',
        'повышение экономической активности молодежи и женщин;',
        'внедрение современных технологий и цифровых систем управления;',
        'укрепление национальных ценностей, творчества и патриотизма;',
        'увеличение международного экономического и политического влияния Узбекистана.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        'Экономическая ассамблея Узбекистана предусматривает интеграцию 4 стратегических направлений, 20 проектов и 50 отраслевых объединений в единую систему на основе государственно-частно-государственного сотрудничества в реализации этой идеи.',
    },
    {
      kind: 'paragraph',
      text:
        'Благодаря этой системе будут сформированы механизмы практического сотрудничества между предпринимателями, учеными, молодежью, инвесторами, международными организациями и государственными органами, а также будут развиваться новые рабочие места, инвестиции, экспорт, инновационные проекты и социальные инициативы.',
    },
    {
      kind: 'paragraph',
      text:
        '«Новый Узбекистан — новый Ренессанс» — это не просто идея, а национальное движение, направленное на построение нового этапа развития, основанного на знаниях, труде, единстве и творческом потенциале нашего народа.',
    },
  ],
  en: [
    {
      kind: 'paragraph',
      text:
        'The main goal of the idea “New Uzbekistan — New Renaissance” is to turn Uzbekistan into one of the leading economic, investment, innovative and scientific centers of the world.',
    },
    {
      kind: 'paragraph',
      text:
        'This idea envisages the integration of our country\'s geographical location, rich natural resources, human capital, historical heritage, entrepreneurial potential and opportunities for international cooperation towards a single strategic goal.',
    },
    {
      kind: 'list',
      lead: 'By implementing the idea:',
      items: [
        'Uzbekistan will be transformed into the economic center of Central Asia;',
        'large international investments and advanced technologies are attracted;',
        'national companies are brought to global markets;',
        'industry, logistics, finance, trade, tourism and digital economy will be developed;',
        'new jobs and high-paying professions will be created;',
        'science, education and innovation will become the main force of economic development;',
        'the international economic influence and competitiveness of Uzbekistan will be increased.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        '“New Uzbekistan — New Renaissance” is the idea of turning our country from a consumer economy into a powerful economic state that produces, exports, creates innovation and manages regional processes.',
    },
    {
      kind: 'paragraph',
      text:
        '“New Uzbekistan — New Renaissance” is a strategic idea aimed at supporting large-scale reforms implemented in our country, mobilizing the intellectual, economic and spiritual potential of society.',
    },
    {
      kind: 'paragraph',
      text:
        'The main goal of this idea is to unite the capabilities of the state, public, private sector, science, education, mass media and international partners around the single goal of development.',
    },
    {
      kind: 'list',
      lead: 'The idea covers the following priority areas:',
      items: [
        'development of human capital, promotion of science and education;',
        'support of entrepreneurship, investment and innovation;',
        'increasing the economic activity of young people and women;',
        'introduction of modern technologies and digital management systems;',
        'strengthening of national values, creativity and patriotism;',
        'increasing the international economic and political influence of Uzbekistan.',
      ],
    },
    {
      kind: 'paragraph',
      text:
        'The Economic Assembly of Uzbekistan envisages the integration of 4 strategic directions, 20 projects and 50 industry associations into a single system on the basis of state-public-private sector cooperation in the implementation of this idea.',
    },
    {
      kind: 'paragraph',
      text:
        'Through this system, practical cooperation mechanisms will be formed between entrepreneurs, scientists, young people, investors, international organizations and state agencies, and new jobs, investments, exports, innovative projects and social initiatives will be developed.',
    },
    {
      kind: 'paragraph',
      text:
        '“New Uzbekistan — New Renaissance” is not just an idea, but a national movement aimed at building a new stage of development based on the knowledge, work, unity and creativity potential of our people.',
    },
  ],
};

/**
 * The statement in one language, falling back to Uzbek for anything unexpected.
 *
 * Keeps the locale lookup out of the component and gives the hero button its
 * label from the same place as the dialog's heading, so the idea cannot end up
 * named one thing on the button and another inside.
 */
export function ideaFor(locale: string): {title: string; blocks: readonly IdeaBlock[]} {
  const key = (locale in IDEA_TITLE ? locale : 'uz') as IdeaLocale;
  return {title: IDEA_TITLE[key], blocks: IDEA_BLOCKS[key]};
}
