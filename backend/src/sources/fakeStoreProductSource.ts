import type { Product } from "../types.js";
import type { ProductSource } from "./productSource.js";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const CACHE_TTL_MS = 60_000;

export class FakeStoreProductSource implements ProductSource {
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly baseUrl: string) {}

  async list(): Promise<Product[]> {
    return this.cached("products", () => this.fetchJson<Product[]>("/products"));
  }

  async getById(id: number): Promise<Product | null> {
    const products = await this.list();
    return products.find((product) => product.id === id) ?? null;
  }

  async categories(): Promise<string[]> {
    return this.cached("categories", () =>
      this.fetchJson<string[]>("/products/categories"),
    );
  }

  private async cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const hit = this.cache.get(key) as CacheEntry<T> | undefined;
    if (hit && hit.expiresAt > Date.now()) {
      return hit.value;
    }
    const value = await loader();
    this.cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
    return value;
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw Object.assign(
        new Error(`Fake Store API returned ${response.status}`),
        { status: 502 },
      );
    }
    return (await response.json()) as T;
  }
}
