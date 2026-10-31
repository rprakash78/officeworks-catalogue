import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProduct, submitEnquiry } from "../api.ts";
import type { Product } from "../types.ts";

export function EnquirePage() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct(productId)
      .then(setProduct)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load product");
      });
  }, [productId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      await submitEnquiry({
        productId,
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? "") || undefined,
        message: String(form.get("message") ?? ""),
      });
      navigate(`/thank-you?product=${productId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setSubmitting(false);
    }
  }

  if (!product && !error) return <p className="muted">Loading form…</p>;

  return (
    <section className="enquire">
      <h1>Enquire</h1>
      {product ? (
        <p className="lede">
          About <Link to={`/products/${product.id}`}>{product.title}</Link>
        </p>
      ) : null}
      {error ? <p className="banner error">{error}</p> : null}
      <form onSubmit={onSubmit} className="enquire-form">
        <label>
          Name
          <input name="name" required minLength={1} maxLength={100} />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Phone <span className="muted">(optional)</span>
          <input name="phone" type="tel" minLength={5} maxLength={40} />
        </label>
        <label>
          Message
          <textarea name="message" required minLength={1} maxLength={2000} rows={5} />
        </label>
        <button type="submit" disabled={submitting || !product}>
          {submitting ? "Sending…" : "Submit enquiry"}
        </button>
      </form>
    </section>
  );
}
