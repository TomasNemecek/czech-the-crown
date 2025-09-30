import { NumericFormat } from "react-number-format";
import { InputNumeric } from "../../styles";

type Props = {
  currencyCode: string;
  value?: string | number;
  onChange?: (value: string) => void;
  decimalScale?: number;
  placeholder?: string;
};

export function CurrencyInput({
  currencyCode,
  value,
  onChange,
  decimalScale = 2,
  placeholder = `Amount in ${currencyCode}`,
  ...rest
}: Props) {
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
      placeholder={placeholder}
      aria-label={placeholder}
      customInput={InputNumeric}
      suffix={` ${currencyCode}`}
      onValueChange={({ formattedValue }) => onChange?.(formattedValue)}
      {...rest}
    />
  );
}
