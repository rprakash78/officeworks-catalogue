import { describe, expect, it } from "vitest";
import {
  matchesSearch,
  rankByRating,
  CatalogueService,
} from "../src/domain/catalogue.js";
import { MemoryProductSource, sampleProducts } from "./helpers.js";

describe("rankByRating", () => {
  it("sorts by rate then review count", () => {
    const ranked = rankByRating(sampleProducts);
    expect(ranked.slice(0, 3).map((product) => product.id)).toEqual([5, 6, 3]);
  });
});

describe("matchesSearch", () => {
  it("matches title, description, and category", () => {
    const backpack = sampleProducts[0];
    expect(matchesSearch(backpack, "BACKPACK")).toBe(true);
    expect(matchesSearch(backpack, "laptops")).toBe(true);
    expect(matchesSearch(backpack, "men's")).toBe(true);
    expect(matchesSearch(backpack, "monitor")).toBe(false);
  });
});

describe("CatalogueService", () => {
  const catalogue = new CatalogueService(new MemoryProductSource());

  it("returns five featured products", async () => {
    const featured = await catalogue.featured();
    expect(featured).toHaveLength(5);
    expect(featured[0].id).toBe(5);
  });

  it("splits a category into top rated and additional", async () => {
    const listing = await catalogue.byCategory("electronics");
    expect(listing.topRated.map((product) => product.id)).toEqual([5, 6, 7]);
    expect(listing.additional).toEqual([]);
  });

  it("searches across product text", async () => {
    const results = await catalogue.search("monitor");
    expect(results.map((product) => product.id).sort()).toEqual([6, 7]);
  });
});
