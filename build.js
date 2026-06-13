const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./build-config');

const BASE = config.basePath || '';

// Версия ассетов для cache-busting: короткий хэш от содержимого CSS+JS.
// Меняется при любой правке стилей/скриптов → браузер подтягивает свежий файл.
function computeAssetVersion() {
  const hash = crypto.createHash('md5');
  for (const rel of ['css/style.css', 'js/main.js']) {
    try { hash.update(fs.readFileSync(path.join(SRC, rel))); } catch (e) { /* ignore */ }
  }
  return hash.digest('hex').slice(0, 8);
}

const SRC = path.join(__dirname, 'src');
const DIST = __dirname; // Output to repo root for GitHub Pages
const I18N_DIR = path.join(SRC, 'i18n');
const TEMPLATES_DIR = path.join(SRC, 'templates');

const ASSET_VERSION = computeAssetVersion();
const PARTIALS_DIR = path.join(TEMPLATES_DIR, 'partials');
const CONTENT_DIR = path.join(SRC, 'content');

// ─── 1. Discover languages ────────────────────────────────────────────────────

const languages = fs.readdirSync(I18N_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

console.log(`Languages found: ${languages.join(', ')}`);

// ─── 2. Load translations ─────────────────────────────────────────────────────

const translations = {};
for (const lang of languages) {
  translations[lang] = JSON.parse(
    fs.readFileSync(path.join(I18N_DIR, `${lang}.json`), 'utf8')
  );
}

// ─── 3. Load partials ──────────────────────────────────────────────────────────

const partials = {};
for (const file of fs.readdirSync(PARTIALS_DIR)) {
  if (!file.endsWith('.html')) continue;
  const name = file.replace('.html', '');
  partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, file), 'utf8');
}

console.log(`Partials loaded: ${Object.keys(partials).join(', ')}`);

// ─── 4. Helper functions ───────────────────────────────────────────────────────

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function getOutputPath(pageSlug, template, lang) {
  // Check urlOverrides first
  if (config.urlOverrides[pageSlug] && config.urlOverrides[pageSlug][lang]) {
    return config.urlOverrides[pageSlug][lang];
  }
  // Default language → root
  if (lang === config.defaultLang) {
    return '/' + template;
  }
  // Other languages → /{lang}/template
  return '/' + lang + '/' + template;
}

function getPageUrl(pageSlug, template, lang) {
  const outputPath = getOutputPath(pageSlug, template, lang);
  // Clean up /index.html → / and prefix the base path
  return config.siteUrl + BASE + outputPath.replace(/\/index\.html$/, '/');
}

function generateHreflangTags(page, langs) {
  const tags = [];
  for (const lang of langs) {
    const url = getPageUrl(page.slug, page.template, lang);
    tags.push(`    <link rel="alternate" hreflang="${lang}" href="${url}">`);
  }
  // x-default points to the default language
  const defaultUrl = getPageUrl(page.slug, page.template, config.defaultLang);
  tags.push(`    <link rel="alternate" hreflang="x-default" href="${defaultUrl}">`);
  return tags.join('\n');
}

function generateNavUrls(lang) {
  const urls = {};
  for (const p of config.pages) {
    const outputPath = getOutputPath(p.slug, p.template, lang);
    const key = p.slug;
    // For index, use directory path. Prefix base path for project-site hosting.
    if (p.slug === 'index') {
      urls[key] = BASE + outputPath.replace(/index\.html$/, '');
    } else {
      urls[key] = BASE + outputPath;
    }
  }
  return urls;
}

function generateLangSwitcher(currentLang, currentPage, langs) {
  if (langs.length < 2) return '';

  // For 2 languages: simple toggle link
  if (langs.length === 2) {
    const otherLang = langs.find(l => l !== currentLang);
    const otherUrl = getOutputPath(currentPage.slug, currentPage.template, otherLang);
    const cleanUrl = currentPage.slug === 'index'
      ? otherUrl.replace(/index\.html$/, '')
      : otherUrl;
    return `<a href="${cleanUrl}" class="lang-toggle" title="${translations[otherLang].meta.lang.toUpperCase()}">${otherLang.toUpperCase()}</a>`;
  }

  // For 3+ languages: dropdown
  let html = '<div class="lang-selector">';
  html += `<button class="lang-selector-toggle" aria-expanded="false" aria-label="Language">${currentLang.toUpperCase()} &#9662;</button>`;
  html += '<ul class="lang-selector-menu">';
  for (const lang of langs) {
    const url = getOutputPath(currentPage.slug, currentPage.template, lang);
    const cleanUrl = currentPage.slug === 'index'
      ? url.replace(/index\.html$/, '')
      : url;
    const activeClass = lang === currentLang ? ' class="active"' : '';
    html += `<li><a href="${cleanUrl}"${activeClass}>${lang.toUpperCase()}</a></li>`;
  }
  html += '</ul></div>';
  return html;
}

function generateLangSwitcherMobile(currentLang, currentPage, langs) {
  if (langs.length < 2) return '';

  // For 2 languages: simple link in mobile nav
  if (langs.length === 2) {
    const otherLang = langs.find(l => l !== currentLang);
    const otherUrl = getOutputPath(currentPage.slug, currentPage.template, otherLang);
    const cleanUrl = currentPage.slug === 'index'
      ? otherUrl.replace(/index\.html$/, '')
      : otherUrl;
    return `<a href="${cleanUrl}" class="lang-toggle-mobile">${otherLang.toUpperCase()}</a>`;
  }

  // For 3+ languages: list in mobile nav
  let html = '';
  for (const lang of langs) {
    if (lang === currentLang) continue;
    const url = getOutputPath(currentPage.slug, currentPage.template, lang);
    const cleanUrl = currentPage.slug === 'index'
      ? url.replace(/index\.html$/, '')
      : url;
    html += `<a href="${cleanUrl}" class="lang-toggle-mobile">${lang.toUpperCase()}</a>`;
  }
  return html;
}

function loadPageContent(pageSlug, lang) {
  const contentFile = path.join(CONTENT_DIR, `${pageSlug}.${lang}.html`);
  if (fs.existsSync(contentFile)) {
    return fs.readFileSync(contentFile, 'utf8');
  }
  return '';
}

// ─── Города (мультигородские лендинги) ───────────────────────────────────────

const CITIES = config.cities || [];

function generateCitySwitcher(activeSlug) {
  if (!CITIES.length) return '';
  const activeCity = activeSlug ? CITIES.find(c => c.slug === activeSlug) : null;
  const label = activeCity ? activeCity.nom : (config.cityMenuLabel || 'Город');
  let html = '<div class="city-switch">';
  html += `<button class="city-switch-toggle" type="button" aria-label="Выбрать город">`;
  html += '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  html += `${label}</button>`;
  html += '<div class="city-switch-menu">';
  for (const c of CITIES) {
    const url = BASE + '/' + c.slug + '/';
    const active = c.slug === activeSlug ? ' class="active"' : '';
    html += `<a href="${url}"${active}>${c.nom}<span>${c.pl}</span></a>`;
  }
  html += '</div></div>';
  return html;
}

function generateFooterCitiesBlock(title) {
  if (!CITIES.length) return '';
  const links = CITIES.map(c => `<a href="${BASE}/${c.slug}/">${c.nom}</a>`).join('');
  return `<div><h4>${title}</h4><div class="footer-cities">${links}</div></div>`;
}

function substituteCity(cityStrings, city) {
  const out = {};
  for (const key of Object.keys(cityStrings)) {
    out[key] = String(cityStrings[key])
      .replace(/%CITY_IN%/g, city.loc)
      .replace(/%CITY_GEN%/g, city.gen)
      .replace(/%CITY%/g, city.nom);
  }
  return out;
}

function renderTemplate(template, context) {
  let html = template.replace(/\{\{>\s*(\w+)\s*\}\}/g, (m, name) => partials[name] || m);
  html = html.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_.]*)\}\}/g, (m, keyPath) => {
    const value = getNestedValue(context, keyPath);
    return value !== undefined ? String(value) : m;
  });
  return html;
}

// ─── 5. Clean output files ──────────────────────────────────────────────────────

function cleanOutput() {
  // Remove only generated language subdirs (e.g. /en/)
  for (const lang of languages) {
    if (lang === config.defaultLang) continue;
    const langDir = path.join(DIST, lang);
    if (fs.existsSync(langDir)) {
      fs.rmSync(langDir, { recursive: true });
    }
  }
}

// ─── 6. Copy static assets ────────────────────────────────────────────────────

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ─── 7. Build ──────────────────────────────────────────────────────────────────

cleanOutput();

let pagesGenerated = 0;

for (const page of config.pages) {
  const templatePath = path.join(TEMPLATES_DIR, page.template);
  const template = fs.readFileSync(templatePath, 'utf8');

  for (const lang of languages) {
    const t = translations[lang];
    const navUrls = generateNavUrls(lang);

    // Compute output path
    const outputPath = getOutputPath(page.slug, page.template, lang);

    // Assets prefix based on directory depth
    const pathWithoutLeadingSlash = outputPath.replace(/^\//, '');
    const depth = pathWithoutLeadingSlash.split('/').length - 1;
    const assetsPrefix = depth > 0 ? '../'.repeat(depth) : '';

    // Canonical URL
    const canonicalUrl = getPageUrl(page.slug, page.template, lang);

    // Privacy switch URL (for privacy pages)
    let privacySwitchUrl = '';
    if (page.slug === 'privacy' && languages.length > 1) {
      // Find the "other" language for the switch link
      const otherLang = languages.length === 2
        ? languages.find(l => l !== lang)
        : (lang === config.defaultLang ? languages.find(l => l !== lang) : config.defaultLang);
      if (otherLang) {
        privacySwitchUrl = BASE + getOutputPath('privacy', 'privacy.html', otherLang);
      }
    }

    // Load page content from content files (for privacy etc.)
    const pageContent = loadPageContent(page.slug, lang);

    // Build context object
    const context = {
      meta: t.meta,
      nav: t.nav,
      footer: t.footer,
      page: t[page.slug],
      // Computed values (prefixed with _ to distinguish)
      _assets: assetsPrefix,
      _asset_version: ASSET_VERSION,
      _lead_email: config.leadEmail,
      _canonical_url: canonicalUrl,
      _hreflang_tags: generateHreflangTags(page, languages),
      _lang_switcher: generateLangSwitcher(lang, page, languages),
      _lang_switcher_mobile: generateLangSwitcherMobile(lang, page, languages),
      _nav_home_url: navUrls.index,
      _nav_services_url: navUrls.services,
      _nav_contacts_url: navUrls.contact,
      _privacy_url: BASE + getOutputPath('privacy', 'privacy.html', lang),
      _privacy_switch_url: privacySwitchUrl,
      _page_content: pageContent,
      _city_switcher: generateCitySwitcher(null),
      _footer_cities_block: generateFooterCitiesBlock(t.footer.cities_title),
    };

    // Process template
    let html = template;

    // 1. Include partials: {{> name}}
    html = html.replace(/\{\{>\s*(\w+)\s*\}\}/g, (match, name) => {
      return partials[name] || match;
    });

    // 2. Replace placeholders: {{key.subkey}}
    html = html.replace(/\{\{([a-zA-Z_][a-zA-Z0-9_.]*)\}\}/g, (match, keyPath) => {
      const value = getNestedValue(context, keyPath);
      return value !== undefined ? String(value) : match;
    });

    // Write output file
    const outputFile = path.join(DIST, pathWithoutLeadingSlash);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html, 'utf8');
    pagesGenerated++;

    console.log(`  ${lang.toUpperCase()} → ${outputPath}`);
  }
}

// ─── 7b. Build city landing pages (default language) ────────────────────────

if (CITIES.length) {
  const cityTemplatePath = path.join(TEMPLATES_DIR, 'city.html');
  if (fs.existsSync(cityTemplatePath)) {
    const cityTemplate = fs.readFileSync(cityTemplatePath, 'utf8');
    const lang = config.defaultLang;
    const t = translations[lang];
    const navUrls = generateNavUrls(lang);

    for (const city of CITIES) {
      const cityPage = substituteCity(t.city, city);
      const context = {
        meta: t.meta,
        nav: t.nav,
        footer: t.footer,
        page: cityPage,
        idx: t.index,
        _assets: '../',
        _asset_version: ASSET_VERSION,
        _lead_email: config.leadEmail,
        _canonical_url: config.siteUrl + BASE + '/' + city.slug + '/',
        _hreflang_tags: '',
        _lang_switcher: '',
        _lang_switcher_mobile: '',
        _nav_home_url: navUrls.index,
        _nav_services_url: navUrls.services,
        _nav_contacts_url: navUrls.contact,
        _privacy_url: BASE + getOutputPath('privacy', 'privacy.html', lang),
        _privacy_switch_url: '',
        _page_content: '',
        _city_switcher: generateCitySwitcher(city.slug),
        _footer_cities_block: generateFooterCitiesBlock(t.footer.cities_title),
        _districts: city.districts.map(d => `<span class="chip">${d}</span>`).join(''),
      };

      const html = renderTemplate(cityTemplate, context);
      const outputFile = path.join(DIST, city.slug, 'index.html');
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, html, 'utf8');
      pagesGenerated++;
      console.log(`  CITY → /${city.slug}/`);
    }
  }
}

// Copy static assets
copyDirRecursive(path.join(SRC, 'css'), path.join(DIST, 'css'));
copyDirRecursive(path.join(SRC, 'js'), path.join(DIST, 'js'));
copyDirRecursive(path.join(SRC, 'images'), path.join(DIST, 'images'));

// ─── 8. Generate sitemap.xml ────────────────────────────────────────────────

const SITEMAP_DATE = new Date().toISOString().slice(0, 10);

const sitemapUrls = [];
for (const page of config.pages) {
  for (const lang of languages) {
    const url = getPageUrl(page.slug, page.template, lang);
    const priority = page.slug === 'index' ? '1.0'
      : page.slug === 'privacy' ? '0.3'
      : '0.8';
    const changefreq = page.slug === 'index' ? 'weekly'
      : page.slug === 'privacy' ? 'yearly'
      : 'monthly';
    sitemapUrls.push(`  <url>\n    <loc>${url}</loc>\n    <lastmod>${SITEMAP_DATE}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`);
  }
}

for (const city of CITIES) {
  const url = config.siteUrl + BASE + '/' + city.slug + '/';
  sitemapUrls.push(`  <url>\n    <loc>${url}</loc>\n    <lastmod>${SITEMAP_DATE}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log('  sitemap.xml generated');

// ─── 9. Generate robots.txt ─────────────────────────────────────────────────

const robots = `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}${BASE}/sitemap.xml
`;

fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');
console.log('  robots.txt generated');

console.log(`\nBuild complete: ${pagesGenerated} pages generated for ${languages.length} languages.`);
console.log(`Static assets copied.`);
