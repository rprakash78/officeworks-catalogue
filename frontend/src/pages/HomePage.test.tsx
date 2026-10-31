import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "./HomePage.tsx";
import { products } from "../test/fixtures.ts";

vi.mock("../api.ts", () => ({
  fetchFeatured: vi.fn(),
}));

import { fetchFeatured } from "../api.ts";

describe("HomePage", () => {
  beforeEach(() => {
    vi.mocked(fetchFeatured).mockResolvedValue(products);
  });

  it("renders five featured products", async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "Top rated" })).toBeInTheDocument();
    expect(await screen.findByText("WD Hard Drive")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(5);
  });
});
