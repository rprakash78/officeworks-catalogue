# AI usage

## Tools and models

- **Cursor** (Agent) for planning, scaffolding, implementation, tests, and docs.
- Model used for the build: Cursor Grok 4.6. A later pass used the same agent to fix the product cards.
- Fake Store API shape came from public API usage, not a separate research agent.

## Agent instruction files

None were added. `AGENTS.md` and Cursor rules would have been extra process for a two-service PoC.

## Plan

React + Express in TypeScript, Docker Compose + Mailpit, ranking and search in a domain service, Fake Store behind `ProductSource`, email behind `Mailer`, tests on the critical path, then a public GitHub repository.

## Prompts that shaped the work

1. **Stack.** Build a product catalogue customers can browse, search, and enquire about. Use React and Node so one Compose command runs the web app, API, and a local mail inbox.
2. **Replaceable data and email.** Put ranking and search in a domain service. Keep Fake Store behind `ProductSource` and SMTP behind `Mailer`, so neither is called from React.
3. **Local email.** Use Mailpit and Nodemailer. Do not depend on a hosted email account.
4. **Tests.** Cover featured ranking, search, enquiry validation, the mailer call, and the home, search, and enquire screens.
5. **Card alignment.** After using the category page, I told the agent the product name, price, and rating were not aligned, and asked it to line them up.

## Where I found a problem and asked for a fix

**Product cards did not line up.** On the men’s clothing grid, short titles such as “Mens Cotton Jacket” stayed on one line, while “Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops” wrapped to three. The price and the rating then started lower on the longer cards, and the rating on the longest card sat near the bottom edge.

I asked the agent to align the name, price, and rating in that order. It kept a three-line block for every title, clamped longer names with an ellipsis, and removed the default paragraph margins inside the card. Prices and ratings now share the same row. The full title is still on the product page and on hover.

Other generated output I checked and sent back:

- **Install landed in the repo root.** The first `npm install` created a root `package.json` and `node_modules`. I had those removed and the installs redone in `backend/` and `frontend/`.
- **Search crashed.** The first search bar used React Router `<Form>` inside `BrowserRouter`, which is not a data router. The page threw `useSubmit must be used within a data router`. I asked for a native GET form instead.
- **The UI was still the Vite starter.** After an interrupted write, `App.tsx` was the default counter page. I asked the agent to finish the catalogue screens rather than restart the project.
