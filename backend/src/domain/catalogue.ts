import type { CategoryListing, Product } from "../types.js";
import type { ProductSource } from "../sources/productSource.js";

const FEATURED_COUNT = 5;

export function rankByRating(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const rateDelta = (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
    if (rateDelta !== 0) return rateDelta;
    return (b.rating?.count ?? 0) - (a.rating?.count ?? 0);
  });
}

export function matchesSearch(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [product.title, product.description, product.category]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export class CatalogueService {
  constructor(private readonly source: ProductSource) {}

  featured(): Promise<Product[]> {
    return this.source.list().then((products) => rankByRating(products).slice(0, FEATURED_COUNT));
  }

  async byCategory(category: string): Promise<CategoryListing> {
    const products = await this.source.list();
    const inCategory = products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
    if (inCategory.length === 0) {
      throw Object.assign(new Error(`Unknown category: ${category}`), {
        status: 404,
      });
    }
    const ranked = rankByRating(inCategory);
    return {
      category: inCategory[0].category,
      topRated: ranked.slice(0, FEATURED_COUNT),
      additional: ranked.slice(FEATURED_COUNT),
    };
  }

  async search(query: string, category?: string): Promise<Product[]> {
    const products = await this.source.list();
    return products.filter((product) => {
      const inCategory = category
        ? product.category.toLowerCase() === category.toLowerCase()
        : true;
      return inCategory && matchesSearch(product, query);
    });
  }

  categories(): Promise<string[]> {
    return this.source.categories();
  }

  async getById(id: number): Promise<Product> {
    const product = await this.source.getById(id);
    if (!product) {
      throw Object.assign(new Error(`Product ${id} not found`), { status: 404 });
    }
    return product;
  }
}
