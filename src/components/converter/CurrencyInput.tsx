import { NumericFormat } from "react-number-format";
import { InputNumeric } from "@/styles";

type Props = {
  currencyCode: string;
  value?: string | number;
  decimalScale?: number;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function CurrencyInput({
  currencyCode,
  value = 0,
  decimalScale = 2,
  placeholder, 
  onChange,
}: Props) {
  const defaultPlaceholder = `Amount in ${currencyCode}`;

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
      aria-label={placeholder ?? defaultPlaceholder}
      customInput={InputNumeric}
      suffix={` ${currencyCode}`}
      onValueChange={({ formattedValue }) => onChange?.(formattedValue)}
    />
  );
}
