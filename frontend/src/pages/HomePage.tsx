import { useEffect, useState } from "react";
import { fetchFeatured } from "../api.ts";
import { ProductGrid } from "../components/ProductCard.tsx";
import type { Product } from "../types.ts";

export function HomePage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeatured()
      .then(setProducts)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load featured products");
      });
  }, []);

  if (error) return <p className="banner error">{error}</p>;
  if (!products) return <p className="muted">Loading featured products…</p>;

  return (
    <section>
      <h1>Top rated</h1>
      <p className="lede">
        Five products ranked by customer rating, then by number of reviews.
      </p>
      <ProductGrid products={products} empty="No featured products yet." />
    </section>
  );
}
