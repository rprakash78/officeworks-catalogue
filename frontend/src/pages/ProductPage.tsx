import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct } from "../api.ts";
import type { Product } from "../types.ts";

export function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setError("Invalid product");
      return;
    }
    fetchProduct(productId)
      .then(setProduct)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load product");
      });
  }, [productId]);

  if (error) return <p className="banner error">{error}</p>;
  if (!product) return <p className="muted">Loading product…</p>;

  return (
    <article className="product-detail">
      <img src={product.image} alt="" />
      <div>
        <p className="eyebrow">
          <Link to={`/category/${encodeURIComponent(product.category)}`}>
            {product.category}
          </Link>
        </p>
        <h1>{product.title}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">
          {product.rating.rate.toFixed(1)} / 5 ({product.rating.count} reviews)
        </p>
        <p>{product.description}</p>
        <p>
          <Link className="button" to={`/products/${product.id}/enquire`}>
            Enquire
          </Link>
        </p>
      </div>
    </article>
  );
}
