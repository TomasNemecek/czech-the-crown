import { useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import type { CnbRate } from "@/types/CnbDailyRates";
import { Card } from "@/styles";
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
    <Card role="region" aria-labelledby="rates-heading">
      <Heading3 id="rates-heading">Exchange Rates</Heading3>

      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        aria-label="Search currencies by code, name, or country"
      />

      <List role="list" aria-label="Currency exchange rates">
        {visibleRates.map((rate) => (
          <RateRow key={rate.code} rate={rate} />
        ))}
      </List>

      {hasMoreRowsToShow && (
        <div style={{ marginTop: 10, textAlign: "center" }}>
          <ButtonGhost
            onClick={() => setVisibleCount(filteredRates.length)}
            aria-label={`Show all ${filteredRates.length} exchange rates`}
          >
            Show all {filteredRates.length}
          </ButtonGhost>
        </div>
      )}

      {!!filteredRates.length || (
        <p style={{ textAlign: "center" }} role="status" aria-live="polite">
          No matches found.
        </p>
      )}
    </Card>
  );
}

function normalizeText(input: string): string {
  return input.toLowerCase().trim();
}

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const Heading3 = styled.h3`
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-lg);
  font-weight: bold;
`;

const ButtonGhost = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  transition: transform var(--transition-fast);
  
  &:hover {
    transform: translateY(-1px);
  }
`;
