import { useMemo, useState, useCallback } from "react";
import type { CnbRate } from "@/types/CnbDailyRates";
import { Card, List, ButtonGhost, Heading3 } from "@/styles";
import { RateRow } from "@/components/ratesList/RateRow";
import { SearchInput } from "@/components/ratesList/SearchInput";

type Props = {
  rates: CnbRate[];
};

const DEFAULT_VISIBLE_ROWS_COUNT = 25;

export function RateList({ rates }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRowsCount, setVisibleCount] = useState(
    DEFAULT_VISIBLE_ROWS_COUNT,
  );

  const onSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(DEFAULT_VISIBLE_ROWS_COUNT);
  }, []);

  const filteredRates = useMemo(() => {
    const query = normalizeText(searchQuery);

    if (!query) return rates;

    const filteredRatesList = rates.filter((rate) => {
      const code = rate.code.toLowerCase();
      const currency = normalizeText(rate.currency);
      const country = normalizeText(rate.country);
      return (
        code.includes(query) ||
        currency.includes(query) ||
        country.includes(query)
      );
    });
    return filteredRatesList;
  }, [rates, searchQuery]);

  const visibleRates = filteredRates.slice(0, visibleRowsCount);
  const hasMoreRowsToShow = filteredRates.length > visibleRowsCount;

  return (
    <Card>
      <Heading3>Exchange Rate</Heading3>

      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        aria-label="Filter rates"
      />

      <List>
        {visibleRates.map((rate) => (
          <RateRow key={rate.code} rate={rate} />
        ))}
      </List>

      {hasMoreRowsToShow && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <ButtonGhost onClick={() => setVisibleCount(filteredRates.length)}>
            Show all {filteredRates.length}
          </ButtonGhost>
        </div>
      )}

      {!!filteredRates.length || (
        <p style={{ textAlign: "center" }}>No matches found.</p>
      )}
    </Card>
  );
}

function normalizeText(input: string): string {
  return input.toLowerCase().trim();
}
