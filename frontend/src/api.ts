import type { CategoryListing, EnquiryInput, Product } from "./types.ts";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // keep fallback message
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export function fetchFeatured(): Promise<Product[]> {
  return request<{ products: Product[] }>("/api/products/featured").then(
    (body) => body.products,
  );
}

export function fetchCategories(): Promise<string[]> {
  return request<{ categories: string[] }>("/api/categories").then(
    (body) => body.categories,
  );
}

export function fetchCategory(category: string): Promise<CategoryListing> {
  return request<CategoryListing>(
    `/api/products?category=${encodeURIComponent(category)}`,
  );
}

export function searchProducts(query: string): Promise<Product[]> {
  return request<{ products: Product[] }>(
    `/api/products?q=${encodeURIComponent(query)}`,
  ).then((body) => body.products);
}

export function fetchProduct(id: number): Promise<Product> {
  return request<{ product: Product }>(`/api/products/${id}`).then(
    (body) => body.product,
  );
}

export function submitEnquiry(input: EnquiryInput): Promise<void> {
  return request("/api/enquiries", {
    method: "POST",
    body: JSON.stringify(input),
  }).then(() => undefined);
}
