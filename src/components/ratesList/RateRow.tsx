import type { CnbRate } from "@/types/CnbDailyRates";
import styled from "styled-components";

type Props = {
  rate: CnbRate;
};

// TODO: Add country adjectives and flags (e.g. US Dollar, Japanese Yen)
// TODO: Align columns in row with design of converter selection
// TODO: align decimal points in rates

export function RateRow({ rate }: Props) {
  const czkPerOne = perUnit(rate);
  const formattedRate = czkPerOne.toLocaleString("cs-CZ", {
    maximumFractionDigits: 3,
    useGrouping: true,
  });

  return (
    <Row
      role="listitem"
      aria-label={`${rate.code}: ${formattedRate} CZK per 1 ${rate.code}. ${rate.country} ${rate.currency}`}
    >
      <RowLeft>
        <CountryCodeBadge aria-hidden="true">{rate.code}</CountryCodeBadge>
        <CurrencyText>
          {rate.country} {rate.currency}
        </CurrencyText>
      </RowLeft>
      <div>
        <Figure>{formattedRate} CZK</Figure>
        <Subtext>per 1 {rate.code}</Subtext>
      </div>
    </Row>
  );
}

function perUnit(rate: CnbRate) {
  return rate.rate / rate.amount;
}

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-sm);
  border-bottom: 1px solid var(--border);

  &:hover {
    background: var(--goldSoft);
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  min-width: 0;
`;

const CountryCodeBadge = styled.span`
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--spacing-lg);
  font-size: var(--font-sm);
  font-weight: 600;
  letter-spacing: var(--letter-spacing-normal);
  color: var(--text);
  background: linear-gradient(180deg, #fffdf3 0%, #fff4cf 100%);
  border: 1px solid rgba(212, 175, 55, 0.45);
  box-shadow: var(--shadow-sm);
  transition:
    background var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal),
    transform var(--transition-fast);
`;

const CurrencyText = styled.span`
  color: var(--subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-base);
`;

const Figure = styled.div`
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  text-align: right;
  font-size: var(--font-md);
`;

const Subtext = styled.div`
  color: var(--subtle);
  font-size: var(--font-sm);
  text-align: right;
`;
