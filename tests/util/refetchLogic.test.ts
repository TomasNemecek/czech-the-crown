import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { shouldRefetchRates } from "@/util/refetchLogic";

// Mock the current date for consistent testing
const mockDate = (dateString: string) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(dateString));
};

const restoreDate = () => {
    vi.useRealTimers();
};

describe("shouldRefetchRates", () => {
    beforeEach(() => {
        // Mock console methods to avoid noise in test output
        vi.spyOn(console, 'group').mockImplementation(() => { });
        vi.spyOn(console, 'groupEnd').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        restoreDate();
        vi.restoreAllMocks();
    });

    describe("no CNB data date is provided", () => {
        it("should refetch when cnbDataDate is undefined", () => {
            mockDate("2025-10-01T10:00:00.000Z"); // Wednesday 10:00 UTC
            expect(shouldRefetchRates(undefined)).toBe(true);
        });

        it("should refetch when cnbDataDate is empty string", () => {
            mockDate("2025-10-01T10:00:00.000Z");
            expect(shouldRefetchRates("")).toBe(true);
        });
    });

    describe("weekend behavior", () => {
        it("does not refetch on Saturday", () => {
            mockDate("2025-01-18T15:00:00.000Z"); // Saturday 15:00 UTC (16:00 Prague)
            expect(shouldRefetchRates("17 Jan 2025")).toBe(false);
        });

        it("does not refetch on Sunday", () => {
            mockDate("2025-01-19T15:00:00.000Z"); // Sunday 15:00 UTC (16:00 Prague)
            expect(shouldRefetchRates("17 Jan 2025")).toBe(false);
        });
    });

    describe("invalid date format handling", () => {
        it("should refetch when date format is invalid", () => {
            expect(shouldRefetchRates("invalid-date")).toBe(true);
        });

        it("should refetch when date is malformed", () => {
            mockDate("2025-01-15T15:00:00.000Z");
            expect(shouldRefetchRates("32 Feb 2025")).toBe(true);
        });
    });

    describe("before 14:30 Czech time behavior", () => {
        it("should not refetch at 10:00 Prague time on weekday", () => {
            mockDate("2025-01-15T09:00:00.000Z"); // Wednesday 09:00 UTC = 10:00 Prague
            expect(shouldRefetchRates("14 Jan 2025")).toBe(false);
        });

        it("should not refetch at 14:29 Prague time on weekday", () => {
            mockDate("2025-01-15T13:29:00.000Z"); // Wednesday 13:29 UTC = 14:29 Prague
            expect(shouldRefetchRates("14 Jan 2025")).toBe(false);
        });
    });

    describe("after 14:30 Czech time behavior", () => {
        it("should not refetch when we have current day's data", () => {
            mockDate("2025-01-15T14:00:00.000Z"); // Wednesday 14:00 UTC = 15:00 Prague
            expect(shouldRefetchRates("15 Jan 2025")).toBe(false);
        });

        it("should refetch when data is from previous day and it's after 14:30", () => {
            mockDate("2025-01-15T14:00:00.000Z"); // Wednesday 14:00 UTC = 15:00 Prague
            expect(shouldRefetchRates("14 Jan 2025")).toBe(true);
        });

        it("should refetch when data is from several days ago", () => {
            mockDate("2025-01-15T14:00:00.000Z"); // Wednesday 14:00 UTC = 15:00 Prague
            expect(shouldRefetchRates("10 Jan 2025")).toBe(true);
        });
    });

    describe("edge cases around 14:30", () => {
        it("should refetch exactly at 14:30 Prague time with old data", () => {
            mockDate("2025-01-15T13:30:00.000Z"); // Wednesday 13:30 UTC = 14:30 Prague
            expect(shouldRefetchRates("14 Jan 2025")).toBe(true);
        });

        it("should not refetch exactly at 14:30 Prague time with current data", () => {
            mockDate("2025-01-15T13:30:00.000Z"); // Wednesday 13:30 UTC = 14:30 Prague
            expect(shouldRefetchRates("15 Jan 2025")).toBe(false);
        });
    });

    describe("different date formats", () => {
        it("should handle CNB date format correctly", () => {
            mockDate("2025-01-15T14:00:00.000Z"); // Wednesday 14:00 UTC = 15:00 Prague
            expect(shouldRefetchRates("15 Jan 2025")).toBe(false);
            expect(shouldRefetchRates("14 Jan 2025")).toBe(true);
        });

        it("should handle full month names", () => {
            mockDate("2025-01-15T14:00:00.000Z");
            expect(shouldRefetchRates("15 January 2025")).toBe(false);
            expect(shouldRefetchRates("14 January 2025")).toBe(true);
        });
    });
});