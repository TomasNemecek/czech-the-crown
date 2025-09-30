import { useMemo, useState } from "react";
import type { CnbDailyRates, CnbRate } from "../../lib/parseCnb";
import { CurrencyInput } from "./CurrencyInput";
import { CurrencySelect } from "./CurrencySelect";
import styled from 'styled-components';
import { SwapIcon } from "../../assets/SwapIcon";

type Props = { dailyRates: CnbDailyRates };

const CzkRate: CnbRate = {
    country: "Czech Republic",
    currency: "koruna",
    amount: 1,
    code: "CZK",
    rate: 1,
}

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
    const [fromCurrency, setFromCurrency] = useState<CnbRate>(CzkRate);
    const [toCurrency, setToCurrency] = useState<CnbRate | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [fromAmount, setFromAmount] = useState<number>(0);

    const isConversionFromCZK = (): boolean => {
        return fromCurrency.code === "CZK";
    };

    const handleInputChange = (input: string) => {
        setInputValue(input);
        const normalizedInput = input
            .replace(/\s+/g, '')
            .replace(',', '.');
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

        setToCurrency(fromCurrency)
        setFromCurrency(CzkRate);;
    };

    //TODO: combine? Memo watches the same values
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
        <ConverterLayout>
            <ConverterGrid>
                <CurrencyInputGroup>
                    <CurrencyInputLabel>Amount</CurrencyInputLabel>
                    <CurrencyInput
                        currencyCode={fromCurrency.code}
                        value={fromAmount}
                        onChange={handleInputChange}
                    />
                </CurrencyInputGroup>

                <CurrencyInputGroup>
                    <CurrencyInputLabel>From</CurrencyInputLabel>
                    <CurrencySelect
                        rates={isConversionFromCZK() ? [CzkRate] : dailyRates.rates}
                        value={fromCurrency}
                        onChange={setFromCurrency}
                        placeholder="From currency..."
                        isDisabled={isConversionFromCZK()}
                        label="From currency"
                    />
                </CurrencyInputGroup>

                <SwapButton
                    type="button"
                    onClick={handleSwapCurrency}
                    aria-label="Swap currencies"
                >
                    <SwapIcon />
                </SwapButton>

                <CurrencyInputGroup>
                    <CurrencyInputLabel>To</CurrencyInputLabel>
                    <CurrencySelect
                        rates={isConversionFromCZK() ? dailyRates.rates : [CzkRate]}
                        value={toCurrency}
                        onChange={setToCurrency}
                        placeholder="Select target currency..."
                        isDisabled={!isConversionFromCZK()}
                        label="To currency"
                    />
                </CurrencyInputGroup>
            </ConverterGrid>


            {toCurrency && convertedAmount !== null && (
                <ResultContainer>
                    <ResultEquals>{inputValue} =</ResultEquals>
                    <ResultAmount>
                        {Intl.NumberFormat('cs-CZ', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true
                        }).format(convertedAmount)
                        } {toCurrency.country} {toCurrency.currency}
                    </ResultAmount>
                    <RateInfo>
                        1 {fromCurrency.code} = {getConversionRate(fromCurrency, toCurrency)?.toFixed(3)} {toCurrency.code}<br />
                        1 {toCurrency.code} = {getConversionRate(toCurrency, fromCurrency)?.toFixed(3)} {fromCurrency.code}
                    </RateInfo>
                    <DateInfo>Last updated on {dailyRates.date} at 14.30</DateInfo>
                </ResultContainer>
            )}
        </ConverterLayout>
    );
}

const ConverterLayout = styled.div`
     background: var(--card);
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: var(--shadow);

    > div:first-child {
        display: grid;
        gap: 12px;
        align-items: end;

        /* Default mobile layout - stacked */
        grid-template-columns: 1fr;

        /* Tablet and up - side by side */
        @media (min-width: 768px) {
            grid-template-columns: minmax(150px, 1fr) minmax(200px, 1fr) auto minmax(200px, 1fr);
        }

        /* Stack swap button horizontally on mobile */
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
    background: white;
    border: 1px solid var(--border);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border-color: var(--gold);
        background: var(--goldSoft);
    }
`;

const ConverterGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto 1fr;
    gap: 12px;
    align-items: center;
`;

const ResultEquals = styled.div`
    font-size: 16px;
    margin-top: 16px;
    margin-bottom: 8px;
`;

const ResultAmount = styled.div`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
`;

const RateInfo = styled.div`
    color: var(--subtle);
    font-size: 10px;
`;

const CurrencyInputLabel = styled.label`
    font-size: 14px;
    color: var(--subtle);
    margin-bottom: 4px;
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
    font-size: 12px;
    line-height: 1.5;
    padding-top: 12px;
    text-align: right;
`;