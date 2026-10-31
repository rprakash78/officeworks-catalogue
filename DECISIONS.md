# Decisions and assumptions

## Assumptions where the brief was unclear

**Top rated.** Fake Store products already have `rating.rate` and `rating.count`. Featured products (home and category) are sorted by rate descending, then by review count, then sliced to five. This is deterministic and does not require a CMS “chosen 5” list yet.

**Search.** A product matches if the query appears in `title`, `description`, or `category` (case-insensitive). Matching is substring, not fuzzy search.

**Enquiry.** Required fields: name, email, message. Phone is optional. Submitting sends one email to `SALES_INBOX` and shows a thank-you page. Enquiries are not persisted; the inbox *is* the record for the PoC.

**Categories.** Category names come from the Fake Store API. Links encode names so values like `men's clothing` work.

**Look and feel.** Creative work is explicitly still coming, so the UI is a plain, accessible catalogue. Branding name “Northwind Catalogue” is a placeholder.

## Requirements dropped or simplified

- **No real email provider.** Mailpit in Docker replaces SES/SendGrid so reviewers need no accounts. Swap `SmtpMailer` config (or the `Mailer` implementation) later.
- **No auth, cart, or checkout.** Out of scope for the given acceptance criteria.
- **No product CMS.** The Fake Store adapter is the catalogue. A database-backed source would implement the same `ProductSource` interface.
- **No production hosting / IaC.** AWS-compatible if added later (ECS/Fargate + SES), but the brief only requires local run. Shipping Terraform in a 2–3 hour window would have crowded out tests.
- **No mobile client.** Web covers the critical path with simpler reviewer setup.

## How this grows past the PoC

```
frontend  -->  catalogue API  -->  ProductSource (Fake Store today)
                              -->  Mailer (SMTP/Mailpit today)
```

- Replace `FakeStoreProductSource` with a Postgres/Shopify adapter; ranking and search stay in `CatalogueService`.
- Replace `SmtpMailer` with SES (or enqueue to SQS then send). The enquiry route does not know about Mailpit.
- Frontend talks only to `/api/...`, so a future app (iOS/Android) can reuse the same backend.
- Short in-memory cache (60s) is a stand-in for CDN/Redis once traffic matters.

## What I would do with another day

1. Persist enquiries and add an idempotent “sales received” status.
2. Replace Mailpit with SES in a staging AWS account, still using the `Mailer` interface.
3. Add contract tests against Fake Store response shape and a stub for when the public API is down.
4. Pagination and a proper search index once a real catalogue is larger than ~20 SKUs.
5. Visual pass once brand assets exist, without changing route or API contracts.
