import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api.ts";
import { ProductGrid } from "../components/ProductCard.tsx";
import type { Product } from "../types.ts";

export function SearchPage() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }
    setProducts(null);
    setError(null);
    searchProducts(query)
      .then(setProducts)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Search failed");
      });
  }, [query]);

  if (!query) {
    return <p className="muted">Enter a search term to find products.</p>;
  }
  if (error) return <p className="banner error">{error}</p>;
  if (!products) return <p className="muted">Searching…</p>;

  return (
    <section>
      <h1>Search results</h1>
      <p className="lede">
        Showing products whose title, description, or category matches “{query}”.
      </p>
      <ProductGrid products={products} empty="No products matched that search." />
    </section>
  );
}
