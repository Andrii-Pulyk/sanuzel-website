module.exports = {
  // Полный адрес сайта (без завершающего слэша).
  siteUrl: 'https://mistrzlazienek.pl',
  // Базовый путь, если сайт раздаётся из подпапки (GitHub Pages project site).
  // Для проектной страницы это '/<имя-репозитория>'. Для корневого домена — ''.
  basePath: '',
  defaultLang: 'ru',

  // Контактный email бренда, показывается на сайте и используется в контенте.
  leadEmail: 'kontakt@mistrzlazienek.pl',
  // Email аккаунта Forminit (Free plan): сюда реально приходят уведомления по форме.
  ccEmail: '89892615877a@gmail.com',
  // ID формы в Forminit. Текущий backend формы: https://forminit.com/f/<formId>
  forminitFormId: 'mdg7xylojtp',
  // GA4 Measurement ID. Пример: G-XXXXXXXXXX. Оставь пустым, чтобы отключить аналитику.
  ga4MeasurementId: 'G-P9N5CG8ZZX',

  // Название бренда для соцсетей (og:site_name) и schema.org.
  siteName: 'Mistrz Łazienek',
  // Картинка для превью в соцсетях/мессенджерах (og:image). Путь от корня сайта.
  ogImage: 'images/hero-background-wide.png',
  ogImageWidth: 1672,
  ogImageHeight: 941,

  // ─── Данные бизнеса для микроразметки schema.org (JSON-LD) ─────────────────
  // На основе этого блока build.js генерирует LocalBusiness / Service / FAQPage /
  // BreadcrumbList. Это помогает Google показывать сайт в локальной выдаче и картах.
  // ВАЖНО: проверь координаты (lat/lng) — они приблизительные. Точные возьми из
  // Google Business Profile (карточки компании на Google Картах).
  business: {
    name: 'Mistrz Łazienek',
    legalName: 'DABUDINWEST sp. z o.o.',
    // Тип по schema.org: HomeAndConstructionBusiness — ремонт/строительство.
    type: 'HomeAndConstructionBusiness',
    phone: '+48795656642',
    email: 'kontakt@mistrzlazienek.pl',
    street: 'ul. Hoża 86 lok. 410',
    postalCode: '00-682',
    city: 'Warszawa',
    region: 'Mazowieckie',
    country: 'PL',
    lat: 52.2272,   // приблизительно (Hoża 86, Śródmieście) — уточнить в Google Business Profile
    lng: 21.0000,   // приблизительно
    priceRange: '$$',
    vatID: 'PL1133056595',
    foundingDate: '2022',
    // Города/районы обслуживания (areaServed).
    areaServed: ['Warszawa', 'Warszawa i okolice'],
    // Режим работы: дни недели (Mo,Tu,We,Th,Fr,Sa,Su) + время.
    openingHours: [
      { days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], opens: '09:00', closes: '20:00' },
    ],
    // Ссылки на профили (Google Business Profile, соцсети) — заполни, когда появятся.
    // GBP добавим после видео-верификации; Facebook (Interno Perfetto) — когда/если переименуем в Mistrz Łazienek.
    sameAs: [
      'https://www.oferteo.pl/dabudinwest-spolka-z-ograniczona-odpowiedzialnoscia/firma/5683720',
    ],
  },

  pages: [
    { template: 'index.html', slug: 'index' },
    { template: 'services.html', slug: 'services' },
    { template: 'contact.html', slug: 'contact' },
    { template: 'privacy.html', slug: 'privacy' },
  ],

  // Городские лендинги. Генерируются из src/templates/city.html в подпапку /<slug>/.
  // Маркеры в src/i18n/<lang>.json → city: %CITY% (им.п.), %CITY_IN% (предл.п.), %CITY_GEN% (род.п.).
  //
  // Сейчас компания работает только в Варшаве (это и есть основной город всего сайта),
  // поэтому отдельные городские лендинги ОТКЛЮЧЕНЫ — массив пустой.
  // Когда появится новый город — раскомментируй нужные записи (переключатель города
  // в шапке и список городов в подвале включатся автоматически).
  cityMenuLabel: 'Город',
  cities: [
    // { slug: 'krakow', nom: 'Краков', loc: 'в Кракове', gen: 'Кракова', pl: 'Kraków',
    //   districts: ['Stare Miasto', 'Krowodrza', 'Podgórze', 'Nowa Huta', 'Dębniki', 'Bronowice', 'Prądnik'] },
    // { slug: 'wroclaw', nom: 'Вроцлав', loc: 'во Вроцлаве', gen: 'Вроцлава', pl: 'Wrocław',
    //   districts: ['Stare Miasto', 'Krzyki', 'Fabryczna', 'Psie Pole', 'Śródmieście'] },
    // { slug: 'gdansk', nom: 'Гданьск', loc: 'в Гданьске', gen: 'Гданьска', pl: 'Gdańsk',
    //   districts: ['Główne Miasto', 'Wrzeszcz', 'Oliwa', 'Przymorze', 'Zaspa', 'Jasień'] },
  ],

  // Override default URL pattern for specific page+lang combos
  // Default pattern: /{lang}/page.html (for non-default lang), /page.html (for default lang)
  urlOverrides: {},
};
