import { Link, useSearchParams } from "react-router-dom";

export function ThankYouPage() {
  const [params] = useSearchParams();
  const productId = params.get("product");

  return (
    <section>
      <h1>Thank you</h1>
      <p className="lede">
        Your enquiry has been sent to the sales inbox. Someone will be in touch.
      </p>
      {productId ? (
        <p>
          <Link to={`/products/${productId}`}>Back to the product</Link>
        </p>
      ) : (
        <p>
          <Link to="/">Back to the catalogue</Link>
        </p>
      )}
    </section>
  );
}
