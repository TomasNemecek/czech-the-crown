import Select, { type StylesConfig } from "react-select";
import type { CnbRate } from "@/types/CnbDailyRates";
import { sanitizeInput } from "@/util/utils";

type Props = {
  label: string;
  rates: CnbRate[];
  value: CnbRate | null;
  placeholder?: string;
  isDisabled?: boolean;
  "aria-label"?: string;
  onChange: (rate: CnbRate) => void;
};

type Option = {
  label: string;
  value: CnbRate;
};

function formatCurrencyLabel(rate: CnbRate): string {
  return `${rate.code} | ${rate.country} ${rate.currency}`;
}

const selectStyles: StylesConfig<Option> = {
  control: (base) => ({
    ...base,
    width: "100%",
    borderColor: "var(--border)",
    borderRadius: "10px",
    transition: "none",
    "&:hover": {
      borderColor: "var(--gold)",
    },
  }),
  container: (base) => ({
    ...base,
    width: "100%",
    transition: "none",
  }),
};

export function CurrencySelect({
  label,
  rates,
  value,
  placeholder = "Select currency...",
  isDisabled = false,
  "aria-label": ariaLabel,
  onChange,
}: Props) {
  const options: Option[] = rates.map((rate) => ({
    label: formatCurrencyLabel(rate),
    value: rate,
  }));

  const handleInputChange = (inputValue: string) => {
    return sanitizeInput(inputValue, 50);
  };

  const selectedOption = value
    ? {
      label: formatCurrencyLabel(value),
      value,
    }
    : null;

  return (
    <Select<Option>
      options={options}
      value={selectedOption}
      placeholder={placeholder}
      isDisabled={isDisabled}
      styles={selectStyles}
      aria-label={ariaLabel ?? label}
      inputId={`currency-select-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onChange={(option) => option && onChange(option.value)}
      onInputChange={handleInputChange}
    />
  );
}
