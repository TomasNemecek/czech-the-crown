import type { CnbRate } from "@/lib/parseCnb";
import {
  Row,
  RowLeft,
  CountryCodeBadge,
  CurrencyText,
  Figure,
  Subtext,
} from "@/styles";

// TODO: Add country adjectives and flags (e.g. US Dollar, Japanese Yen)
// TODO: Align columns in row with design of converter selection
// TODO: align decimal points in rates

export function RateRow({ rate }: { rate: CnbRate }) {
  const czkPerOne = perUnit(rate);

  return (
    <Row aria-label={`${rate.code} row`}>
      <RowLeft>
        <CountryCodeBadge>{rate.code}</CountryCodeBadge>
        <CurrencyText>
          {rate.country} | {rate.currency}
        </CurrencyText>
      </RowLeft>
      <div>
        <Figure>
          {czkPerOne.toLocaleString(undefined, { maximumFractionDigits: 3 })}{" "}
          CZK
        </Figure>
        <Subtext>per 1 {rate.code}</Subtext>
      </div>
    </Row>
  );
}

function perUnit(rate: CnbRate) {
  return rate.rate / rate.amount;
}
