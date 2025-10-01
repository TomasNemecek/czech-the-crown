import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RateRow } from "@/components/ratesList/RateRow";
import type { CnbRate } from "@/types/CnbDailyRates";

const audRate: CnbRate = {
    country: "Australia",
    currency: "dollar",
    amount: 1,
    code: "AUD",
    rate: 13.604,
};

describe("RateRow", () => {
    it("renders basic rate information", () => {
        render(<RateRow rate={audRate} />);

        expect(screen.getByText("AUD")).toBeInTheDocument();
        expect(screen.getByText("Australia dollar")).toBeInTheDocument();
        expect(screen.getByText("13,604 CZK")).toBeInTheDocument();
        expect(screen.getByText("per 1 AUD")).toBeInTheDocument();
    });

    it("calculates rates correctly for different amounts and formats numbers", () => {
        const testCases = [
            { rate: 13.604, amount: 1, code: "AUD", expected: "13,604", country: "Australia", currency: "dollar" },
            { rate: 3.890, amount: 1, code: "BRL", expected: "3,89", country: "Brazil", currency: "real" },
            { rate: 14.941, amount: 1, code: "CAD", expected: "14,941", country: "Canada", currency: "dollar" },
            { rate: 15.789, amount: 100, code: "JPY", expected: "0,158", country: "Japan", currency: "yen" }, // Multi-amount
            { rate: 1234.567, amount: 1, code: "TST", expected: "1 234,567", country: "Test", currency: "test" }, // Locale formatting
            { rate: 25.0, amount: 1, code: "TST", expected: "25", country: "Test", currency: "test" }, // Whole numbers
        ];

        testCases.forEach(({ rate, amount, code, expected, country, currency }) => {
            const testRate: CnbRate = {
                country,
                currency,
                amount,
                code,
                rate,
            };

            const { unmount } = render(<RateRow rate={testRate} />);
            expect(screen.getByText(`${expected} CZK`)).toBeInTheDocument();
            expect(screen.getByText(`per 1 ${code}`)).toBeInTheDocument();
            unmount();
        });
    });

    describe("edge cases", () => {
        it("handles special characters and long names", () => {
            const specialRate: CnbRate = {
                country: "São Paulo & Very Long Country Name",
                currency: "real-dollar with special chars",
                amount: 1,
                code: "SPP",
                rate: 4.5,
            };

            render(<RateRow rate={specialRate} />);

            expect(screen.getByText("SPP")).toBeInTheDocument();
            expect(screen.getByText("São Paulo & Very Long Country Name real-dollar with special chars")).toBeInTheDocument();
            expect(screen.getByText("4,5 CZK")).toBeInTheDocument();
        });

        it("handles minimal data gracefully", () => {
            const minimalRate: CnbRate = {
                country: "",
                currency: "",
                amount: 1,
                code: "MIN",
                rate: 1,
            };

            render(<RateRow rate={minimalRate} />);

            expect(screen.getByText("MIN")).toBeInTheDocument();
            expect(screen.getByText("1 CZK")).toBeInTheDocument();
            expect(screen.getByText("per 1 MIN")).toBeInTheDocument();
        });
    });
});