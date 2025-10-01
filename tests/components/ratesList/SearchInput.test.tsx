import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/ratesList/SearchInput";

describe("SearchInput", () => {
    const mockOnChange = vi.fn();
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        mockOnChange.mockClear();
        user = userEvent.setup();
    });

    it("renders with default placeholder", () => {
        render(<SearchInput value="" onChange={mockOnChange} />);
        expect(screen.getByPlaceholderText("Search code, currency, or country…")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
        const customPlaceholder = "Custom search placeholder";
        render(<SearchInput value="" onChange={mockOnChange} placeholder={customPlaceholder} />);
        expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
    });

    it("displays the provided value", () => {
        const testValue = "USD";
        render(<SearchInput value={testValue} onChange={mockOnChange} />);
        expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
    });

    it("calls onChange when user types", async () => {
        render(<SearchInput value="" onChange={mockOnChange} />);

        const input = screen.getByRole("textbox");
        await user.type(input, "EUR");

        expect(mockOnChange).toHaveBeenCalledTimes(3);
        expect(mockOnChange).toHaveBeenLastCalledWith("R");
    });

    it("applies sanitization to user input", async () => {
        render(<SearchInput value="" onChange={mockOnChange} />);
        const input = screen.getByRole("textbox");

        // Test that sanitization is applied (specific logic tested in utils)
        fireEvent.change(input, { target: { value: "  EUR<script>  " } });
        expect(mockOnChange).toHaveBeenLastCalledWith("EURscript");
    });

    describe("edge cases", () => {
        it("handles empty input", async () => {
            render(<SearchInput value="test" onChange={mockOnChange} />);

            const input = screen.getByRole("textbox");
            await user.clear(input);

            expect(mockOnChange).toHaveBeenLastCalledWith("");
        });

        it("limits input to maximum length", () => {
            render(<SearchInput value="" onChange={mockOnChange} />);
            const input = screen.getByRole("textbox");
            const longString = "A".repeat(60); // Longer than the 50 character limit

            fireEvent.change(input, { target: { value: longString } });
            expect(mockOnChange).toHaveBeenLastCalledWith("A".repeat(50));
        });

        it("maintains focus after input change", async () => {
            render(<SearchInput value="" onChange={mockOnChange} />);

            const input = screen.getByRole("textbox");
            await user.click(input);
            await user.type(input, "USD");

            expect(input).toHaveFocus();
        });
    });
});