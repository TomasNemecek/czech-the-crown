import { describe, it, expect, beforeEach } from "vitest";
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

const INPUT_FIELD_NAME = "Enter amount to convert from CZK";
const SELECT_SOURCE_CURRENCY = "Select source currency";
const SELECT_TARGET_CURRENCY = "Select target currency";
const CZK_CURRENCY_LABEL = "CZK | Czech Republic koruna";
const AUD_CURRENCY_LABEL = "AUD | Australia dollar";
const SWAP_BUTTON_LABEL = "Swap source and target currencies";

describe("Converter", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    render(<Converter dailyRates={mockDailyRates} />);
  });

  it("renders initial state correctly", () => {
    //Label + Input Field is present and set to 0 CZK
    expect(screen.getByText("Amount")).toBeInTheDocument();
    const inputField = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    expect(inputField).toBeInTheDocument();
    //NumberFormat has &nbsp; as whitespace so we use regex to match for 0 CZK with any whitespace in between
    expect(inputField).toHaveDisplayValue(/0\s+CZK/);

    // Label + From Currency selector is CZK and selector is disabled
    expect(screen.getByText("From")).toBeInTheDocument();
    const fromCurrencySelect = screen.getByLabelText(SELECT_SOURCE_CURRENCY);
    expect(fromCurrencySelect).toBeInTheDocument();
    expect(fromCurrencySelect).toBeDisabled();
    expect(screen.getByText(CZK_CURRENCY_LABEL)).toBeInTheDocument();

    // Swap button is present
    expect(screen.getByLabelText(SWAP_BUTTON_LABEL)).toBeInTheDocument();

    // Label + To Currency selector is present
    expect(screen.getByText("To")).toBeInTheDocument();
    const toCurrencySelect = screen.getByLabelText(SELECT_TARGET_CURRENCY);
    expect(toCurrencySelect).toBeInTheDocument();
    expect(toCurrencySelect).toBeEnabled();
    expect(screen.getByText("Select target currency...")).toBeInTheDocument();

    // No conversion result is shown
    expect(screen.queryByText(/=/)).not.toBeInTheDocument();
    expect(screen.queryByText("Last updated on:")).not.toBeInTheDocument();
  });

  it("converts from CZK correctly", async () => {
    // Input 100 CZK
    const inputField = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    await user.type(inputField, "100");
    expect(inputField).toHaveDisplayValue(/100\s+CZK/);

    // Open and select AUD from dropdown
    const selectContainer = screen.getByLabelText(SELECT_TARGET_CURRENCY);
    await user.click(selectContainer);
    const audOption = screen.getByText(AUD_CURRENCY_LABEL);
    await user.click(audOption);

    // Check conversion result
    expect(screen.getByText("100 CZK =")).toBeInTheDocument();
    expect(screen.getByText("7,35 Australia dollar")).toBeInTheDocument();

    // Check rate info with Czech locale formatting
    const rateInfo = screen.getByLabelText("Exchange rate information");
    expect(rateInfo.textContent).toContain("0,074");
    expect(rateInfo.textContent).toContain("13,604");
  });

  it("swaps currencies correctly", async () => {
    // Input 100 CZK
    const inputField = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    await user.type(inputField, "100");
    expect(inputField).toHaveDisplayValue(/100\s+CZK/);

    // Select AUD from To dropdown
    const selectContainer = screen.getByLabelText(SELECT_TARGET_CURRENCY);
    await user.click(selectContainer);
    const audOption = screen.getByText(AUD_CURRENCY_LABEL);
    await user.click(audOption);

    // Click swap button
    const swapButton = screen.getByLabelText(SWAP_BUTTON_LABEL);
    await user.click(swapButton);

    // Input field now should be AUD and set to 100 AUD
    const inputAUD = screen.getByRole("textbox", {
      name: "Enter amount to convert from AUD",
    });
    expect(inputAUD).toBeInTheDocument();
    expect(inputAUD).toHaveDisplayValue(/100\s+AUD/);

    // Check that From selector is now enabled and To selector is disabled
    expect(screen.getByLabelText(SELECT_SOURCE_CURRENCY)).toBeEnabled();
    expect(screen.getByLabelText(SELECT_TARGET_CURRENCY)).toBeDisabled();

    // Rate info is correct
    expect(screen.getByText("100 AUD =")).toBeInTheDocument();
    expect(
      screen.getByText("1 360,40 Czech Republic koruna"),
    ).toBeInTheDocument();
  });

  it("handles invalid input (letters) correctly", async () => {
    const input = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    await user.type(input, "abc");

    expect(input).toHaveDisplayValue(/0\s+CZK/);
  });

  it("handles leading zeros correctly", async () => {
    const input = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    await user.type(input, "000123");

    expect(input).toHaveDisplayValue(/123\s+CZK/);
  });

  it("formats large numbers correctly", async () => {
    const input = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    await user.type(input, "1000000");

    expect(input).toHaveDisplayValue(/1\s+000\s+000\s+CZK/);

    const selectContainer = screen.getByLabelText(SELECT_TARGET_CURRENCY);
    await user.click(selectContainer);
    const audOption = screen.getByText(AUD_CURRENCY_LABEL);
    await user.click(audOption);

    expect(screen.getByText("1 000 000 CZK =")).toBeInTheDocument();
    expect(screen.getByText("73 507,79 Australia dollar")).toBeInTheDocument();
  });

  it("handles decimal numbers correctly", async () => {
    const input = screen.getByRole("textbox", { name: INPUT_FIELD_NAME });
    await user.type(input, "10,50");

    const selectContainer = screen.getByLabelText(SELECT_TARGET_CURRENCY);
    await user.click(selectContainer);
    const audOption = screen.getByText(AUD_CURRENCY_LABEL);
    await user.click(audOption);

    // Check if decimals are formatted correctly
    expect(screen.getByText("10,50 CZK =")).toBeInTheDocument();
    expect(screen.getByText("0,77 Australia dollar")).toBeInTheDocument();
  });
});
