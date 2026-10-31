import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EnquirePage } from "./EnquirePage.tsx";
import { ThankYouPage } from "./ThankYouPage.tsx";
import { products } from "../test/fixtures.ts";

vi.mock("../api.ts", () => ({
  fetchProduct: vi.fn(),
  submitEnquiry: vi.fn(),
}));

import { fetchProduct, submitEnquiry } from "../api.ts";

describe("EnquirePage", () => {
  beforeEach(() => {
    vi.mocked(fetchProduct).mockResolvedValue(products[0]);
    vi.mocked(submitEnquiry).mockResolvedValue(undefined);
  });

  it("navigates to thank you after a successful enquiry", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/products/5/enquire"]}>
        <Routes>
          <Route path="/products/:id/enquire" element={<EnquirePage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/WD Hard Drive/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Name"), "Alex Rivera");
    await user.type(screen.getByLabelText("Email"), "alex@example.com");
    await user.type(screen.getByLabelText("Message"), "Is this still available?");
    await user.click(screen.getByRole("button", { name: "Submit enquiry" }));

    expect(await screen.findByRole("heading", { name: "Thank you" })).toBeInTheDocument();
    expect(submitEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 5, email: "alex@example.com" }),
    );
  });
});
