import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchPage } from "./SearchPage.tsx";
import { products } from "../test/fixtures.ts";

vi.mock("../api.ts", () => ({
  searchProducts: vi.fn(),
}));

import { searchProducts } from "../api.ts";

describe("SearchPage", () => {
  beforeEach(() => {
    vi.mocked(searchProducts).mockResolvedValue(
      products.filter((product) => product.title.includes("Monitor")),
    );
  });

  it("shows only products matching the query", async () => {
    render(
      <MemoryRouter initialEntries={["/search?q=monitor"]}>
        <Routes>
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText("Acer Monitor")).toBeInTheDocument();
    expect(screen.queryByText("WD Hard Drive")).not.toBeInTheDocument();
  });
});
