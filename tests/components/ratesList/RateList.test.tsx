import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RateList } from "@/components/ratesList/RateList";
import type { CnbRate } from "@/types/CnbDailyRates";

const mockRates: CnbRate[] = [
  {
    country: "Australia",
    currency: "dollar",
    amount: 1,
    code: "AUD",
    rate: 13.604,
  },
  {
    country: "Brazil",
    currency: "real",
    amount: 1,
    code: "BRL",
    rate: 3.89,
  },
  {
    country: "Bulgaria",
    currency: "lev",
    amount: 1,
    code: "BGN",
    rate: 12.439,
  },
  {
    country: "Canada",
    currency: "dollar",
    amount: 1,
    code: "CAD",
    rate: 14.941,
  },
];

// Create a large mock dataset for pagination testing
const createMockRates = (count: number): CnbRate[] => {
  return Array.from({ length: count }, (_, i) => ({
    country: `Country${i + 1}`,
    currency: `currency${i + 1}`,
    amount: 1,
    code: `C${i.toString().padStart(2, "0")}`,
    rate: 20 + i,
  }));
};

describe("RateList", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders core structure and integrates components", () => {
    render(<RateList rates={mockRates} />);

    expect(screen.getByText("Exchange Rates")).toBeInTheDocument();
    expect(screen.getByLabelText(/search currencies/i)).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: /currency exchange rates/i }),
    ).toBeInTheDocument();

    // Verify all rates are displayed
    expect(screen.getByText(/Australia.*dollar/)).toBeInTheDocument();
    expect(screen.getByText(/Brazil.*real/)).toBeInTheDocument();
    expect(screen.getByText(/Bulgaria.*lev/)).toBeInTheDocument();
    expect(screen.getByText(/Canada.*dollar/)).toBeInTheDocument();
  });

  it("integrates search functionality and filters rates", async () => {
    render(<RateList rates={mockRates} />);

    const searchInput = screen.getByLabelText(/search currencies/i);

    // Test basic filtering (SearchInput handles sanitization details)
    await user.type(searchInput, "dollar");
    expect(screen.getByText(/Australia.*dollar/)).toBeInTheDocument();
    expect(screen.getByText(/Canada.*dollar/)).toBeInTheDocument();
    expect(screen.queryByText(/Brazil.*real/)).not.toBeInTheDocument();

    // Test no matches
    await user.clear(searchInput);
    await user.type(searchInput, "nonexistent");
    expect(screen.getByText("No matches found.")).toBeInTheDocument();
  });

  describe("pagination", () => {
    it("handles pagination logic correctly", async () => {
      const manyRates = createMockRates(30);
      render(<RateList rates={manyRates} />);

      // Shows only first 25 items by default
      expect(screen.getByText("C00")).toBeInTheDocument();
      expect(screen.getByText("C24")).toBeInTheDocument();
      expect(screen.queryByText("C25")).not.toBeInTheDocument();

      // Shows 'Show all' button for more than 25 items
      expect(screen.getByText("Show all 30")).toBeInTheDocument();

      // Clicking 'Show all' reveals all items and hides button
      await user.click(screen.getByText("Show all 30"));
      expect(screen.getByText(/Country26.*currency26/)).toBeInTheDocument();
      expect(screen.getByText(/Country30.*currency30/)).toBeInTheDocument();
      expect(screen.queryByText(/Show all/)).not.toBeInTheDocument();
    });

    it("resets pagination when search filters results", async () => {
      const manyRates = createMockRates(30);
      render(<RateList rates={manyRates} />);

      expect(screen.getByText(/Show all 30/)).toBeInTheDocument();

      // Filter to fewer results
      const searchInput = screen.getByLabelText(/search currencies/i);
      await user.type(searchInput, "C01");

      expect(screen.queryByText(/Show all/)).not.toBeInTheDocument();
    });

    it("does not show pagination for small datasets", () => {
      const fewRates = createMockRates(20);
      render(<RateList rates={fewRates} />);

      expect(screen.queryByText(/Show all/)).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles empty rates and accessibility requirements", () => {
      render(<RateList rates={[]} />);

      expect(screen.getByText("Exchange Rates")).toBeInTheDocument();
      expect(
        screen.getByRole("region", { name: /exchange rates/i }),
      ).toBeInTheDocument();

      const noMatchesMessage = screen.getByText("No matches found.");
      expect(noMatchesMessage).toHaveAttribute("aria-live", "polite");
    });

    it("handles special characters in data", async () => {
      const specialRates: CnbRate[] = [
        {
          country: "São Paulo",
          currency: "real",
          amount: 1,
          code: "BRL",
          rate: 4.5,
        },
      ];

      render(<RateList rates={specialRates} />);

      const searchInput = screen.getByLabelText(/search currencies/i);
      await user.type(searchInput, "são");

      expect(screen.getByText(/São Paulo.*real/)).toBeInTheDocument();
    });
  });
});
