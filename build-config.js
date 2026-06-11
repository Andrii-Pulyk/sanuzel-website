module.exports = {
  // Полный адрес сайта (без завершающего слэша).
  siteUrl: 'https://andrii-pulyk.github.io',
  // Базовый путь, если сайт раздаётся из подпапки (GitHub Pages project site).
  // Для проектной страницы это '/<имя-репозитория>'. Для корневого домена — ''.
  basePath: '/sanuzel-website',
  defaultLang: 'ru',

  // Почта, куда приходят заявки с формы (через FormSubmit.co, без сервера).
  // Чтобы сменить адрес получателя — поменяй здесь и пересобери (npm run build).
  // ВАЖНО: после смены почты первая заявка снова потребует подтверждения по письму от FormSubmit.
  leadEmail: '89892615877a@gmail.com',

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
