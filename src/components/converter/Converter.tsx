import { useMemo, useState } from "react";
import type { CnbRate } from "../../lib/parseCnb";
import { Card } from "../../styles";
import { CurrencyInput } from "./CurrencyInput";
import { CurrencySelect } from "./CurrencySelect";
import styled from 'styled-components';
import { SwapIcon } from "../../assets/SwapIcon";

type Props = { rates: CnbRate[] };

const CzkRate: CnbRate = {
    country: "Czech Republic",
    currency: "koruna",
    amount: 1,
    code: "CZK",
    rate: 1,
}

export function Converter({ rates }: Props) {
    const [fromCurrency, setFromCurrency] = useState<CnbRate>(CzkRate);
    const [toCurrency, setToCurrency] = useState<CnbRate | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [fromAmount, setFromAmount] = useState<number>(0);

    const conversionRate = useMemo(() => {
        if (!toCurrency) return null;
        return 1 / (toCurrency.rate / toCurrency.amount);
    }, [toCurrency]);

    const convertedAmount = useMemo(() => {
        if (!conversionRate) return null;
        return fromAmount * conversionRate;
    }, [fromAmount, conversionRate]);

    const handleInputChange = (input: string) => {
        setInputValue(input);
        const normalizedInput = input
            .replace(/\s+/g, '')
            .replace(',', '.');
        const parsed = parseFloat(normalizedInput);
        setFromAmount(isNaN(parsed) ? 0 : parsed);
    };

    return (
        <Card>
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
                        rates={[fromCurrency]}
                        value={fromCurrency}
                        onChange={() => { }}
                        placeholder="From currency..."
                        isDisabled
                    />
                </CurrencyInputGroup>

                <SwapButton
                    type="button"
                    onClick={() => { }}
                    aria-label="Swap currencies"
                >
                    <SwapIcon />
                </SwapButton>

                <CurrencyInputGroup>
                    <CurrencyInputLabel>To</CurrencyInputLabel>
                    <CurrencySelect
                        rates={rates}
                        value={toCurrency}
                        onChange={setToCurrency}
                        placeholder="Select target currency..."
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
                        } {toCurrency.code}
                    </ResultAmount>
                    <RateInfo>
                        1 {CzkRate.code} = {conversionRate?.toFixed(3)} {toCurrency.code}<br />
                        1 {toCurrency.code} = {(toCurrency.rate / toCurrency.amount).toFixed(3)} {CzkRate.code}
                    </RateInfo>
                </ResultContainer>
            )}
        </Card>
    );
}


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

const ResultContainer = styled.div`
    margin-top: 20px;
    text-align: ;
`;

const ResultEquals = styled.div`
    font-size: 16px;
    margin-top: 24px;
    margin-bottom: 8px;
`;

const ResultAmount = styled.div`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 8px;
`;

const RateInfo = styled.div`
    color: var(--subtle);
    font-size: 8px;
    line-height: 1.5;
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
