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
  const formattedRate = czkPerOne.toLocaleString(undefined, { maximumFractionDigits: 3 });

  return (
    <Row
      role="listitem"
      aria-label={`${rate.code}: ${formattedRate} CZK per 1 ${rate.code}. ${rate.country} ${rate.currency}`}
    >
      <RowLeft>
        <CountryCodeBadge aria-hidden="true">{rate.code}</CountryCodeBadge>
        <CurrencyText>
          {rate.country} | {rate.currency}
        </CurrencyText>
      </RowLeft>
      <div>
        <Figure>
          {formattedRate} CZK
        </Figure>
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
  gap: 10px;
  padding: 10px 8px;
  border-bottom: 1px solid var(--border);

  &:hover {
    background: var(--goldSoft);
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
`;

const CountryCodeBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.35px;
  color: var(--text);
  background: linear-gradient(180deg, #fffdf3 0%, #fff4cf 100%);
  border: 1px solid rgba(212, 175, 55, 0.45);
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(255, 255, 255, 0.55);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.06s ease;
`;

const CurrencyText = styled.span`
  color: var(--subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13.5px;
`;

const Figure = styled.div`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: right;
  font-size: 14px;
`;

const Subtext = styled.div`
  color: var(--subtle);
  font-size: 12px;
  text-align: right;
`;
