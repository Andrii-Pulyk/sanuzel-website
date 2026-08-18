# Google Ads campaign status

Last updated: `2026-08-18`, Europe/Warsaw

## Mandatory rules

- Do not enable AI Max for `Leads-Search-1` without explicit approval from the account owner.
- Do not apply Google's keyword recommendations automatically.
- Do not use broad-match keywords while the budget is `30 PLN/day` and reliable conversion data is limited.
- Add keywords manually using exact or phrase match only.
- Keep form submission as the only primary conversion used for bidding.
- Keep contact clicks secondary unless their lead quality is proven.

## Spend — always report BOTH windows, never one alone

The Google Ads UI's "Обзор" page shows one global date range for the whole page (default is often "Last 7 days" or "Last 30 days"). The owner was repeatedly seeing a **weekly** snapshot (~26 clicks, ~200-230 PLN) and mistook it for the **campaign's total cost since launch** — an easy mistake since the weekly figure is fairly stable week to week. To avoid repeating this confusion, every time spend is checked or reported, state both:

- **This week's spend** (rolling 7 days) — the "how's it doing right now" number.
- **Total spend since the campaign launched in July 2026** — the "how much have we actually spent" number, checked via Обзор → date range → "Все время" for `campaignId=24024974764` specifically (not the account-wide billing page, which mixes in other campaigns/months).

As of `2026-08-18`: last-7-days ≈ 26 clicks / ~200-230 PLN; **all-time total for Leads-Search-1 ≈ 1,210 PLN** (roughly July 659.54 PLN + August-to-date 569.90 PLN, per account billing by calendar month). There is no way to pin both numbers side-by-side natively in the Google Ads UI — its per-page date range is global, and "custom views" only add/remove/reorder cards, not per-card date ranges — so this has to be carried manually here instead.

## Account and campaign

The Google Ads account (`449-729-1594`) has **3 campaigns** — do not confuse them:

- **`Leads-Search-1`** (`campaignId=24024974764`) — the bathroom-renovation lead-gen campaign this whole document tracks. Launched July 2026. Search, Maximize Conversions, `30.00 PLN/day`, ad group `Группа объявлений 1`.
- **`App-1`** — a separate app-install campaign, **paused**. Its spend (March ~593.47 PLN, April ~-0.78 PLN net cost) shows up in the account-wide billing page by calendar month but has nothing to do with `Leads-Search-1`. May-June 2026 had 0 spend account-wide (gap between App-1 pausing and Leads-Search-1 launching).
- **`PL-Search-Warszawa-Core`** (`campaignId=24147958046`) — a new, separate Search campaign, launched `2026-08-17`, `15.00 PLN/day`, bid strategy "Максимальное количество кликов" (Maximize Clicks). Only 1 click / 1.93 PLN spent so far. Not yet documented/reviewed here — owner should clarify its purpose before it scales up.

### `Leads-Search-1` details

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

## Broad-match keyword found in the ad group (2026-08-18) — needs owner decision

While reviewing the search terms report, found that the keyword `kompleksowy remont łazienki warszawa` is live with **broad match** (no brackets/quotes) in `Группа объявлений 1`, alongside its correctly exact-matched sibling `[kompleksowy remont łazienki warszawa]`. This directly violates the mandatory rule above ("Do not use broad-match keywords while the budget is 30 PLN/day").

Over the last 30 days (`2026-07-19`–`2026-08-17`) this single broad keyword accounted for:
- `75` clicks, `705` impressions, `605.61 PLN` spend — **62% of the campaign's total 30-day cost (974.04 PLN)**.
- `0` conversions.

It is the source of nearly all the loosely-related search terms surfaced in the search terms report, including explicit budget-seeking and small-job queries: `tani remont warszawa`, `remont łazienki za 200 zł`, `castorama remont łazienki`, `glazurnik warszawa`, `remont łazienki bez skuwania/kucia płytek`, plus generic off-topic queries (`remont mieszkania warszawa`, `usługi remontowe warszawa`, `ремонт варшава`/`ремонт квартир варшава`).

**Resolved (2026-08-18)**: owner approved pausing it. Paused the broad-match keyword `kompleksowy remont łazienki warszawa` (Widoczne without brackets) in `Группа объявлений 1`. All-time stats at pause: 79 clicks, 787 impressions, 622.14 PLN spend, 0 conversions. The exact-match duplicate `[kompleksowy remont łazienki warszawa]` (3 clicks, 39.60 PLN, all-time) remains enabled and continues covering that exact query. Nothing else in the ad group was touched. Worth checking search-terms volume/quality again after ~2 weeks to confirm the tighter targeting holds up and the weekly click volume doesn't collapse.

**Post-pause keyword review (2026-08-18)**: with the broad-match keyword paused, the remaining 14 active keywords are all tight exact/phrase variants of the same core intent (comprehensive/quality bathroom renovation "pod klucz" in Warsaw) — no off-topic or budget-signal terms remain at the keyword level. Three of them (`[firma do remontu łazienki warszawa]`, `"firma remont łazienki warszawa"`, `"generalny remont łazienki warszawa"`) are currently `Не допущено: Мало запросов` (no volume yet), not junk. The negative keyword list from earlier is now mostly a safety net rather than an active necessity, since exact/phrase match doesn't expand to unrelated topics the way broad match did.

**Conversion attribution note (2026-08-18)**: the one Google-Ads-tracked conversion is attributed to `[wykończenie łazienki warszawa]` (all-time: 8 clicks, 106.86 PLN, 1 conversion). The other known real lead — Artiom (`2026-07-14`) — was confirmed by the owner to be **organic**, not paid: he told the owner directly he found the site by googling "remont łazienki Warszawa" and clicked an organic result, not the ad. This explains why only one of the two real leads shows up as an Ads conversion — the other simply wasn't a paid click.

## Negative keywords added (2026-08-18)

Added at campaign level (`Leads-Search-1`), broad match, based on the 30-day search terms report — targeting price-sensitive and small/partial-job search intent per owner's request to reduce budget-conscious leads and shift toward higher-standard clients:

`tani`, `tania`, `taniej`, `najtaniej`, `tanio`, `naprawa`, `poprawki`, `drobne`, `wymiana`, `awaria`, `skuwania`, `kucia`, `castorama`, `leroy merlin`, `mikrocement`

Evidenced in the report before blocking: `tani remont warszawa` (1 click, 24.55 PLN), `remont łazienki za 200 zł` (1 click, 5.38 PLN), `wymiana płytek w łazience` (1 click, 10.99 PLN), `castorama remont łazienki` (1 click, 2.97 PLN), `remont łazienki bez skuwania/kucia płytek` (0 clicks, preventive), `leroy merlin usługi remontowe` / `mikrocement w lazience` (0 clicks, preventive).

Deliberately did NOT add `glazurnik` (tiler) as a negative — owner's call: someone searching directly for a tiler may be a serious buyer willing to pay for quality, not necessarily a budget-seeker, so this term should stay open.

Deliberately did NOT add `cena`/`koszt`/`ile kosztuje` as negatives — general price research before choosing a contractor is normal buying behavior, not necessarily a signal of a budget-seeking client; blocking it would cut too much legitimate demand. Also did not touch any pricing shown on the site or in ads — owner explicitly wants prices left alone for now.

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

**Done (2026-08-18)**: imported all 5 GA4 key events as secondary conversion actions in Google Ads. Path used: Google Analytics (GA4) property "Mistrz Lazienek" → Реклама → Инструменты → Управление конверсиями (Conversions, Beta) → Создать действие-конверсию → selected the Google Ads account `449-729-1594` → checked `generate_lead`, `click_phone`, `click_email`, `click_whatsapp`, `click_telegram` → Save. (The classic Google Ads-side "+new conversion action → Import → GA4" flow no longer exists in this account's UI; GA4's own "Conversions" tool is now the only way to push key events into Ads as conversion actions.) Also enabled "Импортировать показатели приложения и сайта" (import app/web metrics) on the GA4 link in Ads' Data Manager, which was previously off — harmless account-wide metrics sharing, not what actually creates the conversion actions.

Result — 3 new conversion actions appeared in Ads, all source "Веб-сайт (Google Аналитика (GA4))", all status "Дополнительный" (secondary, does not affect Maximize Conversions bidding):
- `Mistrz Lazienek (web) generate_lead` — grouped under "Отправка лид-формы"
- `Mistrz Lazienek (web) click_phone` — grouped under "Потенциальный клиент, привлеченный по телефону"
- `Mistrz Lazienek (web) click_email`, `click_whatsapp`, `click_telegram` — grouped together under "Контакт"

All 5 show "Нет недавних конверсий" (no data yet) since import only applies going forward — no retroactive backfill, and as noted above, session-level keyword attribution on these events is unreliable since GA4 `session_google_ads_query` was `(not set)` for essentially all sessions checked. Re-check conversion counts after a week or two of traffic.

## Website contact channels

- Phone: `+48 795 656 642`
- WhatsApp: `https://wa.me/48795656642`
- Telegram: `https://t.me/+48795656642`
- Email, phone, WhatsApp, Telegram, and form interactions emit GA4 events.

## Premium messaging pass — dropped "free measurement" and "fixed quote" framing (2026-08-18)

Owner's call: "Bezpłatny pomiar" (free measurement) and "Stały kosztorys" (fixed quote) read as budget-signals and the "fixed price" claim is misleading in practice (final cost usually grows once additional work is found on-site). Replaced with quality/detail framing across both the site and the live ad.

**Site** (`src/i18n/pl.json` and `src/i18n/ru.json`, rebuilt via `npm run build`): every occurrence of "Bezpłatny pomiar" / "Бесплатный замер" as a headline/badge/CTA hook was replaced with "Wysoki standard wykończenia" / "Высокий стандарт отделки". Every occurrence of "Stały kosztorys" / "Фиксированная смета" (and "cena się nie zmienia" / "цена не меняется") was replaced with "Szczegółowy kosztorys" / "Детальная смета" framing (itemized, priced stage-by-stage — not a promise the total can't change). The literal free-visit fact was dropped even from the process-step description (`process_1_desc`), not just from hero/trust/CTA copy.

**Ad** (`Leads-Search-1` → `Группа объявлений 1`, the single RSA, via Объявления → Изменить объявления → Найти и заменить, scoped per-field to stay under the 30/90-char limits):
- Headline "Bezpłatny pomiar" → "Wysoki standard wykończenia"
- Description "Bezpłatny pomiar i jasny zakres prac." → "Dbamy o każdy detal i jasny zakres prac."
- Headline "Stały kosztorys i umowa" → "Szczegółowy kosztorys" (dropped "i umowa" — no character budget left; "Umowa" is still covered by "Umowa i 2 lata gwarancji" elsewhere on the site, but check whether another headline asset in this RSA also states it — there are 9 more headlines beyond the two edited, not individually reviewed here)
- Description "Stały kosztorys, umowa i 2 lata gwarancji." → "Szczegółowy kosztorys i 2 lata gwarancji." (same reason)

New ad version status after editing: `Запланировано` (pending Google's review) — re-check in a day that it goes to `Допущено` and isn't rejected on any policy ground.

## Next checks

1. ~~Wait for Google Ads/GA4 link synchronization, then import the five GA4 key events as secondary conversions.~~ Done 2026-08-18 — see Conversion tracking section above.
2. Re-check the two new keywords after review and confirm whether `Мало запросов` remains.
3. Re-check campaign diagnostics after Google processes the keyword additions; the `Аудитории` broad-match warning may persist because Google prefers its own recommendations — this is expected, do not apply it.
4. Do not change conversion code or submit more test leads solely to clear the "Нет недавних данных" warning — it clears itself once a new real lead comes in (code and CSP were verified correct on `2026-08-17`).
5. Review new search terms after enough non-AI-Max traffic accumulates; add only clearly irrelevant terms as negative keywords.
6. Evaluate primary form conversions before expanding keywords further.
7. After a week or two, check whether the 5 new GA4 secondary conversion actions (`generate_lead`, `click_phone`, `click_email`, `click_whatsapp`, `click_telegram`) are recording any data in Ads.
