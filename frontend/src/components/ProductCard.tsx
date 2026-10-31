import { Link } from "react-router-dom";
import type { Product } from "../types.ts";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img src={product.image} alt="" />
        <h3>{product.title}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="rating">
          {product.rating.rate.toFixed(1)} / 5 ({product.rating.count} reviews)
        </p>
      </Link>
    </article>
  );
}

export function ProductGrid({
  products,
  empty,
}: {
  products: Product[];
  empty: string;
}) {
  if (products.length === 0) {
    return <p className="muted">{empty}</p>;
  }
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
