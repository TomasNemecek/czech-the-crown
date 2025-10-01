import { NumericFormat } from "react-number-format";
import styled from "styled-components";

type Props = {
  currencyCode: string;
  value?: string | number;
  decimalScale?: number;
  placeholder?: string;
  "aria-label"?: string;
  onChange?: (value: string) => void;
};

export function CurrencyInput({
  currencyCode,
  value = 0,
  decimalScale = 2,
  placeholder,
  "aria-label": ariaLabel,
  onChange,
}: Props) {
  const defaultPlaceholder = `Amount in ${currencyCode}`;
  const defaultAriaLabel = `Enter amount in ${currencyCode}`;

  return (
    <NumericFormat
      value={value}
      thousandSeparator=" "
      decimalSeparator=","
      allowedDecimalSeparators={[",", "."]}
      decimalScale={decimalScale}
      allowNegative={false}
      allowLeadingZeros={false}
      inputMode="decimal"
      placeholder={placeholder ?? defaultPlaceholder}
      aria-label={ariaLabel ?? defaultAriaLabel}
      customInput={InputNumeric}
      suffix={` ${currencyCode}`}
      onValueChange={({ formattedValue }) => onChange?.(formattedValue)}
    />
  );
}

const InputNumeric = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.25);
    outline: none;
  }
`;