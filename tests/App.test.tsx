import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import { fetchCnbDailyRates } from "@/api/cnb";
import { shouldRefetchRates } from "@/util/refetchLogic";

// Mock the API and utility functions
vi.mock("@/api/cnb");
vi.mock("@/util/refetchLogic");

const mockFetchCnbDailyRates = vi.mocked(fetchCnbDailyRates);
const mockShouldRefetchRates = vi.mocked(shouldRefetchRates);

// Mock CNB data response
const mockCnbData = {
    date: "26 Sep 2025",
    sequence: 188,
    rates: [
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
            rate: 3.890,
        },
    ],
};

const renderApp = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disable retries for tests
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
};

describe("App", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockShouldRefetchRates.mockReturnValue(false);
    });

    it("renders header and logo", async () => {
        mockFetchCnbDailyRates.mockResolvedValue(mockCnbData);

        renderApp();

        expect(screen.getByText("Czech the Crown")).toBeInTheDocument();
        expect(screen.getByRole("img", { name: /logo/i })).toBeInTheDocument();
    });

    it("shows loading state while fetching data", () => {
        mockFetchCnbDailyRates.mockImplementation(() =>
            new Promise(() => { }) // Never resolves
        );

        renderApp();

        expect(screen.getByText("Loading latest CNB exchange rates…")).toBeInTheDocument();
    });

    it("renders converter and rates when data loads successfully", async () => {
        mockFetchCnbDailyRates.mockResolvedValue(mockCnbData);

        renderApp();

        await waitFor(() => {
            // Check for converter by its characteristic elements
            expect(screen.getByLabelText(/enter amount to convert/i)).toBeInTheDocument();
            expect(screen.getByText("Exchange Rates")).toBeInTheDocument();
        });

        // Verify data is passed to components
        expect(screen.getByText(/Australia.*dollar/)).toBeInTheDocument();
        expect(screen.getByText(/Brazil.*real/)).toBeInTheDocument();
    });

    it("shows error state with retry button when fetch fails", async () => {
        const errorMessage = "Network error";
        mockFetchCnbDailyRates.mockRejectedValue(new Error(errorMessage));

        renderApp();

        await waitFor(() => {
            expect(screen.getByRole("alert")).toBeInTheDocument();
            expect(screen.getByText(/Failed to load.*Network error/)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
        });
    });

    it("retries fetch when retry button is clicked", async () => {
        const errorMessage = "Network error";
        mockFetchCnbDailyRates
            .mockRejectedValueOnce(new Error(errorMessage))
            .mockResolvedValueOnce(mockCnbData);

        renderApp();

        // Wait for error state
        await waitFor(() => {
            expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
        });

        // Click retry
        fireEvent.click(screen.getByRole("button", { name: /retry/i }));

        // Should eventually show success state
        await waitFor(() => {
            expect(screen.getByLabelText(/enter amount to convert/i)).toBeInTheDocument();
            expect(screen.getByText("Exchange Rates")).toBeInTheDocument();
        });

        expect(mockFetchCnbDailyRates).toHaveBeenCalledTimes(2);
    });

    it("integrates with shouldRefetchRates configuration", async () => {
        mockFetchCnbDailyRates.mockResolvedValue(mockCnbData);

        renderApp();

        await waitFor(() => {
            expect(screen.getByLabelText(/enter amount to convert/i)).toBeInTheDocument();
        });

        // Verify the query is configured correctly by checking that the data loads
        // The shouldRefetchRates function is used in refetchOnWindowFocus callback
        // which is harder to test without simulating window focus events
        expect(screen.getByText(/Australia.*dollar/)).toBeInTheDocument();
        expect(mockFetchCnbDailyRates).toHaveBeenCalledTimes(1);
    });
});