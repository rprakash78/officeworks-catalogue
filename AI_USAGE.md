# AI usage

## Tools and models

- **Cursor** (Agent) for planning, scaffolding, implementation, tests, and docs.
- Model used in this session: Cursor Grok 4.6.
- Fake Store API docs/shape recalled from public API usage, not a separate research agent.

## Agent instruction files

None were added. The take-home asked for judgement and ownership of generated output; extra `AGENTS.md` / Cursor rules would have been ceremony for a two-service PoC.

## Plan / spec

The implementation followed the attached plan *Officeworks Catalogue PoC*: React + Express in TypeScript, Docker Compose + Mailpit, `ProductSource` / `Mailer` boundaries, critical-path tests, then a public GitHub PR.

## Prompts and moments that shaped the work

1. **Initial brief intake.** Parsed the PDF challenge and chose React/Node over mobile/Laravel so a reviewer can run one Compose command.
2. **Grow-beyond-PoC constraint.** Directed the agent to put ranking/search in a domain service and keep Fake Store behind `ProductSource`, rather than calling the public API from React.
3. **Email without paid accounts.** Specified Mailpit + Nodemailer instead of a hosted email API.
4. **Tests on the critical path only.** Featured ranking, search, enquiry validation + mailer call, home/search/enquire UI — not a snapshot of every component.
5. **Resume after an interrupted write.** Asked the agent to continue from the half-written backend rather than restarting the scaffold.

## Where the AI got something wrong, and how it was caught

- **Install landed in the repo root.** The first `npm install` for Express created a root `package.json` / `node_modules`. Caught by listing the workspace; those files were deleted and installs were redone in `backend/` and `frontend/`.
- **PDF text extraction.** Custom CID fonts decoded as garbage until ToUnicode CMaps were parsed per `beginbfchar` / `beginbfrange` block. Caught because the first pass could not read the brief.
- **Vite starter left in place.** After the first interruption, `App.tsx` was still the default counter page. Caught by an explicit completeness check before finishing the UI.
- Generated code was reviewed for: client never calling Fake Store; enquiry validation; no secrets in git; Docker using `/api` proxy so the browser does not depend on CORS alone in Compose.
- **React Router `Form` crashed the UI.** The first search bar used `<Form>` from `react-router-dom` inside `BrowserRouter`, which is not a data router. Caught in the browser (`useSubmit must be used within a data router`); replaced with a native GET form.
