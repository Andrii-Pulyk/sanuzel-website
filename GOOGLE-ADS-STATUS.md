# Google Ads campaign status

Last updated: `2026-08-17`, Europe/Warsaw

## Mandatory rules

- Do not enable AI Max for `Leads-Search-1` without explicit approval from the account owner.
- Do not apply Google's keyword recommendations automatically.
- Do not use broad-match keywords while the budget is `30 PLN/day` and reliable conversion data is limited.
- Add keywords manually using exact or phrase match only.
- Keep form submission as the only primary conversion used for bidding.
- Keep contact clicks secondary unless their lead quality is proven.

## Account and campaign

- Google Ads account: `449-729-1594`
- Campaign: `Leads-Search-1`
- Campaign ID: `24024974764`
- Type: Search
- Status: enabled, eligible with limitations
- Bid strategy: Maximize Conversions
- Budget: `30.00 PLN/day`
- Ad group: `Группа объявлений 1`
- Landing page: `https://mistrzlazienek.pl/pl/`
- Display path: `mistrzlazienek.pl/remont/lazienki`

## Current diagnosis

Checked live via campaign diagnostics on `2026-08-17`. Campaign header warning: `За последнюю неделю в кампании не регистрировались конверсии`. Two specific warnings inside:

- `Цели` tab: `В настройках расширенного отслеживания конверсий есть проблемы, влияющие на эффективность`, drilling in shows the affected conversion action `Отправка формы для потенциальных клиентов (1)` (Основные/primary, source TAG) has status `Нет недавних данных`.
- `Аудитории` tab: `Ваша реклама показывается не по всем возможным поисковым запросам` — this is Google's usual broad-match keyword recommendation. **Do not apply** (see mandatory rules above).
- `Аккаунт`, `Объявления`, `Бюджет и ставки` tabs: all green/no issues.

Investigated whether the "no recent data" warning means the conversion tag is broken:

- Reviewed `src/js/main.js`: on successful form submit (after the Forminit fetch resolves), it fires `gtag('event', 'conversion', {send_to: 'AW-17993328154/PGLNCIr3xM4cEJrM8YND', ...})` with a unique `transaction_id`, and calls `setEnhancedConversionData()` (email/phone) beforehand. Logic is correct.
- Reviewed CSP in `src/templates/partials/head.html` (generated via `build.js` `getCspScriptSrc`/`getCspConnectSrc`/`getCspImgSrc`): confirmed the deployed `index.html`/`pl/index.html` CSP headers whitelist `googletagmanager.com`, `google-analytics.com`, `region1.google-analytics.com`, `googleadservices.com`, `googleads.g.doubleclick.net`, `ad.doubleclick.net`, `google.com` — nothing is being blocked by CSP.
- Cross-checked Forminit notification emails (`notifications@forminit-mail.com` → `89892615877a@gmail.com`, some filed under Trash): real lead submissions occurred on `2026-07-14` (Artiom) and `2026-08-01` (Samuel Klonowski). Weekly Forminit summaries confirm 0 submissions for the weeks of `2026-07-20`–`2026-07-26` and `2026-08-03`–`2026-08-09`.
- Conclusion: the conversion tag and code are working correctly. The "Нет недавних данных" warning just means no form has been submitted in the last ~2 weeks (last one was `2026-08-01`), not that tracking is broken. The account owner confirmed at least one of these submissions was already counted as a conversion in Google Ads. No code changes needed; re-check will clear itself once a new lead comes in.
- Audiences do not need to be configured now. Do not use audience `Targeting`, because it could sharply restrict reach. Observation audiences may be added later for reporting only.

## Performance snapshot

Date range: `2026-06-19` to `2026-07-16`

- Impressions: `242`
- Clicks: `23`
- CTR: `9.50%`
- Average CPC: `8.18 PLN`
- Cost: `188.23 PLN`
- Reported conversions: `0.00`

These figures include historical AI Max traffic and precede reliable conversion reporting. Do not use them alone to remove otherwise relevant keywords.

Latest snapshot, date range `2026-08-10` to `2026-08-16` (checked `2026-08-17`):

- Impressions: `218`
- Clicks: `26`
- CTR: `11.93%`
- Average CPC: `8.78 PLN`
- Cost: `228.26 PLN`
- Reported conversions: `0.00` for this 7-day window (last actual lead was `2026-08-01`, outside this window — see Current diagnosis).
- Optimization score: `70.8%`.

## AI Max

- AI Max was confirmed enabled and was disabled on `2026-07-16`.
- Historical AI Max keyword expansion: `73.00 PLN`.
- Historical AI Max landing-page expansion: `46.02 PLN`.
- Total historical AI Max expansion spend: `119.02 PLN`.
- Examples of overly broad search terms: `projekt łazienki`, `remont warszawa`, `remont łazienki dla seniora`.
- The disabled switch was verified in campaign settings after confirmation.

## Keywords

Existing controlled keywords include exact and phrase variants for:

- `remont łazienki warszawa`
- `wykończenie łazienki warszawa`
- `remonty łazienek warszawa`
- `kompleksowy remont łazienki warszawa`
- `wykończenie łazienki pod klucz`
- `łazienka pod klucz warszawa`
- `firma do remontu łazienki warszawa`

Added manually on `2026-07-16` as phrase match:

- `"remont łazienki pod klucz warszawa"`
- `"generalny remont łazienki warszawa"`

Both newly added phrases initially showed `На проверке` and a preliminary `Мало запросов` status. Re-check after Google completes review.

Google's recommendation currently proposes nine mostly duplicate phrases in broad match, including price/cost terms. Do not use `Применить все`. The owner explicitly prefers action-oriented searches over users who are only comparing prices.

## Conversion tracking

Primary bidding conversion:

- Successful lead-form submission sent directly from the website to Google Ads.
- Active destination: `AW-17993328154/PGLNCIr3xM4cEJrM8YND`.
- Conversion name in Ads: `Отправка формы для потенциальных клиентов (1)`.
- The duplicate Ads form conversion remains secondary and must not be restored as primary.
- The form sends enhanced-conversion user data only after successful submission.
- The form now requires email and normalizes phone numbers to E.164.
- The Ads event includes a unique `transaction_id`.

GA4 property:

- Property: `Mistrz Lazienek`
- Measurement ID: `G-P9N5CG8ZZX`
- Linked to Google Ads account `449-729-1594` on `2026-07-16`.
- Auto-tagging and personalized advertising were enabled for the link.

GA4 key events:

- `generate_lead`
- `click_phone`
- `click_email`
- `click_whatsapp`
- `click_telegram`

Planned Ads usage after synchronization:

- Keep the direct Ads form conversion primary.
- Import GA4 events as secondary for campaign, keyword, and search-term reporting.
- Keep imported `generate_lead` secondary to prevent double counting the same form submission.
- Contact clicks are analytical signals, not confirmed leads, and must not train Maximize Conversions yet.

## Website contact channels

- Phone: `+48 795 656 642`
- WhatsApp: `https://wa.me/48795656642`
- Telegram: `https://t.me/+48795656642`
- Email, phone, WhatsApp, Telegram, and form interactions emit GA4 events.

## Next checks

1. Wait for Google Ads/GA4 link synchronization, then import the five GA4 key events as secondary conversions.
2. Re-check the two new keywords after review and confirm whether `Мало запросов` remains.
3. Re-check campaign diagnostics after Google processes the keyword additions; the `Аудитории` broad-match warning may persist because Google prefers its own recommendations — this is expected, do not apply it.
4. Do not change conversion code or submit more test leads solely to clear the "Нет недавних данных" warning — it clears itself once a new real lead comes in (code and CSP were verified correct on `2026-08-17`).
5. Review new search terms after enough non-AI-Max traffic accumulates; add only clearly irrelevant terms as negative keywords.
6. Evaluate primary form conversions before expanding keywords further.
