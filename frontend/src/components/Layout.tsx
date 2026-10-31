import { Link, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchCategories } from "../api.ts";
import { SearchBar } from "./SearchBar.tsx";

export function Layout() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Failed to load categories");
      });
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-row">
          <Link to="/" className="brand">
            Northwind Catalogue
          </Link>
          <SearchBar />
        </div>
        <nav className="category-nav" aria-label="Product categories">
          <NavLink to="/" end>
            Home
          </NavLink>
          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
            >
              {category}
            </NavLink>
          ))}
        </nav>
        {loadError ? <p className="banner error">{loadError}</p> : null}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        Product data via the catalogue API. Look and feel is a PoC placeholder.
      </footer>
    </div>
  );
}
