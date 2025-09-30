import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Converter } from "@/components/converter/Converter";
import type { CnbDailyRates } from "@/types/CnbDailyRates";
import userEvent from "@testing-library/user-event";

const mockDailyRates: CnbDailyRates = {
  date: "29 Sep 2025",
  sequence: 189,
  rates: [
    {
      country: "Australia",
      currency: "dollar",
      amount: 1,
      code: "AUD",
      rate: 13.604,
    },
    {
      country: "USA",
      currency: "dolla",
      amount: 1,
      code: "USD",
      rate: 20.727,
    },
  ],
};

describe("Converter", () => {
  it("renders initial state correctly", () => {
    render(<Converter dailyRates={mockDailyRates} />);

    //Label + Input Field is present and set to 0 CZK
    expect(screen.getByText("Amount")).toBeInTheDocument();
    const inputField = screen.getByRole("textbox", { name: "Amount in CZK" });
    expect(inputField).toBeInTheDocument();
    //NumberFormat has &nbsp; as whitespace so we use regex to match for 0 CZK with any whitespace in between
    expect(inputField).toHaveDisplayValue(/0\s+CZK/);

    // Label + From Currency selector is CZK and selector is disabled
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByLabelText("From currency")).toBeInTheDocument();
    expect(screen.getByLabelText("From currency")).toBeDisabled();
    expect(screen.getByText("CZK | Czech Republic koruna")).toBeInTheDocument();

    // Swap button is present
    expect(screen.getByLabelText("Swap currencies")).toBeInTheDocument();

    // Label + To Currency selector is present
    expect(screen.getByText("To")).toBeInTheDocument();
    expect(screen.getByLabelText("To currency")).toBeInTheDocument();
    expect(screen.getByLabelText("To currency")).toBeEnabled();
    expect(screen.getByText("Select target currency...")).toBeInTheDocument();

    // No conversion result is shown
    expect(screen.queryByText(/=/)).not.toBeInTheDocument();
    expect(screen.queryByText("Last updated on:")).not.toBeInTheDocument();
  });

  it("converts from CZK correctly", async () => {
    const user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);

    // Input 100 CZK
    const input = screen.getByRole("textbox", { name: "Amount in CZK" });
    await user.type(input, "100");

    // Open and select AUD from dropdown
    const selectContainer = screen.getByLabelText("To currency");
    await user.click(selectContainer);
    const audOption = screen.getByText("AUD | Australia dollar");
    await user.click(audOption);

    // Check conversion result
    expect(screen.getByText("100 CZK =")).toBeInTheDocument();
    expect(screen.getByText("7,35 Australia dollar")).toBeInTheDocument();
    expect(
      screen.getByText(/1\s+CZK\s+=\s+0[.,]07[0-9]*\s+AUD/),
    ).toBeInTheDocument();
  });

  it("swaps currencies correctly", async () => {
    const user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);

    // Input 100 CZK
    const input = screen.getByRole("textbox", { name: "Amount in CZK" });
    await user.type(input, "100");
    expect(input).toHaveDisplayValue(/100\s+CZK/);

    // Select AUD from To dropdown
    const selectContainer = screen.getByLabelText("To currency");
    await user.click(selectContainer);
    const audOption = screen.getByText("AUD | Australia dollar");
    await user.click(audOption);

    // Click swap button
    const swapButton = screen.getByLabelText("Swap currencies");
    await user.click(swapButton);

    // Input field now should be AUD and set to 100 AUD
    const inputAUD = screen.getByRole("textbox", { name: "Amount in AUD" });
    expect(inputAUD).toBeInTheDocument();
    expect(inputAUD).toHaveDisplayValue(/100\s+AUD/);

    // Check that From selector is now enabled and To selector is disabled
    expect(screen.getByLabelText("From currency")).toBeEnabled();
    expect(screen.getByLabelText("To currency")).toBeDisabled();

    // Rate info is correct
    expect(screen.getByText("100 AUD =")).toBeInTheDocument();
    expect(
      screen.getByText("1 360,40 Czech Republic koruna"),
    ).toBeInTheDocument();
  });

  it("handles invalid input (letters) correctly", async () => {
    const user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);

    const input = screen.getByRole("textbox", { name: "Amount in CZK" });
    await user.type(input, "abc");

    expect(input).toHaveDisplayValue(/0\s+CZK/);
  });

  it("handles leading zeros correctly", async () => {
    const user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);

    const input = screen.getByRole("textbox", { name: "Amount in CZK" });
    await user.type(input, "000123");

    expect(input).toHaveDisplayValue(/123\s+CZK/);
  });

  it("formats large numbers correctly", async () => {
    const user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);

    const input = screen.getByRole("textbox", { name: "Amount in CZK" });
    await user.type(input, "1000000");

    expect(input).toHaveDisplayValue(/1\s+000\s+000\s+CZK/);

    const selectContainer = screen.getByLabelText("To currency");
    await user.click(selectContainer);
    const audOption = screen.getByText("AUD | Australia dollar");
    await user.click(audOption);

    expect(screen.getByText("1 000 000 CZK =")).toBeInTheDocument();
    expect(screen.getByText("73 507,79 Australia dollar")).toBeInTheDocument();
  });

  it("handles decimal numbers correctly", async () => {
    const user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);

    const input = screen.getByRole("textbox", { name: "Amount in CZK" });
    await user.type(input, "10,50");

    const selectContainer = screen.getByLabelText("To currency");
    await user.click(selectContainer);
    const audOption = screen.getByText("AUD | Australia dollar");
    await user.click(audOption);

    // Check if decimals are formatted correctly
    expect(screen.getByText("10,50 CZK =")).toBeInTheDocument();
    expect(screen.getByText("0,77 Australia dollar")).toBeInTheDocument();
  });
});
