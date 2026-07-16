# Google Ads campaign status

Last updated: `2026-07-16`, Europe/Warsaw

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

The only actionable campaign warning visible on `2026-07-16` is:

- `Недостаточно релевантных ключевых слов`

Important interpretation:

- The detailed diagnostics show goals/conversions as completed.
- The green conversion item states that Maximize Conversions is focusing on conversions.
- The warning is a reach/keyword recommendation, not evidence that the website conversion tag is currently broken.
- Google may display this warning under the `Аудитории` tab, but its actual text still concerns insufficient relevant keywords.
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
3. Re-check campaign diagnostics after Google processes the keyword additions; the warning may persist because Google prefers its broad-match recommendations.
4. Do not change conversion code or submit more test leads solely to clear the keyword warning.
5. Review new search terms after enough non-AI-Max traffic accumulates; add only clearly irrelevant terms as negative keywords.
6. Evaluate primary form conversions before expanding keywords further.
