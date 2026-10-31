import type { Product } from "../src/types.js";
import type { ProductSource } from "../src/sources/productSource.js";

export const sampleProducts: Product[] = [
  {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    description: "Everyday backpack for laptops",
    category: "men's clothing",
    image: "https://example.com/1.jpg",
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: "Slim Fit T-Shirt",
    price: 22.3,
    description: "Casual cotton t-shirt",
    category: "men's clothing",
    image: "https://example.com/2.jpg",
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: "Gold Bracelet",
    price: 695,
    description: "Elegant jewellery piece",
    category: "jewelery",
    image: "https://example.com/3.jpg",
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 4,
    title: "White Gold Ring",
    price: 168,
    description: "Princess cut ring",
    category: "jewelery",
    image: "https://example.com/4.jpg",
    rating: { rate: 4.6, count: 70 },
  },
  {
    id: 5,
    title: "WD Hard Drive",
    price: 64,
    description: "Portable external hard drive",
    category: "electronics",
    image: "https://example.com/5.jpg",
    rating: { rate: 4.8, count: 203 },
  },
  {
    id: 6,
    title: "Acer Monitor",
    price: 599,
    description: "Ultra-thin gaming monitor",
    category: "electronics",
    image: "https://example.com/6.jpg",
    rating: { rate: 4.7, count: 250 },
  },
  {
    id: 7,
    title: "Samsung Monitor",
    price: 999.99,
    description: "Curved gaming monitor",
    category: "electronics",
    image: "https://example.com/7.jpg",
    rating: { rate: 2.1, count: 140 },
  },
];

export class MemoryProductSource implements ProductSource {
  constructor(private readonly products: Product[] = sampleProducts) {}

  async list(): Promise<Product[]> {
    return this.products;
  }

  async getById(id: number): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async categories(): Promise<string[]> {
    return [...new Set(this.products.map((product) => product.category))];
  }
}
