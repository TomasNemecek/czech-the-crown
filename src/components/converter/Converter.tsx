import { useMemo, useState } from "react";
import type { CnbDailyRates, CnbRate } from "@/types/CnbDailyRates";
import { CurrencyInput } from "@/components/converter/CurrencyInput";
import { CurrencySelect } from "@/components/converter/CurrencySelect";
import { SwapIcon } from "@/components/SwapIcon";
import styled from "styled-components";

type Props = {
  dailyRates: CnbDailyRates;
};

const CzkRate: CnbRate = {
  country: "Czech Republic",
  currency: "koruna",
  amount: 1,
  code: "CZK",
  rate: 1,
};

function getConversionRate(from: CnbRate, to: CnbRate): number {
  if (from.code === "CZK") {
    const ratePerUnit = to.rate / to.amount;
    return 1 / ratePerUnit;
  } else {
    const ratePerUnit = from.rate / from.amount;
    return ratePerUnit;
  }
}

export function Converter({ dailyRates }: Props) {
  const [fromCurrency, setFromCurrency] = useState(CzkRate);
  const [toCurrency, setToCurrency] = useState<CnbRate | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [fromAmount, setFromAmount] = useState(0);

  const isConversionFromCZK = (): boolean => {
    return fromCurrency.code === "CZK";
  };

  const handleInputChange = (input: string) => {
    setInputValue(input);
    const normalizedInput = input.replace(/\s+/g, "").replace(",", ".");
    const parsed = parseFloat(normalizedInput);
    setFromAmount(isNaN(parsed) ? 0 : parsed);
  };

  const handleSwapCurrency = () => {
    if (!toCurrency) return;

    //Swap CZK to target currency
    if (isConversionFromCZK()) {
      setFromCurrency(toCurrency);
      setToCurrency(CzkRate);
      return;
    }

    setToCurrency(fromCurrency);
    setFromCurrency(CzkRate);
  };

  const conversionRate = useMemo(() => {
    if (!fromAmount) return null;
    if (!fromCurrency || !toCurrency) return null;

    return getConversionRate(fromCurrency, toCurrency);
  }, [fromAmount, toCurrency, fromCurrency]);

  const convertedAmount = useMemo(() => {
    if (!conversionRate) return null;
    return fromAmount * conversionRate;
  }, [fromAmount, conversionRate]);

  return (
    <ConverterLayout role="region" aria-labelledby="converter-heading">
      <ConverterGrid>
        <CurrencyInputGroup>
          <ConverterFieldLabel id="amount-label">Amount</ConverterFieldLabel>
          <CurrencyInput
            currencyCode={fromCurrency.code}
            value={fromAmount}
            onChange={handleInputChange}
            aria-label={`Enter amount to convert from ${fromCurrency.code}`}
          />
        </CurrencyInputGroup>

        <CurrencyInputGroup>
          <ConverterFieldLabel id="from-label">From</ConverterFieldLabel>
          <CurrencySelect
            label="From currency"
            rates={isConversionFromCZK() ? [CzkRate] : dailyRates.rates}
            value={fromCurrency}
            placeholder="From currency..."
            isDisabled={isConversionFromCZK()}
            aria-label="Select source currency"
            onChange={setFromCurrency}
          />
        </CurrencyInputGroup>

        <SwapButton
          type="button"
          onClick={handleSwapCurrency}
          aria-label="Swap source and target currencies"
        >
          <SwapIcon aria-hidden="true" />
        </SwapButton>

        <CurrencyInputGroup>
          <ConverterFieldLabel id="to-label">To</ConverterFieldLabel>
          <CurrencySelect
            label="To currency"
            rates={isConversionFromCZK() ? dailyRates.rates : [CzkRate]}
            value={toCurrency}
            placeholder="Select target currency..."
            isDisabled={!isConversionFromCZK()}
            aria-label="Select target currency"
            onChange={setToCurrency}
          />
        </CurrencyInputGroup>
      </ConverterGrid>

      {toCurrency && convertedAmount !== null && (
        <ResultContainer role="region" aria-label="Conversion result">
          <ResultEquals>{inputValue} =</ResultEquals>
          <ResultAmount>
            {Intl.NumberFormat("cs-CZ", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            }).format(convertedAmount)}{" "}
            {toCurrency.country} {toCurrency.currency}
          </ResultAmount>

          <RateInfo aria-label="Exchange rate information">
            1 {fromCurrency.code} ={" "}
            {getConversionRate(fromCurrency, toCurrency)?.toLocaleString(
              "cs-CZ",
              {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
                useGrouping: true,
              },
            )}{" "}
            {toCurrency.code}
            <br />1 {toCurrency.code} ={" "}
            {getConversionRate(toCurrency, fromCurrency)?.toLocaleString(
              "cs-CZ",
              {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
                useGrouping: true,
              },
            )}{" "}
            {fromCurrency.code}
          </RateInfo>
          <DateInfo>Last updated on {dailyRates.date} at 14.30</DateInfo>
        </ResultContainer>
      )}
    </ConverterLayout>
  );
}

const ConverterLayout = styled.div`
  background: var(--card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);

  > div:first-child {
    display: grid;
    gap: var(--spacing-md);
    align-items: end;

    grid-template-columns: 1fr;

    @media (min-width: 768px) {
      grid-template-columns: minmax(150px, 1fr) minmax(200px, 1fr) auto minmax(
          200px,
          1fr
        );
    }

    > button {
      justify-self: center;
      transform: rotate(90deg);

      @media (min-width: 768px) {
        transform: none;
      }
    }
  }
`;

const SwapButton = styled.button`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  width: var(--spacing-buttonSize);
  height: var(--spacing-buttonSize);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    border-color: var(--gold);
    background: var(--goldSoft);
  }
`;

const ConverterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto 1fr;
  gap: var(--spacing-md);
  align-items: center;
`;

const ResultEquals = styled.div`
  font-size: var(--font-lg);
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
`;

const ResultAmount = styled.div`
  font-size: var(--font-xxxl);
  font-weight: bold;
  margin-bottom: var(--spacing-sm);
`;

const RateInfo = styled.div`
  color: var(--subtle);
  font-size: var(--font-xs);
`;

const ConverterFieldLabel = styled.label`
  font-size: var(--font-md);
  color: var(--subtle);
  margin-bottom: var(--spacing-xs);
`;

const CurrencyInputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResultContainer = styled.div`
  text-align: left;
`;

const DateInfo = styled.div`
  color: var(--subtle);
  font-size: var(--font-sm);
  line-height: var(--line-height-relaxed);
  padding-top: var(--spacing-md);
  text-align: right;
`;
