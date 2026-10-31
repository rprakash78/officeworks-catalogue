import { useSearchParams } from "react-router-dom";

export function SearchBar() {
  const [params] = useSearchParams();
  const defaultQuery = params.get("q") ?? "";

  return (
    <form action="/search" method="get" className="search-bar" role="search">
      <label className="sr-only" htmlFor="search-term">
        Search products
      </label>
      <input
        id="search-term"
        name="q"
        type="search"
        defaultValue={defaultQuery}
        placeholder="Search products"
        required
      />
      <button type="submit">Search</button>
    </form>
  );
}
