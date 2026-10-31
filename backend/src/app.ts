import cors from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { parseEnquiry } from "./domain/enquiry.js";
import type { CatalogueService } from "./domain/catalogue.js";
import { errorMessage, errorStatus } from "./http.js";
import type { Mailer } from "./mailer/mailer.js";

export type AppDeps = {
  catalogue: CatalogueService;
  mailer: Mailer;
  corsOrigin: string;
};

export function createApp(deps: AppDeps) {
  const app = express();
  app.use(cors({ origin: deps.corsOrigin.split(",").map((origin) => origin.trim()) }));
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/categories", async (_req, res, next) => {
    try {
      res.json({ categories: await deps.catalogue.categories() });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/products/featured", async (_req, res, next) => {
    try {
      res.json({ products: await deps.catalogue.featured() });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/products", async (req, res, next) => {
    try {
      const query = typeof req.query.q === "string" ? req.query.q : "";
      const category =
        typeof req.query.category === "string" ? req.query.category : undefined;

      if (query.trim()) {
        res.json({ products: await deps.catalogue.search(query, category) });
        return;
      }
      if (category) {
        res.json(await deps.catalogue.byCategory(category));
        return;
      }
      res.status(400).json({
        error: "Provide q for search or category for a category listing",
      });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: "id must be a positive integer" });
        return;
      }
      res.json({ product: await deps.catalogue.getById(id) });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/enquiries", async (req, res, next) => {
    try {
      const enquiry = parseEnquiry(req.body);
      const product = await deps.catalogue.getById(enquiry.productId);
      await deps.mailer.sendEnquiry(enquiry, product);
      res.status(201).json({ ok: true });
    } catch (err) {
      next(err);
    }
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = errorStatus(err);
    if (status >= 500) {
      console.error(err);
    }
    res.status(status).json({ error: errorMessage(err) });
  });

  return app;
}
