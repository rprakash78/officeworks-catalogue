# Decisions and assumptions

## Assumptions

**Top rated.** Fake Store products already have `rating.rate` and `rating.count`. Featured products (home and category) are sorted by rate descending, then by review count, then sliced to five. This is deterministic and does not require a CMS “chosen 5” list yet.

**Search.** A product matches if the query appears in `title`, `description`, or `category` (case-insensitive). Matching is substring, not fuzzy search.

**Enquiry.** Required fields: name, email, message. Phone is optional. Submitting sends one email to `SALES_INBOX` and shows a thank-you page. Enquiries are not persisted; the inbox is the record for the PoC.

**Categories.** Category names come from the Fake Store API. Links encode names so values like `men's clothing` work.

**Look and feel.** The UI is a plain, accessible catalogue until brand assets exist. The name “Northwind Catalogue” is a placeholder.

**Card text.** On the category grid, product names wrapped to different heights, so the price and rating on each card sat on a different line. I asked for name, price, and rating to line up across the row. Each title now keeps a three-line block (longer names end with an ellipsis), and the price and rating sit under that block with no extra paragraph margin.

## Left out of this pass

- **No real email provider.** Mailpit in Docker replaces SES/SendGrid so the app runs locally without creating an account. Swap `SmtpMailer` config (or the `Mailer` implementation) later.
- **No auth, cart, or checkout.** Customers browse, search, and enquire. Purchasing is a later step.
- **No product CMS.** The Fake Store adapter is the catalogue. A database-backed source would implement the same `ProductSource` interface.
- **No production hosting.** The API can sit on AWS later (ECS/Fargate + SES). This pass only needs a local run, so there is no Terraform.
- **No mobile client.** The web app covers browse, search, and enquire without an emulator.

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
