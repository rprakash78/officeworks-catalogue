import type { Product } from "../types.js";

export interface ProductSource {
  list(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  categories(): Promise<string[]>;
}
