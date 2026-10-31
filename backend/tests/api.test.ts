import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import { CatalogueService } from "../src/domain/catalogue.js";
import type { Mailer } from "../src/mailer/mailer.js";
import { MemoryProductSource } from "./helpers.js";

function buildApp(mailer: Mailer = { sendEnquiry: vi.fn().mockResolvedValue(undefined) }) {
  return {
    app: createApp({
      catalogue: new CatalogueService(new MemoryProductSource()),
      mailer,
      corsOrigin: "http://localhost:5173",
    }),
    mailer,
  };
}

describe("API", () => {
  it("returns featured products", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products/featured");
    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(5);
  });

  it("returns category listings", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products?category=jewelery");
    expect(response.status).toBe(200);
    expect(response.body.topRated.map((p: { id: number }) => p.id)).toEqual([3, 4]);
    expect(response.body.additional).toEqual([]);
  });

  it("filters search results", async () => {
    const { app } = buildApp();
    const response = await request(app).get("/api/products?q=monitor");
    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(2);
  });

  it("rejects invalid enquiries", async () => {
    const { app } = buildApp();
    const response = await request(app).post("/api/enquiries").send({
      productId: 5,
      name: "",
      email: "not-an-email",
      message: "I want this",
    });
    expect(response.status).toBe(400);
  });

  it("sends an enquiry email for a valid product", async () => {
    const sendEnquiry = vi.fn().mockResolvedValue(undefined);
    const { app } = buildApp({ sendEnquiry });
    const response = await request(app).post("/api/enquiries").send({
      productId: 5,
      name: "Alex Rivera",
      email: "alex@example.com",
      phone: "0400000000",
      message: "Do you have this in stock next week?",
    });
    expect(response.status).toBe(201);
    expect(sendEnquiry).toHaveBeenCalledOnce();
    expect(sendEnquiry.mock.calls[0][0].email).toBe("alex@example.com");
    expect(sendEnquiry.mock.calls[0][1].id).toBe(5);
  });
});
