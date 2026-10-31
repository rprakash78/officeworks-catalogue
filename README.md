# Product catalogue PoC

Take-home for the Officeworks AI-Native Engineer role: a product catalogue that customers can browse, search, and enquire about. Product data comes from the [Fake Store API](https://fakestoreapi.com/), always via this repo’s backend.

## Stack choice

| Layer | Choice | Why |
| --- | --- | --- |
| Client | React + TypeScript (Vite) | Preferred in the brief, fast to review in a browser, easy to swap styling later. |
| Backend | Node.js + TypeScript (Express) | Same language as the client. Product source and mailer sit behind interfaces so Fake Store / Mailpit can be replaced without rewriting routes. |

Mobile was not chosen because a reviewer can exercise the full web path in under 10 minutes without an emulator.

## Run locally (recommended)

Needs Docker Desktop.

```bash
docker compose up --build
```

Then open:

- Catalogue: http://localhost:8080
- API health: http://localhost:3001/api/health
- Enquiry inbox (Mailpit): http://localhost:8025

Submit an enquiry from a product page and the message appears in Mailpit. No paid email account is required.

## Run without Docker

Use two terminals. Copy `.env.example` values as needed.

```bash
# terminal 1 — optional local SMTP inbox
docker run --rm -p 8025:8025 -p 1025:1025 axllent/mailpit:v1.21

# terminal 2
cd backend
npm install
cp ../.env.example .env   # optional; defaults match .env.example
npm run dev

# terminal 3
cd frontend
npm install
npm run dev
```

Frontend dev server: http://localhost:5173 (proxies `/api` to the backend).

## Configuration

See [`.env.example`](.env.example). Nothing in this repo is a real secret; SMTP points at local Mailpit.

| Variable | Purpose |
| --- | --- |
| `FAKE_STORE_API_URL` | Product data source |
| `SMTP_HOST` / `SMTP_PORT` | Enquiry delivery |
| `SALES_INBOX` | Where enquiries are sent |
| `CORS_ORIGIN` | Allowed browser origins (comma-separated) |

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Docs for reviewers

- [DECISIONS.md](DECISIONS.md) — assumptions, cuts, and how this grows past the PoC
- [AI_USAGE.md](AI_USAGE.md) — tools, prompts, and review notes

## Time spent

About **3 hours**, split roughly:

- Planning and brief interpretation: 30 minutes
- Building: 1 hour 45 minutes
- Testing and local verification: 30 minutes
- Reviewing generated code and writing docs: 15 minutes
