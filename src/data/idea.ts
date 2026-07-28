/**
 * The «Yangi Oʻzbekiston — Yangi Renessans» statement, shown from the hero.
 *
 * Supplied by the Assembly and reproduced verbatim, including its punctuation.
 * It is deliberately NOT translated: this is official wording about state
 * policy, and a paraphrase in Russian or English would misstate it. Russian and
 * English visitors therefore read the Uzbek text, the same way the association
 * names in `associations.ts` stay in Uzbek. Add translations here when the
 * Assembly provides its own.
 *
 * Structured rather than one HTML blob so it renders through ordinary elements —
 * no `dangerouslySetInnerHTML`, and the lists stay real lists for a screen
 * reader.
 */

export type IdeaBlock =
  | {readonly kind: 'paragraph'; readonly text: string}
  /** A sentence introducing a list, kept with it so the two never separate. */
  | {readonly kind: 'list'; readonly lead: string; readonly items: readonly string[]};

export const IDEA_TITLE = '«Yangi Oʻzbekiston — Yangi Renessans»';

export const IDEA_BLOCKS: readonly IdeaBlock[] = [
  {
    kind: 'paragraph',
    text:
      '«Yangi Oʻzbekiston — Yangi Renessans» gʻoyasining bosh maqsadi — Oʻzbekistonni ' +
      'dunyoning yetakchi iqtisodiy, investitsiyaviy, innovatsion va ilmiy markazlaridan ' +
      'biriga aylantirishdir.',
  },
  {
    kind: 'paragraph',
    text:
      'Mazkur gʻoya mamlakatimizning geografik joylashuvi, boy tabiiy resurslari, inson ' +
      'kapitali, tarixiy merosi, tadbirkorlik salohiyati va xalqaro hamkorlik ' +
      'imkoniyatlarini yagona strategik maqsad yoʻlida birlashtirishni nazarda tutadi.',
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
      '«Yangi Oʻzbekiston — Yangi Renessans» — bu mamlakatimizni isteʼmolchi iqtisodiyotdan ' +
      'ishlab chiqaruvchi, eksport qiluvchi, innovatsiya yaratuvchi va mintaqaviy ' +
      'jarayonlarni boshqaruvchi qudratli iqtisodiy davlatga aylantirish gʻoyasidir.',
  },
  {
    kind: 'paragraph',
    text:
      '«Yangi Oʻzbekiston — Yangi Renessans» — mamlakatimizda amalga oshirilayotgan keng ' +
      'koʻlamli islohotlarni qoʻllab-quvvatlash, jamiyatning intellektual, iqtisodiy va ' +
      'maʼnaviy salohiyatini safarbar etishga qaratilgan strategik gʻoyadir.',
  },
  {
    kind: 'paragraph',
    text:
      'Mazkur gʻoyaning asosiy maqsadi — davlat, jamoatchilik, xususiy sektor, ilm-fan, ' +
      'taʼlim, ommaviy axborot vositalari va xalqaro hamkorlarning imkoniyatlarini yagona ' +
      'taraqqiyot maqsadi atrofida birlashtirishdir.',
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
      'Oʻzbekiston Iqtisodiyoti Assambleyasi ushbu gʻoyani amalga oshirishda ' +
      'davlat–jamoatchilik–xususiy sektor hamkorligi asosida 4 ta strategik yoʻnalish, ' +
      '20 ta loyiha va 50 ta tarmoq uyushmasini yagona tizimga birlashtirishni nazarda tutadi.',
  },
  {
    kind: 'paragraph',
    text:
      'Mazkur tizim orqali tadbirkorlar, olimlar, yoshlar, investorlar, xalqaro tashkilotlar ' +
      'va davlat idoralari oʻrtasida amaliy hamkorlik mexanizmlari shakllantirilib, yangi ish ' +
      'oʻrinlari, investitsiyalar, eksport, innovatsion loyihalar va ijtimoiy tashabbuslarni ' +
      'rivojlantirish koʻzda tutiladi.',
  },
  {
    kind: 'paragraph',
    text:
      '«Yangi Oʻzbekiston — Yangi Renessans» — bu faqat gʻoya emas, balki xalqimizning bilim, ' +
      'mehnat, birlik va bunyodkorlik salohiyatiga tayangan holda yangi taraqqiyot bosqichini ' +
      'barpo etishga qaratilgan umumxalq harakatidir.',
  },
];
