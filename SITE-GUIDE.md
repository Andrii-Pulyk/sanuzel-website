# Руководство по сайту санузел.про

Сайт «Отделка санузлов под ключ». Инфраструктура полностью повторяет ClewByte.com:
статический генератор на Node.js, сборка в корень репозитория, хостинг на GitHub Pages.

## Структура проекта

```
├── build.js              # Скрипт сборки
├── build-config.js       # Конфигурация: страницы, язык, URL сайта
├── package.json          # npm run build
├── .githooks/pre-commit  # Автосборка перед коммитом
│
├── src/                  # ИСХОДНИКИ (редактировать здесь)
│   ├── templates/        # HTML-шаблоны страниц
│   │   ├── partials/     # Общие части (head, header, footer)
│   │   ├── index.html
│   │   ├── services.html
│   │   ├── contact.html
│   │   └── privacy.html
│   ├── i18n/             # Переводы / тексты
│   │   └── ru.json
│   ├── content/          # Контент-блоки (длинные тексты)
│   │   └── privacy.ru.html
│   ├── css/style.css
│   ├── js/main.js
│   └── images/favicon.svg
│
├── index.html            # СОБРАННЫЕ ФАЙЛЫ (не редактировать!)
├── services.html         # Генерируются автоматически из src/
├── contact.html
├── privacy.html
├── css/  js/  images/    # Копируются из src/ при сборке
├── sitemap.xml           # Генерируется автоматически
└── robots.txt            # Генерируется автоматически
```

## Как обновлять сайт

### 1. Редактируешь файлы в `src/`

- Тексты → `src/i18n/ru.json`
- Разметка → `src/templates/`
- Длинные тексты (политика) → `src/content/`
- Стили → `src/css/style.css`
- Скрипты → `src/js/main.js`
- Картинки → `src/images/`

**Никогда не редактируй файлы в корне** (`index.html`, `css/`, `js/` и т.д.) —
они перезаписываются при сборке.

### 2. Собираешь

```bash
npm run build
```

### 3. Коммитишь и пушишь

```bash
git add .
git commit -m "Описание изменений"
git push
```

При коммите сработает pre-commit hook (`npm run build` + добавление собранных файлов).
Чтобы хук заработал после клонирования: `git config core.hooksPath .githooks`.

## Реальные данные фирмы (уже проставлены)

Реквизиты и контакты взяты из `~/Documents/DabudinwestAI/firma.md`
и `~/Documents/remont lazienki.json`:

| Параметр | Значение |
|----------|----------|
| Юр. лицо | DABUDINWEST sp. z o.o. |
| NIP | 1133056595 |
| REGON | 521795720 |
| KRS | 0000967333 |
| Адрес | ul. Hoża 86 lok. 410, 00-682 Warszawa |
| Телефон | +48 795 656 642 |
| Email | dabudinwest2022@gmail.com |
| Профиль (PKD) | 43.33.Z — укладка плитки, облицовка стен |

## Хостинг

Сайт раздаётся через **GitHub Pages** из ветки `main`, папка `/ (root)`.

- **Репозиторий:** https://github.com/Andrii-Pulyk/sanuzel-website (public)
- **Адрес сайта:** https://andrii-pulyk.github.io/sanuzel-website/
- Так как это «проектная» страница (подпапка `/sanuzel-website/`), в `build-config.js`
  задан `basePath: '/sanuzel-website'` — он подставляется во все внутренние ссылки,
  canonical и sitemap. Ассеты (css/js/images) подключаются относительными путями.

### Свой домен (когда появится)

1. В `build-config.js`: `siteUrl: 'https://твойдомен'`, `basePath: ''`.
2. Создать файл `CNAME` в `src/`-сборку (или в корне) с доменом, настроить DNS.
3. В Settings → Pages → Custom domain указать домен.
4. `npm run build`, закоммитить, запушить.

## Что ещё стоит проверить / заменить

| Что | Где | Текущее значение |
|-----|-----|------------------|
| Торговая марка / логотип | `src/templates/partials/*.html` | `санузел.про` (можно сменить на DABUDINWEST) |
| Цифры на главной | `src/i18n/ru.json` → `index.stat_*` | 350+, от 14 дней, 3 года |
| Цены | `src/i18n/ru.json` → `services.price_*` | ориентировочные |
| Режим работы | `src/i18n/ru.json` → `contact.hours_value` | Пн–Сб, 9:00–20:00 |
| `CNAME` для GitHub Pages | создать файл в корне | — |

> Email вынесен в `main.js` (обфускация от спам-ботов) — меняй переменные `user` и `domain`.
> Логотип-бренд `санузел.про` — это торговое название; юридическое лицо
> DABUDINWEST sp. z o.o. указано в реквизитах (подвал, блок «О компании», контакты, политика).

## Заявки с формы

Форма на странице «Контакты» сейчас **не отправляет данные на сервер** —
после сабмита показывается сообщение об успехе (как в исходной инфраструктуре).
Чтобы заявки приходили, в `src/js/main.js` (обработчик `contactForm`) добавь
отправку через `fetch()` на свой backend / форм-сервис (Formspree, Telegram-бот и т.п.).

## Добавление языка (при необходимости)

Инфраструктура поддерживает мультиязычность:

1. Создать `src/i18n/xx.json` (скопировать `ru.json`, перевести).
2. При необходимости — `src/content/privacy.xx.html`.
3. `npm run build` — язык-переключатель и hreflang появятся автоматически.
   Неосновные языки собираются в подпапку `/xx/`.

Основной язык задаётся в `build-config.js` → `defaultLang` (сейчас `ru`).

## Частые ошибки

- **Редактировал корневые HTML** — изменения пропадут при следующей сборке. Только `src/`.
- **Инлайн-стили / инлайн-скрипты не работают** — на страницах включён строгий CSP
  (`style-src 'self'; script-src 'self'`). Стили клади в `style.css`, скрипты в `main.js`.
- **Pre-commit hook не срабатывает** — выполни `git config core.hooksPath .githooks`.
