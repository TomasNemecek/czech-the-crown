import type { CnbRate } from "@/types/CnbDailyRates";
import {
  Row,
  RowLeft,
  CountryCodeBadge,
  CurrencyText,
  Figure,
  Subtext,
} from "@/styles";

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
