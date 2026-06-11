module.exports = {
  siteUrl: 'https://sanuzel.pro',
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
