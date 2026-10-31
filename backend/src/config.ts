export type AppConfig = {
  port: number;
  corsOrigin: string;
  fakeStoreApiUrl: string;
  smtpHost: string;
  smtpPort: number;
  salesInbox: string;
  fromEmail: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: Number(env.PORT ?? 3001),
    corsOrigin: env.CORS_ORIGIN ?? "http://localhost:5173",
    fakeStoreApiUrl: (env.FAKE_STORE_API_URL ?? "https://fakestoreapi.com").replace(
      /\/$/,
      "",
    ),
    smtpHost: env.SMTP_HOST ?? "localhost",
    smtpPort: Number(env.SMTP_PORT ?? 1025),
    salesInbox: env.SALES_INBOX ?? "sales@example.com",
    fromEmail: env.FROM_EMAIL ?? "catalogue@example.com",
  };
}
