module.exports = {
  // Полный адрес сайта (без завершающего слэша).
  siteUrl: 'https://andrii-pulyk.github.io',
  // Базовый путь, если сайт раздаётся из подпапки (GitHub Pages project site).
  // Для проектной страницы это '/<имя-репозитория>'. Для корневого домена — ''.
  basePath: '/sanuzel-website',
  defaultLang: 'ru',

  pages: [
    { template: 'index.html', slug: 'index' },
    { template: 'services.html', slug: 'services' },
    { template: 'contact.html', slug: 'contact' },
    { template: 'privacy.html', slug: 'privacy' },
  ],

  // Override default URL pattern for specific page+lang combos
  // Default pattern: /{lang}/page.html (for non-default lang), /page.html (for default lang)
  urlOverrides: {},
};
