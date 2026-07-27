type L = {uz: string; ru: string; en: string};

export type Association = {
  name: L;
  chairman?: string;
  phone?: string;
  activity?: L;
};

export type LocalizedAssociation = {
  id: string;
  name: string;
  chairman?: string;
  phone?: string;
  activity?: string;
};

/** Stable URL slug derived from the (unique) English name. */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['"\u00ab\u00bb()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Member associations of the Assembly platform, in registry order.
 *
 * Source: uyushmalar_tartib_raqam_bilan.docx — 50 associations, numbered. The
 * Uzbek names are taken verbatim from that document (okina normalised to a
 * straight quote and brand names to guillemets, matching the rest of the site);
 * the Russian and English names are translations of them.
 *
 * The registry carries names only. Chairmen and phone numbers are held here from
 * the earlier list, so an association that has since been renamed keeps its
 * contact. Entries without them simply have none on record.
 */
export const associations: Association[] = [
  {name: {uz: `Agrobiznes uyushmasi`, ru: `Ассоциация агробизнеса`, en: `Agribusiness Association`}, chairman: `Komoliddin Ikromov`, phone: `+998 90 349 08 8`, activity: {uz: `O'zbekiston fermerlarini birlashtiradi`, ru: `Объединяет фермеров Узбекистана`, en: `Unites farmers of Uzbekistan`}},
  {name: {uz: `O'zbekiston zargarlari uyushmasi «O'zbekzargarsanoati»`, ru: `Ассоциация ювелиров Узбекистана «O'zbekzargarsanoati»`, en: `Association of Jewellers of Uzbekistan "O'zbekzargarsanoati"`}, chairman: `Davron Samarov`, phone: `+998 99 888 07 07`},
  {name: {uz: `Auditorlar palatasi`, ru: `Палата аудиторов`, en: `Chamber of Auditors`}, chairman: `Nematulla Karimov`, phone: `+998 90 167 94 49`},
  {name: {uz: `O'zbekiston banklari assotsiatsiyasi`, ru: `Ассоциация банков Узбекистана`, en: `Association of Banks of Uzbekistan`}, chairman: `Doniyor`, phone: `+998 90 919 41 46`},
  {name: {uz: `«Tadbirkor ayol» O'zbekiston ishbilarmon ayollar assotsiatsiyasi`, ru: `Ассоциация деловых женщин Узбекистана «Tadbirkor ayol»`, en: `Association of Business Women of Uzbekistan "Tadbirkor ayol"`}, chairman: `Mahmudova Gulnora G'ulomnazarovna`, phone: `+998 97 464 37 52`},
  {name: {uz: `«Hunarmand» uyushmasi`, ru: `Ассоциация «Hunarmand»`, en: `Hunarmand Association`}, chairman: `U. Abdullayev`},
  {name: {uz: `Bojxona brokerlari uyushmasi`, ru: `Ассоциация таможенных брокеров`, en: `Association of Customs Brokers`}, chairman: `Arsen Olegovich`, phone: `+998 90 187 85 98`},
  {name: {uz: `O'zbekiston qurilish assotsiatsiyasi`, ru: `Строительная ассоциация Узбекистана`, en: `Construction Association of Uzbekistan`}, chairman: `Jorabek Matiyakubov`, phone: `+998 99 814 01 85`},
  {name: {uz: `O'zbekiston eksportchilari uyushmasi`, ru: `Ассоциация экспортёров Узбекистана`, en: `Association of Exporters of Uzbekistan`}, chairman: `Yorqin Malikov`, phone: `+998 99 702 00 00`},
  {name: {uz: `O'zbekiston tibbiyot asbob-uskunalari ishlab chiqaruvchilari va yetkazib beruvchilari uyushmasi`, ru: `Ассоциация производителей и поставщиков медицинского оборудования Узбекистана`, en: `Association of Medical Equipment Manufacturers and Suppliers of Uzbekistan`}},
  {name: {uz: `O'zbekiston konchilar uyushmasi`, ru: `Ассоциация горняков Узбекистана`, en: `Association of Miners of Uzbekistan`}, chairman: `Sarvar Mirzayev`, phone: `+998 99 536 36 26`},
  {name: {uz: `Nodavlat ta'lim muassasalari uyushmasi`, ru: `Ассоциация негосударственных образовательных учреждений`, en: `Association of Non-governmental Educational Institutions`}, chairman: `Anvar Yusupov`, phone: `+998 90 986 33 77`},
  {name: {uz: `O'zbekiston Respublikasi neft mahsulotlari savdogarlari uyushmasi`, ru: `Ассоциация торговцев нефтепродуктами Республики Узбекистан`, en: `Association of Oil Product Traders of the Republic of Uzbekistan`}, chairman: `Saidalim Saidabboshon`, phone: `+998 99 485 44 55`},
  {name: {uz: `O'zbekiston to'qimachilari uyushmasi`, ru: `Ассоциация текстильщиков Узбекистана`, en: `Association of Textile Workers of Uzbekistan`}},
  {name: {uz: `Ish beruvchilar uyushmasi`, ru: `Ассоциация работодателей`, en: `Employers' Association`}},
  {name: {uz: `O'zbekiston oziq-ovqat sanoati uyushmasi`, ru: `Ассоциация пищевой промышленности Узбекистана`, en: `Food Industry Association of Uzbekistan`}, chairman: `Bahodir Umirshayxov`, phone: `+998 97 771 11 17`},
  {name: {uz: `O'zbekiston franchayzing assotsiatsiyasi`, ru: `Ассоциация франчайзинга Узбекистана`, en: `Franchise Association of Uzbekistan`}, chairman: `Murod Azamov`, phone: `+998 90 806 58 66`},
  {name: {uz: `Meva-sabzavotchilik uyushmasi`, ru: `Ассоциация плодоовощеводства`, en: `Fruit and Vegetable Growing Association`}, chairman: `Komoliddin`, phone: `+998 90 349 08 81`},
  {name: {uz: `MEYOS mebel va yog'ochsozlik sanoati uyushmasi`, ru: `Ассоциация мебельной и деревообрабатывающей промышленности «MEYOS»`, en: `MEYOS Furniture and Woodworking Industry Association`}, chairman: `Aziz`, phone: `+998 90 888 49 99`},
  {name: {uz: `Muqobil energetika uyushmasi`, ru: `Ассоциация альтернативной энергетики`, en: `Alternative Energy Association`}, chairman: `Aziz`, phone: `+998 90 352 07 00`},
  {name: {uz: `O'zbekiston mehmonxonalar uyushmasi`, ru: `Ассоциация отельеров Узбекистана`, en: `Hoteliers Association of Uzbekistan`}, chairman: `F. Abdullayeva`},
  {name: {uz: `O'zbekiston marketing uyushmasi`, ru: `Маркетинговая ассоциация Узбекистана`, en: `Marketing Association of Uzbekistan`}, chairman: `Diyor Mirzamuhammedov`, phone: `+998 97 333 44 45`},
  {name: {uz: `«UTID» O'zbekiston va Turkiya ishbilarmonlari uyushmasi`, ru: `Ассоциация деловых людей Узбекистана и Турции «UTID»`, en: `Uzbekistan and Turkey Business People Association "UTID"`}, chairman: `Ulugbek`, phone: `+998 93 502 32 62`},
  {name: {uz: `Ekspeditorlar uyushmasi`, ru: `Ассоциация экспедиторов`, en: `Association of Freight Forwarders`}, chairman: `Hokim Matchonov`, phone: `+998 90 185 54 00`},
  {name: {uz: `Quruvchilar uyushmasi`, ru: `Ассоциация строителей`, en: `Association of Builders`}, chairman: `Holmatov`, phone: `+998 90 990 97 69`},
  {name: {uz: `Ko'ngillilar uyushmasi`, ru: `Ассоциация волонтёров`, en: `Volunteers Association`}, phone: `+998 90 188 08 11`},
  {name: {uz: `Hi China xalqaro yoshlarni rivojlantirish alyansi`, ru: `Международный альянс развития молодёжи «Hi China»`, en: `Hi China International Youth Development Alliance`}},
  {name: {uz: `Santexniklar uyushmasi`, ru: `Ассоциация сантехников`, en: `Plumbers Association`}, chairman: `Sadikov Maruf`, phone: `+998 90 910 70 75`},
  {name: {uz: `Turizmni barqaror rivojlantirish uyushmasi`, ru: `Ассоциация устойчивого развития туризма`, en: `Association for Sustainable Development of Tourism`}},
  {name: {uz: `O'zbekiston haydovchilari uyushmasi`, ru: `Ассоциация водителей Узбекистана`, en: `Association of Drivers of Uzbekistan`}, chairman: `Ravshan Agzamov`, phone: `+998 99 858 34 34`},
  {name: {uz: `O'zbekiston gastronomik turizm uyushmasi`, ru: `Ассоциация гастрономического туризма Узбекистана`, en: `Association of Gastronomic Tourism of Uzbekistan`}, chairman: `Gulnoza Odilova`, phone: `+998 90 354 35 58`},
  {name: {uz: `O'zbekiston internet tadbirkorlari uyushmasi`, ru: `Ассоциация интернет-предпринимателей Узбекистана`, en: `Association of Internet Entrepreneurs of Uzbekistan`}, chairman: `S. Akbarxo'djayeva`},
  {name: {uz: `Turizm va investorlar uyushmasi`, ru: `Ассоциация туризма и инвесторов`, en: `Association of Tourism and Investors`}},
  {name: {uz: `Milliy transport uyushmasi`, ru: `Национальная транспортная ассоциация`, en: `National Transport Association`}},
  {name: {uz: `Turizmni rivojlantirish uyushmasi`, ru: `Ассоциация развития туризма`, en: `Tourism Development Association`}, chairman: `Dilshod Odilov`, phone: `+998 90 916 01 11`},
  {name: {uz: `Elektron tijorat uyushmasi`, ru: `Ассоциация электронной коммерции`, en: `E-commerce Association`}},
  {name: {uz: `Umra ziyorati turagentliklari uyushmasi`, ru: `Ассоциация турагентств по паломничеству умра`, en: `Association of Umrah Pilgrimage Travel Agencies`}},
  {name: {uz: `HR biznes hamkorlari uyushmasi`, ru: `Ассоциация HR бизнес-партнёров`, en: `HR Business Partners Association`}, chairman: `Madina Bilalova`, phone: `+998 97 702 28 88`},
  {name: {uz: `Xotin-qizlar uyushmasi`, ru: `Ассоциация женщин`, en: `Women's Association`}},
  {name: {uz: `Professional boshqaruvchilar va uy-joy xizmat ko'rsatish tashkilotlari uyushmasi`, ru: `Ассоциация профессиональных управляющих и организаций жилищно-коммунального обслуживания`, en: `Association of Professional Managers and Housing Service Organisations`}},
  {name: {uz: `O'zbekiston-Xitoy biznes assotsiatsiyasi`, ru: `Узбекско-китайская бизнес-ассоциация`, en: `Uzbekistan–China Business Association`}},
  {name: {uz: `O'zbekiston buxgalterlar va auditorlar milliy assotsiatsiyasi`, ru: `Национальная ассоциация бухгалтеров и аудиторов Узбекистана`, en: `National Association of Accountants and Auditors of Uzbekistan`}},
  {name: {uz: `O'zbekiston Respublikasi tibbiy turizm assotsiatsiyasi`, ru: `Ассоциация медицинского туризма Республики Узбекистан`, en: `Medical Tourism Association of the Republic of Uzbekistan`}},
  {name: {uz: `O'zbekiston yoshlari umumjahon assotsiatsiyasi`, ru: `Всемирная ассоциация молодёжи Узбекистана`, en: `World Association of Youth of Uzbekistan`}},
  {name: {uz: `«O'zsanoatqurilishmateriallari» uyushmasi`, ru: `Ассоциация «O'zsanoatqurilishmateriallari»`, en: `O'zsanoatqurilishmateriallari Association`}},
  {name: {uz: `Harbiy sanoatni rivojlantirish uyushmasi`, ru: `Ассоциация развития военной промышленности`, en: `Association for the Development of the Defence Industry`}},
  {name: {uz: `Arxitektorlar va dizaynerlar uyushmasi`, ru: `Ассоциация архитекторов и дизайнеров`, en: `Association of Architects and Designers`}},
  {name: {uz: `Lizingchilar uyushmasi`, ru: `Ассоциация лизинговых компаний`, en: `Association of Leasing Companies`}},
  {name: {uz: `Islom moliyasi uyushmasi`, ru: `Ассоциация исламского финансирования`, en: `Islamic Finance Association`}},
  {name: {uz: `Elektro texnika uyushmasi`, ru: `Ассоциация электротехники`, en: `Electrical Engineering Association`}},
];

/** Resolve association names/activity to a single locale. */
export function getAssociations(locale: string): LocalizedAssociation[] {
  const l: keyof L = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  return associations.map((a) => ({
    id: slugify(a.name.en),
    name: a.name[l],
    chairman: a.chairman,
    phone: a.phone,
    activity: a.activity ? a.activity[l] : undefined,
  }));
}

/** A single association resolved for a locale, or undefined if the id is unknown. */
export function getAssociation(id: string, locale: string): LocalizedAssociation | undefined {
  return getAssociations(locale).find((a) => a.id === id);
}

/** All association slugs — for generateStaticParams. */
export function allAssociationIds(): string[] {
  return associations.map((a) => slugify(a.name.en));
}
