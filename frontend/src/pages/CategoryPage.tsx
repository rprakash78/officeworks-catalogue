import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCategory } from "../api.ts";
import { ProductGrid } from "../components/ProductCard.tsx";
import type { CategoryListing } from "../types.ts";

export function CategoryPage() {
  const { name } = useParams();
  const category = decodeURIComponent(name ?? "");
  const [listing, setListing] = useState<CategoryListing | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setListing(null);
    setError(null);
    fetchCategory(category)
      .then(setListing)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load category");
      });
  }, [category]);

  if (error) return <p className="banner error">{error}</p>;
  if (!listing) return <p className="muted">Loading category…</p>;

  return (
    <section>
      <h1>{listing.category}</h1>
      <h2>Top rated in this category</h2>
      <ProductGrid products={listing.topRated} empty="No products in this category." />
      <h2>More in this category</h2>
      <ProductGrid
        products={listing.additional}
        empty="Every product in this category is already shown above."
      />
    </section>
  );
}
