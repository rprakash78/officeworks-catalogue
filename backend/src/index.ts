import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { CatalogueService } from "./domain/catalogue.js";
import { SmtpMailer } from "./mailer/smtpMailer.js";
import { FakeStoreProductSource } from "./sources/fakeStoreProductSource.js";

const config = loadConfig();
const catalogue = new CatalogueService(
  new FakeStoreProductSource(config.fakeStoreApiUrl),
);
const mailer = new SmtpMailer({
  host: config.smtpHost,
  port: config.smtpPort,
  from: config.fromEmail,
  salesInbox: config.salesInbox,
});

const app = createApp({
  catalogue,
  mailer,
  corsOrigin: config.corsOrigin,
});

app.listen(config.port, () => {
  console.log(`Catalogue API listening on http://localhost:${config.port}`);
});
