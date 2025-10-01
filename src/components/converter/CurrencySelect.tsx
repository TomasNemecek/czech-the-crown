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
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "var(--gold)" : "var(--border)",
    borderRadius: "var(--radius-md)",
    boxShadow: state.isFocused ? "var(--shadow-focus)" : "none",
    "&:hover": {
      borderColor: "var(--gold)",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    "& input": {
      outline: "none",
      boxShadow: "none",
    },
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
      inputId={`currency-select-${label.toLowerCase().replace(/\s+/g, "-")}`}
      onChange={(option) => option && onChange(option.value)}
      onInputChange={handleInputChange}
    />
  );
}
